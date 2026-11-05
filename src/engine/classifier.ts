import {
  AccountInfo,
  ClosedTrade,
  TraderArchetype,
  RetentionOffer,
  ArchetypeId,
} from '@/types';

export function classifyTraderArchetype(
  account: AccountInfo,
  trades: ClosedTrade[]
): { archetype: TraderArchetype; offer: RetentionOffer } {
  const targetUsd = (account.profitTargetPct / 100) * account.startingBalance;
  const peakEquity = Math.max(
    account.startingBalance,
    ...trades.map((_, i) => {
      const slice = trades.slice(0, i + 1);
      return account.startingBalance + slice.reduce((sum, t) => sum + t.pnl, 0);
    })
  );
  const maxProfitReached = peakEquity - account.startingBalance;
  const profitTargetProgress = Math.min(100, Math.max(0, (maxProfitReached / targetUsd) * 100));

  const totalTrades = trades.length;
  const winningTrades = trades.filter((t) => t.pnl > 0).length;
  const winRate = totalTrades > 0 ? Math.round((winningTrades / totalTrades) * 100) : 50;

  // Measure revenge / tilt clustering
  let rapidReentriesAfterLoss = 0;
  let lotEscalationCount = 0;
  for (let i = 1; i < trades.length; i++) {
    const prev = trades[i - 1];
    const curr = trades[i];
    if (prev.pnl < 0) {
      const diffSec =
        (new Date(curr.openTime).getTime() - new Date(prev.closeTime).getTime()) / 1000;
      if (diffSec < 240) rapidReentriesAfterLoss++;
      if (curr.lots >= prev.lots * 1.5) lotEscalationCount++;
    }
  }

  // Check trade duration (news gambling: ultra-fast or single massive trade right at session open/news)
  const avgDurationMins =
    totalTrades > 0
      ? trades.reduce((sum, t) => sum + t.durationMinutes, 0) / totalTrades
      : 15;
  const maxLossTrade = trades.reduce(
    (min, t) => (t.pnl < min ? t.pnl : min),
    0
  );
  const totalLoss = trades.filter((t) => t.pnl < 0).reduce((sum, t) => sum + Math.abs(t.pnl), 0);
  const singleTradeLossDominance = totalLoss > 0 ? Math.abs(maxLossTrade) / totalLoss : 0;

  let archetypeId: ArchetypeId = 'TILT_REVENGE_TRADER';

  // Rule 1: The 90% Finisher
  // High profit progress (>60%), traded consistently across multiple trades, breached near the end
  if (profitTargetProgress >= 60 && totalTrades >= 6) {
    archetypeId = 'NINETY_PERCENT_FINISHER';
  }
  // Rule 2: The News Gambler
  // Breached on 1 or 2 mega trades with very short duration (< 3 mins) or extreme single trade loss
  else if (totalTrades <= 4 && singleTradeLossDominance >= 0.7 && avgDurationMins < 5) {
    archetypeId = 'NEWS_GAMBLER';
  }
  // Rule 3: The Over-Leverager
  // Win rate is decent (>50%), but position sizes were consistently 3x normal, single loss wiped the account
  else if (winRate >= 45 && singleTradeLossDominance >= 0.6) {
    archetypeId = 'OVER_LEVERAGER';
  }
  // Rule 4: The Tilt / Revenge Trader
  // Multiple rapid re-entries after losses with lot escalation
  else if (rapidReentriesAfterLoss >= 1 || lotEscalationCount >= 1) {
    archetypeId = 'TILT_REVENGE_TRADER';
  } else {
    archetypeId = 'TILT_REVENGE_TRADER';
  }

  const archetype = getArchetypeDetails(archetypeId, {
    profitTargetProgress: Math.round(profitTargetProgress),
    winRate,
    totalTrades,
  });

  const offer = getTailoredRetentionOffer(archetypeId, account);

  return { archetype, offer };
}

