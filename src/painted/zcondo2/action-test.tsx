import {useCallback} from 'react';
import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {washAt} from '../kit/draw';
import {makePainter, mixColor, type Painter, type Pt} from '../kit/painter';
import {Grain} from '../kit/screen';
import {HEAD} from './freeze';
import {clipConvex, inkWash, inkWashSoft, iris, lidShut, LK_B_PAL, mapped, PAPER, part, type Medium, type Palette} from './anim-test';

// Spike SPK-ZC2-02: full-body ACTION test of the LK-S look (ink and wash, soft brown line, key from screen-left).
// One small 3D skeleton (pelvis, spine, head, two legs hip-knee-ankle, two arms shoulder-elbow-wrist, mitten hands, slipper feet)
// is posed per frame by a pure function of the frame; joints are projected with a pinhole camera and every limb is drawn as a
// SHAPED 2D form (width profile with calf, knee, forearm, elbow; loose trousers, sleeve, slipper) so the look stays LK-S while the
// body is a real articulated figure. The head is the SAME head drawing as freeze.ts HEAD (3/4 right), scaled and rolled.
// Not wired into the timeline or the registry; entry action-index.ts, render with scripts/zombie-condo2/render-action.mjs.

// ------------------------------------------------------------------ small 3D maths (x right, y up, z toward the viewer)
type V3 = [number, number, number];
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const vlen = (a: V3) => Math.hypot(a[0], a[1], a[2]);
const unit = (a: V3): V3 => { const l = vlen(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const lin3 = (a: V3, b: V3, u: number): V3 => add(a, mul(sub(b, a), u));
const UP: V3 = [0, 1, 0];
/** Forward and right (= forward x up) for a heading h about the vertical (h = 0 is +x, positive turns toward the viewer). */
const Fh = (h: number): V3 => [Math.cos(h), 0, Math.sin(h)];
const Rh = (h: number): V3 => [-Math.sin(h), 0, Math.cos(h)];
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const sm = (u: number) => { const x = clamp(u, 0, 1); return x * x * (3 - 2 * x); };
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
/** Piecewise smooth keyframes [t, value]. */
const kf = (t: number, keys: [number, number][]) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], sm((t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0])));
  return keys[keys.length - 1][1];
};
const twoBone = (R: V3, T: V3, l1: number, l2: number, pole: V3): {mid: V3; end: V3} => {
  const v = sub(T, R), d0 = vlen(v) || 1e-6, u = mul(v, 1 / d0);
  const d = clamp(d0, Math.abs(l1 - l2) + 1e-3, l1 + l2 - 1e-3);
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const pu = unit(sub(pole, mul(u, dot(pole, u))));
  return {mid: add(add(R, mul(u, a)), mul(pu, h)), end: add(R, mul(u, d))};
};

type Cam = {D: number; f: number; cx: number; cy: number; camH: number; yaw: number};
const mkCam = (D: number, ppm: number, cx: number, cy: number, camH: number, yaw = 0): Cam => ({D, f: D * ppm, cx, cy, camH, yaw});
const project = (c: Cam, p: V3) => {
  const xc = p[0] * Math.cos(c.yaw) + p[2] * Math.sin(c.yaw), zc = -p[0] * Math.sin(c.yaw) + p[2] * Math.cos(c.yaw);
  const d = c.D - zc, s = c.f / d;
  return {x: c.cx + s * xc, y: c.cy - s * (p[1] - c.camH), s, d};
};

// ------------------------------------------------------------------ pose and skeleton
type Leg = {ankle: V3; pitch: number; flop: number};
type Arm = {wrist?: V3; pole?: V3; swing?: number; flex?: number; curl: number; dir?: V3};
export type Pose = {
  P: V3; h: number; pyaw: number; cyaw: number; roll: number; lum: number; chest: number; side: number;
  headPitch: number; headRoll: number; gaze: [number, number]; brow: number; legs: [Leg, Leg]; arms: [Arm, Arm];
};
const LEN = {thigh: 0.43, shin: 0.43, upper: 0.30, fore: 0.27};
const solve = (q: Pose) => {
  const F = Fh(q.h), Rt = Rh(q.h), Rp = Rh(q.h + q.pyaw), Rc = Rh(q.h + q.cyaw);
  const hipV = add(mul(Rp, 0.09 * Math.cos(q.roll)), mul(UP, 0.09 * Math.sin(q.roll)));
  const hips: [V3, V3] = [add(q.P, hipV), sub(q.P, hipV)];
  const a1 = q.lum, a2 = q.lum + q.chest, a3 = a2 + q.headPitch;
  const d1 = unit(add(add(mul(UP, Math.cos(a1)), mul(F, Math.sin(a1))), mul(Rt, Math.sin(q.side * 0.5))));
  const d2 = unit(add(add(mul(UP, Math.cos(a2)), mul(F, Math.sin(a2))), mul(Rt, Math.sin(q.side))));
  const d3 = unit(add(mul(UP, Math.cos(a3)), mul(F, Math.sin(a3))));
  const S1 = add(q.P, mul(d1, 0.27)), S2 = add(S1, mul(d2, 0.25)), N = add(S2, mul(d2, 0.05));
  const sh: [V3, V3] = [add(add(S2, mul(Rc, 0.18)), mul(d2, -0.025)), add(sub(S2, mul(Rc, 0.18)), mul(d2, -0.025))];
  const knees: V3[] = [], ankles: V3[] = [];
  q.legs.forEach((lg, i) => {
    const r = twoBone(hips[i], lg.ankle, LEN.thigh, LEN.shin, unit(add(F, mul(Rt, i === 0 ? 0.14 : -0.14))));
    knees.push(r.mid); ankles.push(r.end);
  });
  const elbows: V3[] = [], wrists: V3[] = [];
  q.arms.forEach((a, i) => {
    const s = i === 0 ? 1 : -1;
    if (a.wrist) {
      const r = twoBone(sh[i], a.wrist, LEN.upper, LEN.fore, a.pole ?? unit(add(mul(UP, -1), mul(Rc, s * 0.5))));
      elbows.push(r.mid); wrists.push(r.end);
    } else {
      const th = a.swing ?? 0, ep = a.flex ?? 0;
      const u1 = unit(add(add(mul(UP, -Math.cos(th)), mul(F, Math.sin(th))), mul(Rc, s * 0.07)));
      const u2 = unit(add(add(mul(UP, -Math.cos(th + ep)), mul(F, Math.sin(th + ep))), mul(Rc, s * 0.04)));
      const e = add(sh[i], mul(u1, LEN.upper));
      elbows.push(e); wrists.push(add(e, mul(u2, LEN.fore)));
    }
  });
  return {F, Rt, Rc, d1, d2, d3, S1, S2, N, hips, sh, knees, ankles, elbows, wrists, P: q.P};
};
type Rig = ReturnType<typeof solve>;

