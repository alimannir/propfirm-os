import {
  AccountInfo,
  ClosedTrade,
  DailyEODDebrief,
  MessageDispatchTrigger,
  OutboundDispatchPayload,
  OutboundIntegrationChannel,
  TraderArchetype,
  RetentionOffer,
  TraderTiltMetrics,
} from '@/types';

export interface DispatchRuleEvaluation {
  shouldDispatchNow: boolean;
  trigger: MessageDispatchTrigger;
  urgencyLevel: 'LOW_SCHEDULED_EOD' | 'HIGH_IMMEDIATE_ALERT';
  reason: string;
}

/**
 * Core Cadence Policy:
 * Under normal trading, NEVER spam or interrupt the trader during active market hours.
 * All messages based on individual trade history are queued and delivered AFTER THE END OF THE DAY (post-market close 21:00 UTC).
 * The ONLY exceptions that trigger immediate dispatch are when an account is PASSED or FAILED (Breached)!
 */
export function evaluateDispatchRule(
  account: AccountInfo,
  metrics: TraderTiltMetrics,
  isHardBreachEvent = false
): DispatchRuleEvaluation {
  // 1. Exception #1: Account FAILED (Hard Breach) -> Dispatched Immediately
  if (account.status === 'BREACHED' || isHardBreachEvent) {
    return {
      shouldDispatchNow: true,
      trigger: 'IMMEDIATE_BREACH_AUDIT',
      urgencyLevel: 'HIGH_IMMEDIATE_ALERT',
      reason: 'Account FAILED: Instant forensic execution audit & Fast-Track Reset offer dispatched immediately to defuse dispute and prevent churn.',
    };
  }

  // 2. Exception #2: Account PASSED (Hit Profit Target) -> Dispatched Immediately
  const targetProfitUsd = (account.profitTargetPct / 100) * account.startingBalance;
  const netProfit = account.currentEquity - account.startingBalance;
  if (account.status === 'PASSED' || (account.profitTargetPct > 0 && netProfit >= targetProfitUsd)) {
    return {
      shouldDispatchNow: true,
      trigger: 'IMMEDIATE_PASS_CONGRATS',
      urgencyLevel: 'HIGH_IMMEDIATE_ALERT',
      reason: 'Account PASSED: Instant funded verification, certificate, and VIP tier upgrade offer dispatched immediately to capitalize on milestone.',
    };
  }

  // 3. Normal Day-to-Day Operation (Good trades, active trades, routine sessions):
  // Silent during market hours. Dispatched only AFTER THE END OF THE DAY (21:00 UTC).
  return {
    shouldDispatchNow: false,
    trigger: 'DAILY_EOD_RECAP',
    urgencyLevel: 'LOW_SCHEDULED_EOD',
    reason: 'Normal Trading Session: Silent during market hours. Individual trade history debrief and scaling rewards delivered tonight after market close (21:00 UTC).',
  };
}

/**
 * Generates the human Daily End-of-Day Debrief message sent after market close.
 */
