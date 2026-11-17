import {bodyFrame, shoulderPoint, type CastDef, type FigAnchors, type FigPose} from '../kit/cast';
import {ell, hardFill, inkLine, INK} from '../kit/draw';
import {camMove, camOf, type CamMove} from '../kit/cam-moves';
import type {ExpressionId} from '../kit/expressions';
import {paintFigureAt, type FigureAtOpts} from '../kit/figure-at';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import type {Item} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {CALLER, CARRIERS, CHILD, LIFTERS, paintCourtCap, paintRoundels, paintSkullcap, TASTER} from './cast';
import {CT, SEAT} from './hall';
import {armHull, clamp01, clipPolyPainter, lerpPt, paintPerson, type PersonOpts} from './motion22';
import {TABLE} from './palette';
import {childDishes, CS_AT, paintCover, paintDish, paintSpoon, paintSpoonHeld, paintTray, RB_AT, TRAY_AT} from './tableware';

// EDU-EP22 hall staging helpers (Boss W3.1): the seated CHILD in his armchair, the lifters behind the long table, the child's table states
// (empty at frame 0; four trays of five dishes after B02), and the sheet camera lines. Shots select states; the art lives in hall.ts,
// tableware.ts, cast.ts and the kit.

/** Sheet camera line -> kit camera. The brief's H convention (yaw 0 = camera on +z looking -z, positive yaw swings it toward +x) is the kit
 *  `orbitYCam` azimuth, so the sheet yaw passes straight through (no sign flip, unlike EDU-EP19). */
export const sheetMove = (at: V3 | [V3, V3], yaw: [number, number], r: [number, number] | number, eye: [number, number] | number, o: {f: number; hy: number; pitch?: [number, number]; cx?: number}): CamMove =>
  camMove(at, yaw, r, eye, o);
export const sine01 = (u: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.max(0, Math.min(1, u)));
export const camAt = (m: CamMove, u: number): YCam => camOf(m, sine01(u));

export type Probe = {child?: FigAnchors | null; childCapTop?: number; childVisibleBottom?: number; lifters?: (FigAnchors | null)[]};

export type ChildState = {
  t: number;
  face?: ExpressionId;
  look?: Pt;
  /** Four-view figure squared to the lens (storyboard default) or a fixed world facing (view cues). */
  view?: FigureAtOpts['view'];
  facing?: [number, number];
  /** Right arm: hand at the mouth with the spoon (`new: seated-spoon-to-mouth`, LF01b) instead of P31 hands in the lap. A number 0..1 (W5.1)
   *  blends the hand from `rHand` (or the rice bowl RB) up to the mouth: the eat cycle of SH07, SH18 and SH20. */
  eat?: boolean | number;
  /** W5.1: world targets for the mittens (reach-hover over the trays, the spoon pick-up); the right one is the eat cycle's low end. */
  rHand?: V3; lHand?: V3;
  /** W5.1: the porcelain spoon CS in the right mitten (bowl toward the rice bowl low, to the lips at the mouth). */
  spoon?: boolean;
  /** W5.1: extra body fields (headCock, lean, head turn, nod). */
  fig?: Partial<FigPose>;
  /** W5.1: hands over the child's table: repaint the forearms after CT so its top and dishes do not cover them. */
  armPass?: boolean;
};

/** Ground point that puts a P31 figure's hips at the cushion height (feet then dangle above the footstool). */
const childGround = (def: CastDef): V3 => {
  const f = bodyFrame(def, {view: 'front', sit: 1});
  return [SEAT.hips[0], SEAT.cushionY - (f.hipV - 0.05), SEAT.hips[2]];
};
export const CHILD_AT = childGround(CHILD);
/** The rice-bowl hand target of the eat cycle (spoon bowl in the rice). */
export const RB_HAND: V3 = [RB_AT[0] + 0.03, RB_AT[1] + 0.09, RB_AT[2] + 0.02];

