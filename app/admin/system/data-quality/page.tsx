'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldAlert, CheckCircle2, AlertTriangle, 
  Settings, Activity, Target, Settings2, Box,
  Play, RefreshCw, Archive, ArrowRight, ShieldCheck, Database, Search
} from 'lucide-react';

export default function DataQualityPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [symbols, setSymbols] = useState<any[]>([]);
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [recoveryLogs, setRecoveryLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState('ALL');

  useEffect(() => {
    fetchData();
  }, [selectedSymbol]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const symData = await fetch('/api/symbols').then(res => res.json());
      if (symData.data) setSymbols(symData.data);
      
      const snapshotsData = await fetch('/api/data-quality/status').then(res => res.json());
      const eventsData = await fetch('/api/data-quality/events').then(res => res.json());
      const logsData = await fetch('/api/data-quality/recovery-logs').then(res => res.json());
      
      let filteredSnapshots = snapshotsData.data || [];
      let filteredEvents = eventsData.data || [];
      
      if (selectedSymbol !== 'ALL') {
         const sym = symData.data?.find((s: any) => s.symbol_code === selectedSymbol);
         if (sym) {
            filteredSnapshots = filteredSnapshots.filter((s: any) => s.symbol_id === sym.id);
            filteredEvents = filteredEvents.filter((e: any) => e.symbol_id === sym.id);
         }
      }

      setSnapshots(filteredSnapshots);
      setEvents(filteredEvents);
      setRecoveryLogs(logsData.data || []);
      
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleValidate = async () => {
    alert(`Triggering manual re-validation`);
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 70) return 'text-amber-400';
    return 'text-red-500';
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto pb-40">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
              Data Quality & Integrity
           </h1>
           <p className="text-slate-400 mt-2">Continuous data validation ensuring safe inputs for all execution engines.</p>
        </div>
        <div className="flex gap-3">
          <select 
             value={selectedSymbol}
             onChange={(e) => setSelectedSymbol(e.target.value)}
             className="px-4 py-2 bg-[#1A1A1A] border border-slate-700 text-slate-300 rounded-lg outline-none"
          >
             <option value="ALL">All Symbols</option>
             {symbols.map(s => <option key={s.id} value={s.symbol_code}>{s.symbol_code}</option>)}
          </select>
          <button 
             onClick={handleValidate}
             className="px-4 py-2 bg-[#1A1A1A] border border-slate-700 hover:border-slate-500 text-slate-300 rounded-lg flex items-center gap-2 transition-colors"
          >
             <RefreshCw className="w-4 h-4" /> Re-Validate
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-800 mb-6 gap-6">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <div className="flex items-center gap-2"><Activity className="w-4 h-4" /> Health Overview</div>
        </button>
        <button 
          onClick={() => setActiveTab('events')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'events' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Quality Events <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px] ml-1">{events.length}</span></div>
        </button>
        <button 
          onClick={() => setActiveTab('recovery')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'recovery' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <div className="flex items-center gap-2"><Settings2 className="w-4 h-4" /> Recovery Logs</div>
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
           <div className="h-40 bg-[#141414] rounded-xl border border-slate-800" />
        </div>
      ) : activeTab === 'overview' ? (
         <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
               {snapshots.map(snap => (
                  <div key={snap.id} className="bg-[#141414] border border-slate-800 rounded-xl p-6">
                     <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                        <div>
                           <h3 className="text-xl font-bold text-slate-200">Symbol ID: {snap.symbol_id} <span className="text-sm font-medium text-slate-500 ml-2">TF: {snap.timeframe}</span></h3>
                        </div>
                        <div className="flex gap-2">
                           <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${snap.health_status === 'EXCELLENT' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : snap.health_status === 'WARNING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>{snap.health_status}</span>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-6 mb-6">
                        <div className="flex-1">
                           <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Health Score</div>
                           <div className={`text-4xl font-mono font-bold ${getHealthColor(snap.health_score)}`}>{snap.health_score}</div>
                        </div>
                        <div className="flex-1 bg-[#0A0A0A] p-3 rounded-lg border border-slate-800/50">
                           <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Execution Permission</div>
                           <div className={`text-sm font-bold truncate ${snap.trading_permission.includes('BLOCK') ? 'text-red-500' : snap.trading_permission.includes('WARN') ? 'text-amber-500' : 'text-emerald-400'}`}>
                              {snap.trading_permission.replace('DATA_PERMISSION_', '')}
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between p-2 bg-[#1A1A1A] rounded">
                           <span className="text-slate-400">Ticks</span>
                           <span className={snap.tick_freshness_status === 'EXCELLENT' ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>{snap.tick_freshness_status}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-[#1A1A1A] rounded">
                           <span className="text-slate-400">Completeness</span>
                           <span className={snap.candle_completeness_status === 'EXCELLENT' ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>{snap.candle_completeness_status}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-[#1A1A1A] rounded">
                           <span className="text-slate-400">OHLC Val</span>
                           <span className={snap.ohlc_validity_status === 'EXCELLENT' ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>{snap.ohlc_validity_status}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-[#1A1A1A] rounded">
                           <span className="text-slate-400">Time Align</span>
                           <span className={snap.timestamp_alignment_status === 'EXCELLENT' ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>{snap.timestamp_alignment_status}</span>
                        </div>
                     </div>
                  </div>
               ))}
               {snapshots.length === 0 && <div className="p-8 text-center bg-[#141414] border border-slate-800 rounded-xl text-slate-500 col-span-2">No health snapshots found.</div>}
            </div>
         </div>
      ) : activeTab === 'events' ? (
         <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden mt-6">
            <div className="bg-[#1A1A1A] p-4 border-b border-slate-800">
               <h3 className="text-sm font-bold text-slate-200">Data Quality Infractions & Events</h3>
            </div>
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-[#0A0A0A] border-b border-slate-800/50 text-xs text-slate-500 uppercase tracking-wider">
                     <th className="p-4 font-bold">Event Log</th>
                     <th className="p-4 font-bold">Affected Range</th>
                     <th className="p-4 font-bold">Missing/Impact</th>
                     <th className="p-4 font-bold">State</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800/50 text-sm">
                  {events.map(evt => (
                     <tr key={evt.id} className="hover:bg-[#1A1A1A]/30 transition-colors">
                        <td className="p-4">
                           <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${evt.severity === 'HIGH' || evt.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>{evt.severity}</span>
                              <span className="text-slate-300 font-bold">{evt.event_type}</span>
                           </div>
                           <div className="text-xs text-slate-500">Sym: {evt.symbol_id} | TF: {evt.timeframe}</div>
                        </td>
                        <td className="p-4 text-slate-400 text-xs font-mono">
                           <div>{new Date(evt.affected_start_time).toLocaleString()}</div>
                           <div>to {new Date(evt.affected_end_time).toLocaleString()}</div>
                        </td>
                        <td className="p-4 text-xs">
                           <div className="text-slate-300 mb-1">{evt.description}</div>
                           <div className="text-red-400 font-bold">Blocks: {evt.trading_permission_impact.replace('DATA_PERMISSION_', '')}</div>
                        </td>
                        <td className="p-4">
                           <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block ${evt.resolution_status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-500'}`}>
                             {evt.resolution_status}
                           </span>
                           {evt.resolution_status !== 'RESOLVED' && (
                              <button className="block mt-2 text-[10px] border border-slate-700 bg-[#0A0A0A] hover:bg-slate-800 px-2 py-1 rounded text-slate-300">Attempt Recovery</button>
                           )}
                        </td>
                     </tr>
                  ))}
                  {events.length === 0 && (
                     <tr><td colSpan={4} className="p-8 text-center text-slate-500">No unresolved data quality events.</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      ) : (
         <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden mt-6">
            <div className="bg-[#1A1A1A] p-4 border-b border-slate-800">
               <h3 className="text-sm font-bold text-slate-200">Automated Data Recovery Logs</h3>
            </div>
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-[#0A0A0A] border-b border-slate-800/50 text-xs text-slate-500 uppercase tracking-wider">
                     <th className="p-4 font-bold">Recovery Job</th>
                     <th className="p-4 font-bold">Records</th>
                     <th className="p-4 font-bold">Notes</th>
                     <th className="p-4 font-bold">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800/50 text-sm">
                  {recoveryLogs.map(log => (
                     <tr key={log.id} className="hover:bg-[#1A1A1A]/30 transition-colors">
                        <td className="p-4 text-xs font-mono">
                           <div className="text-indigo-400 font-bold mb-1">{log.recovery_type}</div>
                           <div className="text-slate-500">Source: {log.source_used}</div>
                        </td>
                        <td className="p-4 text-slate-300 text-xs text-center">
                           <div>{log.records_requested} req</div>
                           <div className="text-emerald-400">{log.records_recovered} recovered</div>
                           {log.records_failed > 0 && <div className="text-red-500">{log.records_failed} failed</div>}
                        </td>
                        <td className="p-4 text-slate-400 text-xs">{log.notes}</td>
                        <td className="p-4">
                           <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block ${log.recovery_status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-500'}`}>
                             {log.recovery_status}
                           </span>
                        </td>
                     </tr>
                  ))}
                  {recoveryLogs.length === 0 && (
                     <tr><td colSpan={4} className="p-8 text-center text-slate-500">No recovery operations recorded.</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      )}
    </div>
  );
}
