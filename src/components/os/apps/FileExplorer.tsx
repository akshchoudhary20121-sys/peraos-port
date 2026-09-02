import { useState } from "react";
import {
  Folder,
  File,
  FileText,
  Image,
  Music,
  Film,
  Archive,
  HardDrive,
  Home,
  Download,
  Image as ImageIcon,
  ChevronRight,
  Grid,
  List,
} from "lucide-react";

interface FileSystemNode {
  name: string;
  type: "file" | "folder";
  children?: FileSystemNode[];
  size?: string;
  modified?: string;
}

const FILE_SYSTEM: FileSystemNode = {
  name: "Home",
  type: "folder",
  children: [
    {
      name: "Documents",
      type: "folder",
      children: [
        { name: "notes.txt", type: "file", size: "1.2 KB", modified: "Today" },
        { name: "readme.md", type: "file", size: "3.4 KB", modified: "Yesterday" },
        { name: "project-plan.pdf", type: "file", size: "245 KB", modified: "Mar 15" },
        { name: "budget.xlsx", type: "file", size: "89 KB", modified: "Mar 10" },
        {
          name: "Work",
          type: "folder",
          children: [
            { name: "report.docx", type: "file", size: "156 KB", modified: "Today" },
            { name: "slides.pptx", type: "file", size: "2.1 MB", modified: "Mar 12" },
          ],
        },
      ],
    },
    {
      name: "Downloads",
      type: "folder",
      children: [
        { name: "photo.jpg", type: "file", size: "3.2 MB", modified: "Today" },
        { name: "archive.zip", type: "file", size: "15 MB", modified: "Yesterday" },
        { name: "setup.exe", type: "file", size: "45 MB", modified: "Mar 14" },
        { name: "music.mp3", type: "file", size: "4.8 MB", modified: "Mar 8" },
      ],
    },
    {
      name: "Pictures",
      type: "folder",
      children: [
        { name: "wallpaper.png", type: "file", size: "2.8 MB", modified: "Today" },
        { name: "screenshot.png", type: "file", size: "890 KB", modified: "Yesterday" },
        { name: "avatar.jpg", type: "file", size: "156 KB", modified: "Mar 5" },
        {
          name: "Vacation",
          type: "folder",
          children: [
            { name: "beach.jpg", type: "file", size: "4.1 MB", modified: "Feb 28" },
            { name: "sunset.jpg", type: "file", size: "3.8 MB", modified: "Feb 28" },
          ],
        },
      ],
    },
    {
      name: "Music",
      type: "folder",
      children: [
        { name: "song1.mp3", type: "file", size: "4.8 MB", modified: "Mar 1" },
        { name: "song2.mp3", type: "file", size: "5.2 MB", modified: "Mar 1" },
        { name: "album.flac", type: "file", size: "32 MB", modified: "Feb 20" },
      ],
    },
    { name: "desktop.ini", type: "file", size: "282 B", modified: "Jan 1" },
  ],
};

const SIDEBAR_ITEMS = [
  { name: "Home", icon: Home, path: "/Home" },
  { name: "Documents", icon: FileText, path: "/Home/Documents" },
  { name: "Downloads", icon: Download, path: "/Home/Downloads" },
  { name: "Pictures", icon: ImageIcon, path: "/Home/Pictures" },
  { name: "Music", icon: Music, path: "/Home/Music" },
];

function getFileIcon(name: string, type: string) {
  if (type === "folder") return Folder;
  const ext = name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "svg":
      return Image;
    case "mp3":
    case "flac":
    case "wav":
    case "ogg":
      return Music;
    case "mp4":
    case "avi":
    case "mov":
      return Film;
    case "zip":
    case "rar":
    case "7z":
      return Archive;
    case "txt":
    case "md":
    case "docx":
    case "xlsx":
    case "pptx":
      return FileText;
    default:
      return File;
  }
}

function getNodeAtPath(path: string): FileSystemNode | null {
  const parts = path.split("/").filter(Boolean);
  let current = FILE_SYSTEM;
  for (const part of parts) {
    if (part === "Home") continue;
    const child = current.children?.find((c) => c.name === part);
    if (!child) return null;
    current = child;
  }
  return current;
}

