"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData, CandlestickSeries } from "lightweight-charts";
import { RealTimeMarket } from "@/lib/engine/realtime";

interface ProfessionalChartProps {
  asset: string;
  timeframe?: string;
}

export function ProfessionalChart({ asset, timeframe = "5m" }: ProfessionalChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "rgba(255, 255, 255, 0.5)",
      },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.03)" },
        horzLines: { color: "rgba(255, 255, 255, 0.03)" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      timeScale: {
        borderColor: "rgba(255, 255, 255, 0.1)",
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: "rgba(255, 255, 255, 0.1)",
      }
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981",
      downColor: "#f43f5e",
      borderVisible: false,
      wickUpColor: "#10b981",
      wickDownColor: "#f43f5e",
    });

    // Initial Data
    const history = RealTimeMarket.getHistory(asset, timeframe);
    if (history.length > 0) {
      const formattedData: CandlestickData[] = history.map(d => ({
        time: (d.timestamp / 1000) as any,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }));
      series.setData(formattedData);
    }

    chartRef.current = chart;
    seriesRef.current = series;

    // Subscription for updates
    const unsubscribe = RealTimeMarket.subscribe(asset, timeframe, (data: any) => {
      if (seriesRef.current) {
        seriesRef.current.update({
          time: (data.timestamp / 1000) as any,
          open: data.open,
          high: data.high,
          low: data.low,
          close: data.close,
        });
      }
    });

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      unsubscribe();
      chart.remove();
    };
  }, [asset, timeframe]);

  return (
    <div className="w-full bg-[#050b18]/40 rounded-3xl border border-white/5 p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Gráfico em Tempo Real: {asset}</span>
        </div>
        <div className="flex gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-bold text-white/20 uppercase">Provedor</span>
              <span className="text-[10px] font-black text-blue-400">LIQUIDITY V5</span>
           </div>
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
}
