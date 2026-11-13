import {hardFill, inkLine, washAt, ell} from '../kit/draw';
import {paintFigureAt} from '../kit/figure-at';
import {hash} from '../kit/hash';
import type {Painter, Pt} from '../kit/painter';
import {mixColor} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import {squeezedFig} from './squeezed';
import type {V3} from '../kit/space';
import {dress, type OutfitId} from '../kit/wardrobe';
import type {CastDef} from '../kit/cast';
import {camPoint, camPoly, camSpace, camUnit, type YCam} from '../kit/ycam';
import {clip} from '../kit/world';

// EDU-EP17 look frames, set B (W3, Film): SET-SUKH16 street for LF02 (shot 5 @ +15) and the SH11 head-read check.
// Look-defining paint, not a plate: Boss hardens the street set in `street.ts` (N7) from these stills (looks-b.md).
// Space `S`: metres, origin M0 at the man's feet, +x east, +y up, +z south toward the cameras.

export const ST = {
  sky: '#a9c8df', haze: '#dfe6e3', asphalt: '#8a8a86', lane: '#d9d6cc', conc: '#c9c4b8', concSh: '#8e8a82',
  house: ['#d8cdb4', '#c9b48e', '#b8c2b0', '#d2c2a4'], shutter: '#9aa0a6', awning: ['#b4552e', '#3f6f8f'], sign: ['#e0b84a', '#c94f3d', '#f2efe6'],
  win: '#4a4640', winLit: '#6b6152', ac: '#e9e6dc', cable: '#26231f', plant: '#4f7a45', shade: '#5d6470',
  skins: ['#f1c9a5', '#d9a77f', '#b97f55', '#8a5a3a', '#e8b996', '#6b4428'], hair: ['#1d1a18', '#2b2420', '#3b2f25', '#5a4636', '#9a9a9a', '#14110f'],
  shirts: ['#c94f3d', '#e0b84a', '#3f6fa8', '#f2efe6', '#3a8a6a', '#d77fa1', '#e8e4da', '#6b7480', '#d98a3a', '#2d3440', '#f2ead8', '#7a5aa0'],
};
export const MAN_TEE = '#e3b23c';

/** Camera from position and look-at (the scene sheet's `ycam` lines): yaw about +y, pitch up positive, hy 960 by default. */
export const lookCam = (pos: V3, at: V3, f = 1000, hy = 960, cx = 0): YCam => {
  const dx = at[0] - pos[0], dy = at[1] - pos[1], dz = at[2] - pos[2];
  return {x: pos[0], y: pos[1], z: pos[2], yaw: Math.atan2(dx, -dz), pitch: Math.atan2(dy, Math.hypot(dx, dz)), f, hy, cx};
};
export const lerpV = (a: V3, b: V3, u: number): V3 => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];

const W = (p: Painter, c: YCam, seed: number, color: string, pts: V3[], op = 255) => {
  const q = clip(camPoly(c, pts));
  if (q.length < 3) return;
  if (op >= 255) hardFill(p, seed, color, q); else washAt(p, seed, color, op, q, 0, 0);
};
const quadZ = (z: number, x0: number, x1: number, y0: number, y1: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]];

/** MAN: kit `man-spiky + park-casual` with the cap off (brief VD02, D01). */
export const manDef = (): CastDef => {
  const d = dress(PEOPLE['man-spiky'], 'park-casual');
  return {...d, outfit: {...d.outfit, gear: {...d.outfit.gear, hat: undefined}}};
};
export const castOf = (id: keyof typeof PEOPLE, outfit?: OutfitId): CastDef => (outfit ? dress(PEOPLE[id], outfit) : PEOPLE[id]);

