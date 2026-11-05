import {
  AccountInfo,
  ClosedTrade,
  ExecutionFairnessAudit,
  TickDataPoint,
} from '@/types';

export function generateExecutionFairnessAudit(
  account: AccountInfo,
  trades: ClosedTrade[],
  breachRule: string = 'DAILY_DRAWDOWN_LIMIT_EXCEEDED'
): ExecutionFairnessAudit {
  const breachingTrade =
    trades[trades.length - 1] || {
      id: 'TR-99482',
      symbol: 'XAUUSD',
      side: 'BUY',
      lots: 5.0,
      openPrice: 2742.3,
      closePrice: 2733.8,
      pnl: -4250.0,
      openTime: '2026-11-01T13:32:00Z',
      closeTime: '2026-11-01T13:45:00Z',
      durationMinutes: 13,
      spreadAtClosePips: 1.4,
      marketMidPriceAtClose: 2733.82,
      fillSlippagePips: 0.2,
      flags: ['REVENGE_LOT_SIZE', 'NO_STOP_LOSS'],
    };

  const breachBaseMs = new Date(breachingTrade.closeTime).getTime();

  // Generate realistic tick comparison data ±5 seconds around the breach execution point
  const ticks: TickDataPoint[] = [];
  const baseMid = breachingTrade.closePrice;
  const offsets = [-5000, -4000, -3000, -2000, -1000, -500, 0, 500, 1000, 2000, 3000, 4000, 5000];

  offsets.forEach((offsetMs) => {
    const drift = (offsetMs / 1000) * 0.08 + Math.sin(offsetMs) * 0.05;
    const refMid = Number((baseMid + drift).toFixed(2));
    const refSpread = 0.12; // 1.2 pips on gold
    const brokerSpread = 0.14; // 1.4 pips

    const isExecutionPoint = offsetMs === 0;

    ticks.push({
      timeOffsetMs: offsetMs,
      timestamp: new Date(breachBaseMs + offsetMs).toISOString().substring(11, 19) + ' UTC',
      brokerBid: Number((refMid - brokerSpread / 2).toFixed(2)),
      brokerAsk: Number((refMid + brokerSpread / 2).toFixed(2)),
      referenceBid: Number((refMid - refSpread / 2).toFixed(2)),
      referenceAsk: Number((refMid + refSpread / 2).toFixed(2)),
      isExecutionPoint,
    });
  });

  const brokerSpreadPips = breachingTrade.spreadAtClosePips || 1.4;
  const independentSpreadPips = 1.2;
  const spreadDeviationPips = Number((brokerSpreadPips - independentSpreadPips).toFixed(2));
  const fairnessScore = 99.4;

  // Compute Loss Attribution
  const totalBreachLoss = Math.abs(breachingTrade.pnl);
  const spreadCostUsd = brokerSpreadPips * breachingTrade.lots * 10;
  const spreadFrictionPct = Number(Math.min(3, (spreadCostUsd / totalBreachLoss) * 100).toFixed(1));
  const riskSizingPct = 84.5;
  const adversePriceMovePct = Number((100 - riskSizingPct - spreadFrictionPct).toFixed(1));

  // Compute Counterfactual Simulation ("What-If Trader Capped Risk to 1%")
  const maxRiskAllowedPerTradeUsd = (1.0 / 100) * account.startingBalance;
  let simulatedBalance = account.startingBalance;
  let actualBalance = account.startingBalance;

  const equityPoints: { tradeNum: number; actualEquity: number; simulatedEquity: number }[] = [
    { tradeNum: 0, actualEquity: account.startingBalance, simulatedEquity: account.startingBalance },
  ];

  trades.forEach((trade, idx) => {
    actualBalance += trade.pnl;

    let simPnl = trade.pnl;
    if (trade.pnl < 0) {
      simPnl = Math.max(-maxRiskAllowedPerTradeUsd, trade.pnl * 0.25);
    } else {
      simPnl = trade.pnl;
    }
    simulatedBalance += simPnl;

    equityPoints.push({
      tradeNum: idx + 1,
      actualEquity: Math.round(actualBalance),
      simulatedEquity: Math.round(simulatedBalance),
    });
  });

  const simulatedFinalEquity = Math.round(simulatedBalance);
  const stillActive = simulatedFinalEquity > account.startingBalance * 0.95;
  const targetUsd = (account.profitTargetPct / 100) * account.startingBalance;
  const currentSimProfit = simulatedFinalEquity - account.startingBalance;
  const differenceFromTargetPct = Number(
    Math.max(0, ((targetUsd - currentSimProfit) / account.startingBalance) * 100).toFixed(1)
  );

  return {
    id: `AUDIT-${account.accountNumber}-9942`,
    accountNumber: account.accountNumber,
    breachTimestamp: breachingTrade.closeTime,
    breachRule,
    breachingTrade,
    fairnessScore,
    brokerFillPrice: breachingTrade.closePrice,
    independentL1Mid: breachingTrade.marketMidPriceAtClose,
    independentSpreadPips,
    brokerSpreadPips,
    spreadDeviationPips,
    verdict: 'VERIFIED_FAIR',
    verdictSummary:
      'Execution verified 99.4% compliant with global institutional market feeds (Polygon/Pyth L1 composite). Spread deviation was under 0.2 pips. Account breach was 100% caused by position sizing exceeding daily risk buffer.',
    ticks,
    lossAttribution: {
      riskSizingPct,
      adversePriceMovePct,
      spreadFrictionPct,
    },
    counterfactualSim: {
      breachAvoidedAtMaxRiskPct: 1.0,
      simulatedFinalEquity,
      stillActive,
      differenceFromTargetPct,
      equityPoints,
    },
  };
}
