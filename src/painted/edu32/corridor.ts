import {ell, hardFill, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {qy, qz, wFill, wInk, wWash} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import type {LookDef} from './looks';

// EDU-EP32-SHORT Space C corridor, real look (EDU-EP32-BRIEF-R2 VD32-22; storyboard BOARD-R2 B04-SH02, B04-SH03; Boss W3 gate LF05, 2026-11-21).
// A 1960s government lab corridor in real metres: floor y 0, the corridor-side face of the wall at z 0, the corridor running along x, the camera in it
// looking at the wall (-z). Two-tone gloss paint (pale institutional green over a dark green dado), black skirting, a dark checker vinyl-tile (lino)
// floor, a surface fluorescent fitting at the ceiling edge, a wall clock, a cork notice board with blank pinned sheets (no text: the sign is the only
// prop text) and a column radiator. The solid wooden door (two raised panels, no glass) is hinged screen-left and opens inward by `ajar` radians onto
// a solid dark gap (one flat fill, no seam, no shape: nothing from inside, F003). The "ห้ามรบกวน" card hangs from the knob; its text is camera-mapped
// DOM (corridor-text.tsx). The steel pet bowl and kibble are B04-SH03 props. No cast: the cat is absent from B04-SH01's exit until B06-SH02.
// G5 (Boss W5.2, 2026-11-21): rebuilt at the R3 keys (VD32-28): the wall, lino and dressing extend left for the oblique key, the leaf and card clip
// exactly at the latch-side jamb line (`leafVisS`), the card swings and flaps (`swing`, `lift`), falling kibble; shots in b04-sh02.ts and b04-sh03.ts.

const DEG = Math.PI / 180;
export const CORRIDOR = {
  door: {x0: -0.45, x1: 0.45, h: 2.05}, wall: 0.14, frame: 0.075, ceiling: 2.7, dado: 1.1,
  upper: '#a7b59e', lower: '#46604f', skirt: '#1d1f1c', tileA: '#323a35', tileB: '#3e3f39', tile: 0.25,
  wood: '#6f4f34', brass: '#b08a3e', gap: '#0b0c0f',
  /** Leaf corridor face z when shut (G5, R3 key: a 0.03 m rebate, so from the oblique R3 camera the latch-side architrave hides no sign). */
  hingeZ: -0.03,
  /** Architrave front plane z: its inner edge at x1 is the latch-side silhouette that hides the leaf from a camera right of the door. */
  archZ: 0.02,
} as const;

/** The leaf: hinge axis at (x0 + 0.01, z `CORRIDOR.hingeZ`) (corridor face), width 0.88, swung inward by `ajar`.
 *  Point at `s` m from the hinge along the face, height `y`, `off` m out of the face toward the corridor. */
export const LEAF_W = 0.88;
export const leafPt = (ajar: number, s: number, y: number, off = 0): V3 => {
  const hx = CORRIDOR.door.x0 + 0.01, hz = CORRIDOR.hingeZ, c = Math.cos(ajar), sn = Math.sin(ajar);
  return [hx + s * c + off * sn, y, hz - s * sn + off * c];
};
/** Knob: backset 0.065 m from the free edge, 0.97 m high (round brass knob on a round rose). */
export const KNOB = {s: LEAF_W - 0.065, y: 0.97, out: 0.065} as const;
/** The sign card (VD32-22): 0.30 x 0.22 m cream card, its top 0.055 m below the knob, hung on a string loop round the knob neck, resting on the leaf
 *  (0.012 m off it) and centred toward the hinge (s 0.70, G5) so it stays inside the free edge (0.03 m) and the shut door's architrave hides none
 *  of it from the R3 camera; `swing` (deg) turns it about the knob. */
export const SIGN = {w: 0.3, h: 0.22, s: 0.7, drop: 0.055, off: 0.012} as const;
/** Rest swing (deg) of the card, every door state (continuity LF05 -> B04-SH02 -> B04-SH03). */
export const SIGN_REST = 2;
/** Card corner (u along the card, v up; knob-neck origin) -> leaf (s, y) after the in-plane swing (deg). */
const signLeafSY = (swing: number) => {
  const a = swing * DEG, ca = Math.cos(a), sa = Math.sin(a), du = SIGN.s - KNOB.s;
  return (u: number, v: number): [number, number] => { const uu = u + du; return [KNOB.s + uu * ca - v * sa, KNOB.y + uu * sa + v * ca]; };
};
const SIGN_LOCAL: [number, number][] = [[-SIGN.w / 2, -SIGN.drop], [SIGN.w / 2, -SIGN.drop], [SIGN.w / 2, -SIGN.drop - SIGN.h], [-SIGN.w / 2, -SIGN.drop - SIGN.h]];
/** Sign corners TL, TR, BR, BL (world) for door state `ajar`, swing `swing` (deg, + = bottom toward the free edge) and `lift` (m: the bottom edge
 *  flapped off the leaf toward the corridor, the top edge stays on the string). */
export const signCorners = (ajar: number, swing = 0, lift = 0): V3[] => {
  const sy = signLeafSY(swing);
  return SIGN_LOCAL.map(([u, v], i) => { const [s, y] = sy(u, v); return leafPt(ajar, s, y, SIGN.off + (i >= 2 ? lift : 0)); });
};

/** Keep the part of polygon `pts` where the linear function `f` is >= 0 (one Sutherland-Hodgman pass); `cut[i]` marks points on the cut line. */
export const clipLinear = <T extends number[]>(pts: T[], f: (q: T) => number): {pts: T[]; cut: boolean[]} => {
  const out: T[] = [], cut: boolean[] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], fa = f(a), fb = f(b);
    if (fa >= 0) { out.push(a); cut.push(false); }
    if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push(a.map((v, k) => v + (b[k] - v) * t) as T); cut.push(true); }
  }
  return {pts: out, cut};
};

