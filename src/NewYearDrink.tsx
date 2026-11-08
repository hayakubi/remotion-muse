import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import {
  LOOP_FRAMES,
  TAU,
  iconWrapStyle,
  layerStyle,
} from "./NewYearShared";

/**
 * HERO 4/4 — NewYearDrink (gelas champagne, isi emas).
 * Aset asli: public/NewYear01/NewYearDrink.svg, dipecah tools/split-newyear.py:
 * - drink-glass.svg: body-gelas + aksen + bawah-gelas + leher-gelas
 * - drink-liquid.svg: isi-gelas (shimmer halus saja — tidak dimiringkan banyak)
 * - drink-sparkle.svg: sparkle-kanan/kiri (twinkle bergantian, 3 siklus)
 * Gelembung: 4 titik naik di dalam gelas, opacity sin(pi*t), 2 putaran per loop.
 * Goyang utuh kecil saja (±1,5°) supaya tidak terlihat seperti mau tumpah.
 *
 * Spec: 3840x2160, 30fps, 6 detik = 180 frame. Frame 180 = frame 0.
 */
const BUBBLES = [
  { left: "44%", size: 16, offset: 0 },
  { left: "48%", size: 12, offset: 0.25 },
  { left: "52%", size: 18, offset: 0.5 },
  { left: "56%", size: 13, offset: 0.75 },
];

export const NewYearDrink: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = frame / LOOP_FRAMES;

  const bob = Math.sin(progress * TAU + 1.8) * 16;
  const tilt = Math.sin(progress * TAU) * 1.5;
  const liquidShimmer = 0.95 + 0.05 * Math.sin(progress * 2 * TAU + 0.4);
  const sparkleOpacity =
    0.4 + 0.6 * (0.5 + 0.5 * Math.sin(progress * 3 * TAU + 2.0));

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      <div
        style={{
          ...iconWrapStyle,
          transform: `translateY(${bob}px) rotate(${tilt}deg)`,
          transformOrigin: "50% 100%",
        }}
      >
        <img src={staticFile("drink-glass.svg")} style={layerStyle} alt="" />
        <img
          src={staticFile("drink-liquid.svg")}
          style={{ ...layerStyle, opacity: liquidShimmer }}
          alt=""
        />
        <img
          src={staticFile("drink-sparkle.svg")}
          style={{ ...layerStyle, opacity: sparkleOpacity }}
          alt=""
        />
        {/* Gelembung naik di dalam gelas */}
        {BUBBLES.map((b, i) => {
          const t = (progress * 2 + b.offset) % 1;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: b.left,
                top: `${58 - t * 30}%`,
                width: b.size,
                height: b.size,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.85)",
                border: "2px solid rgba(255,209,93,0.9)",
                opacity: Math.sin(Math.PI * t),
                transform: "translateX(-50%)",
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