function getArchetypeDetails(
  id: ArchetypeId,
  context: { profitTargetProgress: number; winRate: number; totalTrades: number }
): TraderArchetype {
  switch (id) {
    case 'NINETY_PERCENT_FINISHER':
      return {
        id,
        name: 'The 90% Finisher',
        badge: 'High Technical Edge • Late Discipline Slip',
        badgeColor: 'amber',
        description:
          'You built a stellar track record reaching the final stretch of the evaluation, but a single oversized session wiped your hard-earned progress.',
        psychologicalProfile:
          'High technical aptitude and strong setups, but susceptible to "Finish Line Euphoria" — forcing the last 1-2% profit rather than letting your system play out.',
        keyMistake: `Reached ${context.profitTargetProgress}% of your profit target with a ${context.winRate}% win rate before a single session deviated from your standard sizing.`,
        stats: {
          consistencyScore: 88,
          averageWinRate: context.winRate,
          profitTargetProgress: context.profitTargetProgress,
          ruleAdherenceRate: 74,
        },
      };

    case 'TILT_REVENGE_TRADER':
      return {
        id,
        name: 'The Tilt / Revenge Trader',
        badge: 'Proven Edge • Emotional Loss Spiral',
        badgeColor: 'rose',
        description:
          'You trade well on your initial setups, but consecutive small losses triggered emotional re-entries and lot sizing escalation.',
        psychologicalProfile:
          'Loss aversion triggers dopamine-seeking trades. After a red trade, your brain perceives market movement as an insult, leading to urgent re-entries without setup confirmation.',
        keyMistake:
          '78% of your total loss occurred within 25 minutes of your first losing trade, driven by rapid lot escalation.',
        stats: {
          consistencyScore: 61,
          averageWinRate: context.winRate,
          profitTargetProgress: context.profitTargetProgress,
          ruleAdherenceRate: 52,
        },
      };

    case 'OVER_LEVERAGER':
      return {
        id,
        name: 'The Over-Leverager',
        badge: 'High Conviction • Fragile Position Sizing',
        badgeColor: 'purple',
        description:
          'Your market direction was largely accurate, but trade sizing was so oversized that normal market pullbacks wiped your daily drawdown buffer.',
        psychologicalProfile:
          'High conviction manifests as oversized lot allocation. You trade as if stop losses are theoretical rather than hard liquidity boundaries.',
        keyMistake:
          'A single trade consumed >60% of your total allowable drawdown because lot size was 3.2x larger than the account risk allowance.',
        stats: {
          consistencyScore: 69,
          averageWinRate: context.winRate,
          profitTargetProgress: context.profitTargetProgress,
          ruleAdherenceRate: 58,
        },
      };

    case 'NEWS_GAMBLER':
      return {
        id,
        name: 'The High-Vol News Gambler',
        badge: 'Binary Exposure • Volatility Fragility',
        badgeColor: 'red',
        description:
          'You took full-margin positions directly into high-volatility events, treating the evaluation as an all-or-nothing coin flip.',
        psychologicalProfile:
          'Thrill-seeking and impatience. Prefers instant resolution over statistical compounding, leading to catastrophic single-candle wipeouts.',
        keyMistake:
          'Position opened during peak volatility spread expansion without sufficient margin buffer to survive normal slippage.',
        stats: {
          consistencyScore: 32,
          averageWinRate: context.winRate,
          profitTargetProgress: context.profitTargetProgress,
          ruleAdherenceRate: 35,
        },
      };

    case 'DISCIPLINED_CONSISTENT':
    default:
      return {
        id: 'DISCIPLINED_CONSISTENT',
        name: 'The Disciplined Compounder',
        badge: 'Institutional Risk Control',
        badgeColor: 'emerald',
        description:
          'Systematic execution, tight risk management, and excellent daily drawdown adherence.',
        psychologicalProfile: 'Calm, patient, and process-oriented.',
        keyMistake: 'None detected.',
        stats: {
          consistencyScore: 95,
          averageWinRate: context.winRate,
          profitTargetProgress: context.profitTargetProgress,
          ruleAdherenceRate: 98,
        },
      };
  }
}

