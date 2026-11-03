import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { LOOP_FRAMES, Snowfall } from "./Snowfall";

/**
 * PILOT: Kabin Winter + salju turun
 * 1920x1080, 30fps, 300 frame = 10 detik, loop mulus.
 *
 * Prinsip loop di file ini: semua gerakan memakai progress 0..1
 * dan jumlah siklus bilangan bulat per loop (sin 2π * n * progress),
 * jadi frame 300 sama persis dengan frame 0.
 *
 * CATATAN: bentuk kabin di sini adalah placeholder yang meniru
 * layout kabinmu (badan kayu, atap bersalju, cerobong, 3 jendela,
 * 2 pohon). Nanti ganti grup <g id="..."> di bawah dengan grup
 * SVG hasil export EPS-mu yang sudah dinamai layernya.
 * Nama layer yang disarankan ada di README.md.
 */

const TAU = Math.PI * 2;

const STARS = [
  { x: 220, y: 140, size: 6, cycles: 2, phase: 0 },
  { x: 420, y: 90, size: 4, cycles: 3, phase: 1.2 },
  { x: 760, y: 170, size: 5, cycles: 2, phase: 2.1 },
  { x: 1080, y: 110, size: 4, cycles: 4, phase: 0.6 },
  { x: 1680, y: 90, size: 6, cycles: 3, phase: 1.8 },
  { x: 1820, y: 260, size: 4, cycles: 2, phase: 2.8 },
];

const Tree: React.FC<{ left: number; height: number; sway: number }> = ({
  left,
  height,
  sway,
}) => (
  <div
    style={{
      position: "absolute",
      left,
      bottom: 150,
      width: height * 0.72,
      height,
      transform: `rotate(${sway}deg)`,
      transformOrigin: "50% 100%",
    }}
  >
    <svg viewBox="0 0 200 300" width="100%" height="100%">
      <rect x="88" y="260" width="24" height="40" fill="#7a4a28" />
      <polygon points="100,10 170,130 30,130" fill="#3f7d5e" />
      <polygon points="100,90 185,210 15,210" fill="#357052" />
      <polygon points="100,170 195,280 5,280" fill="#2f6650" />
      <ellipse cx="70" cy="135" rx="34" ry="16" fill="#eaf4fc" />
      <ellipse cx="135" cy="215" rx="38" ry="16" fill="#eaf4fc" />
      <ellipse cx="100" cy="22" rx="26" ry="12" fill="#eaf4fc" />
    </svg>
  </div>
);

export const WinterCabin: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = frame / LOOP_FRAMES;

  // Asap: 3 kepul, masing-masing menempuh siklus penuh dalam 1 loop,
  // digilir 1/3 loop. Opacity sin(π*t) = 0 di awal & akhir, jadi
  // pergantian kepul tidak terlihat putus.
  const smoke = [0, 1, 2].map((i) => {
    const t = (progress + i / 3) % 1;
    return {
      left: 1140 + t * 75 + Math.sin(t * TAU) * 14,
      top: 390 - t * 280,
      size: 55 + t * 115,
      opacity: Math.sin(Math.PI * t) * 0.85,
    };
  });

  // Jendela: kedip halus, beda siklus tiap jendela supaya tidak seragam.
  const flicker = (cycles: number, phase: number) =>
    0.9 + 0.1 * Math.sin(progress * cycles * TAU + phase);

  const swayLeft = Math.sin(progress * TAU + 0.4) * 2;
  const swayRight = Math.sin(progress * TAU + 2.2) * 2.5;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #162f52 0%, #2f5a86 48%, #a8cbe4 100%)",
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
            opacity: 0.35 + 0.6 * (0.5 + 0.5 * Math.sin(progress * s.cycles * TAU + s.phase)),
          }}
        />
      ))}

      {/* Tanah salju belakang */}
      <div
        style={{
          position: "absolute",
          left: -160,
          bottom: -120,
          width: 2240,
          height: 380,
          borderRadius: "50%",
          background: "#eaf4fc",
        }}
      />

      {/* Pohon kiri & kanan */}
      <Tree left={360} height={340} sway={swayLeft} />
      <Tree left={1350} height={360} sway={swayRight} />

      {/* ===== KABIN (placeholder, ganti dengan SVG EPS-mu) ===== */}
      <svg
        viewBox="0 0 900 620"
        width={900}
        height={620}
        style={{ position: "absolute", left: 510, top: 340 }}
      >
        {/* Cerobong */}
        <g id="chimney">
          <rect x="615" y="70" width="68" height="160" fill="#a85f38" />
          <rect x="605" y="60" width="88" height="26" rx="10" fill="#8a4a26" />
          <ellipse cx="649" cy="58" rx="48" ry="16" fill="#eaf4fc" />
        </g>
        {/* Badan kabin */}
        <g id="cabin-body">
          <rect x="170" y="240" width="560" height="320" fill="#b06a38" />
          <rect x="170" y="300" width="560" height="10" fill="#8a4a26" opacity="0.6" />
          <rect x="170" y="390" width="560" height="10" fill="#8a4a26" opacity="0.6" />
          <rect x="170" y="480" width="560" height="10" fill="#8a4a26" opacity="0.6" />
        </g>
        {/* Atap + salju atap */}
        <g id="roof-snow">
          <polygon points="110,260 450,55 790,260" fill="#7c4220" />
          <path
            d="M110 260 L450 55 L790 260 L750 260 Q720 200 660 215 Q620 170 560 205 Q500 165 440 205 Q380 170 320 210 Q260 180 200 230 Q150 220 110 260 Z"
            fill="#eaf4fc"
          />
        </g>
        {/* Jendela: opacity digerakkan dari luar grup */}
        <g id="window-top" opacity={flicker(3, 0)}>
          <rect x="410" y="258" width="80" height="92" rx="40" fill="#ffd97a" />
          <rect x="447" y="258" width="8" height="92" fill="#f5a623" />
          <rect x="410" y="300" width="80" height="8" fill="#f5a623" />
        </g>
        <g id="window-left" opacity={flicker(2, 1.1)}>
          <rect x="230" y="385" width="92" height="112" rx="40" fill="#ffd97a" />
          <rect x="272" y="385" width="8" height="112" fill="#f5a623" />
          <rect x="230" y="435" width="92" height="8" fill="#f5a623" />
        </g>
        <g id="window-right" opacity={flicker(4, 2.0)}>
          <rect x="578" y="385" width="92" height="112" rx="40" fill="#ffd97a" />
          <rect x="620" y="385" width="8" height="112" fill="#f5a623" />
          <rect x="578" y="435" width="92" height="8" fill="#f5a623" />
        </g>
        {/* Pintu */}
        <g id="door">
          <rect x="410" y="365" width="80" height="195" rx="40" fill="#6b3a22" />
          <circle cx="470" cy="470" r="8" fill="#f5a623" />
        </g>
      </svg>

      {/* Asap cerobong */}
      {smoke.map((puff, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: puff.left,
            top: puff.top,
            width: puff.size,
            height: puff.size * 0.78,
            borderRadius: "50%",
            background: "#dbeeff",
            opacity: puff.opacity,
          }}
        />
      ))}

      {/* Gundukan salju depan */}
      <div
        style={{
          position: "absolute",
          left: 300,
          bottom: 10,
          width: 1320,
          height: 170,
          borderRadius: "50%",
          background: "#f4faff",
        }}
      />

      {/* Salju turun di lapisan paling depan */}
      <Snowfall />
    </AbsoluteFill>
  );
};
