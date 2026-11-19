import {hardFill} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camDist, camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintBeast, type BeastAnchors, type Build} from '../survival/beast';
import {paintPlume} from '../kit/anchors';
import {buildEmu, emuPads, emuStartle, EMU_POSES, gaitAdvance, mixEmuPose, WING_FLAP_OUT, WING_FOLD, wingMix, type EmuPose} from './emu';

// `new: emu-flock` (VD30-05, Film W3 2026-11-19; Boss hardens the instancing): seeded members with varied phase, scale (+/-8 %), plumage tone
// and facing, one build per pose key (cached, so a 40-bird frame does not rebuild per bird), and a painted far mass for "thousands"
// (silhouettes beyond `far` m: a dark body blob, a neck stroke and a head dot, no rig).

export type EmuMember = {at: V3; heading: number; pose: EmuPose; scale: number; seed: number; hero?: boolean; /** T35: metres above the ground (a hop), body only */ air?: number};
const cache = new Map<string, Build>();
const key = (o: EmuPose) => JSON.stringify(o);
export const emuBuild = (o: EmuPose): Build => {
  const k = key(o);
  let b = cache.get(k);
  if (!b) { b = buildEmu(o); cache.set(k, b); if (cache.size > 200) cache.delete(cache.keys().next().value as string); }
  return b;
};
export const scaled = (B: Build, s: number): Build => (s === 1 ? B : {
  ...B, parts: B.parts.map((q) => ({...q, keys: q.keys.map((k) => ({p: [k.p[0] * s, k.p[1] * s, k.p[2] * s], a: k.a * s, b: k.b * s}))})),
  flats: B.flats.map((f) => ({...f, pts: f.pts.map((v) => [v[0] * s, v[1] * s, v[2] * s])})),
  joints: Object.fromEntries(Object.entries(B.joints).map(([n, v]) => [n, [v[0] * s, v[1] * s, v[2] * s]])),
  feet: B.feet.map((v) => [v[0] * s, v[1] * s, v[2] * s]),
  anchors: Object.fromEntries(Object.entries(B.anchors).map(([n, v]) => [n, [v[0] * s, v[1] * s, v[2] * s]])),
  shadow: {...B.shadow, s: B.shadow.s * s, rs: B.shadow.rs * s, rl: B.shadow.rl * s},
} as Build);

export type EmuPaint = {sun?: V3; shadowOp?: number; haze?: number; hazeCol?: string; amb?: string; ambK?: number; /** T08: force a level of detail (a field of 36 sitting birds is drawn `far`; default by px per metre) */ lod?: 'near' | 'far'};
/** Paint one emu (rig) at a world ground point. */
/** Far LOD (Film W3): below `LOD_PX` px per metre the bird drops the plumage texture cells and the soft look (a 40-bird frame timed out
 *  at 183 s with every bird at full detail); the shape and the feather flats stay. */
export const LOD_PX = 220;
const lodCache = new Map<Build, Build>();
const farBuild = (B: Build): Build => { let f = lodCache.get(B); if (!f) { f = {...B, parts: B.parts.map((q) => ({...q, tex: undefined})), look: {sub: 0, ring: 1, edge: 0.3, far: 0.2}}; lodCache.set(B, f); } return f; };
export const paintEmu = (p: Painter | null, c: YCam, m: EmuMember, o: EmuPaint = {}): BeastAnchors => {
  const B0 = emuBuild({...m.pose, hero: m.hero}), near = o.lod ? o.lod === 'near' : camUnit(c, [m.at[0], 1, m.at[2]]) >= LOD_PX;
  return paintBeast(p, c, scaled(near ? B0 : farBuild(B0), m.scale), {at: [m.at[0], m.at[2]], heading: m.heading, ground: m.at[1], air: m.air, seed: m.seed, sun: o.sun, shadowOp: o.shadowOp ?? 80, haze: o.haze, hazeCol: o.hazeCol, amb: o.amb, ambK: o.ambK});
};

const hh = (n: number) => { const s = Math.sin(n * 78.233 + 12.9898) * 43758.5453; return s - Math.floor(s); };

