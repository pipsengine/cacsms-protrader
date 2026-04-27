import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const symbols = await dbMock.all('symbol_masters');
    const symbolObj = symbols.find((s: any) => s.symbol_code === symbol);
    if (!symbolObj) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });

    const healthSnaps = await dbMock.all('data_health_snapshots');
    const filteredHealth = healthSnaps.filter((h: any) => h.symbol_id === symbolObj.id);
    const latestHealth = filteredHealth.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    
    if (latestHealth && latestHealth.health_score < 50) {
      return NextResponse.json({ data: { permission: 'STRUCTURE_BLOCKED_DATA_UNSAFE', message: 'Data quality is unsafe, structure generation blocked.' } });
    }

    const states = await dbMock.all('structure_states');
    const filteredStates = states.filter((s: any) => s.symbol_id === symbolObj.id);
    const latestState = filteredStates.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];

    if (!latestState) {
      return NextResponse.json({ data: { permission: 'NO_TRADE_UNCLEAR_STRUCTURE', message: 'No structure state computed.' } });
    }

    return NextResponse.json({ data: { permission: latestState.trade_permission, message: latestState.explanation } });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch structure permission' }, { status: 500 });
  }
}
