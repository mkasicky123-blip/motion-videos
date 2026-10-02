import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Heart, Star } from "../components/Icons";
import { w, Words } from "../components/Words";
import { colors, fontFamily } from "../theme";

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const heart = spring({ frame: frame - 2, fps, config: { damping: 9, stiffness: 140 } });
  const beat = 1 + Math.max(0, Math.sin((frame - 20) / 5)) * 0.06 * (frame > 20 && frame < 45 ? 1 : 0);
  // The first line steps back as the problem line arrives.
  const back = spring({ frame: frame - 40, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center", padding: 90 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
          translate: `0px ${interpolate(back, [0, 1], [200, 60])}px`,
        }}
      >
        <div style={{ scale: `${heart * beat}`, opacity: interpolate(back, [0, 1], [1, 0.55]) }}>
          <Heart size={150} color={colors.red} />
        </div>
        <Words
          words={[...w("Customers"), ...w("love you.", colors.red)]}
          delay={6}
          fontSize={112}
          weight={900}
          style={{ opacity: interpolate(back, [0, 1], [1, 0.55]) }}
        />
        <div style={{ height: 30 }} />
        <Words
          words={[...w("They just"), { text: "never", color: colors.yellow }, ...w("leave a review.")]}
          delay={42}
          stagger={4}
          fontSize={92}
          weight={800}
        />
        <div style={{ display: "flex", gap: 22, marginTop: 40 }}>
          {[0, 1, 2, 3, 4].map((i) => {
            const s = spring({ frame: frame - 62 - i * 3, fps, config: { damping: 12 } });
            // A little "nothing happens" wobble on the empty stars.
            const wobble = Math.sin((frame - 78 - i * 2) / 2.2) * 6 * interpolate(frame, [78, 84, 96], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={i} style={{ scale: `${s}`, rotate: `${wobble}deg` }}>
                <Star size={96} fill="transparent" stroke="#5B6070" strokeWidth={1.4} />
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
