import { useWindowManager, APP_REGISTRY } from "@/components/os/WindowContext";
import { Window } from "@/components/os/Window";
import { TopBar } from "@/components/os/TopBar";
import { StartMenu } from "@/components/os/StartMenu";
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

const DESKTOP_ICONS = [
  "browser",
  "files",
  "terminal",
  "notes",
  "calculator",
  "settings",
  "music",
  "weather",
  "clock",
  "monitor",
  "about",
];

export function Desktop() {
  const { windows, openWindow, setStartMenuOpen, startMenuOpen } =
    useWindowManager();

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #E8F0FE 0%, #D2E3FC 30%, #C2D9F7 60%, #AECBFA 100%)",
      }}
      onClick={() => {
        if (startMenuOpen) setStartMenuOpen(false);
      }}
    >
      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, #4285F4 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #34A853 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #FBBC05 0%, transparent 70%)" }}
        />
      </div>

      {/* Top Bar */}
      <TopBar />

      {/* Desktop Icons */}
      <div className="absolute top-14 left-4 right-4 bottom-4 grid grid-cols-[repeat(auto-fill,88px)] grid-rows-[repeat(auto-fill,100px)] gap-2 content-start">
        {DESKTOP_ICONS.map((appId) => {
          const app = APP_REGISTRY[appId];
          if (!app) return null;
          const Icon = ICON_MAP[app.icon] ?? Info;
          return (
            <button
              key={appId}
              onDoubleClick={() => openWindow(appId)}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/40 active:bg-white/50 transition-colors cursor-default group"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow"
                style={{ background: getDesktopIconColor(appId) }}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-[11px] text-[#202124] font-medium leading-tight text-center drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] max-w-[80px] truncate">
                {app.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Windows */}
      {windows.map((win) => (
        <Window key={win.id} window={win} />
      ))}

      {/* Start Menu */}
      <StartMenu />

      {/* CSS Animations */}
      <style>{`
        @keyframes startMenuIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

function getDesktopIconColor(id: string): string {
  const colors: Record<string, string> = {
    browser: "linear-gradient(135deg, #4285F4, #5C9CFF)",
    files: "linear-gradient(135deg, #5F6368, #80868B)",
    terminal: "linear-gradient(135deg, #202124, #3C4043)",
    calculator: "linear-gradient(135deg, #4285F4, #34A853)",
    notes: "linear-gradient(135deg, #FBBC05, #F9AB00)",
    settings: "linear-gradient(135deg, #5F6368, #9AA0A6)",
    music: "linear-gradient(135deg, #EA4335, #FF6D64)",
    weather: "linear-gradient(135deg, #4285F4, #34A853)",
    clock: "linear-gradient(135deg, #4285F4, #1A73E8)",
    monitor: "linear-gradient(135deg, #34A853, #1E8E3E)",
    about: "linear-gradient(135deg, #4285F4, #EA4335)",
  };
  return colors[id] || "linear-gradient(135deg, #5F6368, #80868B)";
}
