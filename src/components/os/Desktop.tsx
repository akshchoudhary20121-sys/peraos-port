import { useWindowManager, APP_REGISTRY } from "@/components/os/WindowContext";
import { Window } from "@/components/os/Window";
import { TopBar } from "@/components/os/TopBar";
import { Dock } from "@/components/os/Dock";
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
  "files",
  "terminal",
  "notes",
  "about",
];

function getDesktopIconColor(id: string): string {
  const colors: Record<string, string> = {
    files: "linear-gradient(180deg, #8E8E93 0%, #636366 100%)",
    terminal: "linear-gradient(180deg, #1C1C1E 0%, #000000 100%)",
    notes: "linear-gradient(180deg, #FFD60A 0%, #FF9F0A 100%)",
    about: "linear-gradient(180deg, #AF52DE 0%, #8944AB 100%)",
  };
  return colors[id] || "linear-gradient(180deg, #8E8E93 0%, #636366 100%)";
}

export function Desktop() {
  const { windows, openWindow, startMenuOpen, setStartMenuOpen } =
    useWindowManager();

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 120% 80% at 20% 10%, #1B4B8A 0%, transparent 50%),
          radial-gradient(ellipse 100% 70% at 80% 20%, #4A6FA5 0%, transparent 50%),
          radial-gradient(ellipse 80% 60% at 50% 80%, #C86DD7 0%, transparent 50%),
          radial-gradient(ellipse 100% 80% at 10% 90%, #3D5A99 0%, transparent 50%),
          radial-gradient(ellipse 80% 50% at 90% 70%, #D55DB1 0%, transparent 50%),
          linear-gradient(160deg, #1B2845 0%, #2C3E6B 25%, #5C4B8A 50%, #8B5E9B 75%, #C75B8E 100%)
        `,
      }}
      onClick={() => {
        if (startMenuOpen) setStartMenuOpen(false);
      }}
    >
      {/* Top Bar */}
      <TopBar />

      {/* Desktop Icons */}
      <div className="absolute top-10 right-4 flex flex-col gap-1 items-end">
        {DESKTOP_ICONS.map((appId) => {
          const app = APP_REGISTRY[appId];
          if (!app) return null;
          const Icon = ICON_MAP[app.icon] ?? Info;
          return (
            <button
              key={appId}
              onDoubleClick={() => openWindow(appId)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/15 active:bg-white/20 transition-colors cursor-default group w-[72px] flex-col"
            >
              <div
                className="w-12 h-12 rounded-[10px] flex items-center justify-center group-hover:shadow-lg transition-shadow"
                style={{
                  background: getDesktopIconColor(appId),
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                <Icon className="w-6 h-6 text-white" strokeWidth={1.8} />
              </div>
              <span className="text-[11px] text-white font-medium leading-tight text-center drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] w-full truncate">
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

      {/* Dock */}
      <Dock />

      {/* Start Menu (Spotlight-style) */}
      <StartMenu />
    </div>
  );
}
