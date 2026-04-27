import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const symbols = await dbMock.all('symbol_masters');
    const symbolObj = symbols.find((s: any) => s.symbol_code === symbol);
    if (!symbolObj) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });

    const zones = await dbMock.all('institutional_zones');
    const activeZones = zones.filter((z: any) => z.symbol_id === symbolObj.id && z.status === 'ACTIVE');
    
    return NextResponse.json({ data: activeZones });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch active zones' }, { status: 500 });
  }
}
