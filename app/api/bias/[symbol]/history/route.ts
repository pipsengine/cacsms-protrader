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

    const matrixesRaw = await sheetsClient.getRange('bias_matrix_snapshots');
    const [matHeader, ...matRows] = matrixesRaw;
    const matrixes = matRows.map(row => Object.fromEntries(matHeader.map((k, i) => [k, row[i]])));
    const filtered = matrixes.filter((b: any) => b.symbol_id === symbolObj.id);
    const sorted = filtered.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return NextResponse.json({ data: sorted });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bias history' }, { status: 500 });
  }
}
