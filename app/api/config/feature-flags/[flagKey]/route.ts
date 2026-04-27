import { NextResponse } from 'next/server';
import { sheetsClient } from '@/lib/google/sheets-client';

  try {
    const { flagKey } = await params;
    // Read all rows from the 'Feature_Flags' sheet
    const rows = await sheetsClient.getRange('Feature_Flags!A2:N');
    const header = [
      'id','flag_key','flag_name','description','module_name','environment','is_enabled','default_value','current_value','risk_level','requires_approval','created_at','updated_at','extra'
    ];
    const flagObj = rows
      .map(row => Object.fromEntries(header.map((k, i) => [k, row[i]])))
      .find(row => row.flag_key === flagKey);
    if (!flagObj) return NextResponse.json({ error: 'Flag not found' }, { status: 404 });
    return NextResponse.json({ data: flagObj });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch feature flag' }, { status: 500 });
  }
}

  try {
    const { flagKey } = await params;
    const { is_enabled, current_value, change_reason } = await request.json();
    // Read all rows from the 'Feature_Flags' sheet
    const rows = await sheetsClient.getRange('Feature_Flags!A2:N');
    const header = [
      'id','flag_key','flag_name','description','module_name','environment','is_enabled','default_value','current_value','risk_level','requires_approval','created_at','updated_at','extra'
    ];
    const idx = rows.findIndex(row => row[1] === flagKey);
    if (idx === -1) return NextResponse.json({ error: 'Flag not found' }, { status: 404 });
    const flag = Object.fromEntries(header.map((k, i) => [k, rows[idx][i]]));
    const updatedIsEnabled = is_enabled !== undefined ? (is_enabled ? 1 : 0) : flag.is_enabled;
    const updatedCurrentValue = current_value !== undefined ? Number(current_value) : flag.current_value;
    const requiresApproval = flag.requires_approval === '1' || flag.requires_approval === 1;
    if (requiresApproval) {
      // Append approval request to Configuration_Approval_Requests sheet
      const approvalRow = [
        '', // id (auto)
        flagKey,
        JSON.stringify({ is_enabled: updatedIsEnabled, current_value: updatedCurrentValue }),
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
        flagKey,
        JSON.stringify({ is_enabled: flag.is_enabled, current_value: flag.current_value }),
        JSON.stringify({ is_enabled: updatedIsEnabled, current_value: updatedCurrentValue }),
        'SystemAdmin',
        flag.environment,
        change_reason || 'Pending Approval',
        1,
        'PENDING_APPROVAL',
        new Date().toISOString(),
      ];
      await sheetsClient.appendRows('Configuration_Change_Logs!A2:J', [changeLogRow]);
      return NextResponse.json({ data: flag, message: 'Change requires approval. Request submitted.' });
    }
    // Update the row in Feature_Flags sheet
    rows[idx][6] = updatedIsEnabled;
    rows[idx][8] = updatedCurrentValue;
    await sheetsClient.updateRange(`Feature_Flags!A${idx+2}:N${idx+2}`, [rows[idx]]);
    // Append change log
    const changeLogRow = [
      '', // id (auto)
      flagKey,
      JSON.stringify({ is_enabled: flag.is_enabled, current_value: flag.current_value }),
      JSON.stringify({ is_enabled: updatedIsEnabled, current_value: updatedCurrentValue }),
      'SystemAdmin',
      flag.environment,
      change_reason || 'Direct change',
      0,
      'APPLIED',
      new Date().toISOString(),
    ];
    await sheetsClient.appendRows('Configuration_Change_Logs!A2:J', [changeLogRow]);
    return NextResponse.json({ data: { ...flag, is_enabled: updatedIsEnabled, current_value: updatedCurrentValue } });
  } catch (error) {
    console.error('Update flag error:', error);
    return NextResponse.json({ error: 'Failed to update feature flag' }, { status: 500 });
  }
}
