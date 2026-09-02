import { useState, useEffect, useRef } from "react";
import { Clock, Timer } from "lucide-react";

type Tab = "clock" | "stopwatch" | "timer";

export function ClockApp() {
  const [tab, setTab] = useState<Tab>("clock");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tabs */}
      <div className="flex border-b border-[#e8eaed]">
        {([
          { id: "clock" as Tab, label: "Clock", icon: Clock },
          { id: "stopwatch" as Tab, label: "Stopwatch", icon: Timer },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-medium transition-colors border-b-2 ${
              tab === t.id
                ? "text-[#FF2D55] border-[#FF2D55]"
                : "text-[#86868B] border-transparent hover:text-[#1D1D1F]"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {tab === "clock" && <ClockView time={time} />}
        {tab === "stopwatch" && <StopwatchView />}
      </div>
    </div>
  );
}

function ClockView({ time }: { time: Date }) {
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;

  const formatDigital = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
      {/* Analog clock */}
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Clock face */}
          <circle cx="100" cy="100" r="95" fill="white" stroke="#E5E5EA" strokeWidth="1.5" />
          {/* Hour markers */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 100 + 82 * Math.sin(angle);
            const y1 = 100 - 82 * Math.cos(angle);
            const x2 = 100 + 88 * Math.sin(angle);
            const y2 = 100 - 88 * Math.cos(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1D1D1F" strokeWidth="2" strokeLinecap="round" />;
          })}
          {/* Minute markers */}
          {Array.from({ length: 60 }).map((_, i) => {
            if (i % 5 === 0) return null;
            const angle = (i * 6 * Math.PI) / 180;
            const x1 = 100 + 85 * Math.sin(angle);
            const y1 = 100 - 85 * Math.cos(angle);
            const x2 = 100 + 88 * Math.sin(angle);
            const y2 = 100 - 88 * Math.cos(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#E5E5EA" strokeWidth="0.8" />;
          })}
          {/* Hour hand */}
          <line
            x1="100" y1="100"
            x2={100 + 45 * Math.sin((hourDeg * Math.PI) / 180)}
            y2={100 - 45 * Math.cos((hourDeg * Math.PI) / 180)}
            stroke="#1D1D1F" strokeWidth="3" strokeLinecap="round"
          />
          {/* Minute hand */}
          <line
            x1="100" y1="100"
            x2={100 + 65 * Math.sin((minuteDeg * Math.PI) / 180)}
            y2={100 - 65 * Math.cos((minuteDeg * Math.PI) / 180)}
            stroke="#1D1D1F" strokeWidth="2" strokeLinecap="round"
          />
          {/* Second hand */}
          <line
            x1="100" y1="100"
            x2={100 + 70 * Math.sin((secondDeg * Math.PI) / 180)}
            y2={100 - 70 * Math.cos((secondDeg * Math.PI) / 180)}
            stroke="#FF2D55" strokeWidth="1" strokeLinecap="round"
          />
          {/* Center dot */}
          <circle cx="100" cy="100" r="3.5" fill="#FF2D55" />
        </svg>
      </div>

      {/* Digital time */}
      <div className="text-center">
        <div className="text-[32px] font-extralight text-[#1D1D1F]" style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
          {formatDigital(time)}
        </div>
        <div className="text-[13px] text-[#86868B] mt-1">{formatDate(time)}</div>
      </div>
    </div>
  );
}

function StopwatchView() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 10);
      }, 10);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const formatMs = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centis = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centis.toString().padStart(2, "0")}`;
  };

  const handleLap = () => {
    if (running) {
      setLaps((prev) => [elapsed, ...prev]);
    }
  };

  const handleReset = () => {
    setRunning(false);
    setElapsed(0);
    setLaps([]);
  };

  return (
    <div className="flex flex-col items-center h-full p-6">
      <div className="text-[48px] font-extralight text-[#1D1D1F] my-8" style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "-0.03em" }}>
        {formatMs(elapsed)}
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={handleLap}
          disabled={!running}
          className="px-6 py-2.5 rounded-full text-[13px] font-medium bg-[#f1f3f4] text-[#202124] hover:bg-[#e8eaed] transition-colors disabled:opacity-40"
        >
          Lap
        </button>
        <button
          onClick={() => setRunning(!running)}
          className="px-6 py-2.5 rounded-full text-[13px] font-medium bg-[#007AFF] text-white hover:bg-[#0A84FF] transition-colors"
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={handleReset}
          disabled={elapsed === 0}
          className="px-6 py-2.5 rounded-full text-[13px] font-medium bg-[#F2F2F7] text-[#1D1D1F] hover:bg-[#E5E5EA] transition-colors disabled:opacity-40"
        >
          Reset
        </button>
      </div>

      {laps.length > 0 && (
        <div className="w-full flex-1 overflow-y-auto">
          <div className="text-[12px] font-semibold text-[#86868B] mb-2">Laps</div>
          {laps.map((lap, i) => (
            <div key={i} className="flex justify-between py-2 border-b border-[#E5E5EA] text-[13px]">
              <span className="text-[#86868B]">Lap {laps.length - i}</span>
              <span className="text-[#1D1D1F]" style={{ fontVariantNumeric: "tabular-nums" }}>
                {formatMs(i === 0 ? lap - (laps[1] ?? 0) : lap - (laps[i + 1] ?? 0))}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
