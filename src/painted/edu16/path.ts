import {capsule, ell, hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {paintSkyBands, paintSkyDisc} from '../kit/sky';
import type {V3} from '../kit/space';
import {flatCircle, paintBox, qy, qz, wFill, wInk, wp, wWash, type Item} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {C, NEST, WIRE_Z, wireY, type Season} from './palette';

// `new: SET-PATH16` (brief "Set plan - SET-PATH16", N3/N7; look by Film at W3, Boss builds the shots on it). A Pacific-Northwest campus path:
// concrete path, lawns, a row of big-leaf maples with the nest tree NT, one utility wire on wooden poles, black lamp posts, bench, trash can,
// bike rack, two Douglas firs and a red-brick hall. One set with a season/time state (`day0` = spring morning, summer, autumn, winter, `later`
// = spring years later, `dusk`). Paint order: `paintPathBack` (sky, far layer, ground) then the depth-sorted items from `pathItems` together with
// the shot's people and crows (kit `paintSorted`).

export type PathState = {season: Season; t: number; /** Leaf density multiplier on the season's (dusk states 2-3 thin the canopy; default 1). */ leaf?: number; /** Nest: 'day0' full, 'empty' broken (winter), 'rebuilt' (later), 'none'. */ nest?: 'full' | 'empty' | 'rebuilt' | 'none'; lamps?: number};

const SKY: Record<Season, {from: string; to: string; via?: string}> = {
  spring: {from: C.skyTop, to: C.skyHor}, bud: {from: '#b3c6d0', to: '#e6e8dc'}, later: {from: C.skyTop, to: C.skyHor},
  summer: {from: '#86b9dc', to: '#f1f0e0'}, autumn: {from: '#a3bccc', to: '#f2d9ae'}, winter: {from: '#aab3ba', to: '#d9dcda'},
  dusk: {from: C.duskTop, via: C.duskMid, to: C.duskHor},
};
type Fol = {base: string; shade: string; lit: string; amt: number; extra?: string[]};
const FOL: Record<Season, Fol> = {
  spring: {base: C.leaf, shade: C.leafShade, lit: C.leafLit, amt: 0.85}, bud: {base: '#a9c46a', shade: '#7a8a4e', lit: '#cfe08a', amt: 0.16}, later: {base: C.leaf, shade: C.leafShade, lit: C.leafLit, amt: 0.9},
  summer: {base: C.leafSummer, shade: '#2f5226', lit: '#86ad55', amt: 1},
  autumn: {base: C.autumn1, shade: C.autumn2, lit: C.autumn3, amt: 0.75},
  winter: {base: C.bare, shade: C.bare, lit: C.bare, amt: 0},
  dusk: {base: '#4a5a44', shade: '#2f3a34', lit: '#7a6a58', amt: 0.95},
};
/** Season / dusk tone on set colours (dusk: toward a violet shade; winter: a little greyer). */
export const tone = (s: Season, col: string) => (s === 'dusk' ? mixColor(col, '#3e3550', 0.5) : s === 'winter' ? mixColor(col, '#9aa3ab', 0.22) : s === 'autumn' ? mixColor(col, '#e3b273', 0.08) : col);

/** Horizon y in the picture for the camera (a far point at eye height straight ahead). */
export const horizonY = (c: YCam) => {
  const q = camPoint(c, [c.x + Math.sin(c.yaw) * 5000, c.y, c.z - Math.cos(c.yaw) * 5000]);
  return q ? q[1] : c.hy;
};

// ---- back layer: sky, sun, firs, hall, ground, path
export const paintPathBack = (p: Painter, c: YCam, s: PathState) => {
  const S = s.season, hz = horizonY(c), sky = SKY[S];
  paintSkyBands(p, {from: sky.from, to: sky.to, via: sky.via, viaAt: 0.5, horizon: Math.min(2200, hz + 40), width: 1080, bands: 26});
  // sun low in the east (-x) in the morning; the dusk glow sits behind the hall (west-ish, the far side)
  const sunAt: V3 = S === 'dusk' ? [c.x + 40, c.y + 4, c.z - 400] : [c.x - 300, c.y + (S === 'summer' ? 260 : 110), c.z - 150];
  const sq = camPoint(c, sunAt);
  if (sq && S !== 'winter') paintSkyDisc(p, {x: sq[0], y: sq[1], r: S === 'dusk' ? 50 : 34, color: S === 'dusk' ? '#ffd9a0' : C.sun, glow: S === 'dusk' ? 0.9 : 0.6, seed: 7210});
  // far firs and the hall
  for (const [i, [x, z, h]] of ([[-26, -16, 25], [-22, -18, 23], [30, -30, 20]] as [number, number, number][]).entries()) paintFir(p, c, [x, 0, z], h, S, 30100 + i * 20);
  paintHall(p, c, S);
  // ground: far lawn, near lawn, path, kerbs, joints, leaf stains, dappled shade
  wFill(p, c, 30300, tone(S, S === 'winter' ? '#8f9a78' : C.lawnFar), qy(0, -80, 80, -24, -1.25));
  wFill(p, c, 30301, tone(S, S === 'winter' ? '#87926f' : C.lawn), qy(0, -80, 80, 1.25, 40));
  wWash(p, c, 30302, tone(S, C.lawnShade), 110, qy(0.001, -80, 80, -6.5, -1.25), 0.15, 0.3);
  for (let i = 0; i < 18; i++) { // mown stripes / worn grass marks on the near lawn
    const x = -40 + i * 4.6 + 2 * hash(30310 + i), z = 2 + 10 * hash(30330 + i);
    wWash(p, c, 30350 + i, tone(S, i % 2 ? C.lawnShade : C.leafLit), 60, [[x, 0.002, z], [x + 2.4, 0.002, z], [x + 2.6, 0.002, z + 0.5], [x + 0.2, 0.002, z + 0.5]], 0.2, 0.4);
  }
  wFill(p, c, 30400, tone(S, C.path), qy(0.01, -60, 60, -1.2, 1.2));
  wFill(p, c, 30401, tone(S, C.joint), qy(0.011, -60, 60, -1.25, -1.2));
  wFill(p, c, 30402, tone(S, C.joint), qy(0.011, -60, 60, 1.2, 1.25));
  for (let i = -40; i <= 40; i++) {
    const x = i * 1.5, q = camPoint(c, [x, 0.012, 0]);
    if (!q || q[0] < -200 || q[0] > 1280) continue;
    wInk(p, c, 30500 + i + 40, [[x, 0.012, -1.2], [x, 0.012, 1.2]], {color: tone(S, C.joint), weight: 0.7, closed: false});
  }
  // dappled shade from the maples on the path (morning) and a few leaf stains
  if (S !== 'dusk' && S !== 'winter') for (let i = 0; i < 26; i++) {
    const x = -24 + i * 1.9 + hash(30600 + i) * 1.2, z = -1.1 + 1.6 * hash(30630 + i), r = 0.25 + 0.4 * hash(30660 + i);
    const q = flatCircle(c, [x, 0.013, z], r, 14);
    if (q.length > 2) washAt(p, 30700 + i, tone(S, '#8f8a7c'), 90, q, 0.2, 0.3);
  }
  // lawn texture: darker mown patches and, in spring, dandelion dots
  for (let i = 0; i < 60; i++) {
    const x = -30 + 60 * hash(31600 + i), z = (i % 2 ? -1 : 1) * (1.6 + 12 * hash(31700 + i)), r = 0.3 + 0.9 * hash(31800 + i);
    const q = flatCircle(c, [x, 0.003, z], r, 12);
    if (q.length > 2) washAt(p, 31850 + i, tone(S, i % 3 ? C.lawnShade : C.leafLit), 70, q, 0.25, 0.3);
    if ((S === 'spring' || S === 'later') && i % 2 === 0) { const d = flatCircle(c, [x + 0.6, 0.004, z + 0.3], 0.04, 6); if (d.length > 2) hardFill(p, 31920 + i, '#f2d34a', d); }
  }
  // the far side of the near lawn (cameras looking +z): a hedge, a row of street maples and a low campus building at z 26-34
  if (Math.cos(c.yaw) < 0) paintNearSide(p, c, S);
  if (S === 'autumn') for (let i = 0; i < 40; i++) {
    const x = -20 + i + hash(30800 + i), z = -3 + 6 * hash(30850 + i), q = flatCircle(c, [x, 0.014, z], 0.08 + 0.06 * hash(30900 + i), 8);
    if (q.length > 2) hardFill(p, 30950 + i, [C.autumn1, C.autumn2, C.autumn3][i % 3], q);
  }
};

const paintNearSide = (p: Painter, c: YCam, S: Season) => {
  wFill(p, c, 33000, tone(S, '#d9cdb8'), qz(34, -40, 30, 0, 7));
  wFill(p, c, 33001, tone(S, C.slate), [[-40.5, 7, 34], [30.5, 7, 34], [29.5, 9, 37], [-39.5, 9, 37]]);
  for (let i = 0; i < 16; i++) wFill(p, c, 33010 + i, tone(S, C.glass), qz(33.98, -38 + i * 4.3, -36.6 + i * 4.3, 2.2, 4.6));
  wFill(p, c, 33040, tone(S, '#4f7a3a'), [[-40, 0, 26], [30, 0, 26], [30, 1.2, 26], [-40, 1.2, 26]]);
  for (let i = 0; i < 8; i++) paintTree(p, c, {x: -34 + i * 9, z: 28, h: 8 + 2 * hash(33100 + i), r: 2.8, fork: 2.8, seed: 33200 + i * 100}, {season: S, t: 0});
};

const paintFir = (p: Painter, c: YCam, [x, y, z]: V3, h: number, S: Season, seed: number) => {
  const tiers = 6;
  for (let k = 0; k < tiers; k++) {
    const y0 = y + 2 + (h - 2) * (k / tiers), y1 = y0 + (h - 2) * 1.6 / tiers, w = 3.6 * (1 - k / tiers) + 0.4;
    const q = wp(c, [[x - w, y0, z], [x + w, y0, z], [x + w * 0.15, y1, z], [x - w * 0.15, y1, z]]);
    if (q.length > 2) hardFill(p, seed + k, tone(S, k % 2 ? C.fir : C.firShade), q);
  }
  wFill(p, c, seed + 10, tone(S, C.trunk), qz(z, x - 0.3, x + 0.3, y, y + 2.5));
};

const paintHall = (p: Painter, c: YCam, S: Season) => {
  const z = -24, x0 = -20, x1 = 25, top = 13;
  // slate roof (a pitched band behind the eaves), brick front, white sash windows in rows, an arched entrance
  wFill(p, c, 30200, tone(S, C.slate), [[x0 - 0.5, top, z], [x1 + 0.5, top, z], [x1 - 1, top + 4.5, z - 6], [x0 + 1, top + 4.5, z - 6]]);
  for (const cx of [-12, 2, 16]) paintBox(p, c, 30210 + cx, {x0: cx - 0.6, x1: cx + 0.6, y0: top + 2, y1: top + 6.5, z0: z - 4, z1: z - 3}, tone(S, C.brickShade));
  wFill(p, c, 30201, tone(S, C.brick), qz(z, x0, x1, 0, top));
  wWash(p, c, 30202, tone(S, C.brickShade), 120, qz(z + 0.01, x0, x1, 0, 1.2), 0.1, 0.4);
  wFill(p, c, 30203, tone(S, C.frame), qz(z + 0.02, x0, x1, top - 0.5, top));
  const lit = S === 'dusk';
  let i = 0;
  for (let row = 0; row < 3; row++) for (let col = 0; col < 15; col++) {
    const wx = x0 + 1.4 + col * 3.0, wy = 1.8 + row * 3.8;
    if (Math.abs(wx - 2.5) < 1.6 && row === 0) continue; // entrance
    wFill(p, c, 30230 + i * 2, tone(S, C.frame), qz(z + 0.02, wx - 0.75, wx + 0.75, wy - 0.15, wy + 2.25));
    const on = lit && row < 2 && hash(30900 + i) > 0.5;
    wFill(p, c, 30231 + i * 2, on ? '#ffcf7a' : tone(S, C.glass), qz(z + 0.03, wx - 0.6, wx + 0.6, wy, wy + 2.1));
    i++;
  }
  wFill(p, c, 30400 + 99, tone(S, C.frame), [[1.0, 0, z + 0.02], [4.0, 0, z + 0.02], [4.0, 3.2, z + 0.02], [2.5, 4.1, z + 0.02], [1.0, 3.2, z + 0.02]]);
  wFill(p, c, 30400 + 98, lit ? '#e8a858' : tone(S, '#3e3a38'), [[1.3, 0, z + 0.03], [3.7, 0, z + 0.03], [3.7, 3.0, z + 0.03], [2.5, 3.8, z + 0.03], [1.3, 3.0, z + 0.03]]);
};

/** An irregular leaf clump (radius modulated by a seeded hash), so canopies do not read as stacked discs. */
export const lump = (cx: number, cy: number, rx: number, ry: number, seed: number, n = 16): Pt[] =>
  Array.from({length: n}, (_, i) => {
    const a = (i / n) * Math.PI * 2, k = 0.82 + 0.3 * hash(seed * 3 + i);
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k] as Pt;
  });

