"use client";

import { useState, useEffect, useCallback } from "react";
import { Signal } from "../engine/signals";
import { useTrades } from "../context/TradeContext";

export function useSignals(timeframe: string = "5m") {
  const { signals, lastScan, setTimeframe } = useTrades();

  // Quando o timeframe mudar no hook, a gente avisa o context
  useEffect(() => {
    setTimeframe(timeframe);
  }, [timeframe, setTimeframe]);

  return { 
    signals: signals.filter(s => s.expiration === timeframe), 
    lastScan 
  };
}

function playAlertSound() {
  try {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    audio.volume = 0.15;
    audio.play().catch(() => {});
  } catch (e) {
    console.error("Erro ao tocar alerta:", e);
  }
}
