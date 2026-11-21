import type {AnimalAnchors, AnimalPose} from '../kit/animals';
import {capsule, ell, hardFill, inkLine} from '../kit/draw';
import {hash} from '../kit/hash';
import {makePainter, mixColor, tintPainter, type Painter, type Pt} from '../kit/painter';
import type {Brush} from '../BrushCanvas';
import type {V3} from '../kit/space';
import {flatCircle, paintBox, qy, qz, wFill, wInk, wWash} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {CAT_SCALE, POSTER, paintCatCard} from './cast';
import {LAMP, LAMP_BASE, paintLampPool, paintNearDressing, paintRoom} from './desk';
import {paintNearGroundShade} from './field';
import {smooth} from './field-cat';
import {lead} from './looks';

// EDU-EP32-SHORT shot group G1 set (Boss W5.2, 2026-11-21; timed sheet EDU-EP32-SHEET-R1 B01-SH01..SH03, G [0, 328); brief R3 VD32-03, VD32-04,
// VD32-06; look = the passed LF02 paper desk). Space D model metres at 10:1, desk.ts origin and lamp. Shared by b01-sh01/02/03.ts:
//   page BP: the open red-banded kraft folder with a cyan blueprint sheet (3.8 x 2.6) laid across both leaves, white grid, a double border, an empty
//     title block and a drafted target circle with centre ticks under the cat (no text: SF01 / brief "never on screen");
//   the desk's front face (dark walnut, the lamp never reaches it) and a worn lit lip, for the B01-SH01 start key, whose eye sits past the desk edge;
//   near layer: the rubber stamp on its ink pad (+3.0, 0, +1.8) and the red pencil along z +2.4 (set plan);
//   the hero paper CAT x4 (`catDef(4)` card, profile facing -x, ear-mic r2 + antenna thread) at (+0.3, 0, -0.2), with the B01 acting (blink, yawn,
//     lie-down, ear flick) on the kit pose controls plus `new: cat-yawn` painted from the anchors;
//   the caption-band shade (y 1230-1344, limits mean 0.25 / p95 0.40): lamp falloff glazes toward the lens on the desk plane (field.ts ramp).
// Casting line: `cat-gray-tabby {fluffy, soft} x4 paper + new: ear-mic + new: antenna-thread, sit, proud`; B01-SH03 adds `new: cat-yawn` and the
// ear flick on the kit `ears` control (K2 swing back, pulsed to 0.5 = about 30 deg back; recorded as the `new: ear-flick` stand-in).

/** The hero cat's foot (the card stands on the blueprint, same point as office.ts `paintB01Ref`, the B06-SH02 mirror reference). */
export const B01_CAT: V3 = [0.3, 0.014, -0.2];
/** Page BP: blueprint sheet extent on the open folder (model m). */
export const BP = {x0: -1.9, x1: 1.9, z0: -1.22, z1: 1.32, y: 0.0125} as const;
const CYAN = POSTER.cyan, LINE = '#cfe3f2', GRID = '#7fb0d6';

/** Desk front face at z +3.0 (in shade: it faces away from the lamp, still walnut, never empty black, UT03) with the worn lit lip along the top
 *  edge, a little grain and the centre drawer with its brass pull. */
