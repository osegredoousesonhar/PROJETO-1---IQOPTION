"use client";

import { useTrades } from "@/lib/context/TradeContext";
import { useEffect, useState } from "react";
import { Zap, ShieldAlert, TrendingUp, TrendingDown, Clock } from "lucide-react";

export function MajorSignalCard() {
  const { signals } = useTrades();
  const [countdown, setCountdown] = useState("");
  const sig = signals[0]; 

  useEffect(() => {
    if (!sig) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = sig.entryTime - now;
      if (diff <= 0) {
        setCountdown("ENTRADA!");
        return;
      }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setCountdown(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [sig]);

  if (!sig) return (
    <div className="w-full bg-[#05060a]/50 rounded-[2.5rem] p-10 border border-white/5 flex flex-col items-center justify-center min-h-[300px]">
       <ShieldAlert size={48} className="text-white/5 mb-4" />
       <span className="text-[11px] font-black text-white/10 uppercase tracking-[0.4em]">Aguardando Sinal de Alta Precisão...</span>
    </div>
  );

  const isCall = sig.type === "CALL";

  return (
    <div className="w-full bg-[#05060a]/80 rounded-[2.5rem] border border-white/5 p-8 shadow-2xl relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-64 h-64 blur-[120px] opacity-10 pointer-events-none transition-all duration-700 ${isCall ? "bg-emerald-500" : "bg-rose-500"}`} />
      
      <div className="flex items-center justify-between mb-8 relative z-10 px-2">
        <div className="flex flex-col">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic whitespace-nowrap">DIRECIONAMENTO GERAL</h2>
          <div className="flex items-center gap-2 mt-1">
             <div className={`w-2 h-2 rounded-full animate-pulse ${isCall ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-rose-500 shadow-[0_0_8px_#f43f5e]"}`} />
             <span className={`text-[9px] font-black uppercase tracking-widest italic ${isCall ? "text-emerald-500" : "text-rose-500"}`}>GATILHO IA ATIVO</span>
          </div>
        </div>
        <div className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/10">
           <span className="text-[12px] font-black italic text-[#ffb800] tracking-widest uppercase">{sig.expiration}</span>
        </div>
      </div>

      <div className="text-center mb-8 relative z-10">
        <h1 className="text-6xl font-black italic text-white tracking-tighter mb-4 uppercase drop-shadow-2xl">
          {sig.asset}
        </h1>
        <div className={`text-3xl font-black italic uppercase tracking-[0.3em] py-4 rounded-2xl border-2 transition-all ${
          isCall ? "text-white bg-emerald-500 border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.2)]" : "text-white bg-rose-500 border-rose-400 shadow-[0_0_40px_rgba(244,63,94,0.2)]"
        }`}>
          {isCall ? "COMPRA" : "VENDA"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="p-5 rounded-3xl bg-black/40 border border-white/5 flex flex-col items-center">
           <span className="text-[9px] font-black text-[#ffb800] uppercase tracking-[0.3em] mb-2 italic text-center">TIMER ENTRADA</span>
           <span className="text-4xl font-black italic text-white tabular-nums tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
             {countdown}
           </span>
        </div>
        <div className="p-5 rounded-3xl bg-black/40 border border-white/5 flex flex-col items-center">
           <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-2 italic text-center">EXATO ENTRADA</span>
           <span className="text-4xl font-black italic text-white tabular-nums tracking-tighter">
             {new Date(sig.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
           </span>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between px-2 relative z-10">
         <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-[#ffb800]" />
            <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] italic">PROBABILIDADE: {sig.probability}%</span>
         </div>
         <span className="text-[8px] font-black text-[#ffb800] uppercase tracking-[0.2em] italic animate-pulse whitespace-nowrap">SCANNER MASTER V.5.2</span>
      </div>
    </div>
  );
}
