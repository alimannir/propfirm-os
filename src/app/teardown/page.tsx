'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Download, 
  Copy, 
  Check, 
  Sun, 
  Moon, 
  Database,
  GitBranch,
  Bot,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  Smartphone,
  Monitor,
  Lock,
  Unlock,
  Key
} from 'lucide-react';

export default function TeardownPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [layoutFormat, setLayoutFormat] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedTouch1, setCopiedTouch1] = useState(false);
  const [copiedTouch1Alt, setCopiedTouch1Alt] = useState(false);
  const [copiedTouch2, setCopiedTouch2] = useState(false);
  const [isExportMode, setIsExportMode] = useState(false);
  
  // Operator Authentication Gate State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('export') === '1') {
        setIsExportMode(true);
      }
      if (params.get('theme') === 'light') {
        setTheme('light');
      }
      if (params.get('format') === 'mobile' || (!params.get('format') && window.innerWidth < 768)) {
        setLayoutFormat('mobile');
      }

      // Check URL secret passcodes: ?pass=8849, ?key=8849, ?admin=8849 or ?admin=1
      const passParam = params.get('pass') || params.get('key') || params.get('admin');
      const validPasscodes = ['8849', 'propfirm2026', 'admin', '1'];

      if (params.get('lock') === '1') {
        localStorage.removeItem('propfirm_operator_auth');
        setIsAuthenticated(false);
        return;
      }

      if (passParam && validPasscodes.includes(passParam)) {
        localStorage.setItem('propfirm_operator_auth', 'true');
        setIsAuthenticated(true);
      } else if (localStorage.getItem('propfirm_operator_auth') === 'true') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = ['8849', 'propfirm2026', 'admin'];
    if (valid.includes(passcodeInput.trim())) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('propfirm_operator_auth', 'true');
      }
      setIsAuthenticated(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  const handleLock = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('propfirm_operator_auth');
      setIsAuthenticated(false);
      setPasscodeInput('');
    }
  };

  // Optimized High-Converting Scripts (Under 50 words · Peer-to-peer · Zero agency fluff)
  const touch1Copy = `Hey [Name] — quick question:

When a trader blows their 1st challenge on your MT5, what % actually buy a reset vs churn to another firm?

Mapped out a 1-page visual teardown showing how 3 trade-event loops turn that dropoff into repeat margin at $0 CAC. Cool if I drop the image here?`;

  const touch1AltCopy = `Hey [Name] — when a trader breaches drawdown on your MT5 and complains about broker slippage, how are you guys handling the dispute so they reset instead of filing a chargeback?

Put together a clean 1-page breakdown showing how to automate the fair execution audit + 1-click reset. Mind if I send the image over?`;

  const touch2Copy = `[Name] — here's the 1-page breakdown:

(Attached image)

Spun up an interactive sandbox where you can test the 1-click breach reset and fair fill benchmark here:
👉 https://propfirm-os-abst.vercel.app/?tab=breached

Worth an 8-minute walkthrough Thursday or Friday to show you how this plugs into your broker feed with zero dev work on your end?`;

  const handleCopy = (text: string, setter: (val: boolean) => void) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    }
  };

  const isDark = theme === 'dark';

  // ========================================================
  // 1. DESKTOP / LANDSCAPE GRAPHIC (3-Column Tree)
  // Best for Email, Web, Desktop Slack/Telegram
  // ========================================================
  const DesktopTreeGraphic = () => (
    <div 
      id="teardown-canvas-desktop"
      className={`w-full max-w-[1240px] mx-auto p-6 md:p-8 rounded-3xl border transition-colors shadow-2xl relative ${
        isDark 
          ? 'bg-[#0d0f12] border-white/10 shadow-black/80 text-white' 
          : 'bg-white border-slate-200/90 shadow-slate-200/60 text-slate-900'
      }`}
    >
      {/* Top Header Badge */}
      <div className="text-center mb-5">
        <div className={`inline-flex items-center space-x-2 px-3 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider mb-2 ${
          isDark ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-slate-100 text-slate-700 border border-slate-200'
        }`}>
          <GitBranch className="w-3.5 h-3.5 text-blue-400" />
          <span>Prop Firm Unit Economics · 1-Page Teardown</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Fixing the 1st-Challenge Acquisition Leak
        </h1>
        <p className={`text-xs md:text-sm mt-0.5 max-w-2xl mx-auto font-mono ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
          How Personalized Broker Trade Data Turns 90% Churn into Repeat $0 CAC Margin
        </p>
      </div>

      {/* THE PROBLEM ROW: THE ACQUISITION TRAP */}
      <div className={`p-3.5 rounded-2xl border mb-5 ${
        isDark ? 'bg-[#14161a] border-red-500/20' : 'bg-red-50/40 border-red-200'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded bg-red-500/10 text-red-400 font-mono text-[10px] uppercase font-bold tracking-wider">
              The Industry Problem
            </span>
            <span className={`text-xs font-semibold ${isDark ? 'text-zinc-300' : 'text-slate-800'}`}>
              The 1st-Challenge Churn Trap (Why Paid CAC Gets Wasted)
            </span>
          </div>
          <span className="text-[10px] font-mono opacity-60 hidden sm:inline">
            Standard Prop Firm Setup
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className={`p-2.5 rounded-xl border flex items-center space-x-2.5 ${
            isDark ? 'bg-[#1a1c21] border-white/[0.06]' : 'bg-white border-slate-200'
          }`}>
            <span className="text-base shrink-0">💸</span>
            <div>
              <span className="text-xs font-bold block">1. Expensive Paid CAC</span>
              <span className={`text-[10px] leading-tight block ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Heavy ad spend on Meta, YouTube &amp; crypto affiliates.
              </span>
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center space-x-2.5 ${
            isDark ? 'bg-[#1a1c21] border-white/[0.06]' : 'bg-white border-slate-200'
          }`}>
            <span className="text-base shrink-0">💥</span>
            <div>
              <span className="text-xs font-bold block">2. 90% Breach Rate</span>
              <span className={`text-[10px] leading-tight block ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Most traders fail their first challenge within 14 days.
              </span>
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center space-x-2.5 ${
            isDark ? 'bg-red-950/20 border-red-500/30 text-red-200' : 'bg-red-50 border-red-300 text-red-900'
          }`}>
            <span className="text-base shrink-0">🚪</span>
            <div>
              <span className="text-xs font-bold block">3. 100% Churn Cliff</span>
              <span className={`text-[10px] leading-tight block ${isDark ? 'text-red-300/80' : 'text-red-700'}`}>
                Blames slippage, closes tab, buys next challenge from competitor.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* THE FIX: REAL-TIME BROKER INGESTION ENGINE */}
      <div className="flex flex-col items-center">
        <div className={`px-5 py-2.5 rounded-2xl border shadow-md flex items-center space-x-4 max-w-2xl w-full justify-between ${
          isDark ? 'bg-[#181a20] border-emerald-500/30' : 'bg-emerald-50/60 border-emerald-300'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-400">
                  The Retention Solution
                </span>
                <span className="text-[10px] font-mono px-1.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                  &lt; 25ms Webhook
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold block">
                Plugs MT5 · cTrader · DXTrade Logs into 3 Automated Loops
              </span>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end text-[10px] font-mono opacity-75">
            <span>Ticket IDs · Volume Lots</span>
            <span>Fill Slippage · Trailing DD</span>
          </div>
        </div>

        {/* 3-Way Tree Branching Connector (SVG) */}
        <div className="w-full h-10 my-0.5 max-w-[1100px]">
          <svg viewBox="0 0 900 40" className="w-full h-full" fill="none">
            <path d="M 450 0 L 450 14" stroke={isDark ? '#52525b' : '#94a3b8'} strokeWidth="2" />
            <path d="M 450 14 Q 450 24 300 24 L 170 24 Q 150 24 150 34" stroke={isDark ? '#52525b' : '#94a3b8'} strokeWidth="2" strokeDasharray="3 3" />
            <polygon points="150,38 146,30 154,30" fill={isDark ? '#71717a' : '#94a3b8'} />
            <path d="M 450 14 L 450 34" stroke={isDark ? '#34d399' : '#059669'} strokeWidth="2.5" />
            <polygon points="450,38 446,30 454,30" fill={isDark ? '#34d399' : '#059669'} />
            <path d="M 450 14 Q 450 24 600 24 L 730 24 Q 750 24 750 34" stroke={isDark ? '#818cf8' : '#4f46e5'} strokeWidth="2" strokeDasharray="3 3" />
            <polygon points="750,38 746,30 754,30" fill={isDark ? '#818cf8' : '#4f46e5'} />
          </svg>
        </div>
      </div>

      {/* THE 3 LIFECYCLE LOOPS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        
        {/* LOOP 1: ACTIVE TRADING */}
        <div className="flex flex-col justify-between space-y-2.5">
          <div className="text-center">
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
              isDark ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}>
              Loop 01 · Active Days (Encouragement &amp; Upsells)
            </span>
          </div>

          <div className={`p-3 rounded-xl border flex items-center space-x-2.5 ${
            isDark ? 'bg-[#15171b] border-white/[0.08]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 shrink-0 text-sm">🤫</div>
            <div>
              <span className="text-xs font-bold block">1. 100% Silent In-Flight</span>
              <span className={`text-[10px] leading-tight block ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                Zero popups or distractions during open market hours.
              </span>
            </div>
          </div>

          <div className={`p-3 rounded-xl border flex items-center space-x-2.5 ${
            isDark ? 'bg-[#15171b] border-white/[0.08]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 shrink-0 text-sm">💬</div>
            <div>
              <span className="text-xs font-bold block">2. Words of Encouragement</span>
              <span className={`text-[10px] leading-tight block ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                Contextual support citing their real trades, plus periodic scaling upsells.
              </span>
            </div>
          </div>

          <div className={`p-3 rounded-xl border font-mono text-[10px] ${
            isDark ? 'bg-zinc-900/90 border-zinc-700 text-zinc-300' : 'bg-slate-100 border-slate-300 text-slate-800'
          }`}>
            <div className="flex items-center space-x-1.5 mb-1 opacity-60 text-[9px] uppercase font-bold tracking-wider">
              <Bot className="w-3 h-3" />
              <span>Personalized Session Note &amp; Tier Upgrade</span>
            </div>
            <div className="space-y-1 text-[10px] leading-relaxed">
              <p>
                <span className={`font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>✓ Session Note:</span> Green day (+2.1% on EURUSD). Sizing held at 1.5 lots across 4 fills with zero revenge trading.
              </p>
              <p className={`italic pt-0.5 border-t ${isDark ? 'border-zinc-700/40' : 'border-slate-300'}`}>
                &ldquo;You&apos;re 40% toward Phase 1 target. Keep this exact risk rhythm tomorrow. <span className={`font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>[Scale Tier: Add $50k allocation]</span>&rdquo;
              </p>
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border text-center ${
            isDark ? 'bg-zinc-900/40 border-zinc-800 text-zinc-300' : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            <span className="text-xs font-bold block">✓ Long-Term Loyalty &amp; Upsells</span>
            <span className="text-[10px] opacity-75 font-mono">Keeps trader engaged and buying higher tiers</span>
          </div>
        </div>

        {/* LOOP 2: ON BREACH */}
        <div className="flex flex-col justify-between space-y-2.5">
          <div className="text-center">
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
              isDark ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}>
              Loop 02 · On Breach (Support &amp; Recapture)
            </span>
          </div>

          <div className={`p-3 rounded-xl border flex items-center space-x-2.5 ${
            isDark ? 'bg-[#15171b] border-emerald-500/30' : 'bg-white border-emerald-300 shadow-xs'
          }`}>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 text-sm">🛡️</div>
            <div>
              <span className="text-xs font-bold block">1. Fair Execution Proof</span>
              <span className={`text-[10px] leading-tight block ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                Proves there was <strong>no unfair slippage</strong> using raw tick feed data.
              </span>
            </div>
          </div>

          <div className={`p-3 rounded-xl border flex items-center space-x-2.5 ${
            isDark ? 'bg-[#15171b] border-emerald-500/30' : 'bg-white border-emerald-300 shadow-xs'
          }`}>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 text-sm">⚡</div>
            <div>
              <span className="text-xs font-bold block">2. Strengths &amp; Improvement Coaching</span>
              <span className={`text-[10px] leading-tight block ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                Highlights what they nailed, where to improve, and 1-click fast-track restart.
              </span>
            </div>
          </div>

          <div className={`p-3 rounded-xl border font-mono text-[10px] ${
            isDark ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
          }`}>
            <div className={`flex items-center space-x-1.5 mb-1 opacity-80 text-[9px] uppercase font-bold tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
              <ShieldCheck className="w-3 h-3" />
              <span>Personalized Post-Breach Coaching &amp; Reset</span>
            </div>
            <div className="space-y-1 text-[10px] leading-relaxed">
              <p>
                <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>✓ Strong run:</span> 64% win rate across 18 London trades with disciplined 1.0 lots.
              </p>
              <p>
                <span className={`font-bold ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>⚠ To improve:</span> Sizing jumped to 5.0 lots on #849201 during CPI (audited: no broker slippage).
              </p>
              <p className={`italic pt-0.5 border-t ${isDark ? 'border-emerald-500/20' : 'border-emerald-200'}`}>
                &ldquo;Fix that one news leak and you pass. Tap here to reset in 1 click.&rdquo;
              </p>
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border-2 text-center ${
            isDark ? 'bg-emerald-950/20 border-emerald-400/50 text-white' : 'bg-emerald-50 border-emerald-500 text-slate-900 shadow-sm'
          }`}>
            <span className="text-xs font-bold block text-emerald-400">💰 Pure Margin Recaptured ($0 CAC)</span>
            <span className={`text-[10px] font-mono ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
              Converts a churned trader into an instant repeat sale
            </span>
          </div>
        </div>

        {/* LOOP 3: ON PASS */}
        <div className="flex flex-col justify-between space-y-2.5">
          <div className="text-center">
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
              isDark ? 'bg-indigo-950/40 text-indigo-300 border border-indigo-500/30' : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
            }`}>
              Loop 03 · Phase Passed (Milestone &amp; Upsell)
            </span>
          </div>

          <div className={`p-3 rounded-xl border flex items-center space-x-2.5 ${
            isDark ? 'bg-[#15171b] border-indigo-500/30' : 'bg-white border-indigo-300 shadow-xs'
          }`}>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 text-sm">🏆</div>
            <div>
              <span className="text-xs font-bold block">1. Verified Performance Milestone</span>
              <span className={`text-[10px] leading-tight block ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                Celebrates passing with exact win rate, profit factor &amp; days taken.
              </span>
            </div>
          </div>

          <div className={`p-3 rounded-xl border flex items-center space-x-2.5 ${
            isDark ? 'bg-[#15171b] border-indigo-500/30' : 'bg-white border-indigo-300 shadow-xs'
          }`}>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 text-sm">📈</div>
            <div>
              <span className="text-xs font-bold block">2. Strategic Capital Tier Upsell</span>
              <span className={`text-[10px] leading-tight block ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                Prompts immediate scale-up to larger funded tiers at peak confidence.
              </span>
            </div>
          </div>

          <div className={`p-3 rounded-xl border font-mono text-[10px] ${
            isDark ? 'bg-indigo-950/30 border-indigo-500/40 text-indigo-200' : 'bg-indigo-50/80 border-indigo-300 text-indigo-950'
          }`}>
            <div className={`flex items-center space-x-1.5 mb-1 opacity-80 text-[9px] uppercase font-bold tracking-wider ${isDark ? 'text-indigo-400' : 'text-indigo-800'}`}>
              <Award className="w-3 h-3" />
              <span>Personalized Phase Pass &amp; Scaling Offer</span>
            </div>
            <div className="space-y-1 text-[10px] leading-relaxed">
              <p>
                <span className={`font-bold ${isDark ? 'text-indigo-300' : 'text-indigo-800'}`}>✓ Phase 1 Passed:</span> Cleared in 8 days with a 68% win rate and 2.1 profit factor across 34 trades.
              </p>
              <p className={`italic pt-0.5 border-t ${isDark ? 'border-indigo-500/20' : 'border-indigo-200'}`}>
                &ldquo;You&apos;re trading in peak flow. Tap here to upgrade to the <span className={`font-bold underline ${isDark ? 'text-white' : 'text-slate-900'}`}>$200k Master tier</span> with 1 click before starting Phase 2.&rdquo;
              </p>
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border text-center ${
            isDark ? 'bg-indigo-950/20 border-indigo-400/40 text-indigo-200' : 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-sm'
          }`}>
            <span className="text-xs font-bold block text-indigo-400">🚀 Maximized Trader LTV &amp; Expansion</span>
            <span className={`text-[10px] font-mono ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
              Monetizes high-confidence passing traders with $0 added CAC
            </span>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className={`mt-5 pt-3 border-t flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs ${
        isDark ? 'border-white/10' : 'border-slate-200'
      }`}>
        <div className="flex items-center space-x-2">
          <span className={`font-mono font-bold uppercase text-[9px] px-2 py-0.5 rounded ${
            isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-slate-800 border border-slate-200'
          }`}>
            Plug &amp; Play Architecture
          </span>
          <span className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
            Direct API &amp; Webhook integration for MT5, cTrader, and DXTrade.
          </span>
        </div>
        <div className="font-mono text-[10px] opacity-60 shrink-0">
          48-Hour Deployment
        </div>
      </div>
    </div>
  );

  // ========================================================
  // 2. MOBILE / PORTRAIT GRAPHIC (Vertical Stack)
  // Perfectly optimized for Twitter DMs, Telegram Mobile, WhatsApp
  // Large readable text without pinch-to-zoom!
  // ========================================================
  const MobilePortraitGraphic = () => (
    <div 
      id="teardown-canvas-mobile"
      className={`w-full max-w-[620px] mx-auto p-6 rounded-3xl border transition-colors shadow-2xl relative space-y-4 ${
        isDark 
          ? 'bg-[#0d0f12] border-white/10 shadow-black/80 text-white' 
          : 'bg-white border-slate-200/90 shadow-slate-200/60 text-slate-900'
      }`}
    >
      {/* Top Header Badge */}
      <div className="text-center pb-1">
        <div className={`inline-flex items-center space-x-2 px-3 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider mb-2 ${
          isDark ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-slate-100 text-slate-700 border border-slate-200'
        }`}>
          <GitBranch className="w-3.5 h-3.5 text-blue-400" />
          <span>Prop Firm Unit Economics · Mobile Teardown</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Fixing the 1st-Challenge Acquisition Leak
        </h1>
        <p className={`text-xs mt-1 font-mono ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
          How Personalized Broker Trade Data Turns 90% Churn into Repeat $0 CAC Margin
        </p>
      </div>

      {/* THE PROBLEM CARD (VERTICAL COMPACT) */}
      <div className={`p-3.5 rounded-2xl border ${
        isDark ? 'bg-[#14161a] border-red-500/20' : 'bg-red-50/40 border-red-200'
      }`}>
        <div className="flex items-center justify-between mb-2.5">
          <span className="p-1 rounded bg-red-500/10 text-red-400 font-mono text-[10px] uppercase font-bold tracking-wider">
            The Industry Problem: Why Paid CAC Is Wasted
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className={`p-2.5 rounded-xl border flex items-center space-x-3 ${
            isDark ? 'bg-[#1a1c21] border-white/[0.06]' : 'bg-white border-slate-200'
          }`}>
            <span className="text-base shrink-0">💸</span>
            <div className="leading-snug">
              <span className="font-bold block">1. Expensive Upfront Paid CAC</span>
              <span className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Heavy ad spend on Meta, YouTube &amp; crypto affiliates.</span>
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center space-x-3 ${
            isDark ? 'bg-[#1a1c21] border-white/[0.06]' : 'bg-white border-slate-200'
          }`}>
            <span className="text-base shrink-0">💥</span>
            <div className="leading-snug">
              <span className="font-bold block">2. 90% Fail First Challenge</span>
              <span className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Most traders breach their account in the first 14 days.</span>
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center space-x-3 ${
            isDark ? 'bg-red-950/30 border-red-500/30 text-red-200' : 'bg-red-50 border-red-300 text-red-900'
          }`}>
            <span className="text-base shrink-0">🚪</span>
            <div className="leading-snug">
              <span className="font-bold block">3. 100% Churn Cliff</span>
              <span className={`text-[11px] ${isDark ? 'text-red-300/80' : 'text-red-700'}`}>Blames slippage, closes tab, buys next challenge from competitor.</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONNECTOR ARROW */}
      <div className="flex flex-col items-center justify-center -my-1">
        <div className={`w-0.5 h-3 ${isDark ? 'bg-zinc-700' : 'bg-slate-300'}`} />
        <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border shadow-xs ${
          isDark ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          The Solution: Live Broker Data Loops (&lt;25ms)
        </span>
        <div className={`w-0.5 h-3 ${isDark ? 'bg-zinc-700' : 'bg-slate-300'}`} />
      </div>

      {/* LOOP 01: ACTIVE DAYS */}
      <div className={`p-4 rounded-2xl border space-y-2.5 ${
        isDark ? 'bg-[#14161a] border-white/10' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
            isDark ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-slate-200 text-slate-800'
          }`}>
            Loop 01 · Active Days (Encouragement &amp; Upsell)
          </span>
          <span className="text-xs font-mono opacity-60">100% Silent In-Flight</span>
        </div>

        <div className={`p-3 rounded-xl border font-mono text-[11px] ${
          isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-300' : 'bg-white border-slate-300 text-slate-800'
        }`}>
          <div className="flex items-center space-x-1.5 mb-1 opacity-60 text-[9px] uppercase font-bold tracking-wider">
            <Bot className="w-3 h-3" />
            <span>Personalized Session Note &amp; Tier Upgrade</span>
          </div>
          <p className="leading-relaxed">
            <span className={`font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>✓ Session Note:</span> Green day (+2.1% on EURUSD). Sizing held at 1.5 lots across 4 fills with zero revenge trading.
          </p>
          <p className={`italic pt-1 mt-1 border-t ${isDark ? 'border-zinc-700/40' : 'border-slate-200'}`}>
            &ldquo;You&apos;re 40% toward Phase 1 target. Keep this exact rhythm tomorrow. <span className={`font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>[Scale Tier: Add $50k allocation]</span>&rdquo;
          </p>
        </div>
      </div>

      {/* LOOP 02: ON BREACH (HERO NODE) */}
      <div className={`p-4 rounded-2xl border-2 space-y-2.5 ${
        isDark ? 'bg-emerald-950/20 border-emerald-500/50' : 'bg-emerald-50/50 border-emerald-400'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
            isDark ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
          }`}>
            Loop 02 · On Breach (Support &amp; Recapture)
          </span>
          <span className="text-xs font-bold text-emerald-500">Recaptures $0 CAC Margin</span>
        </div>

        <div className={`p-3 rounded-xl border font-mono text-[11px] ${
          isDark ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-white border-emerald-300 text-emerald-950'
        }`}>
          <div className={`flex items-center space-x-1.5 mb-1.5 opacity-90 text-[9px] uppercase font-bold tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Personalized Post-Breach Coaching &amp; Reset</span>
          </div>
          <div className="space-y-1.5 leading-relaxed">
            <p>
              <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>✓ Strong run:</span> 64% win rate across 18 London trades with disciplined 1.0 lots.
            </p>
            <p>
              <span className={`font-bold ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>⚠ To improve:</span> Sizing jumped to 5.0 lots on #849201 during CPI (audited: no broker slippage).
            </p>
            <p className={`italic pt-1 border-t ${isDark ? 'border-emerald-500/30' : 'border-emerald-200'}`}>
              &ldquo;Fix that one news leak and you pass. Tap here to reset in 1 click.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* LOOP 03: PHASE PASSED */}
      <div className={`p-4 rounded-2xl border space-y-2.5 ${
        isDark ? 'bg-indigo-950/20 border-indigo-500/30' : 'bg-indigo-50/50 border-indigo-200'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
            isDark ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-500/40' : 'bg-indigo-100 text-indigo-900 border border-indigo-300'
          }`}>
            Loop 03 · Phase Passed (Milestone &amp; Upsell)
          </span>
          <span className="text-xs font-mono opacity-60">Expands Trader LTV</span>
        </div>

        <div className={`p-3 rounded-xl border font-mono text-[11px] ${
          isDark ? 'bg-indigo-950/30 border-indigo-500/40 text-indigo-200' : 'bg-white border-indigo-300 text-indigo-950'
        }`}>
          <div className={`flex items-center space-x-1.5 mb-1.5 opacity-90 text-[9px] uppercase font-bold tracking-wider ${isDark ? 'text-indigo-400' : 'text-indigo-800'}`}>
            <Award className="w-3.5 h-3.5" />
            <span>Personalized Phase Pass &amp; Scaling Offer</span>
          </div>
          <div className="space-y-1 leading-relaxed">
            <p>
              <span className={`font-bold ${isDark ? 'text-indigo-300' : 'text-indigo-800'}`}>✓ Phase 1 Passed:</span> Cleared in 8 days with a 68% win rate &amp; 2.1 PF across 34 trades.
            </p>
            <p className={`italic pt-1 border-t ${isDark ? 'border-indigo-500/20' : 'border-indigo-200'}`}>
              &ldquo;You&apos;re trading in peak flow. Tap here to upgrade to the <span className={`font-bold underline ${isDark ? 'text-white' : 'text-slate-900'}`}>$200k Master tier</span> with 1 click before Phase 2.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className={`pt-2.5 border-t flex items-center justify-between text-xs ${
        isDark ? 'border-white/10' : 'border-slate-200'
      }`}>
        <span className="font-mono text-[10px] opacity-75">
          MT5 · cTrader · DXTrade Webhook
        </span>
        <span className="font-mono text-[10px] font-bold text-emerald-400">
          48-Hour Deployment
        </span>
      </div>
    </div>
  );

  // Loading state while checking localStorage/query
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#090a0c] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Operator Lock Screen for unauthorized visitors
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#090a0c] text-zinc-100 font-sans selection:bg-white/20 selection:text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#121316] border border-white/[0.08] shadow-2xl text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              Restricted Operator Console
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight pt-1">
              Internal Teardown &amp; Playbook
            </h1>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed pt-1">
              This area contains internal cold outreach scripts and 1st-challenge leak architecture. Enter operator passcode to unlock.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-3 font-mono">
            <div className="space-y-1 text-left">
              <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider block">
                Operator Passcode
              </label>
              <input
                type="password"
                placeholder="Enter passcode (e.g. 8849)..."
                value={passcodeInput}
                onChange={(e) => {
                  setPasscodeInput(e.target.value);
                  setPasscodeError(false);
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-center text-sm focus:outline-none focus:border-amber-400 transition-colors"
                autoFocus
              />
            </div>

            {passcodeError && (
              <p className="text-xs text-rose-400 font-mono">
                ⚠ Incorrect passcode. Please try again.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-md"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Unlock Teardown Assets</span>
            </button>
          </form>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <Link href="/" className="hover:text-zinc-300 transition-colors flex items-center space-x-1">
              <ArrowLeft className="w-3 h-3" />
              <span>Public Live Sandbox</span>
            </Link>
            <span>PropFirm OS v2.4</span>
          </div>
        </div>
      </div>
    );
  }

  // Pure Export Mode (Only for authenticated operator generating screenshots)
  if (isExportMode && isAuthenticated) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-[#09090b]' : 'bg-[#f1f5f9]'} flex items-center justify-center p-4`}>
        <style dangerouslySetInnerHTML={{ __html: `nextjs-portal, [data-nextjs-toast], [data-nextjs-dialog-overlay] { display: none !important; }` }} />
        {layoutFormat === 'mobile' ? <MobilePortraitGraphic /> : <DesktopTreeGraphic />}
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-200 ${isDark ? 'bg-[#0c0d0e] text-[#ededed]' : 'bg-[#f8fafc] text-[#0f172a]'}`}>
      
      {/* Top Navbar */}
      <header className={`h-14 border-b px-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md ${isDark ? 'border-white/[0.08] bg-[#0c0d0e]/90' : 'border-slate-200 bg-white/90'}`}>
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className={`flex items-center space-x-1.5 text-xs font-medium transition-colors ${isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Sandbox</span>
          </Link>
          <span className={isDark ? 'text-zinc-600' : 'text-slate-300'}>/</span>
          <span className="font-semibold text-xs">
            Operator Console · Teardown &amp; Outreach Assets
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          {/* Format Toggle (Desktop vs Mobile) */}
          <div className={`p-1 rounded-lg border flex items-center space-x-1 ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
            <button
              onClick={() => setLayoutFormat('desktop')}
              className={`px-2.5 py-1 rounded-md font-medium text-xs flex items-center space-x-1.5 transition-all cursor-pointer ${layoutFormat === 'desktop' ? (isDark ? 'bg-zinc-800 text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs') : 'text-zinc-400 hover:text-white'}`}
            >
              <Monitor className="w-3 h-3" />
              <span>Desktop (Tree)</span>
            </button>
            <button
              onClick={() => setLayoutFormat('mobile')}
              className={`px-2.5 py-1 rounded-md font-medium text-xs flex items-center space-x-1.5 transition-all cursor-pointer ${layoutFormat === 'mobile' ? (isDark ? 'bg-zinc-800 text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs') : 'text-zinc-400 hover:text-white'}`}
            >
              <Smartphone className="w-3 h-3" />
              <span>Mobile (Portrait / DMs)</span>
            </button>
          </div>

          {/* Theme Toggle */}
          <div className={`p-1 rounded-lg border flex items-center space-x-1 ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
            <button
              onClick={() => setTheme('dark')}
              className={`px-2.5 py-1 rounded-md font-medium text-xs flex items-center space-x-1.5 transition-all cursor-pointer ${isDark ? 'bg-zinc-800 text-white shadow-xs' : 'text-zinc-400 hover:text-white'}`}
            >
              <Moon className="w-3 h-3" />
              <span>Dark</span>
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`px-2.5 py-1 rounded-md font-medium text-xs flex items-center space-x-1.5 transition-all cursor-pointer ${!isDark ? 'bg-white text-slate-900 shadow-xs' : 'text-zinc-400 hover:text-white'}`}
            >
              <Sun className="w-3 h-3" />
              <span>Light</span>
            </button>
          </div>

          {/* Download Button */}
          <a
            href={
              layoutFormat === 'mobile'
                ? (isDark ? "/annotated-teardown-mobile.png" : "/annotated-teardown-mobile-light.png")
                : (isDark ? "/annotated-teardown.png" : "/annotated-teardown-light.png")
            }
            download={
              layoutFormat === 'mobile'
                ? `propfirm-leak-teardown-mobile-${theme}.png`
                : `propfirm-leak-teardown-desktop-${theme}.png`
            }
            className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs ${isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {layoutFormat === 'mobile' ? 'Mobile PNG' : 'Desktop PNG'}</span>
          </a>

          {/* Lock Button */}
          <button
            onClick={handleLock}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center space-x-1 font-mono text-xs transition-colors cursor-pointer ${
              isDark ? 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-rose-600'
            }`}
            title="Lock Operator Access"
          >
            <Lock className="w-3 h-3" />
            <span className="hidden sm:inline">Lock</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-10">
        
        {/* Render the Selected Graphic */}
        {layoutFormat === 'mobile' ? <MobilePortraitGraphic /> : <DesktopTreeGraphic />}

        {/* ======================================================== */}
        {/* OPERATOR PLAYBOOK: High-Converting Outreach Scripts */}
        {/* ======================================================== */}
        <div className="space-y-6 max-w-[1240px] mx-auto pt-6 border-t border-white/[0.08]">
          
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
              Cold Outreach DM Scripts (Under 50 Words · Peer-to-Peer · Click to Copy)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Touch 1 Standard Churn Hook */}
              <div className={`p-5 rounded-2xl border flex flex-col justify-between ${isDark ? 'bg-[#121316] border-white/[0.08]' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                      Touch 1 · Standard Churn
                    </span>
                    <button
                      onClick={() => handleCopy(touch1Copy, setCopiedTouch1)}
                      className={`px-2.5 py-1 rounded text-xs font-mono flex items-center space-x-1 cursor-pointer transition-colors ${
                        isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {copiedTouch1 ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedTouch1 ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <h3 className={`text-sm font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    The 45-Word Operator Hook
                  </h3>
                  <p className={`text-[11px] mb-3 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    Fast peer-to-peer message for Twitter &amp; Telegram DMs (ends with micro-commitment ask):
                  </p>
                  <pre className={`p-3.5 rounded-xl border text-xs font-sans whitespace-pre-wrap leading-relaxed ${
                    isDark ? 'bg-[#0f1012] border-white/[0.04] text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    {touch1Copy}
                  </pre>
                </div>
              </div>

              {/* Card 2: Touch 1 Alt Execution/Slippage Hook */}
              <div className={`p-5 rounded-2xl border flex flex-col justify-between ${isDark ? 'bg-[#121316] border-white/[0.08]' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      Touch 1 · Slippage / Disputes
                    </span>
                    <button
                      onClick={() => handleCopy(touch1AltCopy, setCopiedTouch1Alt)}
                      className={`px-2.5 py-1 rounded text-xs font-mono flex items-center space-x-1 cursor-pointer transition-colors ${
                        isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {copiedTouch1Alt ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedTouch1Alt ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <h3 className={`text-sm font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    The Chargeback Hook
                  </h3>
                  <p className={`text-[11px] mb-3 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    Best for CEOs battling Trustpilot reviews or broker slippage complaints:
                  </p>
                  <pre className={`p-3.5 rounded-xl border text-xs font-sans whitespace-pre-wrap leading-relaxed ${
                    isDark ? 'bg-[#0f1012] border-white/[0.04] text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    {touch1AltCopy}
                  </pre>
                </div>
              </div>

              {/* Card 3: Touch 2 Deliverable + 8-Min Ask */}
              <div className={`p-5 rounded-2xl border flex flex-col justify-between ${isDark ? 'bg-[#121316] border-white/[0.08]' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      Touch 2 · Image + Demo Ask
                    </span>
                    <button
                      onClick={() => handleCopy(touch2Copy, setCopiedTouch2)}
                      className={`px-2.5 py-1 rounded text-xs font-mono flex items-center space-x-1 cursor-pointer transition-colors ${
                        isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {copiedTouch2 ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedTouch2 ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <h3 className={`text-sm font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Send When They Say &ldquo;Sure&rdquo;
                  </h3>
                  <p className={`text-[11px] mb-3 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    Attach the mobile graphic + send this clean message with zero bullet clutter:
                  </p>
                  <pre className={`p-3.5 rounded-xl border text-xs font-sans whitespace-pre-wrap leading-relaxed ${
                    isDark ? 'bg-[#0f1012] border-white/[0.04] text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    {touch2Copy}
                  </pre>
                </div>
              </div>

            </div>
          </div>

      </main>
    </div>
  );
}
