import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET() {
  try {
    const mappings = await dbMock.all('broker_symbol_mappings');
    return NextResponse.json({ data: mappings });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch broker symbol mappings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await dbMock.open();
    const newMapping = {
      id: Date.now(),
      broker_name: body.broker_name,
      broker_symbol: body.broker_symbol,
      internal_symbol_id: body.internal_symbol_id,
      mapping_status: body.mapping_status || 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.broker_symbol_mappings.push(newMapping);
    await dbMock.save(db);
    return NextResponse.json({ data: newMapping });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to store broker symbol mapping' }, { status: 500 });
  }
}
