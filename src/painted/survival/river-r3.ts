import {hardFill, inkLine} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {wFill, wInk, type Item} from '../kit/world';
import {camPoint} from '../kit/ycam';
import {lit, type Light, type V3, type YCam} from './core';
import {paintFernClump, paintTreeFern} from './forest';
import {RC, RIVER_LIGHT, waterColorAt} from './river';

// N16-11 R3 river additions (EDU-EP16 shots 16A-16D and 16; Boss, 14 Nov 2026), in space RIV as Film's R1.5 set additions: boulder B1, reed bed RD, fern row FC that parts on a key,
// impulse rings round any point touching the water, and the 'shade' light value. All are sorted `Item`s for `paintRiver`'s `extra` (or `paintSorted`), no renderer change.

// ---- 'shade' light: a cloud shadow over the river. Film's estimate (amb #a3b2a0, k 0.05) lowers `lit`'s pull toward the ambient, so it would read lighter than day; the value is retuned (AI13) to a darker cool grey-green
// at k 0.3 so the shade is seen on the water, the bank and the fern wall. Ramp frames are the global R1.5 frames (16A +14..+26, held through 16D, back over SH16 +0..+10).
export const RIVER_SHADE: Light = {amb: '#6f8280', k: 0.38};
export const SHADE_FRAMES = {in0: 1364, in1: 1376, out0: 1504, out1: 1514} as const;
const ramp = (a: number, b: number, f: number) => Math.min(1, Math.max(0, (f - a) / (b - a)));
/** Shade amount 0 (day) .. 1 (full shade) at global frame `f`. */
export const shadeAt = (f: number): number => { const s = SHADE_FRAMES; return ramp(s.in0, s.in1, f) * (1 - ramp(s.out0, s.out1, f)); };
/** The river light blended `s` of the way from day to shade. */
export const riverLightAt = (s: number): Light => ({amb: mixColor(RIVER_LIGHT.day.amb, RIVER_SHADE.amb, s), k: RIVER_LIGHT.day.k + (RIVER_SHADE.k - RIVER_LIGHT.day.k) * s});

