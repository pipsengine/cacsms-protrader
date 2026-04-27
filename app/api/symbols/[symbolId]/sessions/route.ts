import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ symbolId: string }> }) {
  try {
    const { symbolId } = await params;
    const sessions = await dbMock.all('symbol_sessions');
    const filtered = sessions.filter((s: any) => s.symbol_id === Number(symbolId));
    return NextResponse.json({ data: filtered });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}
