import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const setups = await dbMock.all('liquidity_setups');
    const historySetups = setups.filter((s: any) => 
      ['EXECUTED', 'INVALIDATED', 'EXPIRED'].includes(s.status)
    );
    return NextResponse.json({ data: historySetups });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch history setups' }, { status: 500 });
  }
}
