"use client";

import { Zap, AlertTriangle, ShieldAlert } from "lucide-react";

export function OperatingHours() {
  const cards = [
    { 
      title: "MELHOR HORÁRIO", 
      time: "14:00 - 18:00", 
      color: "#10b981", 
      desc: "ALTA ASSERTIVIDADE",
      icon: Zap
    },
    { 
      title: "EVITAR OPERAR", 
      time: "11:00 - 13:00", 
      color: "#f59e0b", 
      desc: "ALTA VOLATILIDADE",
      icon: AlertTriangle
    },
    { 
      title: "NÃO OPERAR", 
      time: "00:00 - 04:00", 
      color: "#ef4444", 
      desc: "SEM SINAIS / OTC",
      icon: ShieldAlert
    },
  ];

  return (
    <div className="w-full bg-[#05060a]/50 rounded-[2rem] border border-white/5 p-6 mb-6">
      <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 mb-6 italic px-2">
        Ciclos de Mercado
      </h3>
      
      <div className="flex flex-col gap-4">
        {cards.map((card, i) => (
          <div 
            key={i} 
            className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all" 
                style={{ backgroundColor: `${card.color}10`, borderColor: `${card.color}30`, color: card.color }}
              >
                <card.icon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30 italic group-hover:text-white/60 transition-colors">
                  {card.title}
                </span>
                <span className="text-lg font-black italic tracking-tighter text-white">
                  {card.time}
                </span>
              </div>
            </div>
            <div className="text-right">
               <span className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: card.color }}>
                 {card.desc}
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
