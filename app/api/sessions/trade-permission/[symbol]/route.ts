import { NextResponse } from 'next/server';
import { dbMock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const symbols = await dbMock.all('symbol_masters');
    const symbolObj = symbols.find((s: any) => s.symbol_code === symbol);
    if (!symbolObj) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });

    const sessions = await dbMock.all('market_sessions');
    const filtered = sessions.filter((s: any) => s.symbol_id === symbolObj.id);
    const latest = filtered.sort((a: any, b: any) => new Date(b.end_time_utc).getTime() - new Date(a.end_time_utc).getTime())[0];
    
    if (!latest) return NextResponse.json({ data: { permission: 'SESSION_UNCLEAR', message: 'No current session found' } });
    
    let permission = 'SESSION_TRADE_ALLOWED';
    let message = 'Conditions are favorable for execution.';
    
    if (latest.session_score < 70) {
       permission = 'SESSION_WAIT_FOR_CONFIRMATION';
       message = 'Session quality is reduced. Await stronger confirmation.';
    }
    if (latest.session_score < 50) {
       permission = 'SESSION_TRADE_RESTRICTED';
       message = 'Session quality is unsafe or volatile. Trades restricted.';
    }
    
    return NextResponse.json({ 
       data: { 
          permission, 
          message,
          session_score: latest.session_score,
          behavior_type: latest.behavior_type
       } 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trade permission' }, { status: 500 });
  }
}
