// EDU-EP17 N7 `SET-SUKH16` street (Boss, group 2), hardened from look-b-street.ts and LF02 (approved 2026-11-12) for the six `S` shots SH02, SH05, SH10, SH11, SH12, SH15.
// Space `S`: metres, origin M0 on the road at the man's feet, +x east, +y up, +z south toward the cameras. The set is DATA first (`streetSpec`: tagged world-space polygons), so the
// bay grid, awnings, laundry, poles and viaduct are testable without a canvas; `paintStreet` projects them through a kit yaw camera. Crowd: `crowd-heads.ts` (far rows and the clothes mass),
// `street.ts` `nearCards` (full kit cards within 3 m, sized by `pitchScale`), `squeezed.ts` (SH05). Scene staging (MAN, poses, neighbours, timing) stays with Editor.
import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {paintFigureAt} from '../kit/figure-at';
import {hash} from '../kit/hash';
import type {Painter, Pt} from '../kit/painter';
import {mixColor} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import type {V3} from '../kit/space';
import {dress, type OutfitId} from '../kit/wardrobe';
import type {CastDef} from '../kit/cast';
import {camPoint, camPoly, camSpace, camUnit, type YCam} from '../kit/ycam';
import {clip} from '../kit/world';
import {bottomShade} from './shade';
import {CLEAR_R, CLEAR_R_SH11, CROWD_OUTFITS, crowdHeads, HAIRS, LEAN, MAN_TEE_SH11, manHead, paintCrowdMass, paintHalo, paintHead, paintHeads, SHIRTS, SKINS, type Box, type Head} from './crowd-heads';

export const ST = {
  sky: '#a9c8df', haze: '#dfe6e3', asphalt: '#5d5a56', pavement: '#b5ae9f', conc: '#c9c4b8', concSh: '#8e8a82', pier: '#a9a59a',
  house: ['#d8cdb4', '#c9b48e', '#b8c2b0', '#d2c2a4'], interior: '#3e3328', shutter: '#9aa0a6', awning: ['#b4552e', '#3f6f8f'], sign: ['#e0b84a', '#c94f3d', '#f2efe6'],
  win: '#4a4640', winLit: '#6b6152', ac: '#e9e6dc', cable: '#26231f', plant: '#4f7a45', pole: '#7a756c', laundry: ['#c94f3d', '#3f6fa8', '#f2efe6', '#3a8a6a'],
};
/** Geometry in metres (brief VD05 / looks-b.md point 1). */
export const SET = {bay: 4.2, storey: 3.75, floors: 4, façadeZ: -18, bays: [-10, 10] as [number, number], awning: {y0: 3.0, y1: 3.5, reach: 1.3}, laundry: {bay: 1, floor: 2}, poleZ: -15, poleEvery: 30, cables: 3,
  viaduct: {z0: -14.5, z1: -5.5, y0: 11.5, y1: 14.5, pillars: [-38, -8, 22]}};

export type Poly = {part: string; seed: number; color: string; pts: V3[]; op?: number};
const quadZ = (z: number, x0: number, x1: number, y0: number, y1: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]];
const quadY = (y: number, x0: number, x1: number, z0: number, z1: number): V3[] => [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]];

export type StreetOpts = {
  /** AC boxes, plants, laundry (the small shophouse detail). Default true. */
  detail?: boolean;
  /** Viaduct deck underside. Off for SH05 (the deck is out of frame) and SH11 (looked down onto the street from below the deck). Default true. */
  underside?: boolean;
};

