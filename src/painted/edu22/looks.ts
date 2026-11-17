import type {Painter} from '../kit/painter';
import {camOf} from '../kit/cam-moves';
import {hardFill} from '../kit/draw';
import {paintFigureAt} from '../kit/figure-at';
import {orbitYCam, type YCam} from '../kit/ycam';
import {CALLER, CHILD, LIFTERS, paintCourtCap, paintSkullcap} from './cast';
import {paintDemo} from './demo';
import {paintHall, type HallLight} from './hall';
import {camAt, childItem, lifterItems, paintChildSpread, sheetMove, type ChildState, type Probe} from './stage';

// EDU-EP22-SHORT W3 thumbnail definitions (Boss W3.1, 2026-11-16; docs/sequence-workflow.md#look-thumbnails), kept free of React so the headless
// measure (scripts/edu-series/ep22/short/measure-thumbs.ts) can run them with a no-op brush. Draft paintings (flat washes, no hatching) of the HALL
// from its first storyboard shot B01-SH01 (EDU-EP22-STORYBOARD-R1), each a different framing, staging or light balance, plus one draft of LF02
// (B04-SH14). The user picks one hall thumbnail; the finished look frames LF01 / LF01b / LF02 are painted from the pick later (not yet).
// CHK-* stills are asset checks (not thumbnails): the open dish set and the LF01b eating pose, and the cast in four views.

export type Thumb = {shot: string; note: string; paper?: string; /** Finished-grade look frame (W3.1 part 2): no guides or label unless asked. */ final?: boolean; paint: (p: Painter) => void};
export const MEASURE: Record<string, Record<string, number>> = {};
const record = (id: string, pr: Probe) => {
  const a = pr.child;
  if (!a || pr.childCapTop === undefined || pr.childVisibleBottom === undefined) return;
  MEASURE[id] = {capTop: Math.round(pr.childCapTop), visibleBottom: Math.round(pr.childVisibleBottom), leadPx: Math.round(pr.childVisibleBottom - Math.max(0, pr.childCapTop)), headX: Math.round(a.head[0]), headY: Math.round(a.head[1])};
};

// ---- B01-SH01 frame 0: sheet line `cam: H, at (-0.2, 1.0, -0.7), yaw 72 -> 64, r 1.35 -> 1.25, eye 1.05, f 1150` (hy chosen here). hy 700 at the
// v7 thumbnails; 580 from LF01 (W3.1 part 2, viewer check R-M): the picture rides 120 px up so the child's lap hands sit above the caption band.
export const SH01 = sheetMove([-0.2, 1.0, -0.7], [72, 64], [1.35, 1.25], 1.05, {f: 1150, hy: 580});
/** TH-C framing: the SH01 line pulled back and up (r 1.75, eye 1.3, pitch -7, yaw 62) so the chair, the empty CT and the LT row all read. */
export const SH01_ALT = sheetMove([-0.5, 0.95, -0.7], [62, 62], 1.75, 1.3, {f: 1150, hy: 760, pitch: [-7, -7]});
/** CHK-SH20 (B05-SH20 hold, LF01b): the sheet end camera `at (0.0, 0.8, -0.35), yaw 30, r 1.5, eye 1.5, f 1100` (hy chosen here: 640). */
export const SH20_END = sheetMove([0.0, 0.8, -0.35], [30, 30], 1.5, 1.5, {f: 1100, hy: 640});
/** B04-SH14 sheet line `cam: D, at (-0.02, 0.012, 0), yaw 9 -> 4, r 0.30 -> 0.24, pitch -50, f 1100`; eye from the pitch (at.y + r tan 50), hy 760.
 *  W3.1 (Boss, recorded for Film's W4 pass): at r 0.27 the egg is 140 px and the strip about 150 px long in the 1080 frame, too small for the
 *  tarnish to read at 540 px (UT02); the thumbnail runs the push at r 0.19 -> 0.15 and aims between the yolk and the cup (at x +0.03, z -0.005). */
export const SH14 = (u: number, hy = 760): YCam => {
  const r = 0.19 + (0.15 - 0.19) * u, yaw = 9 + (4 - 9) * u, at: [number, number, number] = [0.03, 0.012, -0.005];
  return {...orbitYCam(at, r, (yaw * Math.PI) / 180, at[1] + r * Math.tan((50 * Math.PI) / 180), 1100, hy), pitch: (-50 * Math.PI) / 180, near: 0.05};
};
/** LF02 framing (W3.1 part 2): the SH14 mid camera with the picture lowered (hy) so the egg group sits near the upper third and the hand and
 *  sleeve fill the lower half (viewer check: empty lower half). */
export const LF02_HY = 880;

const hallShot = (id: string, c: YCam, child: ChildState, light: HallLight = {}) => (p: Painter) => {
  const pr: Probe = {};
  paintHall(p, c, {light, longTable: {covers: 'on'}, items: [childItem(child, pr), ...lifterItems(0, pr)]});
  record(id, pr);
};

