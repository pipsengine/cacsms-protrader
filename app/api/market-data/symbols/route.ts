import { NextResponse } from 'next/server';
import { sheetsClient } from '@/lib/google/sheets-client';

export async function GET() {
  try {
    // Read all rows from the 'Asset' sheet (assuming 'symbols' are stored there)
    const rows = await sheetsClient.getRange('Asset!A2:K');
    // Optionally, map rows to objects using headers if needed
    return NextResponse.json({ data: rows });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch symbols' }, { status: 500 });
  }
}
