import { NextResponse } from 'next/server';
import { sheetsClient } from '@/lib/google/sheets-client';

  try {
    // Read all rows from the 'System_Operating_Rules' sheet
    const rows = await sheetsClient.getRange('System_Operating_Rules!A2:H');
    // Optionally map to objects if needed
    return NextResponse.json({ data: rows });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch operating rules' }, { status: 500 });
  }
}
