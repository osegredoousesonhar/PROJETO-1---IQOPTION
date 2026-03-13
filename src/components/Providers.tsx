"use client";

import { TradeProvider } from "@/lib/context/TradeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TradeProvider>
      {children}
    </TradeProvider>
  );
}
