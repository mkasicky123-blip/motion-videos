import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { w, Words } from "../components/Words";
import { colors, fontFamily } from "../theme";

export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logo = spring({ frame, fps, config: { damping: 12, stiffness: 120 } });
  const url = spring({ frame: frame - 26, fps, config: { damping: 11, stiffness: 160 } });
  const pulse = (frame - 30) % 30;

  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center", gap: 70 }}>
      <Img
        src={staticFile("taply-logo-dark.png")}
        style={{
          width: 760,
          scale: `${interpolate(logo, [0, 1], [0.6, 1])}`,
          opacity: logo,
          filter: `blur(${(1 - logo) * 12}px)`,
        }}
      />
      <div>
        <Words words={w("Your review page,")} delay={10} stagger={3} fontSize={84} weight={800} />
        <Words words={w("one tap away.", colors.blue)} delay={19} stagger={3} fontSize={84} weight={800} />
      </div>
      <div style={{ position: "relative", marginTop: 30, scale: `${url}` }}>
        {frame > 30 && (
          <div
            style={{
              position: "absolute",
              inset: -pulse * 1.6,
              borderRadius: 80,
              border: `3px solid ${colors.blue}`,
              opacity: interpolate(pulse, [0, 30], [0.8, 0]),
            }}
          />
        )}
        <div
          style={{
            padding: "30px 70px",
            borderRadius: 70,
            background: colors.blue,
            color: "white",
            fontSize: 70,
            fontWeight: 800,
            letterSpacing: -1,
            boxShadow: `0 20px 80px ${colors.blue}88`,
          }}
        >
          nfctaply.com
        </div>
      </div>
      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        {[colors.blue, colors.red, colors.yellow, colors.green].map((c, i) => (
          <div
            key={c}
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              background: c,
              scale: `${spring({ frame: frame - 36 - i * 3, fps, config: { damping: 9 } })}`,
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
