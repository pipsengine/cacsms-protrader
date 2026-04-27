import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ symbol: string, timeframe: string }> }) {
  try {
    const { symbol, timeframe } = await params;
    const symbols = await dbMock.all('symbol_masters');
    const symbolObj = symbols.find((s: any) => s.symbol_code === symbol);
    if (!symbolObj) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });

    const zones = await dbMock.all('institutional_zones');
    const filtered = zones.filter((s: any) => s.symbol_id === symbolObj.id && s.timeframe === timeframe);
    
    return NextResponse.json({ data: filtered });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch zones by timeframe' }, { status: 500 });
  }
}
