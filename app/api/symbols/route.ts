import { NextResponse } from 'next/server';
import { sheetsClient } from '@/src/lib/google/sheets-client';

export async function GET() {
  try {
    const symbols = await sheetsClient.getRange('Symbol_Masters!A2:Z');
    return NextResponse.json({ data: symbols });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch symbols' }, { status: 500 });
  }
}