/**
 * Leaf s beyond which a leaf point `off` m out of the face hides behind the latch-side architrave edge (x1, z `archZ`) for camera `c` (Infinity
 * when nothing hides). The crossing of the camera ray with the architrave plane depends only on the point's x and z, so the hidden part of the leaf
 * is exactly s > leafVisS: a door opening inward away from a camera on its latch side slides behind the jamb (G5, the R3 key).
 */
export const leafVisS = (c: YCam, ajar: number, off = 0): number => {
  const x1 = CORRIDOR.door.x1, zA = CORRIDOR.archZ;
  if (c.x <= x1) return Infinity;
  const cross = (s: number) => { const [px, , pz] = leafPt(ajar, s, 0, off); return pz >= zA ? -Infinity : c.x + ((px - c.x) * (c.z - zA)) / (c.z - pz); };
  let lo = 0, hi = LEAF_W + 0.3;
  if (cross(hi) <= x1) return Infinity;
  if (cross(lo) > x1) return 0;
  for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (cross(m) <= x1) lo = m; else hi = m; }
  return lo;
};
/** The visible part of the card (world polygon, `cut` = on the jamb line) and whether any of it hides. */
export const signVisible = (c: YCam, ajar: number, swing = 0, lift = 0) => {
  const sy = signLeafSY(swing), sv = leafVisS(c, ajar, SIGN.off + lift / 2);
  const loc = SIGN_LOCAL.map(([u, v], i) => [...sy(u, v), i >= 2 ? lift : 0]);
  const k = clipLinear(loc, (q) => sv - q[0]);
  return {pts: k.pts.map(([s, y, l]): V3 => leafPt(ajar, s, y, SIGN.off + l)), cut: k.cut, sv, clipped: k.pts.length !== 4 || k.cut.some(Boolean)};
};
/** CSS clip polygon (px, card div `w` x `h` px at `K` px per metre) of the visible card; null when the whole card shows. */
export const signClipCss = (c: YCam, ajar: number, swing: number, lift: number, K: number): string | null => {
  const sv = leafVisS(c, ajar, SIGN.off + lift / 2);
  if (!Number.isFinite(sv)) return null;
  const sy = signLeafSY(swing), W = SIGN.w * K, H = SIGN.h * K;
  const rect: [number, number][] = [[0, 0], [W, 0], [W, H], [0, H]];
  const k = clipLinear(rect, ([X, Y]) => sv - sy(X / K - SIGN.w / 2, -SIGN.drop - Y / K)[0]);
  if (!k.cut.some(Boolean)) return k.pts.length ? null : 'polygon(0 0, 0 0, 0 0)';
  return `polygon(${k.pts.map(([X, Y]) => `${X.toFixed(1)}px ${Y.toFixed(1)}px`).join(', ')})`;
};

const poly = (c: YCam, pts: V3[]): Pt[] | null => {
  const q = pts.map((v) => camPoint(c, v));
  return q.every(Boolean) ? (q as Pt[]) : null;
};
const circleW = (ctr: (a: number) => V3, n = 20): V3[] => Array.from({length: n}, (_, i) => ctr((i / n) * 2 * Math.PI));

