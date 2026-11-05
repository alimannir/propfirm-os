export type PlatformType = 'MT5' | 'DXTrade' | 'cTrader' | 'Match-Trader' | 'TradeLocker';

export type AccountStatus = 'ACTIVE' | 'WARNING' | 'CRITICAL' | 'BREACHED' | 'PASSED';

export type BreachReason =
  | 'DAILY_DRAWDOWN_BREACH'
  | 'MAX_DRAWDOWN_BREACH'
  | 'WEEKEND_HOLD_BREACH'
  | 'INACTIVITY';

export interface AccountInfo {
  id: string;
  traderName: string;
  email: string;
  accountNumber: string;
  firmName: string;
  planSize: number; // e.g. 100000
  startingBalance: number;
  currentBalance: number;
  currentEquity: number;
  dailyStartingBalance: number;
  dailyLossLimitPct: number; // e.g. 5.0 = 5%
  maxLossLimitPct: number;   // e.g. 10.0 = 10%
  profitTargetPct: number;   // e.g. 8.0 = 8%
  status: AccountStatus;
  breachReason?: BreachReason;
  breachedAt?: string;
  platform: PlatformType;
  serverName: string;
  memory?: TraderMemoryProfile;
}

export interface TraderMemoryProfile {
  traderId: string;
  preferredName: string;
  challengesAttempted: number;
  monthsWithFirm: number;
  favoritePairs: string[];
  usualSessionTime: string;
  usualLotSize: number;
  knownStrengths: string[];
  knownKryptonite: string[];
  pastIncidents: {
    challengeNumber: number;
    date: string;
    whatHappened: string;
  }[];
  buddyNotebook: string[];
}

export interface Position {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  lots: number;
  openPrice: number;
  currentPrice: number;
  sl?: number;
  tp?: number;
  floatingPnl: number;
  openTime: string;
  impliedRiskUsd: number;
  impliedRiskPctOfDailyBuffer: number;
}

export interface ClosedTrade {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  lots: number;
  openPrice: number;
  closePrice: number;
  pnl: number;
  openTime: string;
  closeTime: string;
  durationMinutes: number;
  spreadAtClosePips: number;
  marketMidPriceAtClose: number;
  fillSlippagePips: number;
  flags?: string[];
}

export type SignalType =
  | 'REVENGE_TRADING'
  | 'OVER_LEVERAGING'
  | 'STOP_LOSS_REMOVAL'
  | 'TILT_SPIRAL'
  | 'DRAWDOWN_PROXIMITY'
  | 'DISCIPLINE_EXCELLENCE';

export interface BehavioralSignal {
  id: string;
  type: SignalType;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  timestamp: string;
  headline: string;
  message: string;
  actionableRecommendation: string;
  metrics: Record<string, number | string>;
}

export interface TraderTiltMetrics {
  tiltScore: number; // 0 - 100
  consecutiveLosses: number;
  lotEscalationFactor: number; // e.g. 2.5x
  avgTradeHoldTimeSec: number;
  recentLossVelocityUsdPerMin: number;
  dailyBufferUsedPct: number;
  maxBufferUsedPct: number;
  remainingDailyLossUsd: number;
}

export type ArchetypeId =
  | 'NINETY_PERCENT_FINISHER'
  | 'TILT_REVENGE_TRADER'
  | 'OVER_LEVERAGER'
  | 'NEWS_GAMBLER'
  | 'DISCIPLINED_CONSISTENT';

export interface TraderArchetype {
  id: ArchetypeId;
  name: string;
  badge: string;
  badgeColor: string;
  description: string;
  psychologicalProfile: string;
  keyMistake: string;
  stats: {
    consistencyScore: number; // 0-100
    averageWinRate: number;    // %
    profitTargetProgress: number; // % reached
    ruleAdherenceRate: number; // %
  };
}

export interface TickDataPoint {
  timeOffsetMs: number; // -5000 to +5000 ms relative to execution
  timestamp: string;
  brokerBid: number;
  brokerAsk: number;
  referenceBid: number;
  referenceAsk: number;
  isExecutionPoint?: boolean;
}

