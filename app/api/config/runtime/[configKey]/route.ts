import { NextResponse } from 'next/server';
import { sheetsClient } from '@/lib/google/sheets-client';

  try {
    const { configKey } = await params;
    const { config_value, change_reason } = await request.json();
    // Read all rows from the 'Runtime_Configurations' sheet
    const rows = await sheetsClient.getRange('Runtime_Configurations!A2:N');
    const header = [
      'id','config_key','config_name','config_value','data_type','module_name','environment','is_sensitive','risk_level','requires_approval','requires_restart','updated_by','created_at','updated_at'
    ];
    const idx = rows.findIndex(row => row[1] === configKey);
    if (idx === -1) return NextResponse.json({ error: 'Config not found' }, { status: 404 });
    const config = Object.fromEntries(header.map((k, i) => [k, rows[idx][i]]));
    const requiresApproval = config.requires_approval === '1' || config.requires_approval === 1;
    if (requiresApproval) {
      // Append approval request to Configuration_Approval_Requests sheet
      const approvalRow = [
        '', // id (auto)
        configKey,
        config_value,
        'SystemAdmin',
        '', // reviewed_by
        'PENDING_APPROVAL',
        change_reason || 'No reason provided',
        '', // review_comment
        new Date().toISOString(),
        '', // reviewed_at
      ];
      await sheetsClient.appendRows('Configuration_Approval_Requests!A2:J', [approvalRow]);
      // Append change log
      const changeLogRow = [
        '', // id (auto)
        configKey,
        config.config_value,
        config_value,
        'SystemAdmin',
        config.environment,
        change_reason || 'Pending Approval',
        1,
        'PENDING_APPROVAL',
        new Date().toISOString(),
      ];
      await sheetsClient.appendRows('Configuration_Change_Logs!A2:J', [changeLogRow]);
      return NextResponse.json({ data: config, message: 'Change requires approval. Request submitted.' });
    }
    // Update the row in Runtime_Configurations sheet
    rows[idx][3] = config_value;
    await sheetsClient.updateRange(`Runtime_Configurations!A${idx+2}:N${idx+2}`, [rows[idx]]);
    // Append change log
    const changeLogRow = [
      '', // id (auto)
      configKey,
      config.config_value,
      config_value,
      'SystemAdmin',
      config.environment,
      change_reason || 'Direct change',
      0,
      'APPLIED',
      new Date().toISOString(),
    ];
    await sheetsClient.appendRows('Configuration_Change_Logs!A2:J', [changeLogRow]);
    return NextResponse.json({ data: { ...config, config_value: config_value }, message: 'Config updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
}
