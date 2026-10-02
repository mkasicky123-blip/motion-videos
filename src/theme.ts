import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Inter is bundled in public/fonts so rendering works offline.
export const fontFamily = "Inter";
for (const weight of ["500", "700", "800", "900"]) {
  loadFont({ family: fontFamily, url: staticFile(`fonts/Inter-${weight}.woff2`), weight });
}

export const colors = {
  bg: "#0A0A0F",
  text: "#FFFFFF",
  muted: "#9AA0AE",
  blue: "#4285F4",
  red: "#EA4335",
  yellow: "#FBBC05",
  green: "#34A853",
};

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Scene lengths; neighbouring scenes overlap by TRANSITION frames.
export const TRANSITION = 12;
export const SCENES = {
  hook: 100,
  tap: 160,
  points: 140,
  cards: 115,
  price: 60,
  cta: 85,
};
export const TOTAL =
  Object.values(SCENES).reduce((a, b) => a + b, 0) -
  (Object.keys(SCENES).length - 1) * TRANSITION;
