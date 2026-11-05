import {
  AccountInfo,
  Position,
  ClosedTrade,
  BehavioralSignal,
  TraderTiltMetrics,
} from '@/types';

export function calculateTiltMetrics(
  account: AccountInfo,
  openPositions: Position[],
  recentTrades: ClosedTrade[],
  currentTimeMs: number = 1730467200000
): TraderTiltMetrics {
  const dailyLossLimitUsd = (account.dailyLossLimitPct / 100) * account.dailyStartingBalance;
  const currentDailyLossUsd = Math.max(0, account.dailyStartingBalance - account.currentEquity);
  const dailyBufferUsedPct = Math.min(100, (currentDailyLossUsd / dailyLossLimitUsd) * 100);
  const remainingDailyLossUsd = Math.max(0, dailyLossLimitUsd - currentDailyLossUsd);

  const maxLossLimitUsd = (account.maxLossLimitPct / 100) * account.startingBalance;
  const currentTotalLossUsd = Math.max(0, account.startingBalance - account.currentEquity);
  const maxBufferUsedPct = Math.min(100, (currentTotalLossUsd / maxLossLimitUsd) * 100);

  // Consecutive losses in recent trades
  let consecutiveLosses = 0;
  for (let i = recentTrades.length - 1; i >= 0; i--) {
    if (recentTrades[i].pnl < 0) {
      consecutiveLosses++;
    } else {
      break;
    }
  }

  // Lot escalation factor: compare current active or latest trade lot size to trader median
  const pastLots = recentTrades.map((t) => t.lots);
  const medianPastLots = pastLots.length > 0 ? getMedian(pastLots) : 1.0;
  const activeLots = openPositions.reduce((acc, p) => acc + p.lots, 0);
  const latestLots = activeLots > 0 ? activeLots : (recentTrades[recentTrades.length - 1]?.lots || 1.0);
  const lotEscalationFactor = Number((latestLots / Math.max(0.1, medianPastLots)).toFixed(2));

  // Average hold time of recent losses (in seconds)
  const losingTrades = recentTrades.filter((t) => t.pnl < 0);
  const avgTradeHoldTimeSec =
    losingTrades.length > 0
      ? Math.round(
          (losingTrades.reduce((acc, t) => acc + t.durationMinutes, 0) * 60) / losingTrades.length
        )
      : 300;

  // Recent loss velocity (USD lost in past 30 mins)
  const thirtyMinsAgo = currentTimeMs - 30 * 60 * 1000;
  const recentLossesIn30Min = recentTrades
    .filter((t) => new Date(t.closeTime).getTime() >= thirtyMinsAgo && t.pnl < 0)
    .reduce((acc, t) => acc + Math.abs(t.pnl), 0);
  const recentLossVelocityUsdPerMin = Math.round(recentLossesIn30Min / 30);

  // Compute composite Tilt Score (0 - 100)
  let tiltScore = 0;
  // Factor 1: Consecutive losses (up to 30 pts)
  tiltScore += Math.min(30, consecutiveLosses * 10);
  // Factor 2: Lot escalation (up to 35 pts)
  if (lotEscalationFactor > 1.25) {
    tiltScore += Math.min(35, Math.round((lotEscalationFactor - 1) * 20));
  }
  // Factor 3: Daily Drawdown buffer eaten (up to 25 pts)
  if (dailyBufferUsedPct > 50) {
    tiltScore += Math.min(25, Math.round((dailyBufferUsedPct - 50) * 0.5));
  }
  // Factor 4: High velocity churn / fast flips (up to 10 pts)
  if (avgTradeHoldTimeSec < 90 && consecutiveLosses >= 2) {
    tiltScore += 10;
  }

  tiltScore = Math.min(100, Math.max(0, tiltScore));

  return {
    tiltScore,
    consecutiveLosses,
    lotEscalationFactor,
    avgTradeHoldTimeSec,
    recentLossVelocityUsdPerMin,
    dailyBufferUsedPct: Number(dailyBufferUsedPct.toFixed(1)),
    maxBufferUsedPct: Number(maxBufferUsedPct.toFixed(1)),
    remainingDailyLossUsd: Number(remainingDailyLossUsd.toFixed(2)),
  };
}

