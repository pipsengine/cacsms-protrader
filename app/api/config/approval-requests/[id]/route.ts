import { NextResponse } from 'next/server';
import { sheetsClient } from '@/lib/google/sheets-client';

  try {
    const { id } = await params;
    const { action, comment } = await request.json(); // action: APPROVE or REJECT
    // Read all rows from the 'Configuration_Approval_Requests' sheet
    const rows = await sheetsClient.getRange('Configuration_Approval_Requests!A2:J');
    const idx = rows.findIndex(row => row[0] === id || row[0] === String(id));
    if (idx === -1) return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    const targetReq = rows[idx];
    if (targetReq[5] !== 'PENDING_APPROVAL') return NextResponse.json({ error: 'Request is not pending' }, { status: 400 });
    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    // Update approval status, reviewed_by, review_comment, reviewed_at
    targetReq[5] = newStatus;
    targetReq[4] = 'SuperAdmin';
    targetReq[7] = comment || '';
    targetReq[9] = new Date().toISOString();
    await sheetsClient.updateRange(`Configuration_Approval_Requests!A${idx+2}:J${idx+2}`, [targetReq]);
    // If approved, apply the actual change
    if (newStatus === 'APPROVED') {
      // Try to parse requested_value as JSON for feature flag, else treat as string for config
      let isFlag = false;
      let parsedValue;
      try {
        parsedValue = JSON.parse(targetReq[2]);
        isFlag = typeof parsedValue === 'object' && parsedValue !== null && 'is_enabled' in parsedValue;
      } catch { parsedValue = targetReq[2]; }
      if (isFlag) {
        // Update Feature_Flags sheet
        const flagRows = await sheetsClient.getRange('Feature_Flags!A2:N');
        const flagIdx = flagRows.findIndex(row => row[1] === targetReq[1]);
        if (flagIdx !== -1) {
          flagRows[flagIdx][6] = parsedValue.is_enabled;
          flagRows[flagIdx][8] = parsedValue.current_value;
          await sheetsClient.updateRange(`Feature_Flags!A${flagIdx+2}:N${flagIdx+2}`, [flagRows[flagIdx]]);
        }
      } else {
        // Update Runtime_Configurations sheet
        const configRows = await sheetsClient.getRange('Runtime_Configurations!A2:N');
        const configIdx = configRows.findIndex(row => row[1] === targetReq[1]);
        if (configIdx !== -1) {
          configRows[configIdx][3] = targetReq[2];
          await sheetsClient.updateRange(`Runtime_Configurations!A${configIdx+2}:N${configIdx+2}`, [configRows[configIdx]]);
        }
      }
      // Update change log status to APPLIED
      const logRows = await sheetsClient.getRange('Configuration_Change_Logs!A2:J');
      const logIdx = logRows.findIndex(row => row[1] === targetReq[1] && row[8] === 'PENDING_APPROVAL');
      if (logIdx !== -1) {
        logRows[logIdx][8] = 'APPLIED';
        await sheetsClient.updateRange(`Configuration_Change_Logs!A${logIdx+2}:J${logIdx+2}`, [logRows[logIdx]]);
      }
    } else {
      // If rejected, update the change log to REJECTED
      const logRows = await sheetsClient.getRange('Configuration_Change_Logs!A2:J');
      const logIdx = logRows.findIndex(row => row[1] === targetReq[1] && row[8] === 'PENDING_APPROVAL');
      if (logIdx !== -1) {
        logRows[logIdx][8] = 'REJECTED';
        await sheetsClient.updateRange(`Configuration_Change_Logs!A${logIdx+2}:J${logIdx+2}`, [logRows[logIdx]]);
      }
    }
    return NextResponse.json({ message: `Request ${action}D successfully` });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
