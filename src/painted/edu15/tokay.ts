import {capsule, ell, hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camSpace, camUnit, type YCam} from '../kit/ycam';
import {hull} from '../kit/world';
import {C, CEIL, DEG} from './palette';

// `new: tokay` (brief EDU-EP15-BRIEF-R1.1 VD04, N1; Film's look card, W3 look-asset rule). A real Gekko gecko: blue-grey back with rust-orange
// and pale blue-white spots, a broad head, big yellow eyes with a vertical slit, a banded tail, wide toe pads with pale transverse ridges.
// UNITS: metres in the room (true size, 0.29 m snout to tail tip). The card is a small 3D model, not a flat card: every point is a world point
// through the yaw camera, so the tokay foreshortens with the set (brief projection contract: "drawn in the ceiling plane"). The body is a tube
// of elliptic sections (filled as hulls of neighbouring sections), the legs are tapered capsules, the toes are 3D chains that can roll.
// LOCAL FRAME (u, v, n): u along the body toward the snout (vent at u 0, snout 0.15, tail tip -0.14), v toward the tokay's left, n out of the
// back (dorsal). World = o + u U + v V + n N. On the ceiling (`ceilingFrame`) N points down into the room, the feet press on n 0 (the plaster)
// and the body axis hangs at n 0.036 (back surface at y 2.65, brief). `hangFrame` stands the body head-up for the imagined hang (rig H).
// Truth limits (brief): pads always flat and dry (no blob, shine or dome); the peel rolls each toe up and back from the tip; no tail use.

export type Frame = {o: V3; U: V3; V: V3; N: V3};
export type FootId = 'fl' | 'fr' | 'hl' | 'hr';
/** A leg: hip, knee/elbow and palm in the local frame; the pad plane by its normal `pn` (local, pointing away from the surface) and toe direction `dir`. */
export type Leg = {hip: V3; knee: V3; palm: V3; pn: V3; dir: V3; /** Toe fan in degrees between neighbouring toes (default 28). */ fan?: number};
export type TokayPose = {
  legs: Record<FootId, Leg>;
  /** Toe roll 0..1 per foot (the peel: tips first, up and back). */
  roll?: Partial<Record<FootId, number>>;
  /** K02: distal toe tips lifted at rest, 0..1 per foot. */
  tips?: Partial<Record<FootId, number>>;
  /** Head pitch in degrees about the neck, positive toward the back (raising the head off the ceiling toward the room). */
  headPitch?: number;
  /** Head yaw in degrees toward the tokay's left. */
  headYaw?: number;
  /** Jaw open 0..1 (the call, the catch). */
  jaw?: number;
  /** Tail tip offset (local v, n) in metres; the curve eases in from the vent. */
  tail?: [number, number];
  /** Paint the legs over the body (the imagined hang) instead of the depth rule. */
  legsOver?: boolean;
  /** Prey held across the jaws (W-MOTH `catch`): wing span in metres. */
  moth?: number;
  /** Flank breath: body lateral scale 0 = 1.00, 0.05 = 1.05 (shot 20 hold). */
  flank?: number;
  /** Tail tip sway in degrees about the last 0.03 m (shot 20 hold). */
  tailTip?: number;
  /** Moth wing fold in degrees (0 = spread flat; the flutter of shot 19). */
  mothFold?: number;
  /** Eyes closed 0..1 (the slow blink). */
  blink?: number;
};
export type TokayMeasure = {box: [number, number, number, number]; feet: Record<FootId, Pt | null>; head: Pt | null; eye: Pt | null; lengthPx: number; footPx: Record<FootId, number>; pxPerM: number};

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sc = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const sub2 = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
/** Rotate `a` about unit axis `k` by `ang` (Rodrigues). */
const rotAbout = (a: V3, k: V3, ang: number): V3 => {
  const c = Math.cos(ang), s = Math.sin(ang);
  return add(add(sc(a, c), sc(cross(k, a), s)), sc(k, dot(k, a) * (1 - c)));
};

/** Ceiling frame at plaster point `at` (y = CEIL) with the snout heading `deg` in the ceiling plane (0 = +x, 90 = +z); vent at `at`. */
export const ceilingFrame = (at: V3, deg: number): Frame => {
  const U: V3 = [Math.cos(deg * DEG), 0, Math.sin(deg * DEG)], N: V3 = [0, -1, 0];
  return {o: [at[0], CEIL, at[2]], U, V: cross(N, U), N};
};
/** Imagined hang (rig H): head up (+y), back toward -z (belly to the camera side), vent at `vent`; the body axis lies at z `vent[2]`. */
export const hangFrame = (vent: V3): Frame => {
  const U: V3 = [0, 1, 0], N: V3 = [0, 0, -1];
  return {o: [vent[0], vent[1], vent[2] + BODY_C], U, V: cross(N, U), N};
};

