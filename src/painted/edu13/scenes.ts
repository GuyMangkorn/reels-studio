import type {FigAnchors} from '../kit/cast';
import type {Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import {orbitYCam, type YCam} from '../kit/ycam';
import {paintDog, paintMan} from './cast';
import {fleaJoints, paintFlea, POSES, type FleaMeasure, type FleaOpts} from './flea';
import {LR13, OX, paintRoom13, type RoomItem} from './room';
import {paintSoi, SOI} from './soi';
import {paintStudio} from './studio';

// EDU-EP13-SHORT look frames (W3.1): LF01 room (S01-B01-SH01 f0), LF02 macro flea (S01-B01-SH02 f0), LF03 myth (S01-B01-SH04 at the arc apex),
// and the six SP1 flea look-check stills F1-F6. Pure paint functions; cameras follow the brief's shot plan (est values; changes marked "W3").
// Screen layers (bar, label, arc, ring marker, band, tag) are in look.tsx and read the cameras and points exported here.

const DEG = Math.PI / 180;
const orbit = (at: V3, yaw: number, r: number, eye: number, f: number, hy: number): YCam => orbitYCam(at, r, yaw * DEG, eye, f, hy);
export const MEASURE: Record<string, {fig?: FigAnchors | null; flea?: FleaMeasure | null}> = {};

// ---- cameras (brief VD08-VD11, VD21, storyboard shot cameras)
// Original brief cameras (user verdict 2026-11-09); the staging moved instead (OX/DS in room.ts, SOI marks below)
export const CAM_SOFA = orbit([3.3, 0.7, 0.55], 40, 2.8, 1.15, 1200, 850);
export const CAM_MACRO = orbit([0, 0.45, 0], 0, 4.0, 0.45, 1200, 900);
export const CAM_MACRO_THORAX = orbit([0.0, 0.55, 0], 0, 2.9, 0.55, 1200, 900); // W3: B03-SH03 has no camera in the brief; thorax window about 560 px
export const CAM_CHART_2S = orbit([OX + 0.95, 1.0, 0.35], 0, 6.6, 1.15, 2400, 770);
export const CAM_TRUTH = orbit([OX + 0.95, 1.0, 0.35], 0, 10.0, 1.0, 3600, 790);
export const CAM_CHART_LOW = orbit([OX + 0.05, 0.85, 0.3], -8, 2.75, 1.0, 1400, 700);
// Original brief camera (target x 1.0, r 2.6); the steep pitch magnifies the near ground, so MAN and the giant are re-staged in soi.ts (MAN x 0.2, giant behind-right at z -0.6) to stay fully in frame
export const CAM_MYTH: YCam = {...orbit([1.0, 1.4, 0], -6, 2.6, 0.45, 820, 900), pitch: 30 * DEG};

// ---- LF01 room: MAN seated P31 on the left seat, dog asleep on the right seats, chart in the background
export const paintLF01 = (p: Painter, frame: number) => {
  const t = frame / 30, c = CAM_SOFA, out: {fig?: FigAnchors | null} = {};
  const cast: RoomItem[] = [
    {at: LR13.dogAt, layer: 'sofa', draw: (q, cc) => paintDog(q, cc, LR13.dogAt, {view: 'left', state: 'lie', lid: 1}, t)},
    {at: LR13.manSeatFeet, layer: 'sofa', draw: (q, cc) => { out.fig = paintMan(q, cc, {at: LR13.manSeatFeet, view: 'front', pose: 'P31', face: 'neutral', faceState: {look: [0.6, 0.2]}, t, warm: 0.08}); }},
  ];
  paintRoom13(p, c, {t, cast});
  MEASURE.LF01 = {fig: out.fig ?? null};
};

// ---- LF02 macro: the flea at rest on the paper sweep (millimetres), "2 mm" bar and label are screen layers
export const FLEA_MM = 2.0;
export const paintLF02 = (p: Painter, frame: number) => {
  paintStudio(p, CAM_MACRO, {fibre: true});
  MEASURE.LF02 = {flea: paintFlea(p, CAM_MACRO, [0, 0, 0], FLEA_MM, {view: 'right', state: 'rest', t: frame / 30})};
};

// ---- LF03 myth: MAN back view P30 beside the giant (right profile) on the soi; the arc is a screen layer (look.tsx)
export const ARC = {from: [2.0, 0.8, -0.6] as V3, apex: [10, 130, -60] as V3};
/** The naive myth arc: a parabola from the flea's head through the apex, over the roof. s 0..1 across start -> landing (apex at 0.5). */
export const arcPoint = (s: number): V3 => {
  const [x0, y0, z0] = ARC.from, [xa, ya, za] = ARC.apex, k = 4 * s * (1 - s);
  return [x0 + (xa - x0) * 2 * s, y0 + (ya - y0) * k, z0 + (za - z0) * 2 * s];
};
export const paintLF03 = (p: Painter, frame: number) => {
  const t = frame / 30, c = CAM_MYTH, out: {fig?: FigAnchors | null; flea?: FleaMeasure | null} = {};
  paintSoi(p, c, {cast: [
    (q, cc) => { out.flea = paintFlea(q, cc, SOI.flea, 1.8, {view: 'right', state: 'rest', t, tint: {to: '#ffe2a0', u: 0.1}}); },
    (q, cc) => { out.fig = paintMan(q, cc, {at: SOI.man, view: 'back', pose: 'P30', face: 'neutral', t, warm: 0.06}); },
  ]});
  MEASURE.LF03 = out;
};

// ---- SP1 flea look-check stills
const GIANT = 1.8;
const sunTint = {to: '#ffe2a0', u: 0.08};
const roomWith = (p: Painter, c: YCam, o: {man?: {at: V3; pose?: Parameters<typeof paintMan>[2]['pose']; face?: Parameters<typeof paintMan>[2]['face']; view?: 'front' | 'right'}; flea?: {at: V3; len: number; opts: FleaOpts}; marks?: {y: number; color: string}[]}, key: string) => {
  const out: {fig?: FigAnchors | null; flea?: FleaMeasure | null} = {};
  const cast: RoomItem[] = [];
  if (o.man) cast.push({at: o.man.at, draw: (q, cc) => { out.fig = paintMan(q, cc, {at: o.man!.at, view: o.man!.view ?? 'front', pose: o.man!.pose ?? 'P01', face: o.man!.face ?? 'neutral', t: 0.2, warm: 0.06}); }});
  if (o.flea) cast.push({at: o.flea.at, draw: (q, cc) => { out.flea = paintFlea(q, cc, o.flea!.at, o.flea!.len, {tint: sunTint, ...o.flea!.opts}); }});
  paintRoom13(p, c, {t: 0.2, cast, marks: o.marks});
  MEASURE[key] = out;
};
/** F1 macro rest (B01-SH02 f0): the same picture as LF02, with the caption band marked in look.tsx. */
export const paintF1 = paintLF02;
/** F2 macro see-through squeeze (B03-SH03): translucent thorax, the amber pad squeezed and the catch locked. */
export const paintF2 = (p: Painter, frame: number) => {
  paintStudio(p, CAM_MACRO_THORAX, {fibre: true});
  MEASURE.F2 = {flea: paintFlea(p, CAM_MACRO_THORAX, [0, 0, 0], FLEA_MM, {view: 'right', state: 'rest', see: {squeeze: 0.85, locked: true}, t: frame / 30})};
};
/** F3 person-size rest beside MAN, front head (B01-SH05 V01: the giant swaps to its front head and looks at the lens). */
export const paintF3 = (p: Painter) => roomWith(p, CAM_CHART_2S, {man: {at: LR13.manMark, pose: 'P01', face: 'shock'}, flea: {at: LR13.giantMark, len: GIANT, opts: {view: 'front', state: 'rest'}}}, 'F3');
/** F3b the same beat in profile (the rest pose beside MAN, B01-SH03 full size). */
export const paintF3b = (p: Painter) => roomWith(p, CAM_CHART_2S, {man: {at: LR13.manMark, pose: 'P01', face: 'neutral'}, flea: {at: LR13.giantMark, len: GIANT, opts: {view: 'right', state: 'rest'}}}, 'F3b');
/** F4 crouch (B04-SH02 take-off prep): the hind Z folded tight beside MAN in his own crouch (P35). */
export const paintF4 = (p: Painter) => roomWith(p, CAM_CHART_2S, {man: {at: LR13.manMark, pose: 'P35', face: 'neutral'}, flea: {at: LR13.giantMark, len: GIANT, opts: {view: 'right', state: 'fold'}}}, 'F4');
/** F5 truth apex (B04-SH02 freeze): CAM-TRUTH, giant tucked at 0.36 m, MAN at 0.42 m (feet rows from the brief). */
export const apexAir = (clearance: number) => { const j = fleaJoints(POSES.apex, 0); const lowest = Math.min(...[POSES.apex.hind.t, POSES.apex.mid.t, POSES.apex.fore.t].map((q) => j.w(q)[1])); return clearance / GIANT - lowest; };
export const paintF5 = (p: Painter) => roomWith(p, CAM_TRUTH, {
  man: {at: [LR13.manMark[0], 0.42, LR13.manMark[2]], pose: 'P01', face: 'neutral'},
  flea: {at: [LR13.giantMark[0], 0.36 - 0.36, LR13.giantMark[2]], len: GIANT, opts: {view: 'right', state: 'apex', air: apexAir(0.36), shadow: false}},
}, 'F5');
/** F6 shrink midpoint (B05-SH01): the giant caught mid-shrink, body about 0.5 m, standing by MAN at the chart. */
export const paintF6 = (p: Painter) => roomWith(p, CAM_CHART_LOW, {man: {at: [OX + 0.3, 0, 0.3], pose: 'P09', face: 'smug'}, flea: {at: [OX + 0.85, 0, 0.3], len: 0.5, opts: {view: 'right', state: 'rest'}}}, 'F6');

export const LF_FRAMES = {LF01: 30, LF02: 30, LF03: 30, F1: 30, F2: 30, F3: 30, F3b: 30, F4: 30, F5: 30, F6: 30} as const;
