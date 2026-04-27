import { NextResponse } from 'next/server';
import { sheetsClient } from '@/lib/google/sheets-client';

  try {
    // Read all rows from the 'Configuration_Change_Logs' sheet
    const rows = await sheetsClient.getRange('Configuration_Change_Logs!A2:J');
    // Optionally sort by created_at descending if needed
    return NextResponse.json({ data: rows });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}
