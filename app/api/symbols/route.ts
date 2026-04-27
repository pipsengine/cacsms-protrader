import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET() {
  try {
    const symbols = await dbMock.all('symbol_masters');
    return NextResponse.json({ data: symbols });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch symbols' }, { status: 500 });
  }
}
