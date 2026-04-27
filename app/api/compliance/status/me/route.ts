import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET() {
  try {
    const activeDocs = await dbMock.all('compliance_documents').then(docs => docs.filter((d: any) => d.is_active === 1));
    const acceptances = await dbMock.all('compliance_acceptances');
    const myAcceptances = acceptances.filter((a: any) => a.user_id === "current-user-uuid-mock" && a.is_current === 1);

    const missingDocuments = activeDocs.filter(doc => !myAcceptances.find((a: any) => a.document_id === doc.id));

    let status = 'COMPLIANT';
    if (missingDocuments.length > 0) {
        if (missingDocuments.find(d => d.document_type === 'GENERAL_RISK_DISCLOSURE')) {
            status = 'MISSING_GENERAL_RISK_ACCEPTANCE';
        } else if (missingDocuments.find(d => d.document_type === 'AUTO_TRADING_CONSENT')) {
             status = 'MISSING_AUTO_TRADING_CONSENT'; // Note: Auto-trading consent might not gate everything
        } else if (missingDocuments.find(d => d.document_type === 'LIVE_EXECUTION_CONSENT')) {
             status = 'MISSING_LIVE_EXECUTION_CONSENT'; // Note: Live consent might not gate everything
        } else {
             status = 'REACCEPTANCE_REQUIRED';
        }
    }

    // if GENERAL_RISK_DISCLOSURE is missing, user is fully restricted.
    const isGeneralMissing = missingDocuments.find(d => d.document_type === 'GENERAL_RISK_DISCLOSURE');
    
    // For simplicity, we can return the active docs they are missing so the frontend can prompt them.
    return NextResponse.json({
        data: {
            status,
            missingDocuments,
            myAcceptances,
            restricted: !!isGeneralMissing
        }
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}
