import { NextRequest, NextResponse } from 'next/server';
import {
  normalizeBrokerPayload,
  computeAuditSignatureHash,
  RawBrokerWebhookPayload,
} from '@/engine/normalizer';
import { calculateTiltMetrics, detectBehavioralSignals } from '@/engine/behavioral';
import { classifyTraderArchetype } from '@/engine/classifier';
import { generateExecutionFairnessAudit } from '@/engine/auditor';
import { generateLiveInFlightNudge, generateLivePostBreachDebrief } from '@/engine/ai-provider';
import {
  persistBrokerEvent,
  persistAuditRecord,
  persistRetentionOffer,
  logApiCall,
} from '@/db/repository';

export async function GET() {
  return NextResponse.json({
    service: 'PropFirmAI Broker Ingestion Webhook (Persistent Edition)',
    status: 'ONLINE',
    supportedPlatforms: ['MT5', 'DXTrade', 'cTrader', 'Match-Trader', 'TradeLocker'],
    supportedEvents: ['ORDER_OPEN', 'ORDER_CLOSE', 'EQUITY_TICK', 'HARD_BREACH'],
    databasePersistence: 'ACTIVE (SQLite ACID Store)',
    traderMemoryBank: 'ACTIVE (Dynamic Memory Accumulator)',
  });
}

export async function POST(req: NextRequest) {
  const startedAt = performance.now();
  let accountNumber = 'UNKNOWN';
  let platform = 'UNKNOWN';

  try {
    const body = (await req.json()) as RawBrokerWebhookPayload;

    if (!body || !body.account || !body.account.accountNumber) {
      return NextResponse.json(
        { error: 'Invalid payload: missing account.accountNumber' },
        { status: 400 }
      );
    }

    accountNumber = body.account.accountNumber;
    platform = body.platform;

    const { account, openPositions, closedTrades } = normalizeBrokerPayload(body);
    const nowMs = Date.now();

    // 1. Persist to real database & compute dynamic evolving memory
    await persistBrokerEvent(account, openPositions, closedTrades);

    // 2. Run behavioral detection
    const tiltMetrics = calculateTiltMetrics(account, openPositions, closedTrades, nowMs);
    const signals = detectBehavioralSignals(
      account,
      openPositions,
      closedTrades,
      tiltMetrics,
      nowMs
    );

    // 3. Generate In-Flight Wingman Nudge via Live LLM or Behavioral Synthesizer
    const wingmanNudge = await generateLiveInFlightNudge(
      account,
      openPositions,
      closedTrades,
      tiltMetrics,
      'peer_buddy'
    );

    const isBreached = account.status === 'BREACHED' || body.eventType === 'HARD_BREACH';

    let postBreachPackage = null;
    if (isBreached) {
      const audit = generateExecutionFairnessAudit(account, closedTrades);
      const { archetype, offer } = classifyTraderArchetype(account, closedTrades);

      // Save audit and generate cryptographic HMAC signature
      const hmacSignature = await persistAuditRecord(audit);

      // Save retention offer to database
      await persistRetentionOffer(account.accountNumber, offer);

      // Generate human Post-Breach debrief letter
      const aiDebrief = await generateLivePostBreachDebrief(
        account,
        closedTrades,
        archetype,
        offer,
        'peer_buddy'
      );

      postBreachPackage = {
        verificationSignature: hmacSignature,
        audit,
        archetype,
        retentionOffer: offer,
        aiDebrief,
        checkoutRecoveryUrl: `https://portal.propfirm.io/checkout/recover?acc=${account.accountNumber}&coupon=${offer.couponCode}&discount=${offer.discountPct}`,
      };
    }

    const latencyMs = Number((performance.now() - startedAt).toFixed(2));

    // Log the API call to database
    await logApiCall(
      '/api/webhooks/trade-event',
      200,
      latencyMs,
      platform,
      accountNumber,
      `Event: ${body.eventType} • Pos: ${openPositions.length} • Trades: ${closedTrades.length}`
    );

    return NextResponse.json({
      ok: true,
      persistedToDatabase: true,
      latencyMs,
      autonomyMode: 'SUGGESTION_ONLY_NO_ORDER_BLOCKING',
      accountStatus: account.status,
      accountNumber: account.accountNumber,
      platform: account.platform,
      tiltMetrics,
      inFlightWingmanNudge: wingmanNudge,
      signals,
      postBreachPackage,
    });
  } catch (err) {
    const latencyMs = Number((performance.now() - startedAt).toFixed(2));
    await logApiCall('/api/webhooks/trade-event', 500, latencyMs, platform, accountNumber, String(err));

    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : 'Failed to process and persist broker webhook',
      },
      { status: 500 }
    );
  }
}
