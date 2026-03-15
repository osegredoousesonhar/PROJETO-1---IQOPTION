"use client";

import { useTrades } from "@/lib/context/TradeContext";
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";

export function BalancePanel() {
  const { balance } = useTrades();
  const dailyGain = 8.5; // Simulado para o exemplo
  const totalGrowth = 124.2; // Simulado para o exemplo

  return (
    <div className="w-full bg-[#05060a]/50 rounded-[2.5rem] border border-white/5 p-8 shadow-2xl relative overflow-hidden group mesh-gold">
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500 blur-[80px] opacity-[0.05] pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 px-2 relative z-10">
        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Gestão Financeira</h3>
        <Wallet className="w-5 h-5 text-emerald-500" />
      </div>

      <div className="text-center mb-10 relative z-10">
        <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-2 block italic">SALDO ATUAL DA BANCA</span>
        <div className="text-6xl font-black italic text-white tracking-tighter tabular-nums drop-shadow-2xl">
          R$ {balance.toFixed(2)}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 relative z-10">
        <div className="flex items-center justify-between p-6 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/10">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                 <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-[11px] font-black text-white/40 uppercase tracking-widest italic">Ganho do Dia</span>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-2xl font-black italic text-emerald-500">+{dailyGain}%</span>
              <span className="text-[8px] font-bold text-emerald-500/40 uppercase">Sessão Ativa</span>
           </div>
        </div>

        <div className="flex items-center justify-between p-6 bg-white/[0.02] rounded-[2rem] border border-white/5">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                 <ArrowUpRight className="w-5 h-5 text-white/20" />
              </div>
              <span className="text-[11px] font-black text-white/40 uppercase tracking-widest italic">Crescimento Total</span>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-2xl font-black italic text-white">+{totalGrowth}%</span>
              <span className="text-[8px] font-bold text-white/10 uppercase">Total Portfolio</span>
           </div>
        </div>
      </div>
    </div>
  );
}