/** Walls, ceiling strip and fluorescent fitting, the lino floor, skirting, dado rail; the dark gap in the opening. */
const paintCorridorShell = (p: Painter, c: YCam) => {
  const K = CORRIDOR, {x0, x1, h} = K.door;
  // ceiling strip (white distemper, lit by the fitting) and the surface fluorescent fitting along the wall (z 0.2..0.42)
  wFill(p, c, 37001, '#c9cfc6', qy(K.ceiling, -6, 6, 0, 3));
  wWash(p, c, 37002, '#e9f0ea', 90, qy(K.ceiling - 0.001, -2.2, 2.6, 0, 1.0), 0.3, 0.3);
  wFill(p, c, 37003, '#d6dbd6', [[-1.4, K.ceiling - 0.09, 0.22], [1.6, K.ceiling - 0.09, 0.22], [1.6, K.ceiling - 0.09, 0.4], [-1.4, K.ceiling - 0.09, 0.4]]);
  wFill(p, c, 37004, '#f4f8f4', qz(0.4, -1.4, 1.6, K.ceiling - 0.09, K.ceiling - 0.01));
  wFill(p, c, 37005, '#9ea59f', qz(0.4001, -1.4, 1.6, K.ceiling - 0.012, K.ceiling));
  // wall: upper gloss green, falloff from the ceiling light (lighter at the top, a little darker toward the dado)
  wFill(p, c, 37010, K.upper, qz(0, -6, 6, K.dado, K.ceiling));
  wWash(p, c, 37011, '#cbd6c2', 70, qz(-0.001, -2.4, 2.8, 1.9, K.ceiling), 0.35, 0.3);
  wWash(p, c, 37012, '#7f8f7a', 50, qz(-0.001, -6, 6, K.dado, 1.45), 0.4, 0.4);
  // dado: dark gloss green with a soft sheen band, the dado rail on top
  wFill(p, c, 37020, K.lower, qz(0, -6, 6, 0.12, K.dado));
  wWash(p, c, 37021, '#5d7a66', 60, qz(-0.001, -6, 6, 0.7, K.dado - 0.03), 0.4, 0.35);
  wWash(p, c, 37022, '#2f4236', 70, qz(-0.001, -6, 6, 0.12, 0.42), 0.4, 0.4);
  // painted, not flat: old gloss paint unevenly lit and touched up (soft blotches), scuffs along the dado where trolleys and shoes hit it
  for (let k = 0; k < 18; k++) {
    const x = -4.4 + 6.8 * hash(38500 + k), y = 1.2 + 1.4 * hash(38520 + k), w = 0.3 + 0.6 * hash(38540 + k), hh = 0.2 + 0.4 * hash(38560 + k);
    wWash(p, c, 38580 + k, k % 2 ? '#b9c6ae' : '#93a48d', 35, qz(-0.0008, x, x + w, y, Math.min(K.ceiling, y + hh)), 0.5, 0.6);
  }
  for (let k = 0; k < 14; k++) {
    const x = -4.4 + 6.8 * hash(38600 + k), y = 0.18 + 0.5 * hash(38620 + k), w = 0.15 + 0.4 * hash(38640 + k);
    wWash(p, c, 38660 + k, k % 3 ? '#2c3d32' : '#5b6f60', 45, qz(-0.0008, x, x + w, y, y + 0.04 + 0.08 * hash(38680 + k)), 0.4, 0.6);
  }
  wFill(p, c, 37023, '#33473a', [[-6, K.dado, 0.015], [6, K.dado, 0.015], [6, K.dado + 0.035, 0.015], [-6, K.dado + 0.035, 0.015]]);
  wInk(p, c, 37024, [[-6, K.dado + 0.035, 0.015], [6, K.dado + 0.035, 0.015]], {color: '#8fa08c', weight: 0.6, closed: false});
  // floor: dark checker vinyl tiles (9-inch-ish), marbled flecks, a worn path toward the door
  wFill(p, c, 37030, K.tileA, qy(0, -6, 6, 0, 4));
  const T = K.tile;
  for (let i = -18; i < 14; i++) for (let j = 0; j < 13; j++) {
    if ((i + j) % 2 === 0) continue;
    wFill(p, c, 36000 + (i + 18) * 13 + j, mixColor(K.tileB, K.tileA, 0.25 * hash(37400 + i * 31 + j)), qy(0.0005, i * T, (i + 1) * T, j * T, (j + 1) * T));
  }
  for (let k = 0; k < 180; k++) {
    const x = -4.2 + 6.6 * hash(37600 + k), z = 0.05 + 2.6 * hash(37800 + k), l = 0.03 + 0.05 * hash(38000 + k), a = 6.283 * hash(38200 + k);
    wInk(p, c, 38400 + k, [[x, 0.001, z], [x + l * Math.cos(a), 0.001, z + l * Math.sin(a)]], {color: k % 3 ? '#5c5e55' : '#2a302b', weight: 0.5, closed: false});
  }
  // gloss lino: a soft mirrored reflection of the dark doorway and the wall's bright upper band, then a long sheen from the fitting
  wWash(p, c, 37042, '#15181a', 45, qy(0.0012, x0 + 0.02, x1 - 0.02, 0.02, 0.5), 0.4, 0.5);
  wWash(p, c, 37043, '#58665a', 35, qy(0.0012, -6, 6, 0.6, 1.4), 0.5, 0.5);
  wWash(p, c, 37040, '#5c5b51', 40, qy(0.001, x0 - 0.1, x1 + 0.2, 0.02, 2.4), 0.5, 0.5);
  wWash(p, c, 37041, '#1c211d', 70, qy(0.001, -6, 6, 0, 0.12), 0.3, 0.3);
  // skirting (black-brown, 0.12 m), broken by the door opening
  wFill(p, c, 37050, K.skirt, qz(0.012, -6, x0 - K.frame, 0, 0.12));
  wFill(p, c, 37051, K.skirt, qz(0.012, x1 + K.frame, 6, 0, 0.12));
  wInk(p, c, 37052, [[-6, 0.12, 0.012], [x0 - K.frame, 0.12, 0.012]], {color: '#4a4d47', weight: 0.5, closed: false});
  wInk(p, c, 37053, [[x1 + K.frame, 0.12, 0.012], [6, 0.12, 0.012]], {color: '#4a4d47', weight: 0.5, closed: false});
  // the opening: one flat dark fill (VD32-22: solid dark, no light seam, no shape)
  wFill(p, c, 37060, K.gap, qz(-0.0005, x0, x1, 0, h));
};