export function FileExplorer() {
  const [currentPath, setCurrentPath] = useState("/Home");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const currentNode = getNodeAtPath(currentPath);
  const items = currentNode?.children ?? [];
  const pathParts = currentPath.split("/").filter(Boolean);

  const navigateTo = (name: string) => {
    if (name === "Home") {
      setCurrentPath("/Home");
    } else {
      setCurrentPath(`${currentPath}/${name}`);
    }
  };

  const navigateUp = (index: number) => {
    const parts = pathParts.slice(0, index + 1);
    setCurrentPath("/" + parts.join("/"));
  };

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar */}
      <div className="w-[180px] border-r border-[#e8eaed] flex flex-col shrink-0 bg-[#f8f9fa]">
        <div className="p-2 pt-3">
          <div className="flex items-center gap-2 px-2 py-1.5 text-[12px] text-[#5f6368] font-medium">
            <HardDrive className="w-3.5 h-3.5" />
            Locations
          </div>
        </div>
        <div className="flex-1 px-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => setCurrentPath(item.path)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] transition-colors ${
                  isActive
                    ? "bg-[#E8F0FE] text-[#1A73E8] font-medium"
                    : "text-[#202124] hover:bg-[#e8eaed]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[#e8eaed]">
          {/* Breadcrumb */}
          <div className="flex items-center gap-0.5 flex-1 min-w-0 overflow-hidden">
            {pathParts.map((part, i) => (
              <div key={i} className="flex items-center shrink-0">
                {i > 0 && (
                  <ChevronRight className="w-3 h-3 text-[#9aa0a6] mx-0.5" />
                )}
                <button
                  onClick={() => navigateUp(i)}
                  className="text-[13px] text-[#1A73E8] hover:underline px-1 py-0.5 rounded hover:bg-[#E8F0FE] transition-colors"
                >
                  {part}
                </button>
              </div>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-0.5 border border-[#e8eaed] rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1 rounded ${viewMode === "grid" ? "bg-[#E8F0FE] text-[#1A73E8]" : "text-[#5f6368] hover:bg-[#f1f3f4]"}`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1 rounded ${viewMode === "list" ? "bg-[#E8F0FE] text-[#1A73E8]" : "text-[#5f6368] hover:bg-[#f1f3f4]"}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* File listing */}
        <div className="flex-1 overflow-y-auto p-3">
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-full text-[#9aa0a6] text-[13px]">
              This folder is empty
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2">
              {items.map((item) => {
                const Icon = getFileIcon(item.name, item.type);
                const color =
                  item.type === "folder"
                    ? "text-[#5f6368]"
                    : "text-[#9aa0a6]";
                return (
                  <button
                    key={item.name}
                    onDoubleClick={() =>
                      item.type === "folder" && navigateTo(item.name)
                    }
                    className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-[#f1f3f4] transition-colors"
                  >
                    <Icon className={`w-10 h-10 ${color}`} />
                    <span className="text-[11px] text-[#202124] text-center leading-tight max-w-full truncate">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-3 px-3 py-1.5 text-[11px] text-[#5f6368] font-medium border-b border-[#e8eaed]">
                <div className="flex-1">Name</div>
                <div className="w-20 text-right">Size</div>
                <div className="w-24 text-right">Modified</div>
              </div>
              {items.map((item) => {
                const Icon = getFileIcon(item.name, item.type);
                return (
                  <button
                    key={item.name}
                    onDoubleClick={() =>
                      item.type === "folder" && navigateTo(item.name)
                    }
                    className="flex items-center gap-3 px-3 py-2 hover:bg-[#f1f3f4] transition-colors text-left"
                  >
                    <Icon className="w-4 h-4 text-[#5f6368] shrink-0" />
                    <div className="flex-1 text-[13px] text-[#202124] truncate">
                      {item.name}
                    </div>
                    <div className="w-20 text-right text-[12px] text-[#5f6368]">
                      {item.size ?? "—"}
                    </div>
                    <div className="w-24 text-right text-[12px] text-[#5f6368]">
                      {item.modified ?? "—"}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="px-3 py-1.5 text-[11px] text-[#5f6368] border-t border-[#e8eaed] bg-[#f8f9fa]">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
