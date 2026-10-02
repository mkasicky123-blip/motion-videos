import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LinkIcon, NfcWaves, NoApp, PhoneIcon } from "../components/Icons";
import { colors, fontFamily } from "../theme";

const POINTS = [
  { lead: "Tap,", rest: "don't scan", color: colors.blue, Icon: NfcWaves },
  { lead: "No app", rest: "needed", color: colors.red, Icon: NoApp },
  { lead: "Works on", rest: "iPhone & Android", color: colors.yellow, Icon: PhoneIcon },
  { lead: "Rewrite the link", rest: "anytime", color: colors.green, Icon: LinkIcon },
];
const STEP = 30;

export const Points: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", padding: "0 80px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 70 }}>
        {POINTS.map(({ lead, rest, color, Icon }, i) => {
          const start = 6 + i * STEP;
          const p = spring({ frame: frame - start, fps, config: { damping: 13, stiffness: 150 } });
          const chip = spring({ frame: frame - start - 4, fps, config: { damping: 8, stiffness: 200 } });
          // Older points step back once the next one lands.
          const dim = i < POINTS.length - 1 ? spring({ frame: frame - start - STEP, fps, config: { damping: 200 } }) : 0;
          return (
            <div
              key={lead}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 44,
                opacity: Math.min(1, p * 1.5) * interpolate(dim, [0, 1], [1, 0.38]),
                translate: `${interpolate(p, [0, 1], [700, 0])}px 0px`,
                scale: `${interpolate(p, [0, 1], [1.25, 1]) * interpolate(dim, [0, 1], [1, 0.94])}`,
                transformOrigin: "left center",
                filter: `blur(${Math.max(0, (1 - p) * 14)}px)`,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 150,
                  height: 150,
                  borderRadius: 44,
                  background: `${color}22`,
                  border: `3px solid ${color}`,
                  boxShadow: `0 0 50px ${color}55`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  scale: `${chip}`,
                }}
              >
                <Icon size={88} color={color} />
              </div>
              <div style={{ fontSize: 84, fontWeight: 900, lineHeight: 1.02, letterSpacing: -2.5, color: "white" }}>
                <span style={{ color }}>{lead}</span> {rest}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
