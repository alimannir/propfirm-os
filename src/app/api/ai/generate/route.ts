import { NextRequest, NextResponse } from 'next/server';
import {
  generateLiveInFlightNudge,
  generateLivePostBreachDebrief,
} from '@/engine/ai-provider';
import { getAccountByNumber } from '@/db/repository';
import { classifyTraderArchetype } from '@/engine/classifier';
import { calculateTiltMetrics } from '@/engine/behavioral';
import { CoachTone } from '@/engine/ai-coach';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      accountNumber,
      action = 'EOD_DEBRIEF', // 'IN_FLIGHT_NUDGE' | 'POST_BREACH_DEBRIEF' | 'EOD_DEBRIEF'
      tone = 'peer_buddy' as CoachTone,
    } = body;

    if (!accountNumber) {
      return NextResponse.json(
        { ok: false, error: 'accountNumber is required' },
        { status: 400 }
      );
    }

    const data = await getAccountByNumber(accountNumber);
    if (!data) {
      return NextResponse.json(
        { ok: false, error: `Account #${accountNumber} not found` },
        { status: 404 }
      );
    }

    const { account, openPositions, closedTrades } = data;
    const metrics = calculateTiltMetrics(account, openPositions, closedTrades);
    const { archetype, offer } = classifyTraderArchetype(account, closedTrades);

    if (action === 'POST_BREACH_DEBRIEF' || account.status === 'BREACHED') {
      const debrief = await generateLivePostBreachDebrief(
        account,
        closedTrades,
        archetype,
        offer,
        tone
      );
      return NextResponse.json({
        ok: true,
        action: 'POST_BREACH_DEBRIEF',
        accountNumber,
        traderName: account.traderName,
        debrief,
      });
    }

    const nudge = await generateLiveInFlightNudge(
      account,
      openPositions,
      closedTrades,
      metrics,
      tone
    );

    return NextResponse.json({
      ok: true,
      action: 'IN_FLIGHT_NUDGE',
      accountNumber,
      traderName: account.traderName,
      nudge,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : 'AI generation failed',
      },
      { status: 500 }
    );
  }
}

