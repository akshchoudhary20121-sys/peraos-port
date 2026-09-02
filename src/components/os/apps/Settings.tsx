import { useState } from "react";
import {
  Palette,
  Monitor,
  Info,
  ChevronRight,
  Moon,
  Sun,
  Bell,
  Volume2,
  Wifi,
} from "lucide-react";

type SettingsPage = "appearance" | "system" | "about";

const WALLPAPERS = [
  { id: "blue", name: "Azure Sky", gradient: "linear-gradient(160deg, #E8F0FE 0%, #D2E3FC 30%, #C2D9F7 60%, #AECBFA 100%)" },
  { id: "sunset", name: "Sunset", gradient: "linear-gradient(160deg, #FDEBD0 0%, #F5CBA7 30%, #F0B27A 60%, #EB984E 100%)" },
  { id: "forest", name: "Forest", gradient: "linear-gradient(160deg, #D5F5E3 0%, #82E0AA 30%, #58D68D 60%, #2ECC71 100%)" },
  { id: "night", name: "Night Sky", gradient: "linear-gradient(160deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #533483 100%)" },
  { id: "ocean", name: "Deep Ocean", gradient: "linear-gradient(160deg, #2C3E50 0%, #3498DB 50%, #2980B9 100%)" },
  { id: "lavender", name: "Lavender", gradient: "linear-gradient(160deg, #E8DAEF 0%, #D2B4DE 30%, #BB8FCE 60%, #A569BD 100%)" },
  { id: "cherry", name: "Cherry Blossom", gradient: "linear-gradient(160deg, #FDEDEC 0%, #F5B7B1 30%, #EC7063 60%, #E74C3C 100%)" },
  { id: "mint", name: "Mint Fresh", gradient: "linear-gradient(160deg, #E8F8F5 0%, #A3E4D7 30%, #76D7C4 60%, #48C9B0 100%)" },
];

export function SettingsApp() {
  const [activePage, setActivePage] = useState<SettingsPage>("appearance");
  const [currentWallpaper, setCurrentWallpaper] = useState("blue");

  const pages: { id: SettingsPage; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "system", label: "System", icon: Monitor },
    { id: "about", label: "About PeraOS", icon: Info },
  ];

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar */}
      <div className="w-[200px] border-r border-[#e8eaed] flex flex-col shrink-0 bg-[#f8f9fa]">
        <div className="p-3 pt-4">
          <h2 className="text-[14px] font-medium text-[#202124]">Settings</h2>
        </div>
        <div className="flex-1 px-1">
          {pages.map((page) => {
            const Icon = page.icon;
            return (
              <button
                key={page.id}
                onClick={() => setActivePage(page.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                  activePage === page.id
                    ? "bg-[#E8F0FE] text-[#1A73E8] font-medium"
                    : "text-[#202124] hover:bg-[#e8eaed]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{page.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activePage === "appearance" && (
          <div>
            <h3 className="text-[16px] font-medium text-[#202124] mb-4">Wallpaper</h3>
            <div className="grid grid-cols-4 gap-3">
              {WALLPAPERS.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => setCurrentWallpaper(wp.id)}
                  className={`relative rounded-xl overflow-hidden aspect-[16/10] transition-all ${
                    currentWallpaper === wp.id
                      ? "ring-2 ring-[#1A73E8] ring-offset-2"
                      : "hover:ring-2 hover:ring-[#dadce0] hover:ring-offset-1"
                  }`}
                >
                  <div className="absolute inset-0" style={{ background: wp.gradient }} />
                  <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/40 to-transparent">
                    <span className="text-[11px] text-white font-medium">{wp.name}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-[16px] font-medium text-[#202124] mb-4">Theme</h3>
              <div className="flex gap-3">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#E8F0FE] border-2 border-[#1A73E8]">
                  <Sun className="w-5 h-5 text-[#1A73E8]" />
                  <span className="text-[13px] font-medium text-[#1A73E8]">Light</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f1f3f4] border-2 border-transparent hover:border-[#dadce0] transition-colors cursor-pointer">
                  <Moon className="w-5 h-5 text-[#5f6368]" />
                  <span className="text-[13px] text-[#5f6368]">Dark</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePage === "system" && (
          <div className="space-y-6">
            <h3 className="text-[16px] font-medium text-[#202124]">System Preferences</h3>
            {[
              { icon: Bell, label: "Notifications", desc: "Manage notification settings", enabled: true },
              { icon: Volume2, label: "Sound", desc: "System sounds and volume", enabled: true },
              { icon: Wifi, label: "Network", desc: "Connected to PeraOS Local", enabled: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-[#f8f9fa]">
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-[#5f6368]" />
                  <div>
                    <div className="text-[14px] text-[#202124] font-medium">{item.label}</div>
                    <div className="text-[12px] text-[#5f6368]">{item.desc}</div>
                  </div>
                </div>
                <div className={`w-10 h-6 rounded-full p-0.5 transition-colors ${item.enabled ? "bg-[#1A73E8]" : "bg-[#dadce0]"}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${item.enabled ? "translate-x-4" : ""}`} />
                </div>
              </div>
            ))}
          </div>
        )}

        {activePage === "about" && (
          <div className="space-y-6">
            <div className="text-center py-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white"
                style={{ background: "linear-gradient(135deg, #4285F4, #34A853)" }}
              >
                P
              </div>
              <h3 className="text-[20px] font-medium text-[#202124]">PeraOS</h3>
              <p className="text-[13px] text-[#5f6368] mt-1">Version 1.0.0</p>
            </div>
            <div className="rounded-xl overflow-hidden border border-[#e8eaed]">
              {[
                ["System Name", "PeraOS"],
                ["Version", "1.0.0"],
                ["Kernel", "React 19"],
                ["Architecture", "Web (x86_64)"],
                ["Desktop", "PeraOS Desktop Environment"],
                ["Window Manager", "PeraOS WM"],
              ].map(([key, value]) => (
                <div key={key} className="flex items-center px-4 py-3 border-b border-[#e8eaed] last:border-0">
                  <span className="text-[13px] text-[#5f6368] w-40">{key}</span>
                  <span className="text-[13px] text-[#202124] font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
