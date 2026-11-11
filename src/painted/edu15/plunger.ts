// EDU-EP15 N8 plunger, world space (shot 5: the red cup thwops onto the ceiling plaster, grit lifts one side of its rim, it drops) and N11 dust specks.
// The plunger is a real object in room metres seen through the camera: a rim ring in the plane perpendicular to its axis (the axis points away from the plaster, toward
// the room), a dome (hull of rim and shoulder rings), a wooden handle. `lift` raises the far side of the rim off the plaster (metres) and lets a sliver of lamp light show.
import {capsule, ell, hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {hull} from '../kit/world';
import {THOUGHT} from './bubble';
import {C, CEIL} from './palette';

const nrm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sc = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];

export type PlungerOpts = {
  /** Rim centre when pressed (on the plaster). */ at: V3;
  /** Offset of the whole plunger from `at` (rising in, dropping away), metres. */ off?: V3;
  /** Axis tilt toward +z (the handle leaves toward the room and the screen bottom), default 0.4. */ tilt?: number;
  /** Rim lift on the far side in metres (the leak). */ lift?: number;
  /** Squash 0..1 right after the thwop (the cup flattens, rim widens). */ squash?: number;
  /** Cup radius (m), default 0.06 (0.12 m cup). */ R?: number;
};
export type PlungerMeasure = {rimWidthPx: number; gapPx: number};

/** Paint the plunger; returns the rim width and the lamp-light gap (px) under the lifted side. */
export const paintPlunger = (p: Painter, c: YCam, o: PlungerOpts): PlungerMeasure => {
  const R = (o.R ?? 0.06) * (1 + 0.07 * (o.squash ?? 0)), off = o.off ?? [0, 0, 0], tilt = o.tilt ?? 0.4, lift = o.lift ?? 0;
  const A = nrm([0, -1, tilt]); // from the plaster toward the handle end
  const E1: V3 = [1, 0, 0], E2: V3 = [0, 0, 1]; // the rim lies in the plaster plane; the dome and handle lean along A
  const B: V3 = add(o.at, off);
  const far = nrm(cross(E1, A)); void far;
  const ringAt = (center: V3, r: number, n = 22, liftK = 0): V3[] => Array.from({length: n}, (_, i): V3 => {
    const a = (i / n) * Math.PI * 2, dirv = add(sc(E1, Math.cos(a)), sc(E2, Math.sin(a)));
    // far side of the rim (toward -z = screen top) lifts along A
    const side = Math.max(0, -dirv[2] / (Math.hypot(...dirv) || 1)); // far side = -z (screen top)
    return add(add(center, sc(dirv, r)), sc([0, -1, 0], lift * liftK * side * side));
  });
  const PP = (w: V3) => camPoint(c, w, c.near ?? 0.02);
  const U = camUnit(c, B, c.near ?? 0.02);
  const dome = (1 - 0.18 * (o.squash ?? 0));
  const rim = ringAt(B, R, 22, 1), shoulder = ringAt(add(B, sc(A, 0.032 * dome)), R * 0.82, 22, 0.55), neck = ringAt(add(B, sc(A, 0.05 * dome)), R * 0.2, 12, 0.2);
  // lamp sliver between the plaster and the lifted rim (the gap that reads from +32)
  let gapPx = 0, stripPts: Pt[] = [];
  if (lift > 0.0002) {
    const onP = Array.from({length: 22}, (_, i): V3 => rim[i].map((v, k) => (k === 1 ? Math.min(v, CEIL) : v)) as V3);
    const rq = rim.map(PP), pq = onP.map((w) => PP([w[0], CEIL, w[2]]));
    const idx = rim.map((w, i) => i).filter((i) => rq[i] && pq[i]);
    const strip: Pt[] = [];
    idx.forEach((i) => strip.push(pq[i]!)); idx.slice().reverse().forEach((i) => strip.push(rq[i]!));
    stripPts = strip;
    gapPx = Math.max(0, ...idx.map((i) => Math.hypot(rq[i]![0] - pq[i]![0], rq[i]![1] - pq[i]![1])));
  }
  const q = (ws: V3[]) => ws.map(PP).filter((x): x is Pt => !!x);
  const hq = (a: V3[], b: V3[]) => { const h = q([...a, ...b]); return h.length > 2 ? hull(h) : []; };
  // dome: dark base, lit band toward the lamp (screen up-left), then the shoulder and neck
  const d0 = hq(rim, shoulder); if (d0.length) hardFill(p, 38220, THOUGHT.cupD, d0);
  const d1 = hq(ringAt(add(B, sc(A, 0.004)), R * 0.9, 22, 0.9), ringAt(add(B, sc(A, 0.03 * dome)), R * 0.6, 22, 0.5)); if (d1.length) hardFill(p, 38221, THOUGHT.cup, d1);
  const d2 = hq(shoulder, neck); if (d2.length) hardFill(p, 38222, mixColor(THOUGHT.cup, '#ffffff', 0.08), d2);
  const hl = hq(ringAt(add(B, sc(A, 0.022 * dome)), R * 0.45, 12, 0.3).map((w) => add(w, sc(E2, -R * 0.2))), ringAt(add(B, sc(A, 0.04 * dome)), R * 0.2, 8, 0.2).map((w) => add(w, sc(E2, -R * 0.15)))); if (hl.length) hardFill(p, 38223, mixColor(THOUGHT.cup, '#ffd9c8', 0.5), hl);
  const rq = q(rim); if (rq.length > 3) inkLine(p, 38224, rq, {weight: 2.4, color: THOUGHT.cupD, still: true, curve: 0.2});
  if (stripPts.length > 3) hardFill(p, 38210, '#fff3cf', stripPts);
  // handle: tapered wooden pole toward the room
  const hs = add(B, sc(A, 0.05 * dome));
  let tEnd = 1; for (let k = 20; k >= 0; k--) { if (PP(add(hs, sc(A, 0.26 * k / 20)))) { tEnd = k / 20; break; } }
  const he = add(hs, sc(A, 0.26 * tEnd));
  const qa = PP(hs), qb = PP(he), ua = camUnit(c, hs, c.near ?? 0.02), ub = camUnit(c, he, c.near ?? 0.02);
  if (qa && qb) {
    hardFill(p, 38230, THOUGHT.woodD, capsule(qa, qb, 0.011 * ua, 0.0095 * ub));
    hardFill(p, 38231, THOUGHT.wood, capsule(qa, qb, 0.008 * ua, 0.0068 * ub));
    inkLine(p, 38232, [qa, qb], {closed: false, weight: 1, color: THOUGHT.woodD, still: true});
  }
  const rimPts = rq.length ? rq : [[0, 0] as Pt];
  return {rimWidthPx: Math.round(Math.max(...rimPts.map((x) => x[0])) - Math.min(...rimPts.map((x) => x[0]))), gapPx: Math.round(gapPx * 10) / 10 + 0 * U};
};

