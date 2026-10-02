// A generic phone frame. Children render inside the screen.
export const Phone: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      position: "absolute",
      width: 500,
      height: 1030,
      borderRadius: 84,
      background: "linear-gradient(145deg, #2A2D35, #0E0F13 60%)",
      padding: 16,
      boxShadow: "0 60px 120px rgba(0,0,0,0.65), inset 0 0 0 2px rgba(255,255,255,0.12)",
      ...style,
    }}
  >
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 70,
        overflow: "hidden",
        background: "linear-gradient(170deg, #1B2340, #0B0D16)",
      }}
    >
      {children}
      {/* dynamic island */}
      <div
        style={{
          position: "absolute",
          top: 22,
          left: "50%",
          translate: "-50% 0px",
          width: 150,
          height: 42,
          borderRadius: 21,
          background: "#000",
        }}
      />
      {/* glass sheen */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(120deg, rgba(255,255,255,0.10) 0%, transparent 35%)",
          pointerEvents: "none",
        }}
      />
    </div>
  </div>
);
