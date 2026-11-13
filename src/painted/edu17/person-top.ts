// EDU-EP17 N5 `person-top` (Boss, group 2): the packed crowd seen straight down (SH04) as a top view of a kit person, hardened from look-a-crowd-top.ts (LF03, approved 2026-11-12).
// Each person is built in world metres on the 0.50 m lattice (+-0.08 m seeded jitter) and projected through the kit yaw camera, so the wide-lens parallax (heads lean out from the centre)
// is real: shoulders (outfit top, lit east / shaded west), upper arms, torso and legs as a dark column off the lens axis, a skin sliver on the facing side, hair per cut (short, long, bun,
// shaved, grey, cap, scarf), the head's shadow on its own shoulders. Three passes (ground, bodies by shoulder height, heads by height). Options: `band` (people whose shoulders project into
// the caption band take a mid or dark top and a non-pale head; never chosen by skin), `crouch` (metres every head and shoulder drops), `clearWarm` (no orange top within r m of him), `cuts` (long and bun hair; off reproduces LF03 exactly). Wash-only polygons (DF-20261031-paint-seed-defer).
// Kit intake (W8.4): `new: person-top` (proposal in build-notes.md).
import {ell, hardFill} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {camPoint, camSpace, type YCam} from '../kit/ycam';
import {bottomShade} from './shade';
import {pushU} from './street';

type Look = {top: string; shade: string; legs?: string; hair: string; skin: string; head?: 'hair' | 'shaved' | 'cap' | 'scarf' | 'grey'; cut?: 'short' | 'long' | 'bun'; capCol?: string; kid?: boolean};
/** Outfits seen from above (designed from the story: everyone on Earth; no mustard near his colour). Values chosen so a packed field averages mid-dark. */
export const TOPS: [string, string][] = [
  ['#e9e4d8', '#b9b3a6'], // office / school white shirt
  ['#2f4a72', '#1f3352'], // navy polo / school
  ['#c94f3d', '#8f3427'], // red tee
  ['#3f6fa8', '#2b4d78'], // blue tee
  ['#3a8a6a', '#275f49'], // green (rider jacket)
  ['#d77fa1', '#a35a77'], // pink
  ['#d9822b', '#a85f1c'], // monk saffron
  ['#4b4f5a', '#33363f'], // grey hoodie
  ['#6b5a3c', '#4b3f2a'], // police brown
  ['#f2efe6', '#c6c1b4'], // nurse white
  ['#3b3f6e', '#2a2d50'], // yukata indigo
  ['#7d6a8f', '#584a66'], // lilac
  ['#2b2b2e', '#1a1a1c'], // black tee
  ['#9a3d4a', '#6c2a33'], // maroon
];
/** Orange tops (monk saffron): banned within `clearWarm` m of him with the mustard rule (Film, 2026-11-12: no yellow, mustard or orange near him; the list has no yellow). */
export const WARM_TOPS = new Set(['#d9822b']);
const LIGHT = new Set(['#e9e4d8', '#f2efe6', '#d77fa1', '#d9822b']);
const SKINS = ['#e8bf98', '#d9a67c', '#b88358', '#8d5c3a', '#6b4128', '#f0cfae'];
const HAIRS = ['#1b1714', '#231b16', '#2a2019', '#3b2c20', '#6b4a2b', '#a9a39a'];
export const MAN = {tee: '#e3b23c', teeShade: '#b38619', hair: '#141110', skin: '#d9a67c', phone: '#22252b', screen: '#cfe6ff', dot: '#2f7df6'};

const lookFor = (k: number, cuts = false): Look => {
  const t = TOPS[Math.floor(hash(k * 11) * TOPS.length)], r = hash(k * 23);
  const head: Look['head'] = t[0] === '#d9822b' ? 'shaved' : r < 0.07 ? 'cap' : r < 0.12 ? 'scarf' : r < 0.18 ? 'grey' : 'hair';
  return {top: t[0], shade: t[1], legs: ['#2c2a2e', '#3a3f52', '#4a3f35', '#23262d'][Math.floor(hash(k * 43) * 4)], hair: head === 'grey' ? '#b3ada3' : HAIRS[Math.floor(hash(k * 13) * 5)], skin: SKINS[Math.floor(hash(k * 17) * SKINS.length)], head, capCol: TOPS[Math.floor(hash(k * 29) * TOPS.length)][0], kid: hash(k * 31) > 0.93, cut: cuts ? (hash(k * 47) < 0.18 ? 'long' : hash(k * 47) < 0.3 ? 'bun' : 'short') : 'short'};
};

