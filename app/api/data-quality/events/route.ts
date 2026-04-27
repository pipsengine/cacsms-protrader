import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET() {
  try {
    const events = await dbMock.all('data_quality_events');
    return NextResponse.json({ data: events });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data quality events' }, { status: 500 });
  }
}