// ------------------------------------------------------------------ shaped limb outlines
type Key = [number, number, number?];
const hullOf = (pts: Pt[]): Pt[] => {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], up: Pt[] = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of [...p].reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};
/**
 * One closed outline around a centreline through `ctrl` (screen px). Interior controls are rounded (radius `round` px),
 * widths come from `keys` ([segment units, half-width, half-depth]); with `ell` the half-width is the silhouette of an
 * ellipse section (a along axis r2, b along f2, both px per metre), so a torso or hand narrows when turned edge-on.
 * The inner side of a bend is clamped to the local radius of curvature, so a bend never self-intersects.
 */
const chain = (ctrl: Pt[], keys: Key[], o: {round?: number; ell?: [Pt, Pt]; capA?: boolean; capB?: boolean} = {}): Pt[] => {
  const n = ctrl.length;
  const pts: Pt[] = [];
  const jIdx: number[] = [];
  const push = (q: Pt) => {
    const l = pts[pts.length - 1];
    if (l) {
      const d = Math.hypot(q[0] - l[0], q[1] - l[1]), k = Math.floor(d / 14);
      for (let i = 1; i <= k; i++) pts.push([l[0] + ((q[0] - l[0]) * i) / (k + 1), l[1] + ((q[1] - l[1]) * i) / (k + 1)]);
    }
    pts.push(q);
  };
  push(ctrl[0]); jIdx.push(0);
  for (let i = 1; i < n - 1; i++) {
    const J = ctrl[i], pa = ctrl[i - 1], pb = ctrl[i + 1];
    const li = Math.hypot(J[0] - pa[0], J[1] - pa[1]) || 1e-6, lo = Math.hypot(pb[0] - J[0], pb[1] - J[1]) || 1e-6;
    const c = Math.min(0.45 * Math.min(li, lo), o.round ?? 0);
    const A: Pt = [J[0] - ((J[0] - pa[0]) / li) * c, J[1] - ((J[1] - pa[1]) / li) * c];
    const B: Pt = [J[0] + ((pb[0] - J[0]) / lo) * c, J[1] + ((pb[1] - J[1]) / lo) * c];
    if (c < 1) { push(J); jIdx.push(pts.length - 1); continue; }
    push(A);
    for (let k = 1; k < 6; k++) {
      const u = k / 6;
      pts.push([(1 - u) * (1 - u) * A[0] + 2 * u * (1 - u) * J[0] + u * u * B[0], (1 - u) * (1 - u) * A[1] + 2 * u * (1 - u) * J[1] + u * u * B[1]]);
      if (k === 3) jIdx.push(pts.length - 1);
    }
    push(B);
  }
  push(ctrl[n - 1]); jIdx.push(pts.length - 1);
  const cum = [0];
  for (let k = 1; k < pts.length; k++) cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
  const jArc = jIdx.map((i) => cum[i]);
  const arcOf = (at: number) => { const i = clamp(Math.floor(at), 0, n - 2); return lerp(jArc[i], jArc[i + 1], at - i); };
  const ks = keys.map((k) => ({s: arcOf(k[0]), a: k[1], b: k[2] ?? k[1]})).sort((x, y) => x.s - y.s);
  const widthAt = (s: number) => {
    if (s <= ks[0].s) return {a: ks[0].a, b: ks[0].b};
    for (let i = 1; i < ks.length; i++) if (s <= ks[i].s) {
      const u = sm((s - ks[i - 1].s) / (ks[i].s - ks[i - 1].s || 1));
      return {a: lerp(ks[i - 1].a, ks[i].a, u), b: lerp(ks[i - 1].b, ks[i].b, u)};
    }
    return {a: ks[ks.length - 1].a, b: ks[ks.length - 1].b};
  };
  const m = pts.length;
  const tan: Pt[] = pts.map((_, k) => {
    const a = pts[Math.max(0, k - 1)], b = pts[Math.min(m - 1, k + 1)];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    return l < 1e-6 ? [0, -1] : [(b[0] - a[0]) / l, (b[1] - a[1]) / l];
  });
  const left: Pt[] = [], right: Pt[] = [];
  const hw: number[] = [];
  for (let k = 0; k < m; k++) {
    const t = tan[k], nn: Pt = [-t[1], t[0]], w = widthAt(cum[k]);
    let h = w.a;
    if (o.ell) h = Math.hypot(w.a * (nn[0] * o.ell[0][0] + nn[1] * o.ell[0][1]), w.b * (nn[0] * o.ell[1][0] + nn[1] * o.ell[1][1]));
    h = Math.max(h, 1.2);
    const k0 = Math.max(0, k - 1), k1 = Math.min(m - 1, k + 1);
    let dth = Math.atan2(tan[k1][1], tan[k1][0]) - Math.atan2(tan[k0][1], tan[k0][0]);
    if (dth > Math.PI) dth -= 2 * Math.PI;
    if (dth < -Math.PI) dth += 2 * Math.PI;
    const kap = dth / (cum[k1] - cum[k0] || 1);
    const hl = kap > 1e-5 ? Math.min(h, 0.85 / kap) : h, hr = kap < -1e-5 ? Math.min(h, 0.85 / -kap) : h;
    left.push([pts[k][0] + nn[0] * hl, pts[k][1] + nn[1] * hl]);
    right.push([pts[k][0] - nn[0] * hr, pts[k][1] - nn[1] * hr]);
    hw.push(h);
  }
  const out: Pt[] = [...left];
  if (o.capB !== false) {
    const c = pts[m - 1], t = tan[m - 1], nn: Pt = [-t[1], t[0]], h = hw[m - 1];
    for (let i = 1; i < 6; i++) { const a = (Math.PI * i) / 6; out.push([c[0] + nn[0] * h * Math.cos(a) + t[0] * h * Math.sin(a), c[1] + nn[1] * h * Math.cos(a) + t[1] * h * Math.sin(a)]); }
  }
  for (let k = m - 1; k >= 0; k--) out.push(right[k]);
  if (o.capA !== false) {
    const c = pts[0], t = tan[0], nn: Pt = [-t[1], t[0]], h = hw[0];
    for (let i = 1; i < 6; i++) { const a = (Math.PI * i) / 6; out.push([c[0] - nn[0] * h * Math.cos(a) - t[0] * h * Math.sin(a), c[1] - nn[1] * h * Math.cos(a) - t[1] * h * Math.sin(a)]); }
  }
  return out;
};