const hullPts = (pts: Pt[]): Pt[] => {
  const s = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], up: Pt[] = [];
  for (const q of s) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of [...s].reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};

type Person = {x: number; z: number; H: number; yaw: number; k: number; man: boolean; look: Look};
export type CrowdTopOpts = {manAt?: [number, number]; seed?: number; band?: [number, number]; sun?: [number, number]; dimOutside?: {cx: number; cz: number; half: number; amount: number}; crouch?: number; clearWarm?: number; cuts?: boolean};

/** Ground plane point to picture (or null). */
const P = (cam: YCam, x: number, y: number, z: number) => camPoint(cam, [x, y, z]);
/** An ellipse lying in the horizontal plane y, centre (x, z), half-axes a (along the person's right) and b (along facing), turned by yaw. */
const flatEll = (cam: YCam, x: number, y: number, z: number, a: number, b: number, yaw: number, n = 14): Pt[] | null => {
  const out: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2, u = a * Math.cos(t), v = b * Math.sin(t);
    const q = P(cam, x + u * Math.cos(yaw) - v * Math.sin(yaw), y, z + u * Math.sin(yaw) + v * Math.cos(yaw));
    if (!q) return null;
    out.push(q);
  }
  return out;
};

/** Packed people straight down in a box (metres). Returns the man's head-top picture point. */
export const paintPersonTop = (p: Painter, cam: YCam, box: {x0: number; x1: number; z0: number; z1: number}, o: CrowdTopOpts = {}) => {
  const seed = o.seed ?? 17, L = 0.5, J = 0.08, sun = o.sun ?? [0.98, 0.18]; // horizontal sun direction (east, a little south): lit side +x
  const people: Person[] = [];
  for (let i = Math.round(box.x0 / L); i <= Math.round(box.x1 / L); i++) for (let j = Math.round(box.z0 / L); j <= Math.round(box.z1 / L); j++) {
    const k = (i + 500) * 1000 + (j + 500) + seed * 7;
    const man = !!o.manAt && i === o.manAt[0] && j === o.manAt[1];
    const cuts = o.cuts ?? true, cwR = o.clearWarm ?? 3, dH = o.crouch ?? 0;
    let look = lookFor(k, cuts);
    if (o.manAt && !man && Math.hypot((i - o.manAt[0]) * L, (j - o.manAt[1]) * L) < cwR) for (let r = 1; r < 12 && WARM_TOPS.has(look.top); r++) look = lookFor(k + r * 104729, cuts);
    if (o.band) { const c = camPoint(cam, [i * L, 1.3, j * L]); if (c && c[1] > o.band[0] - 60 && c[1] < o.band[1] + 60) for (let r = 1; r < 12 && (LIGHT.has(look.top) || look.head === 'grey' || look.head === 'shaved'); r++) look = lookFor(k + r * 7919, cuts); }
    const H = (man ? 1.72 : look.kid ? 1.15 + 0.2 * hash(k * 37) : 1.5 + 0.3 * hash(k * 5)) - dH;
    // facing: mostly north (where the crowd looks), +-70 deg seeded, some turned to a neighbour
    const yaw = man ? 0 : (hash(k * 41) - 0.5) * 2.4;
    people.push({x: i * L + (man ? 0 : (hash(k * 3) * 2 - 1) * J), z: j * L + (man ? 0 : (hash(k * 7) * 2 - 1) * J), H, yaw, k, man, look: man ? {top: MAN.tee, shade: MAN.teeShade, hair: MAN.hair, skin: MAN.skin, head: 'hair'} : look});
  }
  // ground: shadowed asphalt in the gaps
  hardFill(p, 600000, '#26231f', [[-30, -30], [1110, -30], [1110, 1950], [-30, 1950]]);
  const sideX = sun[0], sideZ = sun[1];
  // bodies, lowest shoulders first
  const byShoulder = [...people].sort((a, b) => a.H - b.H);
  for (const q of byShoulder) {
    const s = q.H / 1.72, ys = 0.755 * q.H, fx = Math.sin(q.yaw), fz = -Math.cos(q.yaw), sd = 610000 + (q.k % 80000) * 4;
    // upper arms beside the torso, then the shoulders (shade under, lit part toward the sun)
    for (const side of [-1, 1]) {
      const ax = q.x + side * 0.21 * s * Math.cos(q.yaw), az = q.z + side * 0.21 * s * Math.sin(q.yaw);
      const arm = flatEll(cam, ax, ys - 0.12, az, 0.055 * s, 0.075 * s, q.yaw, 10);
      if (arm) hardFill(p, sd + (side > 0 ? 1 : 2), side * sideX > 0 ? q.look.top : q.look.shade, arm);
    }
    const sh = flatEll(cam, q.x, ys, q.z, 0.225 * s, 0.14 * s, q.yaw);
    if (!sh) continue;
    // the body below the shoulders, seen in perspective off the lens axis (torso and legs in shade): fills the gaps like a real packed crowd from above
    const hip = flatEll(cam, q.x, 0.52 * q.H, q.z, 0.18 * s, 0.12 * s, q.yaw), feet = flatEll(cam, q.x, 0.05, q.z, 0.15 * s, 0.13 * s, q.yaw);
    if (hip && feet) hardFill(p, sd + 6, mixColor(q.look.legs ?? '#2c2a2e', '#141210', 0.45), hullPts([...hip, ...feet]));
    if (hip) hardFill(p, sd + 7, mixColor(q.look.shade, '#17140f', 0.5), hullPts([...sh, ...hip]));
    hardFill(p, sd + 3, q.look.shade, sh);
    const lit = flatEll(cam, q.x + sideX * 0.04 * s, ys + 0.01, q.z + sideZ * 0.04 * s, 0.17 * s, 0.1 * s, q.yaw);
    if (lit) hardFill(p, sd, q.look.top, lit);
    if (q.man) { // the phone held at his chest, screen up (K01 blue dot)
      const px = q.x + fx * 0.2, pz = q.z + fz * 0.2;
      const ph = flatEll(cam, px, ys - 0.06, pz, 0.04, 0.075, q.yaw, 8), sc = flatEll(cam, px, ys - 0.055, pz, 0.031, 0.062, q.yaw, 8), dot = P(cam, px, ys - 0.05, pz);
      for (const side of [-1, 1]) { const hnd = flatEll(cam, px + side * 0.045 * Math.cos(q.yaw), ys - 0.07, pz + side * 0.045 * Math.sin(q.yaw), 0.03, 0.035, q.yaw, 8); if (hnd) hardFill(p, sd + 10 + side, q.look.skin, hnd); }
      if (ph) hardFill(p, sd + 12, MAN.phone, ph);
      if (sc) hardFill(p, sd + 13, MAN.screen, sc);
      if (dot) hardFill(p, sd + 14, MAN.dot, ell(dot[0], dot[1], 3.5, 3.5, 8));
    }
  }
  // heads, lowest first: the head's shadow on its own shoulders (WNW), a skin sliver toward the facing side, hair / headwear
  const byHead = [...people].sort((a, b) => a.H - b.H);
  let manTop: Pt | null = null;
  for (const q of byHead) {
    const s = q.H / 1.72, yc = q.H - 0.11 * s, fx = Math.sin(q.yaw), fz = -Math.cos(q.yaw), sd = 900000 + (q.k % 80000) * 6;
    const shd = flatEll(cam, q.x - sideX * 0.14, 0.755 * q.H + 0.012, q.z - sideZ * 0.14, 0.1 * s, 0.09 * s, q.yaw, 12);
    if (shd) hardFill(p.layer(0.32, sd), sd, '#120f0d', shd);
    const face = flatEll(cam, q.x + fx * 0.045 * s, yc - 0.02, q.z + fz * 0.045 * s, 0.085 * s, 0.085 * s, q.yaw, 12);
    if (face) hardFill(p, sd + 1, q.look.skin, face);
    const nose = P(cam, q.x + fx * 0.115 * s, yc - 0.03, q.z + fz * 0.115 * s);
    const hd = q.look.head;
    if (hd === 'shaved') {
      const cap = flatEll(cam, q.x, yc + 0.02, q.z, 0.092 * s, 0.1 * s, q.yaw, 12);
      if (cap) hardFill(p, sd + 2, q.look.skin, cap);
      const hl = flatEll(cam, q.x + sideX * 0.03, yc + 0.06, q.z + sideZ * 0.03, 0.04 * s, 0.045 * s, q.yaw, 8);
      if (hl) hardFill(p.layer(0.45, sd + 3), sd + 3, '#f6dcc0', hl);
    } else {
      const col = hd === 'cap' ? q.look.capCol! : hd === 'scarf' ? q.look.capCol! : q.look.hair;
      const back = hd === 'scarf' ? 0 : 0.02;
      const long = q.look.cut === 'long' && hd === 'hair';
      const hair = flatEll(cam, q.x - fx * (long ? 0.05 : back) * s, yc + 0.03, q.z - fz * (long ? 0.05 : back) * s, (long ? 0.108 : 0.098) * s, hd === 'scarf' ? 0.115 * s : (long ? 0.13 : 0.105) * s, q.yaw, 14);
      if (hair) hardFill(p, sd + 2, col, hair);
      if (q.look.cut === 'bun' && hd === 'hair') { const bun = flatEll(cam, q.x - fx * 0.115 * s, yc + 0.05, q.z - fz * 0.115 * s, 0.04 * s, 0.04 * s, q.yaw, 8); if (bun) hardFill(p, sd + 6, col, bun); }
      if (hd === 'cap') { const brim = flatEll(cam, q.x + fx * 0.11 * s, yc + 0.01, q.z + fz * 0.11 * s, 0.075 * s, 0.05 * s, q.yaw, 10); if (brim) hardFill(p, sd + 3, col, brim); }
      const hl = flatEll(cam, q.x + sideX * 0.035, yc + 0.06, q.z + sideZ * 0.035, 0.04 * s, 0.05 * s, q.yaw, 8);
      if (hl && hd !== 'scarf') hardFill(p.layer(0.22, sd + 4), sd + 4, '#d8d0c4', hl);
    }
    if (nose && hd !== 'scarf') hardFill(p, sd + 5, q.look.skin, ell(nose[0], nose[1], 3, 3, 6));
    if (q.man) {
      // spiky black hair: spikes radiating from the crown
      const crown = P(cam, q.x, q.H, q.z);
      if (crown) {
        manTop = crown;
        const rp = Math.abs((camSpace(cam, [q.x + 0.1, q.H, q.z]).r - camSpace(cam, [q.x, q.H, q.z]).r) * cam.f / camSpace(cam, [q.x, q.H, q.z]).d);
        for (let k = 0; k < 11; k++) { const a = (k / 11) * Math.PI * 2 + 0.2, b = a + 0.32; hardFill(p, sd + 20 + k, MAN.hair, [[crown[0] + Math.cos(a) * rp * 0.8, crown[1] + Math.sin(a) * rp * 0.8], [crown[0] + Math.cos(a + 0.16) * rp * 1.28, crown[1] + Math.sin(a + 0.16) * rp * 1.28], [crown[0] + Math.cos(b) * rp * 0.8, crown[1] + Math.sin(b) * rp * 0.8]]); }
        hardFill(p.layer(0.3, sd + 40), sd + 40, '#5a5650', ell(crown[0] + rp * 0.25, crown[1] - rp * 0.1, rp * 0.3, rp * 0.22, 8));
      }
    }
  }
  if (o.dimOutside) { // a soft dim outside a square region (focus option)
    const d = o.dimOutside, a = P(cam, d.cx - d.half, 1.62, d.cz - d.half), b = P(cam, d.cx + d.half, 1.62, d.cz + d.half);
    if (a && b) {
      const [x0, y0, x1, y1] = [a[0], a[1], b[0], b[1]];
      const frame: Pt[] = [[-30, -30], [1110, -30], [1110, 1950], [-30, 1950], [-30, y0], [x0, y0], [x0, y1], [x1, y1], [x1, y0], [-30, y0]];
      hardFill(p.layer(d.amount, 990000), 990000, '#0e1116', frame);
    }
  }
  return manTop;
};

