import timing from '../../../scripts/the-bloop/short/timing-gemini-take3.json';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import type {PaintedLabel, Scene, SceneSoundCue} from '../../scenes/types';

/**
 * BLOOP-EP01-SHORT (Editor): Mark's estimated G (`BLOOP-SHEETS-R4`, est. frames) → composition frames through the
 * measured Niwat phrase knots in `scripts/the-bloop/short/timing.json` (tts-measure.py, plan-timing.py). Between knots
 * the map is linear, so offsets inside a phrase scale with the phrase length; after the last phrase the est silence,
 * rise, rush, fade and black keep their durations (a shift). Plate clocks stay 1:1 inside each piece and re-sync at
 * every knot, so picture events stay on their phrase. Clip-driven windows (the real clip, the crack, the clip label
 * ends) are given in composition frames, because the sound does not move with the phrase.
 */
export const FPS = 30;

type Knot = {e: number; c: number};
const raw: Knot[] = [{e: 0, c: 0}];
// R8 (BLOOP-SHEETS-R8) values are composition frames already: each measured take 3 knot maps to itself.
for (const k of timing.knots) raw.push({e: k.compOn, c: k.compOn}, {e: k.compEnd, c: k.compEnd});
const knots = raw
  .sort((a, b) => a.e - b.e || a.c - b.c)
  .reduce<Knot[]>((out, k) => {
    const last = out[out.length - 1];
    if (last && last.e === k.e) last.c = Math.max(last.c, k.c);
    else out.push({...k});
    return out;
  }, []);
for (let i = 1; i < knots.length; i++) {
  if (knots[i].c < knots[i - 1].c) throw new Error(`BLOOP timing knots not monotonic at est ${knots[i].e}`);
}
const LAST = knots[knots.length - 1];
const SHIFT = LAST.c - LAST.e;
/** Composition frames of the est timeline's end (`durationFrames` after the post-VO shift). */
export const END = 2127; // R8: B10 P1–P6 end at the P6 black hold (G2097–G2127)

/** Est G → composition frame. */
export const compAt = (e: number): number => {
  if (e >= LAST.e) return Math.round(e + SHIFT);
  const i = knots.findIndex((k) => k.e >= e);
  if (knots[i].e === e) return knots[i].c;
  const a = knots[i - 1], b = knots[i];
  return Math.round(a.c + ((e - a.e) * (b.c - a.c)) / (b.e - a.e));
};

/** Composition frame → est G (inverse of `compAt`, unrounded). */
export const estAt = (c: number): number => {
  if (c >= LAST.c) return c - SHIFT;
  // Zero-length gaps give two knots one composition frame; the later est G (the next phrase onset) owns that frame.
  let j = 0;
  for (let i = 0; i < knots.length; i++) if (knots[i].c <= c) j = i;
  if (knots[j].c === c) return knots[j].e;
  const a = knots[j], b = knots[j + 1];
  return a.e + ((c - a.c) * (b.e - a.e)) / (b.c - a.c);
};

/** One painted plate starting at est G `e`. A shot's first cue is its plate time 0; later cues of the same shot keep its clock. */
export type PaintedCue = {e: number; shot: string; dissolve?: number; clock?: 'comp'};
/** Label text window in composition frames `[c0, c1)`; one per slot track. */
export type LabelWindow = {text: string; c0: number; c1: number};
export const labelWindow = (text: string, e0: number, e1: number): LabelWindow => ({text, c0: compAt(e0), c1: compAt(e1)});
export const clipWindow = (text: string, c0: number, frames: number): LabelWindow => ({text, c0, c1: c0 + frames});

export type TimedSound = {at: number; cue: Omit<SceneSoundCue, 'atSec'>}; // `at` in composition frames
export type TimedCaption = {at: number; text: string};                  // composition frames
export type Beat = {name: string; e: number};                           // est start G of each beat's scene

