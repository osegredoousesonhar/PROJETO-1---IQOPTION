/**
 * Motor de Sinais IQ Option
 * Implementação de indicadores técnicos e lógica de confluência
 */

export interface MarketData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type SignalType = "CALL" | "PUT";

export interface Signal {
  id: string;
  asset: string;
  type: SignalType;
  entryTime: number;
  expiration: string;
  probability: number;
  payout: number;
  strategy: string;
  confluences: string[];
  status: "PENDING" | "CONFIRMED" | "EXPIRED" | "CANCELLED";
  candleTimestamp?: number;
  strength?: number;
  entryPrice?: number;
  adx?: number;
  atr?: number;
}

// ─── Indicadores Técnicos ────────────────────────────────────────

export function calculateRSI(closes: number[], period: number = 14): number {
  if (closes.length <= period) return 50;
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const change = closes[closes.length - i] - closes[closes.length - i - 1];
    if (change > 0) gains += change; else losses -= change;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  return 100 - 100 / (1 + (avgGain / avgLoss));
}

export function calculateEMA(data: number[], period: number): number {
  if (data.length < period) return data[data.length - 1] || 0;
  const k = 2 / (period + 1);
  let ema = data[0];
  for (let i = 1; i < data.length; i++) ema = data[i] * k + ema * (1 - k);
  return ema;
}

export function calculateBollingerBands(data: number[], period: number = 20, stdDev: number = 2) {
  if (data.length < period) return { upper: 0, middle: 0, lower: 0 };
  const slice = data.slice(-period);
  const avg = slice.reduce((a, b) => a + b, 0) / period;
  const variance = slice.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / period;
  const sd = Math.sqrt(variance);
  return { upper: avg + stdDev * sd, middle: avg, lower: avg - stdDev * sd };
}

export function calculateMACD(data: number[]) {
  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);
  const macdLine = ema12 - ema26;
  const signalLine = macdLine * 0.9; 
  return { macd: macdLine, signal: signalLine, histogram: macdLine - signalLine };
}

export function calculateStochastic(highs: number[], lows: number[], closes: number[], period: number = 14) {
  if (closes.length < period) return { k: 50, d: 50 };
  const lastClose = closes[closes.length - 1];
  const highestHigh = Math.max(...highs.slice(-period));
  const lowestLow = Math.min(...lows.slice(-period));
  const k = ((lastClose - lowestLow) / (highestHigh - lowestLow || 1)) * 100;
  return { k, d: k }; 
}

export function calculateATR(highs: number[], lows: number[], closes: number[], period: number = 14): number {
  if (closes.length < period + 1) return 0;
  let trTotal = 0;
  for (let i = 1; i <= period; i++) {
    const h = highs[highs.length - i];
    const l = lows[lows.length - i];
    const pc = closes[closes.length - i - 1];
    const tr = Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc));
    trTotal += tr;
  }
  return trTotal / period;
}

export function calculateADX(highs: number[], lows: number[], closes: number[], period: number = 14): number {
  // Simplificação do ADX para detecção de força de tendência
  if (closes.length < period * 2) return 20; 
  let plusDM = 0, minusDM = 0;
  for (let i = 1; i < period; i++) {
    const h = highs[highs.length - i], ph = highs[highs.length - i - 1];
    const l = lows[lows.length - i], pl = lows[lows.length - i - 1];
    const moveUp = h - ph, moveDown = pl - l;
    if (moveUp > moveDown && moveUp > 0) plusDM += moveUp;
    if (moveDown > moveUp && moveDown > 0) minusDM += moveDown;
  }
  const sum = plusDM + minusDM;
  return sum === 0 ? 0 : (Math.abs(plusDM - minusDM) / sum) * 100;
}

// ─── Engine de Inteligência de Mercado ──────────────────────────

import { BonitaoEngine } from "./bonitao";

export class SignalEngine {
  private static readonly MIN_SCORE_SIGNAL = 80; // Score mínimo para recomendação aceitável

  static analyze(asset: string, history: MarketData[], timeframe: string = "5m"): Signal | null {
    // 1. PRIORIDADE MÁXIMA: MOTOR BONITÃO (18 REGRAS DE OURO)
    const bonitaoSignal = BonitaoEngine.analyze(asset, history, timeframe);
    if (bonitaoSignal) return bonitaoSignal;

    // Se o Bonitão não encontrou sinal, não emitimos sinal fraco.
    // O Bonitão já internamente faz o fallback se necessário, mas aqui 
    // garantimos que o sistema não dispare nada que não passe pelo crivo.
    return null;
  }
  private static createSignal(asset: string, type: SignalType, score: number, strategy: string, confluences: string[], expiration: string, candleTime: number, entryPrice: number, adx?: number, atr?: number): Signal {
    return {
      id: Math.random().toString(36).substr(2, 9),
      asset,
      type,
      entryTime: Date.now() + (expiration === "1m" ? 60000 : 300000), 
      expiration,
      probability: score,
      payout: 80 + Math.floor(Math.random() * 10), 
      strategy,
      confluences,
      status: "PENDING",
      candleTimestamp: candleTime,
      strength: Math.round(score / 20),
      entryPrice: entryPrice,
      adx: adx,
      atr: atr
    };
  }
}
