import { interpolate, spring, useVideoConfig } from "remotion";
import { Star } from "../components/Icons";
import { Phone } from "../components/Phone";
import { clamp, easeOut, YELLOW } from "./kit";

const RINGS = ["#4285F4", "#34A853", "#FBBC05", "#EA4335"];
const PHONE_SCALE = 0.6;

// The satisfying moment: phone swoops in, taps the card at `tap`, rings ripple out,
// five stars burst from the contact point and land in a row at `row`.
export const TapBurst: React.FC<{
  f: number;
  tap: number;
  contact: { x: number; y: number };
  row: { x: number; y: number };
  until: number;
}> = ({ f, tap, contact, row, until }) => {
  const { fps } = useVideoConfig();
  if (f < tap - 22 || f >= until + 6) return null;

  const approach = spring({ frame: f - (tap - 22), fps, config: { damping: 18, stiffness: 150 }, durationInFrames: 22 });
  const press = interpolate(f, [tap - 3, tap, tap + 6], [0, 1, 0], clamp);
  const leave = interpolate(f, [tap + 12, tap + 30], [0, 1], { ...clamp, easing: (t) => t * t });
  const out = interpolate(f, [until, until + 6], [0, 1], clamp);

  // Phone hangs from its top-left corner region so its lower body covers the tap spot.
  const px = contact.x - 60 + (1 - approach) * 800 + leave * 900;
  const py = contact.y - 470 - (1 - approach) * 1600 + press * 26 + leave * 500;
  const rot = interpolate(approach, [0, 1], [32, -8]) - leave * 20;

  return (
    <>
      {/* rings */}
      {RINGS.map((c, i) => {
        const t = interpolate(f, [tap + i * 4, tap + i * 4 + 30], [0, 1], { ...clamp, easing: easeOut });
        const size = interpolate(t, [0, 1], [50, 1300]);
        return (
          <div
            key={c}
            style={{
              position: "absolute",
              left: contact.x - size / 2,
              top: contact.y - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              border: `${interpolate(t, [0, 1], [18, 3])}px solid ${c}`,
              boxShadow: `0 0 40px ${c}, inset 0 0 30px ${c}88`,
              opacity: t > 0 && t < 1 ? interpolate(t, [0, 0.1, 1], [0, 1, 0]) : 0,
            }}
          />
        );
      })}
      {/* flash */}
      <div
        style={{
          position: "absolute",
          left: contact.x - 420,
          top: contact.y - 420,
          width: 840,
          height: 840,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(170,210,255,0.5) 28%, transparent 62%)",
          opacity: interpolate(f, [tap - 1, tap + 1, tap + 12], [0, 1, 0], clamp),
        }}
      />

      {leave < 1 && (
        <Phone
          style={{
            left: px - 250,
            top: py,
            rotate: `${rot}deg`,
            scale: `${PHONE_SCALE * (1 - press * 0.04)}`,
            transformOrigin: "50% 0%",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "white",
              opacity: interpolate(f, [tap, tap + 4], [0, 1], clamp),
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 6,
            }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} size={70} fill={f > tap + 2 + i * 2 ? YELLOW : "#D9DCE3"} />
            ))}
          </div>
        </Phone>
      )}

      {/* sparks */}
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2 + 0.3;
        const t = interpolate(f, [tap + 1, tap + 22], [0, 1], { ...clamp, easing: easeOut });
        const d = t * (220 + (i % 3) * 90);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: contact.x + Math.cos(a) * d - 7,
              top: contact.y + Math.sin(a) * d - 7,
              width: 14,
              height: 14,
              borderRadius: 7,
              background: i % 2 ? YELLOW : "white",
              boxShadow: `0 0 16px ${YELLOW}`,
              opacity: t > 0 && t < 1 ? 1 - t : 0,
            }}
          />
        );
      })}

      {/* five stars: burst out of the card, land in a row */}
      {[0, 1, 2, 3, 4].map((i) => {
        const s = spring({ frame: f - tap - 2 - i * 2, fps, config: { damping: 12, stiffness: 120 } });
        const tx = row.x + (i - 2) * 150;
        const ty = row.y + Math.abs(i - 2) * 22;
        const arc = Math.sin(Math.min(1, s) * Math.PI) * 160;
        const pop = interpolate(f, [tap + 22 + i * 3, tap + 26 + i * 3, tap + 32 + i * 3], [1, 1.35, 1], clamp);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: interpolate(s, [0, 1], [contact.x, tx]) - 65,
              top: interpolate(s, [0, 1], [contact.y, ty]) - arc - 65,
              scale: `${Math.max(0, s) * pop * (1 - out)}`,
              rotate: `${(1 - s) * 300}deg`,
              filter: `drop-shadow(0 0 22px ${YELLOW}) drop-shadow(0 8px 0 rgba(0,0,0,0.6))`,
              opacity: f >= tap + 2 + i * 2 ? 1 : 0,
            }}
          >
            <Star size={130} fill={YELLOW} stroke="black" strokeWidth={1.2} />
          </div>
        );
      })}
    </>
  );
};
