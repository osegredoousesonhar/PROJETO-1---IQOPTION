"use client";

import { useState, useEffect } from "react";

interface CandlePoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface MiniChartProps {
  data?: any[]; // Accept any array, but we expect OHLC
  positive?: boolean;
  height?: number;
}

export function MiniChart({ data, positive = true, height = 80 }: MiniChartProps) {
  const chartData = (data || []) as CandlePoint[];
  const WIDTH = 400;
  const H = height;

  if (chartData.length < 2) {
    return (
      <div className="flex items-center justify-center bg-white/5 rounded-xl border border-dashed border-white/10" style={{ height }}>
        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Aguardando Velas do Mercado...</p>
      </div>
    );
  }

  const minV = Math.min(...chartData.map((d) => d.low));
  const maxV = Math.max(...chartData.map((d) => d.high));
  const range = maxV - minV || 0.0001;
  const candleWidth = (WIDTH / chartData.length) * 0.8;
  const gap = (WIDTH / chartData.length) * 0.2;

  const getY = (val: number) => H - ((val - minV) / range) * H;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${H}`}
      className="w-full"
      style={{ height }}
      preserveAspectRatio="none"
    >
      {chartData.map((d, i) => {
        const x = (i * WIDTH) / chartData.length + gap / 2;
        const yOpen = getY(d.open);
        const yClose = getY(d.close);
        const yHigh = getY(d.high);
        const yLow = getY(d.low);
        
        const isUp = d.close >= d.open;
        const candleColor = isUp ? "#10b981" : "#f43f5e";
        
        return (
          <g key={i}>
            {/* Pavio */}
            <line 
              x1={x + candleWidth / 2} 
              y1={yHigh} 
              x2={x + candleWidth / 2} 
              y2={yLow} 
              stroke={candleColor} 
              strokeWidth="1" 
            />
            {/* Corpo */}
            <rect
              x={x}
              y={Math.min(yOpen, yClose)}
              width={candleWidth}
              height={Math.max(1, Math.abs(yOpen - yClose))}
              fill={candleColor}
              rx="1"
            />
          </g>
        );
      })}
    </svg>
  );
}
