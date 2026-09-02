import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import type { WindowState, AppConfig, WindowManagerAction } from "@/types/os";
import { Calculator } from "@/components/os/apps/Calculator";
import { Terminal } from "@/components/os/apps/Terminal";
import { Notes } from "@/components/os/apps/Notes";
import { FileExplorer } from "@/components/os/apps/FileExplorer";
import { SettingsApp } from "@/components/os/apps/Settings";
import { Browser } from "@/components/os/apps/Browser";
import { MusicPlayer } from "@/components/os/apps/MusicPlayer";
import { Weather } from "@/components/os/apps/Weather";
import { ClockApp } from "@/components/os/apps/ClockApp";
import { SystemMonitor } from "@/components/os/apps/SystemMonitor";
import { About } from "@/components/os/apps/About";

export const APP_REGISTRY: Record<string, AppConfig> = {
  calculator: {
    id: "calculator",
    title: "Calculator",
    icon: "calculator",
    defaultWidth: 340,
    defaultHeight: 500,
    minWidth: 280,
    minHeight: 400,
    component: Calculator,
  },
  terminal: {
    id: "terminal",
    title: "Terminal",
    icon: "terminal",
    defaultWidth: 680,
    defaultHeight: 440,
    minWidth: 400,
    minHeight: 300,
    component: Terminal,
  },
  notes: {
    id: "notes",
    title: "Notes",
    icon: "file-text",
    defaultWidth: 600,
    defaultHeight: 480,
    minWidth: 400,
    minHeight: 300,
    component: Notes,
  },
  files: {
    id: "files",
    title: "Files",
    icon: "folder",
    defaultWidth: 720,
    defaultHeight: 500,
    minWidth: 480,
    minHeight: 360,
    component: FileExplorer,
  },
  settings: {
    id: "settings",
    title: "Settings",
    icon: "settings",
    defaultWidth: 640,
    defaultHeight: 480,
    minWidth: 480,
    minHeight: 360,
    component: SettingsApp,
  },
  browser: {
    id: "browser",
    title: "Browser",
    icon: "globe",
    defaultWidth: 800,
    defaultHeight: 560,
    minWidth: 480,
    minHeight: 360,
    component: Browser,
  },
  music: {
    id: "music",
    title: "Music",
    icon: "music",
    defaultWidth: 380,
    defaultHeight: 520,
    minWidth: 320,
    minHeight: 440,
    component: MusicPlayer,
  },
  weather: {
    id: "weather",
    title: "Weather",
    icon: "cloud-sun",
    defaultWidth: 440,
    defaultHeight: 520,
    minWidth: 360,
    minHeight: 400,
    component: Weather,
  },
  clock: {
    id: "clock",
    title: "Clock",
    icon: "clock",
    defaultWidth: 400,
    defaultHeight: 480,
    minWidth: 320,
    minHeight: 400,
    component: ClockApp,
  },
  monitor: {
    id: "monitor",
    title: "System Monitor",
    icon: "activity",
    defaultWidth: 560,
    defaultHeight: 480,
    minWidth: 440,
    minHeight: 360,
    component: SystemMonitor,
  },
  about: {
    id: "about",
    title: "About PeraOS",
    icon: "info",
    defaultWidth: 480,
    defaultHeight: 400,
    minWidth: 400,
    minHeight: 340,
    component: About,
  },
};