// ---- trees (big-leaf maple; season state), nest
export type TreeSpec = {x: number; z: number; h: number; r: number; fork: number; seed: number; nest?: PathState['nest']};
export const TREES: TreeSpec[] = [
  {x: -20, z: -4.5, h: 10, r: 3.2, fork: 3.2, seed: 31000}, {x: -11, z: -4.5, h: 9.5, r: 3.3, fork: 3.0, seed: 31100},
  {x: 2.5, z: -4.5, h: 10.5, r: 3.5, fork: 3.4, seed: 31200}, {x: 11, z: -4.5, h: 9.8, r: 3.2, fork: 3.1, seed: 31300}, {x: 20, z: -4.5, h: 9.6, r: 3.0, fork: 3.2, seed: 31400},
];
const NT_SEED = 31200;

export const paintTree = (p: Painter, c: YCam, t: TreeSpec, s: PathState) => {
  const S = s.season, f0 = FOL[S], f = {...f0, amt: f0.amt * (s.leaf ?? 1)}, {x, z, h, r, fork, seed} = t;
  const base = camPoint(c, [x, 0, z]);
  if (!base) return;
  // contact shade under the canopy
  const sh = flatCircle(c, [x + 0.6, 0.004, z + 0.8], r * 0.8, 18);
  if (sh.length > 2 && S !== 'dusk') washAt(p, seed, tone(S, C.lawnShade), S === 'winter' ? 50 : 120, sh, 0.3, 0.3);
  // trunk and main limbs (projected world segments)
  const seg = (a: V3, b: V3, w0: number, w1: number, id: number, col: string) => {
    const qa = camPoint(c, a), qb = camPoint(c, b);
    if (!qa || !qb) return;
    hardFill(p, id, col, capsule(qa, qb, Math.max(1.5, w0 * camUnit(c, a)), Math.max(1.2, w1 * camUnit(c, b)), 4));
  };
  const tc = tone(S, C.trunk), ts = tone(S, C.trunkShade);
  seg([x, 0, z], [x, fork, z], 0.42, 0.36, seed + 1, tc);
  const limbs: [V3, number][] = [];
  for (let i = 0; i < 7; i++) {
    const a = -1.25 + (i / 6) * 2.5 + 0.2 * (hash(seed + 10 + i) - 0.5), len = r * (0.75 + 0.3 * hash(seed + 20 + i));
    const end: V3 = [x + Math.sin(a) * len, fork + Math.cos(a) * len * 1.05 + 0.6, z + 0.6 * (hash(seed + 30 + i) - 0.5)];
    limbs.push([end, a]);
    seg([x, fork, z], end, 0.2, 0.06, seed + 40 + i, i % 2 ? ts : tc);
  }
  if (f.amt < 0.5) {
    // winter and buds: fine twigs
    limbs.forEach(([e, a], i) => {
      for (let j = 0; j < 4; j++) {
        const b = a + (j - 1.5) * 0.35, l = r * 0.35;
        seg(e, [e[0] + Math.sin(b) * l, e[1] + Math.cos(b) * l, e[2]], 0.05, 0.015, seed + 60 + i * 5 + j, ts);
      }
    });
  }
  if (seed === NT_SEED) {
    seg([x, fork + 0.6, z], [2.0, 5.5, -3.6], 0.2, 0.12, seed + 80, tc); // the fork limb under the nest
    seg([2.0, 5.5, -3.6], [1.7, 7.4, -3.2], 0.12, 0.05, seed + 81, ts);
    seg([2.2, 5.5, -3.8], [-0.2, 5.9, -2.9], 0.14, 0.06, seed + 82, tc); // NB, the nest branch toward the path
  }
  // nest in the NT fork (drawn before the leaves: the leaves partly frame it)
  if (seed === NT_SEED && (s.nest ?? 'full') !== 'none') paintNest(p, c, s.nest ?? 'full', S);
  if (f.amt > 0) {
    const cy = fork + (h - fork) * 0.52, n = 12;
    const cen = camPoint(c, [x, cy, z]);
    if (!cen) return;
    const u = camUnit(c, [x, cy, z]);
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + hash(seed + 100 + k), d = r * (0.35 + 0.4 * hash(seed + 120 + k)), sz = r * (0.42 + 0.18 * hash(seed + 140 + k)) * Math.sqrt(f.amt);
      const px = cen[0] + Math.cos(a) * d * u, py = cen[1] + Math.sin(a) * d * 0.8 * u, sp = sz * u;
      const lit = Math.cos(a) < 0 && Math.sin(a) < 0.3; // east (screen left in side views) and top lit
      if (seed === NT_SEED && Math.abs(Math.cos(a)) > 0.3 && Math.sin(a) > 0.1 && d < r * 0.6) continue; // keep a window on the nest fork
      hardFill(p, seed + 200 + k, lit ? f.base : f.shade, lump(px, py, sp, sp * 0.85, seed + 200 + k));
      hardFill(p, seed + 230 + k, mixColor(lit ? f.base : f.shade, f.lit, lit ? 0.55 : 0.3), lump(px - sp * 0.25, py - sp * 0.3, sp * 0.55, sp * 0.45, seed + 230 + k));
      if (S === 'autumn' && k % 3 === 0) hardFill(p, seed + 260 + k, C.autumn3, ell(px + sp * 0.2, py - sp * 0.2, sp * 0.35, sp * 0.3, 12));
    }
    // leaf dabs on the lit side
    for (let k = 0; k < 16; k++) {
      const a = Math.PI * (0.9 + 0.7 * hash(seed + 300 + k)), d = r * 0.9 * hash(seed + 320 + k), w = r * 0.07 * u;
      hardFill(p, seed + 340 + k, f.lit, lump(cen[0] + Math.cos(a) * d * u, cen[1] + Math.sin(a) * d * 0.8 * u, w * 1.3, w, seed + 340 + k));
    }
  }
};

