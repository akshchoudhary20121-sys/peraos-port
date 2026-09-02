import { useRef, useCallback, useEffect, useState } from "react";
import { useWindowManager, APP_REGISTRY } from "@/components/os/WindowContext";
import type { WindowState } from "@/types/os";
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

interface WindowProps {
  window: WindowState;
}

export function Window({ window: win }: WindowProps) {
  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updatePosition,
    updateSize,
    focusedWindowId,
  } = useWindowManager();

  const isFocused = focusedWindowId === win.id;
  const [isHoveringTitlebar, setIsHoveringTitlebar] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });
  const resizeRef = useRef({
    isResizing: false,
    direction: "",
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    initialW: 0,
    initialH: 0,
  });

  const app = APP_REGISTRY[win.appId];
  const IconComponent = app ? ICON_MAP[app.icon] ?? Info : Info;

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (win.isMaximized) return;
      e.preventDefault();
      focusWindow(win.id);
      dragRef.current = {
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        initialX: win.x,
        initialY: win.y,
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!dragRef.current.isDragging) return;
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        updatePosition(
          win.id,
          dragRef.current.initialX + dx,
          Math.max(0, dragRef.current.initialY + dy),
        );
      };

      const handleMouseUp = () => {
        dragRef.current.isDragging = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [win.id, win.x, win.y, win.isMaximized, focusWindow, updatePosition],
  );

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, direction: string) => {
      if (win.isMaximized) return;
      e.preventDefault();
      e.stopPropagation();
      focusWindow(win.id);
      resizeRef.current = {
        isResizing: true,
        direction,
        startX: e.clientX,
        startY: e.clientY,
        initialX: win.x,
        initialY: win.y,
        initialW: win.width,
        initialH: win.height,
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!resizeRef.current.isResizing) return;
        const dx = e.clientX - resizeRef.current.startX;
        const dy = e.clientY - resizeRef.current.startY;
        const dir = resizeRef.current.direction;
        let newX = resizeRef.current.initialX;
        let newY = resizeRef.current.initialY;
        let newW = resizeRef.current.initialW;
        let newH = resizeRef.current.initialH;

        if (dir.includes("e")) newW = resizeRef.current.initialW + dx;
        if (dir.includes("s")) newH = resizeRef.current.initialH + dy;
        if (dir.includes("w")) {
          newW = resizeRef.current.initialW - dx;
          newX = resizeRef.current.initialX + dx;
          if (newW < win.minWidth) {
            newX = resizeRef.current.initialX + resizeRef.current.initialW - win.minWidth;
            newW = win.minWidth;
          }
        }
        if (dir.includes("n")) {
          newH = resizeRef.current.initialH - dy;
          newY = resizeRef.current.initialY + dy;
          if (newH < win.minHeight) {
            newY = resizeRef.current.initialY + resizeRef.current.initialH - win.minHeight;
            newH = win.minHeight;
          }
        }

        updatePosition(win.id, newX, Math.max(0, newY));
        updateSize(win.id, Math.max(newW, win.minWidth), Math.max(newH, win.minHeight));
      };

      const handleMouseUp = () => {
        resizeRef.current.isResizing = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [win, focusWindow, updatePosition, updateSize],
  );

  useEffect(() => {
    const handleSelectStart = (e: Event) => {
      if (dragRef.current.isDragging || resizeRef.current.isResizing) {
        e.preventDefault();
      }
    };
    document.addEventListener("selectstart", handleSelectStart);
    return () => document.removeEventListener("selectstart", handleSelectStart);
  }, []);

  if (win.isMinimized) return null;

  const style: React.CSSProperties = win.isMaximized
    ? { left: 0, top: 32, width: "100%", height: "calc(100% - 32px)", zIndex: win.zIndex }
    : {
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      };

  const AppComponent = app?.component;

  const showTrafficLightIcons = isHoveringTitlebar && isFocused;

  return (
    <div
      ref={windowRef}
      className="absolute flex flex-col overflow-hidden"
      style={{
        ...style,
        borderRadius: win.isMaximized ? 0 : 10,
        border: `0.5px solid rgba(0,0,0,${isFocused ? 0.15 : 0.08})`,
        boxShadow: isFocused
          ? "0 22px 70px 4px rgba(0,0,0,0.25), 0 0 0 0.5px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.12)"
          : "0 4px 16px rgba(0,0,0,0.10), 0 0 0 0.5px rgba(0,0,0,0.04)",
        background: "rgba(246,246,246,0.95)",
        animation: "windowOpen 0.2s cubic-bezier(0.16,1,0.3,1)",
      }}
      onMouseDown={() => focusWindow(win.id)}
    >
      {/* macOS Title Bar */}
      <div
        className="flex items-center h-[38px] px-3 shrink-0 select-none relative"
        style={{
          background: isFocused
            ? "linear-gradient(180deg, rgba(246,246,246,0.98) 0%, rgba(232,232,232,0.95) 100%)"
            : "linear-gradient(180deg, rgba(246,246,246,0.95) 0%, rgba(240,240,240,0.92) 100%)",
          borderBottom: `0.5px solid rgba(0,0,0,${isFocused ? 0.12 : 0.06})`,
        }}
        onMouseDown={handleDragStart}
        onDoubleClick={() => maximizeWindow(win.id)}
        onMouseEnter={() => setIsHoveringTitlebar(true)}
        onMouseLeave={() => setIsHoveringTitlebar(false)}
      >
        {/* Traffic Light Buttons */}
        <div
          className="flex items-center gap-2 mr-3"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={() => closeWindow(win.id)}
            className="w-[12px] h-[12px] rounded-full flex items-center justify-center transition-all"
            style={{
              background: isFocused ? "#FF5F57" : "#DCDCDC",
              border: `0.5px solid ${isFocused ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.08)"}`,
            }}
            title="Close"
          >
            <svg
              className="w-[7px] h-[7px] transition-opacity"
              viewBox="0 0 12 12"
              fill="none"
              stroke={isFocused ? "#4C0002" : "#808080"}
              strokeWidth="2"
              strokeLinecap="round"
              style={{ opacity: showTrafficLightIcons ? 1 : 0 }}
            >
              <line x1="3.5" y1="3.5" x2="8.5" y2="8.5" />
              <line x1="8.5" y1="3.5" x2="3.5" y2="8.5" />
            </svg>
          </button>
          {/* Minimize */}
          <button
            onClick={() => minimizeWindow(win.id)}
            className="w-[12px] h-[12px] rounded-full flex items-center justify-center transition-all"
            style={{
              background: isFocused ? "#FDBC40" : "#DCDCDC",
              border: `0.5px solid ${isFocused ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.08)"}`,
            }}
            title="Minimize"
          >
            <svg
              className="w-[7px] h-[7px] transition-opacity"
              viewBox="0 0 12 12"
              fill="none"
              stroke={isFocused ? "#995700" : "#808080"}
              strokeWidth="2"
              strokeLinecap="round"
              style={{ opacity: showTrafficLightIcons ? 1 : 0 }}
            >
              <line x1="2.5" y1="6" x2="9.5" y2="6" />
            </svg>
          </button>
          {/* Maximize */}
          <button
            onClick={() => maximizeWindow(win.id)}
            className="w-[12px] h-[12px] rounded-full flex items-center justify-center transition-all"
            style={{
              background: isFocused ? "#28C840" : "#DCDCDC",
              border: `0.5px solid ${isFocused ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.08)"}`,
            }}
            title={win.isMaximized ? "Restore" : "Maximize"}
          >
            <svg
              className="w-[7px] h-[7px] transition-opacity"
              viewBox="0 0 12 12"
              fill="none"
              stroke={isFocused ? "#006500" : "#808080"}
              strokeWidth="1.8"
              strokeLinecap="round"
              style={{ opacity: showTrafficLightIcons ? 1 : 0 }}
            >
              {win.isMaximized ? (
                <>
                  <polyline points="2,8 2,2 8,2" />
                  <polyline points="10,4 10,10 4,10" />
                </>
              ) : (
                <>
                  <polyline points="2,4 2,2 4,2" />
                  <polyline points="8,2 10,2 10,4" />
                  <polyline points="10,8 10,10 8,10" />
                  <polyline points="4,10 2,10 2,8" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Window Title (centered) */}
        <div className="flex-1 flex items-center justify-center">
          <span
            className="text-[13px] truncate"
            style={{
              color: isFocused ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.3)",
              fontWeight: isFocused ? 500 : 400,
              letterSpacing: "-0.01em",
            }}
          >
            {win.title}
          </span>
        </div>

        {/* Spacer to balance traffic lights */}
        <div className="w-[54px]" />
      </div>

      {/* App Content */}
      <div className="flex-1 overflow-hidden relative" style={{ background: "#fff" }}>
        {AppComponent ? (
          <AppComponent windowId={win.id} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No content
          </div>
        )}
      </div>

      {/* Resize Handles */}
      {!win.isMaximized && (
        <>
          <div className="absolute top-0 left-0 right-0 h-[4px] cursor-ns-resize" onMouseDown={(e) => handleResizeStart(e, "n")} />
          <div className="absolute bottom-0 left-0 right-0 h-[4px] cursor-ns-resize" onMouseDown={(e) => handleResizeStart(e, "s")} />
          <div className="absolute top-0 bottom-0 left-0 w-[4px] cursor-ew-resize" onMouseDown={(e) => handleResizeStart(e, "w")} />
          <div className="absolute top-0 bottom-0 right-0 w-[4px] cursor-ew-resize" onMouseDown={(e) => handleResizeStart(e, "e")} />
          <div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize" onMouseDown={(e) => handleResizeStart(e, "nw")} />
          <div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize" onMouseDown={(e) => handleResizeStart(e, "ne")} />
          <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize" onMouseDown={(e) => handleResizeStart(e, "sw")} />
          <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize" onMouseDown={(e) => handleResizeStart(e, "se")} />
        </>
      )}
    </div>
  );
}
