import { NextResponse } from 'next/server';
import { openDb, saveDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { document_ids, ip_address, device_info, payload } = await request.json();
    const db = await openDb();
    const userId = "current-user-uuid-mock"; 
    
    for (const docId of document_ids) {
       const doc = db.compliance_documents.find(d => d.id === Number(docId));
       if (doc) {
           // Deactivate any old current for this type
           db.compliance_acceptances.forEach(a => {
              if (a.user_id === userId && a.document_type === doc.document_type) {
                 a.is_current = 0;
              }
           });

           db.compliance_acceptances.push({
              id: Date.now() + Math.random(),
              user_id: userId,
              document_id: doc.id,
              document_type: doc.document_type,
              document_version: doc.version,
              accepted_at: new Date().toISOString(),
              ip_address: ip_address || '127.0.0.1',
              device_info: device_info || 'Unknown Device',
              acceptance_method: 'CHECKBOX',
              acknowledgement_payload_json: JSON.stringify(payload || {}),
              is_current: 1,
              created_at: new Date().toISOString()
           });
       }
    }
    
    await saveDb(db);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record acceptance' }, { status: 500 });
  }
}
