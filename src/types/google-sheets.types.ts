// Google Sheets Types: Types for Google Sheets API and data
export interface GoogleSheetsRange {
  range: string;
  values: any[][];
}

export interface GoogleSheetsBatchGetResponse {
  valueRanges: GoogleSheetsRange[];
}
