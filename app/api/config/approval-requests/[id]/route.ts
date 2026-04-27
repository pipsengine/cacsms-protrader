import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { action, comment } = await request.json(); // action: APPROVE or REJECT
    
    const requests = await dbMock.all('configuration_approval_requests');
    const targetReq = requests.find((r: any) => r.id === Number(id));

    if (!targetReq) return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    if (targetReq.approval_status !== 'PENDING_APPROVAL') return NextResponse.json({ error: 'Request is not pending' }, { status: 400 });

    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    await dbMock.updateApprovalRequest(Number(id), newStatus, 'SuperAdmin', comment || '');

    // If approved, apply the actual change
    if (newStatus === 'APPROVED') {
       // Need to check if it's a feature flag or a runtime config
       const isFlag = !!(await dbMock.getFlag(targetReq.config_key));
       
       if (isFlag) {
          const parsed = JSON.parse(targetReq.requested_value);
          await dbMock.updateFlag(targetReq.config_key, parsed.is_enabled, parsed.current_value);
       } else {
          await dbMock.updateConfig(targetReq.config_key, targetReq.requested_value);
       }

       // Update the change log representing this request as well
       const logs = await dbMock.all('configuration_change_logs');
       const pendingLog = logs.find((l: any) => l.config_key === targetReq.config_key && l.approval_status === 'PENDING_APPROVAL');
       if (pendingLog) {
         // Modify it directly (mocking)
         const db = await import('@/lib/db').then(m => m.openDb());
         const idx = db.configuration_change_logs.findIndex(l => l.id === pendingLog.id);
         if (idx > -1) {
           db.configuration_change_logs[idx].approval_status = 'APPLIED';
           await import('@/lib/db').then(m => m.saveDb(db));
         }
       }
    } else {
       // If rejected, update the change log to REJECTED
       const logs = await dbMock.all('configuration_change_logs');
       const pendingLog = logs.find((l: any) => l.config_key === targetReq.config_key && l.approval_status === 'PENDING_APPROVAL');
       if (pendingLog) {
         const db = await import('@/lib/db').then(m => m.openDb());
         const idx = db.configuration_change_logs.findIndex(l => l.id === pendingLog.id);
         if (idx > -1) {
           db.configuration_change_logs[idx].approval_status = 'REJECTED';
           await import('@/lib/db').then(m => m.saveDb(db));
         }
       }
    }

    return NextResponse.json({ message: `Request ${action}D successfully` });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
