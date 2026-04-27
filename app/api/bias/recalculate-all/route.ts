import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ message: 'All bias recalculation triggered', data: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to trigger bias recalculation' }, { status: 500 });
  }
}
