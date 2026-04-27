import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const setupId = parseInt(id);
    const setups = await dbMock.all('channel_strategy_setups');
    const setup = setups.find((s: any) => s.id === setupId);
    if (!setup) return NextResponse.json({ error: 'Setup not found' }, { status: 404 });
    return NextResponse.json({ data: setup });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
