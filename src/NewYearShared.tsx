import React from "react";
import { useCurrentFrame } from "remotion";

/**
 * Shared hero template for the New Year B direction (hero per icon).
 *
 * Spec (tracker): 3840x2160 4K UHD, 30fps, 6 detik = 180 frame, tanpa suara.
 * Semua gerak memakai progress 0..1 dengan siklus sinus bilangan bulat,
 * jadi frame 180 sama persis dengan frame 0.
 *
 * Layout hero: satu ikon 1080x1080 ditampilkan 1560x1560 di tengah canvas.
 *
 * OVERLAY (2026-11-08): keempat komposisi hero dirender TRANSPARAN — tanpa
 * background, glow, confetti, atau bayangan — supaya pembeli bisa memakai
 * animasinya sebagai overlay di atas video mereka sendiri. Alpha lebih
 * bersih daripada greenscreen untuk vektor flat (tanpa green spill, pembeli
 * tidak perlu keying; greenscreen juga merusak subjek putih/pastel).
 * MP4/H.264 TIDAK bisa membawa transparansi — render versi overlay sebagai
 * WebM VP9 (--codec=vp9, alpha) atau MOV ProRes 4444, cek aturan portal
 * sebelum submit. Kalau suatu portal minta MP4, ganti background transparan
 * jadi hijau solid #00FF00 di komponen, lalu render MP4 seperti biasa.
 *
 * Helper HeroBackground / HeroShadow / Confetti di bawah ini TIDAK dipakai
 * lagi oleh komposisi overlay, tapi sengaja disimpan: itu varian scene
 * (background navy + confetti) yang videonya sudah jadi 3 file MP4 4K.
 * Untuk mengembalikan varian scene, tinggal pakai lagi helper-helper itu
 * di komponen seperti sebelumnya.
 */

export const TAU = Math.PI * 2;
export const LOOP_FRAMES = 180;

export const ICON_W = 1560;
export const ICON_H = 1560;
export const ICON_LEFT = (3840 - ICON_W) / 2;
export const ICON_TOP = (2160 - ICON_H) / 2;

export const layerStyle: React.CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  width: ICON_W,
  height: ICON_H,
};

export const iconWrapStyle: React.CSSProperties = {
  position: "absolute",
  left: ICON_LEFT,
  top: ICON_TOP,
  width: ICON_W,
  height: ICON_H,
};

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
  const rand = mulberry32(20261108);
  return Array.from({ length: 50 }, () => ({
    x: rand() * 3840,
    y: rand() * 2160,
    size: 4 + rand() * 9,
    cycles: 2 + Math.floor(rand() * 3),
    phase: rand() * TAU,
  }));
})();

const CONFETTI_COLORS = ["#ffd769", "#fb493a", "#fef3e2", "#ffc036", "#f93d2f"];

const CONFETTI = (() => {
  const rand = mulberry32(20261108 + 7);
  return Array.from({ length: 60 }, (_, i) => ({
    x: rand() * 3840,
    y: rand() * 2160,
    w: 10 + rand() * 12,
    h: 7 + rand() * 9,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    opacity: 0.55 + rand() * 0.45,
    fallLoops: rand() > 0.5 ? 2 : 1,
    swayCycles: 1 + Math.floor(rand() * 3),
    swayAmp: 20 + rand() * 50,
    spinCycles: 1 + Math.floor(rand() * 2),
    phase: rand() * TAU,
  }));
})();

export const HeroBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = frame / LOOP_FRAMES;
  return (
    <>
      {/* Glow emas di belakang ikon */}
      <div
        style={{
          position: "absolute",
          left: 1920 - 1100,
          top: 1080 - 1100,
          width: 2200,
          height: 2200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,192,54,0.28) 0%, rgba(255,192,54,0.08) 45%, rgba(255,192,54,0) 70%)",
        }}
      />
      {/* Bintang / sparkle background */}
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
            background: "#ffd769",
            opacity:
              0.25 +
              0.6 * (0.5 + 0.5 * Math.sin(progress * s.cycles * TAU + s.phase)),
          }}
        />
      ))}
    </>
  );
};

/** Bayangan lembut di bawah ikon, berdenyut berlawanan dengan bob ikon. */
export const HeroShadow: React.FC<{ bob: number }> = ({ bob }) => (
  <div
    style={{
      position: "absolute",
      left: 1920 - 450,
      top: 1880,
      width: 900,
      height: 80,
      borderRadius: "50%",
      background: "rgba(0,0,0,0.30)",
      transform: `scale(${1 - bob * 0.004})`,
      transformOrigin: "50% 50%",
    }}
  />
);

/** Confetti emas/merah jatuh di depan ikon, reuse logika Snowfall. */
export const Confetti: React.FC = () => {
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
      {CONFETTI.map((c, i) => {
        const y = (c.y + progress * c.fallLoops * 2160) % 2160;
        const x =
          c.x +
          Math.sin(progress * c.swayCycles * TAU + c.phase) * c.swayAmp;
        const rot = progress * c.spinCycles * 360 + c.phase * 57.3;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: c.w,
              height: c.h,
              borderRadius: 3,
              background: c.color,
              opacity: c.opacity,
              transform: `rotate(${rot}deg)`,
            }}
          />
        );
      })}
    </div>
  );
};

export const heroBackgroundStyle: React.CSSProperties = {
  background: "linear-gradient(180deg, #0f1e3d 0%, #16294d 55%, #1e2f5e 100%)",
  overflow: "hidden",
  fontFamily: "sans-serif",
};
