'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart2, ShieldAlert, CheckCircle2, AlertTriangle, 
  Settings, Clock, Activity, Target, Settings2, Box,
  Play, RefreshCw, Archive, PlusSquare, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function CandleEnginePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [symbols, setSymbols] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [symData, jobsData, anomaliesData] = await Promise.all([
        fetch('/api/symbols').then(res => res.json()),
        fetch('/api/candles/build-jobs').then(res => res.json()),
        fetch('/api/candles/anomalies').then(res => res.json())
      ]);
      if (symData.data) setSymbols(symData.data);
      if (jobsData.data) setJobs(jobsData.data);
      if (anomaliesData.data) setAnomalies(anomaliesData.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleRebuild = async (symbolId: number) => {
     // Mock rebuild trigger
     alert(`Triggering rebuild for symbol ${symbolId}`);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto pb-40">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <BarChart2 className="w-8 h-8 text-indigo-500" />
            Tick & Candle Data Engine
          </h1>
          <p className="text-slate-400 mt-2">Aggregates ticks into M1 candles, synchronizes higher timeframes, and calculates metadata.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-4 py-2 bg-[#1A1A1A] border border-slate-700 hover:border-slate-500 text-slate-300 rounded-lg flex items-center gap-2 transition-colors">
              <Archive className="w-4 h-4" /> Import Data
           </button>
           <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg flex items-center gap-2 transition-colors">
              <RefreshCw className="w-4 h-4" /> Global Repair
           </button>
        </div>
      </div>

      <div className="flex border-b border-slate-800 mb-6 gap-6">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <div className="flex items-center gap-2"><Activity className="w-4 h-4" /> Data Readiness</div>
        </button>
        <button 
          onClick={() => setActiveTab('jobs')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'jobs' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <div className="flex items-center gap-2"><Box className="w-4 h-4" /> Build Jobs</div>
        </button>
        <button 
          onClick={() => setActiveTab('anomalies')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'anomalies' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <div className="flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Anomalies <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px] ml-1">{anomalies.length}</span></div>
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
           {[1,2,3].map(i => <div key={i} className="h-20 bg-[#141414] rounded-xl border border-slate-800" />)}
        </div>
      ) : activeTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
           {symbols.map(sym => (
              <div key={sym.id} className="bg-[#141414] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                 <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                       <h3 className="text-xl font-bold text-slate-100">{sym.symbol_code}</h3>
                    </div>
                    <button
                      onClick={() => handleRebuild(sym.id)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-[#0A0A0A] border border-slate-700 hover:border-indigo-500 hover:text-indigo-400 rounded transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className="w-3 h-3" /> Rebuild Aggregations
                    </button>
                 </div>

                 <div className="space-y-2">
                    {['M1', 'M5', 'M15', 'H1', 'H4', 'D1'].map(tf => (
                       <div key={tf} className="flex items-center justify-between bg-[#0A0A0A] p-2.5 rounded-lg border border-slate-800/50">
                          <div className="flex items-center gap-3">
                             <div className="w-8 text-xs font-bold text-slate-400">{tf}</div>
                             <div className="flex items-center gap-2 text-xs">
                                <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                                   <CheckCircle2 className="w-3 h-3" /> Healthy
                                </span>
                             </div>
                          </div>
                          <div className="text-xs text-slate-500 font-mono">
                             Last closed: {new Date().toLocaleTimeString()}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           ))}
        </div>
      ) : activeTab === 'jobs' ? (
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
                    <span className="font-mono text-sm text-slate-300 font-bold">{job.job_type}</span>
                    <div className="text-xs text-indigo-400 mt-0.5">Target TF: {job.timeframe} <ArrowRight className="inline w-3 h-3 mx-1" /> Source TF: {job.source_timeframe}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-slate-400">{new Date(job.start_time).toLocaleString()}</div>
                    <div className="text-xs text-slate-400">{new Date(job.end_time).toLocaleString()}</div>
                  </td>
                  <td className="p-4 text-sm text-slate-300">
                     <div>{job.records_processed} processed</div>
                     <div className="text-xs text-emerald-400">{job.records_created} created</div>
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
      ) : (
        <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1A1A1A] border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                <th className="p-4 font-medium">Time / Target</th>
                <th className="p-4 font-medium">Anomaly Type</th>
                <th className="p-4 font-medium">Description</th>
                <th className="p-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {anomalies.map(ano => (
                <tr key={ano.id} className="hover:bg-[#1A1A1A]/50 transition-colors">
                  <td className="p-4">
                    <div className="text-sm font-bold text-slate-200">Symbol ID: {ano.symbol_id}</div>
                    <div className="text-xs font-mono text-slate-500 mt-0.5">{ano.timeframe} @ {new Date(ano.candle_time).toLocaleTimeString()}</div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wider ${ano.severity === 'HIGH' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                       {ano.anomaly_type}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-300">
                    {ano.description}
                  </td>
                  <td className="p-4 text-right">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block ${ano.resolution_status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-500'}`}>
                      {ano.resolution_status}
                    </span>
                  </td>
                </tr>
              ))}
              {anomalies.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">No anomalies detected. Data is clean.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
