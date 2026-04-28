import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params;
    const activeDocs = await dbMock.all('compliance_documents').then(docs => docs.filter((d: any) => d.is_active === 1));
    const acceptances = await dbMock.all('compliance_acceptances');
    const userAcceptances = acceptances.filter((a: any) => a.user_id === userId && a.is_current === 1);

    const missingDocuments = activeDocs.filter(doc => !userAcceptances.find((a: any) => a.document_id === doc.id));

    let status = 'COMPLIANT';
    if (missingDocuments.length > 0) {
        if (missingDocuments.find(d => d.document_type === 'GENERAL_RISK_DISCLOSURE')) {
            status = 'MISSING_GENERAL_RISK_ACCEPTANCE';
        } else if (missingDocuments.find(d => d.document_type === 'AUTO_TRADING_CONSENT')) {
             status = 'MISSING_AUTO_TRADING_CONSENT';
        } else if (missingDocuments.find(d => d.document_type === 'LIVE_EXECUTION_CONSENT')) {
             status = 'MISSING_LIVE_EXECUTION_CONSENT';
        } else {
             status = 'REACCEPTANCE_REQUIRED';
        }
    }

    const isGeneralMissing = missingDocuments.find(d => d.document_type === 'GENERAL_RISK_DISCLOSURE');
    return NextResponse.json({
        data: {
            status,
            missingDocuments,
            userAcceptances,
            restricted: !!isGeneralMissing
        }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}
