import { NextRequest, NextResponse } from 'next/server';
import {
  buildOutboundDispatchPayload,
  dispatchToOutboundTool,
  generateDailyEODDebrief,
} from '@/engine/dispatch-engine';
import { getAccountByNumber } from '@/db/repository';
import { classifyTraderArchetype } from '@/engine/classifier';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      accountNumber,
      trigger = 'DAILY_EOD_RECAP',
      channel = 'KLAVIYO',
      webhookUrl,
      discordWebhookUrl,
    } = body;

    if (!accountNumber) {
      return NextResponse.json(
        { ok: false, error: 'accountNumber is required' },
        { status: 400 }
      );
    }

    const accountData = await getAccountByNumber(accountNumber);
    if (!accountData) {
      return NextResponse.json(
        { ok: false, error: `Account #${accountNumber} not found in database` },
        { status: 404 }
      );
    }

    const { account, closedTrades } = accountData;
    const { archetype, offer } = classifyTraderArchetype(account, closedTrades);
    const debrief = generateDailyEODDebrief(account, closedTrades);

    // Build the formatted payload
    const payload = buildOutboundDispatchPayload(trigger, channel, account, {
      debrief,
      archetype,
      offer,
    });

    // Execute dispatch
    const result = await dispatchToOutboundTool(payload, {
      webhookUrl,
      discordWebhookUrl,
    });

    return NextResponse.json({
      ok: true,
      trigger,
      cadencePolicy:
        trigger === 'DAILY_EOD_RECAP'
          ? 'NORMAL CADENCE: Sent only after trading day ends (Quiet during trading)'
          : trigger === 'IMMEDIATE_PASS_CONGRATS'
          ? 'PASS CADENCE: Sent immediately upon hitting profit target with Certificate & $200k scaling offer'
          : 'FAIL CADENCE: Sent immediately upon breach with L1 execution audit & Fast-Track Reset offer',
      deliveryResult: result,
      payloadPreview: {
        subject: payload.subject,
        recipient: payload.recipientEmail,
        channel: payload.channel,
        plainTextBody: payload.plainTextBody,
        htmlBodyLength: payload.htmlBody.length,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Failed to dispatch outbound message' },
      { status: 500 }
    );
  }
}

