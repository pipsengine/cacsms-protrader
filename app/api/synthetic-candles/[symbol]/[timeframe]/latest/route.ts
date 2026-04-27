import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ symbol: string, timeframe: string }> }) {
  try {
    const { symbol, timeframe } = await params;
    const symbols = await dbMock.all('symbol_masters');
    const symbolObj = symbols.find((s: any) => s.symbol_code === symbol);
    if (!symbolObj) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });

    const candles = await dbMock.all('synthetic_candles');
    const filtered = candles.filter((c: any) => c.symbol_id === symbolObj.id && c.timeframe === timeframe.toUpperCase() && c.status === 'COMPLETE');
    
    const latest = filtered.sort((a: any, b: any) => new Date(b.close_time).getTime() - new Date(a.close_time).getTime())[0];
    
    return NextResponse.json({ data: latest || null });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch latest synthetic candle' }, { status: 500 });
  }
}
