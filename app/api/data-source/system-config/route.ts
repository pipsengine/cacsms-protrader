import { NextRequest, NextResponse } from 'next/server';
import { getSheetData } from '../../../../src/services/data-source/google-sheets.service';

export async function GET(req: NextRequest) {
  try {
    const data = await getSheetData('System_Config', 'A1:G100');
    return NextResponse.json({
      success: true,
      source: 'google_sheets',
      sheet: 'System_Config',
      cached: true,
      lastSync: new Date().toISOString(),
      data,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch System_Config',
    }, { status: 500 });
  }
}
