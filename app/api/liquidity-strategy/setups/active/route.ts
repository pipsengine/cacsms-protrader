import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbolCode = searchParams.get('symbol');

    let symbolId: number | null = null;
    if (symbolCode) {
      const symbols = await dbMock.all('symbol_masters');
      const symbolObj = symbols.find((s: any) => s.symbol_code === symbolCode);
      if (symbolObj) {
        symbolId = symbolObj.id;
      } else {
        return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });
      }
    }

    const setups = await dbMock.all('liquidity_setups');
    let activeSetups = setups.filter((s: any) => 
      ['DETECTED', 'VALIDATED', 'WAITING_CONFIRMATION', 'READY_FOR_EXECUTION'].includes(s.status)
    );

    if (symbolId) {
       activeSetups = activeSetups.filter((s: any) => s.symbol_id === symbolId);
    }
      
    return NextResponse.json({ data: activeSetups });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch active setups' }, { status: 500 });
  }
}
