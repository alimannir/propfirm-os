'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  ShieldCheck, 
  ArrowRight, 
  Copy, 
  Check, 
  Share2, 
  Trophy, 
  Award,
  Bot, 
  Sparkles, 
  DollarSign,
  TrendingUp,
  RefreshCw,
  FileText,
  Sliders,
  Mail,
  Terminal,
  Zap,
  CheckCircle2,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { DEMO_SCENARIOS, INITIAL_PROP_FIRM_METRICS } from '@/engine/scenarios';
import { generateExecutionFairnessAudit } from '@/engine/auditor';

export type SandboxTab = 'active' | 'breached' | 'passed' | 'admin';

function SandboxApp() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as SandboxTab | null;
  const viewParam = searchParams.get('view');
  const modeParam = searchParams.get('mode');

  const getInitialTab = (): SandboxTab => {
    if (tabParam && ['active', 'breached', 'passed', 'admin'].includes(tabParam)) {
      return tabParam;
    }
    if (viewParam === 'admin') return 'admin';
    if (modeParam === 'trader_breached') return 'breached';
    if (modeParam === 'trader_passed') return 'passed';
    return 'active';
  };

  const [activeTab, setActiveTab] = useState<SandboxTab>(getInitialTab);
  const [copiedReset, setCopiedReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [copiedUpsell, setCopiedUpsell] = useState(false);
  const [upsellSuccess, setUpsellSuccess] = useState(false);
  const [sharedOnX, setSharedOnX] = useState(false);
  const [activeScaleAdded, setActiveScaleAdded] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  // Tab 1: Channel Mode (Telegram vs Email vs Webhook)
  const [activeChannel, setActiveChannel] = useState<'telegram' | 'email' | 'webhook'>('telegram');

  // Tab 2: Channel Mode & Breach Scenario Switcher
  const [breachChannel, setBreachChannel] = useState<'telegram' | 'email' | 'webhook'>('telegram');
  const [breachScenarioIdx, setBreachScenarioIdx] = useState<number>(0); // 0 = Alex Vance, 1 = Marcus Reed

  // Tab 3: Channel Mode & Scaling Tier Selector
  const [passChannel, setPassChannel] = useState<'certificate' | 'telegram' | 'twitter'>('certificate');
  const [selectedTier, setSelectedTier] = useState<'150k' | '200k' | '300k'>('200k');

  // Tab 4: Interactive ROI Calculator State
  const [calcBreaches, setCalcBreaches] = useState(250);
  const [calcPrice, setCalcPrice] = useState(295);
  const [calcRecaptureRate, setCalcRecaptureRate] = useState(12);
  const [adminLogFilter, setAdminLogFilter] = useState<'all' | 'resets' | 'upsells' | 'audits'>('all');

  const calcResets = Math.round(calcBreaches * (calcRecaptureRate / 100));
  const calcMonthlyMargin = calcResets * calcPrice;
  const calcAnnualMargin = calcMonthlyMargin * 12;
  const calcDeflectedDisputes = Math.round(calcBreaches * 0.38);

  // Sync tab when search params change
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [tabParam, viewParam, modeParam]);

  const handleCopy = (text: string, setter: (val: boolean) => void) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    }
  };

  const handleShareOnX = () => {
    if (typeof window !== 'undefined') {
      const text = encodeURIComponent(
        `Phase 1 evaluation officially passed with 78% win rate and zero rule breaches! Next stop: Phase 2. 🚀`
      );
      window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
      setSharedOnX(true);
    }
  };

  // Scenarios Data
  const activeScenario = DEMO_SCENARIOS[2]; // Elena Rostova ($100k Active)
  const breachScenario = DEMO_SCENARIOS[breachScenarioIdx]; // Alex Vance (0) or Marcus Reed (1)
  const passScenario = DEMO_SCENARIOS[4] || DEMO_SCENARIOS[2]; // Sarah Lin ($100k Passed)

  const breachAudit = generateExecutionFairnessAudit(breachScenario.account, breachScenario.closedTrades);

  // Upsell Tier Configuration for Tab 3
  const UPSELL_TIERS = {
    '150k': {
      title: '$150k Expansion Tier',
      size: '$150,000',
      regularPrice: 595,
      discountPrice: 446,
      savings: 149,
      margin: 446,
      tag: 'Scale Position Size'
    },
    '200k': {
      title: '$200k Master Evaluation',
      size: '$200,000',
      regularPrice: 995,
      discountPrice: 746,
      savings: 249,
      margin: 746,
      tag: 'Most Popular'
    },
    '300k': {
      title: '$300k Elite Multi-Account',
      size: '$300,000',
      regularPrice: 1495,
      discountPrice: 1121,
      savings: 374,
      margin: 1121,
      tag: 'Maximum Allocation'
    }
  };

  const currentUpsellTier = UPSELL_TIERS[selectedTier];

  return (
    <div className="min-h-screen bg-[#090a0c] text-zinc-100 font-sans selection:bg-white/20 selection:text-white flex flex-col w-full max-w-full overflow-x-hidden">
      
      {/* ======================================================== */}
      {/* 1. SINGLE UNIFIED HEADER (ADAPTIVE DESKTOP & MOBILE) */}
      {/* ======================================================== */}
      <header className="border-b border-white/[0.08] bg-[#0c0d10]/95 backdrop-blur-md sticky top-0 z-50 w-full">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-0 sm:h-14 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          
          {/* Top Row on Mobile: Brand Header */}
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex items-center space-x-2 shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-sm tracking-tight text-white">
                PropFirm OS
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-400">
                Interactive Sandbox
              </span>
            </div>

            <div className="flex sm:hidden items-center space-x-1.5 text-[10px] font-mono text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Broker Sync Live</span>
            </div>
          </div>

          {/* Clean 4-Tab Switcher: 4 equal columns on mobile */}
          <div className="grid grid-cols-4 sm:flex items-center p-1 bg-zinc-900/90 rounded-xl border border-white/10 w-full sm:w-auto text-center gap-1">
            <button
              onClick={() => setActiveTab('active')}
              className={`min-w-0 px-1 sm:px-3 py-1.5 sm:py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center ${
                activeTab === 'active'
                  ? 'bg-zinc-800 text-white shadow-xs font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span className="sm:hidden">Active</span>
              <span className="hidden sm:inline">1. Active Days</span>
            </button>
            <button
              onClick={() => setActiveTab('breached')}
              className={`min-w-0 px-1 sm:px-3 py-1.5 sm:py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center ${
                activeTab === 'breached'
                  ? 'bg-rose-950/80 text-rose-200 border border-rose-500/30 shadow-xs font-semibold'
                  : 'text-zinc-400 hover:text-rose-300'
              }`}
            >
              <span className="sm:hidden">Breach</span>
              <span className="hidden sm:inline">2. On Breach</span>
            </button>
            <button
              onClick={() => setActiveTab('passed')}
              className={`min-w-0 px-1 sm:px-3 py-1.5 sm:py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center ${
                activeTab === 'passed'
                  ? 'bg-indigo-950/80 text-indigo-200 border border-indigo-500/30 shadow-xs font-semibold'
                  : 'text-zinc-400 hover:text-indigo-300'
              }`}
            >
              <span className="sm:hidden">Pass</span>
              <span className="hidden sm:inline">3. On Pass</span>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`min-w-0 px-1 sm:px-3 py-1.5 sm:py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center ${
                activeTab === 'admin'
                  ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/30 shadow-xs font-semibold'
                  : 'text-zinc-400 hover:text-emerald-300'
              }`}
            >
              <span className="sm:hidden">Admin</span>
              <span className="hidden sm:inline">Admin ROI</span>
            </button>
          </div>

        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. MAIN SANDBOX BODY */}
      {/* ======================================================== */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-8 min-w-0 max-w-full overflow-x-hidden">
        
        {/* ======================================================== */}
        {/* TAB 1: ACTIVE TRADING (QUIET MODE & DAILY ENCOURAGEMENT) */}
        {/* ======================================================== */}
        {activeTab === 'active' && (
          <div className="space-y-4 sm:space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
                  <span>MT5 Live Telemetry</span>
                  <span>·</span>
                  <span>Account #92104</span>
                  <span>·</span>
                  <span className="text-emerald-400 font-semibold">Loop 01 Active</span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-white mt-1 leading-snug">
                  Active Trading: Quiet Session &amp; Personalized Support
                </h1>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 self-start sm:self-auto">
                Trader: Elena Rostova
              </span>
            </div>

            {/* Quiet Mode Banner */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#121316] border border-white/[0.08] flex items-center space-x-3.5">
              <span className="text-xl shrink-0">🤫</span>
              <div>
                <span className="text-xs font-bold text-white block">
                  100% Silent In-Flight Mode
                </span>
                <span className="text-[11px] sm:text-xs text-zinc-400 block mt-0.5">
                  Zero popups or distractions while the trader is managing live positions. Background webhook records fills silently and prepares the 21:00 UTC debrief.
                </span>
              </div>
            </div>

            {/* Core Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#121316] border border-white/[0.08]">
                <span className="text-[11px] text-zinc-400 font-mono uppercase block">Account Equity</span>
                <span className="text-2xl font-bold font-mono text-white mt-1 block">$103,680</span>
                <span className="text-[11px] text-zinc-500 font-mono mt-0.5 block">Starting Balance: $100,000</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#121316] border border-white/[0.08]">
                <span className="text-[11px] text-zinc-400 font-mono uppercase block">Daily Loss Buffer Left</span>
                <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">$5,163</span>
                <span className="text-[11px] text-zinc-500 font-mono mt-0.5 block">Max daily limit: $5,000</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#121316] border border-white/[0.08]">
                <span className="text-[11px] text-zinc-400 font-mono uppercase block">Today&apos;s Net Profit</span>
                <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">+$3,680</span>
                <span className="text-[11px] text-zinc-500 font-mono mt-0.5 block">Phase 1 Target: +$8,000 (46%)</span>
              </div>
            </div>

            {/* INTERACTIVE CHANNEL SWITCHER FOR ACTIVE DEBRIEF */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#121316] border border-emerald-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 items-start sm:items-center">
                <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                  <Bot className="w-4 h-4 shrink-0" />
                  <span>Interactive Channel Preview: 21:00 UTC Debrief</span>
                </div>
                
                {/* Channel Switcher Buttons */}
                <div className="flex items-center p-0.5 bg-zinc-900 rounded-lg border border-white/10 text-[10px] sm:text-xs font-mono max-w-full overflow-x-auto shrink-0">
                  <button
                    onClick={() => setActiveChannel('telegram')}
                    className={`px-2 sm:px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 sm:space-x-1.5 cursor-pointer shrink-0 ${
                      activeChannel === 'telegram'
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>Telegram</span>
                  </button>
                  <button
                    onClick={() => setActiveChannel('email')}
                    className={`px-2 sm:px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 sm:space-x-1.5 cursor-pointer shrink-0 ${
                      activeChannel === 'email'
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="sm:hidden">Email</span>
                    <span className="hidden sm:inline">Email Digest</span>
                  </button>
                  <button
                    onClick={() => setActiveChannel('webhook')}
                    className={`px-2 sm:px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 sm:space-x-1.5 cursor-pointer shrink-0 ${
                      activeChannel === 'webhook'
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Terminal className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="sm:hidden">Webhook</span>
                    <span className="hidden sm:inline">MT5 Webhook</span>
                  </button>
                </div>
              </div>

              {/* TELEGRAM VIEW */}
              {activeChannel === 'telegram' && (
                <div className="p-4 rounded-xl bg-[#0f1115] border border-white/[0.08] space-y-3 font-mono">
                  <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-white/[0.06] pb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                        TG
                      </div>
                      <span className="font-semibold text-white">PropFirm Bot</span>
                      <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.2 rounded font-sans">verified</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">21:00 UTC</span>
                  </div>

                  <div className="text-xs text-zinc-200 space-y-2 leading-relaxed">
                    <p className="font-semibold text-white">
                      Elena, today&apos;s London/NY session recap is ready:
                    </p>
                    <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-white/[0.04] space-y-1 text-[11px]">
                      <p><span className="text-emerald-400 font-bold">✓ Net Profit:</span> +$3,680 across 4 disciplined EURUSD fills</p>
                      <p><span className="text-blue-400 font-bold">✓ Risk Score:</span> 98/100 · Sizing strictly adhered at 1.5 lots baseline</p>
                      <p><span className="text-zinc-300 font-bold">✓ Target Pace:</span> 46% of Phase 1 completed ($3,680 / $8,000)</p>
                    </div>
                    <p className="italic text-zinc-300 text-[11px]">
                      &ldquo;Zero tilt after 14:30 news volatility. Maintain this exact risk execution tomorrow.&rdquo;
                    </p>
                  </div>

                  {/* Interactive Telegram Inline Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => setActiveScaleAdded(true)}
                      className="px-3 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{activeScaleAdded ? '✓ $50k Add-On Offer Sent' : '⚡ Scale Tier: Add $50k Allocation'}</span>
                    </button>
                    <button
                      onClick={() => handleCopy("EURUSD +$3,680 (4 fills, 1.5 lots baseline, zero tilt)", setCopiedReset)}
                      className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10 text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{copiedReset ? 'Copied to Clipboard' : 'Copy Debrief'}</span>
                    </button>
                  </div>

                  {activeScaleAdded && (
                    <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px]">
                      ✓ Simulated Bot Action: Elena received an instant checkout link to add a $50k evaluation tier to her current account at a 20% loyalty rate.
                    </div>
                  )}
                </div>
              )}

              {/* EMAIL VIEW */}
              {activeChannel === 'email' && (
                <div className="p-4 rounded-xl bg-[#0f1115] border border-white/[0.08] space-y-3 font-mono text-xs">
                  <div className="space-y-1 pb-2 border-b border-white/[0.06] text-[11px] text-zinc-400">
                    <p><span className="text-zinc-500">From:</span> PropFirm Risk Team &lt;debrief@firm.com&gt;</p>
                    <p><span className="text-zinc-500">To:</span> elena.rostova@tradermail.io</p>
                    <p><span className="text-zinc-500">Subject:</span> Elena, Day 4 Performance Note: EURUSD Execution (+3.68%)</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900/80 border border-white/[0.04] space-y-2 text-[11px] text-zinc-300">
                    <p className="font-semibold text-white">Daily Performance Evaluation Summary:</p>
                    <p>Starting: $100,000 → Current Equity: <span className="text-emerald-400 font-bold">$103,680</span></p>
                    <p>Total Drawdown Used Today: <span className="text-white font-bold">0.0%</span> (Buffer: $5,163 remaining)</p>
                    <p className="text-zinc-400">
                      Recommendation: Your London breakout entry on EURUSD was well-timed. As you approach the 50% milestone, keep sizing capped at 1.5 lots.
                    </p>
                  </div>
                </div>
              )}

              {/* RAW WEBHOOK VIEW */}
              {activeChannel === 'webhook' && (
                <div className="p-4 rounded-xl bg-black border border-white/[0.08] space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pb-1 border-b border-white/[0.06]">
                    <span>POST /api/v1/trader-events (MT5 EA Telemetry)</span>
                    <button
                      onClick={() => handleCopy(JSON.stringify({
                        event: "DAILY_SESSION_SUMMARY",
                        account: 92104,
                        platform: "MT5",
                        equity: 103680,
                        session_pnl: 3680,
                        trades: 4,
                        action: "DISPATCH_QUIET_DEBRIEF",
                        churn_risk: "LOW"
                      }, null, 2), setCopiedWebhook)}
                      className="text-zinc-400 hover:text-white flex items-center space-x-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedWebhook ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                  </div>
                  <pre className="text-[11px] text-emerald-400 overflow-x-auto p-2">
{`{
  "event": "DAILY_SESSION_SUMMARY",
  "timestamp": "2026-11-05T21:00:00Z",
  "account": 92104,
  "platform": "MT5",
  "equity": 103680.00,
  "session_pnl": 3680.00,
  "daily_buffer_remaining": 5163.00,
  "trades_executed": 4,
  "action_dispatched": "QUIET_DEBRIEF",
  "churn_risk_score": 0.04
}`}
                  </pre>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] sm:text-xs pt-1 text-zinc-400">
                <span>Result for the Prop Firm:</span>
                <span className="text-white font-medium">Builds habitual daily retention + natural account upgrades with 0 added support headcount</span>
              </div>
            </div>

            {/* Today's Executed Trades */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#121316] border border-white/[0.08] space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                Today&apos;s Live MT5 Execution Telemetry ({activeScenario.closedTrades.length} Trades)
              </span>
              <div className="divide-y divide-white/[0.06]">
                {activeScenario.closedTrades.map((t) => (
                  <div key={t.id} className="py-2.5 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="font-bold text-white">{t.symbol}</span>
                      <span className="text-zinc-400 ml-1.5 sm:ml-2">· {t.side} · {t.lots} lots</span>
                      <span className="text-zinc-500 ml-1.5 sm:ml-2">({t.durationMinutes}m hold)</span>
                    </div>
                    <span className={`font-bold shrink-0 ml-2 ${t.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {t.pnl >= 0 ? '+' : '-'}${Math.abs(t.pnl).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ON BREACH (THE RECAPTURE ENGINE & FAST-TRACK RESET) */}
        {/* ======================================================== */}
        {activeTab === 'breached' && (
          <div className="space-y-4 sm:space-y-6">
            
            {/* Header + Interactive Scenario Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
                  <span>{breachScenario.account.platform} Live</span>
                  <span>·</span>
                  <span>Account #{breachScenario.account.accountNumber}</span>
                  <span>·</span>
                  <span className="text-rose-400 font-semibold">Daily Limit Reached</span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-white mt-1 leading-snug">
                  When a Trader Fails: Coaching, Proof &amp; 1-Click Fast-Track Reset
                </h1>
              </div>

              {/* Interactive Test Scenario Switcher */}
              <div className="flex items-center space-x-2 self-start sm:self-auto">
                <span className="text-[11px] font-mono text-zinc-500">Test Account:</span>
                <button
                  onClick={() => {
                    setBreachScenarioIdx(breachScenarioIdx === 0 ? 1 : 0);
                    setResetSuccess(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-xs font-mono text-zinc-300 flex items-center space-x-1.5 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3 h-3 text-zinc-400" />
                  <span>{breachScenario.account.traderName} ({breachScenario.account.platform})</span>
                </button>
              </div>
            </div>

            {/* HERO CARD: THE 1-CLICK RESET & COACHING BREAKDOWN */}
            <div className="p-4 sm:p-6 rounded-2xl bg-[#121316] border-2 border-emerald-500/40 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 items-start sm:items-center">
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  Loop 02 · Recaptured Repeat Margin ($0 CAC)
                </span>

                {/* Channel Switcher */}
                <div className="flex items-center p-0.5 bg-zinc-900 rounded-lg border border-white/10 text-[10px] sm:text-xs font-mono max-w-full overflow-x-auto shrink-0">
                  <button
                    onClick={() => setBreachChannel('telegram')}
                    className={`px-2 sm:px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 sm:space-x-1.5 cursor-pointer shrink-0 ${
                      breachChannel === 'telegram'
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>Telegram</span>
                  </button>
                  <button
                    onClick={() => setBreachChannel('email')}
                    className={`px-2 sm:px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 sm:space-x-1.5 cursor-pointer shrink-0 ${
                      breachChannel === 'email'
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>Email</span>
                  </button>
                  <button
                    onClick={() => setBreachChannel('webhook')}
                    className={`px-2 sm:px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 sm:space-x-1.5 cursor-pointer shrink-0 ${
                      breachChannel === 'webhook'
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Terminal className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>Webhook</span>
                  </button>
                </div>
              </div>

              {/* TELEGRAM CHANNEL VIEW */}
              {breachChannel === 'telegram' && (
                <div className="p-4 rounded-xl bg-[#0f1115] border border-white/[0.08] space-y-3 font-mono">
                  <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-white/[0.06] pb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-[10px]">
                        TG
                      </div>
                      <span className="font-semibold text-white">PropFirm Risk Desk</span>
                      <span className="text-[10px] bg-rose-500/10 text-rose-400 px-1.5 py-0.2 rounded font-sans">breach event</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">13:45 UTC</span>
                  </div>

                  <div className="text-xs text-zinc-200 space-y-2 leading-relaxed">
                    <p className="font-semibold text-white">
                      {breachScenario.account.traderName.split(' ')[0]}, account #{breachScenario.account.accountNumber} hit the daily drawdown limit (-$5,200).
                    </p>
                    <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-white/[0.04] space-y-1 text-[11px]">
                      <p>
                        <span className="text-emerald-400 font-bold">✓ What You Did Well:</span> {breachScenario.account.memory?.knownStrengths?.[0] || 'Maintained a strong 64% London win rate with disciplined 1.0 lot baseline risk.'}
                      </p>
                      <p>
                        <span className="text-amber-400 font-bold">⚠ Where You Slipped:</span> {breachScenario.account.memory?.knownKryptonite?.[0] || 'News sizing spike jumped to 5.0 lots on ticket #849201.'}
                      </p>
                      <p>
                        <span className="text-blue-400 font-bold">🛡️ Fairness Audit:</span> Fill matched interbank spread (no broker markup).
                      </p>
                    </div>
                    <p className="italic text-zinc-300 text-[11px]">
                      &ldquo;Your edge is proven. Eliminating this single news spike is all you need to pass. Use your 25% second-chance restart below.&rdquo;
                    </p>
                  </div>

                  {/* Inline Telegram Action Button */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => setResetSuccess(true)}
                      className="px-4 py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-md"
                    >
                      <span>{resetSuccess ? '✓ Challenge Reset Activated' : '⚡ Claim 25% Reset ($295)'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleCopy('COOLDOWN25', setCopiedReset)}
                      className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10 text-xs font-mono flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <span>COOLDOWN25</span>
                      {copiedReset ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-500" />}
                    </button>
                  </div>
                </div>
              )}

              {/* EMAIL CHANNEL VIEW */}
              {breachChannel === 'email' && (
                <div className="p-4 rounded-xl bg-[#0f1115] border border-white/[0.08] space-y-3 font-mono text-xs">
                  <div className="space-y-1 pb-2 border-b border-white/[0.06] text-[11px] text-zinc-400">
                    <p><span className="text-zinc-500">From:</span> PropFirm Risk &amp; Support &lt;support@firm.com&gt;</p>
                    <p><span className="text-zinc-500">To:</span> {breachScenario.account.email}</p>
                    <p><span className="text-zinc-500">Subject:</span> {breachScenario.account.traderName.split(' ')[0]}, Account #{breachScenario.account.accountNumber} Audit &amp; Fast-Track Restart</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900/80 border border-white/[0.04] space-y-2 text-[11px] text-zinc-300">
                    <p className="font-semibold text-white">Post-Breach Execution Review:</p>
                    <p>• Daily Loss Limit Triggered on {breachScenario.closedTrades[breachScenario.closedTrades.length - 1]?.symbol || 'XAUUSD'}</p>
                    <p>• Verified Millisecond L1 Match: <span className="text-emerald-400 font-semibold">99.4% execution fairness score</span></p>
                    <p className="text-zinc-400">
                      We know setbacks happen. We have pre-credited code <span className="text-white font-bold">COOLDOWN25</span> to your portal for an instant 25% discount restart.
                    </p>
                  </div>
                </div>
              )}

              {/* WEBHOOK CHANNEL VIEW */}
              {breachChannel === 'webhook' && (
                <div className="p-4 rounded-xl bg-black border border-white/[0.08] space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pb-1 border-b border-white/[0.06]">
                    <span>POST /api/v1/breach-event (MT5/DXTrade Hook)</span>
                    <button
                      onClick={() => handleCopy(JSON.stringify({
                        event: "RULE_BREACH_DAILY_LIMIT",
                        account: breachScenario.account.accountNumber,
                        trader: breachScenario.account.traderName,
                        broker_fill_price: breachAudit.brokerFillPrice,
                        verdict: "VERIFIED_FAIR_SPREAD",
                        coupon: "COOLDOWN25",
                        reset_price: 295
                      }, null, 2), setCopiedWebhook)}
                      className="text-zinc-400 hover:text-white flex items-center space-x-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedWebhook ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                  </div>
                  <pre className="text-[11px] text-rose-400 overflow-x-auto p-2">
{`{
  "event": "RULE_BREACH_DAILY_LIMIT",
  "account": "${breachScenario.account.accountNumber}",
  "trader": "${breachScenario.account.traderName}",
  "platform": "${breachScenario.account.platform}",
  "broker_fill": ${breachAudit.brokerFillPrice},
  "interbank_ref": ${breachAudit.independentL1Mid},
  "fairness_match": "99.4%",
  "broker_markup_detected": false,
  "retention_offer": {
    "code": "COOLDOWN25",
    "discount_pct": 25,
    "reset_price_usd": 295
  }
}`}
                  </pre>
                </div>
              )}

              {/* Interactive Reset Success Banner */}
              {resetSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-mono space-y-1 animate-fade-in">
                  <div className="flex items-center space-x-2 font-bold text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>✓ Second-Chance Challenge Reset Activated</span>
                  </div>
                  <p className="text-[11px] text-zinc-300">
                    New MT5 credentials generated for {breachScenario.account.traderName} (Account #{Number(breachScenario.account.accountNumber) + 18}). <span className="text-emerald-400 font-bold">+$295 pure margin recaptured at $0 CAC</span>.
                  </p>
                </div>
              )}
            </div>

            {/* EXECUTION FAIRNESS BENCHMARK (KILLS CHARGEBACKS) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#121316] border border-white/[0.08] space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 items-start sm:items-center">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Execution Fairness Benchmark (Eliminates Chargebacks)
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold shrink-0">
                  99.4% Match
                </span>
              </div>

              <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
                When traders breach, they often blame the broker for spread widening. This audit benchmarks their fill against raw interbank liquidity feeds at the exact millisecond of the order:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.04]">
                  <span className="text-zinc-500 text-[10px] block">BROKER FILL PRICE</span>
                  <span className="text-base font-bold text-white mt-1 block">{breachAudit.brokerFillPrice}</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5 block">Spread: {breachAudit.brokerSpreadPips} pips</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.04]">
                  <span className="text-zinc-500 text-[10px] block">INTERBANK FEED</span>
                  <span className="text-base font-bold text-white mt-1 block">{breachAudit.independentL1Mid}</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5 block">Reference: {breachAudit.independentSpreadPips} pips</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                  <span className="text-emerald-400 text-[10px] font-bold block">VERDICT</span>
                  <span className="text-base font-bold text-emerald-400 mt-1 block">Verified Fair Spread</span>
                  <span className="text-[10px] text-zinc-300 mt-0.5 block">No broker markup detected</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: ON PASS (VERIFIED CERTIFICATE & SCALING UPSELL) */}
        {/* ======================================================== */}
        {activeTab === 'passed' && (
          <div className="space-y-4 sm:space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
                  <span>MT5 Live</span>
                  <span>·</span>
                  <span>Account #55219</span>
                  <span>·</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" /> Profit Target Reached (+$8,000)
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-white mt-1 leading-snug">
                  When a Trader Passes: Milestone Celebration &amp; Scaling Upsell
                </h1>
              </div>

              {/* Share on X button */}
              <button
                onClick={handleShareOnX}
                className="px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium border border-white/10 flex items-center space-x-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>{sharedOnX ? 'Shared to Twitter!' : 'Share on X (Free Viral Post)'}</span>
              </button>
            </div>

            {/* HERO CARD: PERSONALIZED PASS CELEBRATION & SCALING UPSELL */}
            <div className="p-4 sm:p-6 rounded-2xl bg-[#121316] border-2 border-indigo-500/40 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 items-start sm:items-center">
                <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                  Loop 03 · Phase Pass Milestone &amp; Scaling Upsell ($0 CAC)
                </span>

                {/* Channel Switcher */}
                <div className="flex items-center p-0.5 bg-zinc-900 rounded-lg border border-white/10 text-[10px] sm:text-xs font-mono max-w-full overflow-x-auto shrink-0">
                  <button
                    onClick={() => setPassChannel('certificate')}
                    className={`px-2 sm:px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 sm:space-x-1.5 cursor-pointer shrink-0 ${
                      passChannel === 'certificate'
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="sm:hidden">Cert</span>
                    <span className="hidden sm:inline">Certificate</span>
                  </button>
                  <button
                    onClick={() => setPassChannel('telegram')}
                    className={`px-2 sm:px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 sm:space-x-1.5 cursor-pointer shrink-0 ${
                      passChannel === 'telegram'
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>Telegram</span>
                  </button>
                  <button
                    onClick={() => setPassChannel('twitter')}
                    className={`px-2 sm:px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 sm:space-x-1.5 cursor-pointer shrink-0 ${
                      passChannel === 'twitter'
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="sm:hidden">Twitter</span>
                    <span className="hidden sm:inline">Twitter Post</span>
                  </button>
                </div>
              </div>

              {/* Personalized Pass Milestone Message */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-900/90 border border-white/[0.06] space-y-2 font-mono text-[11px] sm:text-xs">
                <div className="flex items-center space-x-1.5 text-indigo-400 text-[10px] uppercase font-bold tracking-wider">
                  <Award className="w-3.5 h-3.5 shrink-0" />
                  <span>Personalized Phase Pass Notification Sent to Trader</span>
                </div>
                <p className="text-zinc-200 leading-relaxed">
                  <span className="text-indigo-300 font-bold">✓ Phase 1 Passed:</span> Cleared $8,000 profit target in 8 trading days with a 78% win rate and 2.4 profit factor across 34 executions.
                </p>
                <p className="text-zinc-200 leading-relaxed">
                  <span className="text-emerald-400 font-bold">✓ Risk Execution:</span> Outstanding drawdown discipline—maximum drawdown was contained at 1.2% (firm safety boundary was 5.0%).
                </p>
                <p className="text-zinc-300 italic pt-1 border-t border-white/[0.06] leading-relaxed">
                  &ldquo;You&apos;re trading in peak flow. To reward your consistency, we&apos;ve unlocked an exclusive 25% scaling tier so you can scale into higher allocation with 1 click before beginning Phase 2.&rdquo;
                </p>
              </div>

              {/* INTERACTIVE SCALING TIER SELECTOR */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                  Select Scaling Tier Upgrade (Trader View):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(['150k', '200k', '300k'] as const).map((tierKey) => {
                    const tier = UPSELL_TIERS[tierKey];
                    const isSelected = selectedTier === tierKey;
                    return (
                      <button
                        key={tierKey}
                        onClick={() => {
                          setSelectedTier(tierKey);
                          setUpsellSuccess(false);
                        }}
                        className={`p-3 rounded-xl border text-left font-mono transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-950/40 border-indigo-400 ring-1 ring-indigo-400/50'
                            : 'bg-zinc-900/80 border-white/[0.08] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{tier.size}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                            {tier.tag}
                          </span>
                        </div>
                        <div className="mt-2 flex items-baseline space-x-1.5">
                          <span className="text-base font-bold text-white">${tier.discountPrice}</span>
                          <span className="text-xs text-zinc-500 line-through">${tier.regularPrice}</span>
                          <span className="text-[10px] text-emerald-400 font-semibold">Save 25%</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upsell CTA Checkout */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Claim {currentUpsellTier.title} (${currentUpsellTier.discountPrice})
                  </h3>
                  <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                    Pre-fills coupon PASS25 while trader confidence is peak. Generates zero-acquisition expansion margin.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 w-full sm:w-auto pt-1 sm:pt-0">
                  <button
                    onClick={() => handleCopy('PASS25', setCopiedUpsell)}
                    className="w-full sm:w-auto px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <span>PASS25</span>
                    {copiedUpsell ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
                  </button>

                  <button
                    onClick={() => setUpsellSuccess(true)}
                    className="w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-md"
                  >
                    <span>{upsellSuccess ? `✓ ${currentUpsellTier.size} Upgrade Claimed` : `Claim ${currentUpsellTier.size} ($${currentUpsellTier.discountPrice})`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {upsellSuccess && (
                <div className="p-3.5 rounded-xl bg-indigo-950/50 border border-indigo-500/40 text-indigo-300 text-xs font-mono space-y-1 animate-fade-in">
                  <div className="flex items-center space-x-2 font-bold text-white">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    <span>✓ Expansion Order Placed Successfully</span>
                  </div>
                  <p className="text-[11px] text-zinc-300">
                    Sarah Lin purchased the {currentUpsellTier.title}. <span className="text-emerald-400 font-bold">+${currentUpsellTier.margin} pure margin recaptured at $0 CAC</span>.
                  </p>
                </div>
              )}
            </div>

            {/* CHANNEL PREVIEW: CERTIFICATE VS TWITTER POST */}
            {passChannel === 'certificate' && (
              <div className="p-4 sm:p-6 rounded-2xl bg-[#121316] border border-white/[0.08] text-center space-y-3 sm:space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                  Proprietary Trading Firm · Evaluation Verified
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  Certificate of Trading Excellence
                </h2>
                <p className="text-[11px] sm:text-xs text-zinc-400 font-mono">
                  Awarded to Sarah Lin for completing Phase 1 with strict risk adherence.
                </p>

                <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto font-mono text-xs pt-2">
                  <div className="p-2.5 sm:p-3 rounded-xl bg-zinc-900 border border-white/[0.04]">
                    <span className="text-zinc-500 text-[10px] block">PROFIT</span>
                    <span className="text-sm sm:text-base font-bold text-emerald-400 block mt-1">+$8,000</span>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-xl bg-zinc-900 border border-white/[0.04]">
                    <span className="text-zinc-500 text-[10px] block">MAX DD</span>
                    <span className="text-sm sm:text-base font-bold text-white block mt-1">1.2%</span>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-xl bg-zinc-900 border border-white/[0.04]">
                    <span className="text-zinc-500 text-[10px] block">WIN RATE</span>
                    <span className="text-sm sm:text-base font-bold text-emerald-400 block mt-1">78%</span>
                  </div>
                </div>
              </div>
            )}

            {passChannel === 'twitter' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0f1115] border border-white/[0.08] space-y-3 font-mono">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-xs">
                    SL
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-white text-xs">Sarah Lin</span>
                      <span className="text-[11px] text-zinc-500">@sarah_trades · 2h</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-sans">Funded Futures &amp; FX Trader</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-200 leading-relaxed font-sans">
                  Phase 1 evaluation officially passed on @PropFirm in 8 days! 🚀 78% win rate, 1.2% max drawdown. Cleanest spreads in the prop industry. Just claimed the $200k Master tier for Phase 2!
                </p>

                <div className="p-3 rounded-xl bg-zinc-900/90 border border-emerald-500/20 text-center space-y-1">
                  <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block">
                    [ Attached Certificate Preview ]
                  </span>
                  <span className="text-xs font-bold text-white block">Sarah Lin · Phase 1 Verified</span>
                  <span className="text-[10px] text-zinc-400 block">+$8,000 Profit · 1.2% Max Drawdown</span>
                </div>

                <div className="text-[11px] text-zinc-400 pt-1 border-t border-white/[0.06] flex items-center justify-between">
                  <span>Viral Result for the Prop Firm:</span>
                  <span className="text-white font-medium">Free organic word-of-mouth acquisition on Twitter &amp; Discord</span>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: ADMIN ROI (THE INTERACTIVE FLEET CALCULATOR) */}
        {/* ======================================================== */}
        {activeTab === 'admin' && (
          <div className="space-y-4 sm:space-y-6">
            
            {/* Header */}
            <div className="pb-3 border-b border-white/[0.08]">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
                Prop Firm CEO Dashboard · Unit Economics
              </span>
              <h1 className="text-base sm:text-xl font-bold text-white mt-1 leading-snug break-words">
                Recaptured Challenge Margin &amp; Churn Prevention
              </h1>
            </div>

            {/* INTERACTIVE FLEET UNIT ECONOMICS CALCULATOR */}
            <div className="p-3.5 sm:p-6 rounded-2xl bg-[#121316] border-2 border-emerald-500/40 space-y-4 sm:space-y-5 w-full max-w-full overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 items-start sm:items-center w-full min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                    <Sliders className="w-4 h-4 shrink-0" />
                    <span>Interactive Fleet Calculator</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                    Drag the sliders below to see your firm&apos;s recaptured margin in real time:
                  </p>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 min-w-0">
                  <button
                    onClick={() => {
                      setCalcBreaches(250);
                      setCalcPrice(295);
                      setCalcRecaptureRate(12);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-mono transition-colors cursor-pointer shrink-0 ${
                      calcBreaches === 250 && calcRecaptureRate === 12
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                        : 'bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    Conservative (250)
                  </button>
                  <button
                    onClick={() => {
                      setCalcBreaches(600);
                      setCalcPrice(295);
                      setCalcRecaptureRate(15);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-mono transition-colors cursor-pointer shrink-0 ${
                      calcBreaches === 600 && calcRecaptureRate === 15
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                        : 'bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    Mid-Size (600)
                  </button>
                  <button
                    onClick={() => {
                      setCalcBreaches(1500);
                      setCalcPrice(345);
                      setCalcRecaptureRate(18);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-mono transition-colors cursor-pointer shrink-0 ${
                      calcBreaches === 1500 && calcRecaptureRate === 18
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                        : 'bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    Enterprise (1,500)
                  </button>
                </div>
              </div>

              {/* 3 Interactive Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 font-mono">
                {/* Slider 1: Monthly Breaches */}
                <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 uppercase text-[10px]">Monthly Breaches</span>
                    <span className="font-bold text-white">{calcBreaches.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="2000"
                    step="25"
                    value={calcBreaches}
                    onChange={(e) => setCalcBreaches(Number(e.target.value))}
                    className="w-full accent-emerald-400 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span>50</span>
                    <span>1,000</span>
                    <span>2,000</span>
                  </div>
                </div>

                {/* Slider 2: Reset Price */}
                <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 uppercase text-[10px]">Reset Fee ($)</span>
                    <span className="font-bold text-white">${calcPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="99"
                    max="695"
                    step="10"
                    value={calcPrice}
                    onChange={(e) => setCalcPrice(Number(e.target.value))}
                    className="w-full accent-emerald-400 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span>$99</span>
                    <span>$395</span>
                    <span>$695</span>
                  </div>
                </div>

                {/* Slider 3: Recapture Conversion Rate */}
                <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 uppercase text-[10px]">Recapture Rate (%)</span>
                    <span className="font-bold text-emerald-400">{calcRecaptureRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={calcRecaptureRate}
                    onChange={(e) => setCalcRecaptureRate(Number(e.target.value))}
                    className="w-full accent-emerald-400 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span>5% (Floor)</span>
                    <span>15%</span>
                    <span>30%</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Recaptured Margin Banner */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block">
                    Calculated Pure Margin Recaptured ($0 Added CAC)
                  </span>
                  <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white">
                      +${calcMonthlyMargin.toLocaleString()}
                    </span>
                    <span className="text-xs text-emerald-300">/ mo</span>
                    <span className="text-zinc-500 text-xs hidden sm:inline">·</span>
                    <span className="text-xs text-zinc-300 block sm:inline">
                      +${calcAnnualMargin.toLocaleString()} / year run rate
                    </span>
                  </div>
                </div>
                <div className="text-left sm:text-right text-xs text-zinc-400 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/[0.06]">
                  <span className="block text-white font-semibold">{calcResets} Churned Traders Saved</span>
                  <span className="text-[11px] text-zinc-500">~{calcDeflectedDisputes} chargebacks deflected</span>
                </div>
              </div>
            </div>

            {/* DYNAMIC PIPELINE FUNNEL (TIED TO SLIDERS) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#121316] border border-white/[0.08] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 items-start sm:items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  Post-Breach Retention Pipeline (Live Model for {calcBreaches} Breaches)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold shrink-0">
                  {calcRecaptureRate}% Conversion Rate
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 font-mono text-xs">
                <div className="p-2.5 sm:p-3 rounded-xl bg-zinc-900 border border-white/[0.04]">
                  <span className="text-zinc-500 text-[10px] block">1. DRAWDOWN BREACHES</span>
                  <span className="text-sm sm:text-base font-bold text-white mt-1 block">
                    {calcBreaches.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-0.5 block">Hit max DD limit</span>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-zinc-900 border border-white/[0.04]">
                  <span className="text-zinc-500 text-[10px] block">2. AUDIT VIEWED</span>
                  <span className="text-sm sm:text-base font-bold text-blue-400 mt-1 block">
                    {Math.round(calcBreaches * 0.72).toLocaleString()} (72%)
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-0.5 block">Execution proof checked</span>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-zinc-900 border border-white/[0.04]">
                  <span className="text-zinc-500 text-[10px] block">3. RESET CLICKED</span>
                  <span className="text-sm sm:text-base font-bold text-amber-400 mt-1 block">
                    {Math.round(calcBreaches * 0.22).toLocaleString()} (22%)
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-0.5 block">1-click discount viewed</span>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                  <span className="text-emerald-400 text-[10px] font-bold block">4. PAID RESETS</span>
                  <span className="text-sm sm:text-base font-bold text-emerald-400 mt-1 block">
                    {calcResets.toLocaleString()} Resets
                  </span>
                  <span className="text-[10px] text-emerald-300 mt-0.5 block">+${calcMonthlyMargin.toLocaleString()} net margin</span>
                </div>
              </div>
            </div>

            {/* Operator Unit Economics Takeaway */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 text-[11px] sm:text-xs font-mono">
              <div className="space-y-0.5">
                <span className="text-zinc-300 font-bold block">Why This Outperforms Paid Ads:</span>
                <span className="text-zinc-400 block leading-relaxed">
                  You already paid $40–$80 CAC to acquire each trader through affiliate marketing or ads. Recapturing {calcResets} of them at ${calcPrice} generates pure bottom-line profit without spending another dollar on ads.
                </span>
              </div>
              <span className="shrink-0 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                100% Net Margin
              </span>
            </div>

            {/* Interactive Fleet Activity Log with Filters */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#121316] border border-white/[0.08] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 items-start sm:items-center">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                  Live Fleet Activity &amp; Automated Engine Dispatches
                </span>

                {/* Filter Pills */}
                <div className="flex items-center space-x-1.5 text-[11px] font-mono">
                  <button
                    onClick={() => setAdminLogFilter('all')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      adminLogFilter === 'all' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setAdminLogFilter('resets')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      adminLogFilter === 'resets' ? 'bg-zinc-800 text-rose-300 font-bold' : 'text-zinc-500 hover:text-rose-300'
                    }`}
                  >
                    Resets
                  </button>
                  <button
                    onClick={() => setAdminLogFilter('upsells')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      adminLogFilter === 'upsells' ? 'bg-zinc-800 text-indigo-300 font-bold' : 'text-zinc-500 hover:text-indigo-300'
                    }`}
                  >
                    Upsells
                  </button>
                  <button
                    onClick={() => setAdminLogFilter('audits')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      adminLogFilter === 'audits' ? 'bg-zinc-800 text-emerald-300 font-bold' : 'text-zinc-500 hover:text-emerald-300'
                    }`}
                  >
                    Audits
                  </button>
                </div>
              </div>

              <div className="divide-y divide-white/[0.06] text-[11px] sm:text-xs font-mono">
                {(adminLogFilter === 'all' || adminLogFilter === 'resets') && (
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <span className="font-bold text-white">Alex Vance</span>
                      <span className="text-zinc-400 ml-2">#88492 · MT5</span>
                    </div>
                    <span className="text-rose-400 font-semibold break-words">Fast-Track Reset Dispatched (Pending ${calcPrice})</span>
                  </div>
                )}
                {(adminLogFilter === 'all' || adminLogFilter === 'upsells') && (
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <span className="font-bold text-white">Sarah Lin</span>
                      <span className="text-zinc-400 ml-2">#55219 · MT5</span>
                    </div>
                    <span className="text-indigo-400 font-semibold break-words">Passed: $200k Upgrade Converted (+${currentUpsellTier.discountPrice})</span>
                  </div>
                )}
                {(adminLogFilter === 'all' || adminLogFilter === 'audits') && (
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <span className="font-bold text-white">Marcus Thorne</span>
                      <span className="text-zinc-400 ml-2">#39102 · DXTrade</span>
                    </div>
                    <span className="text-emerald-400 font-semibold break-words">Dispute Deflected: Audit Proved Fair L1 Spread</span>
                  </div>
                )}
                {(adminLogFilter === 'all') && (
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <span className="font-bold text-white">Elena Rostova</span>
                      <span className="text-zinc-400 ml-2">#92104 · cTrader</span>
                    </div>
                    <span className="text-zinc-400 font-semibold break-words">Active: Silent In-Flight Mode (Debrief at 21:00 UTC)</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ======================================================== */}
      {/* 3. MINIMAL FOOTER */}
      {/* ======================================================== */}
      <footer className="border-t border-white/[0.06] py-4 bg-[#0a0b0d] w-full overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-zinc-500 font-mono text-center sm:text-left">
          <span>PropFirm OS · White-Label Retention Bridge</span>
          <span className="break-all sm:break-normal">MT5 · cTrader · DXTrade · 48-Hour Webhook Setup</span>
        </div>
      </footer>

    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#090a0c]" />}>
      <SandboxApp />
    </Suspense>
  );
}