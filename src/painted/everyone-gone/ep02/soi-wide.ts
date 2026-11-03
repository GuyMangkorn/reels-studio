import {drawFigure, type FigPose} from '../../kit/cast';
import {ell, hardFill, inkLine, washAt} from '../../kit/draw';
import {EXPRESSIONS} from '../../kit/expressions';
import {hash} from '../../kit/hash';
import {mixColor, type Painter, type Pt} from '../../kit/painter';
import {poseArms} from '../../kit/poses';
import type {V3} from '../../kit/space';
import {groundQuad, proj, unitAt, type Cam} from '../space';
import {box} from './collide';
import {YOU2, dressAs, fillC, mix, paintPostAssembly, sky, sideQuad, warmOf, type State} from './places';
import type {SheetState} from './sheet';
import type {CrowdSet, Mover} from './walk';

// EG-EP02-SHORT soi wide set (Boss B2; scene sheets S03-B01-SH01 `empty`, S04-B01-SH07 `empty` -> `crowd`). The lamp post and its
// sheet pile are `paintPostAssembly`, the same calls the close plate makes (`paintSoiPost`), painted under a scale: the post and
// sheet marks at any distance come from one source (PAIR201), 2 px at the close plate's scale. The camera is a long lens from
// well behind the walker so `คุณ` shrinks 24 % -> about 14 % of the frame over a 4.5 m walk (the sheet's numbers, estimated).

export const SOI_WIDE: Cam = {x: 0, y: 1.6, z: 4.8, f: 1800, hy: 900};
export const SOI_POST_AT: V3 = [0.25, 0, -9];
/** `คุณ` walks in (hood up, back view): (0, -1.5) at f 8 to (-0.2, -6.0) at f 148, ease-out; stands there in S04-B01-SH07. */
export const SOI_YOU_START: V3 = [0, 0, -1.5];
export const SOI_YOU_END: V3 = [-0.2, 0, -6];
const WALK_F0 = 8, WALK_F1 = 148;
export const soiYouAt = (f: number): {at: V3; walk?: number} => {
  const u = Math.min(1, Math.max(0, (f - WALK_F0) / (WALK_F1 - WALK_F0))), e = 1 - (1 - u) ** 2;
  const at: V3 = [SOI_YOU_START[0] + (SOI_YOU_END[0] - SOI_YOU_START[0]) * e, 0, SOI_YOU_START[2] + (SOI_YOU_END[2] - SOI_YOU_START[2]) * e];
  return {at, walk: u > 0 && u < 1 ? (Math.abs(at[2] - SOI_YOU_START[2]) / 0.8) : undefined};
};
/** Pixels per metre of the close plate (an A3 sheet 0.297 m wide is 420 px). */
const CLOSE_PX_PER_M = 420 / 0.297;
const scaleOf = () => unitAt(SOI_WIDE, SOI_POST_AT[2]) / CLOSE_PX_PER_M;

