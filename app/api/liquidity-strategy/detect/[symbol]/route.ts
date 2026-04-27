import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    return NextResponse.json({ message: 'Liquidity setup detection triggered', symbol });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to trigger detection' }, { status: 500 });
  }
}
