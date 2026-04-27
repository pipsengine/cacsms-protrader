import { NextResponse } from 'next/server';
import { sheetsClient } from '@/lib/google/sheets-client';

  try {
    // Read all rows from the 'Candle_Anomalies' sheet
    const rows = await sheetsClient.getRange('Candle_Anomalies!A2:Z');
    return NextResponse.json({ data: rows });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch anomalies' }, { status: 500 });
  }
}
