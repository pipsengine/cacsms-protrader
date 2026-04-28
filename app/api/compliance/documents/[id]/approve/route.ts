import { NextResponse } from 'next/server';
import { openDb, saveDb } from '@/lib/db';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await openDb();
    
    const docIndex = db.compliance_documents.findIndex(d => d.id === Number(id));
    if (docIndex === -1) return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    
    db.compliance_documents[docIndex].approval_status = 'APPROVED';
    db.compliance_documents[docIndex].approved_by = 'SuperAdmin';
    db.compliance_documents[docIndex].updated_at = new Date().toISOString();
    db.audit_logs.push({
      id: Date.now() + Math.random(),
      action: 'COMPLIANCE_DOCUMENT_APPROVED',
      resource: 'compliance_documents',
      resource_id: String(db.compliance_documents[docIndex].id),
      details: JSON.stringify(db.compliance_documents[docIndex]),
      user: 'SuperAdmin',
      created_at: new Date().toISOString()
    });
    await saveDb(db);
    return NextResponse.json({ data: db.compliance_documents[docIndex] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to approve document' }, { status: 500 });
  }
}
