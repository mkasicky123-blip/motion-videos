import words1 from "./words-1.json";
import words2 from "./words-2.json";

// Word timings come from the TTS model's own duration predictor (scripts/voiceover.py),
// so every cut, tap and caption below is keyed to a spoken word, not a hand-picked frame.
export type Word = { text: string; start: number; end: number };
export type Version = 1 | 2;

const FPS = 30;
// Captions and cuts land a hair before the sound, which reads as "on the word".
const LEAD = 0.05;

export const VOICES = {
  1: { src: "audio/voiceover.mp3", words: words1.words as Word[], duration: words1.duration, hookWords: 9 },
  2: { src: "audio/voiceover-2.mp3", words: words2.words as Word[], duration: words2.duration, hookWords: 12 },
} as const;

export const TAIL = 30; // frames after the last word for the CTA to breathe

export const framesFor = (v: Version) => Math.ceil(VOICES[v].duration * FPS) + TAIL;

export type Timeline = {
  words: Word[];
  /** Frame a word starts at, by index into the whole script. */
  w: (i: number) => number;
  /** Frame a body word starts at; the body is the shared script after the hook. */
  b: (k: number) => number;
  /** Frame a word ends at. */
  wEnd: (i: number) => number;
  hookWords: number;
  total: number;
};

export const timeline = (v: Version): Timeline => {
  const { words, hookWords } = VOICES[v];
  const w = (i: number) => Math.max(0, Math.round((words[i].start - LEAD) * FPS));
  return {
    words,
    w,
    b: (k) => w(hookWords + k),
    wEnd: (i) => Math.round(words[i].end * FPS),
    hookWords,
    total: framesFor(v),
  };
};

// Body word indices, so scenes read as "the word 'tap'" instead of a magic number.
export const B = {
  truth: 0,
  nobody1: 3,
  codes: 6,
  nobody2: 7,
  searches: 8,
  page: 11,
  they: 12,
  leave: 14,
  so: 15,
  tap1: 19,
  they2: 20,
  tap: 21,
  and: 27,
  open: 33,
  noApp: 34,
  noQr: 36,
  code: 38,
  moreReviews: 39,
  moreFollowers: 41,
  followers: 42,
  works: 43,
  any: 45,
  phone: 46,
  taply: 47,
  from: 49,
  price: 50,
  link: 51,
} as const;
