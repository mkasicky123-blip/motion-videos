import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { w, Words } from "../components/Words";
import { colors, fontFamily } from "../theme";

const CARDS = [
  { file: "google-review", label: "Google Review", color: colors.blue },
  { file: "instagram", label: "Instagram", color: "#E1306C" },
  { file: "facebook", label: "Facebook", color: "#1877F2" },
  { file: "tiktok", label: "TikTok", color: "#25F4EE" },
  { file: "all-in-one", label: "All-in-One", color: colors.green },
];
const FIRST = 22;
const STEP = 19;

export const Cards: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Carousel position: steps from card 0 to card 4, each step a spring.
  let pos = 0;
  for (let i = 1; i < CARDS.length; i++) {
    pos += spring({ frame: frame - FIRST - (i - 1) * STEP, fps, config: { damping: 15, stiffness: 140 } });
  }
  const enter = spring({ frame, fps, config: { damping: 14 } });
  const active = Math.round(pos);

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: 230, width: "100%" }}>
        <Words words={[...w("5 designs."), ...w("Pick yours.", colors.yellow)]} delay={2} fontSize={100} weight={900} />
      </div>

      <AbsoluteFill style={{ perspective: 1800 }}>
        {CARDS.map((c, i) => {
          const d = i - pos;
          const ad = Math.abs(d);
          return (
            <Img
              key={c.file}
              src={staticFile(`${c.file}.png`)}
              style={{
                position: "absolute",
                width: 820,
                left: 130,
                top: 620,
                translate: `${d * 560}px ${ad * 40 + (1 - enter) * 600}px`,
                scale: `${interpolate(ad, [0, 1, 2], [1, 0.7, 0.5], { extrapolateRight: "clamp" })}`,
                rotate: `y ${-d * 32}deg`,
                opacity: interpolate(ad, [0, 1, 2], [1, 0.55, 0], { extrapolateRight: "clamp" }) * enter,
                zIndex: 10 - Math.round(ad * 2),
                filter: `blur(${Math.min(ad, 1.5) * 4}px)`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Label of the card in focus */}
      <div style={{ position: "absolute", top: 1500, width: "100%", display: "flex", justifyContent: "center" }}>
        {CARDS.map((c, i) => {
          const vis = interpolate(Math.abs(i - pos), [0, 0.35], [1, 0], { extrapolateRight: "clamp" });
          return (
            <div
              key={c.file}
              style={{
                position: "absolute",
                opacity: vis * enter,
                scale: `${0.85 + vis * 0.15}`,
                padding: "22px 54px",
                borderRadius: 60,
                background: `${c.color}26`,
                border: `3px solid ${c.color}`,
                color: "white",
                fontSize: 60,
                fontWeight: 800,
                whiteSpace: "nowrap",
              }}
            >
              {c.label}
            </div>
          );
        })}
      </div>
      {/* Progress dots */}
      <div style={{ position: "absolute", top: 1680, width: "100%", display: "flex", justifyContent: "center", gap: 18 }}>
        {CARDS.map((c, i) => (
          <div
            key={c.file}
            style={{
              width: i === active ? 56 : 18,
              height: 18,
              borderRadius: 9,
              background: i === active ? c.color : "#3A3E4A",
              opacity: enter,
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
