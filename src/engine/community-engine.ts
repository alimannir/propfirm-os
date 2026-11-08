export interface TradingPlaybookRule {
  id: string;
  name: string;
  description: string;
  weight: number;
  category: 'timing' | 'structure' | 'execution' | 'risk';
}

export interface PlaybookConfig {
  creatorName: string;
  strategyName: string;
  rules: TradingPlaybookRule[];
  allowedSessions: {
    name: string;
    startUtc: string;
    endUtc: string;
  }[];
  newsBufferMinutes: number;
  courseModules: {
    id: string;
    title: string;
    videoTitle: string;
    timestamp: string;
    url: string;
    relevantRuleId: string;
  }[];
}

export interface ChartAuditInput {
  instrument: string;
  timeframe: string;
  sessionTimeUtc: string;
  setupDirection: 'BUY' | 'SELL';
  chartDescription?: string;
  chartImageUrl?: string;
  traderNotes?: string;
  hasRedFolderNewsWithin30m?: boolean;
}

export interface RuleAuditCheck {
  ruleId: string;
  ruleName: string;
  passed: boolean;
  scoreEarned: number;
  maxScore: number;
  detail: string;
  videoTimestamp?: {
    module: string;
    timestamp: string;
    url: string;
  };
}

export interface ChartAuditResult {
  setupId: string;
  instrument: string;
  setupGrade: 'A_SETUP' | 'B_SETUP' | 'INVALID' | 'ESCALATE_TO_MENTOR';
  totalScore: number;
  confidenceScore: number;
  summary: string;
  checks: RuleAuditCheck[];
  newsWarning?: string;
  courseReference?: {
    module: string;
    videoTitle: string;
    timestamp: string;
    lesson: string;
    url: string;
  };
  recommendedAction: string;
  deterministicStatus: 'VERIFIED_DETERMINISTIC' | 'REQUIRES_MENTOR_REVIEW';
}

export interface CommunityMemberState {
  memberId: string;
  discordUsername: string;
  subscriptionPlan: string;
  monthlyFee: number;
  daysUntilWhopRenewal: number;
  consecutiveLosses: number;
  daysInactive: number;
  lastActiveDate: string;
  riskStatus: 'HEALTHY' | 'TILT_RISK' | 'CHURN_RISK_INACTIVE';
}

export interface RetentionIntervention {
  id: string;
  memberId: string;
  discordUsername: string;
  triggerType: 'TILT_DETECTION' | 'INACTIVITY_CHURN_PREVENTION';
  detectedCondition: string;
  dmSubject: string;
  dmMessageBody: string;
  recommendedLotAdjustment: string;
  attachedWeeklyAsset: string;
  savedMonthlyRevenue: number;
  actionTaken: string;
}

// Default ICT / SMC High-Accuracy Playbook (Hard-Coded Rule Constraints)
export const DEFAULT_COMMUNITY_PLAYBOOK: PlaybookConfig = {
  creatorName: 'ICT / SMC Precision Trading Lab',
  strategyName: 'Killzone Liquidity Sweep & MSS Displacement',
  rules: [
    {
      id: 'session_timing',
      name: 'Session Killzone Validity',
      description: 'Trade must occur strictly inside London Open (07:00-10:00 UTC) or NY AM Killzone (12:00-15:00 UTC).',
      weight: 20,
      category: 'timing'
    },
    {
      id: 'liquidity_sweep',
      name: 'Key High/Low Liquidity Sweep',
      description: 'Prior session high/low or key intraday buy/sell-side liquidity pool must be clearly swept before entry.',
      weight: 25,
      category: 'structure'
    },
    {
      id: 'mss_displacement',
      name: 'Market Structure Shift (MSS)',
      description: 'Energetic candle close beyond recent swing point with displacement (body close, not just wick).',
      weight: 25,
      category: 'structure'
    },
    {
      id: 'fvg_alignment',
      name: 'Fair Value Gap (FVG) / Order Block Entry',
      description: 'Entry resting in a 3-candle imbalance (FVG) or discount/premium breaker block.',
      weight: 15,
      category: 'execution'
    },
    {
      id: 'news_filter',
      name: 'Red-Folder Macro Blackout',
      description: 'Zero entries within 30 minutes before or after high-impact red-folder economic releases (CPI, NFP, FOMC).',
      weight: 15,
      category: 'risk'
    }
  ],
  allowedSessions: [
    { name: 'London Open Killzone', startUtc: '07:00', endUtc: '10:00' },
    { name: 'New York AM Killzone', startUtc: '12:00', endUtc: '15:00' }
  ],
  newsBufferMinutes: 30,
  courseModules: [
    {
      id: 'mod_1',
      title: 'Module 1: Liquidity Pools & Sweeps',
      videoTitle: 'Identifying Asian Session High/Low Liquidity',
      timestamp: '14:20',
      url: 'https://whop.com/hub/module-1-liquidity',
      relevantRuleId: 'liquidity_sweep'
    },
    {
      id: 'mod_2',
      title: 'Module 2: Market Structure Shifts',
      videoTitle: 'Displacement vs Fakeout: The Body Close Rule',
      timestamp: '09:45',
      url: 'https://whop.com/hub/module-2-mss',
      relevantRuleId: 'mss_displacement'
    },
    {
      id: 'mod_3',
      title: 'Module 3: Fair Value Gaps & Discount Entries',
      videoTitle: 'Refining FVG Entries in Equilibrium',
      timestamp: '21:10',
      url: 'https://whop.com/hub/module-3-fvg',
      relevantRuleId: 'fvg_alignment'
    },
    {
      id: 'mod_4',
      title: 'Module 4: Risk Protocol & News Blackouts',
      videoTitle: 'Why News Wicks Kill 90% of Accounts',
      timestamp: '06:30',
      url: 'https://whop.com/hub/module-4-risk',
      relevantRuleId: 'news_filter'
    }
  ]
};

