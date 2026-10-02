import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { colors, SCENE_STARTS, TRANSITION } from "../theme";

const glow = [colors.red, colors.blue, colors.green, colors.blue, colors.yellow, colors.blue];

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const color = interpolateColors(frame, SCENE_STARTS.map((s) => s + TRANSITION), glow);
  const drift = Math.sin(frame / 40) * 60;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1600,
          height: 1600,
          left: -260 + drift,
          top: 160 - drift / 2,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}55 0%, ${color}18 35%, transparent 65%)`,
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          right: -500 - drift,
          bottom: -380,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.blue}30 0%, transparent 65%)`,
          filter: "blur(40px)",
          opacity: interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" }),
        }}
      />
      {/* subtle vignette */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
