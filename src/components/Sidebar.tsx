"use client";

import { LayoutDashboard, LineChart, History, Settings, Zap, LogOut, Shield } from "lucide-react";
import { useTrades } from "@/lib/context/TradeContext";
import { motion } from "framer-motion";

export function Sidebar() {
  const { autoSniperActive, toggleAutoSniper } = useTrades();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-24 bg-[#01040a] border-r border-white/5 flex flex-col items-center py-10 gap-12 z-[100] premium-shadow">
      {/* Logo Area / Auto Sniper */}
      <div className="relative group cursor-pointer" onClick={toggleAutoSniper}>
        <div className={`absolute -inset-4 blur-2xl transition-opacity duration-500 rounded-full ${autoSniperActive ? "bg-emerald-500 opacity-20 group-hover:opacity-40" : "bg-blue-500 opacity-0 group-hover:opacity-10"}`} />
        
        <motion.div 
          animate={autoSniperActive ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 border-2 ${
            autoSniperActive 
              ? "bg-emerald-500 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]" 
              : "bg-white/[0.03] border-white/10 group-hover:border-blue-500/50"
          }`}
        >
          <Zap className={`w-8 h-8 transition-colors ${autoSniperActive ? "text-white fill-white" : "text-white/20 group-hover:text-blue-400"}`} />
        </motion.div>
        
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className={`text-[7px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border ${
            autoSniperActive ? "bg-emerald-500 text-white border-emerald-400" : "bg-black/80 text-white/20 border-white/10"
          }`}>
            {autoSniperActive ? "Active" : "Sniper"}
          </span>
        </div>
      </div>

      <div className="w-12 h-[1px] bg-white/5" />

      {/* Navigation */}
      <nav className="flex flex-col gap-8 flex-1">
        {[
          { icon: LayoutDashboard, active: true, label: "Terminal", color: "text-blue-400" },
          { icon: LineChart, active: false, label: "Analytics", color: "text-indigo-400" },
          { icon: History, active: false, label: "History", color: "text-amber-400" },
          { icon: Shield, active: false, label: "Security", color: "text-emerald-400" },
          { icon: Settings, active: false, label: "Settings", color: "text-slate-400" },
        ].map((item, i) => (
          <button 
            key={i}
            className={`group relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
              item.active 
                ? "bg-white/[0.05] border border-white/10 shadow-xl" 
                : "text-white/10 hover:text-white/50 hover:bg-white/[0.02]"
            }`}
          >
            <item.icon className={`w-6 h-6 transition-all duration-300 ${item.active ? item.color : "group-hover:scale-110"}`} />
            
            {/* Tooltip */}
            <div className="absolute left-[120%] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 pointer-events-none z-50">
               <div className="bg-[#050b18] border border-white/10 px-4 py-2 rounded-xl shadow-2xl backdrop-blur-xl">
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] whitespace-nowrap">
                    {item.label}
                  </span>
               </div>
            </div>

            {/* Selection Dot */}
            {item.active && (
              <div className="absolute -left-2 w-1 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,1)]" />
            )}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="pb-4">
         <button className="w-14 h-14 rounded-2xl bg-rose-500/5 text-rose-500 border border-rose-500/10 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-lg group">
            <LogOut className="w-6 h-6 group-hover:scale-110 transition-transform" />
         </button>
      </div>
    </aside>
  );
}
