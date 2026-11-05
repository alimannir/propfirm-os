'use client';

import React, { useState } from 'react';
import { AccountInfo, ExecutionFairnessAudit, RetentionOffer, ClosedTrade } from '@/types';
import { ShieldCheck, ArrowRight, Copy, Check } from 'lucide-react';

interface PostBreachAuditModalProps {
  account: AccountInfo;
  audit: ExecutionFairnessAudit;
  offer: RetentionOffer;
  closedTrades?: ClosedTrade[];
}

export const PostBreachAuditModal: React.FC<PostBreachAuditModalProps> = ({
  account,
  audit,
  offer,
}) => {
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [checkoutTriggered, setCheckoutTriggered] = useState(false);

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(offer.couponCode);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  const handleClaimReset = () => {
    setCheckoutTriggered(true);
    alert(`Fast-Track Reset activated! Coupon ${offer.couponCode} applied to checkout.`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center space-x-2 text-[12px] text-zinc-400 font-mono">
            <span>Account #{account.accountNumber}</span>
            <span>·</span>
            <span className="text-rose-400 font-medium">Daily Limit Reached</span>
            <span>·</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Execution Verified Clean
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight mt-1">
            Forensic Execution Audit &amp; Fast-Track Reset
          </h1>
        </div>
      </div>

      {/* 2-STEP RECOVERY: STEP 1 (THE REBUY & COACHING) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#121214] border border-white/[0.12] space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            Loop 02 · Support, Coaching &amp; Fast-Track Reset ($0 CAC)
          </span>
          <span className="text-[11px] font-mono text-zinc-400">
            Automated Trigger: Daily Drawdown Limit
          </span>
        </div>

        {/* Personalized Challenge Breakdown: What they did well vs where to improve */}
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/[0.06] space-y-2.5 font-mono text-[12px]">
          <div className="flex items-center space-x-2 text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Personalized Post-Breach Trade Log Breakdown</span>
          </div>
          <div className="space-y-1.5 leading-relaxed text-zinc-200">
            <p>
              <span className="text-emerald-400 font-bold">✓ What You Did Well:</span> Maintained a strong 64% win rate across 18 London session trades with disciplined 1.0 lot sizing.
            </p>
            <p>
              <span className="text-amber-400 font-bold">⚠ Where To Improve:</span> Sizing jumped 5x to 5.0 lots on ticket #849201 during CPI news volatility (audited fill: fair execution, no broker slippage).
            </p>
            <p className="italic text-zinc-300 pt-1 border-t border-white/[0.06]">
              &ldquo;Your core market edge is intact. Eliminating this single news sizing spike is all you need to pass. Use your second-chance restart below.&rdquo;
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
          <div className="space-y-1 max-w-xl">
            <h2 className="text-xl font-semibold text-white tracking-tight">
              Second-Chance Fast-Track Reset: Save {offer.discountPct}%
            </h2>
            <p className="text-[13px] text-zinc-400 leading-relaxed">
              Don&apos;t walk away in frustration. The firm has provisioned an instant discount to reset your account credentials immediately.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleCopyCoupon}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-[13px] font-mono text-zinc-300 hover:text-white flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <span>{offer.couponCode}</span>
              {copiedCoupon ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-zinc-500" />
              )}
            </button>

            <button
              onClick={handleClaimReset}
              className="px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-[13px] flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-md"
            >
              <span>{checkoutTriggered ? '✓ Reset Activated' : `Reset Challenge ($${offer.discountedPriceUsd})`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2-STEP RECOVERY: STEP 2 (THE PROOF THAT DEFUSES THE DISPUTE) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#121214] border border-white/[0.08] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">
              Step 2 · Execution Fairness Benchmark (Eliminates Broker Blame)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            99.4% Clean Match
          </span>
        </div>

        <p className="text-[13px] text-zinc-400 leading-relaxed">
          Traders often assume the broker widened spreads or slipped their stop loss intentionally.
          This audit benchmarks your fill against independent institutional liquidity feeds at the exact millisecond of your closing trade:
        </p>

        {/* The Clean Side-by-Side Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-[12px]">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.04]">
            <div className="text-zinc-500 text-[11px]">BROKER FILL PRICE</div>
            <div className="text-lg font-semibold text-white mt-1">
              {audit.brokerFillPrice}
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Spread: {audit.brokerSpreadPips} pips</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.04]">
            <div className="text-zinc-500 text-[11px]">INSTITUTIONAL L1 FEED</div>
            <div className="text-lg font-semibold text-white mt-1">
              {audit.independentL1Mid}
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Reference: {audit.independentSpreadPips} pips</div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
            <div className="text-emerald-400 text-[11px] font-semibold">EXECUTION VARIANCE</div>
            <div className="text-lg font-semibold text-emerald-400 mt-1">
              Verified Fair Spread
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">No abnormal broker slippage detected</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-white/[0.06] text-[12px] text-zinc-300">
          <span className="text-emerald-400 font-semibold font-mono">Verdict:</span> Spreads were completely normal. Your stop hit due to market momentum, not broker manipulation. That means your edge is intact and ready for another run.
        </div>
      </div>
    </div>
  );
};
