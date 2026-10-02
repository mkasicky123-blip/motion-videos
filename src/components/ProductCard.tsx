import { Img, staticFile } from "remotion";

// A product card photo with a soft shadow beneath it so it reads as a real object.
export const ProductCard: React.FC<{
  file: string;
  width: number;
  blur?: number;
  style?: React.CSSProperties;
}> = ({ file, width, blur = 0, style }) => (
  <div style={{ position: "absolute", width, ...style }}>
    {/* contact shadow on the surface below the card */}
    <div
      style={{
        position: "absolute",
        left: "8%",
        right: "8%",
        bottom: -width * 0.06,
        height: width * 0.14,
        borderRadius: "50%",
        background: "radial-gradient(ellipse at center, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 45%, transparent 72%)",
        filter: `blur(${18 + blur}px)`,
      }}
    />
    <Img
      src={staticFile(`${file}.png`)}
      style={{
        position: "relative",
        width: "100%",
        display: "block",
        filter: `drop-shadow(0px ${width * 0.04}px ${width * 0.05}px rgba(0,0,0,0.55))${blur ? ` blur(${blur}px)` : ""}`,
      }}
    />
  </div>
);
