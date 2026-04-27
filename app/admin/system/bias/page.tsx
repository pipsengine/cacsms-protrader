'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldAlert, CheckCircle2, AlertTriangle, 
  Settings, Activity, Target, Settings2, Box,
  Play, RefreshCw, Archive, ArrowRight, Compass, Navigation, Layers
} from 'lucide-react';

export default function BiasDirectionPage() {
  const [symbols, setSymbols] = useState<any[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const [matrix, setMatrix] = useState<any>(null);
  const [biasStates, setBiasStates] = useState<any[]>([]);
  const [invalidationEvents, setInvalidationEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedSymbol]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const symData = await fetch('/api/symbols').then(res => res.json());
      if (symData.data) setSymbols(symData.data);
      
      const [matrixData, statesData, eventsData] = await Promise.all([
         fetch(`/api/bias/${selectedSymbol}/matrix`).then(res => res.json()),
         fetch(`/api/bias/${selectedSymbol}`).then(res => res.json()),
         fetch(`/api/bias/invalidation-events/${selectedSymbol}`).then(res => res.json())
      ]);

      setMatrix(matrixData.data || null);
      setBiasStates(statesData.data || []);
      setInvalidationEvents(eventsData.data || []);
      
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleRecalculate = async () => {
    alert(`Triggering full bias recalculation for ${selectedSymbol}`);
  };

  const getBiasColor = (bias: string) => {
     if (!bias) return 'text-slate-400';
     if (bias.includes('BULLISH')) return 'text-emerald-400';
     if (bias.includes('BEARISH')) return 'text-red-500';
     if (bias.includes('WAIT') || bias.includes('PULLBACK')) return 'text-amber-500';
     return 'text-slate-400';
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto pb-40">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
              <Compass className="w-8 h-8 text-fuchsia-500" />
              Multi-Timeframe Bias Engine
           </h1>
           <p className="text-slate-400 mt-2">Determines structured directional context for all supported timeframes.</p>
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
             <RefreshCw className="w-4 h-4" /> Recalculate Bias
          </button>
        </div>
      </div>

      {loading ? (
         <div className="animate-pulse space-y-4">
           <div className="h-64 bg-[#141414] rounded-xl border border-slate-800" />
         </div>
      ) : (
         <div className="space-y-6">
            
            {/* Context & Permission */}
            {matrix && (
               <div className="bg-[#141414] border border-slate-800 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
                     <Target className="w-5 h-5 text-indigo-400" /> Directional Context & Permission
                  </h3>
                  
                  <div className="flex flex-col md:flex-row gap-8">
                     <div className="flex-1">
                        <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">Multi-Tier State</div>
                        <div className="space-y-3 font-mono text-sm">
                           <div className="flex justify-between bg-[#0A0A0A] p-3 rounded border border-slate-800">
                              <span className="text-slate-400">Strategic Bias (HTF)</span>
                              <span className={`font-bold ${getBiasColor(matrix.strategic_bias)}`}>{matrix.strategic_bias}</span>
                           </div>
                           <div className="flex justify-between bg-[#0A0A0A] p-3 rounded border border-slate-800">
                              <span className="text-slate-400">Tactical Bias (MTF)</span>
                              <span className={`font-bold ${getBiasColor(matrix.tactical_bias)}`}>{matrix.tactical_bias}</span>
                           </div>
                           <div className="flex justify-between bg-[#0A0A0A] p-3 rounded border border-slate-800">
                              <span className="text-slate-400">Execution Bias (LTF)</span>
                              <span className={`font-bold ${getBiasColor(matrix.execution_bias)}`}>{matrix.execution_bias}</span>
                           </div>
                        </div>
                     </div>

                     <div className="flex-1 border-l border-slate-800 pl-8">
                        <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3">Final Output</div>
                        <div className="inline-block px-4 py-2 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 rounded-lg font-bold text-lg mb-4">
                           {matrix.final_permission}
                        </div>
                        <div className="text-sm text-slate-300 leading-relaxed bg-[#1A1A1A] p-4 rounded-lg border border-slate-800/50">
                           {matrix.explanation}
                        </div>
                        {matrix.bias_conflict_type && matrix.bias_conflict_type !== 'NONE' && (
                           <div className="mt-4 flex items-center gap-2 text-amber-500 text-xs font-bold bg-amber-500/10 p-2 rounded">
                              <AlertTriangle className="w-4 h-4" /> Conflict Detected: {matrix.bias_conflict_type}
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            )}

            {/* Individual Timeframe Details */}
            <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden mt-6">
               <div className="bg-[#1A1A1A] p-4 border-b border-slate-800 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-slate-400" />
                  <h3 className="text-sm font-bold text-slate-200">Timeframe Bias Matrix Details</h3>
               </div>
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-[#0A0A0A] border-b border-slate-800/50 text-xs text-slate-500 uppercase tracking-wider">
                        <th className="p-4 font-bold w-24">TF</th>
                        <th className="p-4 font-bold">State & Score</th>
                        <th className="p-4 font-bold">Logic Explanation</th>
                        <th className="p-4 font-bold w-48 text-right">Factors</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-sm">
                     {biasStates.map(state => (
                        <tr key={state.id} className="hover:bg-[#1A1A1A]/30 transition-colors">
                           <td className="p-4 font-bold text-slate-300">
                              <div className="bg-slate-800 px-2 py-1 rounded inline-block text-xs">{state.timeframe}</div>
                           </td>
                           <td className="p-4">
                              <div className={`font-bold mb-1 ${getBiasColor(state.bias_state)}`}>{state.bias_state}</div>
                              <div className="text-xs text-slate-500 font-mono">Conf: {state.confidence_score}%</div>
                           </td>
                           <td className="p-4 text-slate-400 leading-relaxed max-w-lg">
                              {state.explanation}
                           </td>
                           <td className="p-4 text-xs max-w-[200px] text-right">
                              <div className="text-emerald-500 font-mono mb-1 truncate" title={state.supporting_factors_json}>
                                 {JSON.parse(state.supporting_factors_json || '[]').join(', ')}
                              </div>
                              <div className="text-amber-500 font-mono truncate" title={state.conflicting_factors_json}>
                                 {JSON.parse(state.conflicting_factors_json || '[]').join(', ')}
                              </div>
                           </td>
                        </tr>
                     ))}
                     {biasStates.length === 0 && (
                        <tr><td colSpan={4} className="p-8 text-center text-slate-500">No timeframe bias details calculated.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>

            {/* Invalidation Events */}
            <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden mt-6">
               <div className="bg-[#1A1A1A] p-4 border-b border-slate-800 flex items-center gap-2">
                  <Archive className="w-5 h-5 text-slate-400" />
                  <h3 className="text-sm font-bold text-slate-200">Recent Invalidation Events</h3>
               </div>
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-[#0A0A0A] border-b border-slate-800/50 text-xs text-slate-500 uppercase tracking-wider">
                        <th className="p-4 font-bold">TF / Time</th>
                        <th className="p-4 font-bold">Transition</th>
                        <th className="p-4 font-bold">Invalidation Reason</th>
                        <th className="p-4 font-bold">Event Log</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-sm">
                     {invalidationEvents.map(evt => (
                        <tr key={evt.id} className="hover:bg-[#1A1A1A]/30 transition-colors">
                           <td className="p-4">
                              <div className="font-bold text-slate-200 mb-1">{evt.timeframe}</div>
                              <div className="text-xs text-slate-500 font-mono">{new Date(evt.created_at).toLocaleString()}</div>
                           </td>
                           <td className="p-4 text-xs font-mono font-bold text-slate-300">
                              {evt.previous_bias} <ArrowRight className="inline w-3 h-3 mx-1 text-slate-500" /> {evt.new_bias}
                           </td>
                           <td className="p-4 text-amber-400">{evt.invalidation_reason}</td>
                           <td className="p-4 text-slate-400 text-xs">{evt.explanation}</td>
                        </tr>
                     ))}
                     {invalidationEvents.length === 0 && (
                        <tr><td colSpan={4} className="p-8 text-center text-slate-500">No recent invalidation events.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>

         </div>
      )}
    </div>
  );
}
