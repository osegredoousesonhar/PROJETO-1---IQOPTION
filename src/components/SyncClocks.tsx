"use client";

import { useState, useEffect } from "react";
import { Clock, Globe, Laptop } from "lucide-react";

export function SyncClocks() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="flex items-center gap-4">
      {/* MUNDIAL */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
        <Globe className="w-3.5 h-3.5 text-blue-400" />
        <div>
          <span className="block text-[7px] font-black text-white/20 uppercase tracking-[0.2em] leading-none mb-1">Relógio Mundial (UTC)</span>
          <span className="text-sm font-black italic tracking-widest text-white/80">
            {new Date(time.getTime() + time.getTimezoneOffset() * 60000).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>

      {/* CORRETORA */}
      <div className="flex items-center gap-3 px-4 py-2 bg-blue-500/10 rounded-xl border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
        <Clock className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
        <div>
          <span className="block text-[7px] font-black text-blue-400 uppercase tracking-[0.2em] leading-none mb-1">IQ Option Broker Time</span>
          <span className="text-sm font-black italic tracking-widest text-white">
            {formatTime(time)}
          </span>
        </div>
      </div>

      {/* USUÁRIO */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
        <Laptop className="w-3.5 h-3.5 text-white/30" />
        <div>
          <span className="block text-[7px] font-black text-white/20 uppercase tracking-[0.2em] leading-none mb-1">Relógio Local</span>
          <span className="text-sm font-black italic tracking-widest text-white/60">
            {formatTime(time)}
          </span>
        </div>
      </div>
    </div>
  );
}