/** Grit specks and plaster bumps round the rim (shot 5): small pale and dark discs on the plaster, a few right at the rim that prop it. */
export const paintGrit = (p: Painter, c: YCam, at: V3, R: number) => {
  for (let i = 0; i < 26; i++) {
    const a = hash(38300 + i) * Math.PI * 2, r = R * (0.75 + 0.9 * hash(38330 + i)), s = 0.0018 + 0.0042 * hash(38360 + i);
    const w: V3 = [at[0] + r * Math.cos(a), CEIL - 0.001, at[2] + r * Math.sin(a)], q = camPoint(c, w, c.near ?? 0.02);
    if (!q) continue;
    const u = camUnit(c, w, c.near ?? 0.02) * s;
    hardFill(p, 38400 + i, mixColor(C.dust, '#7a7266', 0.15 + 0.35 * hash(38390 + i)), ell(q[0], q[1], u * 1.3, u, 10, a));
    hardFill(p, 38440 + i, '#fffaf0', ell(q[0] - u * 0.45, q[1] - u * 0.4, u * 0.28, u * 0.2, 6));
  }
  void washAt;
};

// ---- N11 dust specks: seeded falls from lifted feet (reduced gravity, staged slow), pure of L.
export type Speck = {id: number; from: V3; t0: number; r: number; vx: number; vz: number};
export const specksFor = (feet: V3[], t0: number, seed: number): Speck[] =>
  feet.flatMap((w, fi) => Array.from({length: hash(seed + fi) < 0.5 ? 2 : 3}, (_, j): Speck => {
    const h = seed + fi * 10 + j;
    return {id: h, from: [w[0] + (hash(h + 1) - 0.5) * 0.018, CEIL - 0.002, w[2] + (hash(h + 2) - 0.5) * 0.018], t0, r: 0.0028 + 0.0034 * hash(h + 3), vx: (hash(h + 4) - 0.5) * 0.03, vz: (hash(h + 5) - 0.5) * 0.03};
  }));
/** Speck position at frame L (null before launch); `g` effective gravity (m/s^2). */
export const speckAt = (s: Speck, L: number, g = 2.2): V3 | null => {
  const dt = (L - s.t0) / 30;
  if (dt < 0) return null;
  return [s.from[0] + s.vx * dt, s.from[1] - 0.5 * g * dt * dt, s.from[2] + s.vz * dt];
};
export const paintSpeck = (p: Painter, c: YCam, s: Speck, L: number): Pt | null => {
  const w = speckAt(s, L);
  if (!w) return null;
  const q = camPoint(c, w, 0.06);
  if (!q) return null;
  const u = camUnit(c, w, 0.06) * s.r;
  if (u > 90) return null;
  const d = Math.min(1, Math.max(0, (CEIL - w[1]) / 0.5));
  hardFill(p, s.id + 7000, mixColor('#8d857a', '#b9b1a4', d), ell(q[0], q[1], u * 1.15, u, 9));
  hardFill(p, s.id + 7001, '#fff6e0', ell(q[0] - u * 0.3, q[1] - u * 0.3, Math.max(0.6, u * 0.32), Math.max(0.6, u * 0.28), 6));
  return q;
};
