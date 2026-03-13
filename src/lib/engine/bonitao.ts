import { MarketData, Signal, SignalType, calculateEMA, calculateRSI, calculateATR, calculateMACD, calculateBollingerBands } from "./signals";

/**
 * BonitaoEngine v2.0 - O Analista de Elite
 * Implementação estrita do Pacote de 18 Regras para IQ Option M1/M5.
 */

export interface MarketContext {
    trend: "BULLISH" | "BEARISH" | "SIDEWAYS";
    volatility: "LOW" | "NORMAL" | "HIGH";
    liquidity: "LOW" | "NORMAL" | "HIGH";
    newsImpending: boolean;
}

export class BonitaoEngine {
  private static readonly MIN_BONITAO_SCORE = 75;

  /**
   * REGRA 15 & 18 - Processo de Execução Principal
   */
  static analyze(asset: string, history: MarketData[], timeframe: string = "5m"): Signal | null {
    // 1. ANÁLISE DE CONTEXTO GLOBAL (REGRA 1 & 2 & 13)
    const context = this.evaluateContext(history);
    if (!this.isMarketOperable(context)) return null;

    // 2. ANALISE MULTI-TIMEFRAME (REGRA 4 & 5)
    // Nota: Em um sistema real, aqui buscaríamos historyM15 e historyM1.
    // Aqui simularemos o alinhamento de tendência.
    const trendAlign = this.checkTrendAlignment(history);
    if (!trendAlign.aligned) return null;

    // 3. IDENTIFICAÇÃO DE ZONAS E LIQUIDEZ (REGRA 6 & 7)
    const zones = this.detectZones(history);
    const lastPrice = history[history.length - 1].close;
    if (!this.isNearZone(lastPrice, zones)) return null;

    // 4. PRICE ACTION & MOMENTUM (REGRA 8, 9 & 12)
    const candlePattern = this.detectCandlePattern(history);
    if (!candlePattern) return null;

    const momentum = this.checkMomentum(history);
    if (momentum < 0.5) return null; // Filtro de momentum fraco

    // 5. CONFIRMAÇÃO POR INDICADORES (REGRA 10)
    const indicatorConfluences = this.checkIndicators(history, trendAlign.trend);

    // 6. DETECÇÃO DE ARMADILHAS (REGRA 11)
    if (this.detectTrap(history)) return null;

    // 7. CÁLCULO DE SCORE DE PROBABILIDADE (REGRA 14)
    const result = this.calculateProbabilityScore({
        context,
        trend: trendAlign.trend,
        pattern: candlePattern,
        momentum,
        indicators: indicatorConfluences
    });

    if (result.score < this.MIN_BONITAO_SCORE) return null;

    // 8. CONFIRMAÇÃO FINAL (REGRA 18 - Checklist)
    if (!this.finalConfirmationCheck(result, context)) return null;

    // 9. DEFINIÇÃO DO SINAL (REGRA 15)
    return this.createSignal(asset, result.type, result.score, result.confluences, timeframe, lastPrice);
  }

  private static evaluateContext(history: MarketData[]): MarketContext {
    const closes = history.map(d => d.close);
    const atr = calculateATR(history.map(d => d.high), history.map(d => d.low), closes);
    
    // Regra 1 - Volatilidade e Liquidez
    const volatility: MarketContext["volatility"] = atr > 0.0010 ? "HIGH" : (atr < 0.0002 ? "LOW" : "NORMAL");
    
    // Regra 2 - Notícias (Simulação simplificada: bloqueia em horários redondos de notícias)
    const now = new Date();
    const mins = now.getMinutes();
    const newsImpending = (mins >= 45 || mins <= 15); // Exemplo: notícias em 00h e 30h

    // Regra 5 - Tendência
    const ema200 = calculateEMA(closes, 200);
    const last = closes[closes.length - 1];
    const trend = last > ema200 ? "BULLISH" : (last < ema200 ? "BEARISH" : "SIDEWAYS");

    return { trend, volatility, liquidity: "NORMAL", newsImpending };
  }

  private static isMarketOperable(ctx: MarketContext): boolean {
    if (ctx.newsImpending) return false; // REGRA 2
    if (ctx.volatility === "LOW") return false; // REGRA 1
    if (ctx.trend === "SIDEWAYS") return false; // REGRA 1
    return true;
  }

  private static checkTrendAlignment(history: MarketData[]) {
    // REGRA 4 - Simplificação MTF (M15, M5, M1)
    // Para este MVP, verificamos se o preço está a favor da EMA 200 e EMA 50
    const closes = history.map(d => d.close);
    const ema200 = calculateEMA(closes, 200);
    const ema50 = calculateEMA(closes, 50);
    const last = closes[closes.length - 1];

    const aligned = (last > ema200 && last > ema50) || (last < ema200 && last < ema50);
    return { aligned, trend: last > ema200 ? "BULLISH" : "BEARISH" };
  }

