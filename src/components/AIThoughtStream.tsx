"use client";

import { useTrades } from "@/lib/context/TradeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Cpu, Zap, Activity } from "lucide-react";
import { useEffect, useRef } from "react";

export function AIThoughtStream() {
  const { aiReasoning, aiActivityState } = useTrades();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [aiReasoning]);

  const getStateColor = () => {
    switch (aiActivityState) {
      case "ACTING": return "text-emerald-400";
      case "THINKING": return "text-blue-400";
      default: return "text-white/40";
    }
  };

  const getStateIcon = () => {
    switch (aiActivityState) {
      case "ACTING": return <Zap className="w-3 h-3 animate-pulse" />;
      case "THINKING": return <Cpu className="w-3 h-3 animate-spin-slow" />;
      default: return <Activity className="w-3 h-3" />;
    }
  };

  return (
    <div className="glassy-card rounded-[2rem] p-6 border-gradient relative overflow-hidden h-[320px] flex flex-col noise">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Terminal className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Processamento Neural</h3>
            <div className={`flex items-center gap-1.5 mt-0.5 ${getStateColor()}`}>
              {getStateIcon()}
              <span className="text-[8px] font-black uppercase tracking-widest">
                {aiActivityState === "ACTING" ? "Executando Pulso" : aiActivityState === "THINKING" ? "Calculando Confluência" : "Aguardando Setup"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {aiReasoning.map((log, i) => (
            <motion.div
              key={`${log}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3 items-start group"
            >
              <span className="text-[8px] font-mono text-white/20 mt-1">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
              <p className="text-[10px] font-medium leading-relaxed text-white/70 group-last:text-blue-400 group-last:font-bold italic">
                {log}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {aiActivityState === "THINKING" && (
          <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex gap-2 items-center text-[10px] text-blue-400/50 italic font-medium"
          >
            <span>-</span>
            <span>Avaliando próxima camada de liquidez...</span>
          </motion.div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.3em]">Cérebro v4.2_Liquid_Sapphire</span>
        <div className="flex items-center gap-2">
           <div className="w-1 h-1 rounded-full bg-blue-500 animate-ping" />
           <span className="text-[7px] font-black text-blue-400/60 uppercase">Link Neural Ativo</span>
        </div>
      </div>
    </div>
  );
}
