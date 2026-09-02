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
        className="absolute left-4 top-12 w-[340px] rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.06)",
          animation: "startMenuIn 0.2s cubic-bezier(0.16,1,0.3,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search */}
        <div className="p-3 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#f1f3f4]">
            <Search className="w-4 h-4 text-[#5f6368] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search apps..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[13px] text-[#202124] placeholder-[#9aa0a6] outline-none"
            />
          </div>
        </div>

        {/* App Grid */}
        <div className="px-3 pb-3 grid grid-cols-4 gap-1">
          {filteredApps.map((id) => {
            const app = APP_REGISTRY[id];
            const Icon = ICON_MAP[app.icon] ?? Info;
            return (
              <button
                key={id}
                onClick={() => openWindow(id)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-black/5 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: getAppColor(id) }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] text-[#202124] leading-tight text-center">
                  {app.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-3 py-2 border-t border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg">
            <div className="w-7 h-7 rounded-full bg-[#e8eaed] flex items-center justify-center">
              <User className="w-4 h-4 text-[#5f6368]" />
            </div>
            <span className="text-[12px] text-[#202124] font-medium">Guest</span>
          </div>
          <button className="p-2 rounded-lg hover:bg-black/5 transition-colors">
            <Power className="w-4 h-4 text-[#5f6368]" />
          </button>
        </div>
      </div>
    </div>
  );
}

function getAppColor(id: string): string {
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
