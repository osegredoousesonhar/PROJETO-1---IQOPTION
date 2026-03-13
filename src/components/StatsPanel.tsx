"use client";

import { useTrades } from "@/lib/context/TradeContext";
import { TrendingUp, TrendingDown, Target, Zap, Activity, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

export function StatsPanel() {
  const { trades } = useTrades();
  
  const wins = trades.filter(t => t.status === "WIN").length;
  const losses = trades.filter(t => t.status === "LOSS").length;
  const total = wins + losses;
  const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : "0.0";

  return (
    <div className="glass-morphism rounded-[1.8rem] p-5 border border-white/5 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Performance IA</h3>
          <p className="text-[8px] font-bold text-white/20 uppercase mt-0.5">24h Real-time</p>
        </div>
        <BarChart3 className="w-4 h-4 text-white/10" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* WIN RATE */}
        <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-2xl border border-white/5">
           <div className="text-3xl font-black italic text-emerald-400 tracking-tighter mb-0.5">
             {winRate}%
           </div>
           <div className="text-[7px] font-black uppercase tracking-widest text-white/30">Assertividade</div>
        </div>

        {/* DETAILS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
             <span className="text-[8px] font-black uppercase tracking-widest text-white/30">Wins</span>
             <span className="text-sm font-black italic text-emerald-400">{wins}</span>
          </div>
          <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
             <span className="text-[8px] font-black uppercase tracking-widest text-white/30">Loss</span>
             <span className="text-sm font-black italic text-rose-400">{losses}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
