import { NextResponse } from 'next/server';
import { openDb, saveDb } from '@/lib/db';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = await openDb();
    
    const docIndex = db.compliance_documents.findIndex(d => d.id === Number(id));
    if (docIndex === -1) return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    const doc = db.compliance_documents[docIndex];

    if (doc.approval_status !== 'APPROVED') {
       return NextResponse.json({ error: 'Cannot activate an unapproved document' }, { status: 400 });
    }

    // Deactivate older documents of the same type
    db.compliance_documents.forEach(d => {
       if (d.document_type === doc.document_type && d.id !== doc.id && d.is_active === 1) {
          d.is_active = 0;
          d.updated_at = new Date().toISOString();
       }
    });

    db.compliance_documents[docIndex].is_active = 1;
    db.compliance_documents[docIndex].effective_at = new Date().toISOString();
    db.compliance_documents[docIndex].requires_reacceptance = body.requires_reacceptance ? 1 : 0;
    db.compliance_documents[docIndex].updated_at = new Date().toISOString();

    // If requires_reacceptance, we would theoretically insert a reacceptance request here.
    if (body.requires_reacceptance) {
       db.compliance_reacceptance_requests.push({
         id: Date.now(),
         document_id: doc.id,
         document_version: doc.version,
         target_user_id: null,
         target_role_id: null,
         required_reason: 'Version Update',
         status: 'PENDING',
         requested_by: 'SuperAdmin',
         requested_at: new Date().toISOString(),
         completed_at: null
       });
    }
    
    await saveDb(db);
    return NextResponse.json({ data: db.compliance_documents[docIndex] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to activate document' }, { status: 500 });
  }
}
