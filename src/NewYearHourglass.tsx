import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import {
  LOOP_FRAMES,
  TAU,
  iconWrapStyle,
  layerStyle,
} from "./NewYearShared";

/**
 * HERO 2/4 — Hourglass (jam pasir merah, pasir emas).
 * Aset asli: public/NewYear01/Hourglass.svg, dipecah tools/split-newyear.py:
 * - hourglass-frame.svg: tutup-bawah + body-jam + tutup-atas
 * - hourglass-sand.svg: pasir-jam (shimmer halus, permukaan TIDAK dianimasikan
 *   naik/turun — tidak bisa kembali ke posisi awal dalam 6 detik tanpa lompat)
 * - hourglass-sparkle.svg: percikan-atas/bawah (twinkle 3 siklus)
 * Butir pasir jatuh: 3 titik emas di leher jam, naik-membesar-memudar dengan
 * sin(pi*t) seperti asap kabin, 2 putaran per loop.
 *
 * Spec: 3840x2160, 30fps, 6 detik = 180 frame. Frame 180 = frame 0.
 */
const GRAINS = [
  { left: "48%", size: 16, offset: 0 },
  { left: "52%", size: 12, offset: 0.33 },
  { left: "50%", size: 14, offset: 0.66 },
];

export const NewYearHourglass: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = frame / LOOP_FRAMES;

  const bob = Math.sin(progress * TAU + 0.6) * 16;
  const tilt = Math.sin(progress * TAU) * 3;
  const sandShimmer = 0.92 + 0.08 * Math.sin(progress * 2 * TAU);
  // Percikan adalah bentuk splash emas asli (di kanan jam), bukan bintang —
  // twinkle-nya dibuat tipis saja supaya tetap terbaca emas, tidak meredup jadi zaitun.
  const sparkleOpacity =
    0.78 + 0.22 * (0.5 + 0.5 * Math.sin(progress * 3 * TAU + 1.1));

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      <div
        style={{
          ...iconWrapStyle,
          transform: `translateY(${bob}px) rotate(${tilt}deg)`,
          transformOrigin: "50% 50%",
        }}
      >
        <img src={staticFile("hourglass-frame.svg")} style={layerStyle} alt="" />
        <img
          src={staticFile("hourglass-sand.svg")}
          style={{ ...layerStyle, opacity: sandShimmer }}
          alt=""
        />
        <img
          src={staticFile("hourglass-sparkle.svg")}
          style={{ ...layerStyle, opacity: sparkleOpacity }}
          alt=""
        />
        {/* Butir pasir jatuh di leher jam */}
        {GRAINS.map((g, i) => {
          const t = (progress * 2 + g.offset) % 1;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: g.left,
                top: `${38 + t * 24}%`,
                width: g.size,
                height: g.size,
                borderRadius: "50%",
                background: "#ffffff",
                opacity: 0.9 * Math.sin(Math.PI * t),
                transform: "translateX(-50%)",
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
