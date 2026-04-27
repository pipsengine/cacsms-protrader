import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ message: 'Session intelligence recalulation triggered', data: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to trigger recalculation' }, { status: 500 });
  }
}
