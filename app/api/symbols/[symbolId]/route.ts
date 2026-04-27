import { NextResponse } from 'next/server';
import { dbMock, openDb, saveDb } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ symbolId: string }> }) {
  try {
    const { symbolId } = await params;
    const symbols = await dbMock.all('symbol_masters');
    const symbol = symbols.find((s: any) => s.id === Number(symbolId));
    if (!symbol) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });
    return NextResponse.json({ data: symbol });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch symbol' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ symbolId: string }> }) {
  try {
    const { symbolId } = await params;
    const body = await request.json();
    const db = await openDb();
    
    const index = db.symbol_masters.findIndex(s => s.id === Number(symbolId));
    if (index === -1) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });
    
    db.symbol_masters[index] = {
      ...db.symbol_masters[index],
      ...body,
      updated_at: new Date().toISOString()
    };
    
    await saveDb(db);
    return NextResponse.json({ data: db.symbol_masters[index] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update symbol' }, { status: 500 });
  }
}
