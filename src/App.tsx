import React, { useState } from "react";
import { Settings2, Cpu, Power, Palette, Activity } from "lucide-react";
import Dashboard from "./components/Dashboard";
import Devices from "./components/Devices";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "devices">(
    "dashboard",
  );
  const [globalPower, setGlobalPower] = useState(true);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <Activity className="w-5 h-5 text-indigo-400" />
            </div>
            <h1 className="font-semibold text-lg tracking-tight">
              ARGB Control
            </h1>
          </div>
          <button
            onClick={() => setGlobalPower(!globalPower)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              globalPower
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                : "bg-zinc-800/50 text-zinc-500 border border-zinc-700"
            }`}
          >
            <Power className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto p-4 pb-24">
        {activeTab === "dashboard" ? (
          <Dashboard globalPower={globalPower} />
        ) : (
          <Devices />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-800/50 pb-safe">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-around">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${
              activeTab === "dashboard"
                ? "text-indigo-400"
                : "text-zinc-500 hover:text-zinc-400"
            }`}
          >
            <Palette className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase tracking-wider">
              Control
            </span>
          </button>
          <button
            onClick={() => setActiveTab("devices")}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${
              activeTab === "devices"
                ? "text-indigo-400"
                : "text-zinc-500 hover:text-zinc-400"
            }`}
          >
            <Cpu className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase tracking-wider">
              Devices
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}
