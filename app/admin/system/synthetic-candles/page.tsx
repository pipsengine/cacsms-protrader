'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart2, ShieldAlert, CheckCircle2, AlertTriangle, 
  Settings, Clock, Activity, Target, Settings2, Box,
  Play, RefreshCw, Archive, PlusSquare, ArrowRight, BookOpen
} from 'lucide-react';

export default function SyntheticCandlesPage() {
  const [activeTab, setActiveTab] = useState('h8');
  const [symbols, setSymbols] = useState<any[]>([]);
  const [h8Candles, setH8Candles] = useState<any[]>([]);
  const [h12Candles, setH12Candles] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');

  useEffect(() => {
    fetchData(selectedSymbol);
  }, [selectedSymbol]);

  const fetchData = async (symbol: string) => {
    setLoading(true);
    try {
      const [symData, h8Data, h12Data, jobsData] = await Promise.all([
        fetch('/api/symbols').then(res => res.json()),
        fetch(`/api/synthetic-candles/${symbol}/h8`).then(res => res.json()),
        fetch(`/api/synthetic-candles/${symbol}/h12`).then(res => res.json()),
        fetch('/api/synthetic-candles/build-jobs').then(res => res.json())
      ]);
      if (symData.data) setSymbols(symData.data);
      if (h8Data.data) setH8Candles(h8Data.data);
      if (h12Data.data) setH12Candles(h12Data.data);
      if (jobsData.data) setJobs(jobsData.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleRebuild = async () => {
    alert(`Triggering rebuild for synthetic candles of ${selectedSymbol}`);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto pb-40">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-rose-500" />
            Synthetic Candle Engine 
          </h1>
          <p className="text-slate-400 mt-2">H8 & H12 Institutional Validation & Bias Modeling</p>
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
             onClick={handleRebuild}
             className="px-4 py-2 bg-[#1A1A1A] border border-slate-700 hover:border-slate-500 text-slate-300 rounded-lg flex items-center gap-2 transition-colors"
          >
             <RefreshCw className="w-4 h-4" /> Rebuild Data
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-800 mb-6 gap-6">
        <button 
          onClick={() => setActiveTab('h8')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'h8' ? 'border-rose-500 text-rose-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <div className="flex items-center gap-2"><Box className="w-4 h-4" /> H8 Institutional Blocks</div>
        </button>
        <button 
          onClick={() => setActiveTab('h12')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'h12' ? 'border-rose-500 text-rose-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <div className="flex items-center gap-2"><Target className="w-4 h-4" /> H12 Intent Blocks</div>
        </button>
        <button 
          onClick={() => setActiveTab('jobs')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'jobs' ? 'border-rose-500 text-rose-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <div className="flex items-center gap-2"><Settings className="w-4 h-4" /> Build Jobs</div>
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
           {[1,2,3].map(i => <div key={i} className="h-40 bg-[#141414] rounded-xl border border-slate-800" />)}
        </div>
      ) : activeTab === 'h8' ? (
        <div className="space-y-4">
           {h8Candles.map(candle => (
              <div key={candle.id} className="bg-[#141414] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                 <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                       <h3 className="text-xl font-bold text-slate-100">{candle.block_name} Block <span className="text-sm font-normal text-slate-500 ml-2">(Seq: {candle.block_sequence})</span></h3>
                    </div>
                    <div className="flex gap-2">
                       <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${candle.status === 'COMPLETE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                         {candle.status}
                       </span>
                       <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${candle.candle_direction === 'BULLISH' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                         {candle.candle_direction}
                       </span>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-[#0A0A0A] border border-slate-800/50 p-4 rounded-lg">
                       <div className="text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">Metrics</div>
                       <div className="grid grid-cols-2 gap-y-2 text-sm">
                          <div className="text-slate-400">Open</div><div className="text-slate-200 font-mono text-right">{candle.open_price}</div>
                          <div className="text-slate-400">High</div><div className="text-slate-200 font-mono text-right">{candle.high_price}</div>
                          <div className="text-slate-400">Low</div><div className="text-slate-200 font-mono text-right">{candle.low_price}</div>
                          <div className="text-slate-400">Close</div><div className="text-slate-200 font-mono text-right">{candle.close_price}</div>
                       </div>
                    </div>
                    
                    <div className="bg-[#0A0A0A] border border-slate-800/50 p-4 rounded-lg">
                       <div className="text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">Characteristics</div>
                       <div className="grid grid-cols-2 gap-y-2 text-sm">
                          <div className="text-slate-400">Strength</div><div className="text-slate-200 font-mono text-right">{candle.candle_strength_score}/100</div>
                          <div className="text-slate-400">Behavior</div><div className="text-rose-400 font-bold text-right text-xs mt-0.5">{candle.institutional_behavior_type}</div>
                       </div>
                    </div>

                    <div className="bg-[#0A0A0A] border border-slate-800/50 p-4 rounded-lg">
                       <div className="text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">Interpretation</div>
                       <p className="text-sm text-slate-300 leading-relaxed">
                          {candle.interpretation}
                       </p>
                    </div>
                 </div>
                 
                 <div className="mt-4 text-xs text-slate-500 flex justify-between">
                    <div>{new Date(candle.open_time).toLocaleString()} - {new Date(candle.close_time).toLocaleString()}</div>
                    <div>Source: {JSON.parse(candle.source_candle_ids_json || '[]').length} H1 Candles</div>
                 </div>
              </div>
           ))}
           {h8Candles.length === 0 && <div className="text-center text-slate-500 p-8">No H8 candles generated for {selectedSymbol}</div>}
        </div>
      ) : activeTab === 'h12' ? (
        <div className="space-y-4">
           {h12Candles.map(candle => (
              <div key={candle.id} className="bg-[#141414] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                 <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                       <h3 className="text-xl font-bold text-slate-100">{candle.block_name} Block <span className="text-sm font-normal text-slate-500 ml-2">(Seq: {candle.block_sequence})</span></h3>
                    </div>
                 </div>
                 <div className="bg-[#0A0A0A] border border-slate-800/50 p-4 rounded-lg">
                    <div className="text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">Interpretation</div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                       {candle.interpretation}
                    </p>
                 </div>
              </div>
           ))}
           {h12Candles.length === 0 && <div className="text-center text-slate-500 p-8">No H12 candles generated for {selectedSymbol}</div>}
        </div>
      ) : (
        <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1A1A1A] border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                <th className="p-4 font-medium">Job Details</th>
                <th className="p-4 font-medium">Time Range</th>
                <th className="p-4 font-medium">Records</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {jobs.map(job => (
                <tr key={job.id} className="hover:bg-[#1A1A1A]/50 transition-colors">
                  <td className="p-4">
                    <span className="font-mono text-sm text-slate-300 font-bold">{job.build_type}</span>
                    <div className="text-xs text-rose-400 mt-0.5">Target TF: {job.timeframe}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-slate-400">{new Date(job.start_date).toLocaleString()}</div>
                    <div className="text-xs text-slate-400">{new Date(job.end_date).toLocaleString()}</div>
                  </td>
                  <td className="p-4 text-sm text-slate-300">
                     <div>{job.records_created} created</div>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block ${job.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-500'}`}>
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">No build jobs found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
