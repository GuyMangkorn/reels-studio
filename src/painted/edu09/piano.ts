// PIANO-CLOSE (brief EDU-EP09-BRIEF-R1.2, set-cm): origin at the front edge of middle C's key top, +x along the keyboard (treble), +y up,
// +z toward the player. White keys 2.3 x 14.5, black keys 1.3 x 9.0 raised 1.1; a pressed key drops 1.0. Soft cool top light, dark warm
// surround, black lacquer case with no logo. Look-frame code for LF04 (S01-B04-SH01). The pianist's hand placement here is a PLACEHOLDER key
// contact (a curved-finger pose solved so the playing fingertip lands on its key); the real piano wrist/key poses are W5 work (brief N8).
import {hardFill, inkLine} from '../kit/draw';
import {macroHand, macroSkeleton, paintHandMacro, type HandAnchors, type HandMacro, type LongFingerId} from '../kit/hands';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoly, type YCam} from '../kit/ycam';
import {look} from './handclose';
import {PIANIST_TONE} from './palette';

export const WK = 2.3, WL = 14.5, BK = 1.3, BL = 9.0, BH = 1.1, DROP = 1.0;
/** PIANO R1.2 (W3): `cam: (6, 2, 2), yaw 80 -> 74, r 34 -> 31, eye 40, f 2300, hy 880`. The R1.1 line (yaw 35, eye 22) sat over the player's
 * shoulder, so the forearm filled the lower half of the frame; from the treble side the forearm reads at its length and all five fingers show. */
export const pianoCam = (u: number): YCam => look([6, 2, 2], 80 + (74 - 80) * u, 34 + (31 - 34) * u, 40, 2300, 880);

const COL = {surround: '#2a2320', lacquer: '#16161a', lacquerLit: '#3a3d48', felt: '#7a2630', white: '#f3f1ea', whiteShade: '#c9cdd4', whiteFront: '#dcdcd6', black: '#1b1b20', blackTop: '#3b3e48', light: '#e8eef6'};
/** White keys from -7 (an octave below middle C) to +13; black keys sit on these white-key boundaries (C#, D#, F#, G#, A#). */
const WHITE = Array.from({length: 21}, (_, i) => i - 7);
const isBlackAfter = (w: number) => [0, 1, 3, 4, 5].includes(((w % 7) + 7) % 7);

export type PianoOpts = {pressed?: number[]};

export const paintPiano = (p: Painter, c: YCam, o: PianoOpts = {}) => {
  const P = (pts: V3[]) => camPoly(c, pts);
  hardFill(p, 900, COL.surround, [[-20, -20], [1100, -20], [1100, 1940], [-20, 1940]]);
  // case: the key bed below, the fallboard behind the keys with a felt strip, cheek blocks at the ends
  hardFill(p, 901, COL.lacquer, P([[-30, -6, 2], [40, -6, 2], [40, -6, -40], [-30, -6, -40]]));
  hardFill(p, 902, COL.lacquer, P([[-30, 0.4, -WL - 0.4], [40, 0.4, -WL - 0.4], [40, 14, -WL - 0.4], [-30, 14, -WL - 0.4]]));
  hardFill(p, 903, COL.lacquerLit, P([[-30, 14, -WL - 0.4], [40, 14, -WL - 0.4], [40, 14, -WL - 4], [-30, 14, -WL - 4]]));
  hardFill(p, 904, COL.felt, P([[-30, 0.2, -WL - 0.3], [40, 0.2, -WL - 0.3], [40, 1.0, -WL - 0.3], [-30, 1.0, -WL - 0.3]]));
  hardFill(p, 905, COL.lacquer, P([[-30, -3, 1.8], [40, -3, 1.8], [40, 0, 1.8], [-30, 0, 1.8]]));
  // a cool reflection streak on the fallboard (the top light)
  hardFill(p.layer(0.35, 9100), 906, COL.lacquerLit, P([[-30, 9, -WL - 0.38], [40, 9, -WL - 0.38], [40, 10.5, -WL - 0.38], [-30, 10.5, -WL - 0.38]]));
  // white keys: top + front lip
  for (const w of WHITE) {
    const x0 = w * WK + 0.06, x1 = (w + 1) * WK - 0.06, d = o.pressed?.includes(w) ? -DROP : 0;
    const top = P([[x0, d, 0], [x1, d, 0], [x1, d, -WL], [x0, d, -WL]]), front = P([[x0, d, 0], [x1, d, 0], [x1, d - 1.6, 0], [x0, d - 1.6, 0]]);
    hardFill(p, 910 + w + 7, d ? mixColor(COL.white, COL.whiteShade, 0.45) : COL.white, top);
    hardFill(p, 940 + w + 7, COL.whiteFront, front);
    inkLine(p, 970 + w + 7, top, {color: '#8d929c', weight: 0.9, still: true});
    // soft light fall-off toward the back of the key (under the fallboard shadow)
    hardFill(p.layer(0.28, 9200 + w + 7), 1000 + w + 7, COL.whiteShade, P([[x0, d + 0.01, -WL * 0.62], [x1, d + 0.01, -WL * 0.62], [x1, d + 0.01, -WL], [x0, d + 0.01, -WL]]));
  }
  // black keys: box with a lit top
  for (const w of WHITE) {
    if (!isBlackAfter(w) || w === WHITE[WHITE.length - 1]) continue;
    const cx = (w + 1) * WK, x0 = cx - BK / 2, x1 = cx + BK / 2, z0 = -WL, z1 = -WL + BL;
    hardFill(p, 1100 + w + 7, COL.black, P([[x0, 0, z1], [x1, 0, z1], [x1, BH, z1], [x0, BH, z1]]));
    hardFill(p, 1130 + w + 7, COL.black, P([[x1, 0, z0], [x1, 0, z1], [x1, BH, z1], [x1, BH, z0]]));
    hardFill(p, 1160 + w + 7, COL.black, P([[x0, 0, z0], [x0, 0, z1], [x0, BH, z1], [x0, BH, z0]]));
    const top = P([[x0 + 0.1, BH, z1 - 0.3], [x1 - 0.1, BH, z1 - 0.3], [x1 - 0.1, BH, z0], [x0 + 0.1, BH, z0]]);
    hardFill(p, 1190 + w + 7, COL.blackTop, top);
  }
};

