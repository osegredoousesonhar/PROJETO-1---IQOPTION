"use client";

import { Signal } from "@/lib/engine/signals";
import { motion } from "framer-motion";
import { Zap, TrendingUp, TrendingDown, Star, Target } from "lucide-react";

interface TopSignalsProps {
  signals: Signal[];
  selectedId: string | null;
  onSelect: (signal: Signal) => void;
}

export function TopSignals({ signals, selectedId, onSelect }: TopSignalsProps) {
  const top4 = [...signals]
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 4);

  if (top4.length === 0) {
    return (
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
        <div className="w-10 h-10 rounded-full border-2 border-white/5 border-t-blue-500 animate-spin mb-4 relative z-10" />
        <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] relative z-10">Buscando Oportunidades de Elite...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {top4.map((s, i) => {
        const isCall = s.type === "CALL";
        const isSelected = selectedId === s.id;
        
        return (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onSelect(s)}
            className={`relative group cursor-pointer transition-all duration-500 rounded-3xl p-4 border overflow-hidden flex flex-col justify-between h-[150px] ${
              isSelected 
                ? "bg-blue-600/20 border-blue-500/50 shadow-[0_20px_40px_rgba(37,99,235,0.15)] scale-[1.02]" 
                : "bg-white/[0.02] border-white/5 hover:border-blue-500/30 hover:bg-white/[0.04]"
            }`}
          >
            {/* Background Glow */}
            <div className={`absolute -right-4 -top-4 w-16 h-16 blur-3xl opacity-20 pointer-events-none transition-colors ${
              isSelected ? "bg-blue-400" : "bg-white/10"
            }`} />

            <div className="flex justify-between items-start relative z-10">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-1">
                   <div className={`w-1.5 h-1.5 rounded-full ${isCall ? "bg-emerald-500" : "bg-rose-500"} animate-pulse`} />
                   <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{s.expiration}</span>
                </div>
                <h3 className="text-xl font-black italic tracking-tighter text-white drop-shadow-md">
                  {s.asset}
                </h3>
              </div>
              {i === 0 && (
                <div className="bg-yellow-500/20 p-1.5 rounded-lg border border-yellow-500/30">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                </div>
              )}
            </div>

            <div className="flex items-end justify-between relative z-10">
               <div>
                  <div className={`flex items-center gap-1 font-black italic text-xs mb-1 ${isCall ? "text-emerald-400" : "text-rose-400"}`}>
                    {isCall ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {s.type}
                  </div>
                  <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                     <Target className="w-2.5 h-2.5 text-white/30" />
                     <span className="text-[8px] font-bold text-white/40 uppercase tracking-tighter">{s.strategy}</span>
                  </div>
               </div>
               
               <div className="text-right">
                  <div className={`text-4xl font-black italic leading-none tracking-tighter ${
                    s.probability >= 90 ? "text-emerald-400" : "text-white/90"
                  }`}>
                    {s.probability}%
                  </div>
                  <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">ASSERTIVIDADE</span>
               </div>
            </div>

            {/* Selection Bar */}
            {isSelected && (
              <motion.div 
                layoutId="selectionBar"
                className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
