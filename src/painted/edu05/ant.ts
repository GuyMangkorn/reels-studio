import {ell, inkLine, solid, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import type {Item} from './world';

// `new: ant` A1 + `new: leaf-fragment` L1 (brief EDU-BRIEF-R1.1 VD14, VD20 look check). Look-frame code (W3.1) in the episode folder:
// the user picks the look from the ant stills, then Boss hardens the insect body plan and `ant-walk` into the kit (`ANIMALS`,
// `animal-motions.ts`). A flat card at its ground point, profile view (`right` faces screen right), drawn in set metres (sm):
// body length 1.6, back height ~0.5, head 0.35, antennae ~0.9; leaf half-moon chord 2.2, top ~2.0 sm above the ground.
// Reddish-brown worker, three segments, six legs in a tripod gait, elbowed antennae, glossy highlight, simple dark eye; no face decal.
// Opaque base under the colour (DF-20261031-painted-opaque-cast).

export const ANT = {body: '#7a3a22', shade: '#5c2816', gloss: '#d98c62', leg: '#5a2a18', eye: '#1e0f0a', ink: '#2a140c'} as const;
export const LEAF = {fill: '#a6d63f', edge: '#ecf8a8', vein: '#5f8a2a', cut: '#7aa832', under: '#7fae2e', line: '#3d5a1c'} as const;

export type AntOpts = {
  view: 'right' | 'left';
  /** Tripod gait phase in cycles (undefined = standing, all six feet planted). */
  walk?: number;
  /** Head turned toward the lens, 0..1 (the L17 glance): the head draws front-on, antennae toward `lookSide`. */
  glance?: number;
  /** Screen side the glance antennae point to (-1 left, +1 right). */
  lookSide?: -1 | 1;
  /** Leaf sway about the mandible grip, degrees (<= 4, R04). */
  sway?: number;
  /** Carry the leaf (default true). */
  leaf?: boolean;
  /** Colour-mix toward a light / air colour (far, unlit CL02 crossing; shade). */
  tint?: {to: string; u: number};
  /** Skip ink lines (far layer, painted depth of field). */
  noInk?: boolean;
  t?: number;
};

const DEG = Math.PI / 180;

// ---- `new: ant-walk` (N6, W5.2): tripod gait whose clock follows the distance walked, so a planted foot is fixed on the ground.
/** Gait constants (sm): one cycle covers `cycle` of ground; each tripod is on the ground for `duty` of it (stance) and swings for the rest;
 * during stance a foot moves back along the body by `stride = duty * cycle` while the body moves forward by the same, so it does not slide. */
export const GAIT = {cycle: 0.55, duty: 0.6, lift: 0.09, sway: 2.5};
export const GAIT_STRIDE = GAIT.cycle * GAIT.duty;
/** Ant speeds (sm per frame) by shot (scene sheets: 0.043 in the shade look S01-B04-SH02, 0.07 in S01-B05-SH01). */
export const ANT_SPEED: Record<string, number> = {'S01-B04-SH02': 0.043, 'S01-B05-SH01': 0.07, 'S01-B05-SH02': 0.07};
/** Gait phase in cycles for a distance walked. */
export const walkPhase = (distance: number) => distance / GAIT.cycle;
/** Leaf sway (deg) about the mandible grip for a gait phase: twice per cycle (each tripod step), <= GAIT.sway + 1 (R04: leaf upright, <= 4). */
export const gaitSway = (walk: number) => GAIT.sway * Math.sin(2 * Math.PI * walk * 2) + 0.8 * Math.sin(2 * Math.PI * walk * 4 + 1);
/** A foot's offset in the ant frame at gait phase `walk` (cycles): `dx` along the body (+ = toward the head), `lift` above the ground
 * (sm), `planted` while in stance. `set` 0 = tripod A (near fore and hind, far mid), 1 = tripod B. */
export const antFoot = (walk: number, set: 0 | 1): {dx: number; lift: number; planted: boolean} => {
  const ph = (((walk + set * 0.5) % 1) + 1) % 1, d = GAIT.duty;
  if (ph < d) return {dx: GAIT_STRIDE * (0.5 - ph / d), lift: 0, planted: true};
  const k = (ph - d) / (1 - d), e = 0.5 - 0.5 * Math.cos(Math.PI * k);
  return {dx: GAIT_STRIDE * (-0.5 + e), lift: GAIT.lift * Math.sin(Math.PI * k), planted: false};
};
/** The ant's state at a distance walked (a pure function of distance, like the kit's `animalMotion`): gait phase and leaf sway. */
export const antWalk = (distance: number) => { const walk = walkPhase(distance); return {walk, sway: gaitSway(walk)}; };

/** A solid stroke (polyline as a filled band, width w0 -> w1 px): lines that must read at 270 px (antennae, veins). */
export const band = (p: Painter, seed: number, pts: Pt[], w0: number, w1: number, color: string) => {
  if (pts.length < 2) return;
  const L: Pt[] = [], R: Pt[] = [];
  pts.forEach((q, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1;
    const w = (w0 + (w1 - w0) * (i / (pts.length - 1))) / 2;
    L.push([q[0] - (dy / n) * w, q[1] + (dx / n) * w]); R.push([q[0] + (dy / n) * w, q[1] - (dx / n) * w]);
  });
  solid(p, seed, color, [...L, ...R.reverse()], 3);
};
const ellL = (cx: number, cy: number, rx: number, ry: number, a = 0, n = 18): Pt[] =>
  Array.from({length: n}, (_, i) => { const th = (i / n) * 2 * Math.PI, x = rx * Math.cos(th), y = ry * Math.sin(th); return [cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)]; });

