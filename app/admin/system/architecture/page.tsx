'use client';

import { useState, useEffect } from 'react';
import { Layers, Activity, Server, Radio, Database, ShieldAlert, Cpu } from 'lucide-react';

interface SystemService {
  id: number;
  service_key: string;
  service_name: string;
  description: string;
  status: string;
  health_status: string;
}

interface SystemEvent {
  id: number;
  event_type: string;
  source_module: string;
  payload_json: string;
  status: string;
  created_at: string;
}

export default function ArchitecturePage() {
  const [arch, setArch] = useState<any>(null);
  const [services, setServices] = useState<SystemService[]>([]);
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resArch, resSvc, resEv] = await Promise.all([
        fetch('/api/system/architecture').then(res => res.json()),
        fetch('/api/system/services').then(res => res.json()),
        fetch('/api/system/events').then(res => res.json()),
      ]);
      setArch(resArch.data || null);
      setServices(resSvc.data || []);
      setEvents(resEv.data || []);
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

  const publishTestEvent = async () => {
    try {
      await fetch('/api/system/events/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'MarketTickReceived',
          source_module: 'mt5_bridge_service',
          payload_json: JSON.stringify({ symbol: 'EURUSD', bid: 1.1023, ask: 1.1024 })
        })
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  }

  if (loading) return <div className="p-8 text-slate-500">Scanning Topologies...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Overview Block */}
      <div className="bg-[#15151A] rounded-xl border border-[#2A2A35] p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="relative flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <Layers className="w-6 h-6 text-indigo-400" />
              System Architecture & Infrastructure
            </h1>
            <p className="text-slate-400 max-w-3xl leading-relaxed">
              Provides near real-time visibility into the Cacsms ProTrader service mesh. The platform is designed using a multi-engine, single shared-layer topology to enforce strategy isolation and centralized execution governance.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-[#0A0A0E] border border-[#2A2A35] rounded-lg px-4 py-3 flex flex-col items-center">
              <span className="text-xs text-slate-500 font-medium uppercase mb-1">Environment</span>
              <span className="text-sm font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">{arch?.currentEnvironment}</span>
            </div>
             <div className="bg-[#0A0A0E] border border-[#2A2A35] rounded-lg px-4 py-3 flex flex-col items-center">
              <span className="text-xs text-slate-500 font-medium uppercase mb-1">Execution Mode</span>
              <span className="text-sm font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{arch?.executionMode}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Core Topology */}
        <section className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-400" /> Active System Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((svc) => (
              <div key={svc.id} className="bg-[#15151A] border border-[#2A2A35] p-5 rounded-xl hover:border-indigo-500/30 transition-colors">
                <div className="flex justify-between items-start mb-3">
                   <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-indigo-400" />
                      <h3 className="text-white font-medium text-sm">{svc.service_name}</h3>
                   </div>
                   <div className={`px-2 py-0.5 rounded text-xs font-semibold ${svc.health_status === 'HEALTHY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                     {svc.health_status}
                   </div>
                </div>
                <div className="text-xs font-mono text-slate-500 mb-2 truncate">ID: {svc.service_key}</div>
                <p className="text-xs text-slate-400 leading-relaxed min-h-[40px]">{svc.description}</p>
                
                <div className="mt-4 pt-3 border-t border-[#2A2A35] flex items-center justify-between">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wide">Status</div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className={`w-1.5 h-1.5 rounded-full ${svc.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                    <span className="text-slate-300">{svc.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Security & Guards */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" /> Architecture Constraints
          </h2>
          <div className="bg-[#15151A] border border-[#2A2A35] rounded-xl p-5 space-y-5">
            <div>
              <div className="text-sm text-slate-300 font-medium mb-2 border-b border-[#2A2A35] pb-2">Trading Engines</div>
              {arch?.strategyEngines.map((engine: any) => (
                <div key={engine.id} className="flex justify-between items-center text-xs py-1.5 border-b border-[#2A2A35]/30 last:border-0">
                  <span className="text-slate-400">{engine.id.replace('_', ' ')}</span>
                  <div className="flex items-center gap-2">
                    {engine.directExecution ? 
                      <span className="text-rose-400">Direct Exec: TRUE</span> : 
                      <span className="text-emerald-400 opacity-80 border border-emerald-500/20 px-1.5 rounded">Direct Exec: FALSE (Isolated)</span>
                    }
                  </div>
                </div>
              ))}
            </div>

            <div>
               <div className="text-sm text-slate-300 font-medium mb-2 border-b border-[#2A2A35] pb-2">Centralized Risk Layer</div>
               <ul className="text-xs text-slate-400 space-y-2">
                 {arch?.centralizedRiskEngine.enforcements.map((enf: string, i: number) => (
                   <li key={i} className="flex items-center gap-2">
                     <div className="w-1 h-1 bg-indigo-500 rounded-full" /> {enf}
                   </li>
                 ))}
               </ul>
            </div>
             <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-md text-xs text-rose-400 leading-relaxed">
              Direct execution by strategy sub-modules is strictly forbidden by the underlying service architecture. All outputs are channeled into the Risk/Execution governance layer.
            </div>
          </div>
        </section>

      </div>

      {/* Event Bus stream */}
      <section className="space-y-4 pt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-indigo-400" /> Active Event Bus (Recent 10)
          </h2>
          <button 
            onClick={publishTestEvent}
            className="text-xs bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded transition-colors shadow-lg shadow-indigo-500/20"
          >
            Publish Mock Tick
          </button>
        </div>
        
        <div className="bg-[#15151A] border border-[#2A2A35] rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-[#1A1A24] border-b border-[#2A2A35]">
              <tr>
                <th className="py-2.5 px-4 font-medium text-slate-400 w-48">Timestamp</th>
                <th className="py-2.5 px-4 font-medium text-slate-400 w-48">Event Type</th>
                <th className="py-2.5 px-4 font-medium text-slate-400 w-48">Source Component</th>
                <th className="py-2.5 px-4 font-medium text-slate-400">Payload / Status</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs text-slate-300">
              {events.length > 0 ? events.slice(0, 10).map((ev) => (
                <tr key={ev.id} className="border-b border-[#2A2A35]/30 last:border-0 hover:bg-[#1A1A24]/30">
                  <td className="py-2 px-4 whitespace-nowrap text-slate-500">
                    {new Date(ev.created_at).toISOString().split('T')[1].replace('Z', '')}
                  </td>
                  <td className="py-2 px-4 text-indigo-400">{ev.event_type}</td>
                  <td className="py-2 px-4 text-slate-400">{ev.source_module}</td>
                  <td className="py-2 px-4">
                    <div className="flex flex-col gap-1 text-slate-500 truncate max-w-xl">
                      {ev.payload_json}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="py-8 px-4 text-center text-slate-500 font-sans">
                    Event bus idle. No messages in queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
