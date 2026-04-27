import { NextResponse } from 'next/server';
import { openDb, saveDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { symbol_code, timeframe, start_time, end_time, reason } = await request.json();
    
    // Find symbol
    const db = await openDb();
    const sym = db.symbols.find(s => s.symbol_code === symbol_code);
    if (!sym) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });

    // Mock completing a rebuild
    const newLog = {
      id: Date.now(),
      symbol_id: sym.id,
      timeframe,
      start_time: start_time || new Date(Date.now() - 86400000).toISOString(),
      end_time: end_time || new Date().toISOString(),
      rebuild_reason: reason || 'Manual Admin Trigger',
      source_used: 'PRIMARY_SOURCE',
      records_rebuilt: Math.floor(Math.random() * 50) + 1,
      records_failed: 0,
      triggered_by: 'SystemAdmin',
      status: 'SUCCESS',
      created_at: new Date().toISOString()
    };

    db.candle_rebuild_logs.push(newLog);
    
    // Randomly update the snapshot health if it's currently unsafe
    const snap = db.market_snapshots.find(s => s.symbol_id === sym.id);
    if (snap && snap.data_health_status !== 'DATA_VALID') {
       snap.data_health_status = 'DATA_VALID';
       snap.updated_at = new Date().toISOString();
    }

    await saveDb(db);
    return NextResponse.json({ success: true, data: newLog });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to rebuild candles' }, { status: 500 });
  }
}
