import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ProductCard } from "../components/ProductCard";
import { fontFamily } from "../theme";
import { Caption, CARD_RATIO, clamp, Counter, GREEN, Hi, MID_X, NFC_SPOT, outline, shake, TikBg, TikText } from "./kit";
import { Sfx } from "./Sfx";
import { TapBurst } from "./TapBurst";
import { Badge, LinkInBio, Notif, ReviewCard, ReviewPhone } from "./widgets";

// "This $1 card gets you Google reviews on autopilot": mystery -> reveal -> 3 steps -> autopilot.
export const TIKTOK3_FRAMES = 480;
const N = TIKTOK3_FRAMES;
const LOOP = 12;
const REVEAL = 60; // lands on the music drop
const TAP = 240;
const CARD_W = 560;
const CARD_LEFT = MID_X - CARD_W / 2;
const COUNTER_TOP = 1330;
const CARD_TOP = COUNTER_TOP + 10 - CARD_W * CARD_RATIO;
const CONTACT = { x: CARD_LEFT + CARD_W * NFC_SPOT.x, y: CARD_TOP + CARD_W * CARD_RATIO * NFC_SPOT.y };
const NOTIFS = [
  { at: 362, name: "Anna" },
  { at: 378, name: "Marek" },
  { at: 394, name: "Sofia" },
];

// The card hidden behind blur and a big "?". `h` runs negative during the run-up at the end.
const Mystery: React.FC<{ h: number }> = ({ h }) => {
  const { fps } = useVideoConfig();
  if (h >= REVEAL + 60) return null;
  const inTop = h < 0 ? interpolate(h, [-LOOP, 0], [1300, 40], { easing: (t) => 1 - (1 - t) * (1 - t) }) : 40 * Math.exp(-h / 6);
  const revealed = h >= REVEAL;
  const flip = spring({ frame: h - REVEAL, fps, config: { damping: 12, stiffness: 120 } });
  const jitter = h >= 38 && h < REVEAL ? Math.sin(h * 2.1) * interpolate(h, [38, REVEAL], [4, 26]) : 0;
  const q = 1 + 0.08 * Math.sin((h + LOOP) / 4);
  const leave = interpolate(h, [118, 126], [0, 1], { ...clamp, easing: (t) => t * t });
  return (
    <div
      style={{
        position: "absolute",
        left: CARD_LEFT + jitter,
        top: CARD_TOP + 70 + inTop - leave * 1500,
        width: CARD_W,
        height: CARD_W * CARD_RATIO,
        transform: revealed
          ? `perspective(1400px) rotateY(${(1 - flip) * 90 + Math.sin((h - REVEAL) / 10) * 12}deg) scale(${1 + 0.1 * (1 - flip)})`
          : `perspective(1400px) rotateY(${Math.sin((h + LOOP) / 8) * 16}deg)`,
      }}
    >
      <ProductCard file="google-review" width={CARD_W} blur={revealed ? 0 : 30} style={{ left: 0, top: 0 }} />
      {!revealed && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...outline(360),
            scale: `${q}`,
          }}
        >
          ?
        </div>
      )}
    </div>
  );
};

const Hook: React.FC<{ h: number }> = ({ h }) => {
  if (h >= 42) return null;
  const scale = h < 0 ? interpolate(h, [-LOOP, 0], [2.4, 1.12]) : 1 + 0.12 * Math.cos(h * 0.55) * Math.exp(-h / 6);
  const inOp = h < 0 ? interpolate(h, [-LOOP, -LOOP + 5], [0, 1], clamp) : 1;
  const out = interpolate(h, [35, 41], [0, 1], clamp);
  return (
    <TikText top={250} size={100} style={{ scale: `${scale * (1 - out * 0.5)}`, opacity: inOp * (1 - out) }}>
      This <Hi><span style={{ display: "inline-block", scale: `${1 + 0.1 * Math.sin(h / 3)}` }}>$1</span></Hi> card
      <br />
      gets you Google
      <br />
      reviews on
      <br />
      <Hi>autopilot</Hi>
    </TikText>
  );
};

