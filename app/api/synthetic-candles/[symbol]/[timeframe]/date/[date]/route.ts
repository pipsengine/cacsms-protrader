import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ symbol: string, timeframe: string, date: string }> }) {
  try {
    const { symbol, timeframe, date } = await params;
    const symbols = await dbMock.all('symbol_masters');
    const symbolObj = symbols.find((s: any) => s.symbol_code === symbol);
    if (!symbolObj) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });

    const candles = await dbMock.all('synthetic_candles');
    const filtered = candles.filter((c: any) => 
      c.symbol_id === symbolObj.id && 
      c.timeframe === timeframe.toUpperCase() && 
      c.open_time.startsWith(date)
    );
    
    return NextResponse.json({ data: filtered });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch synthetic candles by date' }, { status: 500 });
  }
}
