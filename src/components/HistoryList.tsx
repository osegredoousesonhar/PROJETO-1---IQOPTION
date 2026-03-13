"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock, TrendingUp, TrendingDown } from "lucide-react";

import { useTrades } from "@/lib/context/TradeContext";

export function HistoryList() {
  const { trades } = useTrades();

  // Se não houver trades reais, mostramos os mocks para manter o design
  const displayTrades = trades.length > 0 ? trades : [
    { id: "1", asset: "EUR/USD", type: "CALL" as const, status: "WIN" as const, amount: 100, profit: 87.00, timestamp: Date.now() - 1000000 },
    { id: "2", asset: "GBP/JPY", type: "PUT" as const, status: "WIN" as const, amount: 100, profit: 92.00, timestamp: Date.now() - 2000000 },
    { id: "3", asset: "BTC/USD", type: "CALL" as const, status: "LOSS" as const, amount: 100, profit: 0, timestamp: Date.now() - 3000000 },
  ];

  const wins = displayTrades.filter(t => t.status === "WIN").length;
  const losses = displayTrades.filter(t => t.status === "LOSS").length;
  return (
    <div className="glass glass-border rounded-3xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
        <h3 className="font-bold text-sm uppercase tracking-widest text-white/70">Últimas Operações</h3>
        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          HOJE: {wins}W - {losses}L
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-wider text-white/30 border-b border-white/5">
              <th className="px-6 py-4">Ativo</th>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4">Estratégia</th>
              <th className="px-6 py-4">Horário</th>
              <th className="px-6 py-4">Resultado</th>
              <th className="px-6 py-4 text-right">Lucro/Prejuízo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {displayTrades.map((t, i) => (
              <motion.tr 
                key={t.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="hover:bg-white/5 transition-colors group"
              >
                <td className="px-6 py-4">
                  <span className="font-black italic text-sm text-white group-hover:text-blue-400 transition-colors">{t.asset}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {t.type === "CALL" ? (
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-rose-400" />
                    )}
                    <span className={`text-[11px] font-black ${t.type === "CALL" ? "text-emerald-400" : "text-rose-400"}`}>
                      {t.type}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-white/60 font-medium">IA Engine v4.2</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-white/40">
                    <Clock className="w-3 h-3" />
                    <span className="text-[11px] font-bold">
                      {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {t.status === "WIN" ? (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 w-fit">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span className="text-[10px] font-black text-emerald-400">WIN</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 w-fit">
                      <XCircle className="w-3 h-3 text-rose-400" />
                      <span className="text-[10px] font-black text-rose-400">LOSS</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`text-sm font-black italic ${t.status === "WIN" ? "text-emerald-400" : "text-rose-400"}`}>
                    {t.status === "WIN" ? `+R$ ${t.profit.toFixed(2)}` : `-R$ ${t.amount.toFixed(2)}`}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-white/2 flex justify-center border-t border-white/5">
        <button className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
          Ver Histórico Completo
        </button>
      </div>
    </div>
  );
}
