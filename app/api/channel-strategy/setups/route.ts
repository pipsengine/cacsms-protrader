import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const setups = await dbMock.all('channel_strategy_setups');
    return NextResponse.json({ data: setups });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
