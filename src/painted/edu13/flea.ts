import {ell, inkLine, solid, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import type {V3} from '../kit/space';

// `new: flea` (brief EDU-EP13-BRIEF-R1 N1, VD05/VD06; Film's look-frame card, W3.1). Cat-flea shape: a laterally flat oval body of four
// overlapping glossy chestnut plates (abdomen tip, abdomen, thorax, helmet-like head), one simple dark eye with a white glint, a short
// comb as ink ticks on the cheek and behind the head, sparse short bristles, six legs (near three on top, far three darker behind) and
// BIG Z-folded hind legs (femur back and up, tibia forward and down, tarsus back on the floor). No mouthparts, no blood, no face decal.
// A flat card at its ground point. UNITS: body lengths (bl): the body is 1.0 bl long (2.0 mm at macro scale, 1.80 m at person scale, VD05),
// so `len` (px per bl) is the whole scale input and the same drawing serves both. +x toward the head for `right`; `left` mirrors.
// Local body frame: origin at the body centre, x forward, y up; rotated by the pose's pitch (deg, nose up positive). Grounded states
// place the body so the lowest toe touches the ground (y 0): feet never float or sink at any scale.
// Opaque base under colour (DF-20261031-painted-opaque-cast). Kit intake into `ANIMALS` at W8 (KIT-P01) after the user's look check.

export const FLEA = {plate: '#8f4824', plateB: '#a85c30', shade: '#5a2a14', gloss: '#efb07c', leg: '#7a3a1c', legFar: '#4a2412', eye: '#1b0d08',
  ink: '#2a120a', glint: '#fff6e8', window: '#f1e6cf', windowEdge: '#b98a5a', pad: '#f0a62c', padHi: '#ffe08e', muscle: '#e0705a', catch: '#3a2a22'} as const;

export type FleaState = 'rest' | 'fold' | 'extend' | 'apex' | 'land';
export type FleaView = 'right' | 'left' | 'front';
export type FleaOpts = {
  view: FleaView;
  state?: FleaState;
  /** Blend toward `to` (0..1): every joint and the pitch interpolate (take-off ramps, the shrink). */
  to?: FleaState; blend?: number;
  /** Airborne states only: the body centre height above the ground (bl). */
  air?: number;
  /** See-through mode (B03-SH03): translucent plates, the thorax window shows the amber pad (squeeze 0..1) and the catch (locked). */
  see?: {squeeze: number; locked?: boolean};
  /** Soft contact shadow on the ground (default true when grounded). */
  shadow?: boolean;
  /** Colour-mix toward a light colour (warm sun key). */
  tint?: {to: string; u: number};
  t?: number;
};

type Leg = {h?: Pt; k: Pt; a?: Pt; t: Pt};
type Pose = {pitch: number; hind: Required<Leg>; mid: Leg; fore: Leg; grounded: boolean};
const HIP = {hind: [-0.12, -0.17] as Pt, mid: [0.04, -0.17] as Pt, fore: [0.26, -0.17] as Pt};
const hindL = (k: Pt, a: Pt, t: Pt) => ({h: HIP.hind, k, a, t});

export const POSES: Record<FleaState, Pose> = {
  // standing: legs folded Z under the rump (femur back-up, tibia forward-down, tarsus on the floor behind the body)
  rest: {pitch: -5, grounded: true, hind: hindL([-0.43, -0.04], [-0.25, -0.31], [-0.45, -0.36]), mid: {k: [0.2, -0.24], t: [0.12, -0.36]}, fore: {k: [0.4, -0.24], t: [0.36, -0.36]}},
  // crouch: body low, nose down, the Z folded tight
  fold: {pitch: -14, grounded: true, hind: hindL([-0.42, 0.08], [-0.16, -0.2], [-0.4, -0.27]), mid: {k: [0.18, -0.2], t: [0.04, -0.27]}, fore: {k: [0.36, -0.22], t: [0.3, -0.29]}},
  // push-off: hind legs fully extended back and down, toes still on the floor, nose up, fore legs reaching
  extend: {pitch: 28, grounded: true, hind: hindL([-0.42, -0.3], [-0.7, -0.48], [-0.86, -0.56]), mid: {k: [0.22, -0.2], t: [0.34, -0.1]}, fore: {k: [0.42, -0.14], t: [0.58, -0.2]}},
  // apex tuck: everything pulled in against the body
  apex: {pitch: 6, grounded: false, hind: hindL([-0.36, -0.1], [-0.18, -0.27], [-0.4, -0.26]), mid: {k: [0.16, -0.22], t: [0.06, -0.26]}, fore: {k: [0.36, -0.2], t: [0.3, -0.27]}},
  // landing: nose down, hind Z compressing, fore legs reaching forward to take the weight
  land: {pitch: -10, grounded: true, hind: hindL([-0.42, 0.02], [-0.2, -0.24], [-0.42, -0.31]), mid: {k: [0.2, -0.22], t: [0.12, -0.31]}, fore: {k: [0.5, -0.2], t: [0.6, -0.3]}},
};

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const lp = (a: Pt, b: Pt, k: number): Pt => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
const blendPose = (a: Pose, b: Pose, k: number): Pose => ({
  pitch: lerp(a.pitch, b.pitch, k), grounded: k < 0.5 ? a.grounded : b.grounded,
  hind: {h: HIP.hind, k: lp(a.hind.k, b.hind.k, k), a: lp(a.hind.a, b.hind.a, k), t: lp(a.hind.t, b.hind.t, k)},
  mid: {k: lp(a.mid.k, b.mid.k, k), t: lp(a.mid.t, b.mid.t, k)}, fore: {k: lp(a.fore.k, b.fore.k, k), t: lp(a.fore.t, b.fore.t, k)},
});
const DEG = Math.PI / 180;
const ellL = (cx: number, cy: number, rx: number, ry: number, a = 0, n = 20): Pt[] =>
  Array.from({length: n}, (_, i) => { const th = (i / n) * 2 * Math.PI, x = rx * Math.cos(th), y = ry * Math.sin(th); return [cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)]; });

