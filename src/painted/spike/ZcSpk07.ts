import type {PaintContext} from '../BrushCanvas';
import type {Pt} from '../painter';
import {drawFig, foldTone, strokes, H6, prt, TEX_B, tub, unitHU, type Fig, type HU, type Part} from '../zcpaint/body6';
import {bustFig, keyTravel, placeClose} from '../zcpaint/bust';
import {YOU} from '../zcpaint/cast';
import {cel, hull} from '../zcpaint/light';
import {dim, flatKit, type Flat} from '../zcpaint/sets';

// Film spike SPK-ZCP-07 (30 Oct 2026): B06-SH02 reach into the fridge with a projected (3D-like) arm, painted with the R2.6 look.
// Projection contract PJ-ZCP-07 (spike only): the back bust stays a flat card on the body plane z = 0 (its 2D placement is unchanged:
// head 560 px, chin y 900, head x 135). Everything in front of it (the fridge, the box, the reaching arm) is modelled in 3D in the bust's
// head units (x = HIS right = screen right in a back view, y up from the floor, z forward into the fridge, away from the camera) and
// projected by one pinhole camera: s = D / (D + z), x' = ax + (x − ax)·s, y' = ay + (y − ay)·s. At z = 0 this is the identity, so the
// card and the projected parts agree on the body plane. Sheet camera: F 1844, head 0.283 m → D = 0.93 m = 3.29 heads; VP (540, 560) →
// axis (0.723, 5.607) heads. Draw order is by depth: fridge interior → box → hand → forearm → upper arm → torso card → head (the torso
// occludes the arm root because the arm reaches FORWARD, away from the camera).
// Spike entry only (zcpaint-spk07-index.ts); no production plate imports this file.

export type Variant = 'A' | 'B' | 'C';
type V3 = [number, number, number];
type Cam = {D: number; ax: number; ay: number};

const HEAD_X = 135, HEAD_PX = 560, CHIN_Y = 900;
const SHEET_CAM: Cam = {D: 3.29, ax: (540 - HEAD_X) / HEAD_PX, ay: 5 + (CHIN_Y - 560) / HEAD_PX};
/** C: the camera 0.25 m closer, 0.2 m higher and 0.12 m further to his right (looks down over the right shoulder into the shelf). */
const HIGH_CAM: Cam = {D: 2.4, ax: 1.15, ay: 6.3};
const CAM: Record<Variant, Cam> = {A: SHEET_CAM, B: SHEET_CAM, C: HIGH_CAM};
/** The box's bottom-centre on the shoulder-height shelf (y 4.1 = 1.16 m). A, C: the front half, beside his shoulder (a bent-elbow reach);
 *  B: the back half and to the right (a near-straight reach, 94 % of the arm, with a bigger shoulder lead). */
const BOX0: Record<Variant, V3> = {A: [0.75, 4.1, 2.0], B: [1.1, 4.1, 2.15], C: [0.75, 4.1, 2.0]};
/** Shoulder lead (forward travel of the shoulder joint at full reach, heads): the scapula protracts more for a longer reach. */
const LEAD: Record<Variant, number> = {A: 0.2, B: 0.35, C: 0.2};
const BOX_W = 0.62, BOX_H = 0.24, BOX_D = 0.42;

// ---------------------------------------------------------------- vector helpers

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a: V3) => Math.hypot(a[0], a[1], a[2]);
const nrm = (a: V3): V3 => mul(a, 1 / (len(a) || 1));
const lerp3 = (a: V3, b: V3, t: number): V3 => add(a, mul(sub(b, a), t));
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/** Minimum-jerk profile (Flash & Hogan 1985): the bell-shaped hand speed of a natural reach. */
const mj = (t: number) => {
  const u = clamp01(t);
  return u * u * u * (10 - 15 * u + 6 * u * u);
};
const seg = (pf: number, a: number, b: number) => clamp01((pf - a) / (b - a));

// ---------------------------------------------------------------- projection