// ------------------------------------------------------------------ the figure
type Env = {p: Painter; M: Medium; S: Medium; C: Palette; cam: Cam};
type Draw = {d: number; run: () => void};
const FEET = {
  skin: [[-0.055, -0.07, -0.005, 0.03], [0, -0.07, 0.012, 0.033], [0.07, -0.07, -0.035, 0.043], [0.12, -0.07, -0.048, 0.048], [0.17, -0.07, -0.052, 0.04], [0.2, -0.07, -0.056, 0.025]],
  sole: [[-0.07, 0.036], [0, 0.04], [0.08, 0.05], [0.14, 0.052], [0.2, 0.04], [0.225, 0.028]],
};
const ringAt = (cen: V3, right: V3, up: V3, hw: number, ht: number, n = 8): V3[] =>
  Array.from({length: n}, (_, k) => { const a = (2 * Math.PI * k) / n; return add(cen, add(mul(right, hw * Math.cos(a)), mul(up, ht * Math.sin(a)))); });

/** Draw the whole body for one pose. Returns the draw list (back to front) so a scene can slot items between the parts. */
const bodyDraws = (E: Env, q: Pose, rig: Rig, items: {far?: () => void; near?: () => void}): void => {
  const {p, M, S, C, cam} = E;
  const pr = (v: V3) => project(cam, v), P2 = (v: V3): Pt => { const r = project(cam, v); return [r.x, r.y]; };
  const skinLine = mixColor(C.skin, C.ink, 0.72), pantsLine = mixColor(C.pants, C.ink, 0.75), shirtLine = mixColor(C.shirt, C.ink, 0.7);
  const seeded = (base: number, color: string, pts: Pt[], o = {}) => part(M, base, color, pts, C, o);
  const draws: Draw[] = [];

  // ---- floor contact shadows (the floor's, painted in the set medium)
  const shadowSeed = 150;
  const groundEll = (cx: number, cz: number, rx: number, rz: number, ang: number): Pt[] =>
    Array.from({length: 14}, (_, k) => {
      const a = (2 * Math.PI * k) / 14, x = rx * Math.cos(a), z = rz * Math.sin(a);
      return P2([cx + x * Math.cos(ang) - z * Math.sin(ang), 0, cz + x * Math.sin(ang) + z * Math.cos(ang)]);
    });
  const bodyShadow = groundEll(q.P[0] + 0.1, q.P[2], 0.3, 0.16, q.h).map(([x, y]): Pt => [x + 30, y + 4]);
  washAt(p, shadowSeed, mixColor(C.floor, C.ink, 0.3), 90, bodyShadow, 0.05, 0.2);
  [0, 1].forEach((i) => {
    const a = rig.ankles[i], lift = clamp((a[1] - 0.09) / 0.12, 0, 1);
    const ang = q.h;
    washAt(p, shadowSeed + 1 + i, mixColor(C.floor, C.ink, 0.62 - 0.35 * lift), 210 - 110 * lift, groundEll(a[0] + 0.05 * Math.cos(ang) + 0.07, a[2] + 0.05 * Math.sin(ang), 0.14, 0.055, ang).map(([x, y]): Pt => [x + 14, y + 3]), 0.05, 0.2);
  });

  // ---- legs
  [0, 1].forEach((i) => {
    const s = i === 0 ? 1 : -1, lg = q.legs[i];
    const hip = rig.hips[i], knee = rig.knees[i], ank = rig.ankles[i];
    const hemPt = lin3(knee, ank, 0.86);
    const sc = pr(knee).s;
    const hf = q.h + 0.1 * s; // toes out a little
    const Ffl = Fh(hf), Rf = Rh(hf);
    const Ff = unit(add(mul(Ffl, Math.cos(lg.pitch)), mul(UP, Math.sin(lg.pitch)))), Uf = unit(sub(mul(UP, Math.cos(lg.pitch)), mul(Ffl, Math.sin(lg.pitch))));
    const loc = (f: number, u: number, lat = 0): V3 => add(add(add(ank, mul(Ff, f)), mul(Uf, u)), mul(Rf, lat));
    draws.push({d: pr(knee).d + (i === 0 ? 0 : 0), run: () => {
      const base = 3100 + i * 100;
      // slipper sole (flops: pivots about the ball, heel hangs)
      const flop = lg.flop;
      const solePts: Pt[] = [];
      FEET.sole.forEach(([f, hw]) => {
        const ring: V3[] = Array.from({length: 8}, (_, k) => {
          const a = (2 * Math.PI * k) / 8, lat = hw * Math.cos(a), u = -0.081 + 0.011 * Math.sin(a);
          const rf = f - 0.12, ru = u + 0.092;
          const f2 = rf * Math.cos(flop) - ru * Math.sin(flop) + 0.12, u2 = rf * Math.sin(flop) + ru * Math.cos(flop) - 0.092;
          return loc(f2, u2, lat);
        });
        ring.forEach((r) => solePts.push(P2(r)));
      });
      seeded(base, C.slipper, hullOf(solePts), {from: 0.5, line: 1.0});
      // ankle skin between hem and foot
      const skinCols = mixColor(C.skin, C.skinShade, 0.25);
      seeded(base + 10, skinCols, chain([P2(hemPt), P2(ank)], [[0, 0.036 * sc], [1, 0.034 * sc]], {capB: true}), {from: 0.6, line: 0.9});
      // foot skin
      const footPts: Pt[] = [];
      FEET.skin.forEach(([f, bot, top, hw]) => ringAt(loc(f, (bot + top) / 2), Rf, Uf, hw, (top - bot) / 2).forEach((r) => footPts.push(P2(r))));
      seeded(base + 20, C.skin, hullOf(footPts), {from: 0.62, line: 1.0});
      // toes: two short creases at the front of the foot
      [0.055, 0.0].forEach((lat, k) => M.line(base + 40 + k, [P2(loc(0.175, -0.05, lat)), P2(loc(0.205, -0.056, lat * 0.7))], {w: 0.8, color: skinLine}));
      // slide strap over the instep
      const strapA = ringAt(loc(0.075, -0.0), Rf, Uf, 0.05, 0.03, 8).filter((_, k) => k >= 0 && k <= 4).map(P2);
      const strapB = ringAt(loc(0.12, -0.012), Rf, Uf, 0.052, 0.034, 8).filter((_, k) => k >= 0 && k <= 4).map(P2);
      M.base(base + 50, mixColor(C.slipper, '#ffffff', 0.08), hullOf([...strapA, ...strapB]));
      M.line(base + 51, hullOf([...strapA, ...strapB]), {w: 0.9, closed: true, color: C.ink});
      // trousers: loose, hem a little wider, knee bump
      const keysP: Key[] = [[0, 0.098 * sc], [0.5, 0.095 * sc], [1, 0.078 * sc], [1.35, 0.071 * sc], [2, 0.069 * sc]];
      const pants = chain([P2(hip), P2(knee), P2(hemPt)], keysP, {round: 0.07 * sc, capA: true, capB: false});
      seeded(base + 60, C.pants, pants, {from: 0.6, line: 1.1});
      // creases: knee fold on the inner side of the bend, hem fold
      const kn = P2(knee), th = P2(lin3(hip, knee, 0.82)), sh = P2(lin3(knee, hemPt, 0.18));
      const bend = Math.abs((kn[0] - th[0]) * (sh[1] - kn[1]) - (kn[1] - th[1]) * (sh[0] - kn[0])) / (sc * sc);
      if (bend > 0.003) {
        const dirIn: Pt = [th[0] - sh[0] + (kn[0] - th[0]) * 0.0, th[1] - sh[1]];
        const len = Math.hypot(dirIn[0], dirIn[1]) || 1;
        const nrm: Pt = [-dirIn[1] / len, dirIn[0] / len];
        const sgn = ((kn[0] - th[0]) * (sh[1] - kn[1]) - (kn[1] - th[1]) * (sh[0] - kn[0])) > 0 ? 1 : -1;
        [0.0, 0.012].forEach((off, k) => M.line(base + 70 + k, [[kn[0] - nrm[0] * sgn * 0.02 * sc + 0.02 * sc * (k - 0.5), kn[1] - nrm[1] * sgn * 0.02 * sc + 0.02 * sc * off * 20], [kn[0] + dirIn[0] / len * 0.05 * sc * (k ? 0.6 : 1), kn[1] + dirIn[1] / len * 0.05 * sc * (k ? 0.6 : 1)]], {w: 0.8, color: pantsLine}));
      }
      const h0 = P2(lin3(knee, hemPt, 0.88)), h1 = P2(lin3(knee, hemPt, 0.96));
      M.line(base + 75, [h0, [h0[0] + (h1[0] - h0[0]) * 0.6 + 4, h0[1] + (h1[1] - h0[1]) * 0.6]], {w: 0.7, color: pantsLine});
    }});
  });
  draws.sort((a, b) => b.d - a.d);
  draws.forEach((d) => d.run());

  // ---- pelvis block (trousers seat) under the shirt hem
  {
    const sc = pr(rig.P).s;
    const ctr: Pt[] = [P2(add(rig.P, mul(rig.d1, 0.03))), P2(sub(rig.P, mul(UP, 0.11)))];
    const r2 = [P2(add(rig.P, rig.Rc))[0] - P2(rig.P)[0], P2(add(rig.P, rig.Rc))[1] - P2(rig.P)[1]] as Pt;
    const f2 = [P2(add(rig.P, rig.F))[0] - P2(rig.P)[0], P2(add(rig.P, rig.F))[1] - P2(rig.P)[1]] as Pt;
    seeded(3500, mixColor(C.pants, C.ink, 0.1), chain(ctr, [[0, 0.15, 0.1], [1, 0.14, 0.095]], {ell: [r2, f2]}), {from: 0.6, line: 1.0});
    void sc;
  }

  // ---- arms (skin arm + mitten hand + sleeve), torso, head
  const armDraw = (i: number) => () => {
    const s = i === 0 ? 1 : -1, base = 3300 + i * 100;
    const sh = rig.sh[i], el = rig.elbows[i], wr = rig.wrists[i], a = q.arms[i];
    const sc = pr(el).s;
    const dir = a.dir ?? unit(sub(wr, el));
    const t0 = unit(sub(rig.F, mul(dir, dot(rig.F, dir))));
    const nIn0 = mul(rig.Rc, -s);
    const nrm = unit(sub(sub(nIn0, mul(dir, dot(nIn0, dir))), mul(t0, dot(nIn0, t0))));
    const fc = 0.25 + 0.75 * a.curl;
    const K = add(wr, mul(dir, 0.08));
    const dir1 = add(mul(dir, Math.cos(0.9 * fc)), mul(nrm, Math.sin(0.9 * fc)));
    const Mj = add(K, mul(dir1, 0.045));
    const dir2 = add(mul(dir, Math.cos(1.9 * fc)), mul(nrm, Math.sin(1.9 * fc)));
    const Tj = add(Mj, mul(dir2, 0.04));
    const hs = pr(wr).s;
    const hc = P2(K);
    const r2: Pt = [P2(add(K, t0))[0] - hc[0], P2(add(K, t0))[1] - hc[1]], f2: Pt = [P2(add(K, nrm))[0] - hc[0], P2(add(K, nrm))[1] - hc[1]];
    // skin arm
    const keysA: Key[] = [[0, 0.046 * sc], [1, 0.039 * sc], [1.3, 0.041 * sc], [2, 0.028 * sc]];
    seeded(base, C.skin, chain([P2(sh), P2(el), P2(wr)], keysA, {round: 0.05 * sc}), {from: 0.64, line: 1.0});
    // thumb and hand
    const B0 = add(add(wr, mul(dir, 0.03)), mul(t0, 0.02));
    const B1 = add(B0, mul(add(add(mul(t0, 0.8), mul(dir, 0.4)), mul(nrm, 0.2 * fc)), 0.042));
    const B2 = add(B1, mul(add(add(mul(dir, 0.8), mul(t0, 0.2)), mul(nrm, 0.6 * fc)), 0.04));
    const thumbOver = pr(B1).d <= pr(K).d;
    const drawThumb = () => seeded(base + 10, C.skin, chain([P2(B0), P2(B1), P2(B2)], [[0, 0.02 * hs], [1, 0.019 * hs], [2, 0.015 * hs]], {round: 0.01 * hs}), {from: 0.64, line: 0.9});
    if (!thumbOver) drawThumb();
    const handPts = chain([P2(wr), P2(K), P2(Mj), P2(Tj)], [[0, 0.03, 0.019], [1, 0.038, 0.021], [2, 0.035, 0.019], [3, 0.025, 0.015]], {round: 0.02 * hs, ell: [[r2[0] * 1, r2[1] * 1], [f2[0], f2[1]]]});
    seeded(base + 20, C.skin, handPts, {from: 0.64, line: 1.0});
    // finger separation: one crease from the knuckle line to the tip, and the knuckle bump
    M.line(base + 30, [P2(lin3(K, add(K, mul(t0, 0.02)), 1)), P2(lin3(Mj, Tj, 0.3))], {w: 0.6, color: skinLine});
    if (thumbOver) drawThumb();
    // sleeve over the shoulder and half of the upper arm
    const slEnd = lin3(sh, el, 0.56);
    const keysS: Key[] = [[0, 0.07 * sc], [1, 0.064 * sc]];
    seeded(base + 40, C.shirt, chain([P2(lin3(sh, el, -0.1)), P2(slEnd)], keysS, {capB: false}), {from: 0.6, line: 1.0});
  };
  const shDepth = [pr(rig.sh[0]).d, pr(rig.sh[1]).d], torsoD = pr(rig.S2).d;
  [0, 1].filter((i) => shDepth[i] >= torsoD).forEach((i) => armDraw(i)());
  items.far?.();

  // torso (shirt)
  {
    const hemPt = sub(rig.P, mul(unit(add(mul(rig.d1, 0.4), mul(UP, 0.6))), 0.19));
    const topT = add(rig.S2, mul(rig.d2, 0.05));
    const c0 = P2(rig.S1);
    const ctr = [P2(hemPt), c0, P2(rig.S2), P2(topT)];
    const r2: Pt = [P2(add(rig.S1, rig.Rc))[0] - c0[0], P2(add(rig.S1, rig.Rc))[1] - c0[1]], f2: Pt = [P2(add(rig.S1, rig.F))[0] - c0[0], P2(add(rig.S1, rig.F))[1] - c0[1]];
    const keys: Key[] = [[0, 0.178, 0.126], [1, 0.16, 0.114], [1.55, 0.178, 0.115], [2, 0.195, 0.108], [2.4, 0.15, 0.09], [2.75, 0.1, 0.08], [3, 0.08, 0.075]];
    seeded(3550, C.shirt, chain(ctr, keys, {round: 90, ell: [r2, f2], capA: false}), {from: 0.62, line: 1.1});
    // folds that the bend makes at the waist and the hem
    const bend = Math.abs(q.lum + q.chest);
    if (bend > 0.35) {
      [0.0, 0.14].forEach((off, k) => {
        const a = P2(lin3(hemPt, rig.S1, 0.55 + off)), b = P2(lin3(hemPt, rig.S1, 0.75 + off));
        const sx = pr(rig.S1).s * 0.11;
        M.line(3560 + k, [[a[0] - sx, a[1]], [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 3], [b[0] + sx * 0.4, b[1]]], {w: 0.8, color: shirtLine});
      });
    }
  }
  drawHead(E, q, rig);
  items.near?.();
  [0, 1].filter((i) => shDepth[i] < torsoD).forEach((i) => armDraw(i)());
};

