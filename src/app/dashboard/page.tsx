"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { UpcomingSignals } from "@/components/UpcomingSignals";
import { ProfessionalChart } from "@/components/ProfessionalChart";
import { MarketStatusIndicator } from "@/components/MarketStatusIndicator";
import { StatsPanel } from "@/components/StatsPanel";
import { HistoryList } from "@/components/HistoryList";
import { MajorSignalCard } from "@/components/MajorSignalCard";
import { AssetHeatmap } from "@/components/AssetHeatmap";
import { AIThoughtStream } from "@/components/AIThoughtStream";
import { useTrades } from "@/lib/context/TradeContext";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, ShieldCheck, Zap } from "lucide-react";
import { SimulationModal } from "@/components/SimulationModal";

export default function DashboardPage() {
  const { signals, balance, bestTime, nextNews } = useTrades();
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);
  const [showSimulation, setShowSimulation] = useState(false);

  useEffect(() => {
    if (!selectedSignalId && signals.length > 0) {
      setSelectedSignalId(signals[0].id);
    }
  }, [signals, selectedSignalId]);

  const selectedSignal = signals.find((s) => s.id === selectedSignalId) || (signals.length > 0 ? signals[0] : null);

  return (
    <div className="flex min-h-screen bg-[#020611] text-white trading-grid">
      <Sidebar />

      <main className="flex-1 pl-20 transition-all overflow-x-hidden">
        <div className="max-w-[1700px] mx-auto p-10 flex flex-col gap-12">
          
          {/* Header Ultra Premium */}
          <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-white/[0.02] backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 premium-shadow mesh-blue relative overflow-hidden group">
            <div className="absolute inset-0 scanner-effect opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity" />
            
            <div className="flex items-center gap-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.3)] border border-white/20 transform group-hover:rotate-6 transition-transform">
                <LayoutDashboard className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tighter leading-none flex items-center gap-3 italic">
                  TERMINAL <span className="text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)] uppercase not-italic">Maestria</span>
                  <span className="text-[12px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 font-black not-italic ml-4">GOLD v5.1</span>
                </h1>
                <div className="flex items-center gap-3 mt-3">
                  <motion.div 
                    animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]" 
                  />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">
                    SISTEMA COGNITIVO ATIVO — <span className="text-blue-400 italic">BONITÃO ENGINE V2.0_ELITE</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-10 relative z-10">
              <div className="flex gap-10">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Janela de Alta Assertividade</span>
                  <span className="text-lg font-black text-emerald-400 flex items-center gap-3 tabular-nums drop-shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]" />
                    {bestTime}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Impacto de Notícias</span>
                  <span className="text-lg font-black text-amber-500 italic drop-shadow-sm">-{nextNews}min</span>
                </div>
              </div>
              <div className="h-16 w-[2px] bg-white/5 hidden xl:block" />
              <div className="flex flex-col items-end bg-black/40 px-8 py-4 rounded-3xl border border-white/10 hover:border-emerald-500/40 transition-all cursor-default group/balance shadow-inner">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-2 group-hover/balance:text-emerald-400/60 transition-colors">Banca Operacional</span>
                <span className="text-3xl font-black italic text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.3)] tracking-tighter tabular-nums">
                  R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </header>

          {/* Grid Principal do Sistema - 12 Colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Coluna Esquerda (3): Radar & AI Thoughts */}
            <div className="lg:col-span-3 flex flex-col gap-12">
              <section className="flex flex-col gap-6">
                <div className="flex items-center justify-between px-3">
                  <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-white/40 flex items-center gap-3">
                    <Zap className="w-4 h-4 text-blue-500" />
                    Radar Master
                  </h2>
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                     <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                     <span className="text-[9px] text-blue-400 font-black uppercase tracking-widest">Live Scan</span>
                  </div>
                </div>
                <div className="glassy-card rounded-[2.5rem] border-gradient overflow-hidden">
                  <UpcomingSignals 
                    signals={signals} 
                    onSelect={setSelectedSignalId} 
                    selectedId={selectedSignalId} 
                  />
                </div>
              </section>

              <section className="flex flex-col gap-6">
                <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-white/40 flex items-center gap-3 px-3">
                   <ShieldCheck className="w-4 h-4 text-emerald-400" />
                   Matriz Neural
                </h2>
                <AIThoughtStream />
              </section>
            </div>

            {/* Coluna Central (6): Charting & Stats */}
            <div className="lg:col-span-6 flex flex-col gap-10">
              <div className="relative group p-[2px] rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent">
                <div className="absolute inset-0 bg-blue-600/10 blur-[120px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="bg-[#020611] rounded-[3rem] overflow-hidden p-2">
                  <ProfessionalChart asset={selectedSignal?.asset || "EUR/USD"} timeframe={selectedSignal?.expiration || "5m"} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <MarketStatusIndicator />
                 <StatsPanel />
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Log de Operações Recentes</h2>
                  <span className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black text-white/20 uppercase tracking-widest border border-white/5">Blockchain Verified</span>
                </div>
                <HistoryList />
              </div>
            </div>

            {/* Coluna Direita (3): Signal Card & Heatmap */}
            <div className="lg:col-span-3 flex flex-col gap-12">
               <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-rose-500/10 to-transparent rounded-full border-l-2 border-rose-500">
                  <Zap className="w-4 h-4 text-rose-500 animate-pulse" />
                  <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-white/50 italic">
                    Gatilho de Alta Probabilidade
                  </h2>
               </div>
               
               <MajorSignalCard 
                signal={selectedSignal} 
                onOperate={() => setShowSimulation(true)}
              />
              
              <div className="flex flex-col gap-6">
                <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/20 px-4 italic border-l border-white/10">Mapa Térmico Global</h3>
                <div className="glassy-card rounded-[2.5rem] border-gradient p-2">
                  <AssetHeatmap />
                </div>
              </div>
            </div>

          </div>

          {/* Footer ultra minimalista e premium */}
          <footer className="mt-12 pt-12 border-t border-white/5 flex flex-col flex-wrap lg:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.6em] mb-1">Architecture</span>
                <span className="text-[13px] font-bold text-white/30 italic">IQ Signals Pro — <span className="text-white/60">Master Legacy 5.1</span></span>
              </div>
              <div className="w-[1px] h-12 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.6em] mb-1">Neural Core</span>
                <span className="text-[13px] font-bold text-blue-500/50 tracking-widest font-mono uppercase">Liquidity_Sapphire_V5</span>
              </div>
            </div>
            
            <div className="flex gap-12 items-center">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em]">Quantum Connection Active</span>
                </div>
                <span className="text-[9px] font-bold text-white/10 uppercase tracking-[0.4em] mt-1">Latency: 2ms - 99.9% Uptime</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-[11px] font-bold text-white/15 uppercase tracking-[0.5em]">© 2026 Master AI Systems inc.</span>
              </div>
            </div>
          </footer>
        </div>
      </main>

      <AnimatePresence>
        {showSimulation && selectedSignal && (
          <SimulationModal 
            signal={selectedSignal}
            onClose={() => setShowSimulation(false)}
            onConfirm={(amount) => {
              console.log("Iniciando simulação Master com valor:", amount);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}