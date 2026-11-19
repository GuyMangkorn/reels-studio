import type {Brush} from '../BrushCanvas';
import type {CastDef, FigAnchors, FigPose} from '../kit/cast';
import {BONE, ikElbow, shoulderPoint} from '../kit/cast';
import type {ExpressionId} from '../kit/expressions';
import {paintFigureAt} from '../kit/figure-at';
import {mittenThumbSide} from '../kit/hand-gestures';
import type {Mouth} from '../kit/head';
import {capsule, ell, hardFill, inkLine} from '../kit/draw';
import {makePainter, mixColor, type Painter, type Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import {poseFor, type AnyPoseId} from '../kit/poses';
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

export type CrewOpts = {view?: 'front' | 'back' | 'left' | 'right'; pose?: AnyPoseId; face?: ExpressionId; /** face overrides (T12: P30 gaze `look` [0, -0.2] = a little up) */ faceState?: {look?: Pt; mouth?: Mouth; open?: number}; t: number; tint?: {to: string; u: number}; fig?: Record<string, unknown>; seed: number};

/** Paint one standing / kneeling crew member with a hat. Returns anchors. */
export const paintCrew = (p: Painter, c: YCam, def: CastDef, at: V3, o: CrewOpts & {hat?: 'slouch' | 'felt'; upLeft?: boolean}) => {
  const view = o.view ?? 'front';
  return paintFigureAt(p, c, def, {at, view, pose: o.pose, face: o.face ?? 'neutral', faceState: o.faceState as never, t: o.t, tint: o.tint, fig: o.fig as never, seed: o.seed,
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

export const solveGunner = (c: YCam, def: CastDef, at: V3, o: GunnerOpts) => {
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

/**
 * T36 r2: repaints only the two flat fists of `paintSeatedGunner` (same solve, same fill, ink and seeds) on `p`. A caller that paints the gun after the man calls this
 * right after the gun, so the fists cover the grip and stock they hold. No grip/stock: nothing to repaint.
 */
export const paintGunnerFists = (p: Painter, c: YCam, def: CastDef, at: V3, o: GunnerOpts): void => {
  if (!o.grip || !o.stock) return;
  const s = solveGunner(c, def, at, o);
  if (!s) return;
  const redraws: ((q: Painter) => void)[] = [];
  const hook = (a: FigPose['rArm']) => a && {...a, onFlatFist: (r: (q: Painter) => void) => { redraws.push(r); }};
  const view = o.view ?? 'front', hatView = view === 'back' ? 'back' : view === 'right' ? 'right' : 'front';
  paintFigureAt(dryPainter(), c, def, {at, view: s.pview, face: o.face ?? 'neutral', t: o.t, tint: o.tint, seed: o.seed, shadow: false,
    fig: {...s.fig, rArm: hook(s.fig.rArm), lArm: hook(s.fig.lArm), ...(o.nod ? {nod: o.nod} : {})} as never, held: (q, an, uu) => paintHat(q, an, uu, o.seed + 900, {kind: 'slouch', view: hatView})});
  redraws.forEach((r) => r(p));
};

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

// ---------------------------------------------------------------------------------------------------------------------------------------------
// T12 (Boss, 2026-11-20): the standing and kneeling crew poses and the farmer's gesture. Every pose is a pure function of its local frame `L`; the arm
// is one solved chain per frame (shoulder from the drawn figure, IK or FK elbow, `Arm.exact`). Casting lines: see the ticket (A salute, C P30, D P44-back,
// F loader-seat-pan, G farmer point-back-over-shoulder). B (P01) and E (P34) are the kit poses through `paintCrew` unchanged.
// ---------------------------------------------------------------------------------------------------------------------------------------------
export type CrewPoseKey = 'salute' | 'p44-back' | 'loader' | 'farmer';
const c01 = (x: number) => Math.max(0, Math.min(1, x)), seg = (L: number, a: number, b: number) => c01((L - a) / (b - a));
const easeOut = (t: number) => 1 - (1 - t) * (1 - t), easeIn = (t: number) => t * t, easeIO = (t: number) => t * t * (3 - 2 * t);
const mixPt = (a: Pt, b: Pt, u: number): Pt => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];

/** A salute: local 0-2 P01, 2-8 the right hand rises (ease-out), hold to 22, 22-28 lowers (ease-in-out). */
export const saluteU = (L: number) => (L < 2 ? 0 : L < 8 ? easeOut(seg(L, 2, 8)) : L <= 22 ? 1 : 1 - easeIO(seg(L, 22, 28)));
/** Farmer's right arm: 0-3 P01, 3-9 rises (ease-out), hold to 45, 45-60 lowers (ease-in-out). */
export const farmerU = (L: number) => (L < 3 ? 0 : L < 9 ? easeOut(seg(L, 3, 9)) : L <= 45 ? 1 : 1 - easeIO(seg(L, 45, 60)));
/** Farmer's turn to the lens, 0 = looking back at the emu (L <= 47), 1 = at the lens (L >= 53). */
export const farmerTurn = (L: number) => easeIO(seg(L, 47, 53));
/** Farmer's talk windows (local): [3, 39) and [47, 76). Open 0 -> 0.7 -> 0 every 6 f inside, null outside. */
export const farmerTalk = (L: number): number | null => ((L >= 3 && L < 39) || (L >= 47 && L < 76) ? 0.7 * Math.sin((Math.PI * (((L % 6) + 6) % 6)) / 6) : null);
/** Loader: the pan is held 0.10 m above its seat to L 20, lowered L 20-30 (ease-in), seated from L 30; the hands stay on it to L 40, then go to the thighs by L 46. */
export const LOADER_LIFT = 0.1;
export const loaderLift = (L: number) => LOADER_LIFT * (1 - easeIn(seg(L, 20, 30)));
export const loaderHold = (L: number) => 1 - easeIO(seg(L, 40, 46));
/** Loader kneeling seat (m) and the pan rim half-width and pan radius the hands hold. The turn toward the gun is `LOADER_LEAN`. */
export const LOADER_AT: V3 = [0.5, 0, 0.35], PAN_RIM = 0.11, PAN_R = 0.135;
export const CREW_REACH_3D = 0.52;
/** The loader's 25 degree turn toward the gun (-x): the kit kneel has no three-quarter, so it is the picture-plane `lean` toward the gun (screen right here). */
export const LOADER_LEAN = (25 * Math.PI) / 180;

export type CrewSolveOpts = {pose: CrewPoseKey; L: number; seed: number; pan?: V3};
export type CrewSolve = {view: 'front' | 'back'; fig: Partial<FigPose>; face: ExpressionId; faceState?: {look?: Pt; mouth?: Mouth; open?: number}; hat: 'slouch' | 'felt'; pose?: AnyPoseId;
  /** longest drawn bone / the 0.26 m bone (the drawn arms) */ rRatio: number; lRatio: number; /** wrist targets (px) of the gesture arms, null where the arm is the kit's */ rTo: Pt | null; lTo: Pt | null; lean: number;
  /** drawn elbow flexion (deg; 0 = straight) per arm */ rFlex: number; lFlex: number; shoulders: {r: Pt; l: Pt}; /** px per metre at the figure */ u: number;
  /** back view only: the drawn chains (shoulder, elbow, wrist) repainted over the torso, which the kit's back view paints over the hands (T12 D) */ over?: {r: [Pt, Pt, Pt]; l: [Pt, Pt, Pt]}};
const flexOf = (S: Pt, E: Pt, W: Pt) => { const a = Math.atan2(E[1] - S[1], E[0] - S[0]), b = Math.atan2(W[1] - E[1], W[0] - E[0]); let d = Math.abs(b - a) * 180 / Math.PI; if (d > 180) d = 360 - d; return d; };
const ratioOf = (S: Pt, E: Pt, W: Pt, L: number) => Math.max(Math.hypot(E[0] - S[0], E[1] - S[1]), Math.hypot(W[0] - E[0], W[1] - E[1])) / L;

/** The pose of one crew figure at local frame L (no painting). `at` the ground point; the camera `c` gives the shoulders and targets in px. */
export const solveCrewPose = (c: YCam, def: CastDef, at: V3, o: CrewSolveOpts): CrewSolve | null => {
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return null;
  const L = BONE * (def.armScale ?? 1) * u, view = o.pose === 'p44-back' ? 'back' : 'front';
  const dry = (extra: Partial<FigPose>, pose?: AnyPoseId) => paintFigureAt(dryPainter(), c, def, {at, view, pose, face: 'neutral', t: 0, seed: o.seed, shadow: false, fig: extra as never});
  const hang = poseFor('P01', def, g as Pt, u, 'front');
  const base = {faceState: undefined as CrewSolve['faceState'], rTo: null as Pt | null, lTo: null as Pt | null, lean: 0, rFlex: 0, lFlex: 0, rRatio: 1, lRatio: 1, u};
  if (o.pose === 'salute') {
    const uu = saluteU(o.L), an = dry({})!, S = an.rShoulder;
    const hx = an.head[0], yB = an.headTop + 0.1 * u;   // the hat brim row (`paintHat`)
    const Tfull: Pt = [hx - 0.2 * u, yB + 0.03 * u], T0 = hang.rArm!.to, T = mixPt(T0, Tfull, uu);
    const E = ikElbow(S, T, L, -1);
    const rArm = uu > 0 ? {to: T, via: E, exact: true} : undefined;
    return {...base, view, fig: rArm ? {rArm} : {}, face: 'neutral', hat: 'slouch', rTo: uu > 0 ? T : null, rRatio: uu > 0 ? ratioOf(S, E, T, L) : 1, rFlex: uu > 0 ? flexOf(S, E, T) : 0, shoulders: {r: S, l: an.lShoulder}};
  }
  if (o.pose === 'farmer') {
    const uu = farmerU(o.L), turn = farmerTurn(o.L), lean = -0.06 * (1 - turn) + 0, an = dry({lean}, 'P41')!, S = an.rShoulder;
    const th = (130 * Math.PI / 180) * uu, ua = Math.atan2(Math.cos(th), -Math.sin(th)), fa = ua + (70 * Math.PI / 180) * uu;   // y-down: angle grows clockwise
    const E: Pt = [S[0] + L * Math.cos(ua), S[1] + L * Math.sin(ua)], W: Pt = [E[0] + L * Math.cos(fa), E[1] + L * Math.sin(fa)];
    const talk = farmerTalk(o.L);
    const rArm = {to: W, via: E, exact: true};
    return {...base, view, pose: 'P41', fig: {lean, rArm, lArm: hang.lArm}, face: 'angry', hat: 'felt', faceState: {look: [-0.8 * (1 - turn) + 0, 0], ...(talk !== null ? {mouth: 'talk' as Mouth, open: talk} : {})},
      rTo: W, rRatio: ratioOf(S, E, W, L), rFlex: flexOf(S, E, W), lean, shoulders: {r: S, l: an.lShoulder}};
  }
  if (o.pose === 'p44-back') {
    const an = dry({rise: 0.01})!, cx = g[0], y = (m: number) => g[1] - m * u;
    // wrists crossed at the sacrum (0.95 m): the right fist at the midline, the left mitten over the right wrist (0.98 m, a hair higher so the left arm reaches)
    const Tr: Pt = [cx - 0.02 * u, y(0.95)], Tl: Pt = [cx + 0.06 * u, y(0.98)], Sr = an.rShoulder, Sl = an.lShoulder;
    const Er = ikElbow(Sr, Tr, L, 1), El = ikElbow(Sl, Tl, L, -1);
    return {...base, view: 'back', fig: {rise: 0.01, rArm: {to: Tr, via: Er, exact: true, fist: mittenThumbSide('right', 'back'), flatFist: true}, lArm: {to: Tl, via: El, exact: true}}, face: 'neutral', hat: 'slouch',
      rTo: Tr, lTo: Tl, rRatio: ratioOf(Sr, Er, Tr, L), lRatio: ratioOf(Sl, El, Tl, L), rFlex: flexOf(Sr, Er, Tr), lFlex: flexOf(Sl, El, Tl), shoulders: {r: Sr, l: Sl}, over: {r: [Sr, Er, Tr], l: [Sl, El, Tl]}};
  }
  // loader: kneeling at `at`, both fists on the pan rim (world points from `pan`, lifted), then the thighs (P34)
  const pan = o.pan!, lift = loaderLift(o.L), hold = loaderHold(o.L);
  const rim = (s: 1 | -1): V3 => [pan[0] + s * PAN_RIM, pan[1] + lift, pan[2]];
  const A = camPoint(c, rim(1)), B = camPoint(c, rim(-1));
  if (!A || !B) return null;
  const [TrW, TlW] = A[0] <= B[0] ? [A, B] : [B, A];   // the character's right arm is screen left
  const sh = (lean: number) => dry({kneel: 1, lean}, 'P34')!;
  const lean = LOADER_LEAN * hold, an = sh(lean), thigh = poseFor('P34', def, g as Pt, u, 'front');
  const Tr = mixPt(thigh.rArm!.to, TrW, hold), Tl = mixPt(thigh.lArm!.to, TlW, hold);
  const Er = ikElbow(an.rShoulder, Tr, L, -1), El = ikElbow(an.lShoulder, Tl, L, 1);
  const closed = hold > 0;
  return {...base, view: 'front', pose: 'P34', fig: {kneel: 1, lean, rArm: closed ? {to: Tr, via: Er, exact: true, fist: mittenThumbSide('right', 'back'), flatFist: true} : thigh.rArm, lArm: closed ? {to: Tl, via: El, exact: true, fist: mittenThumbSide('left', 'back'), flatFist: true} : thigh.lArm},
    face: 'neutral', hat: 'slouch', rTo: closed ? Tr : null, lTo: closed ? Tl : null, lean, rRatio: ratioOf(an.rShoulder, Er, Tr, L), lRatio: ratioOf(an.lShoulder, El, Tl, L), rFlex: flexOf(an.rShoulder, Er, Tr), lFlex: flexOf(an.lShoulder, El, Tl), shoulders: {r: an.rShoulder, l: an.lShoulder}};
};


/** T12 D: the kit's back view paints arms under the torso unless they are raised, so crossed hands at the small of the back would vanish. The two chains are
 *  repainted over the torso here in the sleeve colour (the kit's capsule widths), the right flat fist redrawn on top, then the left forearm and its mitten over the right wrist. */
const paintBackChains = (q: Painter, ch: NonNullable<CrewSolve['over']>, def: CastDef, u: number, seed: number, fists: ((q: Painter) => void)[]) => {
  const sleeve = def.outfit.sleeve, skin = mixColor(def.head.skin, '#3a2418', 0.16), ink = mixColor(sleeve, '#141008', 0.55);
  const chain = (S: Pt, E: Pt, T: Pt, k: number) => {
    const fore = capsule(E, T, 0.056 * u, 0.046 * u), up = capsule(S, E, 0.078 * u, 0.07 * u);
    hardFill(q, seed + k, sleeve, fore); inkLine(q, seed + k + 1, fore, {weight: 0.8, color: ink, still: true});
    hardFill(q, seed + k + 2, sleeve, up); inkLine(q, seed + k + 3, up, {weight: 0.8, color: ink, still: true});
  };
  chain(...ch.r, 0);
  fists.forEach((r) => r(q));
  chain(...ch.l, 10);
  const [, E, T] = ch.l, d = Math.hypot(T[0] - E[0], T[1] - E[1]) || 1, hand: Pt = [T[0] + ((T[0] - E[0]) / d) * 0.03 * u, T[1] + ((T[1] - E[1]) / d) * 0.03 * u];
  const oval = ell(hand[0], hand[1], 0.036 * u, 0.046 * u, 14, Math.atan2(T[1] - E[1], T[0] - E[0]) - Math.PI / 2);
  hardFill(q, seed + 20, skin, oval); inkLine(q, seed + 21, oval, {weight: 0.8, color: mixColor(skin, '#2a1810', 0.5), still: true});
};

/** Paint one T12 pose. Returns the anchors and the solve. `onFists` receives the repaint functions of the flat fists (the loader repaints them over the pan). */
export const paintCrewPose = (p: Painter, c: YCam, def: CastDef, at: V3, o: CrewSolveOpts & {tint?: {to: string; u: number}; onFists?: (r: (q: Painter) => void) => void}): (FigAnchors & {solve: CrewSolve}) | null => {
  const s = solveCrewPose(c, def, at, o);
  if (!s) return null;
  const hook = (a: FigPose['rArm']) => (a && o.onFists && a.flatFist ? {...a, onFlatFist: (r: (q: Painter) => void) => o.onFists!(r)} : a);
  const fig = {...s.fig, ...(s.fig.rArm ? {rArm: hook(s.fig.rArm)} : {}), ...(s.fig.lArm ? {lArm: hook(s.fig.lArm)} : {})};
  const fists: ((q: Painter) => void)[] = [];
  const fig2 = s.over && fig.rArm ? {...fig, rArm: {...fig.rArm, onFlatFist: (r: (q: Painter) => void) => { fists.push(r); o.onFists?.(r); }}} : fig;
  const a = paintFigureAt(p, c, def, {at, view: s.view, pose: s.pose, face: s.face, faceState: s.faceState as never, t: o.L / 30, tint: o.tint, seed: o.seed, shadow: {color: '#3b2f22', op: 70}, fig: fig2 as never,
    held: (q, an, uu) => {
      paintHat(q, an, uu, o.seed + 900, {kind: s.hat, view: s.view === 'back' ? 'back' : 'front', upLeft: s.hat === 'slouch'});
      if (s.over) paintBackChains(q, s.over, def, uu, o.seed + 950, fists);
    }});
  return a && {...a, solve: s};
};