// ------------------------------------------------------------------ the head (the same drawing as freeze.ts, placed on the neck)
const drawHead = (E: Env, q: Pose, rig: Rig) => {
  const {M: M0, C, cam} = E;
  const pr = (v: V3) => project(cam, v);
  const a = pr(add(rig.S2, mul(rig.d2, 0.045))), top = pr(add(rig.S2, mul(rig.d3, 0.2)));
  const roll = Math.atan2(top.x - a.x, -(top.y - a.y)) + q.headRoll + 0.03;
  const s = (0.225 * a.s) / 396;
  const co = Math.cos(roll), si = Math.sin(roll);
  const f = ([x, y]: Pt): Pt => { const dx = x - 525, dy = y - 930; return [a.x + s * (dx * co - dy * si), a.y + s * (dx * si + dy * co)]; };
  const M = mapped(M0, f);
  const skinLine = mixColor(C.skin, C.ink, 0.72);
  const [gx, gy] = q.gaze;
  M.base(205, mixColor(C.shirt, C.ink, 0.15), HEAD.collar);
  M.base(206, C.skin, HEAD.neck);
  M.shade(207, C.skinShade, HEAD.neckShade);
  M.line(208, HEAD.neck, {w: 0.9, closed: false, color: skinLine});
  M.base(220, C.skin, HEAD.head);
  M.shade(222, C.skinShade, HEAD.faceShade);
  M.shade(223, mixColor(C.skin, C.skinShade, 0.6), HEAD.socketL);
  M.shade(224, mixColor(C.skin, C.skinShade, 0.75), HEAD.socketR);
  M.shade(225, mixColor(C.skin, C.skinShade, 0.45), HEAD.noseSide);
  M.shade(226, mixColor(C.skin, C.skinShade, 0.8), HEAD.nostril);
  M.base(226, C.skin, HEAD.ear);
  M.shade(227, C.skinShade, [...HEAD.earInner, [390, 720]]);
  M.line(228, HEAD.ear, {w: 1.0, closed: true, color: skinLine});
  M.line(229, HEAD.earInner, {w: 0.8, color: skinLine});
  M.line(230, HEAD.head, {w: 1.2, closed: true, color: skinLine});
  M.base(231, C.hair, HEAD.hair);
  HEAD.strands.forEach((st, i) => M.line(233 + i, st, {w: 1.2, color: C.hair}));
  const FB = mapped(M, ([x, y]) => [x, y + q.brow]);
  FB.base(240, C.hair, HEAD.browL);
  FB.base(241, C.hair, HEAD.browR);
  M.base(245, C.eyeWhite, HEAD.eyeL);
  M.base(246, mixColor(C.eyeWhite, C.skinShade, 0.25), HEAD.eyeR);
  iris(M, 247, C, HEAD.eyeL, [HEAD.irisL[0] + gx, HEAD.irisL[1] + gy, HEAD.irisL[2]]);
  iris(M, 250, C, HEAD.eyeR, [HEAD.irisR[0] + gx, HEAD.irisR[1] + gy, HEAD.irisR[2]]);
  M.line(253, HEAD.lidL, {w: 1.9, color: C.ink});
  M.line(254, HEAD.lidR, {w: 1.9, color: C.ink});
  M.line(255, HEAD.lowerL, {w: 0.6, color: skinLine});
  M.line(256, HEAD.lowerR, {w: 0.6, color: skinLine});
  M.line(259, HEAD.noseLine, {w: 0.5, color: mixColor(C.skin, C.ink, 0.35)});
  M.line(260, HEAD.noseWing, {w: 0.9, color: skinLine});
  M.line(261, HEAD.jawLine, {w: 1.0, color: skinLine});
  void lidShut; void clipConvex;
};

