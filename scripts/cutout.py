"""Remove the white studio background from product shots so they sit on a dark canvas.

Background-connected light pixels become transparent; the soft grey contact
shadow is kept as a black shadow whose opacity follows its darkness.
Usage: python3 scripts/cutout.py  (reads public/*.png, writes public/cutouts/)
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

SRC = Path(__file__).resolve().parent.parent / "public"
OUT = SRC / "cutouts"
NAMES = ["google-review", "instagram", "facebook", "tiktok", "all-in-one"]
THRESH = 200  # background lighter than this fades fully to transparent
EDGE = 238  # anything darker than this counts as product (or its shadow)
CLOSE = 6


def cutout(name: str) -> None:
    img = Image.open(SRC / f"{name}.png").convert("RGB")
    rgb = np.asarray(img).astype(np.float32)
    lum = rgb.mean(axis=2)
    sat = rgb.max(axis=2) - rgb.min(axis=2)
    # Anything visibly non-white is product or shadow; close small gaps in the
    # card outline so the fill below can't leak into the white card face.
    ink = (lum < EDGE) | (sat > 18)
    ink = ndimage.binary_closing(ink, structure=np.ones((3, 3)), iterations=CLOSE)
    solid = ndimage.binary_fill_holes(ink)
    labels, n = ndimage.label(solid)
    sizes = ndimage.sum(solid, labels, range(1, n + 1))
    keep = [i + 1 for i, sz in enumerate(sizes) if sz > 0.004 * solid.size]
    fg = ndimage.binary_erosion(np.isin(labels, keep), iterations=CLOSE // 2)
    fg = ndimage.binary_fill_holes(fg | (ink & ~(lum > THRESH)))
    bg = ~fg

    # Shadow strength: how far the background pixel is from pure white.
    shadow = np.clip((250 - lum) / (250 - THRESH), 0, 1) ** 1.3 * 0.55
    alpha = np.where(bg, shadow, 1.0)
    a_img = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    a = np.asarray(a_img).astype(np.float32) / 255
    a = np.where(bg, a, 1.0)

    out_rgb = np.where(bg[..., None], 0, rgb)
    rgba = np.dstack([out_rgb, a * 255]).astype(np.uint8)
    OUT.mkdir(exist_ok=True)
    Image.fromarray(rgba, "RGBA").save(OUT / f"{name}.png", optimize=True)
    print(name, "background %.0f%%" % (bg.mean() * 100))


for n in NAMES:
    cutout(n)
