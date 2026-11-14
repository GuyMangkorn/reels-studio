// EDU-EP16 Film R13 look-frame prototypes (14 Nov 2026): daylight volume creatures for the dinosaur-presence pass.
// Look-frame code only (Film, W3): Boss hardens the builds into src/painted/survival/creatures.ts (N16-06 R2, N16-14..16). Not imported by any episode.
// UT16: lofted round cross-sections, banded form shading from one sun, far-side limbs one value darker, painted far to near, ink on the silhouette.
// UT10: proportions start from the user's references in the store (projects/edu/EDU/references/user/2026-11-14_*):
//   long-neck = longneck-brachiosaur-ref (blue-grey, wrinkled neck folds, nasal arch, long column front legs, back sloping to the tail);
//   triceratops-ref (blue-grey with a tan back band, rust mottling, scalloped pale frill, two long brow horns, short nose horn, dark beak);
//   ankylosaurus-ref (olive, low wide body, rows of dark oval plates, side spikes, long tail with a round club);
//   dragonfly-ref (red-brown segmented abdomen, pale thorax stripes, big dark-red eyes, four veined wings, legs tucked). Never named on screen.
import {hardFill, inkLine, washAt} from '../../../../src/painted/kit/draw';
import {mixColor, type Painter, type Pt} from '../../../../src/painted/kit/painter';
import {camDepth, camPoint, type YCam} from '../../../../src/painted/kit/ycam';
import type {V3} from '../../../../src/painted/kit/space';

