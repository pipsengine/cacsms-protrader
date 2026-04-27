import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const anomalies = await dbMock.all('candle_anomalies');
    return NextResponse.json({ data: anomalies });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch anomalies' }, { status: 500 });
  }
}
