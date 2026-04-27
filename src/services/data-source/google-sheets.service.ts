// Google Sheets Service: Orchestrates Google Sheets data operations
import { sheetsClient } from '../../lib/google/sheets-client';
import { getCache, setCache } from './sheet-cache.service';
import { logError } from '../../utils/logger';

const DEFAULT_TTL = 60; // seconds

export async function getSheetData(sheet: string, range: string, ttl: number = DEFAULT_TTL) {
  const cacheKey = `${sheet}:${range}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;
  try {
    const values = await sheetsClient.getRange(`${sheet}!${range}`);
    setCache(cacheKey, values, ttl);
    return values;
  } catch (err) {
    logError(`Failed to fetch sheet data for ${sheet}:`, err);
    throw err;
  }
}