/** Seeded members in a box region: `mix` the share of peck / walk / stand; walk phase and facing per bird. */
export const flockIn = (seed: number, n: number, x: [number, number], z: [number, number], o: {mix?: [number, number, number]; heading?: number; spread?: number; ground?: number} = {}): EmuMember[] => {
  const [pk, wk] = o.mix ?? [0.5, 0.3, 0.2];
  return Array.from({length: n}, (_, i) => {
    const r = hh(seed + i * 3.7), ph = Math.round(hh(seed + i * 5.1) * 8) / 8, tone = Math.round((hh(seed + i * 2.9) - 0.5) * 4) / 4;
    const pose = r < pk ? EMU_POSES.peck({tone}) : r < pk + wk ? EMU_POSES.walk(ph, {tone}) : EMU_POSES.stand({tone});
    return {at: [x[0] + (x[1] - x[0]) * hh(seed + i * 1.3), o.ground ?? 0, z[0] + (z[1] - z[0]) * hh(seed + i * 7.7)], heading: (o.heading ?? hh(seed + i * 4.4) * 6.283) + (hh(seed + i * 9.2) - 0.5) * (o.spread ?? 0), pose, scale: 0.92 + 0.16 * hh(seed + i * 6.6), seed: seed * 100 + i * 997};
  });
};

/** Far painted mass: silhouettes only, in a box region beyond the rig birds. */
export const paintFarFlock = (p: Painter, c: YCam, seed: number, n: number, x: [number, number], z: [number, number], color = '#3a2f24') => {
  const pts = Array.from({length: n}, (_, i) => [x[0] + (x[1] - x[0]) * hh(seed + i * 1.9), 0, z[0] + (z[1] - z[0]) * hh(seed + i * 3.3)] as V3).sort((a, b) => camDist(c, b) - camDist(c, a));
  pts.forEach((v, i) => {
    const g = camPoint(c, v);
    if (!g) return;
    const u = camUnit(c, v), w = 0.5 * u, bh = 0.32 * u, by = g[1] - 0.82 * u, peck = hh(seed + i * 8.1) < 0.45, dir = hh(seed + i) < 0.5 ? 1 : -1, col = mixColor(color, '#5a4a38', hh(i) * 0.3);
    if (w < 0.6) return;
    hardFill(p, seed + i * 3, col, Array.from({length: 10}, (_, k) => { const a = (k / 10) * 6.283; return [g[0] + w * Math.cos(a), by + bh * Math.sin(a) * (Math.sin(a) > 0 ? 1.15 : 1)] as Pt; }));
    const hx = g[0] + dir * w * 0.85, hy = peck ? g[1] - 0.25 * u : g[1] - 1.6 * u;
    hardFill(p, seed + i * 3 + 1, col, [[g[0] + dir * w * 0.55, by - bh * 0.3], [g[0] + dir * w * 0.75, by - bh * 0.4], [hx + dir * 0.03 * u, hy], [hx - dir * 0.03 * u, hy + 0.04 * u]]);
    if (u > 6) for (const s of [-0.12, 0.1]) hardFill(p, seed + i * 3 + 2 + (s > 0 ? 1 : 0), col, [[g[0] + s * u, by + bh * 0.6], [g[0] + (s + 0.03) * u, by + bh * 0.6], [g[0] + (s + 0.03) * u, g[1]], [g[0] + s * u, g[1]]]);
  });
};

