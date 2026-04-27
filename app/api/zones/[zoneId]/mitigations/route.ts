import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ zoneId: string }> }) {
  try {
    const { zoneId } = await params;
    const mitigations = await dbMock.all('zone_mitigation_events');
    const filtered = mitigations.filter((m: any) => m.zone_id === parseInt(zoneId));
    
    return NextResponse.json({ data: filtered });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch mitigations' }, { status: 500 });
  }
}