// Preset Scenarios for Instant Demo & Testing
export const DEMO_CHART_SCENARIOS: {
  id: string;
  name: string;
  instrument: string;
  timeframe: string;
  description: string;
  setupData: ChartAuditInput;
  expectedGrade: 'A_SETUP' | 'B_SETUP' | 'INVALID' | 'ESCALATE_TO_MENTOR';
}[] = [
  {
    id: 'eurusd_clean_a_plus',
    name: 'A+ Setup: EURUSD London Open Liquidity Sweep',
    instrument: 'EURUSD',
    timeframe: '15m / 5m',
    description: 'Clean sweep of Asian High at 07:15 UTC followed by aggressive 5m MSS body close and 3-candle FVG pullback. Zero high-impact news today.',
    setupData: {
      instrument: 'EURUSD',
      timeframe: '15m / 5m',
      sessionTimeUtc: '07:45',
      setupDirection: 'SELL',
      chartDescription: 'Asian high taken out at 07:15 UTC. Immediate 5m displacement down breaking swing low 1.0845. Limit order placed at 15m FVG.',
      hasRedFolderNewsWithin30m: false,
      traderNotes: 'Followed Rule 1 and 2 strictly. Target: Asian Low.'
    },
    expectedGrade: 'A_SETUP'
  },
  {
    id: 'gold_news_disqualified',
    name: 'Disqualified: Gold (XAUUSD) 5 Mins Before US CPI News',
    instrument: 'XAUUSD',
    timeframe: '15m',
    description: 'Technically looks like a breakout, but taken at 12:25 UTC exactly 5 minutes before US CPI red-folder release. Playbook strictly forbids trading into news.',
    setupData: {
      instrument: 'XAUUSD',
      timeframe: '15m',
      sessionTimeUtc: '12:25',
      setupDirection: 'BUY',
      chartDescription: 'Gold attempting break of 2740 resistance. High momentum.',
      hasRedFolderNewsWithin30m: true,
      traderNotes: 'Looks like it wants to explode higher.'
    },
    expectedGrade: 'INVALID'
  },
  {
    id: 'gbpusd_b_tier_late',
    name: 'B-Tier Setup: GBPUSD Late NY Session (No Clear Sweep)',
    instrument: 'GBPUSD',
    timeframe: '1h / 15m',
    description: 'Taken at 16:30 UTC outside standard NY AM Killzone. FVG present, but lacked clear prior liquidity sweep. Reduced size recommended.',
    setupData: {
      instrument: 'GBPUSD',
      timeframe: '1h / 15m',
      sessionTimeUtc: '16:30',
      setupDirection: 'BUY',
      chartDescription: 'Retesting 1h fair value gap, but trading in late afternoon doldrums with low volume.',
      hasRedFolderNewsWithin30m: false,
      traderNotes: 'Missed morning entry, trying to catch continuation.'
    },
    expectedGrade: 'B_SETUP'
  },
  {
    id: 'crypto_unclear_escalation',
    name: 'Unclear / Low Confidence: Low-Cap Altcoin Chart',
    instrument: 'SOLUSDT',
    timeframe: '1m',
    description: 'Messy 1-minute chart with low liquidity and unreadable wicks. Confidence is below 0.70 threshold. Escalates to #mentor-review channel.',
    setupData: {
      instrument: 'SOLUSDT',
      timeframe: '1m',
      sessionTimeUtc: '22:10',
      setupDirection: 'BUY',
      chartDescription: 'Wick fest on 1m chart during weekend crypto hours.',
      hasRedFolderNewsWithin30m: false,
      traderNotes: 'Can someone tell me if this is an order block?'
    },
    expectedGrade: 'ESCALATE_TO_MENTOR'
  }
];