export const paintDeskFront = (p: Painter, c: YCam) => {
  if (c.z <= 3.0) return;
  const face = mixColor(POSTER.walnut, '#140c08', 0.4);
  wFill(p, c, 37010, face, qz(3.0, -7.5, 7.5, -7.5, 0));
  for (let i = 0; i < 9; i++) {
    const y = -0.3 - i * 0.62 - 0.2 * hash(37020 + i), x0 = -7.4 + 3 * hash(37030 + i);
    wInk(p, c, 37040 + i, [[x0, y, 3.0], [x0 + 4 + 5 * hash(37050 + i), y + 0.06 * (hash(37060 + i) - 0.5), 3.0]], {color: mixColor(face, '#0e0806', 0.35), weight: 0.6, closed: false});
  }
  wFill(p, c, 37011, mixColor(POSTER.walnut, '#ffd890', 0.12), qz(3.0, -7.5, 7.5, -0.09, 0));
  wInk(p, c, 37012, [[-7.5, -0.09, 3.0], [7.5, -0.09, 3.0]], {color: mixColor(POSTER.walnut, '#0e0806', 0.6), weight: 0.8, closed: false});
  // drawer (x -1.8..+2.4, y -0.35..-1.55) and its pull
  wInk(p, c, 37013, [[-1.8, -0.35, 3.0], [2.4, -0.35, 3.0], [2.4, -1.55, 3.0], [-1.8, -1.55, 3.0]], {color: mixColor(face, '#0e0806', 0.5), weight: 0.9});
  wInk(p, c, 37014, [[-1.78, -0.37, 3.0], [2.38, -0.37, 3.0]], {color: mixColor(face, '#ffd890', 0.18), weight: 0.6, closed: false});
  wFill(p, c, 37015, '#8a6a30', [[0.05, -0.85, 3.01], [0.55, -0.85, 3.01], [0.55, -1.0, 3.01], [0.05, -1.0, 3.01]]);
  wInk(p, c, 37016, [[0.07, -0.87, 3.012], [0.53, -0.87, 3.012]], {color: '#d9b766', weight: 0.7, closed: false});
};

/** The lamp base as desk.ts `paintLampBase` (same disc and arm geometry), with the arm in the room's shade instead of lit brass: from the B01 keys
 *  the arm rises straight behind the hero cat, and a lit arm read as a pole touching its nose (G1 still 1, 2026-11-21). */
