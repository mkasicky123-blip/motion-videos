import { spring, useCurrentFrame, useVideoConfig } from "remotion";

type Word = { text: string; color?: string };

// Word-by-word kinetic line: each word springs up from below with a short blur.
export const Words: React.FC<{
  words: Word[];
  delay?: number;
  stagger?: number;
  fontSize: number;
  weight?: number;
  style?: React.CSSProperties;
}> = ({ words, delay = 0, stagger = 4, fontSize, weight = 800, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: fontSize * 0.26,
        fontSize,
        fontWeight: weight,
        lineHeight: 1.08,
        letterSpacing: -fontSize * 0.03,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const p = spring({ frame: frame - delay - i * stagger, fps, config: { damping: 14, stiffness: 160 } });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              color: w.color ?? "white",
              opacity: Math.min(1, p * 1.6),
              translate: `0px ${(1 - p) * fontSize * 0.7}px`,
              filter: `blur(${Math.max(0, (1 - p) * 10)}px)`,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

export const w = (text: string, color?: string): Word[] =>
  text.split(" ").map((t) => ({ text: t, color }));
