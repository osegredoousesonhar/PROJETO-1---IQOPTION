"use client";

interface HeatmapAsset {
  name: string;
  change: number;
  score: number;
}

const ASSETS: HeatmapAsset[] = [
  { name: "EUR/USD", change: 0.42, score: 88 },
  { name: "GBP/JPY", change: -0.85, score: 72 },
  { name: "BTC/USD", change: 2.3, score: 91 },
  { name: "ETH/USD", change: 1.8, score: 83 },
  { name: "AUD/CAD", change: -0.22, score: 61 },
  { name: "USD/JPY", change: 0.15, score: 77 },
  { name: "GBP/USD", change: -0.54, score: 65 },
  { name: "EUR/GBP", change: 0.09, score: 55 },
  { name: "NZD/USD", change: -0.38, score: 69 },
  { name: "USD/CHF", change: 0.28, score: 80 },
  { name: "GOLD", change: 0.73, score: 87 },
  { name: "OIL", change: -1.2, score: 58 },
];

function getBg(change: number): string {
  if (change > 1.5) return "rgba(0, 230, 118, 0.25)";
  if (change > 0.5) return "rgba(0, 230, 118, 0.15)";
  if (change > 0)   return "rgba(0, 230, 118, 0.05)";
  if (change > -0.5) return "rgba(255, 82, 82, 0.05)";
  if (change > -1.5) return "rgba(255, 82, 82, 0.15)";
  return "rgba(255, 82, 82, 0.25)";
}

export function AssetHeatmap() {
  return (
    <div className="bg-[#0a0c14] rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group shadow-2xl noise mesh-gold">
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#ffb800] italic">
          Matriz de Liquidez Global
        </h3>
        <div className="px-3 py-1 bg-[#ffb800]/10 rounded-full border border-[#ffb800]/20">
           <span className="text-[8px] font-black text-[#ffb800] uppercase tracking-widest">Live Matrix</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {ASSETS.map((a) => {
          const isUp = a.change >= 0;
          return (
            <div
              key={a.name}
              className={`relative rounded-2xl p-5 cursor-pointer transition-all duration-500 hover:scale-[1.05] border-2 shadow-2xl group/item overflow-hidden ${
                isUp ? "border-emerald-500/10 hover:border-emerald-500/40" : "border-rose-500/10 hover:border-rose-500/40"
              }`}
            >
              <div className={`absolute inset-0 opacity-5 transition-opacity group-hover/item:opacity-20 ${isUp ? "bg-emerald-500" : "bg-rose-500"}`} />
              
              <div className="flex flex-col relative z-10">
                <div className="text-[10px] font-black italic text-white/40 uppercase tracking-tighter mb-1">{a.name}</div>
                <div className={`text-xl font-black italic tracking-tighter flex items-center gap-2 ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
                  {isUp ? "+" : ""}{a.change.toFixed(2)}%
                </div>
                <div className="mt-3 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                   <div 
                    className={`h-full rounded-full ${isUp ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-rose-500 shadow-[0_0_8px_#f43f5e]"}`} 
                    style={{ width: `${a.score}%` }} 
                   />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
         <span className="text-[8px] font-bold text-white/10 uppercase tracking-[0.3em]">Hardware Sync Connected</span>
         <div className="flex gap-1">
            {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-[#ffb800]/20" />)}
         </div>
      </div>
    </div>
  );
}
