'use client';

import React from 'react';
import Link from 'next/link';

export type MainView = 'trader' | 'admin';

interface NavbarProps {
  currentView: MainView;
  onSelectView: (view: MainView) => void;
  platform: string;
  firmName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  platform,
  firmName,
}) => {
  return (
    <header className="border-b border-white/[0.08] bg-[#09090b]/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-[15px] text-white tracking-tight">
              PropFirm OS
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-white/[0.08] text-zinc-400">
              White-Label Infrastructure
            </span>
          </div>
        </div>

        {/* 2-Tab Switcher: Trader Experience vs Prop Firm Dashboard */}
        <nav className="flex items-center p-1 bg-zinc-900/90 rounded-full border border-white/[0.08]">
          <button
            onClick={() => onSelectView('trader')}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
              currentView === 'trader'
                ? 'bg-white text-black shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Trader Experience
          </button>
          <button
            onClick={() => onSelectView('admin')}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
              currentView === 'admin'
                ? 'bg-white text-black shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Prop Firm Dashboard
          </button>
        </nav>

        {/* Right side: Teardown + Pitch Deck Link + Live status */}
        <div className="flex items-center space-x-2.5">
          <Link
            href="/teardown"
            className="px-3 py-1.5 rounded-full text-[12px] font-medium text-zinc-300 bg-zinc-900 border border-white/10 hover:bg-zinc-800 transition-colors flex items-center space-x-1.5"
          >
            <span>📸 1-Page Teardown</span>
          </Link>
          <Link
            href="/pitch"
            className="px-3 py-1.5 rounded-full text-[12px] font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 hover:bg-emerald-900/60 transition-colors flex items-center space-x-1.5"
          >
            <span>📊 Pitch Flow</span>
          </Link>
          <div className="hidden lg:flex items-center space-x-2 text-[12px] text-zinc-400 font-mono pl-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{platform} Live</span>
          </div>
        </div>
      </div>
    </header>
  );
};
