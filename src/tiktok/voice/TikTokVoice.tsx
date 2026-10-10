import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Star } from "../../components/Icons";
import { ProductCard } from "../../components/ProductCard";
import { clamp, easeOut, MID_X, NFC_SPOT, shake, YELLOW } from "../kit";
import { TapBurst } from "../TapBurst";
import { Bubble, QrTent, RedX, ReviewCard, ReviewPhone } from "../widgets";
import { Grade, Handheld, LightSweep, Shot } from "./Camera";
import { CafeBg, Cup, FollowCard, Hearts, MiniTap, SearchPhone, Wood } from "./props";
import { B, Timeline, timeline, Version, VOICES } from "./timing";
import { tiktokSans, VoiceCaptions } from "./VoiceCaptions";

// Card photos differ a little in aspect; height / width for each.
const RATIO: Record<string, number> = {
  "google-review": 2227 / 2014,
  instagram: 2105 / 1999,
  facebook: 2087 / 2041,
  tiktok: 2117 / 2049,
  "all-in-one": 2261 / 2473,
};
const contactOf = (file: string, left: number, top: number, w: number) => ({ x: left + w * NFC_SPOT.x, y: top + w * RATIO[file] * NFC_SPOT.y });

// Card standing on the counter, used by every tap shot.
const COUNTER = 1150;
const CARD_W = 600;
const CARD_LEFT = MID_X - CARD_W / 2;
const cardTop = (file: string, w = CARD_W) => COUNTER + 10 - w * RATIO[file];

const CardOnCounter: React.FC<{ file?: string; f: number; sweepAt?: number; children?: React.ReactNode }> = ({ file = "google-review", f, sweepAt, children }) => {
  const top = cardTop(file);
  return (
    <>
      <CafeBg f={f} />
      <Wood top={COUNTER} />
      <div style={{ position: "absolute", left: CARD_LEFT, top, width: CARD_W, height: CARD_W * RATIO[file] }}>
        <ProductCard file={file} width={CARD_W} />
        {sweepAt !== undefined && <LightSweep f={f} at={sweepAt} mask={staticFile(`${file}.png`)} />}
      </div>
      {children}
    </>
  );
};

// ---------- hook, version 1: "Your customers love you. So why only 12 reviews?" ----------
const HookMacro: React.FC<{ l: number }> = ({ l }) => (
  <Handheld f={l} push={0.12} amp={1.2}>
    <CafeBg f={l} />
    <div
      style={{
        position: "absolute",
        left: -120,
        top: 120,
        width: 1320,
        height: 1320 * RATIO["google-review"],
        transform: `perspective(1600px) rotateX(${18 - l * 0.15}deg) rotateZ(${-13 + l * 0.08}deg)`,
      }}
    >
      <ProductCard file="google-review" width={1320} />
      <LightSweep f={l} at={4} dur={26} mask={staticFile("google-review.png")} />
    </div>
  </Handheld>
);

const HookListing: React.FC<{ l: number; zoomAt: number }> = ({ l, zoomAt }) => {
  const { fps } = useVideoConfig();
  const snap = spring({ frame: l - zoomAt, fps, config: { damping: 15, stiffness: 260 } });
  return (
    <Handheld f={l} push={0.04} origin="34% 58%" extra={{ scale: 1 + snap * 0.55, x: shake(l, zoomAt + 2, 14) }}>
      <CafeBg f={l + 40} dim={0.3} />
      <ReviewCard count={12} rating={4.9} style={{ top: 660 }} />
    </Handheld>
  );
};

// ---------- hook, version 2: "One tap, and your customer is already leaving you a review. Watch." ----------
const HookTap: React.FC<{ l: number; tap: number }> = ({ l, tap }) => {
  const top = cardTop("google-review");
  return (
    <Handheld f={l} push={0.1} extra={{ y: shake(l, tap, 16), x: shake(l, tap + 1, 10) }}>
      <CardOnCounter f={l} sweepAt={tap + 6} />
      <TapBurst f={l} tap={tap} contact={contactOf("google-review", CARD_LEFT, top, CARD_W)} row={{ x: MID_X, y: 330 }} until={999} />
    </Handheld>
  );
};

