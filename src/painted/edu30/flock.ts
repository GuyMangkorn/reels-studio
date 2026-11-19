import {hardFill} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camDist, camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintBeast, type BeastAnchors, type Build} from '../survival/beast';
import {buildEmu, EMU_POSES, type EmuPose} from './emu';

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

export type EmuPaint = {sun?: V3; shadowOp?: number; haze?: number; hazeCol?: string; amb?: string; ambK?: number};
/** Paint one emu (rig) at a world ground point. */
/** Far LOD (Film W3): below `LOD_PX` px per metre the bird drops the plumage texture cells and the soft look (a 40-bird frame timed out
 *  at 183 s with every bird at full detail); the shape and the feather flats stay. */
export const LOD_PX = 220;
const lodCache = new Map<Build, Build>();
const farBuild = (B: Build): Build => { let f = lodCache.get(B); if (!f) { f = {...B, parts: B.parts.map((q) => ({...q, tex: undefined})), look: {sub: 0, ring: 1, edge: 0.3, far: 0.2}}; lodCache.set(B, f); } return f; };
export const paintEmu = (p: Painter | null, c: YCam, m: EmuMember, o: EmuPaint = {}): BeastAnchors => {
  const B0 = emuBuild({...m.pose, hero: m.hero}), near = camUnit(c, [m.at[0], 1, m.at[2]]) >= LOD_PX;
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