/** The SET-SUKH16 north side as tagged world polygons, far to near paint order: road, pavement, façade bays, poles, viaduct. */
export const streetSpec = (o: StreetOpts = {}): Poly[] => {
  const out: Poly[] = [], add = (part: string, seed: number, color: string, pts: V3[], op?: number) => out.push({part, seed, color, pts, op});
  const [b0, b1] = SET.bays, zf = SET.façadeZ, B = SET.bay;
  add('road', 12, ST.asphalt, quadY(0, -60, 60, -14, 10));
  add('pavement', 13, ST.pavement, quadY(0, -60, 60, zf, -14));
  for (let b = b0; b < b1; b++) {
    const x0 = b * B, x1 = x0 + B, h = hash(b * 7.1 + 3), col = ST.house[Math.floor(h * 4)], top = SET.floors * SET.storey + (h > 0.7 ? 1.2 : 0);
    add('facade', 100 + b * 40, col, quadZ(zf, x0, x1, 0, top));
    add('parapet', 101 + b * 40, mixColor(col, '#6b5a48', 0.25), quadZ(zf, x0, x1, top - 0.35, top));
    add('interior', 102 + b * 40, ST.interior, quadZ(zf + 0.02, x0 + 0.25, x1 - 0.25, 0, 2.9));
    add('shutter', 103 + b * 40, ST.shutter, quadZ(zf + 0.03, x0 + 0.25, x1 - 0.25, 1.6 + h * 0.8, 2.9));
    for (let s = 1; s < SET.floors; s++) {
      const y0 = s * SET.storey, hs = hash(b * 13.3 + s * 5.7);
      for (const wx of [0.5, 2.35]) add('window', 104 + b * 40 + s * 6 + wx, hs > 0.5 ? ST.win : ST.winLit, quadZ(zf + 0.03, x0 + wx, x0 + wx + 1.35, y0 + 0.9, y0 + 2.7));
      add('rail', 120 + b * 40 + s, mixColor(col, '#2b2622', 0.35), quadZ(zf + 0.4, x0 + 0.2, x1 - 0.2, y0 + 0.75, y0 + 0.9));
      if (o.detail !== false) {
        if (hs > 0.35) add('ac', 126 + b * 40 + s, ST.ac, quadZ(zf + 0.5, x0 + 3.1, x0 + 3.9, y0 + 1.0, y0 + 1.6));
        if (hs < 0.3) add('plant', 130 + b * 40 + s, ST.plant, [[x0 + 0.4, y0 + 0.75, zf + 0.5], [x0 + 1.2, y0 + 0.75, zf + 0.5], [x0 + 1.05, y0 + 1.3, zf + 0.5], [x0 + 0.55, y0 + 1.3, zf + 0.5]]);
        if (b === SET.laundry.bay && s === SET.laundry.floor) for (let k = 0; k < 4; k++) add('laundry', 134 + k, ST.laundry[k], [[x0 + 0.6 + k * 0.8, y0 + 0.9, zf + 0.6], [x0 + 1.2 + k * 0.8, y0 + 0.9, zf + 0.6], [x0 + 1.15 + k * 0.8, y0 + 0.35, zf + 0.6], [x0 + 0.65 + k * 0.8, y0 + 0.35, zf + 0.6]]);
      }
    }
    if (h > 0.25) { const sy = h > 0.6 ? 7.5 : 4.0; add('sign', 140 + b * 40, ST.sign[Math.floor(hash(b + 0.3) * 3)], quadZ(zf + 0.6, x0 + 0.4, x1 - 0.4, sy + 0.3, sy + 1.3)); }
    add('awning', 145 + b * 40, ST.awning[(b + 20) % 2], [[x0 + 0.1, SET.awning.y0, zf + SET.awning.reach], [x1 - 0.1, SET.awning.y0, zf + SET.awning.reach], [x1 - 0.1, SET.awning.y1, zf], [x0 + 0.1, SET.awning.y1, zf]]);
  }
  for (const px of poleXs()) add('pole', 300 + px, ST.pole, quadZ(SET.poleZ, px - 0.12, px + 0.12, 0, 9.5));
  const v = SET.viaduct;
  if (o.underside !== false) add('underside', 400, ST.concSh, quadY(v.y0, -80, 80, v.z0, v.z1));
  // fascia: lit concrete (it faces the sun and the cameras) with a dark shadow line under the deck edge and a lighter parapet cap line
  add('fascia', 401, ST.conc, quadZ(v.z1, -80, 80, v.y0, v.y1 - 0.4));
  add('fascia-shadow', 402, ST.concSh, quadZ(v.z1 + 0.01, -80, 80, v.y0, v.y0 + 0.3));
  add('parapet-line', 403, mixColor(ST.conc, '#ffffff', 0.2), quadZ(v.z1 + 0.02, -80, 80, v.y1 - 0.4, v.y1));
  for (const px of v.pillars) {
    add('pillar', 410 + px, mixColor(ST.conc, ST.concSh, 0.35), quadZ(-9.1, px - 0.9, px + 0.9, 0, 10.5));
    add('pier-cap', 420 + px, ST.conc, quadZ(-8.5, px - 1.5, px + 1.5, 10.5, v.y0));
  }
  return out;
};
export const poleXs = (): number[] => [-30, 0, 30];
/** Cable height (m) between poles at x: three bundles, sagging 1.6 m at mid-span. */
export const cableY = (x: number, k: number): number => { const s = Math.abs((((x + 30) % 30) + 30) % 30 / 30 - 0.5) * 2; return 7.2 + k * 0.25 + 1.6 * s * s; };

