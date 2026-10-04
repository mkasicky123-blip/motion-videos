import { Img, interpolate, spring, staticFile, useVideoConfig } from "remotion";
import { Check, Star } from "../components/Icons";
import { Phone } from "../components/Phone";
import { fontFamily } from "../theme";
import { clamp, GREEN, MID_X, outline, RED, YELLOW } from "./kit";

// Row of 5 stars filled to `rating` (0..5).
export const Stars: React.FC<{ rating: number; size: number; gap?: number }> = ({ rating, size, gap = 4 }) => (
  <div style={{ position: "relative", display: "flex", gap }}>
    {[0, 1, 2, 3, 4].map((i) => (
      <Star key={i} size={size} fill="#D5D8DF" />
    ))}
    <div style={{ position: "absolute", inset: 0, display: "flex", gap, overflow: "hidden", width: `${(rating / 5) * 100}%` }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{ flexShrink: 0 }}>
          <Star size={size} fill={YELLOW} />
        </div>
      ))}
    </div>
  </div>
);

// A generic business listing: name, star rating and a big review count.
export const ReviewCard: React.FC<{ count: number; rating: number; hot?: number; style?: React.CSSProperties }> = ({
  count,
  rating,
  hot = 0,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      left: MID_X - 360,
      width: 720,
      borderRadius: 48,
      background: "white",
      padding: "40px 48px 44px",
      fontFamily,
      color: "#1C1F2A",
      boxShadow: `0 40px 100px rgba(0,0,0,0.55), 0 0 ${80 * hot}px ${GREEN}`,
      ...style,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
      <div
        style={{
          width: 84,
          height: 84,
          borderRadius: 42,
          background: "linear-gradient(135deg, #C7834A, #7A4523)",
          color: "white",
          fontSize: 44,
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        C
      </div>
      <div>
        <div style={{ fontSize: 44, fontWeight: 800 }}>Your Café</div>
        <div style={{ fontSize: 28, fontWeight: 500, color: "#7A7F8E" }}>Coffee shop</div>
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 30 }}>
      <div style={{ fontSize: 64, fontWeight: 900, color: rating >= 4.7 ? "#1E9E57" : "#1C1F2A" }}>{rating.toFixed(1)}</div>
      <Stars rating={rating} size={58} />
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 6 }}>
      <div style={{ fontSize: 170, fontWeight: 900, letterSpacing: -6, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
        {Math.round(count)}
      </div>
      <div style={{ fontSize: 48, fontWeight: 700, color: "#7A7F8E" }}>reviews</div>
    </div>
  </div>
);

// "+1 ★★★★★" pill that pops up and floats away.
export const Bubble: React.FC<{ f: number; at: number; x: number; y: number; label?: string }> = ({ f, at, x, y, label = "+1" }) => {
  const { fps } = useVideoConfig();
  if (f < at || f > at + 34) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 10, stiffness: 220 } });
  const fade = interpolate(f, [at + 22, at + 34], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y - (f - at) * 5,
        scale: `${s}`,
        opacity: fade,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 22px",
        borderRadius: 40,
        background: "white",
        boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
        fontFamily,
        fontWeight: 900,
        fontSize: 40,
        color: "#1E9E57",
      }}
    >
      {label}
      <Stars rating={5} size={34} gap={2} />
    </div>
  );
};

// Deterministic QR-looking grid with the three finder squares. Not a real code.
export const Qr: React.FC<{ size: number }> = ({ size }) => {
  const n = 25;
  const cells: React.ReactNode[] = [];
  const finder = (x: number, y: number) => x < 7 && y < 7;
  const inFinder = (x: number, y: number) => finder(x, y) || finder(n - 1 - x, y) || finder(x, n - 1 - y);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (inFinder(x, y)) continue;
      const v = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      if (v - Math.floor(v) > 0.52) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} />);
    }
  }
  const eye = (x: number, y: number) => (
    <g key={`e${x}${y}`}>
      <rect x={x} y={y} width={7} height={7} />
      <rect x={x + 1} y={y + 1} width={5} height={5} fill="white" />
      <rect x={x + 2} y={y + 2} width={3} height={3} />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox={`-1 -1 ${n + 2} ${n + 2}`} style={{ background: "white", display: "block" }}>
      <g fill="#111">
        {cells}
        {eye(0, 0)}
        {eye(n - 7, 0)}
        {eye(0, n - 7)}
      </g>
    </svg>
  );
};