export const paintB01Lamp = (p: Painter, c: YCam) => {
  const brass = '#a8823a', B = LAMP_BASE;
  hardFill(p, 32150, mixColor(brass, '#20140a', 0.45), flatCircle(c, [B[0], 0.0, B[2]], 0.62, 28));
  hardFill(p, 32151, brass, flatCircle(c, [B[0], 0.12, B[2]], 0.58, 28));
  hardFill(p, 32152, '#d9b766', flatCircle(c, [B[0] + 0.12, 0.13, B[2] + 0.1], 0.3, 20));
  const elbow: V3 = [-3.4, 3.2, -3.0];
  for (const [a, b, w, k] of [[[B[0], 0.12, B[2]] as V3, elbow, 0.09, 0], [elbow, LAMP, 0.08, 1]] as const) {
    const pa = camPoint(c, a), pb = camPoint(c, b);
    if (!pa || !pb) continue;
    const ua = camUnit(c, a) * w, ub = camUnit(c, b) * w, dx = pb[0] - pa[0], dy = pb[1] - pa[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
    hardFill(p, 37060 + k, mixColor(brass, '#2c2630', 0.72), [[pa[0] + nx * ua, pa[1] + ny * ua], [pb[0] + nx * ub, pb[1] + ny * ub], [pb[0] - nx * ub, pb[1] - ny * ub], [pa[0] - nx * ua, pa[1] - ny * ua]]);
  }
};

/** Page BP: folder leaves (kraft, red band on the far tab edge), the blueprint sheet, its grid, border, title block and the drafted circle. */
export const paintPageBP = (p: Painter, c: YCam) => {
  const kraft = '#c4a171';
  wWash(p, c, 37100, '#14100c', 80, qy(0.011, -2.25, 2.42, -1.48, 1.68), 0.05, 0.1);
  wFill(p, c, 37101, kraft, qy(0.011, -2.3, 2.3, -1.55, 1.55));
  wFill(p, c, 37102, POSTER.red, qy(0.0113, -2.3, 2.3, -1.55, -1.4));
  wInk(p, c, 37103, [[0, 0.0115, -1.55], [0, 0.0115, 1.55]], {color: mixColor(kraft, '#2a1a0c', 0.4), weight: 0.8, closed: false});
  // the sheet's soft drop shadow, then the sheet (a slight lift along the folder spine: the fold line across the middle)
  wWash(p, c, 37104, '#0e1a26', 70, qy(0.012, BP.x0 + 0.04, BP.x1 + 0.08, BP.z0 + 0.04, BP.z1 + 0.07), 0.05, 0.1);
  wFill(p, c, 37105, CYAN, qy(BP.y, BP.x0, BP.x1, BP.z0, BP.z1));
  wFill(p, c, 37106, mixColor(CYAN, '#0e1a26', 0.18), qy(BP.y + 0.0002, -0.06, 0.0, BP.z0, BP.z1));
  const y = BP.y + 0.0005;
  for (let i = 1; i < 19; i++) { const x = BP.x0 + i * 0.2; wInk(p, c, 37110 + i, [[x, y, BP.z0], [x, y, BP.z1]], {color: GRID, weight: 0.35, closed: false}); }
  for (let i = 1; i < 13; i++) { const z = BP.z0 + i * 0.195; wInk(p, c, 37140 + i, [[BP.x0, y, z], [BP.x1, y, z]], {color: GRID, weight: 0.35, closed: false}); }
  const box = (x0: number, x1: number, z0: number, z1: number): V3[] => [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]];
  wInk(p, c, 37160, box(BP.x0 + 0.1, BP.x1 - 0.1, BP.z0 + 0.1, BP.z1 - 0.1), {color: LINE, weight: 0.9});
  wInk(p, c, 37161, box(BP.x0 + 0.14, BP.x1 - 0.14, BP.z0 + 0.14, BP.z1 - 0.14), {color: LINE, weight: 0.5});
  // title block (front right corner), empty ruled boxes only
  const tx0 = 0.75, tx1 = BP.x1 - 0.14, tz0 = 0.72, tz1 = BP.z1 - 0.14;
  wInk(p, c, 37162, box(tx0, tx1, tz0, tz1), {color: LINE, weight: 0.7});
  for (const [k, z] of [[0, 0.88], [1, 1.0]] as const) wInk(p, c, 37163 + k, [[tx0, y, z], [tx1, y, z]], {color: LINE, weight: 0.45, closed: false});
  wInk(p, c, 37165, [[1.3, y, 0.88], [1.3, y, tz1]], {color: LINE, weight: 0.45, closed: false});
  for (let i = 0; i < 4; i++) wInk(p, c, 37166 + i, [[tx0 + 0.08, y, 0.79 + i * 0.02], [tx0 + 0.3 + 0.25 * hash(37170 + i), y, 0.79 + i * 0.02]], {color: GRID, weight: 0.4, closed: false});
  // the drafted circle round the cat's spot with centre ticks and a dimension line (a plan drawing, not a target: thin white, no red)
  const [cx, , cz] = B01_CAT, ring = (r: number, n = 48): V3[] => Array.from({length: n}, (_, i): V3 => [cx + r * Math.cos((i / n) * 6.283), y, cz + r * Math.sin((i / n) * 6.283)]);
  wInk(p, c, 37180, ring(1.0), {color: LINE, weight: 0.8});
  wInk(p, c, 37181, ring(0.62), {color: GRID, weight: 0.5});
  for (const [k, dx, dz] of [[0, 1, 0], [1, -1, 0], [2, 0, 1], [3, 0, -1]] as const)
    wInk(p, c, 37182 + k, [[cx + dx * 0.9, y, cz + dz * 0.9], [cx + dx * 1.12, y, cz + dz * 1.12]], {color: LINE, weight: 0.8, closed: false});
  wInk(p, c, 37190, [[cx - 1.0, y, cz + 1.15], [cx + 1.0, y, cz + 1.15]], {color: LINE, weight: 0.5, closed: false});
  for (const [k, sx] of [[0, -1], [1, 1]] as const) wInk(p, c, 37191 + k, [[cx + sx * 1.0, y, cz + 1.07], [cx + sx * 1.0, y, cz + 1.2]], {color: LINE, weight: 0.5, closed: false});
  // a drafted side-elevation sketch at the back left (a box with a hinged lid and circles: generic hardware, not a body)
  wInk(p, c, 37193, box(-1.6, -0.95, -1.0, -0.62), {color: LINE, weight: 0.6});
  for (let i = 0; i < 3; i++) wInk(p, c, 37194 + i, Array.from({length: 18}, (_, k): V3 => [-1.48 + i * 0.2 + 0.06 * Math.cos((k / 18) * 6.283), y, -0.81 + 0.06 * Math.sin((k / 18) * 6.283)]), {color: LINE, weight: 0.5});
  wInk(p, c, 37197, [[-1.6, y, -1.08], [-0.95, y, -1.08]], {color: GRID, weight: 0.45, closed: false});
};

