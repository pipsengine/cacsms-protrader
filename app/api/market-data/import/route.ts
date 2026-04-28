import { NextResponse } from 'next/server';
import { openDb, saveDb } from '@/lib/db';
import { normalize_symbol, normalize_timeframe, normalize_timestamp, store_tick, store_candle, validate_candle_record, log_market_data_correction } from '@/lib/services/market_data';

export async function POST(request: Request) {
  try {
    const { type, data } = await request.json();
    if (type === 'tick') {
      data.symbol = normalize_symbol(data.symbol);
      data.utc_time = normalize_timestamp(data.utc_time);
      await store_tick(data);
      return NextResponse.json({ success: true });
    }
    if (type === 'candle') {
      data.symbol = normalize_symbol(data.symbol);
      data.timeframe = normalize_timeframe(data.timeframe);
      data.utc_time = normalize_timestamp(data.utc_time);
      if (!validate_candle_record(data)) {
        return NextResponse.json({ error: 'Invalid candle data' }, { status: 400 });
      }
      await store_candle(data);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Unsupported import type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to import market data' }, { status: 500 });
  }
}