/** `new: nest K03` (R2.1 F11): a rounded bowl of crossing twigs (ends poking out, ragged rim), a darker cup inside and a contact shadow on the fork. `part` 'back' = shadow, bowl body and cup; 'front' = the twig wall and rim only (shot 2 paints back, the young crow, then front). */
export const paintNest = (p: Painter, c: YCam, state: 'full' | 'empty' | 'rebuilt' | 'none', S: Season, part: 'all' | 'back' | 'front' = 'all') => {
  const q = camPoint(c, NEST);
  if (!q) return;
  const u = camUnit(c, NEST), w = 0.34 * u, d = 0.19 * u;
  const col = S === 'dusk' ? tone(S, '#2e241c') : '#2e241c', stick = S === 'dusk' ? tone(S, '#5a4634') : '#5a4634', stick2 = S === 'dusk' ? tone(S, '#7a6044') : '#7a6044';
  const lw = Math.max(1.4, 0.013 * u);
  const empty = state === 'empty';
  const bowl = (sc: number): Pt[] => Array.from({length: 24}, (_, i): Pt => { const a = Math.PI * (i / 23); return [q[0] - Math.cos(a) * w * sc, q[1] + d * 0.1 + Math.sin(a) * d * sc * (empty ? 0.8 : 1.05)]; });
  const rimAt = (t: number): Pt => [q[0] + (t * 2 - 1) * w * 0.98, q[1] + d * 0.1 - Math.sin(Math.PI * t) * d * 0.14];
  if (part !== 'front') {
    // contact shadow on the fork
    washAt(p, 31899, '#2a2018', 90, ell(q[0] + w * 0.1, q[1] + d * 1.25, w * 0.9, d * 0.28, 16), 0.3, 0.3);
    hardFill(p, 31900, col, [...bowl(1.0), ...Array.from({length: 12}, (_, i): Pt => rimAt(1 - i / 11))]);
    // darker cup inside the rim (an ellipse opening), with a few lining twigs
    hardFill(p, 31901, '#16100c', ell(q[0], q[1] + d * 0.02, w * 0.82, d * 0.3, 20));
    if (!empty) for (let i = 0; i < 6; i++) inkLine(p, 31902 + i, [[q[0] - w * (0.7 - 0.2 * hash(31950 + i)), q[1] + d * (0.1 * hash(31960 + i) - 0.06)], [q[0] + w * (0.2 + 0.5 * hash(31970 + i)), q[1] + d * (0.12 * hash(31980 + i) - 0.04)]], {weight: lw * 0.7, color: '#3a2a20', closed: false, still: true});
  }
  if (part === 'back') return;
  // the bowl wall: 30 crossing twigs at varied angles; the ends poke out 0.03-0.10 m past the silhouette
  const n = empty ? 14 : 34;
  for (let i = 0; i < n; i++) {
    const t = hash(31910 + i * 3), side = (hash(31911 + i * 3) - 0.5) * 2;
    const ang = (-0.7 + 1.4 * hash(31912 + i * 3)) + (i % 2 ? 0.35 : -0.35), len = w * (0.3 + 0.35 * hash(31913 + i)), ph = Math.PI * (0.12 + 0.76 * t);
    const cx = q[0] - Math.cos(ph) * w * 0.9 * (empty ? 0.95 : 1), cy = q[1] + d * 0.1 + Math.sin(ph) * d * 0.75;
    if (part === 'front' && cy < q[1] + d * 0.02) continue;
    const dx = Math.cos(ang) * len / 2, dy = Math.sin(ang) * len / 2 * 0.55;
    const pk = i % 5 === 0 ? 0.07 * u : 0;
    inkLine(p, 31940 + i, [[cx - dx - Math.sign(dx || 1) * pk, cy - dy], [cx, cy + 0.01 * u * side], [cx + dx + Math.sign(dx || 1) * pk, cy + dy]], {weight: lw * (0.8 + 0.5 * hash(31914 + i)), color: i % 3 ? stick : stick2, closed: false, still: true, curve: 0.3});
  }
  // ragged rim line with a few loose ends
  inkLine(p, 31990, Array.from({length: 14}, (_, i): Pt => { const r = rimAt(i / 13); return [r[0], r[1] + (hash(31991 + i) - 0.5) * 0.02 * u]; }), {weight: lw * 1.1, color: stick2, closed: false, still: true, curve: 0.3});
  for (let i = 0; i < 4; i++) { const r = rimAt(0.1 + 0.8 * hash(32010 + i)); inkLine(p, 32020 + i, [r, [r[0] + (hash(32030 + i) - 0.5) * 0.14 * u, r[1] - (0.03 + 0.05 * hash(32040 + i)) * u]], {weight: lw * 0.8, color: stick, closed: false, still: true}); }
  if (empty) for (let i = 0; i < 4; i++) inkLine(p, 31970 + i, [[q[0] - w * 0.5 + i * w * 0.35, q[1] + d * 0.9], [q[0] - w * 0.45 + i * w * 0.3, q[1] + d * (1.6 + 0.5 * hash(31980 + i))]], {weight: lw, color: stick, closed: false, still: true});
};

