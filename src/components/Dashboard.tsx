import React, { useState, useEffect } from "react";
import { Settings2, Zap, Palette, Sun, RefreshCw } from "lucide-react";
import { sendState } from "../lib/api";

const MODES = [
  { id: "solid", label: "Solid", icon: Sun },
  { id: "rainbow", label: "Rainbow", icon: Palette },
  { id: "breathe", label: "Breathe", icon: RefreshCw },
  { id: "strobe", label: "Strobe", icon: Zap },
];

const THEMES = [
  { id: "cyberpunk", color: "#ff003c", name: "Cyberpunk" },
  { id: "neon", color: "#00ffcc", name: "Neon" },
  { id: "matrix", color: "#00ff00", name: "Matrix" },
  { id: "synthwave", color: "#ff00ff", name: "Synthwave" },
  { id: "amber", color: "#ffb000", name: "Amber" },
  { id: "ice", color: "#00ccff", name: "Ice" },
];

export default function Dashboard({ globalPower }: { globalPower: boolean }) {
  const [activeMode, setActiveMode] = useState("rainbow");
  const [activeTheme, setActiveTheme] = useState(THEMES[0].id);
  const [brightness, setBrightness] = useState(80);

  // Strobe specific state
  const [rpm, setRpm] = useState(1200);
  const [phase, setPhase] = useState(0);

  // Debounce API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      const activeThemeData = THEMES.find((t) => t.id === activeTheme);
      const themeColor = activeThemeData?.color || "#00FFCC";

      const payload = {
        system: {
          power_on: globalPower,
          global_brightness: Math.round((brightness / 100) * 255),
          active_mode: activeMode,
          active_theme: activeThemeData?.id || "neon",
        },
        effect_settings: {
          strobe: {
            target_rpm: rpm,
            phase_offset_degrees: phase,
            pulse_width_us: 1200,
            base_color: themeColor,
            flash_color: "#FFFFFF",
          },
          breathe: {
            speed_multiplier: 1.5,
            min_brightness: 50,
          },
          solid: {
            primary_color: themeColor,
          },
        },
      };

      sendState(payload);
    }, 150);

    return () => clearTimeout(timer);
  }, [globalPower, activeMode, activeTheme, brightness, rpm, phase]);

  return (
    <div
      className={`space-y-8 transition-opacity duration-300 ${!globalPower ? "opacity-50 pointer-events-none" : "opacity-100"}`}
    >
      {/* Mode Selection */}
      <section>
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
          Lighting Mode
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`p-4 rounded-2xl flex flex-col items-center gap-3 transition-all duration-200 border ${
                  isActive
                    ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                    : "bg-zinc-900/50 border-zinc-800/50 text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-300"
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${isActive ? "text-indigo-400" : ""}`}
                />
                <span className="text-sm font-medium">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Global Brightness */}
      <section className="bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-zinc-300">Brightness</h2>
          <span className="text-xs font-mono text-zinc-500">{brightness}%</span>
        </div>
        <div className="relative w-full h-3 bg-zinc-950 rounded-full border border-zinc-800/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            style={{ width: `${brightness}%` }}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </section>

      {/* Theme Palette (Visible for Solid/Breathe) */}
      {(activeMode === "solid" || activeMode === "breathe") && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
            Color Theme
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x no-scrollbar">
            {THEMES.map((theme) => {
              const isActive = activeTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setActiveTheme(theme.id)}
                  className="flex flex-col items-center gap-2 flex-shrink-0 snap-center"
                >
                  <div
                    className={`w-14 h-14 rounded-full transition-all duration-300 border-2 ${
                      isActive
                        ? "border-white scale-110 shadow-lg"
                        : "border-transparent scale-100 opacity-80"
                    }`}
                    style={{
                      backgroundColor: theme.color,
                      boxShadow: isActive
                        ? `0 0 20px ${theme.color}60`
                        : "none",
                    }}
                  />
                  <span
                    className={`text-xs font-medium ${isActive ? "text-zinc-200" : "text-zinc-500"}`}
                  >
                    {theme.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Strobe Tuning Dashboard */}
      {activeMode === "strobe" && (
        <section className="bg-zinc-900/80 border border-indigo-500/20 rounded-3xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-500 relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-50" />

          <div className="flex items-center gap-2 mb-6">
            <Settings2 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-medium text-zinc-200">Strobe Tuning</h2>
          </div>

          <div className="space-y-6">
            {/* Fan RPM */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-medium text-zinc-400">
                  Target Fan RPM
                </label>
                <div className="flex items-center gap-2 bg-zinc-950 rounded-lg px-2 py-1 border border-zinc-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
                  <input
                    type="number"
                    value={rpm}
                    onChange={(e) => setRpm(Number(e.target.value))}
                    className="w-16 bg-transparent text-right text-sm font-mono text-zinc-200 focus:outline-none"
                  />
                  <span className="text-xs text-zinc-600 font-mono">RPM</span>
                </div>
              </div>
              <div className="relative w-full h-3 bg-zinc-950 rounded-full border border-zinc-800/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                  style={{ width: `${((rpm - 500) / 2500) * 100}%` }}
                />
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="10"
                  value={rpm}
                  onChange={(e) => setRpm(Number(e.target.value))}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-zinc-600 font-mono">
                <span>500</span>
                <span>3000</span>
              </div>
            </div>

            {/* Phase/Offset */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-medium text-zinc-400">
                  Phase Offset
                </label>
                <span className="text-xs font-mono text-zinc-500">
                  {phase}°
                </span>
              </div>
              <div className="relative w-full h-3 bg-zinc-950 rounded-full border border-zinc-800/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                  style={{ width: `${((phase + 180) / 360) * 100}%` }}
                />
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={phase}
                  onChange={(e) => setPhase(Number(e.target.value))}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-zinc-600 font-mono">
                <span>-180° (Reverse)</span>
                <span>0° (Freeze)</span>
                <span>+180° (Forward)</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
