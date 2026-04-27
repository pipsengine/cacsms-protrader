import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET() {
  try {
    const snapshots = await dbMock.all('data_health_snapshots');
    return NextResponse.json({ data: snapshots });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data quality status' }, { status: 500 });
  }
}