// ------------------------------------------------------------------ props and room
/** A box from 3 axes (right-handed X, Y, Z) and half sizes: the faces turned to the camera, lit/shaded by the key. */
const cuboid = (E: Env, seed: number, cen: V3, ax: [V3, V3, V3], half: V3, color: string, seam = true) => {
  const {M, cam, C} = E;
  const v = (sx: number, sy: number, sz: number): V3 => add(add(add(cen, mul(ax[0], half[0] * sx)), mul(ax[1], half[1] * sy)), mul(ax[2], half[2] * sz));
  const P2 = (w: V3): Pt => { const r = project(cam, w); return [r.x, r.y]; };
  const faces: [number, number, number][][] = [
    [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]], [[1, -1, -1], [-1, -1, -1], [-1, 1, -1], [1, 1, -1]],
    [[1, -1, 1], [1, -1, -1], [1, 1, -1], [1, 1, 1]], [[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]],
    [[-1, 1, 1], [1, 1, 1], [1, 1, -1], [-1, 1, -1]],
  ];
  const normals: V3[] = [ax[2], mul(ax[2], -1), ax[0], mul(ax[0], -1), ax[1]];
  faces.forEach((fc, k) => {
    const poly = fc.map(([a, b, c]) => P2(v(a, b, c)));
    const area = poly.reduce((acc, q, i) => { const r = poly[(i + 1) % poly.length]; return acc + q[0] * r[1] - r[0] * q[1]; }, 0);
    if (area >= 0) return;
    const c0 = poly.reduce((a, q) => [a[0] + q[0] / 4, a[1] + q[1] / 4] as Pt, [0, 0] as Pt);
    const nw = normals[k], pn = P2(add(v(0, 0, 0), mul(add(nw, mul(nw, 0)), 0.2))), po = P2(v(0, 0, 0));
    const ns: Pt = [pn[0] - po[0], pn[1] - po[1]], nl = Math.hypot(ns[0], ns[1]) || 1;
    const lit = (-(ns[0] / nl) * 0.82 - (ns[1] / nl) * 0.38) * Math.min(1, nl / 25);
    const col = lit > 0.15 ? mixColor(color, '#ffffff', 0.2) : lit < -0.2 ? mixColor(color, C.ink, 0.12) : color;
    M.base(seed + k * 4, col, poly);
    if (lit < -0.2) M.shade(seed + k * 4 + 1, mixColor(color, C.ink, 0.4), poly);
    if (seam && k < 4) {
      const tops = fc.filter((f2) => f2[1] === 1);
      const pts = tops.map(([a, b, c]) => P2(lin3(v(a, -1, c), v(a, 1, c), 0.82)));
      if (pts.length === 2) M.line(seed + k * 4 + 2, pts, {w: 0.7, curve: 0, color: mixColor(color, C.ink, 0.6)});
    }
    M.line(seed + k * 4 + 3, poly, {w: 0.9, closed: true, curve: 0, color: mixColor(color, C.ink, 0.7)});
    void c0;
  });
};

