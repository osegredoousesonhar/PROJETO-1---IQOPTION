"use client";

import { LayoutDashboard, LineChart, History, Settings, Zap, LogOut } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-20 bg-[#030816] border-r border-white/5 flex flex-col items-center py-8 gap-10 z-[100]">
      <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
        <Zap className="w-6 h-6 text-white fill-white" />
      </div>

      <nav className="flex flex-col gap-6">
        {[
          { icon: LayoutDashboard, active: true },
          { icon: LineChart, active: false },
          { icon: History, active: false },
          { icon: Settings, active: false },
        ].map((item, i) => (
          <button 
            key={i}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              item.active ? "bg-white/10 text-white border border-white/10" : "text-white/20 hover:text-white/40 hover:bg-white/5"
            }`}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </nav>

      <div className="mt-auto">
         <button className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500/20 transition-all border border-rose-500/20">
            <LogOut className="w-5 h-5" />
         </button>
      </div>
    </aside>
  );
}