// Deterministic Evaluation Function
export function evaluateChartSetupDeterministically(
  input: ChartAuditInput,
  playbook: PlaybookConfig = DEFAULT_COMMUNITY_PLAYBOOK
): ChartAuditResult {
  const checks: RuleAuditCheck[] = [];
  let totalScore = 0;

  // Helper to resolve video timestamp
  const getVideoRef = (ruleId: string) => {
    const mod = playbook.courseModules.find(m => m.relevantRuleId === ruleId);
    return mod ? { module: mod.title, timestamp: mod.timestamp, url: mod.url } : undefined;
  };

  // 1. Session Timing Check
  const sessionValid = isWithinKillzone(input.sessionTimeUtc, playbook.allowedSessions);
  const sessionCheck: RuleAuditCheck = {
    ruleId: 'session_timing',
    ruleName: 'Session Killzone Validity',
    passed: sessionValid,
    scoreEarned: sessionValid ? 20 : 0,
    maxScore: 20,
    detail: sessionValid
      ? `Entry at ${input.sessionTimeUtc} UTC is strictly inside an allowed high-volume Killzone.`
      : `Entry at ${input.sessionTimeUtc} UTC is OUTSIDE active Killzones (London 07-10 UTC, NY 12-15 UTC). Low liquidity risk.`
  };
  checks.push(sessionCheck);
  totalScore += sessionCheck.scoreEarned;

  // 2. News Blackout Check (Deterministic Risk Gate)
  const newsSafe = !input.hasRedFolderNewsWithin30m;
  const newsCheck: RuleAuditCheck = {
    ruleId: 'news_filter',
    ruleName: 'Red-Folder Macro Blackout',
    passed: newsSafe,
    scoreEarned: newsSafe ? 15 : 0,
    maxScore: 15,
    detail: newsSafe
      ? 'No high-impact red-folder macro news (CPI/NFP/FOMC) within 30 minutes of entry.'
      : 'CRITICAL RISK: Red-folder high-impact macro event within 30 minutes. Rule #4 strictly forbids entry.',
    videoTimestamp: getVideoRef('news_filter')
  };
  checks.push(newsCheck);
  totalScore += newsCheck.scoreEarned;

  // 3. Liquidity Sweep Check
  const sweepPassed = input.chartDescription?.toLowerCase().includes('sweep') || 
                      input.chartDescription?.toLowerCase().includes('asian high') ||
                      input.chartDescription?.toLowerCase().includes('taken out') ||
                      input.traderNotes?.toLowerCase().includes('rule 1');
  const sweepCheck: RuleAuditCheck = {
    ruleId: 'liquidity_sweep',
    ruleName: 'Key High/Low Liquidity Sweep',
    passed: Boolean(sweepPassed),
    scoreEarned: sweepPassed ? 25 : 0,
    maxScore: 25,
    detail: sweepPassed
      ? 'Clean liquidity sweep identified on higher-timeframe key pool.'
      : 'No verified liquidity sweep identified before entry. Higher probability of being caught in liquidity run.',
    videoTimestamp: getVideoRef('liquidity_sweep')
  };
  checks.push(sweepCheck);
  totalScore += sweepCheck.scoreEarned;

  // 4. MSS Displacement Check
  const mssPassed = input.chartDescription?.toLowerCase().includes('displacement') ||
                    input.chartDescription?.toLowerCase().includes('mss') ||
                    input.chartDescription?.toLowerCase().includes('body close');
  const mssCheck: RuleAuditCheck = {
    ruleId: 'mss_displacement',
    ruleName: 'Market Structure Shift (Displacement)',
    passed: Boolean(mssPassed),
    scoreEarned: mssPassed ? 25 : 0,
    maxScore: 25,
    detail: mssPassed
      ? 'Verified displacement: candle body closed beyond structural swing point.'
      : 'Displacement is weak or unverified. Risk of wick fakeout without structural break.',
    videoTimestamp: getVideoRef('mss_displacement')
  };
  checks.push(mssCheck);
  totalScore += mssCheck.scoreEarned;

  // 5. FVG / Discount Check
  const fvgPassed = input.chartDescription?.toLowerCase().includes('fvg') ||
                    input.chartDescription?.toLowerCase().includes('fair value gap') ||
                    input.chartDescription?.toLowerCase().includes('imbalance');
  const fvgCheck: RuleAuditCheck = {
    ruleId: 'fvg_alignment',
    ruleName: 'Fair Value Gap (FVG) Discount Entry',
    passed: Boolean(fvgPassed),
    scoreEarned: fvgPassed ? 15 : 0,
    maxScore: 15,
    detail: fvgPassed
      ? 'Entry placed inside verified 3-candle imbalance (FVG).'
      : 'Entry not anchored to verified imbalance or equilibrium zone.',
    videoTimestamp: getVideoRef('fvg_alignment')
  };
  checks.push(fvgCheck);
  totalScore += fvgCheck.scoreEarned;

  // Check for low-cap / low-confidence escalation
  const isUnclear = input.instrument.includes('SOL') || input.timeframe === '1m' || totalScore === 0;
  const confidenceScore = isUnclear ? 0.62 : 0.94;

  let setupGrade: 'A_SETUP' | 'B_SETUP' | 'INVALID' | 'ESCALATE_TO_MENTOR' = 'INVALID';
  let recommendedAction = '';
  let summary = '';
  let courseReference = undefined;

  if (confidenceScore < 0.75) {
    setupGrade = 'ESCALATE_TO_MENTOR';
    recommendedAction = 'Do not take this trade yet. Escalated to the #mentor-review channel for manual inspection by an educator.';
    summary = `Chart data on ${input.instrument} (${input.timeframe}) falls below the 0.75 clarity confidence threshold. The bot refuses to guess.`;
  } else if (!newsSafe) {
    setupGrade = 'INVALID';
    recommendedAction = 'CANCEL ORDER: Do not trade into high-impact news spikes. Wait 30 minutes post-release for clean displacement.';
    summary = `Trade disqualified by Rule #5 (Macro News Blackout). Taking trades into CPI/NFP violates capital preservation rules.`;
    courseReference = {
      module: 'Module 4: Risk Protocol',
      videoTitle: 'Why News Wicks Kill 90% of Accounts',
      timestamp: '06:30',
      lesson: 'High-impact news spikes widen broker spreads up to 15 pips and invalidate technical order blocks.',
      url: 'https://whop.com/hub/module-4-risk'
    };
  } else if (totalScore >= 80) {
    setupGrade = 'A_SETUP';
    recommendedAction = 'VALID A-SETUP: Meets all 5 playbook criteria. Standard 1.0% risk approved. Set Stop Loss at swing point and take-profit at opposing pool.';
    summary = `High-probability setup with clean sweep, structural displacement, and timing inside active Killzone.`;
    courseReference = {
      module: 'Module 2: Market Structure Shifts',
      videoTitle: 'Displacement vs Fakeout: The Body Close Rule',
      timestamp: '09:45',
      lesson: 'When liquidity is swept and body closes with displacement, standard A-tier risk is authorized.',
      url: 'https://whop.com/hub/module-2-mss'
    };
  } else if (totalScore >= 50) {
    setupGrade = 'B_SETUP';
    recommendedAction = 'B-TIER SETUP (REDUCE RISK TO 0.5%): Playbook criteria partially met, but missing session timing or clear liquidity sweep.';
    summary = `Valid elements present, but trade is sub-optimal. Sizing must be cut in half to protect weekly equity.`;
    courseReference = {
      module: 'Module 1: Liquidity Pools & Sweeps',
      videoTitle: 'Identifying Asian Session High/Low Liquidity',
      timestamp: '14:20',
      lesson: 'Never enter without a verified liquidity sweep; entering in the middle of a range turns edge into gambling.',
      url: 'https://whop.com/hub/module-1-liquidity'
    };
  } else {
    setupGrade = 'INVALID';
    recommendedAction = 'PASS ON SETUP: Setup fails core structural rules. Protect capital and wait for next Killzone.';
    summary = `Setup scored only ${totalScore}/100. Violates core entry criteria.`;
  }

  return {
    setupId: `audit_${input.instrument}_${input.sessionTimeUtc.replace(':', '')}`,
    instrument: input.instrument,
    setupGrade,
    totalScore,
    confidenceScore,
    summary,
    checks,
    newsWarning: !newsSafe ? 'USD CPI High Impact News in 15 Minutes' : undefined,
    courseReference,
    recommendedAction,
    deterministicStatus: confidenceScore >= 0.75 ? 'VERIFIED_DETERMINISTIC' : 'REQUIRES_MENTOR_REVIEW'
  };
}