type ChildArms = {fig: Partial<FigPose>; spoonBowl?: Pt; hulls: Pt[][]};
const childArms = (st: ChildState, c: YCam, g: Pt, u: number): ChildArms => {
  const fig: Partial<FigPose> = {...st.fig};
  const hulls: Pt[][] = [];
  const view = st.view ?? 'front';
  if (view !== 'front' || st.facing) return {fig, hulls};
  const k = CHILD.armScale ?? 1, sit = {view: 'front' as const, sit: 1};
  const shR = shoulderPoint(CHILD, g, u, sit, 'r'), shL = shoulderPoint(CHILD, g, u, sit, 'l');
  const pxR = (q: Pt): Pt => [shR[0] + q[0] * k * u, shR[1] - q[1] * k * u];
  const e = st.eat === true ? 1 : typeof st.eat === 'number' ? clamp01(st.eat) : 0;
  let spoonBowl: Pt | undefined;
  if (st.eat !== undefined && st.eat !== false) {
    // `new: seated-spoon-to-mouth` (P19 drink_cup path with a spoon): the right hand at the mouth, the elbow low and back by the ribs (CP-P depth
    // arm, upper arm behind the torso), never raised out to the side. Metres from the posed (seated) shoulder, child arm scale. W5.1: the low
    // end is the rice bowl (or `rHand`), the elbow staying by the ribs through the cycle.
    const low = camPoint(c, st.rHand ?? RB_HAND) ?? pxR([0.06, -0.3]);
    const to = lerpPt(low, pxR([0.075, 0.115]), e), via = lerpPt(pxR([0.03, -0.16]), pxR([0.0, -0.17]), e);
    fig.rArm = {to, via, behind: 'upper'};
    const rb = camPoint(c, [RB_AT[0], RB_AT[1] + 0.05, RB_AT[2]]);
    if (rb && e < 1) spoonBowl = lerpPt(rb, to, e);
    if (st.armPass && e < 0.6) hulls.push(armHull(shR, to, 0.06 * u));
  } else if (st.rHand) {
    const to = camPoint(c, st.rHand);
    if (to) { fig.rArm = {to, behind: 'upper'}; if (st.armPass) hulls.push(armHull(shR, to, 0.06 * u)); }
  }
  if (st.lHand) {
    const to = camPoint(c, st.lHand);
    if (to) { fig.lArm = {to, behind: 'upper'}; if (st.armPass) hulls.push(armHull(shL, to, 0.06 * u)); }
  }
  return {fig, spoonBowl, hulls};
};

/** CHILD seated in the armchair, P31 (`sit_chair_hands_lap`) by default. `probe` receives his anchors and the visible lead span. */
const drawChild = (p: Painter, c: YCam, st: ChildState, probe?: Probe) => {
  const at = CHILD_AT, view = st.view ?? 'front';
  const g = camPoint(c, at), u = camUnit(c, at);
  const arms = g ? childArms(st, c, g, u) : {fig: st.fig ?? {}, hulls: []};
  const eating = st.eat !== undefined && st.eat !== false;
  const a = paintFigureAt(p, c, CHILD, {
    at, t: st.t, pose: 'P31', face: st.face ?? 'neutral', faceState: st.look ? {look: st.look} : undefined, shadow: false,
    ...(st.facing ? {facing: st.facing} : {view}),
    fig: arms.fig,
    held: (q, an, uu) => {
      if (view === 'front' && !st.facing) paintRoundels(q, an, uu, 26100);
      paintSkullcap(q, an, st.facing ? 'front' : view, 26000);
      if (eating || st.spoon) paintHeldSpoon(q, an, uu, eating && typeof st.eat === 'number' ? arms.spoonBowl : st.spoon && !eating ? 'low' : undefined);
    },
  });
  if (probe && a) {
    const K = (a.chin - a.headTop) / 2.39, edge = camPoint(c, [0, CT.y, CT.z0]);
    probe.child = a; probe.childCapTop = a.head[1] - 1.24 * K; probe.childVisibleBottom = edge ? Math.min(a.bottom, edge[1]) : a.bottom;
  }
  return arms.hulls;
};
export const childItem = (st: ChildState, probe?: Probe): Item => ({at: [CHILD_AT[0], 0, CHILD_AT[2]], bias: 0.02, draw: (p, c) => { drawChild(p, c, st, probe); }});
/** The child plus, when `armPass`, a second item after CT that repaints his forearms and mittens clipped to their hulls (W5.1). */
export const childItems = (st: ChildState, probe?: Probe): Item[] => {
  const items: Item[] = [childItem(st, probe)];
  if (st.armPass) items.push({at: [0, 0, 0], bias: -0.3, draw: (p, c) => {
    const g = camPoint(c, CHILD_AT);
    if (!g) return;
    for (const h of childArms(st, c, g, camUnit(c, CHILD_AT)).hulls) if (h.length >= 3) drawChild(clipPolyPainter(p, h), c, st);
  }});
  return items;
};

