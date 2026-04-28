import { NextResponse } from 'next/server';
import { dbMock, openDb, saveDb } from '@/lib/db';

export async function GET() {
  try {
    const docs = await dbMock.all('compliance_documents');
    return NextResponse.json({ data: docs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch compliance documents' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await openDb();
    const newDoc = {
      id: Date.now(),
      document_type: body.document_type,
      title: body.title,
      version: body.version,
      content: body.content,
      summary: body.summary,
      is_active: 0,
      requires_reacceptance: 0,
      approval_status: 'DRAFT',
      created_by: 'SystemAdmin',
      approved_by: null,
      effective_at: null,
      expires_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.compliance_documents.push(newDoc as any);
    db.audit_logs.push({
      id: Date.now() + Math.random(),
      action: 'COMPLIANCE_DOCUMENT_CREATED',
      resource: 'compliance_documents',
      resource_id: String(newDoc.id),
      details: JSON.stringify(newDoc),
      user: 'SystemAdmin',
      created_at: new Date().toISOString()
    });
    await saveDb(db);
    return NextResponse.json({ data: newDoc });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create compliance document' }, { status: 500 });
  }
}
