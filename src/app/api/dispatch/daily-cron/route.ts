import { NextResponse } from 'next/server';
import { getFleetAccounts, getAccountByNumber } from '@/db/repository';
import {
  generateDailyEODDebrief,
  buildOutboundDispatchPayload,
} from '@/engine/dispatch-engine';

export async function GET() {
  return NextResponse.json({
    service: 'PropFirmAI Daily EOD Batch Cron (Market Close Trigger)',
    scheduledTimeUtc: '21:00 UTC (Post New York Close)',
    cadenceRule: 'Sends 1 quiet personalized recap per trader who traded today. Zero popups or interruptions during the session.',
  });
}

export async function POST() {
  try {
    const fleet = await getFleetAccounts();
    const activeToday = fleet.filter((a) => a.status !== 'BREACHED').slice(0, 50);

    const dispatches = [];
    for (const item of activeToday) {
      const details = await getAccountByNumber(item.accountNumber);
      if (details) {
        const debrief = generateDailyEODDebrief(details.account, details.closedTrades);
        const payload = buildOutboundDispatchPayload('DAILY_EOD_RECAP', 'KLAVIYO', details.account, {
          debrief,
        });
        dispatches.push({
          accountNumber: item.accountNumber,
          traderName: item.name,
          email: details.account.email,
          subject: payload.subject,
          dailyPnl: debrief.totalPnl,
          disciplineGrade: debrief.disciplineRating,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      batchRunAt: new Date().toISOString(),
      cadencePolicy: 'NORMAL POST-MARKET CADENCE',
      processedAccounts: dispatches.length,
      sampleDispatches: dispatches.slice(0, 5),
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Cron failed' },
      { status: 500 }
    );
  }
}