const W = (p: Painter, c: YCam, q: Poly) => {
  const pts = clip(camPoly(c, q.pts));
  if (pts.length < 3) return;
  if (q.op === undefined) hardFill(p, q.seed, q.color, pts); else washAt(p, q.seed, q.color, q.op, pts, 0, 0);
};

/** Sky, horizon haze, and the street set through camera `c`. Returns the number of polygons drawn. */
export const paintStreet = (p: Painter, c: YCam, o: StreetOpts = {}): number => {
  hardFill(p, 10, ST.sky, [[-40, -40], [1120, -40], [1120, 1960], [-40, 1960]]);
  const hz = camPoint(c, [c.x + 400 * Math.sin(c.yaw), c.y, c.z - 400 * Math.cos(c.yaw)]);
  if (hz) washAt(p, 11, ST.haze, 150, [[-40, hz[1] - 260], [1120, hz[1] - 260], [1120, hz[1] + 20], [-40, hz[1] + 20]], 0, 0);
  const spec = streetSpec(o);
  // paint order: ground, façade bays, then poles and cables, then the viaduct (nearest the lens)
  for (const q of spec) if (q.part !== 'pole' && !q.part.startsWith('fascia') && q.part !== 'underside' && q.part !== 'parapet-line' && q.part !== 'pillar' && q.part !== 'pier-cap') W(p, c, q);
  for (const q of spec) if (q.part === 'pole') W(p, c, q);
  for (let k = 0; k < SET.cables; k++) {
    const pts: Pt[] = [];
    for (let i = 0; i <= 24; i++) { const x = -30 + (60 * i) / 24, q = camPoint(c, [x, cableY(x, k), SET.poleZ]); if (q) pts.push(q); }
    if (pts.length > 1) inkLine(p, 310 + k, pts, {color: ST.cable, weight: 1.6, closed: false, still: true});
  }
  for (const q of spec) if (q.part === 'underside' || q.part.startsWith('fascia') || q.part === 'parapet-line' || q.part === 'pillar' || q.part === 'pier-cap') W(p, c, q);
  return spec.length;
};

/** Camera from position and look-at (scene sheet `ycam` lines): yaw about +y, pitch up positive, hy 960 by default. */
export const lookCam = (pos: V3, at: V3, f = 1000, hy = 960, cx = 0): YCam => {
  const dx = at[0] - pos[0], dy = at[1] - pos[1], dz = at[2] - pos[2];
  return {x: pos[0], y: pos[1], z: pos[2], yaw: Math.atan2(dx, -dz), pitch: Math.atan2(dy, Math.hypot(dx, dz)), f, hy, cx};
};
export const lerpV = (a: V3, b: V3, u: number): V3 => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
/** Linear push over `len` frames with a 6 f ease in and out (sheet convention for pushes in S, T, D): 0..1. */
export const pushU = (f: number, len: number, ramp = 6): number => {
  if (len <= 0) return 1;
  const T = len, r = Math.min(ramp, T / 2), v = 1 / (T - r), x = Math.min(Math.max(f, 0), T);
  if (x < r) return (0.5 * v * x * x) / r;
  if (x > T - r) return 1 - (0.5 * v * (T - x) * (T - x)) / r;
  return v * (x - r / 2);
};

/** Card scale under a pitched lens: the flat card is sized so its head top lands on the true projected head top (feet stay on the ground point). Without it SH05's head lands at 240 px, not about 320. */
export const pitchScale = (c: YCam, at: V3, h: number): number => {
  const g = camPoint(c, at), top = camPoint(c, [at[0], h, at[2]]);
  return g && top ? (g[1] - top[1]) / (h * camUnit(c, at)) : 1;
};