export const TikTok3: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h = f >= N - LOOP ? f - N : f;

  const counterIn = spring({ frame: f - 122, fps, config: { damping: 20 } });
  const drop = spring({ frame: f - 128, fps, config: { damping: 9, stiffness: 140 } });
  const stepOut = interpolate(f, [268, 276], [0, 1], { ...clamp, easing: (t) => t * t });
  const phoneIn = spring({ frame: f - 270, fps, config: { damping: 14, stiffness: 150 } });
  const phoneOut = interpolate(f, [342, 350], [0, 1], { ...clamp, easing: (t) => t * t });
  const cardIn = spring({ frame: f - 346, fps, config: { damping: 14, stiffness: 160 } });
  const cardOut = interpolate(f, [416, 422], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ fontFamily, overflow: "hidden" }}>
      <TikBg f={f} total={N} a="#8A3CFF" b="#2FB5FF" />

      {/* 0-4 s: mystery and reveal */}
      <Mystery h={h} />
      <Hook h={h} />
      <Caption f={f} at={38} until={REVEAL} size={110}>
        wait for it…
      </Caption>
      <AbsoluteFill style={{ background: "white", opacity: interpolate(f, [REVEAL, REVEAL + 1, REVEAL + 10], [0, 0.9, 0], clamp) }} />
      <Caption f={f} at={REVEAL + 2} until={92}>
        it's an <Hi>NFC</Hi> card
      </Caption>
      <Caption f={f} at={92} until={118}>
        no app.
        <br />
        no battery.
      </Caption>

      {/* 4-9 s: steps 1 and 2 on the counter */}
      {f >= 120 && f < 278 && (
        <>
          <Counter top={COUNTER_TOP} show={counterIn * (1 - stepOut)} />
          <ProductCard
            file="google-review"
            width={CARD_W}
            style={{
              left: CARD_LEFT,
              top: interpolate(drop, [0, 1], [-800, CARD_TOP]) + stepOut * 1300,
              rotate: `${(1 - drop) * -12}deg`,
            }}
          />
        </>
      )}
      <Badge f={f} at={122} until={192} text="STEP 1" top={250} />
      <Caption f={f} at={124} until={192} top={350}>
        put it on
        <br />
        your counter
      </Caption>
      <Badge f={f} at={195} until={266} text="STEP 2" top={250} />
      <Caption f={f} at={197} until={TAP - 2} top={350}>
        customer taps
        <br />
        their phone
      </Caption>
      <TapBurst f={f} tap={TAP} contact={CONTACT} row={{ x: MID_X, y: 560 }} until={266} />

      {/* 9-11.5 s: step 3 */}
      <Badge f={f} at={270} until={342} text="STEP 3" top={250} />
      <Caption f={f} at={272} until={342} top={350} size={96}>
        review page
        <br />
        opens <Hi color={GREEN}>instantly</Hi>
      </Caption>
      {f >= 268 && f < 352 && (
        <ReviewPhone
          f={f}
          at={272}
          style={{
            left: MID_X - 250,
            top: interpolate(phoneIn, [0, 1], [1900, 600]) + phoneOut * 1400,
            scale: "0.9",
            transformOrigin: "50% 0%",
          }}
        />
      )}

      {/* 11.5-14 s: autopilot */}
      <Caption f={f} at={346} until={416}>
        reviews on
        <br />
        <Hi>autopilot</Hi>
      </Caption>
      {f >= 344 && f < 424 && (
        <>
          <ReviewCard
            count={Math.round(interpolate(f, [352, 414], [48, 187], clamp))}
            rating={4.9}
            style={{ top: interpolate(cardIn, [0, 1], [1700, 540]) + shake(f, 362, 10) + shake(f, 378, 10) + shake(f, 394, 10), scale: `${0.88 * (1 - cardOut)}` }}
          />
          <div style={{ opacity: 1 - cardOut }}>
            {NOTIFS.map((n, i) => (
              <Notif key={n.at} f={f} at={n.at} top={1010 + i * 150} name={n.name} />
            ))}
          </div>
        </>
      )}

      <LinkInBio f={f} at={422} until={462} />

      <Sfx
        total={N}
        musicFrom={74}
        whooshes={[36, REVEAL, 120, 195, 270, 346, 422, N - LOOP + 2]}
        taps={[TAP]}
        thuds={[138]}
        ticks={NOTIFS.map((n) => n.at)}
        dings={[REVEAL, 324]}
      />
    </AbsoluteFill>
  );
};
