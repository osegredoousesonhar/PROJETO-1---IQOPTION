
import { MarketData } from "./signals";

export class MarketSimulator {
  private static assets: Record<string, MarketData[]> = {};

  static getHistory(asset: string, length: number = 250): MarketData[] {
    if (!this.assets[asset]) {
      this.assets[asset] = this.generateInitialHistory(asset, length);
    }
    return this.assets[asset];
  }

  static tick(asset: string): MarketData {
    const history = this.getHistory(asset);
    const last = history[history.length - 1];
    
    // Simulação de movimento de preço aleatório mas com tendência
    const isCrypto = asset.includes("BTC") || asset.includes("ETH");
    const volatility = isCrypto ? 0.0015 : 0.0008;
    const change = (Math.random() - 0.5) * volatility;
    const nextClose = last.close * (1 + change);
    
    const newTick: MarketData = {
      timestamp: Date.now(),
      open: last.close,
      high: Math.max(last.close, nextClose) * (1 + Math.random() * 0.0001),
      low: Math.min(last.close, nextClose) * (1 - Math.random() * 0.0001),
      close: nextClose,
      volume: Math.floor(Math.random() * 1000) + 500
    };

    history.push(newTick);
    if (history.length > 500) history.shift();
    
    return newTick;
  }

  private static generateInitialHistory(asset: string, length: number): MarketData[] {
    const history: MarketData[] = [];
    let lastClose = asset.includes("BTC") ? 65000 : 1.0850;
    let time = Date.now() - length * 60000;

    for (let i = 0; i < length; i++) {
      const open = lastClose;
      const change = (Math.random() - 0.5) * (asset.includes("BTC") ? 50 : 0.0005);
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * (asset.includes("BTC") ? 10 : 0.0001);
      const low = Math.min(open, close) - Math.random() * (asset.includes("BTC") ? 10 : 0.0001);
      
      history.push({
        timestamp: time,
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 1000) + 500
      });
      
      lastClose = close;
      time += 60000;
    }
    return history;
  }
}
