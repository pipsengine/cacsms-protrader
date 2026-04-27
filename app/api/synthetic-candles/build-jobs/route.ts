import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET() {
  try {
    const jobs = await dbMock.all('synthetic_candle_build_jobs');
    return NextResponse.json({ data: jobs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch build jobs' }, { status: 500 });
  }
}
