"use client";

import { LayoutDashboard, LineChart, History, Settings, Zap, LogOut, ShieldCheck, Wallet } from "lucide-react";
import { useTrades } from "@/lib/context/TradeContext";
import { motion } from "framer-motion";

export function Sidebar() {
  const { autoSniperActive, toggleAutoSniper } = useTrades();

  const menuItems = [
    { icon: LayoutDashboard, active: true, label: "Terminal" },
    { icon: ShieldCheck, active: false, label: "Estratégia IA" },
    { icon: History, active: false, label: "Monitor" },
    { icon: Wallet, active: false, label: "Financeiro" },
    { icon: Settings, active: false, label: "Configurações" },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#020305] border-r border-white/5 flex flex-col py-10 z-[100] shadow-2xl">
      {/* Brand Header */}
      <div className="px-6 mb-12 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#ffb800] flex items-center justify-center shadow-[0_0_30px_rgba(255,184,0,0.3)] shrink-0">
          <Zap className="w-8 h-8 text-black fill-black" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-black italic tracking-tighter text-white leading-none">IQ SIGNALS</h1>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ffb800] mt-1">v5.1 HARD RESET</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col px-4 gap-3">
        {menuItems.map((item, i) => (
          <button 
            key={i}
            className={`flex items-center gap-5 px-6 py-5 rounded-2xl transition-all duration-300 font-black uppercase text-[12px] tracking-widest italic group ${
              item.active 
                ? "bg-[#ffb800]/10 text-[#ffb800] border border-[#ffb800]/20" 
                : "text-white/20 hover:text-white/60 hover:bg-white/5"
            }`}
          >
            <item.icon className={`w-6 h-6 ${item.active ? "text-[#ffb800]" : "group-hover:scale-110"}`} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Market Status Widget (inspired by legacy) */}
      <div className="mt-12 px-6 flex flex-col gap-5">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-2 italic">Status Horário</h3>
        
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4 bg-[#00e676]/5 p-4 rounded-xl border border-[#00e676]/10">
            <div className="w-8 h-8 rounded-lg bg-[#00e676]/10 flex items-center justify-center">
               <Zap className="w-4 h-4 text-[#00e676]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-white/30 uppercase italic">Melhor Horário</span>
              <span className="text-sm font-black text-white">14:00 - 18:00</span>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-[#ff5252]/5 p-4 rounded-xl border border-[#ff5252]/10">
            <div className="w-8 h-8 rounded-lg bg-[#ff5252]/10 flex items-center justify-center">
               <Zap className="w-4 h-4 text-[#ff5252]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-white/30 uppercase italic">Pior Horário</span>
              <span className="text-sm font-black text-white">00:00 - 04:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Status / Logout Section */}
      <div className="mt-auto px-6 pb-6">
        <div className="relative mb-6 cursor-pointer group" onClick={toggleAutoSniper}>
          <div className={`p-5 rounded-3xl border-2 transition-all duration-500 flex items-center justify-between overflow-hidden ${
            autoSniperActive ? "bg-[#ffb800]/20 border-[#ffb800]/50" : "bg-white/5 border-white/10"
          }`}>
             <div className="flex flex-col">
               <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${autoSniperActive ? "text-[#ffb800]" : "text-white/30"}`}>Auto Sniper</span>
               <span className="text-[12px] font-black text-white italic">{autoSniperActive ? "ATIVADO" : "LATENTE"}</span>
             </div>
             <motion.div 
               animate={autoSniperActive ? { rotate: 360 } : {}}
               transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
             >
                <Zap className={`w-6 h-6 ${autoSniperActive ? "text-[#ffb800] fill-[#ffb800]" : "text-white/10"}`} />
             </motion.div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 p-5 bg-black/40 rounded-[2rem] border border-white/5">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-[#ffb800]/30 flex items-center justify-center">
                 <ShieldCheck className="w-5 h-5 text-[#ffb800]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-white italic">TIAGO ADM</span>
                <span className="text-[9px] font-bold text-[#00e676] uppercase tracking-widest">Conectado</span>
              </div>
           </div>
           <button className="text-white/20 hover:text-rose-500 transition-colors">
              <LogOut className="w-6 h-6" />
           </button>
        </div>
      </div>
    </aside>
  );
}
