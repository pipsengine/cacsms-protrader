import { NextResponse } from 'next/server';
import { sheetsClient } from '@/lib/google/sheets-client';

  try {
    // Read all rows from the 'System_Environments' sheet
    const rows = await sheetsClient.getRange('System_Environments!A2:G');
    return NextResponse.json({ data: rows });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch environments' }, { status: 500 });
  }
}
