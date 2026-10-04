import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Phone } from "../components/Phone";
import { ProductCard } from "../components/ProductCard";
import { fontFamily } from "../theme";
import { Caption, CARD_RATIO, clamp, Counter, GREEN, Hi, MID_X, NFC_SPOT, outline, RED, shake, TikBg, TikText, YELLOW } from "./kit";
import { Sfx } from "./Sfx";
import { TapBurst } from "./TapBurst";
import { Badge, LinkInBio, Qr, QrTent, RedX, Stopwatch } from "./widgets";

// "Stop putting QR codes on your tables": QR crossed out -> stopwatch race -> Taply tap wins.
export const TIKTOK2_FRAMES = 420;
const N = TIKTOK2_FRAMES;
const LOOP = 12;
const TAP = 180;
const CARD_W = 560;
const CARD_LEFT = MID_X - CARD_W / 2;
const TABLE_TOP = 1330;
const CARD_TOP = TABLE_TOP + 10 - CARD_W * CARD_RATIO;
const CONTACT = { x: CARD_LEFT + CARD_W * NFC_SPOT.x, y: CARD_TOP + CARD_W * CARD_RATIO * NFC_SPOT.y };
const TENT_TOP = 740;
const FLICK = ["google-review", "instagram", "facebook", "tiktok", "all-in-one"];
const FLICK_AT = 285;
const FLICK_STEP = 15;
const PAIN = [
  { at: 66, text: "open camera…" },
  { at: 87, text: "focus… focus…" },
  { at: 108, text: "tap the link…" },
  { at: 129, text: "wait… wait…" },
];

// Hook layer: the QR tent and the headline. `h` is negative during the run-up at the end of the video.
const Hook: React.FC<{ h: number }> = ({ h }) => {
  const { fps } = useVideoConfig();
  if (h >= 72) return null;
  const scale = h < 0 ? interpolate(h, [-LOOP, 0], [2.4, 1.12]) : 1 + 0.12 * Math.cos(h * 0.55) * Math.exp(-h / 6);
  const inOp = h < 0 ? interpolate(h, [-LOOP, -LOOP + 5], [0, 1], clamp) : 1;
  const textOut = interpolate(h, [34, 39], [0, 1], clamp);
  const slideIn = h < 0 ? interpolate(h, [-LOOP, 0], [-900, 0], { easing: (t) => 1 - (1 - t) * (1 - t) }) : 0;
  const tentOut = interpolate(h, [64, 72], [0, 1], { ...clamp, easing: (t) => t * t });
  const x1 = interpolate(h, [36, 41], [0, 1], clamp);
  const x2 = interpolate(h, [41, 46], [0, 1], clamp);
  const xPop = spring({ frame: h - 36, fps, config: { damping: 10, stiffness: 300 } });
  const jolt = shake(h, 36, 26) + shake(h, 41, 20);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: MID_X - 260 + slideIn - tentOut * 1100 + jolt,
          top: TENT_TOP,
          width: 520,
          height: 640,
          rotate: `${Math.sin((h + LOOP) / 5) * 3 * (h < 36 ? 1 : 0.2) - tentOut * 20}deg`,
        }}
      >
        <QrTent style={{ left: 0, top: 0 }} />
        {h >= 36 && <RedX size={620} p1={x1} p2={x2} style={{ left: -50, top: 10, scale: `${0.8 + 0.2 * xPop}` }} />}
      </div>
      {textOut < 1 && (
        <TikText top={290} size={108} style={{ scale: `${scale * (1 - textOut * 0.5)}`, opacity: inOp * (1 - textOut) }}>
          Stop putting
          <br />
          <Hi color={RED}>QR codes</Hi> on
          <br />
          your tables
        </TikText>
      )}
    </>
  );
};

