import { NextResponse } from 'next/server';
import { openDb, saveDb } from '@/lib/db';
import { store_tick, store_candle } from '@/lib/services/market_data';

export async function POST(request: Request) {
  try {
    const { type, symbol, timeframe } = await request.json();
    // For demo: just update last_sync_at for all sources
    const db = await openDb();
    db.market_data_sources.forEach((src: any) => {
      src.last_sync_at = new Date().toISOString();
      src.connection_status = 'SYNCED';
    });
    await saveDb(db);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to sync market data' }, { status: 500 });
  }
}
