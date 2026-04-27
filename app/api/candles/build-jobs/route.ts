import { NextResponse } from 'next/server';
import { sheetsClient } from '@/src/lib/google/sheets-client';

export async function GET() {
  try {
    const jobs = await sheetsClient.getRange('Candle_Build_Jobs!A2:Z');
    return NextResponse.json({ data: jobs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch build jobs' }, { status: 500 });
  }
}