const scaleAt = (c: Cam, z: number) => c.D / (c.D + Math.max(z, 0.35 - c.D));
const proj = (c: Cam, p: V3): HU => {
  const s = scaleAt(c, p[2]);
  return [c.ax + (p[0] - c.ax) * s, c.ay + (p[1] - c.ay) * s];
};
const REF = placeClose(bustFig(YOU, {view: 'back', legs: false}), HEAD_X, HEAD_PX, CHIN_Y, 1);
const plate = (h: HU): Pt => [REF.gx + REF.k * h[0] * H6, REF.gy - REF.k * h[1] * H6];
const P3 = (c: Cam, p: V3): Pt => plate(proj(c, p));

// ---------------------------------------------------------------- the reach (pf clock of the shared plate, 63 f)

/**
 * Phases (research notes in build-notes "Film SPK-ZCP-07"): pf 0-6 the door opens (his left hand, hidden in front of his torso); pf 6-15
 * transport (minimum-jerk, the hand arcs out and up, the shoulder leads forward, the hand turns palm-in → palm-down-in toward the box);
 * pf 15-17 grasp (hand still, contact); pf 17-24 lift and draw back (the box comes up 0.15 and toward him 0.45); held to the end.
 */
/** Elbow pole: out to his right, a little down and back (the elbow opens to the side on a forward reach; it does not hang). */
const POLE: V3 = nrm([0.75, -0.8, -0.35]);

type Pose = {S: V3; W: V3; F: V3; N: V3; box: V3; lead: number; pole: V3};
const W_REST: V3 = [0.9, 2.72, 0.05];
const F_REST: V3 = [0, -1, 0.08];
const N_REST: V3 = [-1, 0, 0];
const reach = (v: Variant, pf: number): Pose => {
  const b0 = BOX0[v];
  const t = mj(seg(pf, 6, 15)), lift = mj(seg(pf, 17, 24));
  const boxMove: V3 = mul([-0.08, 0.08, -0.3], lift);
  const box = add(b0, boxMove);
  // Grasp from his side of the box: the hand lies on the box top with the fingers pointing in (toward his midline) and a little forward,
  // palm down, the back of the hand up toward the camera (which is above the shelf). In a back view a hand that points into depth hides
  // behind its own cuff (renders 1-2), so the grasp turns the hand across the view: the mitten reads at full length beside the cuff.
  const Fg = nrm([-1, -0.2, 0.35]);
  const Ng0: V3 = [0, -1, 0];
  const Ng = nrm(sub(Ng0, mul(Fg, dot(Ng0, Fg))));
  const grip: V3 = add(b0, [0.04, BOX_H + 0.05, -0.04]);
  const Wg = sub(grip, mul(Fg, 0.2));
  // Transport path: straight line plus an outward and upward arc (the hand never travels a straight line, Williams; Thomas & Johnston).
  const arc = Math.sin(Math.PI * t);
  const W = add(add(lerp3(W_REST, Wg, t), mul([0.14, 0.12, -0.05], arc)), boxMove);
  const F = nrm(lerp3(F_REST, Fg, mj(seg(pf, 7, 14))));
  const N = nrm(lerp3(N_REST, Ng, mj(seg(pf, 7, 14))));
  // Shoulder lead: the scapula protracts and lifts as the arm goes forward (it moves first and settles back a little on the draw-back).
  const lead = mj(seg(pf, 5, 12)) * (1 - 0.4 * lift);
  const S = add([0.6, 4.4, 0], mul([0.02, 0.06, LEAD[v]], lead));
  // Elbow drop on the draw-back: the pole swings from out-and-down to down-and-back, so the forearm lowers instead of standing up.
  const pole = nrm(lerp3(POLE, [0.35, -1, -0.45], lift));
  return {S, W, F, N, box, lead, pole};
};

/** Two-bone IK in 3D with a pole: the elbow on the side of `pole` (down, out and back = the elbow drop of a forward reach). */
const ik3 = (S: V3, T: V3, l1: number, l2: number, pole: V3): V3 => {
  const d0 = sub(T, S), dl = len(d0);
  const d = Math.min(dl, l1 + l2 - 1e-4);
  const u = mul(d0, 1 / (dl || 1));
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const pv = nrm(sub(pole, mul(u, dot(pole, u))));
  return add(add(S, mul(u, a)), mul(pv, h));
};

