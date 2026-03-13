"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Clock, Globe } from "lucide-react";

const NEWS = [
  { id: 1, time: "10:30", currency: "USD", impact: 3, title: "CPI m/m" },
  { id: 2, time: "11:00", currency: "EUR", impact: 2, title: "ECB President Speech" },
  { id: 3, time: "12:15", currency: "GBP", impact: 1, title: "Construction PMI" },
  { id: 4, time: "14:00", currency: "USD", impact: 3, title: "FOMC Meeting" },
];

export function EconomicCalendar() {
  return (
    <div className="glass glass-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
          <Globe className="w-3 h-3" /> Calendário Econômico
        </h3>
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          HOJE
        </span>
      </div>

      <div className="space-y-3">
        {NEWS.map((n) => (
          <div 
            key={n.id} 
            className="flex items-center gap-3 p-3 rounded-xl bg-white/2 border border-white/5 hover:bg-white/5 transition-colors"
          >
            <div className="text-[11px] font-black text-white/50 w-10">
              {n.time}
            </div>
            <div className="flex items-center gap-1.5 w-12">
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase">
                {n.currency}
              </span>
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-bold text-white/80 line-clamp-1">{n.title}</div>
              <div className="flex gap-0.5 mt-1">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1.5 h-1.5 rounded-full ${i < n.impact ? (n.impact === 3 ? "bg-rose-500" : "bg-yellow-500") : "bg-white/10"}`} 
                  />
                ))}
              </div>
            </div>
            {n.impact === 3 && (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 text-center">
        <p className="text-[9px] text-white/20 font-medium uppercase tracking-tighter">
          Evite operar 15 min antes/depois de notícias 3 touros
        </p>
      </div>
    </div>
  );
}