/** SH04 camera (storyboard R2.1: pos (0, 4.00 -> 3.85, 0.08), look-at (0, 0, 0), straight down, f 1000, push +0 to +66 eased over 6 f). */
export const sh04Cam = (f: number): YCam => ({x: 0, y: 4.0 - 0.15 * pushU(f, 66), z: 0.08, yaw: 0, pitch: (-89 * Math.PI) / 180, f: 1000, hy: 960});
/** The grid and the square lie at crown height (about 220 px at +43). */
export const SQUARE_Y = 1.62;
const strip = (pts: Pt[], w: number): Pt[] => {
  const n = pts.length, L: Pt[] = [], R: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1];
    const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
    L.push([pts[i][0] - dy * (w / 2), pts[i][1] + dx * (w / 2)]); R.push([pts[i][0] + dy * (w / 2), pts[i][1] - dx * (w / 2)]);
  }
  return [...L, ...R.reverse()];
};
/** The square's picture corners (0.5 m around his head at crown height). */
export const squareCorners = (cam: YCam): Pt[] => ([[-0.25, -0.25], [0.25, -0.25], [0.25, 0.25], [-0.25, 0.25]] as Pt[]).map(([x, z]) => camPoint(cam, [x, SQUARE_Y, z]) as Pt);

/** SH04 at shot-local frame `f`: person-top crowd (his cell at the lattice origin), the 0.5 m grid fading in +0-+10, the lens falloff `bottomShade(p, 1000, 0.36)`, the square drawing on +12-+24
 * (3 px `#ffd34a` with a soft shadow; the brief's 2 px does not read at 270 px). Returns the camera, his crown and the square corners (OT03 anchors on the square's right edge). */
