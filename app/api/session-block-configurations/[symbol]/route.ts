import { NextResponse } from 'next/server';
import { sheetsClient } from '@/lib/google/sheets-client';

  try {
    const { symbol } = await params;
    // Fetch all symbols from Google Sheets
    const symbolRows = await sheetsClient.getRange('Asset!A2:K');
    const symbolObj = symbolRows.find((row: any[]) => row[0] === symbol || row[1] === symbol);
    if (!symbolObj) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });

    // Fetch all session block configurations from Google Sheets
    const configRows = await sheetsClient.getRange('Session_Block_Configurations!A2:Z');
    // Filter for this symbol (assuming symbol_id is in column 0 or 1, adjust as needed)
    const filtered = configRows.filter((c: any[]) => c[0] === symbolObj[0] || c[1] === symbolObj[0]);
    return NextResponse.json({ data: filtered });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch session block configurations' }, { status: 500 });
  }
}

  try {
    // PATCH logic for live data should be implemented here (e.g., update Google Sheets row)
    return NextResponse.json({ message: 'Session block configuration update endpoint (live data) not yet implemented.' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update session block configuration' }, { status: 500 });
  }
}
