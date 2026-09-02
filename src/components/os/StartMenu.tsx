import { useState, useEffect, useRef } from "react";
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
  Search,
  Power,
  User,
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

const APP_ORDER = [
  "browser",
  "files",
  "terminal",
  "calculator",
  "notes",
  "settings",
  "music",
  "weather",
  "clock",
  "monitor",
  "about",
];

function getAppColor(id: string): string {
  const colors: Record<string, string> = {
    browser: "linear-gradient(135deg, #64D2FF, #0A84FF)",
    files: "linear-gradient(135deg, #8E8E93, #48484A)",
    terminal: "linear-gradient(135deg, #3A3A3C, #1C1C1E)",
    calculator: "linear-gradient(135deg, #636366, #1C1C1E)",
    notes: "linear-gradient(135deg, #FFD60A, #FF9F0A)",
    settings: "linear-gradient(135deg, #8E8E93, #48484A)",
    music: "linear-gradient(135deg, #FF375F, #FF2D55)",
    weather: "linear-gradient(135deg, #5AC8FA, #007AFF)",
    clock: "linear-gradient(135deg, #5AC8FA, #007AFF)",
    monitor: "linear-gradient(135deg, #30D158, #28A745)",
    about: "linear-gradient(135deg, #BF5AF2, #8944AB)",
  };
  return colors[id] || "linear-gradient(135deg, #8E8E93, #48484A)";
}

export function StartMenu() {
  const { startMenuOpen, setStartMenuOpen, openWindow } = useWindowManager();
  const [search, setSearch] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (startMenuOpen) {
      queueMicrotask(() => {
        setSearch("");
        inputRef.current?.focus();
      });
    }
  }, [startMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as HTMLElement)) {
        setStartMenuOpen(false);
      }
    };
    if (startMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [startMenuOpen, setStartMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && startMenuOpen) {
        setStartMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [startMenuOpen, setStartMenuOpen]);

  if (!startMenuOpen) return null;

  const filteredApps = APP_ORDER.filter((id) => {
    const app = APP_REGISTRY[id];
    if (!app) return false;
    if (!search) return true;
    return app.title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-[9998]" onClick={() => setStartMenuOpen(false)}>
      <div
        ref={menuRef}
        className="absolute left-4 top-[34px] w-[340px] rounded-[14px] overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(60px) saturate(200%)",
          WebkitBackdropFilter: "blur(60px) saturate(200%)",
          boxShadow: "0 12px 48px rgba(0,0,0,0.15), 0 2px 10px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.06)",
          animation: "startMenuIn 0.18s cubic-bezier(0.16,1,0.3,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search */}
        <div className="p-2.5 pb-1.5">
          <div className="flex items-center gap-2 px-3 py-[7px] rounded-[9px]" style={{ background: "rgba(0,0,0,0.06)" }}>
            <Search className="w-[14px] h-[14px] text-[#86868B] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[13px] text-[#1D1D1F] placeholder-[#86868B] outline-none"
            />
          </div>
        </div>

        {/* App Grid */}
        <div className="px-3 pb-2.5 pt-1 grid grid-cols-4 gap-0.5">
          {filteredApps.map((id) => {
            const app = APP_REGISTRY[id];
            const Icon = ICON_MAP[app.icon] ?? Info;
            return (
              <button
                key={id}
                onClick={() => openWindow(id)}
                className="flex flex-col items-center gap-[5px] p-2.5 rounded-[10px] hover:bg-black/5 active:bg-black/8 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center"
                  style={{
                    background: getAppColor(id),
                    boxShadow: "0 1px 4px rgba(0,0,0,0.15), inset 0 0.5px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <Icon className="w-[20px] h-[20px] text-white" strokeWidth={1.7} />
                </div>
                <span className="text-[10.5px] text-[#1D1D1F] leading-tight text-center">
                  {app.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-3 py-2 border-t border-black/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2 px-2 py-1 rounded-[8px]">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #8E8E93, #636366)",
                boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.2)",
              }}
            >
              <User className="w-[14px] h-[14px] text-white" />
            </div>
            <span className="text-[12px] text-[#1D1D1F] font-medium">Guest</span>
          </div>
          <button className="p-1.5 rounded-[8px] hover:bg-black/5 active:bg-black/8 transition-colors">
            <Power className="w-[14px] h-[14px] text-[#86868B]" />
          </button>
        </div>
      </div>
    </div>
  );
}