// ------------------------------------------------------------------ T08 flock motion in the paddock (pure functions of the shot-local frame L)
// Every helper returns `EmuMember[]` for frame L and keeps no state between frames (module-level memos below hold only constants derived from seeds).
// Walk/run phase comes from the distance walked (`gaitPhase` rule, stance foot static); crowd birds quantise it to 1/16 cycle (`q16`, one build per key).
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const ease = (t: number) => { const x = clamp01(t); return x * x * (3 - 2 * x); };
const easeOutQ = (t: number) => 1 - (1 - clamp01(t)) ** 2;
const mixN = (a: number, b: number, u: number) => a + (b - a) * u;
const q16 = (x: number) => Math.round(x * 16) / 16;
const rnd = (seed: number, i: number) => hh(seed * 1.7 + i * 12.9);
const angDiff = (a: number, b: number) => { let d = b - a; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };
const mixAng = (a: number, b: number, u: number) => a + angDiff(a, b) * u;
const mv = (at: V3, h: number, d: number): V3 => [at[0] + Math.cos(h) * d, at[1], at[2] + Math.sin(h) * d];
const WALK_DUTY = 0.6;
/** Gait stride (m) whose body advance per cycle is `adv` m (`gaitAdvance(S) = S / duty`). */
export const strideForAdvance = (adv: number, duty = WALK_DUTY) => adv * duty;
const WALK_S = EMU_POSES.walk(0).stride as number, RUN_S = EMU_POSES.run(0).stride as number;
const walkPose = (ph: number, S = WALK_S, o: Partial<EmuPose> = {}): EmuPose => ({...EMU_POSES.walk(ph), stride: S, ...o});
const runPose = (ph: number, o: Partial<EmuPose> = {}): EmuPose => EMU_POSES.run(ph, o);
const WING15 = wingMix(WING_FOLD, WING_FLAP_OUT, 0.15);
/** Blend two poses with both pads given so the feet follow their own gaits (no pad snap): u 0 -> a, u 1 -> b. */
export const blendPoses = (a: EmuPose, b: EmuPose, u: number): EmuPose => (u >= 1 ? b : u <= 0 ? a : mixEmuPose({...a, pads: emuPads(a)}, {...b, pads: emuPads(b)}, u));
/** Heading toward a ground point. */
const toward = (from: V3, to: V3) => Math.atan2(to[2] - from[2], to[0] - from[0]);

/** Footfall events of a walker in the last `life` frames before L: frames where a foot touches down (phase of either foot crosses an integer). */
export const footEvents = (state: (f: number) => {at: V3; heading: number; ph: number} | null, L: number, life = 12, side = 0.11) => {
  const out: {at: V3; u: number; f: number}[] = [];
  for (let f = Math.max(1, L - life); f <= L; f++) {
    const a = state(f - 1), b = state(f);
    if (!a || !b) continue;
    const k0 = Math.floor(a.ph * 2), k1 = Math.floor(b.ph * 2);
    if (k1 > k0) { const lx = Math.sin(b.heading), lz = -Math.cos(b.heading), g = k1 % 2 === 0 ? 1 : -1; out.push({at: [b.at[0] + lx * side * g, 0, b.at[2] + lz * side * g], u: (L - f) / life, f}); }
  }
  return out;
};
export const paintPuffs = (p: Painter, c: YCam, seed: number, ev: {at: V3; u: number; f: number}[], size = 0.25) => ev.forEach((e) => paintPlume(p, c, seed + e.f * 7, e.at, e.u, {size}));
/** Paint members far to near (painter's order). */
export const paintFlock = (p: Painter | null, c: YCam, ms: EmuMember[], o: EmuPaint = {}) => [...ms].sort((a, b) => camDist(c, [b.at[0], 0, b.at[2]]) - camDist(c, [a.at[0], 0, a.at[2]])).forEach((m) => paintEmu(p, c, m, o));

// ---- B01-SH02: strolling extras
export const EXTRA1_CONTACTS = {left: [4, 34], right: [19, 49]} as const;
const extraWalker = (seed: number, at0: V3, h: number, v: number, L: number, ph0: number): EmuMember => {
  const A = gaitAdvance(WALK_S), d = (v * L) / 30;
  return {at: mv(at0, h, d), heading: h, pose: walkPose(ph0 + d / A), scale: 0.92 + 0.16 * hh(seed), seed};
};
/** EMU1 (the one that pecks): 0.80 m advance per 30 f cycle, contacts left L 4/34, right L 19/49; peck blend L 30-40 over the walking legs. */
export const emu1State = (L: number) => {
  const S = strideForAdvance(0.8), ph = (L - 4) / 30, at: V3 = [6.2 - (0.8 * L) / 30, 0, -27.1], w = walkPose(ph, S);
  const u = L < 30 || L > 40 ? 0 : L < 34 ? ease((L - 30) / 4) : L <= 36 ? 1 : 1 - ease((L - 36) / 4);
  return {at, heading: Math.PI, ph, pose: u > 0 ? mixEmuPose(w, EMU_POSES.peck({walk: ph, stride: S}), u) : w, u};
};
export const paddockExtras = (L: number): EmuMember[] => {
  const e1 = emu1State(L);
  const specs: [V3, number][] = [[[5.0, 0, -24.8], 36101], [[3.6, 0, -25.6], 36102], [[7.8, 0, -23.5], 36103], [[2.4, 0, -28.0], 36104]];
  return [{at: e1.at, heading: e1.heading, pose: e1.pose, scale: 1, seed: 36100}, ...specs.map(([at0, seed]) => extraWalker(seed, at0, Math.PI + (rnd(seed, 1) - 0.5) * 2 * ((20 * Math.PI) / 180), 0.6 + 0.3 * rnd(seed, 2), L, Math.round(rnd(seed, 3) * 16) / 16))];
};

