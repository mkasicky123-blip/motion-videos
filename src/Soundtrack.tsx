import { Audio } from "@remotion/media";
import { interpolate, staticFile, useVideoConfig } from "remotion";
import { SCENE_STARTS, TAP_FRAME, TOTAL } from "./theme";

// All sounds are synthesized by scripts/make_audio.py.
const TAP_AT = SCENE_STARTS[1] + TAP_FRAME;
// The whoosh swells for ~8 frames, so start it just before each cut to peak mid-transition.
const WHOOSH_LEAD = 2;

export const Soundtrack: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <>
      <Audio
        name="Music"
        src={staticFile("audio/music.wav")}
        premountFor={fps}
        volume={(f) =>
          interpolate(f, [0, 10, TOTAL - 20, TOTAL], [0, 0.32, 0.32, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
      <Audio name="Whoosh: to tap" from={SCENE_STARTS[1] - WHOOSH_LEAD} src={staticFile("audio/whoosh.wav")} volume={0.7} premountFor={fps} />
      <Audio name="Whoosh: to key points" from={SCENE_STARTS[2] - WHOOSH_LEAD} src={staticFile("audio/whoosh.wav")} volume={0.7} premountFor={fps} />
      <Audio name="Whoosh: to cards" from={SCENE_STARTS[3] - WHOOSH_LEAD} src={staticFile("audio/whoosh.wav")} volume={0.7} premountFor={fps} />
      <Audio name="Whoosh: to price" from={SCENE_STARTS[4] - WHOOSH_LEAD} src={staticFile("audio/whoosh.wav")} volume={0.7} premountFor={fps} />
      <Audio name="Whoosh: to CTA" from={SCENE_STARTS[5] - WHOOSH_LEAD} src={staticFile("audio/whoosh.wav")} volume={0.7} premountFor={fps} />
      <Audio name="Tap" from={TAP_AT} src={staticFile("audio/tap.wav")} volume={0.9} premountFor={fps} />
      <Audio name="Success ding" from={TAP_AT} src={staticFile("audio/ding.wav")} volume={0.55} premountFor={fps} />
    </>
  );
};
