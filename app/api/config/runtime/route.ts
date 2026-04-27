import { NextResponse } from 'next/server';
import { sheetsClient } from '@/lib/google/sheets-client';

  try {
    // Read all rows from the 'Runtime_Configurations' sheet
    const rows = await sheetsClient.getRange('Runtime_Configurations!A2:N');
    return NextResponse.json({ data: rows });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch configs' }, { status: 500 });
  }
}
