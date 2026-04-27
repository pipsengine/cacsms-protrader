import { NextResponse } from 'next/server';
import { sheetsClient } from '../../../../../src/lib/google/sheets-client';

export async function GET() {
  try {
    const events = await sheetsClient.getRange('Data_Quality_Events!A2:Z');
    return NextResponse.json({ data: events });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data quality events' }, { status: 500 });
  }
}
