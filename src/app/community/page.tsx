'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Video, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Zap, 
  Terminal, 
  Copy, 
  Check, 
  Bot, 
  FileText,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Shield,
  RefreshCw,
  Lock
} from 'lucide-react';

import { 
  DEFAULT_COMMUNITY_PLAYBOOK,
  DEMO_CHART_SCENARIOS,
  evaluateChartSetupDeterministically,
  DEMO_COMMUNITY_MEMBERS,
  generateRetentionIntervention,
  ChartAuditResult,
  ChartAuditInput
} from '@/engine/community-engine';

export default function CommunityBotShowcasePage() {
  const [activeTab, setActiveTab] = useState<'grader' | 'watchdog' | 'calculator' | 'architecture'>('grader');
  
  // Chart Grader State
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const currentScenario = DEMO_CHART_SCENARIOS[selectedScenarioIdx];
  const [auditInput, setAuditInput] = useState<ChartAuditInput>(currentScenario.setupData);
  const [channelView, setChannelView] = useState<'discord' | 'telegram' | 'json'>('discord');
  const [copiedCode, setCopiedCode] = useState(false);

  // Compute live deterministic audit result
  const auditResult: ChartAuditResult = evaluateChartSetupDeterministically(auditInput, DEFAULT_COMMUNITY_PLAYBOOK);

  // Watchdog State
  const [selectedMemberIdx, setSelectedMemberIdx] = useState(0);
  const currentMember = DEMO_COMMUNITY_MEMBERS[selectedMemberIdx];
  const currentIntervention = generateRetentionIntervention(currentMember);
  const [interventionTriggered, setInterventionTriggered] = useState(true);

  // MRR Calculator State
  const [memberCount, setMemberCount] = useState(350);
  const [subPrice, setSubPrice] = useState(97);
  const [savedMembers, setSavedMembers] = useState(8);

  const monthlyMRRSaved = savedMembers * subPrice;
  const annualProtectedRunRate = monthlyMRRSaved * 12;
  const setupFee = 1500;
  const paybackDays = Math.round((setupFee / monthlyMRRSaved) * 30);
  const annualROI = Math.round(((annualProtectedRunRate - setupFee) / setupFee) * 100);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSelectScenario = (idx: number) => {
    setSelectedScenarioIdx(idx);
    setAuditInput(DEMO_CHART_SCENARIOS[idx].setupData);
  };

  return (
    <div className="min-h-screen bg-[#090a0c] text-zinc-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      
      {/* 1. TOP HEADER */}
      <header className="border-b border-white/[0.08] bg-[#0c0d10]/95 backdrop-blur-md sticky top-0 z-50 w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-0 sm:h-14 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex items-center space-x-2.5">
              <Link 
                href="/"
                className="flex items-center space-x-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors py-1 px-2 rounded-md hover:bg-white/[0.05]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>PropFirm OS</span>
              </Link>
              <span className="text-zinc-600">/</span>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold tracking-tight text-white font-mono uppercase">
                  Community AI Companion
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                  Whop &amp; Discord
                </span>
              </div>
            </div>

            <div className="flex sm:hidden items-center space-x-1.5 text-[10px] font-mono text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Rules Engine Live</span>
            </div>
          </div>

          {/* 4-Tab Navigation */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-black/50 border border-white/10 rounded-xl max-w-full text-xs font-mono">
            <button
              onClick={() => setActiveTab('grader')}
              className={`px-2.5 py-1.5 rounded-lg text-center transition-all cursor-pointer truncate ${
                activeTab === 'grader'
                  ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/40 shadow-xs font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              1. Chart Grader
            </button>
            <button
              onClick={() => setActiveTab('watchdog')}
              className={`px-2.5 py-1.5 rounded-lg text-center transition-all cursor-pointer truncate ${
                activeTab === 'watchdog'
                  ? 'bg-rose-950/80 text-rose-200 border border-rose-500/40 shadow-xs font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              2. Tilt &amp; Churn
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-2.5 py-1.5 rounded-lg text-center transition-all cursor-pointer truncate ${
                activeTab === 'calculator'
                  ? 'bg-cyan-950/80 text-cyan-200 border border-cyan-500/40 shadow-xs font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              3. MRR Saved
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-2.5 py-1.5 rounded-lg text-center transition-all cursor-pointer truncate ${
                activeTab === 'architecture'
                  ? 'bg-zinc-800 text-white border border-white/20 shadow-xs font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              4. Determinism
            </button>
          </div>

        </div>
      </header>

      {/* 2. SUB-HERO BANNER */}
      <section className="border-b border-white/[0.06] bg-gradient-to-b from-[#0f1117] to-[#090a0c] py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-2.5">
          <div className="inline-flex items-center space-x-2 text-[11px] font-mono text-emerald-400 font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Deterministic AI Architecture · Zero Hallucinations · Strict Playbook Rubric</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            24/7 AI Trade Grader &amp; Whop Silent Churn Guardian
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            Eliminates mentor support burnout by grading member charts against your exact playbook in 10 seconds. 
            Catches members who hit losing streaks or go inactive, sending an automated reset before they cancel their Whop subscription.
          </p>
        </div>
      </section>

      {/* 3. MAIN INTERACTIVE CONTENT */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* ======================================================== */}
        {/* TAB 1: 24/7 AI TRADE GRADER DEMO */}
        {/* ======================================================== */}
        {activeTab === 'grader' && (
          <div className="space-y-6">
            
            {/* Scenario Picker Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                  Test With Preset Member Setups:
                </span>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
                  <RefreshCw className="w-3 h-3" />
                  <span>Interactive Engine Live</span>
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {DEMO_CHART_SCENARIOS.map((scen, idx) => (
                  <button
                    key={scen.id}
                    onClick={() => handleSelectScenario(idx)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                      selectedScenarioIdx === idx
                        ? 'bg-[#15171d] border-emerald-500/60 shadow-md ring-1 ring-emerald-500/30'
                        : 'bg-[#0f1115] border-white/[0.08] hover:border-white/20 text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        {scen.instrument} · {scen.timeframe}
                      </span>
                      <span className={`text-[10px] font-mono font-semibold ${
                        scen.expectedGrade === 'A_SETUP' ? 'text-emerald-400' :
                        scen.expectedGrade === 'B_SETUP' ? 'text-amber-400' :
                        scen.expectedGrade === 'INVALID' ? 'text-rose-400' : 'text-cyan-400'
                      }`}>
                        {scen.expectedGrade.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-zinc-200 line-clamp-2">
                      {scen.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Chart Audit Display Card */}
            <div className="rounded-2xl bg-[#121316] border border-white/[0.08] p-4 sm:p-6 space-y-5">
              
              {/* Card Header & Channel Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
                    <span>Target Setup:</span>
                    <span className="font-bold text-white">{auditInput.instrument} ({auditInput.timeframe})</span>
                    <span>·</span>
                    <span className="text-zinc-500">Direction: {auditInput.setupDirection}</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                    {currentScenario.name}
                  </h2>
                </div>

                {/* Channel Switcher */}
                <div className="flex items-center p-1 bg-zinc-900 rounded-lg border border-white/10 text-xs font-mono">
                  <button
                    onClick={() => setChannelView('discord')}
                    className={`px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1.5 cursor-pointer ${
                      channelView === 'discord' ? 'bg-[#5865F2] text-white font-semibold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Discord Embed</span>
                  </button>
                  <button
                    onClick={() => setChannelView('telegram')}
                    className={`px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1.5 cursor-pointer ${
                      channelView === 'telegram' ? 'bg-[#229ED9] text-white font-semibold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Telegram</span>
                  </button>
                  <button
                    onClick={() => setChannelView('json')}
                    className={`px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1.5 cursor-pointer ${
                      channelView === 'json' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Schema JSON</span>
                  </button>
                </div>
              </div>

              {/* DISCORD EMBED VIEW */}
              {channelView === 'discord' && (
                <div className="p-4 sm:p-5 rounded-xl bg-[#2b2d31] border-l-4 border-emerald-400 space-y-4 font-sans text-xs">
                  
                  {/* Bot Identity Header */}
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center font-bold text-white text-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-semibold text-white">ICT Playbook Bot</span>
                        <span className="text-[9px] bg-[#5865F2] text-white px-1 py-0.2 rounded font-mono uppercase font-bold">
                          BOT
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">Today at {auditInput.sessionTimeUtc} UTC</span>
                      </div>
                      <p className="text-[11px] text-zinc-300">Replying to member @AlexVance in #chart-grading</p>
                    </div>
                  </div>

                  {/* Main Grade Box */}
                  <div className="p-3.5 rounded-lg bg-[#1e1f22] border border-white/[0.04] space-y-3">
                    
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                      <div className="flex items-center space-x-2">
                        {auditResult.setupGrade === 'A_SETUP' && (
                          <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-bold font-mono text-xs border border-emerald-500/30">
                            ✓ GRADE: A-SETUP (SCORE: {auditResult.totalScore}/100)
                          </span>
                        )}
                        {auditResult.setupGrade === 'B_SETUP' && (
                          <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 font-bold font-mono text-xs border border-amber-500/30">
                            ⚠ GRADE: B-SETUP (SCORE: {auditResult.totalScore}/100)
                          </span>
                        )}
                        {auditResult.setupGrade === 'INVALID' && (
                          <span className="px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 font-bold font-mono text-xs border border-rose-500/30">
                            ✕ GRADE: DISQUALIFIED (SCORE: {auditResult.totalScore}/100)
                          </span>
                        )}
                        {auditResult.setupGrade === 'ESCALATE_TO_MENTOR' && (
                          <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 font-bold font-mono text-xs border border-cyan-500/30">
                            ? ESCALATED TO #MENTOR-REVIEW
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">
                        Confidence: {Math.round(auditResult.confidenceScore * 100)}%
                      </span>
                    </div>

                    <p className="text-zinc-200 leading-relaxed">
                      {auditResult.summary}
                    </p>

                    {/* 5 Deterministic Rule Checks */}
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                        Playbook Rule Audit Checklist:
                      </p>
                      <div className="grid grid-cols-1 gap-1.5">
                        {auditResult.checks.map((chk) => (
                          <div 
                            key={chk.ruleId} 
                            className={`p-2 rounded-md border flex items-start justify-between gap-2 text-[11px] ${
                              chk.passed 
                                ? 'bg-emerald-950/20 border-emerald-500/20 text-zinc-300' 
                                : 'bg-rose-950/20 border-rose-500/20 text-zinc-400'
                            }`}
                          >
                            <div className="flex items-start space-x-2">
                              {chk.passed ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                              )}
                              <div>
                                <span className="font-semibold text-white">{chk.ruleName}</span>
                                <p className="text-[10px] text-zinc-400 mt-0.5">{chk.detail}</p>
                              </div>
                            </div>
                            <span className="font-mono text-[10px] shrink-0 font-bold text-zinc-300">
                              +{chk.scoreEarned}/{chk.maxScore}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timestamped Course Video Reference */}
                    {auditResult.courseReference && (
                      <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
                        <div className="flex items-center space-x-2 text-emerald-300 font-semibold text-[11px]">
                          <Video className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Linked Course Playbook Lesson:</span>
                        </div>
                        <p className="text-zinc-200 text-[11px]">
                          "{auditResult.courseReference.lesson}"
                        </p>
                        <div className="flex items-center space-x-2 text-[10px] font-mono text-emerald-400 pt-0.5">
                          <span className="underline cursor-pointer flex items-center space-x-1">
                            <span>{auditResult.courseReference.module} → {auditResult.courseReference.videoTitle} ({auditResult.courseReference.timestamp})</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Recommendation Card */}
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04] text-[11px] font-mono text-zinc-300">
                      <span className="text-emerald-400 font-bold">Action Protocol:</span> {auditResult.recommendedAction}
                    </div>

                  </div>
                </div>
              )}

              {/* TELEGRAM VIEW */}
              {channelView === 'telegram' && (
                <div className="p-4 sm:p-5 rounded-xl bg-[#0f1115] border border-white/[0.08] space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-zinc-400 border-b border-white/[0.06] pb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-[#229ED9]/20 text-[#229ED9] flex items-center justify-center font-bold text-[10px]">
                        TG
                      </div>
                      <span className="font-semibold text-white">ICT Mentor Bot</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-1.5 py-0.2 rounded font-sans">verified</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">10s ago</span>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900/80 border border-white/[0.04] space-y-2 text-zinc-200 leading-relaxed text-[11px]">
                    <p className="font-bold text-white">
                      Setup Audit: {auditInput.instrument} ({auditInput.timeframe}) — {auditResult.setupGrade.replace('_', ' ')}
                    </p>
                    <p>{auditResult.summary}</p>
                    <div className="p-2 rounded bg-black/40 space-y-1 text-[10px]">
                      <p>• Score: {auditResult.totalScore}/100</p>
                      <p>• Killzone: {auditInput.sessionTimeUtc} UTC</p>
                      <p>• Macro Risk: {auditInput.hasRedFolderNewsWithin30m ? 'RED FOLDER NEWS DETECTED' : 'CLEAR'}</p>
                    </div>
                    {auditResult.courseReference && (
                      <p className="text-emerald-400 text-[10px]">
                        📖 Playbook Reference: {auditResult.courseReference.module} ({auditResult.courseReference.timestamp})
                      </p>
                    )}
                    <button className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors cursor-pointer mt-2">
                      View Rule Breakdown in Whop Hub →
                    </button>
                  </div>
                </div>
              )}

              {/* SCHEMA JSON VIEW */}
              {channelView === 'json' && (
                <div className="p-4 rounded-xl bg-black border border-white/[0.08] space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-1 border-b border-white/[0.06]">
                    <span>POST /api/community/grade-chart (Schema Response)</span>
                    <button
                      onClick={() => handleCopy(JSON.stringify(auditResult, null, 2))}
                      className="text-zinc-400 hover:text-white flex items-center space-x-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedCode ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                  </div>
                  <pre className="text-[11px] text-emerald-400 overflow-x-auto p-2">
                    {JSON.stringify(auditResult, null, 2)}
                  </pre>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] sm:text-xs pt-1 text-zinc-400">
                <span>Result for the Trading Educator:</span>
                <span className="text-white font-medium">Saves 3 hours/day grading charts + provides students instant 24/7 answers without hallucinating</span>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ANTI-CHURN & TILT WATCHDOG */}
        {/* ======================================================== */}
        {activeTab === 'watchdog' && (
          <div className="space-y-6">
            
            {/* Member Queue Selector */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                Live Member Risk Monitor (Simulated Community Feed):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {DEMO_COMMUNITY_MEMBERS.map((mem, idx) => (
                  <button
                    key={mem.memberId}
                    onClick={() => {
                      setSelectedMemberIdx(idx);
                      setInterventionTriggered(true);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      selectedMemberIdx === idx
                        ? 'bg-[#15171d] border-rose-500/60 shadow-md ring-1 ring-rose-500/30'
                        : 'bg-[#0f1115] border-white/[0.08] hover:border-white/20 text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white text-xs">@{mem.discordUsername}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        mem.riskStatus === 'TILT_RISK' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        mem.riskStatus === 'CHURN_RISK_INACTIVE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {mem.riskStatus === 'TILT_RISK' ? '3 Losses (Tilt Risk)' :
                         mem.riskStatus === 'CHURN_RISK_INACTIVE' ? 'Inactive (Ghost Risk)' : 'Healthy'}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-zinc-400 space-y-0.5">
                      <p>Plan: <span className="text-white">{mem.subscriptionPlan}</span></p>
                      <p>Whop Renewal: <span className="text-rose-400 font-bold">{mem.daysUntilWhopRenewal} days</span></p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Intervention Card */}
            {currentIntervention ? (
              <div className="rounded-2xl bg-[#121316] border-2 border-rose-500/30 p-4 sm:p-6 space-y-5">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-white/[0.06]">
                  <div>
                    <div className="flex items-center space-x-2 text-xs font-mono text-rose-400 font-bold">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{currentIntervention.triggerType.replace(/_/g, ' ')}</span>
                      <span>·</span>
                      <span className="text-zinc-400 font-normal">MRR at Risk: ${currentIntervention.savedMonthlyRevenue}/mo</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-white mt-1">
                      Target: @{currentIntervention.discordUsername} — {currentIntervention.detectedCondition}
                    </h2>
                  </div>

                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 self-start sm:self-auto font-semibold">
                    Whop Cancellation Prevented
                  </span>
                </div>

                {/* Simulated Private Discord DM */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#2b2d31] border border-white/[0.08] space-y-3 font-sans text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-[#5865F2] flex items-center justify-center font-bold text-white text-xs">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-semibold text-white">Trading Community Risk Bot</span>
                        <span className="text-[9px] bg-[#5865F2] text-white px-1 py-0.2 rounded font-mono ml-1.5 font-bold uppercase">
                          DIRECT MESSAGE
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">Automated Retention DM</span>
                  </div>

                  <div className="space-y-3 text-zinc-200 leading-relaxed text-xs">
                    <p className="font-semibold text-white text-sm">
                      {currentIntervention.dmSubject}
                    </p>
                    <p className="whitespace-pre-line text-zinc-300 bg-[#1e1f22] p-3 rounded-lg border border-white/[0.04]">
                      {currentIntervention.dmMessageBody}
                    </p>
                  </div>

                  {/* Attached Resource & Action Buttons */}
                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center space-x-2 text-[11px]">
                      <Video className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="font-semibold text-white">Attached Retention Asset:</span>
                        <p className="text-[10px] text-zinc-400">{currentIntervention.attachedWeeklyAsset}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shrink-0">
                      Saves ${currentIntervention.savedMonthlyRevenue}/mo MRR
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-zinc-400">
                  <span>Automated Backend Dispatch:</span>
                  <span className="text-emerald-400 font-semibold">{currentIntervention.actionTaken}</span>
                </div>

              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-[#121316] border border-white/[0.08] text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Member is in Healthy State</h3>
                <p className="text-xs text-zinc-400">No tilt or inactivity triggers detected. Next Whop billing scheduled normally.</p>
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: CREATOR WHOP MRR RETENTION CALCULATOR */}
        {/* ======================================================== */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            
            <div className="rounded-2xl bg-[#121316] border-2 border-emerald-500/40 p-4 sm:p-6 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-white/[0.06]">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    Whop Creator Unit Economics
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5">
                    Protected Subscription MRR &amp; Churn Deflection
                  </h2>
                </div>
                <span className="text-xs font-mono text-zinc-400">
                  Calculates exact ROI on $1,500 setup fee
                </span>
              </div>

              {/* 3 Interactive Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Slider 1: Active Members */}
                <div className="p-4 rounded-xl bg-[#0f1115] border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400">Active Paid Members</span>
                    <span className="text-base font-bold text-white font-mono">{memberCount}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1500"
                    step="25"
                    value={memberCount}
                    onChange={(e) => setMemberCount(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>100</span>
                    <span>750</span>
                    <span>1,500</span>
                  </div>
                </div>

                {/* Slider 2: Monthly Sub Price */}
                <div className="p-4 rounded-xl bg-[#0f1115] border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400">Monthly Sub Fee</span>
                    <span className="text-base font-bold text-emerald-400 font-mono">${subPrice}/mo</span>
                  </div>
                  <input
                    type="range"
                    min="49"
                    max="199"
                    step="5"
                    value={subPrice}
                    onChange={(e) => setSubPrice(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>$49</span>
                    <span>$125</span>
                    <span>$199</span>
                  </div>
                </div>

                {/* Slider 3: Churn Saved */}
                <div className="p-4 rounded-xl bg-[#0f1115] border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400">Cancellations Saved / Mo</span>
                    <span className="text-base font-bold text-cyan-400 font-mono">{savedMembers} members</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="25"
                    step="1"
                    value={savedMembers}
                    onChange={(e) => setSavedMembers(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>2</span>
                    <span>12</span>
                    <span>25</span>
                  </div>
                </div>

              </div>

              {/* Big Result Box */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-black to-cyan-950/40 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    Total Preserved Subscription Revenue:
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono mt-1">
                    +${monthlyMRRSaved.toLocaleString()} <span className="text-base text-zinc-400 font-sans font-normal">/ month MRR</span>
                  </div>
                  <p className="text-xs font-mono text-zinc-400 mt-1">
                    +${annualProtectedRunRate.toLocaleString()} / year in protected recurring cashflow
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs space-y-1 sm:text-right">
                  <p className="text-zinc-400">Setup Fee: <span className="text-white font-bold">$1,500</span></p>
                  <p className="text-emerald-400 font-bold">Payback Period: {paybackDays} Days</p>
                  <p className="text-cyan-400 font-bold">Annual ROI: {annualROI}%</p>
                </div>
              </div>

              {/* Why Creators Love This Math */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] text-xs text-zinc-300 leading-relaxed space-y-2">
                <p className="font-bold text-white flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>The Creator Pitch Argument:</span>
                </p>
                <p>
                  "You currently make ${(memberCount * subPrice).toLocaleString()}/month on Whop. You naturally lose 20–40 members every month to rage-quits and silent churn. 
                  If this bot catches and saves just <strong className="text-white">{savedMembers} members</strong> before their renewal date, it preserves <strong className="text-emerald-400">+${monthlyMRRSaved.toLocaleString()}/month</strong>. 
                  My $1,500 setup fee is paid off in <strong className="text-white">{paybackDays} days</strong>—after that, it is pure protected profit."
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: DETERMINISTIC ARCHITECTURE BREAKDOWN */}
        {/* ======================================================== */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            
            <div className="rounded-2xl bg-[#121316] border border-white/[0.08] p-4 sm:p-6 space-y-6">
              
              <div className="border-b border-white/[0.06] pb-3">
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                  Technical Architecture
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                  How We Eliminate AI Hallucinations in Trading
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Standard LLMs give contradictory trading advice. We built a 5-pillar deterministic rule gate.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Pillar 1 */}
                <div className="p-4 rounded-xl bg-[#0f1115] border border-white/[0.08] space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>1. 0% AI on Churn Triggers</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Tilt and inactivity triggers use 100% deterministic code (<code className="text-emerald-400 font-mono text-[11px]">losses &gt;= 3</code> or <code className="text-emerald-400 font-mono text-[11px]">daysInactive &gt;= 5</code>). Zero LLMs are used to decide whether to intervene.
                  </p>
                </div>

                {/* Pillar 2 */}
                <div className="p-4 rounded-xl bg-[#0f1115] border border-white/[0.08] space-y-2">
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs font-mono">
                    <Shield className="w-4 h-4" />
                    <span>2. Strict JSON Schema Validation</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    AI does not write subjective opinions. It returns a strictly typed schema validating binary checks (Killzone time, sweep verified, body displacement). Your code calculates the score.
                  </p>
                </div>

                {/* Pillar 3 */}
                <div className="p-4 rounded-xl bg-[#0f1115] border border-white/[0.08] space-y-2">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs font-mono">
                    <Clock className="w-4 h-4" />
                    <span>3. External Economic Calendar API</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Macro news blackouts are queried deterministically from an economic calendar API. If high-impact news occurs within 30 minutes, the setup is automatically disqualified.
                  </p>
                </div>

                {/* Pillar 4 */}
                <div className="p-4 rounded-xl bg-[#0f1115] border border-white/[0.08] space-y-2">
                  <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs font-mono">
                    <AlertTriangle className="w-4 h-4" />
                    <span>4. Fail-Safe Mentor Escalation</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    If chart image quality, timeframe, or labels fall below the 0.75 confidence threshold, the bot refuses to guess and escalates the setup to the creator's <code className="text-white font-mono text-[11px]">#mentor-review</code> channel.
                  </p>
                </div>

              </div>

              {/* Pillar 5 Quote */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start space-x-3 text-xs">
                <Video className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">5. Timestamped Course Quotations (RAG)</span>
                  <p className="text-zinc-300 mt-0.5">
                    When answering student questions, the bot only quotes the creator's transcribed course videos and links the exact timestamp (e.g. <em>Module 2 at 09:45</em>). It never invents independent trading theories.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* 4. FOOTER */}
      <footer className="border-t border-white/[0.08] py-6 px-4 text-center text-xs text-zinc-500 font-mono">
        <p>PropFirm OS · Community AI Companion Engine v2.4 · Built for Whop &amp; Discord Trading Groups</p>
      </footer>

    </div>
  );
}