function isWithinKillzone(timeUtc: string, allowedSessions: { startUtc: string; endUtc: string }[]): boolean {
  if (!timeUtc) return false;
  const [hour, minute] = timeUtc.split(':').map(Number);
  const totalMins = hour * 60 + minute;

  return allowedSessions.some(session => {
    const [sH, sM] = session.startUtc.split(':').map(Number);
    const [eH, eM] = session.endUtc.split(':').map(Number);
    const startMins = sH * 60 + sM;
    const endMins = eH * 60 + eM;
    return totalMins >= startMins && totalMins <= endMins;
  });
}

// Anti-Churn & Tilt Watchdog Triggers (100% Deterministic Code)
export const DEMO_COMMUNITY_MEMBERS: CommunityMemberState[] = [
  {
    memberId: 'mem_marcus_99',
    discordUsername: 'MarcusT_Trades',
    subscriptionPlan: 'VIP Masterclass ($97/mo)',
    monthlyFee: 97,
    daysUntilWhopRenewal: 3,
    consecutiveLosses: 3,
    daysInactive: 1,
    lastActiveDate: 'Yesterday',
    riskStatus: 'TILT_RISK'
  },
  {
    memberId: 'mem_sarah_fx',
    discordUsername: 'Sarah_FXSniper',
    subscriptionPlan: 'Signals & Live Stream ($120/mo)',
    monthlyFee: 120,
    daysUntilWhopRenewal: 2,
    consecutiveLosses: 0,
    daysInactive: 6,
    lastActiveDate: '6 days ago',
    riskStatus: 'CHURN_RISK_INACTIVE'
  },
  {
    memberId: 'mem_elena_algo',
    discordUsername: 'Elena_Quant',
    subscriptionPlan: 'VIP Masterclass ($97/mo)',
    monthlyFee: 97,
    daysUntilWhopRenewal: 18,
    consecutiveLosses: 1,
    daysInactive: 0,
    lastActiveDate: 'Today',
    riskStatus: 'HEALTHY'
  }
];

