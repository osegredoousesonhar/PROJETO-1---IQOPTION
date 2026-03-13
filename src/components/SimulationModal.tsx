"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, Zap, ArrowRight } from "lucide-react";
import { Signal } from "@/lib/engine/signals";

import { useTrades, Trade } from "@/lib/context/TradeContext";

interface SimulationModalProps {
  signal: Signal;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

export function SimulationModal({ signal, onClose, onConfirm }: SimulationModalProps) {
  const { addTrade, updateTradeStatus } = useTrades();
  const [amount, setAmount] = useState(100);
  const [step, setStep] = useState(1); // 1: Setup, 2: Simulating, 3: Result
  const [countdown, setCountdown] = useState(5);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentTradeId, setCurrentTradeId] = useState<string | null>(null);

  const isCall = signal.type === "CALL";
  const color = isCall ? "#10b981" : "#f43f5e";

  const handleStart = () => {
    onConfirm(amount);
    
    // Gerar um ID temporário ou capturar o que o addTrade cria
    const tradeId = Math.random().toString(36).substr(2, 9);
    setCurrentTradeId(tradeId);
    
    // Para simplificar, vamos adicionar como pendente e depois atualizar
    // Mas o addTrade atual não retorna o ID, então vou ajustar o addTrade depois ou fazer local
    setStep(2);
  };

  useEffect(() => {
    if (step === 2) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        const success = Math.random() > 0.2;
        setIsSuccess(success);
        
        // Salva o trade no contexto ao finalizar
        addTrade({
          asset: signal.asset,
          type: signal.type,
          amount: amount,
          profit: success ? amount * 0.87 : 0,
          status: success ? "WIN" : "LOSS"
        });
        
        setStep(3);
      }
    }
  }, [step, countdown, addTrade, amount, signal.asset, signal.type]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md glass-morphism rounded-[32px] overflow-hidden border-gradient"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Zap className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tight italic">Modo Simulação</h2>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Teste a estratégia sem risco</p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-5 mb-6 border border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-white/60">Ativo</span>
                    <span className="text-sm font-black italic">{signal.asset}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-white/60">Operação</span>
                    <span className={`text-sm font-black italic`} style={{ color }}>{signal.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white/60">Expiração</span>
                    <span className="text-sm font-black italic">{signal.expiration}</span>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 font-black mb-3 text-center">
                    Valor do Investimento (DEMO)
                  </label>
                  <div className="flex items-center gap-4 justify-center">
                    {[50, 100, 200, 500].map(val => (
                      <button 
                        key={val}
                        onClick={() => setAmount(val)}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${amount === val ? "bg-white text-black" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
                      >
                        R${val}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleStart}
                  className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95"
                  style={{ background: "white", color: "black" }}
                >
                  Confirmar Entrada <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="py-12 flex flex-col items-center text-center"
              >
                <div className="relative mb-8">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64" cy="64" r="60"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-white/5"
                    />
                    <motion.circle
                      cx="64" cy="64" r="60"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="377"
                      initial={{ strokeDashoffset: 377 }}
                      animate={{ strokeDashoffset: 377 - (377 * (5 - countdown)) / 5 }}
                      className="text-blue-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-black italic">{countdown}s</span>
                  </div>
                </div>
                <h3 className="text-lg font-black italic mb-2 tracking-tight">OPERANDO NO MERCADO...</h3>
                <p className="text-xs text-white/40 max-w-[200px]">Aguardando finalização do candle de expiração.</p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-6 flex flex-col items-center text-center"
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isSuccess ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                  {isSuccess ? <TrendingUp className="w-10 h-10" /> : <TrendingDown className="w-10 h-10" />}
                </div>
                <h2 className={`text-4xl font-black italic mb-2 ${isSuccess ? "text-emerald-400" : "text-rose-400"}`}>
                  {isSuccess ? "WIN!" : "LOSS"}
                </h2>
                <div className="text-xs font-bold text-white/40 mb-8">
                  {isSuccess ? `Você lucrou R$ ${(amount * 0.87).toFixed(2)}` : `Você perdeu R$ ${amount.toFixed(2)}`}
                </div>

                <div className="w-full space-y-3">
                  <button 
                    onClick={onClose}
                    className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest bg-white text-black hover:opacity-90 transition-all"
                  >
                    Fechar Resultado
                  </button>
                  <button 
                    className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors"
                  >
                    Ver detalhes da operação
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