interface WindowContextValue {
  windows: WindowState[];
  openWindow: (appId: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  updateSize: (id: string, width: number, height: number) => void;
  focusedWindowId: string | null;
  startMenuOpen: boolean;
  setStartMenuOpen: (open: boolean | "toggle") => void;
}

const WindowContext = createContext<WindowContextValue | null>(null);

function getOffset(index: number) {
  return 40 + (index % 8) * 30;
}

function windowReducer(
  state: WindowState[],
  action: WindowManagerAction,
): WindowState[] {
  switch (action.type) {
    case "OPEN_WINDOW": {
      const app = APP_REGISTRY[action.appId];
      if (!app) return state;
      const existing = state.find((w) => w.appId === action.appId && !w.isMinimized);
      if (existing) {
        return state.map((w) =>
          w.id === existing.id
            ? { ...w, isMinimized: false, zIndex: Math.max(...state.map((s) => s.zIndex), 0) + 1 }
            : w,
        );
      }
      const minimizedExisting = state.find((w) => w.appId === action.appId && w.isMinimized);
      if (minimizedExisting) {
        return state.map((w) =>
          w.id === minimizedExisting.id
            ? { ...w, isMinimized: false, zIndex: Math.max(...state.map((s) => s.zIndex), 0) + 1 }
            : w,
        );
      }
      const maxZ = state.length > 0 ? Math.max(...state.map((w) => w.zIndex)) : 0;
      const offset = getOffset(state.length);
      const newWindow: WindowState = {
        id: `${action.appId}-${Date.now()}`,
        title: app.title,
        icon: app.icon,
        appId: action.appId,
        x: 120 + offset,
        y: 60 + offset,
        width: app.defaultWidth,
        height: app.defaultHeight,
        minWidth: app.minWidth,
        minHeight: app.minHeight,
        isMinimized: false,
        isMaximized: false,
        zIndex: maxZ + 1,
      };
      return [...state, newWindow];
    }
    case "CLOSE_WINDOW":
      return state.filter((w) => w.id !== action.id);
    case "MINIMIZE_WINDOW":
      return state.map((w) =>
        w.id === action.id ? { ...w, isMinimized: true } : w,
      );
    case "MAXIMIZE_WINDOW":
      return state.map((w) =>
        w.id === action.id
          ? { ...w, isMaximized: !w.isMaximized, zIndex: Math.max(...state.map((s) => s.zIndex), 0) + 1 }
          : w,
      );
    case "RESTORE_WINDOW":
      return state.map((w) =>
        w.id === action.id
          ? { ...w, isMinimized: false, zIndex: Math.max(...state.map((s) => s.zIndex), 0) + 1 }
          : w,
      );
    case "FOCUS_WINDOW":
      return state.map((w) =>
        w.id === action.id
          ? { ...w, zIndex: Math.max(...state.map((s) => s.zIndex), 0) + 1 }
          : w,
      );
    case "UPDATE_POSITION":
      return state.map((w) =>
        w.id === action.id ? { ...w, x: action.x, y: action.y } : w,
      );
    case "UPDATE_SIZE":
      return state.map((w) =>
        w.id === action.id
          ? {
              ...w,
              width: Math.max(action.width, w.minWidth),
              height: Math.max(action.height, w.minHeight),
            }
          : w,
      );
    default:
      return state;
  }
}

export function WindowProvider({ children }: { children: ReactNode }) {
  const [windows, dispatch] = useReducer(windowReducer, []);
  const [startMenuOpen, setStartMenuOpen] = useReducer(
    (_: boolean, action: boolean | "toggle") =>
      action === "toggle" ? false : action,
    false,
  );
  const openWindow = useCallback((appId: string) => {
    setStartMenuOpen(false);
    dispatch({ type: "OPEN_WINDOW", appId });
  }, []);

  const closeWindow = useCallback((id: string) => {
    dispatch({ type: "CLOSE_WINDOW", id });
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    dispatch({ type: "MINIMIZE_WINDOW", id });
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    dispatch({ type: "MAXIMIZE_WINDOW", id });
  }, []);

  const restoreWindow = useCallback((id: string) => {
    dispatch({ type: "RESTORE_WINDOW", id });
  }, []);

  const focusWindow = useCallback((id: string) => {
    dispatch({ type: "FOCUS_WINDOW", id });
  }, []);

  const updatePosition = useCallback((id: string, x: number, y: number) => {
    dispatch({ type: "UPDATE_POSITION", id, x, y });
  }, []);

  const updateSize = useCallback((id: string, width: number, height: number) => {
    dispatch({ type: "UPDATE_SIZE", id, width, height });
  }, []);

  const focusedWindowId =
    windows.filter((w) => !w.isMinimized).sort((a, b) => b.zIndex - a.zIndex)[0]
      ?.id ?? null;

  return (
    <WindowContext.Provider
      value={{
        windows,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        restoreWindow,
        focusWindow,
        updatePosition,
        updateSize,
        focusedWindowId,
        startMenuOpen,
        setStartMenuOpen,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
}

export function useWindowManager() {
  const ctx = useContext(WindowContext);
  if (!ctx) throw new Error("useWindowManager must be used within WindowProvider");
  return ctx;
}
