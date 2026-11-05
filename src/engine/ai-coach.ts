import {
  AccountInfo,
  Position,
  ClosedTrade,
  TraderArchetype,
  RetentionOffer,
  TraderTiltMetrics,
  PropFirmAction,
} from '@/types';

export type CoachTone = 'peer_buddy' | 'psychologist' | 'risk_officer';

export interface AIPersonalizedDebrief {
  headline: string;
  salutation: string;
  executiveSummary: string;
  memoryCallout: string;
  tradeByTradeAnalysis: {
    tradeId: string;
    symbol: string;
    lots: number;
    pnl: number;
    insight: string;
    emotionalState: string;
  }[];
  psychologicalRootCause: string;
  actionablePrescription: string[];
  personalizedRecoveryPitch: {
    subjectLine: string;
    messageBody: string;
    ctaButton: string;
  };
}

export interface AIInFlightNudge {
  headline: string;
  message: string;
  audioVoiceoverScript: string;
  memoryRecalled: string;
  recommendedAction: string;
  dismissText: string;
  propFirmAction?: PropFirmAction;
  individualTradeInsight?: {
    pair: string;
    historicalWinRatePct: number;
    recommendedHoldTimeMin: number;
    postWinWarning?: string;
  };
}

/**
 * Generates an in-flight coaching message that feels like a respectful, low-pressure suggestion
 * from a supportive friend in your corner. The trader is always 100% in control.
 */