type L3 = [number, number, number];   // creature-local metres: s forward (toward the head), y up, l toward the left flank
type Key = {p: L3; a: number; b: number};   // a half-width (along l), b half-height
const add = (a: L3, b: L3): L3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: L3, b: L3): L3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a: L3, k: number): L3 => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a: L3, b: L3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: L3, b: L3): L3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a: L3): L3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const lerp = (a: L3, b: L3, u: number): L3 => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const crs = (a: number, b: number, c: number, d: number, t: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
const spline = (ks: Key[], n: number): Key[] => {
  const out: Key[] = [];
  for (let i = 0; i < ks.length - 1; i++) {
    const k0 = ks[Math.max(0, i - 1)], k1 = ks[i], k2 = ks[i + 1], k3 = ks[Math.min(ks.length - 1, i + 2)];
    for (let j = 0; j < n; j++) { const t = j / n; out.push({p: [0, 1, 2].map((q) => crs(k0.p[q], k1.p[q], k2.p[q], k3.p[q], t)) as L3, a: Math.max(0.003, crs(k0.a, k1.a, k2.a, k3.a, t)), b: Math.max(0.003, crs(k0.b, k1.b, k2.b, k3.b, t))}); }
  }
  out.push(ks[ks.length - 1]);
  return out;
};
const bez3 = (a: L3, b: L3, c: L3, n: number): L3[] => Array.from({length: n + 1}, (_, i) => { const t = i / n, m = 1 - t; return add(add(mul(a, m * m), mul(b, 2 * m * t)), mul(c, t * t)); });

/** One lofted part. `col` base colour (a function of the station so a back band / belly can vary); `dim` 0 near .. 0.4 far side. `fold` draws wrinkle rings every n stations. */
type Part = {keys: Key[]; m: number; col: (u: number, side: number) => string; dim?: number; cap?: boolean; fold?: number; ink?: string};
/** A flat facet in local metres (frill, wing, plate). `two` = seen from both sides; `op` < 255 = translucent wash. */
type Flat = {pts: L3[]; col: string; two?: boolean; op?: number; veins?: L3[][]; ink?: string};
export type Build = {parts: Part[]; flats: Flat[]; feet: L3[]; shadow: {s: number; l: number; rs: number; rl: number}; anchors: Record<string, L3>};

export type BeastPlace = {at: [number, number]; heading: number; ground?: number; /** nose-up pitch and bank about the body axis (rad), for fliers */ pitch?: number; bank?: number; seed?: number; sun?: V3; amb?: string; ambK?: number; shadowOp?: number; haze?: number; hazeCol?: string};
export type BeastAnchors = {pt: (name: string) => Pt | null; world: (name: string) => V3; left: number; right: number; top: number; bottom: number};

const SUN: L3 = nrm([-0.4, 0.85, 0.35]);
/** Paint a build through the yaw camera (`p` null = probe only). */
export const paintBeast = (p: Painter | null, c: YCam, B: Build, o: BeastPlace): BeastAnchors => {
  const h = o.heading, fx = Math.cos(h), fz = Math.sin(h), lx = Math.sin(h), lz = -Math.cos(h), gy = o.ground ?? 0, seed = o.seed ?? 70000;
  const pc = Math.cos(o.pitch ?? 0), ps = Math.sin(o.pitch ?? 0), bc = Math.cos(o.bank ?? 0), bs = Math.sin(o.bank ?? 0);
  const rot = ([s0, y0, l0]: L3): L3 => { const y1 = y0 * bc - l0 * bs, l1 = y0 * bs + l0 * bc; return [s0 * pc - y1 * ps, s0 * ps + y1 * pc, l1]; };
  const W = (q: L3): V3 => { const [s, y, l] = rot(q); return [o.at[0] + s * fx + l * lx, gy + y, o.at[1] + s * fz + l * lz]; };
  const WN = (q: L3): L3 => { const [s, y, l] = rot(q); return [s * fx + l * lx, y, s * fz + l * lz]; };
  const sun = o.sun ? nrm(o.sun as L3) : SUN, cam: L3 = [c.x, c.y, c.z];
  const toward = (pl: L3, nl: L3) => dot(WN(nl), sub(cam, W(pl) as L3)) > 0;
  const shade = (col: string, nl: L3, dim: number, pl: L3) => {
    const n = WN(nl), lam = Math.max(0, dot(n, sun)), band = lam < 0.12 ? 0 : lam < 0.4 ? 1 : lam < 0.7 ? 2 : 3;
    let k = mixColor(mixColor(col, '#16140f', 0.42), mixColor(col, '#f4ecd0', 0.22), [0, 0.38, 0.7, 1][band]);
    if (n[1] < -0.35) k = mixColor(k, '#2a2a1e', 0.12);   // belly bounce stays cool and dark
    if (pl[1] < 0.6) k = mixColor(k, '#1c1a14', 0.18 * (1 - pl[1] / 0.6));   // contact darkening toward the ground
    k = mixColor(k, '#0e0d0a', dim);
    if (o.haze) k = mixColor(k, o.hazeCol ?? '#dfe8d4', o.haze);
    return o.amb ? mixColor(k, o.amb, o.ambK ?? 0.1) : k;
  };
  const grow = (q: Pt[], k = 0.6): Pt[] => { const mx = q.reduce((a, v) => a + v[0], 0) / q.length, my = q.reduce((a, v) => a + v[1], 0) / q.length; return q.map(([x, y]) => { const dx = x - mx, dy = y - my, l = Math.hypot(dx, dy) || 1; return [x + (dx / l) * k, y + (dy / l) * k]; }); };
  const items: {d: number; f: () => void}[] = [];
  const all: Pt[] = [];
  let id = 0;
  for (const part of B.parts) {
    const ks = part.keys, n = ks.length, m = part.m, dim = part.dim ?? 0;
    const rv: L3[][] = [], rn: L3[][] = [];
    ks.forEach((k, i) => {
      const T = nrm(sub(ks[Math.min(n - 1, i + 1)].p, ks[Math.max(0, i - 1)].p));
      let X = sub([0, 0, 1], mul(T, T[2]));
      if (Math.hypot(...X) < 0.05) X = sub([0, 1, 0], mul(T, T[1]));
      X = nrm(X);
      const Y = cross(X, T);
      const Yu: L3 = Y[1] < 0 ? mul(Y, -1) : Y;
      rv.push([]); rn.push([]);
      for (let j = 0; j < m; j++) { const th = (j / m) * Math.PI * 2, cs = Math.cos(th), sn = Math.sin(th); rv[i].push(add(k.p, add(mul(X, k.a * cs), mul(Yu, k.b * sn)))); rn[i].push(nrm(add(mul(X, cs / k.a), mul(Yu, sn / k.b)))); }
    });
    const scr = rv.map((r) => r.map((v) => camPoint(c, W(v))));
    const front: boolean[][] = [];
    for (let i = 0; i < n - 1; i++) { front.push([]); for (let j = 0; j < m; j++) { const j2 = (j + 1) % m, ctr = mul(add(add(rv[i][j], rv[i][j2]), add(rv[i + 1][j], rv[i + 1][j2])), 0.25), nl = nrm(add(add(rn[i][j], rn[i][j2]), add(rn[i + 1][j], rn[i + 1][j2]))); front[i].push(toward(ctr, nl)); } }
    const pid = id++;
    for (let i = 0; i < n - 1; i++) for (let j = 0; j < m; j++) {
      if (!front[i][j]) continue;
      const j2 = (j + 1) % m, q = [scr[i][j], scr[i][j2], scr[i + 1][j2], scr[i + 1][j]];
      if (!q.every(Boolean)) continue;
      const ctr = mul(add(add(rv[i][j], rv[i][j2]), add(rv[i + 1][j], rv[i + 1][j2])), 0.25), nl = nrm(add(add(rn[i][j], rn[i][j2]), add(rn[i + 1][j], rn[i + 1][j2])));
      const col = shade(part.col(i / (n - 1), nl[1]), nl, dim, ctr), qq = q as Pt[];
      all.push(...qq);
      const edges: [Pt, Pt][] = [];
      if (!front[i][(j + m - 1) % m]) edges.push([qq[0], qq[3]]);
      if (!front[i][j2]) edges.push([qq[1], qq[2]]);
      const fold = part.fold && i % part.fold === 0 && i > 0 && Math.abs(nl[1]) < 0.85;
      const fid = seed + pid * 4000 + i * m + j;
      items.push({d: camDepth(c, W(ctr)), f: () => {
        if (!p) return;
        hardFill(p, fid, col, grow(qq));
        if (fold) inkLine(p, fid + 900000, [qq[0], qq[1]], {closed: false, weight: 0.5, color: mixColor(col, '#1a1a16', 0.35), still: true});
        edges.forEach(([a, b], e) => inkLine(p, fid + 500000 + e, [a, b], {closed: false, weight: 1.1, color: part.ink ?? mixColor(col, '#100e0a', 0.6), still: true}));
      }});
    }
    if (part.cap) { const q = scr[n - 1], nl = nrm(sub(ks[n - 1].p, ks[n - 2].p)); if (q.every(Boolean) && toward(ks[n - 1].p, nl)) { const col = shade(part.col(1, 0), nl, dim, ks[n - 1].p); items.push({d: camDepth(c, W(ks[n - 1].p)) - 0.02, f: () => { if (p) hardFill(p, seed + pid * 4000 + 3999, col, grow(q as Pt[], 1)); }}); } }
  }
  B.flats.forEach((fl, k) => {
    const q = fl.pts.map((v) => camPoint(c, W(v)));
    if (!q.every(Boolean)) return;
    const ctr = mul(fl.pts.reduce((a, v) => add(a, v), [0, 0, 0] as L3), 1 / fl.pts.length);
    let nl = nrm(cross(sub(fl.pts[1], fl.pts[0]), sub(fl.pts[fl.pts.length - 1], fl.pts[0])));
    if (!toward(ctr, nl)) { if (!fl.two) return; nl = mul(nl, -1); }
    const col = shade(fl.col, nl, 0, ctr), qq = q as Pt[];
    all.push(...qq);
    items.push({d: camDepth(c, W(ctr)), f: () => {
      if (!p) return;
      if (fl.op !== undefined && fl.op < 255) washAt(p, seed + 300000 + k, col, fl.op, qq, 0, 0.15); else hardFill(p, seed + 300000 + k, col, grow(qq, 0.5));
      (fl.veins ?? []).forEach((v, vi) => { const vq = v.map((x) => camPoint(c, W(x))); if (vq.every(Boolean)) inkLine(p, seed + 310000 + k * 40 + vi, vq as Pt[], {closed: false, weight: 0.35, color: fl.ink ?? mixColor(col, '#2a1a14', 0.6), still: true}); });
      if (fl.ink) inkLine(p, seed + 320000 + k, qq, {closed: true, weight: 0.6, color: fl.ink, still: true});
    }});
  });
  // ground shadow first (under everything)
  if (p && B.shadow.rs > 0) {
    const sh = B.shadow, ring = Array.from({length: 24}, (_, j) => camPoint(c, W([sh.s + sh.rs * Math.cos((j / 24) * 6.283), -gy + gy + 0.01, sh.l + sh.rl * Math.sin((j / 24) * 6.283)])));
    if (ring.every(Boolean)) washAt(p, seed + 99, '#1e2418', o.shadowOp ?? 110, ring as Pt[], 0.35, 0.2);
    B.feet.forEach((f, i) => { const pr = Array.from({length: 14}, (_, j) => camPoint(c, W([f[0] + 0.5 * Math.cos((j / 14) * 6.283) * (B.shadow.rs / 6 + 0.3), 0.012, f[2] + 0.4 * Math.sin((j / 14) * 6.283) * (B.shadow.rs / 6 + 0.3)]))); if (f[1] < 0.2 && pr.every(Boolean)) washAt(p, seed + 120 + i, '#141810', 150, pr as Pt[], 0.2, 0.2); });
  }
  items.sort((x, y) => y.d - x.d).forEach((it) => it.f());
  const xs = all.map((q) => q[0]), ys = all.map((q) => q[1]);
  return {pt: (n) => (B.anchors[n] ? camPoint(c, W(B.anchors[n])) : null), world: (n) => W(B.anchors[n] ?? [0, 0, 0]), left: Math.min(...xs), right: Math.max(...xs), top: Math.min(...ys), bottom: Math.max(...ys)};
};

// ------------------------------------------------------------------ shared leg loft: a column with mass at the top, a knee/elbow, a pad foot with toes
const leg = (top: L3, knee: L3, foot: L3, r: [number, number, number, number], col: Part['col'], dim: number, toes = 0, toeCol?: string, flats?: Flat[]): Part[] => {
  const parts: Part[] = [{dim, m: 10, col, fold: 3, keys: spline([{p: add(top, [0, 0.35 * r[0], 0]), a: r[0] * 0.7, b: r[0] * 0.8}, {p: top, a: r[0], b: r[0] * 1.05}, {p: lerp(top, knee, 0.55), a: r[1] * 1.05, b: r[1] * 1.1}, {p: knee, a: r[1], b: r[1]}, {p: lerp(knee, foot, 0.5), a: r[2], b: r[2]}, {p: add(foot, [0, r[3] * 0.9, 0]), a: r[3] * 0.95, b: r[3] * 0.8}, {p: add(foot, [0.05, r[3] * 0.25, 0]), a: r[3] * 1.1, b: r[3] * 0.3}], 3)}];
  if (toes && toeCol && flats) for (let t = 0; t < toes; t++) { const a = ((t - (toes - 1) / 2) * 0.5), base = add(foot, [r[3] * 0.95 * Math.cos(a), 0.06, r[3] * 0.95 * Math.sin(a)]); flats.push({pts: [add(base, [0, 0.12, -0.07]), add(base, [0.12, 0.02, 0]), add(base, [0, 0.0, 0.07]), add(base, [-0.04, 0.1, 0])], col: toeCol, two: true}); }
  return parts;
};
const band = (base: string, back: string, belly: string, k = 0.5) => (_u: number, side: number) => (side > k ? back : side < -0.3 ? belly : base);

// ------------------------------------------------------------------ long-neck (N16-06 R2): brachiosaur-like, 22 m, shoulder 6.2 m, head up to 13 m
export const LN2 = {skin: '#7d8a90', back: '#56636a', belly: '#bab8a8', fold: '#2e363a', eye: '#14120e', mouth: '#3a2e28'} as const;
export type LongNeckPose = {
  /** Head (snout tip) target in local metres; default the canopy pose of the reference (neck near vertical). */
  head?: L3;
  /** Walk phase (cycles) and stride (m); 0 = standing. */
  walk?: number; stride?: number;
  /** Jaw open 0..1 (chew cycle). */
  jaw?: number;
};
export const buildLongNeck = (o: LongNeckPose = {}): Build => {
  const parts: Part[] = [], flats: Flat[] = [], feet: L3[] = [];
  const skin = band(LN2.skin, LN2.back, LN2.belly);
  const ph = o.walk ?? 0, S = o.stride ?? 0;
  const bob = S ? -0.08 * Math.cos(ph * 4 * Math.PI) : 0;
  // body: chest high, back sloping down to the hips, tail tapering to 0.05 m
  const body: Key[] = [
    {p: [-14.5, 2.2, 0], a: 0.03, b: 0.03}, {p: [-11.5, 3.0, 0], a: 0.2, b: 0.25}, {p: [-8, 4.0, 0], a: 0.5, b: 0.6}, {p: [-5, 5.3 + bob, 0], a: 1.05, b: 1.15},
    {p: [-2.8, 6.0 + bob, 0], a: 1.6, b: 1.75}, {p: [-0.5, 6.5 + bob, 0], a: 1.95, b: 2.15}, {p: [1.8, 7.1 + bob, 0], a: 1.9, b: 2.2}, {p: [3.6, 7.8 + bob, 0], a: 1.4, b: 1.6}, {p: [4.6, 8.5 + bob, 0], a: 1.1, b: 1.2},
  ];
  parts.push({m: 18, col: skin, fold: 4, keys: spline(body, 4)});
  // neck: from the base over the shoulders to the head target, a quadratic curve; radius 0.9 -> 0.32
  const base: L3 = [4.6, 8.5 + bob, 0], H = o.head ?? [7.6, 14.5, 0];
  const up = H[1] > base[1];
  const ctrl: L3 = up ? [base[0] + 1.6, (base[1] + H[1]) * 0.5 + 1.0, H[2] * 0.4] : [base[0] + 0.55 * (H[0] - base[0]) + 0.6, base[1] + 0.9, H[2] * 0.5];
  const neckEnd = sub(H, mul(nrm(sub(H, ctrl)), 0.0));
  const pts = bez3(base, ctrl, neckEnd, 12);
  // head direction: continue the neck's last tangent, bent 70 deg toward the ground at the skull (the ref carries the head nose-down)
  const tan = nrm(sub(pts[12], pts[11]));
  const fwd: L3 = nrm([Math.max(0.35, Math.hypot(tan[0], tan[2])) * (tan[0] >= 0 ? 1 : -1), 0, 0]);
  const hd = nrm(add(mul(fwd, 0.7), [0, up ? -0.35 : -0.42, tan[2] * 0.3]));
  const skull = sub(H, mul(hd, 0.95));   // the back of the skull; the neck ends here
  const npts = bez3(base, ctrl, skull, 12);
  parts.push({m: 12, col: skin, fold: 1, keys: npts.map((q, i) => ({p: q, a: 1.05 - 0.72 * (i / 12), b: 1.15 - 0.8 * (i / 12)}))});
  // head: short snout box with the nasal arch over the eyes (ref), mouth line, jaw open by `jaw`
  const side: L3 = nrm(cross(hd, [0, 1, 0])), hup = nrm(cross(side, hd));
  const at = (u: number, upk: number): L3 => add(add(skull, mul(hd, u)), mul(hup, upk));
  const jaw = o.jaw ?? 0;
  const hs = 1.12;   // head scale (reference: a small head, about 1 m long)
  parts.push({m: 14, col: (u, sd) => (sd > 0.55 ? LN2.back : sd < -0.4 ? LN2.belly : LN2.skin), cap: true, keys: spline([
    {p: at(-0.1 * hs, 0.0), a: 0.31 * hs, b: 0.34 * hs}, {p: at(0.12 * hs, 0.1 * hs), a: 0.32 * hs, b: 0.4 * hs}, {p: at(0.34 * hs, 0.15 * hs), a: 0.27 * hs, b: 0.38 * hs},
    {p: at(0.58 * hs, 0.02 * hs), a: 0.21 * hs, b: 0.25 * hs}, {p: at(0.82 * hs, -0.04 * hs), a: 0.18 * hs, b: 0.19 * hs}, {p: at(0.98 * hs, -0.06 * hs), a: 0.14 * hs, b: 0.14 * hs}], 3)});
  // lower jaw, a thin paler wedge that drops with `jaw`
  parts.push({m: 10, col: () => LN2.belly, keys: spline([{p: at(0.15 * hs, -0.2 * hs - 0.06 * jaw), a: 0.24 * hs, b: 0.08}, {p: at(0.6 * hs, -0.17 * hs - 0.16 * jaw), a: 0.17 * hs, b: 0.06}, {p: at(0.94 * hs, -0.13 * hs - 0.2 * jaw), a: 0.11 * hs, b: 0.04}], 2)});
  // eyes (both sides; the far one culls) with a pale catch-light, and nostrils high on the arch
  for (const g of [1, -1]) {
    const e = add(at(0.3 * hs, 0.12 * hs), mul(side, g * 0.27 * hs));
    parts.push({m: 8, col: () => LN2.eye, keys: [{p: add(e, mul(side, -g * 0.02)), a: 0.07, b: 0.06}, {p: add(e, mul(side, g * 0.03)), a: 0.06, b: 0.05}, {p: add(e, mul(side, g * 0.05)), a: 0.02, b: 0.02}]});
    parts.push({m: 6, col: () => '#e8e4d0', keys: [{p: add(add(e, mul(side, g * 0.055)), mul(hup, 0.02)), a: 0.018, b: 0.016}, {p: add(add(e, mul(side, g * 0.065)), mul(hup, 0.02)), a: 0.008, b: 0.008}]});
    const n0 = add(at(0.36 * hs, 0.32 * hs), mul(side, g * 0.12));
    parts.push({m: 6, col: () => '#2a2e30', keys: [{p: n0, a: 0.05, b: 0.03}, {p: add(n0, mul(hd, 0.08)), a: 0.03, b: 0.02}]});
  }
  // legs: front (long columns, shoulder 5.6 m) and hind (thick thighs); near side l > 0 is decided per camera by the painter's dim (both drawn, far one darker by l sign below)
  const step = (q: number): [number, number] => { if (!S) return [0, 0]; const t = ((q % 1) + 1) % 1; return t < 0.65 ? [S / 2 - S * (t / 0.65), 0] : [-S / 2 + S * ((t - 0.65) / 0.35), 0.5 * Math.sin(Math.PI * (t - 0.65) / 0.35)]; };
  const legs: [L3, number, number, number][] = [[[2.2, 6.4 + bob, 1.15], 0, 1, 0.0], [[2.2, 6.4 + bob, -1.15], 0.5, 1, 0.0], [[-2.6, 5.6 + bob, 1.2], 0.5, 0, 0.0], [[-2.6, 5.6 + bob, -1.2], 0, 0, 0.0]];
  legs.forEach(([top, q, front], i) => {
    const [ds, lift] = step(ph + q), foot: L3 = [top[0] + 0.3 + ds, lift, top[2] * 1.08];
    const knee: L3 = front ? [top[0] + 0.25 + ds * 0.5, 3.0 + lift * 0.6, top[2] * 1.05] : [top[0] + 0.8 + ds * 0.5, 2.8 + lift * 0.7, top[2] * 1.05];
    parts.push(...leg(top, knee, foot, front ? [1.05, 0.78, 0.68, 0.74] : [1.45, 0.92, 0.72, 0.78], skin, i % 2 ? 0.28 : 0, 3, '#4a4e4c', flats));
    feet.push(foot);
  });
  return {parts, flats, feet, shadow: {s: -1.5, l: 0, rs: 9, rl: 2.6}, anchors: {snout: H, eye: at(0.28, 0.2), mouth: at(0.85, -0.18), skull, top: [0, 14.5, 0], chest: [2.5, 6.3, 0], neckBase: base}};
};

// ------------------------------------------------------------------ triceratops (N16-15): 8.5 m, hip 2.8 m (user reference)
export const TRI = {skin: '#5d6c76', back: '#a0927a', rust: '#8a5a40', belly: '#7a8a90', frill: '#7f9298', frillEdge: '#dcd2b6', horn: '#ddd4bc', beak: '#2a2622'} as const;
export type TriPose = {walk?: number; stride?: number; head?: number /* 0 level .. 1 lowered to graze */; turn?: number /* head yaw toward +l (rad) */};
export const buildTriceratops = (o: TriPose = {}): Build => {
  const parts: Part[] = [], flats: Flat[] = [], feet: L3[] = [];
  const ph = o.walk ?? 0, S = o.stride ?? 0, bob = S ? -0.05 * Math.cos(ph * 4 * Math.PI) : 0, hl = o.head ?? 0, tu = o.turn ?? 0;
  const skin = (u: number, side: number) => (side > 0.55 ? (u > 0.3 && u < 0.8 ? TRI.back : TRI.skin) : side > 0.2 && u > 0.35 && u < 0.75 && Math.sin(u * 40) > 0.3 ? TRI.rust : side < -0.35 ? TRI.belly : TRI.skin);
  parts.push({m: 16, col: skin, fold: 3, keys: spline([
    {p: [-5.0, 1.25, 0], a: 0.04, b: 0.04}, {p: [-3.9, 1.7, 0], a: 0.28, b: 0.34}, {p: [-2.4, 2.3 + bob, 0], a: 0.75, b: 0.8}, {p: [-1.1, 2.6 + bob, 0], a: 1.05, b: 1.1},
    {p: [0.4, 2.45 + bob, 0], a: 1.15, b: 1.15}, {p: [1.6, 2.05 + bob, 0], a: 0.95, b: 0.98}, {p: [2.3, 1.8 + bob - 0.3 * hl, 0], a: 0.72, b: 0.72},
  ], 4)});
  // head frame: pivot at the neck, lowered by hl, turned by tu
  const piv: L3 = [2.3, 1.8 + bob - 0.3 * hl, 0], pitch = -0.15 - 0.55 * hl;
  const R = (q: L3): L3 => { const x = q[0], y = q[1]; const x1 = x * Math.cos(pitch) - y * Math.sin(pitch), y1 = x * Math.sin(pitch) + y * Math.cos(pitch); const z = q[2]; return add(piv, [x1 * Math.cos(tu) - z * Math.sin(tu), y1, x1 * Math.sin(tu) + z * Math.cos(tu)]); };
  parts.push({m: 12, col: (u) => (u > 0.82 ? TRI.beak : TRI.skin), cap: true, keys: spline([{p: R([0.1, 0.05, 0]), a: 0.62, b: 0.68}, {p: R([0.85, -0.1, 0]), a: 0.52, b: 0.6}, {p: R([1.5, -0.32, 0]), a: 0.36, b: 0.46}, {p: R([1.95, -0.6, 0]), a: 0.16, b: 0.27}, {p: R([2.12, -0.8, 0]), a: 0.05, b: 0.08}], 3)});
  // frill: a scalloped fan behind the skull, tilted back, both faces; pale scallop bumps on the rim
  const fc: L3 = [0.05, 0.55, 0], N = 14;
  for (let i = 0; i < N; i++) {
    const a0 = -1.45 + (2.9 * i) / N, a1 = -1.45 + (2.9 * (i + 1)) / N;
    const rim = (a: number, r: number): L3 => [fc[0] - 0.85 * r * Math.cos(a) - 0.1 * r, fc[1] + 0.85 * r * Math.cos(a), 1.05 * r * Math.sin(a)];
    flats.push({pts: [R(fc), R(rim(a0, 1.35)), R(rim(a1, 1.35))], col: i % 2 ? TRI.frill : mixColor(TRI.frill, '#5e7078', 0.3), two: true});
    flats.push({pts: [R(rim(a0, 1.33)), R(rim(a0, 1.42)), R(rim((a0 + a1) / 2, 1.52)), R(rim(a1, 1.42)), R(rim(a1, 1.33))], col: TRI.frillEdge, two: true, ink: '#5a5448'});
  }
  // horns: two long brow horns forward and up, a short nose horn
  const horn = (b: L3, d: L3, len: number, r: number) => parts.push({m: 7, col: (u) => (u > 0.7 ? mixColor(TRI.horn, '#5a5040', 0.4) : TRI.horn), keys: spline([{p: R(b), a: r, b: r}, {p: R(add(b, mul(nrm(d), len * 0.5))), a: r * 0.6, b: r * 0.6}, {p: R(add(add(b, mul(nrm(d), len)), [0, -0.05, 0])), a: 0.012, b: 0.012}], 3)});
  horn([0.75, 0.36, 0.28], [1, 0.5, 0.14], 1.2, 0.14); horn([0.75, 0.36, -0.28], [1, 0.5, -0.14], 1.2, 0.14); horn([1.6, -0.08, 0], [0.45, 1, 0], 0.36, 0.1);
  const eye = R([0.62, 0.12, 0.3]);
  parts.push({m: 6, col: () => '#16120e', keys: [{p: eye, a: 0.05, b: 0.045}, {p: add(eye, [0.02, 0, 0.02]), a: 0.04, b: 0.035}]});
  const step = (q: number): [number, number] => { if (!S) return [0, 0]; const t = ((q % 1) + 1) % 1; return t < 0.6 ? [S / 2 - S * (t / 0.6), 0] : [-S / 2 + S * ((t - 0.6) / 0.4), 0.35 * Math.sin(Math.PI * (t - 0.6) / 0.4)]; };
  ([[[1.3, 1.65 + bob, 0.78], 0, 1], [[1.3, 1.65 + bob, -0.78], 0.5, 1], [[-1.1, 2.15 + bob, 0.85], 0.5, 0], [[-1.1, 2.15 + bob, -0.85], 0, 0]] as [L3, number, number][]).forEach(([top, q, front], i) => {
    const [ds, lift] = step(ph + q), foot: L3 = [top[0] + 0.15 + ds, lift, top[2] * (front ? 1.18 : 1.05)];
    const knee: L3 = front ? [top[0] - 0.15 + ds * 0.4, 0.85 + lift * 0.6, top[2] * 1.22] : [top[0] + 0.45 + ds * 0.5, 1.05 + lift * 0.6, top[2] * 1.05];
    parts.push(...leg(top, knee, foot, front ? [0.42, 0.28, 0.24, 0.26] : [0.62, 0.36, 0.26, 0.28], (_u, s) => (s < -0.3 ? TRI.belly : TRI.skin), i % 2 ? 0.28 : 0, front ? 4 : 3, '#cfc6ae', flats));
    feet.push(foot);
  });
  return {parts, flats, feet, shadow: {s: 0, l: 0, rs: 3.6, rl: 1.4}, anchors: {snout: R([2.0, -0.72, 0]), eye, hornTip: R([1.75, 0.9, 0.38]), frillTop: R([-0.3, 1.7, 0]), top: [0, 3.2, 0]}};
};

// ------------------------------------------------------------------ ankylosaurus (N16-16): 6.5 m, hip 1.7 m, armoured, club tail (user reference)
export const ANK = {skin: '#7c8a40', back: '#8e9a4a', belly: '#bab27a', plate: '#4e5a2a', spike: '#d4c99c', club: '#5a6430'} as const;
export type AnkPose = {walk?: number; stride?: number; tail?: number /* club sway (m) */; head?: number};
export const buildAnkylosaur = (o: AnkPose = {}): Build => {
  const parts: Part[] = [], flats: Flat[] = [], feet: L3[] = [];
  const ph = o.walk ?? 0, S = o.stride ?? 0, bob = S ? -0.04 * Math.cos(ph * 4 * Math.PI) : 0, sw = o.tail ?? 0, hl = o.head ?? 0;
  const tz = (s: number) => (s < -2 ? sw * ((-2 - s) / 3) ** 2 : 0);
  const keys: Key[] = [
    {p: [-5.0, 0.62, tz(-5.0)], a: 0.06, b: 0.05}, {p: [-4.0, 0.8, tz(-4.0)], a: 0.1, b: 0.09}, {p: [-3.0, 1.0, tz(-3)], a: 0.17, b: 0.15}, {p: [-2.0, 1.25 + bob, 0], a: 0.38, b: 0.3},
    {p: [-1.0, 1.55 + bob, 0], a: 0.95, b: 0.62}, {p: [0.3, 1.62 + bob, 0], a: 1.15, b: 0.68}, {p: [1.4, 1.45 + bob, 0], a: 0.95, b: 0.58}, {p: [2.1, 1.15 + bob - 0.2 * hl, 0], a: 0.5, b: 0.4},
  ];
  parts.push({m: 16, col: band(ANK.skin, ANK.back, ANK.belly, 0.4), keys: spline(keys, 4)});
  // head: small, wide, triangular, with a bony brow
  const hb: L3 = [2.1, 1.15 + bob - 0.2 * hl, 0];
  parts.push({m: 10, col: () => ANK.skin, cap: true, keys: spline([{p: hb, a: 0.42, b: 0.34}, {p: add(hb, [0.45, -0.1 - 0.25 * hl, 0]), a: 0.36, b: 0.27}, {p: add(hb, [0.8, -0.24 - 0.4 * hl, 0]), a: 0.2, b: 0.17}], 3)});
  const eye = add(hb, [0.4, 0.04 - 0.25 * hl, 0.3]);
  parts.push({m: 6, col: () => '#14120c', keys: [{p: eye, a: 0.04, b: 0.035}, {p: add(eye, [0.015, 0, 0.015]), a: 0.03, b: 0.028}]});
  // tail club: two lobes
  const cl: L3 = [-5.0, 0.62, tz(-5.0)];
  parts.push({m: 10, col: () => ANK.club, keys: spline([{p: add(cl, [0.25, 0, 0]), a: 0.12, b: 0.1}, {p: cl, a: 0.38, b: 0.2}, {p: add(cl, [-0.35, 0, 0]), a: 0.3, b: 0.17}, {p: add(cl, [-0.55, 0, 0]), a: 0.05, b: 0.05}], 3)});
  // armour: rows of dark oval plates (raised bumps) over the back, a row of pale spikes along each flank, small spikes down the tail
  const back = spline(keys, 4);
  const at = (s: number) => back.reduce((b, k) => (Math.abs(k.p[0] - s) < Math.abs(b.p[0] - s) ? k : b));
  for (let s = -1.6; s <= 1.5; s += 0.42) {
    const k = at(s);
    for (const r of [-0.62, -0.22, 0.22, 0.62]) {
      const ang = r * 1.5, c0: L3 = [k.p[0], k.p[1] + k.b * Math.cos(ang) * 0.98, k.p[2] + k.a * Math.sin(ang) * 0.98];
      parts.push({m: 7, col: () => ANK.plate, keys: [{p: c0, a: 0.21, b: 0.08}, {p: add(c0, [0, 0.08, 0]), a: 0.15, b: 0.05}, {p: add(c0, [0, 0.11, 0]), a: 0.02, b: 0.02}]});
    }
    for (const g of [1, -1]) {
      const b0: L3 = [k.p[0], k.p[1] + k.b * 0.25, k.p[2] + g * k.a * 0.97], tip = add(b0, [-0.05, 0.12, g * 0.34]);
      parts.push({m: 6, col: (u) => (u > 0.5 ? ANK.spike : ANK.plate), dim: 0, keys: [{p: b0, a: 0.09, b: 0.09}, {p: lerp(b0, tip, 0.5), a: 0.05, b: 0.05}, {p: tip, a: 0.008, b: 0.008}]});
    }
  }
  for (let s = -4.4; s <= -2.2; s += 0.55) { const k = at(s); for (const g of [1, -1]) { const b0: L3 = [k.p[0], k.p[1], k.p[2] + g * k.a * 0.9], tip = add(b0, [-0.1, 0.03, g * 0.18]); parts.push({m: 5, col: () => ANK.spike, keys: [{p: b0, a: 0.05, b: 0.05}, {p: tip, a: 0.006, b: 0.006}]}); } }
  const step = (q: number): [number, number] => { if (!S) return [0, 0]; const t = ((q % 1) + 1) % 1; return t < 0.6 ? [S / 2 - S * (t / 0.6), 0] : [-S / 2 + S * ((t - 0.6) / 0.4), 0.25 * Math.sin(Math.PI * (t - 0.6) / 0.4)]; };
  ([[[1.2, 1.15 + bob, 0.72], 0, 1], [[1.2, 1.15 + bob, -0.72], 0.5, 1], [[-1.0, 1.35 + bob, 0.78], 0.5, 0], [[-1.0, 1.35 + bob, -0.78], 0, 0]] as [L3, number, number][]).forEach(([top, q, front], i) => {
    const [ds, lift] = step(ph + q), foot: L3 = [top[0] + 0.1 + ds, lift, top[2] * 1.1];
    const knee: L3 = front ? [top[0] - 0.08 + ds * 0.4, 0.55 + lift * 0.5, top[2] * 1.15] : [top[0] + 0.3 + ds * 0.5, 0.7 + lift * 0.5, top[2] * 1.05];
    parts.push(...leg(top, knee, foot, front ? [0.3, 0.22, 0.2, 0.22] : [0.42, 0.28, 0.22, 0.24], (_u, s) => (s < -0.3 ? ANK.belly : ANK.skin), i % 2 ? 0.28 : 0, 3, '#cfc39a', flats));
    feet.push(foot);
  });
  return {parts, flats, feet, shadow: {s: -0.5, l: 0, rs: 3.4, rl: 1.4}, anchors: {snout: add(hb, [0.8, -0.24 - 0.4 * hl, 0]), eye, club: cl, top: [0, 2.3, 0], ...Object.fromEntries(feet.map((f, i) => [`foot${i}`, f]))}};   // R1.4: foot anchors for the SH11 mud splash
};

// ------------------------------------------------------------------ giant dragonfly (N16-17): span 0.7 m, body 0.42 m (user reference; prehistoric giant dragonfly, era mix)
export const DF = {abd: '#7a2c22', abdDark: '#4a1a14', thorax: '#6e3426', stripe: '#e6d6b8', eye: '#7a1e18', wing: '#eef0ea', vein: '#5a2a22', stigma: '#3a1a14', leg: '#2a1e1a'} as const;
export const buildDragonfly = (o: {flap?: number} = {}): Build => {
  const parts: Part[] = [], flats: Flat[] = [];
  const fl = o.flap ?? 0;
  parts.push({m: 8, col: (u) => (Math.floor(u * 10) % 2 ? DF.abd : DF.abdDark), fold: 2, keys: spline([{p: [-0.42, 0.0, 0], a: 0.008, b: 0.008}, {p: [-0.3, 0.005, 0], a: 0.014, b: 0.016}, {p: [-0.15, 0.01, 0], a: 0.018, b: 0.02}, {p: [-0.04, 0.015, 0], a: 0.024, b: 0.027}], 3)});
  parts.push({m: 10, col: (u, s) => (s > 0.3 ? DF.thorax : u > 0.4 && u < 0.7 ? DF.stripe : DF.thorax), keys: spline([{p: [-0.05, 0.015, 0], a: 0.026, b: 0.03}, {p: [0.02, 0.025, 0], a: 0.04, b: 0.045}, {p: [0.07, 0.022, 0], a: 0.036, b: 0.04}], 3)});
  parts.push({m: 10, col: () => DF.eye, keys: spline([{p: [0.085, 0.025, 0], a: 0.045, b: 0.038}, {p: [0.11, 0.028, 0], a: 0.05, b: 0.04}, {p: [0.13, 0.022, 0], a: 0.035, b: 0.03}], 2)});
  for (const g of [1, -1]) for (const [k, dl] of [[0.03, 1], [0.0, -1]] as const) {
    const lt: L3 = [k + 0.03 * dl * 0, -0.01, g * 0.02], lf: L3 = [k + 0.06, -0.06, g * 0.04];
    parts.push({m: 4, col: () => DF.leg, dim: g < 0 ? 0.3 : 0, keys: [{p: lt, a: 0.004, b: 0.004}, {p: lf, a: 0.003, b: 0.003}, {p: add(lf, [0.04, -0.01, 0]), a: 0.002, b: 0.002}]});
  }
  // wings: fore and hind pair, long narrow, a slight dihedral and a flap angle; veins as a fan + cross lines, a dark pterostigma near the tip
  for (const g of [1, -1]) for (const [root, len, w, sw] of [[0.04, 0.34, 0.085, 0.12], [-0.01, 0.31, 0.1, -0.05]] as const) {
    const a = (0.15 + 0.5 * Math.sin(fl * 6.283 + (root > 0 ? 0 : 0.8))) * g;
    const tipP = (u: number, v: number): L3 => { const along = len * u, y = 0.03 + Math.sin(Math.abs(a)) * along, l = g * Math.cos(a) * along; return [root + sw * u * 0.5 - v * w * (1 - 0.6 * u * u), y, l]; };
    const outline: L3[] = [...Array.from({length: 9}, (_, i) => tipP(i / 8, 0)), ...Array.from({length: 9}, (_, i) => tipP(1 - i / 8, 1))];
    const veins: L3[][] = [0.25, 0.5, 0.75].map((v) => Array.from({length: 7}, (_, i) => tipP(i / 6, v)));
    for (let i = 1; i < 12; i++) veins.push([tipP(i / 12, 0), tipP(i / 12, 1)]);
    flats.push({pts: outline, col: DF.wing, two: true, op: 175, veins, ink: mixColor(DF.vein, DF.wing, 0.3)});
    flats.push({pts: [tipP(0.8, 0), tipP(0.88, 0), tipP(0.88, 0.22), tipP(0.8, 0.22)], col: DF.stigma, two: true});
  }
  return {parts, flats, feet: [], shadow: {s: 0, l: 0, rs: 0, rl: 0}, anchors: {head: [0.12, 0.03, 0], tail: [-0.42, 0, 0]}};
};

// ------------------------------------------------------------------ T. rex (R1.4, SH22 sky apparition only; N16-22 R2): 12 m, hip 3.6 m (user refs trex-front34 + trex-side, UT10)
// Drawn as a normal volume animal (UT16), not from cloud shapes; the shot paints it on its own layer at reduced opacity and lets a cloud bank hide the legs.
export const TRX = {skin: '#7a6c4c', back: '#54492f', belly: '#b9a783', mouth: '#b4646e', tongue: '#c97c84', tooth: '#efe6cc', eye: '#d9a832', claw: '#2a241c'} as const;
export type TRexPose = {jaw?: number /* 0 shut .. 1 roar */; walk?: number; stride?: number; neck?: number /* head raise 0..1 */};
export const buildTRex = (o: TRexPose = {}): Build => {
  const parts: Part[] = [], flats: Flat[] = [], feet: L3[] = [];
  const skin = band(TRX.skin, TRX.back, TRX.belly, 0.45), jaw = o.jaw ?? 0, nk = o.neck ?? 0;
  parts.push({m: 16, col: skin, fold: 3, keys: spline([
    {p: [-7.6, 3.6, 0], a: 0.04, b: 0.04}, {p: [-5.6, 3.45, 0], a: 0.26, b: 0.3}, {p: [-3.6, 3.6, 0], a: 0.55, b: 0.66}, {p: [-1.8, 3.8, 0], a: 0.88, b: 1.02},
    {p: [-0.1, 3.75, 0], a: 1.02, b: 1.25}, {p: [1.3, 3.85, 0], a: 0.88, b: 1.12}, {p: [2.1, 4.35 + 0.2 * nk, 0], a: 0.62, b: 0.74},
  ], 4)});
  // neck: a thick S up to the back of the skull
  const sk: L3 = [3.0, 5.25 + 0.5 * nk, 0];
  parts.push({m: 14, col: skin, fold: 2, keys: spline([{p: [2.1, 4.35 + 0.2 * nk, 0], a: 0.62, b: 0.74}, {p: [2.6, 4.95 + 0.35 * nk, 0], a: 0.62, b: 0.74}, {p: sk, a: 0.56, b: 0.7}], 3)});
  // skull (upper jaw): deep and boxy behind, narrowing to the snout; the head pitches up a little with the roar
  const hp = 0.12 + 0.3 * jaw * 0.5;
  const H = (u: number, v: number, w = 0): L3 => [sk[0] + u * Math.cos(hp) - v * Math.sin(hp), sk[1] + u * Math.sin(hp) + v * Math.cos(hp), w];
  parts.push({m: 14, col: (u, sd) => (sd > 0.5 ? TRX.back : sd < -0.45 ? TRX.belly : TRX.skin), cap: true, fold: 3, keys: spline([
    {p: H(-0.05, 0.0), a: 0.58, b: 0.74}, {p: H(0.45, 0.06), a: 0.55, b: 0.72}, {p: H(0.95, 0.0), a: 0.45, b: 0.58}, {p: H(1.4, -0.08), a: 0.35, b: 0.42}, {p: H(1.72, -0.14), a: 0.24, b: 0.27}], 3)});   // R1.4 v4: deeper, boxier skull (ref)
  // brow ridge over each eye, eye (yellow with a dark slit), nostril
  for (const g of [1, -1]) {
    const e = H(0.42, 0.28, g * 0.42);
    parts.push({m: 8, col: () => TRX.back, keys: [{p: H(0.25, 0.38, g * 0.38), a: 0.1, b: 0.07}, {p: H(0.45, 0.42, g * 0.4), a: 0.12, b: 0.08}, {p: H(0.62, 0.38, g * 0.36), a: 0.06, b: 0.05}]});
    parts.push({m: 8, col: () => TRX.eye, keys: [{p: add(e, [0, 0, -g * 0.02]), a: 0.07, b: 0.06}, {p: add(e, [0, 0, g * 0.03]), a: 0.06, b: 0.05}, {p: add(e, [0, 0, g * 0.05]), a: 0.02, b: 0.02}]});
    parts.push({m: 6, col: () => '#1a140c', keys: [{p: add(e, [0, 0, g * 0.06]), a: 0.015, b: 0.045}, {p: add(e, [0, 0, g * 0.07]), a: 0.006, b: 0.02}]});
    const n0 = H(1.65, 0.05, g * 0.12);
    parts.push({m: 6, col: () => '#2a2218', keys: [{p: n0, a: 0.04, b: 0.03}, {p: add(n0, [0.06, 0, 0]), a: 0.02, b: 0.015}]});
  }
  // lower jaw: hinged under the back of the skull, dropped by `jaw` (up to 0.7 rad)
  const ja = hp - 0.05 - 0.7 * jaw, hinge = H(0.15, -0.42);
  const J = (u: number, v: number, w = 0): L3 => [hinge[0] + u * Math.cos(ja) - v * Math.sin(ja), hinge[1] + u * Math.sin(ja) + v * Math.cos(ja), w];
  parts.push({m: 12, col: (u, sd) => (sd > 0.3 ? TRX.skin : TRX.belly), cap: true, keys: spline([{p: J(0, 0), a: 0.5, b: 0.34}, {p: J(0.6, -0.03), a: 0.42, b: 0.3}, {p: J(1.15, 0.0), a: 0.3, b: 0.2}, {p: J(1.55, 0.03), a: 0.16, b: 0.11}], 3)});
  // mouth: pink inside and tongue (two-sided facets between the jaws), teeth along both jaw edges
  if (jaw > 0.05) {
    for (const g of [1, -1]) flats.push({pts: [H(0.2, -0.36, g * 0.3), H(1.6, -0.26, g * 0.12), J(1.45, 0.1, g * 0.1), J(0.2, 0.18, g * 0.28)], col: TRX.mouth, two: true});
    flats.push({pts: [J(0.25, 0.2, 0.18), J(1.2, 0.14, 0.08), J(1.25, 0.14, -0.08), J(0.25, 0.2, -0.18)], col: TRX.tongue, two: true});
    for (const g of [1, -1]) for (let i = 0; i < 7; i++) {
      const u = 0.45 + i * 0.18, w = g * (0.3 - i * 0.025), up = H(u, -0.33 + i * 0.012, w), lo = J(u - 0.1, 0.16, w * 0.95);
      flats.push({pts: [add(up, [-0.04, 0, 0]), add(up, [0.04, 0, 0]), add(up, [0.0, -0.12, 0])], col: TRX.tooth, two: true});
      if (i < 6) flats.push({pts: [add(lo, [-0.035, 0, 0]), add(lo, [0.035, 0, 0]), add(lo, [0.0, 0.1, 0])], col: TRX.tooth, two: true});
    }
  }
  // short arms with two clawed fingers (ref)
  for (const g of [1, -1]) {
    const sh: L3 = [1.55, 3.45, g * 0.62], el: L3 = [1.85, 2.95, g * 0.78], hd: L3 = [2.2, 3.05, g * 0.74];
    parts.push({m: 8, col: skin, dim: g < 0 ? 0.28 : 0, keys: spline([{p: sh, a: 0.17, b: 0.17}, {p: el, a: 0.11, b: 0.11}, {p: hd, a: 0.08, b: 0.07}], 3)});
    for (const k of [0.04, -0.04]) parts.push({m: 5, col: () => TRX.claw, dim: g < 0 ? 0.28 : 0, keys: [{p: hd, a: 0.03, b: 0.03}, {p: add(hd, [0.12, -0.08, k]), a: 0.018, b: 0.018}, {p: add(hd, [0.15, -0.18, k]), a: 0.004, b: 0.004}]});
  }
  // legs (heavy thigh, shin, foot) – mostly hidden by the cloud bank in SH22
  ([[[-1.4, 3.4, 0.72], 1], [[-1.4, 3.4, -0.72], 0]] as [L3, number][]).forEach(([top, near]) => {
    const foot: L3 = [-0.9, 0, top[2] * 1.05], knee: L3 = [-0.5, 1.9, top[2] * 1.12];
    parts.push(...leg(top, knee, foot, [0.82, 0.48, 0.3, 0.3], skin, near ? 0 : 0.28, 3, TRX.claw, flats));
    feet.push(foot);
  });
  return {parts, flats, feet, shadow: {s: -1, l: 0, rs: 4.5, rl: 1.5}, anchors: {snout: H(1.8, -0.1), mouth: J(1.2, 0.1), eye: H(0.42, 0.28, 0.42), chest: [1.3, 3.85, 0], top: [0, 6.5, 0]}};
};
