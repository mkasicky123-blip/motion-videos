# motion-videos

Promo videos built with [Remotion](https://www.remotion.dev).

## Taply promo (`TaplyPromo`)

20-second vertical (1080×1920, 30 fps) promo for [nfctaply.com](https://nfctaply.com).
Rendered output: [`out/taply-promo.mp4`](out/taply-promo.mp4).

- `src/TaplyPromo.tsx` stitches the scenes with transitions; each scene lives in `src/scenes/` and is also registered on its own under *Scenes* in the Studio.
- Product shots (transparent PNGs) are in `public/`.
- Inter is bundled in `public/fonts/` so rendering works offline.

```bash
bun install
bun run dev                                          # Remotion Studio
npx remotion render TaplyPromo out/taply-promo.mp4   # render the MP4
```

The official Remotion agent skills are installed in `.claude/skills/`.