/** The sky (whole picture) and the SET-SUKH16 north side: shophouse façade z -18, viaduct deck z -14.5..-5.5, pillars, poles and cables, road. */
export const paintStreetSet = (p: Painter, c: YCam, o: {detail?: boolean; viaductShadow?: number} = {}) => {
  const box: Pt[] = [[-40, -40], [1120, -40], [1120, 1960], [-40, 1960]];
  hardFill(p, 10, ST.sky, box);
  // haze toward the horizon (one band under the horizon line of this camera)
  const hz = camPoint(c, [c.x + 400 * Math.sin(c.yaw), c.y, c.z - 400 * Math.cos(c.yaw)]);
  if (hz) washAt(p, 11, ST.haze, 150, [[-40, hz[1] - 260], [1120, hz[1] - 260], [1120, hz[1] + 20], [-40, hz[1] + 20]], 0, 0);
  // road and pavements (seen only in gaps)
  W(p, c, 12, ST.asphalt, [[-60, 0, -14], [60, 0, -14], [60, 0, 10], [-60, 0, 10]]);
  W(p, c, 13, '#b5ae9f', [[-60, 0, -18], [60, 0, -18], [60, 0, -14], [-60, 0, -14]]);
  // shophouse façade: 4.2 m bays, 4 storeys of 3.75 m
  for (let b = -10; b < 10; b++) {
    const x0 = b * 4.2, x1 = x0 + 4.2, h = hash(b * 7.1 + 3), col = ST.house[Math.floor(h * 4)];
    const top = 15 + (h > 0.7 ? 1.2 : 0);
    W(p, c, 100 + b * 40, col, quadZ(-18, x0, x1, 0, top));
    W(p, c, 101 + b * 40, mixColor(col, '#6b5a48', 0.25), quadZ(-18, x0, x1, top - 0.35, top)); // parapet cap shade
    // ground floor: dark interior with the shutter half up
    W(p, c, 102 + b * 40, '#3e3328', quadZ(-17.98, x0 + 0.25, x1 - 0.25, 0, 2.9));
    W(p, c, 103 + b * 40, ST.shutter, quadZ(-17.97, x0 + 0.25, x1 - 0.25, 1.6 + h * 0.8, 2.9));
    for (let s = 1; s < 4; s++) {
      const y0 = s * 3.75, hs = hash(b * 13.3 + s * 5.7);
      // windows (two per bay)
      for (const wx of [0.5, 2.35]) W(p, c, 104 + b * 40 + s * 6 + wx, hs > 0.5 ? ST.win : ST.winLit, quadZ(-17.97, x0 + wx, x0 + wx + 1.35, y0 + 0.9, y0 + 2.7));
      // balcony rail
      W(p, c, 120 + b * 40 + s, mixColor(col, '#2b2622', 0.35), quadZ(-17.6, x0 + 0.2, x1 - 0.2, y0 + 0.75, y0 + 0.9));
      if (o.detail !== false) {
        if (hs > 0.35) W(p, c, 126 + b * 40 + s, ST.ac, [[x0 + 3.1, y0 + 1.0, -17.5], [x0 + 3.9, y0 + 1.0, -17.5], [x0 + 3.9, y0 + 1.6, -17.5], [x0 + 3.1, y0 + 1.6, -17.5]]);
        if (hs < 0.3) W(p, c, 130 + b * 40 + s, ST.plant, [[x0 + 0.4, y0 + 0.75, -17.5], [x0 + 1.2, y0 + 0.75, -17.5], [x0 + 1.05, y0 + 1.3, -17.5], [x0 + 0.55, y0 + 1.3, -17.5]]);
        if (b === 1 && s === 2) for (let k = 0; k < 4; k++) W(p, c, 134 + k, ST.shirts[(k * 3) % 12], [[x0 + 0.6 + k * 0.8, y0 + 0.9, -17.4], [x0 + 1.2 + k * 0.8, y0 + 0.9, -17.4], [x0 + 1.15 + k * 0.8, y0 + 0.35, -17.4], [x0 + 0.65 + k * 0.8, y0 + 0.35, -17.4]]);
      }
    }
    // textless sign block on floor 2 or 3, and the awning
    if (h > 0.25) { const sy = h > 0.6 ? 7.5 : 4.0; W(p, c, 140 + b * 40, ST.sign[Math.floor(hash(b + 0.3) * 3)], quadZ(-17.4, x0 + 0.4, x1 - 0.4, sy + 0.3, sy + 1.3)); }
    W(p, c, 145 + b * 40, ST.awning[(b + 20) % 2], [[x0 + 0.1, 3.0, -16.7], [x1 - 0.1, 3.0, -16.7], [x1 - 0.1, 3.5, -18], [x0 + 0.1, 3.5, -18]]);
  }
  // power poles and the sagging cable bundle (z -15)
  for (const px of [-30, 0, 30]) W(p, c, 300 + px, '#7a756c', [[px - 0.12, 0, -15], [px + 0.12, 0, -15], [px + 0.12, 9.5, -15], [px - 0.12, 9.5, -15]]);
  for (let k = 0; k < 3; k++) {
    const pts: Pt[] = [];
    for (let i = 0; i <= 24; i++) { const x = -30 + (60 * i) / 24, s = Math.abs(((x + 30) % 30) / 30 - 0.5) * 2; const q = camPoint(c, [x, 7.2 + k * 0.25 + 1.6 * s * s, -15]); if (q) pts.push(q); }
    inkLine(p, 310 + k, pts, {color: ST.cable, weight: 1.6, closed: false, still: true});
  }
  // the BTS viaduct: deck, parapet, underside, pillars and pier caps
  W(p, c, 400, ST.concSh, [[-80, 11.5, -14.5], [80, 11.5, -14.5], [80, 11.5, -5.5], [-80, 11.5, -5.5]]);
  W(p, c, 401, ST.conc, quadZ(-5.5, -80, 80, 11.5, 13.5));
  W(p, c, 402, mixColor(ST.conc, '#ffffff', 0.15), quadZ(-5.6, -80, 80, 13.5, 14.5));
  for (const px of [-8, 22, -38]) {
    for (let a = 0; a < 1; a++) W(p, c, 410 + px, mixColor(ST.conc, ST.concSh, 0.35), [[px - 0.9, 0, -9.1], [px + 0.9, 0, -9.1], [px + 0.9, 10.5, -9.1], [px - 0.9, 10.5, -9.1]]);
    W(p, c, 420 + px, ST.conc, [[px - 1.5, 10.5, -8.5], [px + 1.5, 10.5, -8.5], [px + 1.5, 11.5, -8.5], [px - 1.5, 11.5, -8.5]]);
  }
  // the viaduct's shadow band on the far lanes (10:30 sun): a cool wash over everything between z -14 and -6, painted later over the crowd too
  void o.viaductShadow;
};

