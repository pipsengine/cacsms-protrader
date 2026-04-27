import { NextResponse } from 'next/server';
import { sheetsClient } from '../../../../src/lib/google/sheets-client';

export async function GET() {
  try {
    // Read all rows from the 'System_Doctrines' sheet
    const rows = await sheetsClient.getRange('System_Doctrines!A2:G');
    // Optionally map to objects if needed
    return NextResponse.json({ data: rows });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch doctrines' }, { status: 500 });
  }
}
