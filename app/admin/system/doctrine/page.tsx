'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, Lock, ShieldCheck, FileKey, Info, Edit2, Settings } from 'lucide-react';

interface Doctrine {
  id: number;
  doctrine_key: string;
  doctrine_name: string;
  description: string;
  is_active: number;
}

interface OperatingRule {
  id: number;
  rule_key: string;
  rule_name: string;
  rule_value: string;
  rule_type: string;
  description: string;
  is_enforced: number;
}

interface AuditLog {
  id: number;
  action: string;
  resource: string;
  resource_id: string;
  details: string;
  user: string;
  created_at: string;
}

export default function DoctrinePage() {
  const [doctrines, setDoctrines] = useState<Doctrine[]>([]);
  const [rules, setRules] = useState<OperatingRule[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [editingRule, setEditingRule] = useState<OperatingRule | null>(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(true);
  // TODO: Replace with real authentication/authorization
  const isAdmin = true;

  // Map Google Sheets rows to objects using known headers
  const mapDoctrineRows = (rows: any[][]): Doctrine[] => rows.map(row => ({
    id: Number(row[0]),
    doctrine_key: row[1],
    doctrine_name: row[2],
    description: row[3],
    is_active: Number(row[4]),
  }));
  const mapRuleRows = (rows: any[][]): OperatingRule[] => rows.map(row => ({
    id: Number(row[0]),
    rule_key: row[1],
    rule_name: row[2],
    rule_value: row[3],
    rule_type: row[4],
    description: row[5],
    is_enforced: Number(row[6]),
  }));
  const mapAuditRows = (rows: any[][]): AuditLog[] => rows.map(row => ({
    id: Number(row[0]),
    action: row[1],
    resource: row[2],
    resource_id: row[3],
    details: row[4],
    user: row[5],
    created_at: row[6],
  }));

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resDocs, resRules, resLogs] = await Promise.all([
        fetch('/api/system/doctrines').then(res => res.json()),
        fetch('/api/system/operating-rules').then(res => res.json()),
        fetch('/api/system/audit-logs').then(res => res.json()),
      ]);
      setDoctrines(mapDoctrineRows(resDocs.data || []));
      setRules(mapRuleRows(resRules.data || []));
      setLogs(mapAuditRows(resLogs.data || []));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const saveRule = async () => {
    if (!editingRule) return;
    try {
      await fetch(`/api/system/operating-rules/${editingRule.rule_key}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: editValue }),
      });
      setEditingRule(null);
      fetchData(); // Refresh everything
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Initializing Cacsms ProTrader interface...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Overview Block */}
      <div className="bg-[#15151A] rounded-xl border border-[#2A2A35] p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="relative">
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            System Vision, Trading Philosophy & Operational Doctrine
          </h1>
          <p className="text-slate-400 max-w-3xl leading-relaxed">
            The foundational doctrine module for Cacsms ProTrader. This sets the operating principles that prioritize capital preservation over trade frequency. The platform operates as a disciplined professional trading support system—multiple independent strategy engines reading shared market data, governed by strict execution and risk constraints.
          </p>
        </div>
      </div>

      {/* Grid Layout: Rules & Doctrines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Active Doctrines */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <FileKey className="w-5 h-5 text-indigo-400" /> Active System Doctrines
          </h2>
          <div className="space-y-3">
            {doctrines.map((doc) => (
              <div key={doc.id} className="bg-[#15151A] border border-[#2A2A35] p-4 rounded-lg flex items-start gap-4 hover:border-[#3A3A45] transition-colors">
                <div className="mt-1">
                  <ShieldCheck className="w-5 h-5 text-emerald-500/80" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm mb-1">{doc.doctrine_name}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{doc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Operating Rules */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" /> Executive Operating Rules
          </h2>
          <div className="bg-[#15151A] border border-[#2A2A35] rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#1A1A24] border-b border-[#2A2A35]">
                  <th className="py-3 px-4 font-medium text-slate-300 w-1/2">Rule Parameter</th>
                  <th className="py-3 px-4 font-medium text-slate-300 w-1/4">Enforced Value</th>
                  <th className="py-3 px-4 font-medium text-slate-300 w-1/4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.id} className="border-b border-[#2A2A35]/50 last:border-0 hover:bg-[#1A1A24]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {rule.rule_key === 'FORCED_TRADING_ENABLED' && <ShieldAlert className="w-4 h-4 text-rose-500" />}
                        <span className="text-slate-200 font-medium">{rule.rule_name}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 max-w-[280px]">{rule.description}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono text-emerald-400 bg-emerald-400/5 px-2 py-1 rounded w-max text-xs border border-emerald-400/10">
                        {rule.rule_value}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isAdmin && (
                        <button 
                          onClick={() => { setEditingRule(rule); setEditValue(rule.rule_value); }}
                          className="p-1.5 text-slate-400 hover:text-white bg-[#222] hover:bg-[#333] rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex gap-3 text-amber-500 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <p><strong>Warning:</strong> Modifying operational bounds immediately affects all active strategy engines. Adjustments to critical constraints (like Forced Trading or Maximum Positions) are strictly audit-logged.</p>
          </div>
        </section>

      </div>

      {/* Recent Audit Logs */}
      <section className="space-y-4 pt-6">
         <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-400" /> Security & Governance Audit Log
          </h2>
          <div className="bg-[#15151A] border border-[#2A2A35] rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-[#1A1A24] border-b border-[#2A2A35]">
                <tr>
                  <th className="py-2.5 px-4 font-medium text-slate-400 w-48">Timestamp</th>
                  <th className="py-2.5 px-4 font-medium text-slate-400 w-48">Action</th>
                  <th className="py-2.5 px-4 font-medium text-slate-400">Details</th>
                  <th className="py-2.5 px-4 font-medium text-slate-400 w-32">User</th>
                </tr>
              </thead>
               <tbody className="font-mono text-xs text-slate-300">
                {logs.length > 0 ? logs.map((log) => (
                  <tr key={log.id} className="border-b border-[#2A2A35]/30 last:border-0 hover:bg-[#1A1A24]/30">
                    <td className="py-2 px-4 whitespace-nowrap text-slate-500">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-2 px-4">{log.action}</td>
                    <td className="py-2 px-4 text-slate-400">{log.details}</td>
                    <td className="py-2 px-4">{log.user}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="py-8 px-4 text-center text-slate-500 font-sans">
                      No audit logs found. System is running on initial doctrine.
                    </td>
                  </tr>
                )}
               </tbody>
            </table>
          </div>
      </section>

      {/* Edit Modal Component */}
      {editingRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#15151A] border border-[#2A2A35] rounded-xl w-full max-w-md shadow-2xl relative">
            <div className="p-5 border-b border-[#2A2A35] flex items-center gap-3">
              <Lock className="w-5 h-5 text-rose-500" />
              <h3 className="font-medium text-white">Override System Rule</h3>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Rule Parameter</label>
                <div className="text-white font-medium">{editingRule.rule_name}</div>
                <div className="text-xs text-slate-500 mt-1">{editingRule.description}</div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">New Enforced Value</label>
                <input 
                  type="text" 
                  className="w-full bg-[#0A0A0E] border border-[#333] rounded-md px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-emerald-500"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
              </div>

              <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-md text-xs text-rose-400 mt-4 leading-relaxed">
                By confirming this change, you are bypassing the baseline system doctrine. This action will be permanently recorded in the governance audit log.
              </div>
            </div>

            <div className="p-5 border-t border-[#2A2A35] flex justify-end gap-3">
              <button 
                onClick={() => setEditingRule(null)}
                className="px-4 py-2 rounded-md font-medium text-sm text-slate-300 hover:text-white hover:bg-[#2A2A35] transition-colors"
              >
                Cancel Override
              </button>
              <button 
                onClick={saveRule}
                className="px-4 py-2 rounded-md font-medium text-sm bg-rose-500 hover:bg-rose-600 text-white transition-colors shadow-[0_0_15px_rgba(244,63,94,0.4)]"
              >
                Confirm & Log Change
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
