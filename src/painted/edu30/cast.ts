import type {Brush} from '../BrushCanvas';
import type {CastDef, FigAnchors, FigPose} from '../kit/cast';
import {BONE, ikElbow, shoulderPoint} from '../kit/cast';
import type {ExpressionId} from '../kit/expressions';
import {paintFigureAt} from '../kit/figure-at';
import {mittenThumbSide} from '../kit/hand-gestures';
import type {Mouth} from '../kit/head';
import {hardFill, inkLine} from '../kit/draw';
import {makePainter, mixColor, type Painter, type Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import type {AnyPoseId} from '../kit/poses';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';

// EDU-EP30 cast (VD30-06, CAT02 generic faces; Film W3 look assets 2026-11-19, Boss hardens and files at kit intake). Casting lines:
//   MEREDITH `man-parted + new: aus-army-1932-officer` (khaki tunic, Sam Browne belt, breeches, leggings, slouch hat, plain brass disc)
//   GUNNER-1 `man-crop + new: aus-army-1932-gunner` (khaki shirt, sleeves short, trousers, puttees, slouch hat)
//   GUNNER-2 `man-buzz + new: aus-army-1932-gunner`
//   FARMER `man-elder + new: wheatbelt-farmer-1932` (wide felt hat, collarless shirt, braces, dusty trousers, boots)
// Kit heads unchanged (no likeness). The slouch hat and the felt hat are `new:` headwear painted from the head anchors after the figure
// (the kit hat kinds are cap, helmet, nurse, top, bonnet).

export const KHAKI = {tunic: '#8c7d55', shirt: '#9b8b5f', trouser: '#7f7150', puttee: '#6d6045', boot: '#3b2c20', belt: '#5c3b22', brass: '#c9a54a', hat: '#7a6b49', band: '#3a3024'} as const;

const man = (id: keyof typeof PEOPLE) => PEOPLE[id];
export const MEREDITH: CastDef = {...man('man-parted'), outfit: {...man('man-parted').outfit, shoulder: 0.42, shirt: KHAKI.tunic, sleeve: KHAKI.tunic, longSleeves: true, jacket: KHAKI.tunic, pants: KHAKI.trouser, shoes: KHAKI.boot, boots: true,
  gear: {belt: {color: KHAKI.belt, h: 0.045, buckle: KHAKI.brass}, pockets: true, badge: KHAKI.brass, collar: {kind: 'v', color: mixColor(KHAKI.tunic, '#2a2418', 0.2), depth: 0.1}}}};
export const GUNNER1: CastDef = {...man('man-crop'), outfit: {...man('man-crop').outfit, shirt: KHAKI.shirt, sleeve: KHAKI.shirt, longSleeves: false, pants: KHAKI.trouser, shoes: KHAKI.puttee, boots: true, gear: {belt: {color: KHAKI.belt, h: 0.04}, pockets: true}}};
export const GUNNER2: CastDef = {...man('man-buzz'), outfit: {...man('man-buzz').outfit, shirt: KHAKI.shirt, sleeve: KHAKI.shirt, longSleeves: false, apron: undefined, pants: KHAKI.trouser, shoes: KHAKI.puttee, boots: true, gear: {belt: {color: KHAKI.belt, h: 0.04}, pockets: true}}};
export const FARMER: CastDef = {...man('man-elder'), outfit: {...man('man-elder').outfit, shirt: '#c9bfa6', sleeve: '#c9bfa6', longSleeves: true, jacket: undefined, coat: undefined, pants: '#5d5446', shoes: '#3a2c20', boots: true, gear: {belt: {color: '#4a3a2a', h: 0.03}}}};

/** Slouch hat (front/back view): a wide brim ellipse and a pinched crown with a dark band; `upLeft` turns the brim up on the wearer's left
 *  (screen right in front view), the Australian way. `felt` = the farmer's wide-brim felt hat (rounder crown, no turn-up). */
export const paintHat = (p: Painter, a: FigAnchors, u: number, seed: number, o: {kind: 'slouch' | 'felt'; view: 'front' | 'back' | 'left' | 'right'; color?: string; upLeft?: boolean}) => {
  const col = o.color ?? (o.kind === 'felt' ? '#6a5a42' : KHAKI.hat), [hx] = a.head, top = a.headTop, r = (o.kind === 'felt' ? 0.25 : 0.23) * u, yB = top + (o.view === 'back' ? 0.13 : 0.1) * u;
  const brim: Pt[] = Array.from({length: 22}, (_, i) => { const t = (i / 22) * Math.PI * 2; return [hx + r * Math.cos(t), yB + 0.028 * u * Math.sin(t)] as Pt; });
  if (o.upLeft && o.view !== 'left' && o.view !== 'right') {   // turned-up side: the brim's screen-right half (front) / left half (back) lifted against the crown
    const s = o.view === 'front' ? 1 : -1;
    brim.forEach((q, i) => { const dx = (q[0] - hx) * s; if (dx > 0.3 * r) brim[i] = [hx + s * (0.3 * r + (dx - 0.3 * r) * 0.35), q[1] - (dx - 0.3 * r) * 1.1]; });
  }
  hardFill(p, seed, mixColor(col, '#1e1a12', 0.18), brim);
  const cw = 0.135 * u, ch = (o.kind === 'felt' ? 0.15 : 0.14) * u;
  const crown: Pt[] = [[hx - cw, yB], [hx - cw * 0.95, yB - ch * 0.7], [hx - cw * 0.55, yB - ch], [hx, yB - ch * (o.kind === 'felt' ? 1 : 0.86)], [hx + cw * 0.55, yB - ch], [hx + cw * 0.95, yB - ch * 0.7], [hx + cw, yB]];
  hardFill(p, seed + 1, col, crown);
  hardFill(p, seed + 2, KHAKI.band, [[hx - cw, yB], [hx - cw * 0.98, yB - 0.03 * u], [hx + cw * 0.98, yB - 0.03 * u], [hx + cw, yB]]);
  inkLine(p, seed + 3, crown, {closed: false, weight: 0.6, color: mixColor(col, '#141008', 0.6), still: true});
};

export type CrewOpts = {view?: 'front' | 'back' | 'left' | 'right'; pose?: AnyPoseId; face?: ExpressionId; t: number; tint?: {to: string; u: number}; fig?: Record<string, unknown>; seed: number};

/** Paint one standing / kneeling crew member with a hat. Returns anchors. */
export const paintCrew = (p: Painter, c: YCam, def: CastDef, at: V3, o: CrewOpts & {hat?: 'slouch' | 'felt'; upLeft?: boolean}) => {
  const view = o.view ?? 'front';
  return paintFigureAt(p, c, def, {at, view, pose: o.pose, face: o.face ?? 'neutral', t: o.t, tint: o.tint, fig: o.fig as never, seed: o.seed,
    shadow: {color: '#3b2f22', op: 70},
    held: o.hat ? (q, a, u) => paintHat(q, a, u, o.seed + 900, {kind: o.hat!, view, upLeft: o.upLeft}) : undefined});
};

/** GUNNER-1 `new: seated-gunner` (W3 proposal, T11 hardened): sitting on the ground behind the gun (floorSit). Without `grip` and `stock` the W3 depth
 *  arms are drawn exactly as before (the locked LF01a). With them both fists are solved onto the gun's world points (`lewisAnchors` grip and stock; RIGHT
 *  hand on the grip, LEFT on the stock) as `Arm.exact` chains from the drawn shoulders, and each round's recoil jolt (`jolt` 0..1) moves the upper body. */
export type GunnerView = 'front' | 'back' | 'right' | 'front34';
export type GunnerOpts = {view?: GunnerView; face?: ExpressionId; mouth?: Mouth; nod?: Pt; t: number; tint?: {to: string; u: number}; seed: number; grip?: V3; stock?: V3; jolt?: number};
/** Forward lean of the seated torso (profile `bend`), the wrist reach limit (2 x 0.26 m) and the per-round jolt (m along -barrel at j 1). */
export const GUNNER_BEND = 0.25, GUNNER_REACH = 0.52, GUNNER_JOLT = 0.015;
const BODY = {floorSit: 1} as const;

const dryPainter = () => makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: 0, frame: 0});
const hnorm = (a: V3, b: V3): [number, number] => { const x = a[0] - b[0], z = a[2] - b[2], l = Math.hypot(x, z) || 1; return [x / l, z / l]; };

