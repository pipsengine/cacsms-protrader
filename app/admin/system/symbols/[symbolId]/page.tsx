'use client';

import { useState, useEffect } from 'react';
import { Target, ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function SymbolDetailPage() {
  const params = useParams();
  const [symbol, setSymbol] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/symbols/${params.symbolId}`)
      .then(res => res.json())
      .then(data => {
        if (data.data) setSymbol(data.data);
        setLoading(false);
      });
  }, [params.symbolId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/symbols/${params.symbolId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          max_allowed_spread: symbol.max_allowed_spread,
          typical_spread: symbol.typical_spread
        })
      });
    } catch(e) {
      console.error(e);
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8 animate-pulse text-slate-500">Loading Configuration...</div>;
  if (!symbol) return <div className="p-8 text-red-400">Symbol not found.</div>;

  return (
    <div className="p-8 max-w-[1200px] mx-auto pb-40">
      <Link href="/admin/system/symbols" className="text-sm text-slate-500 hover:text-slate-300 flex items-center gap-2 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Symbol Registry
      </Link>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <Target className="w-8 h-8 text-fuchsia-500" />
            {symbol.symbol_code} Configuration
          </h1>
          <p className="text-slate-400 mt-2">{symbol.display_name} ({symbol.asset_class})</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-fuchsia-500 hover:bg-fuchsia-400 text-slate-900 px-6 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-[#141414] border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-200 mb-6 border-b border-slate-800 pb-4">Master Specifications</h3>
            
            <div className="space-y-4">
               <div>
                 <label className="text-xs text-slate-500 block mb-1">Contract Size</label>
                 <input type="number" readOnly value={symbol.contract_size} className="w-full bg-[#0A0A0A] border border-slate-800 rounded px-3 py-2 text-slate-300 opacity-50" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-xs text-slate-500 block mb-1">Base Currency</label>
                   <input type="text" readOnly value={symbol.base_currency} className="w-full bg-[#0A0A0A] border border-slate-800 rounded px-3 py-2 text-slate-300 opacity-50" />
                 </div>
                 <div>
                   <label className="text-xs text-slate-500 block mb-1">Quote Currency</label>
                   <input type="text" readOnly value={symbol.quote_currency} className="w-full bg-[#0A0A0A] border border-slate-800 rounded px-3 py-2 text-slate-300 opacity-50" />
                 </div>
               </div>
               <div className="grid grid-cols-3 gap-4">
                 <div>
                   <label className="text-xs text-slate-500 block mb-1">Pip Size</label>
                   <input type="text" readOnly value={symbol.pip_size} className="w-full bg-[#0A0A0A] border border-slate-800 rounded px-3 py-2 text-slate-300 opacity-50 font-mono text-sm" />
                 </div>
                 <div>
                   <label className="text-xs text-slate-500 block mb-1">Point Size</label>
                   <input type="text" readOnly value={symbol.point_size} className="w-full bg-[#0A0A0A] border border-slate-800 rounded px-3 py-2 text-slate-300 opacity-50 font-mono text-sm" />
                 </div>
                 <div>
                   <label className="text-xs text-slate-500 block mb-1">Digits</label>
                   <input type="text" readOnly value={symbol.digits} className="w-full bg-[#0A0A0A] border border-slate-800 rounded px-3 py-2 text-slate-300 opacity-50" />
                 </div>
               </div>
            </div>
         </div>

         <div className="bg-[#141414] border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-200 mb-6 border-b border-slate-800 pb-4">Risk & Spread Rules</h3>
            
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-xs text-slate-500 block mb-1">Typical Spread (Points)</label>
                   <input type="number" value={symbol.typical_spread} onChange={e => setSymbol({...symbol, typical_spread: Number(e.target.value)})} className="w-full bg-[#0A0A0A] border border-slate-700 focus:border-fuchsia-500 rounded px-3 py-2 text-slate-100" />
                 </div>
                 <div>
                   <label className="text-xs text-slate-500 block mb-1 text-amber-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Max Tradable Spread</label>
                   <input type="number" value={symbol.max_allowed_spread} onChange={e => setSymbol({...symbol, max_allowed_spread: Number(e.target.value)})} className="w-full bg-[#0A0A0A] border border-amber-500/50 focus:border-amber-500 rounded px-3 py-2 text-amber-500" />
                   <div className="text-[10px] text-slate-500 mt-1">Trades blocked if spread exceeds this.</div>
                 </div>
               </div>
               
               <div className="grid grid-cols-3 gap-4 mt-6">
                 <div>
                   <label className="text-xs text-slate-500 block mb-1">Min Lot</label>
                   <input type="number" readOnly value={symbol.min_lot} className="w-full bg-[#0A0A0A] border border-slate-800 rounded px-3 py-2 text-slate-300 opacity-50" />
                 </div>
                 <div>
                   <label className="text-xs text-slate-500 block mb-1">Max Lot</label>
                   <input type="number" readOnly value={symbol.max_lot} className="w-full bg-[#0A0A0A] border border-slate-800 rounded px-3 py-2 text-slate-300 opacity-50" />
                 </div>
                 <div>
                   <label className="text-xs text-slate-500 block mb-1">Lot Step</label>
                   <input type="number" readOnly value={symbol.lot_step} className="w-full bg-[#0A0A0A] border border-slate-800 rounded px-3 py-2 text-slate-300 opacity-50" />
                 </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
