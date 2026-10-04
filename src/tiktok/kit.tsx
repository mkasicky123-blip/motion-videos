import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { fontFamily } from "../theme";

// TikTok covers the right edge (action buttons) and the bottom ~20% (caption, music bar),
// so every key line of text lives inside this box.
export const SAFE = { left: 60, right: 900, top: 220, bottom: 1500 };
export const TEXT_W = SAFE.right - SAFE.left;
export const MID_X = (SAFE.left + SAFE.right) / 2;

export const YELLOW = "#FFD43B";
export const GREEN = "#3DDC84";
export const RED = "#FF3B30";

// Product photos are 2014x2227.
export const CARD_RATIO = 2227 / 2014;
// Where the NFC tap icon sits on the card photos, as a fraction of width / height.
export const NFC_SPOT = { x: 0.33, y: 0.7 };

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// A decaying wobble, for impacts.
export const shake = (f: number, at: number, amp: number, dur = 12) => {
  if (f < at || f > at + dur) return 0;
  const k = 1 - (f - at) / dur;
  return Math.sin((f - at) * 2.6) * amp * k;
};

// Classic TikTok caption look: heavy white type with a fat black outline.
export const outline = (size: number): React.CSSProperties => ({
  fontFamily,
  fontSize: size,
  fontWeight: 900,
  lineHeight: 1.08,
  letterSpacing: -size * 0.02,
  color: "white",
  WebkitTextStroke: `${size * 0.2}px black`,
  paintOrder: "stroke fill",
  textShadow: `0 ${size * 0.07}px 0 rgba(0,0,0,0.85)`,
});

export const Hi: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = YELLOW }) => (
  <span style={{ color }}>{children}</span>
);

export const TikText: React.FC<{
  top: number;
  size: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ top, size, children, style }) => (
  <div style={{ position: "absolute", left: SAFE.left, width: TEXT_W, top, textAlign: "center", ...outline(size), ...style }}>
    {children}
  </div>
);

// A caption that punches in at `at` (big -> settle with overshoot) and pops out at `until`.
export const Caption: React.FC<{
  f: number;
  at: number;
  until?: number;
  top?: number;
  size?: number;
  tilt?: number;
  children: React.ReactNode;
}> = ({ f, at, until = Infinity, top = 260, size = 104, tilt = -4, children }) => {
  const { fps } = useVideoConfig();
  if (f < at || f >= until + 5) return null;
  const p = spring({ frame: f - at, fps, config: { damping: 10, stiffness: 260 } });
  const out = interpolate(f, [until, until + 5], [0, 1], clamp);
  return (
    <TikText
      top={top}
      size={size}
      style={{
        scale: `${interpolate(p, [0, 1], [1.7, 1]) * (1 - out * 0.4)}`,
        rotate: `${tilt * (1 - p)}deg`,
        opacity: Math.min(1, p * 4) * (1 - out),
        transformOrigin: "50% 40%",
      }}
    >
      {children}
    </TikText>
  );
};

// Dark backdrop with two slow glows. Motion is periodic over the whole video so the loop point is invisible.
export const TikBg: React.FC<{ f: number; total: number; a: string; b: string }> = ({ f, total, a, b }) => {
  const ph = (f / total) * Math.PI * 2;
  return (
    <AbsoluteFill style={{ background: "#0B0B10", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1500,
          height: 1500,
          left: -420 + Math.sin(ph) * 120,
          top: 80 + Math.cos(ph) * 90,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${a}66 0%, ${a}22 38%, transparent 66%)`,
          filter: "blur(30px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          right: -560 + Math.cos(ph) * 120,
          top: 900 + Math.sin(ph) * 100,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${b}55 0%, transparent 64%)`,
          filter: "blur(30px)",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.6) 100%)" }} />
    </AbsoluteFill>
  );
};

// A wooden counter top for the card to stand on. `show` 0..1 slides it up from the bottom.
export const Counter: React.FC<{ top: number; show: number }> = ({ top, show }) => (
  <div
    style={{
      position: "absolute",
      left: -40,
      right: -40,
      top: top + (1 - show) * 700,
      bottom: -700,
      background: "linear-gradient(180deg, #8A5A36 0%, #5E3B22 6%, #3A2414 45%, #1A0F08 100%)",
      borderTop: "6px solid #B07A4E",
      boxShadow: "0 -20px 60px rgba(0,0,0,0.5)",
    }}
  />
);
