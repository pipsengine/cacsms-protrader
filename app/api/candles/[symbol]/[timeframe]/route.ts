import { NextResponse } from 'next/server';
import { sheetsClient } from '@/lib/google/sheets-client';

  try {
    const { symbol, timeframe } = await params;
    // Read all rows from the 'Candles' and 'Symbol_Masters' sheets
    const [candlesRows, symbolsRows] = await Promise.all([
      sheetsClient.getRange('Candles!A2:Z'),
      sheetsClient.getRange('Symbol_Masters!A2:Z')
    ]);
    // Assume headers: id, symbol_id, timeframe, ...
    const symbolHeader = ['id','symbol_code','symbol_name','...'];
    const symbolObj = symbolsRows.map(row => Object.fromEntries(symbolHeader.map((k, i) => [k, row[i]]))).find(s => s.symbol_code === symbol);
    if (!symbolObj) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });
    const symbolId = symbolObj.id;
    // Assume candleHeader: id, symbol_id, timeframe, ...
    const candleHeader = ['id','symbol_id','timeframe','...'];
    const filtered = candlesRows
      .map(row => Object.fromEntries(candleHeader.map((k, i) => [k, row[i]])))
      .filter(c => c.symbol_id === symbolId && c.timeframe === timeframe);
    return NextResponse.json({ data: filtered });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch candles' }, { status: 500 });
  }
}
