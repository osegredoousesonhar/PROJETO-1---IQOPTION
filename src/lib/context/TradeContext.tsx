"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { Signal, SignalEngine } from "../engine/signals";
import { RealTimeMarket } from "../engine/realtime";

export interface Trade {
  id: string;
  asset: string;
  type: "CALL" | "PUT";
  amount: number;
  profit: number;
  status: "WIN" | "LOSS" | "PENDING";
  timestamp: number;
}

interface TradeContextType {
  trades: Trade[];
  balance: number;
  autoSniperActive: boolean;
  signals: Signal[];
  lastScan: Date;
  timeframe: string;
  avgPayout: number;
  marketHealth: number;
  aiStatus: string;
  aiReasoning: string[];
  aiActivityState: "THINKING" | "ACTING" | "WAITING";
  bestTime: string;
  nextNews: string;
  setTimeframe: (tf: string) => void;
  addTrade: (trade: Omit<Trade, "id" | "timestamp">) => string;
  updateTradeStatus: (id: string, status: "WIN" | "LOSS", profit: number) => void;
  toggleAutoSniper: () => void;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

const ASSETS_TO_WATCH = ["EUR/USD", "GBP/JPY", "BTC/USD", "USD/JPY", "AUD/USD", "GOLD"];

export function TradeProvider({ children }: { children: ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [balance, setBalance] = useState(130.00);
  const [autoSniperActive, setAutoSniperActive] = useState(false);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [lastScan, setLastScan] = useState<Date>(new Date());
  const [timeframe, setTimeframe] = useState("5m");
  const [avgPayout, setAvgPayout] = useState(85);
  const [marketHealth, setMarketHealth] = useState(80);
  const [aiStatus, setAiStatus] = useState("Sincronizando Cérebro IA...");
  const [aiReasoning, setAiReasoning] = useState<string[]>([]);
  const [aiActivityState, setAiActivityState] = useState<"THINKING" | "ACTING" | "WAITING">("WAITING");
  const [bestTime, setBestTime] = useState("14:00 - 18:00");
  const [nextNews, setNextNews] = useState("10m");

  useEffect(() => {
    RealTimeMarket.init();
  }, []);

  const scanMarkets = useCallback(() => {
    const newSignals: Signal[] = [];
    const timeframes = ["1m", "5m"];
    let payoutSum = 0;
    let payoutCount = 0;
    let healthSum = 0;
    let healthCount = 0;

    ASSETS_TO_WATCH.forEach(asset => {
      timeframes.forEach(tf => {
        const history = RealTimeMarket.getHistory(asset, tf);
        const signal = SignalEngine.analyze(asset, history, tf);
        
        if (signal) {
          payoutSum += signal.payout;
          payoutCount++;

          // Cálculo de saúde baseado em ADX (0-100)
          if (signal.adx) {
            healthSum += Math.min(100, signal.adx * 2); // Transfoma ADX > 25 em saúde > 50
            healthCount++;
          }

          // REGRA DE ANTECEDÊNCIA: Mínimo 2 min, Máximo 3 min
          if (signal.probability >= 80 && signal.payout > 80) {
            const now = Date.now();
            // Define entrada para 2 a 3 minutos à frente (alinhado ao minuto)
            // Calculamos o próximo minuto cheio e adicionamos 2 minutos.
            // Isso garante que o sinal tenha entre 2:00 e 3:00 de antecedência.
            const nextMinute = Math.ceil(now / 60000) * 60000;
            signal.entryTime = nextMinute + (2 * 60000); 
            newSignals.push(signal);
          }
        }
      });
    });

    if (payoutCount > 0) {
      setAvgPayout(Math.floor(payoutSum / payoutCount));
    }

    if (healthCount > 0) {
      setMarketHealth(Math.min(100, Math.floor(healthSum / healthCount)));
    } else {
      setMarketHealth(prev => Math.max(20, prev - 1)); // Degradação se não houver sinais
    }

    if (newSignals.length > 0) {
      setSignals(prev => {
        const combined = [...newSignals, ...prev];
        const now = Date.now();
        return combined
          .filter((sig, index, self) => 
            index === self.findIndex((s) => 
              s.asset === sig.asset && 
              s.type === sig.type && 
              s.expiration === sig.expiration &&
              s.candleTimestamp === sig.candleTimestamp
            )
          )
          .filter(sig => sig.entryTime > now - 120000)
          .sort((a, b) => b.probability - a.probability)
          .slice(0, 3);
      });

      if (newSignals.some(s => s.probability >= 90)) {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
        audio.volume = 0.15;
        audio.play().catch(() => {});
      }
    }
    setLastScan(new Date());
    
    // Simulação de "Raciocínio da IA"
    const currentReasoning = SignalEngine.getReasoning();
    const currentState = SignalEngine.getActivityState();
    
    setAiReasoning(currentReasoning);
    setAiActivityState(currentState);

    if (newSignals.length > 0) {
      setAiStatus("Analisando Fluxo de Ordens Institucionais...");
      
      // Lógica Auto Sniper
      if (autoSniperActive) {
        newSignals.forEach(sig => {
           if (sig.probability >= 90) {
              const amount = 50; // Valor padrão por entrada Sniper
              addTrade({
                asset: sig.asset,
                type: sig.type,
                amount,
                profit: 0,
                status: "PENDING"
              });
              console.log(`[AUTO SNIPER] Entrada automática em ${sig.asset} (${sig.type})`);
           }
        });
      }
    } else {
      setAiStatus("Aguardando Padrão de Alta Probabilidade...");
    }
  }, [autoSniperActive]);

  useEffect(() => {
    // Primeira execução
    scanMarkets();

    // Sincroniza com a virada do minuto
    const setupMinuteSync = () => {
      const now = new Date();
      const delay = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
      
      return setTimeout(() => {
        scanMarkets();
        // Depois da primeira sincronia, roda a cada 1 minuto (ou 30s se quiser mais agressivo)
        const interval = setInterval(scanMarkets, 60000);
        return () => clearInterval(interval);
      }, delay);
    };

    const cleanup = setupMinuteSync();
    
    // Além do minuto, rodamos um scan rápido a cada 10s para capturar mudanças de volatilidade
    const fastInterval = setInterval(scanMarkets, 10000);

    return () => {
      clearTimeout(cleanup as any);
      clearInterval(fastInterval);
    };
  }, [scanMarkets]);

  // PROCESSADOR DE RESULTADOS REALISTAS
  useEffect(() => {
    const processResults = () => {
      const now = Date.now();
      
      setSignals(prev => {
        const remaining = prev.filter(sig => {
          // O tempo de expiração real depende do timeframe do sinal
          const expirationMs = sig.expiration === "1m" ? 60000 : 300000;
          const resultTime = sig.entryTime + expirationMs;
          
          if (now > resultTime && sig.status === "PENDING") {
            const history = RealTimeMarket.getHistory(sig.asset, sig.expiration);
            
            // Buscamos o preço de fechamento da vela de expiração
            // Procuramos a vela que corresponde ao minuto de expiração
            const expiryCandle = history.find(c => Math.abs(c.timestamp - resultTime) < 5000);
            const currentPrice = expiryCandle ? expiryCandle.close : (history.length > 0 ? history[history.length - 1].close : null);
            
            if (currentPrice && sig.entryPrice) {
              const isWin = sig.type === "CALL" ? currentPrice > sig.entryPrice : currentPrice < sig.entryPrice;
              
              const amount = 250; 
              const payoutDecimal = sig.payout / 100;
              const profit = isWin ? amount * payoutDecimal : 0;
              
              addTrade({
                asset: sig.asset,
                type: sig.type,
                amount,
                profit,
                status: isWin ? "WIN" : "LOSS"
              });
              
              return false; // Remove dos pendentes pois foi concluído
            }
            
            // Se ainda não temos o preço do momento da expiração, mantemos como PENDING
            // para tentar novamente no próximo intervalo até termos dados REAIS.
            return true;
          }
          return true;
        });
        return remaining;
      });
    };

    const interval = setInterval(processResults, 2000);
    return () => clearInterval(interval);
  }, [signals]);

  const addTrade = (trade: Omit<Trade, "id" | "timestamp">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newTrade: Trade = {
      ...trade,
      id,
      timestamp: Date.now(),
    };
    
    setBalance(prev => {
      if (trade.status === "WIN") return prev + trade.profit;
      if (trade.status === "LOSS") return prev - trade.amount;
      return prev;
    });
    
    setTrades(prev => [newTrade, ...prev].slice(0, 50));
    return id;
  };

  const updateTradeStatus = (id: string, status: "WIN" | "LOSS", profit: number) => {
    setTrades(prev => prev.map(t => t.id === id ? { ...t, status, profit } : t));
    if (status === "WIN") setBalance(prev => prev + profit);
  };

  const toggleAutoSniper = () => setAutoSniperActive(prev => !prev);

  return (
    <TradeContext.Provider value={{ 
      trades, balance, autoSniperActive, signals, lastScan, timeframe, avgPayout, marketHealth,
      aiStatus, aiReasoning, aiActivityState, bestTime, nextNews,
      setTimeframe, addTrade, updateTradeStatus, toggleAutoSniper 
    }}>
      {children}
    </TradeContext.Provider>
  );
}

export function useTrades() {
  const context = useContext(TradeContext);
  if (context === undefined) {
    throw new Error("useTrades must be used within a TradeProvider");
  }
  return context;
}
