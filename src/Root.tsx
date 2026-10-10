import { AbsoluteFill, Composition, Folder } from "remotion";
import { Background } from "./components/Background";
import { Cards } from "./scenes/Cards";
import { Cta } from "./scenes/Cta";
import { Hook } from "./scenes/Hook";
import { Points } from "./scenes/Points";
import { Price } from "./scenes/Price";
import { TapScene } from "./scenes/TapScene";
import { TaplyPromo } from "./TaplyPromo";
import { TIKTOK1_FRAMES, TikTok1 } from "./tiktok/TikTok1";
import { TIKTOK2_FRAMES, TikTok2 } from "./tiktok/TikTok2";
import { TIKTOK3_FRAMES, TikTok3 } from "./tiktok/TikTok3";
import { framesFor } from "./tiktok/voice/timing";
import { TikTokVoice } from "./tiktok/voice/TikTokVoice";
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
      <Folder name="TikTok">
        <Composition id="TikTok1" component={TikTok1} durationInFrames={TIKTOK1_FRAMES} {...video} />
        <Composition id="TikTok2" component={TikTok2} durationInFrames={TIKTOK2_FRAMES} {...video} />
        <Composition id="TikTok3" component={TikTok3} durationInFrames={TIKTOK3_FRAMES} {...video} />
        <Composition id="TikTokVoice1" component={TikTokVoice} durationInFrames={framesFor(1)} defaultProps={{ version: 1 as const }} {...video} />
        <Composition id="TikTokVoice2" component={TikTokVoice} durationInFrames={framesFor(2)} defaultProps={{ version: 2 as const }} {...video} />
      </Folder>
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
