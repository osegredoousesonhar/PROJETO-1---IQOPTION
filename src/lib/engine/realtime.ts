"use client";

import { MarketData } from "./signals";

const ASSET_MAPPING: Record<string, string> = {
  "EUR/USD": "frxEURUSD",
  "GBP/JPY": "frxGBPJPY",
  "USD/JPY": "frxUSDJPY",
  "AUD/USD": "frxAUDUSD",
  "BTC/USD": "cryBTCUSD",
  "GOLD": "gold",
};

export class RealTimeMarket {
  private static ws: WebSocket | null = null;
  private static subscribers: Record<string, ((data: MarketData) => void)[]> = {};
  private static history1m: Record<string, MarketData[]> = {};
  private static history5m: Record<string, MarketData[]> = {};

  static init() {
    if (typeof window === "undefined") return;
    if (this.ws) return;

    this.ws = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");

    this.ws.onopen = () => {
      console.log("Connected to Real-Time Market Data (Binary.com)");
      Object.entries(ASSET_MAPPING).forEach(([asset, symbol]) => {
        // Subscribe to M1 Candles
        this.ws?.send(JSON.stringify({
          ticks_history: symbol,
          subscribe: 1,
          adjust_start_time: 1,
          count: 300,
          end: "latest",
          style: "candles",
          granularity: 60,
          passthrough: { asset, timeframe: "1m" }
        }));
        
        // Subscribe to M5 Candles
        this.ws?.send(JSON.stringify({
          ticks_history: symbol,
          subscribe: 1,
          adjust_start_time: 1,
          count: 300,
          end: "latest",
          style: "candles",
          granularity: 300,
          passthrough: { asset, timeframe: "5m" }
        }));
      });
    };

    this.ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      const passthrough = data.echo_req?.passthrough;
      
      if (!passthrough) return;

      const { asset, timeframe } = passthrough;
      const historyMap = timeframe === "1m" ? this.history1m : this.history5m;

      if (data.candles || data.ohlc) {
        if (data.candles) {
          historyMap[asset] = data.candles.map((c: any) => ({
            timestamp: c.epoch * 1000,
            open: parseFloat(c.open),
            high: parseFloat(c.high),
            low: parseFloat(c.low),
            close: parseFloat(c.close),
            volume: 100
          }));
        } else if (data.ohlc) {
          const c = data.ohlc;
          const candle = {
            timestamp: c.open_time * 1000,
            open: parseFloat(c.open),
            high: parseFloat(c.high),
            low: parseFloat(c.low),
            close: parseFloat(c.close),
            volume: 100
          };

          if (!historyMap[asset]) historyMap[asset] = [];
          const history = historyMap[asset];
          const lastIndex = history.length - 1;

          if (lastIndex >= 0 && history[lastIndex].timestamp === candle.timestamp) {
            history[lastIndex] = candle;
          } else {
            history.push(candle);
            if (history.length > 500) history.shift();
          }

          // Broadcast to subscribers (mainly for the chart/mini-charts)
          if (this.subscribers[`${asset}_${timeframe}`]) {
            this.subscribers[`${asset}_${timeframe}`].forEach(cb => cb(candle));
          }
        }
      }
    };

    this.ws.onclose = () => {
      this.ws = null;
      setTimeout(() => this.init(), 5000);
    };
  }

  static getHistory(asset: string, timeframe: string = "5m"): MarketData[] {
    return timeframe === "1m" ? this.history1m[asset] || [] : this.history5m[asset] || [];
  }

  static subscribe(asset: string, timeframe: string, callback: (data: MarketData) => void) {
    const key = `${asset}_${timeframe}`;
    if (!this.subscribers[key]) this.subscribers[key] = [];
    this.subscribers[key].push(callback);
    
    return () => {
      this.subscribers[key] = this.subscribers[key].filter(cb => cb !== callback);
    };
  }
}