// A table tent with a QR code on it.
export const QrTent: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div
    style={{
      position: "absolute",
      width: 520,
      padding: "40px 40px 50px",
      borderRadius: 34,
      background: "#F4F1EA",
      boxShadow: "0 50px 90px rgba(0,0,0,0.6)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 26,
      fontFamily,
      ...style,
    }}
  >
    <div style={{ fontSize: 46, fontWeight: 900, color: "#222", letterSpacing: 2 }}>SCAN ME</div>
    <Qr size={400} />
    <div style={{ fontSize: 28, fontWeight: 600, color: "#666" }}>menu • reviews • wifi</div>
  </div>
);

// Two slashes forming a big red X. p1/p2 are 0..1 draw progress.
export const RedX: React.FC<{ size: number; p1: number; p2: number; style?: React.CSSProperties }> = ({ size, p1, p2, style }) => {
  const len = Math.SQRT2 * 100;
  const line = (d: string, p: number) => (
    <path d={d} stroke={RED} strokeWidth={14} strokeLinecap="round" fill="none" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
  );
  return (
    <svg width={size} height={size} viewBox="-10 -10 120 120" style={{ position: "absolute", filter: "drop-shadow(0 0 4px black) drop-shadow(0 10px 0 rgba(0,0,0,0.5))", ...style }}>
      {line("M0 0 L100 100", p1)}
      {line("M100 0 L0 100", p2)}
    </svg>
  );
};

// Big stopwatch readout.
export const Stopwatch: React.FC<{ seconds: number; color?: string; style?: React.CSSProperties }> = ({ seconds, color = "white", style }) => (
  <div style={{ position: "absolute", display: "flex", alignItems: "center", gap: 20, ...style }}>
    <svg width={110} height={110} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 3px black)" }}>
      <circle cx="12" cy="13.5" r="8" />
      <path d="M12 13.5 L12 9" transform={`rotate(${seconds * 36} 12 13.5)`} />
      <path d="M10 2.5h4M12 2.5v3" />
    </svg>
    <div style={{ ...outline(130), color, fontVariantNumeric: "tabular-nums" }}>0:{String(Math.floor(seconds)).padStart(2, "0")}</div>
  </div>
);

// Soft CTA: "link in bio" with a bouncing arrow and the brand underneath.
export const LinkInBio: React.FC<{ f: number; at: number; until: number; top?: number }> = ({ f, at, until, top = 520 }) => {
  const { fps } = useVideoConfig();
  if (f < at || f > until + 6) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 11, stiffness: 200 } });
  const out = interpolate(f, [until, until + 6], [0, 1], clamp);
  const bob = Math.sin((f - at) / 4) * 18;
  const logo = spring({ frame: f - at - 8, fps, config: { damping: 14 } });
  return (
    <div style={{ position: "absolute", left: MID_X - 420, width: 840, top, display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 - out, scale: `${interpolate(s, [0, 1], [1.6, 1]) * (1 - out * 0.3)}` }}>
      <div style={{ ...outline(118), textAlign: "center" }}>link in bio</div>
      <svg width={120} height={140} viewBox="0 0 24 28" style={{ marginTop: 10, translate: `0px ${bob}px`, filter: "drop-shadow(0 0 3px black) drop-shadow(0 6px 0 rgba(0,0,0,0.7))" }}>
        <path d="M12 2v20M4 15l8 8 8-8" stroke="white" strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <Img src={staticFile("taply-logo-dark.png")} style={{ width: 380, marginTop: 40, opacity: logo, translate: `0px ${(1 - logo) * 40}px` }} />
    </div>
  );
};

