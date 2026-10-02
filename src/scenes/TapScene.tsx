import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Check, Star } from "../components/Icons";
import { Phone } from "../components/Phone";
import { w, Words } from "../components/Words";
import { colors, fontFamily } from "../theme";

const TAP = 46; // frame the phone touches the card
const CONTACT = { x: 600, y: 1210 };
const RING_COLORS = [colors.blue, colors.green, colors.yellow, colors.red];
const REVIEW_TEXT = "Amazing coffee, lovely staff!";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const TapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardIn = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const approach = spring({ frame: frame - 6, fps, config: { damping: 16, stiffness: 90 }, durationInFrames: 38 });
  // Quick press-and-release at the moment of contact.
  const press = interpolate(frame, [TAP - 4, TAP, TAP + 8], [0, 1, 0], {
    ...clamp,
    easing: (t) => Math.sin(t * Math.PI / 2),
  });
  const lift = spring({ frame: frame - TAP - 14, fps, config: { damping: 15, stiffness: 100 } });
  const pageIn = spring({ frame: frame - TAP - 6, fps, config: { damping: 16, stiffness: 140 } });

  const phoneTop = interpolate(approach, [0, 1], [-1150, 230]) + press * 34;
  const phoneTopFinal = interpolate(lift, [0, 1], [phoneTop, 520]);
  const rotate = interpolate(lift, [0, 1], [interpolate(approach, [0, 1], [26, 12]), 0]);
  const phoneScale = interpolate(lift, [0, 1], [0.86 - press * 0.03, 1.12]);

  const typed = Math.floor(interpolate(frame, [112, 138], [0, REVIEW_TEXT.length], clamp));
  const postPress = interpolate(frame, [140, 144, 150], [1, 0.92, 1], clamp);
  const done = spring({ frame: frame - 146, fps, config: { damping: 11 } });

  return (
    <AbsoluteFill style={{ fontFamily }}>
      {/* Caption: before and after the tap */}
      <div style={{ position: "absolute", top: 150, width: "100%", opacity: interpolate(frame, [TAP + 4, TAP + 12], [1, 0], clamp) }}>
        <Words words={[...w("Just"), ...w("tap.", colors.blue)]} delay={4} fontSize={130} weight={900} />
      </div>
      <div style={{ position: "absolute", top: 120, width: "100%" }}>
        <Words
          words={[...w("Review page."), ...w("Instantly.", colors.green)]}
          delay={TAP + 14}
          fontSize={92}
          weight={900}
          style={{ padding: "0 60px" }}
        />
      </div>

      {/* The product card on the counter */}
      <Img
        src={staticFile("cutouts/google-review.png")}
        style={{
          position: "absolute",
          width: 840,
          left: 120,
          top: 990,
          scale: `${interpolate(cardIn, [0, 1], [0.7, 1]) * (1 + press * 0.02)}`,
          opacity: cardIn * interpolate(lift, [0, 1], [1, 0]),
          translate: `0px ${interpolate(cardIn, [0, 1], [300, 0]) + lift * 420}px`,
          filter: `blur(${lift * 8}px)`,
        }}
      />

      {/* NFC ripple rings from the contact point */}
      {RING_COLORS.map((c, i) => {
        const t = interpolate(frame, [TAP + i * 5, TAP + i * 5 + 34], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
        const size = interpolate(t, [0, 1], [60, 1250]);
        return (
          <div
            key={c}
            style={{
              position: "absolute",
              left: CONTACT.x - size / 2,
              top: CONTACT.y - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              border: `${interpolate(t, [0, 1], [16, 3])}px solid ${c}`,
              boxShadow: `0 0 40px ${c}`,
              opacity: t > 0 && t < 1 ? interpolate(t, [0, 0.15, 1], [0, 1, 0]) : 0,
            }}
          />
        );
      })}
      {/* Flash */}
      <div
        style={{
          position: "absolute",
          left: CONTACT.x - 450,
          top: CONTACT.y - 450,
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(160,200,255,0.4) 30%, transparent 65%)",
          opacity: interpolate(frame, [TAP - 1, TAP + 2, TAP + 14], [0, 1, 0], clamp),
        }}
      />

      <Phone
        style={{
          left: interpolate(lift, [0, 1], [370, 290]),
          top: phoneTopFinal,
          rotate: `${rotate}deg`,
          scale: `${phoneScale}`,
          transformOrigin: "50% 80%",
        }}
      >
        {/* Lock screen */}
        <div style={{ position: "absolute", top: 150, width: "100%", textAlign: "center", color: "white" }}>
          <div style={{ fontSize: 30, fontWeight: 500, opacity: 0.7 }}>Friday, 2 October</div>
          <div style={{ fontSize: 150, fontWeight: 700, letterSpacing: -4 }}>9:41</div>
        </div>
        {/* Review page */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#FFFFFF",
            translate: `0px ${interpolate(pageIn, [0, 1], [1000, 0])}px`,
            padding: "100px 40px 40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#1F2330",
          }}
        >
          <div style={{ fontSize: 22, color: "#6B7080", background: "#F1F3F6", borderRadius: 20, padding: "8px 22px", marginBottom: 46 }}>
            Write a review
          </div>
          <div
            style={{
              width: 128,
              height: 128,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${colors.yellow}, ${colors.red})`,
              color: "white",
              fontSize: 64,
              fontWeight: 800,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            A
          </div>
          <div style={{ fontSize: 44, fontWeight: 800, marginTop: 22 }}>Café Aurora</div>
          <div style={{ fontSize: 24, color: "#6B7080", marginTop: 6 }}>Rate your visit</div>
          <div style={{ display: "flex", gap: 8, marginTop: 40 }}>
            {[0, 1, 2, 3, 4].map((i) => {
              const s = spring({ frame: frame - 78 - i * 6, fps, config: { damping: 8, stiffness: 180 } });
              const filled = s > 0.02;
              return (
                <div key={i} style={{ position: "relative", width: 76, height: 76 }}>
                  <div style={{ position: "absolute" }}>
                    <Star size={76} fill="transparent" stroke="#C9CDD6" strokeWidth={1.3} />
                  </div>
                  {filled && (
                    <div style={{ position: "absolute", scale: `${s}` }}>
                      <Star size={76} fill={colors.yellow} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div
            style={{
              marginTop: 44,
              width: "100%",
              height: 190,
              borderRadius: 24,
              border: "2px solid #E3E6EC",
              padding: 24,
              fontSize: 28,
              color: typed ? "#1F2330" : "#A4A9B6",
              lineHeight: 1.35,
            }}
          >
            {typed ? REVIEW_TEXT.slice(0, typed) : "Share your experience…"}
            {typed > 0 && typed < REVIEW_TEXT.length && <span style={{ color: colors.blue }}>|</span>}
          </div>
          <div
            style={{
              marginTop: "auto",
              width: "100%",
              height: 96,
              borderRadius: 48,
              background: done > 0.01 ? colors.green : colors.blue,
              color: "white",
              fontSize: 34,
              fontWeight: 700,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
              scale: `${postPress}`,
            }}
          >
            {done > 0.01 ? (
              <>
                <div style={{ scale: `${done}`, display: "flex" }}>
                  <Check size={44} color="white" />
                </div>
                Posted
              </>
            ) : (
              "Post"
            )}
          </div>
        </div>
      </Phone>
    </AbsoluteFill>
  );
};