/** Falloff colour: warm shadow, not the map's sea blue. */
export const FALLOFF_COLOR = '#15110f';
export type StreetShot = 'SH02' | 'SH05' | 'SH10' | 'SH11' | 'SH12' | 'SH15';
type ShotDef = {id: string; len: number; cam: (f: number) => YCam; far: Box; near: Box | null; lensX: [number, number]; clearR: number; underside: boolean; crouch?: number; /** Lens falloff [y0, amount] over the caption band (like SH04's 0.36 and the map shots' bottomShade); the crowd's lower bodies are the brightest thing in the band. */ falloff?: [number, number]};
const SIDE: Box = {x0: -16, x1: 16, z0: -17.5, z1: -3.1};
/** Camera numbers are storyboard R2.1 / R2.2 (unchanged for the street shots). SH12 and SH15 share the static camera. */
export const STREET_SHOTS: Record<StreetShot, ShotDef> = {
  SH02: {id: 'S01-B01-SH02', len: 43, cam: (f) => lookCam(lerpV([0.55, 2.05, 1.60], [0.50, 2.00, 1.40], pushU(f, 42)), [0, 0.85, -4.0]), far: SIDE, near: {x0: -3, x1: 3, z0: -3.0, z1: 1.1}, lensX: [-0.6, 1.2], clearR: CLEAR_R, underside: true, falloff: [1000, 0.75]},
  SH05: {id: 'S01-B01-SH05', len: 55, cam: (f) => lookCam(lerpV([0.10, 1.62, 1.30], [0.08, 1.60, 1.22], pushU(f, 54)), [0, 1.20, 0]), far: SIDE, near: {x0: -3, x1: 3, z0: -3.0, z1: 0.61}, lensX: [-0.9, 0.9], clearR: CLEAR_R, underside: false, falloff: [1030, 0.65]},
  SH10: {id: 'S01-B03-SH02', len: 41, cam: (f) => lookCam(lerpV([0.20, 1.00, 2.40], [0.18, 0.98, 2.20], pushU(f, 40)), [0, 1.30, 0]), far: SIDE, near: {x0: -3, x1: 3, z0: -3.0, z1: 1.1}, lensX: [-0.7, 0.9], clearR: CLEAR_R, underside: false, falloff: [1000, 0.75]},
  SH11: {id: 'S01-B03-SH03', len: 45, cam: (f) => lookCam(lerpV([0, 4.5, 6.0], [0, 4.6, 6.0], pushU(f, 44)), [0, 0.6, -4.0]), far: {x0: -12, x1: 12, z0: -17.5, z1: 6.5}, near: null, lensX: [0, 0], clearR: CLEAR_R_SH11, underside: false, crouch: 0.3, falloff: [1000, 0.7]},
  SH12: {id: 'S01-B03-SH04', len: 36, cam: () => lookCam([0.30, 0.95, 2.60], [0, 1.40, 0], 1100), far: SIDE, near: {x0: -3, x1: 3, z0: -3.0, z1: 1.1}, lensX: [-0.7, 1.0], clearR: CLEAR_R, underside: false, falloff: [1000, 0.75]},
  SH15: {id: 'S01-B03-SH07', len: 87, cam: () => lookCam([0.30, 0.95, 2.60], [0, 1.40, 0], 1100), far: SIDE, near: {x0: -3, x1: 3, z0: -3.0, z1: 1.1}, lensX: [-0.7, 1.0], clearR: CLEAR_R, underside: false, falloff: [1000, 0.75]},
};

export const castOf = (id: keyof typeof PEOPLE, outfit?: OutfitId): CastDef => (outfit ? dress(PEOPLE[id], outfit) : PEOPLE[id]);
/** MAN: kit `man-spiky + park-casual` with the cap off (brief VD02, D01). */
export const manDef = (): CastDef => {
  const d = dress(PEOPLE['man-spiky'], 'park-casual');
  return {...d, outfit: {...d.outfit, gear: {...d.outfit.gear, hat: undefined}}};
};

export type NearCard = {def: CastDef; at: V3; view: 'front' | 'left' | 'right' | 'back'; seed: number; face: 'neutral' | 'tired' | 'worried'};
const VIEWS: NearCard['view'][] = ['front', 'left', 'right', 'back', 'front', 'left', 'right'];
/** Full kit cards on the 0.5 m lattice (+-0.08 m jitter, seeded person, outfit from `CROWD_OUTFITS` (no `park-casual`) and view; never all facing the lens). Skips his cell, his two neighbours' marks
 * (`neighbours: false` keeps them) and the lens line (`lensX` x range at z > -0.1). */
