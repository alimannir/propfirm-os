'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  MessageSquare, 
  Sparkles,
  Smartphone,
  Monitor
} from 'lucide-react';

export default function PlaybookPage() {
  const [copiedTouch1, setCopiedTouch1] = useState(false);
  const [copiedTouch1Alt, setCopiedTouch1Alt] = useState(false);
  const [copiedTouch2, setCopiedTouch2] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#090a0c] text-zinc-100 font-sans selection:bg-white/20 selection:text-white flex flex-col">
      
      {/* Header */}
      <header className="border-b border-white/[0.08] bg-[#0c0d10]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link
              href="/teardown"
              className="flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Teardown</span>
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="font-bold text-xs text-white font-mono">
              Outreach Playbook (Admin Only)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/?tab=breached"
              className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white flex items-center space-x-1 transition-colors"
            >
              <span>Sandbox</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* Top Header Card */}
        <div className="p-5 rounded-2xl bg-[#121316] border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold uppercase tracking-wider border border-amber-500/20">
                Private Swipe File
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                Hidden from clients
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white mt-1">
              High-Converting Prop Firm Outreach Sequence
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5 font-mono">
              Under 50 words · Peer-to-peer tone · Optimized for Twitter &amp; Telegram mobile DMs.
            </p>
          </div>

          {/* Quick Assets Download */}
          <div className="flex items-center space-x-2 shrink-0">
            <a
              href="/annotated-teardown-mobile.png"
              download="propfirm-leak-teardown-mobile.png"
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile PNG (Attach to Touch 2)</span>
            </a>
          </div>
        </div>

        {/* 3 Copy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Touch 1 Standard Churn Hook */}
          <div className="p-5 rounded-2xl bg-[#121316] border border-white/[0.08] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                  Touch 1 · Standard
                </span>
                <button
                  onClick={() => handleCopy(touch1Copy, setCopiedTouch1)}
                  className="px-2.5 py-1 rounded text-xs font-mono flex items-center space-x-1 cursor-pointer transition-colors bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  {copiedTouch1 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedTouch1 ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <h3 className="text-sm font-bold text-white">
                The 45-Word Operator Hook
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5 mb-3 leading-relaxed">
                Initial DM on Twitter/Telegram. Short, casual, ends with a micro-commitment ask:
              </p>

              <pre className="p-3.5 rounded-xl bg-zinc-900 border border-white/[0.04] text-xs font-sans whitespace-pre-wrap leading-relaxed text-zinc-200">
                {touch1Copy}
              </pre>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 block pt-1">
              Goal: Get an easy &quot;Sure&quot; or &quot;Send it over&quot; reply.
            </span>
          </div>

          {/* Card 2: Touch 1 Slippage / Dispute Hook */}
          <div className="p-5 rounded-2xl bg-[#121316] border border-white/[0.08] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  Touch 1 · Slippage Hook
                </span>
                <button
                  onClick={() => handleCopy(touch1AltCopy, setCopiedTouch1Alt)}
                  className="px-2.5 py-1 rounded text-xs font-mono flex items-center space-x-1 cursor-pointer transition-colors bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  {copiedTouch1Alt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedTouch1Alt ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <h3 className="text-sm font-bold text-white">
                The Chargeback / Dispute Hook
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5 mb-3 leading-relaxed">
                Best for prop firm CEOs battling Trustpilot reviews or broker spread complaints:
              </p>

              <pre className="p-3.5 rounded-xl bg-zinc-900 border border-white/[0.04] text-xs font-sans whitespace-pre-wrap leading-relaxed text-zinc-200">
                {touch1AltCopy}
              </pre>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 block pt-1">
              Goal: Directly hits the CEO&apos;s support &amp; payment dispute headache.
            </span>
          </div>

          {/* Card 3: Touch 2 Deliverable + 8-Min Ask */}
          <div className="p-5 rounded-2xl bg-[#121316] border border-white/[0.08] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Touch 2 · Delivery + Call Ask
                </span>
                <button
                  onClick={() => handleCopy(touch2Copy, setCopiedTouch2)}
                  className="px-2.5 py-1 rounded text-xs font-mono flex items-center space-x-1 cursor-pointer transition-colors bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  {copiedTouch2 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedTouch2 ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <h3 className="text-sm font-bold text-white">
                Send When They Reply &ldquo;Sure&rdquo;
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5 mb-3 leading-relaxed">
                Attach the vertical mobile PNG + paste this exact message (zero bullet clutter):
              </p>

              <pre className="p-3.5 rounded-xl bg-zinc-900 border border-white/[0.04] text-xs font-sans whitespace-pre-wrap leading-relaxed text-zinc-200">
                {touch2Copy}
              </pre>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 block pt-1">
              Goal: Book a quick 8-min walkthrough with zero dev friction.
            </span>
          </div>

        </div>

      </main>

    </div>
  );
}

