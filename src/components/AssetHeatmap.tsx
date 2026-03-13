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
  if (change > 1.5) return "rgba(34,197,94,0.30)";
  if (change > 0.5) return "rgba(34,197,94,0.18)";
  if (change > 0)   return "rgba(34,197,94,0.07)";
  if (change > -0.5) return "rgba(239,68,68,0.07)";
  if (change > -1.5) return "rgba(239,68,68,0.18)";
  return "rgba(239,68,68,0.30)";
}

export function AssetHeatmap() {
  return (
    <div className="glass glass-border rounded-2xl p-5">
      <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">
        Mapa de Calor dos Ativos
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
        {ASSETS.map((a) => (
          <div
            key={a.name}
            className="rounded-xl p-3 cursor-pointer transition-all hover:scale-[1.03]"
            style={{
              backgroundColor: getBg(a.change),
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="text-xs font-black">{a.name}</div>
            <div
              className="text-sm font-black mt-1"
              style={{ color: a.change >= 0 ? "#22c55e" : "#ef4444" }}
            >
              {a.change > 0 ? "+" : ""}
              {a.change.toFixed(2)}%
            </div>
            <div className="text-[9px] text-white/30 mt-0.5">Score: {a.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