/** Kit outfits whose main colour is yellow, orange or cream (the clear-zone ban of `WARM_SHIRTS`, for full cards): the monk's saffron robe and the vendor's cream shirt. */
export const WARM_OUTFITS = new Set<string>(['monk', 'vendor']);
export const nearCards = (box: Box, lensX: [number, number], o: {neighbours?: boolean; clear?: {r: number}} = {}): NearCard[] => {
  const ids = Object.keys(PEOPLE) as (keyof typeof PEOPLE)[], out: NearCard[] = [];
  for (let z = box.z0; z <= box.z1 + 1e-9; z += 0.5) for (let x = box.x0; x <= box.x1 + 1e-9; x += 0.5) {
    const k2 = x * 91.3 + z * 37.9, X = x + (hash(k2) - 0.5) * 0.16, Z = z + (hash(k2 + 1) - 0.5) * 0.16;
    if (Math.abs(x) < 0.3 && Math.abs(z) < 0.3) continue;
    if (o.neighbours !== false && Math.abs(Math.abs(x) - 0.5) < 0.05 && Math.abs(z) < 0.3) continue;
    if (z > -0.1 && x > lensX[0] && x < lensX[1]) continue;
    const id = ids[Math.floor(hash(k2 + 2) * ids.length)];
    let oi = Math.floor(hash(k2 + 3) * CROWD_OUTFITS.length);
    // the 3 m clear zone (ROWS-R2.2): no saffron monk robe and no cream vendor shirt on a kit card inside it (next outfit in the list instead)
    if (o.clear && Math.hypot(X, Z) < o.clear.r) while (WARM_OUTFITS.has(CROWD_OUTFITS[oi])) oi = (oi + 1) % CROWD_OUTFITS.length;
    const of = CROWD_OUTFITS[oi];
    out.push({def: id.startsWith('boy') || id.startsWith('girl') ? castOf(id) : castOf(id, of), at: [X, 0, Z], view: VIEWS[Math.floor(hash(k2 + 4) * VIEWS.length)], seed: 900 + Math.round(hash(k2 + 5) * 9000), face: (['neutral', 'tired', 'worried'] as const)[Math.floor(hash(k2 + 6) * 3)]});
  }
  return out;
};

/** True when the card's feet-to-head projection reaches the frame (cards wholly off the sides cost nothing). */
const onScreen = (c: YCam, n: NearCard): boolean => {
  const g = camPoint(c, n.at), t = camPoint(c, [n.at[0], n.def.height, n.at[2]]);
  if (!g || !t) return false;
  const u = camUnit(c, n.at), hw = 0.3 * u;
  return g[0] + hw > -60 && g[0] - hw < 1140 && g[1] > -100 && t[1] < 2000;
};

const sm = (u: number) => { const k = Math.min(1, Math.max(0, u)); return k * k * (3 - 2 * k); };
const ease = (u: number) => { const k = Math.min(1, Math.max(0, u)); return 1 - (1 - k) * (1 - k); };
/** Jump clock (R04, storyboard shots 11, 12, 15; moved here from Editor's street-live.ts, fix pass E): drop in metres at jump-frame `J` for a person with apex clearance `h`.
 * J < 3 full crouch (0.30 m); +3 lift-off; apex at +16; landing at +34 (shot 15 starts at J = 20); knees-bent dip 34-44. */
