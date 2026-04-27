'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, ToggleRight, ShieldAlert, ListChecks, History, RotateCcw, 
  Check, X, AlertTriangle, Play, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Environment = { id: number; environment_key: string; environment_name: string; is_active: number; };
type FeatureFlag = { id: number; flag_key: string; flag_name: string; description: string; module_name: string; environment: string; is_enabled: number; risk_level: string; requires_approval: number; current_value: number; default_value: number; };
type RuntimeConfig = { id: number; config_key: string; config_name: string; config_value: string; module_name: string; environment: string; risk_level: string; requires_approval: number; };
type ApprovalReq = { id: number; config_key: string; requested_value: string; requested_by: string; approval_status: string; request_reason: string; requested_at: string; };
type ChangeLog = { id: number; config_key: string; previous_value: string; new_value: string; changed_by: string; change_reason: string; environment: string; approval_status: string; created_at: string; };

export default function ConfigDashboardPage() {
  const [envs, setEnvs] = useState<Environment[]>([]);
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [configs, setConfigs] = useState<RuntimeConfig[]>([]);
  const [approvals, setApprovals] = useState<ApprovalReq[]>([]);
  const [logs, setLogs] = useState<ChangeLog[]>([]);

  const [activeTab, setActiveTab] = useState('flags');
  const [selectedEnv, setSelectedEnv] = useState('PRODUCTION_LIVE');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [editItem, setEditItem] = useState<any>(null);
  const [editComment, setEditComment] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [_env, _flag, _conf, _appr, _log] = await Promise.all([
        fetch('/api/config/environment').then(res => res.json()),
        fetch('/api/config/feature-flags').then(res => res.json()),
        fetch('/api/config/runtime').then(res => res.json()),
        fetch('/api/config/approval-requests').then(res => res.json()),
        fetch('/api/config/change-logs').then(res => res.json())
      ]);
      if (_env.data) setEnvs(_env.data);
      if (_flag.data) setFlags(_flag.data);
      if (_conf.data) setConfigs(_conf.data);
      if (_appr.data) setApprovals(_appr.data);
      if (_log.data) setLogs(_log.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const filteredFlags = flags.filter(f => f.environment === selectedEnv);
  const filteredConfigs = configs.filter(c => c.environment === selectedEnv);

  const handleUpdateFlag = async (val: number) => {
    if (!editItem) return;
    try {
      await fetch(`/api/config/feature-flags/${editItem.flag_key}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_enabled: val, current_value: val, change_reason: editComment })
      });
      setEditItem(null);
      setEditComment('');
      fetchData();
    } catch (e) {
       console.error("Error updating flag");
    }
  };

  const handleUpdateConfig = async (val: string) => {
    if (!editItem) return;
    try {
      await fetch(`/api/config/runtime/${editItem.config_key}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config_value: val, change_reason: editComment })
      });
      setEditItem(null);
      setEditComment('');
      fetchData();
    } catch (e) {
      console.error("Error updating config");
    }
  };

  const handleApproveReject = async (id: number, action: 'APPROVE'|'REJECT') => {
    try {
      await fetch(`/api/config/approval-requests/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, comment: `${action} by SuperAdmin` })
      });
      fetchData();
    } catch (e) {
       console.error(e);
    }
  };

  const handleRollback = async (id: number) => {
    try {
      await fetch(`/api/config/rollback/${id}`, { method: 'POST' });
      fetchData();
    } catch (e) {
       console.error(e);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'CRITICAL': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'HIGH': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'MEDIUM': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-700/50';
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto pb-40">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <Settings className="w-8 h-8 text-amber-500" />
            Configuration & Feature Flags
          </h1>
          <p className="text-slate-400 mt-2">Manage runtime environments, strategy logic, risk overrides, and approval workflows.</p>
        </div>
        
        <div className="bg-[#0F0F0F] border border-slate-800 rounded-lg p-1.5 flex gap-1 shadow-inner">
          {envs.map(env => (
            <button
              key={env.environment_key}
              onClick={() => setSelectedEnv(env.environment_key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                selectedEnv === env.environment_key 
                  ? 'bg-slate-800 text-amber-500 shadow-sm border border-slate-700' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-[#1A1A1A]'
              }`}
            >
              {env.environment_name}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 mb-6 gap-6">
        <button 
          onClick={() => setActiveTab('flags')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'flags' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <div className="flex items-center gap-2"><ToggleRight className="w-4 h-4" /> Feature Flags</div>
        </button>
        <button 
          onClick={() => setActiveTab('configs')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'configs' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <div className="flex items-center gap-2"><Settings className="w-4 h-4" /> Runtime Configs</div>
        </button>
        <button 
          onClick={() => setActiveTab('approvals')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'approvals' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <div className="flex items-center gap-2">
            <ListChecks className="w-4 h-4" /> Pending Approvals
            {approvals.filter(a => a.approval_status === 'PENDING_APPROVAL').length > 0 && (
              <span className="bg-amber-500 text-slate-900 text-[10px] font-bold px-1.5 rounded-full ml-1">
                {approvals.filter(a => a.approval_status === 'PENDING_APPROVAL').length}
              </span>
            )}
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('logs')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'logs' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <div className="flex items-center gap-2"><History className="w-4 h-4" /> Change History</div>
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
           {[1,2,3].map(i => <div key={i} className="h-20 bg-[#141414] rounded-xl border border-slate-800" />)}
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === 'flags' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredFlags.map(flag => (
                <div key={flag.flag_key} className="bg-[#141414] border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                         {flag.flag_name}
                         {flag.requires_approval === 1 && (
                           <ShieldAlert className="w-4 h-4 text-amber-500" />
                         )}
                       </h3>
                       <p className="text-sm text-slate-500 mt-1">{flag.description}</p>
                     </div>
                     <span className={`text-xs px-2 py-1 rounded-md border font-medium whitespace-nowrap ${getRiskColor(flag.risk_level)}`}>
                       {flag.risk_level} RISK
                     </span>
                   </div>
                   <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50">
                     <span className="text-xs text-slate-500 font-mono">{flag.module_name} &bull; {flag.flag_key}</span>
                     <button
                        onClick={() => setEditItem({ ...flag, type: 'FLAG' })}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                          flag.is_enabled 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                            : 'bg-[#1A1A1A] text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-300'
                        }`}
                     >
                        {flag.is_enabled ? 'ENABLED' : 'DISABLED'}
                     </button>
                   </div>
                </div>
              ))}
              {filteredFlags.length === 0 && <div className="text-slate-500 p-8 col-span-full text-center border border-dashed border-slate-800 rounded-xl">No feature flags found for this environment.</div>}
            </div>
          )}

          {activeTab === 'configs' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredConfigs.map(config => (
                <div key={config.config_key} className="bg-[#141414] border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                         {config.config_name}
                         {config.requires_approval === 1 && (
                           <ShieldAlert className="w-4 h-4 text-amber-500" />
                         )}
                       </h3>
                       <span className="text-xs text-slate-500 font-mono mt-1 block">{config.module_name} &bull; {config.config_key}</span>
                     </div>
                     <span className={`text-xs px-2 py-1 rounded-md border font-medium whitespace-nowrap ${getRiskColor(config.risk_level)}`}>
                       {config.risk_level} RISK
                     </span>
                   </div>
                   <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50">
                     <div className="bg-[#0A0A0A] px-3 py-1.5 rounded border border-slate-800">
                        <span className="text-slate-300 font-mono font-medium">{config.config_value}</span>
                     </div>
                     <button
                        onClick={() => setEditItem({ ...config, type: 'CONFIG', edit_val: config.config_value })}
                        className="px-4 py-1.5 rounded-md text-sm font-medium border bg-[#1A1A1A] text-amber-500 border-slate-700 hover:border-amber-500/50 hover:bg-[#2A2A2A] transition-colors"
                     >
                        Edit Value
                     </button>
                   </div>
                </div>
              ))}
              {filteredConfigs.length === 0 && <div className="text-slate-500 p-8 col-span-full text-center border border-dashed border-slate-800 rounded-xl">No configs found for this environment.</div>}
            </div>
          )}

          {activeTab === 'approvals' && (
            <div className="space-y-4">
              {approvals.length === 0 ? (
                <div className="text-slate-500 p-8 text-center border border-dashed border-slate-800 rounded-xl">No approval requests historically.</div>
              ) : (
                approvals.map(req => (
                  <div key={req.id} className="bg-[#141414] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                         <h3 className="text-slate-200 font-semibold font-mono">{req.config_key}</h3>
                         <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                           req.approval_status === 'PENDING_APPROVAL' ? 'bg-amber-500/20 text-amber-500' :
                           req.approval_status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'
                         }`}>
                           {req.approval_status}
                         </span>
                      </div>
                      <p className="text-sm text-slate-400 mt-2">Requested Value: <span className="text-slate-200 font-mono bg-slate-800 px-1 rounded">{req.requested_value}</span></p>
                      <p className="text-sm text-slate-500 mt-1">Reason: "{req.request_reason}" &bull; User: {req.requested_by}</p>
                    </div>
                    {req.approval_status === 'PENDING_APPROVAL' && (
                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <button onClick={() => handleApproveReject(req.id, 'APPROVE')} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-md hover:bg-emerald-500/20 transition-colors">
                          <Check className="w-4 h-4" /> Approve
                        </button>
                        <button onClick={() => handleApproveReject(req.id, 'REJECT')} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-md hover:bg-red-500/20 transition-colors">
                          <X className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              {logs.filter(l => l.environment === selectedEnv).length === 0 ? (
                <div className="text-slate-500 p-8 text-center border border-dashed border-slate-800 rounded-xl">No change logs for this environment.</div>
              ) : (
                <div className="bg-[#141414] border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1A1A1A] border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                        <th className="p-4 font-medium">Config / Flag</th>
                        <th className="p-4 font-medium">Change</th>
                        <th className="p-4 font-medium">User & Reason</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {logs.filter(l => l.environment === selectedEnv).map(log => (
                        <tr key={log.id} className="hover:bg-[#1A1A1A]/50 transition-colors">
                          <td className="p-4">
                            <span className="font-mono text-sm text-slate-300">{log.config_key}</span>
                            <div className="text-xs text-slate-500 mt-1">{new Date(log.created_at).toLocaleString()}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-red-400 line-through truncate max-w-[100px]" title={log.previous_value}>{log.previous_value}</span>
                              <span className="text-slate-600">&rarr;</span>
                              <span className="text-emerald-400 truncate max-w-[100px]" title={log.new_value}>{log.new_value}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-slate-300">{log.changed_by}</div>
                            <div className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px]" title={log.change_reason}>{log.change_reason}</div>
                          </td>
                          <td className="p-4">
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                              log.approval_status === 'APPLIED' ? 'bg-emerald-500/20 text-emerald-400' :
                              log.approval_status === 'PENDING_APPROVAL' ? 'bg-amber-500/20 text-amber-400' :
                              log.approval_status === 'ROLLED_BACK' ? 'bg-slate-700 text-slate-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {log.approval_status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                             {log.approval_status === 'APPLIED' && (
                               <button 
                                 onClick={() => handleRollback(log.id)}
                                 className="p-2 bg-slate-800 text-slate-400 hover:text-red-400 rounded transition-colors"
                                 title="Rollback this change"
                               >
                                 <RotateCcw className="w-4 h-4" />
                               </button>
                             )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editItem && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#141414] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-800">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-amber-500" />
                  Modify {editItem.type === 'FLAG' ? 'Feature Flag' : 'Configuration'}
                </h3>
                <p className="text-slate-400 text-sm mt-1 font-mono">{editItem.flag_key || editItem.config_key}</p>
              </div>

              <div className="p-6 space-y-5">
                {editItem.requires_approval === 1 && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex gap-3 text-amber-500 text-sm">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <p>This is a high-risk setting that requires Super Administrator approval. A request will be generated.</p>
                  </div>
                )}

                {editItem.type === 'FLAG' ? (
                  <div className="bg-[#1A1A1A] p-4 rounded-lg flex items-center justify-between border border-slate-800">
                     <span className="text-slate-300 font-medium">Flag Status</span>
                     <button
                        onClick={() => setEditItem({ ...editItem, is_enabled: editItem.is_enabled ? 0 : 1 })}
                        className={`px-6 py-2 rounded-md font-bold transition-colors ${
                          editItem.is_enabled 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-red-500/20 text-red-500 border border-red-500/30'
                        }`}
                     >
                       {editItem.is_enabled ? 'ENABLED' : 'DISABLED'}
                     </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">New Value ({editItem.data_type})</label>
                    <input 
                      type="text"
                      className="w-full bg-[#0A0A0A] border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-amber-500 transition-colors font-mono"
                      value={editItem.edit_val}
                      onChange={(e) => setEditItem({ ...editItem, edit_val: e.target.value })}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Reason for Change <span className="text-red-500">*</span></label>
                  <textarea 
                    className="w-full bg-[#0A0A0A] border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-amber-500 transition-colors min-h-[100px] resize-none text-sm"
                    placeholder="Provide a mandatory reason for the audit log..."
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-6 border-t border-slate-800 bg-[#0F0F0F] flex justify-end gap-3">
                <button 
                  onClick={() => { setEditItem(null); setEditComment(''); }}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-[#1A1A1A] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  disabled={!editComment.trim()}
                  onClick={() => editItem.type === 'FLAG' ? handleUpdateFlag(editItem.is_enabled) : handleUpdateConfig(editItem.edit_val)}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium bg-amber-500 text-slate-900 hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {editItem.requires_approval === 1 ? 'Submit for Approval' : 'Apply Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
