"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, CheckCircle, TrendingUp, DollarSign } from "lucide-react";

const NAMES = [
  "Gabriel M.", "Juliana F.", "Rodrigo S.", "Mateus L.", "Fernanda K.", 
  "Lucas R.", "Beatriz W.", "Thiago A.", "Carla P.", "Ricardo G.",
  "Vanessa O.", "Hugo B.", "Aline M.", "Caio S."
];
const ASSETS = ["EUR/USD", "BTC/USD", "GOLD", "GBP/JPY", "USD/JPY", "AUD/USD"];

export function HackerFeed() {
  const [events, setEvents] = useState<{ id: number; user: string; asset: string; type: string; profit: string }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const isWin = Math.random() > 0.2; // 80% de win rate simulado no feed
      const newEvent = {
        id: Date.now(),
        user: NAMES[Math.floor(Math.random() * NAMES.length)],
        asset: ASSETS[Math.floor(Math.random() * ASSETS.length)],
        type: isWin ? "WIN" : "LOSS",
        profit: isWin ? (Math.random() * 450 + 50).toFixed(2) : "0.00",
      };
      setEvents(prev => [newEvent, ...prev].slice(0, 5));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass glass-border rounded-2xl p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">ATIVIDADE GLOBAL</h3>
      </div>
      
      <div className="space-y-3 relative">
        <AnimatePresence initial={false}>
          {events.map((e) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, x: 20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: -20, height: 0 }}
              className="flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                  <User className="w-3 h-3 text-white/40" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-white/80">{e.user}</div>
                  <div className="text-[8px] text-white/40">{e.asset} · M1</div>
                </div>
              </div>
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg border ${
                e.type === "WIN" 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                  : "bg-rose-500/10 border-rose-500/20 text-rose-400"
              }`}>
                <DollarSign className="w-2.5 h-2.5" />
                <span className="text-[10px] font-black">{e.type === "WIN" ? `+${e.profit}` : "LOSS"}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="mt-4 pt-3 border-t border-white/5 text-center">
        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">
          🔥 142 membros online no momento
        </span>
      </div>
    </div>
  );
}
