import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET() {
  try {
    const logs = await dbMock.all('data_recovery_logs');
    return NextResponse.json({ data: logs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch recovery logs' }, { status: 500 });
  }
}
