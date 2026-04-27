import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET() {
  try {
    const flags = await dbMock.all('feature_flags');
    return NextResponse.json({ data: flags });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch feature flags' }, { status: 500 });
  }
}
