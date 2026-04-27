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

    const poolsRaw = await sheetsClient.getRange('liquidity_pools');
    const [poolHeader, ...poolRows] = poolsRaw;
    const pools = poolRows.map(row => Object.fromEntries(poolHeader.map((k, i) => [k, row[i]])));
    const targets = pools.filter((p: any) => p.symbol_id === symbolObj.id && p.is_active);
    return NextResponse.json({ data: targets });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch liquidity targets' }, { status: 500 });
  }
}
