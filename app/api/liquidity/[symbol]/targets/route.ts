import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const symbols = await dbMock.all('symbol_masters');
    const symbolObj = symbols.find((s: any) => s.symbol_code === symbol);
    if (!symbolObj) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });

    const pools = await dbMock.all('liquidity_pools');
    const targets = pools.filter((p: any) => p.symbol_id === symbolObj.id && p.is_active);
    
    return NextResponse.json({ data: targets });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch liquidity targets' }, { status: 500 });
  }
}