/** A tapered solid stroke (polyline as a filled band, width w0 -> w1 in px). */
const band = (p: Painter, seed: number, pts: Pt[], w0: number, w1: number, color: string) => {
  if (pts.length < 2) return;
  const L: Pt[] = [], R: Pt[] = [];
  pts.forEach((q, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1;
    const w = (w0 + (w1 - w0) * (i / (pts.length - 1))) / 2;
    L.push([q[0] - (dy / n) * w, q[1] + (dx / n) * w]); R.push([q[0] + (dy / n) * w, q[1] - (dx / n) * w]);
  });
  solid(p, seed, color, [...L, ...R.reverse()], 3);
};

/** World-frame joints of the pose (bl, ground y 0, body centre x 0): used by the painter and by checks that a foot touches the floor. */
export const fleaJoints = (pose: Pose, air = 0.5) => {
  const c = Math.cos(pose.pitch * DEG), s = Math.sin(pose.pitch * DEG);
  const rot = ([x, y]: Pt): Pt => [x * c - y * s, x * s + y * c];
  const legs = {hind: pose.hind, mid: pose.mid, fore: pose.fore};
  const toes = [rot(pose.hind.t), rot(pose.mid.t), rot(pose.fore.t)];
  const by = pose.grounded ? -Math.min(...toes.map((q) => q[1])) : air;
  const w = ([x, y]: Pt): Pt => { const q = rot([x, y]); return [q[0], q[1] + by]; };
  return {by, w, rot, legs};
};

export type FleaMeasure = {head: Pt; rump: Pt; eye: Pt; thorax: Pt; hindHip: Pt; toes: Pt[]; left: number; right: number; top: number; bottom: number};

