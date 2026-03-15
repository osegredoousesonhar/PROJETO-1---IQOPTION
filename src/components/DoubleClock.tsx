"use client";

import { useEffect, useState } from "react";
import { Clock as ClockIcon } from "lucide-react";

export function DoubleClock() {
  const [globalTime, setGlobalTime] = useState("");
  const [brokerTime, setBrokerTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setGlobalTime(now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      // Simulando um leve delay ou offset para a corretora (ex: 200ms)
      setBrokerTime(new Date(now.getTime() - 200).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#05060a]/50 rounded-[2rem] border border-white/5 p-6 mb-6 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-500 blur-[60px] opacity-[0.05] pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6 px-2 relative z-10">
        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Sincronia Operacional</h3>
        <ClockIcon className="w-4 h-4 text-emerald-500" />
      </div>

      <div className="grid grid-cols-2 gap-6 relative z-10">
        <div className="flex flex-col items-center p-4 bg-white/[0.02] rounded-2xl border border-white/5">
           <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-2 italic text-center">HORA GLOBAL (GMT-3)</span>
           <span className="text-3xl font-black italic text-white tracking-tighter tabular-nums">{globalTime}</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
           <span className="text-[8px] font-black text-emerald-500/60 uppercase tracking-[0.2em] mb-2 italic text-center">HORA CORRETORA</span>
           <span className="text-3xl font-black italic text-emerald-500 tracking-tighter tabular-nums">{brokerTime}</span>
        </div>
      </div>
    </div>
  );
}
