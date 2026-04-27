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

    const invocationsRaw = await sheetsClient.getRange('bias_invalidation_events');
    const [invHeader, ...invRows] = invocationsRaw;
    const invocations = invRows.map(row => Object.fromEntries(invHeader.map((k, i) => [k, row[i]])));
    const filtered = invocations.filter((b: any) => b.symbol_id === symbolObj.id);
    return NextResponse.json({ data: filtered });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bias invalidation events' }, { status: 500 });
  }
}
