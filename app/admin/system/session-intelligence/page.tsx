'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart2, ShieldAlert, CheckCircle2, AlertTriangle, 
  Settings, Clock, Activity, Target, Settings2, Box,
  Play, RefreshCw, Archive, PlusSquare, ArrowRight, BookOpen, Clock3
} from 'lucide-react';

export default function SessionIntelligencePage() {
  const [activeTab, setActiveTab] = useState('current');
  const [symbols, setSymbols] = useState<any[]>([]);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [tradePermission, setTradePermission] = useState<any>(null);
  const [liquidityLevels, setLiquidityLevels] = useState<any[]>([]);
  const [relationships, setRelationships] = useState<any[]>([]);
  const [behaviorEvents, setBehaviorEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');

  useEffect(() => {
    fetchData(selectedSymbol);
  }, [selectedSymbol]);

  const fetchData = async (symbol: string) => {
    setLoading(true);
    try {
      const symData = await fetch('/api/symbols').then(res => res.json());
      if (symData.data) setSymbols(symData.data);
      
      const [sessionRes, permissionRes, levelsRes, relsRes, eventsRes] = await Promise.all([
        fetch(`/api/sessions/current/${symbol}`).then(res => res.json()),
        fetch(`/api/sessions/trade-permission/${symbol}`).then(res => res.json()),
        fetch(`/api/sessions/liquidity/${symbol}`).then(res => res.json()),
        fetch(`/api/sessions/relationships/${symbol}`).then(res => res.json()),
        fetch(`/api/sessions/behavior/${symbol}`).then(res => res.json())
      ]);

      if (sessionRes.data) setCurrentSession(sessionRes.data);
      if (permissionRes.data) setTradePermission(permissionRes.data);
      if (levelsRes.data) setLiquidityLevels(levelsRes.data);
      if (relsRes.data) setRelationships(relsRes.data);
      if (eventsRes.data) setBehaviorEvents(eventsRes.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleRecalculate = async () => {
    alert(`Triggering session recalculation for ${selectedSymbol}`);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto pb-40">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
              <Clock3 className="w-8 h-8 text-amber-500" />
              Session Intelligence & Market Timing
           </h1>
           <p className="text-slate-400 mt-2">Analyzes market timing, liquidity sweeps, constraints, and institutional behavior per session.</p>
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
             onClick={handleRecalculate}
             className="px-4 py-2 bg-[#1A1A1A] border border-slate-700 hover:border-slate-500 text-slate-300 rounded-lg flex items-center gap-2 transition-colors"
          >
             <RefreshCw className="w-4 h-4" /> Recalculate Timing
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-800 mb-6 gap-6">
        <button 
          onClick={() => setActiveTab('current')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'current' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <div className="flex items-center gap-2"><Clock3 className="w-4 h-4" /> Live Session Details</div>
        </button>
        <button 
          onClick={() => setActiveTab('liquidity')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'liquidity' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <div className="flex items-center gap-2"><Activity className="w-4 h-4" /> Session Liquidity</div>
        </button>
        <button 
          onClick={() => setActiveTab('behavior')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'behavior' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <div className="flex items-center gap-2"><Settings2 className="w-4 h-4" /> Events & Behavior</div>
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
           <div className="h-40 bg-[#141414] rounded-xl border border-slate-800" />
        </div>
      ) : activeTab === 'current' ? (
         currentSession ? (
            <div className="space-y-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Current Session Overview */}
                  <div className="bg-[#141414] border border-slate-800 rounded-xl p-6">
                     <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                        <h3 className="text-xl font-bold text-slate-200">Current active: <span className="text-amber-400">{currentSession.session_name} Session</span></h3>
                        <div className="flex gap-2">
                           <span className="text-xs uppercase font-bold px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">{currentSession.direction}</span>
                           <span className="text-xs uppercase font-bold px-2 py-1 bg-slate-800 text-slate-400 rounded-full">{currentSession.status}</span>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                        <div>
                           <label className="text-slate-500 text-xs block uppercase tracking-wider mb-1">Time Window (UTC)</label>
                           <div className="text-slate-300">{new Date(currentSession.start_time_utc).toLocaleTimeString()} - {new Date(currentSession.end_time_utc).toLocaleTimeString()}</div>
                        </div>
                        <div>
                           <label className="text-slate-500 text-xs block uppercase tracking-wider mb-1">Session Target Score</label>
                           <div className="text-slate-300 font-mono text-lg font-bold">{currentSession.session_score}/100</div>
                        </div>
                     </div>
                     <div className="grid grid-cols-4 gap-4 text-sm font-mono bg-[#0A0A0A] border border-slate-800 rounded-lg p-4">
                        <div><div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Open</div><div className="text-slate-200">{currentSession.open_price}</div></div>
                        <div><div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">High</div><div className="text-slate-200">{currentSession.high_price}</div></div>
                        <div><div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Low</div><div className="text-slate-200">{currentSession.low_price}</div></div>
                        <div><div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Close/Curr</div><div className="text-slate-200">{currentSession.close_price}</div></div>
                     </div>
                  </div>

                  {/* Trade Permission */}
                  <div className="bg-[#141414] border border-slate-800 rounded-xl p-6">
                     <h3 className="text-xl font-bold text-slate-200 mb-6 border-b border-slate-800 pb-4 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-indigo-500" /> Action Timing Permission
                     </h3>
                     {tradePermission ? (
                        <div>
                           <div className="mb-4">
                              <span className={`px-3 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider border ${tradePermission.permission === 'SESSION_TRADE_ALLOWED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : tradePermission.permission.includes('WAIT') ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                 {tradePermission.permission.replace('SESSION_', '')}
                              </span>
                           </div>
                           <p className="text-slate-300 text-sm leading-relaxed mb-4">{tradePermission.message}</p>
                           <div className="text-xs text-slate-500 border-t border-slate-800 pt-4 mt-4">
                              Behavior Flag: <span className="text-amber-500 font-bold ml-1">{tradePermission.behavior_type}</span>
                           </div>
                        </div>
                     ) : (
                        <div className="text-slate-500">No trading permission signals available right now.</div>
                     )}
                  </div>
               </div>

               {/* Relationships Table */}
               <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden mt-6">
                  <div className="bg-[#1A1A1A] p-4 border-b border-slate-800">
                     <h3 className="text-sm font-bold text-slate-200">Session Relationships & Transitions</h3>
                  </div>
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-[#0A0A0A] border-b border-slate-800/50 text-xs text-slate-500 uppercase tracking-wider">
                           <th className="p-4 font-bold">Transition</th>
                           <th className="p-4 font-bold">Relationship Type</th>
                           <th className="p-4 font-bold">Interpretation Summary</th>
                           <th className="p-4 font-bold">Conf.</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800/50">
                        {relationships.map(rel => (
                           <tr key={rel.id} className="hover:bg-[#1A1A1A]/30 transition-colors text-sm">
                              <td className="p-4 text-slate-300 font-medium">
                                 {rel.source_session} <ArrowRight className="inline w-3 h-3 mx-1 text-slate-500" /> {rel.target_session}
                              </td>
                              <td className="p-4 text-amber-500 font-bold text-xs">{rel.relationship_type}</td>
                              <td className="p-4 text-slate-400">{rel.summary}</td>
                              <td className="p-4 text-slate-500 font-mono">{rel.confidence_score}%</td>
                           </tr>
                        ))}
                        {relationships.length === 0 && (
                           <tr><td colSpan={4} className="p-8 text-center text-slate-500">No session relationships identified.</td></tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         ) : (
            <div className="p-8 text-center bg-[#141414] border border-slate-800 rounded-xl text-slate-500">
               No active market session. Market may be closed.
            </div>
         )
      ) : activeTab === 'liquidity' ? (
         <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden mt-6">
            <div className="bg-[#1A1A1A] p-4 border-b border-slate-800">
               <h3 className="text-sm font-bold text-slate-200">Session Identified Liquidity Levels</h3>
            </div>
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-[#0A0A0A] border-b border-slate-800/50 text-xs text-slate-500 uppercase tracking-wider">
                     <th className="p-4 font-bold">Level Type</th>
                     <th className="p-4 font-bold">Price Threshold</th>
                     <th className="p-4 font-bold">Level Strength</th>
                     <th className="p-4 font-bold">State</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800/50 text-sm">
                  {liquidityLevels.map(lvl => (
                     <tr key={lvl.id} className="hover:bg-[#1A1A1A]/30 transition-colors">
                        <td className="p-4 text-slate-300">{lvl.level_type}</td>
                        <td className="p-4 font-mono text-amber-400 font-bold">{lvl.price_level}</td>
                        <td className="p-4 text-slate-400">{lvl.strength_score}/100</td>
                        <td className="p-4 text-slate-500">{lvl.status}</td>
                     </tr>
                  ))}
                  {liquidityLevels.length === 0 && (
                     <tr><td colSpan={4} className="p-8 text-center text-slate-500">No valid session liquidity levels tracked.</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      ) : (
         <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden mt-6">
            <div className="bg-[#1A1A1A] p-4 border-b border-slate-800">
               <h3 className="text-sm font-bold text-slate-200">Institutional Behavior Events</h3>
            </div>
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-[#0A0A0A] border-b border-slate-800/50 text-xs text-slate-500 uppercase tracking-wider">
                     <th className="p-4 font-bold">Event Type</th>
                     <th className="p-4 font-bold">Time Triggered</th>
                     <th className="p-4 font-bold">Price Action</th>
                     <th className="p-4 font-bold">Interpretation Strategy Output</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800/50 text-sm">
                  {behaviorEvents.map(evt => (
                     <tr key={evt.id} className="hover:bg-[#1A1A1A]/30 transition-colors">
                        <td className="p-4 text-indigo-400 font-bold text-xs"><span className="bg-indigo-500/10 px-2 py-1 rounded">{evt.event_type}</span></td>
                        <td className="p-4 text-slate-400 font-mono text-xs">{new Date(evt.event_time).toLocaleString()}</td>
                        <td className="p-4 text-slate-300 font-mono">@ {evt.event_price}</td>
                        <td className="p-4 text-slate-300">{evt.interpretation}</td>
                     </tr>
                  ))}
                  {behaviorEvents.length === 0 && (
                     <tr><td colSpan={4} className="p-8 text-center text-slate-500">No notable behavior events classified for this session.</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      )}
    </div>
  );
}
