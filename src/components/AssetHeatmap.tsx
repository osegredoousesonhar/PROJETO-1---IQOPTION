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
    <div className="bg-black/40 rounded-[2rem] p-6 border border-white/5 shadow-2xl">
      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-6 italic">
        Fluxo Global de Ativos
      </h3>
      <div className="grid grid-cols-3 xl:grid-cols-4 gap-3">
        {ASSETS.map((a) => (
          <div
            key={a.name}
            className="rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.05] hover:shadow-xl border border-white/[0.03]"
            style={{
              backgroundColor: getBg(a.change),
              boxShadow: a.change > 1 ? 'inset 0 0 20px rgba(0, 230, 118, 0.05)' : 'none'
            }}
          >
            <div className="text-[11px] font-black italic text-white/80">{a.name}</div>
            <div
              className="text-lg font-black italic tracking-tighter mt-1"
              style={{ color: a.change >= 0 ? "#00e676" : "#ff5252" }}
            >
              {a.change > 0 ? "+" : ""}
              {a.change.toFixed(2)}%
            </div>
            <div className="text-[8px] font-bold text-white/20 uppercase mt-1">S: {a.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
