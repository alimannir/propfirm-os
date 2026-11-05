import { NextRequest, NextResponse } from 'next/server';
import { getFleetAccounts, seedHundredTraders } from '@/db/repository';

export async function GET() {
  try {
    const fleet = await getFleetAccounts();
    return NextResponse.json({
      ok: true,
      totalCount: fleet.length,
      fleet,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Failed to query fleet database' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    if (body.action === 'seed_hundred') {
      const added = await seedHundredTraders();
      const updatedFleet = await getFleetAccounts();
      return NextResponse.json({
        ok: true,
        message: `Successfully seeded ${added} realistic accounts into the database.`,
        totalCount: updatedFleet.length,
        fleet: updatedFleet,
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Database error' },
      { status: 500 }
    );
  }
}