/** The porcelain spoon in the right mitten: its bowl at the lips (LF01b eating), toward `bowlAt` (picture px) in the eat cycle, or held low
 *  pointing down toward the table ('low', the SH06 pick-up). W5.1: bowl 0.02 -> 0.028 m and a darker rim (Film LF01b note). */
const paintHeldSpoon = (p: Painter, a: FigAnchors, u: number, bowlAt?: Pt | 'low') => {
  const mouth: Pt = [a.head[0] + 0.01 * u, a.chin - (a.chin - a.headTop) * 0.16], h = a.rHand;
  const tgt: Pt = bowlAt === 'low' ? [h[0] + 0.05 * u, h[1] + 0.03 * u] : bowlAt ?? mouth;
  const kk = bowlAt === 'low' ? 1 : bowlAt ? 0.9 : 0.72;
  const bx = h[0] + (tgt[0] - h[0]) * kk, by = h[1] + (tgt[1] - h[1]) * kk, dx = h[0] - bx, dy = h[1] - by, L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L, w = 0.006 * u, end: Pt = [h[0] + (dx / L) * 0.03 * u, h[1] + (dy / L) * 0.03 * u];
  const handle: Pt[] = [[bx + nx * w, by + ny * w], [end[0] + nx * w * 0.7, end[1] + ny * w * 0.7], [end[0] - nx * w * 0.7, end[1] - ny * w * 0.7], [bx - nx * w, by - ny * w]];
  hardFill(p, 26300, TABLE.porcelain, handle);
  const bowl = ell(bx, by, 0.028 * u, 0.017 * u, 14, Math.atan2(dy, dx));
  hardFill(p, 26301, TABLE.porcelain, bowl);
  hardFill(p.layer(0.45, 26304 * 3), 26304, TABLE.porcelainShade, ell(bx - 0.004 * u, by + 0.002 * u, 0.017 * u, 0.009 * u, 12, Math.atan2(dy, dx)));
  inkLine(p, 26302, bowl, {weight: 1.1, color: mixColor(TABLE.blue, INK, 0.35), still: true});
  inkLine(p, 26303, handle, {weight: 0.8, color: mixColor(TABLE.porcelainShade, INK, 0.3), still: true});
};

/** Lifters E1-E3 on the far side of LT (x -4.50) at z +1.20, -0.30, -1.80, facing +x, arms down (standing in attendance). */
export const LIFTER_MARKS: V3[] = [[-4.5, 0, 1.2], [-4.5, 0, -0.3], [-4.5, 0, -1.8]];
// W5.1: sorted on LT's own key (its centre, bias 0.3) plus 0.01, so a lifter is always painted just before LT: every hall camera stands on LT's +x
// side, so a figure at x < LT.x0 is behind the table wherever they overlap (a lifter keyed at his mark sorted in front of LT's near end, SH09).
export const LT_KEY: V3 = [-3.6, 0, -0.3];
export const lifterItems = (t: number, probe?: Probe): Item[] => LIFTERS.map((def, i) => ({at: LT_KEY, bias: 0.31, draw: (p: Painter, c: YCam) => {
  const a = paintFigureAt(p, c, def, {at: LIFTER_MARKS[i], t, pose: 'P01', face: 'neutral', facing: [1, 0], seed: def.seed,
    held: (q, an) => paintCourtCap(q, an, 'front', 26200 + i * 40)});
  if (probe) (probe.lifters ??= [])[i] = a;
}}));

