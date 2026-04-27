import { NextResponse } from 'next/server';
import { sheetsClient } from '@/lib/google/sheets-client';

  try {
    // Read all rows from the 'Feature_Flags' sheet
    const rows = await sheetsClient.getRange('Feature_Flags!A2:N');
    return NextResponse.json({ data: rows });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch feature flags' }, { status: 500 });
  }
}
