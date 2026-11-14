import {hardFill} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor} from '../kit/painter';
import {paintSkyBands, paintSkyDisc} from '../kit/sky';
import {qy, wFill, wInk, wp, type Item} from '../kit/world';
import {camPoint} from '../kit/ycam';
import {cardAt, cell, cp, cps, lit, type Light, type Painter, type Pt, type V3, type YCam} from './core';

// ENV-SKY day/night cycle and paddy growth stages (N16-20, EDU-EP16 shot 12; Boss, 14 Nov 2026; the paddy stages promote Editor's local `paddyItem` of shots.tsx).
// A cycle runs day 55 %, dusk 10 %, night 25 %, dawn 10 % as one continuous colour ramp (no frame switch). Night floor: the sky mid-band luma never drops below
// `NIGHT_FLOOR` (0.35): a navy with stars, never black. Seven cycles of 18, 16, 14, 14, 12, 12, 10 f end in day at +96 and hold gold.

export const CYCLE_SPLIT = {day: 0.55, dusk: 0.1, night: 0.25, dawn: 0.1} as const;
export const NIGHT_FLOOR = 0.35;
export const SHOT12_CYCLES = [18, 16, 14, 14, 12, 12, 10] as const;
export type CyclePhase = 'day' | 'dusk' | 'night' | 'dawn';
const sm = (x: number) => { const t = Math.max(0, Math.min(1, x)); return t * t * (3 - 2 * t); };
const luma = (hex: string) => { const n = parseInt(hex.slice(1), 16); return (0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255; };
export const colorLuma = luma;

export type CycleAt = {cycle: number; /** 0..1 inside this cycle (0 = start of the day) */ u: number; /** the shot's overall progress in cycles (cycle + u) */ at: number; hold: boolean};
/** Where frame `f` (0 at the start of the shot) falls: cycle index, position inside it. After the last cycle the state holds at the start of day (`hold`). */
export const cycleAt = (f: number, cycles: readonly number[] = SHOT12_CYCLES): CycleAt => {
  let a = 0;
  for (let i = 0; i < cycles.length; i++) { if (f < a + cycles[i]) return {cycle: i, u: (f - a) / cycles[i], at: i + (f - a) / cycles[i], hold: false}; a += cycles[i]; }
  return {cycle: cycles.length - 1, u: 1, at: cycles.length, hold: true};
};
export const phaseOf = (u: number): CyclePhase => (u < 0.55 ? 'day' : u < 0.65 ? 'dusk' : u < 0.9 ? 'night' : 'dawn');
/** 0 (deepest night) .. 1 (full day), continuous: the day edge ramps over dusk and dawn. */
export const daylight = (u: number): number => {
  const w = ((u % 1) + 1) % 1;
  if (w < 0.55) return 1;
  if (w < 0.65) return 1 - sm((w - 0.55) / 0.1);
  if (w < 0.9) return 0;
  return sm((w - 0.9) / 0.1);
};

const DAY = {from: '#a9c4c8', via: '#cfdcc4', to: '#e8e6c8'}, GOLD = {from: '#c4a8a0', via: '#f0c890', to: '#f8dc9c'}, DUSK = {from: '#7a6aa0', via: '#e8a878', to: '#f4c890'}, NIGHT = {from: '#34497e', via: '#4a62a0', to: '#6f86b8'};
export type SkyColors = {from: string; via: string; to: string; stars: number; light: Light};
/** Sky ramp colours, star strength and the ground Light for cycle position `u` (and `gold` 0..1 pushes the day toward the held golden light). */
export const skyColorsAt = (u: number, gold = 0): SkyColors => {
  const w = ((u % 1) + 1) % 1, d = daylight(u);
  // warm tint at the edges of day: peaks mid-dusk and mid-dawn
  const warm = w >= 0.55 && w < 0.9 ? Math.sin(Math.PI * Math.min(1, (w - 0.55) / 0.1)) : w >= 0.9 ? Math.sin(Math.PI * (1 - (w - 0.9) / 0.1)) : 0;
  const day = (k: 'from' | 'via' | 'to') => mixColor(DAY[k], GOLD[k], Math.max(gold, 0));
  const pick = (k: 'from' | 'via' | 'to') => mixColor(mixColor(NIGHT[k], day(k), d), DUSK[k], warm * 0.8 * (1 - Math.abs(d - 0.5) * 0.5));
  const light: Light = {amb: mixColor('#34497e', '#d6e2c8', d), k: 0.5 - 0.4 * d};
  return {from: pick('from'), via: pick('via'), to: pick('to'), stars: Math.max(0, 1 - d * 2.2), light: {amb: mixColor(light.amb, '#e8b890', warm * 0.25), k: light.k}};
};
/** Sun parameter 0..1 across the sky for cycle position `w` (dawn edge w 0.9 = 0, dusk end w 0.65 = 1), or null when it is below the horizon. */
export const sunParam = (u: number): number | null => { const w = ((u % 1) + 1) % 1; if (w >= 0.65 && w < 0.9) return null; return ((w >= 0.9 ? w - 1 : w) + 0.1) / 0.75; };
/** Moon parameter 0..1 (rises at w 0.6, sets at w 1.0), or null by day. */
export const moonParam = (u: number): number | null => { const w = ((u % 1) + 1) % 1; return w >= 0.6 ? (w - 0.6) / 0.4 : null; };
/** Sun / moon screen positions (picture px) for cycle position `u`: both cross the sky left to right on an arc; `vis` 0..1 fades them in at the horizon. `hy` = horizon. */
export const bodiesAt = (u: number, hy: number): {sun: {x: number; y: number; vis: number}; moon: {x: number; y: number; vis: number}} => {
  const arc = (k: number, top: number) => ({x: 120 + 840 * k, y: hy - 40 - top * Math.sin(Math.PI * k)});
  const sk = sunParam(u), mk = moonParam(u);
  return {
    sun: sk === null ? {x: 0, y: 0, vis: 0} : {...arc(sk, 560), vis: Math.min(1, sm(Math.min(sk, 1 - sk) * 10))},
    moon: mk === null ? {x: 0, y: 0, vis: 0} : {...arc(mk, 520), vis: Math.min(1, sm(Math.min(mk, 1 - mk) * 10))},
  };
};

/** Paint the sky of cycle position `u` (bands, stars, sun, moon) and return its Light for the ground and the cast. `t` seconds (star twinkle). Replaces `paintVillage`'s fixed sky via `VilOpts.sky`. */
export const paintSkyCycle = (p: Painter, c: YCam, u: number, o: {t?: number; gold?: number; seed?: number} = {}): Light => {
  const sc = skyColorsAt(u, o.gold ?? 0), seed = o.seed ?? 9400, t = o.t ?? 0;
  paintSkyBands(p, {from: sc.from, via: sc.via, to: sc.to, horizon: c.hy + 40, width: 1080, viaAt: 0.55, bands: 10, style: 'flat', seed: seed});
  if (sc.stars > 0.02) for (let i = 0; i < 70; i++) {
    const x = hash(seed + i) * 1080, y = hash(seed + i * 3.7) * (c.hy - 140), r = (1.2 + 1.8 * hash(seed + i * 9.1)) * (0.7 + 0.3 * Math.sin(t * 3 + i)) * sc.stars;
    if (r > 0.6) hardFill(p, seed + 10 + i, mixColor(sc.to, i % 7 ? '#dfe8ff' : '#fff2c8', sc.stars), cell({g: [x, y], u: 1, s: 1}, 0, 0, r, r, 6));
  }
  const b = bodiesAt(u, c.hy);
  if (b.sun.vis > 0.02) paintSkyDisc(p, {x: b.sun.x, y: b.sun.y, r: 54, color: mixColor(sc.to, '#fff6d0', b.sun.vis), glow: 0.7 * b.sun.vis, glowColor: '#ffe8a0', seed: seed + 200});
  if (b.moon.vis > 0.02) paintSkyDisc(p, {x: b.moon.x, y: b.moon.y, r: 34, color: mixColor(sc.via, '#f2ecd8', b.moon.vis), glow: 0.5 * b.moon.vis, glowColor: '#9fb0d8', seed: seed + 210});
  return sc.light;
};
/** Fence-post shadows on the ground that sweep with the sun: one item for the posts at (x, z); the shadow lies away from the sun, long near dawn and dusk, short at noon. `u` cycle position. */
export const postShadowItem = (posts: [number, number][], u: number, height = 1.2, seed = 9600): Item => ({at: [0, 0, 0], bias: 400, draw: (p, c) => {
  const sk = sunParam(u), d = daylight(u);
  if (sk === null || d < 0.05) return;
  const ang = Math.PI * sk, len = height * (0.4 + 1.6 * Math.abs(Math.cos(ang))), dx = -Math.cos(ang) * len, dz = 0.35 * len;
  posts.forEach(([x, z], i) => {
    const q = wp(c, [[x - 0.06, 0.005, z], [x + 0.06, 0.005, z], [x + 0.06 + dx, 0.005, z + dz], [x - 0.06 + dx, 0.005, z + dz]]);
    if (q.length > 2) hardFill(p, seed + i, mixColor('#55683e', '#1c2616', 0.45 * d), q);
  });
}});

// ------------------------------------------------------------------ paddy growth stages
export const PADDY_STAGES = ['mud', 'seedlings', 'green', 'tall-green', 'gold'] as const;
export type PaddyStageId = (typeof PADDY_STAGES)[number];
/** Stage by calendar day of the shot (7 days): mud, mud, seedlings, green, green, tall green, gold. */
export const PADDY_BY_DAY: PaddyStageId[] = ['mud', 'mud', 'seedlings', 'green', 'green', 'tall-green', 'gold'];
const PS = {
  ground: ['#7a6648', '#7a6a4a', '#6a7a46', '#5f7a3a', '#a89848'], plant: ['#5f9a3c', '#9fc060', '#6fa43e', '#4f8a30', '#d8b840'], plantDark: ['#3f6a28', '#6f9a3e', '#4a7a2c', '#386a22', '#a88a28'],
  height: [0, 0.14, 0.42, 0.85, 0.95],
};
/** Interpolated stage number (0..4) from a fractional index into PADDY_BY_DAY (e.g. day 2.5 = halfway seedlings to green). */
export const paddyStageAt = (day: number): number => {
  const i = Math.max(0, Math.min(PADDY_BY_DAY.length - 1, day)), a = Math.floor(i), b = Math.min(PADDY_BY_DAY.length - 1, a + 1), f = i - a;
  const sa = PADDY_STAGES.indexOf(PADDY_BY_DAY[a]), sb = PADDY_STAGES.indexOf(PADDY_BY_DAY[b]);
  return sa + (sb - sa) * f;
};
const stageLerp = ((arr: readonly string[] | readonly number[], s: number, col: boolean): string | number => {
  const i = Math.max(0, Math.min(arr.length - 1, s)), a = Math.floor(i), b = Math.min(arr.length - 1, a + 1), f = i - a;
  return col ? mixColor(arr[a] as string, arr[b] as string, f) : (arr[a] as number) + ((arr[b] as number) - (arr[a] as number)) * f;
}) as {(arr: readonly string[], s: number, col: true): string; (arr: readonly number[], s: number, col: false): number};
export const paddyHeight = (s: number): number => stageLerp(PS.height, s, false);
export const PADDY_AREA = {x0: 12, x1: 30, z0: -8, z1: 8};
/** Paddy at (fractional) stage `s` 0..4 as sorted items: the ground (mud and shine, then plant colour) and one clump per `spacing` m (so people standing in the paddy sort correctly); `L` the Light, `t` seconds (wind sway). */
export const paddyStageItems = (s: number, L: Light, o: {t?: number; spacing?: number; seed?: number; max?: number} = {}): Item[] => {
  const sp = o.spacing ?? 0.62, seed = o.seed ?? 50000, t = o.t ?? 0, h = paddyHeight(s), A = PADDY_AREA;
  const gcol = lit(L, stageLerp(PS.ground, s, true)), pcol = lit(L, stageLerp(PS.plant, s, true)), dcol = lit(L, stageLerp(PS.plantDark, s, true));
  const items: Item[] = [{at: [21, 0, 0], bias: 500, draw: (p, c) => {
    wFill(p, c, seed, gcol, qy(0.03, A.x0, A.x1, A.z0, A.z1));
    if (s < 1.2) for (let i = 0; i < 14; i++) { const x = A.x0 + (A.x1 - A.x0) * hash(seed + 10 + i), z = A.z0 + (A.z1 - A.z0) * hash(seed + 30 + i), q = wp(c, [[x, 0.035, z], [x + 1.6, 0.035, z + 0.05], [x + 1.4, 0.035, z + 0.4], [x - 0.1, 0.035, z + 0.3]]); if (q.length > 2) hardFill(p, seed + 60 + i, lit(L, '#b6c8c0', -0.1 + 0.2 * (1 - s)), q); }   // water shine on the mud
  }}];
  if (h < 0.05) return items;
  const nx = Math.floor((A.x1 - A.x0) / sp), nz = Math.floor((A.z1 - A.z0) / sp);
  for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) {
    const x = A.x0 + (i + 0.5 + 0.3 * (hash(seed + i * 77 + j) - 0.5)) * sp, z = A.z0 + (j + 0.5 + 0.3 * (hash(seed + i + j * 91) - 0.5)) * sp;
    if (o.max && Math.hypot(x - 15, z) > o.max) continue;
    items.push({at: [x, 0, z], draw: (p, c) => {
      const k = cardAt(c, [x, 0.03, z]);
      if (!k || k.u * h < 2 || k.g[0] < -120 || k.g[0] > 1200) return;
      const hh = h * (0.85 + 0.3 * hash(seed + i * 13 + j * 7)), sw = 0.03 * Math.sin(t * 1.6 + x * 0.7 + z * 0.4) * (0.4 + h), blades = s > 3.4 ? 5 : 4, w = (0.04 + 0.05 * hh) / 1;
      for (let b = 0; b < blades; b++) {
        const a = ((b / (blades - 1)) - 0.5) * 2, tipx = a * 0.1 * (0.5 + hh) + sw * hh, tipy = hh * (0.8 + 0.2 * (1 - Math.abs(a))), col = b % 2 ? pcol : dcol;
        hardFill(p, seed + 100000 + (i * 97 + j) * 8 + b, col, cps(k, [[a * w - 0.012, 0], [a * w + 0.012, 0], [tipx + 0.004, tipy], [tipx - 0.004, tipy]]));
      }
      if (s > 3.6) {   // gold: nodding heads (a short bent grain strand per blade)
        const g = Math.min(1, (s - 3.6) / 0.4);
        hardFill(p, seed + 200000 + i * 97 + j, lit(L, '#e8c850'), cps(k, [[sw * hh - 0.01, hh * 0.92], [sw * hh + 0.1 * g, hh * 0.86], [sw * hh + 0.15 * g, hh * 0.7], [sw * hh + 0.12 * g, hh * 0.68], [sw * hh + 0.06 * g, hh * 0.8], [sw * hh + 0.01, hh * 0.88]]));
      }
    }});
  }
  return items;
};
/** Number of items and the plant height at stage `s`, for tests. */
export const paddyInfo = (s: number, L: Light) => ({height: paddyHeight(s), items: paddyStageItems(s, L).length});
void cp; void wInk; void camPoint;
export type {V3, Pt};
