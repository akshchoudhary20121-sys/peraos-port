import type { ComponentType } from "react";

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  appId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export interface AppConfig {
  id: string;
  title: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
  component: ComponentType<{ windowId: string }>;
}

export type WindowManagerAction =
  | { type: "OPEN_WINDOW"; appId: string }
  | { type: "CLOSE_WINDOW"; id: string }
  | { type: "MINIMIZE_WINDOW"; id: string }
  | { type: "MAXIMIZE_WINDOW"; id: string }
  | { type: "RESTORE_WINDOW"; id: string }
  | { type: "FOCUS_WINDOW"; id: string }
  | { type: "UPDATE_POSITION"; id: string; x: number; y: number }
  | { type: "UPDATE_SIZE"; id: string; width: number; height: number }
  | { type: "SET_START_MENU"; open: boolean };
