"use client";

import { motion } from "framer-motion";
import { Signal } from "@/lib/engine/signals";
import { TrendingUp, TrendingDown, Target, Zap, Clock, ShieldCheck, Activity, BarChart3, ChevronRight } from "lucide-react";

interface WatchlistProps {
  signals: Signal[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function Watchlist({ signals, selectedId, onSelect }: WatchlistProps) {
  const sortedSignals = [...signals].sort((a, b) => b.probability - a.probability);

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto pr-2 custom-scrollbar">
      <div className="flex items-center justify-between px-2 mb-2">
        <div className="flex items-center gap-2">
           <Activity className="w-4 h-4 text-white/40" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Radar de Mercado</span>
        </div>
        <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-bold text-white/30 uppercase">
          {signals.length} ATIVOS
        </div>
      </div>

      {sortedSignals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-white/[0.02] border border-white/5 rounded-3xl text-center">
           <BarChart3 className="w-8 h-8 text-white/10 mb-3" />
           <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-relaxed">Escaneando ativos em tempo real...</p>
        </div>
      ) : (
        sortedSignals.map((sig) => (
          <motion.button
            key={sig.id}
            onClick={() => onSelect(sig.id)}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`relative group flex items-center justify-between p-4 rounded-3xl border transition-all duration-300 ${
              selectedId === sig.id 
                ? "bg-white/10 border-white/20 shadow-xl" 
                : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/10"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                sig.type === "CALL" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
              }`}>
                {sig.type === "CALL" ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </div>
              
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-base font-black tracking-tighter text-white">{sig.asset}</span>
                  <span className="text-[9px] font-bold text-white/20">{sig.expiration}</span>
                </div>
                <div className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-0.5">
                  {sig.strategy}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className={`text-lg font-black tracking-tight ${
                sig.probability >= 90 ? "text-emerald-400" : sig.probability >= 80 ? "text-blue-400" : "text-amber-400"
              }`}>
                {sig.probability}%
              </div>
              <div className="flex items-center gap-1">
                 {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1 h-1 rounded-full ${i < sig.strength! ? 'bg-white/60' : 'bg-white/10'}`} 
                    />
                 ))}
              </div>
            </div>

            {selectedId === sig.id && (
              <motion.div 
                layoutId="active-indicator"
                className="absolute left-[-4px] top-1/4 bottom-1/4 w-1 bg-blue-500 rounded-full"
              />
            )}
            
            <ChevronRight className={`w-4 h-4 transition-all ${selectedId === sig.id ? 'text-white/60 opacity-100' : 'text-white/10 opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} />
          </motion.button>
        ))
      )}
    </div>
  );
}
