import {capsule, hardFill, inkLine, washAt} from '../kit/draw';
import {hull} from '../kit/world';
import {mixColor} from '../kit/painter';
import {camPoint, camUnit} from '../kit/ycam';
import {lit, type Light, type Painter, type Pt, type V3, type YCam} from './core';

// N16-07 pterosaur swoop (EP16 shot 16; unnamed, no species: "a pterosaur", span about 3 m, one pass, feet grab, shadow first). Boss, 14 Nov 2026.
// Built as UT16 volumes, not a flat silhouette: a lofted body hull, a head with a long beak and a blade crest, two membrane wings of banded panels
// (leading edge arm + swept wing finger, trailing edge from the hind limb, spars between), legs that reach for the grab. Every face is
// shaded by one high sun (Lambert, banded) and painted far to near. Partial by design: no skin pattern, no teeth, no species marks.
// Local frame (metres): x forward, y up, z toward the animal's right wing. `pteroFlight(u)` is the one pass (an in, a dive, the grab, a climb out).

export const PT = {membrane: '#6e4e38', under: '#8a6446', arm: '#4a3426', body: '#5e4230', beak: '#8a6a4a', crest: '#a0603c', claw: '#2a2420', ink: '#2e2620', shadow: '#2c3a30'} as const;

export type PteroPose = {
  /** World position of the body centre (m). */
  at: V3;
  /** Heading about the vertical axis (rad; the forward direction is (cos, sin) in x, z) and nose-up pitch (rad). */
  heading: number; pitch?: number; bank?: number;
  /** Wing-beat phase in cycles and its amplitude 0..1 (0 = held glide). */
  flap?: number; amp?: number;
  /** Wings pulled in, 0..1 (the dive). */
  fold?: number;
  /** Feet reaching out and forward for the grab, 0..1. */
  grab?: number;
  /** Total wing span (m), default 3. */
  span?: number;
};
export type PteroAnchors = {body: Pt | null; feet: Pt | null; head: Pt | null; tips: (Pt | null)[]; feetWorld: V3; bodyWorld: V3; bounds: {left: number; right: number; top: number; bottom: number}};

const SUN: V3 = [-0.35, 0.9, 0.25];
type Face = {pts: Pt[]; depth: number; col: string; ink?: string; w?: number};

const transform = (o: PteroPose) => {
  const pc = Math.cos(o.pitch ?? 0), ps = Math.sin(o.pitch ?? 0), bc = Math.cos(o.bank ?? 0), bs = Math.sin(o.bank ?? 0), hc = Math.cos(o.heading), hs = Math.sin(o.heading), k = (o.span ?? 3) / 3;
  return ([x, y, z]: V3): V3 => {
    const sx = x * k, sy = y * k, sz = z * k;
    const y1 = sy * bc - sz * bs, z1 = sy * bs + sz * bc;           // bank about the forward axis
    const x2 = sx * pc - y1 * ps, y2 = sx * ps + y1 * pc;           // pitch (nose up)
    return [o.at[0] + x2 * hc - z1 * hs, o.at[1] + y2, o.at[2] + x2 * hs + z1 * hc]; // heading about the vertical
  };
};
const normalOf = (a: V3, b: V3, c: V3): V3 => {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]], l = Math.hypot(...n) || 1;
  return [n[0] / l, n[1] / l, n[2] / l];
};
const banded = (n: V3) => { const d = Math.abs(n[0] * SUN[0] + n[1] * SUN[1] + n[2] * SUN[2]) / Math.hypot(...SUN); return Math.round(d * 4) / 4; };

/** The wing joints (shoulder, wrist, tip) and the hind-limb root of one wing in the animal's frame. Long narrow wing swept back (user reference 14 Nov 2026). */
const wingJoints = (sd: 1 | -1, flap: number, amp: number, fold: number) => {
  const dp = amp * 0.5 * Math.sin(flap * 6.2832) + 0.1 - 0.6 * fold;
  const dd = amp * 0.7 * Math.sin(flap * 6.2832 - 0.9) + 0.03 - 0.5 * fold + 0.18 * fold;
  const reach = 1 - 0.5 * fold;
  const S: V3 = [0.12, 0.04, sd * 0.09];
  const W: V3 = [S[0] + 0.12 - 0.1 * fold, S[1] + 0.5 * reach * Math.sin(dp), S[2] + sd * 0.5 * reach * Math.cos(dp)];
  const T: V3 = [W[0] - 0.6 - 0.25 * fold, W[1] + 1.0 * reach * Math.sin(dd), W[2] + sd * 1.0 * reach * Math.cos(dd)];
  const H: V3 = [-0.34, -0.03, sd * 0.09];
  return {S, W, T, H};
};
const lerp3 = (a: V3, b: V3, u: number): V3 => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit3 = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

