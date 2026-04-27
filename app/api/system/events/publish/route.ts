import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.event_type || !body.source_module || !body.payload_json) {
        return NextResponse.json({ error: 'Missing required event fields' }, { status: 400 });
    }

    const event = await dbMock.insertEvent({
        event_type: body.event_type,
        source_module: body.source_module,
        entity_type: body.entity_type || null,
        entity_id: body.entity_id || null,
        account_id: body.account_id || null,
        strategy_engine_id: body.strategy_engine_id || null,
        symbol_id: body.symbol_id || null,
        payload_json: typeof body.payload_json === 'string' ? body.payload_json : JSON.stringify(body.payload_json)
    });

    return NextResponse.json({ message: 'Event published', data: event }, { status: 201 });
  } catch (error) {
    console.error('Failed to publish event:', error);
    return NextResponse.json({ error: 'Failed to publish event' }, { status: 500 });
  }
}