/** Body axis height above the feet plane (n). */
export const BODY_C = 0.036;
// sections: u, half-width (v), half-thickness (n)
const SECT: [number, number, number][] = [
  [0.150, 0.004, 0.0035], [0.146, 0.0095, 0.006], [0.138, 0.0145, 0.009], [0.126, 0.0175, 0.0115], [0.113, 0.0165, 0.0115], [0.102, 0.0135, 0.0105],
  [0.090, 0.016, 0.0115], [0.072, 0.0205, 0.0135], [0.050, 0.0225, 0.014], [0.028, 0.021, 0.0132], [0.010, 0.0165, 0.0112], [0.0, 0.0135, 0.0102],
  [-0.012, 0.0112, 0.009], [-0.032, 0.0095, 0.0078], [-0.058, 0.0076, 0.0063], [-0.085, 0.0058, 0.0048], [-0.11, 0.004, 0.0034], [-0.13, 0.0024, 0.002], [-0.14, 0.0008, 0.0008],
];
const NECK_U = 0.1;

/** Rest on the ceiling (sprawled, toes splayed, palms flat). */
export const restLegs = (): Record<FootId, Leg> => {
  const front = (s: 1 | -1): Leg => ({hip: [0.086, 0.015 * s, 0.03], knee: [0.077, 0.046 * s, 0.031], palm: [0.1, 0.06 * s, 0.002], pn: [0, 0, 1], dir: nrm([0.8, 0.6 * s, 0])});
  const hind = (s: 1 | -1): Leg => ({hip: [0.008, 0.015 * s, 0.03], knee: [0.03, 0.05 * s, 0.032], palm: [-0.008, 0.064 * s, 0.002], pn: [0, 0, 1], dir: nrm([-0.75, 0.66 * s, 0])});
  return {fl: front(1), fr: front(-1), hl: hind(1), hr: hind(-1)};
};
/** Imagined hang (rig H, hangFrame with the vent at y 2.53): front feet flat on the ceiling at local u 0.17 (y 2.70), v +-0.03, toes splayed toward
 * the camera; hind feet clasp the wrists at u -0.05 (y 2.48), pads on the camera side of the wrist, toes wrapping round it. */
export const hangLegs = (): Record<FootId, Leg> => {
  const front = (s: 1 | -1): Leg => ({hip: [0.088, 0.016 * s, BODY_C], knee: [0.13, 0.03 * s, BODY_C - 0.004], palm: [0.17, 0.03 * s, BODY_C], pn: [-1, 0, 0], dir: nrm([0, 0.45 * s, -0.9]), fan: 30});
  const hind = (s: 1 | -1): Leg => ({hip: [0.006, 0.016 * s, BODY_C], knee: [-0.012, 0.036 * s, BODY_C - 0.012], palm: [-0.05, 0.016 * s, 0.006], pn: [0, 0, -1], dir: nrm([0.15, -0.99 * s, 0]), fan: 22});
  return {fl: front(1), fr: front(-1), hl: hind(1), hr: hind(-1)};
};

const TOE_LEN = [0.0072, 0.0098, 0.0108, 0.0102, 0.0092];
const TOE_W = [0.0016, 0.0027, 0.0035, 0.0034, 0.0021];
const BEND = [10, 35, 50, 55];
const TIP_BEND = [0, 0, 14, 24];

type Toe = {pts: V3[]; nrm: V3[]};
/** One toe chain (5 points) from the palm: segments bend toward the pad normal by the roll (tips first). */
export const toeChain = (palm: V3, dir: V3, pn: V3, len: number, roll: number, tip: number): Toe => {
  const pts: V3[] = [palm], nrms: V3[] = [], side = nrm(cross(pn, dir));
  let phi = 0, at = palm;
  for (let j = 0; j < 4; j++) {
    phi += (roll * BEND[j] + tip * TIP_BEND[j]) * DEG;
    const d = rotAbout(dir, side, -phi), nn = rotAbout(pn, side, -phi);
    at = add(at, sc(d, len / 4));
    pts.push(at);
    nrms.push(nn);
  }
  return {pts, nrm: nrms};
};

