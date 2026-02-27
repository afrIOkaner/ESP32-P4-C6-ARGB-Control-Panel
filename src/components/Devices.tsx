import React, { useState, useEffect } from "react";
import { Plus, Cpu, Trash2, Save } from "lucide-react";

interface Device {
  id: string;
  name: string;
  gpio: number;
  ledCount: number;
}

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>([
    { id: "1", name: "CPU Block", gpio: 4, ledCount: 12 },
    { id: "2", name: "Top Fans", gpio: 5, ledCount: 36 },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newGpio, setNewGpio] = useState<number | "">("");
  const [newLedCount, setNewLedCount] = useState<number | "">("");

  const handleAddDevice = () => {
    if (!newName || newGpio === "" || newLedCount === "") return;

    const newDevice: Device = {
      id: Date.now().toString(),
      name: newName,
      gpio: Number(newGpio),
      ledCount: Number(newLedCount),
    };

    const updatedDevices = [...devices, newDevice];
    setDevices(updatedDevices);

    // Reset form
    setNewName("");
    setNewGpio("");
    setNewLedCount("");
    setIsAdding(false);

    // Send to API
    saveDevices(updatedDevices);
  };

  const handleDelete = (id: string) => {
    const updatedDevices = devices.filter((d) => d.id !== id);
    setDevices(updatedDevices);
    saveDevices(updatedDevices);
  };

  const saveDevices = async (deviceList: Device[]) => {
    try {
      console.log(
        "Saving devices to ESP32:",
        JSON.stringify(deviceList, null, 2),
      );
      // const response = await fetch('/api/led/devices', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(deviceList),
      // });
    } catch (error) {
      console.error("Failed to save devices:", error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">
          Hardware Config
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center hover:bg-indigo-500/30 transition-colors"
        >
          <Plus
            className={`w-4 h-4 transition-transform duration-300 ${isAdding ? "rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Add Device Form */}
      {isAdding && (
        <div className="bg-zinc-900/80 border border-indigo-500/30 rounded-3xl p-5 space-y-4 mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50" />

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">
              Device Name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Front Intake Fans"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">
                GPIO Pin
              </label>
              <input
                type="number"
                value={newGpio}
                onChange={(e) =>
                  setNewGpio(e.target.value ? Number(e.target.value) : "")
                }
                placeholder="e.g. 4"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">
                LED Count
              </label>
              <input
                type="number"
                value={newLedCount}
                onChange={(e) =>
                  setNewLedCount(e.target.value ? Number(e.target.value) : "")
                }
                placeholder="e.g. 24"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 transition-colors font-mono"
              />
            </div>
          </div>

          <button
            onClick={handleAddDevice}
            disabled={!newName || newGpio === "" || newLedCount === ""}
            className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-medium rounded-xl py-3 mt-2 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Device
          </button>
        </div>
      )}

      {/* Device List */}
      <div className="space-y-3">
        {devices.map((device) => (
          <div
            key={device.id}
            className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4 flex items-center justify-between group hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-zinc-800/80 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-zinc-200">
                  {device.name}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-xs font-mono text-zinc-500">
                  <span>Pin: {device.gpio}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-700" />
                  <span>LEDs: {device.ledCount}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDelete(device.id)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {devices.length === 0 && (
          <div className="text-center py-12 border border-dashed border-zinc-800 rounded-3xl">
            <Cpu className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
            <p className="text-sm text-zinc-500">No devices configured.</p>
            <p className="text-xs text-zinc-600 mt-1">
              Tap the + button to add one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
