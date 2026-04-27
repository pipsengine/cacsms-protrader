// Script to check Google Sheets connection and required tables
import { google } from 'googleapis';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

// Define required sheets and their headers
const REQUIRED_SHEETS = [
  {
    name: 'System_Config',
    headers: [
      'config_key', 'config_value', 'data_type', 'description', 'is_active', 'updated_by', 'updated_at',
    ],
  },
  {
    name: 'Asset',
    headers: [
      'symbol', 'broker_symbol', 'asset_class', 'enabled', 'min_timeframe', 'max_timeframe', 'spread_limit', 'session_allowed', 'strategy_allowed', 'notes', 'updated_at',
    ],
  },
  { name: 'Audit_Logs', headers: ['id', 'action', 'user', 'timestamp', 'details'] },
  { name: 'Channel_Trading_Config', headers: ['id', 'channel_name', 'config_key', 'config_value', 'is_active', 'updated_at'] },
  { name: 'Data_Sync_Status', headers: ['id', 'source', 'status', 'last_synced_at', 'details'] },
  { name: 'Economic_Events', headers: ['id', 'event_name', 'event_time', 'impact', 'currency', 'details'] },
  { name: 'Error_Logs', headers: ['id', 'error_message', 'stack_trace', 'created_at', 'resolved'] },
  { name: 'Manual_Signals', headers: ['id', 'symbol', 'signal_type', 'price', 'created_at', 'created_by'] },
  { name: 'Risk_Management', headers: ['id', 'risk_type', 'value', 'applies_to', 'created_at', 'updated_at'] },
  { name: 'Strategies', headers: ['id', 'strategy_name', 'description', 'is_active', 'created_at', 'updated_at'] },
  { name: 'Trade_Logs', headers: ['id', 'symbol', 'trade_type', 'amount', 'price', 'timestamp', 'status'] },
  { name: 'AI_Analysis_Output', headers: ['id', 'analysis_type', 'result', 'created_at', 'details'] },
];

async function main() {
  if (!SHEET_ID) {
    console.error('Missing GOOGLE_SHEET_ID environment variable.');
    process.exit(1);
  }
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });
  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    const sheetNames = meta.data.sheets?.map(s => s.properties?.title) || [];
    let allExist = true;
    for (const required of REQUIRED_SHEETS) {
      if (!sheetNames.includes(required.name)) {
        console.warn(`Missing required sheet/tab: ${required.name}. Creating...`);
        // Create the missing sheet/tab with headers
        const addSheetRes = await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SHEET_ID,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: required.name,
                  },
                },
              },
            ],
          },
        });
        // Add headers to the new sheet
        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: `${required.name}!A1:${String.fromCharCode(65 + required.headers.length - 1)}1`,
          valueInputOption: 'RAW',
          requestBody: { values: [required.headers] },
        });

        // Get the new sheetId for formatting
        const newSheetId = addSheetRes.data.replies && addSheetRes.data.replies[0].addSheet && addSheetRes.data.replies[0].addSheet.properties.sheetId;
        if (newSheetId !== undefined) {
          // Apply filter to header row (table-like formatting)
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId: SHEET_ID,
            requestBody: {
              requests: [
                {
                  setBasicFilter: {
                    filter: {
                      range: {
                        sheetId: newSheetId,
                        startRowIndex: 0,
                        endRowIndex: 1,
                        startColumnIndex: 0,
                        endColumnIndex: required.headers.length,
                      },
                    },
                  },
                },
                // Optionally, create a basic pivot table for the sheet
                {
                  addPivotTable: {
                    pivotTable: {
                      source: {
                        sheetId: newSheetId,
                        startRowIndex: 0,
                        startColumnIndex: 0,
                        endColumnIndex: required.headers.length,
                      },
                      rows: [
                        {
                          sourceColumnOffset: 0,
                          sortOrder: 'ASCENDING',
                        },
                      ],
                      values: [
                        {
                          summarizeFunction: 'COUNTA',
                          sourceColumnOffset: 0,
                        },
                      ],
                      destination: {
                        sheetId: newSheetId,
                        startRowIndex: 3,
                        startColumnIndex: 0,
                      },
                    },
                  },
                },
              ],
            },
          });
        }
        console.log(`Created sheet/tab: ${required.name} with headers, filter, and pivot table.`);
        allExist = false; // Mark as false so user knows a change was made
      } else {
        console.log(`Found required sheet/tab: ${required.name}`);
      }
    }
    if (allExist) {
      console.log('All required sheets/tables exist. Connection successful!');
    } else {
      console.log('Some sheets/tables were missing and have now been created. Please rerun to confirm.');
      process.exit(2);
    }
  } catch (err) {
    console.error('Failed to connect to Google Sheets:', err);
    process.exit(3);
  }
}

main();
