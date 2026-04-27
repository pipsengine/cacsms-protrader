import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const isId = !isNaN(Number(slug));

    if (isId) {
      const setupId = parseInt(slug);
      const setups = await dbMock.all('liquidity_setups');
      const setup = setups.find((s: any) => s.id === setupId);
      if (!setup) return NextResponse.json({ error: 'Setup not found' }, { status: 404 });
      return NextResponse.json({ data: setup });
    } else {
      const symbols = await dbMock.all('symbol_masters');
      const symbolObj = symbols.find((s: any) => s.symbol_code === slug);
      if (!symbolObj) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });
  
      const setups = await dbMock.all('liquidity_setups');
      const filtered = setups.filter((s: any) => s.symbol_id === symbolObj.id);
      
      return NextResponse.json({ data: filtered });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
