"use client";

import { motion } from "framer-motion";
import { Signal } from "@/lib/engine/signals";
import { TrendingUp, TrendingDown, Clock, Zap } from "lucide-react";

interface UpcomingSignalsProps {
  signals: Signal[];
  onSelect: (id: string) => void;
  selectedId: string | null;
}

export function UpcomingSignals({ signals, onSelect, selectedId }: UpcomingSignalsProps) {
  const nextSignals = signals
    .filter(s => s.status === "PENDING" && s.id !== selectedId)
    .sort((a, b) => a.entryTime - b.entryTime)
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-3">
      {nextSignals.map((sig, index) => {
        const isCall = sig.type === "CALL";
        // Ordem inversa conforme o desenho (4, 3, 2, 1)
        const displayIndex = 4 - index;
        
        return (
          <motion.button
            key={sig.id}
            onClick={() => onSelect(sig.id)}
            whileHover={{ x: 10, scale: 1.01 }}
            className={`w-full p-5 rounded-2xl border transition-all text-left flex items-center gap-5 relative overflow-hidden glassy-card group ${
              selectedId === sig.id 
                ? (isCall ? "border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.1)]") 
                : "border-white/5 hover:border-white/20"
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-gradient relative z-10 ${
              isCall ? "text-emerald-400" : "text-rose-400"
            }`}>
              {isCall ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              <div className={`absolute inset-0 blur-lg opacity-20 ${isCall ? "bg-emerald-500" : "bg-rose-500"}`} />
            </div>

            <div className="flex-1 relative z-10">
              <div className="text-base font-black text-white tracking-tight leading-none mb-1.5">{sig.asset}</div>
              <div className="flex items-center gap-3">
                 <div className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
                    <span className="text-[7.5px] font-black text-white/40 uppercase tracking-widest">
                       {sig.expiration}
                    </span>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-black text-white/80">{sig.probability}%</span>
                 </div>
              </div>
            </div>

            <div className="text-right relative z-10 pt-2">
              <div className={`text-sm font-black italic tabular-nums leading-none ${isCall ? 'text-emerald-400' : 'text-rose-400'}`}>
                {new Date(sig.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em] mt-1 block">Início</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