/** The mitten in 3D (BODY-ZCP-6H: 0.40 long, 0.24-0.26 across, about 0.12 thick, one hull with the thumb lobe), projected and hulled. */
const mitten = (c: Cam, W: V3, F: V3, N: V3, skin: string): Part => {
  const T = nrm(cross(N, F)); // thumb axis (his right hand, palm along N)
  const pts: HU[] = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * 2 * Math.PI;
    for (const w of [-0.06, 0, 0.06]) {
      const p = add(add(add(W, mul(F, 0.2 + 0.2 * Math.cos(a))), mul(T, 0.125 * Math.sin(a))), mul(N, w));
      pts.push(proj(c, p));
    }
    const th = add(add(add(W, mul(F, 0.12 + 0.07 * Math.cos(a))), mul(T, -0.13 + 0.06 * Math.sin(a))), mul(N, 0.03));
    pts.push(proj(c, th));
  }
  const s = scaleAt(c, W[2] + 0.2 * F[2]);
  return prt(skin, hull(pts.map(([x, y]): Pt => [x, y])) as HU[], 0.09 * s, {up: true});
};

/** His right arm (screen right in the back view): hand, forearm sleeve and cuff, upper-arm sleeve, back to front. */
const armParts = (c: Cam, q: Pose, over: string, skin: string): Part[] => {
  const pole = q.pole;
  const E = ik3(q.S, q.W, 0.9, 0.88, pole);
  const sS = scaleAt(c, q.S[2]), sE = scaleAt(c, E[2]), sW = scaleAt(c, q.W[2]);
  const s2 = proj(c, q.S), e2 = proj(c, E), w2 = proj(c, q.W);
  const midFE = proj(c, lerp3(E, q.W, 0.5)), midSE = proj(c, lerp3(q.S, E, 0.5));
  const sFE = scaleAt(c, (E[2] + q.W[2]) / 2), sSE = scaleAt(c, (q.S[2] + E[2]) / 2);
  const dW = unitHU([w2[0] - e2[0], w2[1] - e2[1]]);
  // The sleeve ends at the cuff opening, not in a round cap past the wrist: the tube stops one cuff radius short, so the hand that goes on
  // into depth shows beyond it (renders 1-4: the cap hid the hand).
  const wc: HU = [w2[0] - dW[0] * 0.15 * sW, w2[1] - dW[1] * 0.15 * sW];
  const fold = foldTone(over);
  // Cross-contour arcs (Loomis; Hampton): a ring on a sleeve that goes into depth shows as an arc bowed toward the near end; its depth is
  // the foreshortening (projected length against the true length at that depth).
  const ring = (m: HU, toFar: HU, r: number, fr: number): HU[] => {
    const b = r * Math.sqrt(Math.max(0, 1 - Math.min(1, fr) ** 2)), qx = -toFar[1], qy = toFar[0];
    return Array.from({length: 9}, (_, i): HU => {
      const th = (i / 8) * Math.PI;
      return [m[0] + qx * r * Math.cos(th) - toFar[0] * b * Math.sin(th), m[1] + qy * r * Math.cos(th) - toFar[1] * b * Math.sin(th)];
    });
  };
  const frF = Math.hypot(w2[0] - e2[0], w2[1] - e2[1]) / (0.88 * sFE);
  const frU = Math.hypot(e2[0] - s2[0], e2[1] - s2[1]) / (0.9 * sSE);
  const dU = unitHU([e2[0] - s2[0], e2[1] - s2[1]]);
  const at = (p0: HU, p1: HU, t: number): HU => [p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t];
  return [
    mitten(c, q.W, q.F, q.N, skin),
    tub(over, [e2, midFE, wc], [0.19 * sE, 0.18 * sFE, 0.17 * sW], 0.13 * sFE, {up: true, cloth: true}),
    strokes([ring(wc, dW, 0.165 * sW, frF), ring(at(e2, wc, 0.5), dW, 0.175 * sFE, frF)], fold, 0.9),
    tub(over, [s2, midSE, e2], [0.215 * sS, 0.205 * sSE, 0.195 * sE], 0.13 * sSE, {up: true, cloth: true}),
    strokes([ring(at(s2, e2, 0.7), dU, 0.2 * sSE, frU)], fold, 0.9),
  ];
};

