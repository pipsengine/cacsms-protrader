import { google, sheets_v4 } from 'googleapis';
import { getGoogleSheetsAuth } from './sheets-auth';

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const READ_BATCH_SIZE = Number(process.env.GOOGLE_SHEETS_READ_BATCH_SIZE) || 500;
const WRITE_BATCH_SIZE = Number(process.env.GOOGLE_SHEETS_WRITE_BATCH_SIZE) || 100;

if (!SHEET_ID) {
  throw new Error('Missing GOOGLE_SHEET_ID environment variable.');
}

function getSheetsApi(): sheets_v4.Sheets {
  const auth = getGoogleSheetsAuth();
  return google.sheets({ version: 'v4', auth });
}

export const sheetsClient = {
  async getRange(range: string) {
    const sheets = getSheetsApi();
    const res = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range });
    return res.data.values;
  },
  async batchGetRanges(ranges: string[]) {
    const sheets = getSheetsApi();
    const res = await sheets.spreadsheets.values.batchGet({ spreadsheetId: SHEET_ID, ranges });
    return res.data.valueRanges;
  },
  async appendRows(range: string, values: any[][]) {
    const sheets = getSheetsApi();
    return sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });
  },
  async updateRange(range: string, values: any[][]) {
    const sheets = getSheetsApi();
    return sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });
  },
  async clearRange(range: string) {
    const sheets = getSheetsApi();
    return sheets.spreadsheets.values.clear({ spreadsheetId: SHEET_ID, range });
  },
};
