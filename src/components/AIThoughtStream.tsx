"use client";

import { useTrades } from "@/lib/context/TradeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Cpu, Zap, Activity, ShieldCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import { NeuralNetworkVisualizer } from "./NeuralNetworkVisualizer";

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
      case "ACTING": return "text-[#00e676]";
      case "THINKING": return "text-[#ffb800]";
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
    <div className="bg-[#0a0c14] rounded-[2rem] p-8 border border-white/5 relative overflow-hidden h-[400px] flex flex-col noise mesh-gold shadow-2xl">
      <NeuralNetworkVisualizer />
      
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#ffb800]/10 flex items-center justify-center border border-[#ffb800]/20">
            <ShieldCheck className="w-5 h-5 text-[#ffb800]" />
          </div>
          <div>
            <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-white italic">Matriz Neural HARDWARE</h3>
            <div className={`flex items-center gap-1.5 mt-1 ${getStateColor()}`}>
              {getStateIcon()}
              <span className="text-[9px] font-black uppercase tracking-widest italic">
                {aiActivityState === "ACTING" ? "Executando Protocolo" : aiActivityState === "THINKING" ? "Injetando Analytica" : "Em Espera Elite"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {aiReasoning.map((log, i) => (
            <motion.div
              key={`${log}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-4 items-start group"
            >
              <span className="text-[9px] font-black text-[#ffb800]/30 mt-1 tabular-nums italic">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
              <p className="text-[11px] font-bold leading-relaxed text-white/50 group-last:text-[#ffb800] group-last:font-black italic transition-all group-last:scale-[1.02] origin-left">
                {log}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {aiActivityState === "THINKING" && (
          <motion.div 
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex gap-3 items-center text-[10px] text-[#ffb800]/60 italic font-black"
          >
            <div className="flex gap-1">
              <span className="w-1 h-1 rounded-full bg-[#ffb800] animate-bounce" />
              <span className="w-1 h-1 rounded-full bg-[#ffb800] animate-bounce [animation-delay:0.2s]" />
              <span className="w-1 h-1 rounded-full bg-[#ffb800] animate-bounce [animation-delay:0.4s]" />
            </div>
            <span>VARREDURA DE LIQUIDEZ EM CURSO...</span>
          </motion.div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.4em]">Elite Core v5.1_HARD_RESET</span>
        <div className="flex items-center gap-2 px-3 py-1 bg-[#ffb800]/5 rounded-full border border-[#ffb800]/10">
           <div className="w-1.5 h-1.5 rounded-full bg-[#ffb800] animate-pulse" />
           <span className="text-[8px] font-black text-[#ffb800]/80 uppercase italic tracking-widest">IA Conectada</span>
        </div>
      </div>
    </div>
  );
}
