import { getDb, initializeDatabase } from './index';
import {
  AccountInfo,
  Position,
  ClosedTrade,
  TraderMemoryProfile,
  ExecutionFairnessAudit,
  RetentionOffer,
  PlatformType,
} from '@/types';
import crypto from 'crypto';

export interface FleetAccountRow {
  id: string;
  name: string;
  accountNumber: string;
  platform: PlatformType;
  equity: number;
  balance: number;
  dailyDdPct: number;
  tiltScore: number;
  status: string;
  archetype: string;
  offerStatus: string;
  revenueRecaptured: string;
  coupon: string;
  discount: string;
  updatedAt: string;
}

let dbReady = false;
let isSeeding = false;

export async function ensureDbReady(): Promise<void> {
  if (dbReady) return;
  await initializeDatabase();
  dbReady = true;

  if (!isSeeding) {
    isSeeding = true;
    try {
      const db = getDb();
      const check = await db.execute('SELECT COUNT(*) as count FROM accounts');
      const count = Number(check.rows[0]?.count ?? 0);
      if (count === 0) {
        await seedDemoAccounts();
      }
    } finally {
      isSeeding = false;
    }
  }
}

/**
 * Upserts a trader and their account, positions, and trades into the database.
 * Also dynamically computes and updates the trader's long-term behavioral memory!
 */