/** The leaf at `ajar`: stained face with two raised panels and their mouldings, darker toward the free edge as it swings into the dark room.
 *  Everything past `leafVisS` (behind the latch-side architrave for this camera) is cut off at that line (G5). */
const paintLeaf = (p: Painter, c: YCam, ajar: number) => {
  const K = CORRIDOR, sv = Math.min(LEAF_W, leafVisS(c, ajar)), S = (s: number) => Math.min(s, sv);
  const L = (s: number, y: number, o = 0) => leafPt(ajar, S(s), y, o), H = K.door.h - 0.01;
  if (sv <= 0) return;
  const face = [L(0, 0.008), L(LEAF_W, 0.008), L(LEAF_W, H), L(0, H)];
  const lit = mixColor(K.wood, '#0b0c0f', Math.min(0.45, 0.55 * Math.sin(ajar)));
  wFill(p, c, 37200, lit, face);
  if (LEAF_W * 0.45 < sv) wWash(p, c, 37201, '#1a120c', 40 + 90 * Math.sin(ajar), [L(LEAF_W * 0.45, 0.008), L(LEAF_W, 0.008), L(LEAF_W, H), L(LEAF_W * 0.45, H)], 0.4, 0.4);
  wWash(p, c, 37202, '#9a7652', 50, [L(0.04, 1.3), L(LEAF_W * 0.5, 1.3), L(LEAF_W * 0.5, H - 0.05), L(0.04, H - 0.05)], 0.4, 0.4);
  // grain: long faint lines down the stiles and rails
  for (let k = 0; k < 18; k++) {
    const s = 0.03 + (LEAF_W - 0.06) * hash(37210 + k), y0 = 0.05 + 0.3 * hash(37230 + k), y1 = H - 0.05 - 0.4 * hash(37250 + k);
    if (s + 0.006 > sv) continue;
    wInk(p, c, 37270 + k, [L(s, y0, 0.001), L(s + 0.01 * (hash(37290 + k) - 0.5), (y0 + y1) / 2, 0.001), L(s, y1, 0.001)], {color: mixColor(lit, '#2a1a10', 0.35), weight: 0.45, closed: false});
  }
  // two raised panels (upper tall, lower short): a shadow line under/left, a lit bevel on top/right (light from above, in front)
  for (const [k, y0, y1] of [[0, 1.02, H - 0.14], [1, 0.16, 0.84]] as const) {
    const s0 = 0.14, s1 = LEAF_W - 0.14;
    if (s0 >= sv) continue;
    wFill(p, c, 37320 + k, mixColor(lit, '#f0d8b0', 0.08), [L(s0, y0, 0.006), L(s1, y0, 0.006), L(s1, y1, 0.006), L(s0, y1, 0.006)]);
    wInk(p, c, 37330 + k, [L(s0, y1, 0.006), L(s1, y1, 0.006)], {color: mixColor(lit, '#f6e2c0', 0.4), weight: 0.8, closed: false});
    wInk(p, c, 37340 + k, [L(s0, y0, 0.006), L(s0, y1, 0.006)], {color: mixColor(lit, '#f6e2c0', 0.22), weight: 0.6, closed: false});
    wInk(p, c, 37350 + k, s1 <= sv ? [L(s0, y0, 0.006), L(s1, y0, 0.006), L(s1, y1, 0.006)] : [L(s0, y0, 0.006), L(s1, y0, 0.006)], {color: mixColor(lit, '#120a06', 0.55), weight: 0.8, closed: false});
  }
};

/** Jamb reveal facing the camera and the head soffit (painted dark green like the dado, 1960s): behind the leaf, so painted before it. */
const paintDoorReveals = (p: Painter, c: YCam) => {
  const K = CORRIDOR, {x0, x1, h} = K.door, w = K.wall;
  if (c.x > x0) wFill(p, c, 37400, '#2e3f34', [[x0, 0, 0], [x0, 0, -w], [x0, h, -w], [x0, h, 0]]);
  if (c.x < x1) wFill(p, c, 37401, '#24332a', [[x1, 0, 0], [x1, 0, -w], [x1, h, -w], [x1, h, 0]]);
  if (c.y < h) wFill(p, c, 37402, '#1f2b24', qy(h, x0, x1, -w, 0));
};
/** The architrave (in front of the leaf) and its shadow on the wall. */
const paintDoorFrame = (p: Painter, c: YCam) => {
  const K = CORRIDOR, {x0, x1, h} = K.door, F = K.frame, z = K.archZ;
  const fc = '#3b5243', fl = '#6f8a74';
  wFill(p, c, 37410, fc, qz(z, x0 - F, x0, 0, h + F));
  wFill(p, c, 37411, fc, qz(z, x1, x1 + F, 0, h + F));
  wFill(p, c, 37412, fc, qz(z, x0 - F, x1 + F, h, h + F));
  wInk(p, c, 37413, [[x0 - F, h + F, z], [x1 + F, h + F, z]], {color: fl, weight: 0.8, closed: false});
  wInk(p, c, 37414, [[x0, 0, z], [x0, h, z], [x1, h, z], [x1, 0, z]], {color: '#1a241e', weight: 0.7, closed: false});
  // the architrave's shadow on the wall (light from above and in front: a soft band below and right)
  wWash(p, c, 37415, '#2c3a2e', 50, qz(0.001, x1 + F, x1 + F + 0.04, 0, h + F - 0.02), 0.3, 0.3);
};

