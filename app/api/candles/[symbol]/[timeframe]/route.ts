import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ symbol: string, timeframe: string }> }) {
  try {
    const { symbol, timeframe } = await params;
    const allCandles = await dbMock.all('candles');
    // Assuming symbol parameter is symbol_code, we need to map to symbol_id, but here let's just mock filtering or map symbol code
    const symbols = await dbMock.all('symbol_masters');
    const symbolObj = symbols.find((s: any) => s.symbol_code === symbol);
    if (!symbolObj) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });

    const symbolId = symbolObj.id;
    const filtered = allCandles.filter((c: any) => c.symbol_id === symbolId && c.timeframe === timeframe);
    
    return NextResponse.json({ data: filtered });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch candles' }, { status: 500 });
  }
}