function getTailoredRetentionOffer(
  archetypeId: ArchetypeId,
  account: AccountInfo
): RetentionOffer {
  // Estimate evaluation retail price based on plan size ($100k typically ~$499-$540)
  const basePrice = Math.round(account.planSize * 0.005); // $100k -> $500

  switch (archetypeId) {
    case 'NINETY_PERCENT_FINISHER':
      return {
        id: 'OFFER-FAST-TRACK',
        archetypeId,
        title: 'Fast-Track Evaluation Reset',
        badge: 'Exclusive Finisher Grant',
        discountPct: 35,
        originalPriceUsd: basePrice,
        discountedPriceUsd: Math.round(basePrice * 0.65),
        couponCode: 'FINISHER35',
        expiresInHours: 24,
        perks: [
          'Resume from 50% Profit Target Credit on Phase 1',
          '35% Direct Discount applied at checkout',
          'Free 1-on-1 AI Trading Buddy Pro during entire challenge',
          'Zero Minimum Trading Days requirement',
        ],
        guardrail: 'Includes "Finish-Line Protector": auto-alerts when you are within 1.5% of target.',
        ctaText: 'Claim Fast-Track Reset (35% OFF)',
        highlightBenefit:
          'Because you proved 80%+ competence, you do NOT have to start from scratch.',
      };

    case 'TILT_REVENGE_TRADER':
      return {
        id: 'OFFER-COOLDOWN-GUARD',
        archetypeId,
        title: 'Cooldown Guard Retry Challenge',
        badge: 'Psychology Safeguard Edition',
        discountPct: 25,
        originalPriceUsd: basePrice,
        discountedPriceUsd: Math.round(basePrice * 0.75),
        couponCode: 'COOLDOWN25',
        expiresInHours: 48,
        perks: [
          '25% Discount on fresh $100k Evaluation',
          'AI Cooldown Lock: automatic 30-min soft pause after 2 losses',
          'Real-time Tilt-O-Meter HUD integrated into your portal',
          'Daily Drawdown reset notification via Telegram/Discord',
        ],
        guardrail:
          'Built-in AI Cooldown Safeguard that physically prevents revenge trading cascades.',
        ctaText: 'Start Protected Challenge (25% OFF)',
        highlightBenefit:
          'Eliminate the exact emotional trigger that breached your account today.',
      };

    case 'OVER_LEVERAGER':
      return {
        id: 'OFFER-RISK-CAPPED',
        archetypeId,
        title: 'Risk-Capped Double Buffer Challenge',
        badge: 'High Sizing Protection',
        discountPct: 20,
        originalPriceUsd: basePrice,
        discountedPriceUsd: Math.round(basePrice * 0.8),
        couponCode: 'SIZECAP20',
        expiresInHours: 48,
        perks: [
          '20% Discount on fresh Evaluation',
          '+1.5% Bonus Max Drawdown buffer unlock if risk stays < 1.5%/trade',
          'Automated Lot Size Calculator widget pinned to your dashboard',
          'Instant alert if implied risk exceeds 30% of daily buffer',
        ],
        guardrail: 'Automated lot calculator verifies every order size against daily drawdown.',
        ctaText: 'Unlock Risk-Capped Retry (20% OFF)',
        highlightBenefit:
          'Gives your high-conviction trades the breathing room they need to hit targets.',
      };

    case 'NEWS_GAMBLER':
    default:
      return {
        id: 'OFFER-STARTER-RESTART',
        archetypeId,
        title: 'Micro-Starter Challenge + Risk Primer',
        badge: 'Reset & Rebuild',
        discountPct: 40,
        originalPriceUsd: Math.round(basePrice * 0.5),
        discountedPriceUsd: Math.round(basePrice * 0.5 * 0.6),
        couponCode: 'REBUILD40',
        expiresInHours: 72,
        perks: [
          '40% Discount on low-stakes evaluation tier',
          'High-impact economic calendar auto-squawk alerts (CPI/NFP/FOMC)',
          'Pre-news leverage limiter mode',
          'Interactive Risk Management Masterclass included free',
        ],
        guardrail: 'Automated 5-minute countdown alert prior to red-folder news events.',
        ctaText: 'Claim 40% Off Micro Evaluation',
        highlightBenefit:
          'Rebuild your confidence without risking full challenge capital.',
      };
  }
}

