import { NextResponse } from 'next/server';
import { sheetsClient } from '../../../../../src/lib/google/sheets-client';

export async function GET() {
  try {
    const snapshots = await sheetsClient.getRange('Data_Health_Snapshots!A2:Z');
    return NextResponse.json({ data: snapshots });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data quality status' }, { status: 500 });
  }
}
