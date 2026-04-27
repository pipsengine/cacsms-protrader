import Link from 'next/link';
import { ReactNode } from 'react';
import { Activity, Shield, Settings, FileText, Database, Layers, Cpu, Target, BarChart2, BookOpen, Clock, ShieldCheck, Compass, Waypoints, Droplet, Box, Crosshair } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0A0A0A] text-slate-300 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] border-r border-[#222] flex flex-col">
        <div className="p-6 border-b border-[#222]">
          <div className="flex items-center gap-3 text-white font-bold text-lg tracking-tight">
            <Activity className="w-6 h-6 text-emerald-500" />
            <span>Cacsms ProTrader</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">v2.4.0-Alpha • Doctrine</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          <Link href="/admin/system/doctrine" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1A1A1A] text-slate-400">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium">System Doctrine</span>
          </Link>
          <Link href="/admin/system/architecture" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1A1A1A] text-slate-400">
            <Layers className="w-4 h-4" />
            <span className="text-sm font-medium">System Architecture</span>
          </Link>
          <Link href="/admin/system/config" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1A1A1A] text-slate-400">
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Configuration & Flags</span>
          </Link>
          <Link href="/admin/system/compliance" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1A1A1A] text-slate-400">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium">Compliance & Risk</span>
          </Link>
          <Link href="/admin/system/market-data" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1A1A1A] text-slate-400">
            <Database className="w-4 h-4 text-sky-500" />
            <span className="text-sm font-medium">Market Data Warehouse</span>
          </Link>
          <Link href="/admin/system/candle-engine" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1A1A1A] text-slate-400">
            <BarChart2 className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-medium">Candle & Tick Engine</span>
          </Link>
          <Link href="/admin/system/synthetic-candles" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1A1A1A] text-slate-400">
            <BookOpen className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-medium">Synthetic Candles (H8/H12)</span>
          </Link>
          <Link href="/admin/system/session-intelligence" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1A1A1A] text-slate-400">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium">Session Intelligence</span>
          </Link>
          <Link href="/admin/system/data-quality" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1A1A1A] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium">Data Quality & Validation</span>
          </Link>
          <Link href="/admin/system/bias" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1A1A1A] text-slate-400">
            <Compass className="w-4 h-4 text-fuchsia-500" />
            <span className="text-sm font-medium">Multi-Timeframe Bias Engine</span>
          </Link>
          <Link href="/admin/system/market-structure" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1A1A1A] text-slate-400">
            <Waypoints className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-medium">Market Structure Engine</span>
          </Link>
          <Link href="/admin/system/liquidity-intelligence" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1A1A1A] text-slate-400">
            <Droplet className="w-4 h-4 text-cyan-500" />
            <span className="text-sm font-medium">Liquidity Intelligence</span>
          </Link>
          <Link href="/admin/system/liquidity-strategy" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1A1A1A] text-slate-400">
            <Crosshair className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-medium">Liquidity Strategy</span>
          </Link>
          <Link href="/admin/system/channel-strategy" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1A1A1A] text-slate-400">
            <BarChart2 className="w-4 h-4 text-sky-500" />
            <span className="text-sm font-medium">Channel Strategy</span>
          </Link>
          <Link href="/admin/system/smart-money-zones" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1A1A1A] text-slate-400">
            <Target className="w-4 h-4 text-fuchsia-500" />
            <span className="text-sm font-medium">Smart Money Zones</span>
          </Link>
          <Link href="/admin/system/channel-intelligence" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1A1A1A] text-slate-400">
            <Box className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Channel Intelligence</span>
          </Link>
          <Link href="/admin/system/symbols" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1A1A1A] text-slate-400">
            <Target className="w-4 h-4 text-fuchsia-500" />
            <span className="text-sm font-medium">Symbol Configuration</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1A1A1A] text-slate-400">
            <Cpu className="w-4 h-4" />
            <span className="text-sm font-medium">Strategy Engines</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1A1A1A] text-slate-400">
            <Database className="w-4 h-4" />
            <span className="text-sm font-medium">Risk Management</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1A1A1A] text-slate-400">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Audit Logs</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-[#111111] border-b border-[#222] flex items-center justify-between px-8">
          <div className="text-sm font-medium text-slate-400">
            System Config / <span className="text-white">Doctrine & Rules</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM ONLINE
            </div>
            <div className="text-sm font-medium border border-[#333] px-3 py-1.5 rounded-md">
              <span className="mr-2 text-slate-500">Role:</span>
              <span className="text-white">Super Admin</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-[#0F0F13]">
          {children}
        </div>
      </main>
    </div>
  );
}
