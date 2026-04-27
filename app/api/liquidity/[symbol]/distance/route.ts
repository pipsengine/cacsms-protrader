import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const symbols = await dbMock.all('symbol_masters');
    const symbolObj = symbols.find((s: any) => s.symbol_code === symbol);
    if (!symbolObj) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });

    const maps = await dbMock.all('liquidity_maps');
    const symbolMap = maps.find((m: any) => m.symbol_id === symbolObj.id);
    
    // Abstract calculation for distance
    const currentPrice = 1.08850; // Mock current price
    
    const distances = {
      distance_to_nearest_buy_liquidity: symbolMap && symbolMap.nearest_buy_liquidity ? Math.abs(symbolMap.nearest_buy_liquidity - currentPrice) : null,
      distance_to_nearest_sell_liquidity: symbolMap && symbolMap.nearest_sell_liquidity ? Math.abs(currentPrice - symbolMap.nearest_sell_liquidity) : null,
      distance_to_major_liquidity: 0.00500 // Generic
    };
    
    return NextResponse.json({ data: distances });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch liquidity distances' }, { status: 500 });
  }
}
