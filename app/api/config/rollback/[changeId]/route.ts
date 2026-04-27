import { NextResponse } from 'next/server';
import { sheetsClient } from '@/lib/google/sheets-client';

  try {
    const { changeId } = await params;
    // Read all rows from the 'Configuration_Change_Logs' sheet
    const logRows = await sheetsClient.getRange('Configuration_Change_Logs!A2:J');
    const idx = logRows.findIndex(row => row[0] === changeId || row[0] === String(changeId));
    if (idx === -1) return NextResponse.json({ error: 'Change log not found' }, { status: 404 });
    const log = logRows[idx];
    if (log[8] !== 'APPLIED') {
      return NextResponse.json({ error: 'Can only rollback applied changes' }, { status: 400 });
    }
    const config_key = log[1];
    const previous_value = log[2];
    const environment = log[5];
    // Try to parse previous_value as JSON for feature flag, else treat as string for config
    let isFlag = false;
    let parsedValue;
    try {
      parsedValue = JSON.parse(previous_value);
      isFlag = typeof parsedValue === 'object' && parsedValue !== null && 'is_enabled' in parsedValue;
    } catch { parsedValue = previous_value; }
    if (isFlag) {
      // Update Feature_Flags sheet
      const flagRows = await sheetsClient.getRange('Feature_Flags!A2:N');
      const flagIdx = flagRows.findIndex(row => row[1] === config_key);
      if (flagIdx !== -1) {
        flagRows[flagIdx][6] = parsedValue.is_enabled;
        flagRows[flagIdx][8] = parsedValue.current_value;
        await sheetsClient.updateRange(`Feature_Flags!A${flagIdx+2}:N${flagIdx+2}`, [flagRows[flagIdx]]);
      }
    } else {
      // Update Runtime_Configurations sheet
      const configRows = await sheetsClient.getRange('Runtime_Configurations!A2:N');
      const configIdx = configRows.findIndex(row => row[1] === config_key);
      if (configIdx !== -1) {
        configRows[configIdx][3] = previous_value;
        await sheetsClient.updateRange(`Runtime_Configurations!A${configIdx+2}:N${configIdx+2}`, [configRows[configIdx]]);
      }
    }
    // Mark original log entry as ROLLED_BACK
    logRows[idx][8] = 'ROLLED_BACK';
    await sheetsClient.updateRange(`Configuration_Change_Logs!A${idx+2}:J${idx+2}`, [logRows[idx]]);
    // Create a new log for the rollback action itself
    const rollbackLogRow = [
      '', // id (auto)
      config_key,
      log[3], // new_value becomes previous_value
      previous_value,
      'SystemAdmin',
      environment,
      `Rollback of change #${changeId}`,
      0,
      'APPLIED',
      new Date().toISOString(),
    ];
    await sheetsClient.appendRows('Configuration_Change_Logs!A2:J', [rollbackLogRow]);
    return NextResponse.json({ message: 'Rollback successful' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process rollback' }, { status: 500 });
  }
}