/** World shoulders (m) of the seated gunner: forward along the barrel (horizontal grip - stock), the bend's forward shift and height from the kit's profile
 *  shoulder, half-width from its front shoulder, minus the jolt along the barrel. The reach check uses these in every view. */
export const gunnerShoulders = (def: CastDef, at: V3, grip: V3, stock: V3, jolt = 0) => {
  const [fx, fz] = hnorm(grip, stock), pf = {...BODY, view: 'right' as const, bend: GUNNER_BEND}, sp = shoulderPoint(def, [0, 0], 1, pf, 'r');
  const sr = shoulderPoint(def, [0, 0], 1, {...BODY, view: 'front'}, 'r'), half = Math.abs(sr[0]);
  const fwd = sp[0] - GUNNER_JOLT * jolt, h = -sp[1], rx = -fz, rz = fx;
  const W = (s: 1 | -1): V3 => [at[0] + fx * fwd + rx * half * s, at[1] + h, at[2] + fz * fwd + rz * half * s];
  return {r: W(1), l: W(-1)};
};
const dist3 = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
/** Reach (m) from each world shoulder to its wrist target: right to the grip, left to the stock. */
export const gunnerReach = (def: CastDef, at: V3, grip: V3, stock: V3, jolt = 0) => { const s = gunnerShoulders(def, at, grip, stock, jolt); return {r: dist3(s.r, grip), l: dist3(s.l, stock)}; };

