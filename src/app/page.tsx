"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Zap, ShieldCheck, Activity, Bell, BarChart2, ArrowRight, CheckCircle2 } from "lucide-react";

const FEATURES = [
  { icon: Activity, color: "#3b82f6", title: "Radar em Tempo Real", desc: "Monitoramento contínuo de 50+ ativos com análise multi-timeframe." },
  { icon: Zap, color: "#f59e0b", title: "Score de Confiança", desc: "Cada sinal vem com score 0–100 baseado em confluências técnicas." },
  { icon: Bell, color: "#a855f7", title: "Alertas Antecipados", desc: "Receba alertas 5 minutos antes da entrada via dashboard e Telegram." },
  { icon: ShieldCheck, color: "#22c55e", title: "Filtro Inteligente", desc: "IA detecta e bloqueia sinais em mercado lateral ou manipulado." },
  { icon: BarChart2, color: "#ef4444", title: "Estatísticas Detalhadas", desc: "Win rate, melhor horário e top ativo do dia com gráficos interativos." },
  { icon: TrendingUp, color: "#22d3ee", title: "Múltiplas Estratégias", desc: "Price Action, RSI + Tendência, Rompimento, Pullback e mais." },
];

const PLANS = [
  { name: "Free", price: "R$ 0", period: "/mês", features: ["5 sinais por dia", "Ativos básicos", "Dashboard limitado"], cta: "Começar Grátis", highlight: false },
  { name: "Pro", price: "R$ 97", period: "/mês", features: ["Sinais ilimitados", "Todos os ativos", "Alertas antecipados", "Histórico completo"], cta: "Assinar Pro", highlight: true },
  { name: "Premium", price: "R$ 197", period: "/mês", features: ["Tudo do Pro", "Módulo de IA", "Estratégias exclusivas", "Suporte prioritário", "Modo Simulação"], cta: "Assinar Premium", highlight: false },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", color: "var(--color-text)" }}>
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between" style={{ height: 64 }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-sm italic" style={{ color: "#050b18" }}>IQ</div>
            <span className="font-black text-lg tracking-tight">Signals<span style={{ opacity: 0.3 }}>Pro</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm" style={{ color: "var(--color-muted)" }}>
            <a href="#features" className="hover:text-white transition-colors">Funcionalidades</a>
            <a href="#planos" className="hover:text-white transition-colors">Planos</a>
          </nav>
          <Link href="/dashboard" className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm transition-all active:scale-95 hover:opacity-90"
            style={{ background: "white", color: "#050b18" }}>
            Acessar Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="trading-grid relative flex items-center justify-center" style={{ minHeight: "100vh", paddingTop: 64 }}>
        <div className="absolute" style={{ top: "30%", left: "20%", width: 400, height: 400, background: "rgba(59,130,246,0.07)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />
        <div className="absolute" style={{ bottom: "20%", right: "20%", width: 320, height: 320, background: "rgba(34,197,94,0.07)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass glass-border mb-8">
            <span className="w-2 h-2 rounded-full dot-pulse" style={{ background: "#22c55e" }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: "rgba(34,197,94,0.8)" }}>Motor Ativo — Mercado Aberto</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-black tracking-tighter leading-none mb-6" style={{ fontSize: "clamp(48px, 8vw, 96px)" }}>
            SINAIS QUE{" "}
            <span className="italic" style={{ background: "linear-gradient(135deg, #22c55e, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              CHEGAM ANTES
            </span>
            <br />DA ENTRADA
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10" style={{ color: "var(--color-muted)" }}>
            Plataforma de análise técnica com IA para IQ Option. Receba sinais de alta
            probabilidade com score de confiança 5 minutos antes da entrada ideal.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-base transition-all active:scale-95"
              style={{ background: "white", color: "#050b18", boxShadow: "0 0 40px rgba(255,255,255,0.12)" }}>
              <Zap className="w-5 h-5" /> Acessar Radar Ao Vivo
            </Link>
            <a href="#planos"
              className="glass glass-border flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base hover:opacity-80 transition-all">
              Ver Planos <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Stats bar */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[{ v: "84%", l: "Win Rate" }, { v: "50+", l: "Ativos" }, { v: "24/7", l: "Radar Ativo" }, { v: "<5min", l: "Alerta" }].map(s => (
              <div key={s.l} className="glass glass-border rounded-xl p-4 text-center">
                <div className="text-3xl font-black italic">{s.v}</div>
                <div className="text-[10px] uppercase tracking-widest font-bold mt-1" style={{ color: "var(--color-muted)" }}>{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="font-black tracking-tight mb-4" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
            Tecnologia que <span className="italic" style={{ color: "#22c55e" }}>opera junto com você</span>
          </h2>
          <p style={{ color: "var(--color-muted)" }}>Motor de análise de confluências com múltiplos indicadores e filtros de regime.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, color, title, desc }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }} viewport={{ once: true }}
              className="glass glass-border rounded-2xl p-6 hover:scale-[1.02] transition-all cursor-default">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(255,255,255,0.05)" }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section id="planos" className="py-32" style={{ background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-black tracking-tight mb-4" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
              Escolha seu <span className="italic" style={{ color: "#22d3ee" }}>plano</span>
            </h2>
            <p style={{ color: "var(--color-muted)" }}>Acesse nossos sinais com o plano ideal para seu nível de operação.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map(plan => (
              <motion.div key={plan.name} whileHover={{ scale: 1.02 }}
                className="relative rounded-2xl p-8 flex flex-col"
                style={{
                  border: plan.highlight ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(255,255,255,0.06)",
                  background: plan.highlight ? "linear-gradient(180deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.02) 100%)" : "rgba(13,20,36,0.75)",
                  boxShadow: plan.highlight ? "0 0 40px rgba(34,197,94,0.1)" : "none",
                }}>
                {plan.highlight && (
                  <span className="absolute font-black uppercase tracking-widest text-[10px] px-3 py-1 rounded-full"
                    style={{ top: -12, left: "50%", transform: "translateX(-50%)", background: "#22c55e", color: "#050b18" }}>
                    Mais popular
                  </span>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-black">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-black">{plan.price}</span>
                    <span style={{ color: "var(--color-muted)" }} className="text-sm">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "#22c55e" }} /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard"
                  className="block w-full py-3 rounded-xl font-black text-sm text-center transition-all active:scale-95"
                  style={{
                    background: plan.highlight ? "#22c55e" : "rgba(255,255,255,0.08)",
                    color: plan.highlight ? "#050b18" : "white",
                  }}>
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center" style={{ color: "var(--color-muted)", fontSize: 13 }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center font-black text-xs italic" style={{ color: "#050b18" }}>IQ</div>
          <span className="font-black text-white">Signals Pro</span>
        </div>
        <p>© 2026 IQ Signals Pro — Plataforma de análise técnica. Não é corretora.</p>
        <p className="mt-1 text-xs opacity-50">Sinais são baseados em análise técnica e não garantem lucro. Opere com responsabilidade.</p>
      </footer>
    </div>
  );
}