const drawRoom = (E: Env, kind: 'back' | 'shelf', Xw = 0.8) => {
  const {S, C, cam} = E;
  const g = (x: number, y: number, z: number): Pt => { const r = project(cam, [x, y, z]); return [r.x, r.y]; };
  const Zb = -2.8;
  S.flat(10, C.wall, [g(-9, 0, Zb), g(9, 0, Zb), g(9, 5, Zb), g(-9, 5, Zb)]);
  S.flat(11, C.floor, [g(-9, 0, Zb), g(9, 0, Zb), g(9, 0, 3.4), g(-9, 0, 3.4)]);
  if (kind === 'shelf') {
    S.flat(12, mixColor(C.wall, C.ink, 0.07), [g(Xw, 0, Zb), g(Xw, 0, 3.4), g(Xw, 5, 3.4), g(Xw, 5, Zb)]);
    S.line(13, [g(Xw, 0, Zb), g(Xw, 0, 3.4)], {w: 0.7, curve: 0, color: C.grout});
  }
  for (let k = -9; k <= 9; k++) S.line(20 + k + 9, [g(k * 0.6, 0, Zb), g(k * 0.6, 0, 3.4)], {w: 0.55, curve: 0, color: C.grout});
  for (let k = 0; k <= 11; k++) S.line(50 + k, [g(-9, 0, Zb + k * 0.6), g(9, 0, Zb + k * 0.6)], {w: 0.55, curve: 0, color: C.grout});
  S.line(80, [g(-9, 0, Zb), g(9, 0, Zb)], {w: 0.9, curve: 0, color: mixColor(C.wall, C.ink, 0.5)});
};

// ------------------------------------------------------------------ gait
const IDLE_ARM = (curl = 0.3): Arm => ({swing: 0.04, flex: 0.12, curl});
const WALK = {T: 1.05};
/** Walk cycle pose at time t. Heading h, start x0/z0, speed v. Everything is a pure function of t. */
const walkPose = (t: number, c: {h: number; x0: number; z0: number; v: number; phi0: number}): Pose => {
  const {T} = WALK, L = c.v * T, A0 = 0.3 * L, AH = 0.09;
  const phi = (((t / T + c.phi0) % 1) + 1) % 1, F = Fh(c.h), Rt = Rh(c.h);
  const Pg: V3 = [c.x0 + F[0] * c.v * t, 0, c.z0 + F[2] * c.v * t];
  const w2 = 2 * Math.PI * phi;
  const P: V3 = add(add(Pg, mul(Rt, 0.028 * Math.sin(w2))), [0, 0.915 - 0.016 * Math.cos(2 * w2), 0]);
  const rot = (tau: number, f: number, u: number): Pt => [f * Math.cos(tau) - u * Math.sin(tau), f * Math.sin(tau) + u * Math.cos(tau)];
  const heelD = (tau: number): Pt => { const r = rot(tau, 0.05, 0.092); return [r[0] - 0.05, r[1] - 0.092]; };
  const ballD = (tau: number): Pt => { const r = rot(tau, -0.12, 0.092); return [r[0] + 0.12, r[1] - 0.092]; };
  const foot = (ps: number, side: number): Leg => {
    let x: number, y: number, tau: number, flop = 0;
    if (ps < 0.6) {
      const u = ps / 0.6;
      tau = u < 0.1 ? 0.32 * (1 - u / 0.1) ** 2 : u > 0.7 ? -0.85 * ((u - 0.7) / 0.3) ** 1.5 : 0;
      const d = tau > 0 ? heelD(tau) : tau < 0 ? ballD(tau) : ([0, 0] as Pt);
      x = A0 - L * ps + d[0]; y = AH + d[1];
    } else {
      const w = (ps - 0.6) / 0.4, x0 = -0.3 * L, x1 = 0.3 * L, m = -0.4 * L;
      const h00 = 2 * w ** 3 - 3 * w * w + 1, h10 = w ** 3 - 2 * w * w + w, h01 = -2 * w ** 3 + 3 * w * w, h11 = w ** 3 - w * w;
      const xf = h00 * x0 + h10 * m + h01 * x1 + h11 * m;
      tau = kf(w, [[0, -0.85], [0.35, -0.1], [0.75, 0.12], [1, 0.32]]);
      const sd = ballD(-0.85), ed = heelD(0.32), a = 1 - sm(w * 2.5), b = sm((w - 0.6) * 2.5);
      x = xf + sd[0] * a + ed[0] * b;
      y = AH + 0.075 * Math.sin(Math.PI * w) ** 1.2 + sd[1] * a + ed[1] * b;
      flop = 0.32 * Math.sin(Math.PI * clamp(w * 1.1, 0, 1));
    }
    return {ankle: add(add(Pg, mul(F, x)), add(mul(Rt, side * 0.088), [0, y, 0])), pitch: tau, flop};
  };
  const swR = -0.46 * Math.cos(w2);
  const armOf = (sw: number): Arm => ({swing: sw, flex: 0.22 + 0.4 * Math.max(0, sw / 0.46), curl: 0.3});
  return {
    P, h: c.h, pyaw: -0.1 * Math.cos(w2), cyaw: 0.14 * Math.cos(w2), roll: 0.035 * Math.sin(w2), lum: 0.06, chest: 0.03, side: -0.03 * Math.sin(w2),
    headPitch: -0.06 + 0.012 * Math.cos(2 * w2), headRoll: 0, gaze: [4, 8], brow: 12,
    legs: [foot(phi, 1), foot((phi + 0.5) % 1, -1)], arms: [armOf(swR), armOf(-swR)],
  };
};