// ---- boulder B1: centre (0.75, 0, -1.35), x 0.15..1.35 (1.2 m), z -1.8..-0.9 (0.9 m deep), top y 0.95, base on the bed (y -0.3). A rough convex stone from four rings, faces culled to the lens and lit by their normal,
// moss on the shoulder, the underwater part tinted and a foam ring on the waterline. The ring corners are fixed per seed so it never shimmers between frames.
export const B1 = {at: [0.75, 0, -1.35] as V3, w: 1.2, d: 0.9, top: 0.95, base: -0.3} as const;
const RINGS: {y: number; sx: number; sz: number}[] = [{y: B1.base, sx: 0.5, sz: 0.5}, {y: 0.25, sx: 0.5, sz: 0.5}, {y: 0.7, sx: 0.4, sz: 0.38}, {y: B1.top, sx: 0.2, sz: 0.2}];
const NR = 9;
/** The ring vertices (world): `NR` per ring, jittered per vertex. Exported for the test. */
export const boulderRings = (at: V3 = B1.at, seed = 29100): V3[][] => RINGS.map((r, i) => Array.from({length: NR}, (_, j): V3 => {
  const a = (j / NR) * 6.2832 + 0.3, k = 1 + (i === 3 ? 0.1 : 0.16) * (hash(seed + i * 17 + j) - 0.5) * 2;
  return [at[0] + Math.cos(a) * r.sx * B1.w * k, r.y, at[2] + Math.sin(a) * r.sz * B1.d * 1.1 * k];
}));
export const boulderItem = (L: Light, o: {at?: V3; seed?: number} = {}): Item => {
  const at = o.at ?? B1.at, seed = o.seed ?? 29100;
  return {at: [at[0], 0, at[2] + 0.45], draw: (p: Painter, c: YCam) => {
    const R = boulderRings(at, seed), sun = [-0.4, 0.85, 0.35], stone = lit(L, RC.pebbleB), moss = lit(L, '#6f8a48');
    const faces: {pts: V3[]; n: V3; d: number; ring: number}[] = [];
    for (let i = 0; i < R.length - 1; i++) for (let j = 0; j < NR; j++) {
      const a = R[i][j], b = R[i][(j + 1) % NR], c2 = R[i + 1][(j + 1) % NR], d = R[i + 1][j];
      const ux = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], vx = [d[0] - a[0], d[1] - a[1], d[2] - a[2]];
      let n: V3 = [ux[1] * vx[2] - ux[2] * vx[1], ux[2] * vx[0] - ux[0] * vx[2], ux[0] * vx[1] - ux[1] * vx[0]];
      const m = Math.hypot(...n) || 1; n = [n[0] / m, n[1] / m, n[2] / m];
      const cx = (a[0] + b[0] + c2[0] + d[0]) / 4, cz = (a[2] + b[2] + c2[2] + d[2]) / 4, cy = (a[1] + b[1] + c2[1] + d[1]) / 4;
      if (n[0] * (cx - at[0]) + n[2] * (cz - at[2]) < 0) n = [-n[0], -n[1], -n[2]];   // outward
      if (n[0] * (c.x - cx) + n[1] * (c.y - cy) + n[2] * (c.z - cz) <= 0) continue;
      faces.push({pts: [a, b, c2, d], n, d: Math.hypot(c.x - cx, c.z - cz), ring: i});
    }
    faces.sort((x, y) => y.d - x.d).forEach((f, k) => {
      const ndl = Math.max(0, f.n[0] * sun[0] + f.n[1] * sun[1] + f.n[2] * sun[2]), tone = mixColor(stone, '#2b3a30', 0.38 * (1 - ndl) ** 1.1);
      wFill(p, c, seed + 100 + k, f.ring === 2 ? mixColor(tone, moss, 0.35) : tone, f.pts);
    });
    const top = R[3]; wFill(p, c, seed + 500, mixColor(lit(L, '#9a9a86'), moss, 0.4), top);
    // underwater tint over the first ring section, then a foam line on the waterline y 0 (a ring at the surface through ring 1)
    const wl: V3[] = R[1].map((q, j): V3 => { const q0 = R[0][j], u = (0 - q0[1]) / (q[1] - q0[1]); return [q0[0] + (q[0] - q0[0]) * u, 0.005, q0[2] + (q[2] - q0[2]) * u]; });
    const under: V3[][] = R[0].map((q0, j) => [q0, R[0][(j + 1) % NR], wl[(j + 1) % NR], wl[j]]);
    under.forEach((u, k) => { const n: V3 = [u[0][0] - at[0], 0, u[0][2] - at[2]]; if (n[0] * (c.x - u[0][0]) + n[2] * (c.z - u[0][2]) > 0) wFill(p, c, seed + 600 + k, mixColor(waterColorAt(at[2], L), stone, 0.42), u); });
    wInk(p, c, seed + 700, wl.filter((q) => (q[0] - at[0]) * (c.x - q[0]) + (q[2] - at[2]) * (c.z - q[2]) > -0.2), {closed: false, weight: 0.9, color: lit(L, RC.glint)});
    for (let j = 0; j < NR; j++) { const a = R[1][j], b = R[2][(j + 2) % NR]; if (hash(seed + 800 + j) > 0.5) wInk(p, c, seed + 810 + j, [a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 0.1, (a[2] + b[2]) / 2]], {closed: false, weight: 0.5, color: mixColor(stone, '#1c2a22', 0.55)}); }
  }};
};

