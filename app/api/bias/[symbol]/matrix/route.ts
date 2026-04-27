import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const symbols = await dbMock.all('symbol_masters');
    const symbolObj = symbols.find((s: any) => s.symbol_code === symbol);
    if (!symbolObj) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });

    const matrixes = await dbMock.all('bias_matrix_snapshots');
    const filtered = matrixes.filter((b: any) => b.symbol_id === symbolObj.id);
    const latest = filtered.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    
    return NextResponse.json({ data: latest || null });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bias matrix' }, { status: 500 });
  }
}
