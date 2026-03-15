"use client";

import { motion } from "framer-motion";
import { Signal } from "@/lib/engine/signals";
import { Clock, PlayCircle, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

interface MajorSignalCardProps {
  signal: Signal | null;
  onOperate?: () => void;
}

export function MajorSignalCard({ signal, onOperate }: MajorSignalCardProps) {
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    if (!signal) return;
    const interval = setInterval(() => {
      const remaining = signal.entryTime - Date.now();
      if (remaining <= 0) {
        setCountdown("ENTRAR");
      } else {
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        setCountdown(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [signal]);

  if (!signal) {
    return (
      <div className="w-full bg-[#050b18]/60 rounded-[2.5rem] border border-white/5 p-12 text-center min-h-[400px] flex flex-col justify-center mesh-blue">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10 animate-pulse">
          <ShieldCheck className="w-8 h-8 text-white/20" />
        </div>
        <div className="text-[12px] font-black text-white/20 uppercase tracking-[0.5em] italic">Varredura Cognitiva...</div>
      </div>
    );
  }

  const isCall = signal.type === "CALL";
  const score = signal.probability;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative w-full rounded-[2.5rem] border-2 overflow-hidden flex flex-col premium-shadow transition-all duration-700 ${
        isCall 
          ? "mesh-emerald border-emerald-500/30 neon-border-emerald" 
          : "mesh-rose border-rose-500/30 neon-border-rose"
      }`}
    >
      {/* Background Glow Base */}
      <div className={`absolute top-0 right-0 w-80 h-80 blur-[130px] opacity-20 rounded-full ${isCall ? "bg-emerald-400" : "bg-rose-400"}`} />
      
      <div className="p-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${isCall ? "bg-emerald-400" : "bg-rose-400"} animate-ping`} />
            <span className={`text-[11px] font-black uppercase tracking-[0.4em] ${isCall ? "text-emerald-400" : "text-rose-400"}`}>
               {isCall ? "SINAL DE COMPRA" : "SINAL DE VENDA"}
            </span>
          </div>
          <div className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
            <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em]">MASTER EDITION V5.1</span>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center">
             <div className="text-[11px] font-bold text-white/30 uppercase tracking-[0.6em] mb-3">Ativo Selecionado</div>
             <h2 className="text-7xl font-black text-white tracking-tighter leading-none italic drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">{signal.asset}</h2>
             <div className="flex items-center gap-6 mt-6 bg-black/30 px-8 py-3 rounded-2xl border border-white/10 backdrop-blur-xl">
                <div className="flex flex-col items-center border-r border-white/10 pr-6">
                  <span className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none mb-1">Timeframe</span>
                  <span className="text-sm font-black text-white tracking-widest">{signal.expiration}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none mb-1">Estratégia</span>
                  <span className="text-sm font-black text-blue-400 tracking-tighter uppercase italic">Bonitão V2</span>
                </div>
             </div>
          </div>

          <div className="relative group">
             <div className={`absolute -inset-6 blur-3xl opacity-30 transition-opacity group-hover:opacity-50 rounded-[4rem] ${isCall ? "bg-emerald-500" : "bg-rose-500"}`} />
             <div className="bg-black/60 backdrop-blur-3xl rounded-[3rem] p-12 border border-white/20 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
                <div className="text-[11px] font-black text-white/30 uppercase tracking-[0.8em] mb-8 italic">Gatilho de Operação</div>
                <div className={`text-9xl font-black tracking-tighter tabular-nums leading-none ${
                   isCall ? "text-emerald-400 glow-emerald" : "text-rose-400 glow-rose"
                }`}>
                   {countdown}
                </div>
                <div className="mt-10 flex items-center gap-4 px-8 py-3 bg-white/5 rounded-full text-[11px] font-black text-white/70 uppercase tracking-[0.3em] border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                   <Clock className={`w-5 h-5 ${isCall ? "text-emerald-400" : "text-rose-400"}`} />
                   Protocolo Sincronizado
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
             <div className="p-7 bg-white/[0.04] rounded-[2rem] border border-white/10 hover:bg-white/[0.08] transition-all group overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="text-[9px] font-black text-white/20 uppercase mb-3 tracking-[0.2em] group-hover:text-white/40">Taxa Esperada</div>
                <div className="text-3xl font-black text-white italic tabular-nums tracking-tighter">{signal.entryPrice?.toFixed(5)}</div>
             </div>
             <div className="p-7 bg-white/[0.04] rounded-[2rem] border border-white/10 hover:bg-white/[0.08] transition-all group overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="text-[9px] font-black text-white/20 uppercase mb-3 tracking-[0.2em] group-hover:text-white/40">Assertividade</div>
                <div className={`text-3xl font-black ${isCall ? "text-emerald-400" : "text-rose-400"} italic tracking-tighter`}>{score}%</div>
             </div>
          </div>

          <button 
            onClick={onOperate}
            className={`w-full py-7 rounded-[2rem] font-black text-lg uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all active:scale-[0.98] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group ${
              isCall ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
            }`}
          >
            <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[120%] transition-transform duration-1000 skew-x-[30deg]" />
            <PlayCircle className="w-7 h-7" /> EXECUTAR COM MAESTRIA
          </button>
          
          <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/10 backdrop-blur-xl relative overflow-hidden group">
             <div className={`absolute top-0 left-0 w-1.5 h-full ${isCall ? "bg-emerald-500" : "bg-rose-500"} opacity-50 group-hover:opacity-100 transition-opacity`} />
             <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">IA Decision Matrix</span>
             </div>
             <p className="text-[11px] font-bold text-white/40 leading-relaxed italic group-hover:text-white/60 transition-colors">
                {isCall 
                  ? "Injeção de capital detectada em nível de preço psicológico. O algoritmo Bonitão confirma exaustão do movimento vendedor anterior." 
                  : "Rejeição de preço confirmada por volume delta negativo. Força vendedora dominante em região de resistência master."}
             </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
