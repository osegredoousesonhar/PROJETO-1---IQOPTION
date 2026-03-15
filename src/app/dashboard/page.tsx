"use client";

import { memo } from "react";
import { Sidebar } from "@/components/Sidebar";
import { OperatingHours } from "@/components/OperatingHours";
import { StatsPanel } from "@/components/StatsPanel";
import { TopSignals } from "@/components/TopSignals";
import { NewsPanel } from "@/components/NewsPanel";
import { ExchangeHours } from "@/components/ExchangeHours";
import { DoubleClock } from "@/components/DoubleClock";
import { MajorSignalCard } from "@/components/MajorSignalCard";
import { OperationEntry } from "@/components/OperationEntry";
import { MarketStatus } from "@/components/MarketStatus";
import { BalancePanel } from "@/components/BalancePanel";

const MemoizedSidebar = memo(Sidebar);
const MemoizedOperatingHours = memo(OperatingHours);
const MemoizedStatsPanel = memo(StatsPanel);
const MemoizedTopSignals = memo(TopSignals);
const MemoizedNewsPanel = memo(NewsPanel);
const MemoizedExchangeHours = memo(ExchangeHours);
const MemoizedDoubleClock = memo(DoubleClock);
const MemoizedMajorSignalCard = memo(MajorSignalCard);
const MemoizedOperationEntry = memo(OperationEntry);
const MemoizedMarketStatus = memo(MarketStatus);
const MemoizedBalancePanel = memo(BalancePanel);

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#020305] p-4 lg:p-8 flex items-center justify-center overflow-hidden noise">
      {/* Container "Fit to Screen" */}
      <div className="w-full max-w-[1920px] h-[92vh] grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* COLUNA ESQUERDA (33%) */}
        <div className="flex flex-col gap-6 h-full overflow-y-auto no-scrollbar pb-6 pr-2">
           <MemoizedSidebar />
           <MemoizedOperatingHours />
           <MemoizedStatsPanel />
        </div>

        {/* COLUNA CENTRAL (33%) */}
        <div className="flex flex-col gap-6 h-full overflow-y-auto no-scrollbar pb-6 px-1">
           <MemoizedTopSignals />
           <MemoizedNewsPanel />
           <MemoizedExchangeHours />
        </div>

        {/* COLUNA DIREITA (33%) */}
        <div className="flex flex-col gap-6 h-full overflow-y-auto no-scrollbar pb-6 pl-2">
           <MemoizedDoubleClock />
           <MemoizedMajorSignalCard />
           <MemoizedOperationEntry />
           <MemoizedMarketStatus />
           <MemoizedBalancePanel />
        </div>

      </div>
    </main>
  );
}