/** Brass knob on a round rose, and the sign card hanging from it (card painted here, text DOM). `swing` (deg) turns the card in the leaf plane,
 *  `lift` (m) flaps its bottom edge off the leaf. Both clip at the latch-side jamb line for this camera. Returns the visible card's screen span. */
const paintKnobAndSign = (p: Painter, c: YCam, ajar: number, swing: number, lift: number) => {
  const K = CORRIDOR, s = KNOB.s, y = KNOB.y;
  const knobShows = s <= leafVisS(c, ajar, KNOB.out);
  const rose = knobShows ? poly(c, circleW((a) => leafPt(ajar, s + 0.03 * Math.cos(a), y + 0.03 * Math.sin(a), 0.004))) : null;
  if (rose) hardFill(p, 37500, mixColor(K.brass, '#2a1c0c', 0.35), rose);
  // the card (behind the knob: it hangs from the neck), its contact shadow on the leaf (further and softer as the bottom lifts), the string loop
  const vis = signVisible(c, ajar, swing, lift);
  let span: {x0: number; x1: number; y0: number; y1: number} | null = null;
  if (vis.pts.length >= 3) {
    const sc = vis.pts, sh = sc.map(([x, yy, z]): V3 => [x + 0.01 + 0.4 * lift, yy - 0.012 - 0.3 * lift, z]);
    wWash(p, c, 37510, '#120a06', 120 - 900 * lift, sh, 0.12 + 2 * lift, 0.2);
    const card = mixColor('#ece2c8', '#3a3a34', 0.3 * Math.sin(ajar));
    wFill(p, c, 37511, card, sc);
    const all = signCorners(ajar, swing, lift);
    if (!vis.clipped) wWash(p, c, 37512, '#d8cbaa', 60, [all[2], all[3], all[0].map((v, i) => (v + all[3][i]) / 2) as V3, all[1].map((v, i) => (v + all[2][i]) / 2) as V3], 0.3, 0.5);
    // outline, skipping the edge on the jamb line (the architrave edge is the boundary there)
    for (let i = 0; i < sc.length; i++) {
      const j = (i + 1) % sc.length;
      if (vis.cut[i] && vis.cut[j]) continue;
      wInk(p, c, 37515 + i, [sc[i], sc[j]], {color: '#9c8a68', weight: 0.6, closed: false});
    }
    const q = sc.map((v) => camPoint(c, v)).filter(Boolean) as Pt[];
    if (q.length) span = {x0: Math.min(...q.map((v) => v[0])), x1: Math.max(...q.map((v) => v[0])), y0: Math.min(...q.map((v) => v[1])), y1: Math.max(...q.map((v) => v[1]))};
    if (knobShows) {
      const neck = leafPt(ajar, s, y, KNOB.out * 0.55);
      const hole = (k: number): V3 => all[0].map((v, i) => v + (all[1][i] - v) * k + (all[3][i] - v) * 0.12) as V3;
      wInk(p, c, 37514, [hole(0.3), neck, hole(0.7)], {color: '#3a2e22', weight: 0.7, closed: false});
    }
  }
  // knob: a brass ball, dark lower-right, one soft highlight upper-left
  const kc = knobShows ? camPoint(c, leafPt(ajar, s, y, KNOB.out)) : null;
  if (!kc) return span;
  const r = 0.028 * camUnit(c, leafPt(ajar, s, y, KNOB.out));
  hardFill(p, 37520, '#6b5020', ell(kc[0], kc[1], r * 1.02, r, 16));
  hardFill(p, 37521, K.brass, ell(kc[0] - 0.12 * r, kc[1] - 0.12 * r, r * 0.8, r * 0.78, 16));
  hardFill(p, 37522, '#ecd7a0', ell(kc[0] - 0.35 * r, kc[1] - 0.4 * r, r * 0.26, r * 0.18, 10));
  return span;
};

