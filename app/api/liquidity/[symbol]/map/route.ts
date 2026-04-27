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
    const filtered = maps.filter((m: any) => m.symbol_id === symbolObj.id);
    return NextResponse.json({ data: filtered });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch liquidity maps' }, { status: 500 });
  }
}