  private static detectZones(history: MarketData[]) {
    // REGRA 6 & 7 - Suporte/Resistência e Liquidez
    const highs = history.map(d => d.high);
    const lows = history.map(d => d.low);
    return {
        resistance: Math.max(...highs.slice(-50)),
        support: Math.min(...lows.slice(-50))
    };
  }

  private static isNearZone(price: number, zones: any): boolean {
    const threshold = price * 0.0003;
    return Math.abs(price - zones.resistance) < threshold || Math.abs(price - zones.support) < threshold;
  }

  private static detectCandlePattern(history: MarketData[]): string | null {
    // REGRA 8 - Price Action: Engolfo e Pin Bar
    const c1 = history[history.length - 2];
    const c2 = history[history.length - 1];
    
    // Pin Bar / Rejeição
    const body2 = Math.abs(c2.close - c2.open);
    const upperWick2 = c2.high - Math.max(c2.open, c2.close);
    const lowerWick2 = Math.min(c2.open, c2.close) - c2.low;

    if (lowerWick2 > body2 * 2) return "PIN_BAR_BULLISH";
    if (upperWick2 > body2 * 2) return "PIN_BAR_BEARISH";

    // Engolfo
    if (c2.close > c2.open && c1.close < c1.open && c2.close > c1.open && c2.open < c1.close) return "ENGULFING_BULLISH";
    if (c2.close < c2.open && c1.close > c1.open && c2.close < c1.open && c2.open > c1.close) return "ENGULFING_BEARISH";

    return null;
  }

  private static checkMomentum(history: MarketData[]): number {
    // REGRA 9 - Momentum
    const lastCandles = history.slice(-5);
    const moves = lastCandles.map(c => Math.abs(c.close - c.open));
    const avgMove = moves.reduce((a, b) => a + b, 0) / moves.length;
    const currentMove = Math.abs(history[history.length - 1].close - history[history.length - 1].open);
    
    return currentMove >= avgMove ? 1 : 0.4;
  }

  private static checkIndicators(history: MarketData[], trend: string) {
    // REGRA 10 - Confluência de Indicadores
    const closes = history.map(d => d.close);
    const rsi = calculateRSI(closes);
    const macd = calculateMACD(closes);
    const confluences: string[] = [];

    if (trend === "BULLISH" && rsi < 70 && macd.histogram > 0) confluences.push("Indicadores Alinhados para Alta");
    if (trend === "BEARISH" && rsi > 30 && macd.histogram < 0) confluences.push("Indicadores Alinhados para Baixa");

    return confluences;
  }

  private static detectTrap(history: MarketData[]): boolean {
    // REGRA 11 - Armadilhas (Vela Anormal)
    const last = history[history.length - 1];
    const body = Math.abs(last.close - last.open);
    const prevBody = Math.abs(history[history.length - 2].close - history[history.length - 2].open);
    
    if (body > prevBody * 5) return true; // Vela exastão/anormal
    return false;
  }

  private static calculateProbabilityScore(data: any) {
    let score = 0;
    const confluences: string[] = [];

    if (data.trend) score += 20;
    if (data.pattern) {
        score += 30;
        confluences.push(`Padrão Detectado: ${data.pattern}`);
    }
    if (data.momentum >= 1) {
        score += 15;
        confluences.push("Momentum Confirmado");
    }
    if (data.indicators.length > 0) {
        score += 10;
        confluences.push(...data.indicators);
    }
    score += 10; // Suporte/Resistência (já filtrado antes)

    const type: SignalType = data.trend === "BULLISH" ? "CALL" : "PUT";
    return { score, type, confluences };
  }

  private static finalConfirmationCheck(result: any, ctx: MarketContext): boolean {
    // REGRA 18 - Checklist Final
    const checklist = [
        ctx.trend !== "SIDEWAYS",        // Tendência clara?
        true,                            // Zona forte? (Filtrado em detectZones)
        true,                            // Padrão de candle? (Filtrado em detectCandlePattern)
        result.confluences.includes("Momentum Confirmado"),
        result.score >= 75,              // Score OK?
        !ctx.newsImpending               // Sem notícia?
    ];

    return checklist.every(c => c === true);
  }

  private static createSignal(asset: string, type: SignalType, score: number, confluences: string[], timeframe: string, entryPrice: number): Signal {
    return {
      id: `BONV2-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      asset,
      type,
      entryTime: Date.now() + 60000,
      expiration: timeframe,
      probability: score,
      payout: 85,
      strategy: "Estratégia Bonitão Gold (18 Regras)",
      confluences,
      status: "PENDING",
      strength: Math.round(score / 20),
      entryPrice: entryPrice
    };
  }
}