// ---- utility line: poles and the wire
const POLES: number[] = [-18, 12];
export const paintPole = (p: Painter, c: YCam, x: number, S: Season, seed: number) => {
  wFill(p, c, seed, tone(S, C.pole), qz(WIRE_Z, x - 0.14, x + 0.14, 0, 8.0));
  wFill(p, c, seed + 1, tone(S, mixColor(C.pole, '#000000', 0.25)), qz(WIRE_Z + 0.01, x + 0.03, x + 0.14, 0, 8.0));
  wFill(p, c, seed + 2, tone(S, C.pole), qz(WIRE_Z, x - 1.0, x + 1.0, 7.5, 7.7));
};
export const paintWire = (p: Painter, c: YCam, S: Season, x0 = -18, x1 = 12) => {
  const pts: V3[] = [];
  for (let i = 0; i <= 120; i++) { const x = x0 + ((x1 - x0) * i) / 120; pts.push([x, wireY(x) + (x <= -17.9 || x >= 11.9 ? 0.0 : 0), WIRE_Z]); }
  for (let i = 0; i < pts.length - 1; i++) {
    const a = camPoint(c, pts[i]), b = camPoint(c, pts[i + 1]);
    if (!a || !b) continue;
    if (Math.max(a[0], b[0]) < -100 || Math.min(a[0], b[0]) > 1180) continue;
    const w = Math.max(2.2, 0.016 * camUnit(c, pts[i]));
    hardFill(p, 32000 + i, S === 'dusk' ? '#1e1b26' : C.wire, capsule(a, b, w, w, 3));
  }
};

