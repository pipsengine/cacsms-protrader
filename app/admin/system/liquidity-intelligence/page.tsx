'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldAlert, CheckCircle2, AlertTriangle, 
  Settings, Activity, Target, Settings2, Box,
  Play, RefreshCw, Archive, ArrowRight, Waypoints, Droplet, Crosshair, Map as MapIcon, Zap
} from 'lucide-react';

export default function LiquidityIntelligencePage() {
  const [symbols, setSymbols] = useState<any[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const [pools, setPools] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [maps, setMaps] = useState<any[]>([]);
  const [inducements, setInducements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedSymbol]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const symData = await fetch('/api/symbols').then(res => res.json());
      if (symData.data) setSymbols(symData.data);
      
      const [poolsRes, eventsRes, mapsRes, inducementsRes] = await Promise.all([
         fetch(`/api/liquidity/${selectedSymbol}/pools`).then(res => res.json()),
         fetch(`/api/liquidity/${selectedSymbol}/events`).then(res => res.json()),
         fetch(`/api/liquidity/${selectedSymbol}/map`).then(res => res.json()),
         fetch(`/api/liquidity/${selectedSymbol}/inducement`).then(res => res.json())
      ]);

      setPools(poolsRes.data || []);
      setEvents(eventsRes.data || []);
      setMaps(mapsRes.data || []);
      setInducements(inducementsRes.data || []);
      
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleRecalculate = async () => {
    alert(`Triggering full liquidity recalculation for ${selectedSymbol}`);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto pb-40">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
              <Droplet className="w-8 h-8 text-cyan-500" />
              Liquidity Intelligence Engine
           </h1>
           <p className="text-slate-400 mt-2">Liquidity Pools, Sweeps & Stop Hunt Detection</p>
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
             <RefreshCw className="w-4 h-4" /> Recalculate Liquidity
          </button>
        </div>
      </div>

      {loading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="h-64 bg-[#141414] rounded-xl border border-slate-800 animate-pulse" />
           <div className="h-64 bg-[#141414] rounded-xl border border-slate-800 animate-pulse" />
         </div>
      ) : (
         <div className="space-y-6">
            
            {/* Liquidity Maps Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {maps.map(mapData => (
                  <div key={mapData.id} className="bg-[#141414] border border-slate-800 rounded-xl p-6">
                     <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
                        <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                           <MapIcon className="w-5 h-5 text-cyan-400" />
                           Liquidity Map
                        </h3>
                        <span className="bg-slate-800 px-2 py-1 rounded text-sm text-slate-300">{mapData.timeframe}</span>
                     </div>
                     
                     <div className="text-sm space-y-3">
                        <div className="flex justify-between p-3 bg-[#1A1A1A] rounded">
                           <span className="text-slate-400">Nearest Buy Liquidity</span>
                           <span className="font-mono font-bold text-red-400">{mapData.nearest_buy_liquidity || 'None'}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-[#1A1A1A] rounded">
                           <span className="text-slate-400">Nearest Sell Liquidity</span>
                           <span className="font-mono font-bold text-emerald-400">{mapData.nearest_sell_liquidity || 'None'}</span>
                        </div>
                     </div>
                  </div>
               ))}
               {maps.length === 0 && <div className="p-8 text-center bg-[#141414] border border-slate-800 rounded-xl text-slate-500 col-span-3">No liquidity maps available.</div>}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
               {/* Liquidity Pools */}
               <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden">
                  <div className="bg-[#1A1A1A] p-4 border-b border-slate-800 flex items-center gap-2">
                     <Droplet className="w-5 h-5 text-cyan-400" />
                     <h3 className="text-sm font-bold text-slate-200">Active Liquidity Pools</h3>
                  </div>
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-[#0A0A0A] border-b border-slate-800/50 text-xs text-slate-500 uppercase tracking-wider">
                           <th className="p-4 font-bold">TF / Type</th>
                           <th className="p-4 font-bold">Level / Score</th>
                           <th className="p-4 font-bold">Characteristics</th>
                           <th className="p-4 font-bold">Status</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800/50 text-sm">
                        {pools.map(pool => (
                           <tr key={pool.id} className="hover:bg-[#1A1A1A]/30 transition-colors">
                              <td className="p-4">
                                 <div className="font-bold text-slate-300 mb-1">{pool.timeframe}</div>
                                 <div className="text-[10px] px-2 py-0.5 rounded inline-block bg-cyan-500/10 text-cyan-400 font-bold max-w-[150px] truncate" title={pool.liquidity_type}>{pool.liquidity_type}</div>
                              </td>
                              <td className="p-4 font-mono text-xs">
                                 <div className="text-slate-200 font-bold mb-1">{pool.price_level}</div>
                                 <div className="text-cyan-500 font-bold text-[10px]">Score: {pool.strength_score}% ({pool.touch_count} touches)</div>
                              </td>
                              <td className="p-4 text-xs">
                                 <div className="flex gap-1 flex-wrap">
                                    {pool.is_internal && <span className="text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded">Internal</span>}
                                    {pool.is_external && <span className="text-fuchsia-400 border border-fuchsia-500/30 px-1.5 py-0.5 rounded">External</span>}
                                 </div>
                              </td>
                              <td className="p-4">
                                 {pool.is_active ? 
                                    <span className="text-emerald-400 font-bold text-xs flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Active</span> : 
                                    <span className="text-slate-500 font-bold text-xs">Swept</span>
                                 }
                              </td>
                           </tr>
                        ))}
                        {pools.length === 0 && (
                           <tr><td colSpan={4} className="p-8 text-center text-slate-500">No active pools tracked.</td></tr>
                        )}
                     </tbody>
                  </table>
               </div>

               {/* Inducement Events */}
               <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden">
                  <div className="bg-[#1A1A1A] p-4 border-b border-slate-800 flex items-center gap-2">
                     <Zap className="w-5 h-5 text-amber-500" />
                     <h3 className="text-sm font-bold text-slate-200">Inducement & Traps</h3>
                  </div>
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-[#0A0A0A] border-b border-slate-800/50 text-xs text-slate-500 uppercase tracking-wider">
                           <th className="p-4 font-bold">Type</th>
                           <th className="p-4 font-bold">Level / Status</th>
                           <th className="p-4 font-bold">Details</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800/50 text-sm">
                        {inducements.map(ind => (
                           <tr key={ind.id} className="hover:bg-[#1A1A1A]/30 transition-colors">
                              <td className="p-4">
                                 <div className="font-bold text-slate-300 mb-1">{ind.timeframe}</div>
                                 <div className="text-[10px] px-2 py-0.5 rounded inline-block bg-amber-500/10 text-amber-500 font-bold">{ind.inducement_type}</div>
                              </td>
                              <td className="p-4 font-mono text-xs">
                                 <div className="text-slate-200 mb-1">{ind.price_level}</div>
                                 <div className="text-emerald-400 text-[10px] font-sans font-bold">{ind.confirmation_status}</div>
                              </td>
                              <td className="p-4 text-xs text-slate-400 leading-relaxed max-w-sm">
                                 {ind.explanation}
                              </td>
                           </tr>
                        ))}
                        {inducements.length === 0 && (
                           <tr><td colSpan={3} className="p-8 text-center text-slate-500">No active inducements detected.</td></tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Sweep Events */}
            <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden mt-6">
               <div className="bg-[#1A1A1A] p-4 border-b border-slate-800 flex items-center gap-2">
                  <Crosshair className="w-5 h-5 text-red-500" />
                  <h3 className="text-sm font-bold text-slate-200">Liquidity Sweep Events</h3>
               </div>
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-[#0A0A0A] border-b border-slate-800/50 text-xs text-slate-500 uppercase tracking-wider">
                        <th className="p-4 font-bold">Event Log</th>
                        <th className="p-4 font-bold">Outcome</th>
                        <th className="p-4 font-bold">Event Details</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-sm">
                     {events.map(evt => (
                        <tr key={evt.id} className="hover:bg-[#1A1A1A]/30 transition-colors">
                           <td className="p-4">
                              <div className="flex gap-2 items-center mb-1">
                                 <div className="font-bold text-slate-300">{evt.timeframe}</div>
                                 <div className={`text-[10px] px-2 py-0.5 rounded font-bold ${evt.event_type.includes('BUY') ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-400'}`}>{evt.event_type}</div>
                              </div>
                              <div className="text-xs text-slate-500 font-mono mb-1">{new Date(evt.event_time).toLocaleString()}</div>
                              <div className="text-xs text-slate-400 font-mono border-t border-slate-800 pt-1 mt-1 inline-block">@ {evt.event_price}</div>
                           </td>
                           <td className="p-4">
                              <div className="text-emerald-400 font-bold text-xs mb-1">{evt.confirmation_status}</div>
                              <div className="text-amber-500 text-xs font-bold bg-amber-500/10 px-2 py-1 rounded inline-block">{evt.post_sweep_behavior}</div>
                           </td>
                           <td className="p-4 text-slate-400 text-xs max-w-2xl leading-relaxed">
                              {evt.explanation}
                           </td>
                        </tr>
                     ))}
                     {events.length === 0 && (
                        <tr><td colSpan={3} className="p-8 text-center text-slate-500">No recent sweep events found.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>

         </div>
      )}
    </div>
  );
}
