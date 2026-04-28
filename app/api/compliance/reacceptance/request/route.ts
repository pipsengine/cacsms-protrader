import { NextResponse } from 'next/server';
import { openDb, saveDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await openDb();
    const newRequest = {
      id: Date.now(),
      document_id: body.document_id,
      document_version: body.document_version,
      target_user_id: body.target_user_id,
      target_role_id: body.target_role_id || null,
      required_reason: body.required_reason || '',
      status: 'PENDING',
      requested_by: body.requested_by || 'SystemAdmin',
      requested_at: new Date().toISOString(),
      completed_at: null
    };
    db.compliance_reacceptance_requests.push(newRequest);
    await saveDb(db);
    return NextResponse.json({ data: newRequest });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create reacceptance request' }, { status: 500 });
  }
}
