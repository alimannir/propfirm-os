'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Share2, 
  MousePointer, 
  Square, 
  StickyNote, 
  Type, 
  PenTool, 
  Minus, 
  Plus, 
  ChevronDown,
  Sparkles,
  ArrowDown,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Play
} from 'lucide-react';

const MIRO_STEPS = [
  {
    phase: '01. The Churn Bleed',
    label: 'The Current Bleed',
    tag: 'Phase 01 · Current State',
    accent: '#f43f5e', // Neon Rose
    bg: 'bg-rose-950/20',
    border: 'border-rose-500/40',
    hoverBorder: 'hover:border-rose-500/80',
    activeGlow: 'ring-rose-500/40 shadow-rose-950/30',
    points: [
      { prefix: 'Breach Trigger', text: 'Trader hits daily drawdown limit on news volatility and assumes broker slippage or unfair spread widening.' },
      { prefix: 'Dispute Overhead', text: 'Files negative Trustpilot reviews or payment processor chargeback threats, requiring hours of manual support.' },
      { prefix: 'The 100% Churn Cliff', text: 'Closes your portal in frustration. You paid full ad spend to acquire them, but capture $0 in repeat lifetime value.' },
    ],
    goal: 'Goal: Stop the unmanaged churn and eliminate execution dispute grounds.'
  },
  {
    phase: '02. L1 Forensic Audit',
    label: 'Forensic Tick Audit',
    tag: 'Phase 02 · Neutralize',
    accent: '#38bdf8', // Cyber Cyan
    bg: 'bg-sky-950/20',
    border: 'border-sky-500/40',
    hoverBorder: 'hover:border-sky-500/80',
    activeGlow: 'ring-sky-500/40 shadow-sky-950/30',
    points: [
      { prefix: 'Automated Webhook', text: 'Connects directly to your MT5 / cTrader server bridge at the microsecond of the breach order.' },
      { prefix: 'Tick-by-Tick Audit', text: 'Pulls broker mid, fill price, and interbank composite feed. Verifies slippage delta was 0.0 pips and fills were 100% fair.' },
      { prefix: 'Transparent Proof', text: 'Delivers an instant cryptographic audit card to the trader, eliminating dispute grounds before complaints are written.' },
    ],
    goal: 'Goal: Neutralize broker blame and redirect trader into reset mode.'
  },
  {
    phase: '03. Fast-Track Reset',
    label: 'Fast-Track Reset',
    tag: 'Phase 03 · Recapture',
    accent: '#10b981', // Precision Emerald
    bg: 'bg-emerald-950/20',
    border: 'border-emerald-500/40',
    hoverBorder: 'hover:border-emerald-500/80',
    activeGlow: 'ring-emerald-500/40 shadow-emerald-950/30',
    points: [
      { prefix: 'Peak Motivation', text: 'Presents an instant, pre-filled reset checkout while the trader is still focused at their screen.' },
      { prefix: 'Zero Incremental CAC', text: 'Generates repeat challenge sales from existing traffic with zero added marketing or affiliate acquisition spend.' },
      { prefix: 'Streamlined Restart', text: 'One-click checkout provisions a fresh evaluation account immediately without support friction.' },
    ],
    goal: 'Goal: Recapture repeat evaluation revenue at $0 customer acquisition cost.'
  },
  {
    phase: '04. Viral Pass Loop',
    label: 'Pass Loop & Upsell',
    tag: 'Phase 04 · Scale',
    accent: '#818cf8', // Electric Indigo
    bg: 'bg-indigo-950/20',
    border: 'border-indigo-500/40',
    hoverBorder: 'hover:border-indigo-500/80',
    activeGlow: 'ring-indigo-500/40 shadow-indigo-950/30',
    points: [
      { prefix: '1-Click Certificate', text: 'Passing traders receive a verified cryptographic milestone badge ready to share on Twitter/X in one click.' },
      { prefix: 'Organic Acquisition', text: 'Word-of-mouth public wins drive qualified retail traders directly to your website with $0 marketing spend.' },
      { prefix: 'Capital Tier Upgrade', text: 'Seamlessly presents passing traders with an immediate path into larger $200,000+ evaluation sizes.' },
    ],
    goal: 'Goal: Turn passing traders into organic brand ambassadors & higher-tier buyers.'
  },
  {
    phase: '05. Commercial Terms',
    label: 'Guaranteed 2x ROI',
    tag: 'Phase 05 · Terms',
    accent: '#34d399', // Platinum Mint
    bg: 'bg-emerald-950/30',
    border: 'border-emerald-400/50',
    hoverBorder: 'hover:border-emerald-400/90',
    activeGlow: 'ring-emerald-400/40 shadow-emerald-950/40',
    points: [
      { prefix: 'Zero Risk Structure', text: 'We take 0% revenue share until the engine has generated at least 2x your one-time setup fee in verified recaptured sales.' },
      { prefix: 'Performance-Gated', text: 'Ongoing performance fees only begin after your initial implementation cost is doubled in pure margin.' },
      { prefix: '48-Hour Sandbox Setup', text: 'Runs on your private VPC under your domain with 100% white-label branding. Connects to your demo broker bridge in 48 hours.' },
    ],
    goal: 'Goal: Guaranteed 2x ROI on setup with zero financial risk.'
  },
];