export const soiWideSolids = () => [
  {id: 'post', box: box(SOI_POST_AT[0] - 0.15, SOI_POST_AT[0] + 0.15, 0, 4, SOI_POST_AT[2] - 0.15, SOI_POST_AT[2] + 0.15)},
  {id: 'spirit-house', box: box(2.45, 2.95, 0, 2.3, -4.2, -3.7)},
  {id: 'scooter-a', box: box(-2.95, -1.65, 0, 1.1, -5.6, -4.9)},
  {id: 'scooter-b', box: box(-2.95, -1.65, 0, 1.1, -13.4, -12.7)},
];
const mv = (id: string, who: Mover['who'], view: Mover['view'], x: number, z: number, pace: number, seed: number): Mover => ({id, who, view, seed, at: [x, 0, z], pace});
/** Soi crowd (S04-B01-SH07, cue f6-36): people walking to work and school; clear of the post, the spirit house, the scooters and `คุณ`. */
export const SOI_CROWD: CrowdSet = {
  id: 'soi',
  cam: SOI_WIDE,
  solids: soiWideSolids(),
  you: SOI_YOU_END,
  bounds: box(-3.1, 3.1, 0, 3, -20, 1.4),
  ref: 36,
  cue: [6, 36],
  movers: [
    mv('s1', dressAs('girl-school'), 'front', 0.9, -7.4, 0.9, 301),
    mv('s2', dressAs('boy-school'), 'front', 1.9, -7.2, 0.9, 302),
    mv('s3', dressAs('man-buzz', 'office'), 'back', 1.5, -12.0, 1.0, 303),
    mv('s4', dressAs('woman-long'), 'back', -1.4, -10.6, 0.9, 304),
    mv('s5', dressAs('woman-ponytail', 'vendor'), 'front', 2.3, -10.2, 0.8, 305),
    mv('s6', dressAs('man-elder'), 'back', -0.9, -15.5, 0.7, 306),
    mv('s7', dressAs('woman-pixie', 'office'), 'front', 1.4, -3.0, 1.0, 307),
    mv('s8', dressAs('man-crop'), 'back', -1.1, -2.6, 0.9, 308),
  ],
};

/** Parked scooter in profile, nose to the left (simplified from the close plate's scooter), at ground point `at`. */
const scooter = (p: Painter, c: Cam, seed: number, at: V3, w: number) => {
  const [mx, my] = proj(c, at), mu = unitAt(c, at[2]);
  const M = (u: number, v: number): Pt => [mx - u * mu, my - v * mu];
  const body = mix('#56616b', '#6a707a', w), panel = mix('#434d56', '#565d68', w);
  for (const wx of [-0.66, 0.6]) {
    hardFill(p, seed + wx * 10, '#24272a', ell(M(wx, 0)[0], M(0, 0.25)[1], mu * 0.25, mu * 0.25, 16));
    hardFill(p, seed + 5 + wx * 10, '#9aa0a5', ell(M(wx, 0)[0], M(0, 0.25)[1], mu * 0.1, mu * 0.1, 10));
  }
  hardFill(p, seed + 10, panel, [M(-1.0, 0.45), M(-0.92, 0.3), M(-0.35, 0.3), M(-0.2, 0.42), M(-0.18, 0.72), M(-0.95, 0.76)]);
  hardFill(p, seed + 11, body, [M(-1.02, 0.6), M(-0.6, 0.42), M(-0.22, 0.46), M(-0.2, 0.72), M(-0.98, 0.78)]);
  hardFill(p, seed + 12, body, [M(0.2, 0.28), M(0.42, 0.3), M(0.66, 0.62), M(0.58, 1.0), M(0.44, 1.02), M(0.34, 0.6), M(0.22, 0.4)]);
  hardFill(p, seed + 13, '#25282b', [M(-0.98, 0.76), M(-0.2, 0.72), M(-0.16, 0.84), M(-0.4, 0.88), M(-0.94, 0.86)]);
  hardFill(p, seed + 14, body, [M(0.36, 0.98), M(0.66, 1.0), M(0.68, 1.1), M(0.4, 1.1)]);
};