const BEATS: Beat[] = [
  {name: 'B01', e: 0}, {name: 'B02', e: 198}, {name: 'B03', e: 399}, {name: 'B04', e: 684}, {name: 'B05', e: 915},
  {name: 'B06', e: 1033}, {name: 'B07', e: 1204}, {name: 'B08', e: 1402}, {name: 'B09', e: 1696}, {name: 'B10', e: 1910},
];

type Piece = {c: number; shot: string; fromSec: number; dissolveSec?: number; label?: PaintedLabel};

/** Painted pieces: each cue's plate, split at every phrase knot (except inside a dissolve) and at label-window edges. */
const paintedPieces = (cues: PaintedCue[], trackA: LabelWindow[], trackB: LabelWindow[], extraEst: number[]): Piece[] => {
  // A shot's plate clock starts at its first cue (plate time 0 there); later cues of the same shot keep counting from it.
  let runE = 0;
  const plates = cues.map((cue, i) => {
    if (i === 0 || cues[i - 1].shot !== cue.shot) runE = cue.e;
    return {...cue, fromSec: (cue.e - runE) / FPS};
  });
  const dissolveAt = plates.filter((p) => p.dissolve).map((p) => ({c0: compAt(p.e), c1: compAt(p.e) + Math.round(p.dissolve! * FPS)}));
  const bp = new Set<number>([0, END]);
  for (const k of knots) bp.add(compAt(k.e));
  for (const e of [...extraEst, ...cues.map((c) => c.e), ...BEATS.map((b) => b.e)]) bp.add(compAt(e));
  for (const w of [...trackA, ...trackB]) {
    bp.add(w.c0);
    bp.add(w.c1);
  }
  // No plate split inside a dissolve window: the dissolve must finish before the next cue (validateScenePainted).
  for (const d of dissolveAt) for (const c of [...bp]) if (c > d.c0 && c < d.c1) bp.delete(c);
  const points = [...bp].filter((c) => c >= 0 && c <= END).sort((a, b) => a - b);
  const at = (track: LabelWindow[], c: number) => track.find((w) => w.c0 <= c && c < w.c1)?.text;
  const pieces: Piece[] = [];
  for (let i = 0; i + 1 < points.length; i++) {
    const c = points[i];
    const ea = estAt(c);
    const cue = [...plates].reverse().find((p) => p.e <= ea + 1e-6);
    if (!cue) throw new Error(`no painted cue covers composition frame ${c}`);
    const fromSec = cue.clock === 'comp' ? (c - compAt(cue.e)) / FPS + cue.fromSec : (ea - cue.e) / FPS + cue.fromSec;
    const a = at(trackA, c), b = at(trackB, c);
    const label: PaintedLabel | undefined = a && b ? [a, b] : a ? a : b ? [null, b] : undefined;
    const dissolveSec = cue.dissolve && c === compAt(cue.e) ? cue.dissolve : undefined;
    pieces.push({c, shot: cue.shot, fromSec: Math.max(0, fromSec), ...(dissolveSec ? {dissolveSec} : {}), ...(label ? {label} : {})});
  }
  return pieces;
};

/** Assemble one runtime scene per beat (composition frames), from plates, captions and sound cues. */
export const buildTimeline = (input: {cues: PaintedCue[]; trackA: LabelWindow[]; trackB: LabelWindow[]; extraEst: number[]; captions: TimedCaption[]; sounds: TimedSound[]}): Scene[] => {
  const pieces = paintedPieces(input.cues, input.trackA, input.trackB, input.extraEst);
  return assemblePaintedTimeline({
    clockRate: FPS,
    cuts: BEATS.map((beat, i) => ({id: beat.name, start: i === 0 ? 0 : compAt(beat.e), end: i + 1 < BEATS.length ? compAt(BEATS[i + 1].e) : END})),
    shots: pieces.map(p => ({at: p.c, cue: {
      shot: p.shot, fromSec: p.fromSec,
      ...(p.dissolveSec ? {dissolveSec: p.dissolveSec} : {}), ...(p.label ? {label: p.label} : {}),
    }})),
    captions: input.captions,
    sounds: input.sounds,
  });
};
