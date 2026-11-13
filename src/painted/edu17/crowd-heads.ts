// EDU-EP17 N6 `crowd-heads` (Boss, group 2): the far rows of every crowd shot (beyond about 3 m, where full rig cards would cost too much paint time) as head-and-shoulder washes on the
// 0.50 m lattice (+-0.08 m seeded jitter), squared to the lens, with a clothes-coloured under-layer so the road never shows between heads. Built from look-b-street.ts (LF02, approved
// 2026-11-12). Used by SH02, SH05, SH10, SH11, SH12, SH15 in `S` and, through `paintHeads` with seat positions, by SH18-SH20 in `T` (group 4). Wash-only polygons, tiered by head radius.
// Kit intake (W8.4): `new: crowd-heads` (proposal in build-notes.md).
import {ell, hardFill, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import type {Painter, Pt} from '../kit/painter';
import {mixColor} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camPoly, camSpace, camUnit, type YCam} from '../kit/ycam';
import {clip} from '../kit/world';

export const SKINS = ['#f1c9a5', '#d9a77f', '#b97f55', '#8a5a3a', '#e8b996', '#6b4428'];
export const HAIRS = ['#1d1a18', '#2b2420', '#3b2f25', '#5a4636', '#9a9a9a', '#14110f'];
/** The crowd's shirt colours (VD03 palette, no `park-casual` mustard tee: it is his alone). */
export const SHIRTS = ['#c94f3d', '#e0b84a', '#3f6fa8', '#f2efe6', '#3a8a6a', '#d77fa1', '#e8e4da', '#6b7480', '#d98a3a', '#2d3440', '#f2ead8', '#7a5aa0'];
/** Yellow, orange and cream tops: banned near him so his tee `#ffc21a` / `#e3b23c` is the only warm mass in the centre. */
export const WARM_SHIRTS = new Set(['#e0b84a', '#d98a3a', '#f2ead8', '#e8e4da', '#f2efe6']);
const COOL_SHIRTS = ['#3f6fa8', '#6b7480', '#3a8a6a', '#2d3440'];
/** Clear zone radius (m) around the man for every crowd shot: 3 m (ROWS-R2.2, coordinator decision 2026-11-12; was 1.5 m, 3 m only for SH11). `CLEAR_R_SH11` is kept as the same value for callers that name SH11. */
export const CLEAR_R = 3, CLEAR_R_SH11 = 3;
/** Clothes mass under the far rows (LF02): colour and height (m). */
export const MASS = {color: '#5a4a42', y: 0.9};
/** Full-card crowd outfits (VD03 list as built in LF02): no `park-casual`. */
export const CROWD_OUTFITS = ['office', 'student-th-trousers', 'monk', 'yukata', 'nurse', 'police', 'hoodie', 'vendor', 'rider', 'kitchen-apron', 'doctor', 'student-th-skirt', 'kimono', 'guard'] as const;
export const MAN_TEE_SH11 = '#ffc21a';
/** Head-radius tiers (px): polygons per head 4 / 3 / 2 / 1. */
export const TIER = {full: 10, mid: 4, small: 1.2} as const;

export type Head = {x: number; z: number; h: number; skin: string; hair: string; shirt: string; turn: number; phase: number; spiky?: boolean; /** Torso length in head radii (default 6; 9 reads as clothes down to the knee for rows that stand in the near zone as heads). */ body?: number};
export type Box = {x0: number; x1: number; z0: number; z1: number};
export type CrowdOpts = {seed?: number; skip?: (x: number, z: number) => boolean; clear?: {x: number; z: number; r: number}};