/** Near layer: the tin ink pad (0.9 x 0.6, lid open behind it) at (+3.0, 0, +1.8) with the rubber stamp standing beside it (a 0.36 x 0.22 wood
 *  mount on its red rubber, a turned handle and a round knob, 0.7 model m = 7 cm tall). */
export const paintStampPad = (p: Painter, c: YCam) => {
  const [x, , z] = [3.0, 0, 1.8];
  wWash(p, c, 37300, '#0e0806', 100, qy(0.002, x - 0.5, x + 0.62, z - 0.32, z + 0.42), 0.05, 0.1);
  paintBox(p, c, 37310, {x0: x - 0.45, x1: x + 0.45, y0: 0, y1: 0.08, z0: z - 0.3, z1: z + 0.3}, '#3a3f47', {}, {ink: true});
  wFill(p, c, 37320, '#4a1418', qy(0.081, x - 0.38, x + 0.38, z - 0.23, z + 0.23));
  wFill(p, c, 37321, '#5e6670', [[x - 0.45, 0.08, z - 0.3], [x + 0.45, 0.08, z - 0.3], [x + 0.45, 0.62, z - 0.42], [x - 0.45, 0.62, z - 0.42]]);
  // the stamp, standing on the desk to the left of the pad (nearer the lens path)
  const sx = x - 0.75, sz = z + 0.15;
  wWash(p, c, 37330, '#0e0806', 110, qy(0.002, sx - 0.2, sx + 0.34, sz - 0.12, sz + 0.24), 0.05, 0.1);
  paintBox(p, c, 37331, {x0: sx - 0.18, x1: sx + 0.18, y0: 0, y1: 0.05, z0: sz - 0.11, z1: sz + 0.11}, '#8e2420', {});
  paintBox(p, c, 37334, {x0: sx - 0.18, x1: sx + 0.18, y0: 0.05, y1: 0.17, z0: sz - 0.11, z1: sz + 0.11}, '#9a6a3e', {}, {ink: true});
  const a = camPoint(c, [sx, 0.17, sz]), b = camPoint(c, [sx, 0.5, sz]), k = camPoint(c, [sx, 0.6, sz]);
  if (a && b && k) {
    const u = camUnit(c, [sx, 0.4, sz]);
    hardFill(p, 37340, '#6e4426', capsule(a, b, 0.07 * u, 0.045 * u, 6));
    inkLine(p, 37341, [[a[0] - 0.035 * u, a[1]], [b[0] - 0.02 * u, b[1]]], {color: '#b8875a', weight: Math.max(0.8, 0.012 * u), closed: false, still: true, curve: 0});
    hardFill(p, 37342, '#7a4c2a', ell(k[0], k[1], 0.11 * u, 0.1 * u, 20));
    hardFill(p, 37343, '#b8875a', ell(k[0] - 0.035 * u, k[1] - 0.035 * u, 0.035 * u, 0.03 * u, 12));
  }
};