// ---- B02-SH01: the buffet row
const buffetU = (L: number, ph: number) => {
  const cyc = (l: number) => { const c = (((l + ph) % 15) + 15) % 15; return c < 5 ? ease(c / 5) : c < 8 ? 1 : 1 - ease((c - 8) / 7); };
  return L < 125 ? cyc(L) : L < 128 ? mixN(cyc(125), 0, ease((L - 125) / 3)) : L < 131 ? 0 : L < 135 ? ease((L - 131) / 4) : L < 139 ? 1 : L < 145 ? 1 - ease((L - 139) / 6) : 0;
};
export const buffetRow = (L: number): EmuMember[] => Array.from({length: 6}, (_, i) => {
  const ph = Math.floor(rnd(36010, i) * 15), u = buffetU(L, ph);
  return {at: [-3.0 + 0.8 * i, 0, -28.0 - 1.6 * i] as V3, heading: Math.PI, pose: u > 0 ? mixEmuPose(EMU_POSES.stand(), EMU_POSES.peck(), u) : EMU_POSES.stand(), scale: 0.95 + 0.1 * rnd(36010, i + 9), seed: 36010 + i};
});

// ---- B02-SH06: the field of rising heads
export const HEADS_CREW: V3 = [0.05, 0, 0.8], HEADS_CAM: V3 = [2.4, 0, -12.2], HEADS_HERO: V3 = [1.0, 0, -8.0];
const DEGR = Math.PI / 180;
/** B02-SH06 cameras at the start (eye 2.2, 1.55, -10.6) and the end of the crane (eye 2.4, 3.2, -12.2): a head must not overlap the crew's screen box at either (T08 proof row: crew bbox overlap 0 px). */
const HEADS_CAMS: YCam[] = [{x: 2.2, y: 1.55, z: -10.6, yaw: 190 * DEGR, pitch: -2 * DEGR, f: 1000, hy: 860}, {x: 2.4, y: 3.2, z: -12.2, yaw: 190 * DEGR, pitch: -16 * DEGR, f: 950, hy: 860}];
const screenBox = (c: YCam, pts: V3[]) => { const q = pts.map((v) => camPoint(c, v)); return q.every(Boolean) ? [Math.min(...q.map((v) => v![0])), Math.min(...q.map((v) => v![1])), Math.max(...q.map((v) => v![0])), Math.max(...q.map((v) => v![1]))] : null; };
const CREW_BOX = [-1.0, 1.2].flatMap((x) => [0.2, 1.4].flatMap((z) => [0, 1.9].map((y) => [x, y, z] as V3)));
const hitsCrew = (x: number, z: number, h: number) => HEADS_CAMS.some((c) => {
  const cb = screenBox(c, CREW_BOX), hx = x + Math.cos(h) * 0.42, hz = z + Math.sin(h) * 0.42, b = screenBox(c, [[x, 0.85, z], [hx, 1.7, hz], [hx + 0.12, 1.7, hz], [hx - 0.12, 1.7, hz]]);
  return !!cb && !!b && Math.min(b[2], cb[2]) + 6 > Math.max(b[0], cb[0]) && Math.min(b[3], cb[3]) + 6 > Math.max(b[1], cb[1]);
});
let headsMemo: {at: V3; g: number; side: number}[] | null = null;
const headsSeeds = () => {
  if (headsMemo) return headsMemo;
  const out: {at: V3; g: number; side: number}[] = [], ax = HEADS_CAM[0], az = HEADS_CAM[2], dx = HEADS_CREW[0] - ax, dz = HEADS_CREW[2] - az, len = Math.hypot(dx, dz);
  for (let t = 0; out.length < 36 && t < 20000; t++) {
    const x = -0.5 + 6.5 * hh(36200 + t * 1.31), z = -11 + 6 * hh(36200 + t * 2.17 + 0.5);
    const band = Math.abs((x - ax) * dz - (z - az) * dx) / len;   // distance from the sightline in the xz plane
    if (Math.hypot(x - HEADS_HERO[0], z - HEADS_HERO[2]) < 1.2 || band < 0.9) continue;
    if (out.some((q) => Math.hypot(q.at[0] - x, q.at[2] - z) < 0.7)) continue;
    const side = hh(36200 + t * 3.9) < 0.5 ? -1 : 1;
    if (hitsCrew(x, z, toward([x, 0, z], HEADS_CREW) + (side * Math.PI) / 2)) continue;
    out.push({at: [x, 0, z], g: Math.min(5, Math.floor(z + 11)), side});
  }
  return (headsMemo = out);
};
/** Head joint height of group g at local frame L: 0.60 (low) -> 1.60 over 6 f from 52 + 3 g, ease-out. */
export const headsY = (g: number, L: number) => mixN(0.6, 1.6, easeOutQ((L - (52 + 3 * g)) / 6));
export const headsField = (L: number): EmuMember[] => headsSeeds().map((s, i) => {
  const dir = toward(s.at, HEADS_CREW);
  return {at: s.at, heading: dir + (s.side * Math.PI) / 2, pose: EMU_POSES.stand({bob: -0.55, pads: [[0, 0, 0.12], [0, 0, -0.12]], head: [0.42, headsY(s.g, L), 0]}), scale: 0.92 + 0.16 * rnd(36200, i + 50), seed: 36200 + i * 7};
});

