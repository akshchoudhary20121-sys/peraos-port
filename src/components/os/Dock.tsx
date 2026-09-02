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

function getIconStyle(id: string): { bg: string; shadow: string } {
  const styles: Record<string, { bg: string; shadow: string }> = {
    browser: {
      bg: "linear-gradient(180deg, #64D2FF 0%, #0A84FF 100%)",
      shadow: "0 2px 8px rgba(10,132,255,0.35), inset 0 1px 0 rgba(255,255,255,0.35)",
    },
    files: {
      bg: "linear-gradient(180deg, #8E8E93 0%, #48484A 100%)",
      shadow: "0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.25)",
    },
    terminal: {
      bg: "linear-gradient(180deg, #3A3A3C 0%, #1C1C1E 100%)",
      shadow: "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
    },
    notes: {
      bg: "linear-gradient(180deg, #FFD60A 0%, #FF9F0A 100%)",
      shadow: "0 2px 8px rgba(255,159,10,0.35), inset 0 1px 0 rgba(255,255,255,0.35)",
    },
    calculator: {
      bg: "linear-gradient(180deg, #636366 0%, #1C1C1E 100%)",
      shadow: "0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
    },
    music: {
      bg: "linear-gradient(180deg, #FF375F 0%, #FF2D55 100%)",
      shadow: "0 2px 8px rgba(255,45,85,0.35), inset 0 1px 0 rgba(255,255,255,0.3)",
    },
    weather: {
      bg: "linear-gradient(180deg, #5AC8FA 0%, #007AFF 100%)",
      shadow: "0 2px 8px rgba(0,122,255,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
    },
    settings: {
      bg: "linear-gradient(180deg, #8E8E93 0%, #48484A 100%)",
      shadow: "0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)",
    },
  };
  return styles[id] || { bg: "linear-gradient(180deg, #8E8E93 0%, #48484A 100%)", shadow: "0 2px 8px rgba(0,0,0,0.2)" };
}

export function Dock() {
  const { windows, openWindow } = useWindowManager();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const iconSize = 50;
  const maxScale = 1.5;

  const runningAppIds = new Set(windows.map((w) => w.appId));

  const getScale = useCallback(
    (index: number) => {
      if (hoveredIndex === null) return 1;
      const dist = Math.abs(index - hoveredIndex);
      if (dist === 0) return maxScale;
      if (dist === 1) return 1.32;
      if (dist === 2) return 1.12;
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
  }, []);

  return (
    <div className="fixed bottom-[6px] left-1/2 -translate-x-1/2 z-[9998]">
      <div
        ref={dockRef}
        className="flex items-end px-2.5 pb-[5px] pt-[5px] rounded-[20px]"
        style={{
          background: "rgba(240,240,240,0.45)",
          backdropFilter: "blur(80px) saturate(200%)",
          WebkitBackdropFilter: "blur(80px) saturate(200%)",
          border: "0.5px solid rgba(255,255,255,0.50)",
          boxShadow: "0 4px 30px rgba(0,0,0,0.10), inset 0 0.5px 0 rgba(255,255,255,0.60)",
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
          const iconStyle = getIconStyle(appId);

          return (
            <div key={appId} className="relative">
              {/* Tooltip */}
              {hoveredIndex === i && (
                <div
                  className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-[5px] rounded-[5px] text-[12px] font-medium whitespace-nowrap pointer-events-none"
                  style={{
                    background: "rgba(30,30,30,0.88)",
                    color: "white",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
                    letterSpacing: "0.01em",
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
                  marginBottom: (scale - 1) * 6,
                  transition: "transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                <div
                  className="w-full h-full rounded-[12px] flex items-center justify-center"
                  style={{
                    background: iconStyle.bg,
                    boxShadow: iconStyle.shadow,
                  }}
                >
                  <Icon className="w-[25px] h-[25px] text-white" />
                </div>
                {/* Running indicator dot */}
                {isRunning && (
                  <div
                    className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 rounded-full"
                    style={{
                      width: 4,
                      height: 4,
                      background: "rgba(0,0,0,0.55)",
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
