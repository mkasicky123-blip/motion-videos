import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ProductCard } from "../components/ProductCard";
import { fontFamily } from "../theme";
import { Caption, CARD_RATIO, clamp, Counter, GREEN, Hi, MID_X, NFC_SPOT, RED, shake, TikBg, TikText } from "./kit";
import { Sfx } from "./Sfx";
import { TapBurst } from "./TapBurst";
import { Bubble, LinkInBio, ReviewCard } from "./widgets";

// "POV: your café gets 10x more Google reviews": problem -> tap -> counter flies up.
export const TIKTOK1_FRAMES = 420;
const N = TIKTOK1_FRAMES;
const LOOP = 12; // the last LOOP frames replay the run-up into frame 0
const TAP = 120;
const CARD_W = 560;
const CARD_LEFT = MID_X - CARD_W / 2;
const COUNTER_TOP = 1330;
const CARD_TOP = COUNTER_TOP + 10 - CARD_W * CARD_RATIO;
const CONTACT = { x: CARD_LEFT + CARD_W * NFC_SPOT.x, y: CARD_TOP + CARD_W * CARD_RATIO * NFC_SPOT.y };
const BUBBLES = Array.from({ length: 19 }, (_, i) => 205 + i * 6);

// Hook layer. `h` runs from -LOOP (end of video, flying in) through 0 (first frame) onward.
const Hook: React.FC<{ h: number }> = ({ h }) => {
  if (h >= 42) return null;
  const scale = h < 0 ? interpolate(h, [-LOOP, 0], [2.4, 1.12]) : 1 + 0.12 * Math.cos(h * 0.55) * Math.exp(-h / 6);
  const inOp = h < 0 ? interpolate(h, [-LOOP, -LOOP + 5], [0, 1], clamp) : 1;
  const out = interpolate(h, [35, 41], [0, 1], clamp);
  const cardTop = h < 0 ? interpolate(h, [-LOOP, 0], [1500, 840], { easing: (t) => 1 - (1 - t) * (1 - t) }) : 840 - 40 * (1 - Math.exp(-h / 8));
  return (
    <>
      <ProductCard
        file="google-review"
        width={540}
        style={{
          left: MID_X - 270,
          top: cardTop + out * 900,
          transform: `perspective(1400px) rotateY(${Math.sin((h + LOOP) / 9) * 22}deg) rotateZ(${Math.sin((h + LOOP) / 13) * 4}deg)`,
          opacity: inOp,
        }}
      />
      <TikText top={300} size={104} style={{ scale: `${scale * (1 - out * 0.5)}`, opacity: inOp * (1 - out) }}>
        POV: your café
        <br />
        gets <Hi><span style={{ display: "inline-block", scale: `${1 + 0.08 * Math.sin(h / 3)}` }}>10x</span></Hi> more
        <br />
        Google reviews
      </TikText>
    </>
  );
};