/** The leg reaching for the grab (hip, knee, foot) in the animal's frame. */
const legJoints = (sd: 1 | -1, grab: number) => {
  const hip: V3 = [-0.3, -0.06, sd * 0.07];
  const foot: V3 = [-0.6 + 0.88 * grab, -0.06 - 0.4 * grab, sd * (0.09 - 0.03 * grab)];
  const knee: V3 = [-0.44 + 0.14 * grab, -0.05 - 0.14 * grab, sd * 0.1];
  return {hip, knee, foot};
};

/** A leading-edge curve through W and T bowed forward and up at the tip (quadratic Bezier sampled at n+1 points). */
const bow = (W: V3, T: V3, n: number, up: number): V3[] => {
  const C: V3 = [(W[0] + T[0]) / 2 + 0.12, (W[1] + T[1]) / 2 + up, (W[2] + T[2]) / 2];
  return Array.from({length: n + 1}, (_, i) => { const u = i / n, a = (1 - u) * (1 - u), b = 2 * u * (1 - u), c = u * u; return [a * W[0] + b * C[0] + c * T[0], a * W[1] + b * C[1] + c * T[1], a * W[2] + b * C[2] + c * T[2]] as V3; });
};

type Tube = {path: V3[]; up: number[]; side: number[]; ref: V3; sides?: number; base: string; ink?: boolean};
type Facet = {pts: V3[]; n: V3; col: string; two?: boolean; depthBias?: number; rib?: boolean};
/** Round cross-sections along a path (UT16): each facet carries its outward normal for the banded form shading. */
const tubeFacets = (t: Tube, out: Facet[]) => {
  const N = t.sides ?? 8, rings: V3[][] = [], centres: V3[] = t.path;
  t.path.forEach((p, i) => {
    const tg = unit3(sub3(t.path[Math.min(i + 1, t.path.length - 1)], t.path[Math.max(i - 1, 0)]));
    const sv = unit3(sub3(t.ref, [tg[0] * dot3(t.ref, tg), tg[1] * dot3(t.ref, tg), tg[2] * dot3(t.ref, tg)])), uv = cross3(tg, sv);
    rings.push(Array.from({length: N}, (_, j) => { const a = (j / N) * 6.2832, cu = Math.sin(a) * t.up[i], cs = Math.cos(a) * t.side[i]; return [p[0] + uv[0] * cu + sv[0] * cs, p[1] + uv[1] * cu + sv[1] * cs, p[2] + uv[2] * cu + sv[2] * cs] as V3; }));
  });
  for (let i = 0; i + 1 < rings.length; i++) for (let j = 0; j < N; j++) {
    const q = [rings[i][j], rings[i][(j + 1) % N], rings[i + 1][(j + 1) % N], rings[i + 1][j]];
    const ctr = lerp3(centres[i], centres[i + 1], 0.5), mid: V3 = [(q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2, (q[0][2] + q[2][2]) / 2];
    let nn = unit3(cross3(sub3(q[1], q[0]), sub3(q[3], q[0])));
    if (dot3(nn, sub3(mid, ctr)) < 0) nn = [-nn[0], -nn[1], -nn[2]];
    out.push({pts: q, n: nn, col: t.base});
  }
};

/**
 * Paint the pterosaur through camera `c`. Returns the picture anchors (feet, body, head, wing tips, picture bounds of every vertex) and the world feet point
 * (the grab contact) so the scene can place the fish and the net. Pass `null` as the painter to probe the anchors without drawing.
 */
export const paintPterosaur = (p: Painter | null, c: YCam, o: PteroPose, L: Light, seed = 41000): PteroAnchors => {
  const tr = transform(o), flap = o.flap ?? 0, amp = o.amp ?? 1, fold = o.fold ?? 0, grab = o.grab ?? 0;
  const camW: V3 = [c.x, c.y, c.z];
  const near: Facet[] = [], far: Facet[] = [], all: Facet[] = [];
  const nrm = (n: V3): V3 => { const a = tr([0, 0, 0]), b = tr(n); return unit3(sub3(b, a)); };
  const addTube = (t: Tube, bag: Facet[], rot = true) => { const tmp: Facet[] = []; tubeFacets(t, tmp); for (const f of tmp) bag.push({...f, pts: f.pts.map(tr), n: rot ? nrm(f.n) : f.n}); };
  const wings = ([1, -1] as const).map((sd) => {
    const J = wingJoints(sd, flap, amp, fold), {S, W, T, H} = J;
    const dep = (v: V3) => Math.hypot(...sub3(tr(v), camW));
    return {sd, J, d: dep(lerp3(S, T, 0.5))};
  });
  const farSd = wings[0].d > wings[1].d ? 1 : -1;
  // body, tail stub, neck
  addTube({path: [[-0.5, -0.01, 0], [-0.36, 0, 0], [-0.2, 0.01, 0], [0, 0.015, 0], [0.18, 0.02, 0], [0.32, 0.04, 0]], up: [0.012, 0.06, 0.11, 0.125, 0.1, 0.06], side: [0.012, 0.055, 0.095, 0.105, 0.085, 0.05], ref: [0, 0, 1], sides: 10, base: PT.body}, all);
  addTube({path: [[0.3, 0.04, 0], [0.42, 0.1, 0], [0.52, 0.16, 0], [0.6, 0.19, 0]], up: [0.055, 0.04, 0.035, 0.05], side: [0.05, 0.036, 0.032, 0.045], ref: [0, 0, 1], base: PT.body}, all);
  // head: skull + long upper beak, lower jaw open, backward crest blade
  addTube({path: [[0.58, 0.19, 0], [0.72, 0.17, 0], [0.9, 0.12, 0], [1.1, 0.06, 0], [1.3, 0.0, 0]], up: [0.06, 0.045, 0.026, 0.014, 0.006], side: [0.05, 0.04, 0.024, 0.013, 0.006], ref: [0, 0, 1], base: PT.beak}, all);
  addTube({path: [[0.64, 0.15, 0], [0.8, 0.08, 0], [0.98, -0.01, 0], [1.14, -0.1, 0]], up: [0.028, 0.02, 0.011, 0.005], side: [0.034, 0.024, 0.012, 0.005], ref: [0, 0, 1], base: PT.beak}, all);
  addTube({path: [[0.6, 0.22, 0], [0.46, 0.28, 0], [0.3, 0.36, 0], [0.18, 0.42, 0]], up: [0.035, 0.03, 0.016, 0.004], side: [0.014, 0.012, 0.008, 0.004], ref: [0, 0, 1], sides: 6, base: PT.crest}, all);
  const out0 = tr([0.9, 0.09, 0]);
  // legs
  for (const sd of [1, -1] as const) {
    const {hip, knee, foot} = legJoints(sd, grab);
    addTube({path: [hip, knee, foot], up: [0.035, 0.022, 0.012], side: [0.03, 0.02, 0.012], ref: [0, 0, 1], sides: 6, base: PT.body}, all);
    for (let j = -1; j <= 1; j++) addTube({path: [foot, [foot[0] + 0.08 * (0.6 + 0.4 * grab), foot[1] - 0.05, foot[2] + sd * j * 0.045 * (1 + grab)]], up: [0.01, 0.003], side: [0.01, 0.003], ref: [0, 0, 1], sides: 4, base: PT.claw}, all);
  }
  // wings: arm + finger tubes, banded membrane panels with ribs and a sag, the far-side wing darker
  const ribs: {a: V3; b: V3; far: boolean}[] = [];
  for (const {sd, J} of wings) {
    const {S, W, T, H} = J, isFar = sd === farSd, bag = isFar ? far : near, NP = 8;
    const lead: V3[] = [S, lerp3(S, W, 0.5), ...bow(W, T, NP - 2, 0.1 * (1 - 0.4 * fold))];
    const trail: V3[] = lead.map((_, i) => { const b = lerp3(H, T, i / NP); return [b[0], b[1] - 0.05 * Math.sin((Math.PI * i) / NP), b[2]] as V3; });
    const rip = (i: number) => 0.05 * fold * Math.sin(i * 1.9 + sd);
    const mid: V3[] = lead.map((v, i) => { const m = lerp3(v, trail[i], 0.5); return [m[0], m[1] - 0.03 + rip(i) - 0.015 * Math.sin((Math.PI * i) / NP), m[2]] as V3; });
    const mem = isFar ? mixColor(PT.membrane, PT.arm, 0.45) : PT.membrane;
    for (let i = 0; i < NP; i++) for (const [r0, r1] of [[lead, mid], [mid, trail]] as [V3[], V3[]][]) {
      const q = [r0[i], r0[i + 1], r1[i + 1], r1[i]], n0 = unit3(cross3(sub3(q[1], q[0]), sub3(q[3], q[0])));
      const w3 = q.map(tr);
      bag.push({pts: w3, n: nrm(n0), col: i % 2 ? mixColor(mem, PT.under, 0.18) : mem, two: true});
    }
    for (let i = 1; i < NP; i++) ribs.push({a: tr(lead[i]), b: tr(lerp3(lead[i], trail[i], 0.9)), far: isFar});
    // arm bone and the wing finger, thick at the shoulder, thin and pointed at the tip
    const finger = bow(W, T, 6, 0.1 * (1 - 0.4 * fold));
    addTube({path: [S, lerp3(S, W, 0.5), W], up: [0.045, 0.036, 0.028], side: [0.04, 0.032, 0.026], ref: [1, 0, 0], sides: 6, base: isFar ? mixColor(PT.arm, '#1e1610', 0.3) : PT.arm}, bag);
    addTube({path: finger, up: [0.026, 0.022, 0.018, 0.013, 0.009, 0.005, 0.0015], side: [0.026, 0.022, 0.018, 0.013, 0.009, 0.005, 0.0015], ref: [1, 0, 0], sides: 6, base: isFar ? mixColor(PT.arm, '#1e1610', 0.3) : PT.arm}, bag);
    for (const sh of [0.3, 0.6]) { const q0 = lerp3(W, T, 0), e = lerp3(lead[3], trail[3], sh); addTube({path: [q0, lerp3(q0, e, 0.5), e], up: [0.01, 0.007, 0.004], side: [0.01, 0.007, 0.004], ref: [1, 0, 0], sides: 4, base: PT.arm}, bag); }
  }
  const shaded = (f: Facet, dark: boolean) => {
    const ctr: V3 = [f.pts.reduce((s2, v) => s2 + v[0], 0) / f.pts.length, f.pts.reduce((s2, v) => s2 + v[1], 0) / f.pts.length, f.pts.reduce((s2, v) => s2 + v[2], 0) / f.pts.length];
    const toCam = unit3(sub3(camW, ctr));
    let n = f.n, dn = dot3(n, toCam);
    if (dn < 0) { if (!f.two) return null; n = [-n[0], -n[1], -n[2]]; dn = -dn; }
    const sd = Math.max(0, dot3(n, unit3(SUN))), band = Math.round(sd * 4) / 4;
    let col = mixColor(mixColor(f.col, '#1e1610', 0.12), '#d4bc9a', 0.4 * band);
    if (dark) col = mixColor(col, '#1e1610', 0.32);
    return {ctr, col: lit(L, col), depth: Math.hypot(...sub3(ctr, camW))};
  };
  const items: {depth: number; pts: Pt[]; col: string; line?: boolean}[] = [];
  const bounds = {left: 1e9, right: -1e9, top: 1e9, bottom: -1e9};
  const take = (bag: Facet[], dark: boolean, bias: number) => { for (const f of bag) {
    const q = f.pts.map((v) => camPoint(c, v));
    if (q.some((x) => !x)) continue;
    for (const [x, y] of q as Pt[]) { bounds.left = Math.min(bounds.left, x); bounds.right = Math.max(bounds.right, x); bounds.top = Math.min(bounds.top, y); bounds.bottom = Math.max(bounds.bottom, y); }
    const sh = shaded(f, dark);
    if (sh) items.push({depth: sh.depth + bias, pts: q as Pt[], col: sh.col});
  } };
  take(far, false, 0.6); take(all, false, 0); take(near, false, -0.05);
  const fv = tr(lerp3(legJoints(1, grab).foot, legJoints(-1, grab).foot, 0.5)), feetWorld: V3 = fv;
  const result: PteroAnchors = {body: camPoint(c, tr([0, 0, 0])), feet: camPoint(c, feetWorld), head: camPoint(c, out0), tips: [1, -1].map((sd) => camPoint(c, tr(wingJoints(sd as 1 | -1, flap, amp, fold).T))), feetWorld, bodyWorld: tr([0, 0, 0]), bounds};
  if (!p) return result;
  ribs.forEach((r) => { const a = camPoint(c, r.a), b = camPoint(c, r.b); if (a && b) items.push({depth: Math.hypot(...sub3(r.a, camW)) + (r.far ? 0.6 : -0.06) - 0.02, pts: [a, b], col: mixColor(PT.membrane, '#1e1610', r.far ? 0.7 : 0.55), line: true}); });
  items.sort((a, b) => b.depth - a.depth).forEach((it, i) => {
    if (it.line) { inkLine(p, seed + 5000 + i * 3, it.pts, {weight: 0.5, color: it.col, still: true, closed: false}); return; }
    hardFill(p, seed + 100 + i * 2, it.col, it.pts);
    inkLine(p, seed + 101 + i * 2, it.pts, {weight: 0.55, color: it.col, still: true, closed: true});
  });
  return result;
};

/** Shadow of the pterosaur on a flat ground plane `gy` (the water or the bank): the wings and body projected along the sun, darker and tighter the lower it flies. */
export const paintPterosaurShadow = (p: Painter, c: YCam, o: PteroPose, gy: number, seed = 41900, op = 70) => {
  const tr = transform(o), flap = o.flap ?? 0, amp = o.amp ?? 1, fold = o.fold ?? 0;
  const down = (v: V3): V3 => { const w = tr(v), k = (w[1] - gy) / SUN[1]; return [w[0] - SUN[0] * k * 0.6, gy + 0.005, w[2] - SUN[2] * k * 0.6]; };
  const hgt = Math.max(0, o.at[1] - gy), k = 1 / (1 + hgt * 0.12);
  for (const sd of [1, -1] as const) {
    const {S, W, T, H} = wingJoints(sd, flap, amp, fold);
    const poly = [S, W, T, lerp3(H, T, 0.7), lerp3(H, T, 0.35), H].map((v) => camPoint(c, down(v)));
    if (poly.every(Boolean)) washAt(p, seed + (sd > 0 ? 0 : 1), PT.shadow, op * k, poly as Pt[], 0.3, 0.2);
  }
  const b = [[-0.5, 0, 0.03], [0, 0, 0.1], [0.4, 0, 0.04], [0, 0, -0.1]].map((v) => camPoint(c, down(v as V3)));
  if (b.every(Boolean)) washAt(p, seed + 2, PT.shadow, op * k, b as Pt[], 0.3, 0.2);
};

/** Key points of the one pass (world metres): where it comes from, the grab and where it leaves. */
export type PteroPass = {from: V3; grab: V3; to: V3; /** 0..1 progress of the snatch inside the pass (default 0.5). */ tGrab?: number};
const crm = (a: number, b: number, c: number, d: number, t: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
/**
 * The pose at pass progress `u` (0 = first on screen, 1 = last): a smooth path from `from` through the grab to `to` (a dive in, a climb out), nose along the
 * path, wings held and half folded on the dive, beating on the climb, the feet reaching around the grab. A pure function of `u` (seekable).
 */
export const pteroFlight = (u: number, f: PteroPass, span = 3): PteroPose => {
  const tg = f.tGrab ?? 0.5;
  const mid1 = lerp3(f.from, f.grab, 0.55), mid2 = lerp3(f.grab, f.to, 0.45);
  mid1[1] = Math.max(mid1[1], f.grab[1] + 0.7 * (f.from[1] - f.grab[1]) * 0.6); // the dive stays high, then drops
  const ks: V3[] = [lerp3(f.from, f.grab, -0.25), f.from, mid1, f.grab, mid2, f.to, lerp3(f.to, f.grab, -0.25)];
  const pos = (t: number): V3 => {
    const q = Math.min(1, Math.max(0, t)), s = q <= tg ? (2 * q) / tg : 2 + (2 * (q - tg)) / (1 - tg); // 4 Catmull-Rom segments, the grab at s = 2
    const j = Math.min(3, Math.floor(s)), ft = s - j;
    const ch = (k: 0 | 1 | 2) => crm(ks[j][k], ks[j + 1][k], ks[j + 2][k], ks[j + 3][k], ft);
    return [ch(0), ch(1), ch(2)];
  };
  const a = pos(u - 0.07), b = pos(u + 0.07), at = pos(u);
  const vx = b[0] - a[0], vy = b[1] - a[1], vz = b[2] - a[2];
  const near = Math.exp(-Math.pow((u - tg) / 0.14, 2));
  const dive = Math.exp(-Math.pow((u - tg * 0.62) / 0.2, 2));
  return {at, heading: Math.atan2(vz, vx), pitch: Math.atan2(vy, Math.hypot(vx, vz)) * 0.85, bank: 0.22 * Math.sin(u * 3.1), flap: u * 6.5, amp: 0.2 + 0.35 * (1 - dive) * (1 - 0.4 * near) + 0.1 * (u > tg ? 1 : 0),
    fold: 0.28 * dive, grab: Math.min(1, near * 1.25), span};
};