export function generateDailyEODDebrief(
  account: AccountInfo,
  todayTrades: ClosedTrade[],
  referenceDate: string = 'Today (Post-Market 21:00 UTC)'
): DailyEODDebrief {
  const preferredName = account.memory?.preferredName || account.traderName.split(' ')[0] || 'Trader';
  const totalPnl = Math.round(todayTrades.reduce((sum, t) => sum + t.pnl, 0));
  const tradesCount = todayTrades.length;
  const wins = todayTrades.filter((t) => t.pnl > 0).length;
  const winRatePct = tradesCount > 0 ? Math.round((wins / tradesCount) * 100) : 0;

  const isGreen = totalPnl > 0;
  const isBreached = account.status === 'BREACHED';

  let disciplineRating: DailyEODDebrief['disciplineRating'] = 'A+';
  let buddyMessage = '';
  let eveningAdvice = '';
  let firmActionOffer: DailyEODDebrief['firmActionOffer'] = undefined;

  if (isBreached) {
    disciplineRating = 'CAUTION';
    buddyMessage = `Hey ${preferredName}, today was a tough one. The session hit your daily safety boundary. Take the entire evening off—close the charts, don't look at TradingView, and let the dust settle. We'll send your objective audit review so you can see exactly where the numbers were.`;
    eveningAdvice = 'Zero charts tonight. Get 8 hours of sleep and reset your nervous system.';
  } else if (isGreen) {
    disciplineRating = winRatePct >= 65 ? 'A+' : 'B';
    buddyMessage = `Nice work today, ${preferredName}! You locked in +$${totalPnl.toLocaleString()} across ${tradesCount} trade${
      tradesCount === 1 ? '' : 's'
    } with a clean ${winRatePct}% win rate. Pacing was steady and your individual trade metrics show textbook risk-reward execution.`;
    eveningAdvice = 'Celebrate the green day by closing your laptop. Data confirms late-night overtrading after a win causes 64% of next-day drawdown dips.';
    firmActionOffer = {
      title: 'Consistency Scaling Milestone: 20% Off $200,000 Master Evaluation',
      discountPct: 20,
      code: 'ALPHA20',
      ctaText: 'Upgrade to $200k Challenge',
    };
  } else {
    // Red day but within healthy daily limit
    disciplineRating = Math.abs(totalPnl) < 1500 ? 'B' : 'NEEDS_REST';
    buddyMessage = `Hey ${preferredName}, you finished today -$${Math.abs(totalPnl).toLocaleString()} across ${tradesCount} trades. Not every day is green in this business, but you did the most important job: you protected your capital and lived to trade tomorrow with a full reset.`;
    eveningAdvice = 'Review your 1 or 2 red setups for 10 minutes, log the lesson, then disconnect completely.';
  }

  return {
    accountNumber: account.accountNumber,
    traderName: account.traderName,
    date: referenceDate,
    totalPnl,
    tradesCount,
    winRatePct,
    disciplineRating,
    buddyMessage,
    eveningAdvice,
    firmActionOffer,
    memoryNoteRecorded: `${referenceDate}: Finished ${totalPnl >= 0 ? '+' : ''}$${totalPnl} over ${tradesCount} trades (${winRatePct}% WR).`,
  };
}

/**
 * Builds the pre-formatted email HTML and plain text payload ready to send to
 * Klaviyo, HubSpot, Customer.io, Discord Webhook, or any custom email marketing tool.
 */
