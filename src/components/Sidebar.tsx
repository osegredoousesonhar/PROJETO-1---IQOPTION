"use client";

import { LayoutDashboard, LineChart, History, Settings, Zap, LogOut } from "lucide-react";
import { useTrades } from "@/lib/context/TradeContext";

export function Sidebar() {
  const { autoSniperActive, toggleAutoSniper } = useTrades();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-20 bg-[#030816] border-r border-white/5 flex flex-col items-center py-8 gap-10 z-[100]">
      <div 
        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
          autoSniperActive 
            ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" 
            : "bg-white/5 border border-white/10"
        }`}
        onClick={toggleAutoSniper}
        title={autoSniperActive ? "Auto Sniper Ativado" : "Ativar Auto Sniper"}
      >
        <Zap className={`w-6 h-6 ${autoSniperActive ? "text-white fill-white" : "text-white/20"}`} />
      </div>

      <nav className="flex flex-col gap-6">
        {[
          { icon: LayoutDashboard, active: true, label: "Terminal" },
          { icon: LineChart, active: false, label: "Gráficos" },
          { icon: History, active: false, label: "Monitor" },
          { icon: Settings, active: false, label: "Painel IA" },
        ].map((item, i) => (
          <button 
            key={i}
            title={item.label}
            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all group relative ${
              item.active ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]" : "text-white/20 hover:text-white/40 hover:bg-white/5"
            }`}
          >
            <item.icon className={`w-5 h-5 ${item.active ? "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : ""}`} />
            <span className="text-[6px] font-black uppercase mt-1 opacity-0 group-hover:opacity-100 transition-opacity absolute -right-12 bg-black/80 px-2 py-1 rounded border border-white/5 whitespace-nowrap z-50 pointer-events-none">
               {item.label}
            </span>
          </button>
        ))}
      </nav>

      <div className="mt-auto">
         <button className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500/20 transition-all border border-rose-500/20" title="Sair">
            <LogOut className="w-5 h-5" />
         </button>
      </div>
    </aside>
  );
}
