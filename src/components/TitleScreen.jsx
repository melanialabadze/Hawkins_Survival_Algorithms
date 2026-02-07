import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Zap } from "lucide-react";

const FLICKER_LETTERS = "HAWKINS SURVIVAL ALGORITHMS";

function FlickerText() {
  const [flickerIndex, setFlickerIndex] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlickerIndex(Math.floor(Math.random() * FLICKER_LETTERS.length));
      setTimeout(() => setFlickerIndex(-1), 150);
    }, 2000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-widest text-center leading-tight">
      {FLICKER_LETTERS.split("").map((char, i) => (
        <span
          key={i}
          className={`inline-block transition-all duration-100 ${
            i === flickerIndex ? "opacity-20 text-red-400" : "text-red-500"
          } ${char === " " ? "w-3 sm:w-4" : ""}`}
          style={{
            textShadow:
              i === flickerIndex
                ? "none"
                : "0 0 20px rgba(239,68,68,0.5), 0 0 40px rgba(239,68,68,0.2)",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  );
}

export default function TitleScreen({ onStart }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setReady(true), 800);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Particle/noise bg */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Glow orb */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <AnimatePresence>
        {ready && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center gap-8"
          >
            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{ opacity: 0.5, letterSpacing: "0.3em" }}
              transition={{ delay: 0.3, duration: 1.2 }}
              className="text-xs font-mono text-red-400/50 uppercase"
            >
              ⚡ Escape the Upside Down ⚡
            </motion.div>

            {/* Title */}
            <FlickerText />

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-sm sm:text-base text-gray-400 font-mono text-center max-w-md"
            >
              You don't control the character. You control the logic.
              <br />
              <span className="text-red-400/60">
                Choose wisely. Survive algorithmically.
              </span>
            </motion.p>

            {/* Start button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(239,68,68,0.3)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={onStart}
              className="mt-4 flex items-center gap-3 px-8 py-4 bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 rounded-lg text-red-400 font-mono uppercase tracking-wider text-sm transition-all duration-300 group"
            >
              <Play className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              Initialize Escape Sequence
              <Zap className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>

            {/* Bottom info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 1.6, duration: 1 }}
              className="text-[10px] font-mono text-gray-600 text-center mt-8 space-y-1"
            >
              <p>5 MISSIONS • 3 LIVES • IF/ELSE → LOOPS → ALGORITHMS</p>
              <p>A STORY-DRIVEN SURVIVAL GAME THAT TEACHES COMPUTER SCIENCE</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
