import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import {
  LOOP_FRAMES,
  TAU,
  iconWrapStyle,
  layerStyle,
} from "./NewYearShared";

/**
 * HERO 3/4 — NewYearCap (topi pesta merah, bulu krem, pom emas).
 * Aset asli: public/NewYear01/NewYearCap.svg, dipecah tools/split-newyear.py:
 * - cap-body.svg: body-topi (goyang 1 siklus, poros di bulu/alas)
 * - cap-fur.svg: bulu-topi (diam, jangkar di alas)
 * - cap-pom.svg: cepol-topi + highlight-topi (pom membal 2 siklus)
 *
 * Spec: 3840x2160, 30fps, 6 detik = 180 frame. Frame 180 = frame 0.
 */
export const NewYearCap: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = frame / LOOP_FRAMES;

  const bob = Math.sin(progress * TAU + 1.2) * 16;
  const sway = Math.sin(progress * TAU + 0.3) * 2.5;
  const pomScale = 1 + 0.08 * Math.sin(progress * 2 * TAU);
  const pomOpacity = 0.92 + 0.08 * Math.sin(progress * 3 * TAU + 0.8);

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      <div
        style={{
          ...iconWrapStyle,
          transform: `translateY(${bob}px)`,
        }}
      >
        <img
          src={staticFile("cap-body.svg")}
          style={{
            ...layerStyle,
            transform: `rotate(${sway}deg)`,
            transformOrigin: "50% 95%",
          }}
          alt=""
        />
        <img src={staticFile("cap-fur.svg")} style={layerStyle} alt="" />
        <img
          src={staticFile("cap-pom.svg")}
          style={{
            ...layerStyle,
            transform: `rotate(${sway}deg) scale(${pomScale})`,
            transformOrigin: "55% 26%",
            opacity: pomOpacity,
          }}
          alt=""
        />
      </div>
    </AbsoluteFill>
  );
};