/** Wall dressing: clock high screen-left, cork notice board with blank pinned sheets screen-right, a column radiator under it. */
const paintCorridorDressing = (p: Painter, c: YCam) => {
  // clock (0.32 m, cream face, black ring, tick marks, hands at 3:05-ish, no numerals)
  const cx = -1.2, cy = 2.1, R = 0.16, W = (a: number, r: number, z = 0.03): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z];
  const ring = poly(c, circleW((a) => W(a, R), 28)), face = poly(c, circleW((a) => W(a, R * 0.86, 0.031), 28));
  wWash(p, c, 37600, '#5d6b58', 60, circleW((a) => [cx + 0.02 + R * Math.cos(a), cy - 0.03 + R * Math.sin(a), 0.001], 20), 0.3, 0.3);
  if (ring) hardFill(p, 37601, '#1e1f1e', ring);
  if (face) hardFill(p, 37602, '#ece6d4', face);
  for (let i = 0; i < 12; i++) wInk(p, c, 37610 + i, [W((i / 12) * 6.283, R * 0.74, 0.032), W((i / 12) * 6.283, R * 0.82, 0.032)], {color: '#2a2a28', weight: i % 3 ? 0.5 : 0.9, closed: false});
  wInk(p, c, 37630, [W(0, 0, 0.033), W(Math.PI / 2 - 0.1, R * 0.5, 0.033)], {color: '#1a1a18', weight: 1.4, closed: false});
  wInk(p, c, 37631, [W(0, 0, 0.033), W(-0.05, R * 0.7, 0.033)], {color: '#1a1a18', weight: 1.0, closed: false});
  // notice board: varnished frame, cork, three blank sheets with faint ruled lines (unreadable on purpose) and drawing pins
  const b = {x0: 0.85, x1: 1.55, y0: 1.18, y1: 1.72}, dx = -0.13, dy = -0.07;
  wWash(p, c, 37650, '#5d6b58', 70, qz(0.001, b.x0 + 0.02, b.x1 + 0.04, b.y0 - 0.04, b.y1 - 0.02), 0.3, 0.3);
  wFill(p, c, 37651, '#5a3e26', qz(0.02, b.x0, b.x1, b.y0, b.y1));
  wFill(p, c, 37652, '#9a7a52', qz(0.021, b.x0 + 0.03, b.x1 - 0.03, b.y0 + 0.03, b.y1 - 0.03));
  wWash(p, c, 37653, '#6e5434', 70, qz(0.022, b.x0 + 0.03, b.x1 - 0.03, b.y0 + 0.03, b.y1 - 0.03), 0.4, 0.7);
  for (const [k, sx0, sy0, sw, shh, tilt] of [[0, 1.05, 1.36, 0.2, 0.28, 0.02], [1, 1.3, 1.45, 0.21, 0.29, -0.015], [2, 1.52, 1.3, 0.16, 0.22, 0.01]] as const) {
    const sx = sx0 + dx, sy = sy0 + dy;
    const pts: V3[] = [[sx, sy + shh, 0.023], [sx + sw, sy + shh + tilt, 0.023], [sx + sw, sy + tilt, 0.023], [sx, sy, 0.023]];
    wFill(p, c, 37660 + k, k === 1 ? '#d9d6c4' : '#e4dcc6', pts);
    for (let l = 0; l < 6; l++) { const yy = sy + shh - 0.05 - l * 0.035; wInk(p, c, 37670 + k * 10 + l, [[sx + 0.025, yy, 0.024], [sx + sw - 0.03 - 0.05 * hash(37700 + k * 10 + l), yy + tilt * 0.5, 0.024]], {color: '#a8a290', weight: 0.4, closed: false}); }
    const pin = camPoint(c, [sx + sw / 2, sy + shh - 0.015, 0.025]);
    if (pin) hardFill(p, 37690 + k, ['#b0342a', '#2f5f8a', '#c9a23a'][k], ell(pin[0], pin[1], 3, 2.6, 8));
  }
  // column radiator (painted the dado green, a shade lighter), on two feet, its shadow on the wall and floor
  const r = {x0: 0.9, x1: 1.5, y0: 0.14, y1: 0.74, z0: 0.05, z1: 0.16};
  wWash(p, c, 37720, '#1f2c23', 90, qz(0.001, r.x0 + 0.02, r.x1 + 0.05, r.y0, r.y1 - 0.03), 0.3, 0.3);
  wWash(p, c, 37721, '#1a1f1b', 90, qy(0.0015, r.x0 - 0.02, r.x1 + 0.06, r.z0, r.z1 + 0.1), 0.3, 0.3);
  const n = 11;
  for (let i = 0; i < n; i++) {
    const x = r.x0 + ((r.x1 - r.x0) * (i + 0.12)) / n, w = ((r.x1 - r.x0) / n) * 0.76;
    wFill(p, c, 37730 + i, '#50675a', qz(r.z1, x, x + w, r.y0, r.y1));
    wInk(p, c, 37750 + i, [[x + w * 0.25, r.y1 - 0.03, r.z1 + 0.001], [x + w * 0.25, r.y0 + 0.04, r.z1 + 0.001]], {color: '#7f9a86', weight: 0.5, closed: false});
  }
  wFill(p, c, 37770, '#4a6252', qy(r.y1, r.x0, r.x1, r.z0, r.z1));
  wInk(p, c, 37771, [[r.x0, r.y1, r.z1], [r.x1, r.y1, r.z1]], {color: '#8aa592', weight: 0.6, closed: false});
};

/** `new: steel-pet-bowl` (B04-SH03): a shallow stainless bowl, 0.18 m across the rim, 0.055 m tall, at floor point `at`; `kibble` 0..1 fills it
 *  with brown kibble. Cool fluorescent: a bright rim line, a dark inner wall opposite the light, a soft contact shadow on the lino. */
