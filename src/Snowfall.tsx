import React from "react";
import { useCurrentFrame } from "remotion";

export const LOOP_FRAMES = 300;

/** Deterministic pseudo-random generator so every render is identical. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Flake = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  fallLoops: number; // integer: full screen heights travelled per loop, keeps the loop seamless
  swayCycles: number; // integer: full sway cycles per loop
  swayAmp: number;
  phase: number;
};

const FLAKES: Flake[] = (() => {
  const rand = mulberry32(20261103);
  return Array.from({ length: 130 }, () => ({
    x: rand() * 1920,
    y: rand() * 1080,
    size: 3 + rand() * 9,
    opacity: 0.35 + rand() * 0.6,
    fallLoops: rand() > 0.5 ? 2 : 1,
    swayCycles: 1 + Math.floor(rand() * 3),
    swayAmp: 12 + rand() * 30,
    phase: rand() * Math.PI * 2,
  }));
})();

/**
 * Falling snow that is seamless by construction:
 * - vertical travel is an integer number of screen heights per loop
 * - horizontal sway is an integer number of sine cycles per loop
 * So frame 300 is identical to frame 0.
 */
export const Snowfall: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = frame / LOOP_FRAMES;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {FLAKES.map((flake, i) => {
        const y = (flake.y + progress * flake.fallLoops * 1080) % 1080;
        const x =
          flake.x +
          Math.sin(progress * flake.swayCycles * Math.PI * 2 + flake.phase) *
            flake.swayAmp;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: flake.size,
              height: flake.size,
              borderRadius: "50%",
              background: "white",
              opacity: flake.opacity,
            }}
          />
        );
      })}
    </div>
  );
};