/** Leaf L1 in the ant frame (sm): half-moon on a chord from the mandible grip back and up at 13 deg (the "leans back" sail). */
export const leafShape = (sway = 0) => {
  const G: Pt = [0.84, 0.36], tilt = 13 * DEG, len = 2.2, sag = 1.42;
  const al: Pt = [-Math.cos(tilt), Math.sin(tilt)], nm: Pt = [Math.sin(tilt), Math.cos(tilt)];
  const mid: Pt = [G[0] + al[0] * len / 2, G[1] + al[1] * len / 2];
  const sw = sway * DEG, rot = ([x, y]: Pt): Pt => { const dx = x - G[0], dy = y - G[1]; return [G[0] + dx * Math.cos(sw) - dy * Math.sin(sw), G[1] + dx * Math.sin(sw) + dy * Math.cos(sw)]; };
  const arc: Pt[] = [];
  for (let i = 0; i <= 20; i++) {
    const th = (i / 20) * Math.PI, bulge = 1 + 0.08 * Math.sin(th * 2); // a slightly irregular cut leaf, fuller at the back
    arc.push(rot([mid[0] - al[0] * (len / 2) * Math.cos(th) + nm[0] * sag * Math.sin(th) * bulge, mid[1] - al[1] * (len / 2) * Math.cos(th) + nm[1] * sag * Math.sin(th) * bulge]));
  }
  const top = arc.reduce((m, q) => (q[1] > m[1] ? q : m), arc[0]);
  return {G, arc, chordEnd: rot([G[0] + al[0] * len, G[1] + al[1] * len]), midrib: [rot(G), rot([mid[0] + nm[0] * sag * 0.95, mid[1] + nm[1] * sag * 0.95])] as Pt[], top, mid: rot(mid), nm};
};

