import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET() {
  try {
    const logs = await dbMock.all('candle_rebuild_logs');
    const symbols = await dbMock.all('symbols');
    
    const enriched = logs.map((log: any) => {
      const sym = symbols.find((s: any) => s.id === log.symbol_id);
      if (sym) {
        log.symbol_code = sym.symbol_code;
      }
      return log;
    });

    // Sort by most recent
    const sorted = [...enriched].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ data: sorted });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rebuild logs' }, { status: 500 });
  }
}
