import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Star,
  Lock,
  Search,
  Plus,
  X,
} from "lucide-react";

interface Tab {
  id: string;
  title: string;
  url: string;
}

const BOOKMARKS = [
  { name: "PeraOS Docs", url: "https://peraos.dev" },
  { name: "GitHub", url: "https://github.com" },
  { name: "Wikipedia", url: "https://wikipedia.org" },
];

const QUICK_LINKS = [
  { name: "Google", color: "#4285F4", letter: "G" },
  { name: "YouTube", color: "#FF0000", letter: "Y" },
  { name: "GitHub", color: "#24292E", letter: "GH" },
  { name: "Reddit", color: "#FF5700", letter: "R" },
  { name: "Wikipedia", color: "#636466", letter: "W" },
  { name: "Stack Overflow", color: "#F48024", letter: "SO" },
];

export function Browser() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "1", title: "New Tab", url: "" },
  ]);
  const [activeTabId, setActiveTabId] = useState("1");
  const [inputUrl, setInputUrl] = useState("");
  const [history, setHistory] = useState<string[]>([""]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const activeTab = tabs.find((t) => t.id === activeTabId);

  const navigateTo = (url: string) => {
    if (!url) return;
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, url: fullUrl, title: new URL(fullUrl).hostname }
          : t,
      ),
    );
    setInputUrl(fullUrl);
    const newHistory = [...history.slice(0, historyIndex + 1), fullUrl];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const url = history[newIndex];
      setInputUrl(url);
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? { ...t, url, title: url ? new URL(url).hostname : "New Tab" }
            : t,
        ),
      );
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const url = history[newIndex];
      setInputUrl(url);
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? { ...t, url, title: url ? new URL(url).hostname : "New Tab" }
            : t,
        ),
      );
    }
  };

  const addTab = () => {
    const newTab: Tab = { id: Date.now().toString(), title: "New Tab", url: "" };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setInputUrl("");
  };

  const closeTab = (id: string) => {
    if (tabs.length === 1) return;
    setTabs((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      if (activeTabId === id) {
        setActiveTabId(filtered[filtered.length - 1].id);
        setInputUrl(filtered[filtered.length - 1].url);
      }
      return filtered;
    });
  };

  const isNewTab = !activeTab?.url;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tab bar */}
      <div className="flex items-center bg-[#f1f3f4] px-2 pt-1 gap-1">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-[12px] max-w-[180px] cursor-pointer transition-colors ${
              tab.id === activeTabId
                ? "bg-white text-[#202124]"
                : "text-[#5f6368] hover:bg-[#e8eaed]"
            }`}
            onClick={() => {
              setActiveTabId(tab.id);
              setInputUrl(tab.url);
            }}
          >
            <span className="truncate flex-1">{tab.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className="p-0.5 rounded hover:bg-black/5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button
          onClick={addTab}
          className="p-1.5 rounded-lg hover:bg-[#e8eaed] transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-[#5f6368]" />
        </button>
      </div>

      {/* URL bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white border-b border-[#e8eaed]">
        <button onClick={goBack} className="p-1 rounded-lg hover:bg-[#f1f3f4] transition-colors" disabled={historyIndex === 0}>
          <ArrowLeft className={`w-4 h-4 ${historyIndex === 0 ? "text-[#dadce0]" : "text-[#5f6368]"}`} />
        </button>
        <button onClick={goForward} className="p-1 rounded-lg hover:bg-[#f1f3f4] transition-colors" disabled={historyIndex >= history.length - 1}>
          <ArrowRight className={`w-4 h-4 ${historyIndex >= history.length - 1 ? "text-[#dadce0]" : "text-[#5f6368]"}`} />
        </button>
        <button onClick={() => navigateTo(activeTab?.url || "")} className="p-1 rounded-lg hover:bg-[#f1f3f4] transition-colors">
          <RotateCw className="w-4 h-4 text-[#5f6368]" />
        </button>
        <button onClick={() => navigateTo("")} className="p-1 rounded-lg hover:bg-[#f1f3f4] transition-colors">
          <Home className="w-4 h-4 text-[#5f6368]" />
        </button>

        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f1f3f4]">
          {activeTab?.url ? (
            <Lock className="w-3.5 h-3.5 text-[#5f6368] shrink-0" />
          ) : (
            <Search className="w-3.5 h-3.5 text-[#5f6368] shrink-0" />
          )}
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") navigateTo(inputUrl);
            }}
            placeholder="Search or enter URL"
            className="flex-1 bg-transparent text-[13px] text-[#202124] placeholder-[#9aa0a6] outline-none"
          />
        </div>

        <button className="p-1 rounded-lg hover:bg-[#f1f3f4] transition-colors">
          <Star className="w-4 h-4 text-[#5f6368]" />
        </button>
      </div>

      {/* Bookmarks bar */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-[#e8eaed] bg-white">
        {BOOKMARKS.map((bm) => (
          <button
            key={bm.url}
            onClick={() => navigateTo(bm.url)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] text-[#5f6368] hover:bg-[#f1f3f4] transition-colors"
          >
            <Star className="w-3 h-3" />
            <span>{bm.name}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {isNewTab ? (
          <div className="flex flex-col items-center justify-center h-full bg-white">
            <div className="text-[32px] font-light text-[#202124] mb-1">PeraOS</div>
            <div className="text-[14px] text-[#5f6368] mb-8">Search the web or enter a URL</div>

            {/* Search bar */}
            <div className="w-[520px] max-w-[90%] flex items-center gap-3 px-4 py-3 rounded-full bg-[#f1f3f4] shadow-sm">
              <Search className="w-5 h-5 text-[#9aa0a6]" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (inputUrl.includes(".")) {
                      navigateTo(inputUrl);
                    } else {
                      navigateTo(`https://www.google.com/search?q=${encodeURIComponent(inputUrl)}`);
                    }
                  }
                }}
                placeholder="Search Google or enter URL"
                className="flex-1 bg-transparent text-[15px] text-[#202124] placeholder-[#9aa0a6] outline-none"
              />
            </div>

            {/* Quick links */}
            <div className="flex items-center gap-4 mt-8">
              {QUICK_LINKS.map((link) => (
                <button
                  key={link.name}
                  className="flex flex-col items-center gap-2 group"
                  onClick={() => {
                    if (link.name === "Google") navigateTo("https://google.com");
                    else if (link.name === "YouTube") navigateTo("https://youtube.com");
                    else if (link.name === "GitHub") navigateTo("https://github.com");
                    else if (link.name === "Reddit") navigateTo("https://reddit.com");
                    else if (link.name === "Wikipedia") navigateTo("https://wikipedia.org");
                    else if (link.name === "Stack Overflow") navigateTo("https://stackoverflow.com");
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-[13px] font-bold text-white group-hover:shadow-md transition-shadow"
                    style={{ background: link.color }}
                  >
                    {link.letter}
                  </div>
                  <span className="text-[11px] text-[#5f6368]">{link.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-white">
            <div className="text-center">
              <Lock className="w-8 h-8 text-[#5f6368] mx-auto mb-3" />
              <div className="text-[14px] text-[#202124] font-medium mb-1">
                Navigating to {activeTab?.url}
              </div>
              <div className="text-[12px] text-[#5f6368]">
                External sites cannot be loaded in this sandbox.
              </div>
              <button
                onClick={() => {
                  setTabs((prev) => prev.map((t) => t.id === activeTabId ? { ...t, url: "", title: "New Tab" } : t));
                  setInputUrl("");
                  setHistory([""]);
                  setHistoryIndex(0);
                }}
                className="mt-4 px-4 py-2 text-[13px] text-[#1A73E8] hover:bg-[#E8F0FE] rounded-lg transition-colors"
              >
                Return to New Tab
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
