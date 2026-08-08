"use client";

import { motion } from "framer-motion";

// Deterministic pseudo-random spike train, styled like an oscilloscope /
// neuron firing trace rather than a generic particle-network background.
// This is the hero's "thesis": the product visualizes activations, so the
// hero itself is an activation trace.
function buildPath(seed: number, width: number, height: number, points: number) {
  const mid = height / 2;
  let d = `M 0 ${mid}`;
  for (let i = 1; i <= points; i++) {
    const x = (i / points) * width;
    const n = Math.sin(i * 0.9 + seed) * Math.sin(i * 0.27 + seed * 1.7);
    const y = mid + n * (height * 0.34);
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

export function SignalHero() {
  const width = 1000;
  const height = 220;
  const lines = [
    { seed: 1.3, color: "#5EEAD4", opacity: 0.85, sw: 2 },
    { seed: 4.1, color: "#7C6FFF", opacity: 0.5, sw: 1.5 },
    { seed: 7.8, color: "#5EEAD4", opacity: 0.25, sw: 1 },
  ];

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-border bg-surface">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[220px]" preserveAspectRatio="none">
        <defs>
          <linearGradient id="fade" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#0A0B0D" />
            <stop offset="12%" stopColor="#0A0B0D" stopOpacity="0" />
            <stop offset="88%" stopColor="#0A0B0D" stopOpacity="0" />
            <stop offset="100%" stopColor="#0A0B0D" />
          </linearGradient>
        </defs>
        {lines.map((l, i) => (
          <motion.path
            key={i}
            d={buildPath(l.seed, width, height, 140)}
            fill="none"
            stroke={l.color}
            strokeOpacity={l.opacity}
            strokeWidth={l.sw}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.2, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
        <rect x="0" y="0" width={width} height={height} fill="url(#fade)" />
      </svg>
      <div className="absolute inset-0 grain pointer-events-none opacity-40" />
    </div>
  );
}