// ---- B03-SH01 / SH02: scatter and burst
export const SC_CAM: V3 = [0.4, 1.0, 1.65], SC_TARGET: V3 = [12, 0, -32];
type ScBird = {m: EmuMember; clump: number; s: number; d: number; C: V3; P1: V3; hb: number; hr: number; v: number; ph0: number};
let scMemo: ScBird[] | null = null;
const scBirds = (): ScBird[] => {
  if (scMemo) return scMemo;
  const F1 = flockIn(31000, 40, [-30, 30], [-60, -30], {mix: [0.5, 0, 0.5]});
  const byX = F1.map((_, i) => i).sort((a, b) => F1[a].at[0] - F1[b].at[0]), clumpOf: number[] = [];
  byX.forEach((i, r) => { clumpOf[i] = Math.floor(r / 10); });
  const C: V3[] = [0, 1, 2, 3].map((k) => { const mem = F1.filter((_, i) => clumpOf[i] === k); return [mem.reduce((s, m) => s + m.at[0], 0) / mem.length, 0, mem.reduce((s, m) => s + m.at[2], 0) / mem.length] as V3; });
  const dCam = (i: number) => Math.hypot(F1[i].at[0] - SC_CAM[0], F1[i].at[2] - SC_CAM[2]), dTgt = (i: number) => Math.hypot(F1[i].at[0] - SC_TARGET[0], F1[i].at[2] - SC_TARGET[2]);
  const byD = F1.map((_, i) => i).sort((a, b) => dCam(a) - dCam(b)), dRank: number[] = [];
  byD.forEach((i, r) => { dRank[i] = r / 39; });
  const axes = [Math.PI + 0.35, Math.PI, 0, 0.35];   // clump 0 angled away from the lens (-z), 3 toward it (+z); 0, 1 run -x, 2, 3 run +x
  const hero = F1.map((_, i) => i).sort((a, b) => dTgt(a) - dTgt(b))[0];
  return (scMemo = F1.map((m0, i) => {
    const k = clumpOf[i], P1: V3 = [m0.at[0] + (C[k][0] - m0.at[0]) * 0.35, 0, m0.at[2] + (C[k][2] - m0.at[2]) * 0.35], dist = Math.hypot(P1[0] - m0.at[0], P1[2] - m0.at[2]);
    const m: EmuMember = i === hero ? {...m0, hero: true, seed: 36000, scale: 1} : m0;
    return {m, clump: k, s: Math.max(0, Math.min(2, Math.round(2 * (0.6 * dRank[i] + 0.4 * rnd(31001, i))))), d: Math.floor(rnd(31002, i) * 7), C: C[k], P1,
      hb: dist > 0.05 ? toward(m0.at, P1) : m0.heading, hr: axes[k] + (rnd(31003, i) - 0.5) * 2 * ((25 * Math.PI) / 180), v: dist / (28 / 30), ph0: Math.round(rnd(31004, i) * 16) / 16};
  }));
};
export const scatterHero = () => scBirds().findIndex((b) => b.m.hero);
const runDist = (f: number) => (f <= 0 ? 0 : f <= 6 ? (f * f) / 60 : 0.6 + 0.2 * (f - 6));
type ScState = {at: V3; heading: number; pose: EmuPose; ph?: number};
const scState = (b: ScBird, L: number): ScState => {
  const m = b.m, ts = 4 + b.s, tb = 40 + b.d, adv = gaitAdvance(b.v > 1.5 ? RUN_S : WALK_S), Ar = gaitAdvance(RUN_S);
  const bunchPose = (l: number): EmuPose => { const d = (b.v * (l - 10)) / 30; return b.v > 1.5 ? runPose(q16(b.ph0 + d / adv), {wing: WING15}) : walkPose(q16(b.ph0 + d / adv), WALK_S, {wing: WING15}); };
  if (L < ts) return {at: m.at, heading: m.heading, pose: m.pose};
  if (L < 10) return {at: m.at, heading: m.heading, pose: emuStartle(L - ts, m.pose)};
  if (L <= 38) { const d = (b.v * (L - 10)) / 30, tgt = bunchPose(L); return {at: mv(m.at, b.hb, d), heading: mixAng(m.heading, b.hb, ease((L - 10) / 3)), pose: blendPoses(emuStartle(10 - ts, m.pose), tgt, ease((L - 10) / 3)), ph: tgt.walk}; }
  const pEnd = mv(m.at, b.hb, (b.v * 28) / 30), alert = EMU_POSES.startle({pads: emuPads(EMU_POSES.stand()), wing: WING15});
  if (L < tb) return {at: pEnd, heading: b.hb, pose: alert};
  const f = L - tb, D = runDist(f), ph = q16(b.ph0 + D / Ar);
  return {at: mv(pEnd, b.hr, D), heading: mixAng(b.hb, b.hr, ease(f / 4)), pose: blendPoses(alert, runPose(ph, {wing: WING15}), ease(f / 3)), ph};
};
export const scatter = (L: number): EmuMember[] => scBirds().map((b) => { const s = scState(b, L); return {...b.m, at: s.at, heading: s.heading, pose: s.pose}; });
/** Six burst directions: 15 deg + 60 deg k. */
export const BURST_HEADINGS = [0, 1, 2, 3, 4, 5].map((k) => ((15 + 60 * k) * Math.PI) / 180);
let burstMemo: {g: number[]; speed: number[]; base: ScState[]; heroGroup: number[]} | null = null;
const burstSeeds = () => {
  if (burstMemo) return burstMemo;
  const bs = scBirds(), base = bs.map((b) => scState(b, 71)), hero = scatterHero();
  const dT = (i: number) => Math.hypot(base[i].at[0] - SC_TARGET[0], base[i].at[2] - SC_TARGET[2]);
  const heroGroup = [hero, ...base.map((_, i) => i).filter((i) => i !== hero).sort((a, b) => dT(a) - dT(b)).slice(0, 10)];
  const nearest = (h: number) => { let bk = 0, bd = 9; BURST_HEADINGS.forEach((x, k) => { const d = Math.abs(angDiff(x, h)); if (d < bd) { bd = d; bk = k; } }); return bk; };
  const g = base.map((s, i) => (heroGroup.includes(i) ? nearest(toward(s.at, SC_TARGET)) : nearest(s.heading + (rnd(36400, i) - 0.5) * 2 * (Math.PI / 3))));
  return (burstMemo = {g, speed: base.map((_, i) => 6 + 2 * rnd(36401, i)), base, heroGroup});
};
export const burstHeroGroup = (): number[] => burstSeeds().heroGroup;
export const burstGroups = (): number[] => burstSeeds().g;
const burstHeading = (i: number) => { const sd = burstSeeds(); return sd.heroGroup.includes(i) ? toward(sd.base[i].at, SC_TARGET) : BURST_HEADINGS[sd.g[i]]; };
export const burst = (L: number): EmuMember[] => {
  const sd = burstSeeds(), bs = scBirds(), Ar = gaitAdvance(RUN_S);
  return sd.base.map((s, i) => {
    const h = burstHeading(i), d = (sd.speed[i] * L) / 30, ph = q16((s.ph ?? 0) + d / Ar);
    return {...bs[i].m, at: mv(s.at, h, d), heading: mixAng(s.heading, h, ease(L / 4)), pose: runPose(ph, {wing: WING15})};
  });
};
/** Dust trail behind each burst group: three puffs behind the group centroid, per frame. */
export const paintBurstDust = (p: Painter, c: YCam, L: number) => {
  const sd = burstSeeds(), ms = burst(L);
  for (let k = 0; k < 6; k++) {
    const idx = ms.map((_, i) => i).filter((i) => sd.g[i] === k);
    if (!idx.length) continue;
    const cx = idx.reduce((s, i) => s + ms[i].at[0], 0) / idx.length, cz = idx.reduce((s, i) => s + ms[i].at[2], 0) / idx.length, h = BURST_HEADINGS[k];
    for (let j = 0; j < 3; j++) paintPlume(p, c, 36500 + k * 31 + j * 5, [cx - Math.cos(h) * (1.2 + 1.6 * j), 0, cz - Math.sin(h) * (1.2 + 1.6 * j)], 0.2 + 0.25 * j + ((L * 0.02) % 0.1), {size: 1.1 + 0.4 * j});
  }
};