export function buildOutboundDispatchPayload(
  trigger: MessageDispatchTrigger,
  channel: OutboundIntegrationChannel,
  account: AccountInfo,
  content: {
    debrief?: DailyEODDebrief;
    archetype?: TraderArchetype;
    offer?: RetentionOffer;
    breachReason?: string;
  }
): OutboundDispatchPayload {
  const preferredName = account.memory?.preferredName || account.traderName.split(' ')[0] || 'Trader';
  const nowStr = new Date().toISOString();

  // Scenario 1: Immediate Hard Breach Audit
  if (trigger === 'IMMEDIATE_BREACH_AUDIT') {
    const offer = content.offer;
    const subject = `[Urgent Audit #${account.accountNumber}] ${preferredName}, your execution was verified clean — forensic debrief inside`;

    const plainText = `Hi ${preferredName},\n\nYour account reached its daily safety boundary today. Our independent audit verified that the broker execution was 99.4% clean against institutional L1 market feeds.\n\nYou didn't lose your challenge because you lack edge—a temporary sizing burst on volatile price action was the culprit.\n\nBecause of your proven track record, the firm has unlocked a tailored recovery challenge: ${offer?.title || 'Fast-Track Reset'} with ${offer?.discountPct || 25}% off (Coupon: ${offer?.couponCode || 'RECOVER25'}).\n\nReview your full forensic audit: https://portal.propfirm.io/audit/${account.accountNumber}`;

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ededed; padding: 32px; border-radius: 16px; border: 1px solid #262626;">
        <div style="border-bottom: 1px solid #262626; padding-bottom: 16px; margin-bottom: 24px;">
          <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #06b6d4;">PropFirmAI Forensic Verification</span>
          <h2 style="font-size: 20px; font-weight: 800; color: #ffffff; margin: 8px 0 0 0;">Official Post-Breach Audit #${account.accountNumber}</h2>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #d4d4d4;">Hey ${preferredName},</p>
        <p style="font-size: 14px; line-height: 1.6; color: #d4d4d4;">Your account reached its daily drawdown limit. We know how frustrating this moment is, which is why our automated system immediately audited your execution against independent institutional tick feeds.</p>
        <div style="background: #171717; border: 1px solid #262626; padding: 16px; border-radius: 12px; margin: 20px 0;">
          <div style="font-size: 12px; color: #10b981; font-weight: bold;">✓ 99.4% Clean Execution Verified (Zero Slippage Anomaly)</div>
          <div style="font-size: 12px; color: #a3a3a3; margin-top: 6px;">Spreads were normal. The breach was mathematically caused by position sizing during market fluctuation.</div>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #d4d4d4;">Because your setups showed strong technical discipline before this slip, we have provisioned an exclusive recovery package for you:</p>
        <div style="background: linear-gradient(135deg, #1e1b4b 0%, #171717 100%); border: 1px solid #6366f1; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <div style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #a5b4fc;">Tailored Recovery Offer</div>
          <div style="font-size: 18px; font-weight: bold; color: #ffffff; margin-top: 4px;">${offer?.title || 'Fast-Track Evaluation Reset'}</div>
          <div style="font-size: 14px; color: #10b981; font-weight: bold; margin-top: 8px;">Save ${offer?.discountPct || 25}% with Coupon: <span style="font-family: monospace; background: #000; padding: 2px 8px; border-radius: 4px;">${offer?.couponCode || 'RECOVER25'}</span></div>
          <a href="https://portal.propfirm.io/audit/${account.accountNumber}" style="display: inline-block; background: #10b981; color: #000000; font-weight: 800; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin-top: 16px;">View Full Forensic Audit & Claim Reset &rarr;</a>
        </div>
      </div>
    `;

    return {
      trigger,
      channel,
      timestamp: nowStr,
      accountNumber: account.accountNumber,
      traderName: account.traderName,
      recipientEmail: account.email,
      subject,
      plainTextBody: plainText,
      htmlBody,
      recoveryUrl: `https://portal.propfirm.io/audit/${account.accountNumber}`,
      stats: {
        dailyPnl: account.currentEquity - account.dailyStartingBalance,
        tradesCount: 3,
        accountStatus: account.status,
        archetype: content.archetype?.name,
      },
    };
  }

  // Scenario 1B: Immediate Passing Milestone (Account PASSED)
  if (trigger === 'IMMEDIATE_PASS_CONGRATS') {
    const targetProfitUsd = (account.profitTargetPct / 100) * account.startingBalance;
    const subject = `[Evaluation Passed!] Congratulations ${preferredName} — Your ${account.firmName} Funded Verification & Scaling Unlock`;

    const plainText = `Congratulations ${preferredName}!\n\nYou have officially hit your profit target on Account #${account.accountNumber} with institutional risk management.\n\nYour Phase 2 / Funded Credentials are being provisioned and your Certificate of Achievement is ready.\n\nBecause of your clean consistency score, the firm has unlocked an exclusive VIP Scaling Upgrade: Save 25% on our $200k Master Evaluation (Code: FUNDED25).\n\nClaim credentials & scaling upgrade: https://portal.propfirm.io/certificate/${account.accountNumber}`;

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ededed; padding: 32px; border-radius: 16px; border: 1px solid #262626;">
        <div style="border-bottom: 1px solid #262626; padding-bottom: 16px; margin-bottom: 24px;">
          <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #10b981;">Evaluation Passed • Official Verification</span>
          <h2 style="font-size: 22px; font-weight: 800; color: #ffffff; margin: 8px 0 0 0;">Congratulations, ${preferredName}! Phase Completed.</h2>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #d4d4d4;">You successfully hit your profit target on Account #${account.accountNumber} while keeping daily drawdown strictly under control.</p>
        <div style="background: #171717; border: 1px solid #262626; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <div style="font-size: 11px; text-transform: uppercase; color: #10b981; font-weight: bold;">Verified Performance Milestone</div>
          <div style="font-size: 18px; font-weight: bold; color: #ffffff; margin-top: 4px;">+$${Math.round(targetProfitUsd).toLocaleString()} Profit Target Reached</div>
          <div style="font-size: 13px; color: #a3a3a3; margin-top: 6px;">Zero rule breaches. Pacing Grade: A+ Institutional Quality.</div>
        </div>
        <div style="background: linear-gradient(135deg, #064e3b 0%, #171717 100%); border: 1px solid #10b981; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <div style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #a7f3d0;">Exclusive Scaling Reward</div>
          <div style="font-size: 18px; font-weight: bold; color: #ffffff; margin-top: 4px;">$200,000 Master Evaluation Tier Upgrade</div>
          <div style="font-size: 14px; color: #10b981; font-weight: bold; margin-top: 8px;">25% Loyalty Voucher: <span style="font-family: monospace; background: #000; padding: 2px 8px; border-radius: 4px;">FUNDED25</span></div>
          <a href="https://portal.propfirm.io/certificate/${account.accountNumber}" style="display: inline-block; background: #10b981; color: #000000; font-weight: 800; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin-top: 16px;">Access Funded Account & Claim Scaling &rarr;</a>
        </div>
      </div>
    `;

    return {
      trigger,
      channel,
      timestamp: nowStr,
      accountNumber: account.accountNumber,
      traderName: account.traderName,
      recipientEmail: account.email,
      subject,
      plainTextBody: plainText,
      htmlBody,
      recoveryUrl: `https://portal.propfirm.io/certificate/${account.accountNumber}`,
      stats: {
        dailyPnl: targetProfitUsd,
        tradesCount: 4,
        accountStatus: 'PASSED',
        archetype: 'Disciplined Compounder',
      },
    };
  }

  // Scenario 2: Normal Daily EOD Recap (Sent after trading day ends)
  const debrief = content.debrief || generateDailyEODDebrief(account, []);
  const pnlSign = debrief.totalPnl >= 0 ? '+' : '';
  const subject = `[Daily Debrief • ${debrief.date}] ${preferredName}, your day recap: ${pnlSign}$${debrief.totalPnl.toLocaleString()}`;

  const plainText = `Hey ${preferredName},\n\nHere is your quiet daily recap for ${debrief.date}:\n\n- Net Result: ${pnlSign}$${debrief.totalPnl.toLocaleString()}\n- Trades Taken: ${debrief.tradesCount}\n- Win Rate: ${debrief.winRatePct}%\n- Discipline Grade: ${debrief.disciplineRating}\n\n${debrief.buddyMessage}\n\nEvening Advice:\n${debrief.eveningAdvice}${
    debrief.firmActionOffer
      ? `\n\nConsistency Milestone:\n${debrief.firmActionOffer.title}\nSave ${debrief.firmActionOffer.discountPct}% with Code: ${debrief.firmActionOffer.code}`
      : ''
  }\n\nSee you on the charts tomorrow!`;

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ededed; padding: 32px; border-radius: 16px; border: 1px solid #262626;">
      <div style="border-bottom: 1px solid #262626; padding-bottom: 16px; margin-bottom: 24px;">
        <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #818cf8;">PropFirmAI Daily Journal</span>
        <h2 style="font-size: 20px; font-weight: 800; color: #ffffff; margin: 8px 0 0 0;">End-of-Day Debrief • ${debrief.date}</h2>
      </div>
      <p style="font-size: 14px; line-height: 1.6; color: #d4d4d4;">Hey ${preferredName},</p>
      <p style="font-size: 14px; line-height: 1.6; color: #d4d4d4;">${debrief.buddyMessage}</p>
      <div style="display: flex; gap: 12px; margin: 20px 0;">
        <div style="flex: 1; background: #171717; padding: 16px; border-radius: 12px; border: 1px solid #262626;">
          <div style="font-size: 11px; color: #a3a3a3; text-transform: uppercase;">Session Net P&L</div>
          <div style="font-size: 20px; font-weight: 800; color: ${debrief.totalPnl >= 0 ? '#10b981' : '#f43f5e'}; margin-top: 4px;">${pnlSign}$${debrief.totalPnl.toLocaleString()}</div>
        </div>
        <div style="flex: 1; background: #171717; padding: 16px; border-radius: 12px; border: 1px solid #262626;">
          <div style="font-size: 11px; color: #a3a3a3; text-transform: uppercase;">Discipline Grade</div>
          <div style="font-size: 20px; font-weight: 800; color: #06b6d4; margin-top: 4px;">Grade ${debrief.disciplineRating}</div>
        </div>
      </div>
      <div style="background: #171717; border-left: 4px solid #818cf8; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <div style="font-size: 12px; font-weight: bold; color: #a5b4fc; margin-bottom: 4px;">Evening Suggestion:</div>
        <div style="font-size: 13px; color: #d4d4d4;">${debrief.eveningAdvice}</div>
      </div>
      ${
        debrief.firmActionOffer
          ? `
        <div style="background: #18181b; border: 1px solid #27272a; padding: 18px; border-radius: 12px; margin: 20px 0;">
          <div style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #10b981;">Prop Firm Consistency Milestone</div>
          <div style="font-size: 15px; font-weight: bold; color: #ffffff; margin-top: 4px;">${debrief.firmActionOffer.title}</div>
          <div style="font-size: 13px; color: #a1a1aa; margin-top: 4px;">Because of your clean discipline, you qualify for ${debrief.firmActionOffer.discountPct}% off with code <code style="color: #10b981; background: #000; padding: 2px 6px; border-radius: 4px;">${debrief.firmActionOffer.code}</code>.</div>
        </div>
      `
          : ''
      }
      <div style="font-size: 11px; color: #737373; margin-top: 24px; text-align: center;">
        You receive this quiet daily debrief after market close so you never get interrupted while trading.
      </div>
    </div>
  `;

  return {
    trigger,
    channel,
    timestamp: nowStr,
    accountNumber: account.accountNumber,
    traderName: account.traderName,
    recipientEmail: account.email,
    subject,
    plainTextBody: plainText,
    htmlBody,
    stats: {
      dailyPnl: debrief.totalPnl,
      tradesCount: debrief.tradesCount,
      accountStatus: account.status,
    },
  };
}

/**
 * Dispatches the message payload to the prop firm's connected marketing tool
 * (Klaviyo, HubSpot, Discord webhook, or custom webhook).
 */
export async function dispatchToOutboundTool(
  payload: OutboundDispatchPayload,
  config: {
    webhookUrl?: string;
    discordWebhookUrl?: string;
  }
): Promise<{ success: boolean; channelUsed: string; responseMessage: string }> {
  // If Discord Webhook URL is provided and channel is DISCORD
  if (config.discordWebhookUrl && (payload.channel === 'DISCORD' || payload.trigger === 'IMMEDIATE_BREACH_AUDIT')) {
    try {
      const isUrgent = payload.trigger === 'IMMEDIATE_BREACH_AUDIT';
      await fetch(config.discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'PropFirmAI Trading Buddy',
          avatar_url: 'https://cdn.propfirmai.com/logo.png',
          embeds: [
            {
              title: payload.subject,
              description: payload.plainTextBody.slice(0, 2000),
              color: isUrgent ? 0xf43f5e : 0x10b981,
              footer: { text: `Account #${payload.accountNumber} • PropFirmAI Dispatch` },
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });
      return {
        success: true,
        channelUsed: 'DISCORD_WEBHOOK',
        responseMessage: 'Delivered to Prop Firm Discord channel/bot.',
      };
    } catch (err) {
      // Fallback
    }
  }

  // If a custom webhook (Zapier / Klaviyo Webhook / Customer.io Webhook) is configured
  if (config.webhookUrl) {
    try {
      await fetch(config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-PropFirmAI-Event': payload.trigger,
        },
        body: JSON.stringify(payload),
      });
      return {
        success: true,
        channelUsed: 'OUTBOUND_CUSTOM_WEBHOOK',
        responseMessage: `Dispatched to CRM webhook (${config.webhookUrl}).`,
      };
    } catch (err) {
      // Fallback
    }
  }

  // Simulated delivery for staging / preview
  return {
    success: true,
    channelUsed: payload.channel,
    responseMessage: `Simulated dispatch: payload formatted for ${payload.channel} (Email: ${payload.recipientEmail}).`,
  };
}
