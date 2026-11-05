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
  AlertOctagon, 
  Sparkles, 
  ExternalLink,
  DollarSign,
  TrendingUp,
  RefreshCw,
  FileText
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

  // Pre-configured Scenarios
  const activeScenario = DEMO_SCENARIOS[2]; // Elena Rostova ($100k Active)
  const breachScenario = DEMO_SCENARIOS[0]; // Alex Vance ($100k Breached)
  const passScenario = DEMO_SCENARIOS[4] || DEMO_SCENARIOS[2]; // Sarah Lin ($100k Passed)

  const breachAudit = generateExecutionFairnessAudit(breachScenario.account, breachScenario.closedTrades);

  return (
    <div className="min-h-screen bg-[#090a0c] text-zinc-100 font-sans selection:bg-white/20 selection:text-white flex flex-col">
      
      {/* ======================================================== */}
      {/* 1. SINGLE UNIFIED HEADER (ZERO CLUTTER) */}
      {/* ======================================================== */}
      <header className="border-b border-white/[0.08] bg-[#0c0d10]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          
          {/* Brand */}
          <div className="flex items-center space-x-2.5 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="font-bold text-sm tracking-tight text-white">
              PropFirm OS
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-400">
              Live Sandbox
            </span>
          </div>

          {/* Clean 4-Tab Switcher */}
          <div className="flex items-center p-1 bg-zinc-900/90 rounded-xl border border-white/10 overflow-x-auto">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'active'
                  ? 'bg-zinc-800 text-white shadow-xs font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              1. Active Days
            </button>
            <button
              onClick={() => setActiveTab('breached')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'breached'
                  ? 'bg-rose-950/80 text-rose-200 border border-rose-500/30 shadow-xs font-semibold'
                  : 'text-zinc-400 hover:text-rose-300'
              }`}
            >
              2. On Breach (Audit &amp; Reset)
            </button>
            <button
              onClick={() => setActiveTab('passed')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'passed'
                  ? 'bg-indigo-950/80 text-indigo-200 border border-indigo-500/30 shadow-xs font-semibold'
                  : 'text-zinc-400 hover:text-indigo-300'
              }`}
            >
              3. On Pass (Upsell)
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/30 shadow-xs font-semibold'
                  : 'text-zinc-400 hover:text-emerald-300'
              }`}
            >
              Admin ROI
            </button>
          </div>

          {/* Link to 1-Page Teardown */}
          <Link
            href="/teardown"
            className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-zinc-300 transition-colors shrink-0"
          >
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            <span>1-Page Teardown</span>
          </Link>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. MAIN SANDBOX BODY (STRAIGHTFORWARD & HIGH IMPACT) */}
      {/* ======================================================== */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* ======================================================== */}
        {/* TAB 1: ACTIVE TRADING (QUIET MODE & DAILY ENCOURAGEMENT) */}
        {/* ======================================================== */}
        {activeTab === 'active' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
                  <span>MT5 Live</span>
                  <span>·</span>
                  <span>Account #92104</span>
                  <span>·</span>
                  <span className="text-emerald-400 font-semibold">Loop 01 Active</span>
                </div>
                <h1 className="text-xl font-bold text-white mt-1">
                  Active Trading: Quiet Session &amp; Personalized Support
                </h1>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 self-start sm:self-auto">
                Trader: Elena Rostova
              </span>
            </div>

            {/* Quiet Mode Banner */}
            <div className="p-4 rounded-2xl bg-[#121316] border border-white/[0.08] flex items-center space-x-3.5">
              <span className="text-xl shrink-0">🤫</span>
              <div>
                <span className="text-xs font-bold text-white block">
                  100% Silent In-Flight Mode
                </span>
                <span className="text-xs text-zinc-400 block mt-0.5">
                  Zero popups or distractions while the trader is managing live positions. Background webhook records fills silently.
                </span>
              </div>
            </div>

            {/* Core Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#121316] border border-white/[0.08]">
                <span className="text-[11px] text-zinc-400 font-mono uppercase block">Account Equity</span>
                <span className="text-2xl font-bold font-mono text-white mt-1 block">$103,680</span>
                <span className="text-[11px] text-zinc-500 font-mono mt-0.5 block">Starting: $100,000</span>
              </div>
              <div className="p-4 rounded-xl bg-[#121316] border border-white/[0.08]">
                <span className="text-[11px] text-zinc-400 font-mono uppercase block">Daily Loss Buffer Left</span>
                <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">$5,163</span>
                <span className="text-[11px] text-zinc-500 font-mono mt-0.5 block">Max daily limit: $5,000</span>
              </div>
              <div className="p-4 rounded-xl bg-[#121316] border border-white/[0.08]">
                <span className="text-[11px] text-zinc-400 font-mono uppercase block">Today&apos;s Net Profit</span>
                <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">+$3,680</span>
                <span className="text-[11px] text-zinc-500 font-mono mt-0.5 block">Phase 1 Target: +$8,000</span>
              </div>
            </div>

            {/* Tonight's Personalized Debrief Card */}
            <div className="p-5 rounded-2xl bg-[#121316] border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                  <Bot className="w-4 h-4" />
                  <span>Personalized 21:00 UTC Debrief (Sent to Trader&apos;s Telegram/Email)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                  Automated Output
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-white/[0.06] space-y-2 font-mono text-xs">
                <p className="text-zinc-200 leading-relaxed">
                  <span className="text-blue-400 font-bold">✓ Session Note:</span> Green day (+2.1% on EURUSD). Sizing held disciplined at 1.5 lots across 4 fills with zero revenge trading after news volatility.
                </p>
                <p className="text-zinc-300 italic pt-1 border-t border-white/[0.06] leading-relaxed">
                  &ldquo;You&apos;re 46% toward your Phase 1 target. Keep this exact risk execution rhythm tomorrow. <span className="text-emerald-400 font-semibold">[Scale Tier: Add $50k allocation]</span>&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 text-zinc-400">
                <span>Result for the Prop Firm:</span>
                <span className="text-white font-medium">Builds habitual daily retention + natural account upgrades</span>
              </div>
            </div>

            {/* Today's Executed Trades */}
            <div className="p-5 rounded-2xl bg-[#121316] border border-white/[0.08] space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                Today&apos;s Live MT5 Execution Telemetry ({activeScenario.closedTrades.length} Trades)
              </span>
              <div className="divide-y divide-white/[0.06]">
                {activeScenario.closedTrades.map((t) => (
                  <div key={t.id} className="py-2.5 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="font-bold text-white">{t.symbol}</span>
                      <span className="text-zinc-400 ml-2">· {t.side} · {t.lots} lots</span>
                      <span className="text-zinc-500 ml-2">({t.durationMinutes}m hold)</span>
                    </div>
                    <span className={`font-bold ${t.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
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
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
                  <span>MT5 Live</span>
                  <span>·</span>
                  <span>Account #88492</span>
                  <span>·</span>
                  <span className="text-rose-400 font-semibold">Daily Limit Reached</span>
                </div>
                <h1 className="text-xl font-bold text-white mt-1">
                  When a Trader Fails: Coaching, Proof &amp; 1-Click Fast-Track Reset
                </h1>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300 self-start sm:self-auto">
                Trader: Alex Vance
              </span>
            </div>

            {/* HERO CARD: THE 1-CLICK RESET & COACHING BREAKDOWN */}
            <div className="p-6 rounded-2xl bg-[#121316] border-2 border-emerald-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  Loop 02 · Recaptured Repeat Margin ($0 CAC)
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  Trigger: Daily Drawdown Limit
                </span>
              </div>

              {/* Personalized Strengths & Improvement Coaching */}
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-white/[0.06] space-y-2 font-mono text-xs">
                <div className="flex items-center space-x-1.5 text-emerald-400 text-[10px] uppercase font-bold tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Personalized Post-Breach Trade Log Breakdown</span>
                </div>
                <p className="text-zinc-200 leading-relaxed">
                  <span className="text-emerald-400 font-bold">✓ What You Did Well:</span> Maintained a strong 64% win rate across 18 London session trades with disciplined 1.0 lot risk sizing.
                </p>
                <p className="text-zinc-200 leading-relaxed">
                  <span className="text-amber-400 font-bold">⚠ Where To Improve:</span> Sizing jumped to 5.0 lots on ticket #849201 during CPI news volatility (audited fill: fair execution, no broker slippage).
                </p>
                <p className="text-zinc-300 italic pt-1 border-t border-white/[0.06]">
                  &ldquo;Your core market edge is intact. Eliminating this single news sizing spike is all you need to pass. Use your second-chance restart below.&rdquo;
                </p>
              </div>

              {/* Reset CTA Checkout */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Second-Chance Fast-Track Reset: Save 25%
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Pre-filled checkout while motivation is peak. Trader restarts instead of churning to a competitor.
                  </p>
                </div>

                <div className="flex items-center space-x-2.5 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => handleCopy('COOLDOWN25', setCopiedReset)}
                    className="px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <span>COOLDOWN25</span>
                    {copiedReset ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
                  </button>

                  <button
                    onClick={() => setResetSuccess(true)}
                    className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-md"
                  >
                    <span>{resetSuccess ? '✓ Challenge Reset Activated' : 'Reset Challenge ($295)'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {resetSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                  ✓ Success: New evaluation credentials generated for Alex Vance. $295 captured at $0 acquisition cost.
                </div>
              )}
            </div>

            {/* EXECUTION FAIRNESS BENCHMARK (KILLS DISPUTES) */}
            <div className="p-5 rounded-2xl bg-[#121316] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Execution Fairness Benchmark (Eliminates Chargebacks &amp; Trustpilot Claims)
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                  99.4% Match
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                When traders breach, they often blame the broker for spread widening. This audit benchmarks their fill against raw interbank liquidity feeds at the exact millisecond of the order:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
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
        {/* TAB 3: ON PASS (VERIFIED CERTIFICATE & $200K UPSELL) */}
        {/* ======================================================== */}
        {activeTab === 'passed' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
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
                <h1 className="text-xl font-bold text-white mt-1">
                  When a Trader Passes: Milestone Celebration &amp; Scaling Upsell
                </h1>
              </div>
              <button
                onClick={handleShareOnX}
                className="px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium border border-white/10 flex items-center space-x-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>{sharedOnX ? 'Shared to Twitter!' : 'Share on X (Free Viral Post)'}</span>
              </button>
            </div>

            {/* HERO CARD: PERSONALIZED PASS CELEBRATION & SCALING UPSELL */}
            <div className="p-6 rounded-2xl bg-[#121316] border-2 border-indigo-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                  Loop 03 · Phase Pass Milestone &amp; Scaling Upsell ($0 CAC)
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  Trigger: Profit Target Hit (+ $8,000)
                </span>
              </div>

              {/* Personalized Pass Milestone Message */}
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-white/[0.06] space-y-2 font-mono text-xs">
                <div className="flex items-center space-x-1.5 text-indigo-400 text-[10px] uppercase font-bold tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  <span>Personalized Phase Pass Notification Sent to Trader</span>
                </div>
                <p className="text-zinc-200 leading-relaxed">
                  <span className="text-indigo-300 font-bold">✓ Phase 1 Passed:</span> Cleared $8,000 profit target in 8 trading days with a 78% win rate and 2.4 profit factor across 34 executions.
                </p>
                <p className="text-zinc-200 leading-relaxed">
                  <span className="text-emerald-400 font-bold">✓ Risk Execution:</span> Outstanding drawdown discipline—maximum drawdown was contained at 1.2% (firm safety boundary was 5.0%).
                </p>
                <p className="text-zinc-300 italic pt-1 border-t border-white/[0.06]">
                  &ldquo;You&apos;re trading in peak flow. To reward your consistency, we&apos;ve unlocked an exclusive 25% scaling tier so you can add a <span className="text-white font-bold underline">$200,000 Master Evaluation</span> with 1 click before beginning Phase 2.&rdquo;
                </p>
              </div>

              {/* Upsell CTA Checkout */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Scale Allocation: $200,000 Master Evaluation (Save 25%)
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Capitalizes on peak trader confidence. Generates high-margin expansion revenue with zero extra ad spend.
                  </p>
                </div>

                <div className="flex items-center space-x-2.5 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => handleCopy('PASS25', setCopiedUpsell)}
                    className="px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <span>PASS25</span>
                    {copiedUpsell ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
                  </button>

                  <button
                    onClick={() => setUpsellSuccess(true)}
                    className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-md"
                  >
                    <span>{upsellSuccess ? '✓ $200k Upgrade Claimed' : 'Claim $200k Tier ($746)'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {upsellSuccess && (
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
                  ✓ Success: $200k Master Evaluation order placed for Sarah Lin. +$746 pure margin recaptured at $0 CAC.
                </div>
              )}
            </div>

            {/* VERIFIED PASS CREDENTIAL */}
            <div className="p-6 rounded-2xl bg-[#121316] border border-white/[0.08] text-center space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                Proprietary Trading Firm · Evaluation Verified
              </span>
              <h2 className="text-xl font-extrabold text-white">
                Certificate of Trading Excellence
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Awarded to Sarah Lin for completing Phase 1 with strict risk adherence.
              </p>

              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto font-mono text-xs pt-2">
                <div className="p-3 rounded-xl bg-zinc-900 border border-white/[0.04]">
                  <span className="text-zinc-500 text-[10px] block">PROFIT</span>
                  <span className="text-base font-bold text-emerald-400 block mt-1">+$8,000</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900 border border-white/[0.04]">
                  <span className="text-zinc-500 text-[10px] block">MAX DD</span>
                  <span className="text-base font-bold text-white block mt-1">1.2%</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900 border border-white/[0.04]">
                  <span className="text-zinc-500 text-[10px] block">WIN RATE</span>
                  <span className="text-base font-bold text-emerald-400 block mt-1">78%</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: ADMIN ROI (THE PROP FIRM CEO VIEW) */}
        {/* ======================================================== */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="pb-3 border-b border-white/[0.08]">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Prop Firm CEO Dashboard · Unit Economics
              </span>
              <h1 className="text-xl font-bold text-white mt-1">
                Recaptured Challenge Margin &amp; Churn Prevention
              </h1>
            </div>

            {/* Top 3 High-Level Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#121316] border border-emerald-500/30">
                <span className="text-[11px] text-zinc-400 font-mono uppercase block">Recaptured Margin ($0 CAC)</span>
                <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">+$8,850 <span className="text-xs text-zinc-400 font-normal">/ mo</span></span>
                <span className="text-[11px] text-zinc-500 font-mono mt-0.5 block">Defensive 12% reset rate (30 rebuys @ $295)</span>
              </div>
              <div className="p-4 rounded-xl bg-[#121316] border border-white/[0.08]">
                <span className="text-[11px] text-zinc-400 font-mono uppercase block">Dispute &amp; Chargeback Shield</span>
                <span className="text-2xl font-bold font-mono text-white mt-1 block">-38%</span>
                <span className="text-[11px] text-zinc-500 font-mono mt-0.5 block">Deflected by L1 tick execution fairness proof</span>
              </div>
              <div className="p-4 rounded-xl bg-[#121316] border border-white/[0.08]">
                <span className="text-[11px] text-zinc-400 font-mono uppercase block">Active Monitored Fleet</span>
                <span className="text-2xl font-bold font-mono text-white mt-1 block">650 Traders</span>
                <span className="text-[11px] text-zinc-500 font-mono mt-0.5 block">Mid-size firm cohort on MT5 / DXTrade / cTrader</span>
              </div>
            </div>

            {/* The Post-Breach Pipeline Funnel */}
            <div className="p-5 rounded-2xl bg-[#121316] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  Conservative Post-Breach Funnel (Sample 250 Breaches / Mo)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                  Defensive 12% Baseline
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-zinc-900 border border-white/[0.04]">
                  <span className="text-zinc-500 text-[10px] block">1. DRAWDOWN BREACHES</span>
                  <span className="text-base font-bold text-white mt-1 block">250 Accounts</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5 block">Hit daily or total max DD</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900 border border-white/[0.04]">
                  <span className="text-zinc-500 text-[10px] block">2. AUDIT VIEWED</span>
                  <span className="text-base font-bold text-blue-400 mt-1 block">180 (72%)</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5 block">Fair execution proof checked</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900 border border-white/[0.04]">
                  <span className="text-zinc-500 text-[10px] block">3. RESET CLICKED</span>
                  <span className="text-base font-bold text-amber-400 mt-1 block">55 (22%)</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5 block">1-click discount clicked</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                  <span className="text-emerald-400 text-[10px] font-bold block">4. PAID REBUYS (12%)</span>
                  <span className="text-base font-bold text-emerald-400 mt-1 block">30 Paid Resets</span>
                  <span className="text-[10px] text-emerald-300 mt-0.5 block">+$8,850 net margin</span>
                </div>
              </div>
            </div>

            {/* Conservative Operator Economics Breakdown */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="space-y-0.5">
                <span className="text-zinc-300 font-bold block">Defensive Unit Economics for Prop Firm Operators:</span>
                <span className="text-zinc-400 block">
                  30 reset rebuys × $295 = <span className="text-emerald-400 font-semibold">+$8,850/mo</span> in zero-acquisition profit. For fleets with 1,000 breaches/mo, the same 12% rate yields <span className="text-white font-semibold">+$35,400/mo</span>.
                </span>
              </div>
              <span className="shrink-0 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                100% Net Margin
              </span>
            </div>

            {/* Live Accounts Feed */}
            <div className="p-5 rounded-2xl bg-[#121316] border border-white/[0.08] space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                Live Fleet Activity &amp; Automated Engine Dispatches
              </span>
              <div className="divide-y divide-white/[0.06] text-xs font-mono">
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">Alex Vance</span>
                    <span className="text-zinc-400 ml-2">#88492 · MT5</span>
                  </div>
                  <span className="text-rose-400 font-semibold">Fast-Track Reset Dispatched (Pending $295)</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">Sarah Lin</span>
                    <span className="text-zinc-400 ml-2">#55219 · MT5</span>
                  </div>
                  <span className="text-indigo-400 font-semibold">Passed: $200k Upgrade Converted (+$746)</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">Marcus Thorne</span>
                    <span className="text-zinc-400 ml-2">#39102 · DXTrade</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">Dispute Deflected: Execution Audit Proved Fair L1 Spread</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">Elena Rostova</span>
                    <span className="text-zinc-400 ml-2">#92104 · cTrader</span>
                  </div>
                  <span className="text-zinc-400 font-semibold">Active: Silent In-Flight Mode (Debrief at 21:00 UTC)</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ======================================================== */}
      {/* 3. MINIMAL FOOTER */}
      {/* ======================================================== */}
      <footer className="border-t border-white/[0.06] py-4 bg-[#0a0b0d]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500 font-mono">
          <span>PropFirm OS · White-Label Retention Bridge</span>
          <span>MT5 · cTrader · DXTrade Compatible · 48-Hour Webhook Setup</span>
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