// ---- B03-SH03: the split by halves
export const HALVES_HERO: V3 = [12.0, 0, -32.0];
const HALF_SPEED = 5.5;
const halfD = (f: number) => (f <= 0 ? 0 : f <= 4 ? (HALF_SPEED * f * f) / (8 * 30) : 0.3667 + (HALF_SPEED / 30) * (f - 4));
const halfState = (i: number, L: number) => {
  const left = i < 5, j = left ? i : i - 5, row = j % 2, x0 = (left ? 10.4 : 12.1) + (1.5 * j) / 4;
  const at0: V3 = [x0, 0, (row ? -35.0 : -33.5) + (rnd(36300, i) - 0.5) * 0.8], t0 = (left ? 7 : 23) + Math.floor(rnd(36301, i) * 4), f = L - t0, hT = left ? Math.PI : 0, D = halfD(f);
  return {at: mv(at0, hT, D), heading: f > 0 ? mixAng(Math.PI / 2, hT, ease(f / 3)) : Math.PI / 2, ph: f > 0 ? D / gaitAdvance(RUN_S) : 0, f, hT};
};
export const halves = (L: number): EmuMember[] => Array.from({length: 10}, (_, i) => {
  const s = halfState(i, L), stand = EMU_POSES.stand();
  return {at: s.at, heading: s.heading, pose: s.f > 0 ? blendPoses(stand, runPose(s.ph), ease(s.f / 3)) : stand, scale: 0.94 + 0.12 * rnd(36300, i + 20), seed: 36300 + i};
});
export const halvesDust = (p: Painter, c: YCam, L: number) => Array.from({length: 10}, (_, i) => i).forEach((i) => paintPuffs(p, c, 36600 + i * 13, footEvents((f) => { const s = halfState(i, f); return s.f > 0 ? {at: s.at, heading: s.hT, ph: s.ph} : null; }, L, 10), 0.25));

