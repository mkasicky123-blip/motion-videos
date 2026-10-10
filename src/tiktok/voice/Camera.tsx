import { AbsoluteFill, interpolate } from "remotion";
import { clamp } from "../kit";

// Smooth pseudo-random wobble built from incommensurate sines, so it never visibly repeats.
const wob = (f: number, seed: number) =>
  Math.sin(f * 0.071 + seed) * 0.55 + Math.sin(f * 0.163 + seed * 2.3) * 0.3 + Math.sin(f * 0.37 + seed * 4.1) * 0.15;

// Handheld phone camera: constant drift plus a slow push-in, like the reference clips.
// `f` is frames since the shot started. `push` is extra scale per second; negative pulls out.
export const Handheld: React.FC<{
  f: number;
  push?: number;
  amp?: number;
  base?: number;
  origin?: string;
  extra?: { x?: number; y?: number; rot?: number; scale?: number };
  children: React.ReactNode;
}> = ({ f, push = 0.06, amp = 1, base = 1.06, origin = "50% 45%", extra = {}, children }) => {
  const x = wob(f, 1.7) * 14 * amp + (extra.x ?? 0);
  const y = wob(f, 4.2) * 18 * amp + (extra.y ?? 0);
  const rot = wob(f, 7.9) * 0.9 * amp + (extra.rot ?? 0);
  const s = (base + (push * f) / 30) * (extra.scale ?? 1);
  return (
    <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${s})`, transformOrigin: origin }}>
      {children}
    </AbsoluteFill>
  );
};

// A shot between two cuts. Enters and leaves with a whip pan: a fast slide with motion blur,
// so the cut itself is hidden inside the smear, like a phone being swung to the next subject.
export const Shot: React.FC<{
  f: number;
  from: number;
  to: number;
  dir?: 1 | -1;
  whipIn?: boolean;
  whipOut?: boolean;
  children: (local: number) => React.ReactNode;
}> = ({ f, from, to, dir = 1, whipIn = true, whipOut = true, children }) => {
  if (f < from || f >= to) return null;
  const local = f - from;
  const IN = 5;
  const OUT = 4;
  const e = whipIn ? interpolate(local, [0, IN], [1, 0], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2) }) : 0;
  const x = whipOut ? interpolate(f, [to - OUT, to], [0, 1], { ...clamp, easing: (t) => t * t }) : 0;
  const dx = e * 760 * dir - x * 760 * dir;
  const blur = (e + x) * 26;
  return (
    <AbsoluteFill style={{ overflow: "hidden", transform: `translateX(${dx}px)`, filter: blur > 0.5 ? `blur(${blur}px)` : undefined }}>
      {children(local)}
    </AbsoluteFill>
  );
};

// iPhone-ish finish on top of everything: a touch of contrast, grain that changes every frame, soft vignette.
export const Grade: React.FC<{ f: number }> = ({ f }) => (
  <>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 60% at 50% 45%, transparent 55%, rgba(0,0,0,0.42) 100%)" }} />
    <AbsoluteFill style={{ opacity: 0.09, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id={`grain${f}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 97} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain${f})`} />
      </svg>
    </AbsoluteFill>
  </>
);

// A bright diagonal band that slides across whatever PNG `mask` is, so only the card catches the light.
export const LightSweep: React.FC<{ f: number; at: number; dur?: number; mask: string; style?: React.CSSProperties }> = ({
  f,
  at,
  dur = 20,
  mask,
  style,
}) => {
  const t = interpolate(f, [at, at + dur], [-0.4, 1.4], clamp);
  if (f < at || f > at + dur) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        WebkitMaskImage: `url(${mask})`,
        WebkitMaskSize: "100% 100%",
        maskImage: `url(${mask})`,
        maskSize: "100% 100%",
        background: `linear-gradient(115deg, transparent ${t * 100 - 18}%, rgba(255,255,255,0.75) ${t * 100}%, transparent ${t * 100 + 18}%)`,
        mixBlendMode: "screen",
        ...style,
      }}
    />
  );
};
