"use client";

import { useTrades } from "@/lib/context/TradeContext";
import { TrendingUp, TrendingDown, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function TopSignals() {
  const { signals } = useTrades();
  
  // Pegamos os top 4 sinais com maior probabilidade
  const top4 = [...signals]
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 4);

  return (
    <div className="w-full bg-[#05060a]/50 rounded-[2rem] border border-white/5 p-6 mb-6">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-500 italic">Top 4 Sinais do Bonitão</h3>
        <Zap className="w-4 h-4 text-emerald-500 animate-pulse" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {top4.length > 0 ? top4.map((sig, i) => {
          const isCall = sig.type === "CALL";
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-black italic text-white">{sig.asset}</span>
                <span className="text-[8px] font-black bg-white/5 px-2 py-1 rounded-md text-white/40 uppercase tracking-widest">{sig.expiration}</span>
              </div>
              
              <div className={`flex items-center gap-2 mb-3 ${isCall ? "text-emerald-400" : "text-rose-400"}`}>
                {isCall ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-[10px] font-black uppercase italic tracking-widest">{isCall ? "COMPRA" : "VENDA"}</span>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <div className="text-xl font-black italic text-white tracking-tighter">{sig.probability}%</div>
                <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest italic">Assert.</div>
              </div>
            </motion.div>
          );
        }) : (
          <div className="col-span-2 py-10 text-center">
            <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">Buscando Oportunidades...</span>
          </div>
        )}
      </div>
    </div>
  );
}