// ---- B05-SH03/SH04, B06-SH03/SH04: fence birds
export const FENCE_Z = 6.0, FENCE_GAP = 0.08;
let frontMemo: number | null = null;
/** The build's maximum creature x at stand (metres at scale 1), measured once. */
export const emuFront = (): number => {
  if (frontMemo !== null) return frontMemo;
  const B = emuBuild(EMU_POSES.stand());
  let mx = -9;
  B.parts.forEach((q) => q.keys.forEach((k) => { mx = Math.max(mx, k.p[0]); }));
  B.flats.forEach((f) => f.pts.forEach((v) => { mx = Math.max(mx, v[0]); }));
  return (frontMemo = mx);
};
export const fenceCountB06 = (L: number) => (L >= 90 ? 9 : L >= 82 ? 8 : L >= 74 ? 7 : L >= 66 ? 6 : 5);
export const fenceBirds = (o: {n?: number; truck?: V3; heroFrozen?: boolean} = {}): EmuMember[] => {
  const n = o.n ?? 5, zf = FENCE_Z - FENCE_GAP - emuFront(), zb = zf - 0.5;
  const spec: {x: number; z: number; hero?: boolean}[] = [{x: -0.5, z: Math.min(5.3, zf), hero: true}, {x: -1.4, z: zf}, {x: 0.5, z: zf}, {x: 1.4, z: zf}, {x: 0.95, z: zb}, {x: -1.0, z: zb}, {x: 1.9, z: zf}, {x: -1.9, z: zf}, {x: 0.0, z: zb}];
  return spec.slice(0, n).map((s, i) => {
    const at: V3 = [s.x, 0, s.z], h = Math.PI / 2;
    let yaw = 0;
    if (o.truck && !(s.hero && o.heroFrozen)) { const d = angDiff(h, toward(at, o.truck)); yaw = Math.max(-0.3, Math.min(0.3, -d * 0.3)); }
    return {at, heading: h, pose: yaw ? EMU_POSES.stand({headYaw: yaw}) : EMU_POSES.stand(), scale: 1, seed: s.hero ? 36000 : 36700 + i * 11, hero: s.hero};
  });
};

