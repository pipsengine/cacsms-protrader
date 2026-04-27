import { NextResponse } from 'next/server';
import { sheetsClient } from '@/lib/google/sheets-client';

  try {
    const body = await req.json();
    // Validate required fields
    if (!body.event_type || !body.source_module || !body.payload_json) {
      return NextResponse.json({ error: 'Missing required event fields' }, { status: 400 });
    }
    // Prepare event row for Google Sheets
    const eventRow = [
      '', // id (auto-increment or left blank for Google Sheets)
      body.event_type,
      body.source_module,
      body.entity_type || '',
      body.entity_id || '',
      body.account_id || '',
      body.strategy_engine_id || '',
      body.symbol_id || '',
      typeof body.payload_json === 'string' ? body.payload_json : JSON.stringify(body.payload_json),
      'PENDING',
      new Date().toISOString(),
      '', // processed_at
    ];
    await sheetsClient.appendRows('System_Events!A2:M', [eventRow]);
    return NextResponse.json({ message: 'Event published', data: eventRow }, { status: 201 });
  } catch (error) {
    console.error('Failed to publish event:', error);
    return NextResponse.json({ error: 'Failed to publish event' }, { status: 500 });
  }
}
