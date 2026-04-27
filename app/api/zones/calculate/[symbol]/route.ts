import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const body = await request.json();
    return NextResponse.json({ message: 'Zone calculation triggered', symbol, data: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to trigger zone calculation' }, { status: 500 });
  }
}
