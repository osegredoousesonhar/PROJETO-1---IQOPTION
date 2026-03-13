"use client";

import { useState, useEffect } from "react";
import { Signal } from "@/lib/engine/signals";
import { Zap, Target, MousePointer2, Star, Timer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SimulationModal } from "./SimulationModal";
import { MiniChart } from "./MiniChart";
import { RealTimeMarket } from "@/lib/engine/realtime";

export function VIPSignalCard({ signal, isFocus = false }: { signal: Signal; isFocus?: boolean }) {
  const [showSim, setShowSim] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [statusColor, setStatusColor] = useState("blue"); 
  
  const isCall = signal.type === "CALL";

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = signal.entryTime - now;
      
      // Regra: Cronômetro de 2 minutos (120s)
      if (diff <= 0 && diff > -60000) {
        setTimeLeft("ENTRAR AGORA");
        setStatusColor("green");
      } else if (diff <= 0) {
        setTimeLeft("FINALIZADO");
        setStatusColor("gray");
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
        
        if (diff < 30000) setStatusColor("yellow"); // Aviso de 30s
        else setStatusColor("blue");
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [signal.entryTime]);

  const chartData = RealTimeMarket.getHistory(signal.asset, signal.expiration).slice(-35);

  const colors: Record<string, string> = {
    blue: "text-blue-400 border-blue-500/30 bg-blue-500/5",
    yellow: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10 animate-pulse",
    green: "text-emerald-400 border-emerald-500/40 bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]",
    gray: "text-white/20 border-white/5 bg-white/5"
  };

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative group rounded-[2rem] p-[1px] bg-gradient-to-br transition-all duration-700 ${
        statusColor === 'green' ? "from-emerald-400 via-white to-emerald-400" : "from-blue-500/30 via-transparent to-blue-500/30"
      }`}
    >
      <div className="relative overflow-hidden bg-[#050b18] rounded-[1.95rem] p-5 shadow-2xl">
        
        {/* VIP BADGE */}
        <div className="absolute top-4 right-4 animate-pulse">
           <div className="flex items-center gap-1.5 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-500/30">
             <Star className="w-3.5 h-3.5 fill-blue-400" /> SINAL ELITE
           </div>
        </div>

        {/* HEADER: ATIVO E INFOS */}
        <div className="flex justify-between items-start mb-3 mt-1">
           <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 ${statusColor === 'green' ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-blue-500/10 border-blue-500/20'}`}>
                <Zap className={`w-5 h-5 ${statusColor === 'green' ? 'text-emerald-400 animate-bounce' : 'text-blue-400 animate-pulse'}`} />
              </div>
              <div>
                 <h3 className="text-3xl font-black italic tracking-tighter text-white leading-none mb-1 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">{signal.asset}</h3>
                 <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-md border ${isCall ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" : "bg-rose-500/20 text-rose-400 border-rose-500/20"}`}>
                       {signal.type} {signal.expiration}
                    </span>
                    <span className="text-blue-400 font-black text-[9px] bg-blue-500/10 px-1.5 py-0.2 rounded-md border border-blue-500/30 uppercase">
                       PAYOUT: {signal.payout}%
                    </span>
                 </div>
              </div>
           </div>
           
           <div className="text-right">
             <div className={`text-5xl font-black italic leading-none tracking-tighter transition-all duration-500 ${statusColor === 'green' ? 'text-emerald-400' : 'text-blue-400'}`}>
               {signal.probability}%
             </div>
             <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mt-1">IA SCORE</div>
           </div>
        </div>

        {/* GRÁFICO TÉCNICO - ULTRA COMPACTO */}
        <div className="relative h-16 mb-4 bg-black/40 rounded-xl border border-white/5 overflow-hidden">
          <MiniChart data={chartData} positive={isCall} height={64} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050b18] via-transparent to-transparent opacity-60" />
        </div>

        {/* CRONÔMETRO DE ENTRADA - COMPACTO */}
        <div className="grid grid-cols-1 gap-3 mb-4">
           <div className={`py-4 rounded-3xl border-2 transition-all duration-500 flex flex-col items-center justify-center relative overflow-hidden ${colors[statusColor]}`}>
              {/* Background Glow */}
              <div className={`absolute inset-0 opacity-10 bg-gradient-to-b from-transparent via-current to-transparent`} />
              
              <span className="text-[9px] font-black uppercase tracking-[0.5em] opacity-40 mb-2 z-10">ENTRADA EM</span>
              <div className="flex items-center gap-4 z-10">
                 <Timer className={`w-6 h-6 ${statusColor === 'green' ? 'animate-spin-slow text-emerald-400' : 'animate-pulse text-blue-400'}`} />
                 <span className="text-5xl font-black italic tracking-[0.1em] drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">{timeLeft}</span>
              </div>
           </div>
        </div>

        {/* BOTÃO DE EXECUÇÃO - COMPACTO */}
        <button
          onClick={() => setShowSim(true)}
          disabled={statusColor === 'gray'}
          className={`w-full relative overflow-hidden py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.5em] flex items-center justify-center gap-3 transition-all active:scale-95 group/btn ${
            statusColor === 'gray' ? "bg-white/5 text-white/10" : "bg-emerald-500 text-[#030816] hover:bg-emerald-400"
          }`}
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300" />
          EXECUTAR NO TERMINAL
          <MousePointer2 className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
        </button>
      </div>

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