/** The child's table after B02: four lacquer trays with five dishes each (20), his rice bowl and spoon in front of him. */
export const paintChildSpread = (p: Painter, c: YCam) => paintSpread({trays: [0, 1, 2, 3], rb: true, cs: true})(p, c);

/** One tray with its five dishes at `at` (tray base, world), turned `rot` about the vertical (a carried tray: no table shadow). W5.1. */
export const paintTrayLoad = (p: Painter, c: YCam, i: number, at: V3, rot = 0, shadow = true) => {
  paintTray(p, c, 27000 + i * 20, at, undefined, undefined, rot, shadow);
  const cs = Math.cos(rot), sn = Math.sin(rot), base = childDishes().slice(i * 5, i * 5 + 5), t = TRAY_AT[i];
  base.map((d, k) => {
    const lx = d.at[0] - t[0], lz = d.at[2] - t[2];
    return {d: {...d, at: [at[0] + lx * cs - lz * sn, at[1] + 0.022, at[2] + lx * sn + lz * cs] as V3}, k};
  }).map((o) => ({...o, dd: Math.hypot(o.d.at[0] - c.x, o.d.at[2] - c.z)})).sort((a, b) => b.dd - a.dd)
    .forEach(({d, k}) => paintDish(p, c, 27200 + (i * 5 + k) * 50, d));
};
/** The child's table state (W5.1): which trays have landed (indices into TRAY_AT), the rice bowl RB and the spoon CS on the table. */
export const paintSpread = (o: {trays?: number[]; rb?: boolean; cs?: boolean}) => (p: Painter, c: YCam) => {
  const trays = (o.trays ?? []).map((i) => ({i, d: Math.hypot(TRAY_AT[i][0] - c.x, TRAY_AT[i][2] - c.z)})).sort((a, b) => b.d - a.d);
  for (const {i} of trays) paintTrayLoad(p, c, i, [TRAY_AT[i][0], CT.y + 0.001, TRAY_AT[i][2]]);
  if (o.rb !== false) paintDish(p, c, 28400, {kind: 'rice', r: 0.045, at: RB_AT, food: TABLE.rice});
  if (o.cs) paintSpoon(p, c, 28460, CS_AT, 0.3);
};

/** The sheet camera at shot-local frame L of an N-frame shot: the `ease` window when the line has one, else the whole shot in `sine01`. */
export const shotCam = (m: CamMove, N: number, L: number, near?: number): YCam => {
  const u = N > 1 ? L / (N - 1) : 0, c = m.ease ? camOf(m, u) : camAt(m, u);
  return near ? {...c, near} : c;
};

// ------------------------------------------------------------------------------------------------ eunuch staging (W5.1, SCENES-R1 marks)
/** Taster T's mark, caller Y's stand-by and call marks (scene sheet "Caller Y marks (R1)"). */
export const T_MARK: V3 = [-2.9, 0, 1.8];
export const Y_STANDBY: V3 = [-1.8, 0, 3.7];
export const Y_MARK: V3 = [-2.7, 0, 2.7];
/**
 * The scene sheet's tasted bowl "A01" is the bowl at z 1.68 (its tag G-TAG (-3.35, 0.90, 1.68), its cover rest (-3.35, 0.823, 1.85)), which
 * is LT_BOWLS index 1 in hall.ts (hall naming LT-A02); "A02" (z 1.32) is index 2; G-COVER (z 0.77) is the rest point of index 4. W5.1 keeps
 * the sheet's world points (binding cameras) and maps its names to these indices.
 */
