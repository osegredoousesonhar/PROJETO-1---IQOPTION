"use client";

import { motion } from "framer-motion";
import { Zap, Activity, Info } from "lucide-react";
import { RealTimeMarket } from "@/lib/engine/realtime";
import { useEffect, useState } from "react";

export function MarketPower() {
  const [strength, setStrength] = useState(70);
  
  useEffect(() => {
    const assets = ["EUR/USD", "BTC/USD", "GBP/JPY", "USD/JPY", "AUD/USD"];
    const interval = setInterval(() => {
      // Calcula uma média de sentimentos baseada nos ticks reais
      const total = assets.reduce((acc, asset) => {
        const history = RealTimeMarket.getHistory(asset, "1m");
        if (history.length < 2) return acc + 0.5;
        const last = history[history.length - 1];
        const prev = history[history.length - 2];
        return acc + (last.close > prev.close ? 1 : 0);
      }, 0);
      
      const newStrength = Math.floor((total / assets.length) * 100);
      setStrength(prev => {
        // Suaviza a transição
        const diff = newStrength - prev;
        return prev + Math.floor(diff * 0.3);
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);
      
  return (
    <div className="glass glass-border rounded-2xl p-4 overflow-hidden relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">PODER DO MERCADO</h3>
        <Info className="w-3 h-3 text-white/20" />
      </div>
      
      <div className="flex flex-col items-center py-2">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48" cy="48" r="40"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-white/5"
            />
            <motion.circle
              cx="48" cy="48" r="40"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray="251"
              initial={{ strokeDashoffset: 251 }}
              animate={{ strokeDashoffset: 251 - (251 * strength) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-emerald-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black italic">{strength}%</span>
            <span className="text-[8px] font-bold text-white/30 uppercase">Alta</span>
          </div>
        </div>
        
        <div className="mt-4 flex gap-4 w-full">
          <div className="flex-1 text-center">
            <span className="block text-[8px] font-black text-white/30 mb-1 uppercase tracking-tighter">Volume</span>
            <span className="text-[10px] font-black text-white/80 italic">Alto (84%)</span>
          </div>
          <div className="flex-1 text-center">
            <span className="block text-[8px] font-black text-white/30 mb-1 uppercase tracking-tighter">Volatilidade</span>
            <span className="text-[10px] font-black text-rose-400 italic">Moderada</span>
          </div>
        </div>
      </div>
      
      <div className="absolute -bottom-6 -right-6 opacity-5 rotate-12">
        <Zap className="w-20 h-20" />
      </div>
    </div>
  );
}