export interface ExecutionFairnessAudit {
  id: string;
  accountNumber: string;
  breachTimestamp: string;
  breachRule: string;
  breachingTrade: ClosedTrade;
  fairnessScore: number; // e.g. 99.4
  brokerFillPrice: number;
  independentL1Mid: number;
  independentSpreadPips: number;
  brokerSpreadPips: number;
  spreadDeviationPips: number;
  verdict: 'VERIFIED_FAIR' | 'SLIGHT_VARIANCE' | 'EXECUTION_ANOMALY';
  verdictSummary: string;
  ticks: TickDataPoint[];
  lossAttribution: {
    riskSizingPct: number;
    adversePriceMovePct: number;
    spreadFrictionPct: number;
  };
  counterfactualSim: {
    breachAvoidedAtMaxRiskPct: number;
    simulatedFinalEquity: number;
    stillActive: boolean;
    differenceFromTargetPct: number;
    equityPoints: { tradeNum: number; actualEquity: number; simulatedEquity: number }[];
  };
}

export interface RetentionOffer {
  id: string;
  archetypeId: ArchetypeId;
  title: string;
  badge: string;
  discountPct: number;
  originalPriceUsd: number;
  discountedPriceUsd: number;
  couponCode: string;
  expiresInHours: number;
  perks: string[];
  guardrail: string;
  ctaText: string;
  highlightBenefit: string;
}

export interface PropFirmMetrics {
  activeTradersProtected: number;
  nudgesDeliveredToday: number;
  breachesAuditedThisMonth: number;
  supportTicketDeflectionRate: number; // %
  postBreachAuditViewRate: number;      // %
  retentionConversionRate: number;       // %
  repeatLtvRecapturedUsd: number;
  trustpilotComplaintDrop: number;      // %
}

export interface PropFirmAction {
  type: 'TIER_UPGRADE' | 'ADDON_UPGRADE' | 'RISK_DESK_ABOOK' | 'PROFIT_LOCK';
  title: string;
  badge: string;
  description: string;
  ctaText: string;
  firmRevenueImpactUsd: number;
  firmBenefit: string;
}

export type MessageDispatchTrigger =
  | 'DAILY_EOD_RECAP'
  | 'IMMEDIATE_BREACH_AUDIT'
  | 'IMMEDIATE_PASS_CONGRATS'
  | 'IMMEDIATE_CRITICAL_TILT';

export interface DailyEODDebrief {
  accountNumber: string;
  traderName: string;
  date: string;
  totalPnl: number;
  tradesCount: number;
  winRatePct: number;
  disciplineRating: 'A+' | 'B' | 'NEEDS_REST' | 'CAUTION';
  buddyMessage: string;
  eveningAdvice: string;
  memoryNoteRecorded?: string;
  firmActionOffer?: {
    title: string;
    discountPct: number;
    code: string;
    ctaText: string;
  };
}

export type OutboundIntegrationChannel =
  | 'KLAVIYO'
  | 'HUBSPOT'
  | 'CUSTOMER_IO'
  | 'DISCORD'
  | 'TELEGRAM'
  | 'CUSTOM_WEBHOOK';

export interface OutboundDispatchPayload {
  trigger: MessageDispatchTrigger;
  channel: OutboundIntegrationChannel;
  timestamp: string;
  accountNumber: string;
  traderName: string;
  recipientEmail: string;
  discordId?: string;
  subject: string;
  plainTextBody: string;
  htmlBody: string;
  recoveryUrl?: string;
  stats: {
    dailyPnl: number;
    tradesCount: number;
    accountStatus: string;
    archetype?: string;
  };
}

export interface FirmConfig {
  name: string;
  shortCode: string;
  portalDomain: string;
  supportEmail: string;
  primaryBroker: PlatformType;
  licenseTier: 'ENTERPRISE_PRIVATE_DEPLOYMENT' | 'REVENUE_SHARE_DEPLOYMENT';
  brandAccent: string;
}


