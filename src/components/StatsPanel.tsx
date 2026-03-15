"use client";

import { useTrades } from "@/lib/context/TradeContext";
import { TrendingUp, TrendingDown, Target, Zap, Activity, BarChart3, Medal } from "lucide-react";
import { motion } from "framer-motion";

export function StatsPanel() {
  const { trades } = useTrades();
  
  const wins = trades.filter(t => t.status === "WIN").length;
  const losses = trades.filter(t => t.status === "LOSS").length;
  const total = wins + losses;
  const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : "0.0";

  return (
    <div className="w-full bg-[#05060a]/50 rounded-[2rem] border border-white/5 p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 blur-[100px] opacity-[0.05] pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-500 italic">Estatísticas 24h</h3>
          <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mt-1 italic">Métricas de Assertividade</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
          <BarChart3 className="w-5 h-5 text-white/20" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 relative z-10">
        <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-[2rem] border border-white/5 shadow-inner relative group/stat">
           <div className="text-6xl font-black italic text-white tracking-tighter mb-2 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
             {winRate}<span className="text-emerald-500 text-3xl">%</span>
           </div>
           <div className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 italic">Assertividade Real</div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-6 py-4 bg-white/5 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all group/item">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover/item:shadow-[0_0_10px_#10b981] transition-all" />
                <span className="text-[11px] font-black uppercase tracking-widest text-white/40 italic">Vitórias (Wins)</span>
             </div>
             <span className="text-2xl font-black italic text-emerald-500 tracking-tighter">{wins}</span>
          </div>
          <div className="flex items-center justify-between px-6 py-4 bg-white/5 rounded-2xl border border-white/5 hover:border-rose-500/30 transition-all group/item">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500 group-hover/item:shadow-[0_0_10px_#f43f5e] transition-all" />
                <span className="text-[11px] font-black uppercase tracking-widest text-white/40 italic">Derrotas (Loss)</span>
             </div>
             <span className="text-2xl font-black italic text-rose-500 tracking-tighter">{losses}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
