import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string, sub: string }> }) {
  try {
    const { slug, sub } = await params;
    const isId = !isNaN(Number(slug));

    if (isId) {
      const channelId = parseInt(slug);
      
      if (sub === 'touches') {
        const touches = await dbMock.all('channel_touches');
        return NextResponse.json({ data: touches.filter((t: any) => t.channel_id === channelId) });
      } else if (sub === 'breakouts') {
        const breakouts = await dbMock.all('channel_breakouts');
        return NextResponse.json({ data: breakouts.filter((b: any) => b.channel_id === channelId) });
      } else if (sub === 'retests') {
        const retests = await dbMock.all('channel_retests');
        return NextResponse.json({ data: retests.filter((r: any) => r.channel_id === channelId) });
      }
      
      return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
    } else {
      const symbols = await dbMock.all('symbol_masters');
      const symbolObj = symbols.find((s: any) => s.symbol_code === slug);
      if (!symbolObj) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });

      const channels = await dbMock.all('channels');
      let filtered = channels.filter((c: any) => c.symbol_id === symbolObj.id);

      if (sub === 'active') {
        filtered = filtered.filter((c: any) => c.status === 'ACTIVE');
      } else if (sub === 'nested') {
        filtered = filtered.filter((c: any) => c.parent_channel_id !== null);
      } else {
        // Assume timeframe
        filtered = filtered.filter((c: any) => c.timeframe === sub);
      }

      return NextResponse.json({ data: filtered });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
