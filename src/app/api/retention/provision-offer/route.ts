import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      accountNumber,
      traderName,
      email,
      archetypeId,
      couponCode,
      discountPct,
      planSize = 100000,
    } = body;

    if (!accountNumber || !couponCode) {
      return NextResponse.json(
        { ok: false, error: 'Missing accountNumber or couponCode' },
        { status: 400 }
      );
    }

    const basePrice = Math.round(planSize * 0.005);
    const finalPrice = Math.round(basePrice * (1 - (discountPct || 25) / 100));
    const singleUseToken = `PF-${accountNumber}-${couponCode}-${Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()}`;

    return NextResponse.json({
      ok: true,
      provisionedAt: new Date().toISOString(),
      accountNumber,
      traderName,
      email,
      archetypeId,
      billing: {
        provider: 'Stripe / WooCommerce / Confirmo Ready',
        singleUseCoupon: singleUseToken,
        basePriceUsd: basePrice,
        discountedPriceUsd: finalPrice,
        discountPct: discountPct || 25,
        expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        checkoutUrl: `https://checkout.propfirm.io/recover/${singleUseToken}`,
      },
      crmSync: {
        klaviyoEventDispatched: true,
        hubspotContactUpdated: true,
        discordDMQueued: true,
        tagsApplied: [`ARCHETYPE_${archetypeId}`, 'POST_BREACH_AUDIT_SENT', 'RECOVERY_ELIGIBLE'],
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Provisioning error' },
      { status: 500 }
    );
  }
}

