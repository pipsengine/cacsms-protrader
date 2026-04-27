import { NextResponse } from 'next/server';
import { sheetsClient } from '@/lib/google/sheets-client';

  try {
    const { slug } = await params;
    const isId = !isNaN(Number(slug));
    // Read all rows from the 'Liquidity_Setups' and 'Symbol_Masters' sheets
    const [setupsRows, symbolsRows] = await Promise.all([
      sheetsClient.getRange('Liquidity_Setups!A2:Z'),
      sheetsClient.getRange('Symbol_Masters!A2:Z')
    ]);
    // Assume headers: id, symbol_id, ...
    if (isId) {
      const setupId = parseInt(slug);
      const setup = setupsRows.find(row => row[0] === setupId || row[0] === String(setupId));
      if (!setup) return NextResponse.json({ error: 'Setup not found' }, { status: 404 });
      return NextResponse.json({ data: setup });
    } else {
      const symbolHeader = ['id','symbol_code','symbol_name','...'];
      const symbolObj = symbolsRows.map(row => Object.fromEntries(symbolHeader.map((k, i) => [k, row[i]]))).find(s => s.symbol_code === slug);
      if (!symbolObj) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });
      const symbolId = symbolObj.id;
      const filtered = setupsRows.filter(row => row[1] === symbolId || row[1] === String(symbolId));
      return NextResponse.json({ data: filtered });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
