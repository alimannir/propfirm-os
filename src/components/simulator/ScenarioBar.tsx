'use client';

import React, { useState } from 'react';
import { Play, Square, Video, X } from 'lucide-react';

export type TraderOutcomeMode = 'quiet_session' | 'trader_breached' | 'trader_passed';

interface ScenarioBarProps {
  currentMode: TraderOutcomeMode;
  onSelectMode: (mode: TraderOutcomeMode) => void;
  traderName: string;
  isAutoPlaying?: boolean;
  onToggleAutoPlay?: () => void;
  autoPlaySeconds?: number;
  autoPlayCue?: string;
}

export const ScenarioBar: React.FC<ScenarioBarProps> = ({
  currentMode,
  onSelectMode,
  traderName,
  isAutoPlaying = false,
  onToggleAutoPlay,
  autoPlaySeconds = 0,
  autoPlayCue,
}) => {
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <div className="border-b border-white/[0.06] bg-zinc-950/90 backdrop-blur-sm sticky top-14 z-40">
      {/* Video Modal Preview */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08] bg-zinc-950">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-white text-[13px]">
                  Sample 35s Universal Demo Video
                </span>
                <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                  Voiceover &amp; Screen Only (Zero Camera)
                </span>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center">
              <video
                src="/demo-preview.mp4"
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 bg-zinc-950/80 border-t border-white/[0.08] flex items-center justify-between text-[12px] text-zinc-400">
              <span>This is the exact pacing, tone, and screen sequence to use when pitching prop firm founders.</span>
              <a
                href="/demo-preview.mp4"
                download="propfirm-os-demo.mp4"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
              >
                Download MP4
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Teleprompter Cue Banner when recording Loom */}
      {isAutoPlaying && autoPlayCue && (
        <div className="bg-emerald-950/80 border-b border-emerald-500/30 px-6 py-2 transition-all animate-in fade-in">
          <div className="max-w-6xl mx-auto flex items-center justify-between text-[13px]">
            <div className="flex items-center space-x-2 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold uppercase text-[11px] font-mono tracking-wider">
                Speak Now ({35 - autoPlaySeconds}s left):
              </span>
              <span className="text-white font-medium italic">&ldquo;{autoPlayCue}&rdquo;</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-bold shrink-0">
              {autoPlaySeconds}s / 35s
            </span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 text-[12px]">
        {/* Outcome Selector */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto">
          <span className="text-zinc-500 mr-2 whitespace-nowrap font-medium text-[11px] font-mono uppercase tracking-wider">
            Test Loops:
          </span>

          {/* Mode 1 */}
          <button
            onClick={() => onSelectMode('quiet_session')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer text-xs ${
              currentMode === 'quiet_session'
                ? 'bg-zinc-800 text-white border border-white/20 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            Loop 01 · Active Days (Quiet &amp; Support)
          </button>

          {/* Mode 2 */}
          <button
            onClick={() => onSelectMode('trader_breached')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer text-xs ${
              currentMode === 'trader_breached'
                ? 'bg-rose-950/60 text-rose-200 border border-rose-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-rose-300 hover:bg-zinc-900'
            }`}
          >
            Loop 02 · On Breach (Audit &amp; $295 Reset)
          </button>

          {/* Mode 3 */}
          <button
            onClick={() => onSelectMode('trader_passed')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer text-xs ${
              currentMode === 'trader_passed'
                ? 'bg-emerald-950/60 text-emerald-200 border border-emerald-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-emerald-300 hover:bg-zinc-900'
            }`}
          >
            Loop 03 · On Pass (Milestone &amp; Upsell)
          </button>
        </div>

        {/* Buttons: Watch Sample Video + Auto-Demo Play */}
        <div className="flex items-center space-x-2.5 w-full md:w-auto justify-end">
          {/* Watch Sample Video Button */}
          <button
            onClick={() => setShowVideoModal(true)}
            className="px-3 py-1.5 rounded-full text-[12px] font-medium text-zinc-200 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Video className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sample Video</span>
          </button>

          {/* 1-Click Auto-Demo Play Button */}
          {onToggleAutoPlay && (
            <button
              onClick={onToggleAutoPlay}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                isAutoPlaying
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg animate-pulse'
                  : 'bg-emerald-400 hover:bg-emerald-300 text-black shadow-md'
              }`}
            >
              {isAutoPlaying ? (
                <>
                  <Square className="w-3 h-3 fill-current" />
                  <span>Stop Demo</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>Play 35s Auto-Demo</span>
                </>
              )}
            </button>
          )}

          <div className="hidden lg:flex items-center space-x-2 text-[11px] font-mono text-zinc-400 ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
            <span>Active: <span className="text-white font-medium">{traderName}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};
