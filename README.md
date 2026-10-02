# motion-videos

Promo videos built with [Remotion](https://www.remotion.dev).

## Taply promo (`TaplyPromo`)

20-second vertical (1080×1920, 30 fps) promo for [nfctaply.com](https://nfctaply.com).
Rendered output: [`out/taply-promo.mp4`](out/taply-promo.mp4).

- `src/TaplyPromo.tsx` stitches the scenes with transitions; each scene lives in `src/scenes/` and is also registered on its own under *Scenes* in the Studio.
- Product shots (transparent PNGs) are in `public/`.
- All audio is synthesized in code by `scripts/make_audio.py` (numpy + scipy) into `public/audio/`: tap, whoosh, success ding and a 20 s 120 BPM music bed whose drop lands on the tap. `src/Soundtrack.tsx` places it on the timeline.
- Inter is bundled in `public/fonts/` so rendering works offline.

```bash
bun install
bun run dev                                          # Remotion Studio
npx remotion render TaplyPromo out/taply-promo.mp4   # render the MP4
```

The official Remotion agent skills are installed in `.claude/skills/`.
