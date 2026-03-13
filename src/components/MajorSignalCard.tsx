"use client";

import { motion } from "framer-motion";
import { Signal } from "@/lib/engine/signals";
import { TrendingUp, TrendingDown, Clock, Zap, Target, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

interface MajorSignalCardProps {
  signal: Signal | null;
}

export function MajorSignalCard({ signal }: MajorSignalCardProps) {
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
      <div className="w-full bg-[#050b18]/60 rounded-3xl border border-white/5 p-8 text-center min-h-[300px] flex flex-col justify-center">
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10 animate-pulse">
          <Target className="w-6 h-6 text-white/20" />
        </div>
        <div className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Aguardando Analisador...</div>
      </div>
    );
  }

  const isCall = signal.type === "CALL";
  const score = signal.probability;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative w-full rounded-3xl border overflow-hidden flex flex-col ${
        isCall ? "bg-emerald-500/10 border-emerald-500/20" : "bg-rose-500/10 border-rose-500/20"
      }`}
    >
      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-black/20 border border-white/5 ${isCall ? "text-emerald-400" : "text-rose-400"}`}>
             {isCall ? "COMPRA" : "VENDA"} PREMIUM
          </span>
          <span className="text-[8px] font-black text-white/40 uppercase">V5 LIQUIDITY</span>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center">
             <h2 className="text-5xl font-black text-white tracking-tighter leading-none mb-1 text-center">{signal.asset}</h2>
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{signal.expiration}</span>
                <div className={`w-1.5 h-1.5 rounded-full ${isCall ? "bg-emerald-500" : "bg-rose-500"} animate-pulse`} />
             </div>
          </div>

          <div className="bg-[#020611]/80 rounded-[2rem] p-8 border border-white/5 flex flex-col items-center justify-center shadow-inner relative overflow-hidden group">
             <div className={`absolute inset-0 opacity-[0.05] blur-3xl ${isCall ? "bg-emerald-500" : "bg-rose-500"}`} />
             <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-4 relative italic">PREPARAÇÃO EM</div>
             <div className={`text-7xl font-black tracking-tighter tabular-nums relative leading-none ${
                isCall ? "text-emerald-400" : "text-[#ff6b8b]"
             } drop-shadow-[0_0_30px_rgba(255,107,139,0.1)]`}>
                {countdown}
             </div>
             <div className="mt-6 flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full text-[9px] font-black text-white/40 uppercase tracking-widest relative border border-white/5">
                <Clock className="w-3.5 h-3.5" />
                SINCRONIZADO
             </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                <div className="text-[8px] font-black text-white/20 uppercase mb-1">Taxa</div>
                <div className="text-lg font-black text-white/90 tabular-nums">{signal.entryPrice?.toFixed(5)}</div>
             </div>
             <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                <div className="text-[8px] font-black text-white/20 uppercase mb-1">Sucesso</div>
                <div className={`text-lg font-black ${isCall ? "text-emerald-400" : "text-rose-400"}`}>{score}%</div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
