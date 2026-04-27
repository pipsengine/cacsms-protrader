'use client';

import { useState, useEffect } from 'react';
import { 
  Database, Activity, Server, ArrowRightLeft, 
  AlertTriangle, CheckCircle2, RotateCcw, Box, Hash
} from 'lucide-react';

export default function MarketDataAdminPage() {
  const [activeTab, setActiveTab] = useState('snapshots');
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [symbols, setSymbols] = useState<any[]>([]);
  const [rebuildLogs, setRebuildLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rebuilding, setRebuilding] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [snapData, srcData, symData, logsData] = await Promise.all([
        fetch('/api/market-data/snapshots').then(res => res.json()),
        fetch('/api/market-data/sources').then(res => res.json()),
        fetch('/api/market-data/symbols').then(res => res.json()),
        fetch('/api/market-data/rebuild-logs').then(res => res.json())
      ]);
      if (snapData.data) setSnapshots(snapData.data);
      if (srcData.data) setSources(srcData.data);
      if (symData.data) setSymbols(symData.data);
      if (logsData.data) setRebuildLogs(logsData.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleRebuild = async (symbol_code: string) => {
    setRebuilding(prev => ({ ...prev, [symbol_code]: true }));
    try {
      await fetch('/api/market-data/rebuild-candles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol_code, timeframe: 'M1', reason: 'Admin Manual M1 Rebuild' })
      });
      await fetchData();
    } catch (e) {
      console.error(e);
    }
    setRebuilding(prev => ({ ...prev, [symbol_code]: false }));
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto pb-40">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <Database className="w-8 h-8 text-sky-500" />
            Market Data Warehouse
          </h1>
          <p className="text-slate-400 mt-2">Centralized, validated, and normalized market data foundation for strategy engines.</p>
        </div>
      </div>

      <div className="flex border-b border-slate-800 mb-6 gap-6">
        <button 
          onClick={() => setActiveTab('snapshots')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'snapshots' ? 'border-sky-500 text-sky-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <div className="flex items-center gap-2"><Activity className="w-4 h-4" /> Market Snapshots</div>
        </button>
        <button 
          onClick={() => setActiveTab('sources')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'sources' ? 'border-sky-500 text-sky-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <div className="flex items-center gap-2"><Server className="w-4 h-4" /> Data Sources</div>
        </button>
        <button 
          onClick={() => setActiveTab('rebuild-logs')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'rebuild-logs' ? 'border-sky-500 text-sky-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <div className="flex items-center gap-2"><Box className="w-4 h-4" /> Rebuild & Audit Logs</div>
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
           {[1,2,3].map(i => <div key={i} className="h-20 bg-[#141414] rounded-xl border border-slate-800" />)}
        </div>
      ) : activeTab === 'snapshots' ? (
        <div className="space-y-4">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {snapshots.map(snap => (
                 <div key={snap.id} className="bg-[#141414] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-slate-100">{snap.symbol_code}</h3>
                          <span className={`px-2 py-1 text-xs font-bold rounded flex items-center gap-1 ${
                             snap.data_health_status === 'DATA_VALID' ? 'bg-emerald-500/10 text-emerald-400' :
                             snap.data_health_status === 'DATA_WARNING' ? 'bg-amber-500/10 text-amber-500' :
                             'bg-red-500/10 text-red-500'
                          }`}>
                            {snap.data_health_status === 'DATA_VALID' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                            {snap.data_health_status.replace('_', ' ')}
                          </span>
                       </div>
                       <button
                         disabled={rebuilding[snap.symbol_code]}
                         onClick={() => handleRebuild(snap.symbol_code)}
                         className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-[#0A0A0A] border border-slate-700 hover:border-sky-500 hover:text-sky-400 rounded transition-colors flex items-center gap-2 disabled:opacity-50"
                       >
                         <RotateCcw className={`w-3 h-3 ${rebuilding[snap.symbol_code] ? 'animate-spin text-sky-500' : ''}`} />
                         {rebuilding[snap.symbol_code] ? 'Rebuilding...' : 'Rebuild Candles'}
                       </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4 bg-[#0A0A0A] p-4 rounded-lg border border-slate-800">
                       <div>
                          <div className="text-xs text-slate-500 mb-1">Bid</div>
                          <div className="text-sm text-slate-300 font-mono">{snap.bid.toFixed(5)}</div>
                       </div>
                       <div>
                          <div className="text-xs text-slate-500 mb-1">Ask</div>
                          <div className="text-sm text-slate-300 font-mono">{snap.ask.toFixed(5)}</div>
                       </div>
                       <div>
                          <div className="text-xs text-slate-500 mb-1">Spread</div>
                          <div className={`text-sm font-mono ${snap.spread > 10 ? 'text-amber-500' : 'text-slate-300'}`}>{snap.spread} pts</div>
                       </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 mt-auto">
                       <div>Session: <span className="text-sky-400">{snap.current_session}</span></div>
                       <div>Last Tick: {new Date(snap.latest_tick_time).toLocaleTimeString()}</div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      ) : activeTab === 'sources' ? (
        <div className="space-y-4">
           {sources.map(src => (
              <div key={src.id} className="bg-[#141414] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                 <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                       <Server className={`w-5 h-5 ${src.is_active ? 'text-sky-500' : 'text-slate-600'}`} />
                       <div>
                         <h3 className="text-lg font-bold text-slate-200">{src.source_name}</h3>
                         <div className="text-xs text-slate-500 font-mono mt-0.5">{src.source_type} &bull; {src.provider_name}</div>
                       </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-bold rounded uppercase tracking-wider ${
                       src.connection_status === 'CONNECTED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {src.connection_status}
                    </span>
                 </div>
                 <div className="bg-[#0A0A0A] p-4 rounded-lg flex items-center justify-between border border-slate-800/50">
                    <div>
                       <div className="text-xs text-slate-500 mb-1">Reliability Score</div>
                       <div className="text-lg text-slate-200 font-mono">{src.reliability_score}%</div>
                    </div>
                    <div>
                       <div className="text-xs text-slate-500 mb-1">Supported Assets</div>
                       <div className="text-sm text-slate-400 font-mono">{JSON.parse(src.supported_symbols_json || '[]').length} symbols</div>
                    </div>
                    <div className="text-right">
                       <div className="text-xs text-slate-500 mb-1">Last Sync Sync</div>
                       <div className="text-sm text-slate-400 font-mono">{new Date(src.last_sync_at).toLocaleString()}</div>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      ) : (
         <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1A1A1A] border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                <th className="p-4 font-medium">Asset</th>
                <th className="p-4 font-medium">Timeframe</th>
                <th className="p-4 font-medium">Reason</th>
                <th className="p-4 font-medium">Records</th>
                <th className="p-4 font-medium">Status / Triggered By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {rebuildLogs.map(log => (
                <tr key={log.id} className="hover:bg-[#1A1A1A]/50 transition-colors">
                  <td className="p-4">
                    <span className="font-mono text-sm text-slate-300 font-bold">{log.symbol_code}</span>
                    <div className="text-xs text-slate-500 mt-0.5">{new Date(log.created_at).toLocaleTimeString()}</div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-sm text-sky-400">{log.timeframe}</span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-slate-300 max-w-xs truncate" title={log.rebuild_reason}>{log.rebuild_reason}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{log.source_used}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-slate-300">{log.records_rebuilt} rebuilt</span>
                    {log.records_failed > 0 && <span className="text-xs text-red-400 block mt-0.5">{log.records_failed} failed</span>}
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block mb-1 ${log.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-500'}`}>
                      {log.status}
                    </span>
                    <div className="text-xs text-slate-500">{log.triggered_by}</div>
                  </td>
                </tr>
              ))}
              {rebuildLogs.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No rebuild history found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