// ------------------------------------------------------------------ clip scenes
type Scene = {cam: Cam; room: 'back' | 'shelf'; pose: Pose; draw?: (E: Env, rig: Rig) => {far?: () => void; near?: () => void}};
const base = (h: number, P: V3, gaze: [number, number] = [4, 8]): Pose => ({
  P, h, pyaw: 0, cyaw: 0, roll: 0, lum: 0.03, chest: 0.02, side: 0, headPitch: -0.04, headRoll: 0, gaze, brow: 12,
  legs: [{ankle: [0, 0.09, 0], pitch: 0, flop: 0}, {ankle: [0, 0.09, 0], pitch: 0, flop: 0}], arms: [IDLE_ARM(), IDLE_ARM()],
});
const planted = (pose: Pose, at: V3, h: number, spread = 0.1, fwd: [number, number] = [0, 0]): Pose => {
  const Rt = Rh(h), F = Fh(h);
  pose.legs = [0, 1].map((i) => ({ankle: add(add(at, mul(Rt, (i === 0 ? 1 : -1) * spread)), add(mul(F, fwd[i]), [0, 0.09, 0])), pitch: 0, flop: 0})) as [Leg, Leg];
  return pose;
};

const sceneA = (frame: number): Scene => {
  const t = frame / 30;
  return {cam: mkCam(7, 530, 540, 1058, 1.0), room: 'back', pose: walkPose(t, {h: 0.1, x0: -1.25, z0: -0.1, v: 0.8, phi0: 0.1})};
};
const sceneB = (frame: number): Scene => {
  const t = frame / 30;
  return {cam: mkCam(7, 600, 540, 960, 1.1), room: 'back', pose: walkPose(t, {h: 0.96, x0: -0.8, z0: -0.95, v: 0.8, phi0: 0.1})};
};

const BOX = {half: [0.15, 0.13, 0.17] as V3, color: '#b9ab96'};
const sceneC = (frame: number): Scene => {
  const t = frame / 30;
  const cam = mkCam(7, 620, 470, 1016, 1.2, 0.2);
  const h = 0.2;
  const reach = sm((t - 0.3) / 0.75), grip = sm((t - 1.0) / 0.25), lower = sm((t - 1.25) / 0.95);
  const rise = Math.sin(Math.PI * clamp((t - 0.3) / 1.1, 0, 1)) * 0.0 + sm((t - 0.35) / 0.6) * (1 - sm((t - 1.7) / 0.5)) * 0.045;
  const manX = 0.14, F = Fh(h), Rt = Rh(h);
  const pose = base(h, [manX - 0.02 * lower, 0.92 + rise * 0.9 - 0.03 * sm((t - 1.9) / 0.4) * 0 - 0.035 * lower + 0.012 * Math.sin(2 * Math.PI * 0.35 * t) * sm((t - 2.2) / 0.3), 0], [4, -8]);
  planted(pose, [manX - 0.06, 0, 0], h, 0.1, [0.02, -0.02]);
  // heels rise as he reaches
  pose.legs.forEach((lg) => { lg.pitch = -rise * 7; lg.ankle = add(lg.ankle, [0, rise * 0.6, 0]); });
  // box path: on the shelf, slides toward him, drops to chest height, a small settle at the end
  const B0: V3 = [0.42, 1.93, 0.0];
  const slide = sm((t - 1.25) / 0.45), drop = sm((t - 1.4) / 0.75);
  const settle = (t > 2.15 ? Math.exp(-(t - 2.15) / 0.18) * Math.sin(2 * Math.PI * 3 * (t - 2.15)) * 0.012 : 0);
  const hold: V3 = [manX + F[0] * 0.22, 1.1, F[2] * 0.22];
  const box: V3 = [lerp(B0[0], hold[0], slide * 0.0 + drop) - 0.15 * slide * (1 - drop) , lerp(B0[1], hold[1], drop) + 0.02 * sm((t - 1.25) / 0.2) * (1 - drop) + settle, lerp(B0[2], hold[2], drop)];
  const sideOff = 0.172;
  const target = (i: number): V3 => {
    const s = i === 0 ? 1 : -1;
    return add(add(box, [0, -0.01, 0]), [-0.03 * (1 - drop) - 0.0, 0, s * sideOff]);
  };
  const rest = solve(pose);
  const hangW = (i: number): V3 => add(rest.sh[i], [0.03, -0.53, (i === 0 ? 1 : -1) * 0.02]);
  pose.arms = [0, 1].map((i) => {
    const s = i === 0 ? 1 : -1;
    const hw = hangW(i), tg = target(i);
    const arc = Math.sin(Math.PI * reach) * 0.1;
    const w: V3 = add(lin3(hw, tg, reach), [0, 0, s * arc * (1 - sm((t - 1.0) / 0.25))]);
    return {wrist: w, pole: unit(add(add(mul(UP, -1), mul(Rh(h), s * 0.8)), mul(F, -0.35))), curl: 0.25 + 0.75 * grip, dir: unit(add(add(mul(F, 0.55), mul(UP, 0.45 * (1 - drop) + 0.1)), mul(Rh(h), 0)))};
  }) as [Arm, Arm];
  // posture: extension while reaching, forward lean to take the weight, then sway back
  pose.lum = 0.02 + 0.05 * reach - 0.06 * lower;
  pose.chest = -0.12 * reach * (1 - lower) + 0.04 * lower;
  pose.headPitch = kf(t, [[0, 0.05], [0.7, -0.5], [1.4, -0.45], [2.2, 0.3], [3, 0.35]]);
  pose.gaze = [kf(t, [[0, 2], [1, 6], [2, 4]]), kf(t, [[0, 6], [1.2, -6], [2.2, 14]])];
  pose.brow = 12;
  return {cam, room: 'shelf', pose, draw: (E, rig) => ({
    far: () => {
      cuboid(E, 600, [0.5, 1.785, 0.0], [[1, 0, 0], UP, [0, 0, 1]], [0.17, 0.015, 0.52], '#8e7f6d', false);
      [-0.38, 0.38].forEach((z, k) => cuboid(E, 640 + k * 20, [0.72, 1.7, z], [[1, 0, 0], UP, [0, 0, 1]], [0.012, 0.085, 0.018], '#6e6256', false));
    },
    near: () => {
      cuboid(E, 700, box, [[1, 0, 0], UP, [0, 0, 1]], BOX.half, BOX.color);
      void rig;
    },
  })};
};

