import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET() {
  try {
    const candles = await dbMock.all('candles');
    return NextResponse.json({ data: candles });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch candles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await dbMock.open();
    const newCandle = {
      id: Date.now(),
      symbol_id: body.symbol_id,
      source_id: body.source_id,
      timeframe: body.timeframe,
      open_time: body.open_time,
      close_time: body.close_time,
      open_price: body.open_price,
      high_price: body.high_price,
      low_price: body.low_price,
      close_price: body.close_price,
      tick_volume: body.tick_volume,
      real_volume: body.real_volume,
      spread: body.spread,
      broker_time: body.broker_time,
      utc_time: body.utc_time,
      candle_direction: body.candle_direction,
      body_size: body.body_size,
      upper_wick_size: body.upper_wick_size,
      lower_wick_size: body.lower_wick_size,
      total_range: body.total_range,
      session_tag: body.session_tag,
      is_synthetic: body.is_synthetic || 0,
      data_status: body.data_status || 'DATA_VALID',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.candles.push(newCandle);
    await dbMock.save(db);
    return NextResponse.json({ data: newCandle });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to store candle' }, { status: 500 });
  }
}
