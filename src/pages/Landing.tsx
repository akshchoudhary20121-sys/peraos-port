import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useAuthActions } from "@convex-dev/auth/react";

type BootPhase = "black" | "logo" | "loading" | "welcome" | "lock";

export default function Landing() {
  const [phase, setPhase] = useState<BootPhase>("black");
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let signIn: (...args: any[]) => Promise<any> = async () => ({});
  try {
    const actions = useAuthActions();
    signIn = actions.signIn;
  } catch {
    // Convex not configured
  }

  // Boot sequence
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase("logo"), 400));
    timers.push(setTimeout(() => setPhase("loading"), 1400));
    timers.push(setTimeout(() => setPhase("welcome"), 2800));
    timers.push(setTimeout(() => setPhase("lock"), 3600));
    return () => timers.forEach(clearTimeout);
  }, []);

  // Update clock on lock screen
  useEffect(() => {
    if (phase === "lock") {
      const interval = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleEnter = useCallback(async () => {
    // Try anonymous sign-in, but navigate either way
    try {
      await signIn("anonymous");
    } catch {
      // Convex not configured — still navigate to the desktop
    }
    navigate("/dashboard");
  }, [navigate, signIn]);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false });

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: "#000" }}>
      <AnimatePresence mode="wait">
        {/* Phase: Black screen */}
        {phase === "black" && (
          <motion.div
            key="black"
            className="absolute inset-0 bg-black"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* Phase: Logo appears */}
        {phase === "logo" && (
          <motion.div
            key="logo"
            className="absolute inset-0 bg-black flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-4"
            >
              <div
                className="w-20 h-20 rounded-[22px] flex items-center justify-center text-3xl font-bold text-white shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #BF5AF2 0%, #5E5CE6 50%, #0A84FF 100%)",
                  boxShadow: "0 8px 32px rgba(94,92,230,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                P
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-white text-xl font-light tracking-wide"
              >
                PeraOS
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Phase: Loading */}
        {phase === "loading" && (
          <motion.div
            key="loading"
            className="absolute inset-0 bg-black flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col items-center gap-6">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-bold text-white shadow-2xl"
                style={{ background: "linear-gradient(135deg, #4285F4, #34A853)" }}
              >
                P
              </div>
              <div className="flex items-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-white/60"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/50 text-sm"
              >
                Starting PeraOS...
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Phase: Welcome text */}
        {phase === "welcome" && (
          <motion.div
            key="welcome"
            className="absolute inset-0 bg-black flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <h1 className="text-4xl font-light text-white mb-2">
                Welcome to{" "}
                <span className="font-medium" style={{ background: "linear-gradient(135deg, #4285F4, #34A853, #FBBC05)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  PeraOS
                </span>
              </h1>
              <p className="text-white/40 text-sm">Your personal operating system, reimagined for the web.</p>
            </motion.div>
          </motion.div>
        )}

        {/* Phase: Lock screen */}
        {phase === "lock" && (
          <motion.div
            key="lock"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)",
            }}
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div
                className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-10"
                style={{ background: "radial-gradient(circle, #4285F4 0%, transparent 70%)" }}
              />
              <div
                className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.08]"
                style={{ background: "radial-gradient(circle, #34A853 0%, transparent 70%)" }}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center relative z-10"
            >
              {/* Time */}
              <div className="mb-8">
                <div className="text-[72px] font-extralight text-white leading-none tracking-[-0.04em]" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {formatTime(time)}
                </div>
                <div className="text-[15px] text-white/45 mt-2.5 font-light tracking-[-0.01em]">
                  {formatDate(time)}
                </div>
              </div>

              {/* User Avatar */}
              <div className="mb-6">
                <div className="w-[72px] h-[72px] rounded-full mx-auto flex items-center justify-center text-2xl text-white font-light"
                  style={{
                    background: "linear-gradient(135deg, #8E8E93, #636366)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
                  }}
                >
                  G
                </div>
                <div className="text-white/60 text-[14px] mt-3 font-medium tracking-[-0.01em]">Guest</div>
              </div>

              {/* Enter button */}
              <motion.button
                onClick={handleEnter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-2.5 rounded-full text-[13px] font-medium transition-all cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "0.5px solid rgba(255,255,255,0.2)",
                  color: "white",
                  backdropFilter: "blur(10px)",
                  letterSpacing: "0.01em",
                }}
              >
                Press to Enter PeraOS
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-white/25 text-[11px] mt-6"
              >
                Click anywhere or press the button to start
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click handler for lock screen */}
      {phase === "lock" && (
        <div className="absolute inset-0 z-0" onClick={handleEnter} />
      )}
    </div>
  );
}
