'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, Shield, FileCheck, History, Plus, AlertTriangle, 
  CheckCircle2, XCircle, FileSignature, UploadCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Document = {
  id: number;
  document_type: string;
  title: string;
  version: string;
  content: string;
  summary: string;
  is_active: number;
  requires_reacceptance: number;
  approval_status: string;
  created_by: string;
  approved_by: string | null;
  effective_at: string | null;
  created_at: string;
};

type Acceptance = {
  id: number;
  user_id: string;
  document_type: string;
  document_version: string;
  accepted_at: string;
  ip_address: string;
  device_info: string;
  is_current: number;
};

export default function ComplianceAdminPage() {
  const [activeTab, setActiveTab] = useState('documents');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [history, setHistory] = useState<Acceptance[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: '',
    document_type: 'GENERAL_RISK_DISCLOSURE',
    version: '1.0',
    summary: '',
    content: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [docsData, historyData] = await Promise.all([
        fetch('/api/compliance/documents').then(res => res.json()),
        fetch('/api/compliance/acceptance-history').then(res => res.json())
      ]);
      if (docsData.data) setDocuments(docsData.data);
      if (historyData.data) setHistory(historyData.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleCreateDraft = async () => {
    try {
      await fetch('/api/compliance/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDoc)
      });
      setShowModal(false);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleApprove = async (id: number) => {
    try {
      await fetch(`/api/compliance/documents/${id}/approve`, { method: 'POST' });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleActivate = async (id: number, requiresReacceptance: boolean) => {
    try {
      await fetch(`/api/compliance/documents/${id}/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requires_reacceptance: requiresReacceptance })
      });
      fetchData();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto pb-40">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <Shield className="w-8 h-8 text-emerald-500" />
            Compliance & Legal Governance
          </h1>
          <p className="text-slate-400 mt-2">Manage risk disclaimers, consents, and view user acceptance audit logs.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Document Draft
        </button>
      </div>

      <div className="flex border-b border-slate-800 mb-6 gap-6">
        <button 
          onClick={() => setActiveTab('documents')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'documents' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> Document Registry</div>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'history' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <div className="flex items-center gap-2"><History className="w-4 h-4" /> Acceptance Audit Log</div>
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
           {[1,2,3].map(i => <div key={i} className="h-20 bg-[#141414] rounded-xl border border-slate-800" />)}
        </div>
      ) : activeTab === 'documents' ? (
        <div className="space-y-4">
          {documents.slice().sort((a,b) => b.id - a.id).map(doc => (
            <div key={doc.id} className={`bg-[#141414] border ${doc.is_active ? 'border-emerald-500/50' : 'border-slate-800'} rounded-xl p-5 hover:border-slate-700 transition-colors`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <FileSignature className={`w-6 h-6 ${doc.is_active ? 'text-emerald-500' : 'text-slate-500'}`} />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-200">
                      {doc.title} <span className="text-slate-500 font-normal ml-2">v{doc.version}</span>
                    </h3>
                    <p className="text-sm text-slate-500 font-mono mt-1">{doc.document_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <span className={`text-xs px-2 py-1 rounded border font-medium ${
                     doc.approval_status === 'APPROVED' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                   }`}>
                     {doc.approval_status}
                   </span>
                   {doc.is_active === 1 && (
                     <span className="text-xs px-2 py-1 rounded border font-medium bg-emerald-500/10 text-emerald-400 border-emerald-500/20 flex items-center gap-1">
                       <CheckCircle2 className="w-3 h-3" /> ACTIVE
                     </span>
                   )}
                </div>
              </div>
              <div className="bg-[#0A0A0A] p-4 rounded-lg border border-slate-800 text-sm text-slate-400 mb-4 line-clamp-2">
                {doc.content}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Created by {doc.created_by} • {new Date(doc.created_at).toLocaleDateString()}
                  {doc.effective_at && ` • Effective: ${new Date(doc.effective_at).toLocaleDateString()}`}
                </div>
                <div className="flex gap-2">
                  {doc.approval_status === 'DRAFT' && (
                     <button onClick={() => handleApprove(doc.id)} className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 rounded text-sm transition-colors">
                       Approve Draft
                     </button>
                  )}
                  {doc.approval_status === 'APPROVED' && doc.is_active === 0 && (
                     <button onClick={() => handleActivate(doc.id, true)} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 rounded text-sm transition-colors flex items-center gap-1">
                       <UploadCloud className="w-4 h-4"/> Publish & Require Re-Acceptance
                     </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {documents.length === 0 && <div className="text-slate-500 text-center p-8">No documents found.</div>}
        </div>
      ) : (
        <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1A1A1A] border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                <th className="p-4 font-medium">User ID</th>
                <th className="p-4 font-medium">Document</th>
                <th className="p-4 font-medium">Device & IP</th>
                <th className="p-4 font-medium">Timestamp</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {history.map(log => (
                <tr key={log.id} className="hover:bg-[#1A1A1A]/50 transition-colors">
                  <td className="p-4">
                    <span className="font-mono text-sm text-slate-300">{log.user_id}</span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-slate-300">{log.document_type}</div>
                    <div className="text-xs text-slate-500 mt-0.5">v{log.document_version}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-slate-400">{log.ip_address}</div>
                    <div className="text-xs text-slate-500 mt-0.5 truncate max-w-[150px]" title={log.device_info}>{log.device_info}</div>
                  </td>
                  <td className="p-4 text-sm text-slate-400">
                    {new Date(log.accepted_at).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${log.is_current ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                      {log.is_current ? 'CURRENT' : 'SUPERSEDED'}
                    </span>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No acceptance records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Draft Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#141414] border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-800">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  Draft New Document
                </h3>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Document Type</label>
                    <select 
                      className="w-full bg-[#0A0A0A] border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                      value={newDoc.document_type}
                      onChange={e => setNewDoc({...newDoc, document_type: e.target.value})}
                    >
                      <option value="GENERAL_RISK_DISCLOSURE">General Risk Disclosure</option>
                      <option value="AUTO_TRADING_CONSENT">Auto-Trading Consent</option>
                      <option value="LIVE_EXECUTION_CONSENT">Live Execution Consent</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Version</label>
                    <input 
                      type="text" className="w-full bg-[#0A0A0A] border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                      value={newDoc.version} onChange={e => setNewDoc({...newDoc, version: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Title</label>
                  <input 
                    type="text" className="w-full bg-[#0A0A0A] border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                    value={newDoc.title} onChange={e => setNewDoc({...newDoc, title: e.target.value})} placeholder="e.g. Q3 2026 Updated Risk Notice"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Summary (Highlights)</label>
                  <input 
                    type="text" className="w-full bg-[#0A0A0A] border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                    value={newDoc.summary} onChange={e => setNewDoc({...newDoc, summary: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Full Content</label>
                  <textarea 
                    className="w-full bg-[#0A0A0A] border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 min-h-[150px]"
                    value={newDoc.content} onChange={e => setNewDoc({...newDoc, content: e.target.value})} placeholder="Legal prose here..."
                  />
                </div>
              </div>
              <div className="p-6 border-t border-slate-800 bg-[#0F0F0F] flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-5 py-2 text-sm font-medium text-slate-300 hover:bg-[#1A1A1A] rounded-lg transition-colors">Cancel</button>
                <button onClick={handleCreateDraft} className="px-5 py-2 text-sm font-medium bg-emerald-500 text-slate-900 hover:bg-emerald-400 rounded-lg transition-colors">Create Draft</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