const HookWatch: React.FC<{ l: number; watch: number; end: number }> = ({ l, watch, end }) => {
  const { fps } = useVideoConfig();
  const rise = spring({ frame: l, fps, config: { damping: 16, stiffness: 130 } });
  const lunge = interpolate(l, [watch, end - 3], [0, 1], { ...clamp, easing: (t) => t * t });
  const black = interpolate(l, [end - 4, end - 2], [0, 1], clamp);
  return (
    <>
      <Handheld f={l} push={0.05} extra={{ scale: 1 + lunge * 0.9 }} origin="50% 30%">
        <CafeBg f={l + 80} />
        <ReviewPhone f={l} at={2} style={{ left: MID_X - 250, top: interpolate(rise, [0, 1], [1500, 170]) }} />
      </Handheld>
      <AbsoluteFill style={{ background: "black", opacity: black }} />
    </>
  );
};

// ---------- the shared body ----------
const Truth: React.FC<{ l: number }> = ({ l }) => (
  <Handheld f={l} push={-0.05} base={1.18} extra={{ x: -l * 1.6 }}>
    <CafeBg f={l + 120} dim={0.15} />
    <Wood top={1050} />
    <QrTent style={{ left: 560, top: 470, scale: "0.7", filter: "blur(9px)", opacity: 0.85 }} />
    <Cup style={{ left: 150, top: 820 }} />
  </Handheld>
);

const QrShot: React.FC<{ l: number; xAt: number }> = ({ l, xAt }) => {
  const focus = Math.abs(Math.sin(l / 5)) * 10 * interpolate(l, [0, xAt], [1, 0.4], clamp);
  const p1 = interpolate(l, [xAt, xAt + 6], [0, 1], clamp);
  const p2 = interpolate(l, [xAt + 4, xAt + 10], [0, 1], clamp);
  const drop = interpolate(l, [xAt + 14, xAt + 26], [0, 1], { ...clamp, easing: (t) => t * t });
  return (
    <Handheld f={l} push={0.08} amp={1.4} extra={{ y: drop * 200 }}>
      <CafeBg f={l + 200} />
      <Wood top={1160} />
      <QrTent style={{ left: MID_X - 260, top: 380, filter: `blur(${focus}px)` }} />
      {/* phone camera viewfinder hunting for the code */}
      <svg width={700} height={700} viewBox="0 0 100 100" style={{ position: "absolute", left: MID_X - 350, top: 450, opacity: 1 - p1, scale: `${1 + Math.sin(l / 4) * 0.03}` }}>
        {["M2 20 V2 H20", "M80 2 H98 V20", "M98 80 V98 H80", "M20 98 H2 V80"].map((d) => (
          <path key={d} d={d} stroke="#FFD43B" strokeWidth={2.2} fill="none" strokeLinecap="round" />
        ))}
      </svg>
      <RedX size={620} p1={p1} p2={p2} style={{ left: MID_X - 310, top: 470 }} />
    </Handheld>
  );
};

const Search: React.FC<{ l: number; typeTo: number; scrollAt: number }> = ({ l, typeTo, scrollAt }) => {
  const { fps } = useVideoConfig();
  const rise = spring({ frame: l, fps, config: { damping: 18, stiffness: 160 } });
  const giveUp = interpolate(l, [scrollAt + 18, scrollAt + 34], [0, 1], { ...clamp, easing: (t) => t * t });
  return (
    <Handheld f={l} push={0.05}>
      <CafeBg f={l + 300} dim={0.35} />
      <SearchPhone
        f={l}
        typeFrom={2}
        typeTo={typeTo}
        scrollFrom={scrollAt}
        style={{ left: MID_X - 250, top: interpolate(rise, [0, 1], [900, 170]) + giveUp * 600, rotate: `${giveUp * -14}deg` }}
      />
    </Handheld>
  );
};

const Leave: React.FC<{ l: number }> = ({ l }) => {
  const walk = interpolate(l, [0, 22], [-500, 1300], clamp);
  return (
    <Handheld f={l} push={-0.25} base={1.3}>
      <CafeBg f={l + 400} dim={interpolate(l, [0, 22], [0, 0.7], clamp)} />
      <Wood top={1080} />
      <Cup style={{ left: 600, top: 850, filter: "saturate(0.3)" }} />
      <div style={{ position: "absolute", left: walk, top: 200, width: 520, height: 1700, borderRadius: 260, background: "rgba(10,8,6,0.92)", filter: "blur(40px)" }} />
    </Handheld>
  );
};

