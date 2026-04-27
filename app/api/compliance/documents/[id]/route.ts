import { NextResponse } from 'next/server';
import { dbMock, openDb, saveDb } from '@/lib/db';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = await openDb();
    
    const docIndex = db.compliance_documents.findIndex(d => d.id === Number(id));
    if (docIndex === -1) return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    
    const doc = db.compliance_documents[docIndex];
    if (doc.approval_status === 'APPROVED' || doc.is_active === 1) {
       return NextResponse.json({ error: 'Cannot edit approved or active document. Create a new version.' }, { status: 400 });
    }

    db.compliance_documents[docIndex] = {
      ...doc,
      ...body,
      updated_at: new Date().toISOString()
    };
    
    await saveDb(db);
    return NextResponse.json({ data: db.compliance_documents[docIndex] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update compliance document' }, { status: 500 });
  }
}