/** The B01 desk under the plates: room and lamp base, desk front, page BP, the lamp pool. */
export const paintB01Desk = (p: Painter, c: YCam) => {
  paintRoom(p, c);
  paintB01Lamp(p, c);
  paintDeskFront(p, c);
  paintPageBP(p, c);
  paintLampPool(p, c);
};
/** Near layer in front of the cat (B01-SH01): pencil and stamp, toned down into the room's shade. */
export const paintB01Near = (p: Painter, c: YCam) => {
  // out of the lamp pool (r 2.4): the near layer sits in the room's shade, which also keeps the caption band dark while it passes
  const q = tintPainter(p, '#141a28', 0.38, {brush: true});
  paintNearDressing(q, c, [-0.6, 2.42], [1.3, 2.3]);
  paintStampPad(q, c);
};

/** Caption band y 1230-1344 (G1): lamp falloff toward the lens, nested glazes fixed to picture rows on the desk plane, soft from y 1160. */
export const B01_BAND: [number, number][] = Array.from({length: 20}, (_, i): [number, number] => [1060 + i * 16, Math.round(8 + 22 * Math.min(1, i / 11))]);
export const paintB01Band = (p: Painter, c: YCam, k = 1) => paintNearGroundShade(p, c, 37400, '#141a28', B01_BAND, k);

/** The B01 hero cat's acting at one frame. */
export type HeroAct = {state: 'sit' | 'lie'; blend?: number; lid?: number; yawn?: number; ears?: number};
const bump = (L: number, a: number, b: number) => (L <= a || L >= b ? 0 : Math.sin((Math.PI * (L - a)) / (b - a)));
/** Authored blink (lid closed for ~3 frames around `at`). */
export const blinkAt = (L: number, at: number) => Math.min(1, 1.6 * bump(L, at - 3, at + 3));

/** `new: cat-yawn` on a profile cat (picture px from the anchors): the lower jaw drops about the cheek by `k` x 42 deg, dark mouth, pink tongue,
 *  four small fangs; painted with the card's warm tint over the kit's closed mouth. */
export const paintCatYawn = (q: Painter, an: AnimalAnchors, k: number, seed = 37500) => {
  if (k <= 0.02 || !an.mouth || !an.top || !an.eye) return;
  const hs = Math.abs(an.mouth[1] - an.top[1]) / 0.28, dir = Math.sign(an.eye[0] - an.top[0]) || 1, [mx, my] = an.mouth;
  const H0: Pt = [mx - dir * 0.1 * hs, my - 0.005 * hs], U: Pt = [mx + dir * 0.075 * hs, my + 0.01 * hs];
  const th = dir * k * 0.73, v: Pt = [U[0] - H0[0], U[1] - H0[1]];
  const rot = (w: Pt, a: number): Pt => [w[0] * Math.cos(a) - w[1] * Math.sin(a), w[0] * Math.sin(a) + w[1] * Math.cos(a)];
  const lv = rot(v, th), Lt: Pt = [H0[0] + lv[0] * 0.92, H0[1] + lv[1] * 0.92];
  const mid = rot(v, th / 2), M: Pt = [H0[0] + mid[0] * 1.02, H0[1] + mid[1] * 1.02];
  const pl = Math.hypot(lv[0], lv[1]) || 1, pn: Pt = [(-lv[1] / pl) * 0.05 * hs, (lv[0] / pl) * 0.05 * hs];
  const down: Pt = pn[1] > 0 ? pn : [-pn[0], -pn[1]];
  // lower jaw and chin fur (cream chest tone) under the mouth line
  hardFill(q, seed, '#e9e2d6', [H0, Lt, [Lt[0] + down[0] * 0.7, Lt[1] + down[1] * 0.7], [H0[0] + down[0] * 1.3, H0[1] + down[1] * 1.3]]);
  hardFill(q, seed + 1, '#4a1e22', [H0, U, M, Lt]);
  hardFill(q, seed + 2, '#2a1014', [H0, [H0[0] + (U[0] - H0[0]) * 0.55, H0[1] + (U[1] - H0[1]) * 0.55 + 0.012 * hs], [H0[0] + (M[0] - H0[0]) * 0.5, H0[1] + (M[1] - H0[1]) * 0.5]]);
  const tg = (s: number, lift: number): Pt => [H0[0] + lv[0] * s - down[0] * lift, H0[1] + lv[1] * s - down[1] * lift];
  hardFill(q, seed + 3, '#e47f8a', [tg(0.25, 0.1), tg(0.6, 0.3), tg(0.86, 0.22), tg(0.84, -0.05), tg(0.3, -0.1)]);
  const fang = (at: Pt, toward: Pt, s: number, i: number) => {
    const w = 0.018 * hs, d: Pt = [toward[0] - at[0], toward[1] - at[1]], l = Math.hypot(...d) || 1, ux = d[0] / l, uy = d[1] / l;
    hardFill(q, seed + 4 + i, '#fbf6ec', [[at[0] - dir * w, at[1]], [at[0] + dir * w * 0.2, at[1]], [at[0] + ux * s * hs, at[1] + uy * s * hs]]);
  };
  fang([U[0] - dir * 0.012 * hs, U[1]], M, 0.05, 0);
  fang([Lt[0] - (Lt[0] - H0[0]) * 0.08, Lt[1] - (Lt[1] - H0[1]) * 0.08], M, 0.045, 1);
  inkLine(q, seed + 8, [H0, U], {color: '#3a2418', weight: 0.9, closed: false, still: true, curve: 0.2});
  inkLine(q, seed + 9, [H0, Lt], {color: '#3a2418', weight: 0.9, closed: false, still: true, curve: 0.2});
};

