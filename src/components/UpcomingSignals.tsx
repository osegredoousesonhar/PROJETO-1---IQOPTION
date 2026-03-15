"use client";

import { motion } from "framer-motion";
import { Signal } from "@/lib/engine/signals";
import { TrendingUp, TrendingDown, Zap, ShieldCheck } from "lucide-react";

interface UpcomingSignalsProps {
  signals: Signal[];
  onSelect: (id: string) => void;
  selectedId: string | null;
}

export function UpcomingSignals({ signals, onSelect, selectedId }: UpcomingSignalsProps) {
  const nextSignals = signals
    .filter(s => s.status === "PENDING")
    .sort((a, b) => a.entryTime - b.entryTime)
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-5">
      {nextSignals.map((sig, index) => {
        const isSelected = selectedId === sig.id;
        const isCall = sig.type === "CALL";
        
        return (
          <motion.button
            key={sig.id}
            onClick={() => onSelect(sig.id)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 8 }}
            className={`w-full p-6 rounded-3xl border-2 transition-all duration-500 text-left flex items-center justify-between relative overflow-hidden group ${
              isSelected 
                ? (isCall ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]" : "bg-rose-500/10 border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.2)]") 
                : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
            }`}
          >
            {/* Active Indicator */}
            {isSelected && (
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isCall ? "bg-emerald-500" : "bg-rose-500"}`} />
            )}

            <div className="flex items-center gap-5 relative z-10">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 ${
                isSelected 
                  ? (isCall ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" : "bg-rose-500/20 border-rose-500/40 text-rose-400")
                  : "bg-white/5 border-white/10 text-white/30 group-hover:text-white/60"
              }`}>
                {isCall ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
              </div>

              <div>
                <div className="text-xl font-black text-white tracking-tighter leading-none mb-1 group-hover:text-blue-400 transition-colors">{sig.asset}</div>
                <div className="flex items-center gap-3">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${isCall ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                    {sig.expiration}
                  </span>
                  <div className="flex items-center gap-1.5 opacity-60">
                    <ShieldCheck className="w-3 h-3 text-blue-400" />
                    <span className="text-[10px] font-black text-white">{sig.probability}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right relative z-10">
              <div className={`text-lg font-black italic tabular-nums leading-none ${isSelected ? (isCall ? "text-emerald-400" : "text-rose-400") : "text-white/40"}`}>
                {new Date(sig.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <span className="text-[9px] font-bold text-white/10 uppercase tracking-[0.2em] mt-1 block group-hover:text-white/30 transition-colors">Start Time</span>
            </div>

            {/* Hover Zap Effect */}
            <div className="absolute right-[-20%] bottom-[-20%] opacity-0 group-hover:opacity-10 transition-opacity duration-500 rotate-[20deg]">
              <Zap className={`w-24 h-24 ${isCall ? "text-emerald-500" : "text-rose-500"}`} />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
