"""Synthesize every sound in the Taply promo: SFX and the background track.

No samples or external files: everything is built from oscillators and noise.
Usage: python3 scripts/make_audio.py   (needs numpy + scipy; writes public/audio/*.wav)
"""
from pathlib import Path

import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 44100
OUT = Path(__file__).resolve().parent.parent / "public" / "audio"
rng = np.random.default_rng(7)

# Music grid: 120 BPM, phased so a downbeat lands on the phone tap (frame 134 @ 30 fps).
BPM = 120
BEAT = 60 / BPM
TAP_TIME = 134 / 30
GRID0 = TAP_TIME - 8 * BEAT  # first beat of the track
LENGTH = 20.0


def t_axis(sec):
    return np.arange(int(sec * SR)) / SR


def env_ad(n, attack, decay_tau):
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    return a * np.exp(-np.maximum(t - attack, 0) / decay_tau)


def lp(x, hz, order=2):
    return signal.sosfilt(signal.butter(order, hz, "low", fs=SR, output="sos"), x)


def hp(x, hz, order=2):
    return signal.sosfilt(signal.butter(order, hz, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return signal.sosfilt(signal.butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def norm(x, peak=0.9):
    return x / (np.max(np.abs(x)) + 1e-9) * peak


def save(name, x):
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    wavfile.write(OUT / f"{name}.wav", SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))
    print(f"{name}.wav  {len(x) / SR:.2f}s")


def note(midi):
    return 440 * 2 ** ((midi - 69) / 12)


# ---------- SFX ----------

def tap():
    n = int(0.25 * SR)
    t = np.arange(n) / SR
    # Soft finger-on-acrylic: a short low thump, a glassy tick and a breath of noise.
    f = 170 * np.exp(-t / 0.03) + 70
    thump = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ad(n, 0.002, 0.045)
    tick = np.sin(2 * np.pi * 2600 * t) * env_ad(n, 0.0005, 0.012) * 0.35
    click = bp(rng.standard_normal(n), 1500, 6000) * env_ad(n, 0.0003, 0.006) * 0.25
    return norm(thump + tick + click, 0.8)


def whoosh(dur=0.55):
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal((n, 2))
    # State-variable band-pass whose centre sweeps up then down.
    shape = np.sin(np.pi * t / dur) ** 1.5
    fc = 250 + 3800 * shape
    out = np.zeros((n, 2))
    for ch in range(2):
        low = band = 0.0
        q = 0.9
        x = noise[:, ch]
        for i in range(n):
            f = 2 * np.sin(np.pi * fc[i] / SR)
            high = x[i] - low - q * band
            band += f * high
            low += f * band
            out[i, ch] = band
    pan = np.linspace(-0.6, 0.6, n)  # travels left to right
    out[:, 0] *= np.sqrt((1 - pan) / 2)
    out[:, 1] *= np.sqrt((1 + pan) / 2)
    out *= (np.sin(np.pi * t / dur) ** 2)[:, None]
    return norm(out, 0.7)


def bell(freq, dur, amp=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for ratio, a, tau in [(1, 1, 0.9), (2.0, 0.35, 0.45), (3.01, 0.18, 0.25), (4.2, 0.1, 0.15)]:
        out += a * np.sin(2 * np.pi * freq * ratio * t + ratio) * np.exp(-t / tau)
    return out * np.clip(t / 0.003, 0, 1) * amp


def ding():
    dur = 1.6
    n = int(dur * SR)
    out = np.zeros(n)
    # Rising two-note chime (E6 then B6) with a soft octave below for body.
    for start, midi, amp in [(0.0, 88, 0.9), (0.0, 76, 0.25), (0.09, 95, 1.0)]:
        s = int(start * SR)
        b = bell(note(midi), dur - start, amp)
        out[s:s + len(b)] += b
    # A little stereo shimmer from two short delays.
    left = out + 0.25 * np.roll(out, int(0.011 * SR))
    right = out + 0.25 * np.roll(out, int(0.017 * SR))
    st = np.stack([left, right], axis=1)
    st *= np.minimum(1, (dur - np.arange(n) / SR) / 0.2)[:, None]
    return norm(st, 0.75)


# ---------- Music ----------

def saw(freq, t, detune=0.0):
    return signal.sawtooth(2 * np.pi * freq * (1 + detune) * t)


def track():
    n = int(LENGTH * SR)
    t = np.arange(n) / SR
    mix = np.zeros((n, 2))
    duck = np.ones(n)  # sidechain pump from the kick

    beats = [GRID0 + k * BEAT for k in range(int((LENGTH - GRID0) / BEAT) + 1)]
    drop = TAP_TIME  # drums and bass enter on the tap

    def place(buf, at, stereo=(1.0, 1.0)):
        s = int(round(at * SR))
        if s >= n:
            return
        if s < 0:
            buf, s = buf[-s:], 0
        e = min(n, s + len(buf))
        if buf.ndim == 1:
            mix[s:e, 0] += buf[: e - s] * stereo[0]
            mix[s:e, 1] += buf[: e - s] * stereo[1]
        else:
            mix[s:e] += buf[: e - s]

    # Am - F - C - G, one chord per bar.
    prog = [[57, 60, 64], [53, 57, 60], [48, 52, 55, 60], [55, 59, 62]]
    bass_roots = [45, 41, 48, 43]
    bar = 4 * BEAT

    def chord_at(time):
        idx = int(np.floor((time - GRID0) / bar)) % 4
        return prog[idx], bass_roots[idx]

    # Pad: detuned saws, low-passed, one per bar (the first bar starts before 0 as a swell).
    k = -1
    while GRID0 + k * bar < LENGTH:
        start = GRID0 + k * bar
        ch, _ = chord_at(start + 0.01)
        seg = t_axis(bar + 0.3)
        pad = np.zeros(len(seg))
        for m in ch:
            for d in (-0.004, 0.0, 0.005):
                pad += saw(note(m + 12), seg, d)
        pad = lp(pad, 1400 if start + bar > drop else 900) * 0.05
        pad *= np.minimum(1, seg / 0.25) * np.minimum(1, (seg[-1] - seg) / 0.3)
        place(pad, start, (0.9, 1.0))
        k += 1

    # Arp: 16ths over chord tones, plucky; brighter after the drop.
    step = BEAT / 4
    i = 0
    while GRID0 + i * step < LENGTH - 0.3:
        at = GRID0 + i * step
        ch, _ = chord_at(at + 0.001)
        tones = ch + [ch[0] + 12]
        m = tones[[0, 1, 2, 3, 2, 1, 3, 2][i % 8]] + 12
        seg = t_axis(0.22)
        pl = (saw(note(m), seg) * 0.6 + np.sin(2 * np.pi * note(m) * seg)) * env_ad(len(seg), 0.002, 0.07)
        pl = lp(pl, 2600 if at >= drop else 1500) * (0.07 if at >= drop else 0.05)
        pan = 0.35 * np.sin(i * 0.9)
        place(pl, at, (1 - pan, 1 + pan))
        i += 1

    # Noise riser into the drop.
    rs = t_axis(2 * BEAT)
    riser = bp(rng.standard_normal(len(rs)), 800, 6000) * (rs / rs[-1]) ** 2 * 0.12
    place(riser, drop - 2 * BEAT)

    for bi, b in enumerate(beats):
        if b < drop - 1e-6 or b > LENGTH - 0.05:
            continue
        # Kick
        seg = t_axis(0.35)
        f = 45 + 95 * np.exp(-seg / 0.035)
        kick = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ad(len(seg), 0.001, 0.12) * 0.55
        place(kick, b)
        s = int(b * SR)
        e = min(n, s + int(0.3 * SR))
        duck[s:e] = np.minimum(duck[s:e], 0.45 + 0.55 * np.clip(np.arange(e - s) / (0.22 * SR), 0, 1))
        # Off-beat open hat
        seg = t_axis(0.12)
        hat = hp(rng.standard_normal(len(seg)), 7000) * env_ad(len(seg), 0.001, 0.035) * 0.09
        place(hat, b + BEAT / 2, (0.8, 1.0))
        # Closed hats on the in-between 16ths
        for q in (1, 3):
            seg = t_axis(0.05)
            ch_hat = hp(rng.standard_normal(len(seg)), 9000) * env_ad(len(seg), 0.0005, 0.012) * 0.045
            place(ch_hat, b + q * BEAT / 4, (1.0, 0.8))
        # Clap on 2 and 4
        if bi % 2 == 1:
            seg = t_axis(0.25)
            clap = bp(rng.standard_normal(len(seg)), 900, 3500)
            env = sum(env_ad(len(seg), 0.001, 0.01) * (np.arange(len(seg)) >= int(d * SR)) for d in (0, 0.011, 0.022))
            clap = clap * (env + env_ad(len(seg), 0.001, 0.08) * 0.6) * 0.13
            place(clap, b)
        # Bass: root on the off-8th, octave bounce on the last 16th
        _, root = chord_at(b + 0.001)
        for q, oct_ in ((0.5, 0), (0.75, 12)):
            seg = t_axis(BEAT / 4)
            fb = note(root - 12 + oct_)
            bass = (saw(fb, seg) * 0.5 + np.sin(2 * np.pi * fb * seg)) * env_ad(len(seg), 0.003, 0.09)
            place(lp(bass, 700) * 0.22, b + q * BEAT)

    # Crash on the last downbeat.
    last = max(bb for bb in beats if bb <= LENGTH - 0.05)
    cym = hp(rng.standard_normal(int(1.2 * SR)), 5000) * env_ad(int(1.2 * SR), 0.002, 0.4) * 0.06
    place(cym, last)

    # Light whole-mix pump from the kick, fades at both ends, soft-clip glue.
    mix *= (0.35 + 0.65 * duck)[:, None]
    fade = np.minimum(1, (LENGTH - t) / 0.6) * np.minimum(1, t / 0.4)
    mix *= fade[:, None]
    mix = np.tanh(norm(mix, 0.95) * 1.2) / np.tanh(1.2)
    return norm(mix, 0.9)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    save("tap", tap())
    save("whoosh", whoosh())
    save("ding", ding())
    save("music", track())
