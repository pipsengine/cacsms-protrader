import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const symbols = await dbMock.all('symbol_masters');
    const symbolObj = symbols.find((s: any) => s.symbol_code === symbol);
    if (!symbolObj) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });

    const snapshots = await dbMock.all('data_health_snapshots');
    const filtered = snapshots.filter((s: any) => s.symbol_id === symbolObj.id);
    const latest = filtered.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

    if (!latest) return NextResponse.json({ data: { permission: 'DATA_PERMISSION_CLEAR' } });

    return NextResponse.json({ data: { permission: latest.trading_permission } });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trading permission' }, { status: 500 });
  }
}
