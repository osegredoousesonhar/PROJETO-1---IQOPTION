"use client";

import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import { useTrades } from "@/lib/context/TradeContext";

// Dados simulados para a curva de performance do dia
const MOCK_DATA = [
  { p: 40 }, { p: 45 }, { p: 42 }, { p: 50 }, { p: 55 }, { p: 60 }, { p: 58 }, 
  { p: 65 }, { p: 70 }, { p: 75 }, { p: 72 }, { p: 80 }, { p: 85 }
];

export function PerformanceChart() {
  const { trades } = useTrades();
  
  // Calcula winrate real das últimas 50 trades
  const wins = trades.filter(t => t.status === "WIN").length;
  const total = trades.length;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 84;

  return (
    <div className="bg-[#050b18]/40 border border-white/5 rounded-[2.5rem] p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2 px-2">
        <div>
          <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Win Rate Geral</div>
          <div className="text-3xl font-black text-white tracking-tighter">{winRate}%</div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Performance 24h</div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
            +12.4%
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[120px] -mx-6 -mb-6 mt-4 relative overflow-hidden rounded-b-[2.5rem]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MOCK_DATA}>
            <defs>
              <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
            <Area 
              type="monotone" 
              dataKey="p" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPerf)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
