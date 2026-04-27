import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ symbol: string, timeframe: string }> }) {
  try {
    const { symbol, timeframe } = await params;
    
    const allCandles = await dbMock.all('candles');
    const symbols = await dbMock.all('symbol_masters');
    const symbolObj = symbols.find((s: any) => s.symbol_code === symbol);
    if (!symbolObj) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });

    const filtered = allCandles.filter((c: any) => c.symbol_id === symbolObj.id && c.timeframe === timeframe && c.status === 'FORMING');
    const latest = filtered.sort((a: any, b: any) => new Date(b.open_time).getTime() - new Date(a.open_time).getTime())[0];
    
    return NextResponse.json({ data: latest || null });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch forming candle' }, { status: 500 });
  }
}
