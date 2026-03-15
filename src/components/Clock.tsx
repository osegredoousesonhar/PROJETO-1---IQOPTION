"use client";

import { useState, useEffect } from "react";
import { Clock as ClockIcon, Server } from "lucide-react";

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-12 relative z-10 bg-black/40 px-10 py-6 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl">
      <div className="flex flex-col items-end border-r border-white/10 pr-12">
        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-2 flex items-center gap-2 italic">
          <ClockIcon className="w-3 h-3" /> Relógio Local
        </span>
        <span className="text-3xl font-black italic tabular-nums leading-none tracking-tighter text-white">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-black text-[#ffb800] uppercase tracking-[0.4em] mb-2 flex items-center gap-2 italic">
          <Server className="w-3 h-3" /> Horário Corretora
        </span>
        <span className="text-3xl font-black text-[#ffb800] italic tabular-nums leading-none tracking-tighter">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