// What scanning a QR code actually looks like.
const QrPhone: React.FC<{ f: number }> = ({ f }) => {
  const { fps } = useVideoConfig();
  const inn = spring({ frame: f - 64, fps, config: { damping: 14, stiffness: 150 } });
  const out = interpolate(f, [148, 154], [0, 1], clamp);
  const blur = interpolate(f, [66, 104], [16, 0], clamp);
  const linkPill = spring({ frame: f - 106, fps, config: { damping: 12 } });
  const loading = f >= 124;
  return (
    <Phone
      style={{
        left: MID_X - 250,
        top: interpolate(inn, [0, 1], [1900, 600]),
        scale: `${0.86 * (1 - out)}`,
        transformOrigin: "50% 0%",
        rotate: `${Math.sin(f / 3) * 1.5}deg`,
      }}
    >
      {!loading ? (
        <div style={{ position: "absolute", inset: 0, background: "#2B2A27", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ filter: `blur(${blur}px)`, rotate: `${Math.sin(f / 2.3) * 6 * (blur / 16) + 8}deg`, translate: `${Math.sin(f / 1.7) * blur}px 0px` }}>
            <Qr size={300} />
          </div>
          {/* focus brackets */}
          <div style={{ position: "absolute", width: 360, height: 360, border: `5px dashed ${blur > 1 ? "#FFFFFF88" : YELLOW}`, borderRadius: 30 }} />
          <div
            style={{
              position: "absolute",
              bottom: 120,
              scale: `${linkPill}`,
              padding: "18px 30px",
              borderRadius: 30,
              background: YELLOW,
              color: "black",
              fontFamily,
              fontWeight: 800,
              fontSize: 30,
            }}
          >
            menu-site.co/r?id=8x…
          </div>
        </div>
      ) : (
        <div style={{ position: "absolute", inset: 0, background: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={140} height={140} viewBox="0 0 50 50" style={{ rotate: `${f * 18}deg` }}>
            <circle cx="25" cy="25" r="20" stroke="#C9CCD4" strokeWidth="5" fill="none" />
            <path d="M25 5 A20 20 0 0 1 45 25" stroke="#4285F4" strokeWidth="5" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </Phone>
  );
};

const RaceRow: React.FC<{ f: number; top: number; label: string; fill: number; secs: string; color: string; at: number }> = ({ f, top, label, fill, secs, color, at }) => {
  const { fps } = useVideoConfig();
  const inn = spring({ frame: f - at, fps, config: { damping: 14, stiffness: 200 } });
  return (
    <div style={{ position: "absolute", left: 80, width: 800, top, opacity: inn, translate: `${(1 - inn) * -200}px 0px` }}>
      <div style={{ display: "flex", justifyContent: "space-between", ...outline(72) }}>
        <span>{label}</span>
        <span style={{ color }}>{secs}</span>
      </div>
      <div style={{ marginTop: 14, height: 56, borderRadius: 28, background: "rgba(255,255,255,0.15)", border: "4px solid black", overflow: "hidden" }}>
        <div style={{ width: `${fill * 100}%`, height: "100%", background: color, boxShadow: `0 0 30px ${color}` }} />
      </div>
    </div>
  );
};

export const TikTok2: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const qrSecs = interpolate(f, [66, 150], [0, 9], clamp);
  const tapSecs = interpolate(f, [TAP - 4, TAP], [0, 1], clamp);
  const watchIn = spring({ frame: f - 66, fps, config: { damping: 12, stiffness: 220 } });
  const watchOut = interpolate(f, [206, 212], [0, 1], clamp);

  const cardDrop = spring({ frame: f - 152, fps, config: { damping: 9, stiffness: 140 } });
  const cardOut = interpolate(f, [358, 366], [0, 1], { ...clamp, easing: (t) => t * t });
  const flickIdx = Math.max(0, Math.min(FLICK.length - 1, Math.floor((f - FLICK_AT) / FLICK_STEP)));
  const flickPop = f >= FLICK_AT ? spring({ frame: (f - FLICK_AT) % FLICK_STEP, fps, config: { damping: 9, stiffness: 400 } }) : 1;

  return (
    <AbsoluteFill style={{ fontFamily, overflow: "hidden" }}>
      <TikBg f={f} total={N} a="#2F7BFF" b="#FF3B6B" />
      <Counter top={TABLE_TOP} show={1} />

      <Caption f={f} at={38} until={64} size={120}>
        they're <Hi color={RED}>SLOW.</Hi>
      </Caption>

      {/* 2.2-5 s: the QR struggle, on a stopwatch */}
      {f >= 64 && f < 156 && <QrPhone f={f} />}
      {PAIN.map((p, i) => (
        <Caption key={p.at} f={f} at={p.at} until={PAIN[i + 1]?.at ?? 150}>
          {p.text}
        </Caption>
      ))}
      {f >= 66 && f < 212 && (
        <Stopwatch
          seconds={f < 150 ? qrSecs : f < TAP - 4 ? 0 : tapSecs}
          color={f < 150 ? (qrSecs > 6 ? RED : "white") : f >= TAP ? GREEN : "white"}
          style={{ left: MID_X - 230, top: 420, scale: `${watchIn * (1 - watchOut) * (f >= TAP ? 1 + 0.15 * Math.exp(-(f - TAP) / 5) : 1)}` }}
        />
      )}

      {/* 5-12 s: the Taply card */}
      {f >= 150 && f < 368 && (
        <ProductCard
          file={f >= FLICK_AT ? FLICK[flickIdx] : "google-review"}
          width={CARD_W}
          style={{
            left: CARD_LEFT,
            top: interpolate(cardDrop, [0, 1], [-800, CARD_TOP]) + cardOut * 1200,
            rotate: `${(1 - cardDrop) * 14 + (f >= FLICK_AT ? (1 - flickPop) * (flickIdx % 2 ? 8 : -8) : 0)}deg`,
            scale: `${f >= FLICK_AT ? 1 + (1 - flickPop) * 0.15 : 1}`,
          }}
        />
      )}
      <Caption f={f} at={152} until={TAP} size={120}>
        vs. <Hi>this</Hi>
      </Caption>
      <TapBurst f={f} tap={TAP} contact={CONTACT} row={{ x: MID_X, y: 625 }} until={208} />
      <Caption f={f} at={TAP + 2} until={208} size={100}>
        done in <Hi color={GREEN}>1 sec</Hi>
      </Caption>

      {/* 7-9.5 s: the race */}
      {f >= 210 && f < 290 && (
        <div style={{ opacity: interpolate(f, [280, 286], [1, 0], clamp) }}>
          <RaceRow f={f} at={210} top={270} label="QR code" secs={`${Math.round(interpolate(f, [214, 278], [0, 9], clamp))} sec`} fill={interpolate(f, [214, 278], [0, 1], clamp)} color={RED} />
          <RaceRow f={f} at={214} top={440} label="Taply" secs="1 sec" fill={interpolate(f, [218, 224], [0, 1], clamp)} color={GREEN} />
        </div>
      )}
      <Badge f={f} at={228} until={280} text="WINNER" top={610} color={GREEN} />

      {/* 9.5-12 s: one card for everything */}
      <Caption f={f} at={FLICK_AT + 2} until={358}>
        one card for
        <br />
        <Hi>everything</Hi>
      </Caption>

      <LinkInBio f={f} at={364} until={403} />
      <Hook h={f >= N - LOOP ? f - N : f} />

      <Sfx
        total={N}
        musicFrom={134}
        whooshes={[64, 152, 210, FLICK_AT, 364, N - LOOP + 2]}
        taps={[TAP]}
        thuds={[36, 41]}
        ticks={[87, 108, 129, ...FLICK.slice(1).map((_, i) => FLICK_AT + (i + 1) * FLICK_STEP)]}
        dings={[228]}
      />
    </AbsoluteFill>
  );
};
