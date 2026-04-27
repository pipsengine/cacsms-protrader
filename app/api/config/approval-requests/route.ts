import { NextResponse } from 'next/server';
import { sheetsClient } from '@/lib/google/sheets-client';

  try {
    // Read all rows from the 'Configuration_Approval_Requests' sheet
    const rows = await sheetsClient.getRange('Configuration_Approval_Requests!A2:J');
    // Optionally sort by requested_at descending if needed
    return NextResponse.json({ data: rows });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch approval requests' }, { status: 500 });
  }
}
