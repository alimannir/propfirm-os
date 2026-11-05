'use client';

import React, { useState } from 'react';
import { Copy, Check, Play, Server, Shield, Palette, Code, CheckCircle2 } from 'lucide-react';
import { RawBrokerWebhookPayload } from '@/engine/normalizer';
import { FirmConfig } from '@/types';

interface EnterpriseIntegrationHubProps {
  firmConfig?: FirmConfig;
  onUpdateFirmConfig?: (updated: FirmConfig) => void;
}

const SAMPLE_PAYLOADS: Record<string, { label: string; payload: RawBrokerWebhookPayload }> = {
  mt5_inflight: {
    label: 'MT5 · In-Flight Sizing',
    payload: {
      platform: 'MT5',
      eventType: 'ORDER_OPEN',
      firmId: 'PropFirm OS',
      account: {
        accountNumber: '88492',
        traderName: 'Alex Vance',
        email: 'alex.vance@tradermail.io',
        planSize: 100000,
        startingBalance: 100000,
        dailyStartingBalance: 100000,
        currentBalance: 98450,
        currentEquity: 97500,
        dailyLossLimitPct: 5.0,
        maxLossLimitPct: 10.0,
        profitTargetPct: 8.0,
        serverName: 'MT5-Live01',
      },
      openPositions: [
        {
          ticketId: 'MT5-994120',
          symbol: 'XAUUSD',
          side: 0,
          volumeLots: 4.5,
          openPrice: 2746.2,
          currentPrice: 2744.1,
          unrealizedPnl: -945.0,
          openTimestamp: '2026-11-01T14:40:00Z',
        },
      ],
      recentDeals: [
        {
          dealId: 'DEAL-801',
          symbol: 'EURUSD',
          side: 0,
          volumeLots: 1.0,
          entryPrice: 1.0845,
          exitPrice: 1.0785,
          realizedPnl: -600.0,
          entryTimestamp: '2026-11-01T14:10:00Z',
          exitTimestamp: '2026-11-01T14:25:00Z',
          brokerSpreadPips: 0.6,
          referenceMidPrice: 1.0785,
          slippagePips: 0.1,
        },
      ],
    },
  },
  dxtrade_breach: {
    label: 'DXTrade · Hard Breach',
    payload: {
      platform: 'DXTrade',
      eventType: 'HARD_BREACH',
      firmId: 'PropFirm OS',
      account: {
        accountNumber: '74910',
        traderName: 'Marcus Reed',
        email: 'm.reed@quantedge.org',
        planSize: 100000,
        startingBalance: 100000,
        dailyStartingBalance: 107820,
        currentBalance: 102600,
        currentEquity: 102600,
        dailyLossLimitPct: 5.0,
        maxLossLimitPct: 10.0,
        profitTargetPct: 8.0,
        serverName: 'DXTrade-Cluster-EU',
      },
      openPositions: [],
      recentDeals: [
        {
          dealId: 'DX-104',
          symbol: 'US100',
          side: 'BUY',
          volumeLots: 8.0,
          entryPrice: 20850,
          exitPrice: 20420,
          realizedPnl: -5220,
          entryTimestamp: '2026-11-01T14:15:00Z',
          exitTimestamp: '2026-11-01T14:40:00Z',
          brokerSpreadPips: 1.1,
          referenceMidPrice: 20420,
          slippagePips: 0.2,
        },
      ],
    },
  },
};

const BRAND_PRESETS = [
  { name: 'PropFirm OS', shortCode: 'PFOS', domain: 'portal.propfirmos.io', email: 'risk@propfirmos.io' },
  { name: 'Alpha Capital Group', shortCode: 'ACG', domain: 'portal.alphacapital.com', email: 'support@alphacapital.com' },
  { name: 'Funding Pips', shortCode: 'PIPS', domain: 'dashboard.fundingpips.com', email: 'help@fundingpips.com' },
  { name: 'FundedNext', shortCode: 'FNXT', domain: 'client.fundednext.com', email: 'support@fundednext.com' },
];

