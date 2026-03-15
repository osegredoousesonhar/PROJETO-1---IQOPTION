"use client";

import { LayoutDashboard, LineChart, History, Settings, Zap, LogOut, ShieldCheck, Wallet } from "lucide-react";
import { useTrades } from "@/lib/context/TradeContext";
import { motion } from "framer-motion";

export function Sidebar() {
  const { autoSniperActive, toggleAutoSniper } = useTrades();

  const menuItems = [
    { icon: LayoutDashboard, active: true, label: "Terminal" },
    { icon: ShieldCheck, active: false, label: "Brain IA" },
    { icon: History, active: false, label: "Monitor" },
    { icon: Wallet, active: false, label: "Banca" },
    { icon: Settings, active: false, label: "Ajustes" },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#05060a] border-r border-white/5 flex flex-col py-8 z-[100]">
      {/* Brand Header */}
      <div className="px-8 mb-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#ffb800] flex items-center justify-center shadow-[0_0_20px_rgba(255,184,0,0.2)]">
          <Zap className="w-6 h-6 text-black fill-black" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-black italic tracking-tighter text-white leading-none uppercase">Elite V5.1</h1>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#ffb800] mt-1">Operational</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col px-4 gap-2">
        {menuItems.map((item, i) => (
          <button 
            key={i}
            className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 font-bold uppercase text-[11px] tracking-widest italic group ${
              item.active 
                ? "bg-white/5 text-[#ffb800] border border-white/5" 
                : "text-white/20 hover:text-white/60"
            }`}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Auto Sniper Widget */}
      <div className="mt-8 px-4">
        <button 
          onClick={toggleAutoSniper}
          className={`w-full p-6 rounded-2xl border transition-all duration-500 flex flex-col items-center gap-3 relative overflow-hidden ${
            autoSniperActive ? "bg-[#ffb800]/5 border-[#ffb800]/20" : "bg-white/5 border-white/5"
          }`}
        >
           <motion.div 
             animate={autoSniperActive ? { rotate: 360 } : {}}
             transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
           >
              <Zap className={`w-6 h-6 ${autoSniperActive ? "text-[#ffb800] fill-[#ffb800]" : "text-white/10"}`} />
           </motion.div>
           <div className="flex flex-col items-center">
             <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${autoSniperActive ? "text-[#ffb800]" : "text-white/10"}`}>Auto Sniper</span>
             <span className="text-[11px] font-black text-white italic mt-1">{autoSniperActive ? "ATIVO" : "DESATIVADO"}</span>
           </div>
        </button>
      </div>

      {/* User Section */}
      <div className="mt-auto px-4 pb-4">
        <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#ffb800]/10 flex items-center justify-center">
                 <ShieldCheck className="w-4 h-4 text-[#ffb800]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white italic">ADM_TIAGO</span>
                <span className="text-[8px] font-bold text-[#00e676] uppercase tracking-widest">Online</span>
              </div>
           </div>
           <button className="text-white/10 hover:text-rose-500 transition-colors">
              <LogOut className="w-5 h-5" />
           </button>
        </div>
      </div>
    </aside>
  );
}