type Head = {x: number; z: number; h: number; skin: string; hair: string; shirt: string; turn: number};
/** People on the 0.5 m lattice (+-0.08 m jitter, seeded) as head-and-shoulder washes (`crowd-heads` look), far to near. */
export const crowdHeads = (box: {x0: number; x1: number; z0: number; z1: number}, skip: (x: number, z: number) => boolean, seed = 1): Head[] => {
  const out: Head[] = [];
  for (let z = box.z0; z <= box.z1; z += 0.5) for (let x = box.x0; x <= box.x1; x += 0.5) {
    const k = x * 131.7 + z * 17.3 + seed * 3.1, jx = (hash(k) - 0.5) * 0.16, jz = (hash(k + 1) - 0.5) * 0.16;
    if (skip(x + jx, z + jz)) continue;
    const kid = hash(k + 9) < 0.06, h = kid ? 1.2 + hash(k + 2) * 0.2 : 1.55 + hash(k + 2) * 0.27;
    out.push({x: x + jx, z: z + jz, h, skin: ST.skins[Math.floor(hash(k + 3) * 6)], hair: ST.hair[Math.floor(hash(k + 4) * 6)], shirt: ST.shirts[Math.floor(hash(k + 5) * 12)], turn: (hash(k + 6) - 0.5) * 2});
  }
  return out.sort((a, b) => a.z - b.z);
};
/** One crowd head card: shoulders, neck, head disc, hair cap (turned by `turn`), squared to the lens. `shade` 0..1 darkens it (viaduct shadow). */
export const paintHead = (p: Painter, c: YCam, n: Head, i: number, o: {shade?: number; crouch?: number; shoulders?: number; body?: number} = {}) => {
  const y = n.h - (o.crouch ?? 0), top = camPoint(c, [n.x, y, n.z]);
  if (!top) return;
  const u = camUnit(c, [n.x, y, n.z]), r = 0.105 * u;
  if (r < 0.6 || top[0] < -60 || top[0] > 1140 || top[1] > 2000 || top[1] < -80) return;
  const sh = o.shade ?? 0, d = (col: string) => (sh > 0 ? mixColor(col, '#3c4250', sh * 0.45) : col);
  const cx = top[0], cy = top[1] + r, sw = (o.shoulders ?? 0.23) * u;
  const bl = o.body ?? 6;
  if (r >= 2) hardFill(p, 5000 + i * 4, d(n.shirt), [[cx - sw, cy + r * 1.35], [cx + sw, cy + r * 1.35], [cx + sw * 1.05, cy + r * bl], [cx - sw * 1.05, cy + r * bl]]);
  hardFill(p, 5001 + i * 4, d(n.skin), ell(cx, cy, r * 0.86, r, r > 4 ? 14 : 8));
  if (r >= 1.5) {
    const tw = n.turn * r * 0.35;
    hardFill(p, 5002 + i * 4, d(n.hair), [...ell(cx + tw * 0.3, cy - r * 0.15, r * 0.92, r * 0.9, r > 4 ? 12 : 7).filter(([, yy]) => yy <= cy - r * 0.05), [cx + r * 0.9 + tw, cy - r * 0.05], [cx - r * 0.9 + tw, cy - r * 0.05]]);
    if (Math.abs(n.turn) > 0.75 && r > 5) hardFill(p, 5003 + i * 4, d(n.hair), ell(cx - Math.sign(n.turn) * r * 0.25, cy + r * 0.05, r * 0.7, r * 0.85, 10)); // turned away: the back of the head
  }
};