const Reveal: React.FC<{ l: number }> = ({ l }) => {
  const { fps } = useVideoConfig();
  const turn = spring({ frame: l, fps, config: { damping: 14, stiffness: 90 } });
  const w = 720;
  return (
    <Handheld f={l} push={0.08}>
      <CafeBg f={l + 500} tint="#2C1C12" />
      <Wood top={1180} />
      <div
        style={{
          position: "absolute",
          left: MID_X - w / 2,
          top: 1190 - w * RATIO["google-review"] + Math.sin(l / 9) * 10,
          width: w,
          height: w * RATIO["google-review"],
          transform: `perspective(1500px) rotateY(${interpolate(turn, [0, 1], [62, -6]) + Math.sin(l / 14) * 4}deg) rotateX(${interpolate(turn, [0, 1], [14, 3])}deg)`,
        }}
      >
        <ProductCard file="google-review" width={w} />
        <LightSweep f={l} at={10} dur={22} mask={staticFile("google-review.png")} />
      </div>
    </Handheld>
  );
};

const Tap: React.FC<{ l: number; tap: number; end: number }> = ({ l, tap, end }) => {
  const follow = interpolate(l, [tap + 10, end], [0, 1], { ...clamp, easing: easeOut });
  const top = cardTop("google-review");
  return (
    <Handheld f={l} push={0.06} extra={{ y: shake(l, tap, 18) + follow * 160, x: shake(l, tap + 1, 12) }}>
      <CardOnCounter f={l} sweepAt={tap + 4} />
      <TapBurst f={l} tap={tap} contact={contactOf("google-review", CARD_LEFT, top, CARD_W)} row={{ x: MID_X, y: 330 }} until={end + 10} />
    </Handheld>
  );
};

const Open: React.FC<{ l: number }> = ({ l }) => {
  const { fps } = useVideoConfig();
  const rise = spring({ frame: l, fps, config: { damping: 15, stiffness: 120 } });
  return (
    <Handheld f={l} push={0.07}>
      <CafeBg f={l + 600} />
      <ReviewPhone f={l} at={4} style={{ left: MID_X - 250, top: interpolate(rise, [0, 1], [1600, 160]), rotate: `${(1 - rise) * 8}deg` }} />
    </Handheld>
  );
};

// "No app." Tight angle on the phone resting on the card.
const NoApp: React.FC<{ l: number }> = ({ l }) => {
  const top = cardTop("google-review");
  const c = contactOf("google-review", CARD_LEFT, top, CARD_W);
  return (
    <Handheld f={l} push={0.15} base={1.9} origin={`${(c.x / 1080) * 100}% ${(c.y / 1920) * 100 - 6}%`} amp={0.7}>
      <CardOnCounter f={l} sweepAt={2} />
      <MiniTap f={l} tap={4} contact={c} stay ring="#7FD1FF" screen={<Stars5 />} />
    </Handheld>
  );
};

const Stars5: React.FC = () => (
  <AbsoluteFill style={{ background: "white", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6 }}>
    {[0, 1, 2, 3, 4].map((i) => (
      <Star key={i} size={70} fill={YELLOW} />
    ))}
  </AbsoluteFill>
);

// "No QR code." The QR tent gets crossed out and knocked off the counter.
const NoQr: React.FC<{ l: number; xAt: number }> = ({ l, xAt }) => {
  const p1 = interpolate(l, [xAt, xAt + 5], [0, 1], clamp);
  const p2 = interpolate(l, [xAt + 3, xAt + 8], [0, 1], clamp);
  const fall = interpolate(l, [xAt + 12, xAt + 26], [0, 1], { ...clamp, easing: (t) => t * t });
  return (
    <Handheld f={l} push={-0.08} base={1.12}>
      <CafeBg f={l + 700} />
      <Wood top={1180} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, translate: `${fall * 900}px ${fall * 300}px`, rotate: `${fall * 30}deg` }}>
        <QrTent style={{ left: MID_X - 260, top: 360 }} />
        <RedX size={600} p1={p1} p2={p2} style={{ left: MID_X - 300, top: 420 }} />
      </div>
    </Handheld>
  );
};