// ---- street furniture
export const paintLampPost = (p: Painter, c: YCam, at: V3, S: Season, seed: number, on = 0) => {
  const [x, , z] = at;
  wFill(p, c, seed, tone(S, C.lamp), qz(z, x - 0.06, x + 0.06, 0, 3.6));
  wFill(p, c, seed + 1, tone(S, C.lamp), qz(z, x - 0.16, x + 0.16, 0, 0.35));
  const head = camPoint(c, [x, 3.8, z]);
  if (!head) return;
  const u = camUnit(c, [x, 3.8, z]);
  // R2.1 (F8, UT04): a tight warm glow at the head (radius <= 0.3 m) and a soft warm pool on the path below (about 1.5 m across); no large disc
  if (on > 0) {
    const pool = camPoint(c, [x, 0.01, z]), pu = camUnit(c, [x, 0, z]);
    if (pool) washAt(p, seed + 2, C.lampGlow, 55 * on, ell(pool[0], pool[1], 0.75 * pu, 0.26 * pu, 18), 0.5, 0.3);
    washAt(p, seed + 3, C.lampGlow, 150 * on, ell(head[0], head[1], 0.3 * u, 0.3 * u, 16), 0.4, 0.3);
  }
  hardFill(p, seed + 4, tone(S, C.lamp), [[head[0] - 0.16 * u, head[1] - 0.26 * u], [head[0] + 0.16 * u, head[1] - 0.26 * u], [head[0] + 0.12 * u, head[1] + 0.2 * u], [head[0] - 0.12 * u, head[1] + 0.2 * u]]);
  hardFill(p, seed + 5, on > 0 ? '#ffe6b0' : tone(S, '#d9d6c8'), [[head[0] - 0.1 * u, head[1] - 0.16 * u], [head[0] + 0.1 * u, head[1] - 0.16 * u], [head[0] + 0.08 * u, head[1] + 0.14 * u], [head[0] - 0.08 * u, head[1] + 0.14 * u]]);
};
const paintBench = (p: Painter, c: YCam, S: Season) => {
  const x = -2.5, z = -1.6;
  paintBox(p, c, 32200, {x0: x - 0.9, x1: x + 0.9, y0: 0.42, y1: 0.47, z0: z - 0.2, z1: z + 0.2}, tone(S, C.bench));
  paintBox(p, c, 32210, {x0: x - 0.9, x1: x + 0.9, y0: 0.55, y1: 0.85, z0: z - 0.25, z1: z - 0.2}, tone(S, C.bench));
  for (const dx of [-0.8, 0.8]) {
    paintBox(p, c, 32220 + dx * 10, {x0: x + dx - 0.03, x1: x + dx + 0.03, y0: 0, y1: 0.45, z0: z + 0.12, z1: z + 0.17}, tone(S, '#2f3236'));
    paintBox(p, c, 32240 + dx * 10, {x0: x + dx - 0.03, x1: x + dx + 0.03, y0: 0, y1: 0.85, z0: z - 0.24, z1: z - 0.19}, tone(S, '#2f3236'));
  }
};
const paintCan = (p: Painter, c: YCam, S: Season) => paintBox(p, c, 32300, {x0: -1.45, x1: -0.95, y0: 0, y1: 0.95, z0: -1.85, z1: -1.35}, tone(S, '#3d4a44'));
const paintBike = (p: Painter, c: YCam, S: Season) => {
  paintBox(p, c, 32400, {x0: 5.3, x1: 6.7, y0: 0.7, y1: 0.75, z0: -2.05, z1: -1.95}, tone(S, '#8a8f94'));
  for (const wx of [5.6, 6.5]) { const q = wp(c, Array.from({length: 14}, (_, i): V3 => [wx + 0.33 * Math.cos((i / 14) * 6.283), 0.34 + 0.33 * Math.sin((i / 14) * 6.283), -1.8])); if (q.length > 2) inkLine(p, 32410 + wx * 10, q, {weight: 1.2, color: tone(S, '#2a2a2e'), still: true}); }
  wInk(p, c, 32430, [[5.6, 0.34, -1.8], [6.0, 0.8, -1.8], [6.5, 0.34, -1.8], [5.9, 0.34, -1.8], [6.0, 0.8, -1.8]], {weight: 1.2, color: tone(S, '#2d5f8a'), closed: false});
};

