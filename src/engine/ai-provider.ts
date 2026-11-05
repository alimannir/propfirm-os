import {
  AccountInfo,
  Position,
  ClosedTrade,
  TraderArchetype,
  RetentionOffer,
  TraderTiltMetrics,
} from '@/types';
import {
  generateAIInFlightNudge as fallbackInFlightNudge,
  generateAIPersonalizedDebrief as fallbackDebrief,
  AIInFlightNudge,
  AIPersonalizedDebrief,
  CoachTone,
} from './ai-coach';

export interface AIServiceConfig {
  provider: 'GEMINI' | 'OPENAI' | 'GROQ' | 'AUTO';
  apiKey?: string;
  modelName: string;
}

// In-memory runtime configuration with fallback to environment variables
let runtimeConfig: AIServiceConfig = {
  provider: 'AUTO',
  apiKey: process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY || '',
  modelName: 'gemini-1.5-flash',
};

export function setAIServiceConfig(config: Partial<AIServiceConfig>): void {
  runtimeConfig = { ...runtimeConfig, ...config };
}

export function getAIServiceConfig(): AIServiceConfig {
  return { ...runtimeConfig };
}

/**
 * Generates an in-flight coaching suggestion via real LLM (Gemini/OpenAI/Groq)
 * or falls back seamlessly to the semantic memory engine if no API key is active.
 */
export async function generateLiveInFlightNudge(
  account: AccountInfo,
  openPositions: Position[],
  closedTrades: ClosedTrade[],
  metrics: TraderTiltMetrics,
  tone: CoachTone = 'peer_buddy'
): Promise<AIInFlightNudge & { generatedBy: 'LIVE_LLM' | 'SEMANTIC_ENGINE'; modelUsed: string }> {
  const fallback = fallbackInFlightNudge(account, openPositions, closedTrades, metrics, tone);

  const activeKey = runtimeConfig.apiKey;
  if (!activeKey || activeKey.startsWith('Q.Ab8RN') || activeKey.startsWith('gsk_')) {
    return {
      ...fallback,
      generatedBy: 'SEMANTIC_ENGINE',
      modelUsed: 'Local Behavioral Memory Synthesizer',
    };
  }

  // Construct system & trader context prompt
  const traderName = account.memory?.preferredName || account.traderName.split(' ')[0] || 'Trader';
  const memoryNotes = account.memory?.buddyNotebook.slice(0, 3).join(' | ') || 'None';
  const lastClosed = closedTrades[closedTrades.length - 1];
  const active = openPositions[0];

  const prompt = `
You are the AI "Trading Buddy" for a proprietary trading firm.
You are talking directly to ${traderName} in their live trading portal cockpit.
CRITICAL RULES:
1. TALK LIKE A REAL HUMAN TRADING DESK BUDDY. Warm, empathetic, calm, peer-to-peer.
2. NO ROBOTIC CORPORATE PHRASES (Never say "Warning: Order # carries X lots").
3. SUGGESTION ONLY: Prop firms make revenue on failed challenges; NEVER sound like an authority blocking trades. The trader has 100% autonomy.
4. RECALL MEMORY: Mention their past habits if relevant (Memory: ${memoryNotes}).

CURRENT STATE:
- Trader: ${traderName} (Account #${account.accountNumber})
- Active Position: ${active ? `${active.lots} lots on ${active.symbol}` : 'None'}
- Last Closed: ${lastClosed ? `${lastClosed.symbol} for ${lastClosed.pnl >= 0 ? '+' : ''}$${lastClosed.pnl}` : 'None'}
- Remaining Daily Buffer: $${Math.round(metrics.remainingDailyLossUsd)}
- Tone requested: ${tone}

Output ONLY valid JSON with keys:
{
  "headline": "Short punchy conversational headline",
  "message": "2-3 sentences of human conversational suggestion",
  "audioVoiceoverScript": "1-2 sentences to be spoken in their ear",
  "memoryRecalled": "1 sentence summarizing what you remembered about their past habits",
  "recommendedAction": "1 concrete actionable suggestion"
}
`;

  try {
    const rawText = await callLLMProvider(prompt, runtimeConfig);
    const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      headline: parsed.headline || fallback.headline,
      message: parsed.message || fallback.message,
      audioVoiceoverScript: parsed.audioVoiceoverScript || fallback.audioVoiceoverScript,
      memoryRecalled: parsed.memoryRecalled || fallback.memoryRecalled,
      recommendedAction: parsed.recommendedAction || fallback.recommendedAction,
      dismissText: fallback.dismissText,
      generatedBy: 'LIVE_LLM',
      modelUsed: runtimeConfig.modelName || 'Gemini 1.5 Flash',
    };
  } catch (err) {
    // Graceful fallback to guaranteed deterministic response
    return {
      ...fallback,
      generatedBy: 'SEMANTIC_ENGINE',
      modelUsed: 'Local Behavioral Memory Synthesizer (Fallback)',
    };
  }
}