export default function MiroStylePitchPage() {
  const [zoom, setZoom] = useState(75);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isTouring, setIsTouring] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
        setActiveStep((prev) => Math.min(prev + 1, 4));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        setActiveStep((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isTouring) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= 4) {
          setIsTouring(false);
          return 4;
        }
        return prev + 1;
      });
    }, 8000);
    return () => clearInterval(timer);
  }, [isTouring]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans flex flex-col select-none overflow-x-auto relative">
      <style jsx global>{`
        @keyframes flowDashLines {
          from { stroke-dashoffset: 24; }
          to { stroke-dashoffset: 0; }
        }
        .animate-flow-dash {
          animation: flowDashLines 0.9s linear infinite;
        }
      `}</style>

      {/* Top Header */}
      <header className="h-12 bg-[#09090b]/90 backdrop-blur-xl border-b border-white/[0.08] px-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-sm tracking-tight text-white">
              PropFirm OS
            </span>
          </div>

          <span className="text-zinc-600">/</span>

          <div className="flex items-center space-x-2">
            <span className="font-semibold text-xs text-zinc-300">
              Margin Recapture Architecture (Outreach Flow)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-white/[0.08]">
              Live Engine
            </span>
          </div>
        </div>

        {/* Step Selector in Header */}
        <div className="hidden lg:flex items-center space-x-2 bg-zinc-900/80 p-1 rounded-lg border border-white/[0.08] text-xs">
          <span className="text-[11px] font-mono text-zinc-400 px-2 font-medium">
            Step:
          </span>
          {[0, 1, 2, 3, 4].map((stepIdx) => (
            <button
              key={stepIdx}
              onClick={() => setActiveStep(stepIdx)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeStep === stepIdx
                  ? 'bg-white text-black shadow-xs font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              0{stepIdx + 1}
            </button>
          ))}
          <button
            onClick={() => setIsTouring(!isTouring)}
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors ${
              isTouring ? 'bg-emerald-500 text-black' : 'text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            {isTouring ? <span>Pause</span> : <><Play className="w-3 h-3 fill-current" /><span>Tour</span></>}
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3 text-xs">
          <Link
            href="/"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-md border border-white/10 hover:bg-zinc-900 text-zinc-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Open Simulator</span>
          </Link>

          <button className="px-3.5 py-1 rounded-md bg-white hover:bg-zinc-200 text-black font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs">
            <Share2 className="w-3 h-3" />
            <span>Share</span>
          </button>
        </div>
      </header>

      {/* Floating Left Toolbar */}
      <aside className="fixed left-5 top-20 z-40 bg-zinc-900/90 border border-white/10 rounded-xl shadow-xl p-1.5 flex flex-col space-y-1 text-zinc-400 hidden md:flex backdrop-blur-md">
        <button className="p-2 rounded-lg bg-zinc-800 text-white cursor-pointer">
          <MousePointer className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-lg hover:bg-zinc-800 hover:text-white cursor-pointer">
          <Type className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-lg hover:bg-zinc-800 hover:text-emerald-400 cursor-pointer">
          <StickyNote className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-lg hover:bg-zinc-800 hover:text-white cursor-pointer">
          <Square className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-lg hover:bg-zinc-800 hover:text-white cursor-pointer">
          <PenTool className="w-4 h-4" />
        </button>
      </aside>

      {/* Main Dark Obsidian Canvas */}
      <div 
        className="flex-1 p-8 md:p-14 overflow-auto min-w-[1100px]"
        style={{
          backgroundColor: '#09090b',
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Board Title Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-emerald-400 text-xs font-mono font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prop Firm Risk &amp; Retention Architecture</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Prop Firm Margin Recapture Roadmap
            </h1>
            <p className="text-zinc-400 text-sm mt-1.5 max-w-xl mx-auto">
              Neutralize broker execution disputes with tick data while turning failed accounts into instant repeat rebuys at $0 CAC.
            </p>
          </div>

          {/* Connected Flow Rows */}
          <div className="relative pl-12">
            
            {/* The Left Vertical Timeline Rail */}
            <div className="absolute left-0 top-6 bottom-6 w-8 flex flex-col items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-widest -rotate-90 origin-center my-auto">
                Pipeline Flow
              </span>
              <div className="w-0.5 flex-1 bg-zinc-800 my-2 relative">
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[8px] border-t-zinc-600 absolute -bottom-2 -left-[3px]" />
              </div>
              <ArrowDown className="w-3.5 h-3.5 text-zinc-600" />
            </div>

            {/* The 5 Connected Rows */}
            <div className="space-y-8">
              {MIRO_STEPS.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <div 
                    key={idx} 
                    className={`flex items-stretch space-x-6 transition-all duration-300 ${
                      isActive ? 'scale-[1.01] opacity-100' : 'opacity-70 hover:opacity-90'
                    }`}
                  >
                    {/* Left Column: Dark Obsidian Node */}
                    <div 
                      onClick={() => setActiveStep(idx)}
                      className={`w-64 p-4 rounded-2xl shadow-lg transition-all cursor-pointer border flex flex-col justify-between shrink-0 bg-zinc-900/90 ${
                        isActive 
                          ? `${step.border} ring-2 ${step.activeGlow}` 
                          : 'border-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      <div>
                        <span 
                          className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-0.5"
                          style={{ color: step.accent }}
                        >
                          {step.tag}
                        </span>
                        <h3 className="font-bold text-white text-base leading-snug">
                          {step.label}
                        </h3>
                      </div>
                      <div className="mt-3 text-xs font-mono flex items-center space-x-1.5 text-zinc-400">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: step.accent }} />
                        <span>Step 0{idx + 1}</span>
                      </div>
                    </div>

                    {/* Center Column: Animated SVG Connector Arrow */}
                    <div className="w-20 shrink-0 flex items-center justify-center">
                      <svg width="80" height="30" viewBox="0 0 80 30" fill="none">
                        <path 
                          d="M 2 15 Q 40 15 68 15" 
                          stroke={isActive ? step.accent : '#52525b'} 
                          strokeWidth="2" 
                          strokeDasharray={isActive ? '5 3' : '3 3'}
                          className={isActive ? 'animate-flow-dash' : ''}
                        />
                        <polygon points="68,11 78,15 68,19" fill={isActive ? step.accent : '#52525b'} />
                      </svg>
                    </div>

                    {/* Right Column: High-Contrast Dark Card */}
                    <div 
                      className={`flex-1 p-5 rounded-2xl bg-zinc-900/90 border shadow-xl flex flex-col justify-between transition-all ${
                        isActive ? 'border-white/20' : 'border-white/[0.08]'
                      }`}
                    >
                      <div className="space-y-2 mb-3">
                        {step.points.map((pt, pIdx) => (
                          <div key={pIdx} className="text-xs md:text-sm text-zinc-300 leading-relaxed flex items-start space-x-2">
                            <span style={{ color: step.accent }} className="font-bold">•</span>
                            <span>
                              <strong className="text-white font-semibold">{pt.prefix}:</strong> {pt.text}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Bottom Goal Strip inside Card */}
                      <div className="pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
                        <span 
                          className="px-2.5 py-1 rounded font-semibold border"
                          style={{ 
                            color: step.accent, 
                            backgroundColor: 'rgba(255,255,255,0.03)',
                            borderColor: 'rgba(255,255,255,0.08)'
                          }}
                        >
                          {step.goal}
                        </span>
                        <span className="text-zinc-500 text-[11px]">
                          Phase 0{idx + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Bottom Zoom & Help Bar */}
          <div className="mt-14 pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-500">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Institutional Dark Palette · Tap [Spacebar] or [← / →] to step through phases during recording</span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setZoom((z) => Math.max(z - 10, 50))}
                className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-zinc-300 font-medium">{zoom}%</span>
              <button 
                onClick={() => setZoom((z) => Math.min(z + 10, 120))}
                className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
