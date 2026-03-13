"use client";

import { useState, useEffect } from "react";
import { Brain, Cpu, Sparkles, TrendingUp, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useSignals } from "@/lib/hooks/useSignals";

export function AIPrediction() {
  const { signals } = useSignals();
  const [analyzing, setAnalyzing] = useState(true);
  const [sentiment, setSentiment] = useState(78);
  const [asset, setAsset] = useState("EUR/USD");
  const [confluences, setConfluences] = useState<string[]>([]);

  useEffect(() => {
    if (signals.length > 0) {
      const best = signals.sort((a, b) => b.probability - a.probability)[0];
      setAnalyzing(true);
      
      setTimeout(() => {
        setAnalyzing(false);
        setAsset(best.asset);
        setSentiment(best.probability);
        setConfluences(best.confluences);
      }, 1500);
    }
  }, [signals]);

  return (
    <div className="glass-morphism rounded-3xl p-6 noise overflow-hidden relative border-gradient">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Brain className="w-24 h-24" />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
          <Sparkles className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="font-black text-lg tracking-tight">Análise Cognitiva IA</h3>
          <p className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] font-bold">Processamento em Tempo Real</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-white/60">Sentimento de Compra</span>
              <span className="text-xs font-black text-emerald-400">{sentiment}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${sentiment}%` }}
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/5">
              <span className="block text-[9px] uppercase tracking-tighter text-white/40 font-bold mb-1">Volatilidade</span>
              <span className="text-sm font-black italic">MÉDIA</span>
            </div>
            <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/5">
              <span className="block text-[9px] uppercase tracking-tighter text-white/40 font-bold mb-1">Tendência</span>
              <span className="text-sm font-black italic text-emerald-400">ALTA</span>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col justify-center items-center text-center p-4 rounded-2xl bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/10">
          <AnimatePresence mode="wait">
            {analyzing ? (
              <motion.div 
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <Cpu className="w-8 h-8 text-blue-400 animate-spin-slow mb-2" />
                <p className="text-xs font-black italic tracking-widest text-blue-400/80">ANALISANDO {asset}...</p>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span className="text-xl font-black italic text-white">{asset}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] font-black uppercase text-emerald-400">Oportunidade de Compra</span>
                </div>
                <p className="mt-3 text-[9px] leading-relaxed text-white/30 font-medium px-4">
                  {confluences.length > 0 
                    ? `IA detectou confluência de: ${confluences.join(" + ")}.` 
                    : "Aguardando confirmação de padrões técnicos via confluência tripla."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500/80">Motor de IA v4.2 Online</span>
        </div>
        <button className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">
          Personalizar Estratégia
        </button>
      </div>
    </div>
  );
}
