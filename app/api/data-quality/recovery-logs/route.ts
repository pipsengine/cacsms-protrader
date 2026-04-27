import { NextResponse } from 'next/server';
import { sheetsClient } from '../../../../../src/lib/google/sheets-client';

export async function GET() {
  try {
    const logs = await sheetsClient.getRange('Data_Recovery_Logs!A2:Z');
    return NextResponse.json({ data: logs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch recovery logs' }, { status: 500 });
  }
}