const MoreReviews: React.FC<{ l: number; len: number }> = ({ l, len }) => {
  const t = interpolate(l, [2, len], [0, 1], { ...clamp, easing: easeOut });
  return (
    <Handheld f={l} push={0.1}>
      <CafeBg f={l + 800} tint="#1C2A1A" />
      <ReviewCard count={12 + 36 * t} rating={4.9} hot={t} style={{ top: 560 }} />
      {[0, 4, 8, 12, 16, 20].map((d, i) => (
        <Bubble key={d} f={l} at={d} x={90 + ((i * 271) % 520)} y={1080 + ((i * 97) % 120)} />
      ))}
    </Handheld>
  );
};

const MoreFollowers: React.FC<{ l: number; tap: number; len: number }> = ({ l, tap, len }) => {
  const { fps } = useVideoConfig();
  const w = 380;
  const left = 70;
  const top = 1160 - w * RATIO.instagram;
  const c = contactOf("instagram", left, top, w);
  const t = interpolate(l, [tap, len + 4], [0, 1], { ...clamp, easing: easeOut });
  const followed = spring({ frame: l - tap - 2, fps, config: { damping: 10, stiffness: 240 } });
  return (
    <Handheld f={l} push={0.08} extra={{ y: shake(l, tap, 12) }}>
      <CafeBg f={l + 900} tint="#2A1630" />
      <Wood top={1150} />
      <FollowCard count={1204 + 426 * t} followed={followed} style={{ top: 230, scale: "0.92" }} />
      <div style={{ position: "absolute", left, top, width: w, height: w * RATIO.instagram, rotate: "-4deg" }}>
        <ProductCard file="instagram" width={w} />
      </div>
      <Hearts f={l} from={tap + 2} x={760} y={1000} />
      <MiniTap f={l} tap={tap} contact={c} ring="#FF6FA8" scale={0.42} />
    </Handheld>
  );
};

const AnyPhone: React.FC<{ l: number; tapA: number; tapB: number }> = ({ l, tapA, tapB }) => {
  const w = 520;
  const top = 1150 + 10 - w * RATIO["google-review"];
  const c = contactOf("google-review", MID_X - w / 2, top, w);
  return (
    <Handheld f={l} push={0.06} extra={{ y: shake(l, tapA, 12) + shake(l, tapB, 12) }}>
      <CafeBg f={l + 1000} />
      <Wood top={1150} />
      <div style={{ position: "absolute", left: MID_X - w / 2, top, width: w }}>
        <ProductCard file="google-review" width={w} />
      </div>
      <MiniTap f={l} tap={tapA} contact={c} from="right" kind="iphone" ring="#7FD1FF" scale={0.5} screen={<Stars5 />} />
      <MiniTap f={l} tap={tapB} contact={c} from="left" kind="android" ring="#9BE38A" scale={0.5} screen={<Stars5 />} />
    </Handheld>
  );
};

