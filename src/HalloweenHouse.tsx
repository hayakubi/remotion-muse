import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";

/**
 * Haunted House with Moon and Bats — aset asli user (HalloweenHouse.svg).
 *
 * Spesifikasi mengikuti setting tracker terbaru untuk loop ke depan:
 * 3840x2160 (4K UHD), 30fps, 6 detik = 180 frame.
 *
 * SVG asli dipecah jadi layer-layer (tools/split-halloween-house.py),
 * semuanya dengan viewBox yang sama (0 0 2552 2604.54), lalu ditumpuk
 * persis di posisi yang sama:
 * - bulan: denyut halus
 * - kelelawar: mengepak (scaleY) + melayang orbit kecil, kembali ke posisi awal
 * - jendela/pintu: berkedip, dua grup bergantian
 * - pohon: goyang kecil, poros di pangkal batang
 * - tanah: statis, di depan kaki rumah/pohon seperti di SVG asli
 *
 * Semua gerakan memakai siklus sinus bilangan bulat per loop,
 * jadi frame 180 sama persis dengan frame 0.
 */

const TAU = Math.PI * 2;
const LOOP_FRAMES = 180;

// Ukuran rumah di canvas 3840x2160, menjaga rasio asli 2552/2604.54.
const HOUSE_W = 2116;
const HOUSE_H = 2160;
const HOUSE_LEFT = (3840 - HOUSE_W) / 2;
const HOUSE_TOP = 0;

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STARS = (() => {
  const rand = mulberry32(20261105);
  return Array.from({ length: 90 }, () => ({
    x: rand() * 3840,
    y: rand() * 1400,
    size: 3 + rand() * 7,
    cycles: 2 + Math.floor(rand() * 3),
    phase: rand() * TAU,
  }));
})();

const FOG = (() => {
  const rand = mulberry32(777);
  return Array.from({ length: 6 }, (_, i) => ({
    x: 300 + i * 600 + rand() * 200,
    y: 1650 + rand() * 350,
    w: 700 + rand() * 500,
    h: 90 + rand() * 80,
    amp: 60 + rand() * 90,
    phase: rand() * TAU,
  }));
})();

const layerStyle: React.CSSProperties = {
  position: "absolute",
  left: HOUSE_LEFT,
  top: HOUSE_TOP,
  width: HOUSE_W,
  height: HOUSE_H,
};

export const HalloweenHouse: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = frame / LOOP_FRAMES;

  const flicker = (cycles: number, phase: number) =>
    0.88 + 0.12 * Math.sin(progress * cycles * TAU + phase);

  const moonScale = 1 + 0.03 * Math.sin(progress * TAU);
  const moonOpacity = 0.95 + 0.05 * Math.sin(progress * TAU);

  // Kelelawar: orbit kecil (kembali ke awal) + kepak sayap.
  const bat = (
    dxAmp: number,
    dyAmp: number,
    phase: number,
    flapCycles: number,
  ) => {
    const dx = Math.sin(progress * TAU + phase) * dxAmp;
    const dy = Math.cos(progress * TAU + phase) * dyAmp;
    const flap =
      0.65 + 0.35 * (0.5 + 0.5 * Math.sin(progress * flapCycles * TAU + phase));
    return `translate(${dx}px, ${dy}px) scale(1, ${flap})`;
  };

  const swayLeft = Math.sin(progress * TAU + 0.4) * 1.5;
  const swayRight = Math.sin(progress * TAU + 2.2) * 1.8;

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, #1e1233 0%, #3d2157 45%, #7a5a9e 100%)",
        overflow: "hidden",
        fontFamily: "sans-serif",
      }}
    >
      {/* Bintang */}
      {STARS.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "white",
            opacity:
              0.3 + 0.6 * (0.5 + 0.5 * Math.sin(progress * s.cycles * TAU + s.phase)),
          }}
        />
      ))}

      {/* ===== RUMAH HANTU ASLI, ditumpuk layer per layer ===== */}
      <img
        src={staticFile("house-moon.svg")}
        style={{
          ...layerStyle,
          transform: `scale(${moonScale})`,
          transformOrigin: "75% 19.7%",
          opacity: moonOpacity,
        }}
        alt=""
      />
      <img
        src={staticFile("house-bat-left.svg")}
        style={{
          ...layerStyle,
          transform: bat(60, 30, 0, 6),
          transformOrigin: "33% 15%",
        }}
        alt=""
      />
      <img
        src={staticFile("house-bat-right.svg")}
        style={{
          ...layerStyle,
          transform: bat(50, 25, 2.1, 7),
          transformOrigin: "94% 21%",
        }}
        alt=""
      />
      <img src={staticFile("house-base.svg")} style={layerStyle} alt="" />
      <img
        src={staticFile("house-windows-a.svg")}
        style={{ ...layerStyle, opacity: flicker(3, 0) }}
        alt=""
      />
      <img
        src={staticFile("house-windows-b.svg")}
        style={{ ...layerStyle, opacity: flicker(2, 1.4) }}
        alt=""
      />
      <img
        src={staticFile("house-tree-left.svg")}
        style={{
          ...layerStyle,
          transform: `rotate(${swayLeft}deg)`,
          transformOrigin: "25% 96%",
        }}
        alt=""
      />
      <img
        src={staticFile("house-tree-right.svg")}
        style={{
          ...layerStyle,
          transform: `rotate(${swayRight}deg)`,
          transformOrigin: "88% 96%",
        }}
        alt=""
      />
      <img src={staticFile("house-ground.svg")} style={layerStyle} alt="" />

      {/* Kabut tipis melayang di depan kaki rumah, bolak-balik halus */}
      {FOG.map((f, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: f.x + Math.sin(progress * TAU + f.phase) * f.amp,
            top: f.y,
            width: f.w,
            height: f.h,
            borderRadius: "50%",
            background: "rgba(210, 190, 230, 0.13)",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
