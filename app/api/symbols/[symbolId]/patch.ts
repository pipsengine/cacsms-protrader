import { NextResponse } from 'next/server';
import { dbMock, openDb, saveDb } from '@/lib/db';

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
