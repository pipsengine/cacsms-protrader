import { NextResponse } from 'next/server';
import { dbMock, openDb, saveDb } from '@/lib/db';

export async function POST(request: Request, { params }: { params: Promise<{ changeId: string }> }) {
  try {
    const { changeId } = await params;
    const db = await openDb();
    
    const logIndex = db.configuration_change_logs.findIndex(l => l.id === Number(changeId));
    if (logIndex === -1) return NextResponse.json({ error: 'Change log not found' }, { status: 404 });
    const log = db.configuration_change_logs[logIndex];

    if (log.approval_status !== 'APPLIED') {
      return NextResponse.json({ error: 'Can only rollback applied changes' }, { status: 400 });
    }

    const { config_key, previous_value, environment } = log;

    // Apply rollback
    const isFlag = db.feature_flags.find(f => f.flag_key === config_key);
    if (isFlag) {
      const parsed = JSON.parse(previous_value);
      await dbMock.updateFlag(config_key, parsed.is_enabled, parsed.current_value);
    } else {
      await dbMock.updateConfig(config_key, previous_value);
    }

    // Mark original log entry as ROLLED_BACK
    db.configuration_change_logs[logIndex].approval_status = 'ROLLED_BACK';
    await saveDb(db);

    // Create a new log for the rollback action itself
    await dbMock.insertConfigChangeLog(
      config_key,
      log.new_value, // it's flipping
      previous_value,
      'SystemAdmin',
      environment,
      `Rollback of change #${changeId}`,
      0,
      'APPLIED'
    );

    return NextResponse.json({ message: 'Rollback successful' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process rollback' }, { status: 500 });
  }
}