/** Heads on the lattice in a box. `clear` swaps warm shirts inside its radius for cool ones; `skip` drops nodes (the man's cell, the lens line). Sorted far to near by z. */
export const crowdHeads = (box: Box, o: CrowdOpts = {}): Head[] => {
  const out: Head[] = [], seed = o.seed ?? 1;
  for (let z = box.z0; z <= box.z1 + 1e-9; z += 0.5) for (let x = box.x0; x <= box.x1 + 1e-9; x += 0.5) {
    const k = x * 131.7 + z * 17.3 + seed * 3.1, jx = (hash(k) - 0.5) * 0.16, jz = (hash(k + 1) - 0.5) * 0.16;
    if (o.skip?.(x + jx, z + jz)) continue;
    const kid = hash(k + 9) < 0.06, h = kid ? 1.2 + hash(k + 2) * 0.2 : 1.55 + hash(k + 2) * 0.27;
    let shirt = SHIRTS[Math.floor(hash(k + 5) * 12)];
    if (o.clear && WARM_SHIRTS.has(shirt) && Math.hypot(x + jx - o.clear.x, z + jz - o.clear.z) < o.clear.r) shirt = COOL_SHIRTS[Math.floor(hash(k + 8) * 4)];
    out.push({x: x + jx, z: z + jz, h, skin: SKINS[Math.floor(hash(k + 3) * 6)], hair: HAIRS[Math.floor(hash(k + 4) * 6)], shirt, turn: (hash(k + 6) - 0.5) * 2, phase: hash(k + 7)});
  }
  return out.sort((a, b) => a.z - b.z);
};

/** The man as a head card: spiky black hair, mustard tee (SH11 uses `MAN_TEE_SH11`). */
export const manHead = (shirt = '#e3b23c', h = 1.72): Head => ({x: 0, z: 0, h, skin: '#8a5a3a', hair: '#141110', shirt, turn: 0, phase: 0, spiky: true});

/** The lean at full (storyboard ROWS-R2.5 shot 11 "Crouch read"): torso pitched 30 deg toward +z. */
export const LEAN = {down: 0.08, fwd: 0.27, chin: 15, torso: 0.68};

export type HeadOpts = {
  /** Metres the head drops (crouch), by head. */
  crouch?: (n: Head, i: number) => number;
  /** Forward lean 0..1 (fix pass F, SH11/SH12 crouch read): at 1 the head sits a further `LEAN.down` m lower and `LEAN.fwd` m toward +z, pitched `LEAN.chin` deg chin-down (more hair crown), the torso card `LEAN.torso` of its height. 0 or absent = the unleaned card, call for call. */
  lean?: (n: Head, i: number) => number;
  /** 0..1 darkening (viaduct shadow), by head. */
  shade?: (n: Head) => number;
  /** Seeded bob (m) on the ambient clock `t` (s): the heads breathe, amplitude 0.01 m at most. */
  t?: number; bob?: number;
  shoulders?: number; body?: number;
};

