import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ message: 'Synthetic candle rebuild triggered', data: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to trigger synthetic candle rebuild' }, { status: 500 });
  }
}
