import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, CheckSquare } from 'lucide-react';

export function ComplianceConsentModal({
  isOpen,
  onClose,
  onConfirm,
  documentType
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  documentType: 'AUTO_TRADING_CONSENT' | 'LIVE_EXECUTION_CONSENT';
}) {
  const [doc, setDoc] = useState<any>(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setAgreed(false);
      setLoading(true);
      fetch('/api/compliance/documents/current')
        .then(res => res.json())
        .then(data => {
           if (data.data) {
             const found = data.data.find((d: any) => d.document_type === documentType);
             setDoc(found);
           }
           setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen, documentType]);

  const handleConfirm = async () => {
    if (!doc) return;
    try {
      await fetch('/api/compliance/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           document_ids: [doc.id],
           ip_address: '192.168.1.1',
           device_info: navigator.userAgent
        })
      });
      onConfirm();
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-[#141414] border border-amber-500/30 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-amber-500 to-red-500"></div>
          
          <div className="p-6 border-b border-slate-800 flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-6 h-6 text-amber-500" />
             </div>
             <div>
               <h3 className="text-xl font-bold text-slate-100">
                 {documentType === 'AUTO_TRADING_CONSENT' ? 'Auto-Trading Authorization' : 'Live Execution Authorization'}
               </h3>
               <p className="text-xs text-amber-500/70 uppercase tracking-widest font-bold mt-1">High Risk Action</p>
             </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="animate-pulse space-y-3">
                 <div className="h-4 bg-[#1A1A1A] rounded w-full"></div>
                 <div className="h-4 bg-[#1A1A1A] rounded w-5/6"></div>
                 <div className="h-4 bg-[#1A1A1A] rounded w-4/6"></div>
              </div>
            ) : doc ? (
              <div className="space-y-6">
                 <div className="bg-[#0A0A0A] p-4 rounded-lg border border-slate-800">
                   <p className="text-sm text-slate-300 leading-relaxed">{doc.content}</p>
                 </div>
                 
                 <label className="flex items-start gap-3 cursor-pointer group">
                    <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${agreed ? 'bg-amber-500 border-amber-500' : 'bg-[#0A0A0A] border-slate-700 group-hover:border-amber-500'}`}>
                      {agreed && <CheckSquare className="w-3.5 h-3.5 text-slate-900" />}
                    </div>
                    <span className="text-sm text-slate-400 select-none">
                      I authorize this action and accept the specific risks outlined in the <strong className="text-slate-200">{doc.title} (v{doc.version})</strong>.
                    </span>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={agreed} 
                      onChange={(e) => setAgreed(e.target.checked)} 
                    />
                  </label>
              </div>
            ) : (
              <p className="text-red-400 text-sm">Failed to load consent document. Action blocked.</p>
            )}
          </div>

          <div className="p-6 border-t border-slate-800 bg-[#0F0F0F] flex justify-end gap-3">
             <button onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-[#1A1A1A] transition-colors">
               Cancel
             </button>
             <button 
               disabled={!agreed}
               onClick={handleConfirm} 
               className="px-5 py-2 rounded-lg text-sm font-bold bg-amber-500 text-slate-900 hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
             >
               Confirm & Authorize
             </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
