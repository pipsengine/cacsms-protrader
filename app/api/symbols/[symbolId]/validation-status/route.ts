import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ symbolId: string }> }) {
  try {
    const { symbolId } = await params;
    const statuses = await dbMock.all('symbol_validation_statuses');
    const status = statuses.find((s: any) => s.symbol_id === Number(symbolId));
    return NextResponse.json({ data: status || { validation_status: 'UNKNOWN' } });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch validation status' }, { status: 500 });
  }
}
