"use client";

import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, ShieldAlert, Activity, Zap } from "lucide-react";
import { useTrades } from "@/lib/context/TradeContext";

export function MarketStatusIndicator() {
  const { marketHealth } = useTrades();

  const getStatus = () => {
    if (marketHealth >= 80) return { label: "BAIXO RISCO", color: "#00e676", icon: ShieldCheck, desc: "Condições ideais de tendência." };
    if (marketHealth >= 60) return { label: "MODERADO", color: "#ffb800", icon: Activity, desc: "Aguarde confirmações extras." };
    if (marketHealth >= 40) return { label: "ARRISCADO", color: "#ffb800", icon: AlertTriangle, desc: "Mercado com ruído/lateral." };
    return { label: "PERIGOSO", color: "#ff5252", icon: ShieldAlert, desc: "Não operar. Volatilidade insana." };
  };

  const status = getStatus();
  const Icon = status.icon;

  return (
    <div className="bg-[#0a0c14] border border-white/5 rounded-[2rem] p-8 relative overflow-hidden group shadow-2xl">
      <div className="absolute -right-8 -bottom-8 w-32 h-32 opacity-10 blur-3xl rounded-full" style={{ backgroundColor: status.color }} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5" style={{ color: status.color }} />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] italic" style={{ color: status.color }}>SAÚDE DO MERCADO</span>
          </div>
          <div className="text-2xl font-black text-white italic tabular-nums tracking-tighter">{marketHealth}%</div>
        </div>

        <div className="text-2xl font-black text-white leading-tight mb-2 italic">
          {status.label}
        </div>
        <div className="text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] leading-relaxed italic">
          {status.desc}
        </div>

        <div className="mt-8 w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${marketHealth}%` }}
            className="h-full rounded-full shadow-[0_0_10px_rgba(255,184,0,0.3)]"
            style={{ backgroundColor: status.color }}
          />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_#ffb800]" style={{ backgroundColor: status.color }} />
            <span className="text-[9px] font-black text-white/50 uppercase italic tracking-widest">Sincronizado</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-[#ffb800]" />
            <span className="text-[10px] font-bold text-white/20 uppercase italic tracking-[0.2em]">Fluxo de Liquidez</span>
          </div>
        </div>
      </div>
    </div>
  );
}