/** Arm geometry and bone ratios of one placement (picture px; ratio = longest bone over the 0.26 m bone at this scale). */
export type GunnerCheck = {rRatio: number; lRatio: number; /** torso turn used (rad): profile `bend`, else picture-plane `lean` */ turn: number; /** the base turn before the jolt */ turn0: number; shoulder: Pt; rShoulder: Pt; lShoulder: Pt};

const solveGunner = (c: YCam, def: CastDef, at: V3, o: GunnerOpts) => {
  const view = o.view ?? 'front', g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return null;
  const pview = view === 'front34' ? 'front' : view;
  const quarter = view === 'front34' ? {quarter: 'right' as const, quarterDeg: 35} : {};
  const base = (extra: Partial<FigPose>) => ({...BODY, bend: GUNNER_BEND, ...quarter, ...extra});
  const dry = (extra: Partial<FigPose>, arms?: Partial<FigPose>) => paintFigureAt(dryPainter(), c, def, {at, view: pview, face: o.face ?? 'neutral', t: o.t, seed: o.seed, shadow: false, fig: {...base(extra), ...arms} as never});
  const grip = o.grip!, stock = o.stock!, jolt = o.jolt ?? 0;
  // Jolt: the upper body turns about the hips (`bend` in profile, `lean` in the picture plane otherwise) by the amount that moves the shoulders 0.015 m x j along -barrel.
  const key = pview === 'right' ? 'bend' : 'lean';
  let p0 = pview === 'right' ? GUNNER_BEND : 0;
  const Wr = camPoint(c, grip), Wl = camPoint(c, stock), L0 = BONE * (def.armScale ?? 1) * u;
  if (pview !== 'right' && Wr && Wl) {
    // The kit leans the torso forward only in profile (`bend`). In the front, three-quarter and back views the lean toward the gun is a picture-plane turn about the
    // hips (`lean`): the smallest turn (either side, 0.005 rad steps up to 0.4) that brings both drawn shoulders within 1.01 x 2 bones (the jolt peak then stays under 1.05 x a bone) of their fists; none when already inside.
    const excess = (lean: number) => { const a = dry({lean}); return a ? Math.max(Math.hypot(a.rShoulder[0] - Wr[0], a.rShoulder[1] - Wr[1]), Math.hypot(a.lShoulder[0] - Wl[0], a.lShoulder[1] - Wl[1])) - 2.02 * L0 : 0; };
    if (excess(0) > 0) {
      let best = {lean: 0, e: excess(0)};
      search: for (let n = 1; n <= 80; n++) for (const sg of [1, -1]) {
        const e = excess(sg * n * 0.005);
        if (e < best.e) best = {lean: sg * n * 0.005, e};
        if (e <= 0) break search;
      }
      p0 = best.lean;
    }
  }
  let pj = p0;
  if (jolt) {
    const sw = gunnerShoulders(def, at, grip, stock, 0), sj = gunnerShoulders(def, at, grip, stock, jolt), a = camPoint(c, sw.r), b = camPoint(c, sj.r);
    const a0 = dry({[key]: p0}), a1 = dry({[key]: p0 + 0.05});
    if (a && b && a0 && a1) {
      const k = (a1.rShoulder[0] + a1.lShoulder[0] - a0.rShoulder[0] - a0.lShoulder[0]) / 2 / 0.05;
      if (Math.abs(k) > 1e-6) pj = p0 + (b[0] - a[0]) / k;
    }
  }
  const body = {[key]: pj} as Partial<FigPose>, an = dry(body);
  const T = {r: camPoint(c, grip), l: camPoint(c, stock)};
  if (!an || !T.r || !T.l) return null;
  const L = BONE * (def.armScale ?? 1) * u, mk = (S: Pt, W: Pt, back: boolean, side: 'right' | 'left'): {arm: NonNullable<FigPose['rArm']>; ratio: number} => {
    const dir = pview === 'right' ? 1 : -1, out = pview === 'right' ? -dir : g[0] > S[0] ? 1 : -1, E = ikElbow(S, W, L, out);
    void back;
    return {arm: {to: W, via: E, exact: true, flatFist: true, fist: mittenThumbSide(side, 'back')}, ratio: Math.max(Math.hypot(E[0] - S[0], E[1] - S[1]), Math.hypot(W[0] - E[0], W[1] - E[1])) / L};
  };
  const R = mk(an.rShoulder, T.r, view === 'back', 'right'), Lf = mk(an.lShoulder, T.l, view === 'back', 'left');
  return {fig: {...base(body), rArm: R.arm, lArm: Lf.arm} as Partial<FigPose>, pview, check: {rRatio: R.ratio, lRatio: Lf.ratio, turn: pj, turn0: p0, shoulder: [(an.rShoulder[0] + an.lShoulder[0]) / 2, (an.rShoulder[1] + an.lShoulder[1]) / 2] as Pt, rShoulder: an.rShoulder, lShoulder: an.lShoulder} as GunnerCheck};
};
/** Bone ratios and drawn shoulders of a gun-fitted placement (no painting). */
export const gunnerCheck = (c: YCam, def: CastDef, at: V3, o: GunnerOpts & {grip: V3; stock: V3}): GunnerCheck | null => solveGunner(c, def, at, o)?.check ?? null;

