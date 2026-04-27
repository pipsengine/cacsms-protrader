import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET() {
  try {
    const acceptances = await dbMock.all('compliance_acceptances');
    // sort by created_at desc
    const sorted = [...acceptances].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return NextResponse.json({ data: sorted });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch acceptance history' }, { status: 500 });
  }
}