export const paintSoiWide = (p: Painter, state: State, o: {sheet?: SheetState; you?: boolean | 'walk'; f?: number} = {}) => {
  const c = SOI_WIDE, w = warmOf(state);
  sky(p, 61000, mix('#8ea0b6', '#e3cba3', w), mix('#dcd6cf', '#f6e9d4', w), -20, 960);
  fillC(p, 61100, mix('#6b7682', '#a39a8c', w), groundQuad(c, -3.2, 3.2, -120, 1.9));
  // Two rows of low houses with dark upper windows and open ground floors, far to near (the far end is a lit shop).
  for (const s of [-1, 1] as const) for (let k = 0; k < 14; k++) {
    const z1 = 1.9 - k * 6.2, z0 = z1 - 6.2, top = 6.5 + 2.5 * hash(k * 3 + s);
    fillC(p, 61200 + k * 10 + s, mix(['#7b8794', '#8a939c', '#727f8c'][k % 3], ['#c4b29a', '#d3c3aa', '#b9a68e'][k % 3], w), sideQuad(c, s * 3.2, z0, z1, 0, top));
    fillC(p, 61203 + k * 10 + s, mix('#505b66', '#857865', w), sideQuad(c, s * 3.2, z0 + 1, z1 - 1, 3.2, 4.6));
    fillC(p, 61205 + k * 10 + s, mix('#929aa1', '#c7b9a2', w), sideQuad(c, s * 3.2, z0 + 0.5, z1 - 0.5, 0, 1.8));
  }
  // Overhead cable bundles across the soi, every 12 m, sagging.
  for (let k = 0; k < 8; k++) for (let j = 0; j < 3; j++) {
    const z = -2 - k * 12 - j * 1.5, a = proj(c, [-3.2, 6.4 + j * 0.3, z]), b = proj(c, [3.2, 6.2 + j * 0.3, z]), u = unitAt(c, z);
    inkLine(p, 61400 + k * 5 + j, [a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + u * 0.5], b], {color: mix('#2c3238', '#3e3a36', w), weight: 1.1, closed: false, curve: 0.5, still: true});
  }
  // Spirit house (san phra phum) at a gate on the right, small and generic.
  {
    const [sx, sy] = proj(c, [2.7, 0, -3.95]), su = unitAt(c, -3.95), S = (u: number, v: number): Pt => [sx + u * su, sy - v * su];
    const stone = mix('#a9adb0', '#d8cdb8', w), gold = mix('#a08850', '#c4a45c', w), roof = mix('#7d3f34', '#94503c', w);
    fillC(p, 61500, stone, [S(-0.07, 0), S(0.07, 0), S(0.06, 1.2), S(-0.06, 1.2)]);
    fillC(p, 61501, stone, [S(-0.36, 1.2), S(0.36, 1.2), S(0.36, 1.27), S(-0.36, 1.27)]);
    fillC(p, 61502, gold, [S(-0.2, 1.27), S(0.2, 1.27), S(0.2, 1.6), S(-0.2, 1.6)]);
    fillC(p, 61503, roof, [S(-0.3, 1.58), S(0.3, 1.58), S(0, 1.98)]);
    fillC(p, 61504, gold, [S(-0.015, 1.98), S(0.015, 1.98), S(0, 2.3)]);
  }
  scooter(p, c, 61600, [-2.3, 0, -5.25], w);
  scooter(p, c, 61620, [-2.3, 0, -13.05], w);
  washAt(p, 61700, mix('#b5c0cc', '#f1e3cc', w), 60, [[-20, -20], [1100, -20], [1100, 1940], [-20, 1940]], 0.05, 0.3);
  // The post: a tall concrete column from the ground, then the close plate's post and sheet pile at its scale.
  const [bx, by] = proj(c, SOI_POST_AT), u = unitAt(c, SOI_POST_AT[2]), k = scaleOf();
  hardFill(p, 61800, mix('#8e959b', '#bdb3a4', w), [[bx - u * 0.12, by], [bx + u * 0.12, by], [bx + u * 0.1, by - u * 4], [bx - u * 0.1, by - u * 4]]);
  p.brush.push();
  p.brush.translate(bx - 540 * k, c.hy - 1080 * k);
  p.brush.scale(k);
  paintPostAssembly(p, state, {sheet: o.sheet ?? {width: 1, face: 'back', droop: 0, dy: 0, flutter: 0}});
  p.brush.pop();
  if (o.you) {
    const {at, walk} = soiYouAt(o.f ?? WALK_F1), g = proj(c, at), yu = unitAt(c, at[2]);
    drawFigure(p, YOU2, g, yu, {view: 'back', hoodUp: true, face: EXPRESSIONS.neutral, ...poseArms('P01', YOU2, g, yu), walk: o.you === 'walk' ? walk : undefined, stride: 0.6} as FigPose, p.t, YOU2.seed);
  }
  void mixColor;
};
