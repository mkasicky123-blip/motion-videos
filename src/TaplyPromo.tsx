import { linearTiming, springTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { Background } from "./components/Background";
import { Cards } from "./scenes/Cards";
import { Cta } from "./scenes/Cta";
import { Hook } from "./scenes/Hook";
import { Points } from "./scenes/Points";
import { Price } from "./scenes/Price";
import { TapScene } from "./scenes/TapScene";
import { Soundtrack } from "./Soundtrack";
import { SCENES, TRANSITION } from "./theme";

const whip = springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION });

export const TaplyPromo: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Background />
      <Soundtrack />
      <TransitionSeries>
        <TransitionSeries.Sequence name="Hook" durationInFrames={SCENES.hook} premountFor={fps}>
          <Hook />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={whip} />
        <TransitionSeries.Sequence name="Tap" durationInFrames={SCENES.tap} premountFor={fps}>
          <TapScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={whip} />
        <TransitionSeries.Sequence name="Key points" durationInFrames={SCENES.points} premountFor={fps}>
          <Points />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={whip} />
        <TransitionSeries.Sequence name="Card designs" durationInFrames={SCENES.cards} premountFor={fps}>
          <Cards />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION })} />
        <TransitionSeries.Sequence name="Price" durationInFrames={SCENES.price} premountFor={fps}>
          <Price />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={whip} />
        <TransitionSeries.Sequence name="CTA" durationInFrames={SCENES.cta} premountFor={fps}>
          <Cta />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
