'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, CheckSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';

export default function ComplianceGatePage() {
  const [missingDocs, setMissingDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [agreed, setAgreed] = useState<Record<number, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/compliance/status/me')
      .then(res => res.json())
      .then(data => {
         if (data.data && data.data.missingDocuments) {
            // only require GENERAL_RISK_DISCLOSURE or docs that gate everything.
            // But let's ask them to accept all active ones they are missing.
            setMissingDocs(data.data.missingDocuments);
         }
         setLoading(false);
      })
      .catch(e => {
         console.error(e);
         setLoading(false);
      });
  }, []);

  const handleAccept = async () => {
    setSubmitting(true);
    try {
      await fetch('/api/compliance/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_ids: missingDocs.map(d => d.id),
          ip_address: '192.168.1.1', // Mock
          device_info: navigator.userAgent
        })
      });
      router.push('/dashboard');
    } catch(e) {
      console.error(e);
      setSubmitting(false);
    }
  };

  const allAgreed = missingDocs.length > 0 && missingDocs.every(d => agreed[d.id]);

  if (loading) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-8"><div className="animate-pulse flex flex-col items-center"><ShieldAlert className="w-12 h-12 text-slate-800 mb-4" /><div className="h-4 w-32 bg-slate-800 rounded"></div></div></div>;

  if (missingDocs.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-8">
        <ShieldCheck className="w-16 h-16 text-emerald-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-100">You are fully compliant.</h1>
        <button onClick={() => router.push('/dashboard')} className="mt-6 px-6 py-2 bg-emerald-500 text-slate-900 font-medium rounded-lg">Go to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-16 px-4 md:px-8">
       <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 mb-4">
                <ShieldAlert className="w-8 h-8 text-amber-500" />
             </div>
             <h1 className="text-3xl font-bold text-slate-100">Mandatory Compliance Review</h1>
             <p className="text-slate-400 mt-3 text-lg">Before accessing trading functionality, you must read and accept the following risk disclosures and agreements.</p>
          </div>

          <div className="space-y-8">
            {missingDocs.map((doc, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={doc.id} 
                className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden"
              >
                <div className="bg-[#1A1A1A] p-5 border-b border-slate-800">
                  <h2 className="text-xl font-bold text-slate-200">{doc.title}</h2>
                  <div className="text-sm font-mono text-slate-500 mt-1">Version {doc.version} &bull; {doc.document_type}</div>
                </div>
                
                <div className="p-5 bg-[#0F0F0F] max-h-[300px] overflow-y-auto border-b border-slate-800">
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{doc.content}</p>
                </div>

                <div className="p-5 bg-amber-500/5">
                  <p className="text-amber-500 font-medium mb-3 text-sm uppercase tracking-wider">Highlight Summary</p>
                  <p className="text-slate-300 text-sm mb-5">{doc.summary}</p>
                  
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${agreed[doc.id] ? 'bg-amber-500 border-amber-500' : 'bg-[#0A0A0A] border-slate-700 group-hover:border-amber-500'}`}>
                      {agreed[doc.id] && <CheckSquare className="w-3.5 h-3.5 text-slate-900" />}
                    </div>
                    <span className="text-sm text-slate-400 select-none">
                      I have read, understood, and accept the terms of the <strong className="text-slate-200">{doc.title}</strong>. I acknowledge the risks involved.
                    </span>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={!!agreed[doc.id]} 
                      onChange={(e) => setAgreed(prev => ({...prev, [doc.id]: e.target.checked}))} 
                    />
                  </label>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-[#141414] border border-slate-800 rounded-xl">
             <p className="text-slate-500 text-sm text-center sm:text-left">
               By clicking Accept & Continue, your digital signature, IP address, and timestamp will be recorded for audit purposes.
             </p>
             <button
               disabled={!allAgreed || submitting}
               onClick={handleAccept}
               className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-amber-500 text-slate-900 font-bold rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
             >
               {submitting ? 'Recording...' : 'Accept & Continue'} <ArrowRight className="w-4 h-4" />
             </button>
          </div>
       </div>
    </div>
  );
}
