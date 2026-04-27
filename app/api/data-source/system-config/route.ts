import { NextRequest, NextResponse } from 'next/server';
import { getSystemConfig } from '../../../../src/modules/protrader/data-source/system-config.repository';

export async function GET(req: NextRequest) {
  try {
    const data = await getSystemConfig();
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
