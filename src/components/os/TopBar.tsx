import { useState, useEffect } from "react";
import { useWindowManager } from "@/components/os/WindowContext";
import { Wifi, Battery, BatteryCharging, Volume2, Search } from "lucide-react";

export function TopBar() {
  const { focusedWindowId, windows, startMenuOpen, setStartMenuOpen } =
    useWindowManager();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const focusedWindow = windows.find((w) => w.id === focusedWindowId && !w.isMinimized);

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 h-10 flex items-center px-4 z-[9999] select-none"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* Left: Logo + Active app */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={() => setStartMenuOpen("toggle")}
          className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-black/5 transition-colors"
        >
          <div className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white"
            style={{ background: "linear-gradient(135deg, #4285F4, #34A853)" }}
          >
            P
          </div>
          <span className="text-[13px] font-medium text-[#202124] hidden sm:inline">
            PeraOS
          </span>
        </button>
        {focusedWindow && (
          <span className="text-[13px] text-[#5f6368] hidden md:inline">
            {focusedWindow.title}
          </span>
        )}
      </div>

      {/* Right: System tray */}
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-black/5 transition-colors cursor-default">
          <Wifi className="w-3.5 h-3.5 text-[#5f6368]" />
          <Volume2 className="w-3.5 h-3.5 text-[#5f6368]" />
          <Battery className="w-4 h-4 text-[#5f6368]" />
        </div>
        <div className="px-2 py-1 rounded-lg hover:bg-black/5 transition-colors cursor-default text-right">
          <div className="text-[12px] font-medium text-[#202124] leading-tight">
            {formatTime(time)}
          </div>
          <div className="text-[11px] text-[#5f6368] leading-tight">
            {formatDate(time)}
          </div>
        </div>
      </div>
    </div>
  );
}