/** Paints the ant at screen ground point `g` with `u` px per sm. Returns the head and leaf-top points (px). */
export const drawAnt = (p0: Painter, g: Pt, u: number, o: AntOpts) => {
  const dir = o.view === 'right' ? 1 : -1;
  const S = ([x, y]: Pt): Pt => [g[0] + dir * x * u, g[1] - y * u];
  const SP = (pts: Pt[]) => pts.map(S);
  const tint = (c: string) => (o.tint ? mixColor(c, o.tint.to, o.tint.u) : c);
  const p = p0, W = Math.max(0.6, u / 260);
  const ink = (id: number, pts: Pt[], w: number, closed = true, col: string = ANT.ink) => { if (!o.noInk) inkLine(p, id, pts, {weight: w * W, closed, color: tint(col), curve: 0.25}); };
  const t = o.t ?? 0;

  // ---- legs: coxa under the thorax, femur up and out to a knee above the belly line, tibia down to a planted foot.
  const coxa = [0.38, 0.22, 0.06], foot0 = [0.78, 0.18, -0.5], kneeOut = [0.08, 0.0, -0.1];
  const leg = (i: number, near: boolean) => {
    const set = ((i + (near ? 0 : 1)) % 2) as 0 | 1; // tripod: near L1, L3 with far R2; then the other three
    const gf = o.walk === undefined ? {dx: 0, lift: 0} : antFoot(o.walk, set), swing = gf.dx, lift = gf.lift;
    const off = near ? 0 : 0.06;
    const c: Pt = [coxa[i] + off * 0.5, 0.25 + (near ? 0 : 0.02)], f: Pt = [foot0[i] + swing + off, lift + (near ? 0 : 0.04)];
    const k: Pt = [(c[0] + f[0]) / 2 + kneeOut[i], 0.44 + lift * 0.6 + (i === 1 ? 0.02 : 0)];
    const tar: Pt = [f[0] + (i === 2 ? -0.07 : 0.07), f[1] + 0.005];
    const col = tint(near ? ANT.leg : mixColor(ANT.leg, '#2a1a12', 0.35));
    const wk = near ? 1 : 0.85;
    const segs: [Pt, Pt, number, number][] = [[c, k, 0.05 * wk, 0.04 * wk], [k, f, 0.035 * wk, 0.022 * wk], [f, tar, 0.02 * wk, 0.014 * wk]];
    segs.forEach(([a, b, w0, w1], s) => {
      const dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1, nx = -dy / n, ny = dx / n;
      const poly: Pt[] = [[a[0] + nx * w0, a[1] + ny * w0], [b[0] + nx * w1, b[1] + ny * w1], [b[0] - nx * w1, b[1] - ny * w1], [a[0] - nx * w0, a[1] - ny * w0]];
      solid(p, 8100 + i * 10 + s + (near ? 0 : 5), col, SP(poly), 3);
    });
    ink(8160 + i + (near ? 0 : 3), SP([c, k, f, tar]), 0.55, false);
  };
  const antenna = (near: boolean) => {
    const base: Pt = [0.74, 0.47], gl = o.glance ?? 0;
    const elbow: Pt = [0.86 + (near ? 0 : -0.05), 0.8 + (near ? 0 : 0.03)];
    const tip: Pt = [1.16 - gl * 0.1 + (near ? 0 : -0.06), 0.6 + (near ? 0 : 0.06) + Math.sin(t * 2.1 + (near ? 0 : 1.3)) * 0.02];
    const ac = tint(near ? ANT.leg : mixColor(ANT.leg, '#2a1a12', 0.35));
    band(p, 8170 + (near ? 0 : 1), SP([base, elbow]), 0.04 * u, 0.03 * u, ac);
    band(p, 8172 + (near ? 0 : 1), SP([elbow, [(elbow[0] + tip[0]) / 2, (elbow[1] + tip[1]) / 2 + 0.03], tip]), 0.03 * u, 0.026 * u, ac);
    solid(p, 8174 + (near ? 0 : 1), tint(ANT.leg), SP(ellL(tip[0], tip[1], 0.04, 0.025, -0.5, 10)), 2);
  };

  [0, 1, 2].forEach((i) => leg(i, false));
  if (!o.glance) antenna(false);

  // ---- leaf L1 (behind the near half of the head; in the ant's mid-plane).
  let leafTop: Pt | null = null;
  if (o.leaf !== false) {
    const L = leafShape(o.sway ?? 0);
    const poly = [L.G, ...L.arc.slice(1)];
    solid(p, 8200, tint(LEAF.under), SP(poly), 3);
    // backlit translucent edge band along the arc
    const inner = L.arc.map(([x, y]): Pt => [x + (L.mid[0] - x) * 0.12, y + (L.mid[1] - y) * 0.12]);
    solid(p, 8201, tint(LEAF.fill), SP([L.G, ...inner.slice(1)]), 3);
    washAt(p, 8202, tint(LEAF.edge), 150, SP([...L.arc, ...inner.slice().reverse()]), 0.05, 0.1);
    // midrib and side veins
    // v5 (final round): the darker lower band along the cut edge (wash 8218) is removed: at 270 px it read as a small dark bump on the chord
    const vc = tint(LEAF.vein);
    band(p, 8203, SP(L.midrib), 0.035 * u, 0.012 * u, vc);
    for (let v = 1; v <= 4; v++) {
      const s = v / 5, a = L.midrib[0], b = L.midrib[1], q: Pt = [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s];
      const ai = Math.round(5 + s * 3), bi = Math.round(15 - s * 3);
      const ta: Pt = [q[0] + (L.arc[ai][0] - q[0]) * 0.8, q[1] + (L.arc[ai][1] - q[1]) * 0.8], tb: Pt = [q[0] + (L.arc[bi][0] - q[0]) * 0.8, q[1] + (L.arc[bi][1] - q[1]) * 0.8];
      band(p, 8204 + v, SP([q, ta]), 0.018 * u, 0.006 * u, vc);
      band(p, 8210 + v, SP([q, tb]), 0.018 * u, 0.006 * u, vc);
    }
    if (!o.noInk) band(p, 8216, SP(L.arc), 0.022 * u, 0.022 * u, tint(LEAF.line));
    band(p, 8217, SP([L.G, L.chordEnd]), 0.03 * u, 0.03 * u, tint(LEAF.cut));
    leafTop = S(L.top);
  }

  // ---- body: gaster, petiole, thorax, head (opaque base, then colour, then a lower cel shade and the gloss).
  const gaster = ellL(-0.47, 0.34, 0.31, 0.21, -10 * DEG), petiole = ellL(-0.13, 0.31, 0.065, 0.075), node2 = ellL(-0.03, 0.29, 0.05, 0.05);
  const thorax: Pt[] = [[-0.07, 0.28], [0.02, 0.37], [0.13, 0.43], [0.27, 0.42], [0.38, 0.39], [0.48, 0.35], [0.46, 0.26], [0.3, 0.22], [0.08, 0.22], [-0.05, 0.23]];
  const head = ellL(0.66, 0.38, 0.17, 0.15, -12 * DEG, 20);
  const part = (seed: number, pts: Pt[], shadeCut: number) => {
    solid(p, seed, tint(ANT.shade), SP(pts), 5);
    const top = pts.filter(([, y]) => y >= shadeCut);
    const cy = pts.reduce((s, [, y]) => s + y, 0) / pts.length;
    solid(p, seed + 1, tint(ANT.body), SP(pts.map(([x, y]): Pt => [x, y > cy ? y : cy + (y - cy) * 0.35])), 3);
    ink(seed + 2, SP(pts), 0.8);
    return top;
  };
  part(8300, gaster, 0.34);
  part(8310, petiole, 0.31);
  part(8315, node2, 0.29);
  part(8320, thorax, 0.32);
  // gloss highlights (sun from the back: a soft streak on the gaster and thorax tops)
  washAt(p, 8330, tint(ANT.gloss), 190, SP(ellL(-0.5, 0.45, 0.14, 0.045, -14 * DEG, 12)), 0.05, 0.1);
  washAt(p, 8331, tint(ANT.gloss), 160, SP(ellL(0.2, 0.39, 0.1, 0.03, 4 * DEG, 10)), 0.05, 0.1);

  const gl = o.glance ?? 0;
  let headPt = S([0.66, 0.38]);
  if (gl < 0.5) {
    part(8340, head, 0.38);
    washAt(p, 8345, tint(ANT.gloss), 170, SP(ellL(0.62, 0.47, 0.07, 0.025, -12 * DEG, 10)), 0.05, 0.1);
    solid(p, 8346, tint(ANT.eye), SP(ellL(0.71, 0.42, 0.045, 0.035, 0, 12)), 3);
    washAt(p, 8347, '#f4e2d0', 200, SP(ellL(0.70, 0.435, 0.012, 0.01, 0, 8)), 0, 0);
    // mandibles gripping the leaf's cut edge
    const m1: Pt[] = [[0.78, 0.34], [0.9, 0.36], [0.93, 0.32], [0.86, 0.29], [0.79, 0.3]];
    solid(p, 8348, tint(ANT.shade), SP(m1), 3);
    ink(8349, SP(m1), 0.6);
  } else {
    // head turned to the lens: front-on head shape, two eyes on its sides, mandibles below, both antennae toward lookSide
    const side = o.lookSide ?? -1, hc: Pt = [0.68, 0.4];
    const hf: Pt[] = Array.from({length: 22}, (_, i) => { const th = (i / 22) * 2 * Math.PI; const r = 1 - 0.12 * Math.max(0, -Math.sin(th)); return [hc[0] + Math.cos(th) * 0.19 * r, hc[1] + Math.sin(th) * 0.16 * (Math.sin(th) < 0 ? 1.12 : 1)]; });
    solid(p, 8350, tint(ANT.shade), SP(hf), 5);
    solid(p, 8351, tint(ANT.body), SP(hf.map(([x, y]): Pt => [x, y > hc[1] ? y : hc[1] + (y - hc[1]) * 0.4])), 3);
    ink(8352, SP(hf), 0.8);
    washAt(p, 8353, tint(ANT.gloss), 170, SP(ellL(hc[0], hc[1] + 0.09, 0.07, 0.025, 0, 10)), 0.05, 0.1);
    [-1, 1].forEach((k) => solid(p, 8354 + (k + 1), tint(ANT.eye), SP(ellL(hc[0] + k * 0.15, hc[1] + 0.02, 0.04, 0.05, 0, 12)), 3));
    [-1, 1].forEach((k) => {
      const m: Pt[] = [[hc[0] + k * 0.05, hc[1] - 0.12], [hc[0] + k * 0.11, hc[1] - 0.16], [hc[0] + k * 0.03, hc[1] - 0.2]];
      solid(p, 8357 + (k + 1), tint(ANT.shade), SP(m), 2);
      ink(8360 + (k + 1), SP(m), 0.5);
    });
    // antennae: from the brow, up, elbow, then reaching toward the side TINY stands on (screen side, so not mirrored by dir)
    [-1, 1].forEach((k) => {
      const b = S([hc[0] + k * 0.06, hc[1] + 0.12]);
      const e: Pt = [b[0] + k * 0.12 * u + side * 0.05 * u, b[1] - 0.32 * u];
      const tp: Pt = [e[0] + side * 0.36 * u, e[1] + 0.1 * u + Math.sin(t * 2.1 + k) * 0.02 * u];
      band(p, 8363 + k, [b, e], 0.04 * u, 0.03 * u, tint(ANT.leg));
      band(p, 8366 + k, [e, tp], 0.03 * u, 0.026 * u, tint(ANT.leg));
      solid(p, 8369 + k, tint(ANT.leg), ell(tp[0], tp[1], 0.04 * u, 0.026 * u, 10), 2);
    });
    headPt = S(hc);
  }
  [0, 1, 2].forEach((i) => leg(i, true));
  if (gl < 0.5) antenna(true);
  return {head: headPt, leafTop};
};

/** The ant through the yaw camera: card at its ground point (set metres). */
export const paintAnt = (p: Painter, c: YCam, at: V3, o: AntOpts) => {
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return null;
  washAt(p, 8090, '#3b2a1c', o.tint ? 25 : 55, ell(g[0] - (o.view === 'right' ? 0.05 : -0.05) * u, g[1] - 0.01 * u, 0.85 * u, 0.06 * u, 18), 0.1, 0.2);
  return drawAnt(p, g, u, o);
};
export const antItem = (at: V3, o: AntOpts): Item => ({at, draw: (p, c) => { paintAnt(p, c, at, o); }});
