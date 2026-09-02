import { useRef, useCallback, useEffect, useState } from "react";
import { useWindowManager, APP_REGISTRY } from "@/components/os/WindowContext";
import type { WindowState } from "@/types/os";
import {
  Minus,
  Square,
  X,
  Maximize2,
  Minimize2,
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

  // Drag handlers
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

  // Resize handlers
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

  // Prevent text selection during drag
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
    ? { left: 0, top: 40, width: "100%", height: "calc(100% - 40px)", zIndex: win.zIndex }
    : {
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      };

  const AppComponent = app?.component;

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col rounded-xl overflow-hidden transition-shadow duration-150 ${
        isFocused
          ? "shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
          : "shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
      } ${win.isMaximized ? "" : ""}`}
      style={{
        ...style,
        background: "var(--os-window-bg, #ffffff)",
        border: `1px solid ${isFocused ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.04)"}`,
      }}
      onMouseDown={() => focusWindow(win.id)}
    >
      {/* Title Bar */}
      <div
        className="flex items-center h-10 px-3 shrink-0 select-none"
        style={{
          background: isFocused
            ? "var(--os-titlebar-active, #f8f9fa)"
            : "var(--os-titlebar-inactive, #f1f3f4)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          cursor: win.isMaximized ? "default" : "default",
        }}
        onMouseDown={handleDragStart}
        onDoubleClick={() => maximizeWindow(win.id)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <IconComponent className="w-4 h-4 text-[#5f6368] shrink-0" />
          <span
            className="text-[13px] font-medium truncate"
            style={{ color: isFocused ? "#202124" : "#5f6368" }}
          >
            {win.title}
          </span>
        </div>

        {/* Window Controls */}
        <div className="flex items-center gap-1 ml-2" onMouseDown={(e) => e.stopPropagation()}>
          <button
            onClick={() => minimizeWindow(win.id)}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5 text-[#5f6368]" />
          </button>
          <button
            onClick={() => maximizeWindow(win.id)}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
            title={win.isMaximized ? "Restore" : "Maximize"}
          >
            {win.isMaximized ? (
              <Minimize2 className="w-3.5 h-3.5 text-[#5f6368]" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-[#5f6368]" />
            )}
          </button>
          <button
            onClick={() => closeWindow(win.id)}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-500 hover:text-white transition-colors group"
            title="Close"
          >
            <X className="w-3.5 h-3.5 text-[#5f6368] group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* App Content */}
      <div className="flex-1 overflow-hidden relative">
        {AppComponent ? <AppComponent windowId={win.id} /> : (
          <div className="flex items-center justify-center h-full text-[#5f6368] text-sm">
            No content
          </div>
        )}
      </div>

      {/* Resize Handles (only when not maximized) */}
      {!win.isMaximized && (
        <>
          <div className="absolute top-0 left-0 right-0 h-1 cursor-n-resize" onMouseDown={(e) => handleResizeStart(e, "n")} />
          <div className="absolute bottom-0 left-0 right-0 h-1 cursor-s-resize" onMouseDown={(e) => handleResizeStart(e, "s")} />
          <div className="absolute top-0 bottom-0 left-0 w-1 cursor-w-resize" onMouseDown={(e) => handleResizeStart(e, "w")} />
          <div className="absolute top-0 bottom-0 right-0 w-1 cursor-e-resize" onMouseDown={(e) => handleResizeStart(e, "e")} />
          <div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize" onMouseDown={(e) => handleResizeStart(e, "nw")} />
          <div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize" onMouseDown={(e) => handleResizeStart(e, "ne")} />
          <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize" onMouseDown={(e) => handleResizeStart(e, "sw")} />
          <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize" onMouseDown={(e) => handleResizeStart(e, "se")} />
        </>
      )}
    </div>
  );
}
