import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET() {
  try {
    const snapshots = await dbMock.all('market_snapshots');
    const symbols = await dbMock.all('symbols');
    
    // Join symbol_code
    const enriched = snapshots.map((snap: any) => {
      const sym = symbols.find((s: any) => s.id === snap.symbol_id);
      if (sym) {
        snap.symbol_code = sym.symbol_code;
      }
      return snap;
    });

    return NextResponse.json({ data: enriched });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch snapshots' }, { status: 500 });
  }
}
