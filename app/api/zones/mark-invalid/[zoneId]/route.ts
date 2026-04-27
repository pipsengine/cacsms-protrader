import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: Promise<{ zoneId: string }> }) {
  try {
    const { zoneId } = await params;
    return NextResponse.json({ message: `Zone ${zoneId} marked as invalid` });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to mark zone invalid' }, { status: 500 });
  }
}
