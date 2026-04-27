'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldAlert, CheckCircle2, AlertTriangle, 
  Settings, Activity, Target, Settings2, Box,
  Play, RefreshCw, Archive, ArrowRight, Waypoints, TrendingUp, TrendingDown, Layers
} from 'lucide-react';

export default function MarketStructurePage() {
  const [symbols, setSymbols] = useState<any[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const [states, setStates] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [swings, setSwings] = useState<any[]>([]);
  const [transitions, setTransitions] = useState<any[]>([]);
  const [dealingRanges, setDealingRanges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedSymbol]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const symData = await fetch('/api/symbols').then(res => res.json());
      if (symData.data) setSymbols(symData.data);
      
      const [statesRes, eventsRes, swingsRes, transRes, rangesRes] = await Promise.all([
         fetch(`/api/structure/${selectedSymbol}/states`).then(res => res.json()),
         fetch(`/api/structure/${selectedSymbol}/events`).then(res => res.json()),
         fetch(`/api/structure/${selectedSymbol}/swings`).then(res => res.json()),
         fetch(`/api/structure/${selectedSymbol}/transitions`).then(res => res.json()),
         fetch(`/api/structure/${selectedSymbol}/dealing-range`).then(res => res.json())
      ]);

      setStates(statesRes.data || []);
      setEvents(eventsRes.data || []);
      setSwings(swingsRes.data || []);
      setTransitions(transRes.data || []);
      setDealingRanges(rangesRes.data || []);
      
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleRecalculate = async () => {
    alert(`Triggering full structure recalculation for ${selectedSymbol}`);
  };

  const getDirectionColor = (direction: string) => {
     if (!direction) return 'text-slate-400';
     if (direction.includes('BULLISH')) return 'text-emerald-400';
     if (direction.includes('BEARISH')) return 'text-red-500';
     return 'text-amber-500';
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto pb-40">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
              <Waypoints className="w-8 h-8 text-indigo-500" />
              Market Structure Engine
           </h1>
           <p className="text-slate-400 mt-2">BOS, CHoCH, and Swing Anchor detection for all timeframes.</p>
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
             <RefreshCw className="w-4 h-4" /> Recalculate Structure
          </button>
        </div>
      </div>

      {loading ? (
         <div className="animate-pulse space-y-4">
           <div className="h-64 bg-[#141414] rounded-xl border border-slate-800" />
         </div>
      ) : (
         <div className="space-y-6">
            
            {/* Structure States */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {states.map(state => (
                  <div key={state.id} className="bg-[#141414] border border-slate-800 rounded-xl p-6">
                     <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
                        <h3 className="text-xl font-bold text-slate-200">
                           <span className="bg-slate-800 px-2 py-1 rounded text-sm mr-2">{state.timeframe}</span>
                           State Profile
                        </h3>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${state.current_state.includes('BULLISH') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : state.current_state.includes('BEARISH') ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                           {state.current_state.replace('_STRUCTURE', '')}
                        </span>
                     </div>
                     
                     <div className="text-sm space-y-3 mb-4">
                        <div className="flex justify-between p-2 bg-[#1A1A1A] rounded">
                           <span className="text-slate-500">Direction</span>
                           <span className={`font-bold ${getDirectionColor(state.current_direction)}`}>{state.current_direction}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-[#1A1A1A] rounded">
                           <span className="text-slate-500">Protected High</span>
                           <span className="font-mono text-slate-300">{state.protected_high || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-[#1A1A1A] rounded">
                           <span className="text-slate-500">Protected Low</span>
                           <span className="font-mono text-slate-300">{state.protected_low || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-[#1A1A1A] rounded">
                           <span className="text-slate-500">Confidence</span>
                           <span className="font-mono text-indigo-400 font-bold">{state.confidence_score}%</span>
                        </div>
                        <div className="flex justify-between p-2 bg-[#0A0A0A] border border-emerald-500/20 rounded">
                           <span className="text-slate-500">Permission</span>
                           <span className="font-bold text-emerald-400">{state.trade_permission}</span>
                        </div>
                     </div>
                     <div className="text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-4">
                        {state.explanation}
                     </div>
                  </div>
               ))}
               {states.length === 0 && <div className="p-8 text-center bg-[#141414] border border-slate-800 rounded-xl text-slate-500 col-span-3">No structure states available.</div>}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
               {/* Anchors & Swing Points */}
               <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden">
                  <div className="bg-[#1A1A1A] p-4 border-b border-slate-800 flex items-center gap-2">
                     <Target className="w-5 h-5 text-indigo-400" />
                     <h3 className="text-sm font-bold text-slate-200">Validated Swing Anchors</h3>
                  </div>
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-[#0A0A0A] border-b border-slate-800/50 text-xs text-slate-500 uppercase tracking-wider">
                           <th className="p-4 font-bold">TF / Type</th>
                           <th className="p-4 font-bold">Price / Time</th>
                           <th className="p-4 font-bold">Characteristics</th>
                           <th className="p-4 font-bold">Status</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800/50 text-sm">
                        {swings.map(swing => (
                           <tr key={swing.id} className="hover:bg-[#1A1A1A]/30 transition-colors">
                              <td className="p-4">
                                 <div className="font-bold text-slate-300 mb-1">{swing.timeframe}</div>
                                 <div className={`text-[10px] px-2 py-0.5 rounded inline-block ${swing.swing_type === 'SWING_HIGH' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-400'}`}>{swing.swing_type}</div>
                              </td>
                              <td className="p-4 font-mono text-xs">
                                 <div className="text-slate-200 font-bold mb-1">{swing.price}</div>
                                 <div className="text-slate-500">{new Date(swing.candle_time).toLocaleString()}</div>
                              </td>
                              <td className="p-4 text-xs">
                                 <div className="flex gap-1 flex-wrap">
                                    {swing.is_external && <span className="text-indigo-400">External</span>}
                                    {swing.is_protected && <span className="text-fuchsia-400">Protected</span>}
                                    {swing.is_weak && <span className="text-amber-500">Weak</span>}
                                    {swing.is_strong && <span className="text-emerald-400">Strong</span>}
                                 </div>
                              </td>
                              <td className="p-4 text-slate-400 font-bold text-xs">{swing.status}</td>
                           </tr>
                        ))}
                        {swings.length === 0 && (
                           <tr><td colSpan={4} className="p-8 text-center text-slate-500">No active swing anchors tracked.</td></tr>
                        )}
                     </tbody>
                  </table>
               </div>

               {/* Dealing Ranges */}
               <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden">
                  <div className="bg-[#1A1A1A] p-4 border-b border-slate-800 flex items-center gap-2">
                     <Layers className="w-5 h-5 text-indigo-400" />
                     <h3 className="text-sm font-bold text-slate-200">Dealing Ranges & Prem/Disc</h3>
                  </div>
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-[#0A0A0A] border-b border-slate-800/50 text-xs text-slate-500 uppercase tracking-wider">
                           <th className="p-4 font-bold">Range Setup</th>
                           <th className="p-4 font-bold">High / Low</th>
                           <th className="p-4 font-bold">Equilibrium</th>
                           <th className="p-4 font-bold">Location</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800/50 text-sm">
                        {dealingRanges.map(range => (
                           <tr key={range.id} className="hover:bg-[#1A1A1A]/30 transition-colors">
                              <td className="p-4">
                                 <div className="font-bold text-slate-300 mb-1">{range.timeframe}</div>
                                 <div className="text-xs text-slate-500">{range.range_type}</div>
                              </td>
                              <td className="p-4 font-mono text-xs">
                                 <div className="text-red-400">H: {range.range_high}</div>
                                 <div className="text-emerald-400">L: {range.range_low}</div>
                              </td>
                              <td className="p-4 font-mono text-slate-400 text-xs">{range.equilibrium_price}</td>
                              <td className="p-4">
                                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${range.current_price_location === 'PREMIUM' ? 'bg-red-500/20 text-red-500' : range.current_price_location === 'DISCOUNT' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-500'}`}>{range.current_price_location}</span>
                              </td>
                           </tr>
                        ))}
                        {dealingRanges.length === 0 && (
                           <tr><td colSpan={4} className="p-8 text-center text-slate-500">No dealing ranges active.</td></tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Structure Events BOS/CHoCH */}
            <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden mt-6">
               <div className="bg-[#1A1A1A] p-4 border-b border-slate-800 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-bold text-slate-200">Structure Shifts (BOS / CHoCH)</h3>
               </div>
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-[#0A0A0A] border-b border-slate-800/50 text-xs text-slate-500 uppercase tracking-wider">
                        <th className="p-4 font-bold">Event Log</th>
                        <th className="p-4 font-bold">Status</th>
                        <th className="p-4 font-bold">Event Details</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-sm">
                     {events.map(evt => (
                        <tr key={evt.id} className="hover:bg-[#1A1A1A]/30 transition-colors">
                           <td className="p-4">
                              <div className="flex gap-2 items-center mb-1">
                                 <div className="font-bold text-slate-300">{evt.timeframe}</div>
                                 <div className={`text-[10px] px-2 py-0.5 rounded font-bold ${evt.direction === 'BULLISH' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'}`}>{evt.event_type}</div>
                              </div>
                              <div className="text-xs text-slate-500 font-mono">{new Date(evt.event_time).toLocaleString()}</div>
                           </td>
                           <td className="p-4">
                              <div className="text-emerald-400 font-bold text-xs mb-1">{evt.validity_status}</div>
                              <div className="text-slate-500 text-xs">{evt.confirmation_type}</div>
                           </td>
                           <td className="p-4 text-slate-400 text-xs max-w-lg leading-relaxed">
                              {evt.explanation}
                           </td>
                        </tr>
                     ))}
                     {events.length === 0 && (
                        <tr><td colSpan={3} className="p-8 text-center text-slate-500">No structure shift events found.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>

         </div>
      )}
    </div>
  );
}
