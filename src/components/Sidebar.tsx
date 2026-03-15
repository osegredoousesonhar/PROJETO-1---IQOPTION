"use client";

import { LayoutDashboard, ShieldCheck, History, Wallet, Settings, LogOut, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function Sidebar() {
  const menuItems = [
    { icon: LayoutDashboard, active: true, label: "Terminal" },
    { icon: ShieldCheck, active: false, label: "Brain IA" },
    { icon: History, active: false, label: "Monitor" },
    { icon: Wallet, active: false, label: "Banca" },
    { icon: Settings, active: false, label: "Ajustes" },
  ];

  return (
    <div className="w-full bg-[#05060a]/50 rounded-[2rem] border border-white/5 p-6 mb-6">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <Zap className="w-6 h-6 text-black fill-black" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-black italic tracking-tighter text-white leading-none uppercase">Elite V5.2</h1>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500 mt-1">Luiz Edition</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item, i) => (
          <button 
            key={i}
            className={`flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-300 font-bold uppercase text-[10px] tracking-[0.15em] italic group ${
              item.active 
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/10" 
                : "text-white/20 hover:text-white/40 hover:bg-white/5"
            }`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* User Status */}
      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between px-2">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
               <span className="text-[10px] font-black text-emerald-500">L</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white italic">LUIZ_ADM</span>
              <span className="text-[8px] font-bold text-emerald-500/60 uppercase tracking-widest">Online</span>
            </div>
         </div>
         <button className="text-white/10 hover:text-rose-500 transition-colors">
            <LogOut className="w-4 h-4" />
         </button>
      </div>
    </div>
  );
}
