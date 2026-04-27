import { NextResponse } from 'next/server';
import { sheetsClient } from '@/lib/google/sheets-client';

  try {
    const { ruleKey } = await params;
    // Read all rules from Google Sheets
    const rows = await sheetsClient.getRange('System_Operating_Rules!A2:H');
    // Find rule by rule_key (assume col 1 is rule_key)
    const rule = rows.find((row: any[]) => row[1] === ruleKey);
    if (!rule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
    }
    return NextResponse.json({ data: rule });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch operating rule' }, { status: 500 });
  }
}

  try {
    const { ruleKey } = await params;
    const body = await request.json();
    // Read all rules from Google Sheets
    const rows = await sheetsClient.getRange('System_Operating_Rules!A2:H');
    const ruleIdx = rows.findIndex((row: any[]) => row[1] === ruleKey);
    if (ruleIdx === -1) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
    }
    // Update value and/or is_enforced
    const rule = rows[ruleIdx];
    const valueToUpdate = body.value !== undefined ? String(body.value) : rule[3];
    const isEnforcedToUpdate = body.is_enforced !== undefined ? (body.is_enforced ? 1 : 0) : rule[6];
    // Update the row in Google Sheets
    const updateRange = `System_Operating_Rules!A${ruleIdx + 2}:H${ruleIdx + 2}`;
    const updatedRow = [rule[0], rule[1], rule[2], valueToUpdate, rule[4], rule[5], isEnforcedToUpdate, new Date().toISOString()];
    await sheetsClient.updateRange(updateRange, [updatedRow]);
    // TODO: Add audit log entry for critical rules
    return NextResponse.json({ message: 'Rule updated', data: updatedRow });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update operating rule' }, { status: 500 });
  }
}
    const details = `Updated ${exitingRule.rule_name}. Value: [${exitingRule.rule_value} -> ${valueToUpdate}]. Enforced: [${exitingRule.is_enforced} -> ${isEnforcedToUpdate}]`;
    
    await dbMock.insertAudit('UPDATE_OPERATING_RULE', 'system_operating_rules', ruleKey, details, userId);
    
    const updatedRule = await dbMock.getRule(ruleKey);

    return NextResponse.json({ data: updatedRule, message: 'Rule updated and logged successfully.' });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update operating rule' }, { status: 500 });
  }
}
