import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const symbols = await dbMock.all('symbol_masters');
    const symbolObj = symbols.find((s: any) => s.symbol_code === symbol);
    if (!symbolObj) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });

    const snapshots = await dbMock.all('data_health_snapshots');
    const filteredSnapshots = snapshots.filter((s: any) => s.symbol_id === symbolObj.id);
    const latestHealth = filteredSnapshots.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    
    if (latestHealth && latestHealth.health_score < 50) {
      return NextResponse.json({ data: { permission: 'NO_TRADE_DATA_UNSAFE', message: 'Data is unsafe. Trades blocked.' } });
    }

    const matrixes = await dbMock.all('bias_matrix_snapshots');
    const filtered = matrixes.filter((b: any) => b.symbol_id === symbolObj.id);
    const latest = filtered.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    
    if (!latest) {
      return NextResponse.json({ data: { permission: 'NO_TRADE_UNCLEAR', message: 'No bias calculated yet.' } });
    }

    return NextResponse.json({ data: { permission: latest.final_permission, message: latest.explanation } });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bias permission' }, { status: 500 });
  }
}
