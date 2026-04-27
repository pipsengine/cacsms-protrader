'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldAlert, CheckCircle2, AlertTriangle, 
  Settings, Activity, Target, Settings2, Box,
  Play, RefreshCw, Archive, ArrowRight, Waypoints, Droplet, Crosshair, Map as MapIcon, Zap, Square, Check, BarChart2
} from 'lucide-react';

export default function ChannelStrategyPage() {
  const [symbols, setSymbols] = useState<any[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const [activeSetups, setActiveSetups] = useState<any[]>([]);
  const [historySetups, setHistorySetups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedSymbol]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const symData = await fetch('/api/symbols').then(res => res.json());
      if (symData.data) setSymbols(symData.data);
      
      const activeRes = await fetch(`/api/channel-strategy/setups/active?symbol=${selectedSymbol}`).then(res => res.json());
      setActiveSetups(activeRes.data || []);

      const historyRes = await fetch(`/api/channel-strategy/history`).then(res => res.json());
      const symbolObj = (symData.data || []).find((s:any) => s.symbol_code === selectedSymbol);
      if (symbolObj) {
         setHistorySetups((historyRes.data || []).filter((s: any) => s.symbol_id === symbolObj.id));
      } else {
         setHistorySetups(historyRes.data || []);
      }
      
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleScan = async () => {
    alert(`Triggering channel setup scan for ${selectedSymbol}`);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto pb-40">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
              <BarChart2 className="w-8 h-8 text-sky-500" />
              Channel Strategy Engine
           </h1>
           <p className="text-slate-400 mt-2">Trend-in-Trend Trade Setup Generation</p>
        </div>
        <div className="flex gap-3">
          <select 
             value={selectedSymbol}
             onChange={(e) => setSelectedSymbol(e.target.value)}
             className="px-4 py-2 bg-[#1A1A1A] border border-slate-700 text-slate-300 rounded-lg outline-none"
          >
             {symbols.map(s => <option key={s.id} value={s.symbol_code}>{s.symbol_code}</option>)}
          </select>
          <button 
             onClick={handleScan}
             className="px-4 py-2 bg-[#1A1A1A] border border-slate-700 hover:border-slate-500 text-slate-300 rounded-lg flex items-center gap-2 transition-colors"
          >
             <RefreshCw className="w-4 h-4" /> Scan for Setups
          </button>
        </div>
      </div>

      {loading ? (
         <div className="grid grid-cols-1 gap-6">
           <div className="h-64 bg-[#141414] rounded-xl border border-slate-800 animate-pulse" />
         </div>
      ) : (
         <div className="space-y-6">
            
            {/* Active Setups Table */}
            <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden">
               <div className="bg-[#1A1A1A] p-4 border-b border-slate-800 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-sky-400" />
                  <h3 className="text-sm font-bold text-slate-200">Active Channel Setups</h3>
               </div>
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-[#0A0A0A] border-b border-slate-800/50 text-xs text-slate-500 uppercase tracking-wider">
                        <th className="p-4 font-bold">Identity & Scope</th>
                        <th className="p-4 font-bold">Scoring & Status</th>
                        <th className="p-4 font-bold">Execution Plan</th>
                        <th className="p-4 font-bold">Logic Explanation</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-sm">
                     {activeSetups.map(setup => (
                        <tr key={setup.id} className="hover:bg-[#1A1A1A]/30 transition-colors">
                           <td className="p-4">
                              <div className="flex gap-2 items-center mb-1">
                                 <div className="font-bold text-slate-300">{setup.timeframe}</div>
                                 <div className={`text-[10px] px-2 py-0.5 rounded font-bold ${setup.direction === 'BULLISH' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'}`}>{setup.setup_type}</div>
                              </div>
                              <div className="text-xs text-slate-500 mt-2">
                                 Channel ID: {setup.channel_id} {setup.parent_channel_id ? `(Parent: ${setup.parent_channel_id})` : ''}
                              </div>
                           </td>
                           <td className="p-4">
                              <div className="flex items-center gap-2 mb-1">
                                 <span className="text-[10px] text-slate-400">Channel SQ:</span>
                                 <span className="text-sm font-bold text-sky-400">{setup.channel_strength_score}%</span>
                              </div>
                              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                                 {setup.status}
                              </div>
                              {setup.setup_stage && (
                                <div className="text-[9px] text-amber-500/80 bg-amber-500/10 px-1 py-0.5 inline-block rounded">
                                   Stage: {setup.setup_stage}
                                </div>
                              )}
                           </td>
                           <td className="p-4 font-mono text-xs opacity-90 leading-snug">
                              <div className="text-slate-200 mb-0.5"><span className="text-slate-500">Entry:</span> {setup.proposed_entry_price || `${setup.entry_zone_low} - ${setup.entry_zone_high}`}</div>
                              <div className="text-rose-400 mb-0.5"><span className="text-slate-500">Stop:</span> {setup.proposed_stop_loss}</div>
                              <div className="text-emerald-400 mb-1"><span className="text-slate-500">TP:</span> {JSON.parse(setup.take_profit_targets_json || '[]').join(', ')}</div>
                              <div className="text-fuchsia-400 font-bold bg-fuchsia-500/10 px-1 py-0.5 rounded inline-block">R:R 1:{setup.risk_reward_ratio}</div>
                           </td>
                           <td className="p-4">
                              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                                 {setup.explanation}
                              </p>
                           </td>
                        </tr>
                     ))}
                     {activeSetups.length === 0 && (
                        <tr><td colSpan={4} className="p-8 text-center text-slate-500">No active channel setups detected for this symbol.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>

            {/* History Table */}
            <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden mt-6">
               <div className="bg-[#1A1A1A] p-4 border-b border-slate-800 flex items-center gap-2">
                  <Archive className="w-5 h-5 text-slate-400" />
                  <h3 className="text-sm font-bold text-slate-200">Historical Channel Setups</h3>
               </div>
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-[#0A0A0A] border-b border-slate-800/50 text-xs text-slate-500 uppercase tracking-wider">
                        <th className="p-4 font-bold">Identity</th>
                        <th className="p-4 font-bold">Details</th>
                        <th className="p-4 font-bold">Final Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-sm">
                     {historySetups.map(setup => (
                        <tr key={setup.id} className="hover:bg-[#1A1A1A]/30 transition-colors">
                           <td className="p-4">
                              <div className="font-bold text-slate-300 mb-1">{setup.timeframe} {setup.setup_type}</div>
                              <div className="text-xs text-slate-500">{new Date(setup.created_at).toLocaleString()}</div>
                           </td>
                           <td className="p-4 font-mono text-xs text-slate-400">
                              Channel ID: {setup.channel_id}
                           </td>
                           <td className="p-4">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400`}>{setup.status}</span>
                           </td>
                        </tr>
                     ))}
                     {historySetups.length === 0 && (
                        <tr><td colSpan={3} className="p-8 text-center text-slate-500">No historical setups available.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>

         </div>
      )}
    </div>
  );
}
