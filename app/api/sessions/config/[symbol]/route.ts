import { NextResponse } from 'next/server';
import { dbMock, openDb, saveDb } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const symbols = await dbMock.all('symbol_masters');
    const symbolObj = symbols.find((s: any) => s.symbol_code === symbol);
    if (!symbolObj) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });

    const configurations = await dbMock.all('symbol_sessions');
    const filtered = configurations.filter((c: any) => c.symbol_id === symbolObj.id);
    
    return NextResponse.json({ data: filtered });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch session configurations' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const body = await request.json();
    return NextResponse.json({ message: 'Session configuration updated', symbol, data: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update session configuration' }, { status: 500 });
  }
}
