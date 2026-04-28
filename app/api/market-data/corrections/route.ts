import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET() {
  try {
    const corrections = await dbMock.all('market_data_corrections');
    return NextResponse.json({ data: corrections });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch market data corrections' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await dbMock.open();
    const newCorrection = {
      id: Date.now(),
      symbol_id: body.symbol_id,
      timeframe: body.timeframe,
      candle_id: body.candle_id,
      correction_type: body.correction_type,
      previous_value_json: JSON.stringify(body.previous_value),
      new_value_json: JSON.stringify(body.new_value),
      correction_reason: body.correction_reason,
      corrected_by: body.corrected_by || 'SystemAdmin',
      created_at: new Date().toISOString()
    };
    db.market_data_corrections.push(newCorrection);
    await dbMock.save(db);
    return NextResponse.json({ data: newCorrection });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to store market data correction' }, { status: 500 });
  }
}
