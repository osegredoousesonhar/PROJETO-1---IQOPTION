"use client";

import { Zap } from "lucide-react";

export function NewsPanel() {
  const news = [
    { impact: 3, title: "CPI Monthly Report", asset: "USD", time: "10:30" },
    { impact: 2, title: "ECB President Speech", asset: "EUR", time: "12:15" },
    { impact: 1, title: "Retail Sales Change", asset: "GBP", time: "15:00" },
    { impact: 2, title: "Interest Rate Decision", asset: "JPY", time: "22:00" },
  ];

  const renderBulls = (count: number) => {
    return Array.from({ length: 3 }).map((_, i) => (
      <Zap key={i} className={`w-3 h-3 ${i < count ? "text-[#ffb800] fill-[#ffb800]" : "text-white/5"}`} />
    ));
  };

  return (
    <div className="w-full bg-[#05060a]/50 rounded-[2rem] border border-white/5 p-6 mb-6">
      <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 mb-6 italic px-2">Calendário de Notícias</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {news.map((item, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-0.5">
                {renderBulls(item.impact)}
              </div>
              <span className="text-[10px] font-black text-[#ffb800] italic">{item.time}</span>
            </div>
            
            <h4 className="text-[11px] font-black text-white italic truncate mb-1">{item.title}</h4>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                 <span className="text-[8px] font-bold text-white/40">{item.asset[0]}</span>
              </div>
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{item.asset}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