/**
 * Generates the human Post-Breach Forensic Audit Letter & Debrief via real LLM.
 */
export async function generateLivePostBreachDebrief(
  account: AccountInfo,
  closedTrades: ClosedTrade[],
  archetype: TraderArchetype,
  offer: RetentionOffer,
  tone: CoachTone = 'peer_buddy'
): Promise<AIPersonalizedDebrief & { generatedBy: 'LIVE_LLM' | 'SEMANTIC_ENGINE'; modelUsed: string }> {
  const fallback = fallbackDebrief(account, closedTrades, archetype, offer, tone);

  const activeKey = runtimeConfig.apiKey;
  if (!activeKey || activeKey.startsWith('Q.Ab8RN') || activeKey.startsWith('gsk_')) {
    return {
      ...fallback,
      generatedBy: 'SEMANTIC_ENGINE',
      modelUsed: 'Local Behavioral Memory Synthesizer',
    };
  }

  const traderName = account.memory?.preferredName || account.traderName.split(' ')[0] || 'Trader';
  const memoryNotes = account.memory?.buddyNotebook.slice(0, 3).join(' | ') || 'None';

  const prompt = `
You are the Chief Behavioral Performance Mentor for a proprietary trading firm.
Write a personal, candid post-breach debrief letter to ${traderName} who just hit their daily drawdown limit on Account #${account.accountNumber}.

RULES:
1. Validate their skill first (they don't suck, they built great setups).
2. Explain honestly that the execution was audited 99.4% clean (deflecting blame from broker spreads).
3. Identify that sizing/impatience was the true culprit.
4. Recall memory from past challenges: ${memoryNotes}.
5. Introduce their tailored recovery package: ${offer.title} (${offer.discountPct}% off, code: ${offer.couponCode}).

Output JSON ONLY with keys:
{
  "salutation": "Hey ${traderName},",
  "executiveSummary": "2-3 paragraphs of compassionate, real-talk mentorship",
  "memoryCallout": "1 paragraph referencing their past challenge history",
  "psychologicalRootCause": "1-2 sentences diagnosing why this happened",
  "actionablePrescription": ["3 bullet points of concrete changes for next attempt"]
}
`;

  try {
    const rawText = await callLLMProvider(prompt, runtimeConfig);
    const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      ...fallback,
      salutation: parsed.salutation || fallback.salutation,
      executiveSummary: parsed.executiveSummary || fallback.executiveSummary,
      memoryCallout: parsed.memoryCallout || fallback.memoryCallout,
      psychologicalRootCause: parsed.psychologicalRootCause || fallback.psychologicalRootCause,
      actionablePrescription: parsed.actionablePrescription || fallback.actionablePrescription,
      generatedBy: 'LIVE_LLM',
      modelUsed: runtimeConfig.modelName || 'Gemini 1.5 Flash',
    };
  } catch (err) {
    return {
      ...fallback,
      generatedBy: 'SEMANTIC_ENGINE',
      modelUsed: 'Local Behavioral Memory Synthesizer (Fallback)',
    };
  }
}

/**
 * Universal LLM caller supporting Google Gemini, OpenAI, and Groq endpoints.
 */
async function callLLMProvider(prompt: string, config: AIServiceConfig): Promise<string> {
  const provider = config.provider === 'AUTO' ? 'GEMINI' : config.provider;

  if (provider === 'GEMINI') {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.modelName || 'gemini-1.5-flash'}:generateContent?key=${config.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 1024,
            responseMimeType: 'application/json',
          },
        }),
      }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Gemini API call failed');
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  // OpenAI / Groq compatible format
  const endpoint =
    provider === 'GROQ'
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.modelName || (provider === 'GROQ' ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini'),
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 1024,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'API call failed');
  return data.choices?.[0]?.message?.content || '';
}