// Small pill label like "STEP 1".
export const Badge: React.FC<{ f: number; at: number; until: number; text: string; top: number; color?: string }> = ({ f, at, until, text, top, color = YELLOW }) => {
  const { fps } = useVideoConfig();
  if (f < at || f > until + 5) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 12, stiffness: 240 } });
  const out = interpolate(f, [until, until + 5], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: MID_X,
        translate: "-50% 0px",
        scale: `${s * (1 - out)}`,
        padding: "12px 34px",
        borderRadius: 40,
        background: color,
        border: "5px solid black",
        fontFamily,
        fontWeight: 900,
        fontSize: 50,
        color: "black",
        letterSpacing: 2,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

// Phone showing a review being written: stars fill, text types, Post -> Posted.
export const ReviewPhone: React.FC<{ f: number; at: number; style?: React.CSSProperties }> = ({ f, at, style }) => {
  const { fps } = useVideoConfig();
  const text = "Best flat white in town!";
  const typed = Math.floor(interpolate(f, [at + 26, at + 46], [0, text.length], clamp));
  const posted = spring({ frame: f - at - 52, fps, config: { damping: 11 } });
  return (
    <Phone style={style}>
      <div style={{ position: "absolute", inset: 0, background: "white", padding: "110px 36px 40px", display: "flex", flexDirection: "column", alignItems: "center", fontFamily, color: "#1C1F2A" }}>
        <div style={{ fontSize: 40, fontWeight: 800 }}>Your Café</div>
        <div style={{ fontSize: 26, color: "#7A7F8E", marginTop: 6 }}>Rate your visit</div>
        <div style={{ display: "flex", gap: 6, marginTop: 46 }}>
          {[0, 1, 2, 3, 4].map((i) => {
            const s = spring({ frame: f - at - 6 - i * 4, fps, config: { damping: 9, stiffness: 220 } });
            return (
              <div key={i} style={{ position: "relative" }}>
                <Star size={76} fill="#D5D8DF" />
                <div style={{ position: "absolute", inset: 0, scale: `${s}` }}>
                  <Star size={76} fill={YELLOW} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 46, width: "100%", minHeight: 170, borderRadius: 24, border: "2px solid #E3E6EC", padding: 24, fontSize: 30, color: typed ? "#1C1F2A" : "#A4A9B6" }}>
          {typed ? text.slice(0, typed) : "Share your experience…"}
        </div>
        <div
          style={{
            marginTop: "auto",
            width: "100%",
            height: 100,
            borderRadius: 50,
            background: posted > 0.01 ? "#1E9E57" : "#4285F4",
            color: "white",
            fontSize: 36,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          {posted > 0.01 ? (
            <>
              <div style={{ scale: `${posted}`, display: "flex" }}>
                <Check size={46} color="white" />
              </div>
              Posted
            </>
          ) : (
            "Post"
          )}
        </div>
      </div>
    </Phone>
  );
};

// iOS-style notification pill.
export const Notif: React.FC<{ f: number; at: number; top: number; name: string }> = ({ f, at, top, name }) => {
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 14, stiffness: 200 } });
  return (
    <div
      style={{
        position: "absolute",
        left: MID_X - 380,
        width: 760,
        top: top - (1 - s) * 160,
        opacity: s,
        borderRadius: 36,
        background: "rgba(245,246,250,0.96)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        padding: "22px 28px",
        display: "flex",
        alignItems: "center",
        gap: 22,
        fontFamily,
        color: "#1C1F2A",
      }}
    >
      <div style={{ width: 76, height: 76, borderRadius: 20, background: "#1C1F2A", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Star size={52} fill={YELLOW} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, fontWeight: 800 }}>
          New 5-star review <span style={{ fontWeight: 500, color: "#8A8F9C", fontSize: 26 }}>now</span>
        </div>
        <div style={{ fontSize: 28, color: "#555B6B", marginTop: 4 }}>{name} left Your Café 5 stars</div>
      </div>
    </div>
  );
};
