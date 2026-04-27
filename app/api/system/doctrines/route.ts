import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET() {
  try {
    const doctrines = await dbMock.all('system_doctrines');
    return NextResponse.json({ data: doctrines });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch doctrines' }, { status: 500 });
  }
}
