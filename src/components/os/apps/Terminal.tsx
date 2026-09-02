import { useState, useRef, useEffect, useCallback } from "react";

interface TerminalLine {
  id: number;
  type: "input" | "output" | "error";
  text: string;
}

const FILE_SYSTEM: Record<string, string> = {
  "/home": "drwxr-xr-x  guest guest  4096  Documents  Downloads  Pictures  Music",
  "/home/Documents": "drwxr-xr-x  guest guest  4096  notes.txt  readme.md  project-plan.pdf",
  "/home/Downloads": "drwxr-xr-x  guest guest  4096  photo.jpg  archive.zip",
  "/home/Pictures": "drwxr-xr-x  guest guest  4096  wallpaper.png  screenshot.png  avatar.jpg",
  "/home/Music": "drwxr-xr-x  guest guest  4096  song1.mp3  song2.mp3",
  "/home/Documents/notes.txt": "Welcome to PeraOS!\nThis is a simple text file.",
  "/home/Documents/readme.md": "# PeraOS\nAn operating system built for the web.\nVersion 1.0",
};

const COMMANDS: Record<string, (args: string[], cwd: string) => { output: string; newCwd?: string }> = {
  help: () => ({
    output: `Available commands:
  help      Show this help message
  ls        List directory contents
  cd        Change directory
  cat       Display file contents
  pwd       Print working directory
  echo      Print text
  date      Show current date and time
  whoami    Show current user
  uname     Show system information
  uptime    Show system uptime
  clear     Clear the terminal
  history   Show command history
  calc      Simple calculator (e.g., calc 2 + 2)
  neofetch  Show system information (fancy)`,
  }),

  ls: (args, cwd) => {
    const target = args[0] ? resolvePath(cwd, args[0]) : cwd;
    const content = FILE_SYSTEM[target];
    if (!content) return { output: `ls: cannot access '${args[0] || target}': No such file or directory` };
    return { output: content };
  },

  cd: (args, cwd) => {
    if (!args[0] || args[0] === "~") return { output: "", newCwd: "/home" };
    const target = resolvePath(cwd, args[0]);
    if (FILE_SYSTEM[target] && FILE_SYSTEM[target].startsWith("drwx")) {
      return { output: "", newCwd: target };
    }
    return { output: `cd: no such file or directory: ${args[0]}` };
  },

  cat: (args, cwd) => {
    if (!args[0]) return { output: "cat: missing file operand" };
    const target = resolvePath(cwd, args[0]);
    if (FILE_SYSTEM[target] && !FILE_SYSTEM[target].startsWith("drwx")) {
      return { output: FILE_SYSTEM[target] };
    }
    return { output: `cat: ${args[0]}: No such file or directory` };
  },

  pwd: (_, cwd) => ({ output: cwd }),

  echo: (args) => ({ output: args.join(" ") }),

  date: () => ({
    output: new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  }),

  whoami: () => ({ output: "guest" }),

  uname: (args) => {
    if (args.includes("-a")) {
      return { output: "PeraOS 1.0.0 peraos x86_64 Web/Browser" };
    }
    return { output: "PeraOS" };
  },

  uptime: () => {
    const start = performance.now();
    const seconds = Math.floor(start / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return {
      output: ` ${new Date().toLocaleTimeString()} up ${hours}:${String(minutes % 60).padStart(2, "0")}, 1 user, load average: 0.42 0.38 0.35`,
    };
  },

  clear: () => ({ output: "__CLEAR__" }),

  history: () => ({ output: "History is displayed inline." }),

  calc: (args) => {
    try {
      const expr = args.join(" ");
      // Simple safe eval for basic math
      const sanitized = expr.replace(/[^0-9+\-*/().%\s]/g, "");
      if (!sanitized) return { output: "calc: invalid expression" };
      // eslint-disable-next-line no-eval
      const result = Function(`"use strict"; return (${sanitized})`)();
      return { output: String(result) };
    } catch {
      return { output: "calc: invalid expression" };
    }
  },

  neofetch: () => ({
    output: `
  ██████╗ ███████╗ █████╗ ██████╗ ██╗     ██╗
  ██╔══██╗██╔════╝██╔══██╗██╔══██╗██║     ██║
  ██████╔╝█████╗  ███████║██║  ██║██║     ██║
  ██╔══██╗██╔══╝  ██╔══██║██║  ██║██║     ██║
  ██║  ██║███████╗██║  ██║██████╔╝███████╗███████╗
  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝

  OS:       PeraOS 1.0.0
  Host:     Web Browser
  Kernel:   React ${typeof window !== "undefined" ? "19" : "?"}
  Shell:    PeraOS Terminal
  Display:  ${typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "unknown"}
  Theme:    Google Light
  CPU:      Virtual Core
  Memory:   ∞ / ∞`,
  }),
};

function resolvePath(cwd: string, target: string): string {
  if (target === "~") return "/home";
  if (target.startsWith("~/")) return "/home" + target.slice(1);
  if (target.startsWith("/")) return target;
  if (target === "..") {
    const parts = cwd.split("/").filter(Boolean);
    parts.pop();
    return "/" + parts.join("/") || "/home";
  }
  return cwd === "/" ? `/${target}` : `${cwd}/${target}`;
}

export function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 0,
      type: "output",
      text: "PeraOS Terminal v1.0.0\nType 'help' for available commands.\n",
    },
  ]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("/home");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const prompt = `pera@peraos ${cwd === "/home" ? "~" : cwd.replace("/home", "~")}$ `;

  const executeCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim();
      if (!trimmed) return;

      const newLines: TerminalLine[] = [
        ...lines,
        { id: nextId.current++, type: "input", text: `${prompt}${trimmed}` },
      ];

      const parts = trimmed.split(/\s+/);
      const command = parts[0];
      const args = parts.slice(1);

      if (command === "clear") {
        setLines([]);
        setInput("");
        return;
      }

      const handler = COMMANDS[command];
      if (handler) {
        const result = handler(args, cwd);
        if (result.newCwd) setCwd(result.newCwd);
        if (result.output) {
          newLines.push({ id: nextId.current++, type: "output", text: result.output });
        }
      } else {
        newLines.push({
          id: nextId.current++,
          type: "error",
          text: `${command}: command not found. Type 'help' for available commands.`,
        });
      }

      setLines(newLines);
      setHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);
      setInput("");
    },
    [lines, cwd, prompt],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Simple tab completion for commands
      const matches = Object.keys(COMMANDS).filter((c) => c.startsWith(input.split(/\s+/)[0]));
      if (matches.length === 1) {
        setInput(matches[0] + " ");
      }
    }
  };

  return (
    <div
      className="flex flex-col h-full font-mono text-[13px] leading-relaxed"
      style={{ background: "#1E1E1E", color: "#CCCCCC" }}
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3">
        {lines.map((line) => (
          <div key={line.id} className="whitespace-pre-wrap">
            {line.type === "input" ? (
              <div>
                <span className="text-[#34A853] font-bold">pera@peraos</span>
                <span className="text-[#9aa0a6]">
                  {line.text.replace("pera@peraos", "")}
                </span>
              </div>
            ) : line.type === "error" ? (
              <div className="text-[#EA4335]">{line.text}</div>
            ) : (
              <div className="text-[#e4e4e7]">{line.text}</div>
            )}
          </div>
        ))}

        {/* Current input line */}
        <div className="flex items-center">
          <span className="text-[#34A853] font-bold shrink-0">pera@peraos</span>
          <span className="text-[#9aa0a6] shrink-0">
            {cwd === "/home" ? " ~" : ` ${cwd.replace("/home", "~")}`}
            ${" "}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-[#e4e4e7] caret-[#34A853]"
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