const sceneD = (frame: number): Scene => {
  const t = frame / 30;
  const cam = mkCam(7, 640, 480, 1080, 1.0, 0);
  const h = 0.2, F = Fh(h), Rt = Rh(h);
  const x0 = -0.2;
  const bend = sm((t - 0.35) / 0.8), stand = sm((t - 1.5) / 0.8), down = bend * (1 - stand);
  const pose = base(h, [x0 - 0.2 * down, 0.915 - 0.23 * down, 0]);
  planted(pose, [x0, 0, 0], h, 0.095, [0.07, -0.07]);
  pose.lum = 0.04 + 0.95 * down;
  pose.chest = 0.02 + 0.28 * down;
  pose.headPitch = -(pose.lum + pose.chest) + 0.55 * down;
  pose.gaze = [6, 12 * down + 6 * (1 - down)];
  // the bag: knot on the floor ahead of him, picked up with the near (right) hand, then carried hanging at his side
  const knot0: V3 = [x0 + 0.5, 0.27, 0.12];
  const grabW = add(knot0, [0, 0.09, 0]), hangW: V3 = [x0 + 0.04, 0.86, 0.19];
  const wristAt = (tt: number): V3 => lin3(lin3(hangW, grabW, sm((tt - 0.4) / 0.7)), hangW, sm((tt - 1.5) / 0.8));
  const grip = sm((t - 0.95) / 0.25);
  const right: Arm = {wrist: wristAt(t), curl: 0.3 + 0.7 * grip, pole: unit(add(add(mul(UP, -1), mul(Rt, 0.5)), mul(F, -0.4))), dir: unit(add(mul(UP, -1), mul(F, 0.15)))};
  const left: Arm = {swing: 0.3 * down, flex: 0.2 + 0.25 * down, curl: 0.3};
  pose.arms = [right, left];
  // bag pendulum, integrated from the grip so the frame stays a pure function of t
  const knotAt = (tt: number): V3 => (tt >= 1.1 ? sub(wristAt(tt), [0, 0.09, 0]) : knot0);
  let th = 0, om = 0;
  const dt = 1 / 240, Lb = 0.16;
  for (let tt = 1.1; tt < t; tt += dt) {
    const a = (knotAt(tt + dt)[0] - 2 * knotAt(tt)[0] + knotAt(tt - dt)[0]) / (dt * dt);
    om += (-(9.8 / Lb) * Math.sin(th) - (clamp(a, -25, 25) / Lb) * Math.cos(th) - 3.2 * om) * dt;
    th += om * dt;
  }
  const kn = knotAt(t);
  const bagDir: V3 = t >= 1.1 ? [Math.sin(th), -Math.cos(th), 0] : [0, -1, 0];
  const bagC = ((): V3 => { const c = add(kn, mul(bagDir, 0.14)); return [c[0], Math.max(c[1], 0.125), c[2]]; })();
  return {cam, room: 'back', pose, draw: (E) => ({
    near: () => {
      const {M, C, cam: cm} = E;
      const P2 = (v: V3): Pt => { const r = project(cm, v); return [r.x, r.y]; };
      const sc = project(cm, bagC).s;
      const ang = Math.atan2(bagDir[0], -bagDir[1]);
      const squash = bagC[1] <= 0.126 ? 0.12 : 0;
      const body: Pt[] = Array.from({length: 16}, (_, k) => {
        const a = (2 * Math.PI * k) / 16;
        const rx = 0.14 * (1 + 0.1 * Math.sin(3 * a + 1)) * (1 + squash), ry = 0.135 * (1 + 0.08 * Math.cos(2 * a)) * (1 - squash);
        const x = rx * Math.cos(a), y = ry * Math.sin(a);
        return P2(add(bagC, [x * Math.cos(ang) - y * Math.sin(ang), -(x * Math.sin(ang) + y * Math.cos(ang)), 0]));
      });
      const knotP = P2(kn), neckP = P2(add(kn, mul(bagDir, 0.09)));
      const knotPoly = chain([neckP, knotP], [[0, 0.042 * sc], [1, 0.022 * sc]], {});
      M.base(900, C.bag, body);
      M.shade(901, mixColor(C.bag, C.ink, 0.5), body.filter((_, i) => i >= 3 && i <= 9));
      M.base(902, C.bag, knotPoly);
      [[0.3, 0.1], [0.5, -0.2], [0.7, 0.3]].forEach(([u, v], k) => M.line(904 + k, [P2(add(bagC, [-0.09 + u * 0.1, 0.06 - v * 0.1, 0])), P2(add(bagC, [-0.03 + u * 0.1, -0.06 - v * 0.05, 0]))], {w: 0.8, color: mixColor(C.bagHi, C.ink, 0.2)}));
      M.line(910, body, {w: 1.0, closed: true, color: C.ink});
      M.line(911, knotPoly, {w: 0.9, closed: true, color: C.ink});
    },
  })};
};

// ------------------------------------------------------------------ compositions
const lw = (M: Medium, k: number): Medium => ({...M, line: (id, pts, o) => M.line(id, pts, {...o, w: (o?.w ?? 1) * k})});
const paintScene = (make: (frame: number) => Scene) => ({brush, frame}: PaintContext) => {
  const p = makePainter(brush, {t: frame / 30, frame, fade: PAPER});
  const sc = make(frame);
  const S = inkWash(p), M = lw(inkWashSoft(p), 0.8);
  const E: Env = {p, M, S, C: LK_B_PAL, cam: sc.cam};
  drawRoom(E, sc.room);
  const rig = solve(sc.pose);
  const items = sc.draw ? sc.draw(E, rig) : {};
  bodyDraws(E, sc.pose, rig, items);
};
const ActClip = ({make}: {make: (frame: number) => Scene}) => {
  const paint = useCallback(paintScene(make), [make]);
  return (
    <AbsoluteFill style={{background: PAPER, width: 1080, height: 1920}}>
      <BrushCanvas paint={paint} paper={PAPER} />
      <Grain opacity={0.1} />
    </AbsoluteFill>
  );
};
export const ActA = () => <ActClip make={sceneA} />;
export const ActB = () => <ActClip make={sceneB} />;
export const ActC = () => <ActClip make={sceneC} />;
export const ActD = () => <ActClip make={sceneD} />;
