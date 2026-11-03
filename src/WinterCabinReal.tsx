import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { LOOP_FRAMES, Snowfall } from "./Snowfall";

/**
 * Kabin Winter versi ASET ASLI user (03-winter_4.svg).
 *
 * SVG asli dipecah jadi layer-layer (lihat tools/split-cabin-svg.py),
 * semuanya dengan viewBox yang sama (0 0 2269.32 2578), lalu ditumpuk
 * persis di posisi yang sama. Jadi susunan akhirnya sama dengan
 * ilustrasi asli, hanya tiap layer bisa digerakkan sendiri:
 * - jendela: opacity berkedip, beda siklus tiap jendela
 * - pohon: rotasi kecil, poros di pangkal batang
 * - asap: bentuk asap asli user, 3 kepul digilir, naik + membesar + memudar
 *
 * Semua gerakan memakai siklus sinus bilangan bulat per loop,
 * jadi frame 300 sama persis dengan frame 0.
 */

const TAU = Math.PI * 2;

// Ukuran kabin di canvas 1920x1080, menjaga rasio asli 2269.32/2578.
const CABIN_W = 775;
const CABIN_H = 880;
const CABIN_LEFT = (1920 - CABIN_W) / 2;
const CABIN_TOP = 130;

const STARS = [
  { x: 220, y: 140, size: 6, cycles: 2, phase: 0 },
  { x: 420, y: 90, size: 4, cycles: 3, phase: 1.2 },
  { x: 760, y: 170, size: 5, cycles: 2, phase: 2.1 },
  { x: 1080, y: 110, size: 4, cycles: 4, phase: 0.6 },
  { x: 1680, y: 90, size: 6, cycles: 3, phase: 1.8 },
  { x: 1820, y: 260, size: 4, cycles: 2, phase: 2.8 },
];

const layerStyle: React.CSSProperties = {
  position: "absolute",
  left: CABIN_LEFT,
  top: CABIN_TOP,
  width: CABIN_W,
  height: CABIN_H,
};

export const WinterCabinReal: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = frame / LOOP_FRAMES;

  const flicker = (cycles: number, phase: number) =>
    0.9 + 0.1 * Math.sin(progress * cycles * TAU + phase);

  // Pohon: rotasi kecil, poros di pangkal batang.
  // Pangkal batang kiri ~11.5% dari kiri, kanan ~88.7%, keduanya ~94% dari atas.
  const swayLeft = Math.sin(progress * TAU + 0.4) * 1.8;
  const swayRight = Math.sin(progress * TAU + 2.2) * 2.0;

  // Asap asli: 3 kepul, poros di atas cerobong (~69.4%, ~29.7% dari canvas SVG).
  // t=0 dan t=1 opacity-nya 0, jadi pergantian kepul tidak terlihat putus.
  const smoke = [0, 1, 2].map((i) => {
    const t = (progress + i / 3) % 1;
    return {
      transform: `translateY(${-t * 170}px) scale(${0.7 + t * 0.6})`,
      transformOrigin: "69.4% 29.7%",
      opacity: Math.sin(Math.PI * t) * 0.95,
    };
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, #162f52 0%, #2f5a86 48%, #a8cbe4 100%)",
        overflow: "hidden",
        fontFamily: "sans-serif",
      }}
    >
      {/* Bulan + bintang */}
      <div
        style={{
          position: "absolute",
          left: 1480,
          top: 130,
          width: 170,
          height: 170,
          borderRadius: "50%",
          background: "#ffe9a8",
          opacity: 0.92 + 0.08 * Math.sin(progress * TAU),
          boxShadow: "0 0 90px 35px rgba(255, 233, 168, 0.35)",
        }}
      />
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
              0.35 +
              0.6 * (0.5 + 0.5 * Math.sin(progress * s.cycles * TAU + s.phase)),
          }}
        />
      ))}

      {/* Lapisan salju belakang, di belakang kabin */}
      <div
        style={{
          position: "absolute",
          left: -160,
          bottom: -140,
          width: 2240,
          height: 360,
          borderRadius: "50%",
          background: "#eaf4fc",
        }}
      />

      {/* ===== KABIN ASLI, ditumpuk layer per layer ===== */}
      <img src={staticFile("cabin-base.svg")} style={layerStyle} alt="" />
      <img
        src={staticFile("cabin-window-top.svg")}
        style={{ ...layerStyle, opacity: flicker(3, 0) }}
        alt=""
      />
      <img
        src={staticFile("cabin-window-left.svg")}
        style={{ ...layerStyle, opacity: flicker(2, 1.1) }}
        alt=""
      />
      <img
        src={staticFile("cabin-window-right.svg")}
        style={{ ...layerStyle, opacity: flicker(4, 2.0) }}
        alt=""
      />
      <img
        src={staticFile("cabin-tree-left.svg")}
        style={{
          ...layerStyle,
          transform: `rotate(${swayLeft}deg)`,
          transformOrigin: "11.5% 94%",
        }}
        alt=""
      />
      <img
        src={staticFile("cabin-tree-right.svg")}
        style={{
          ...layerStyle,
          transform: `rotate(${swayRight}deg)`,
          transformOrigin: "88.7% 94%",
        }}
        alt=""
      />
      {smoke.map((puff, i) => (
        <img
          key={i}
          src={staticFile("cabin-smoke.svg")}
          style={{ ...layerStyle, ...puff }}
          alt=""
        />
      ))}

      {/* Salju turun di lapisan paling depan */}
      <Snowfall />
    </AbsoluteFill>
  );
};
