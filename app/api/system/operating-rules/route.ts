import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET() {
  try {
    const rules = await dbMock.all('system_operating_rules');
    return NextResponse.json({ data: rules });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch operating rules' }, { status: 500 });
  }
}
