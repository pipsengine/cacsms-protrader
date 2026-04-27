'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldAlert, CheckCircle2, AlertTriangle, 
  Settings, Activity, Target, Settings2, Box,
  Play, RefreshCw, Archive, ArrowRight, Waypoints, Droplet, Crosshair, Map as MapIcon, Zap, Square
} from 'lucide-react';

export default function SmartMoneyZonesPage() {
  const [symbols, setSymbols] = useState<any[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const [zones, setZones] = useState<any[]>([]);
  const [ranges, setRanges] = useState<any[]>([]);
  const [warnings, setWarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedSymbol]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const symData = await fetch('/api/symbols').then(res => res.json());
      if (symData.data) setSymbols(symData.data);
      
      const [zonesRes, rangesRes, warningsRes] = await Promise.all([
         fetch(`/api/zones/${selectedSymbol}`).then(res => res.json()),
         fetch(`/api/zones/${selectedSymbol}/premium-discount`).then(res => res.json()),
         fetch(`/api/zones/${selectedSymbol}/opposing-risk`).then(res => res.json())
      ]);

      const zonesWithScores = await Promise.all((zonesRes.data || []).map(async (zone: any) => {
          const score = await fetch(`/api/zones/${zone.id}/quality-score`).then(res => res.json());
          return { ...zone, scoreData: score.data };
      }));

      setZones(zonesWithScores);
      setRanges(rangesRes.data || []);
      setWarnings(warningsRes.data || []);
      
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleRecalculate = async () => {
    alert(`Triggering full zone recalculation for ${selectedSymbol}`);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto pb-40">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
              <Square className="w-8 h-8 text-fuchsia-500" />
              Smart Money Institutional Zones
           </h1>
           <p className="text-slate-400 mt-2">FVG, Order Blocks, and Supply/Demand Quality Tracking</p>
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
             <RefreshCw className="w-4 h-4" /> Recalculate Zones
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
            
            {/* Opposing Risk Warnings */}
            {warnings.length > 0 && (
               <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex flex-col md:flex-row gap-4">
                  <div className="flex-shrink-0">
                     <AlertTriangle className="w-6 h-6 text-amber-500 mt-1" />
                  </div>
                  <div>
                     <h3 className="font-bold text-amber-500 mb-2">Opposing Zone Risk Detected</h3>
                     <div className="space-y-2">
                        {warnings.map(w => (
                           <div key={w.id} className="text-sm">
                              <span className="font-mono text-slate-300 mr-2">{w.distance_to_zone} pip proximity</span>
                              <span className="text-slate-400">{w.explanation}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
               {/* Institutional Zones Table */}
               <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden col-span-1 xl:col-span-2">
                  <div className="bg-[#1A1A1A] p-4 border-b border-slate-800 flex items-center gap-2">
                     <Square className="w-5 h-5 text-fuchsia-400" />
                     <h3 className="text-sm font-bold text-slate-200">Active High-Probability Zones</h3>
                  </div>
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-[#0A0A0A] border-b border-slate-800/50 text-xs text-slate-500 uppercase tracking-wider">
                           <th className="p-4 font-bold">Zone / Range</th>
                           <th className="p-4 font-bold">Quality & Status</th>
                           <th className="p-4 font-bold">Validation Factors</th>
                           <th className="p-4 font-bold">Explanation</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800/50 text-sm">
                        {zones.map(zone => (
                           <tr key={zone.id} className="hover:bg-[#1A1A1A]/30 transition-colors">
                              <td className="p-4">
                                 <div className="flex gap-2 items-center mb-1">
                                    <div className="font-bold text-slate-300">{zone.timeframe}</div>
                                    <div className={`text-[10px] px-2 py-0.5 rounded font-bold ${zone.direction === 'BULLISH' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'}`}>{zone.zone_type}</div>
                                 </div>
                                 <div className="text-xs font-mono text-slate-400 opacity-80 mt-1">
                                    {zone.zone_high} — {zone.zone_low}
                                 </div>
                              </td>
                              <td className="p-4">
                                 <div className="font-bold font-mono text-fuchsia-400 mb-1">QS: {zone.quality_score}%</div>
                                 <div className="text-[10px] text-slate-400 uppercase tracking-wide flex gap-2">
                                    <span>{zone.status}</span> • <span>{zone.freshness_status} ({zone.fill_percentage}%)</span>
                                 </div>
                              </td>
                              <td className="p-4 text-[10px]">
                                 {zone.scoreData && (
                                    <>
                                       <div className="text-emerald-500 mb-1 leading-snug">
                                          + {JSON.parse(zone.scoreData.positive_factors_json || '[]').join(', ')}
                                       </div>
                                       <div className="text-amber-500/80 leading-snug">
                                          - {JSON.parse(zone.scoreData.negative_factors_json || '[]').join(', ')}
                                       </div>
                                    </>
                                 )}
                              </td>
                              <td className="p-4 text-xs text-slate-400 max-w-sm leading-relaxed">
                                 {zone.scoreData ? zone.scoreData.explanation : 'No explanation data available.'}
                              </td>
                           </tr>
                        ))}
                        {zones.length === 0 && (
                           <tr><td colSpan={4} className="p-8 text-center text-slate-500">No active zones found.</td></tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Premium / Discount Ranges */}
            <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden mt-6">
               <div className="bg-[#1A1A1A] p-4 border-b border-slate-800 flex items-center gap-2">
                  <MapIcon className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-bold text-slate-200">Premium & Discount Dealing Ranges</h3>
               </div>
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-[#0A0A0A] border-b border-slate-800/50 text-xs text-slate-500 uppercase tracking-wider">
                        <th className="p-4 font-bold">TF / Range Type</th>
                        <th className="p-4 font-bold">Range Coordinates</th>
                        <th className="p-4 font-bold">Equilibrium (50%)</th>
                        <th className="p-4 font-bold">Current Profile</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-sm">
                     {ranges.map(range => (
                        <tr key={range.id} className="hover:bg-[#1A1A1A]/30 transition-colors">
                           <td className="p-4">
                              <div className="font-bold text-slate-300 mb-1">{range.timeframe}</div>
                              <div className="text-xs text-slate-500">{range.range_type}</div>
                           </td>
                           <td className="p-4 font-mono text-xs">
                              <span className="text-red-400">H: {range.range_high}</span><br/>
                              <span className="text-emerald-400">L: {range.range_low}</span>
                           </td>
                           <td className="p-4 font-mono text-slate-400 text-xs">{range.equilibrium_price}</td>
                           <td className="p-4">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${range.current_price_location.includes('PREMIUM') ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-400'}`}>{range.current_price_location}</span>
                           </td>
                        </tr>
                     ))}
                     {ranges.length === 0 && (
                        <tr><td colSpan={4} className="p-8 text-center text-slate-500">No dealing ranges active.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>

         </div>
      )}
    </div>
  );
}
