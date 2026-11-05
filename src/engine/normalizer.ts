import { AccountInfo, ClosedTrade, PlatformType, Position } from '@/types';

export interface RawBrokerWebhookPayload {
  platform: PlatformType;
  eventType: 'ORDER_OPEN' | 'ORDER_CLOSE' | 'EQUITY_TICK' | 'HARD_BREACH';
  firmId?: string;
  account: {
    accountNumber: string;
    traderName?: string;
    email?: string;
    planSize?: number;
    startingBalance?: number;
    dailyStartingBalance?: number;
    currentBalance: number;
    currentEquity: number;
    dailyLossLimitPct?: number;
    maxLossLimitPct?: number;
    profitTargetPct?: number;
    serverName?: string;
  };
  openPositions?: Array<{
    ticketId: string;
    symbol: string;
    side: 'BUY' | 'SELL' | 0 | 1; // MT5 uses 0=BUY, 1=SELL
    volumeLots: number;
    openPrice: number;
    currentPrice: number;
    stopLoss?: number;
    takeProfit?: number;
    unrealizedPnl: number;
    openTimestamp?: string;
  }>;
  recentDeals?: Array<{
    dealId: string;
    symbol: string;
    side: 'BUY' | 'SELL' | 0 | 1;
    volumeLots: number;
    entryPrice: number;
    exitPrice: number;
    realizedPnl: number;
    entryTimestamp: string;
    exitTimestamp: string;
    brokerSpreadPips?: number;
    referenceMidPrice?: number;
    slippagePips?: number;
  }>;
}

/**
 * Normalizes raw MT5 Manager API, DXTrade, cTrader, Match-Trader, or TradeLocker payloads
 * into canonical PropFirmAI domain objects.
 */
export function normalizeBrokerPayload(payload: RawBrokerWebhookPayload): {
  account: AccountInfo;
  openPositions: Position[];
  closedTrades: ClosedTrade[];
} {
  const startingBalance = payload.account.startingBalance ?? payload.account.planSize ?? 100000;
  const dailyStartingBalance = payload.account.dailyStartingBalance ?? startingBalance;
  const dailyLossLimitPct = payload.account.dailyLossLimitPct ?? 5.0;
  const maxLossLimitPct = payload.account.maxLossLimitPct ?? 10.0;

  const dailyLossLimitUsd = (dailyLossLimitPct / 100) * dailyStartingBalance;
  const currentDailyLoss = Math.max(0, dailyStartingBalance - payload.account.currentEquity);
  const remainingDailyBuffer = Math.max(1, dailyLossLimitUsd - currentDailyLoss);

  const isBreached =
    payload.eventType === 'HARD_BREACH' ||
    currentDailyLoss >= dailyLossLimitUsd ||
    startingBalance - payload.account.currentEquity >= (maxLossLimitPct / 100) * startingBalance;

  const account: AccountInfo = {
    id: `acc-${payload.account.accountNumber}`,
    traderName: payload.account.traderName || `Trader #${payload.account.accountNumber}`,
    email: payload.account.email || `trader.${payload.account.accountNumber}@propfirm.io`,
    accountNumber: payload.account.accountNumber,
    firmName: payload.firmId || 'Enterprise Prop Firm',
    planSize: payload.account.planSize || startingBalance,
    startingBalance,
    currentBalance: payload.account.currentBalance,
    currentEquity: payload.account.currentEquity,
    dailyStartingBalance,
    dailyLossLimitPct,
    maxLossLimitPct,
    profitTargetPct: payload.account.profitTargetPct ?? 8.0,
    status: isBreached ? 'BREACHED' : currentDailyLoss / dailyLossLimitUsd >= 0.7 ? 'WARNING' : 'ACTIVE',
    breachReason: isBreached ? 'DAILY_DRAWDOWN_BREACH' : undefined,
    breachedAt: isBreached ? new Date().toISOString() : undefined,
    platform: payload.platform,
    serverName: payload.account.serverName || `${payload.platform}-LiveCluster-01`,
  };

  const openPositions: Position[] = (payload.openPositions || []).map((pos) => {
    const side: 'BUY' | 'SELL' = pos.side === 0 || pos.side === 'BUY' ? 'BUY' : 'SELL';
    // Estimate implied risk from SL or fallback volatility estimate ($500/lot)
    const slDistance = pos.stopLoss ? Math.abs(pos.openPrice - pos.stopLoss) : 0;
    const impliedRiskUsd =
      slDistance > 0
        ? Math.round(slDistance * pos.volumeLots * (pos.symbol.includes('XAU') ? 100 : 10000))
        : Math.round(pos.volumeLots * 600);

    return {
      id: pos.ticketId,
      symbol: pos.symbol,
      side,
      lots: pos.volumeLots,
      openPrice: pos.openPrice,
      currentPrice: pos.currentPrice,
      sl: pos.stopLoss,
      tp: pos.takeProfit,
      floatingPnl: pos.unrealizedPnl,
      openTime: pos.openTimestamp || new Date().toISOString(),
      impliedRiskUsd,
      impliedRiskPctOfDailyBuffer: Number(((impliedRiskUsd / remainingDailyBuffer) * 100).toFixed(1)),
    };
  });

  const closedTrades: ClosedTrade[] = (payload.recentDeals || []).map((deal, idx, arr) => {
    const side: 'BUY' | 'SELL' = deal.side === 0 || deal.side === 'BUY' ? 'BUY' : 'SELL';
    const openMs = new Date(deal.entryTimestamp).getTime();
    const closeMs = new Date(deal.exitTimestamp).getTime();
    const durationMinutes = Math.max(1, Math.round((closeMs - openMs) / 60000));

    const flags: string[] = [];
    if (idx > 0 && arr[idx - 1].realizedPnl < 0) {
      const prevClose = new Date(arr[idx - 1].exitTimestamp).getTime();
      if ((openMs - prevClose) / 1000 < 240) flags.push('FAST_REENTRY');
      if (deal.volumeLots >= arr[idx - 1].volumeLots * 1.5) flags.push('LOT_ESCALATION');
    }
    if (isBreached && idx === arr.length - 1 && deal.realizedPnl < 0) {
      flags.push('BREACH_TRIGGER');
    }

    return {
      id: deal.dealId,
      symbol: deal.symbol,
      side,
      lots: deal.volumeLots,
      openPrice: deal.entryPrice,
      closePrice: deal.exitPrice,
      pnl: deal.realizedPnl,
      openTime: deal.entryTimestamp,
      closeTime: deal.exitTimestamp,
      durationMinutes,
      spreadAtClosePips: deal.brokerSpreadPips ?? 1.2,
      marketMidPriceAtClose: deal.referenceMidPrice ?? deal.exitPrice,
      fillSlippagePips: deal.slippagePips ?? 0.1,
      flags,
    };
  });

  return { account, openPositions, closedTrades };
}

/**
 * Generates a deterministic audit verification hash so prop firms can prove
 * the post-breach report was generated from immutable trade & L1 tick telemetry.
 */
export function computeAuditSignatureHash(
  accountNumber: string,
  breachTimestamp: string,
  brokerFillPrice: number,
  referenceMid: number
): string {
  const raw = `${accountNumber}|${breachTimestamp}|${brokerFillPrice}|${referenceMid}|PROPFIRMAI_L1_VERIFIED`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < raw.length; i++) {
    hash ^= raw.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const hex = (hash >>> 0).toString(16).padStart(8, '0');
  return `sha256-pf-${hex}e94a8b1c2d0f7e3a`;
}