// All five designs fan out like a hand of cards; the price lands on the spoken "fifty-six".
const FAN = ["facebook", "instagram", "google-review", "tiktok", "all-in-one"];
const Fan: React.FC<{ l: number; priceAt: number; ctaAt: number }> = ({ l, priceAt, ctaAt }) => {
  const { fps } = useVideoConfig();
  const open = spring({ frame: l, fps, config: { damping: 13, stiffness: 120 } });
  const price = spring({ frame: l - priceAt, fps, config: { damping: 10, stiffness: 260 } });
  const cta = spring({ frame: l - ctaAt, fps, config: { damping: 14, stiffness: 160 } });
  const bob = Math.sin((l - ctaAt) / 4) * 14;
  const w = 430;
  return (
    <>
      <Handheld f={l} push={0.05} extra={{ scale: 1 + cta * 0.08, y: cta * -60 }}>
        <CafeBg f={l + 1100} tint="#2C1C12" />
        {FAN.map((file, i) => {
          const a = (i - 2) * 15 * open;
          const order = i === 2 ? 10 : 5 - Math.abs(i - 2);
          return (
            <div
              key={file}
              style={{
                position: "absolute",
                left: MID_X - w / 2,
                top: 560 - (i === 2 ? 30 * open : 0),
                width: w,
                height: w * RATIO[file],
                rotate: `${a}deg`,
                transformOrigin: "50% 160%",
                zIndex: order,
              }}
            >
              <ProductCard file={file} width={w} />
              <LightSweep f={l} at={6 + i * 3} dur={18} mask={staticFile(`${file}.png`)} />
            </div>
          );
        })}
      </Handheld>
      {l >= priceAt && (
        <div
          style={{
            position: "absolute",
            left: MID_X,
            top: 270 - cta * 20,
            translate: "-50% 0px",
            scale: `${interpolate(price, [0, 1], [1.8, 1])}`,
            rotate: `${(1 - price) * -6 - 3}deg`,
            opacity: Math.min(1, price * 3),
            padding: "6px 40px 16px",
            borderRadius: 30,
            background: YELLOW,
            color: "#111",
            fontFamily: tiktokSans,
            fontWeight: 900,
            fontSize: 118,
            letterSpacing: -3,
            whiteSpace: "nowrap",
            boxShadow: "0 18px 50px rgba(0,0,0,0.5)",
          }}
        >
          <span style={{ fontSize: 64, fontWeight: 800, letterSpacing: -1 }}>from </span>€0.56
        </div>
      )}
      {l >= ctaAt && (
        <div style={{ position: "absolute", left: MID_X - 420, width: 840, top: 1220, display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, cta * 2), scale: `${interpolate(cta, [0, 1], [1.4, 1])}` }}>
          <div
            style={{
              fontFamily: tiktokSans,
              fontWeight: 900,
              fontSize: 104,
              color: "#111",
              background: "white",
              borderRadius: 26,
              padding: "0 36px 12px",
              boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
            }}
          >
            link in bio
          </div>
          <svg width={90} height={110} viewBox="0 0 24 28" style={{ marginTop: 16, translate: `0px ${bob}px`, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.8))" }}>
            <path d="M12 2v20M4 15l8 8 8-8" stroke="white" strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
      )}
      {l >= ctaAt && (
        <Img src={staticFile("taply-logo-dark.png")} style={{ position: "absolute", left: MID_X - 220, width: 440, top: 1110, opacity: interpolate(l, [ctaAt + 6, ctaAt + 14], [0, 1], clamp) }} />
      )}
    </>
  );
};

// ---------- sound ----------
const Sound: React.FC<{ v: Version; whooshes: number[]; taps: number[]; dings: number[]; ticks: number[]; total: number; voiceEnd: number }> = ({
  v,
  whooshes,
  taps,
  dings,
  ticks,
  total,
  voiceEnd,
}) => {
  const { fps } = useVideoConfig();
  return (
    <>
      <Audio name="Voiceover" src={staticFile(VOICES[v].src)} />
      {/* Music sits ~20 dB under the voice, then comes up for the outro. */}
      <Audio
        name="Music"
        src={staticFile("audio/music-voice.wav")}
        volume={(f) => interpolate(f, [voiceEnd, voiceEnd + 10, total - 8, total], [0.09, 0.3, 0.3, 0], clamp)}
      />
      {whooshes.map((at) => (
        <Audio key={`w${at}`} name="Whoosh" from={Math.max(0, at - 3)} src={staticFile("audio/whoosh.wav")} volume={0.32} premountFor={fps} />
      ))}
      {taps.map((at) => (
        <Audio key={`t${at}`} name="Tap" from={at} src={staticFile("audio/tap.wav")} volume={0.75} premountFor={fps} />
      ))}
      {dings.map((at) => (
        <Audio key={`d${at}`} name="Ding" from={at} src={staticFile("audio/ding.wav")} volume={0.4} premountFor={fps} />
      ))}
      {ticks.map((at) => (
        <Audio key={`k${at}`} name="Tick" from={at} src={staticFile("audio/tap.wav")} volume={0.25} playbackRate={1.6} premountFor={fps} />
      ))}
    </>
  );
};

