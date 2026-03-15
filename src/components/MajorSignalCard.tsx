"use client";

import { motion } from "framer-motion";
import { Signal } from "@/lib/engine/signals";
import { Clock, PlayCircle, ShieldCheck, Zap } from "lucide-react";
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
      <div className="w-full bg-[#05060a] rounded-[2rem] border-2 border-dashed border-white/5 p-12 text-center min-h-[400px] flex flex-col justify-center mesh-gold">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10 animate-pulse">
          <Zap className="w-8 h-8 text-[#ffb800]/20" />
        </div>
        <div className="text-[12px] font-black text-white/20 uppercase tracking-[0.5em] italic">Varredura Neural Elite...</div>
      </div>
    );
  }

  const isCall = signal.type === "CALL";
  const score = signal.probability;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative w-full rounded-[2.5rem] border-2 overflow-hidden flex flex-col premium-shadow transition-all duration-700 ${
        isCall 
          ? "bg-gradient-to-br from-[#0a0c14] to-[#05060a] border-emerald-500/40" 
          : "bg-gradient-to-br from-[#0a0c14] to-[#05060a] border-rose-500/40"
      }`}
    >
      {/* Background Accent Glow */}
      <div className={`absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none ${isCall ? "bg-emerald-500" : "bg-rose-500"}`} style={{ filter: 'blur(100px)' }} />
      
      <div className="p-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
            <div className={`w-3 h-3 rounded-full ${isCall ? "bg-emerald-500 shadow-[0_0_10px_#00e676]" : "bg-rose-500 shadow-[0_0_10px_#ff5252]"} animate-pulse`} />
            <span className={`text-[12px] font-black uppercase tracking-[0.3em] italic ${isCall ? "text-emerald-400" : "text-rose-400"}`}>
               {isCall ? "CALL / COMPRA" : "PUT / VENDA"}
            </span>
          </div>
          <div className="px-4 py-2 bg-[#ffb800]/10 rounded-full border border-[#ffb800]/30 backdrop-blur-md">
            <span className="text-[10px] font-black text-[#ffb800] uppercase tracking-[0.2em]">ELITE TERMINAL V5.1</span>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center">
             <div className="text-[11px] font-black text-white/40 uppercase tracking-[0.6em] mb-3 italic">ATIVO DETECTADO</div>
             <h2 className="text-8xl font-black text-white tracking-tighter leading-none italic drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] uppercase">
               {signal.asset}
             </h2>
             <div className="flex items-center gap-6 mt-8 bg-black/60 px-10 py-4 rounded-3xl border border-white/10 backdrop-blur-2xl">
                <div className="flex flex-col items-center border-r border-white/10 pr-8">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-widest leading-none mb-2">Timeframe</span>
                  <span className="text-xl font-black text-[#ffb800] tracking-widest italic">{signal.expiration}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-widest leading-none mb-2">Assertiv.</span>
                  <span className={`text-xl font-black italic tracking-tighter ${isCall ? "text-emerald-400" : "text-rose-400"}`}>{score}%</span>
                </div>
             </div>
          </div>

          <div className="relative group">
             <div className={`absolute -inset-8 blur-[80px] opacity-30 transition-opacity group-hover:opacity-50 rounded-[4rem] ${isCall ? "bg-emerald-500" : "bg-rose-500"}`} />
             <div className="bg-gradient-to-b from-[#161b2b] to-[#0a0c14] rounded-[3rem] p-12 border-2 border-white/10 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 scanner-effect opacity-20 pointer-events-none" />
                
                <div className="text-[12px] font-black text-white/40 uppercase tracking-[1em] mb-8 italic">GATILHO DE ENTRADA</div>
                <div className={`text-9xl font-black tracking-tighter tabular-nums leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] ${
                   isCall ? "text-emerald-400 glow-emerald" : "text-rose-400 glow-rose"
                }`}>
                   {countdown}
                </div>
                <div className="mt-10 flex items-center gap-4 px-10 py-4 bg-black/40 rounded-full text-[12px] font-black text-white/80 uppercase tracking-[0.4em] border border-white/10 hover:border-[#ffb800]/50 transition-all cursor-default">
                   <Clock className={`w-6 h-6 ${isCall ? "text-emerald-400" : "text-rose-400"}`} />
                   PROTOCOLO SINCRONIZADO
                </div>
             </div>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={onOperate}
              className={`w-full py-8 rounded-[2rem] font-black text-xl uppercase tracking-[0.4em] italic flex items-center justify-center gap-5 transition-all active:scale-[0.97] shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative overflow-hidden group/btn ${
                isCall ? "bg-emerald-600 border-b-4 border-emerald-800 text-white" : "bg-rose-600 border-b-4 border-rose-800 text-white"
              }`}
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[120%] transition-transform duration-1000 skew-x-[45deg]" />
              <PlayCircle className="w-8 h-8" /> 
              {isCall ? "CONFIRMAR COMPRA" : "CONFIRMAR VENDA"}
            </button>
          </div>
          
          <div className="p-8 bg-black/60 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl relative overflow-hidden group">
             <div className={`absolute top-0 left-0 w-2 h-full ${isCall ? "bg-emerald-500" : "bg-rose-500"} opacity-40 group-hover:opacity-100 transition-opacity`} />
             <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-5 h-5 text-[#ffb800]" />
                <span className="text-[11px] font-black text-[#ffb800] uppercase tracking-[0.3em] italic">IA RATING & DATA MATRIX</span>
             </div>
             <p className="text-[12px] font-bold text-white/50 leading-relaxed italic group-hover:text-white/80 transition-colors">
                {isCall 
                  ? "Análise detectou forte absorção compradora. Volume exaustivo nos últimos 5 candles de baixa sugere reversão imediata para zona de liquidez GOLD." 
                  : "Fluxo vendedor institucional confirmado. Rejeição de preço em nível psicológico master com alto volume de agressão vendedora."}
             </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