/** Depth-sorted set items: trees, poles, lamps, bench, can, bike, Y1 (the near maple). Add people and crows, then `paintSorted`. */
export const pathItems = (s: PathState, o: {skip?: string[]} = {}): Item[] => {
  const S = s.season, skip = new Set(o.skip ?? []);
  const items: Item[] = [];
  TREES.forEach((t, i) => { if (!skip.has(`T${i + 1}`)) items.push({at: [t.x, 0, t.z], draw: (p, c) => paintTree(p, c, t, s)}); });
  POLES.forEach((x, i) => items.push({at: [x, 0, WIRE_Z], draw: (p, c) => paintPole(p, c, x, S, 32100 + i * 10)}));
  if (!skip.has('wire')) items.push({at: [-3, 0, WIRE_Z], bias: -1.5, draw: (p, c) => paintWire(p, c, S)});
  for (const [i, at] of ([[-7, 0, -1.7], [8, 0, -1.7]] as V3[]).entries()) items.push({at, draw: (p, c) => paintLampPost(p, c, at, S, 32500 + i * 10, s.lamps ?? (S === 'dusk' ? 1 : 0))});
  if (!skip.has('bench')) items.push({at: [-2.5, 0, -1.6], draw: (p, c) => paintBench(p, c, S)});
  items.push({at: [-1.2, 0, -1.6], draw: (p, c) => paintCan(p, c, S)});
  items.push({at: [6, 0, -2.0], draw: (p, c) => paintBike(p, c, S)});
  if (!skip.has('Y1')) items.push({at: [-6, 0, 3], draw: (p, c) => paintTree(p, c, {x: -6, z: 3, h: S === 'later' ? 5 : 3.5, r: 1.3, fork: 1.6, seed: 31500}, s)});
  return items;
};

/** Ground-contact shadow of a perched crow on the wire is none; on grass a soft ellipse. */
export const crowGroundShadow = (p: Painter, c: YCam, at: V3, seed: number) => {
  const q = flatCircle(c, [at[0], 0.005, at[2]], 0.14, 12);
  if (q.length > 2) washAt(p, seed, '#3b4a2a', 90, q, 0.2, 0.2);
};
export type {Pt};
