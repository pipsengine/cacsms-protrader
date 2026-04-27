import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const { eventId } = await params;
    const body = await request.json();
    return NextResponse.json({ message: 'Recovery triggered', eventId, data: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to trigger recovery' }, { status: 500 });
  }
}
