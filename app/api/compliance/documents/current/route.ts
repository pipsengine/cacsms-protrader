import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET() {
  try {
    const docs = await dbMock.all('compliance_documents');
    const activeDocs = docs.filter((d: any) => d.is_active === 1);
    return NextResponse.json({ data: activeDocs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch active compliance documents' }, { status: 500 });
  }
}