export const paintSteelBowl = (p: Painter, c: YCam, at: V3, kibble = 0) => {
  const [bx, , bz] = at, R = 0.09, rb = 0.065, Hh = 0.055;
  const rim = (r: number, y: number, n = 28) => circleW((a) => [bx + r * Math.cos(a), y, bz + r * Math.sin(a)], n);
  const g = camPoint(c, at);
  if (!g) return null;
  wWash(p, c, 37800, '#101310', 130, circleW((a) => [bx + 0.012 + R * 1.15 * Math.cos(a), 0.001, bz + 0.01 + R * 0.95 * Math.sin(a)], 24), 0.25, 0.3);
  // outer wall: the silhouette between the foot ring and the rim (hull of both ellipses), steel with a vertical light streak
  const outer = poly(c, [...rim(rb, 0.004), ...rim(R, Hh)]);
  if (!outer) return null;
  const hullPts = hullOf(outer);
  hardFill(p, 37801, '#a9b2b8', hullPts);
  const streak = poly(c, [[bx - 0.03, 0.006, bz + rb], [bx - 0.005, 0.006, bz + rb], [bx - 0.01, Hh, bz + R], [bx - 0.05, Hh, bz + R]]);
  if (streak) washAt(p, 37802, '#e2e8ec', 140, streak, 0.15, 0.2);
  const shade = poly(c, [[bx + 0.04, 0.006, bz + rb * 0.9], [bx + rb, 0.006, bz], [bx + R, Hh, bz], [bx + R * 0.7, Hh, bz + R * 0.7]]);
  if (shade) washAt(p, 37803, '#3c4246', 120, shade, 0.2, 0.2);
  // inside: rim ellipse filled dark steel, the floor of the bowl lighter, rim line bright
  const top = poly(c, rim(R, Hh));
  if (top) hardFill(p, 37804, '#8c969c', top);
  const floor = poly(c, rim(rb * 0.85, 0.012));
  if (floor) hardFill(p, 37805, '#c4ccd0', floor);
  if (kibble > 0) {
    const n = Math.round(34 * kibble);
    for (let k = 0; k < n; k++) {
      const o = kibbleSpot(k), q = camPoint(c, [bx + o[0], o[1], bz + o[2]]);
      if (!q) continue;
      const u = 0.0075 * camUnit(c, at);
      hardFill(p, 38050 + k, k % 4 ? '#7a4a24' : '#5e3618', ell(q[0], q[1], u, u * 0.7, 8, hash(38100 + k) * 3));
      hardFill(p, 38150 + k, '#a7713f', ell(q[0] - u * 0.3, q[1] - u * 0.3, u * 0.35, u * 0.22, 6));
    }
  }
  const rimPic = poly(c, rim(R, Hh + 0.001));
  if (rimPic) {
    p.ink(38300, 'rotring', '#e6ecef', 1.1);
    p.brush.spline([...rimPic, rimPic[0]], 0.1);
  }
  const ys = hullPts.map((v) => v[1]), xs = hullPts.map((v) => v[0]);
  return {top: Math.min(...ys), bottom: Math.max(...ys), w: Math.max(...xs) - Math.min(...xs)};
};
const hullOf = (pts: Pt[]): Pt[] => {
  const s = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]), cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], up: Pt[] = [];
  for (const q of s) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of s.reverse()) { while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};

/** Landing spot of kibble piece `k` in the bowl (offset from the bowl's floor point; the same spots `paintSteelBowl` fills, in order). */
export const kibbleSpot = (k: number): V3 => {
  const a = 6.283 * hash(37900 + k), rr = 0.065 * 0.8 * Math.sqrt(hash(37950 + k));
  return [rr * Math.cos(a), 0.018 + 0.01 * hash(38000 + k), rr * Math.sin(a)];
};
/** Falling kibble (B04-SH03): pieces at world points, each stretched along its fall by `v` (m/s) over half a frame (a light motion smear). */
export const paintFallingKibble = (p: Painter, c: YCam, pieces: {at: V3; v: number; k: number}[]) => {
  for (const {at, v, k} of pieces) {
    const q = camPoint(c, at), q2 = camPoint(c, [at[0], at[1] + v / 60, at[2]]);
    if (!q || !q2) continue;
    const u = 0.0075 * camUnit(c, at), smear = Math.max(0, q[1] - q2[1]);
    hardFill(p, 38250 + k, k % 4 ? '#7a4a24' : '#5e3618', ell(q[0], q[1] - smear / 2, u, u * 0.7 + smear / 2, 8));
  }
};

/** Space C at a door state: `ajar` (rad, 0 = shut), the sign `swing` (deg) and `lift` (m), an optional bowl (B04-SH03) and falling kibble.
 *  Returns the bowl span and the visible sign span (px). Paint order: shell, dressing, reveals and soffit, leaf (clipped at the jamb line), architrave,
 *  knob and sign (clipped), bowl, falling kibble. */
export const paintCorridor = (p: Painter, c: YCam, o: {ajar: number; swing?: number; lift?: number; bowl?: {at: V3; kibble?: number}; falling?: {at: V3; v: number; k: number}[]}) => {
  paintCorridorShell(p, c);
  paintCorridorDressing(p, c);
  paintDoorReveals(p, c);
  paintLeaf(p, c, o.ajar);
  paintDoorFrame(p, c);
  const sign = paintKnobAndSign(p, c, o.ajar, o.swing ?? SIGN_REST, o.lift ?? 0);
  const bowl = o.bowl ? paintSteelBowl(p, c, o.bowl.at, o.bowl.kibble ?? 0) : null;
  if (o.falling) paintFallingKibble(p, c, o.falling);
  return {bowl, sign};
};

