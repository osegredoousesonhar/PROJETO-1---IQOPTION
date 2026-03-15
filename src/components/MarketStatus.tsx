"use client";

import { useTrades } from "@/lib/context/TradeContext";
import { ShieldCheck, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export function MarketStatus() {
  const { marketHealth } = useTrades();

  const getStatus = () => {
    if (marketHealth >= 80) return { label: "MERCADO EXCELENTE", color: "#10b981", desc: "ALTA ASSERTIVIDADE PARA OPERAR", icon: ShieldCheck };
    if (marketHealth >= 60) return { label: "MERCADO MODERADO", color: "#60a5fa", desc: "ENTRADAS COM CAUTELA", icon: TrendingUp };
    return { label: "MELHOR EVITAR", color: "#ef4444", desc: "MERCADO COM MUITO RUÍDO", icon: AlertTriangle };
  };

  const status = getStatus();

  return (
    <div className="w-full bg-[#05060a]/50 rounded-[2rem] border border-white/5 p-8 mb-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 blur-[100px] opacity-[0.05] pointer-events-none" style={{ backgroundColor: status.color }} />
      
      <div className="flex items-center justify-between mb-8 relative z-10 px-2">
        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Status do Dia</h3>
        <span className="text-3xl font-black italic tabular-nums tracking-tighter" style={{ color: status.color }}>{marketHealth}%</span>
      </div>

      <div className="relative z-10 flex items-center gap-6 p-6 rounded-[2rem] bg-black/40 border border-white/5">
         <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl shrink-0" style={{ backgroundColor: `${status.color}10`, border: `2px solid ${status.color}20` }}>
            <status.icon className="w-8 h-8" style={{ color: status.color }} />
         </div>
         <div className="flex flex-col">
            <span className="text-xl font-black italic text-white tracking-tighter uppercase leading-none mb-2">{status.label}</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] italic" style={{ color: status.color }}>{status.desc}</span>
         </div>
      </div>

      <div className="mt-8 w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 relative z-10">
         <motion.div 
           initial={{ width: 0 }}
           animate={{ width: `${marketHealth}%` }}
           className="h-full rounded-full" 
           style={{ backgroundColor: status.color }}
         />
      </div>
    </div>
  );
}
