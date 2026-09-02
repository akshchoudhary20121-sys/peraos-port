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
    files: "linear-gradient(180deg, #8E8E93 0%, #48484A 100%)",
    terminal: "linear-gradient(180deg, #3A3A3C 0%, #1C1C1E 100%)",
    notes: "linear-gradient(180deg, #FFD60A 0%, #FF9F0A 100%)",
    about: "linear-gradient(135deg, #BF5AF2 0%, #5E5CE6 100%)",
  };
  return colors[id] || "linear-gradient(180deg, #8E8E93 0%, #48484A 100%)";
}

export function Desktop() {
  const { windows, openWindow, startMenuOpen, setStartMenuOpen } =
    useWindowManager();

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 140% 100% at 15% 0%, #5EB3E8 0%, transparent 55%),
          radial-gradient(ellipse 120% 80% at 85% 15%, #7BB8E0 0%, transparent 50%),
          radial-gradient(ellipse 100% 90% at 50% 90%, #C490D1 0%, transparent 50%),
          radial-gradient(ellipse 80% 70% at 10% 80%, #8FAADC 0%, transparent 50%),
          radial-gradient(ellipse 90% 60% at 90% 75%, #D4A5C7 0%, transparent 50%),
          linear-gradient(160deg, #3A6EA5 0%, #5B8FBF 20%, #7AA5CC 40%, #9A8DBF 60%, #B08CB8 80%, #C88AAE 100%)
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
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2), inset 0 0.5px 0 rgba(255,255,255,0.2)",
                }}
              >
                <Icon className="w-6 h-6 text-white" strokeWidth={1.7} />
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
