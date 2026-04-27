import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ ruleKey: string }> }) {
  try {
    const { ruleKey } = await params;
    const rule = await dbMock.getRule(ruleKey);
    
    if (!rule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
    }
    
    return NextResponse.json({ data: rule });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch operating rule' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ ruleKey: string }> }) {
  try {
    const { ruleKey } = await params;
    const body = await request.json();
    
    const exitingRule = await dbMock.getRule(ruleKey);
    
    if (!exitingRule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
    }

    if (body.value === undefined && body.is_enforced === undefined) {
      return NextResponse.json({ error: 'Provide value or is_enforced to update' }, { status: 400 });
    }

    const valueToUpdate = body.value !== undefined ? String(body.value) : exitingRule.rule_value;
    const isEnforcedToUpdate = body.is_enforced !== undefined ? (body.is_enforced ? 1 : 0) : exitingRule.is_enforced;

    await dbMock.updateRule(ruleKey, valueToUpdate, isEnforcedToUpdate);

    // Audit Log Creation
    const userId = 'SuperAdmin';
    const details = `Updated ${exitingRule.rule_name}. Value: [${exitingRule.rule_value} -> ${valueToUpdate}]. Enforced: [${exitingRule.is_enforced} -> ${isEnforcedToUpdate}]`;
    
    await dbMock.insertAudit('UPDATE_OPERATING_RULE', 'system_operating_rules', ruleKey, details, userId);
    
    const updatedRule = await dbMock.getRule(ruleKey);

    return NextResponse.json({ data: updatedRule, message: 'Rule updated and logged successfully.' });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update operating rule' }, { status: 500 });
  }
}
