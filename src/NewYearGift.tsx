import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import {
  LOOP_FRAMES,
  TAU,
  iconWrapStyle,
  layerStyle,
} from "./NewYearShared";

/**
 * HERO 1/4 — NewYearGift (kado merah, pita emas).
 * Aset asli: public/NewYear01/NewYearGift.svg, dipecah tools/split-newyear.py:
 * - gift-base.svg: body-kado (diam, jangkar)
 * - gift-lid.svg: tutup-kado + tali-kanan/kiri (terangkat 2x per loop)
 * - gift-bow.svg: simpul_kanan/kiri + bulatan-simpul (pulse 3 siklus)
 *
 * Spec: 3840x2160, 30fps, 6 detik = 180 frame. Semua gerak siklus bulat,
 * frame 180 = frame 0.
 */
export const NewYearGift: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = frame / LOOP_FRAMES;

  // Ikon utuh: bob halus 1 siklus + miring kecil.
  const bob = Math.sin(progress * TAU) * 18;
  const tilt = Math.sin(progress * TAU + 0.3) * 0.8;
  // Tutup: terangkat 2x per loop, 0 di awal/akhir tiap angkatan.
  const lidLift = -26 * (0.5 - 0.5 * Math.cos(progress * 2 * TAU));
  // Pita: pulse 3 siklus.
  const bowScale = 1 + 0.06 * Math.sin(progress * 3 * TAU + 0.5);

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      <div
        style={{
          ...iconWrapStyle,
          transform: `translateY(${bob}px) rotate(${tilt}deg)`,
          transformOrigin: "50% 85%",
        }}
      >
        <img src={staticFile("gift-base.svg")} style={layerStyle} alt="" />
        <img
          src={staticFile("gift-lid.svg")}
          style={{ ...layerStyle, transform: `translateY(${lidLift}px)` }}
          alt=""
        />
        <img
          src={staticFile("gift-bow.svg")}
          style={{
            ...layerStyle,
            transform: `translateY(${lidLift}px) scale(${bowScale})`,
            transformOrigin: "50% 35%",
          }}
          alt=""
        />
      </div>
    </AbsoluteFill>
  );
};
