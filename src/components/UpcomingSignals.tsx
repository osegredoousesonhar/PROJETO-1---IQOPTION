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
            className={`w-full p-5 rounded-[1.5rem] border-2 transition-all duration-500 text-left flex items-center justify-between relative overflow-hidden group/card ${
              isSelected 
                ? "bg-[#ffb800]/10 border-[#ffb800]/60 shadow-[0_15px_40px_rgba(255,184,0,0.15)]" 
                : "bg-[#0a0c14] border-white/5 hover:bg-white/[0.04] hover:border-[#ffb800]/30"
            }`}
          >
            {/* Elite Selection Indicator */}
            {isSelected && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffb800] blur-[100px] opacity-10 pointer-events-none" />
            )}

            <div className="flex items-center gap-5 relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all duration-500 ${
                isSelected 
                  ? "bg-[#ffb800] border-[#ffb800] text-black shadow-[0_0_20px_rgba(255,184,0,0.5)]"
                  : (isCall ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400")
              }`}>
                {isCall ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
              </div>

              <div>
                <div className={`text-xl font-black italic tracking-tighter leading-none mb-1 transition-colors ${isSelected ? "text-white" : "text-white/60 group-hover/card:text-white"}`}>
                  {sig.asset}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? "text-[#ffb800]" : "text-white/20"}`}>
                    {sig.expiration}
                  </span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                    <ShieldCheck className="w-3 h-3 text-[#ffb800]" />
                    <span className="text-[10px] font-black text-white/50">{sig.probability}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right relative z-10">
              <div className={`text-xl font-black italic tabular-nums leading-none tracking-tighter ${isSelected ? "text-[#ffb800]" : "text-white/30"}`}>
                {new Date(sig.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-[0.2em] mt-1 block ${isSelected ? "text-[#ffb800]/60" : "text-white/10"}`}>START_IA</span>
            </div>
            
            {/* Status Hover Effect */}
            <div className={`absolute left-0 bottom-0 w-full h-[3px] transition-all duration-500 ${isSelected ? "bg-[#ffb800]" : "bg-white/5 group-hover/card:bg-[#ffb800]/20"}`} />
          </motion.button>
        );
      })}
    </div>
  );
}