/** The five playing fingers over the C-G position of the right hand (thumb C, index D, middle E, ring F, little G); value = white-key index
 * (middle C = 0) for `paintPiano({pressed})`. */
export type PianoFinger = LongFingerId | 'thumb';
export const FINGER_KEY: Record<PianoFinger, number> = {thumb: 0, index: 1, middle: 2, ring: 3, little: 4};
/** Fingers to keys for a press set (W5.2, SD05: dyads and the closing chord press several fingers at once). */
export const keysOf = (press: readonly PianoFinger[]): number[] => press.map((f) => FINGER_KEY[f]);

/** SD05 provisional tune (SHEETS-R2 S01-B04-SH01, shot-local frames): mixed finger order, a dyad (C+E) and the closing C+E+G chord, all inside C-G.
 * Each entry holds from `f` until 1 f before the next onset (the last until `END`); the held dyad and chord keep their press sets. Editor re-times
 * `f` onto M2's note onsets, one press per audible note; the rules (no five-finger run, no stretch) stay. */
export const TUNE_END = 140;
export const PIANO_TUNE: readonly {f: number; press: readonly PianoFinger[]}[] = [
  {f: 0, press: ['middle']}, {f: 10, press: ['little']}, {f: 20, press: ['ring']}, {f: 30, press: ['index']},
  {f: 42, press: ['thumb', 'middle']}, {f: 64, press: ['index']}, {f: 74, press: ['ring']}, {f: 84, press: ['middle']},
  {f: 96, press: ['little']}, {f: 108, press: ['thumb', 'middle', 'little']},
];
/** Press set at shot-local frame `f`: [] before the first note, between notes, and after TUNE_END; keys are down for 1 f less than the gap (legato). */
export const tuneAt = (f: number, tune = PIANO_TUNE): readonly PianoFinger[] => {
  for (let i = tune.length - 1; i >= 0; i--) {
    if (f < tune[i].f) continue;
    const last = i === tune.length - 1, end = last ? TUNE_END : tune[i + 1].f - 1;
    // the dyad is held to L60 (SHEETS-R2), then a short gap before D at L64
    const held = tune[i].press.length === 2 ? 60 : end;
    return f <= held ? tune[i].press : [];
  }
  return [];
};
/** Key-depress fraction 0..1 with a 2 f travel (key down 1.0 cm in 2 f); `PIANO_TUNE` onsets are the press start. */
export const pressDepth = (f: number, onset: number): number => Math.max(0, Math.min(1, (f - onset + 1) / 2));

const PRESS_FLEX = 10;
/** Pianist's right hand, size 1.2, curved fingers over C-G. `press` is one finger, a set of fingers (dyad, chord) or null; each pressing finger
 * flexes a little more so its tip sits about 1 cm lower, on its dropped key (`paintPiano({pressed: keysOf(press)})`). The wrist height is solved
 * from the RESTING pose (index and ring tips on the key tops), so it does not move when different fingers press. `depth` (0..1) eases the press. */
export const pianistHand = (press: PianoFinger | readonly PianoFinger[] | null, base = 2000, depth = 1): HandMacro => {
  const set: readonly PianoFinger[] = press === null ? [] : typeof press === 'string' ? [press] : press;
  const curved = {mcp: 14, pip: 34, dip: 12, abd: 0};
  const rest: HandMacro = {
    ...macroHand('flat', {side: 1, size: 1.2, base, tone: PIANIST_TONE, plane: 0, at: [6.6, 8.5], shadowDir: [0.05, -1, 0.18], shadowAlpha: 0.3, shadowColor: '#1d2230'}),
    pitch: 2, roll: 0,
    fingers: {index: {...curved, abd: 1}, middle: curved, ring: {...curved, abd: -1}, little: {...curved, mcp: 18, abd: -3}},
    thumb: {cmc: 22, cmcAbd: 30, mcp: 10, ip: 8},
    elbow: [11, 8, 31],
    sleeve: {to: [11, 8, 31], color: PIANIST_TONE.sleeve, shade: PIANIST_TONE.sleeveShade, cuff: 0.14},
  };
  // solve the wrist height so the resting fingertips (index, ring) touch the key tops (y 0): lowest tip pad at 0
  const sk = macroSkeleton(rest), tipLow = Math.min(...(['index', 'ring'] as const).map((f) => sk.fingers[f].joints[3][1] - sk.fingers[f].radii[3]));
  let h: HandMacro = {...rest, wrist: [rest.wrist[0], rest.wrist[1] - tipLow, rest.wrist[2]]};
  for (const f of set) {
    if (f === 'thumb') h = {...h, thumb: {...h.thumb, cmc: h.thumb.cmc + 8 * depth}};
    else h = {...h, fingers: {...h.fingers, [f]: {...h.fingers[f], mcp: h.fingers[f].mcp + PRESS_FLEX * depth}}};
  }
  return h;
};

export const paintPianist = (p: Painter, c: YCam, h: HandMacro): HandAnchors => paintHandMacro(p, c, h);
export type {Pt};