/** Loaf amount through the lie-down: the kit draws a loaf (> 0.5) as paws only at the blended foot points, which leaves a forepaw floating in front
 *  of the chest during a sit -> lie blend (G1 still 5, 2026-11-21); so the blend runs as the sphinx lie, the forelegs fold halfway (loaf 0.49, still
 *  drawn as legs) over its second half, and the loaf (paws only) takes over on the settle frame. */
export const loafOf = (blend?: number) => (blend === undefined || blend >= 1 ? 1 : 0.49 * Math.max(0, Math.min(1, (blend - 0.5) / 0.5)));
/** The hero paper CAT x4 at B01_CAT with the frame's acting; records its lead span under `id` and fills `anchors` when given. */
export const paintHeroCat = (p: Painter, c: YCam, id: string, t: number, act: HeroAct, anchors?: AnimalAnchors) => {
  const pose: Partial<AnimalPose> = act.state === 'sit'
    ? {view: 'left', state: 'sit', lid: Math.max(act.lid ?? 0, 0.9 * (act.yawn ?? 0)), ears: act.ears}
    : {view: 'left', state: 'lie', loaf: loafOf(act.blend), ...(act.blend !== undefined && act.blend < 1 ? {from: 'sit' as const, blend: act.blend} : {}), lid: act.lid ?? 0, ears: act.ears};
  const cat = paintCatCard(p, c, {at: B01_CAT, scale: CAT_SCALE.hero, t, light: LAMP, pose, anchors,
    after: act.yawn ? (q, an) => paintCatYawn(q, an, act.yawn!) : undefined});
  lead(id, `CAT paper hero x4 (${act.state})`, cat);
  return cat;
};

/** The hero cat's anchors and card outline (px) at this camera and acting, without painting (screen-space callouts read them). */
export const heroAnchors = (c: YCam, t: number, act: HeroAct): {an: AnimalAnchors; outline: Pt[]} => {
  const an: AnimalAnchors = {};
  const noop = makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t, frame: 0});
  const cat = paintHeroCat(noop, c, 'B01-ANCHORS', t, act, an);
  return {an, outline: cat?.card?.outline ?? []};
};
export {smooth};
