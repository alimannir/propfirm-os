import { NextRequest, NextResponse } from 'next/server';
import { 
  evaluateChartSetupDeterministically, 
  DEFAULT_COMMUNITY_PLAYBOOK,
  ChartAuditInput 
} from '@/engine/community-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input: ChartAuditInput = {
      instrument: body.instrument || 'EURUSD',
      timeframe: body.timeframe || '15m',
      sessionTimeUtc: body.sessionTimeUtc || '08:15',
      setupDirection: body.setupDirection || 'BUY',
      chartDescription: body.chartDescription || '',
      traderNotes: body.traderNotes || '',
      hasRedFolderNewsWithin30m: Boolean(body.hasRedFolderNewsWithin30m)
    };

    // Deterministic evaluation against creator's playbook
    const auditResult = evaluateChartSetupDeterministically(input, DEFAULT_COMMUNITY_PLAYBOOK);

    return NextResponse.json({
      success: true,
      audit: auditResult,
      engineVersion: '2.4.0-deterministic',
      evaluatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chart audit error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process deterministic chart audit' },
      { status: 500 }
    );
  }
}
