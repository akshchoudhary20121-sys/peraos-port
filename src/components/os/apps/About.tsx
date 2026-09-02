import { Heart, Monitor, Cpu, MemoryStick } from "lucide-react";

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
    <div className="flex flex-col h-full bg-[#F5F5F7] overflow-y-auto">
      {/* Hero */}
      <div className="flex flex-col items-center py-7 px-6">
        <div
          className="w-[72px] h-[72px] rounded-[18px] flex items-center justify-center text-2xl font-bold text-white mb-3"
          style={{
            background: "linear-gradient(135deg, #BF5AF2 0%, #5E5CE6 50%, #0A84FF 100%)",
            boxShadow: "0 4px 16px rgba(94,92,230,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
        >
          P
        </div>
        <h1 className="text-[22px] font-semibold text-[#1D1D1F] tracking-[-0.02em]">PeraOS</h1>
        <p className="text-[13px] text-[#86868B] mt-0.5">Version 1.0.0</p>
        <p className="text-[11px] text-[#AEAEB2] mt-1.5 text-center max-w-[280px] leading-relaxed">
          A beautiful operating system experience, built entirely for the web.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="px-5 pb-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Monitor, label: "Resolution", value: `${window.innerWidth}×${window.innerHeight}` },
            { icon: Cpu, label: "Processor", value: "Virtual Core" },
            { icon: MemoryStick, label: "Memory", value: "16 GB" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center p-3 rounded-[12px]"
              style={{
                background: "rgba(255,255,255,0.8)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04), inset 0 0.5px 0 rgba(255,255,255,0.6)",
              }}
            >
              <stat.icon className="w-[18px] h-[18px] text-[#86868B] mb-1.5" />
              <div className="text-[10px] text-[#AEAEB2] leading-tight">{stat.label}</div>
              <div className="text-[12px] text-[#1D1D1F] font-medium mt-0.5">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* System Details */}
      <div className="px-5 pb-4">
        <h3 className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider mb-2 ml-1">System Details</h3>
        <div
          className="rounded-[12px] overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.8)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          {systemInfo.map((item, i) => (
            <div
              key={item.label}
              className={`flex items-center px-4 py-2.5 ${i < systemInfo.length - 1 ? "border-b border-black/[0.05]" : ""}`}
            >
              <span className="text-[12px] text-[#86868B] w-36">{item.label}</span>
              <span className="text-[12px] text-[#1D1D1F] font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 mt-auto border-t border-black/[0.05]">
        <div className="text-center text-[11px] text-[#AEAEB2]">
          Built with{" "}
          <Heart className="w-3 h-3 inline text-[#FF375F] fill-[#FF375F]" />{" "}
          using React, TypeScript, Tailwind CSS & Convex
        </div>
        <div className="text-center text-[10px] text-[#C7C7CC] mt-1">
          © 2026 PeraOS. All rights reserved.
        </div>
      </div>
    </div>
  );
}
