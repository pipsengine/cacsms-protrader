import { NextResponse } from 'next/server';
import { sheetsClient } from '@/lib/google/sheets-client';

  try {
    const { symbol } = await params;
    // Fetch all symbols from Google Sheets
    const symbolRows = await sheetsClient.getRange('Asset!A2:K');
    const symbolObj = symbolRows.find((row: any[]) => row[0] === symbol || row[1] === symbol);
    if (!symbolObj) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });

    // Fetch all bias states from Google Sheets (assuming a Bias_States sheet exists)
    const biasRows = await sheetsClient.getRange('Bias_States!A2:Z');
    // Filter for this symbol (assuming symbol_id is in column 0 or 1, adjust as needed)
    const filtered = biasRows.filter((b: any[]) => b[0] === symbolObj[0] || b[1] === symbolObj[0]);
    return NextResponse.json({ data: filtered });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bias states' }, { status: 500 });
  }
}
