import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function PATCH(request: Request, { params }: { params: Promise<{ configKey: string }> }) {
  try {
    const { configKey } = await params;
    const { config_value, change_reason } = await request.json();
    const config = await dbMock.getConfig(configKey);
    
    if (!config) return NextResponse.json({ error: 'Config not found' }, { status: 404 });

    const requiresApproval = config.requires_approval === 1;

    if (requiresApproval) {
      await dbMock.insertConfigApprovalRequest(
        configKey,
        config_value,
        'SystemAdmin',
        change_reason || 'No reason provided'
      );
      
      await dbMock.insertConfigChangeLog(
        configKey, 
        config.config_value, 
        config_value, 
        'SystemAdmin', 
        config.environment, 
        change_reason || 'Pending Approval', 
        1, 
        'PENDING_APPROVAL'
      );

      return NextResponse.json({ data: config, message: 'Change requires approval. Request submitted.' });
    }

    await dbMock.updateConfig(configKey, config_value);

    await dbMock.insertConfigChangeLog(
        configKey, 
        config.config_value, 
        config_value, 
        'SystemAdmin', 
        config.environment, 
        change_reason || 'Direct change', 
        0, 
        'APPLIED'
    );

    return NextResponse.json({ data: { ...config, config_value: config_value }, message: 'Config updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
}
