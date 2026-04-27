import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ symbolId: string }> }) {
  try {
    const { symbolId } = await params;
    const mappings = await dbMock.all('broker_symbol_mappings');
    const filtered = mappings.filter((m: any) => m.internal_symbol_id === Number(symbolId));
    return NextResponse.json({ data: filtered });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch mappings' }, { status: 500 });
  }
}
