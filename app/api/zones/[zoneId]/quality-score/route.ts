import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ zoneId: string }> }) {
  try {
    const { zoneId } = await params;
    const scores = await dbMock.all('zone_quality_scores');
    const filtered = scores.filter((s: any) => s.zone_id === parseInt(zoneId));
    
    return NextResponse.json({ data: filtered[0] || null });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quality score' }, { status: 500 });
  }
}
