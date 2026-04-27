import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ symbol: string, date: string }> }) {
  try {
    const { symbol, date } = await params;
    const symbols = await dbMock.all('symbol_masters');
    const symbolObj = symbols.find((s: any) => s.symbol_code === symbol);
    if (!symbolObj) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });

    const sessions = await dbMock.all('market_sessions');
    const filtered = sessions.filter((s: any) => s.symbol_id === symbolObj.id && s.session_date === date);
    
    return NextResponse.json({ data: filtered });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sessions by date' }, { status: 500 });
  }
}
