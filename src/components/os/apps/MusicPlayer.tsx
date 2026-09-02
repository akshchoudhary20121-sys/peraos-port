import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Heart } from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  color: string;
}

const TRACKS: Track[] = [
  { id: "1", title: "Midnight Dreams", artist: "Luna Wave", album: "Stellar", duration: 234, color: "#4285F4" },
  { id: "2", title: "Electric Sunset", artist: "Neon Pulse", album: "Horizon", duration: 198, color: "#EA4335" },
  { id: "3", title: "Ocean Breeze", artist: "Calm Shores", album: "Tides", duration: 267, color: "#34A853" },
  { id: "4", title: "Starlight Serenade", artist: "The Velvet Keys", album: "Nocturne", duration: 312, color: "#FBBC05" },
  { id: "5", title: "Urban Jungle", artist: "Beat Circuit", album: "City Lights", duration: 245, color: "#9C27B0" },
  { id: "6", title: "Crystal Waters", artist: "Ambient Flow", album: "Serenity", duration: 289, color: "#00BCD4" },
  { id: "7", title: "Firefly Dance", artist: "Luna Wave", album: "Stellar", duration: 178, color: "#FF5722" },
  { id: "8", title: "Velvet Sky", artist: "Neon Pulse", album: "Horizon", duration: 256, color: "#607D8B" },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const track = TRACKS[currentTrack];

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    if (progress > 3) {
      setProgress(0);
    } else {
      setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
      setProgress(0);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= track.duration) {
            if (repeat) return 0;
            nextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, track.duration, repeat]);

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Now Playing */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Album art */}
        <div
          className="w-40 h-40 rounded-2xl shadow-lg flex items-center justify-center mb-6 transition-all duration-500"
          style={{
            background: `linear-gradient(135deg, ${track.color}, ${track.color}88)`,
            transform: isPlaying ? "scale(1)" : "scale(0.95)",
          }}
        >
          <div className="text-4xl text-white/80">♪</div>
        </div>

        {/* Track info */}
        <div className="text-center mb-4">
          <div className="text-[18px] font-medium text-[#202124]">{track.title}</div>
          <div className="text-[13px] text-[#5f6368] mt-0.5">{track.artist} · {track.album}</div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-[280px]">
          <div
            className="w-full h-1.5 bg-[#e8eaed] rounded-full cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              setProgress(Math.floor((x / rect.width) * track.duration));
            }}
          >
            <div
              className="h-full bg-[#1A73E8] rounded-full relative transition-all"
              style={{ width: `${(progress / track.duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#1A73E8] rounded-full shadow opacity-0 hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="flex justify-between text-[11px] text-[#5f6368] mt-1" style={{ fontVariantNumeric: "tabular-nums" }}>
            <span>{formatTime(progress)}</span>
            <span>{formatTime(track.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-4">
          <button onClick={() => setShuffle(!shuffle)} className={`p-1.5 rounded-full transition-colors ${shuffle ? "text-[#1A73E8]" : "text-[#5f6368] hover:text-[#202124]"}`}>
            <Shuffle className="w-4 h-4" />
          </button>
          <button onClick={prevTrack} className="p-1.5 rounded-full text-[#202124] hover:bg-[#f1f3f4] transition-colors">
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full bg-[#202124] text-white flex items-center justify-center hover:bg-[#3C4043] transition-colors shadow-md"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
          <button onClick={nextTrack} className="p-1.5 rounded-full text-[#202124] hover:bg-[#f1f3f4] transition-colors">
            <SkipForward className="w-5 h-5" />
          </button>
          <button onClick={() => setRepeat(!repeat)} className={`p-1.5 rounded-full transition-colors ${repeat ? "text-[#1A73E8]" : "text-[#5f6368] hover:text-[#202124]"}`}>
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 mt-4 w-full max-w-[200px]">
          <Volume2 className="w-4 h-4 text-[#5f6368] shrink-0" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 h-1 accent-[#1A73E8]"
          />
        </div>
      </div>

      {/* Track List */}
      <div className="h-[180px] border-t border-[#e8eaed] overflow-y-auto">
        <div className="px-3 py-2 text-[12px] font-medium text-[#5f6368]">Queue</div>
        {TRACKS.map((t, i) => (
          <button
            key={t.id}
            onClick={() => {
              setCurrentTrack(i);
              setProgress(0);
              setIsPlaying(true);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
              i === currentTrack ? "bg-[#E8F0FE]" : "hover:bg-[#f8f9fa]"
            }`}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0"
              style={{ background: t.color }}
            >
              {i === currentTrack && isPlaying ? "♫" : i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-[13px] truncate ${i === currentTrack ? "text-[#1A73E8] font-medium" : "text-[#202124]"}`}>
                {t.title}
              </div>
              <div className="text-[11px] text-[#5f6368] truncate">{t.artist}</div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); toggleLike(t.id); }}
              className="p-1"
            >
              <Heart className={`w-3.5 h-3.5 ${liked.has(t.id) ? "fill-red-400 text-red-400" : "text-[#dadce0]"}`} />
            </button>
            <span className="text-[11px] text-[#5f6368] shrink-0" style={{ fontVariantNumeric: "tabular-nums" }}>
              {formatTime(t.duration)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