export const JUMP = {crouch: 0.3, leave: 3, apex: 16, land: 34, settle: 44};
export const jumpDrop = (J: number, h: number): number => {
  if (J < JUMP.leave) return JUMP.crouch;
  if (J < JUMP.apex) return JUMP.crouch - (JUMP.crouch + h) * ease((J - JUMP.leave) / (JUMP.apex - JUMP.leave));
  if (J < JUMP.land) { const s = (J - JUMP.apex) / (JUMP.land - JUMP.apex); return -h * (1 - s * s); }
  if (J < JUMP.settle) return 0.22 * Math.sin(Math.PI * (J - JUMP.land) / (JUMP.settle - JUMP.land));
  return 0;
};
/** Per-person jump offset: seeded +-2 frames and a clearance of 0.25-0.45 m (the man 0.42). */
const jitter = (i: number) => Math.round((hash(i * 3.1 + 0.7) - 0.5) * 4);
const clearance = (i: number) => 0.25 + 0.2 * hash(i * 1.9 + 0.3);
export const MAN_CLEARANCE = 0.42;
/** Shots whose crowd moves under the `drop` clock. */
export const DROP_SHOTS: StreetShot[] = ['SH10', 'SH11', 'SH12', 'SH15'];
/** Metres the body drops (negative = lifted) at shot-local `f` for person `i` (i = -1: the man; no jitter, his own clearance). */
export const dropAt = (shot: StreetShot, f: number, i: number): number => {
  const j = i < 0 ? 0 : jitter(i), c = f + j, h = i < 0 ? MAN_CLEARANCE : clearance(i);
  if (shot === 'SH10') return 0.05 * sm((c - 22) / 18);
  if (shot === 'SH11') return 0.05 + (JUMP.crouch - 0.05) * sm((c - 30) / 12);
  if (shot === 'SH12') return jumpDrop(c, h);
  if (shot === 'SH15') return jumpDrop(20 + c, h);
  return 0;
};
/** Forward-lean fraction 0..1 (fix pass F; storyboard shot 11 "Crouch read"): the same clock and jitter as `dropAt`; l = sm((c - 30) / 12) in SH11, 1 - sm(c / 3) in SH12, 0 elsewhere. */
export const leanAt = (shot: StreetShot, f: number, i: number): number => {
  const c = f + (i < 0 ? 0 : jitter(i));
  if (shot === 'SH11') return sm((c - 30) / 12);
  if (shot === 'SH12') return 1 - sm(c / 3);
  return 0;
};
/** Crouch fraction of the rig for a pelvis drop in metres (the rig drops the hips 0.47 m x (height / 1.7) at crouch 1). */
export const crouchFor = (drop: number, height: number) => Math.min(1, Math.max(0, drop) / (0.47 * (height / 1.7)));
/** Arms up from lift-off until the last third of the descent, only in the two jump shots. */
export const armsUp = (shot: StreetShot, f: number, i: number): boolean => {
  const J = shot === 'SH12' ? f + (i < 0 ? 0 : jitter(i)) : shot === 'SH15' ? 20 + f + (i < 0 ? 0 : jitter(i)) : -1;
  return J >= JUMP.leave && J < 30;
};
/** The figure's body fields for the clock: crouch, lift (airborne) and the arms pose. */
export const bodyAt = (shot: StreetShot, f: number, i: number, height: number, extra = 0) => {
  const d = dropAt(shot, f, i), airborne = d < 0;
  return {crouch: crouchFor(d + (airborne ? 0 : extra), height), lift: airborne ? -d : 0, pose: armsUp(shot, f, i) ? ('P08' as const) : ('P01' as const), airborne};
};

