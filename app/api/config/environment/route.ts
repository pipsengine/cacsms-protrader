import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET() {
  try {
    const envs = await dbMock.all('system_environments');
    return NextResponse.json({ data: envs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch environments' }, { status: 500 });
  }
}
