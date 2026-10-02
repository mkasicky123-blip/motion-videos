import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fontFamily } from "../theme";

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  angle: (i / 18) * Math.PI * 2 + (i % 3) * 0.2,
  dist: 380 + (i % 4) * 70,
  color: [colors.blue, colors.red, colors.yellow, colors.green][i % 4],
}));
const LAND = 20;

export const Price: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = spring({ frame, fps, config: { damping: 14 } });
  const count = interpolate(frame, [2, LAND], [0, 0.56], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const punch = spring({ frame: frame - LAND, fps, config: { damping: 7, stiffness: 220 } });
  const burst = interpolate(frame, [LAND, LAND + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 2) });
  const per = spring({ frame: frame - LAND - 4, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center" }}>
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 540 + Math.cos(p.angle) * p.dist * burst - 12,
            top: 960 + Math.sin(p.angle) * p.dist * burst - 12,
            width: 24,
            height: 24,
            borderRadius: i % 2 ? "50%" : 6,
            background: p.color,
            opacity: burst > 0 && burst < 1 ? 1 - burst : 0,
            rotate: `${burst * 180}deg`,
          }}
        />
      ))}
      <div style={{ fontSize: 80, fontWeight: 700, color: colors.muted, opacity: intro, translate: `0px ${(1 - intro) * 60}px` }}>From</div>
      <div
        style={{
          fontSize: 300,
          fontWeight: 900,
          letterSpacing: -12,
          color: "white",
          lineHeight: 1,
          scale: `${intro * (1 + (frame >= LAND ? (1 - punch) * 0.25 : 0))}`,
          textShadow: `0 0 ${60 * punch}px ${colors.yellow}AA`,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        €<span style={{ color: frame >= LAND ? colors.yellow : "white" }}>{count.toFixed(2)}</span>
      </div>
      <div style={{ fontSize: 80, fontWeight: 800, color: "white", opacity: per, translate: `0px ${(1 - per) * 60}px` }}>
        per card
      </div>
    </AbsoluteFill>
  );
};
