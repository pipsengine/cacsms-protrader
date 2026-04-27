import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ syntheticCandleId: string }> }) {
  try {
    const { syntheticCandleId } = await params;
    const interpretations = await dbMock.all('synthetic_candle_interpretations');
    const filtered = interpretations.filter((i: any) => i.synthetic_candle_id === Number(syntheticCandleId));
    
    return NextResponse.json({ data: filtered });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch interpretations' }, { status: 500 });
  }
}
