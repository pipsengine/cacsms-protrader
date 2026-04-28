import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET() {
  try {
    const ticks = await dbMock.all('ticks');
    return NextResponse.json({ data: ticks });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ticks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await dbMock.open();
    const newTick = {
      id: Date.now(),
      symbol_id: body.symbol_id,
      source_id: body.source_id,
      bid: body.bid,
      ask: body.ask,
      spread: body.spread,
      broker_time: body.broker_time,
      utc_time: body.utc_time,
      received_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    db.ticks.push(newTick);
    await dbMock.save(db);
    return NextResponse.json({ data: newTick });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to store tick' }, { status: 500 });
  }
}
