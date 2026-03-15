"use client";

import { useState, useEffect, memo } from "react";
import { Sidebar } from "@/components/Sidebar";
import { UpcomingSignals } from "@/components/UpcomingSignals";
import { ProfessionalChart } from "@/components/ProfessionalChart";
import { MarketStatusIndicator } from "@/components/MarketStatusIndicator";
import { StatsPanel } from "@/components/StatsPanel";
import { HistoryList } from "@/components/HistoryList";
import { MajorSignalCard } from "@/components/MajorSignalCard";
import { AssetHeatmap } from "@/components/AssetHeatmap";
import { AIThoughtStream } from "@/components/AIThoughtStream";
import { Clock } from "@/components/Clock";
import { useTrades } from "@/lib/context/TradeContext";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, ShieldCheck, Zap, Server } from "lucide-react";
import { SimulationModal } from "@/components/SimulationModal";

// Memoized components to prevent re-renders from parent state changes
const MemoizedSidebar = memo(Sidebar);
const MemoizedUpcomingSignals = memo(UpcomingSignals);
const MemoizedAIThoughtStream = memo(AIThoughtStream);
const MemoizedMarketStatusIndicator = memo(MarketStatusIndicator);
const MemoizedStatsPanel = memo(StatsPanel);
const MemoizedHistoryList = memo(HistoryList);
const MemoizedAssetHeatmap = memo(AssetHeatmap);
const MemoizedProfessionalChart = memo(ProfessionalChart);

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
    <div className="flex min-h-screen bg-[#020408] text-white overflow-hidden selection:bg-[#ffb800]/30">
      <MemoizedSidebar />

      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen custom-scrollbar">
        <div className="max-w-[1700px] mx-auto flex flex-col gap-8">
          
          {/* Header Minimal V6 */}
          <header className="flex items-center justify-between border-b border-white/5 pb-8">
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-black bg-[#ffb800] text-black px-2 py-0.5 rounded italic">LIVE</span>
                <h1 className="text-2xl font-black italic tracking-tighter text-white">
                  TERMINAL <span className="text-[#ffb800]">V5.1 PLATINUM</span>
                </h1>
              </div>
              <p className="text-[11px] font-bold text-white/20 uppercase tracking-[0.3em]">
                Sincronia Estrita com Provedor de Liquidez GOLD
              </p>
            </div>
            
            <div className="flex items-center gap-8">
               <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-[#ffb800] uppercase italic tracking-widest mb-1">Saldo Protegido</span>
                  <span className="text-2xl font-black italic tabular-nums">R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
               </div>
               <div className="h-10 w-px bg-white/5" />
               <Clock />
            </div>
          </header>

          {/* Distributed 3-Column Grid */}
          <div className="grid grid-cols-12 gap-8 items-start">
            
            {/* COLUMN 1: AI BRAIN (25%) */}
            <div className="col-span-12 xl:col-span-3 flex flex-col gap-8">
               <div className="flex flex-col gap-4">
                  <div className="px-2">
                     <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#ffb800] italic">Matriz de Decisão IA</h2>
                  </div>
                  <MemoizedAIThoughtStream />
               </div>
               
               <MemoizedMarketStatusIndicator />
            </div>

            {/* COLUMN 2: EXECUTION CORE (50%) */}
            <div className="col-span-12 xl:col-span-6 flex flex-col gap-8">
               <div className="relative group">
                  <MemoizedProfessionalChart asset={selectedSignal?.asset || "EUR/USD"} timeframe={selectedSignal?.expiration || "5m"} />
               </div>

               <div className="grid grid-cols-1 gap-8">
                  <MajorSignalCard 
                    signal={selectedSignal} 
                    onOperate={() => setShowSimulation(true)}
                  />
               </div>
            </div>

            {/* COLUMN 3: MONITOR & INTEL (25%) */}
            <div className="col-span-12 xl:col-span-3 flex flex-col gap-8">
               <div className="flex flex-col gap-4">
                  <div className="px-2 flex items-center justify-between">
                     <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 italic">Próximos Alvos</h2>
                     <span className="text-[10px] font-bold text-[#ffb800] animate-pulse">RADAR ATIVO</span>
                  </div>
                  <MemoizedUpcomingSignals signals={signals} onSelect={setSelectedSignalId} selectedId={selectedSignalId} />
               </div>

               <div className="flex flex-col gap-4">
                  <div className="px-2">
                     <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 italic">Performance Global</h2>
                  </div>
                  <MemoizedStatsPanel />
               </div>

               <div className="flex flex-col gap-4">
                  <div className="px-2">
                     <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 italic">Protocolo Histórico</h2>
                  </div>
                  <MemoizedHistoryList />
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