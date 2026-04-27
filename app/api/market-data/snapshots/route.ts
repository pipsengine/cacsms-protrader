import { NextResponse } from 'next/server';
import { sheetsClient } from '@/lib/google/sheets-client';

  try {
    // Read all rows from the 'Market_Snapshots' sheet
    const snapshotRows = await sheetsClient.getRange('Market_Snapshots!A2:Z');
    // Read all symbols from the 'Asset' sheet
    const symbolRows = await sheetsClient.getRange('Asset!A2:K');
    // Optionally join symbol_code if needed (assuming symbol_id in col 0, symbol_code in col 1)
    const enriched = snapshotRows.map((snap: any[]) => {
      const sym = symbolRows.find((s: any[]) => s[0] === snap[1]);
      if (sym) snap.push(sym[1]);
      return snap;
    });
    return NextResponse.json({ data: enriched });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch snapshots' }, { status: 500 });
  }
}
