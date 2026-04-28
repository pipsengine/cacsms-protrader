import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET() {
  try {
    // For demo: just return all acceptance records
    const acceptances = await dbMock.all('compliance_acceptances');
    // Could filter by date, user, etc.
    return NextResponse.json({ data: acceptances });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to export compliance report' }, { status: 500 });
  }
}
