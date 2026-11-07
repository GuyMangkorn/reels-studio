import type {FigAnchors} from '../kit/cast';
import {mixColor, tintPainter, type Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, orbitYCam, type YCam} from '../kit/ycam';
import {paintOwn} from './cast';
import {paintCatFace, type CatCam, type CatFace} from '../kit/catface';
import {paintEyeMacro} from '../kit/eye';
import {catItem, LAMP, paintRoom, SEAT} from './room';

// EDU-EP06-SHORT look frames (brief EDU-EP06-BRIEF-R1.1, rows EDU-EP06-ROWS-R1.2, workflow W3). LOOK-FRAME CODE (Film, 2026-11-07):
// pure paint functions of the frame. Cameras follow the brief's shot plan; W3 changes to its `est` values are marked "W3".
// LF01 room two-shot (S01-B01-SH01), LF02 cat answer (S01-B04-SH01), LF03 her eye warm (S01-B03-SH02), LF04 glare (S01-B02-SH02);
// CF1-CF3 the cat-face look check (VD18: B01 tension, turned away, B04 answer).

const FPS = 30;
const DEG = Math.PI / 180;
export const LF_FRAMES = {LF01: 54, LF02: 60, LF03: 4, LF04: 66, CF1: 30, CF2: 30, CF3: 30, CFa: 30} as const;
/** The frame of each composition used as the look still. LF03 frames 0-3 are the lid states (wide, neutral, smile, shut). */
export const LOOK_FRAME = {LF01: 27, LF02: 59, LF03: 2, LF04: 33, CF1: 15, CF2: 15, CF3: 15, CFa: 15} as const;
export const MEASURE: Record<string, FigAnchors | null> = {};

const ease = (frame: number, n: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, frame / (n - 1)));
const orbit = (at: V3, yaw: number, r: number, eye: number, f: number, hy: number): YCam => orbitYCam(at, r, yaw * DEG, eye, f, hy);

// ---- LF01: brief `cam: T-PAIR, yaw +28 -> +20 arc, r 1.50 -> 1.35 m, eye 1.00, f 1050, hy 760`; W3 r 1.75 -> 1.60, cx +60
// (her card stands at the feet line z +0.05, nearer the lens than the brief's hips, so the brief's radius cut her off at frame left).
export const T_PAIR: V3 = [0.15, 0.95, -0.4];
export const camLF01 = (frame: number): YCam => { const e = ease(frame, LF_FRAMES.LF01); return {...orbit(T_PAIR, 28 - 8 * e, 1.75 - 0.15 * e, 1.0, 1050, 760), cx: 60}; }; // W3: r 1.75 -> 1.60 (brief 1.50 -> 1.35), cx +60: both in frame
/** The lamp shade in the picture (the screen-space lamp pool in look.tsx, ENV-GLOW `Spot`). */
export const lampPx = (frame: number) => camPoint(camLF01(frame), LAMP);
export const paintLF01 = (p: Painter, frame: number) => {
  const e = ease(frame, LF_FRAMES.LF01), t = frame / FPS, c = camLF01(frame);
  const out: {a?: FigAnchors | null} = {};
  // W3: the armchair and table edges at the frame corners read as blobs at this radius; LF01 leaves them out (`fore: false`)
  paintRoom(p, c, {t, fore: false, dressing: false, cast: [
    // the cat on the right cushion, facing her, eyes soft (CL03: K1 lid control missing; the kit eye reads at this size only as a dot)
    catItem([0.45, SEAT, -0.42], {view: 'left', state: 'sit'}, 0.7),
    {at: [-0.15, 0, 0.05], draw: (q, cc) => {
      // lean-in (`new: seated-lean-in` est: P31 + upper-body lean toward the cat), eyes wide, no blink (CL02)
      out.a = paintOwn(q, cc, {at: [-0.15, 0, 0.05], view: 'front', pose: 'P31', face: 'happy', faceState: {eyes: 'wide', brow: 'up', look: [0.7, 0.1]}, t: 0.2, warm: 0.08,
        fig: {lean: 0.12 + 0.06 * e, headCock: 6}});
    }},
  ]});
  MEASURE.LF01 = out.a ?? null;
};

