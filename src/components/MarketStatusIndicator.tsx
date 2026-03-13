"use client";

import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, ShieldAlert, Activity } from "lucide-react";
import { useTrades } from "@/lib/context/TradeContext";

export function MarketStatusIndicator() {
  const { marketHealth } = useTrades();

  const getStatus = () => {
    if (marketHealth >= 80) return { label: "BAIXO RISCO", color: "emerald", icon: ShieldCheck, desc: "Condições ideais de tendência." };
    if (marketHealth >= 60) return { label: "MODERADO", color: "blue", icon: Activity, desc: "Aguarde confirmações extras." };
    if (marketHealth >= 40) return { label: "ARRISCADO", color: "amber", icon: AlertTriangle, desc: "Mercado com ruído/lateral." };
    return { label: "PERIGOSO", color: "rose", icon: ShieldAlert, desc: "Não operar. Volatilidade insana." };
  };

  const status = getStatus();
  const Icon = status.icon;

  return (
    <div className={`bg-${status.color}-500/5 border border-${status.color}-500/20 rounded-3xl p-6 relative overflow-hidden group`}>
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${status.color}-500/10 blur-3xl rounded-full`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 text-${status.color}-400`} />
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] text-${status.color}-400`}>SAÚDE DO MERCADO</span>
          </div>
          <div className="text-xl font-black text-white">{marketHealth}%</div>
        </div>

        <div className="text-lg font-black text-white leading-tight mb-1">
          {status.label}
        </div>
        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
          {status.desc}
        </div>

        <div className="mt-5 w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${marketHealth}%` }}
            className={`h-full bg-${status.color}-500`}
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <div className={`w-1.5 h-1.5 rounded-full bg-${marketHealth > 40 ? 'emerald' : 'rose'}-500 animate-pulse`} />
            <span className="text-[8px] font-black text-emerald-400/80 uppercase">Estável</span>
          </div>
          <span className="text-[9px] font-bold text-white/20 uppercase">ADX Sincronizado</span>
        </div>
      </div>
    </div>
  );
}
