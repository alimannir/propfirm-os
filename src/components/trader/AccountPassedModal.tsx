'use client';

import React, { useState } from 'react';
import { AccountInfo, ClosedTrade } from '@/types';
import { Trophy, ShieldCheck, Copy, Check, Share2, ArrowRight } from 'lucide-react';

interface AccountPassedModalProps {
  account: AccountInfo;
  closedTrades?: ClosedTrade[];
}

export const AccountPassedModal: React.FC<AccountPassedModalProps> = ({
  account,
}) => {
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [copiedCredentials, setCopiedCredentials] = useState(false);
  const [sharedOnX, setSharedOnX] = useState(false);

  const targetProfitUsd = (account.profitTargetPct / 100) * account.startingBalance;

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('FUNDED25');
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  const handleCopyCredentials = () => {
    navigator.clipboard.writeText(
      `Login: ${account.accountNumber}-F\nServer: ${account.serverName}\nBroker: MT5 Live`
    );
    setCopiedCredentials(true);
    setTimeout(() => setCopiedCredentials(false), 2000);
  };

  const handleShareOnX = () => {
    const text = encodeURIComponent(
      `Officially passed my evaluation challenge with Grade A+ discipline and zero rule breaches! Next stop: live payouts. 🚀`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    setSharedOnX(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center space-x-2 text-[12px] text-zinc-400 font-mono">
            <span>Account #{account.accountNumber}</span>
            <span>·</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> Profit Target Reached (+${Math.round(targetProfitUsd).toLocaleString()})
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight mt-1">
            Evaluation Completed · Phase 1 Passed!
          </h1>
        </div>

        <button
          onClick={handleShareOnX}
          className="px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-[12px] font-medium border border-white/[0.08] flex items-center space-x-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Share2 className="w-3.5 h-3.5 text-zinc-400" />
          <span>{sharedOnX ? 'Shared to Twitter!' : 'Share on X (Free Viral Post)'}</span>
        </button>
      </div>

      {/* 2-STEP OUTCOME: STEP 1 (THE HIGH-TICKET UPGRADE FOR THE FIRM) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#121214] border border-emerald-500/30 space-y-4">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            Step 1 · High-Ticket Account Upsell ($0 CAC)
          </span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <h2 className="text-xl font-semibold text-white tracking-tight">
              Scale Your Account: $200,000 Master Evaluation (Save 25%)
            </h2>
            <p className="text-[13px] text-zinc-300 leading-relaxed">
              Because you maintained under 1.5% drawdown and Grade A+ consistency, an exclusive 25% loyalty voucher has been unlocked to immediately add a $200k Master Evaluation to your dashboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleCopyCoupon}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.1] text-[13px] font-mono text-zinc-300 hover:text-white flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <span>FUNDED25</span>
              {copiedCoupon ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-zinc-500" />
              )}
            </button>

            <button
              onClick={() => alert(`Unlocked: $200,000 Master Evaluation checkout at 25% off!`)}
              className="px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-[13px] flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <span>Claim $200k Upgrade ($746)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2-STEP OUTCOME: STEP 2 (OFFICIAL CERTIFICATE & CREDENTIALS) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#121214] border border-white/[0.08] space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">
              Step 2 · Verified Certificate of Achievement
            </h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            Verified MT5 Telemetry
          </span>
        </div>

        {/* Certificate Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900 to-black border border-white/[0.1] text-center space-y-3">
          <div className="text-[10px] font-mono tracking-widest uppercase text-emerald-400">
            PROPRIETARY TRADING FIRM · EVALUATION VERIFIED
          </div>
          <div className="text-xl sm:text-2xl font-serif text-white">
            Certificate of Trading Excellence
          </div>
          <p className="text-[12px] text-zinc-400 max-w-sm mx-auto">
            Awarded to <span className="text-white font-medium">{account.traderName}</span> for passing the ${(account.planSize / 1000).toFixed(0)}k evaluation with zero rule breaches.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-[11px] font-mono max-w-xl mx-auto">
            <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/[0.04]">
              <div className="text-zinc-500 text-[10px]">PROFIT</div>
              <div className="text-emerald-400 font-semibold text-sm mt-0.5">
                +${Math.round(targetProfitUsd).toLocaleString()}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/[0.04]">
              <div className="text-zinc-500 text-[10px]">MAX DRAWDOWN</div>
              <div className="text-white font-semibold text-sm mt-0.5">1.2%</div>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/[0.04]">
              <div className="text-zinc-500 text-[10px]">WIN RATE</div>
              <div className="text-white font-semibold text-sm mt-0.5">78%</div>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/[0.04]">
              <div className="text-zinc-500 text-[10px]">DISCIPLINE</div>
              <div className="text-emerald-400 font-semibold text-sm mt-0.5">Grade A+</div>
            </div>
          </div>
        </div>

        {/* Phase 2 Credentials */}
        <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px]">
          <div>
            <div className="font-semibold text-white">Phase 2 / Funded Stage Credentials</div>
            <div className="text-zinc-400 font-mono text-[11px] mt-0.5">
              Login: {account.accountNumber}-F · Server: {account.serverName} · Broker: {account.platform}
            </div>
          </div>
          <button
            onClick={handleCopyCredentials}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors flex items-center justify-center space-x-1.5 cursor-pointer self-start sm:self-auto shrink-0"
          >
            {copiedCredentials ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy Credentials</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
