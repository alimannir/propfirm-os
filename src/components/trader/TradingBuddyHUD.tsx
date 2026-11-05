'use client';

import React, { useState } from 'react';
import { AccountInfo, Position, ClosedTrade, TraderTiltMetrics } from '@/types';
import { generateDailyEODDebrief } from '@/engine/dispatch-engine';
import { ShieldCheck, Mail, X } from 'lucide-react';

interface TradingBuddyHUDProps {
  account: AccountInfo;
  openPositions: Position[];
  closedTrades: ClosedTrade[];
  metrics: TraderTiltMetrics;
  onPreviewDebrief?: () => void;
}

export const TradingBuddyHUD: React.FC<TradingBuddyHUDProps> = ({
  account,
  openPositions,
  closedTrades,
  metrics,
}) => {
  const [showEodModal, setShowEodModal] = useState(false);

  const dailyLimitUsd = (account.dailyLossLimitPct / 100) * account.dailyStartingBalance;
  const currentNetProfit = account.currentEquity - account.startingBalance;
  const eodDebrief = generateDailyEODDebrief(account, closedTrades);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center space-x-2 text-[12px] text-zinc-400 font-mono">
            <span>Account #{account.accountNumber}</span>
            <span>·</span>
            <span>${(account.planSize / 1000).toFixed(0)}k Evaluation</span>
            <span>·</span>
            <span className="text-emerald-400 font-medium">Active (Quiet Mode)</span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight mt-1">
            {account.traderName}
          </h1>
        </div>

        <button
          onClick={() => setShowEodModal(true)}
          className="px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-[13px] font-medium border border-white/[0.08] flex items-center space-x-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Mail className="w-3.5 h-3.5 text-zinc-400" />
          <span>Preview Tonight&apos;s 21:00 UTC Recap</span>
        </button>
      </div>

      {/* 3 Core Numbers Only */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#121214] border border-white/[0.08]">
          <div className="text-[12px] text-zinc-400">Account Equity</div>
          <div className="text-2xl font-semibold font-mono text-white mt-1 tabular-nums">
            ${Math.round(account.currentEquity).toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">
            Starting: ${account.startingBalance.toLocaleString()}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121214] border border-white/[0.08]">
          <div className="text-[12px] text-zinc-400">Daily Loss Buffer Left</div>
          <div className="text-2xl font-semibold font-mono text-emerald-400 mt-1 tabular-nums">
            ${Math.round(metrics.remainingDailyLossUsd).toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">
            Max loss allowed today: ${dailyLimitUsd.toLocaleString()}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121214] border border-white/[0.08]">
          <div className="text-[12px] text-zinc-400">Net Profit Today</div>
          <div
            className={`text-2xl font-semibold font-mono mt-1 tabular-nums ${
              currentNetProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {currentNetProfit >= 0 ? '+' : '-'}${Math.abs(Math.round(currentNetProfit)).toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">
            Target: +${Math.round((account.profitTargetPct / 100) * account.startingBalance).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Reassuring Quiet Mode Card */}
      <div className="p-6 rounded-2xl bg-[#121214] border border-white/[0.08] flex items-start space-x-4">
        <div className="p-2 rounded-xl bg-zinc-900 border border-white/[0.06] text-emerald-400 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-white">
            Quiet Session Mode: Zero Distractions During Trading
          </h3>
          <p className="text-[13px] text-zinc-400 leading-relaxed">
            The bot never interrupts you with popups while you are looking at charts.
            It records your execution telemetry silently in the background, and delivers a single personalized debrief to your inbox tonight after markets close at 21:00 UTC.
          </p>
        </div>
      </div>

      {/* Trades Taken Today */}
      <div className="bg-[#121214] border border-white/[0.08] rounded-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-white">
            Today&apos;s Executed Trades ({closedTrades.length})
          </h3>
          <span className="text-[11px] font-mono text-zinc-500">Live Feed</span>
        </div>

        {closedTrades.length === 0 ? (
          <div className="py-8 text-center text-[13px] text-zinc-500">
            No trades executed yet today.
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {closedTrades.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between text-[13px]">
                <div>
                  <div className="font-semibold text-white font-mono">
                    {t.symbol} <span className="font-normal text-zinc-400 text-xs">· {t.side} · {t.lots} lots</span>
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    {t.durationMinutes}m hold · Entry {t.openPrice} → Exit {t.closePrice}
                  </div>
                </div>
                <div
                  className={`font-mono font-semibold tabular-nums ${
                    t.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {t.pnl >= 0 ? '+' : '-'}${Math.abs(t.pnl).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clean Preview Modal */}
      {showEodModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161618] border border-white/[0.12] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5">
            <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-[11px] font-mono text-zinc-400 uppercase">
                  Delivers Tonight @ 21:00 UTC
                </span>
                <h3 className="text-lg font-semibold text-white mt-0.5">
                  Your Daily Evening Debrief
                </h3>
              </div>
              <button
                onClick={() => setShowEodModal(false)}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-[13px]">
              <div className="p-4 rounded-xl bg-zinc-900 border border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="text-zinc-400 text-[11px]">Session Result</div>
                  <div
                    className={`text-xl font-semibold font-mono mt-0.5 ${
                      eodDebrief.totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {eodDebrief.totalPnl >= 0 ? '+' : '-'}$
                    {Math.abs(eodDebrief.totalPnl).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-zinc-400 text-[11px]">Session Risk Status</div>
                  <div className="text-sm font-semibold font-mono text-emerald-400 mt-1 uppercase tracking-wider">
                    Risk Contained
                  </div>
                </div>
              </div>

              <div>
                <div className="text-zinc-400 text-[11px] mb-1 font-mono uppercase flex items-center justify-between">
                  <span>Personalized Encouragement (From Live Trade Fills)</span>
                </div>
                <p className="text-zinc-200 leading-relaxed bg-zinc-900/60 p-3.5 rounded-xl border border-white/[0.04]">
                  {eodDebrief.buddyMessage}
                </p>
              </div>

              <div>
                <div className="text-zinc-400 text-[11px] mb-1 font-mono uppercase">
                  Evening Rule
                </div>
                <p className="text-zinc-300 bg-zinc-900/60 p-3.5 rounded-xl border border-white/[0.04]">
                  {eodDebrief.eveningAdvice}
                </p>
              </div>

              {eodDebrief.firmActionOffer && (
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-emerald-500/20 space-y-1">
                  <div className="text-[11px] font-mono text-emerald-400 font-semibold uppercase">
                    Account Scaling Tier Unlocked
                  </div>
                  <div className="text-white font-medium text-[13px]">
                    {eodDebrief.firmActionOffer.title}
                  </div>
                  <div className="text-zinc-400 text-[11px]">
                    Use code <code className="text-emerald-400 font-mono">{eodDebrief.firmActionOffer.code}</code> for {eodDebrief.firmActionOffer.discountPct}% off next evaluation tier.
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowEodModal(false)}
                className="px-5 py-2 rounded-full bg-white text-black font-semibold text-[13px] hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
