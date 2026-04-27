import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET() {
  try {
    const requests = await dbMock.all('configuration_approval_requests');
    // sort by requested_at desc
    const sorted = [...requests].sort((a: any, b: any) => new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime());
    return NextResponse.json({ data: sorted });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch approval requests' }, { status: 500 });
  }
}
