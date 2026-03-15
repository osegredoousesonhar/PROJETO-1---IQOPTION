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
    <div className="bg-[#0a0c10] rounded-[2rem] p-8 border border-white/10 relative overflow-hidden group shadow-2xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffb800] blur-[100px] opacity-[0.03] pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-[#ffb800] italic">Performance Elite</h3>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1 italic">Sessão 24h Real-time</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
          <BarChart3 className="w-5 h-5 text-white/20" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center">
        {/* WIN RATE CIRCLE / BOX */}
        <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-[2.5rem] border-2 border-[#ffb800]/20 shadow-inner relative group/stat">
           <div className="absolute inset-0 bg-[#ffb800]/10 opacity-0 group-hover/stat:opacity-100 transition-opacity rounded-[2.5rem]" />
           <div className="text-6xl font-black italic text-white tracking-tighter mb-2 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] relative z-10">
             {winRate}<span className="text-[#ffb800] text-3xl">%</span>
           </div>
           <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ffb800] italic relative z-10">Assertividade Total</div>
        </div>

        {/* DETAILS LIST */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-6 py-4 bg-white/5 rounded-2xl border border-white/5 hover:border-[#00e676]/30 transition-all group/it">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#00e676] group-hover/it:shadow-[0_0_10px_#00e676] transition-all" />
                <span className="text-[11px] font-black uppercase tracking-widest text-white/40 italic">Vitórias (Wins)</span>
             </div>
             <span className="text-2xl font-black italic text-[#00e676] tracking-tighter">{wins}</span>
          </div>
          <div className="flex items-center justify-between px-6 py-4 bg-white/5 rounded-2xl border border-white/5 hover:border-[#ff5252]/30 transition-all group/it">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#ff5252] group-hover/it:shadow-[0_0_10px_#ff5252] transition-all" />
                <span className="text-[11px] font-black uppercase tracking-widest text-white/40 italic">Derrotas (Loss)</span>
             </div>
             <span className="text-2xl font-black italic text-[#ff5252] tracking-tighter">{losses}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Medal className="w-4 h-4 text-[#ffb800]" />
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] italic">Algoritmo Master Certificado</span>
         </div>
      </div>
    </div>
  );
}