// ---- reed bed RD: x -4.0..-1.5, z 0..0.9, 1.3 m tall. Tapered blades that lean and sway with `t`, a few cattail heads; villagers crouch behind it (it is drawn as one sorted item at its centre, bias just ahead of a figure at z 0.45).
export const RD = {x0: -4.0, x1: -1.5, z0: 0, z1: 0.9, h: 1.3} as const;
export const reedBlades = (n = 90, seed = 29500) => Array.from({length: n}, (_, i) => ({x: RD.x0 + (RD.x1 - RD.x0) * hash(seed + i * 3.1), z: RD.z0 + (RD.z1 - RD.z0) * hash(seed + i * 5.3 + 1), h: RD.h * (0.72 + 0.28 * hash(seed + i * 7.7 + 2)), lean: (hash(seed + i * 2.9 + 3) - 0.5) * 0.5, head: hash(seed + i * 4.3 + 4) > 0.82}));
export const reedBedItems = (L: Light, o: {t?: number; seed?: number} = {}): Item[] => {
  const seed = o.seed ?? 29500, t = o.t ?? 0, B = reedBlades(90, seed), items: Item[] = [];
  for (let k = 0; k < 6; k++) {
    const x0 = RD.x0 + ((RD.x1 - RD.x0) * k) / 6, x1 = RD.x0 + ((RD.x1 - RD.x0) * (k + 1)) / 6;
    items.push({at: [(x0 + x1) / 2, 0, RD.z1 - 0.1], draw: (p: Painter, c: YCam) => {
      B.forEach((b, i) => {
        if (b.x < x0 || b.x >= x1) return;
        const sw = 0.06 * Math.sin(t * 1.3 + i * 0.7) + b.lean, tip: V3 = [b.x + sw * b.h, b.h, b.z], mid: V3 = [b.x + sw * b.h * 0.25, b.h * 0.55, b.z], wd = 0.022;
        const col = mixColor(lit(L, i % 3 ? '#6f8a48' : '#88a05a'), lit(L, '#5a7a3e'), hash(seed + i));
        wFill(p, c, seed + 10 + i * 4, col, [[b.x - wd, 0, b.z], [mid[0] - wd * 0.7, mid[1], mid[2]], tip, [mid[0] + wd * 0.7, mid[1], mid[2]], [b.x + wd, 0, b.z]]);
        wInk(p, c, seed + 12 + i * 4, [[b.x, 0, b.z], mid, tip], {closed: false, weight: 0.3, color: lit(L, '#3f5a2e')});
        if (b.head) { const a = camPoint(c, [tip[0] - sw * 0.12, tip[1] - 0.2, tip[2]]), z = camPoint(c, tip); if (a && z) hardFill(p, seed + 14 + i * 4, lit(L, '#6a4a2c'), [[a[0] - 3, a[1]], [z[0] - 3, z[1]], [z[0] + 3, z[1]], [a[0] + 3, a[1]]]); }
      });
    }});
  }
  return items;
};

// ---- fern row FC at the forest wall: tree ferns and clumps x -4..2 at z -12.8, tops 4.5 m. `shake` (0..1) sways the fronds, `part` (0..1) slides the ferns near `centre` sideways to open a gap (the T. rex pushing through, 16C +10..+16).
// `fernRowGap` is the clear width (m) at `part`; the gap closes smoothly with distance from the centre.
export const FC = {x0: -4, x1: 2, z: -12.8, top: 4.5} as const;
export const fernRowX = (): number[] => { const xs: number[] = []; for (let x = FC.x0; x <= FC.x1 + 1e-6; x += 0.6) xs.push(Math.round(x * 100) / 100); return xs; };
export const fernShift = (x: number, part: number, centre: number): number => (x === centre ? 0.45 : Math.sign(x - centre)) * part * 1.1 * Math.exp(-Math.abs(x - centre) / 1.6);
export const fernRowItems = (L: Light, o: {t?: number; shake?: number; part?: number; centre?: number; seed?: number} = {}): Item[] => {
  const t = o.t ?? 0, sh = o.shake ?? 0, part = o.part ?? 0, ct = o.centre ?? -0.2, seed = o.seed ?? 29800;
  return fernRowX().map((x, i): Item => {
    const dx = fernShift(x, part, ct) + 0.06 * sh * Math.sin(t * 9 + i * 1.3), at: V3 = [x + dx, 0, FC.z + 0.12 * (i % 2)];
    const big = i % 3 === 0;
    return {at, draw: (p, c) => big ? paintTreeFern(p, c, at, FC.top * (0.9 + 0.1 * hash(seed + i)), L, seed + i * 7) : paintFernClump(p, c, at, 1.5 + 0.5 * hash(seed + i), L, seed + i * 7)};
  });
};