/** The back bust with his right arm replaced by the projected arm, drawn before the torso. His left arm hangs (off frame left). */
const figure = (c: Cam, q: Pose): Fig => {
  const hang = {kind: 'hang' as const, hand: 'mitten' as const, across: 0.7};
  const fig = bustFig(YOU, {view: 'back', legs: false, arms: {L: hang, R: hang}});
  const parts = fig.parts.slice();
  // standing(): armBack = [L sleeve, L cuff, R sleeve, R cuff] first; hands [L, R] last (one hull each with `across`).
  const rSleeve = parts[2];
  if (!rSleeve.tube || rSleeve.tube.c[0][0] <= 0) throw new Error('SPK-ZCP-07: unexpected bust part order');
  parts.splice(2, 2);
  parts.pop();
  const costume = {over: '#2f5a5c'};
  return {...fig, parts: [...armParts(c, q, costume.over, YOU.head.skin), ...parts]};
};

// ---------------------------------------------------------------- the fridge (3D, projected)

const ZF = 1.35, ZB = 3.2;
const FX0 = -0.2, FX1 = 1.9, IX0 = -0.05, IX1 = 1.75, IY0 = 3.0, IY1 = 6.25;
const SHELVES = [4.1, 5.15];
const quad = (c: Cam, pts: V3[]): Pt[] => pts.map((p) => P3(c, p));

/** A box in 3D (min corner, size): only the faces that face the camera, each a flat tone (top lit by the spill, front cel, side deeper). */
const box3 = (f: Flat, c: Cam, o: V3, sz: V3, col: string, ink = 1.2) => {
  const [x0, y0, z0] = o, x1 = x0 + sz[0], y1 = y0 + sz[1], z1 = z0 + sz[2];
  const camP: V3 = [c.ax, c.ay, -c.D];
  const faces: {pts: V3[]; n: V3; col: string}[] = [
    {pts: [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], n: [0, 0, -1], col: cel(col)},
    {pts: [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], n: [0, 1, 0], col},
    {pts: [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], n: [0, -1, 0], col: cel(col, 1.6)},
    {pts: [[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1]], n: [-1, 0, 0], col: cel(col, 1.3)},
    {pts: [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], n: [1, 0, 0], col: cel(col, 1.3)},
  ];
  for (const fc of faces) {
    const ctr = mul(fc.pts.reduce((a, b) => add(a, b), [0, 0, 0] as V3), 0.25);
    if (dot(fc.n, sub(camP, ctr)) <= 0) continue;
    const q = quad(c, fc.pts);
    f.fill(fc.col, q);
    if (ink > 0) f.line(q, ink);
  }
};

const doorAngle = (pf: number) => (Math.PI * 95) / 180 * (mj(seg(pf, 0, 6)) - mj(seg(pf, 32, 41)));

