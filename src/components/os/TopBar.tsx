import { useState, useEffect } from "react";
import { useWindowManager } from "@/components/os/WindowContext";
import { Wifi, Battery, Search, Moon, SlidersHorizontal } from "lucide-react";

export function TopBar() {
  const { focusedWindowId, windows, setStartMenuOpen } = useWindowManager();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const focusedWindow = windows.find((w) => w.id === focusedWindowId && !w.isMinimized);

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString("en-US", {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[25px] flex items-center px-4 z-[9999] select-none"
      style={{
        background: "rgba(236,236,236,0.72)",
        backdropFilter: "blur(60px) saturate(200%)",
        WebkitBackdropFilter: "blur(60px) saturate(200%)",
        borderBottom: "0.5px solid rgba(0,0,0,0.10)",
      }}
    >
      {/* Left: Apple logo + App name */}
      <div className="flex items-center gap-0 flex-1">
        <button
          onClick={() => setStartMenuOpen("toggle")}
          className="flex items-center px-2 py-[2px] rounded-[4px] hover:bg-black/10 active:bg-black/15 transition-colors"
        >
          {/* Apple logo */}
          <svg
            className="w-[13px] h-[16px]"
            viewBox="0 0 17 20"
            fill="rgba(0,0,0,0.88)"
          >
            <path d="M15.5 14.7c-.4.9-.8 1.8-1.3 2.6-.7 1.1-1.3 1.8-1.7 2.3-.7.8-1.4 1.2-2.1 1.2-.5 0-1.1-.2-1.8-.5-.7-.3-1.3-.5-1.8-.5-.5 0-1.1.2-1.8.5C3 20.9 2.4 21.1 1.9 21.1c-.7 0-1.4-.4-2.1-1.2C-.9 19.2-1.5 18.3-2.2 17c-.8-1.2-1.4-2.6-1.9-4.2-.5-1.7-.8-3.3-.8-4.8 0-1.7.4-3.2 1.1-4.4.6-1 1.3-1.7 2.2-2.2.8-.5 1.7-.7 2.7-.7.6 0 1.3.2 2.2.6.8.4 1.3.6 1.6.6.2 0 .7-.2 1.7-.7.9-.4 1.6-.6 2.2-.5 1.6.1 2.8.7 3.7 1.9-1.5.9-2.2 2.1-2.1 3.7 0 1.3.5 2.3 1.4 3.2.4.4.9.7 1.4.9-.1.3-.2.6-.4.9zM9.8.7c0 1-.4 2-1.1 2.8-.9 1-1.9 1.6-3 1.5 0-.1 0-.2 0-.4 0-1 .4-2 1.1-2.8.4-.4.8-.7 1.3-1 .5-.3 1-.4 1.5-.5 0 .1 0 .3 0 .4z" transform="translate(3,0) scale(0.75)" />
          </svg>
        </button>
        {focusedWindow && (
          <span className="text-[13px] font-semibold text-black/85 ml-3 tracking-[-0.01em]">
            {focusedWindow.title}
          </span>
        )}
      </div>

      {/* Right: System tray */}
      <div className="flex items-center gap-0">
        <button className="p-[3px] rounded-[4px] hover:bg-black/8 active:bg-black/12 transition-colors">
          <SlidersHorizontal className="w-[14px] h-[14px] text-black/70" />
        </button>
        <button className="p-[3px] rounded-[4px] hover:bg-black/8 active:bg-black/12 transition-colors">
          <Wifi className="w-[14px] h-[14px] text-black/70" />
        </button>
        <button className="p-[3px] rounded-[4px] hover:bg-black/8 active:bg-black/12 transition-colors">
          <Search className="w-[13px] h-[13px] text-black/70" />
        </button>
        <button className="p-[3px] rounded-[4px] hover:bg-black/8 active:bg-black/12 transition-colors">
          <Moon className="w-[13px] h-[13px] text-black/70" />
        </button>
        <button className="p-[3px] rounded-[4px] hover:bg-black/8 active:bg-black/12 transition-colors">
          <Battery className="w-[17px] h-[17px] text-black/70" />
        </button>
        <div className="px-2 py-[2px] rounded-[4px] hover:bg-black/8 active:bg-black/12 transition-colors cursor-default">
          <span className="text-[12.5px] text-black/85 tracking-[-0.01em]" style={{ fontVariantNumeric: "tabular-nums" }}>
            {formatTime(time)}
          </span>
        </div>
      </div>
    </div>
  );
}