export const TikTokVoice: React.FC<{ version: Version }> = ({ version }) => {
  const f = useCurrentFrame();
  const tl: Timeline = timeline(version);
  const { w, b, total } = tl;

  // Cuts, in frames. Each shot runs from one cut to the next.
  const hook = version === 1 ? [0, w(4)] : [0, w(6)];
  const cuts = [
    ...hook,
    b(B.truth),
    b(B.nobody1),
    b(B.nobody2),
    b(B.they),
    b(B.so),
    b(B.they2),
    b(B.and),
    b(B.noApp),
    b(B.noQr),
    b(B.moreReviews),
    b(B.moreFollowers),
    b(B.works),
    b(B.taply),
    total,
  ];
  const at = (i: number) => cuts[i];
  const shot = (i: number, render: (l: number) => React.ReactNode, dir: 1 | -1 = i % 2 ? -1 : 1) => (
    <Shot f={f} from={at(i)} to={at(i + 1)} dir={dir} whipIn={i > 0} whipOut={i < cuts.length - 2}>
      {render}
    </Shot>
  );

  const tapFrame = b(B.tap);
  const igTap = b(B.followers);
  const anyA = b(B.any);
  const anyB = b(B.phone);
  const hookTap = w(1);

  return (
    <AbsoluteFill style={{ background: "black", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "contrast(1.06) saturate(1.06)" }}>
        {version === 1
          ? shot(0, (l) => <HookMacro l={l} />)
          : shot(0, (l) => <HookTap l={l} tap={hookTap} />)}
        {version === 1
          ? shot(1, (l) => <HookListing l={l} zoomAt={w(7) - at(1)} />)
          : shot(1, (l) => <HookWatch l={l} watch={w(11) - at(1)} end={at(2) - at(1)} />, 1)}
        {shot(2, (l) => <Truth l={l} />)}
        {shot(3, (l) => <QrShot l={l} xAt={b(B.codes) - at(3)} />)}
        {shot(4, (l) => <Search l={l} typeTo={b(B.page) - at(4) - 6} scrollAt={b(B.page) - at(4)} />)}
        {shot(5, (l) => <Leave l={l} />)}
        {shot(6, (l) => <Reveal l={l} />)}
        {shot(7, (l) => <Tap l={l} tap={tapFrame - at(7)} end={at(8) - at(7)} />, 1)}
        {shot(8, (l) => <Open l={l} />)}
        {shot(9, (l) => <NoApp l={l} />)}
        {shot(10, (l) => <NoQr l={l} xAt={b(B.code) - at(10) - 6} />)}
        {shot(11, (l) => <MoreReviews l={l} len={at(12) - at(11)} />)}
        {shot(12, (l) => <MoreFollowers l={l} tap={igTap - at(12)} len={at(13) - at(12)} />)}
        {shot(13, (l) => <AnyPhone l={l} tapA={anyA - at(13)} tapB={anyB - at(13)} />)}
        {shot(14, (l) => <Fan l={l} priceAt={b(B.from) - at(14)} ctaAt={b(B.link) - at(14)} />)}
      </AbsoluteFill>
      <Grade f={f} />
      {/* Soft scrim behind the caption line so white words read over white cards. */}
      <AbsoluteFill style={{ opacity: interpolate(f, [b(B.from) + 6, b(B.from) + 14], [1, 0], clamp), background: "linear-gradient(180deg, transparent 58%, rgba(0,0,0,0.38) 66%, rgba(0,0,0,0.38) 72%, transparent 80%)" }} />
      <VoiceCaptions f={f} tl={tl} until={tl.hookWords + B.from} />
      <Sound
        v={version}
        total={total}
        voiceEnd={Math.round(VOICES[version].duration * 30)}
        whooshes={cuts.slice(1, -1)}
        taps={[version === 2 ? hookTap : -1, tapFrame, igTap, anyA, anyB].filter((x) => x >= 0)}
        dings={[version === 2 ? hookTap + 2 : -1, tapFrame + 2, igTap + 2, b(B.from)].filter((x) => x >= 0)}
        ticks={[0, 4, 8, 12, 16, 20].map((d) => b(B.moreReviews) + d)}
      />
    </AbsoluteFill>
  );
};
