import { useState, useRef, useCallback } from "react";
import { useWindowManager, APP_REGISTRY } from "@/components/os/WindowContext";
import {
  Calculator,
  Terminal,
  FileText,
  Folder,
  Settings,
  Globe,
  Music,
  CloudSun,
  Clock,
  Activity,
  Info,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  calculator: Calculator,
  terminal: Terminal,
  "file-text": FileText,
  folder: Folder,
  settings: Settings,
  globe: Globe,
  music: Music,
  "cloud-sun": CloudSun,
  clock: Clock,
  activity: Activity,
  info: Info,
};

const DOCK_APPS = [
  "browser",
  "files",
  "terminal",
  "notes",
  "calculator",
  "music",
  "weather",
  "settings",
];

function getIconColor(id: string): string {
  const colors: Record<string, string> = {
    browser: "linear-gradient(180deg, #5AC8FA 0%, #007AFF 100%)",
    files: "linear-gradient(180deg, #8E8E93 0%, #636366 100%)",
    terminal: "linear-gradient(180deg, #1C1C1E 0%, #000000 100%)",
    notes: "linear-gradient(180deg, #FFD60A 0%, #FF9F0A 100%)",
    calculator: "linear-gradient(180deg, #636366 0%, #3A3A3C 100%)",
    music: "linear-gradient(180deg, #FF375F 0%, #FF2D55 100%)",
    weather: "linear-gradient(180deg, #5AC8FA 0%, #007AFF 100%)",
    settings: "linear-gradient(180deg, #8E8E93 0%, #636366 100%)",
  };
  return colors[id] || "linear-gradient(180deg, #8E8E93 0%, #636366 100%)";
}

export function Dock() {
  const { windows, openWindow } = useWindowManager();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ name: string; x: number } | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const iconSize = 52;
  const maxScale = 1.55;

  const runningAppIds = new Set(windows.map((w) => w.appId));

  const getScale = useCallback(
    (index: number) => {
      if (hoveredIndex === null) return 1;
      const dist = Math.abs(index - hoveredIndex);
      if (dist === 0) return maxScale;
      if (dist === 1) return 1.35;
      if (dist === 2) return 1.15;
      return 1;
    },
    [hoveredIndex],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dockRef.current) return;
      const rect = dockRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const itemWidth = iconSize + 8;
      const index = Math.floor(x / itemWidth);
      if (index >= 0 && index < DOCK_APPS.length) {
        setHoveredIndex(index);
      }
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
    setTooltip(null);
  }, []);

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[9998]">
      <div
        ref={dockRef}
        className="flex items-end px-3 pb-1.5 pt-1.5 rounded-[22px]"
        style={{
          background: "rgba(236,236,236,0.55)",
          backdropFilter: "blur(50px) saturate(180%)",
          WebkitBackdropFilter: "blur(50px) saturate(180%)",
          border: "0.5px solid rgba(255,255,255,0.45)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.12), inset 0 0.5px 0 rgba(255,255,255,0.5)",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {DOCK_APPS.map((appId, i) => {
          const app = APP_REGISTRY[appId];
          if (!app) return null;
          const Icon = ICON_MAP[app.icon] ?? Info;
          const scale = getScale(i);
          const isRunning = runningAppIds.has(appId);
          const isActive = windows.some((w) => w.appId === appId && !w.isMinimized);

          return (
            <div key={appId} className="relative">
              {/* Tooltip */}
              {hoveredIndex === i && (
                <div
                  className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md text-[12px] font-medium whitespace-nowrap pointer-events-none"
                  style={{
                    background: "rgba(30,30,30,0.85)",
                    color: "white",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  {app.title}
                </div>
              )}
              <button
                onClick={() => openWindow(appId)}
                className="relative flex items-center justify-center transition-transform"
                style={{
                  width: iconSize,
                  height: iconSize,
                  transform: `scale(${scale})`,
                  transformOrigin: "bottom center",
                  marginBottom: (scale - 1) * 8,
                  transition: "transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                <div
                  className="w-full h-full rounded-[13px] flex items-center justify-center shadow-md"
                  style={{
                    background: getIconColor(appId),
                    boxShadow: "0 2px 6px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.25)",
                  }}
                >
                  <Icon className="w-[26px] h-[26px] text-white" strokeWidth={1.8} />
                </div>
                {/* Running indicator dot */}
                {isRunning && (
                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full"
                    style={{
                      width: 4,
                      height: 4,
                      background: "rgba(0,0,0,0.5)",
                    }}
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