/** B04-SH02 R3 keys (storyboard BOARD-R3 #r3-camera-keys, VD32-28): the camera stands down the corridor and looks back along the door wall.
 *  Start eye (+1.9, 1.25, +2.6), yaw -35, pitch 0, f 1000, hy 740; end eye (+1.75, 1.25, +2.3), yaw -33. (R2/LF05 gate: (+0.35, 1.15, +2.6), yaw -6, f 900, hy 600.) */
export const CAM_B04_SH02: YCam = {x: 1.9, y: 1.25, z: 2.6, yaw: -35 * DEG, pitch: 0, f: 1000, hy: 740};
export const CAM_B04_SH02_END: YCam = {x: 1.75, y: 1.25, z: 2.3, yaw: -33 * DEG, pitch: 0, f: 1000, hy: 740};
/** B04-SH02 start state. G5 feasibility change (Boss, 2026-11-21; Film to confirm): at the R3 key the camera stands on the door's latch side, so a leaf
 *  ajar 40 deg (as LF05) slides behind the latch jamb: no dark gap shows and the jamb hides the knob and half the card. At 75 deg the free edge clears
 *  the jamb: a dark gap opens at the latch side and the whole card faces the camera. */
export const LF05_AJAR = 75 * DEG;
/** B04-SH03 R3 keys (VD32-28): eye (+0.45, 0.42, +1.3) -> (+0.4, 0.38, +1.1), yaw -4, pitch -16, f 1000, hy 880 (was 600). */
export const CAM_B04_SH03_START: YCam = {x: 0.45, y: 0.42, z: 1.3, yaw: -4 * DEG, pitch: -16 * DEG, f: 1000, hy: 880};
export const CAM_B04_SH03: YCam = {x: 0.4, y: 0.38, z: 1.1, yaw: -4 * DEG, pitch: -16 * DEG, f: 1000, hy: 880};
/** Bowl stop point (timed sheet B04-SH03: slides from (+1.4, 0, +0.3) to (+0.1, 0, +0.25)). */
export const BOWL_FROM: V3 = [1.4, 0, 0.3];
export const BOWL_AT: V3 = [0.1, 0, 0.25];

/** Measured spans per corridor look (px), filled when the painter runs (QA). */
export const CORRIDOR_MEASURE: Record<string, Record<string, number>> = {};
const span = (c: YCam, pts: V3[]) => {
  const q = pts.map((v) => camPoint(c, v)).filter(Boolean) as Pt[];
  const xs = q.map((v) => v[0]), ys = q.map((v) => v[1]);
  return {x0: Math.round(Math.min(...xs)), x1: Math.round(Math.max(...xs)), y0: Math.round(Math.min(...ys)), y1: Math.round(Math.max(...ys))};
};
/** Door, visible sign and latch-side dark gap (px at y 1.0 m; 0 when the leaf hides behind the jamb) for camera `c` and door state `ajar`. */
export const corridorSpans = (c: YCam, ajar: number, swing = SIGN_REST, lift = 0) => {
  const d = CORRIDOR.door, door = span(c, [[d.x0, 0, 0], [d.x1, 0, 0], [d.x1, d.h, 0], [d.x0, d.h, 0]]);
  const vis = signVisible(c, ajar, swing, lift), sign = vis.pts.length >= 3 ? span(c, vis.pts) : null;
  const edge = camPoint(c, leafPt(ajar, LEAF_W, 1.0)), jamb = camPoint(c, [d.x1, 1.0, CORRIDOR.archZ]);
  const gapPx = leafVisS(c, ajar) >= LEAF_W && edge && jamb ? Math.max(0, Math.round(jamb[0] - edge[0])) : 0;
  return {door, sign, signClipped: vis.clipped, gapPx};
};

export const CORRIDOR_LOOKS: Record<string, () => LookDef> = {
  LF05: () => ({shot: 'B04-SH02', cam: CAM_B04_SH02, t: 0, paper: CORRIDOR.upper, caption: 'ทีมเลยต่อสายเพิ่ม ไว้กดความหิว', paint: (p) => {
    paintCorridor(p, CAM_B04_SH02, {ajar: LF05_AJAR});
    const m = corridorSpans(CAM_B04_SH02, LF05_AJAR);
    CORRIDOR_MEASURE.LF05 = {doorTop: m.door.y0, doorBottom: m.door.y1, signX0: m.sign?.x0 ?? -1, signX1: m.sign?.x1 ?? -1, signTop: m.sign?.y0 ?? -1, signBottom: m.sign?.y1 ?? -1, signClipped: +m.signClipped, gapPx: m.gapPx};
  }}),
  'LF05-BOWL': () => ({shot: 'B04-SH03', cam: CAM_B04_SH03, t: 0, paper: CORRIDOR.tileA, caption: 'ทั้งที่จริง ๆ… ให้ข้าวก็จบแล้ว', paint: (p) => {
    const {bowl: b} = paintCorridor(p, CAM_B04_SH03, {ajar: 0, bowl: {at: BOWL_AT, kibble: 12 / 34}});
    if (b) CORRIDOR_MEASURE['LF05-BOWL'] = {bowlTop: Math.round(b.top), bowlBottom: Math.round(b.bottom), bowlW: Math.round(b.w)};
  }}),
};