export function generateAIInFlightNudge(
  account: AccountInfo,
  openPositions: Position[],
  closedTrades: ClosedTrade[],
  metrics: TraderTiltMetrics,
  tone: CoachTone = 'peer_buddy'
): AIInFlightNudge {
  const preferredName = account.memory?.preferredName || account.traderName.split(' ')[0] || 'Trader';
  const lastClosed = closedTrades[closedTrades.length - 1];
  const activePos = openPositions[0];
  const memory = account.memory;

  // Case 1: Active revenge / sizing escalation
  if (activePos && lastClosed && lastClosed.pnl < 0) {
    if (memory?.traderId.includes('alex')) {
      if (tone === 'peer_buddy') {
        return {
          headline: `Just a quick heads-up on this Gold position, Alex...`,
          message: `Hey Alex, you're in the driver's seat and it's 100% your call, but I wanted to put this on your radar. You're holding ${activePos.lots} lots on Gold right after that EURUSD stop-out. I know how tempting it is to want to make back that -$${Math.abs(
            lastClosed.pnl
          )} quickly. Just keep in mind: at this lot size, even a standard 12-pip wobble will eat up your remaining $${Math.round(
            metrics.remainingDailyLossUsd
          )} buffer. No pressure from me, but it might be worth taking some off the table or at least sliding a stop in. You decide what's best.`,
          audioVoiceoverScript: `Hey Alex, just putting this on your radar. You're holding ${activePos.lots} lots on Gold. Your call completely, but a 12-pip move hits your daily limit. Just wanted you to have the numbers in front of you.`,
          memoryRecalled: `Recalling past habit of scaling into Gold after EURUSD losses.`,
          recommendedAction: `Suggestion: Consider trimming 2 lots or placing a protective stop if the market spikes.`,
          dismissText: `I know what I'm doing, thanks`,
        };
      }

      if (tone === 'psychologist') {
        return {
          headline: `Friendly observation from your corner, Alex...`,
          message: `Alex, take this purely as a thought to consider: whenever an EURUSD setup takes a small bite out of our balance, our instinct is to want immediate relief on Gold. You have such a strong edge when you stick to your 1-lot rhythm. Just ask yourself if this 4.5-lot trade is part of your morning plan or a spontaneous reaction. Either way, you're in full control.`,
          audioVoiceoverScript: `Alex, quick check-in. Just ask yourself if this position is your trading plan or an emotional reaction. You're in charge, just looking out for you.`,
          memoryRecalled: `Alex often feels the urge to recover FX losses quickly via Gold volatility.`,
          recommendedAction: `Suggestion: Take 30 seconds to confirm this trade fits your written checklist.`,
          dismissText: `All good, keeping trade open`,
        };
      }

      // Risk officer
      return {
        headline: `Daily Buffer Proximity Advisory • ${activePos.symbol}`,
        message: `Alex, just sharing the mathematical risk exposure: this ${activePos.lots}-lot position currently represents 78% of your remaining daily buffer. If Gold moves $2.20 against your entry, the daily limit triggers automatically. You have full discretion on your trades—just make sure your risk allocation aligns with your targets.`,
        audioVoiceoverScript: `Risk advisory, Alex: Current size uses seventy-eight percent of your daily margin. Sizing is entirely your decision.`,
        memoryRecalled: `Current sizing is 4.5x baseline lot allocation.`,
        recommendedAction: `Suggestion: Verify your maximum allowable dollar loss on this ticket.`,
        dismissText: `Acknowledged risk`,
      };
    }

    if (memory?.traderId.includes('marcus')) {
      return {
        headline: `Marcus, gentle reminder: you're already 97% of the way there.`,
        message: `Marcus, you're only $180 away from passing Phase 1—which is incredible. You're holding 8 contracts on NQ right now. You know NQ better than anyone, so you do what feels right, but why risk a wide opening spike for just $180? Even a single micro contract gets you across the tape. Just offering a second pair of eyes from the desk!`,
        audioVoiceoverScript: `Hey Marcus, gentle thought: you only need a hundred and eighty bucks. No need to swing heavy with eight contracts on NQ unless you really want to. You're in the driver's seat.`,
        memoryRecalled: `Marcus built +$7,820 with 2-lot sizing over 8 days.`,
        recommendedAction: `Suggestion: Consider scaling down to 1-2 contracts to protect your accumulated profits.`,
        dismissText: `I'm comfortable with the risk`,
      };
    }

    // Default fallback
    return {
      headline: `Quick heads-up on your position sizing, ${preferredName}`,
      message: `Just wanted to make sure you saw this, ${preferredName}: your open position on ${activePos.symbol} carries $${Math.round(
        activePos.impliedRiskUsd
      )} of risk, which is a big chunk of today's remaining buffer. Totally up to you how you manage it, but keeping size lighter here gives you plenty of breathing room.`,
      audioVoiceoverScript: `Hey ${preferredName}, just sharing the numbers. This position uses a big portion of your daily buffer. Totally your call how you play it.`,
      memoryRecalled: `Recent loss closed within 3 minutes.`,
      recommendedAction: `Suggestion: Check your stop-loss placement and daily buffer margin.`,
      dismissText: `Got it, thanks`,
    };
  }

  // Case 2: Healthy, disciplined session with good trades
  if (memory?.traderId.includes('elena') || metrics.tiltScore < 30) {
    const symbol = activePos?.symbol || 'GBPUSD';
    const isFloatingGreen = (activePos?.floatingPnl || 0) > 0;
    const netDayProfit = Math.round(account.currentEquity - account.startingBalance);

    return {
      headline: isFloatingGreen
        ? `Clean London Execution on ${symbol} • Pacing 94/100`
        : `Disciplined Setup on ${symbol} • Risk 0.4%`,
      message: `Elena, your ${activePos?.lots || 1.2}-lot position on ${symbol} perfectly aligns with your historical edge. Your individual trade logs show a 78% win rate on London session continuation setups when held longer than 30 minutes with a hard stop. You're up +$${Math.abs(
        netDayProfit
      ).toLocaleString()} overall. Your trade memory also indicates that after banking morning gains, overtrading in the afternoon reduces your weekly consistency score by 28%. Once this runner hits 1.3045, the highest-probability decision is closing the terminal to lock in the green day.`,
      audioVoiceoverScript: `Looking great today, Elena. Setup respects your London morning edge. Protect your gains once target hits.`,
      memoryRecalled: `78% win rate on GBPUSD long setups held >30m with 0.4% risk.`,
      recommendedAction: `Trader Action: Let the trade play out to the 1.3045 take-profit target, then step away.`,
      dismissText: `Acknowledge & Protect Gains`,
      individualTradeInsight: {
        pair: symbol,
        historicalWinRatePct: 78,
        recommendedHoldTimeMin: 35,
        postWinWarning:
          'Data Insight: Overtrading after 2 green setups is responsible for 64% of your historical drawdown dips.',
      },
      propFirmAction: {
        type: 'TIER_UPGRADE',
        title: 'VIP Alpha Scaling: $200k Master Evaluation',
        badge: 'Prop Firm Milestone • Top 5% Alpha',
        description:
          'Elena has achieved a 94/100 consistency score across 12 sessions. Automated firm action: Delivered 20% loyalty voucher for an immediate $200k challenge upgrade.',
        ctaText: 'Claim $200k Evaluation Upgrade ($495)',
        firmRevenueImpactUsd: 495,
        firmBenefit:
          'Converts disciplined winning traders into higher-tier evaluation purchases at $0 CAC while flagging clean alpha for the Risk Desk.',
      },
    };
  }

  const netDayProfit = Math.round(account.currentEquity - account.startingBalance);
  return {
    headline: `Trading looking solid, ${preferredName}`,
    message: `Risk is well within your normal parameters today (${metrics.dailyBufferUsedPct}% of buffer used). Your individual trade data confirms healthy pacing and disciplined stop-loss placement. Keep sticking to your playbook.`,
    audioVoiceoverScript: `Everything looks clean and steady today, ${preferredName}.`,
    memoryRecalled: `Disciplined execution history.`,
    recommendedAction: `Keep sticking to your rules and avoid post-win sizing escalation.`,
    dismissText: `Dismiss`,
    propFirmAction: {
      type: 'ADDON_UPGRADE',
      title: 'Consistency Reward: Bi-Weekly Payout Add-On',
      badge: 'Account Add-On',
      description: 'Trader maintained daily drawdown under 1.5% for 5 consecutive sessions.',
      ctaText: 'Unlock Bi-Weekly Payouts ($49)',
      firmRevenueImpactUsd: 49,
      firmBenefit: 'High-margin add-on upsell driven by active trader engagement.',
    },
  };
}

