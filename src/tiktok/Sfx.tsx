import { Audio } from "@remotion/media";
import { interpolate, staticFile, useVideoConfig } from "remotion";

// The promo's music bed is 120 BPM with a bar starting every 2 s from 0.4667 s.
// `musicFrom` (frames into music.wav) is picked so bars land on whole even seconds of the video,
// which puts every tap on a downbeat and makes the loop point land on a bar line.
export const Sfx: React.FC<{
  total: number;
  musicFrom: number;
  whooshes: number[];
  taps: number[];
  thuds?: number[];
  ticks?: number[];
  dings?: number[];
}> = ({ total, musicFrom, whooshes, taps, thuds = [], ticks = [], dings = [] }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      <Audio
        name="Music"
        src={staticFile("audio/music.wav")}
        trimBefore={musicFrom}
        volume={(f) => interpolate(f, [total - 3, total], [0.32, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {whooshes.map((at) => (
        <Audio key={`w${at}`} name="Whoosh" from={Math.max(0, at - 2)} src={staticFile("audio/whoosh.wav")} volume={0.6} premountFor={fps} />
      ))}
      {taps.map((at) => (
        <Audio key={`t${at}`} name="Tap" from={at} src={staticFile("audio/tap.wav")} volume={0.7} premountFor={fps} />
      ))}
      {taps.concat(dings).map((at) => (
        <Audio key={`d${at}`} name="Ding" from={at} src={staticFile("audio/ding.wav")} volume={0.6} premountFor={fps} />
      ))}
      {thuds.map((at) => (
        <Audio key={`h${at}`} name="Thud" from={at} src={staticFile("audio/tap.wav")} volume={0.7} playbackRate={0.6} premountFor={fps} />
      ))}
      {ticks.map((at) => (
        <Audio key={`k${at}`} name="Tick" from={at} src={staticFile("audio/tap.wav")} volume={0.35} playbackRate={1.6} premountFor={fps} />
      ))}
    </>
  );
};