// ---- Eye plates (EYE set-cm). EP02 LF03 camera as the base; B03-SH02 `yaw -6 -> -3, push 10 %`, B02-SH02 `yaw -4 -> -2, push 12 %`.
const eyeCam = (yaw: number, r: number): YCam => ({...orbitYCam([0, 0, 0], r, yaw * DEG, 0, 1000, 880), pitch: 0});
const WARM = (p: Painter) => tintPainter(p, '#ffb060', 0.14, {mul: [1.04, 0.98, 0.9], brush: true});
const LIDS = [{lid: 1.3, lift: 0}, {lid: 1, lift: 0}, {lid: 0.75, lift: 1}, {lid: 0, lift: 0.2}] as const;
export const paintLF03 = (p: Painter, frame: number) => {
  const st = LIDS[Math.min(3, frame)];
  paintEyeMacro(WARM(p), eyeCam(-4.5, 0.3), {t: 1, u: 0, mist: false, catch: 'warm', lid: st.lid, lift: st.lift});
};
// ---- LF04 glare: the same eye held wide, cool key from above-front, hard brow shadow, one sharp catchlight; grade at full.
export const paintLF04 = (p: Painter, frame: number) => {
  const e = ease(frame, LF_FRAMES.LF04);
  const g = tintPainter(p, '#1f2a3f', 0.3, {mul: [0.8, 0.82, 0.92], brush: true});
  paintEyeMacro(g, eyeCam(-4 + 2 * e, 0.3 - 0.03 * e), {t: 1, u: 0, mist: false, catch: 'sharp', lid: 1.3, glare: 1});
  // the background drops to cool dark toward the frame edges (screen layer in look.tsx carries the vignette)
  void mixColor;
};

// ---- Cat face (CATFACE set-cm): brief `cam: CATFACE, r 14 -> 13 set-cm, f 1000, hy 820`.
const CAT_CAM: CatCam = {r: 14, f: 1000, hy: 820};
export const CF_STATES: Record<'CF1' | 'CF2' | 'CF3', CatFace> = {
  CF1: {lid: 0, pupil: 0.9, ears: 1, whiskers: 1, yaw: 4, brow: 0, gaze: [0, 0]}, // B01 tension (SH03 end + SH04 ears)
  CF2: {lid: 0.15, pupil: 0.5, ears: 0.5, whiskers: 0.4, yaw: -45, brow: 0, gaze: [-0.3, 0]}, // turned away (B02-B03, B04-SH01 start)
  CF3: {lid: 0.58, pupil: 0.35, ears: 0.05, whiskers: 0, yaw: 0, brow: 1, gaze: [0, 0]}, // B04 answer half-close
};
const cf = (k: keyof typeof CF_STATES) => (p: Painter, frame: number) => paintCatFace(p, CAT_CAM, CF_STATES[k], {t: frame / FPS});
export const paintCF1 = cf('CF1');
export const paintCF2 = cf('CF2');
export const paintCF3 = cf('CF3');
// W3 v2 / user pick (2026-11-07): style CFa (painted, soft fur) is the cat face; CFb (storybook) and CFc (ink) were dropped.
export const paintCFa = cf('CF3');

// ---- LF02 the answer, S01-B04-SH01 end frame: head turned back (yaw 0), lids at 0.58, brow relaxed, halo bloom + motes to screen left.
export const paintLF02 = (p: Painter, frame: number) => {
  const u = frame / (LF_FRAMES.LF02 - 1);
  paintCatFace(p, {...CAT_CAM, r: 14 - u}, {...CF_STATES.CF3}, {t: frame / FPS, halo: 0.7, motes: 0.9});
};
