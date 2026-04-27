import { NextResponse } from 'next/server';
import { sheetsClient } from '@/lib/google/sheets-client';

  try {
    // Read all rows from the 'Market_Data_Sources' sheet
    const rows = await sheetsClient.getRange('Market_Data_Sources!A2:Z');
    return NextResponse.json({ data: rows });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sources' }, { status: 500 });
  }
}