export function detectBehavioralSignals(
  account: AccountInfo,
  openPositions: Position[],
  recentTrades: ClosedTrade[],
  metrics: TraderTiltMetrics,
  currentTimeMs: number = 1730467200000
): BehavioralSignal[] {
  const signals: BehavioralSignal[] = [];
  const nowStr = new Date(currentTimeMs).toISOString();

  // 1. REVENGE TRADING DETECTION
  const lastClosed = recentTrades[recentTrades.length - 1];
  if (lastClosed && lastClosed.pnl < 0 && openPositions.length > 0) {
    const timeSinceLastCloseSec =
      (currentTimeMs - new Date(lastClosed.closeTime).getTime()) / 1000;
    const isFastReentry = timeSinceLastCloseSec < 180;
    const isEscalatedLots = metrics.lotEscalationFactor >= 1.25;

    if (isFastReentry && isEscalatedLots) {
      signals.push({
        id: `sig-revenge-${lastClosed.id}`,
        type: 'REVENGE_TRADING',
        severity: 'CRITICAL',
        timestamp: nowStr,
        headline: 'Revenge Trade Detected',
        message: `You entered ${openPositions[0].lots} lots on ${openPositions[0].symbol} just ${Math.max(
          10,
          Math.round(timeSinceLastCloseSec)
        )}s after a -$${Math.abs(lastClosed.pnl)} loss, scaling position size by ${metrics.lotEscalationFactor}x.`,
        actionableRecommendation:
          'Step away from the screen for 10 minutes. Reduce lot size back to your baseline or close position before emotions breach your daily limit.',
        metrics: {
          timeSinceLossSec: Math.round(timeSinceLastCloseSec),
          lotMultiplier: `${metrics.lotEscalationFactor}x`,
          previousLoss: `-$${Math.abs(lastClosed.pnl)}`,
        },
      });
    }
  }

  // 2. OVER-LEVERAGING DETECTION
  const totalOpenRisk = openPositions.reduce((acc, p) => acc + p.impliedRiskUsd, 0);
  if (metrics.remainingDailyLossUsd > 0 && totalOpenRisk > 0) {
    const riskPctOfRemaining = (totalOpenRisk / metrics.remainingDailyLossUsd) * 100;
    if (riskPctOfRemaining >= 40) {
      signals.push({
        id: `sig-leverage-${openPositions[0].id}`,
        type: 'OVER_LEVERAGING',
        severity: riskPctOfRemaining > 70 ? 'CRITICAL' : 'WARNING',
        timestamp: nowStr,
        headline: riskPctOfRemaining > 70 ? 'Dangerously High Position Risk' : 'Elevated Position Risk',
        message: `Your active positions carry $${Math.round(
          totalOpenRisk
        )} of implied stop-loss risk (${Math.round(
          riskPctOfRemaining
        )}% of your remaining daily buffer of $${Math.round(metrics.remainingDailyLossUsd)}).`,
        actionableRecommendation: `A single adverse spike will breach your account. Downsize by at least ${(
          100 - (25 / (riskPctOfRemaining / 100))
        ).toFixed(0)}% to protect your evaluation.`,
        metrics: {
          impliedRiskUsd: Math.round(totalOpenRisk),
          riskPctOfRemaining: `${Math.round(riskPctOfRemaining)}%`,
        },
      });
    }
  }

  // 3. STOP-LOSS REMOVAL / NAKED RISK
  const nakedPositions = openPositions.filter((p) => !p.sl);
  if (nakedPositions.length > 0) {
    signals.push({
      id: `sig-naked-${nakedPositions[0].id}`,
      type: 'STOP_LOSS_REMOVAL',
      severity: 'WARNING',
      timestamp: nowStr,
      headline: 'Unprotected Position (No Hard Stop-Loss)',
      message: `${nakedPositions[0].lots} lots on ${nakedPositions[0].symbol} is running without a Stop Loss order.`,
      actionableRecommendation:
        'Set a hard stop-loss immediately. Market liquidity gaps can trigger an instant daily drawdown liquidation.',
      metrics: {
        symbol: nakedPositions[0].symbol,
        lots: nakedPositions[0].lots,
      },
    });
  }

  // 4. DRAWDOWN PROXIMITY ALERT
  if (metrics.dailyBufferUsedPct >= 70 && account.status !== 'BREACHED') {
    signals.push({
      id: `sig-dd-proximity`,
      type: 'DRAWDOWN_PROXIMITY',
      severity: metrics.dailyBufferUsedPct >= 85 ? 'CRITICAL' : 'WARNING',
      timestamp: nowStr,
      headline:
        metrics.dailyBufferUsedPct >= 85
          ? 'CRITICAL: Account Within 15% of Daily Breach'
          : 'Warning: 70% Daily Loss Buffer Consumed',
      message: `You have consumed ${metrics.dailyBufferUsedPct}% of today's drawdown limit. You only have $${Math.round(
        metrics.remainingDailyLossUsd
      )} of breathing room remaining.`,
      actionableRecommendation:
        'Cease new entries for today. Live to trade tomorrow when your daily drawdown limit completely resets.',
      metrics: {
        bufferUsedPct: `${metrics.dailyBufferUsedPct}%`,
        remainingBufferUsd: `$${Math.round(metrics.remainingDailyLossUsd)}`,
      },
    });
  }

  // 5. DISCIPLINE REINFORCEMENT
  if (
    signals.length === 0 &&
    metrics.tiltScore <= 15 &&
    metrics.dailyBufferUsedPct < 25 &&
    recentTrades.length >= 2
  ) {
    signals.push({
      id: `sig-discipline-good`,
      type: 'DISCIPLINE_EXCELLENCE',
      severity: 'INFO',
      timestamp: nowStr,
      headline: 'Optimal Discipline Maintained',
      message: `Your position sizing (${metrics.lotEscalationFactor}x baseline) and risk-to-drawdown ratio are in the top tier of passing traders.`,
      actionableRecommendation: 'Stay patient, stick to your edge, and protect your accumulated equity.',
      metrics: {
        tiltScore: `${metrics.tiltScore}/100`,
        riskDiscipline: 'A+',
      },
    });
  }

  return signals;
}

function getMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