/**
 * Generates an extraordinarily human, respectful, non-patronizing Post-Breach Forensic Audit Letter.
 * Validates their skill, explains the math objectively, and leaves the door wide open for their next attempt.
 */
export function generateAIPersonalizedDebrief(
  account: AccountInfo,
  closedTrades: ClosedTrade[],
  archetype: TraderArchetype,
  offer: RetentionOffer,
  tone: CoachTone = 'peer_buddy'
): AIPersonalizedDebrief {
  const preferredName = account.memory?.preferredName || account.traderName.split(' ')[0] || 'Trader';
  const memory = account.memory;
  const losses = closedTrades.filter((t) => t.pnl < 0);
  const largestLoss = losses.reduce(
    (max, t) => (Math.abs(t.pnl) > Math.abs(max.pnl) ? t : max),
    losses[0] || closedTrades[0]
  );

  // Build trade-by-trade emotional X-ray
  const tradeByTradeAnalysis = closedTrades.map((t, idx) => {
    let insight = '';
    let emotionalState = 'Disciplined';

    if (t.pnl > 0) {
      insight = `Clean, patient setup on ${t.symbol}. Banked +$${t.pnl.toLocaleString()} with ${t.lots} lots over ${t.durationMinutes}m. That's your genuine skill on display.`;
      emotionalState = 'Confident & In Zone';
    } else if (t.flags?.includes('FAST_REENTRY')) {
      insight = `Re-entry on ${t.symbol} shortly after the first red trade. You bumped size up to ${t.lots} lots to try to get back to even. Very natural human instinct.`;
      emotionalState = 'Impatience / Wanting Even';
    } else if (t.flags?.includes('BREACH_TRIGGER') || t.flags?.includes('OVER_LEVERAGED')) {
      insight = `The breach trade: ${t.lots} lots on ${t.symbol}. A standard 13-minute adverse move generated -$${Math.abs(t.pnl).toLocaleString()}, which triggered the daily drawdown safety limit.`;
      emotionalState = 'High Adrenaline / Sizing Mismatch';
    } else {
      insight = `Normal stop-out (-$${Math.abs(t.pnl).toLocaleString()}) with ${t.lots} lots. Completely standard business expense in trading.`;
      emotionalState = 'Normal Operational Risk';
    }

    return {
      tradeId: t.id,
      symbol: t.symbol,
      lots: t.lots,
      pnl: t.pnl,
      insight,
      emotionalState,
    };
  });

  let salutation = `Hey ${preferredName},`;
  let executiveSummary = '';
  let memoryCallout = '';
  let psychologicalRootCause = '';
  let prescription: string[] = [];

  if (memory?.traderId.includes('alex')) {
    salutation = `Hey Alex,`;
    executiveSummary = `First off: take a slow breath. Nobody likes having an evaluation end early, but I want to be 100% straight with you: you clearly know how to trade.\n\nYour morning EURUSD setup was clean, and your 74% win rate on London sweeps this month speaks for itself. But at 13:17 today, after EURUSD nicked your stop for -$600, that competitive urge kicked in. You hopped into Gold with 2 lots, and then 5.0 lots without a stop. In about 25 minutes, the daily buffer was reached.\n\nI ran the independent tick comparison for you: the broker's spread was 1.4 pips (clean institutional pricing with zero artificial slippage). The market didn't take your account, Alex. A quick burst of sizing did. And that's actually the best possible news, because technical skill takes years to build, but position sizing is something you can tweak whenever you're ready.`;

    memoryCallout = `Looking at our past logs, you trade like an absolute machine when you stay around 1.0 to 1.5 lots. Gold is just that one pair that tempts you when you're looking for a fast bounce-back.`;

    psychologicalRootCause = `The "Get It Back Fast" Impulse: When a setup you really liked doesn't work out, it's completely human to want the market to hand that money back immediately. Sizing up on high-beta pairs like Gold is just that impulse in action.`;

    prescription = [
      'Gentle Guardrail: Try taking an optional 20-minute break whenever EURUSD hits a stop before looking at Gold.',
      'Sizing Cap: Consider sticking to a 1.5-lot ceiling so you have plenty of room to weather normal pullbacks.',
      'Always keep a resting stop-loss in the market so you never have to worry about sudden volatility spikes.',
    ];
  } else if (memory?.traderId.includes('marcus')) {
    salutation = `Marcus, my friend...`;
    executiveSummary = `I know how frustrating this is. You spent 8 patient days building up +$7,820 with some of the cleanest NQ trading on the platform. You were literally $180 away from passing Phase 1.\n\nAnd then you put on 8 contracts right before cash open.\n\nI completely get why: you were close, you had high conviction, and you wanted to wrap up the challenge in one clean shot. But NQ had a 40-point opening swing, and before you knew it, the daily buffer was touched.\n\nThe execution on DXTrade was 99.4% verified clean. There were no weird spreads or platform games. You've already proven you have the edge to pass—you did it for 8 straight days. The finish line just got a little too exciting today, which happens to the best of us.`;

    memoryCallout = `You have proven beyond doubt that your strategy works. You compounded +$7,820 with 2-lot discipline. The only challenge is treating that last $180 with the exact same calm patience as day 1.`;

    psychologicalRootCause = `Finish-Line Anticipation: When you're 97% of the way to a goal, it's natural to discount risk because your mind is already thinking about Phase 2.`;

    prescription = [
      'Suggestion: Whenever you are within 2% of the goal, treat it like an ultra-conservative defense session with smaller lots.',
      'Let the opening 5 minutes of US cash open settle before putting on new positions.',
      'Remind yourself that passing in 9 days is just as great as passing in 8 days.',
    ];
  } else {
    salutation = `Hi ${preferredName},`;
    executiveSummary = `I took a look through your trade logs today. You have clear market conviction, but the sizing was a bit too heavy for a ${account.dailyLossLimitPct}% daily loss buffer. Holding ${largestLoss?.lots || 8} lots on ${largestLoss?.symbol || 'EURUSD'} left you only 12 pips of room before the safety limit triggered.\n\nThe audit verified institutional pricing with zero anomalous slippage. Your market direction isn't the problem—just dialing in the risk per trade will give your strategy the room it needs to breathe.`;

    memoryCallout = `You have solid entries when using controlled sizing. Most of today's drawdown came from a single oversized position.`;

    psychologicalRootCause = `Wanting fast results. Trading with high lot sizes compresses your margin for error.`;

    prescription = [
      'Suggestion: Aim to risk no more than 0.75% to 1.0% per trade.',
      'Use a lot size calculator before placing trades so you know your exact dollar risk.',
      'Stay patient and let your statistical edge do the compounding.',
    ];
  }

  // Tailored Recovery Email / Discord Message
  const personalizedRecoveryPitch = {
    subjectLine: `Alex, quick note from your trading buddy (no pressure)`,
    messageBody: `Hey ${preferredName},\n\nI know having an evaluation end hurts—especially when you were trading well earlier in the session. Take the rest of the day off and let the frustration settle.\n\nWhenever you're ready, I pulled your execution audit from the server. Your pricing was 99.4% clean against institutional L1 feeds, and your core setup was solid. Today just came down to a quick sizing escalation on Gold after that EURUSD stop.\n\nBecause we saw how well you traded before that slip, the team put together a customized recovery option if you want to give it another shot: ${offer.title} with ${offer.discountPct}% off (Coupon: ${offer.couponCode}).\n\nIt comes with our optional AI Cooldown Guardrail to give you a gentle reminder whenever emotions run hot.\n\nCompletely your call whenever you feel ready to get back in the arena:\nhttps://propfirm.io/recover/${account.accountNumber}?code=${offer.couponCode}\n\nCheers,\nYour Prop Firm Trading Buddy`,
    ctaButton: offer.ctaText,
  };

  const headline = `A Friendly Debrief With Your Trading Buddy`;

  return {
    headline,
    salutation,
    executiveSummary,
    memoryCallout,
    tradeByTradeAnalysis,
    psychologicalRootCause,
    actionablePrescription: prescription,
    personalizedRecoveryPitch,
  };
}