const fridge = (f: Flat, c: Cam, pf: number, box: V3) => {
  // Kitchen wall.
  f.fill(dim('#d9ccb0', 1.0), [[-100, -100], [1200, -100], [1200, 2100], [-100, 2100]]);
  // Front panel and the lower door seam.
  f.fill('#e6e3da', quad(c, [[FX0, 0, ZF], [FX1, 0, ZF], [FX1, 6.45, ZF], [FX0, 6.45, ZF]]));
  f.line(quad(c, [[FX0, 0, ZF], [FX1, 0, ZF], [FX1, 6.45, ZF], [FX0, 6.45, ZF]]), 1.0);
  f.line(quad(c, [[FX0, 2.9, ZF], [FX1, 2.9, ZF]]), 1.0, undefined, false);
  // Interior (no lamp): back wall, side walls, ceiling, floor, then the glass shelves (front edge lit by the spill).
  f.fill('#2a313a', quad(c, [[IX0, IY0, ZB], [IX1, IY0, ZB], [IX1, IY1, ZB], [IX0, IY1, ZB]]));
  f.fill('#343d48', quad(c, [[IX0, IY0, ZF], [IX0, IY1, ZF], [IX0, IY1, ZB], [IX0, IY0, ZB]]));
  f.fill('#252b33', quad(c, [[IX1, IY0, ZF], [IX1, IY1, ZF], [IX1, IY1, ZB], [IX1, IY0, ZB]]));
  f.fill('#20262d', quad(c, [[IX0, IY1, ZF], [IX1, IY1, ZF], [IX1, IY1, ZB], [IX0, IY1, ZB]]));
  f.fill('#3c4754', quad(c, [[IX0, IY0, ZF], [IX1, IY0, ZF], [IX1, IY0, ZB], [IX0, IY0, ZB]]));
  for (const y of SHELVES) {
    f.fill('#46515e', quad(c, [[IX0, y, ZF + 0.05], [IX1, y, ZF + 0.05], [IX1, y, ZB], [IX0, y, ZB]]));
    f.line(quad(c, [[IX0, y, ZF + 0.05], [IX1, y, ZF + 0.05]]), 1.6, '#7d8896', false);
  }
  // Food on the shelves (ready-to-eat only): yogurt cups, a cheese block, a fruit box; tops lit by the daylight spill.
  box3(f, c, [1.0, 5.15, 2.3], [0.3, 0.32, 0.3], '#c9d3dc', 0.8);
  box3(f, c, [1.35, 5.15, 2.1], [0.28, 0.3, 0.28], '#b9c6cf', 0.8);
  box3(f, c, [0.0, 4.1, 2.55], [0.45, 0.22, 0.4], '#d6c27a', 0.8);
  box3(f, c, [0.05, 3.0, 2.2], [0.7, 0.4, 0.6], '#8fa07a', 0.8);
  box3(f, c, [1.0, 3.0, 2.0], [0.6, 0.35, 0.5], '#c9d3dc', 0.8);
  leftovers(f, c, box);
  // The upper door, hinged on the right, swung toward the camera; its inner face with two door bins.
  const th = doorAngle(pf), W = FX1 - FX0;
  const fx = FX1 - W * Math.cos(th), fz = ZF - W * Math.sin(th);
  const door = quad(c, [[FX1, 2.95, ZF], [fx, 2.95, fz], [fx, 6.45, fz], [FX1, 6.45, ZF]]);
  f.fill(th > 0.05 ? '#eeebe2' : '#e6e3da', door);
  f.line(door, 1.0);
  if (th > 0.05) {
    for (const y of [3.6, 4.7]) f.line(quad(c, [[FX1, y, ZF], [fx, y, fz]]), 1.0, cel('#eeebe2', 1.5), false);
  } else {
    f.fill('#6b7079', quad(c, [[fx + 0.04, 4.3, fz - 0.02], [fx + 0.1, 4.3, fz - 0.02], [fx + 0.1, 5.3, fz - 0.02], [fx + 0.04, 5.3, fz - 0.02]]));
  }
};

/** The leftovers box with the yogurt cup on top. */
const leftovers = (f: Flat, c: Cam, b: V3) => {
  box3(f, c, [b[0] - BOX_W / 2, b[1], b[2] - BOX_D / 2], [BOX_W, BOX_H, BOX_D], '#d8c39a', 1.4);
  box3(f, c, [b[0] - 0.2, b[1] + BOX_H, b[2] - 0.12], [0.24, 0.28, 0.24], '#f4f1ea', 1.0);
};

export const paintSpk07 = (v: Variant) => (ctx: PaintContext, pf: number) => {
  const c = CAM[v];
  const q = reach(v, pf);
  const f = flatKit(ctx, 38000);
  fridge(f, c, pf, q.box);
  drawFig(ctx, 38400, figure(c, q), REF, {light: keyTravel(1, [-0.9, 0.3]), tex: TEX_B});
};

/** Measures for the notes: the projected elbow and wrist (plate px) and the shoulder-to-grip distance against the arm length. */
export const spk07Measure = (v: Variant, pf: number) => {
  const c = CAM[v], q = reach(v, pf);
  const E = ik3(q.S, q.W, 0.9, 0.88, q.pole);
  return {elbow: P3(c, E), wrist: P3(c, q.W), reach: len(sub(q.W, q.S)), elbow3: E, sW: scaleAt(c, q.W[2])};
};
