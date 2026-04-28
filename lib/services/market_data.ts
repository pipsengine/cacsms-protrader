import { NextResponse } from 'next/server';
import { openDb, saveDb } from '@/lib/db';

// Normalize symbol name (e.g., XAUUSD.a -> XAUUSD)
export function normalize_symbol(symbol: string) {
  return symbol.replace(/\..*$/, '').toUpperCase();
}

// Normalize timeframe (e.g., m1 -> M1)
export function normalize_timeframe(tf: string) {
  return tf.toUpperCase();
}

// Normalize timestamp to UTC ISO string
export function normalize_timestamp(ts: string | number | Date) {
  return new Date(ts).toISOString();
}

// Store tick
export async function store_tick(tick: any) {
  const db = await openDb();
  db.ticks.push({
    ...tick,
    id: Date.now(),
    received_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  });
  await saveDb(db);
}

// Store candle
export async function store_candle(candle: any) {
  const db = await openDb();
  db.candles.push({
    ...candle,
    id: Date.now(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  await saveDb(db);
}

// Get candles
export async function get_candles(symbol_code: string, timeframe: string, start?: string, end?: string) {
  const db = await openDb();
  const symbol = db.symbols.find((s: any) => s.symbol_code === symbol_code);
  if (!symbol) return [];
  return db.candles.filter((c: any) =>
    c.symbol_id === symbol.id &&
    c.timeframe === timeframe &&
    (!start || c.open_time >= start) &&
    (!end || c.close_time <= end)
  );
}

// Get latest candle
export async function get_latest_candle(symbol_code: string, timeframe: string) {
  const db = await openDb();
  const symbol = db.symbols.find((s: any) => s.symbol_code === symbol_code);
  if (!symbol) return null;
  const candles = db.candles.filter((c: any) => c.symbol_id === symbol.id && c.timeframe === timeframe);
  return candles.sort((a: any, b: any) => new Date(b.close_time) - new Date(a.close_time))[0] || null;
}

// Get market snapshot
export async function get_market_snapshot(symbol_code: string) {
  const db = await openDb();
  const symbol = db.symbols.find((s: any) => s.symbol_code === symbol_code);
  if (!symbol) return null;
  return db.market_snapshots.find((s: any) => s.symbol_id === symbol.id) || null;
}

// Validate candle record (basic)
export function validate_candle_record(candle: any) {
  if (!candle.open_price || !candle.close_price || !candle.high_price || !candle.low_price) return false;
  if (candle.high_price < candle.low_price) return false;
  if (candle.open_price > candle.high_price || candle.open_price < candle.low_price) return false;
  if (candle.close_price > candle.high_price || candle.close_price < candle.low_price) return false;
  return true;
}

// Log market data correction
export async function log_market_data_correction(correction: any) {
  const db = await openDb();
  db.market_data_corrections.push({
    ...correction,
    id: Date.now(),
    created_at: new Date().toISOString()
  });
  await saveDb(db);
}
