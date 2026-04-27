import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const body = await request.json().catch(() => ({}));
    return NextResponse.json({ message: 'Channel detection triggered', symbol, data: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to trigger channel detection' }, { status: 500 });
  }
}