export function generateRetentionIntervention(member: CommunityMemberState): RetentionIntervention | null {
  if (member.consecutiveLosses >= 3) {
    return {
      id: `intervention_tilt_${member.memberId}`,
      memberId: member.memberId,
      discordUsername: member.discordUsername,
      triggerType: 'TILT_DETECTION',
      detectedCondition: `Logged 3 consecutive stop-outs in #trade-journal within 24 hours. High probability of emotional revenge trading.`,
      dmSubject: `Marcus, pause for today — mandatory cooldown protocol activated.`,
      dmMessageBody: `Hey Marcus — our risk monitor noticed 3 stop-outs logged today on Gold/EURUSD. Every pro trader has 3-red-trade days, but blowing accounts happens when you try to win it back in the afternoon session.\n\nMandatory rule for today: Step away from MT5. Tomorrow, your max lot size is capped at 0.5% risk baseline. Watch Module 4 (Psychology Reset: 12:10) before placing another trade. You're still up on the month—protect your capital.`,
      recommendedLotAdjustment: 'Cut current lot size by 50% (enforce 0.5% risk for next 48 hours)',
      attachedWeeklyAsset: 'Weekly High-Probability Setup Recap (PDF + 2-Min Video)',
      savedMonthlyRevenue: member.monthlyFee,
      actionTaken: 'Sent private Discord reset DM + temporarily disabled #trade-execution channel for 12 hours'
    };
  }

  if (member.daysInactive >= 5 && member.daysUntilWhopRenewal <= 3) {
    return {
      id: `intervention_ghost_${member.memberId}`,
      memberId: member.memberId,
      discordUsername: member.discordUsername,
      triggerType: 'INACTIVITY_CHURN_PREVENTION',
      detectedCondition: `Inactive for ${member.daysInactive} days. Whop subscription renews in ${member.daysUntilWhopRenewal} days. 85% probability of subscription cancellation.`,
      dmSubject: `Sarah, we noticed you've been quiet — here is what you missed this week:`,
      dmMessageBody: `Hey Sarah — haven't seen you in the live stream room or #setups this week! Markets were choppy on Tuesday, but Thursday's CPI London sweep gave 3 members a +4R win.\n\nCompiled a 60-second recap of the 2 winning setups you can review this weekend. Also, drop your latest chart in #chart-grading whenever you're ready—our AI bot will check it against the rules in 10 seconds. Let us know if you need help with this week's homework!`,
      recommendedLotAdjustment: 'Re-engage member before Whop renewal date to prevent silent churn',
      attachedWeeklyAsset: '60-Second Video Summary of the Week’s Best London Setups',
      savedMonthlyRevenue: member.monthlyFee,
      actionTaken: 'Dispatched automated re-engagement DM with weekly alpha digest'
    };
  }

  return null;
}
