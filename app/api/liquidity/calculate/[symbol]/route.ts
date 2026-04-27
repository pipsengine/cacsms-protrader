import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const body = await request.json();
    return NextResponse.json({ message: 'Liquidity calculation triggered', symbol, data: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to trigger liquidity calculation' }, { status: 500 });
  }
}
