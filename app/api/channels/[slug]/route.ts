import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const isId = !isNaN(Number(slug));

    if (isId) {
      const channelId = parseInt(slug);
      const channels = await dbMock.all('channels');
      const channel = channels.find((c: any) => c.id === channelId);
      if (!channel) return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
      return NextResponse.json({ data: channel });
    } else {
      const symbols = await dbMock.all('symbol_masters');
      const symbolObj = symbols.find((s: any) => s.symbol_code === slug);
      if (!symbolObj) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });
  
      const channels = await dbMock.all('channels');
      const filtered = channels.filter((c: any) => c.symbol_id === symbolObj.id);
      
      return NextResponse.json({ data: filtered });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