/** One head card: shoulders, neck, head disc, hair cap (turned by `turn`), squared to the lens; polygons by tier (4 / 3 / 2 / 1). Returns the head top and radius in px, or null when culled. */
export const paintHead = (p: Painter, c: YCam, n: Head, i: number, o: HeadOpts = {}): {top: Pt; r: number; polys: number} | null => {
  const bob = o.t !== undefined ? (o.bob ?? 0.01) * Math.sin((o.t * 0.9 + n.phase) * Math.PI * 2) : 0;
  const l = o.lean?.(n, i) ?? 0;
  const y = n.h - (o.crouch?.(n, i) ?? 0) - LEAN.down * l + bob, nz = n.z + LEAN.fwd * l, top = camPoint(c, [n.x, y, nz]);
  if (!top) return null;
  const u = camUnit(c, [n.x, y, nz]), r = 0.105 * u;
  if (r < 0.6 || top[0] < -60 || top[0] > 1140 || top[1] > 2000 || top[1] < -80) return null;
  const sh = o.shade?.(n) ?? 0, d = (col: string) => (sh > 0 ? mixColor(col, '#3c4250', sh * 0.45) : col);
  const cx = top[0], cy = top[1] + r, sw = (o.shoulders ?? 0.23) * u, bl0 = n.body ?? o.body ?? 6, bl = l > 0 ? 1.35 + (bl0 - 1.35) * (1 - (1 - LEAN.torso) * l) : bl0, sd = 5000 + i * 4;
  const cut = l > 0 ? r * (0.35 * l) : 0; // chin-down: the hair cap reaches lower over the face
  let polys = 0;
  if (r < TIER.small * 2) { // far row: one dot, hair over the clothes under-layer
    hardFill(p, sd, d(mixColor(n.hair, n.shirt, 0.35)), ell(cx, cy + r * 0.6, r * 1.3, r * 1.5, 5)); return {top, r, polys: 1};
  }
  if (r < TIER.mid) { // two: shirt trapezoid, head dot (skin and hair mixed)
    hardFill(p, sd, d(n.shirt), [[cx - sw, cy + r * 1.35], [cx + sw, cy + r * 1.35], [cx + sw * 1.05, cy + r * bl], [cx - sw * 1.05, cy + r * bl]]);
    hardFill(p, sd + 1, d(mixColor(n.skin, n.hair, 0.5)), ell(cx, cy, r * 0.95, r, 7)); return {top, r, polys: 2};
  }
  hardFill(p, sd, d(n.shirt), [[cx - sw, cy + r * 1.35], [cx + sw, cy + r * 1.35], [cx + sw * 1.05, cy + r * bl], [cx - sw * 1.05, cy + r * bl]]);
  hardFill(p, sd + 1, d(n.skin), ell(cx, cy, r * 0.86, r, r > 4 ? 14 : 8)); polys += 2;
  const tw = n.turn * r * 0.35;
  hardFill(p, sd + 2, d(n.hair), [...ell(cx + tw * 0.3, cy - r * 0.15 + cut * 0.5, r * 0.92, r * 0.9, r > 4 ? 12 : 7).filter(([, yy]) => yy <= cy - r * 0.05 + cut), [cx + r * 0.9 + tw, cy - r * 0.05 + cut], [cx - r * 0.9 + tw, cy - r * 0.05 + cut]]); polys++;
  if (r >= TIER.full / 2 && Math.abs(n.turn) > 0.75) { hardFill(p, sd + 3, d(n.hair), ell(cx - Math.sign(n.turn) * r * 0.25, cy + r * 0.05, r * 0.7, r * 0.85, 10)); polys++; } // turned away: the back of the head
  if (n.spiky && r >= 3) { // spikes radiate from the crown
    for (let k = 0; k < 7; k++) { const a = -Math.PI * (0.1 + 0.8 * (k / 6)), b = a + 0.3; hardFill(p, 7100 + k, n.hair, [[cx + Math.cos(a) * r * 0.75, cy + Math.sin(a) * r * 0.75], [cx + Math.cos(a + 0.15) * r * 1.4, cy + Math.sin(a + 0.15) * r * 1.4], [cx + Math.cos(b) * r * 0.75, cy + Math.sin(b) * r * 0.75]]); polys++; }
  }
  return {top, r, polys};
};

/** Heads far to near by camera depth (works for any lens, a seat row as well as a street lattice). Returns the count of polygons drawn. */
export const paintHeads = (p: Painter, c: YCam, heads: Head[], o: HeadOpts = {}): number => {
  const ord = heads.map((n, i) => ({n, i, d: camSpace(c, [n.x, n.h, n.z]).d})).sort((a, b) => b.d - a.d);
  let polys = 0;
  for (const {n, i} of ord) polys += paintHead(p, c, n, i, o)?.polys ?? 0;
  return polys;
};

/** The clothes mass under the far rows (flat quad at height `y` over the box); with a crouched crowd pass the crouch so it lowers with the heads. */
export const paintCrowdMass = (p: Painter, c: YCam, box: Box, o: {y?: number; color?: string; crouch?: number} = {}) => {
  const y = (o.y ?? MASS.y) - (o.crouch ?? 0), q = clip(camPoly(c, ([[box.x0, y, box.z0], [box.x1, y, box.z0], [box.x1, y, box.z1], [box.x0, y, box.z1]] as V3[])));
  if (q.length >= 3) hardFill(p, 470, o.color ?? MASS.color, q);
};

/** The SH11 halo: two warm washes on his head (`#fff3c4` 120/255 over 0.55 x 0.45 m, `#fff8e0` 110/255 over 0.36 x 0.30 m), centred 0.1 m below the head top. A sun pool, not a graphic. */
export const paintHalo = (p: Painter, c: YCam, headTop: V3) => {
  const q = camPoint(c, headTop);
  if (!q) return;
  const u = camUnit(c, headTop);
  washAt(p, 7000, '#fff3c4', 120, ell(q[0], q[1] + 0.1 * u, 0.55 * u, 0.45 * u, 24), 0, 0);
  washAt(p, 7001, '#fff8e0', 110, ell(q[0], q[1] + 0.1 * u, 0.36 * u, 0.3 * u, 20), 0, 0);
};
