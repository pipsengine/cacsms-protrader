import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ symbolId: string }> }) {
  try {
    const { symbolId } = await params;
    const permissions = await dbMock.all('symbol_strategy_permissions');
    const filtered = permissions.filter((p: any) => p.symbol_id === Number(symbolId));
    return NextResponse.json({ data: filtered });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch permissions' }, { status: 500 });
  }
}