export const paintSeatedGunner = (p: Painter, c: YCam, def: CastDef, at: V3, o: GunnerOpts): (FigAnchors & {check?: GunnerCheck}) | null => {
  const view = o.view ?? 'front', hatView = view === 'back' ? 'back' : view === 'right' ? 'right' : 'front';
  const faceState = o.mouth ? {mouth: o.mouth} : undefined;
  if (o.grip && o.stock) {
    const s = solveGunner(c, def, at, o);
    if (!s) return null;
    const a = paintFigureAt(p, c, def, {at, view: s.pview, face: o.face ?? 'neutral', faceState, t: o.t, tint: o.tint, seed: o.seed, shadow: {color: '#3b2f22', op: 70},
      fig: {...s.fig, ...(o.nod ? {nod: o.nod} : {})} as never, held: (q, an, uu) => paintHat(q, an, uu, o.seed + 900, {kind: 'slouch', view: hatView})});
    return a && {...a, check: s.check};
  }
  // W3 depth arms (no gun points): the locked LF01a drawing, unchanged.
  const gp = camPoint(c, at), u = camUnit(c, at);
  if (!gp) return null;
  const v = view === 'back' ? 'back' : 'front', sr = shoulderPoint(def, gp, u, {view: v, ...BODY}, 'r'), sl = shoulderPoint(def, gp, u, {view: v, ...BODY}, 'l');
  const arms = v === 'back'
    ? {rArm: {via: [sr[0] + 0.1 * u, sr[1] + 0.22 * u] as Pt, to: [sr[0] + 0.08 * u, sr[1] + 0.1 * u] as Pt}, lArm: {via: [sl[0] - 0.1 * u, sl[1] + 0.22 * u] as Pt, to: [sl[0] - 0.05 * u, sl[1] + 0.12 * u] as Pt}}
    : {rArm: {via: [sr[0] - 0.06 * u, sr[1] + 0.2 * u] as Pt, to: [sr[0] + 0.06 * u, sr[1] + 0.2 * u] as Pt, toCam: 0.6}, lArm: {via: [sl[0] + 0.06 * u, sl[1] + 0.2 * u] as Pt, to: [sl[0] - 0.02 * u, sl[1] + 0.24 * u] as Pt, toCam: 0.6}};
  return paintFigureAt(p, c, def, {at, view: v, face: o.face ?? 'neutral', faceState, t: o.t, tint: o.tint, seed: o.seed, shadow: {color: '#3b2f22', op: 70},
    fig: {...BODY, ...arms, ...(o.nod ? {nod: o.nod} : {})} as never, held: (q, a, uu) => paintHat(q, a, uu, o.seed + 900, {kind: 'slouch', view: v})});
};
