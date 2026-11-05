import { NextRequest, NextResponse } from 'next/server';
import { getAIServiceConfig, setAIServiceConfig } from '@/engine/ai-provider';

export async function GET() {
  const cfg = getAIServiceConfig();
  return NextResponse.json({
    provider: cfg.provider,
    modelName: cfg.modelName,
    hasApiKey: Boolean(cfg.apiKey && cfg.apiKey.length > 5),
    maskedKey: cfg.apiKey ? `${cfg.apiKey.slice(0, 4)}••••${cfg.apiKey.slice(-4)}` : null,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider, apiKey, modelName } = body;

    setAIServiceConfig({
      provider: provider || 'AUTO',
      apiKey: apiKey !== undefined ? apiKey : undefined,
      modelName: modelName || 'gemini-1.5-flash',
    });

    const updated = getAIServiceConfig();
    return NextResponse.json({
      ok: true,
      message: 'AI provider configuration saved successfully.',
      provider: updated.provider,
      modelName: updated.modelName,
      hasApiKey: Boolean(updated.apiKey && updated.apiKey.length > 5),
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Failed to save AI configuration' },
      { status: 500 }
    );
  }
}