export const BOWL_A01 = 1, BOWL_A02 = 2, BOWL_GCOVER = 4;

/** A porcelain spoon drawn in picture px at a hand `h`, its bowl `len` m along `ang` (radians, picture), `u` px per metre. */
export const paintSpoonPx = (p: Painter, seed: number, h: Pt, ang: number, u: number, len = 0.085) => {
  const bx = h[0] + Math.cos(ang) * len * u, by = h[1] + Math.sin(ang) * len * u, nx = -Math.sin(ang), ny = Math.cos(ang), w = 0.006 * u;
  const handle: Pt[] = [[bx + nx * w, by + ny * w], [h[0] + nx * w * 0.7, h[1] + ny * w * 0.7], [h[0] - nx * w * 0.7, h[1] - ny * w * 0.7], [bx - nx * w, by - ny * w]];
  hardFill(p, seed, TABLE.porcelain, handle);
  const bowl = ell(bx, by, 0.028 * u, 0.017 * u, 14, ang);
  hardFill(p, seed + 1, TABLE.porcelain, bowl);
  inkLine(p, seed + 2, bowl, {weight: 1.0, color: mixColor(TABLE.blue, INK, 0.35), still: true});
  inkLine(p, seed + 3, handle, {weight: 0.7, color: mixColor(TABLE.porcelainShade, INK, 0.3), still: true});
};

/** Taster T as a sorted item. `spoon`: 'hand' = the spoon hanging in his right mitten (idle), or a world spoon from `hand` to `bowl`. */
export const tasterItem = (o: PersonOpts & {spoon?: 'hand' | {hand: V3; bowl: V3}; cover?: V3}, bias = 0): Item => ({at: o.at, bias, draw: (p, c) => {
  paintPerson(p, c, TASTER, {...o, held: (q, a, u) => {
    if (o.spoon === 'hand') paintSpoonPx(q, 26600, a.rHand, Math.PI / 2 + 0.25, u);
    o.held?.(q, a, u);
  }});
  if (o.spoon && o.spoon !== 'hand') paintSpoonHeld(p, c, 26620, o.spoon.hand, o.spoon.bowl);
  if (o.cover) paintCover(p, c, 26640, o.cover, true);
}});
/** Caller Y as a sorted item (P01, court cap, the light-blue robe). */
export const callerItem = (o: Omit<PersonOpts, 't'> & {t: number}, bias = 0): Item => ({at: o.at, bias, draw: (p, c) => { paintPerson(p, c, CALLER, o); }});
/** Carriers K1-K4 standing or walking, optionally with a tray (index into TRAY_AT) carried at `tray` (world base point, turned `rot`). */
export const carrierItem = (k: number, o: PersonOpts & {tray?: {i: number; at: V3; rot: number}}, bias = 0): Item => ({at: o.at, bias, draw: (p, c) => {
  paintPerson(p, c, CARRIERS[k], o);
  if (o.tray) paintTrayLoad(p, c, o.tray.i, o.tray.at, o.tray.rot, false);
}});

/** The B05 eat cycle (W5.1, scene sheet SH20: 48 f; spoon-to-RB contacts at SH20 l 170 and l 178, the spoon at the lips at l 256 = LF01b): eat
 *  0..1 for `childItems` at shot-local frame L of a shot whose cycle origin (spoon at the mouth) is `o`. */
export const eatCycle = (L: number, o = 160): number => {
  const t = (((L - o) % 48) + 48) % 48, sm = (k: number) => k * k * (3 - 2 * k), cl = (x: number) => Math.max(0, Math.min(1, x));
  if (t < 4) return 1;
  if (t < 9) return 1 - sm(cl((t - 4) / 5));
  if (t <= 20) return 0.12 * Math.sin(Math.PI * cl((t - 10) / 8)) * (t > 10 && t < 18 ? 1 : 0);
  if (t < 32) return sm(cl((t - 20) / 12));
  return 1;
};