export const THUMBS: Record<string, Thumb> = {
  'TH-A': {shot: 'B01-SH01 f0', note: 'sheet camera; CHILD front card squared to the lens (storyboard); late-morning light', paint: hallShot('TH-A', camAt(SH01, 0), {t: 0, face: 'neutral', look: [-0.8, 0.05]})},
  'TH-B': {shot: 'B01-SH01 f0', note: 'sheet camera; CHILD in profile facing the long table (storyboard fallback: his real facing seen from 72 deg); cooler, brighter daylight', paint: hallShot('TH-B', camAt(SH01, 0), {t: 0, face: 'neutral', view: 'left'}, {warm: 0.1, key: 1.3})},
  'TH-C': {shot: 'B01-SH01 f0 (alt)', note: 'sheet line pulled back and up (r 1.75, eye 1.3, yaw 62): chair, empty CT and the LT row read together; front card; warmer, lighter light', paint: hallShot('TH-C', camAt(SH01_ALT, 0), {t: 0, face: 'neutral', look: [-0.8, 0.05]}, {warm: 0.85, key: 1.4, lift: 0.4})},
  'TH-LF02': {shot: 'B04-SH14 mid', note: 'DEMO22 draft: strip A pressed into the left yolk, tip about 40 % darkened; cool top light; cup strip B bright', paper: '#a9aeb3', paint: (p) => paintDemo(p, SH14(0.5), {stripA: 'pressed', tarnish: 0.42})},
  'CHK-SH20': {shot: 'B05-SH20 hold (asset check)', note: 'open dish set on CT (20 dishes), covers off on LT, seated-spoon-to-mouth', paint: (p) => {
    const pr: Probe = {};
    paintHall(p, camOf(SH20_END, 1), {light: {warm: 0.8}, longTable: {covers: 'off'}, items: [childItem({t: 0, face: 'happy', eat: true}, pr)], onChildTable: paintChildSpread});
    record('CHK-SH20', pr);
  }},
  // ---- Finished-grade look frames (W3.1 part 2, from the user's pick TH-A and the viewer check v7 notes)
  'LF01': {shot: 'B01-SH01 f0', final: true, note: 'TH-A pick, finished grade: CHILD front card squared to the lens, pupils toward LT (screen-left); picture up 120 px (hy 580) so the lap hands clear the caption band', paint: hallShot('LF01', camAt(SH01, 0), {t: 0, face: 'neutral', look: [-1.35, 0.1]})},
  'LF01b': {shot: 'B05-SH20 last hold', final: true, note: 'CHK-SH20 basis, finished grade: CHILD eating at his spread of 20 dishes (seated-spoon-to-mouth, happy), LT covers off, far left; warm pool', paint: (p) => {
    const pr: Probe = {};
    paintHall(p, camOf(SH20_END, 1), {light: {warm: 0.8}, longTable: {covers: 'off'}, items: [childItem({t: 0, face: 'happy', eat: true}, pr)], onChildTable: paintChildSpread});
    record('LF01b', pr);
  }},
  'LF02': {shot: 'B04-SH14 mid', final: true, note: 'DEMO22 finished grade: strip A tip pressed in the left yolk, first 40 % grey-black, tail bright; hand pinches the tail only; cup strip B bright', paper: '#a9aeb3', paint: (p) => paintDemo(p, SH14(0.5, LF02_HY), {stripA: 'pressed', tarnish: 0.4})},
  'CHK-CAST': {shot: 'no shot (cast check)', note: 'CHILD, LIFTER E1 (slate) and CALLER (light tint) in front, left and back views on a plain ground', paper: '#d9c7a6', paint: (p) => {
    hardFill(p, 30000, '#d9c7a6', [[-10, -10], [1090, -10], [1090, 1930], [-10, 1930]]);
    const c: YCam = {...orbitYCam([0, 0.9, 0], 3.4, 0, 0.9, 1150, 900)};
    const views = ['front', 'left', 'back'] as const;
    views.forEach((v, k) => {
      const x = -0.95 + k * 0.95;
      paintFigureAt(p, c, CHILD, {at: [x - 0.27, 0, 0.2], t: 0, view: v, seed: CHILD.seed + k, held: (q, a) => paintSkullcap(q, a, v, 30100 + k * 40)});
      paintFigureAt(p, c, LIFTERS[0], {at: [x + 0.05, 0, -0.5], t: 0, view: v, seed: LIFTERS[0].seed + k, held: (q, a) => paintCourtCap(q, a, v, 30300 + k * 40)});
      paintFigureAt(p, c, CALLER, {at: [x + 0.3, 0, -0.1], t: 0, view: v, seed: CALLER.seed + k, held: (q, a) => paintCourtCap(q, a, v, 30500 + k * 40)});
    });
  }},
};
