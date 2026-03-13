"use client";

import { Signal } from "@/lib/engine/signals";
import { TrendingUp, TrendingDown, Clock, Target, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function SignalTable({ signals }: { signals: Signal[] }) {
  return (
    <div className="bg-[#050b18] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Monitor de Sinais em Tempo Real</h3>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Algoritmo Ativo</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.03]">
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-white/40 border-b border-white/5">Ativo</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-white/40 border-b border-white/5">Direção</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-white/40 border-b border-white/5">Payout</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-white/40 border-b border-white/5">Exp</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-white/40 border-b border-white/5">IA Score</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-white/40 border-b border-white/5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.01]">
            {signals.length > 0 ? (
              signals.map((sig, i) => {
                const isCall = sig.type === "CALL";
                return (
                  <motion.tr 
                    key={sig.id}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-blue-500/[0.03] transition-all duration-300 group relative cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-blue-500/30 transition-all">
                          <span className="text-[10px] font-black text-white/30 italic transition-colors uppercase">{sig.asset.split('/')[0]}</span>
                        </div>
                        <span className="text-sm font-black italic tracking-tight text-white group-hover:text-blue-200 transition-colors">{sig.asset}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 font-black italic text-xs ${isCall ? "text-emerald-400" : "text-rose-400"} drop-shadow-[0_0_8px_currentColor]`}>
                        {isCall ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {sig.type}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black italic text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.3)]">
                        {sig.payout}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-white/50 uppercase">
                        {sig.expiration}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="flex-1 h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                           <div 
                             className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]" 
                             style={{ width: `${sig.probability}%` }} 
                           />
                         </div>
                         <span className="text-xs font-black italic text-white">{sig.probability}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20 group-hover:border-blue-500/40 transition-all">
                         ANALISANDO
                      </span>
                    </td>
                  </motion.tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] font-black">Nenhum sinal detectado pelo algoritmo no momento</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