/**
 * Paint the tokay. `f` places the local frame; `pose` the legs, head, roll; `t` seconds (breath). `tint` mixes the colours toward a grade.
 * Returns screen measures (box, feet, head, eye, length px, px per metre at the vent).
 */
export const paintTokay = (p: Painter, c: YCam, f: Frame, pose: TokayPose, o: {seed?: number; t?: number; lampDir?: V3; ink?: boolean; /** 'tail' paints only the tail (behind a held figure), 'body' everything else. */ part?: 'tail' | 'body'} = {}): TokayMeasure => {
  const seed = o.seed ?? 61000;
  const hp = (pose.headPitch ?? 0) * DEG, hy = (pose.headYaw ?? 0) * DEG, [tv, tn] = pose.tail ?? [0, 0];
  // local -> local (head pitch/yaw about the neck, tail curve)
  const bendL = ([u, v, n]: V3): V3 => {
    if (u < 0) { const k = (-u / 0.14) ** 2; return [u, v + tv * k + (pose.tailTip && u < -0.11 ? (-u - 0.11) * Math.tan(pose.tailTip * DEG) : 0), n + tn * k]; }
    const k = Math.min(1, Math.max(0, (u - (NECK_U - 0.008)) / 0.016));
    if (k <= 0) return [u, v, n];
    const a = hp * k, b = hy * k, du = u - NECK_U, dn = n - BODY_C;
    const u1 = du * Math.cos(a) - dn * Math.sin(a), n1 = du * Math.sin(a) + dn * Math.cos(a);
    const u2 = u1 * Math.cos(b) - v * Math.sin(b), v2 = u1 * Math.sin(b) + v * Math.cos(b);
    return [NECK_U + u2, v2, BODY_C + n1];
  };
  const W = (l: V3): V3 => add(f.o, add(sc(f.U, l[0]), add(sc(f.V, l[1]), sc(f.N, l[2]))));
  const wl = (l: V3) => W(bendL(l));
  const dirW = (l: V3): V3 => nrm(add(sc(f.U, l[0]), add(sc(f.V, l[1]), sc(f.N, l[2]))));
  const P = (w: V3) => camPoint(c, w, c.near ?? 0.005);
  const toCam = (w: V3): V3 => nrm([c.x - w[0], c.y - w[1], c.z - w[2]]);
  const vent = W([0, 0, BODY_C]), unitV = camUnit(c, vent, c.near ?? 0.005);
  const all: Pt[] = [];
  const keep = (q: Pt | null) => { if (q) all.push(q); return q; };
  const lampDir = o.lampDir ?? nrm(sub([0, 2.665, 0], vent));

  // section rings in world space (with the head bend)
  const ring = (i: number, k = 1, dv = 0, dn = 0, n = 14): V3[] => {
    const [u, w, t] = SECT[i];
    return Array.from({length: n}, (_, j) => { const a = (j / n) * Math.PI * 2; return wl([u, dv + w * k * (1 + (pose.flank ?? 0)) * Math.sin(a), BODY_C + dn + t * k * Math.cos(a)]); });
  };
  const tube = (seedId: number, color: string, from: number, to: number, k = 1, dv = 0, dn = 0) => {
    for (let i = from; i < to; i++) {
      const q = [...ring(i, k, dv, dn), ...ring(i + 1, k, dv, dn)].map(P).filter((x): x is Pt => !!x);
      if (q.length >= 3) hardFill(p, seedId + i, color, hull(q));
      q.forEach((x) => all.push(x));
    }
  };

  // ---- legs (far ones before the body, near ones after; `legsOver` paints all after)
  const ids: FootId[] = ['fl', 'fr', 'hl', 'hr'];
  const depthOf = (w: V3) => camSpace(c, w).d;
  const bodyD = depthOf(W([0.05, 0, BODY_C]));
  const feetPx: Record<FootId, Pt | null> = {fl: null, fr: null, hl: null, hr: null}, footPx: Record<FootId, number> = {fl: 0, fr: 0, hl: 0, hr: 0};
  const paintLeg = (id: FootId, k: number) => {
    const L = pose.legs[id], hip = W(L.hip), knee = W(L.knee), palm = W(L.palm);
    const qh = P(hip), qk = P(knee), qp = P(palm);
    const uh = camUnit(c, hip, c.near ?? 0.005), uk = camUnit(c, knee, c.near ?? 0.005), up = camUnit(c, palm, c.near ?? 0.005);
    const skin = mixColor(C.tkBack, '#ffffff', 0.04), skinD = C.tkShade;
    if (qh && qk) hardFill(p, seed + 300 + k * 10, skinD, capsule(qh, qk, 0.0105 * uh, 0.0085 * uk));
    if (qk && qp) hardFill(p, seed + 301 + k * 10, skin, capsule(qk, qp, 0.0085 * uk, 0.0062 * up));
    if (qh && qk) { const a = qh, b = qk; hardFill(p, seed + 302 + k * 10, skin, capsule(a, b, 0.0088 * uh, 0.0068 * uk)); }
    keep(qh); keep(qk); keep(qp); feetPx[id] = qp;
    // toes
    const pn = dirW(L.pn), d0 = dirW(L.dir), fan = (L.fan ?? 28) * DEG, roll = pose.roll?.[id] ?? 0, tip = pose.tips?.[id] ?? 0;
    const sign = id === 'fl' || id === 'hl' ? 1 : -1;
    const toes: Toe[] = TOE_LEN.map((len, i) => toeChain(palm, rotAbout(d0, pn, (i - 2) * fan * sign), pn, len, roll, tip));
    // palm pad
    const palmRing = Array.from({length: 10}, (_, j): V3 => { const a = (j / 10) * Math.PI * 2, s = nrm(cross(pn, d0)); return add(palm, add(sc(s, 0.0055 * Math.cos(a)), sc(d0, 0.004 * Math.sin(a)))); }).map(P).filter((x): x is Pt => !!x);
    if (palmRing.length > 2) hardFill(p, seed + 303 + k * 10, skin, hull(palmRing));
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    toes.forEach((toe, i) => {
      const side = nrm(cross(pn, d0));
      for (let j = 0; j < 4; j++) {
        const a = toe.pts[j], b = toe.pts[j + 1], nn = toe.nrm[j], s2 = nrm(cross(nn, sub(b, a))), w0 = TOE_W[i] * (0.55 + 0.45 * Math.min(1, j / 1.5)), w1 = TOE_W[i] * (j === 3 ? 0.62 : 1);
        const th = 0.0007;
        const corners: V3[] = [];
        for (const [pt, w] of [[a, w0], [b, w1]] as [V3, number][]) for (const sv of [-1, 1]) for (const sn of [0, 1]) corners.push(add(pt, add(sc(s2, (sv * w) / 2), sc(nn, sn * th))));
        const q = corners.map(P).filter((x): x is Pt => !!x);
        if (q.length < 3) continue;
        const h = hull(q);
        // the pad faces away from the pad normal: when it faces the camera it shows pale with ridge lines
        const padSeen = dot(nn, toCam(a)) < -0.05;
        hardFill(p, seed + 400 + k * 60 + i * 6 + j, padSeen ? C.tkPad : mixColor(skin, '#ffffff', 0.06 + 0.04 * j), h);
        if (padSeen && j >= 1) {
          const n = j === 3 ? 3 : 4;
          for (let r = 0; r < n; r++) {
            const m = add(a, sc(sub(b, a), (r + 0.5) / n)), e0 = P(add(m, sc(s2, -w1 * 0.45))), e1 = P(add(m, sc(s2, w1 * 0.45)));
            if (e0 && e1) inkLine(p, seed + 500 + k * 80 + i * 8 + j * 2 + r, [e0, e1], {closed: false, weight: 0.5, color: C.tkRidge, still: true});
          }
        }
        h.forEach((x) => { all.push(x); minX = Math.min(minX, x[0]); maxX = Math.max(maxX, x[0]); minY = Math.min(minY, x[1]); maxY = Math.max(maxY, x[1]); });
      }
      void side;
    });
    // toe outlines (one thin line per toe along its spine edge)
    if (o.ink !== false) toes.forEach((toe, i) => {
      const q = toe.pts.map(P).filter((x): x is Pt => !!x);
      if (q.length > 1) inkLine(p, seed + 600 + k * 10 + i, q, {closed: false, weight: 0.45, color: mixColor(C.tkShade, C.tkInk, 0.4), still: true});
    });
    footPx[id] = Number.isFinite(maxX - minX) ? Math.round(Math.max(maxX - minX, maxY - minY)) : 0; // toe-fan screen size (larger span)
  };
  const before = ids.filter((id) => !pose.legsOver && depthOf(W(pose.legs[id].knee)) > bodyD - 0.002);
  const after = ids.filter((id) => !before.includes(id));
  const part = o.part, TAIL_I = 11, from = part === 'tail' ? TAIL_I : 0, to = part === 'body' ? TAIL_I + 1 : SECT.length - 1;
  if (part !== 'tail') before.forEach((id) => paintLeg(id, ids.indexOf(id)));

  // ---- body: back colour tube, lit band toward the lamp, belly patch when the belly faces the camera, tail bands
  tube(seed, C.tkShade, from, to);
  const lv = dot(lampDir, f.V), ln = dot(lampDir, f.N);
  const ll = Math.hypot(lv, ln) || 1;
  tube(seed + 40, C.tkBack, from, to, 0.82, (0.22 * lv) / ll * 0.02, (0.22 * ln) / ll * 0.012);
  if (part !== 'tail') tube(seed + 80, mixColor(C.tkBack, '#fff1d8', 0.22), 1, 12, 0.5, (0.6 * lv) / ll * 0.02, (0.6 * ln) / ll * 0.012);
  const bellyN = sc(f.N, -1), bellySeen = dot(bellyN, toCam(vent));
  if (bellySeen > 0.05 && part !== 'tail') tube(seed + 120, mixColor(C.tkBelly, C.tkBack, 0.3 + Math.max(0, 0.5 - bellySeen)), 1, 13, 0.52, 0, -0.006); // W3: narrower, greyer belly so the spotted flanks frame it (belly-on hang)
  // tail bands (pale rings across the back half)
  if (part !== 'body') for (let i = 12; i < SECT.length - 2; i++) {
    const [u0] = SECT[i], [u1] = SECT[i + 1];
    for (let b = 0; b < 2; b++) {
      const ua = u0 + (u1 - u0) * (0.2 + b * 0.5), ub = ua + (u1 - u0) * 0.22;
      const band = (u: number): V3[] => { const w = Math.max(0.0012, 0.0115 * (1 + u / 0.15)), t = w * 0.82; return Array.from({length: 12}, (_, j): V3 => { const a = (j / 12) * Math.PI * 2; return wl([u, w * 0.98 * Math.sin(a), BODY_C + t * 0.98 * Math.cos(a)]); }); };
      const q = [...band(ua), ...band(ub)].filter((w) => dot(sub(w, wl([ua, 0, BODY_C])), toCam(w)) > -0.002).map(P).filter((x): x is Pt => !!x);
      if (q.length > 2) hardFill(p, seed + 160 + i * 2 + b, C.tkBand, hull(q));
    }
  }

  const emptyMeasure = (): TokayMeasure => ({box: [0, 0, 0, 0], feet: feetPx, footPx, head: null, eye: null, lengthPx: 0, pxPerM: Math.round(unitV)});
  // ---- spots on the visible surface (orange in transverse rows, pale between); granular skin as a few dark flecks
  const surf = (u: number, a: number, k = 1): {w: V3; n: V3} | null => {
    const i = SECT.findIndex((s) => s[0] <= u);
    if (i <= 0) return null;
    const [ua, wa, ta] = SECT[i - 1], [ub, wb, tb] = SECT[i], m = (u - ub) / (ua - ub || 1), w = wb + (wa - wb) * m, t = tb + (ta - tb) * m;
    const l: V3 = [u, w * k * Math.sin(a), BODY_C + t * k * Math.cos(a)], l2: V3 = [u + 0.002, w * k * Math.sin(a), BODY_C + t * k * Math.cos(a)];
    const ww = wl(l), nl: V3 = [0, Math.sin(a) / w, Math.cos(a) / t];
    // normal through the bend: transform a point a hair along the local normal
    const ln = nrm(nl), off = wl([l[0] + ln[0] * 0.001, l[1] + ln[1] * 0.001, l[2] + ln[2] * 0.001]);
    void l2;
    return {w: ww, n: nrm(sub(off, ww))};
  };
  const spot = (id: number, u: number, a: number, r: number, color: string) => {
    const s = surf(u, a, 0.97);
    if (!s) return;
    const vis = dot(s.n, toCam(s.w));
    if (vis < 0.08) return;
    const q = P(s.w);
    if (!q) return;
    const px = r * camUnit(c, s.w, c.near ?? 0.005);
    if (px < 0.6) return;
    const sq = Math.max(0.35, Math.min(1, vis * 1.2));
    hardFill(p, seed + 700 + id, color, ell(q[0], q[1], px, px * sq, 10, hash(seed + id) * 3));
  };
  let sid = 0;
  if (part === 'tail') { for (let k = 0; k < 10; k++) spot(200 + k, -0.006 - k * 0.0095, (hash(seed + 380 + k) - 0.5) * 1.6, 0.0016, k % 2 ? C.tkOrange : C.tkPale); return emptyMeasure(); }
  for (let row = 0; row < 11; row++) {
    const u = 0.093 - row * 0.0095;
    for (let k = 0; k < 7; k++) {
      const a = (k - 3) * 0.42 + (hash(seed + row * 13 + k) - 0.5) * 0.25 + (row % 2) * 0.2;
      const big = hash(seed + 90 + row * 7 + k);
      spot(sid++, u + (hash(seed + 200 + sid) - 0.5) * 0.004, a, 0.0021 + 0.0012 * big, big > 0.35 ? (big > 0.8 ? C.tkOrangeD : C.tkOrange) : C.tkPale);
    }
  }
  for (let k = 0; k < 16; k++) { // head spots, small
    const u = 0.104 + hash(seed + 300 + k) * 0.034, a = (hash(seed + 320 + k) - 0.5) * 2.4;
    spot(sid++, u, a, 0.0012 + 0.0008 * hash(seed + 340 + k), hash(seed + 360 + k) > 0.45 ? C.tkOrange : C.tkPale);
  }
  if (part !== 'body') for (let k = 0; k < 10; k++) spot(sid++, -0.006 - k * 0.0095, (hash(seed + 380 + k) - 0.5) * 1.6, 0.0016, k % 2 ? C.tkOrange : C.tkPale); // tail base spots
  // granular flecks
  for (let k = 0; k < 40; k++) spot(sid++, 0.0 + hash(seed + 400 + k) * 0.1, (hash(seed + 440 + k) - 0.5) * 2.6, 0.0006, mixColor(C.tkShade, C.tkInk, 0.3));

  // ---- head: eyes (big, yellow, vertical slit), mouth line, nostrils
  let eyePx: Pt | null = null;
  for (const s of [1, -1] as const) {
    const ec = wl([0.129, 0.0128 * s, BODY_C + 0.0062]), en = nrm(sub(wl([0.129, 0.0128 * s + 0.008 * s, BODY_C + 0.0062 + 0.006]), ec));
    const vis = dot(en, toCam(ec));
    const q = P(ec);
    if (!q || vis < -0.62) continue; // W3: the bulging eyes stay visible at the silhouette from the belly side
    const r = 0.0052 * camUnit(c, ec, c.near ?? 0.005), sq = Math.max(0.3, Math.min(1, 0.35 + vis));
    // eye axis on screen: the head's u direction
    const qa = P(wl([0.14, 0.0128 * s, BODY_C + 0.0062])), ang = qa ? Math.atan2(qa[1] - q[1], qa[0] - q[0]) : 0;
    hardFill(p, seed + 800 + (s > 0 ? 0 : 10), mixColor(C.tkShade, C.tkInk, 0.3), ell(q[0], q[1], r * 1.18, r * 1.18 * sq, 16, ang));
    const blink = pose.blink ?? 0;
    if (blink < 0.95) {
      hardFill(p, seed + 801 + (s > 0 ? 0 : 10), C.tkEye, ell(q[0], q[1], r, r * sq * (1 - blink), 16, ang));
      // slit pupil runs across the head axis (vertical when the head is level)
      hardFill(p, seed + 802 + (s > 0 ? 0 : 10), C.tkPupil, ell(q[0], q[1], r * 0.16, r * 0.86 * sq * (1 - blink), 10, ang));
      if (r > 3) hardFill(p, seed + 803 + (s > 0 ? 0 : 10), '#fffbe8', ell(q[0] - r * 0.35, q[1] - r * 0.35 * sq, r * 0.16, r * 0.16, 8));
    } else hardFill(p, seed + 804 + (s > 0 ? 0 : 10), C.tkBack, ell(q[0], q[1], r, r * sq * 0.25, 12, ang));
    if (!eyePx || vis > 0) eyePx = q;
  }
  // mouth: a lip line from the snout tip back along each visible side; jaw open as a dark wedge with a pink tongue
  const jaw = pose.jaw ?? 0;
  for (const s of [1, -1] as const) {
    const pts: V3[] = [0.149, 0.142, 0.132, 0.12, 0.109].map((u, i) => wl([u, (0.004 + i * 0.0035) * s * (i < 4 ? 1 : 1.05), BODY_C - 0.0042 - i * 0.0004]));
    const nm = nrm(sub(wl([0.13, 0.02 * s, BODY_C - 0.004]), wl([0.13, 0, BODY_C - 0.004])));
    if (dot(nm, toCam(pts[2])) < -0.1 && jaw <= 0) continue;
    const q = pts.map(P).filter((x): x is Pt => !!x);
    if (q.length > 1 && o.ink !== false) inkLine(p, seed + 820 + (s > 0 ? 0 : 5), q, {closed: false, weight: 0.6, color: mixColor(C.tkShade, C.tkInk, 0.55), still: true});
  }
  if (jaw > 0) {
    // W5-F4: the gape is a wedge along the head's long axis, drawn in screen space (the world-space z drop is foreshortened to a slit when the lens looks up at the ceiling):
    // both jaw lines leave the mouth corner (back of the head) and diverge toward the snout tip; upper jaw stays on the head axis, lower jaw swings to the side the real lower jaw drops to (screen down as fallback)
    const cor = P(wl([0.108, 0, BODY_C - 0.004])), tip = P(wl([0.15, 0, BODY_C - 0.004]));
    if (cor && tip) {
      const ax = sub2(tip, cor), len = Math.hypot(ax[0], ax[1]) || 1, ux: Pt = [ax[0] / len, ax[1] / len];
      let pn: Pt = [-ux[1], ux[0]];
      const sd = pn[1] >= 0 ? 1 : -1; // lower jaw toward screen down (the belly side of the head)
      pn = [pn[0] * sd, pn[1] * sd];
      const gap = len * 0.24 * jaw, off = len * 0.06, at = (t: number, g: number): Pt => [cor[0] + ux[0] * len * t + pn[0] * (off + gap * g * t), cor[1] + ux[1] * len * t + pn[1] * (off + gap * g * t)];
      const upL: Pt[] = [0, 0.35, 0.7, 1].map((t) => at(t, 0)), loL: Pt[] = [1, 0.7, 0.35, 0].map((t) => at(t, 1));
      hardFill(p, seed + 830, '#4a2226', [...upL, ...loL]);
      // tongue: a pink lens lying in the wedge, narrower than it, ending short of the tip
      const tg = [0.3, 0.55, 0.8, 0.55].map((t, i) => at(t, [0.35, 0.18, 0.4, 0.7][i]));
      hardFill(p, seed + 831, '#d98a8a', hull(tg));
      // both jaw rims so the open mouth reads as a mouth, not a hole
      if (o.ink !== false) { inkLine(p, seed + 832, loL, {closed: false, weight: 0.9, color: C.tkInk, still: true}); inkLine(p, seed + 833, upL, {closed: false, weight: 0.7, color: C.tkInk, still: true}); }
    }
  }
  for (const s of [1, -1] as const) { // nostrils
    const q = P(wl([0.1465, 0.0045 * s, BODY_C + 0.0022]));
    if (q) { const r = 0.0006 * camUnit(c, wl([0.1465, 0, BODY_C]), c.near ?? 0.005); if (r > 0.6) hardFill(p, seed + 840 + (s > 0 ? 0 : 1), C.tkInk, ell(q[0], q[1], r, r, 8)); }
  }
  // prey across the jaws (W-MOTH catch, W5-F2 item 4): body 0.008 x 0.022 m across the jaw tip, centre 0.006 m ahead of the snout tip along the heading; wings in the ceiling plane along the head's lateral axis, flat to the lens
  // (span `pose.moth` = 0.098 m in shot 19, scale base 0.065: forewing 0.028 m long and broad, hindwing 60 % of it), fold `pose.mothFold` degrees shrinks the lateral reach (the flutter); 3 px ink outline, two veins on the forewing
  if (pose.moth) {
    const k = Math.cos(((pose.mothFold ?? 0) * Math.PI) / 180), cu = 0.156, zz = BODY_C - 0.004, ink = '#3b2e22', sc = pose.moth / 0.065, Lf = 0.028 * sc * k, Lh = 0.6 * Lf, mc = wl([cu, 0, BODY_C - 0.005]);
    const fore = (s: 1 | -1) => ([[cu + 0.004, 0.005], [cu + 0.010, 0.4 * Lf], [cu + 0.009, 0.8 * Lf], [cu + 0.002, Lf], [cu - 0.005, 0.85 * Lf], [cu - 0.006, 0.4 * Lf], [cu - 0.002, 0.004]] as [number, number][]).map(([u, v]) => P(wl([u, v * s, zz]))).filter((x): x is Pt => !!x);
    const hind = (s: 1 | -1) => ([[cu - 0.002, 0.005], [cu - 0.005, 0.55 * Lh], [cu - 0.011, Lh], [cu - 0.017, 0.7 * Lh], [cu - 0.014, 0.3 * Lh], [cu - 0.006, 0.004]] as [number, number][]).map(([u, v]) => P(wl([u, v * s, zz - 0.0005]))).filter((x): x is Pt => !!x);
    for (const s of [1, -1] as const) {
      const n = s > 0 ? 0 : 1, qh = hind(s), qf = fore(s);
      if (qh.length > 2) { hardFill(p, seed + 870 + n, '#e8dcc0', qh); if (o.ink !== false) inkLine(p, seed + 872 + n, qh, {weight: 3, color: ink, still: true}); }
      if (qf.length > 2) { hardFill(p, seed + 850 + n, '#e8dcc0', qf); if (o.ink !== false) inkLine(p, seed + 852 + n, qf, {weight: 3, color: ink, still: true}); }
      if (o.ink !== false) [[0.008, 0.9], [-0.001, 0.8]].forEach(([du, kk], i) => { const a = P(wl([cu + 0.002, 0.005 * s, zz])), b = P(wl([cu + du, Lf * kk * s, zz])); if (a && b) inkLine(p, seed + 860 + n * 4 + i, [a, b], {closed: false, weight: 1.2, color: '#5a4636', still: true}); });
    }
    const b0 = P(wl([cu, -0.007, zz - 0.001])), b1 = P(wl([cu, 0.007, zz - 0.001]));
    if (b0 && b1) hardFill(p, seed + 854, '#4a3a2a', capsule(b0, b1, 0.004 * camUnit(c, mc), 0.004 * camUnit(c, mc)));
  }

  // ---- body contour ink (left and right edges of the tube on screen)
  if (o.ink !== false) {
    const left: Pt[] = [], right: Pt[] = [];
    for (let i = 0; i < SECT.length; i++) {
      const sp = P(wl([SECT[i][0], 0, BODY_C])), sp2 = P(wl([SECT[Math.min(SECT.length - 1, i + 1)][0] - (i === SECT.length - 1 ? 0.001 : 0), 0, BODY_C])), sp0 = P(wl([SECT[Math.max(0, i - 1)][0], 0, BODY_C]));
      if (!sp || !sp2 || !sp0) continue;
      const tx = sp2[0] - sp0[0], ty = sp2[1] - sp0[1], tl = Math.hypot(tx, ty) || 1, nx = -ty / tl, ny = tx / tl;
      const q = ring(i, 1, 0, 0, 18).map(P).filter((x): x is Pt => !!x);
      let lo = Infinity, hi = -Infinity, ql: Pt = sp, qr: Pt = sp;
      q.forEach((x) => { const d = (x[0] - sp[0]) * nx + (x[1] - sp[1]) * ny; if (d < lo) { lo = d; ql = x; } if (d > hi) { hi = d; qr = x; } });
      left.push(ql); right.push(qr);
    }
    const line = mixColor(C.tkShade, C.tkInk, 0.5);
    if (left.length > 2) inkLine(p, seed + 900, left, {closed: false, weight: 0.7, color: line, still: true, curve: 0.3});
    if (right.length > 2) inkLine(p, seed + 901, right, {closed: false, weight: 0.7, color: line, still: true, curve: 0.3});
  }

  after.forEach((id) => paintLeg(id, ids.indexOf(id)));

  const xs = all.map((q) => q[0]), ys = all.map((q) => q[1]);
  const sn = P(wl([0.15, 0, BODY_C])), tt = P(wl([-0.14, 0, BODY_C]));
  return {
    box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)].map(Math.round) as [number, number, number, number],
    feet: feetPx, footPx, head: P(wl([0.125, 0, BODY_C])), eye: eyePx,
    lengthPx: sn && tt ? Math.round(Math.hypot(sn[0] - tt[0], sn[1] - tt[1])) : 0, pxPerM: Math.round(unitV),
  };
};

/** A soft contact shadow of the tokay on the plaster (ceiling frames only): the body outline at n 0, pushed away from the lamp. */
export const paintTokayShadow = (p: Painter, c: YCam, f: Frame, seed = 61990, away: [number, number] = [0, 0]) => {
  const q = SECT.flatMap(([u, w]) => [[u, w * 1.4] as const, [u, -w * 1.4] as const]).map(([u, v]) => camPoint(c, add(f.o, add(sc(f.U, u + away[0]), add(sc(f.V, v + away[1]), sc(f.N, 0.0005)))), c.near ?? 0.005)).filter((x): x is Pt => !!x);
  if (q.length > 2) washAt(p, seed, '#6d6252', 70, hull(q), 0.3, 0.3);
};
