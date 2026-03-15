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
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-4">
      {nextSignals.map((sig, index) => {
        const isSelected = selectedId === sig.id;
        const isCall = sig.type === "CALL";
        
        return (
          <motion.button
            key={sig.id}
            onClick={() => onSelect(sig.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-500 text-left flex items-center justify-between relative overflow-hidden group/card ${
              isSelected 
                ? "bg-white/5 border-[#ffb800]/60 shadow-[0_10px_30px_rgba(255,184,0,0.1)]" 
                : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
            }`}
          >
            {/* Elite Selection Indicator */}
            {isSelected && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#ffb800] blur-[80px] opacity-10 pointer-events-none" />
            )}

            <div className="flex items-center gap-4 relative z-10">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-500 ${
                isSelected 
                  ? "bg-[#ffb800] border-[#ffb800] text-black"
                  : (isCall ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400")
              }`}>
                {isCall ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </div>

              <div>
                <div className={`text-lg font-black italic tracking-tighter leading-none mb-1 transition-colors ${isSelected ? "text-white" : "text-white/40 group-hover/card:text-white"}`}>
                  {sig.asset}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? "text-[#ffb800]" : "text-white/10"}`}>
                    {sig.expiration}
                  </span>
                  <span className="text-[9px] font-black text-white/30 italic">{sig.probability}%</span>
                </div>
              </div>
            </div>

            <div className="text-right relative z-10">
              <div className={`text-lg font-black italic tabular-nums leading-none tracking-tighter ${isSelected ? "text-[#ffb800]" : "text-white/20"}`}>
                {new Date(sig.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <span className={`text-[8px] font-bold uppercase tracking-[0.2em] mt-1 block ${isSelected ? "text-[#ffb800]/60" : "text-white/5"}`}>ANALYZING</span>
            </div>
            
            {/* Status Hover Effect */}
            <div className={`absolute left-0 bottom-0 w-full h-[2px] transition-all duration-500 ${isSelected ? "bg-[#ffb800]" : "bg-transparent group-hover/card:bg-white/10"}`} />
          </motion.button>
        );
      })}
    </div>
  );
}
