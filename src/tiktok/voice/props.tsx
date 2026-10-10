import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { Heart, Star } from "../../components/Icons";
import { Phone } from "../../components/Phone";
import { clamp, easeOut, MID_X, YELLOW } from "../kit";
import { tiktokSans } from "./VoiceCaptions";

// Warm, out-of-focus café at night: the kind of background an iPhone gives you behind a close subject.
const BOKEH = Array.from({ length: 16 }, (_, i) => {
  const r = (n: number) => {
    const v = Math.sin(i * 91.7 + n * 13.3) * 43758.5453;
    return v - Math.floor(v);
  };
  const warm = ["#FFB35A", "#FF8A3D", "#FFD9A0", "#FFC27A", "#9FC4FF"][Math.floor(r(1) * 5)];
  return { x: r(2) * 1180 - 50, y: r(3) * 1300 - 60, s: 90 + r(4) * 220, o: 0.18 + r(5) * 0.4, c: warm, sp: 0.3 + r(6) };
});

export const CafeBg: React.FC<{ f: number; dim?: number; tint?: string }> = ({ f, dim = 0, tint = "#2A1A10" }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${tint} 0%, #120B07 55%, #070504 100%)`, overflow: "hidden" }}>
    {BOKEH.map((b, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: b.x + Math.sin(f / 40 + i) * 20 * b.sp,
          top: b.y + Math.cos(f / 50 + i) * 14 * b.sp,
          width: b.s,
          height: b.s,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${b.c} 0%, ${b.c}aa 45%, transparent 70%)`,
          opacity: b.o * (1 - dim * 0.8),
          filter: "blur(14px)",
        }}
      />
    ))}
    <AbsoluteFill style={{ background: `rgba(0,0,0,${dim * 0.55})` }} />
  </AbsoluteFill>
);

// A wooden counter edge seen from slightly above.
export const Wood: React.FC<{ top: number }> = ({ top }) => (
  <div
    style={{
      position: "absolute",
      left: -200,
      right: -200,
      top,
      bottom: -600,
      background:
        "repeating-linear-gradient(92deg, rgba(0,0,0,0.0) 0px, rgba(0,0,0,0.08) 6px, rgba(0,0,0,0) 14px), linear-gradient(180deg, #9A6A43 0%, #6B4429 5%, #45291A 40%, #1C110A 100%)",
      borderTop: "5px solid #C08A5C",
      boxShadow: "0 -30px 80px rgba(0,0,0,0.55)",
    }}
  />
);

export const Cup: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div style={{ position: "absolute", width: 300, height: 260, ...style }}>
    <div style={{ position: "absolute", left: -40, right: -40, bottom: -10, height: 50, borderRadius: "50%", background: "#E9E4DC", boxShadow: "0 18px 30px rgba(0,0,0,0.5)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 10, top: 30, borderRadius: "10px 10px 120px 120px", background: "linear-gradient(90deg, #CFC8BD, #FBF8F2 40%, #D8D1C6)" }} />
    <div style={{ position: "absolute", right: -70, top: 70, width: 100, height: 100, borderRadius: "50%", border: "22px solid #E6E0D6" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 64, borderRadius: "50%", background: "radial-gradient(ellipse, #7A4A28 0%, #4A2A16 70%, #F4EFE7 72%)" }} />
  </div>
);

// Generic search screen: the query types itself, then results fly past without your café in them.
const RESULTS = ["Café Roma", "Bean There", "Daily Grind", "Brew & Co", "Corner Coffee", "The Roastery", "Morning Cup", "Latte Lab"];
export const SearchPhone: React.FC<{ f: number; typeFrom: number; typeTo: number; scrollFrom: number; style?: React.CSSProperties }> = ({
  f,
  typeFrom,
  typeTo,
  scrollFrom,
  style,
}) => {
  const q = "your café reviews";
  const n = Math.floor(interpolate(f, [typeFrom, typeTo], [0, q.length], clamp));
  const scroll = interpolate(f, [scrollFrom, scrollFrom + 22], [0, 1], { ...clamp, easing: easeOut }) * 900;
  return (
    <Phone style={style}>
      <div style={{ position: "absolute", inset: 0, background: "#F5F6F8", fontFamily: tiktokSans, color: "#1C1F2A" }}>
        <div style={{ position: "absolute", top: 100, left: 28, right: 28, height: 92, borderRadius: 46, background: "white", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", padding: "0 30px", gap: 18, fontSize: 34, fontWeight: 700 }}>
          <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#7A7F8E" strokeWidth={2.6} strokeLinecap="round">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="M15.5 15.5 L21 21" />
          </svg>
          <span>
            {q.slice(0, n)}
            <span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0, color: "#4A7DFF" }}>|</span>
          </span>
        </div>
        <div style={{ position: "absolute", top: 230, left: 28, right: 28, bottom: 0, overflow: "hidden" }}>
          <div style={{ translate: `0px ${-scroll}px`, opacity: f >= typeTo - 4 ? 1 : 0 }}>
            {RESULTS.map((r, i) => (
              <div key={r} style={{ height: 150, marginBottom: 18, borderRadius: 26, background: "white", display: "flex", alignItems: "center", gap: 22, padding: "0 24px" }}>
                <div style={{ width: 96, height: 96, borderRadius: 20, background: ["#C9A27E", "#8FA7C9", "#B7C99F", "#D6A3A3"][i % 4] }} />
                <div>
                  <div style={{ fontSize: 34, fontWeight: 800 }}>{r}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, fontSize: 26, color: "#7A7F8E", fontWeight: 700 }}>
                    <Star size={28} fill={YELLOW} /> {(4.1 + ((i * 7) % 8) / 10).toFixed(1)} · {200 + i * 137} reviews
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Phone>
  );
};

// A plain Android-style phone: light frame, punch-hole camera. Pairs with the iPhone-style Phone.
export const Android: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "absolute", width: 500, height: 1060, borderRadius: 46, background: "linear-gradient(145deg, #DADDE3, #9EA3AD)", padding: 14, boxShadow: "0 60px 120px rgba(0,0,0,0.6)", ...style }}>
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 36, overflow: "hidden", background: "#101318" }}>
      {children}
      <div style={{ position: "absolute", top: 24, left: "50%", translate: "-50% 0px", width: 30, height: 30, borderRadius: 15, background: "#000" }} />
    </div>
  </div>
);

// A phone that swoops in, touches `contact` at `tap`, and leaves. Rings ripple from the contact point.
export const MiniTap: React.FC<{
  f: number;
  tap: number;
  contact: { x: number; y: number };
  from?: "right" | "left";
  kind?: "iphone" | "android";
  ring?: string;
  scale?: number;
  stay?: boolean;
  screen?: React.ReactNode;
}> = ({ f, tap, contact, from = "right", kind = "iphone", ring = "white", scale = 0.55, stay = false, screen }) => {
  const { fps } = useVideoConfig();
  const sgn = from === "right" ? 1 : -1;
  const approach = spring({ frame: f - (tap - 14), fps, config: { damping: 18, stiffness: 190 }, durationInFrames: 14 });
  const press = interpolate(f, [tap - 2, tap, tap + 5], [0, 1, 0], clamp);
  const leave = stay ? 0 : interpolate(f, [tap + 12, tap + 26], [0, 1], { ...clamp, easing: (t) => t * t });
  const px = contact.x + sgn * (1 - approach) * 900 + sgn * leave * 900;
    // Phone frame is 1030 tall and scales about its centre; put its upper third on the contact point.
  const py = contact.y - (240 * scale) - (1030 * (1 - scale)) / 2 - (1 - approach) * 500 + press * 18;
  const rot = sgn * (interpolate(approach, [0, 1], [30, 8]) + leave * 20);
  const Body = kind === "iphone" ? Phone : Android;
  const lit = interpolate(f, [tap, tap + 4], [0, 1], clamp);
  return (
    <>
      {[0, 1, 2].map((i) => {
        const t = interpolate(f, [tap + i * 4, tap + i * 4 + 24], [0, 1], { ...clamp, easing: easeOut });
        const size = interpolate(t, [0, 1], [40, 900]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: contact.x - size / 2,
              top: contact.y - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              border: `${interpolate(t, [0, 1], [14, 2])}px solid ${ring}`,
              boxShadow: `0 0 30px ${ring}`,
              opacity: t > 0 && t < 1 ? interpolate(t, [0, 0.1, 1], [0, 0.9, 0]) : 0,
            }}
          />
        );
      })}
      {f >= tap - 14 && leave < 1 && (
        <Body style={{ left: px - 250, top: py, rotate: `${rot}deg`, scale: `${scale}`, transformOrigin: "50% 50%" }}>
          <div style={{ position: "absolute", inset: 0, opacity: lit }}>{screen}</div>
        </Body>
      )}
    </>
  );
};

// Social profile header with a follower count that climbs. Generic heart, no platform logo.
export const FollowCard: React.FC<{ count: number; followed: number; style?: React.CSSProperties }> = ({ count, followed, style }) => (
  <div style={{ position: "absolute", left: MID_X - 360, width: 720, borderRadius: 48, background: "white", padding: "40px 48px", fontFamily: tiktokSans, color: "#1C1F2A", boxShadow: "0 40px 100px rgba(0,0,0,0.55)", ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
      <div style={{ width: 120, height: 120, borderRadius: 60, padding: 6, background: "linear-gradient(45deg, #F9A13A, #E8407A, #9B4BE0)" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: "50%", border: "5px solid white", background: "linear-gradient(135deg, #C7834A, #7A4523)", color: "white", fontSize: 52, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>C</div>
      </div>
      <div>
        <div style={{ fontSize: 44, fontWeight: 900 }}>yourcafe</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontSize: 76, fontWeight: 900, fontVariantNumeric: "tabular-nums", letterSpacing: -2 }}>{Math.round(count).toLocaleString("en-US")}</span>
          <span style={{ fontSize: 34, fontWeight: 700, color: "#7A7F8E" }}>followers</span>
        </div>
      </div>
    </div>
    <div style={{ marginTop: 26, height: 84, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontSize: 36, fontWeight: 800, background: followed > 0.5 ? "#EEF0F4" : "#3D7BFF", color: followed > 0.5 ? "#1C1F2A" : "white" }}>
      {followed > 0.5 ? (
        <>
          <div style={{ scale: `${followed}`, display: "flex" }}>
            <Heart size={40} color="#FF3B5C" />
          </div>
          Following
        </>
      ) : (
        "Follow"
      )}
    </div>
  </div>
);

// Floating hearts for the followers beat.
export const Hearts: React.FC<{ f: number; from: number; x: number; y: number }> = ({ f, from, x, y }) => (
  <>
    {Array.from({ length: 9 }).map((_, i) => {
      const at = from + i * 3;
      if (f < at || f > at + 30) return null;
      const t = (f - at) / 30;
      return (
        <div key={i} style={{ position: "absolute", left: x + Math.sin(i * 2.1 + t * 5) * 70 + (i - 4) * 30, top: y - t * 520, opacity: 1 - t, scale: `${0.6 + (i % 3) * 0.25}` }}>
          <Heart size={80} color="#FF3B5C" />
        </div>
      );
    })}
  </>
);