// ---- B06-SH01: the slow line
export const SLOW_X = [-4.6, -3.0, -1.4, 0.6, 2.2], SLOW_HERO = 2, SLOW_PERIOD = 42, SLOW_V = 0.22;
const SLOW_OFF = [7, 19, 12, 31, 41];   // first contact frame per bird (the hero's is L 12)
const SLOW_S = strideForAdvance((SLOW_V * SLOW_PERIOD) / 30);
const slowState = (i: number, L: number) => {
  const Lc = i === SLOW_HERO ? Math.min(L, 109) : L;
  return {at: [SLOW_X[i], 0, -4.6 + (SLOW_V * Lc) / 30] as V3, heading: Math.PI / 2, ph: (Lc - SLOW_OFF[i]) / SLOW_PERIOD};
};
export const slowLine = (L: number): EmuMember[] => SLOW_X.map((_, i) => {
  const s = slowState(i, L);
  let pose = walkPose(s.ph, SLOW_S);
  if (i === SLOW_HERO && L > 100) {   // the stop: the swinging right foot comes down beside the left by L 109
    const u = ease((Math.min(L, 109) - 100) / 9), pl = emuPads(pose)[0], pr0 = emuPads(walkPose((100 - SLOW_OFF[i]) / SLOW_PERIOD, SLOW_S))[1];
    pose = {...pose, pads: [pl, [mixN(pr0[0], pl[0], u), 0.06 * Math.sin(Math.PI * u), -0.11]]};
  }
  return {at: s.at, heading: s.heading, pose, scale: i === SLOW_HERO ? 1 : 0.94 + 0.1 * rnd(36800, i), seed: i === SLOW_HERO ? 36000 : 36800 + i * 3, hero: i === SLOW_HERO};
});
export const slowDust = (p: Painter, c: YCam, L: number) => SLOW_X.forEach((_, i) => paintPuffs(p, c, 36900 + i * 17, footEvents((f) => { const s = slowState(i, f); return f > 0 && (i !== SLOW_HERO || f < 109) ? {at: s.at, heading: s.heading, ph: s.ph} : null; }, L, 12), 0.25));
