'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart2, ShieldAlert, CheckCircle2, AlertTriangle, 
  Settings, Clock, Activity, Target, Settings2
} from 'lucide-react';
import Link from 'next/link';

export default function SymbolsAdminPage() {
  const [symbols, setSymbols] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/symbols')
      .then(res => res.json())
      .then(data => {
        if (data.data) setSymbols(data.data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto pb-40">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <Target className="w-8 h-8 text-fuchsia-500" />
            Symbol & Instrument Configuration
          </h1>
          <p className="text-slate-400 mt-2">Manage all tradable instruments, mapping, risk rules, and strategy permissions.</p>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
           {[1,2,3].map(i => <div key={i} className="h-20 bg-[#141414] rounded-xl border border-slate-800" />)}
        </div>
      ) : (
        <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1A1A1A] border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                <th className="p-4 font-medium">Symbol</th>
                <th className="p-4 font-medium">Asset Class</th>
                <th className="p-4 font-medium">Spread (Typ/Max)</th>
                <th className="p-4 font-medium">Strategy</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {symbols.map(sym => (
                <tr key={sym.id} className="hover:bg-[#1A1A1A]/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded bg-[#0A0A0A] border border-slate-700 flex items-center justify-center font-bold text-slate-300">
                         {sym.symbol_code.substring(0,3)}
                       </div>
                       <div>
                         <span className="font-mono text-sm text-slate-300 font-bold">{sym.symbol_code}</span>
                         <div className="text-xs text-slate-500 mt-0.5">{sym.display_name}</div>
                       </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-300">
                      {sym.asset_class}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-slate-300">{sym.typical_spread} pts / <span className="text-amber-500">{sym.max_allowed_spread} pts max</span></div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                       <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${sym.analysis_enabled ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`} title="Analysis">Anl</span>
                       <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${sym.trading_enabled ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`} title="Trading">Trd</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs uppercase font-bold px-2 py-1 rounded inline-flex items-center gap-1 ${sym.status === 'CONFIG_COMPLETE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'}`}>
                      {sym.status === 'CONFIG_COMPLETE' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {sym.status.replace('CONFIG_', '')}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/system/symbols/${sym.id}`} className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-[#0A0A0A] border border-slate-700 hover:border-fuchsia-500 hover:text-fuchsia-400 rounded transition-colors inline-block">
                      Configure Settings
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