export {squeezedFig};

/** Card scale under a pitched lens: the flat card is sized so its head top lands on the true projected head top (feet stay on the ground point). */
export const pitchScale = (c: YCam, at: V3, h: number): number => {
  const g = camPoint(c, at), top = camPoint(c, [at[0], h, at[2]]);
  return g && top ? (g[1] - top[1]) / (h * camUnit(c, at)) : 1;
};

export type Lf02Opt = 'A' | 'B' | 'C';
/** SH05 camera at shot-local frame `f` (sheet R2.1: pos (0.10, 1.62, 1.30) -> (0.08, 1.60, 1.22), look-at (0, 1.20, 0), push +0..+54); option C swings 14 deg to see the viaduct (thumbnail only). */
export const sh05Cam = (f: number, opt: Lf02Opt = 'A'): YCam => {
  const u = Math.min(1, Math.max(0, f / 54)), e = u * u * (3 - 2 * u);
  if (opt === 'C') return lookCam(lerpV([-0.25, 1.45, 1.25], [-0.27, 1.44, 1.18], e), [0.05, 1.42, 0], 1000, 900);
  return lookCam(lerpV([0.10, 1.62, 1.30], [0.08, 1.60, 1.22], e), [0, 1.20, 0]);
};

/** LF02: SH05 @ +15. A = sheet camera, sun on the crowd; B = sheet camera, the viaduct's shadow band over the far crowd (overhead structure read without the deck in frame); C = 14 deg swing, eye 1.45 m, the deck corner in frame. */
export const paintLf02 = (p: Painter, f: number, opt: Lf02Opt, detail = true) => {
  const c = sh05Cam(f, opt), t = f / 30;
  paintStreetSet(p, c, {detail});
  const shadowZ = (z: number) => (opt === 'A' ? 0 : z < -6 && z > -14.5 ? 1 : 0);
  const heads = crowdHeads({x0: -16, x1: 16, z0: -17.5, z1: -3.1}, () => false);
  // the crowd mass under the far rows (clothes, not asphalt, show between heads)
  W(p, c, 470, '#5a4a42', [[-60, 0.9, -17.5], [60, 0.9, -17.5], [60, 0.9, -2.8], [-60, 0.9, -2.8]]);
  heads.forEach((n, i) => paintHead(p, c, n, i, {shade: shadowZ(n.z)}));
  if (opt !== 'A') {
    // the band of shade over the far lanes reads the viaduct overhead (cool, 30 %)
    W(p, c, 480, '#3c4a60', [[-60, 1.0, -14.5], [60, 1.0, -14.5], [60, 1.0, -6], [-60, 1.0, -6]], 40);
  }
  // the near crowd (no `park-casual`: the mustard tee is his alone): full kit cards on the 0.5 m lattice from z -3.0 to +0.6, seeded person, outfit and view (never all facing the lens)
  const ids = Object.keys(PEOPLE) as (keyof typeof PEOPLE)[];
  const outs: OutfitId[] = ['office', 'student-th-trousers', 'monk', 'yukata', 'nurse', 'police', 'hoodie', 'vendor', 'rider', 'kitchen-apron', 'doctor', 'student-th-skirt', 'kimono', 'guard'];
  const views: ('front' | 'left' | 'right' | 'back')[] = ['front', 'left', 'right', 'back', 'front', 'left', 'right'];
  type Near = {def: CastDef; at: V3; view: 'front' | 'left' | 'right' | 'back'; seed: number; face: 'neutral' | 'tired' | 'worried'};
  const crowd: Near[] = [];
  for (let z = -3.0; z <= 0.61; z += 0.5) for (let x = -3.0; x <= 3.01; x += 0.5) {
    const k2 = x * 91.3 + z * 37.9, jx = (hash(k2) - 0.5) * 0.16, jz = (hash(k2 + 1) - 0.5) * 0.16, X = x + jx, Z = z + jz;
    if (Math.abs(x) < 0.3 && Math.abs(z) < 0.3) continue; // M0
    if (Math.abs(Math.abs(x) - 0.5) < 0.05 && Math.abs(z) < 0.3) continue; // the two neighbours' marks
    if (z > -0.1 && Math.abs(x) < 0.9) continue; // the lens line in front of him
    const id = ids[Math.floor(hash(k2 + 2) * ids.length)], of = outs[Math.floor(hash(k2 + 3) * outs.length)];
    const def = id.startsWith('boy') || id.startsWith('girl') ? castOf(id) : castOf(id, of);
    crowd.push({def, at: [X, 0, Z], view: views[Math.floor(hash(k2 + 4) * views.length)], seed: 900 + Math.round(hash(k2 + 5) * 9000), face: (['neutral', 'tired', 'worried'] as const)[Math.floor(hash(k2 + 6) * 3)]});
  }
  const kM = Math.min(1, Math.max(0, (f - 2) / 4)), press = 0.06 * kM;
  const man = manDef(), sq = squeezedFig(man, c, [0, 0, 0], kM);
  const items: {z: number; draw: () => void}[] = crowd.map((n) => ({z: n.at[2], draw: () => void paintFigureAt(p, c, n.def, {at: n.at, view: n.view, pose: 'P01', face: n.face, t, seed: n.seed, scale: pitchScale(c, n.at, n.def.height)})}));
  // MAN on M0: P10 + squeezed, tired; phone at his chest
  items.push({z: 0, draw: () => void paintFigureAt(p, c, sq.def, {at: [0, 0, 0], view: 'front', pose: 'P10', face: 'tired', fig: sq.fig, t, seed: 77, scale: pitchScale(c, [0, 0, 0], man.height)})});
  // the two neighbours press in from both sides at +2 (office man screen left, nurse screen right), turned away from him (front three-quarter), near shoulder over his
  const off = castOf('man-crop', 'office'), nur = castOf('woman-long', 'nurse');
  items.push({z: 0.12, draw: () => void paintFigureAt(p, c, off, {at: [-0.44 + press, 0, 0.12], view: 'front', fig: {quarter: 'left', quarterDeg: 55}, pose: 'P01', face: 'neutral', t, seed: 311, scale: pitchScale(c, [-0.44, 0, 0.12], off.height)})});
  items.push({z: 0.13, draw: () => void paintFigureAt(p, c, nur, {at: [0.44 - press, 0, 0.13], view: 'front', fig: {quarter: 'right', quarterDeg: 55}, pose: 'P01', face: 'neutral', t, seed: 313, scale: pitchScale(c, [0.44, 0, 0.13], nur.height)})});
  items.sort((a, b) => a.z - b.z).forEach((it) => it.draw());
  return c;
};