/** Paints the flea with its ground point (body centre, floor) at screen `g` and `len` px per body length. Returns key points (px). */
export const drawFlea = (p0: Painter, g: Pt, len: number, o: FleaOpts): FleaMeasure => {
  const dir = o.view === 'left' ? -1 : 1;
  const tint = (c: string) => (o.tint ? mixColor(c, o.tint.to, o.tint.u) : c);
  if (o.view === 'front') return drawFront(p0, g, len, o, tint);
  const base = POSES[o.state ?? 'rest'];
  const pose = o.to ? blendPose(base, POSES[o.to], o.blend ?? 0) : base;
  const J = fleaJoints(pose, o.air ?? 0.5);
  const S = (q: Pt): Pt => { const r = J.w(q); return [g[0] + dir * r[0] * len, g[1] - r[1] * len]; };
  const SP = (pts: Pt[]) => pts.map(S);
  const W = Math.max(0.5, len / 700), see = o.see;
  const ink = (id: number, pts: Pt[], w: number, closed = true, col: string = FLEA.ink) => inkLine(p0, id, pts, {weight: w * W, closed, color: tint(col), curve: 0.2});
  const p = p0;

  if ((o.shadow ?? pose.grounded) && J.by < 0.9) {
    const k = Math.max(0.35, 1 - J.by * 0.6);
    washAt(p, 9000, '#2a1a10', 70 * k, ell(g[0] - dir * 0.04 * len, g[1] + 0.005 * len, 0.55 * len * k, 0.045 * len * k, 20), 0.1, 0.2);
  }

  // ---- legs. Far side first (darker, offset a little back and up), then the body, then the near legs.
  const legPts = (leg: Leg, hip: Pt, far: boolean): Pt[] => {
    const off: Pt = far ? [0.06, 0.012] : [0, 0];
    const add = (q: Pt): Pt => [q[0] + off[0], q[1] + off[1]];
    return ([hip, leg.k, ...(leg.a ? [leg.a] : []), leg.t] as Pt[]).map(add);
  };
  const drawLeg = (leg: Leg, hip: Pt, far: boolean, big: boolean, seed: number) => {
    const col = tint(far ? FLEA.legFar : FLEA.leg), pts = SP(legPts(leg, hip, far)), k = far ? 0.85 : 1;
    const widths = big ? [[0.12, 0.085], [0.07, 0.042], [0.04, 0.026]] : [[0.045, 0.034], [0.034, 0.022]];
    for (let i = 0; i < pts.length - 1; i++) {
      const [w0, w1] = widths[Math.min(i, widths.length - 1)];
      if (!far) band(p, seed + 70 + i, [pts[i], pts[i + 1]], w0 * len * k + 4 * W, w1 * len * k + 4 * W, tint(FLEA.ink)); // ink edge under the colour
      band(p, seed + i, [pts[i], pts[i + 1]], w0 * len * k, w1 * len * k, col);
      solid(p, seed + 20 + i, col, ell(pts[i + 1][0], pts[i + 1][1], w1 * len * 0.6 * k, w1 * len * 0.6 * k, 8), 2);
    }
    const toe = pts[pts.length - 1], prev = pts[pts.length - 2];
    const dx = toe[0] - prev[0], dy = toe[1] - prev[1], n = Math.hypot(dx, dy) || 1;
    solid(p, seed + 30, col, ell(toe[0] + (dx / n) * 0.012 * len, toe[1] + (dy / n) * 0.012 * len, 0.026 * len, 0.014 * len, 8), 2); // foot pad
    if (!far) {
      if (big) { // gloss streak on the femur, three tibial spines
        const a = pts[0], b = pts[1];
        washAt(p, seed + 40, tint(FLEA.gloss), 150, ell((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 0.012 * len, Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.38, 0.011 * len, 10, Math.atan2(b[1] - a[1], b[0] - a[0])), 0.05, 0.1);
        const t0 = pts[1], t1 = pts[2];
        for (let s = 1; s <= 3; s++) { const q: Pt = lp(t0, t1, s / 4), nx = -(t1[1] - t0[1]), ny = t1[0] - t0[0], nl = Math.hypot(nx, ny) || 1; band(p, seed + 50 + s, [q, [q[0] + (nx / nl) * 0.035 * len, q[1] + (ny / nl) * 0.035 * len]], 0.014 * len, 0.004 * len, col); }
      }
      
    }
  };
  drawLeg(pose.fore, HIP.fore, true, false, 9100);
  drawLeg(pose.mid, HIP.mid, true, false, 9130);
  drawLeg(pose.hind, HIP.hind, true, true, 9160);

  // ---- body: abdomen tip, abdomen, thorax, head (opaque base, then colour, then the gloss and the plate rims).
  const plates: {id: number; pts: Pt[]; col: string; cut: number}[] = [
    {id: 9300, pts: ellL(-0.34, -0.03, 0.19, 0.14, -0.2), col: FLEA.plateB, cut: -0.03},
    {id: 9310, pts: ellL(-0.14, 0.01, 0.24, 0.23, 0.04), col: FLEA.plate, cut: 0.01},
    {id: 9320, pts: ellL(0.12, 0.01, 0.2, 0.225, -0.02), col: FLEA.plateB, cut: 0.01},
    {id: 9330, pts: ellL(0.35, -0.05, 0.15, 0.13, -0.15), col: FLEA.plate, cut: -0.05},
  ];
  plates.forEach(({id, pts, col, cut}) => {
    const fill = see ? mixColor(col, FLEA.window, 0.62) : col, shade = see ? mixColor(FLEA.shade, FLEA.window, 0.5) : FLEA.shade;
    solid(p, id, tint(shade), SP(pts), 5);
    solid(p, id + 1, tint(fill), SP(pts.map(([x, y]): Pt => [x, y > cut ? y : cut + (y - cut) * 0.4])), 3);
    ink(id + 2, SP(pts), 0.9);
    if (!see) washAt(p, id + 3, tint(FLEA.gloss), 120, SP(ellL(pts.reduce((s, q) => s + q[0], 0) / pts.length - 0.02, Math.max(...pts.map((q) => q[1])) - 0.06, 0.1, 0.022, -0.1, 10)), 0.05, 0.1);
  });
  if (see) seeThrough(p, SP, S, len, see, tint);

  // head details: eye, glint, tucked antenna groove, genal and pronotal combs, bristles
  const eye = S([0.41, -0.025]);
  solid(p, 9340, tint(FLEA.eye), SP(ellL(0.41, -0.025, 0.04, 0.034, 0.2, 14)), 3);
  washAt(p, 9341, FLEA.glint, 230, SP(ellL(0.42, -0.012, 0.012, 0.01, 0, 8)), 0, 0);
  ink(9342, SP([[0.28, 0.02], [0.32, 0.075], [0.37, 0.08]]), 0.9, false);
  band(p, 9343, SP([[0.3, 0.03], [0.33, 0.065], [0.36, 0.068]]), 0.02 * len, 0.012 * len, tint(FLEA.leg));
  for (let i = 0; i < 7; i++) { const x = 0.26 + 0.036 * i, y = -0.162 + 0.012 * Math.sin(i * 0.5); band(p, 9350 + i, SP([[x, y], [x - 0.03, y - 0.05]]), 0.012 * len, 0.004 * len, tint(FLEA.ink)); }
  for (let i = 0; i < 6; i++) { const y = -0.12 + 0.046 * i; band(p, 9360 + i, SP([[0.235, y], [0.19, y - 0.012]]), 0.012 * len, 0.004 * len, tint(FLEA.ink)); }
  [[-0.38, 0.1, -0.1], [-0.2, 0.235, -0.06], [-0.06, 0.245, -0.02], [0.1, 0.235, 0.02], [0.2, 0.2, 0.06]].forEach(([x, y, lean], i) =>
    band(p, 9370 + i, SP([[x, y - 0.01], [x + lean * 0.6, y + 0.03]]), 0.008 * len, 0.002 * len, tint(FLEA.ink)));

  drawLeg(pose.hind, HIP.hind, false, true, 9400);
  drawLeg(pose.mid, HIP.mid, false, false, 9460);
  drawLeg(pose.fore, HIP.fore, false, false, 9490);

  const pts = SP(plates.flatMap((q) => q.pts)), toes = [pose.hind.t, pose.mid.t, pose.fore.t].map(S);
  const all = [...pts, ...toes];
  return {head: S([0.5, -0.04]), rump: S([-0.53, -0.04]), eye, thorax: S([0.12, 0.01]), hindHip: S(HIP.hind), toes,
    left: Math.min(...all.map((q) => q[0])), right: Math.max(...all.map((q) => q[0])), top: Math.min(...all.map((q) => q[1])), bottom: Math.max(...all.map((q) => q[1]))};
};

/** See-through thorax (B03-SH03): a pale window over the thorax and the first abdomen plate with the muscle block, the amber pad that
 * squeezes (`squeeze` 0 relaxed .. 1 fully squeezed: flatter and wider) and the catch that locks it. */
const seeThrough = (p: Painter, SP: (pts: Pt[]) => Pt[], S: (q: Pt) => Pt, len: number, see: {squeeze: number; locked?: boolean}, tint: (c: string) => string) => {
  const win = ellL(0.0, 0.0, 0.34, 0.2, 0, 26);
  solid(p, 9500, tint(FLEA.window), SP(win), 3);
  washAt(p, 9501, tint(FLEA.windowEdge), 120, SP(ellL(0.0, 0.0, 0.34, 0.2, 0, 26)), 0.05, 0.1);
  // muscle block above the pad (coral, with fibre ticks)
  solid(p, 9502, tint(FLEA.muscle), SP(ellL(0.04, 0.09, 0.18, 0.05, 0.05, 16)), 3);
  for (let i = 0; i < 6; i++) { const x = -0.12 + 0.07 * i; inkLine(p, 9503 + i, SP([[x, 0.05], [x + 0.02, 0.13]]), {weight: 0.8, closed: false, color: tint(mixColor(FLEA.muscle, FLEA.ink, 0.5))}); }
  // amber pad: squeezes flatter and wider
  const sq = Math.min(1, Math.max(0, see.squeeze)), rx = 0.1 * (1 + 0.3 * sq), ry = 0.088 * (1 - 0.52 * sq), cy = -0.07 + 0.05 * sq * 0.4;
  solid(p, 9510, tint(mixColor(FLEA.pad, '#8a4a10', 0.35)), SP(ellL(-0.04, cy - 0.006, rx * 1.05, ry * 1.1, 0, 20)), 4);
  solid(p, 9511, tint(FLEA.pad), SP(ellL(-0.04, cy, rx, ry, 0, 20)), 3);
  washAt(p, 9512, tint(FLEA.padHi), 200, SP(ellL(-0.06, cy + ry * 0.35, rx * 0.5, ry * 0.25, 0, 10)), 0.05, 0.1);
  inkLine(p, 9513, SP(ellL(-0.04, cy, rx, ry, 0, 20)), {weight: 1, color: tint('#7a4510'), curve: 0.2});
  // lever from the pad down to the hind hip, and the catch (hook) that holds it
  inkLine(p, 9514, SP([[-0.1, cy - ry * 0.7], [-0.12, -0.17]]), {weight: 1.6, closed: false, color: tint(FLEA.ink)});
  const hook = see.locked ? 0 : 0.04;
  solid(p, 9515, tint(FLEA.catch), SP([[0.1, -0.15 + hook], [0.16, -0.15 + hook], [0.16, -0.06 + hook], [0.13, -0.045 + hook], [0.1, -0.06 + hook]]), 3);
  void S; void len;
};

const drawFront = (p: Painter, g: Pt, len: number, o: FleaOpts, tint: (c: string) => string): FleaMeasure => {
  const S = ([x, y]: Pt): Pt => [g[0] + x * len, g[1] - y * len];
  const SP = (pts: Pt[]) => pts.map(S);
  const W = Math.max(0.5, len / 700);
  const ink = (id: number, pts: Pt[], w: number, closed = true) => inkLine(p, id, pts, {weight: w * W, closed, color: tint(FLEA.ink), curve: 0.2});
  if (o.state !== 'apex') washAt(p, 9000, '#2a1a10', 70, ell(g[0], g[1] + 0.005 * len, 0.4 * len, 0.04 * len, 20), 0.1, 0.2);
  // laterally flat body seen end-on: a thin tall oval; the big hind legs show as two Z-folds poised at the sides, knees high
  [-1, 1].forEach((k, i) => {
    // short, stout Z: thick femur out to a low knee, tibia back in, foot planted just outside the body (a poised hopper, not a spider)
    const pts = SP([[k * 0.09, 0.3], [k * 0.26, 0.4], [k * 0.2, 0.15], [k * 0.25, 0.02]]);
    for (let j = 0; j < 3; j++) { const w = [[0.15, 0.115], [0.1, 0.07], [0.055, 0.04]][j]; band(p, 9103 + i * 8 + j, [pts[j], pts[j + 1]], w[0] * len + 4 * W, w[1] * len + 4 * W, tint(FLEA.ink)); band(p, 9100 + i * 8 + j, [pts[j], pts[j + 1]], w[0] * len, w[1] * len, tint(FLEA.leg)); }
    solid(p, 9110 + i, tint(FLEA.leg), ell(pts[3][0], pts[3][1], 0.04 * len, 0.016 * len, 8), 2);
  });
  const body = ellL(0, 0.3, 0.14, 0.3);
  solid(p, 9120, tint(FLEA.shade), SP(body), 5);
  solid(p, 9121, tint(FLEA.plateB), SP(ellL(0, 0.31, 0.13, 0.285)), 3);
  ink(9122, SP(body), 0.9);
  for (let i = 0; i < 4; i++) ink(9125 + i, SP([[-0.1, 0.12 + 0.12 * i], [0.1, 0.12 + 0.12 * i]]), 0.7, false); // plate seams
  [-1, 1].forEach((k, i) => { const a = S([k * 0.06, 0.18]), b = S([k * 0.09, 0.02]); band(p, 9130 + i, [a, b], 0.04 * len, 0.025 * len, tint(FLEA.leg)); solid(p, 9140 + i, tint(FLEA.leg), ell(b[0], b[1], 0.03 * len, 0.014 * len, 8), 2); });
  // helmet head: small and round, two eyes (kept small so it stays friendly) with glints, comb ticks on the cheeks, antenna stubs
  const head = ellL(0, 0.64, 0.15, 0.15, 0, 26);
  solid(p, 9150, tint(FLEA.shade), SP(head), 5);
  solid(p, 9151, tint(FLEA.plate), SP(head.map(([x, y]): Pt => [x, y > 0.64 ? y : 0.64 + (y - 0.64) * 0.5])), 3);
  ink(9152, SP(head), 0.9);
  washAt(p, 9153, tint(FLEA.gloss), 160, SP(ellL(-0.02, 0.74, 0.08, 0.02, -0.1, 10)), 0.05, 0.1);
  [-1, 1].forEach((k, i) => {
    solid(p, 9160 + i, tint(FLEA.eye), SP(ellL(k * 0.065, 0.645, 0.03, 0.036, 0, 14)), 3);
    washAt(p, 9162 + i, FLEA.glint, 230, SP(ellL(k * 0.065 + 0.009, 0.66, 0.011, 0.009, 0, 8)), 0, 0);
    band(p, 9164 + i, SP([[k * 0.04, 0.78], [k * 0.06, 0.84], [k * 0.1, 0.85]]), 0.018 * len, 0.01 * len, tint(FLEA.leg));
  });
  for (let i = 0; i < 6; i++) { const x = -0.1 + 0.04 * i; band(p, 9170 + i, SP([[x, 0.5 - 0.012 * Math.cos(i * 0.6)], [x * 1.15, 0.45]]), 0.011 * len, 0.004 * len, tint(FLEA.ink)); }
  const all = SP([...head, [-0.4, 0.01], [0.4, 0.01], [-0.38, 0.5], [0.38, 0.5]]);
  return {head: S([0, 0.64]), rump: S([0, 0.3]), eye: S([0.065, 0.645]), thorax: S([0, 0.3]), hindHip: S([0.1, 0.3]), toes: [S([-0.25, 0.02]), S([0.25, 0.02])],
    left: Math.min(...all.map((q) => q[0])), right: Math.max(...all.map((q) => q[0])), top: Math.min(...all.map((q) => q[1])), bottom: Math.max(...all.map((q) => q[1]))};
};

/** The flea through the yaw camera: card at its ground point `at` (body centre on the floor). `len` is the body length in the camera's units
 * (1.8 m at person scale, 2.0 mm at macro scale); one drawing for both (VD05). */
export const paintFlea = (p: Painter, c: YCam, at: V3, len: number, o: FleaOpts): FleaMeasure | null => {
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return null;
  return drawFlea(p, g, u * len, o);
};