export const TikTok1: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Before: a sad listing.
  const sadIn = spring({ frame: f - 37, fps, config: { damping: 13, stiffness: 180 } });
  const sadOut = interpolate(f, [74, 80], [0, 1], clamp);

  // The card lands on the counter.
  const counterIn = spring({ frame: f - 75, fps, config: { damping: 20 } });
  const drop = spring({ frame: f - 80, fps, config: { damping: 9, stiffness: 140 } });
  const cardGone = interpolate(f, [194, 202], [0, 1], { ...clamp, easing: (t) => t * t });

  // After: the counter flies.
  const upIn = spring({ frame: f - 196, fps, config: { damping: 14, stiffness: 160 } });
  const upOut = interpolate(f, [366, 372], [0, 1], clamp);
  const t = interpolate(f, [205, 320], [0, 1], clamp);
  const count = 12 + 300 * Math.pow(t, 2.2);
  const rating = 3.8 + 1.1 * Math.pow(t, 0.7);
  const stamp = spring({ frame: f - 328, fps, config: { damping: 12, stiffness: 300 } });

  return (
    <AbsoluteFill style={{ fontFamily, overflow: "hidden" }}>
      <TikBg f={f} total={N} a="#E0883A" b="#7A3CFF" />

      {/* 1.2-2.5 s: the problem */}
      {f >= 36 && f < 82 && (
        <ReviewCard
          count={12}
          rating={3.8}
          style={{
            top: 720 + shake(f, 58, 18),
            scale: `${sadIn * (1 - sadOut)}`,
            filter: "saturate(0.4)",
          }}
        />
      )}
      <Caption f={f} at={38} until={56}>
        customers <Hi>love</Hi> you…
      </Caption>
      <Caption f={f} at={56} until={74}>
        but <Hi color={RED}>nobody</Hi> leaves
        <br />a review
      </Caption>

      {/* 2.5-6.5 s: the card goes on the counter and gets tapped */}
      {f >= 75 && f < 204 && (
        <>
          <Counter top={COUNTER_TOP} show={counterIn * (1 - cardGone)} />
          <ProductCard
            file="google-review"
            width={CARD_W}
            style={{
              left: CARD_LEFT,
              top: interpolate(drop, [0, 1], [-800, CARD_TOP]) + cardGone * 1200,
              rotate: `${(1 - drop) * -14}deg`,
            }}
          />
        </>
      )}
      <Caption f={f} at={76} until={100}>
        so we put <Hi>this</Hi>
        <br />
        on the counter
      </Caption>
      <TapBurst f={f} tap={TAP} contact={CONTACT} row={{ x: MID_X, y: 600 }} until={194} />
      <Caption f={f} at={TAP} until={150} size={120}>
        one tap.
      </Caption>
      <Caption f={f} at={150} until={194} size={88}>
        review page
        <br />
        opens <Hi color={GREEN}>instantly</Hi>
      </Caption>

      {/* 6.5-12 s: the counter flies up */}
      {f >= 195 && f < 374 && (
        <>
          <ReviewCard
            count={count}
            rating={rating}
            hot={interpolate(f, [300, 320], [0, 1], clamp)}
            style={{
              top: interpolate(upIn, [0, 1], [1500, 640]) + shake(f, 330, 22),
              scale: `${(1 + 0.03 * Math.sin(f * 1.3) * t * (1 - t) * 4) * (1 - upOut)}`,
            }}
          />
          {BUBBLES.map((at, i) => (
            <Bubble key={at} f={f} at={at} x={80 + ((i * 271) % 520)} y={1180 + ((i * 137) % 220)} />
          ))}
        </>
      )}
      <Caption f={f} at={197} until={262}>
        then this
        <br />
        happened…
      </Caption>
      <Caption f={f} at={262} until={326} size={110}>
        <Hi color={GREEN}>+300</Hi> reviews
      </Caption>
      <Caption f={f} at={326} until={366}>
        same café.
      </Caption>
      {f >= 328 && f < 372 && (
        <div
          style={{
            position: "absolute",
            left: MID_X - 330,
            width: 660,
            top: 1150,
            rotate: "-9deg",
            scale: `${interpolate(stamp, [0, 1], [2.6, 1]) * (1 - upOut)}`,
            opacity: Math.min(1, stamp * 3),
            border: "12px solid #FF3B30",
            borderRadius: 24,
            padding: "14px 0",
            textAlign: "center",
            fontWeight: 900,
            fontSize: 84,
            letterSpacing: 4,
            color: "#FF3B30",
            background: "rgba(255,255,255,0.92)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          }}
        >
          1 MONTH LATER
        </div>
      )}

      {/* 12.3-13.6 s: soft CTA, then back into the hook */}
      <LinkInBio f={f} at={370} until={402} />
      <Hook h={f >= N - LOOP ? f - N : f} />

      <Sfx
        total={N}
        musicFrom={134}
        whooshes={[36, 75, 196, 262, 370, N - LOOP + 2]}
        taps={[TAP]}
        thuds={[90, 332]}
        ticks={BUBBLES.filter((_, i) => i % 2 === 0)}
        dings={[320]}
      />
    </AbsoluteFill>
  );
};
