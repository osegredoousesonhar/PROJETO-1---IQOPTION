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
import { LayoutDashboard, ShieldCheck, Zap, Server, Clock } from "lucide-react";
import { SimulationModal } from "@/components/SimulationModal";

export default function DashboardPage() {
  const { signals, balance, bestTime, nextNews } = useTrades();
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);
  const [showSimulation, setShowSimulation] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!selectedSignalId && signals.length > 0) {
      setSelectedSignalId(signals[0].id);
    }
  }, [signals, selectedSignalId]);

  const selectedSignal = signals.find((s) => s.id === selectedSignalId) || (signals.length > 0 ? signals[0] : null);

  return (
    <div className="flex min-h-screen bg-[#020408] text-white overflow-hidden selection:bg-[#ffb800]/30">
      <Sidebar />

      <main className="flex-1 ml-64 p-10 overflow-y-auto h-screen custom-scrollbar">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-12">
          
          {/* Header Superior - Estilo Elite V5.1 */}
          <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-12 border-b border-white/5 pb-12 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#ffb800] blur-[150px] opacity-[0.03] transition-opacity group-hover:opacity-[0.07] pointer-events-none" />
            
            <div className="relative z-10">
              <h1 className="text-4xl font-black italic tracking-tighter leading-none mb-4 flex items-center gap-4">
                <span className="text-white drop-shadow-2xl">CARREGANDO</span>
                <span className="text-[#ffb800] uppercase drop-shadow-[0_0_15px_rgba(255,184,0,0.5)]">
                  {selectedSignal?.asset || "ANALISANDO..."}
                </span>
                <span className="text-[14px] bg-[#ffb800]/10 text-[#ffb800] px-4 py-1.5 rounded-full border border-[#ffb800]/20 font-black not-italic ml-6">
                   MASTER ELITE v5.1 Platinum
                </span>
              </h1>
              <p className="text-[14px] font-bold text-white/30 tracking-[0.2em] flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse shadow-[0_0_10px_#00e676]" />
                SISTEMA COGNITIVO ATIVO — <span className="text-white">BONITÃO ENGINE V2.0 HARDWARE MODE</span>
              </p>
            </div>
            
            <div className="flex items-center gap-12 relative z-10 bg-black/40 px-10 py-6 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl">
              <div className="flex flex-col items-end border-r border-white/10 pr-12">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-2 flex items-center gap-2 italic">
                  <Clock className="w-3 h-3" /> Relógio Local
                </span>
                <span className="text-3xl font-black italic tabular-nums leading-none tracking-tighter">
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
          </header>

          {/* Grid Principal do Sistema */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Colunas Combinadas de Radar e Analytics (9) */}
            <div className="lg:col-span-8 flex flex-col gap-12">
              <section className="flex flex-col gap-10">
                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                    <div className="flex flex-col gap-6">
                      <div className="px-5">
                       <h2 className="text-[14px] font-black uppercase tracking-[0.5em] text-[#ffb800] flex items-center gap-3 italic mb-1">
                          RADAR OPORTUNIDADES M1
                        </h2>
                        <div className="h-1 w-20 bg-[#ffb800] rounded-full opacity-30" />
                      </div>
                      <UpcomingSignals signals={signals} onSelect={setSelectedSignalId} selectedId={selectedSignalId} />
                    </div>

                    <div className="flex flex-col gap-6">
                       <div className="px-5">
                        <h2 className="text-[14px] font-black uppercase tracking-[0.5em] text-white/40 flex items-center gap-3 italic mb-1">
                          MATRIZ NEURAL ELITE
                        </h2>
                        <div className="h-1 w-20 bg-white/10 rounded-full" />
                      </div>
                      <AIThoughtStream />
                    </div>
                 </div>
              </section>

              <div className="relative group rounded-[3.5rem] overflow-hidden p-[2px] bg-gradient-to-br from-[#ffb800]/20 via-transparent to-white/5">
                <div className="bg-[#020408] rounded-[3.5rem] overflow-hidden shadow-2xl p-4">
                  <ProfessionalChart asset={selectedSignal?.asset || "EUR/USD"} timeframe={selectedSignal?.expiration || "5m"} />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020408] to-transparent pointer-events-none opacity-40" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <MarketStatusIndicator />
                 <StatsPanel />
              </div>
              
              <div className="flex flex-col gap-8">
                <span className="text-[12px] font-black uppercase tracking-[0.6em] text-white/20 italic px-5">Protocolo de Operações Recentes</span>
                <HistoryList />
              </div>
            </div>

            {/* Coluna de Ação Direta (4) */}
            <div className="lg:col-span-4 flex flex-col gap-12 sticky top-10">
               <div className="flex flex-col gap-4 px-6 border-l-4 border-[#ffb800]">
                  <h2 className="text-[18px] font-black uppercase tracking-[0.3em] text-white italic">
                    EXECUÇÃO <span className="text-[#ffb800]">MASTER</span>
                  </h2>
                  <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">
                    Sinal verificado por tripla confluência algorítmica v5.1_SAPPHIRE
                  </p>
               </div>
               
               <MajorSignalCard 
                signal={selectedSignal} 
                onOperate={() => setShowSimulation(true)}
              />

              <div className="bg-black/40 rounded-[2.5rem] border border-white/5 p-10 flex flex-col gap-8">
                 <div className="flex flex-col">
                    <span className="text-[11px] font-black text-[#ffb800] uppercase tracking-[0.4em] mb-4 flex items-center gap-2 italic">
                       SALDO EM TERMINAL
                    </span>
                    <h3 className="text-5xl font-black italic tracking-tighter text-white tabular-nums drop-shadow-lg">
                      R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </h3>
                 </div>
                 <AssetHeatmap />
              </div>

              <div className="p-8 bg-gradient-to-br from-[#ffb800]/5 to-transparent border border-[#ffb800]/10 rounded-[2rem] flex flex-col gap-4 text-center">
                 <span className="text-[9px] font-black text-[#ffb800] uppercase tracking-[0.5em] italic">Protocolo de Segurança</span>
                 <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest font-mono">SECURE_SSL_V5_HARDWARE_CONNECTED</p>
              </div>
            </div>

          </div>
        </div>
      </main>

      <AnimatePresence>
        {showSimulation && selectedSignal && (
          <SimulationModal 
            signal={selectedSignal}
            onClose={() => setShowSimulation(false)}
            onConfirm={(amount) => {
              console.log("Iniciando simulação com valor:", amount);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}