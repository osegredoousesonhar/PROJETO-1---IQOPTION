"use client";

import { useEffect, useState } from "react";
import { Zap, Target, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTrades } from "@/lib/context/TradeContext";

export function OperationEntry() {
  const { signals } = useTrades();
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const sig = signals[0];

  useEffect(() => {
    if (!sig) return;
    
    // Mostra o card de entrada 30 segundos antes do término (ou próximo da entrada)
    // Para simplificar a lógica de UI solicitada pelo Luiz:
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = sig.entryTime - now;
      
      // Ativa o card quando faltam 30 segundos para a entrada
      if (diff > 0 && diff <= 30000) {
        setIsActive(true);
        setTimer(Math.floor(diff / 1000));
      } else if (diff <= 0) {
        setIsActive(true);
        setTimer(0);
      } else {
        setIsActive(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sig]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full bg-emerald-500 rounded-[2rem] p-8 mb-6 shadow-[0_20px_50px_rgba(16,185,129,0.3)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white blur-[80px] opacity-20" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
               <span className="text-[11px] font-black text-black uppercase tracking-[0.3em] italic">Confirmação de Entrada</span>
               <div className="flex items-center gap-2 px-3 py-1 bg-black/10 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span className="text-[9px] font-black text-white uppercase italic">30s Janela</span>
               </div>
            </div>

            <div className="text-center mb-6">
              <span className="text-[10px] font-bold text-black/40 uppercase tracking-[0.2em] mb-1 block">VALOR DA OPERAÇÃO</span>
              <div className="text-5xl font-black italic text-black tracking-tighter">R$ 500,00</div>
            </div>

            <button className="w-full py-5 bg-black text-white rounded-2xl flex items-center justify-center gap-4 transition-transform active:scale-95 shadow-2xl">
              <Target className="w-6 h-6 text-emerald-500" />
              <span className="text-lg font-black italic uppercase tracking-widest text-[#ffb800]">CONFIRMAR ENTRADA</span>
            </button>

            <div className="mt-6 flex items-center justify-center gap-3">
               <CheckCircle2 className="w-4 h-4 text-black/40" />
               <span className="text-[9px] font-bold text-black/40 uppercase tracking-widest italic">Aguardando gatilho de precisão... {timer}s</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
