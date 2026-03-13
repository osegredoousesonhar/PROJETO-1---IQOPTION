"use client";

import { useState, useEffect } from "react";
import { Signal } from "@/lib/engine/signals";
import { TrendingUp, TrendingDown, Clock, Zap, ArrowRight, Target, Wifi, Timer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SimulationModal } from "./SimulationModal";
import { MiniChart } from "./MiniChart";
import { RealTimeMarket } from "@/lib/engine/realtime";

export function SignalCard({ signal, isFocus = false }: { signal: Signal; isFocus?: boolean }) {
  const [showSim, setShowSim] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const isCall = signal.type === "CALL";
  const color = isCall ? "#10b981" : "#f43f5e";
  
  const chartData = RealTimeMarket.getHistory(signal.asset).slice(-25);

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = signal.entryTime - Date.now();
      if (diff <= 0) {
        setTimeLeft("00:00");
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [signal.entryTime]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden group transition-all duration-500 rounded-[1.5rem] border ${
        isFocus 
          ? "p-4 bg-slate-950/60 border-blue-500/40 shadow-2xl scale-[1.02]" 
          : "p-3 glass-morphism border-white/5 hover:border-white/10"
      }`}
    >
      {/* HEADER COMPACT */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
           <h3 className="font-black italic text-lg tracking-tighter text-white">{signal.asset}</h3>
           <span className="text-[7px] font-black bg-white/5 text-white/40 px-1.5 py-0.5 rounded border border-white/5 uppercase">{signal.expiration}</span>
        </div>
        <div className={`text-xl font-black italic tracking-tighter ${isCall ? "text-emerald-400" : "text-rose-400"}`}>
          {signal.probability}%
        </div>
      </div>

      {/* CHART VERY COMPACT */}
      <div className="mb-3 h-12 bg-black/40 rounded-xl overflow-hidden border border-white/5">
        <MiniChart data={chartData} positive={isCall} height={48} />
      </div>

      {/* CRONOMETER & ENTRY (CENTRAL FOCUS) */}
      <div className="grid grid-cols-2 gap-2 mb-3">
         <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-2 flex flex-col items-center">
            <span className="text-[7px] font-black text-blue-400/60 uppercase tracking-widest mb-1">Entrada em</span>
            <div className="flex items-center gap-1">
               <Timer className="w-3 h-3 text-blue-400 animate-pulse" />
               <span className="text-sm font-black italic text-blue-400">{timeLeft}</span>
            </div>
         </div>
         <div className="bg-white/5 border border-white/5 rounded-xl p-2 flex flex-col items-center">
            <span className="text-[7px] font-black text-white/30 uppercase tracking-widest mb-1">Tipo / Horário</span>
            <div className="flex items-center gap-1">
               {isCall ? <TrendingUp className="w-3 h-3 text-emerald-400" /> : <TrendingDown className="w-3 h-3 text-rose-400" />}
               <span className="text-sm font-black italic text-white/80">
                  {new Date(signal.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </span>
            </div>
         </div>
      </div>

      {/* COMPACT BUTTON */}
      <button
        onClick={() => setShowSim(true)}
        className="w-full py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 bg-white text-[#030816] hover:bg-blue-400"
      >
        Copiar Sinal
        <ArrowRight className="w-3 h-3" />
      </button>

      <AnimatePresence>
        {showSim && (
          <SimulationModal 
            signal={signal} 
            onClose={() => setShowSim(false)} 
            onConfirm={() => {}} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
