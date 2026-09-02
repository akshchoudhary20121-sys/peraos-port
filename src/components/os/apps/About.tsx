import { Globe, Github, Heart, Monitor, Cpu, MemoryStick, HardDrive } from "lucide-react";

export function About() {
  const systemInfo = [
    { label: "System Name", value: "PeraOS" },
    { label: "Version", value: "1.0.0 (Build 2026)" },
    { label: "Kernel", value: "React 19.2.0" },
    { label: "Architecture", value: "WebAssembly / x86_64" },
    { label: "Desktop", value: "PeraOS Desktop Environment" },
    { label: "Window Manager", value: "PeraOS WM v1.0" },
    { label: "Shell", value: "PeraOS Terminal" },
    { label: "Display Server", value: "HTML5 Canvas + CSS" },
    { label: "Filesystem", value: "Virtual FS (LocalStorage)" },
    { label: "Network", value: "Connected (PeraOS Local)" },
  ];

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      {/* Hero */}
      <div className="flex flex-col items-center py-8 px-6">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-bold text-white shadow-lg mb-4"
          style={{ background: "linear-gradient(135deg, #4285F4, #34A853)" }}
        >
          P
        </div>
        <h1 className="text-[24px] font-medium text-[#202124]">PeraOS</h1>
        <p className="text-[13px] text-[#5f6368] mt-1">Version 1.0.0</p>
        <p className="text-[12px] text-[#9aa0a6] mt-1 text-center max-w-[300px]">
          A beautiful operating system experience, built entirely for the web.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Monitor, label: "Resolution", value: `${window.innerWidth}×${window.innerHeight}` },
            { icon: Cpu, label: "Processor", value: "Virtual Core" },
            { icon: MemoryStick, label: "Memory", value: "16 GB" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center p-3 rounded-xl bg-[#f8f9fa]">
              <stat.icon className="w-5 h-5 text-[#5f6368] mb-1.5" />
              <div className="text-[11px] text-[#9aa0a6]">{stat.label}</div>
              <div className="text-[12px] text-[#202124] font-medium">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* System Details */}
      <div className="px-6 pb-4">
        <h3 className="text-[13px] font-medium text-[#5f6368] mb-2">System Details</h3>
        <div className="rounded-xl border border-[#e8eaed] overflow-hidden">
          {systemInfo.map((item, i) => (
            <div
              key={item.label}
              className={`flex items-center px-4 py-2.5 ${i < systemInfo.length - 1 ? "border-b border-[#e8eaed]" : ""}`}
            >
              <span className="text-[13px] text-[#5f6368] w-36">{item.label}</span>
              <span className="text-[13px] text-[#202124] font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 mt-auto border-t border-[#e8eaed]">
        <div className="text-center text-[12px] text-[#9aa0a6]">
          Built with{" "}
          <Heart className="w-3 h-3 inline text-red-400 fill-red-400" />{" "}
          using React, TypeScript, Tailwind CSS & Convex
        </div>
        <div className="text-center text-[11px] text-[#9aa0a6] mt-1">
          © 2026 PeraOS. All rights reserved.
        </div>
      </div>
    </div>
  );
}
