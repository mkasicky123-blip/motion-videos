import { AbsoluteFill, Composition, Folder } from "remotion";
import { Background } from "./components/Background";
import { Cards } from "./scenes/Cards";
import { Cta } from "./scenes/Cta";
import { Hook } from "./scenes/Hook";
import { Points } from "./scenes/Points";
import { Price } from "./scenes/Price";
import { TapScene } from "./scenes/TapScene";
import { TaplyPromo } from "./TaplyPromo";
import { FPS, HEIGHT, SCENES, TOTAL, WIDTH } from "./theme";

// Standalone scene previews get the same backdrop as the full video.
const withBg = (Scene: React.FC): React.FC => () => (
  <AbsoluteFill>
    <Background />
    <Scene />
  </AbsoluteFill>
);

const video = { fps: FPS, width: WIDTH, height: HEIGHT };
const HookPreview = withBg(Hook);
const TapPreview = withBg(TapScene);
const PointsPreview = withBg(Points);
const CardsPreview = withBg(Cards);
const PricePreview = withBg(Price);
const CtaPreview = withBg(Cta);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="TaplyPromo" component={TaplyPromo} durationInFrames={TOTAL} {...video} />
      <Folder name="Scenes">
        <Composition id="Hook" component={HookPreview} durationInFrames={SCENES.hook} {...video} />
        <Composition id="Tap" component={TapPreview} durationInFrames={SCENES.tap} {...video} />
        <Composition id="KeyPoints" component={PointsPreview} durationInFrames={SCENES.points} {...video} />
        <Composition id="CardDesigns" component={CardsPreview} durationInFrames={SCENES.cards} {...video} />
        <Composition id="Price" component={PricePreview} durationInFrames={SCENES.price} {...video} />
        <Composition id="Cta" component={CtaPreview} durationInFrames={SCENES.cta} {...video} />
      </Folder>
    </>
  );
};
