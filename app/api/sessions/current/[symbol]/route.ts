import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const symbols = await dbMock.all('symbol_masters');
    const symbolObj = symbols.find((s: any) => s.symbol_code === symbol);
    if (!symbolObj) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });

    const sessions = await dbMock.all('market_sessions');
    const filtered = sessions.filter((s: any) => s.symbol_id === symbolObj.id);
    
    const latest = filtered.sort((a: any, b: any) => new Date(b.end_time_utc).getTime() - new Date(a.end_time_utc).getTime())[0];
    
    return NextResponse.json({ data: latest || null });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch current session' }, { status: 500 });
  }
}
