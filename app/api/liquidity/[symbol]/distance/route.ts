import { NextResponse } from 'next/server';
import { sheetsClient } from '@/src/lib/google/sheets-client';

export async function GET(request: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const symbolsRaw = await sheetsClient.getRange('symbol_masters');
    const [header, ...rows] = symbolsRaw;
    const symbols = rows.map(row => Object.fromEntries(header.map((k, i) => [k, row[i]])));
    const symbolObj = symbols.find((s: any) => s.symbol_code === symbol);
    if (!symbolObj) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });

    const mapsRaw = await sheetsClient.getRange('liquidity_maps');
    const [mapHeader, ...mapRows] = mapsRaw;
    const maps = mapRows.map(row => Object.fromEntries(mapHeader.map((k, i) => [k, row[i]])));
    const symbolMap = maps.find((m: any) => m.symbol_id === symbolObj.id);
    // For live, fetch current price from market_snapshots
    const marketRaw = await sheetsClient.getRange('market_snapshots');
    const [msHeader, ...msRows] = marketRaw;
    const market = msRows.map(row => Object.fromEntries(msHeader.map((k, i) => [k, row[i]])));
    const marketSnap = market.find((m: any) => m.symbol_id === symbolObj.id);
    const currentPrice = marketSnap ? parseFloat(marketSnap.bid) : null;
    const distances = {
      distance_to_nearest_buy_liquidity: symbolMap && symbolMap.nearest_buy_liquidity && currentPrice !== null ? Math.abs(symbolMap.nearest_buy_liquidity - currentPrice) : null,
      distance_to_nearest_sell_liquidity: symbolMap && symbolMap.nearest_sell_liquidity && currentPrice !== null ? Math.abs(currentPrice - symbolMap.nearest_sell_liquidity) : null,
      distance_to_major_liquidity: null // Could be calculated if more data is available
    };
    return NextResponse.json({ data: distances });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch liquidity distances' }, { status: 500 });
  }
}