export const EnterpriseIntegrationHub: React.FC<EnterpriseIntegrationHubProps> = ({
  firmConfig = {
    name: 'PropFirm OS',
    shortCode: 'PFOS',
    portalDomain: 'portal.propfirmos.io',
    supportEmail: 'risk@propfirmos.io',
    primaryBroker: 'MT5',
    licenseTier: 'ENTERPRISE_PRIVATE_DEPLOYMENT',
    brandAccent: '#ffffff',
  },
  onUpdateFirmConfig,
}) => {
  const [subTab, setSubTab] = useState<'deployment' | 'whitelabel' | 'broker_api' | 'embed'>('deployment');
  const [selectedPreset, setSelectedPreset] = useState<string>('mt5_inflight');
  const [requestJson, setRequestJson] = useState<string>(
    JSON.stringify(SAMPLE_PAYLOADS.mt5_inflight.payload, null, 2)
  );
  const [responseJson, setResponseJson] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSdk, setCopiedSdk] = useState(false);
  const [copiedDocker, setCopiedDocker] = useState(false);
  const [lastLatency, setLastLatency] = useState<number | null>(null);

  // White-Label Customizer Inputs
  const [customFirmName, setCustomFirmName] = useState(firmConfig.name);
  const [customDomain, setCustomDomain] = useState(firmConfig.portalDomain);
  const [customEmail, setCustomEmail] = useState(firmConfig.supportEmail);
  const [appliedNotice, setAppliedNotice] = useState(false);

  const handleApplyBranding = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateFirmConfig) {
      onUpdateFirmConfig({
        ...firmConfig,
        name: customFirmName.trim() || 'My Prop Firm',
        portalDomain: customDomain.trim() || 'portal.mypropfirm.com',
        supportEmail: customEmail.trim() || 'support@mypropfirm.com',
      });
      setAppliedNotice(true);
      setTimeout(() => setAppliedNotice(false), 2500);
    }
  };

  const handleSelectBrandPreset = (preset: typeof BRAND_PRESETS[0]) => {
    setCustomFirmName(preset.name);
    setCustomDomain(preset.domain);
    setCustomEmail(preset.email);
    if (onUpdateFirmConfig) {
      onUpdateFirmConfig({
        ...firmConfig,
        name: preset.name,
        shortCode: preset.shortCode,
        portalDomain: preset.domain,
        supportEmail: preset.email,
      });
      setAppliedNotice(true);
      setTimeout(() => setAppliedNotice(false), 2500);
    }
  };

  const handleSelectPayloadPreset = (key: string) => {
    setSelectedPreset(key);
    setRequestJson(JSON.stringify(SAMPLE_PAYLOADS[key].payload, null, 2));
  };

  const handleFireWebhook = async () => {
    setIsLoading(true);
    try {
      const parsed = JSON.parse(requestJson);
      const res = await fetch('/api/webhooks/trade-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      const data = await res.json();
      setLastLatency(data.latencyMs || 4.2);
      setResponseJson(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponseJson(
        JSON.stringify(
          { error: err instanceof Error ? err.message : 'Invalid JSON' },
          null,
          2
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const dockerComposeSnippet = `# Single-Tenant Private Instance Deployment
version: '3.8'

services:
  propfirm-retention-core:
    image: registry.propfirmai.com/enterprise-core:latest
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - FIRM_ID="${firmConfig.shortCode.toLowerCase()}"
      - FIRM_NAME="${firmConfig.name}"
      - BROKER_PLATFORM="MT5"
      - BROKER_MANAGER_API="https://mt5-manager.firm.internal:8443"
      - OUTBOUND_CRM="KLAVIYO"
      - DATA_SOVEREIGNTY_MODE="ISOLATED_PRIVATE_VPC"
    volumes:
      - ./data:/app/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/ai/config"]
      interval: 30s
      timeout: 5s
      retries: 3`;

  const sdkSnippet = `<!-- 1-Line Drop-in Widget for ${firmConfig.name} Trader Dashboard -->
<script
  src="https://cdn.propfirmai.com/v1/wingman-sdk.js"
  data-firm-id="${firmConfig.shortCode.toLowerCase()}"
  data-account-id="{{TRADER_ACCOUNT_NUMBER}}"
  data-platform="MT5"
  data-theme="obsidian"
  async
></script>`;

  const handleCopySdk = () => {
    navigator.clipboard.writeText(sdkSnippet);
    setCopiedSdk(true);
    setTimeout(() => setCopiedSdk(false), 2000);
  };

  const handleCopyDocker = () => {
    navigator.clipboard.writeText(dockerComposeSnippet);
    setCopiedDocker(true);
    setTimeout(() => setCopiedDocker(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-[13px] text-zinc-400">
            Enterprise Product Delivery · Single-Tenant
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mt-1">
            Private Deployment &amp; White-Label Setup
          </h1>
        </div>

        {/* Sub-navigation */}
        <div className="flex items-center p-1 bg-zinc-900 rounded-full border border-white/[0.06] text-[12px] self-start sm:self-auto">
          <button
            onClick={() => setSubTab('deployment')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
              subTab === 'deployment' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Private VPC &amp; Docker
          </button>
          <button
            onClick={() => setSubTab('whitelabel')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
              subTab === 'whitelabel' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            White-Label Studio
          </button>
          <button
            onClick={() => setSubTab('broker_api')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
              subTab === 'broker_api' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Broker API Stream
          </button>
          <button
            onClick={() => setSubTab('embed')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
              subTab === 'embed' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Portal SDK Embed
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: PRIVATE DOCKER DEPLOYMENT (DATA SOVEREIGNTY) */}
      {subTab === 'deployment' && (
        <div className="space-y-6">
          {/* Data Sovereignty Guarantee Card */}
          <div className="bg-[#121214] border border-white/[0.08] rounded-2xl p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
                  Data Sovereignty &amp; Security Architecture
                </span>
                <h2 className="text-lg font-semibold text-white">
                  Why This is Built as an On-Premise / Private VPC Product
                </h2>
                <p className="text-[13px] text-zinc-400 leading-relaxed">
                  Prop firms handle sensitive trader deposits, account balances, and proprietary order execution logs.
                  Unlike public multi-tenant SaaS tools, this core runs as a <span className="text-white font-medium">single-tenant private container</span> inside your AWS, GCP, or Hetzner VPC.
                  Your trade feeds and client PII never exit your security boundary.
                </p>
              </div>

              <div className="hidden md:flex flex-col items-end text-right font-mono text-[12px] text-zinc-400 space-y-1">
                <span className="text-emerald-400 font-semibold">100% Private Cloud</span>
                <span>Zero Multi-Tenant Sharing</span>
                <span>Read-Only Broker Socket</span>
              </div>
            </div>
          </div>

          {/* Docker Compose File */}
          <div className="bg-[#121214] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Production `docker-compose.yml`
                </h3>
                <p className="text-[12px] text-zinc-400 mt-0.5">
                  Deploy the entire retention engine inside your private infrastructure with 1 command
                </p>
              </div>

              <button
                onClick={handleCopyDocker}
                className="px-4 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] text-[12px] font-medium text-white flex items-center space-x-1.5 self-start sm:self-auto transition-colors cursor-pointer"
              >
                {copiedDocker ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied Docker Compose</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy Config</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-zinc-950 border border-white/[0.06] font-mono text-[11px] text-zinc-300 overflow-x-auto leading-relaxed">
              {dockerComposeSnippet}
            </pre>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: WHITE-LABEL BRAND STUDIO */}
      {subTab === 'whitelabel' && (
        <div className="space-y-6">
          <div className="bg-[#121214] border border-white/[0.08] rounded-2xl p-6 sm:p-8">
            <div className="max-w-2xl space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
                100% White-Label Delivery
              </span>
              <h2 className="text-lg font-semibold text-white">
                Brand Customization Studio
              </h2>
              <p className="text-[13px] text-zinc-400 leading-relaxed">
                Test how the Trader Portal HUD and Post-Breach Audit re-skin in real-time under your prop firm&apos;s exact brand identity.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <div className="text-[12px] text-zinc-400 font-medium mb-2.5">
                Quick Industry Presets:
              </div>
              <div className="flex flex-wrap gap-2">
                {BRAND_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => handleSelectBrandPreset(p)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors cursor-pointer ${
                      firmConfig.name === p.name
                        ? 'bg-zinc-800 text-white border-white/20'
                        : 'bg-zinc-900 text-zinc-400 border-white/[0.06] hover:text-white'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Inputs */}
            <form onSubmit={handleApplyBranding} className="mt-6 space-y-4 max-w-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
                <div>
                  <label className="text-zinc-400 block mb-1.5 text-[12px]">
                    Prop Firm Legal Name
                  </label>
                  <input
                    type="text"
                    value={customFirmName}
                    onChange={(e) => setCustomFirmName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-white focus:outline-none"
                    placeholder="e.g. Your Prop Firm"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1.5 text-[12px]">
                    Custom Trader Portal Domain
                  </label>
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-white font-mono focus:outline-none"
                    placeholder="e.g. portal.mypropfirm.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1.5 text-[12px]">
                  Official Support / Risk Email (Sender)
                </label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-white font-mono focus:outline-none"
                  placeholder="e.g. risk@mypropfirm.com"
                />
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-medium text-[13px] flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  {appliedNotice && <Check className="w-3.5 h-3.5" />}
                  <span>{appliedNotice ? 'Applied Across App!' : 'Apply Brand Settings'}</span>
                </button>
                {appliedNotice && (
                  <span className="text-[12px] text-emerald-400 font-mono">
                    Updated live in Navbar, HUD &amp; Audits
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: BROKER API WEBHOOK STREAM */}
      {subTab === 'broker_api' && (
        <div className="bg-[#121214] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
            <div>
              <h2 className="text-[15px] font-semibold text-white">
                Broker Event Ingestion (`POST /api/webhooks/trade-event`)
              </h2>
              <p className="text-[13px] text-zinc-400 mt-0.5">
                Read-only webhook from MT5 Manager API, DXTrade Gateway, or cTrader
              </p>
            </div>

            <div className="flex items-center space-x-1.5">
              {Object.entries(SAMPLE_PAYLOADS).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => handleSelectPayloadPreset(key)}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors cursor-pointer ${
                    selectedPreset === key
                      ? 'bg-zinc-800 text-white border border-white/[0.1]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-zinc-400 font-medium">Broker Payload (JSON)</span>
                <button
                  onClick={handleFireWebhook}
                  disabled={isLoading}
                  className="px-4 py-1.5 rounded-full bg-white hover:bg-zinc-200 text-black font-medium text-[12px] flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3" />
                  <span>{isLoading ? 'Processing...' : 'Send Live Broker Event'}</span>
                </button>
              </div>
              <textarea
                value={requestJson}
                onChange={(e) => setRequestJson(e.target.value)}
                rows={16}
                className="w-full p-4 rounded-xl bg-zinc-950 border border-white/[0.06] font-mono text-[11px] text-zinc-200 focus:outline-none focus:border-white/20 leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[12px] h-7">
                <span className="text-zinc-400 font-medium">Engine Response (Telemetry &amp; Audit)</span>
                {lastLatency !== null && (
                  <span className="text-emerald-400 font-mono text-[11px]">
                    200 OK · {lastLatency}ms latency
                  </span>
                )}
              </div>
              <pre className="w-full h-[350px] p-4 rounded-xl bg-zinc-950 border border-white/[0.06] font-mono text-[11px] text-zinc-300 overflow-auto leading-relaxed">
                {responseJson || '// Click "Send Live Broker Event" to execute against the engine...'}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: 1-LINE CLIENT PORTAL EMBED */}
      {subTab === 'embed' && (
        <div className="bg-[#121214] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
            <div>
              <h2 className="text-[15px] font-semibold text-white">
                Trader Dashboard Embed Snippet
              </h2>
              <p className="text-[13px] text-zinc-400 mt-0.5">
                Drop into {firmConfig.name}&apos;s existing trader web portal HTML to mount the HUD and instant audit modal
              </p>
            </div>

            <button
              onClick={handleCopySdk}
              className="px-4 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] text-[12px] font-medium text-white flex items-center space-x-1.5 self-start sm:self-auto transition-colors cursor-pointer"
            >
              {copiedSdk ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied Embed Script</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy Snippet</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-zinc-950 border border-white/[0.06] font-mono text-[12px] text-zinc-300 overflow-x-auto leading-relaxed">
            {sdkSnippet}
          </pre>
        </div>
      )}
    </div>
  );
};
