'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldAlert, CheckCircle2, AlertTriangle, 
  Settings, Activity, Target, Settings2, Box,
  Play, RefreshCw, Archive, ArrowRight, Waypoints, Droplet, Crosshair, Map as MapIcon, Zap, Square, Check
} from 'lucide-react';

export default function ChannelIntelligencePage() {
  const [symbols, setSymbols] = useState<any[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const [channels, setChannels] = useState<any[]>([]);
  const [nested, setNested] = useState<any[]>([]);
  const [retestsAndBreakouts, setRetestsAndBreakouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedSymbol]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const symData = await fetch('/api/symbols').then(res => res.json());
      if (symData.data) setSymbols(symData.data);
      
      const channelsRes = await fetch(`/api/channels/${selectedSymbol}`).then(res => res.json());
      const activeChannels = (channelsRes.data || []).filter((c: any) => c.status === 'ACTIVE');
      setChannels(activeChannels);

      const nestedRes = await fetch(`/api/channels/${selectedSymbol}/nested`).then(res => res.json());
      setNested(nestedRes.data || []);

      // Pull breakouts and retests for active channels
      const breakoutRetestData: any[] = [];
      for (const channel of activeChannels) {
         const breakouts = await fetch(`/api/channels/${channel.id}/breakouts`).then(res => res.json());
         const retests = await fetch(`/api/channels/${channel.id}/retests`).then(res => res.json());
         
         if (breakouts.data && breakouts.data.length > 0) {
             breakouts.data.forEach((b: any) => breakoutRetestData.push({ ...b, type: 'BREAKOUT', channelRef: channel }));
         }
         if (retests.data && retests.data.length > 0) {
             retests.data.forEach((r: any) => breakoutRetestData.push({ ...r, type: 'RETEST', channelRef: channel }));
         }
      }
      setRetestsAndBreakouts(breakoutRetestData);
      
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleRecalculate = async () => {
    alert(`Triggering full channel detection for ${selectedSymbol}`);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto pb-40">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
              <Box className="w-8 h-8 text-blue-500" />
              Channel Detection Engine
           </h1>
           <p className="text-slate-400 mt-2">Trend-in-Trend & Channel Trading Context</p>
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
             <RefreshCw className="w-4 h-4" /> Run Detection
          </button>
        </div>
      </div>

      {loading ? (
         <div className="grid grid-cols-1 gap-6">
           <div className="h-64 bg-[#141414] rounded-xl border border-slate-800 animate-pulse" />
         </div>
      ) : (
         <div className="space-y-6">
            
            {/* Active Channels Table */}
            <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden">
               <div className="bg-[#1A1A1A] p-4 border-b border-slate-800 flex items-center gap-2">
                  <Waypoints className="w-5 h-5 text-blue-400" />
                  <h3 className="text-sm font-bold text-slate-200">Active Structural Channels</h3>
               </div>
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-[#0A0A0A] border-b border-slate-800/50 text-xs text-slate-500 uppercase tracking-wider">
                        <th className="p-4 font-bold">TF / Identity</th>
                        <th className="p-4 font-bold">Context & Metrics</th>
                        <th className="p-4 font-bold">Boundaries (Eqn)</th>
                        <th className="p-4 font-bold">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-sm">
                     {channels.map(channel => (
                        <tr key={channel.id} className="hover:bg-[#1A1A1A]/30 transition-colors">
                           <td className="p-4">
                              <div className="flex gap-2 items-center mb-1">
                                 <div className="font-bold text-slate-300">{channel.timeframe}</div>
                                 <div className={`text-[10px] px-2 py-0.5 rounded font-bold ${channel.direction === 'UPWARD_CHANNEL' ? 'bg-emerald-500/10 text-emerald-400' : channel.direction === 'DOWNWARD_CHANNEL' ? 'bg-red-500/10 text-red-500' : 'bg-slate-500/10 text-slate-400'}`}>{channel.channel_type}</div>
                              </div>
                              <div className="text-xs text-slate-400 max-w-xs leading-relaxed mt-2">
                                 {channel.explanation}
                              </div>
                           </td>
                           <td className="p-4">
                              <div className="text-xs text-slate-400 mb-1">touches: <span className="text-slate-200">U:{channel.touch_count_upper} L:{channel.touch_count_lower}</span></div>
                              <div className="text-xs text-blue-400 font-bold mb-1">Score: {channel.strength_score}%</div>
                              {channel.parent_channel_id && (
                                 <div className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded inline-block">Nested in ID: {channel.parent_channel_id}</div>
                              )}
                           </td>
                           <td className="p-4 font-mono text-xs opacity-80 text-slate-400 leading-snug">
                              U: {channel.upper_boundary_line}<br/>
                              L: {channel.lower_boundary_line}<br/>
                              M: {channel.midline}
                           </td>
                           <td className="p-4">
                              <span className="text-emerald-400 font-bold text-xs flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> {channel.status}</span>
                           </td>
                        </tr>
                     ))}
                     {channels.length === 0 && (
                        <tr><td colSpan={4} className="p-8 text-center text-slate-500">No active channels found.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
               {/* Nested Channels Reference */}
               <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden">
                  <div className="bg-[#1A1A1A] p-4 border-b border-slate-800 flex items-center gap-2">
                     <Layers className="w-5 h-5 text-indigo-400" />
                     <h3 className="text-sm font-bold text-slate-200">Trend-in-Trend (Nested Channels)</h3>
                  </div>
                  <div className="p-0">
                     <table className="w-full text-left border-collapse">
                        <tbody className="divide-y divide-slate-800/50 text-sm">
                           {nested.map(channel => (
                              <tr key={channel.id} className="hover:bg-[#1A1A1A]/30">
                                 <td className="p-4">
                                    <div className="font-bold text-slate-300">Child: {channel.timeframe} {channel.channel_type}</div>
                                    <div className="text-xs text-slate-500">Parent ID: {channel.parent_channel_id}</div>
                                 </td>
                                 <td className="p-4 text-xs text-slate-400 text-right">
                                    <ArrowRight className="w-4 h-4 inline mr-2 text-slate-600"/>
                                    {channel.direction}
                                 </td>
                              </tr>
                           ))}
                           {nested.length === 0 && (
                              <tr><td colSpan={2} className="p-8 text-center text-slate-500">No nested channels active.</td></tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>

               {/* Breakouts & Retests */}
               <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden">
                  <div className="bg-[#1A1A1A] p-4 border-b border-slate-800 flex items-center gap-2">
                     <Zap className="w-5 h-5 text-amber-500" />
                     <h3 className="text-sm font-bold text-slate-200">Breakouts & Retests</h3>
                  </div>
                  <table className="w-full text-left border-collapse">
                     <tbody className="divide-y divide-slate-800/50 text-sm">
                        {retestsAndBreakouts.map((evt, idx) => (
                           <tr key={idx} className="hover:bg-[#1A1A1A]/30">
                              <td className="p-4">
                                 <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${evt.type === 'BREAKOUT' ? 'bg-amber-500/10 text-amber-500' : 'bg-fuchsia-500/10 text-fuchsia-400'}`}>
                                       {evt.type}
                                    </span>
                                    <span className="text-slate-400 text-xs font-mono">{evt.type === 'BREAKOUT' ? evt.breakout_type : evt.retest_status}</span>
                                 </div>
                                 <div className="text-xs text-slate-500">Channel {evt.channelRef?.timeframe} {evt.channelRef?.channel_type}</div>
                              </td>
                              <td className="p-4 font-mono text-xs">
                                 <div className="text-slate-200">@ {evt.type === 'BREAKOUT' ? evt.breakout_price : evt.retest_price}</div>
                                 <div className="text-slate-500 mt-1">{new Date(evt.type === 'BREAKOUT' ? evt.breakout_time : evt.retest_time).toLocaleString()}</div>
                              </td>
                           </tr>
                        ))}
                        {retestsAndBreakouts.length === 0 && (
                           <tr><td colSpan={2} className="p-8 text-center text-slate-500">No recent breakouts or retests detected.</td></tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>

         </div>
      )}
    </div>
  );
}

// Added Layers icon mapping for this file
const Layers = ({ className }: { className?: string }) => (
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
      <polyline points="2 12 12 17 22 12"></polyline>
      <polyline points="2 17 12 22 22 17"></polyline>
   </svg>
);
