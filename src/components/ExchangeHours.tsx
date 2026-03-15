"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

export function ExchangeHours() {
  const [times, setTimes] = useState({
    NY: "",
    LDN: "",
    TYO: "",
    SP: ""
  });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimes({
        NY: now.toLocaleTimeString("pt-BR", { timeZone: "America/New_York", hour: "2-digit", minute: "2-digit" }),
        LDN: now.toLocaleTimeString("pt-BR", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit" }),
        TYO: now.toLocaleTimeString("pt-BR", { timeZone: "Asia/Tokyo", hour: "2-digit", minute: "2-digit" }),
        SP: now.toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit" })
      });
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  const exchanges = [
    { title: "NEW YORK", time: times.NY, open: "10:30-17:00" },
    { title: "LONDON", time: times.LDN, open: "05:00-13:30" },
    { title: "TOKYO", time: times.TYO, open: "21:00-04:00" },
    { title: "SÃO PAULO", time: times.SP, open: "10:00-18:00" },
  ];

  return (
    <div className="w-full bg-[#05060a]/50 rounded-[2rem] border border-white/5 p-6 shadow-2xl overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 blur-[100px] opacity-[0.03] pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 px-2 relative z-10">
        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Sincronia das Bolsas</h3>
        <Globe className="w-4 h-4 text-white/10 group-hover:text-emerald-500 transition-colors" />
      </div>

      <div className="grid grid-cols-4 gap-4 relative z-10">
        {exchanges.map((ex, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-2 italic">{ex.title}</div>
            <div className="text-2xl font-black italic text-white tracking-tighter mb-1">{ex.time}</div>
            <div className="text-[7px] font-bold text-white/10 uppercase tracking-widest">{ex.open}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
