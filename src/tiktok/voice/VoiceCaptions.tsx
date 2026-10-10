import { loadFont } from "@remotion/fonts";
import { interpolate, spring, staticFile, useVideoConfig } from "remotion";
import { clamp, MID_X } from "../kit";
import type { Timeline } from "./timing";

// TikTok's own typeface (OFL), bundled so renders work offline.
export const tiktokSans = "TikTok Sans";
for (const weight of ["700", "800", "900"]) {
  loadFont({ family: tiktokSans, url: staticFile(`fonts/tiktok-sans-latin-${weight}-normal.woff2`), weight });
}

const MAX_WORDS = 3;
const TOP = 1240;
const SIZE = 80;

type Chunk = { from: number; to: number; words: { text: string; at: number }[] };

// Group words into short on-screen phrases: break after punctuation or every MAX_WORDS words.
const chunk = (tl: Timeline, until: number): Chunk[] => {
  const out: Chunk[] = [];
  let cur: Chunk | null = null;
  tl.words.forEach((w, i) => {
    if (i >= until) return;
    if (!cur) {
      cur = { from: tl.w(i), to: 0, words: [] };
      out.push(cur);
    }
    cur.words.push({ text: w.text, at: tl.w(i) });
    cur.to = tl.wEnd(i) + 8;
    if (/[.,?!]$/.test(w.text) || cur.words.length === MAX_WORDS) cur = null;
  });
  // A phrase stays up until the next one replaces it, unless there is a real pause.
  out.forEach((c, i) => {
    const next = out[i + 1];
    if (next && next.from - c.to < 10) c.to = next.from;
  });
  return out;
};

const clean = (t: string) => t.toLowerCase().replace(/[.,!]$/, "");

// Word-by-word captions: lowercase TikTok Sans like the native "pov" text in the references,
// with the word being spoken right now on a white pill (TikTok's text-background style).
export const VoiceCaptions: React.FC<{ f: number; tl: Timeline; until: number }> = ({ f, tl, until }) => {
  const { fps } = useVideoConfig();
  const c = chunk(tl, until).find((x) => f >= x.from && f < x.to);
  if (!c) return null;
  const pop = spring({ frame: f - c.from, fps, config: { damping: 14, stiffness: 320 } });
  const out = interpolate(f, [c.to - 3, c.to], [1, 0], clamp);
  let active = -1;
  c.words.forEach((w, i) => {
    if (f >= w.at) active = i;
  });
  return (
    <div
      style={{
        position: "absolute",
        left: MID_X - 430,
        width: 860,
        top: TOP,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "6px 10px",
        fontFamily: tiktokSans,
        fontWeight: 800,
        fontSize: SIZE,
        lineHeight: 1.12,
        letterSpacing: -1,
        scale: `${interpolate(pop, [0, 1], [0.86, 1])}`,
        opacity: Math.min(1, pop * 3) * out,
      }}
    >
      {c.words.map((w, i) => {
        const on = i === active;
        const seen = f >= w.at;
        const hit = spring({ frame: f - w.at, fps, config: { damping: 12, stiffness: 400 } });
        return (
          <span
            key={i}
            style={{
              padding: "2px 18px 8px",
              borderRadius: 18,
              background: on ? `rgba(255,255,255,${Math.min(1, hit * 1.4)})` : "transparent",
              color: on ? "#111" : "white",
              opacity: seen ? 1 : 0.55,
              scale: on ? `${interpolate(hit, [0, 1], [0.9, 1.04])}` : "1",
              textShadow: on ? "none" : "0 3px 10px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.9)",
              boxShadow: on ? "0 8px 24px rgba(0,0,0,0.35)" : "none",
            }}
          >
            {clean(w.text)}
          </span>
        );
      })}
    </div>
  );
};
