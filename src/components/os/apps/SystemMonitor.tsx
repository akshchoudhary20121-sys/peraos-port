import { useState, useEffect } from "react";
import { Cpu, HardDrive, MemoryStick, Activity, Zap, Clock } from "lucide-react";

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface ProcessInfo {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  status: string;
}

const PROCESS_NAMES = [
  "PeraOS Desktop",
  "Window Manager",
  "System Tray",
  "PeraOS Browser",
  "Notes Editor",
  "Calculator",
  "Weather Service",
  "Network Manager",
  "Audio Service",
  "Clock Daemon",
  "File Explorer",
  "Terminal",
  "System Monitor",
  "Security Agent",
  "Update Service",
];

function UsageBar({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ComponentType<{ className?: string }>; color: string }) {
  return (
    <div className="p-3 rounded-xl bg-[#f8f9fa]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span style={{ color }}><Icon className="w-4 h-4" /></span>
          <span className="text-[13px] font-medium text-[#202124]">{label}</span>
        </div>
        <span className="text-[13px] text-[#5f6368]" style={{ fontVariantNumeric: "tabular-nums" }}>
          {value}%
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-[#e8eaed] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function SystemMonitor() {
  const [cpu, setCpu] = useState(42);
  const [ram, setRam] = useState(58);
  const [disk] = useState(34);
  const [network, setNetwork] = useState(12);
  const [processes, setProcesses] = useState<ProcessInfo[]>(() =>
    PROCESS_NAMES.map((name, i) => ({
      pid: 1000 + i,
      name,
      cpu: randomBetween(0, 15),
      memory: randomBetween(1, 8),
      status: "Running",
    })),
  );
  const [uptime] = useState(() => {
    const s = Math.floor(performance.now() / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${h}h ${m}m`;
  });

  // Simulate changing values
  useEffect(() => {
    const interval = setInterval(() => {
      setCpu((prev) => Math.max(5, Math.min(95, prev + randomBetween(-10, 10))));
      setRam((prev) => Math.max(20, Math.min(90, prev + randomBetween(-5, 5))));
      setNetwork((prev) => Math.max(0, Math.min(100, prev + randomBetween(-8, 8))));
      setProcesses((prev) =>
        prev.map((p) => ({
          ...p,
          cpu: Math.max(0, Math.min(30, p.cpu + randomBetween(-3, 3))),
          memory: Math.max(1, Math.min(12, p.memory + randomBetween(-1, 1))),
        })),
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Usage bars */}
      <div className="p-4 space-y-3 border-b border-[#e8eaed]">
        <UsageBar label="CPU" value={cpu} icon={Cpu} color="#4285F4" />
        <UsageBar label="Memory" value={ram} icon={MemoryStick} color="#34A853" />
        <UsageBar label="Disk" value={disk} icon={HardDrive} color="#FBBC05" />
        <UsageBar label="Network" value={network} icon={Activity} color="#EA4335" />
      </div>

      {/* System info */}
      <div className="px-4 py-3 flex items-center gap-4 text-[12px] text-[#5f6368] border-b border-[#e8eaed] bg-[#f8f9fa]">
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>Uptime: {uptime}</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5" />
          <span>Processes: {processes.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <MemoryStick className="w-3.5 h-3.5" />
          <span>RAM: {(ram * 0.16).toFixed(1)} / 16 GB</span>
        </div>
      </div>

      {/* Process list */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-white">
            <tr className="text-[11px] text-[#5f6368] font-medium border-b border-[#e8eaed]">
              <th className="text-left px-4 py-2">Process</th>
              <th className="text-right px-4 py-2">CPU %</th>
              <th className="text-right px-4 py-2">Memory</th>
              <th className="text-right px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((p) => (
              <tr key={p.pid} className="border-b border-[#f1f3f4] hover:bg-[#f8f9fa] transition-colors">
                <td className="px-4 py-2">
                  <div className="text-[13px] text-[#202124]">{p.name}</div>
                  <div className="text-[11px] text-[#9aa0a6]">PID {p.pid}</div>
                </td>
                <td className="px-4 py-2 text-right">
                  <span className={`text-[13px] ${p.cpu > 20 ? "text-[#EA4335] font-medium" : "text-[#202124]"}`}>
                    {p.cpu.toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-2 text-right text-[13px] text-[#202124]">
                  {p.memory.toFixed(1)} MB
                </td>
                <td className="px-4 py-2 text-right">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
