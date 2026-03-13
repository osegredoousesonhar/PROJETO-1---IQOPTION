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
    .slice(0, 4);

  return (
    <div className="flex gap-4">
      {nextSignals.map((sig, index) => {
        const isCall = sig.type === "CALL";
        // Ordem inversa conforme o desenho (4, 3, 2, 1)
        const displayIndex = 4 - index;
        
        return (
          <motion.button
            key={sig.id}
            onClick={() => onSelect(sig.id)}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`flex-1 min-w-[140px] h-[220px] p-6 rounded-[2rem] border transition-all text-left flex flex-col justify-between relative overflow-hidden group shadow-2xl ${
              selectedId === sig.id 
                ? (isCall ? "bg-emerald-500/20 border-emerald-500/40" : "bg-rose-500/20 border-rose-500/40") 
                : "bg-[#050b18]/90 border-white/5 hover:border-white/10"
            }`}
          >
            {/* Index Badge */}
            <div className="absolute top-4 right-4 text-[10px] font-black text-white/10">{displayIndex}</div>

            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isCall ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]" : "bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]"
            }`}>
              {isCall ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
            </div>

            <div className="mt-4">
              <div className="text-xl font-black text-white tracking-tighter leading-none mb-1">{sig.asset}</div>
              <div className="flex items-center gap-2">
                 <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${isCall ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                    {sig.expiration}
                 </span>
                 <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-black text-white/60">{sig.probability}%</span>
                 </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-4 border-t border-white/5">
              <Clock className="w-3 h-3 text-white/20" />
              <span className="text-[10px] font-black text-white/40 tabular-nums">
                {new Date(sig.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