export type DepthItem = {z: number; draw: () => void};
/** The street shot's picture so far: set, clothes mass, far heads, and the near cards in depth order together with `extra` items (his figure and his neighbours, Editor's). Returns the camera and counts. */
/** Full kit cards in the near zone are capped at the nearest `NEAR_FULL` by camera depth (brief VD03: "nearest 10-14"); the other on-screen near nodes become tall head cards (paint time). */
export const NEAR_FULL = 12;
export const paintStreetShot = (p: Painter, shot: StreetShot, f: number, o: {t?: number; extra?: (c: YCam) => DepthItem[]; detail?: boolean; halo?: boolean; nearFull?: number; /** per-person crouch/jump clock (`dropAt`) in SH10, SH11, SH12, SH15; off = the standing crowd and SH11's fixed crouch, unchanged */ drop?: boolean; /** forward lean (`leanAt`) under `drop`, SH11/SH12 only; default on with `drop`, false = fix pass E's crouch alone */ lean?: boolean} = {}) => {
  const d = STREET_SHOTS[shot], c = d.cam(f), t = o.t ?? f / 30;
  const live = !!o.drop && DROP_SHOTS.includes(shot);
  const leaning = live && o.lean !== false && (shot === 'SH11' || shot === 'SH12');
  const lean = leaning ? (_n: Head, i: number) => leanAt(shot, f, i) : undefined;
  paintStreet(p, c, {detail: o.detail, underside: d.underside});
  const seed = shot === 'SH11' ? 4 : 1;
  const heads = crowdHeads(d.far, {seed, skip: (x, z) => shot === 'SH11' && Math.abs(x) < 0.3 && Math.abs(z) < 0.3, clear: {x: 0, z: 0, r: d.clearR}});
  const crouch = live ? (_n: Head, i: number) => dropAt(shot, f, i) : d.crouch ? (_n: Head, i: number) => d.crouch! * (0.85 + 0.3 * hash(i * 1.7)) : undefined;
  // live: the clothes mass follows the mean of the per-head clock on a fixed sample
  const mean = live ? [0, 1, 2, 3, 4, 5, 6, 7].reduce((a, k) => a + dropAt(shot, f, k * 37 + 5) + (leaning ? LEAN.down * leanAt(shot, f, k * 37 + 5) : 0), 0) / 8 : 0;
  paintCrowdMass(p, c, d.far, {crouch: live ? mean * 0.85 : d.crouch ? d.crouch * 0.85 : undefined});
  const items: DepthItem[] = [];
  let cards = 0;
  if (d.near) {
    const vis = nearCards(d.near, d.lensX, {clear: {r: d.clearR}}).filter((n) => onScreen(c, n)).map((n) => ({n, d: camSpace(c, n.at).d})).sort((a, b) => a.d - b.d);
    vis.forEach(({n}, k) => {
      if (k >= (o.nearFull ?? NEAR_FULL)) { // beyond the nearest cards: a tall head card in the card's own person colours
        const k2 = n.at[0] * 91.3 + n.at[2] * 37.9;
        heads.push({x: n.at[0], z: n.at[2], h: n.def.height, skin: SKINS[Math.floor(hash(k2 + 3) * 6)], hair: HAIRS[Math.floor(hash(k2 + 4) * 6)], shirt: SHIRTS[Math.floor(hash(k2 + 5) * 12)], turn: (hash(k2 + 6) - 0.5) * 2, phase: hash(k2 + 7), body: 9});
        return;
      }
      cards++;
      const key = Math.round((n.at[0] * 91.3 + n.at[2] * 37.9) * 10);
      items.push({z: n.at[2], draw: () => {
        const g = camPoint(c, n.at), u = camUnit(c, n.at), b = live ? bodyAt(shot, f, key, n.def.height, leaning ? LEAN.down * leanAt(shot, f, key) : 0) : null;
        if (g && !b?.airborne) washAt(p, 880 + (n.seed % 90), '#17140f', 120, ell(g[0], g[1], 0.3 * u, 0.1 * u, 12), 0, 0); // contact shadow
        paintFigureAt(p, c, n.def, {at: n.at, view: n.view, pose: b ? b.pose : 'P01', face: n.face, t, seed: n.seed, scale: pitchScale(c, n.at, n.def.height), ...(b ? {fig: {crouch: b.crouch, lift: b.lift}, shadow: b.airborne ? false : undefined} : {})});
      }});
    });
  }
  const polys = paintHeads(p, c, heads, {t, crouch, lean, shade: (n) => (n.z < -6 && n.z > -14.5 && shot === 'SH11' ? 1 : 0)});
  for (const it of o.extra?.(c) ?? []) items.push(it);
  items.sort((a, b) => a.z - b.z).forEach((it) => it.draw());
  if (shot === 'SH11') {
    // him at the centre, crouched: head card with the brighter tee, halo, then the nearer rows over him (he sits inside the crowd)
    const m = live ? dropAt('SH11', f, -1) : 0.3, l = leaning ? leanAt('SH11', f, -1) : 0;
    if (o.halo !== false) paintHalo(p, c, [0, 1.72 - m - LEAN.down * l, LEAN.fwd * l]);
    paintHead(p, c, manHead(MAN_TEE_SH11), 9999, {crouch: () => m, lean: l > 0 ? () => l : undefined, t});
    heads.forEach((n, i) => { if (n.z > 0.2 && Math.abs(n.x) < 1.5) paintHead(p, c, n, i, {crouch, lean, t}); });
  }
  if (d.falloff) bottomShade(p, d.falloff[0], d.falloff[1], 982000, FALLOFF_COLOR, 20, 8);
  return {cam: c, polys, cards, heads: heads.length};
};
