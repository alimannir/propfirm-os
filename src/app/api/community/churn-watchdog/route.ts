import { NextRequest, NextResponse } from 'next/server';
import { 
  DEMO_COMMUNITY_MEMBERS, 
  generateRetentionIntervention,
  CommunityMemberState 
} from '@/engine/community-engine';

export async function GET() {
  const interventions = DEMO_COMMUNITY_MEMBERS.map(member => ({
    member,
    intervention: generateRetentionIntervention(member)
  }));

  const totalProtectedMRR = interventions.reduce((sum, item) => {
    return sum + (item.intervention ? item.intervention.savedMonthlyRevenue : 0);
  }, 0);

  return NextResponse.json({
    success: true,
    totalMonitoredMembers: DEMO_COMMUNITY_MEMBERS.length,
    activeInterventionsCount: interventions.filter(i => i.intervention !== null).length,
    totalProtectedMRR,
    items: interventions
  });
}

export async function POST(req: NextRequest) {
  try {
    const member: CommunityMemberState = await req.json();
    const intervention = generateRetentionIntervention(member);

    return NextResponse.json({
      success: true,
      memberId: member.memberId,
      hasIntervention: Boolean(intervention),
      intervention
    });
  } catch (error) {
    console.error('Churn watchdog error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process member retention state' },
      { status: 500 }
    );
  }
}