export const paintSh04 = (p: Painter, f: number) => {
  const cam = sh04Cam(f), crown = paintPersonTop(p, cam, {x0: -3, x1: 3, z0: -5, z1: 5}, {manAt: [0, 0], band: [1176, 1344]});
  const ga = Math.min(1, Math.max(0, f / 10));
  if (ga > 0) {
    const g = p.layer(0.2 * ga, 980000);
    let k = 0;
    for (let v = -2.75; v <= 2.76; v += 0.5) {
      const a = camPoint(cam, [v, SQUARE_Y, -4.5]), b = camPoint(cam, [v, SQUARE_Y, 4.5]), c = camPoint(cam, [-2.5, SQUARE_Y, v * 1.7]), d = camPoint(cam, [2.5, SQUARE_Y, v * 1.7]);
      if (a && b) hardFill(g, 980000 + k++, '#ffffff', strip([a, b], 1.6));
      if (c && d) hardFill(g, 980000 + k++, '#ffffff', strip([c, d], 1.6));
    }
  }
  bottomShade(p, 1000, 0.36, 982000);
  const sq = squareCorners(cam), u = Math.min(1, Math.max(0, (f - 12) / 12)), e = u * u * (3 - 2 * u);
  if (e > 0) {
    // perimeter path from corner 0, clockwise, drawn to fraction e
    const loop = [...sq, sq[0]], len = loop.slice(1).map((q, i) => Math.hypot(q[0] - loop[i][0], q[1] - loop[i][1])), tot = len.reduce((a, b) => a + b, 0);
    const path: Pt[] = [loop[0]];
    let left = e * tot;
    for (let i = 0; i < 4 && left > 0; i++) { const t = Math.min(1, left / len[i]); path.push([loop[i][0] + (loop[i + 1][0] - loop[i][0]) * t, loop[i][1] + (loop[i + 1][1] - loop[i][1]) * t]); left -= len[i]; }
    if (path.length > 1) {
      hardFill(p.layer(0.45, 981000), 981000, '#1b1610', strip(path.map(([x, y]) => [x + 2, y + 2] as Pt), 5));
      hardFill(p, 981001, '#ffd34a', strip(path, 3));
    }
  }
  return {cam, crown, square: sq};
};
