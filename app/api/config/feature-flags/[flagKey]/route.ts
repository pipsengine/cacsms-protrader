import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ flagKey: string }> }) {
  try {
    const { flagKey } = await params;
    const flag = await dbMock.getFlag(flagKey);
    if (!flag) return NextResponse.json({ error: 'Flag not found' }, { status: 404 });
    return NextResponse.json({ data: flag });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch feature flag' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ flagKey: string }> }) {
  try {
    const { flagKey } = await params;
    const { is_enabled, current_value, change_reason } = await request.json();
    const flag = await dbMock.getFlag(flagKey);
    
    if (!flag) return NextResponse.json({ error: 'Flag not found' }, { status: 404 });

    const updatedIsEnabled = is_enabled !== undefined ? (is_enabled ? 1 : 0) : flag.is_enabled;
    const updatedCurrentValue = current_value !== undefined ? Number(current_value) : flag.current_value;

    const requiresApproval = flag.requires_approval === 1;

    if (requiresApproval) {
      // Instead of applying, submit an approval request
      const req = await dbMock.insertConfigApprovalRequest(
        flagKey,
        JSON.stringify({ is_enabled: updatedIsEnabled, current_value: updatedCurrentValue }),
        'SystemAdmin', // mocked user
        change_reason || 'No reason provided'
      );
      
      // Also log the pending request
      await dbMock.insertConfigChangeLog(
        flagKey, 
        JSON.stringify({ is_enabled: flag.is_enabled, current_value: flag.current_value }), 
        JSON.stringify({ is_enabled: updatedIsEnabled, current_value: updatedCurrentValue }), 
        'SystemAdmin', 
        flag.environment, 
        change_reason || 'Pending Approval', 
        1, 
        'PENDING_APPROVAL'
      );

      return NextResponse.json({ data: flag, message: 'Change requires approval. Request submitted.' });
    }

    // Apply directly if no approval required
    await dbMock.updateFlag(flagKey, updatedIsEnabled, updatedCurrentValue);

    await dbMock.insertConfigChangeLog(
        flagKey, 
        JSON.stringify({ is_enabled: flag.is_enabled, current_value: flag.current_value }), 
        JSON.stringify({ is_enabled: updatedIsEnabled, current_value: updatedCurrentValue }), 
        'SystemAdmin', 
        flag.environment, 
        change_reason || 'Direct change', 
        0, 
        'APPLIED'
    );

    return NextResponse.json({ data: { ...flag, is_enabled: updatedIsEnabled, current_value: updatedCurrentValue } });
  } catch (error) {
    console.error('Update flag error:', error);
    return NextResponse.json({ error: 'Failed to update feature flag' }, { status: 500 });
  }
}