/** SH11 head-read check: Boss's stand-in camera, the crowd crouched; `mode` how his head is marked (none, brighter tee, halo). */
export const sh11Cam = (): YCam => lookCam([0, 4.5, 6.0], [0, 0.6, -4.0]);
export const paintSh11Check = (p: Painter, mode: 'none' | 'tee' | 'halo' | 'clear') => {
  const c = sh11Cam();
  paintStreetSet(p, c, {detail: true});
  const heads = crowdHeads({x0: -12, x1: 12, z0: -17.5, z1: 6.5}, (x, z) => Math.abs(x) < 0.3 && Math.abs(z) < 0.3, 4);
  // 'clear': no warm yellow or orange shirts within 3 m of him (the crowd keeps them elsewhere), so his mustard is the only one near the centre
  if (mode === 'clear') heads.forEach((n) => { if (Math.hypot(n.x, n.z) < 3 && ['#e0b84a', '#d98a3a', '#f2ead8', '#e8e4da', '#f2efe6'].includes(n.shirt)) n.shirt = ['#3f6fa8', '#6b7480', '#3a8a6a', '#2d3440'][Math.floor(hash(n.x * 7 + n.z) * 4)]; });
  heads.forEach((n, i) => paintHead(p, c, n, i, {crouch: 0.3 * (0.85 + 0.3 * hash(i * 1.7)), shade: n.z < -6 && n.z > -14.5 ? 1 : 0}));
  // him at M0, crouched: mustard tee, spiky black hair (same head card language)
  const me: Head = {x: 0, z: 0, h: 1.72, skin: '#8a5a3a', hair: '#141110', shirt: mode === 'tee' || mode === 'clear' ? '#ffc21a' : MAN_TEE, turn: 0};
  const top = camPoint(c, [0, 1.42, 0]) as Pt, u = camUnit(c, [0, 1.42, 0]);
  if (mode === 'halo' || mode === 'clear') { washAt(p, 7000, '#fff3c4', mode === 'clear' ? 120 : 150, ell(top[0], top[1] + 0.1 * u, 0.55 * u, 0.45 * u, 24), 0, 0); washAt(p, 7001, '#fff8e0', 110, ell(top[0], top[1] + 0.1 * u, 0.36 * u, 0.3 * u, 20), 0, 0); }
  paintHead(p, c, me, 9999, {crouch: 0.3, shoulders: mode === 'tee' ? 0.27 : 0.23});
  // re-draw the nearer rows over him (he sits inside the crowd, not on top)
  heads.forEach((n, i) => { if (n.z > 0.2 && Math.abs(n.x) < 1.5) paintHead(p, c, n, i, {crouch: 0.3 * (0.85 + 0.3 * hash(i * 1.7))}); });
  void camSpace;
  return {c, head: top, u};
};