// ---- impulse rings (16B): the ground shaking sets rings spreading round EVERY solid touching the water at once (shins, net rim, stones). `ringAge` turns the frame into 0..1 over 12 f; each hit has an amplitude.
export const RING_FRAMES = 12, RING_RADIUS = 0.35;
export type Impulse = {f: number; amp: number};
/** Age 0..1 of the rings of an impulse at frame `f` (-1 before it, 2 once finished). */
export const ringAge = (f: number, imp: Impulse): number => { const a = (f - imp.f) / RING_FRAMES; return a < 0 ? -1 : a > 1 ? 2 : a; };
export const ringRadius = (age: number): number => RING_RADIUS * Math.sqrt(Math.min(1, Math.max(0, age)));
/** Pebble shimmer: world offset (m) of the bed pebbles for 4 f after a thud (about 2 px at a 0.75 m lens): alternating sign each frame, zero outside. */
export const shimmerJit = (f: number, imps: Impulse[]): number => { for (const i of imps) { const a = f - i.f; if (a >= 0 && a < 4) return 0.012 * (a % 2 ? -1 : 1) * i.amp; } return 0; };
/** Rings round each water-contact point (world points, y ignored: drawn on the plane y 0) for every live impulse. Two rings per impulse, the second 0.35 of the way behind. */
export const impulseRingsItem = (points: V3[], f: number, imps: Impulse[], L: Light): Item => ({at: [points.reduce((s, q) => s + q[0], 0) / Math.max(1, points.length), 0, Math.max(...points.map((q) => q[2]), -50) + 0.05], bias: -0.08, draw: (p: Painter, c: YCam) => {
  imps.forEach((imp, k) => {
    const age = ringAge(f, imp);
    if (age < 0 || age > 1) return;
    points.forEach((q, pi) => [0, 0.35].forEach((delay, ri) => {
      const a = (age - delay) / (1 - delay);
      if (a <= 0) return;
      const r = ringRadius(a) * Math.min(1.3, 0.75 + 0.5 * imp.amp), n = 26;
      const ring = Array.from({length: n}, (_, j) => camPoint(c, [q[0] + r * Math.cos((j / n) * 6.2832), 0.012, q[2] + r * Math.sin((j / n) * 6.2832)]));
      if (ring.every(Boolean)) inkLine(p, 29900 + k * 100 + pi * 4 + ri, ring as Pt[], {weight: (0.8 + 1.8 * imp.amp * (1 - a)) * (ri ? 0.7 : 1), color: mixColor('#ffffff', waterColorAt(q[2], L), Math.min(0.6, a * 0.7)), still: true, curve: 0.3});
    }));
  });
}});

/** Convenience: every R3 river item for one frame (B1, RD, FC, rings). */
export const riverR3Items = (L: Light, o: {t: number; shake?: number; part?: number; rings?: {points: V3[]; f: number; imps: Impulse[]}}): Item[] => [
  boulderItem(L), ...reedBedItems(L, {t: o.t}), ...fernRowItems(L, {t: o.t, shake: o.shake, part: o.part}), ...(o.rings ? [impulseRingsItem(o.rings.points, o.rings.f, o.rings.imps, L)] : []),
];
