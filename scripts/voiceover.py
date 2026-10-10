"""Generate the TikTok voiceovers with Kokoro TTS and per-word timings.

Kokoro's ONNX export only returns audio, so this exposes the duration predictor's output
(`/encoder/Clip_output_0`, frames of 600 samples per phoneme token) as a second output and
sums it per word. That gives exact word timings with no separate speech-to-text pass.

Setup (weights and voices come from npm because Hugging Face may be unreachable):
  npm pack kokoro-q8-shards && tar xzf kokoro-q8-shards-*.tgz && cat package/kokoro-q8.part{0..5}.bin > kokoro-q8.onnx
  npm pack kokoro-local-runtime && tar xzf kokoro-local-runtime-*.tgz   # voices in package/voices/
  pip install kokoro-onnx onnx soundfile
Usage:
  python3 scripts/voiceover.py <kokoro-q8.onnx> <voices dir>
Writes public/audio/voiceover.mp3, voiceover-2.mp3 and src/tiktok/voice/words-{1,2}.json.
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
import onnx
import onnxruntime as ort
import soundfile as sf
from kokoro_onnx.tokenizer import Tokenizer

ROOT = Path(__file__).resolve().parent.parent
VOICE, SPEED, SR, TRIM = "am_michael", 1.12, 24000, 0.35

# Spoken text, and what the captions show for each spoken word ("+" merges into the previous word).
BODY = (
    "Here's the truth. Nobody scans QR codes. Nobody searches for your page. They just leave. "
    "So make it one tap. They tap their phone on this card, and your review page is already open. "
    "No app. No QR code. More reviews. More followers. Works on any phone. Taply cards. "
)
SHOWN_TAIL = "From €0.56. + Link in bio."
SPOKEN_TAIL = "From fifty-six cents. Link in bio."
HOOKS = {
    1: ("Your customers love you. So why only twelve reviews? ", "Your customers love you. So why only 12 reviews? "),
    2: ("One tap, and your customer is already leaving you a review. Watch. ",) * 2,
}


def session(model_path):
    m = onnx.load(model_path)
    m.graph.node.append(onnx.helper.make_node("Identity", ["/encoder/Clip_output_0"], ["durations"]))
    m.graph.output.append(onnx.helper.make_tensor_value_info("durations", onnx.TensorProto.FLOAT, None))
    return ort.InferenceSession(m.SerializeToString())


def synth(sess, tok, voices, text):
    ph = tok.known(tok.phonemize(text))
    ids = tok.tokenize(ph)
    style = np.fromfile(f"{voices}/{VOICE}.bin", dtype=np.float32).reshape(-1, 1, 256)[len(ids)]
    wav, dur = sess.run(None, {"input_ids": np.array([[0, *ids, 0]], dtype=np.int64), "style": style, "speed": np.array([SPEED], dtype=np.float32)})
    wav, dur = wav[0], dur.reshape(-1)
    t = np.concatenate([[0], np.cumsum(dur)]) * (len(wav) / dur.sum()) / SR
    words, cur = [], None
    for i, p in enumerate(ph):
        if p == " ":
            cur = None
            continue
        if cur is None:
            cur = {"start": t[i + 1]}
            words.append(cur)
        cur["end"] = t[i + 2]
    return wav, words


def main(model_path, voices):
    sess, tok = session(model_path), Tokenizer()
    for v, (spoken, shown) in HOOKS.items():
        wav, timed = synth(sess, tok, voices, spoken + BODY + SPOKEN_TAIL)
        labels = (shown + BODY + SHOWN_TAIL).split()
        assert len(labels) == len(timed), (len(labels), len(timed))
        out = []
        for label, w in zip(labels, timed):
            s, e = round(float(w["start"]) - TRIM, 3), round(float(w["end"]) - TRIM, 3)
            if label == "+":
                out[-1]["end"] = e
            else:
                out.append({"text": label, "start": s, "end": e})
        json.dump({"duration": round(len(wav) / SR - TRIM, 3), "words": out}, open(ROOT / f"src/tiktok/voice/words-{v}.json", "w"), indent=1)
        tmp = ROOT / f"out/vo{v}.wav"
        tmp.parent.mkdir(exist_ok=True)
        sf.write(tmp, wav, SR)
        name = "voiceover" if v == 1 else "voiceover-2"
        subprocess.run(
            ["ffmpeg", "-v", "error", "-y", "-ss", str(TRIM), "-i", str(tmp), "-af",
             "highpass=f=70,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,equalizer=f=3500:t=q:w=1:g=2.5,loudnorm=I=-14:TP=-1.5:LRA=7",
             "-ar", "44100", "-ac", "1", "-b:a", "192k", str(ROOT / f"public/audio/{name}.mp3")],
            check=True,
        )


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