export async function persistBrokerEvent(
  accountData: AccountInfo,
  openPositions: Position[],
  closedTrades: ClosedTrade[]
): Promise<{ accountId: string; traderId: string }> {
  await ensureDbReady();
  const db = getDb();
  const now = new Date().toISOString();

  const traderEmail = accountData.email || `trader.${accountData.accountNumber}@propfirm.io`;
  const traderName = accountData.traderName || `Trader #${accountData.accountNumber}`;
  const preferredName = traderName.split(' ')[0] || 'Trader';
  const traderId = `trader-${accountData.accountNumber}`;

  // 1. Upsert Trader
  await db.execute({
    sql: `
      INSERT INTO traders (id, firm_id, email, name, preferred_name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        email = excluded.email,
        updated_at = excluded.updated_at
    `,
    args: [
      traderId,
      accountData.firmName || 'DefaultFirm',
      traderEmail,
      traderName,
      preferredName,
      now,
      now,
    ],
  });

  // 2. Upsert Account
  const accountId = `acc-${accountData.accountNumber}`;
  await db.execute({
    sql: `
      INSERT INTO accounts (
        id, trader_id, firm_name, account_number, platform, server_name,
        plan_size, starting_balance, current_balance, current_equity,
        daily_starting_balance, daily_loss_limit_pct, max_loss_limit_pct,
        profit_target_pct, status, breach_reason, breached_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(account_number) DO UPDATE SET
        current_balance = excluded.current_balance,
        current_equity = excluded.current_equity,
        status = excluded.status,
        breach_reason = excluded.breach_reason,
        breached_at = excluded.breached_at,
        updated_at = excluded.updated_at
    `,
    args: [
      accountId,
      traderId,
      accountData.firmName,
      accountData.accountNumber,
      accountData.platform,
      accountData.serverName,
      accountData.planSize,
      accountData.startingBalance,
      accountData.currentBalance,
      accountData.currentEquity,
      accountData.dailyStartingBalance,
      accountData.dailyLossLimitPct,
      accountData.maxLossLimitPct,
      accountData.profitTargetPct,
      accountData.status,
      accountData.breachReason || null,
      accountData.breachedAt || null,
      now,
      now,
    ],
  });

  // 3. Sync Open Positions (Delete old positions for this account and re-insert)
  await db.execute({
    sql: 'DELETE FROM positions WHERE account_id = ?',
    args: [accountId],
  });

  for (const pos of openPositions) {
    await db.execute({
      sql: `
        INSERT INTO positions (
          id, account_id, symbol, side, lots, open_price, current_price,
          sl, tp, floating_pnl, open_time, implied_risk_usd
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        pos.id,
        accountId,
        pos.symbol,
        pos.side,
        pos.lots,
        pos.openPrice,
        pos.currentPrice,
        pos.sl ?? null,
        pos.tp ?? null,
        pos.floatingPnl,
        pos.openTime,
        pos.impliedRiskUsd,
      ],
    });
  }

  // 4. Upsert Closed Trades
  for (const trade of closedTrades) {
    await db.execute({
      sql: `
        INSERT INTO trades (
          id, account_id, symbol, side, lots, open_price, close_price,
          pnl, open_time, close_time, duration_minutes, spread_pips,
          market_mid_price, fill_slippage_pips, flags
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          close_price = excluded.close_price,
          pnl = excluded.pnl,
          close_time = excluded.close_time,
          flags = excluded.flags
      `,
      args: [
        trade.id,
        accountId,
        trade.symbol,
        trade.side,
        trade.lots,
        trade.openPrice,
        trade.closePrice,
        trade.pnl,
        trade.openTime,
        trade.closeTime,
        trade.durationMinutes,
        trade.spreadAtClosePips,
        trade.marketMidPriceAtClose,
        trade.fillSlippagePips,
        trade.flags ? JSON.stringify(trade.flags) : null,
      ],
    });
  }

  // 5. Update Dynamic Long-Term Trader Memory from Real History
  await updateTraderMemoryFromHistory(traderId, preferredName, closedTrades, openPositions);

  return { accountId, traderId };
}

/**
 * Calculates and saves true evolving memory for the trader based on their accumulated database trades.
 */
async function updateTraderMemoryFromHistory(
  traderId: string,
  preferredName: string,
  currentBatchTrades: ClosedTrade[],
  openPositions: Position[]
): Promise<void> {
  const db = getDb();
  const now = new Date().toISOString();

  // Fetch all historic trades for this trader across all accounts
  const tradeHistory = await db.execute({
    sql: `
      SELECT t.symbol, t.lots, t.pnl, t.duration_minutes, t.flags, t.close_time
      FROM trades t
      JOIN accounts a ON t.account_id = a.id
      WHERE a.trader_id = ?
      ORDER BY t.close_time ASC
    `,
    args: [traderId],
  });

  const totalTrades = tradeHistory.rows.length;
  const symbolCounts: Record<string, number> = {};
  const lotSizes: number[] = [];
  let revengeInstances = 0;

  for (const r of tradeHistory.rows) {
    const sym = String(r.symbol);
    symbolCounts[sym] = (symbolCounts[sym] || 0) + 1;
    lotSizes.push(Number(r.lots));
    const flagsStr = String(r.flags || '[]');
    if (flagsStr.includes('FAST_REENTRY') || flagsStr.includes('LOT_ESCALATION')) {
      revengeInstances++;
    }
  }

  // Determine favorite pairs sorted by frequency
  const favoritePairs = Object.entries(symbolCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([s]) => s)
    .slice(0, 3);
  if (favoritePairs.length === 0) favoritePairs.push('XAUUSD', 'EURUSD');

  // Compute median lot size
  const sortedLots = [...lotSizes].sort((a, b) => a - b);
  const usualLotSize =
    sortedLots.length > 0 ? sortedLots[Math.floor(sortedLots.length / 2)] : 1.0;

  // Retrieve existing memory
  const existingMem = await db.execute({
    sql: 'SELECT * FROM trader_memories WHERE trader_id = ?',
    args: [traderId],
  });

  let challengesAttempted = 1;
  let buddyNotebook: string[] = [];
  let pastIncidents: Array<{ challengeNumber: number; date: string; whatHappened: string }> = [];

  if (existingMem.rows.length > 0) {
    const row = existingMem.rows[0];
    challengesAttempted = Number(row.challenges_attempted ?? 1);
    try {
      buddyNotebook = JSON.parse(String(row.buddy_notebook || '[]'));
      pastIncidents = JSON.parse(String(row.past_incidents || '[]'));
    } catch {
      // fallback to empty arrays
    }
  }

  // If a new sizing anomaly happened in current batch, add an entry to the Buddy's private notebook
  const activeOversized = openPositions.find((p) => p.lots >= usualLotSize * 2.5);
  if (activeOversized) {
    const note = `Session ${new Date().toLocaleDateString()}: ${preferredName} scaled to ${activeOversized.lots}L on ${activeOversized.symbol} (${(activeOversized.lots / usualLotSize).toFixed(1)}x median). Gentle suggestion sent.`;
    if (!buddyNotebook.some((n) => n.includes(activeOversized.symbol) && n.includes(`${activeOversized.lots}L`))) {
      buddyNotebook.unshift(note);
      if (buddyNotebook.length > 8) buddyNotebook.pop();
    }
  }

  const knownStrengths = [
    `Strong technical execution on ${favoritePairs[0] || 'core setups'}`,
    `Consistent disciplined rhythm when lot size stays near ${usualLotSize}L`,
  ];

  const knownKryptonite: string[] = [];
  if (revengeInstances > 0 || activeOversized) {
    knownKryptonite.push(
      `Impulse sizing escalation after consecutive red candles on ${favoritePairs[0] || 'high-vol pairs'}`
    );
  }
  if (knownKryptonite.length === 0) {
    knownKryptonite.push('Finish-line eagerness when approaching target threshold');
  }

  await db.execute({
    sql: `
      INSERT INTO trader_memories (
        id, trader_id, challenges_attempted, months_with_firm, favorite_pairs,
        usual_session_time, usual_lot_size, known_strengths, known_kryptonite,
        past_incidents, buddy_notebook, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(trader_id) DO UPDATE SET
        challenges_attempted = excluded.challenges_attempted,
        favorite_pairs = excluded.favorite_pairs,
        usual_lot_size = excluded.usual_lot_size,
        known_strengths = excluded.known_strengths,
        known_kryptonite = excluded.known_kryptonite,
        past_incidents = excluded.past_incidents,
        buddy_notebook = excluded.buddy_notebook,
        updated_at = excluded.updated_at
    `,
    args: [
      `mem-${traderId}`,
      traderId,
      challengesAttempted,
      Math.max(1, challengesAttempted),
      JSON.stringify(favoritePairs),
      'New York / London Overlap (13:00 - 16:30 UTC)',
      usualLotSize,
      JSON.stringify(knownStrengths),
      JSON.stringify(knownKryptonite),
      JSON.stringify(pastIncidents),
      JSON.stringify(buddyNotebook),
      now,
    ],
  });
}

/**
 * Retrieves an account with all open positions, closed trades, and memory profile.
 */
export async function getAccountByNumber(accountNumber: string): Promise<{
  account: AccountInfo;
  openPositions: Position[];
  closedTrades: ClosedTrade[];
  memory?: TraderMemoryProfile;
} | null> {
  await ensureDbReady();
  const db = getDb();

  const accRes = await db.execute({
    sql: `
      SELECT a.*, t.name as trader_name, t.email as trader_email, t.preferred_name
      FROM accounts a
      JOIN traders t ON a.trader_id = t.id
      WHERE a.account_number = ?
    `,
    args: [accountNumber],
  });

  if (accRes.rows.length === 0) return null;
  const a = accRes.rows[0];

  const positionsRes = await db.execute({
    sql: 'SELECT * FROM positions WHERE account_id = ? ORDER BY open_time DESC',
    args: [String(a.id)],
  });

  const tradesRes = await db.execute({
    sql: 'SELECT * FROM trades WHERE account_id = ? ORDER BY close_time ASC',
    args: [String(a.id)],
  });

  const memRes = await db.execute({
    sql: 'SELECT * FROM trader_memories WHERE trader_id = ?',
    args: [String(a.trader_id)],
  });

  let memory: TraderMemoryProfile | undefined = undefined;
  if (memRes.rows.length > 0) {
    const m = memRes.rows[0];
    try {
      memory = {
        traderId: String(m.trader_id),
        preferredName: String(a.preferred_name || 'Trader'),
        challengesAttempted: Number(m.challenges_attempted),
        monthsWithFirm: Number(m.months_with_firm),
        favoritePairs: JSON.parse(String(m.favorite_pairs)),
        usualSessionTime: String(m.usual_session_time),
        usualLotSize: Number(m.usual_lot_size),
        knownStrengths: JSON.parse(String(m.known_strengths)),
        knownKryptonite: JSON.parse(String(m.known_kryptonite)),
        pastIncidents: JSON.parse(String(m.past_incidents)),
        buddyNotebook: JSON.parse(String(m.buddy_notebook)),
      };
    } catch {
      // fallback
    }
  }

  const account: AccountInfo = {
    id: String(a.id),
    traderName: String(a.trader_name),
    email: String(a.trader_email),
    accountNumber: String(a.account_number),
    firmName: String(a.firm_name),
    planSize: Number(a.plan_size),
    startingBalance: Number(a.starting_balance),
    currentBalance: Number(a.current_balance),
    currentEquity: Number(a.current_equity),
    dailyStartingBalance: Number(a.daily_starting_balance),
    dailyLossLimitPct: Number(a.daily_loss_limit_pct),
    maxLossLimitPct: Number(a.max_loss_limit_pct),
    profitTargetPct: Number(a.profit_target_pct),
    status: a.status as any,
    breachReason: (a.breach_reason as any) || undefined,
    breachedAt: (a.breached_at as any) || undefined,
    platform: a.platform as any,
    serverName: String(a.server_name),
    memory,
  };

  const openPositions: Position[] = positionsRes.rows.map((p) => {
    const dailyLimit = (account.dailyLossLimitPct / 100) * account.dailyStartingBalance;
    const dailyLoss = Math.max(0, account.dailyStartingBalance - account.currentEquity);
    const rem = Math.max(1, dailyLimit - dailyLoss);
    const implied = Number(p.implied_risk_usd);

    return {
      id: String(p.id),
      symbol: String(p.symbol),
      side: p.side as any,
      lots: Number(p.lots),
      openPrice: Number(p.open_price),
      currentPrice: Number(p.current_price),
      sl: p.sl !== null ? Number(p.sl) : undefined,
      tp: p.tp !== null ? Number(p.tp) : undefined,
      floatingPnl: Number(p.floating_pnl),
      openTime: String(p.open_time),
      impliedRiskUsd: implied,
      impliedRiskPctOfDailyBuffer: Number(((implied / rem) * 100).toFixed(1)),
    };
  });

  const closedTrades: ClosedTrade[] = tradesRes.rows.map((t) => {
    let flags: string[] | undefined = undefined;
    if (t.flags) {
      try {
        flags = JSON.parse(String(t.flags));
      } catch {
        flags = undefined;
      }
    }
    return {
      id: String(t.id),
      symbol: String(t.symbol),
      side: t.side as any,
      lots: Number(t.lots),
      openPrice: Number(t.open_price),
      closePrice: Number(t.close_price),
      pnl: Number(t.pnl),
      openTime: String(t.open_time),
      closeTime: String(t.close_time),
      durationMinutes: Number(t.duration_minutes),
      spreadAtClosePips: Number(t.spread_pips),
      marketMidPriceAtClose: Number(t.market_mid_price),
      fillSlippagePips: Number(t.fill_slippage_pips),
      flags,
    };
  });

  return { account, openPositions, closedTrades, memory };
}

/**
 * Returns all fleet accounts with calculated tilt and recovery statuses for the B2B Command Center.
 */
export async function getFleetAccounts(): Promise<FleetAccountRow[]> {
  await ensureDbReady();
  const db = getDb();

  const res = await db.execute(`
    SELECT
      a.id,
      t.name,
      a.account_number,
      a.platform,
      a.current_balance,
      a.current_equity,
      a.daily_starting_balance,
      a.daily_loss_limit_pct,
      a.status,
      a.updated_at,
      r.status as offer_status,
      r.coupon_code,
      r.discount_pct,
      r.discounted_price_usd
    FROM accounts a
    JOIN traders t ON a.trader_id = t.id
    LEFT JOIN retention_offers r ON a.id = r.account_id
    ORDER BY
      CASE WHEN a.status = 'BREACHED' THEN 1 WHEN a.status = 'WARNING' THEN 2 ELSE 3 END,
      a.updated_at DESC
  `);

  return res.rows.map((r) => {
    const dailyLimit = (Number(r.daily_loss_limit_pct) / 100) * Number(r.daily_starting_balance);
    const dailyLoss = Math.max(0, Number(r.daily_starting_balance) - Number(r.current_equity));
    const dailyDdPct = Math.min(100, Math.round((dailyLoss / Math.max(1, dailyLimit)) * 100));

    // Determine tilt score approximation from dd usage and status
    let tiltScore = 12;
    let archetype = 'Disciplined (A-Book Alpha)';
    if (r.status === 'BREACHED') {
      tiltScore = dailyDdPct >= 100 ? 88 : 72;
      archetype = Number(r.current_balance) > 100000 ? 'The 90% Finisher' : 'Tilt / Revenge Trader';
    } else if (r.status === 'WARNING') {
      tiltScore = 68;
      archetype = 'The Over-Leverager';
    }

    const offerStatusStr = r.offer_status
      ? String(r.offer_status)
      : r.status === 'BREACHED'
      ? 'OFFER DELIVERED'
      : r.status === 'WARNING'
      ? 'NUDGE ACTIVE'
      : 'VIP Scaling Sent';

    const revenueRecaptured =
      offerStatusStr === 'CONVERTED'
        ? `$${Math.round(Number(r.discounted_price_usd || 375))}`
        : r.status === 'BREACHED'
        ? 'Pending ($375)'
        : r.status === 'ACTIVE'
        ? '+$495 (Upsell)'
        : '-';

    return {
      id: String(r.id),
      name: String(r.name),
      accountNumber: String(r.account_number),
      platform: r.platform as PlatformType,
      equity: Math.round(Number(r.current_equity)),
      balance: Math.round(Number(r.current_balance)),
      dailyDdPct,
      tiltScore,
      status: String(r.status),
      archetype,
      offerStatus: offerStatusStr,
      revenueRecaptured,
      coupon: String(r.coupon_code || 'RECOVER25'),
      discount: `${Math.round(Number(r.discount_pct || 25))}% OFF`,
      updatedAt: String(r.updated_at),
    };
  });
}

/**
 * Saves a generated execution fairness audit with cryptographic HMAC verification signature.
 */
export async function persistAuditRecord(audit: ExecutionFairnessAudit, hmacSecret = 'propfirmai-master-key'): Promise<string> {
  await ensureDbReady();
  const db = getDb();
  const now = new Date().toISOString();

  // Cryptographically sign the audit using real HMAC-SHA256
  const payloadToSign = `${audit.accountNumber}:${audit.breachTimestamp}:${audit.brokerFillPrice}:${audit.fairnessScore}`;
  const hmacSignature = `hmac-sha256-${crypto.createHmac('sha256', hmacSecret).update(payloadToSign).digest('hex')}`;

  await db.execute({
    sql: `
      INSERT INTO audits (
        id, account_id, account_number, breach_rule, breach_timestamp,
        fairness_score, broker_fill_price, independent_l1_mid,
        broker_spread_pips, independent_spread_pips, spread_deviation_pips,
        verdict, verdict_summary, signature_hash, loss_attribution,
        counterfactual_sim, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        signature_hash = excluded.signature_hash
    `,
    args: [
      audit.id,
      `acc-${audit.accountNumber}`,
      audit.accountNumber,
      audit.breachRule,
      audit.breachTimestamp,
      audit.fairnessScore,
      audit.brokerFillPrice,
      audit.independentL1Mid,
      audit.brokerSpreadPips,
      audit.independentSpreadPips,
      audit.spreadDeviationPips,
      audit.verdict,
      audit.verdictSummary,
      hmacSignature,
      JSON.stringify(audit.lossAttribution),
      JSON.stringify(audit.counterfactualSim),
      now,
    ],
  });

  return hmacSignature;
}

/**
 * Saves a provisioned retention offer to the database.
 */
export async function persistRetentionOffer(
  accountNumber: string,
  offer: RetentionOffer
): Promise<void> {
  await ensureDbReady();
  const db = getDb();
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + offer.expiresInHours * 3600 * 1000).toISOString();

  await db.execute({
    sql: `
      INSERT INTO retention_offers (
        id, account_id, account_number, archetype_id, coupon_code,
        discount_pct, original_price_usd, discounted_price_usd, status,
        created_at, expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        status = excluded.status,
        discounted_price_usd = excluded.discounted_price_usd
    `,
    args: [
      `off-${accountNumber}-${offer.couponCode}`,
      `acc-${accountNumber}`,
      accountNumber,
      offer.archetypeId,
      offer.couponCode,
      offer.discountPct,
      offer.originalPriceUsd,
      offer.discountedPriceUsd,
      'PROVISIONED',
      now,
      expiresAt,
    ],
  });
}

/**
 * Logs API webhook calls to database with real timestamps and millisecond latency.
 */
export async function logApiCall(
  endpoint: string,
  status: number,
  latencyMs: number,
  platform?: string,
  accountNumber?: string,
  payloadPreview?: string
): Promise<void> {
  try {
    const db = getDb();
    await db.execute({
      sql: `
        INSERT INTO api_logs (
          id, endpoint, status, latency_ms, platform,
          account_number, payload_preview, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        endpoint,
        status,
        latencyMs,
        platform || null,
        accountNumber || null,
        payloadPreview ? payloadPreview.slice(0, 500) : null,
        new Date().toISOString(),
      ],
    });
  } catch {
    // Non-blocking logging
  }
}

/**
 * Seeds initial demo accounts (Alex Vance, Marcus Reed, Elena Rostova, David Chen) into the database.
 */
async function seedDemoAccounts(): Promise<void> {
  const { DEMO_SCENARIOS } = await import('@/engine/scenarios');
  for (const sc of DEMO_SCENARIOS) {
    await persistBrokerEvent(sc.account, sc.openPositions, sc.closedTrades);
  }
}

/**
 * Seeds 100 sample prop firm accounts into the database to demonstrate real scale.
 */
export async function seedHundredTraders(): Promise<number> {
  await ensureDbReady();
  const platforms: PlatformType[] = ['MT5', 'DXTrade', 'cTrader', 'Match-Trader', 'TradeLocker'];
  const symbols = ['XAUUSD', 'EURUSD', 'GBPUSD', 'US100', 'US500', 'BTCUSD'];
  const names = [
    'Jordan Smith', 'Taylor Hayes', 'Liam Davis', 'Sophia Kim', 'Lucas Silva',
    'Olivia Martin', 'Ethan Brown', 'Emma Wilson', 'Mason Garcia', 'Ava Miller',
    'Noah Jones', 'Isabella White', 'James Taylor', 'Mia Anderson', 'Alexander Thomas',
  ];

  let added = 0;
  for (let i = 1; i <= 100; i++) {
    const accNum = `${10000 + i}`;
    const name = `${names[i % names.length]} ${String.fromCharCode(65 + (i % 26))}.`;
    const platform = platforms[i % platforms.length];
    const planSize = 100000;
    const isBreached = i % 5 === 0;
    const isWarning = !isBreached && i % 3 === 0;

    const currentEquity = isBreached
      ? 94600 - (i % 800)
      : isWarning
      ? 97800 - (i % 600)
      : 100000 + (i % 7000);

    const account: AccountInfo = {
      id: `acc-${accNum}`,
      traderName: name,
      email: `trader.${accNum}@fundedprop.net`,
      accountNumber: accNum,
      firmName: 'PropFirm OS',
      planSize,
      startingBalance: planSize,
      currentBalance: isBreached ? 94800 : currentEquity,
      currentEquity,
      dailyStartingBalance: planSize,
      dailyLossLimitPct: 5.0,
      maxLossLimitPct: 10.0,
      profitTargetPct: 8.0,
      status: isBreached ? 'BREACHED' : isWarning ? 'WARNING' : 'ACTIVE',
      breachReason: isBreached ? 'DAILY_DRAWDOWN_BREACH' : undefined,
      breachedAt: isBreached ? new Date(Date.now() - (i % 48) * 3600000).toISOString() : undefined,
      platform,
      serverName: `${platform}-Cluster-${(i % 4) + 1}`,
    };

    const sym = symbols[i % symbols.length];
    const openPositions: Position[] = !isBreached && i % 2 === 0 ? [
      {
        id: `pos-${accNum}-1`,
        symbol: sym,
        side: i % 4 === 0 ? 'SELL' : 'BUY',
        lots: isWarning ? 4.5 : 1.2,
        openPrice: 2740 + (i % 20),
        currentPrice: 2738 + (i % 20),
        floatingPnl: isWarning ? -680 : 240,
        openTime: new Date(Date.now() - 30 * 60000).toISOString(),
        impliedRiskUsd: isWarning ? 2400 : 450,
        impliedRiskPctOfDailyBuffer: isWarning ? 62.0 : 9.0,
      }
    ] : [];

    const closedTrades: ClosedTrade[] = [
      {
        id: `trade-${accNum}-1`,
        symbol: sym,
        side: 'BUY',
        lots: 1.0,
        openPrice: 2730,
        closePrice: 2735,
        pnl: isBreached ? -4800 : 500,
        openTime: new Date(Date.now() - 120 * 60000).toISOString(),
        closeTime: new Date(Date.now() - 60 * 60000).toISOString(),
        durationMinutes: 60,
        spreadAtClosePips: 1.2,
        marketMidPriceAtClose: 2735,
        fillSlippagePips: 0.1,
      }
    ];

    await persistBrokerEvent(account, openPositions, closedTrades);
    added++;
  }

  return added;
}

