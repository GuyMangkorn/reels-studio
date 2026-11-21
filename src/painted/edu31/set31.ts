import {ell, hardFill, inkLine, INK, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import {WARDROBE} from '../kit/wardrobe';
import type {CastDef} from '../kit/cast';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {flatCircle, paintBox, qx, qy, qz, sphereAt, wFill, wInk, wp, wWash, type Box} from '../kit/world';

// EDU-EP31-SHORT W3 sets and cast (EDU-EP31-BRIEF-R4 set plans K/K2, H, T, V, N, P, R; Film, 2026-11-21). World metres, +x right, +y up,
// +z toward each space's master camera. Look-frame estimates: the timed pass re-checks every number with scripts/shot-projection.py.

const DEG = Math.PI / 180;
/** Yaw camera from degrees (yaw 0 looks -z, + turns toward +x; pitch + looks up). */
export const cam = (x: number, y: number, z: number, yaw: number, pitch: number, f: number, hy: number, cx = 0): YCam =>
  ({x, y, z, yaw: yaw * DEG, pitch: pitch * DEG, f, hy, cx});

// ------------------------------------------------------------------ cast (VD31-14)
/** WHEELER: man-buzz (buzz cut, full beard; user Q3) + new: windbreaker-1995 (teal nylon shell, purple chest panel), stone-wash jeans, white sneakers. */
export const WHEELER: CastDef = {...PEOPLE['man-buzz'], seed: 3101,
  outfit: {shoulder: 0.45, shirt: '#6b4c94', sleeve: '#2c8a88', longSleeves: true, jacket: '#2c8a88', pants: '#7d95b4', shoes: '#efebe2'}};
/** FRIEND: man-spiky as cast (rust jacket, cream tee, jeans). */
export const FRIEND: CastDef = {...PEOPLE['man-spiky'], seed: 3102};
/** TELLER: woman-curly (background). */
export const TELLER: CastDef = {...PEOPLE['woman-curly'], seed: 3103};
/** YOU: woman-bob + hoodie (EDU-EP19 viewer stand-in). */
export const YOU: CastDef = {...PEOPLE['woman-bob'], outfit: WARDROBE.hoodie, seed: 3104};
/** ANCHOR: man-parted + office. */
export const ANCHOR: CastDef = {...PEOPLE['man-parted'], outfit: WARDROBE.office, seed: 3105};
/** POLICE: man-crop + new: us-police-1995 (navy short-sleeve shirt, plain silver badge, no text). */
export const POLICE: CastDef = {...PEOPLE['man-crop'], seed: 3106,
  outfit: {shoulder: 0.44, shirt: '#27334d', sleeve: '#27334d', longSleeves: false, pants: '#1e2333', shoes: '#151413',
    gear: {badge: '#c8ccd3', belt: {color: '#141414', buckle: '#b9bcc2'}, pockets: true}}};

// ------------------------------------------------------------------ small helpers
export const glow = (p: Painter, seed: number, x: number, y: number, rx: number, ry: number, color: string, op: number, n = 5) => {
  for (let i = 0; i < n; i++) {
    const k = 1 - i / n;
    washAt(p, seed + i, color, op / n * (1 + i * 0.4), ell(x, y, rx * k, ry * k, 28), 0.3, 0.05);
  }
};
/** Grain streaks on a world rectangle (wood, wall stains): thin washes along x at random heights. */
const streaks = (p: Painter, c: YCam, seed: number, color: string, op: number, x0: number, x1: number, y0: number, y1: number, z: number, n: number) => {
  for (let i = 0; i < n; i++) {
    const h = y0 + ((Math.sin(seed * 13.1 + i * 7.7) + 1) / 2) * (y1 - y0), w = 0.01 + 0.02 * ((i * 37) % 5) / 5;
    wWash(p, c, seed + i, color, op, qz(z, x0, x1, h, h + w), 0.1, 0.5);
  }
};

/** Whole lemon (ellipsoid look from any side): yellow body, shade crescent, a wet glint. `r` = radius (m). */
export const paintLemon = (p: Painter, c: YCam, seed: number, at: V3, r: number, o: {glint?: number; tilt?: number} = {}) => {
  const s = sphereAt(c, at, r);
  if (s) lemonPx(p, seed, s.x, s.y, s.r, o);
};
/** The lemon in picture px (centre, radius): used for a lemon held in a mitten (figure anchors). */
export const lemonPx = (p: Painter, seed: number, x: number, y: number, r: number, o: {glint?: number; tilt?: number; shadow?: boolean} = {}) => {
  const a = (o.tilt ?? -20) * DEG;
  if (o.shadow !== false) washAt(p, seed, '#2b2014', 60, ell(x + r * 0.25, y + r * 0.9, r * 1.1, r * 0.3, 18), 0.2, 0.1);
  hardFill(p, seed + 1, '#f1c816', ell(x, y, r * 1.28, r, 22, a));
  hardFill(p, seed + 2, '#f8e04a', ell(x - r * 0.12, y - r * 0.12, r * 0.95, r * 0.7, 18, a));
  hardFill(p, seed + 3, '#e3b20e', ell(x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3, r * 0.16, r * 0.12, 10, a));
  washAt(p, seed + 4, '#b8860b', 120, ell(x + r * 0.35, y + r * 0.35, r * 0.8, r * 0.5, 16, a), 0.2, 0.2);
  if (o.glint !== 0) hardFill(p, seed + 5, '#fffbe6', ell(x - r * 0.45, y - r * 0.42, r * 0.22 * (o.glint ?? 1), r * 0.12 * (o.glint ?? 1), 10, a));
  inkLine(p, seed + 6, ell(x, y, r * 1.28, r, 22, a), {closed: true, weight: 0.7, color: '#8a6a10'});
};
/** Lemon half, cut side up (radius `r`, centre of the cut face at `at`, a horizontal circle): rind ring, pale flesh, segment lines. */
export const paintLemonHalf = (p: Painter, c: YCam, seed: number, at: V3, r: number, o: {shadow?: boolean} = {}) => {
  if (o.shadow !== false) {
    const sh = flatCircle(c, [at[0] + r * 0.35, 0.0005, at[2] + r * 0.3], r * 1.15, 24);
    if (sh.length > 2) washAt(p, seed, '#120c07', 120, sh, 0.25, 0.1);
  }
  const side = flatCircle(c, [at[0], at[1] - r * 0.5, at[2]], r, 24);
  if (side.length > 2) hardFill(p, seed + 1, '#d9a90c', side);
  const rind = flatCircle(c, at, r, 28);
  if (rind.length > 2) hardFill(p, seed + 2, '#f2cd1c', rind);
  const pith = flatCircle(c, at, r * 0.9, 28);
  if (pith.length > 2) hardFill(p, seed + 3, '#fbf2c4', pith);
  const flesh = flatCircle(c, at, r * 0.82, 28);
  if (flesh.length > 2) hardFill(p, seed + 4, '#f5df5a', flesh);
  for (let i = 0; i < 9; i++) {
    const t = (i / 9) * 2 * Math.PI, q0 = camPoint(c, [at[0] + Math.cos(t) * r * 0.1, at[1], at[2] + Math.sin(t) * r * 0.1]), q1 = camPoint(c, [at[0] + Math.cos(t) * r * 0.8, at[1], at[2] + Math.sin(t) * r * 0.8]);
    if (q0 && q1) inkLine(p, seed + 10 + i, [q0, q1], {weight: 0.45, color: '#e0c24a'});
  }
  const ctr = flatCircle(c, at, r * 0.1, 10);
  if (ctr.length > 2) hardFill(p, seed + 5, '#fbf2c4', ctr);
  if (rind.length > 2) inkLine(p, seed + 6, rind, {closed: true, weight: 0.6, color: '#8a6a10'});
};

// ------------------------------------------------------------------ Space K: bank lobby 1995 (K2 = maroon recolour)
export type BankOpts = {k2?: boolean; flat?: boolean};
const BANK = (k2?: boolean) => k2
  ? {panel: '#6e2f33', upper: '#e7d8bf', floor: '#9a4c34', trim: '#c9a24a'}
  : {panel: '#2f6a63', upper: '#e9dfc8', floor: '#b9b3a6', trim: '#d8c79a'};
/** Text placed on a world rectangle (TELLERS, JANUARY 1995): the look layer draws it as DOM text through the same camera. */
export type WorldText = {text: string; corners: [V3, V3, V3, V3]; color: string; weight?: number; font?: string};
export const BANK_TEXT: WorldText[] = [
  // hanging sign, centre (+1.4, 3.05, +8.0), 1.6 x 0.42 m board, letters 0.27 m (R4: moved from z +10.0 to z +8.0 so it reads, look-frame check)
  {text: 'TELLERS', corners: [[2.15, 3.21, 8.0], [0.65, 3.21, 8.0], [0.65, 2.89, 8.0], [2.15, 2.89, 8.0]], color: '#f0e6c4', weight: 800},
  // wall calendar on the pillar face (-2.2, *, +8.4) facing -z: month line and year line (R4: on the pillar, 1.0 x 1.4 m bank calendar)
  {text: 'JANUARY', corners: [[-1.75, 2.18, 8.39], [-2.65, 2.18, 8.39], [-2.65, 1.98, 8.39], [-1.75, 1.98, 8.39]], color: '#2a2a33', weight: 800},
  {text: '1995', corners: [[-1.8, 1.97, 8.39], [-2.6, 1.97, 8.39], [-2.6, 1.71, 8.39], [-1.8, 1.71, 8.39]], color: '#a8242a', weight: 900},
];
/** The lobby shell and fixed props (painted before the depth-sorted cast). Seeds 31000-31999. */
export const paintBankShell = (p: Painter, c: YCam, o: BankOpts = {}) => {
  const K = BANK(o.k2);
  // floor, ceiling, walls
  wFill(p, c, 31000, K.floor, qy(0, -7, 7, -3.5, 12.2));
  for (let i = 0; i < 26; i++) { // terrazzo speckle / carpet wear bands
    const x = -6.5 + ((i * 53) % 13), z = -3 + ((i * 29) % 15);
    wWash(p, c, 31010 + i, mixColor(K.floor, '#3a2c22', 0.25), 60, qy(0.001, x, x + 0.5, z, z + 0.3), 0.3, 0.6);
  }
  for (let i = 0; i < 160; i++) { const x = -6.8 + ((i * 0.618034) % 1) * 13.6, z = -3.3 + ((i * 0.41421) % 1) * 15.3, s = sphereAt(c, [x, 0.002, z], 0.03);
    if (s && s.r > 0.6) hardFill(p, 39000 + i, ['#8f8778', '#d9d2c2', '#6f6a60', '#c9b48a'][i % 4], ell(s.x, s.y, s.r, s.r * 0.35, 8)); }
  wWash(p, c, 31039, '#f2d9a0', 70, qy(0.0025, -1.6, 1.6, 6, 12.1), 0.4, 0.2); // the doors' reflection on the polished floor
  wFill(p, c, 31040, '#d8cdb4', qy(3.4, -7, 7, -3.5, 12.2));
  for (let gx = -6; gx <= 6; gx += 2.4) for (let gz = -2.4; gz <= 11; gz += 2.4) {
    wFill(p, c, 31050 + Math.round(gx * 7 + gz * 3), '#fff9e2', qy(3.399, gx - 0.3, gx + 0.3, gz - 0.6, gz + 0.6));
  }
  for (const sx of [-7, 7] as const) {
    wFill(p, c, 31100 + (sx > 0 ? 10 : 0), K.upper, qx(sx, 1.2, 3.4, -3.5, 12.2));
    wFill(p, c, 31101 + (sx > 0 ? 10 : 0), K.panel, qx(sx, 0, 1.2, -3.5, 12.2));
    wFill(p, c, 31102 + (sx > 0 ? 10 : 0), K.trim, qx(sx, 1.18, 1.24, -3.5, 12.2));
    for (let z = -3; z < 12; z += 1.5) wInk(p, c, 31120 + Math.round(z * 2) + (sx > 0 ? 40 : 0), [[sx, 0.05, z], [sx, 1.15, z]], {closed: false, weight: 0.5, color: mixColor(K.panel, INK, 0.5)});
  }
  // back wall (behind the counter) and entrance wall
  wFill(p, c, 31200, K.upper, qz(-3.5, -7, 7, 0, 3.4));
  wFill(p, c, 31201, K.panel, qz(-3.5, -7, 7, 0, 1.2));
  wFill(p, c, 31210, K.upper, qz(12.2, -7, 7, 0, 3.4));
  wFill(p, c, 31211, K.panel, qz(12.2, -7, 7, 0, 1.2));
  streaks(p, c, 31220, mixColor(K.upper, '#6b5a40', 0.3), 40, -7, 7, 1.3, 3.3, 12.19, 6);
  // entrance: bright street through glass doors and side lights (overexposed, no signs)
  wFill(p, c, 31300, '#fff4d6', qz(12.18, -2.4, 2.4, 0, 2.7));
  wWash(p, c, 31301, '#f7d79a', 120, qz(12.17, -2.4, 2.4, 0, 1.0), 0.3, 0.2);
  wWash(p, c, 31302, '#b9c9c4', 70, qz(12.17, -2.4, 2.4, 0.2, 0.9), 0.3, 0.3); // a far parked car shape, blown out
  for (const x of [-2.4, -1.2, 0, 1.2, 2.4]) wFill(p, c, 31310 + Math.round(x * 10), '#c3a35c', qz(12.15, x - 0.05, x + 0.05, 0, 2.7));
  wFill(p, c, 31330, '#c3a35c', qz(12.15, -2.4, 2.4, 2.65, 2.75));
  for (const x of [-0.6, 0.6]) wFill(p, c, 31340 + (x > 0 ? 1 : 0), '#e2c271', qz(12.1, x - 0.35, x + 0.35, 1.0, 1.06)); // brass push bars
  // the counter and partition (z -0.8..0), open teller windows W1-W3
  paintBox(p, c, 31400, {x0: -6, x1: 6, y0: 0, y1: 1.1, z0: -0.8, z1: 0}, o.k2 ? '#7a4a2c' : '#9a6b3e', {}, {ink: true, grain: 50});
  wFill(p, c, 31420, '#d9d2c4', qy(1.101, -6, 6, -0.8, 0));
  for (const wx of [-3, 0, 3]) {
    wFill(p, c, 31430 + wx, mixColor(K.upper, '#9fb8b0', 0.3), qz(-0.41, wx - 1.1, wx + 1.1, 1.1, 2.2));
    wFill(p, c, 31440 + wx, '#6a5a48', qz(-0.42, wx - 0.4, wx + 0.4, 1.15, 1.75)); // the open slot (teller zone behind, dim)
  }
  for (const x of [-4.5, -1.5, 1.5, 4.5]) wFill(p, c, 31460 + Math.round(x * 2), K.trim, qz(-0.39, x - 0.06, x + 0.06, 1.1, 2.2));
};
export const bankItems = (c: YCam) => c; // (kept for symmetry with other spaces)
/** Lobby furniture as depth-sorted items: deposit island, stanchions, plant, bench, brochure rack, pillar with the calendar, sign board, CCTV camera. */
export const bankFurniture = (o: BankOpts = {}) => {
  const K = BANK(o.k2);
  const it: {at: V3; draw: (p: Painter, c: YCam) => void}[] = [];
  it.push({at: [-4, 0, 5], draw: (p, c) => {
    paintBox(p, c, 31500, {x0: -4.8, x1: -3.2, y0: 0, y1: 1.05, z0: 4.7, z1: 5.3}, o.k2 ? '#6a3a24' : '#8a5e36', {}, {ink: true, grain: 40});
    for (let i = 0; i < 4; i++) wFill(p, c, 31510 + i, i % 2 ? '#f2eee2' : '#dfe8e0', qy(1.051, -4.6 + i * 0.35, -4.35 + i * 0.35, 4.85, 5.15)); // deposit slips
    wInk(p, c, 31520, [[-3.5, 1.06, 5.0], [-3.4, 1.3, 4.95]], {closed: false, weight: 0.9}); // chained pen
  }});
  for (const z of [4, 5, 6]) it.push({at: [1.8, 0, z], draw: (p, c) => {
    paintBox(p, c, 31530 + z, {x0: 1.76, x1: 1.84, y0: 0, y1: 0.95, z0: z - 0.04, z1: z + 0.04}, '#c9a24a', {}, {});
    const s = sphereAt(c, [1.8, 0.97, z], 0.05); if (s) hardFill(p, 31540 + z, '#e2c271', ell(s.x, s.y, s.r, s.r, 12));
    if (z < 6) { const a = camPoint(c, [1.8, 0.9, z]), b = camPoint(c, [1.8, 0.78, z + 0.5]), d = camPoint(c, [1.8, 0.9, z + 1]);
      if (a && b && d) inkLine(p, 31550 + z, [a, b, d], {weight: 2.2, color: '#7a1f24', curve: 0.5}); }
  }});
  it.push({at: [3.6, 0, 11.4], draw: (p, c) => { // ficus in a pot by the doors
    paintBox(p, c, 31560, {x0: 3.35, x1: 3.85, y0: 0, y1: 0.5, z0: 11.2, z1: 11.7}, '#8a5a3a', {}, {ink: true});
    for (let i = 0; i < 7; i++) { const s = sphereAt(c, [3.6 + Math.sin(i * 2.1) * 0.35, 0.9 + i * 0.18, 11.45 + Math.cos(i * 1.7) * 0.2], 0.32 - i * 0.02);
      if (s) washAt(p, 31570 + i, i % 2 ? '#3f6b3a' : '#4f7d44', 230, ell(s.x, s.y, s.r, s.r * 0.8, 14), 0.2, 0.3); }
  }});
  it.push({at: [5.6, 0, 8], draw: (p, c) => { // waiting bench + brochure rack
    paintBox(p, c, 31600, {x0: 6.3, x1: 6.8, y0: 0.42, y1: 0.5, z0: 6.5, z1: 9.5}, '#7a5a3a', {}, {ink: true});
    paintBox(p, c, 31601, {x0: 6.3, x1: 6.85, y0: 0.5, y1: 0.95, z0: 6.5, z1: 6.56}, '#7a5a3a', {}, {});
    paintBox(p, c, 31610, {x0: 6.4, x1: 6.95, y0: 0, y1: 1.5, z0: 10.2, z1: 10.9}, '#b9b2a2', {}, {ink: true});
    for (let i = 0; i < 3; i++) wFill(p, c, 31620 + i, ['#d9583b', '#3b78a8', '#e2c04a'][i], qx(6.39, 0.9 + i * 0.18, 1.04 + i * 0.18, 10.3, 10.8));
  }});
  it.push({at: [-2.2, 0, 8.6], draw: (p, c) => { // pillar with the bank wall calendar (generic picture, JANUARY 1995 as world text)
    paintBox(p, c, 31640, {x0: -2.8, x1: -1.6, y0: 0, y1: 3.4, z0: 8.4, z1: 9.0}, K.upper, {}, {ink: true});
    wFill(p, c, 31641, K.panel, qz(8.399, -2.8, -1.6, 0, 1.2));
    wFill(p, c, 31650, '#f7f3e8', qz(8.395, -2.7, -1.7, 0.75, 2.25));
    wFill(p, c, 31651, '#7aa7c2', qz(8.39, -2.62, -1.78, 2.25, 2.25)); // (top edge)
    wFill(p, c, 31652, '#86b0c8', qz(8.39, -2.62, -1.78, 2.22, 2.24));
    wFill(p, c, 31653, '#9bc0d0', qz(8.39, -2.6, -1.8, 2.27, 2.6)); // picture strip above: sky
    wFill(p, c, 31654, '#5f8a4e', qz(8.388, -2.6, -1.8, 2.27, 2.38)); // field
    wFill(p, c, 31655, '#f7f3e8', qz(8.392, -2.7, -1.7, 2.25, 2.68));
    wFill(p, c, 31656, '#9bc0d0', qz(8.389, -2.63, -1.77, 2.3, 2.62));
    wFill(p, c, 31657, '#6a9654', qz(8.388, -2.63, -1.77, 2.3, 2.42));
    for (let r = 0; r < 5; r++) for (let k = 0; k < 7; k++) wFill(p, c, 31660 + r * 7 + k, '#e4ded0', qz(8.389, -3.0 + k * 0.115, -2.91 + k * 0.115, 0.85 + r * 0.16, 0.97 + r * 0.16));
    wFill(p, c, 31700, '#2a2a2a', qz(8.389, -2.24, -2.16, 2.66, 2.74)); // nail
  }});
  it.push({at: [1.4, 0, 8.0], draw: (p, c) => { // hanging TELLERS board (rods to the ceiling)
    wFill(p, c, 31720, '#1f4a3a', qz(8.0, 0.6, 2.2, 2.85, 3.25));
    wInk(p, c, 31721, qz(8.0, 0.6, 2.2, 2.85, 3.25), {weight: 0.8, color: '#c9a24a'});
    for (const x of [0.8, 2.0]) wInk(p, c, 31722 + Math.round(x * 10), [[x, 3.25, 8.0], [x, 3.4, 8.0]], {closed: false, weight: 0.8});
  }});
  it.push({at: [6.6, 2.9, 0.6], draw: (p, c) => { // CCTV box camera on its bracket (VD31-15)
    paintBox(p, c, 31740, {x0: 6.75, x1: 7.0, y0: 2.85, y1: 2.95, z0: 0.55, z1: 0.65}, '#8a8f93', {}, {});
    paintBox(p, c, 31741, {x0: 6.35, x1: 6.8, y0: 2.8, y1: 3.0, z0: 0.5, z1: 0.72}, '#d8d6cf', {}, {ink: true});
    const l = sphereAt(c, [6.37, 2.97, 0.7], 0.012); if (l) hardFill(p, 31742, '#ff2a1e', ell(l.x, l.y, l.r + 2, l.r + 2, 8));
  }});
  return it;
};

// ------------------------------------------------------------------ Space H: Wheeler's kitchen, January 1995 night
export const KITCHEN_TEXT: WorldText[] = [];
export const paintKitchenShell = (p: Painter, c: YCam) => {
  wFill(p, c, 32000, '#6d5a44', qy(0, -2.8, 3.4, -2.0, 3.0)); // linoleum
  for (let i = 0; i < 9; i++) for (let k = 0; k < 6; k++) if ((i + k) % 2) wFill(p, c, 32010 + i * 6 + k, '#7c6850', qy(0.001, -2.8 + i * 0.7, -2.1 + i * 0.7, -2 + k * 0.7, -1.3 + k * 0.7));
  wFill(p, c, 32080, '#c9b98a', qz(-2.0, -2.8, 3.4, 0, 2.5)); // mustard 70s wallpaper
  for (let i = 0; i < 18; i++) wWash(p, c, 32090 + i, '#b3a073', 90, qz(-1.99, -2.8 + i * 0.35, -2.7 + i * 0.35, 0, 2.5), 0.1, 0.4);
  wFill(p, c, 32120, '#bfae80', qx(-2.8, 0, 2.5, -2.0, 3.0));
  wFill(p, c, 32121, '#b6a678', qx(3.4, 0, 2.5, -2.0, 3.0));
  wFill(p, c, 32122, '#d9d0b6', qy(2.5, -2.8, 3.4, -2.0, 3.0));
  // window with snow on the sill, January night outside
  wFill(p, c, 32130, '#efe7d2', qz(-1.985, -2.5, -1.5, 0.92, 2.08));
  wFill(p, c, 32131, '#25375a', qz(-1.98, -2.4, -1.6, 1.0, 2.0));
  wWash(p, c, 32132, '#3e5a86', 160, qz(-1.978, -2.4, -1.6, 1.0, 1.4), 0.3, 0.3);
  for (let i = 0; i < 12; i++) { const s = sphereAt(c, [-2.38 + (i * 0.067) % 0.78, 1.1 + ((i * 0.37) % 0.85), -1.976], 0.008); if (s) hardFill(p, 32140 + i, '#e8eef6', ell(s.x, s.y, s.r + 1, s.r + 1, 6)); }
  wFill(p, c, 32160, '#efe7d2', qz(-1.977, -2.4, -1.6, 1.48, 1.52));
  wFill(p, c, 32161, '#efe7d2', qz(-1.977, -2.02, -1.98, 1.0, 2.0));
  paintBox(p, c, 32162, {x0: -2.55, x1: -1.45, y0: 0.9, y1: 0.98, z0: -2.0, z1: -1.85}, '#f6f4ee', {}, {}); // snowy sill
  paintBox(p, c, 32163, {x0: -2.45, x1: -1.55, y0: 0.25, y1: 0.8, z0: -2.0, z1: -1.88}, '#d7d2c4', {}, {ink: true}); // radiator
  for (let i = 0; i < 9; i++) wInk(p, c, 32170 + i, [[-2.4 + i * 0.1, 0.3, -1.879], [-2.4 + i * 0.1, 0.75, -1.879]], {closed: false, weight: 0.5});
  // counter, upper cabinets, fridge
  paintBox(p, c, 32200, {x0: 0.5, x1: 2.5, y0: 0, y1: 0.88, z0: -2.0, z1: -1.4}, '#8a6440', {}, {ink: true, grain: 40});
  wFill(p, c, 32201, '#d8cfb8', qy(0.9, 0.5, 2.5, -2.0, -1.4));
  paintBox(p, c, 32202, {x0: 0.5, x1: 2.5, y0: 1.5, y1: 2.2, z0: -2.0, z1: -1.65}, '#94704a', {}, {ink: true, grain: 40});
  paintBox(p, c, 32210, {x0: 2.55, x1: 3.3, y0: 0, y1: 1.75, z0: -2.0, z1: -1.35}, '#e7e0c8', {}, {ink: true}); // fridge
  wInk(p, c, 32211, [[2.6, 1.15, -1.349], [3.25, 1.15, -1.349]], {closed: false, weight: 0.6});
  for (let i = 0; i < 4; i++) wFill(p, c, 32212 + i, ['#d94c3b', '#3f7fbf', '#e2b13a', '#5aa05a'][i], qz(-1.348, 2.7 + (i % 2) * 0.3, 2.78 + (i % 2) * 0.3, 1.3 + i * 0.09, 1.36 + i * 0.09)); // magnets
  wFill(p, c, 32216, '#f4f1e8', qz(-1.347, 2.85, 3.05, 1.4, 1.62)); // a note under a magnet
  paintBox(p, c, 32220, {x0: 1.6, x1: 1.85, y0: 0.9, y1: 1.12, z0: -1.85, z1: -1.65}, '#c0c4c8', {}, {ink: true}); // toaster
  paintBox(p, c, 32221, {x0: 0.75, x1: 0.95, y0: 0.9, y1: 1.15, z0: -1.85, z1: -1.65}, '#c9472e', {}, {ink: true}); // kettle
  // wall calendar (generic picture, page JAN) at (-0.75, 1.55, -1.98)
  wFill(p, c, 32240, '#f6f2e6', qz(-1.97, -0.9, -0.6, 1.33, 1.78));
  wFill(p, c, 32241, '#8fb5cf', qz(-1.968, -0.88, -0.62, 1.58, 1.76));
  wFill(p, c, 32242, '#e8e6ea', qz(-1.967, -0.88, -0.62, 1.58, 1.63));
  for (let r = 0; r < 4; r++) wInk(p, c, 32243 + r, [[-0.88, 1.36 + r * 0.05, -1.966], [-0.62, 1.36 + r * 0.05, -1.966]], {closed: false, weight: 0.3, color: '#a39c8c'});
};
/** Table, chairs, lamp pool and table props. */
export const kitchenTable = (): {at: V3; draw: (p: Painter, c: YCam) => void}[] => [
  {at: [0, 0, 0.05], draw: (p, c) => {
    paintBox(p, c, 32300, {x0: -0.55, x1: 0.55, y0: 0.64, y1: 0.68, z0: -0.35, z1: 0.35}, '#a37a4c', {}, {ink: true});
    wFill(p, c, 32301, '#e9dfc6', qy(0.681, -0.5, 0.5, -0.3, 0.3)); // checked oilcloth
    for (let i = 0; i < 5; i++) wWash(p, c, 32302 + i, '#b24a3a', 80, qy(0.682, -0.5 + i * 0.2, -0.42 + i * 0.2, -0.3, 0.3), 0.05, 0.2);
    for (let i = 0; i < 3; i++) wWash(p, c, 32308 + i, '#b24a3a', 70, qy(0.683, -0.5, 0.5, -0.3 + i * 0.2, -0.22 + i * 0.2), 0.05, 0.2);
    for (const [x, z] of [[-0.5, 0.3], [0.5, 0.3]] as const) paintBox(p, c, 32312 + (x > 0 ? 1 : 0), {x0: x - 0.03, x1: x + 0.03, y0: 0, y1: 0.64, z0: z - 0.03, z1: z + 0.03}, '#8a643e', {}, {});
    // lemon bowl
    const b = flatCircle(c, [-0.25, 0.74, 0.05], 0.11, 24); if (b.length > 2) hardFill(p, 32320, '#3b6a8a', b);
    const bb = flatCircle(c, [-0.25, 0.69, 0.05], 0.08, 24); if (bb.length > 2) hardFill(p, 32321, '#2f5672', bb);
    paintLemon(p, c, 32330, [-0.29, 0.77, 0.03], 0.035);
    paintLemon(p, c, 32340, [-0.21, 0.775, 0.08], 0.035, {tilt: 15});
    paintLemon(p, c, 32350, [-0.25, 0.8, 0.0], 0.034, {tilt: -40});
    // candle in a saucer (unlit in the whisper shot)
    const sa = flatCircle(c, [0.25, 0.685, 0.1], 0.06, 18); if (sa.length > 2) hardFill(p, 32360, '#e8e2d2', sa);
    paintBox(p, c, 32361, {x0: 0.235, x1: 0.265, y0: 0.685, y1: 0.8, z0: 0.085, z1: 0.115}, '#f3ead2', {}, {ink: true});
    // instant camera (generic boxy integral-film camera, no brand)
    paintBox(p, c, 32370, {x0: 0.28, x1: 0.43, y0: 0.68, y1: 0.8, z0: -0.2, z1: -0.1}, '#2e2c2a', {}, {ink: true});
    paintBox(p, c, 32371, {x0: 0.28, x1: 0.43, y0: 0.74, y1: 0.76, z0: -0.1, z1: -0.099}, '#d84a3a', {}, {});
    const ln = sphereAt(c, [0.33, 0.755, -0.099], 0.025); if (ln) { hardFill(p, 32372, '#151515', ell(ln.x, ln.y, ln.r, ln.r, 14)); hardFill(p, 32373, '#5a6a7a', ell(ln.x - ln.r * 0.3, ln.y - ln.r * 0.3, ln.r * 0.3, ln.r * 0.3, 8)); }
    // salt shaker + a mug
    paintBox(p, c, 32380, {x0: 0.05, x1: 0.09, y0: 0.68, y1: 0.76, z0: -0.22, z1: -0.18}, '#f0efe8', {}, {ink: true});
  }},
];
export const paintPendant = (p: Painter, c: YCam) => {
  const a = camPoint(c, [0, 2.5, 0]), b = camPoint(c, [0, 2.12, 0]);
  if (a && b) inkLine(p, 32400, [a, b], {weight: 0.8});
  const sh = [[-0.18, 1.95, 0], [0.18, 1.95, 0], [0.07, 2.13, 0], [-0.07, 2.13, 0]] as V3[];
  wFill(p, c, 32401, '#c66b2e', sh);
  const bulb = sphereAt(c, [0, 1.93, 0], 0.05); if (bulb) hardFill(p, 32402, '#fff2c8', ell(bulb.x, bulb.y, bulb.r * 1.4, bulb.r * 0.7, 14));
};

// ------------------------------------------------------------------ Space T: som tam stall, today (midday)
export const paintStall = (p: Painter, c: YCam) => {
  wFill(p, c, 33000, '#e9e2cf', qz(-30, -40, 40, -10, 40)); // sky haze
  wFill(p, c, 33001, '#bfb6a6', qy(0, -40, 40, -30, 6)); // road / pavement
  wFill(p, c, 33002, '#9a9488', qy(0.001, -40, 40, -9, -5));
  // shophouses across the street (no readable signs)
  const cols = ['#d9a066', '#c9c0a8', '#9db7a8', '#e0c48a', '#b98c74'];
  for (let i = 0; i < 6; i++) {
    const x0 = -8 + i * 3.1;
    wFill(p, c, 33010 + i, cols[i % 5], qz(-9, x0, x0 + 3.0, 0, 7.5));
    for (let f = 0; f < 2; f++) wFill(p, c, 33020 + i * 2 + f, '#5a6470', qz(-8.99, x0 + 0.4, x0 + 2.6, 3.4 + f * 2, 4.6 + f * 2));
    wFill(p, c, 33040 + i, '#6b625a', qz(-8.98, x0 + 0.2, x0 + 2.8, 0, 2.6)); // shutter
    wFill(p, c, 33050 + i, ['#d64b3a', '#3a7ab0', '#e8b83a', '#4a9a5a', '#d9d2c2', '#c4583a'][i], qz(-8.97, x0 + 0.1, x0 + 2.9, 2.6, 3.1)); // sign board, no letters
  }
  for (let i = 0; i < 4; i++) { const x = -5 + i * 2.6; // parked scooters
    paintBox(p, c, 33070 + i, {x0: x, x1: x + 1.6, y0: 0.25, y1: 0.75, z0: -7.2, z1: -6.8}, ['#c73a32', '#2e5f9a', '#e2e0da', '#2f2f33'][i], {}, {ink: true});
    for (const wx of [x + 0.25, x + 1.35]) { const s = sphereAt(c, [wx, 0.25, -7.0], 0.25); if (s) hardFill(p, 33080 + i * 2 + (wx > x + 1 ? 1 : 0), '#1e1e1e', ell(s.x, s.y, s.r, s.r, 14)); }
  }
  // power lines
  for (let k = 0; k < 3; k++) { const a = camPoint(c, [-20, 6.5 + k * 0.3, -8]), m = camPoint(c, [0, 5.9 + k * 0.3, -8]), b = camPoint(c, [20, 6.6 + k * 0.3, -8]); if (a && m && b) inkLine(p, 33090 + k, [a, m, b], {weight: 0.5, curve: 0.5}); }
};
export const stallItems = (): {at: V3; draw: (p: Painter, c: YCam) => void}[] => [
  {at: [0, 0, -0.3], draw: (p, c) => {
    // back shelf with jars and chilli tray
    paintBox(p, c, 33100, {x0: -1.0, x1: 1.0, y0: 0.9, y1: 0.95, z0: -1.0, z1: -0.8}, '#9a7a56', {}, {ink: true});
    for (let i = 0; i < 6; i++) paintBox(p, c, 33110 + i, {x0: -0.9 + i * 0.3, x1: -0.72 + i * 0.3, y0: 0.95, y1: 1.18, z0: -0.97, z1: -0.83}, ['#e8dcc0', '#c9572e', '#e8dcc0', '#7a9a3a', '#d9a03a', '#e8dcc0'][i], {}, {ink: true});
    // counter: steel top, painted wooden front
    paintBox(p, c, 33130, {x0: -1.0, x1: 1.0, y0: 0, y1: 0.83, z0: -0.6, z1: 0}, '#3f8a7a', {}, {ink: true});
    for (let i = 0; i < 5; i++) wFill(p, c, 33131 + i, '#e8c24a', qz(0.001, -0.95 + i * 0.4, -0.75 + i * 0.4, 0.15, 0.65));
    wFill(p, c, 33140, '#c7ccd0', qy(0.85, -1.02, 1.02, -0.62, 0.02));
    // krok (clay mortar) with som tam, lime basket
    const kr = flatCircle(c, [0, 1.03, -0.3], 0.11, 22); const kb = flatCircle(c, [0, 0.86, -0.3], 0.08, 22);
    if (kb.length > 2) hardFill(p, 33150, '#8a4a2a', kb);
    if (kr.length > 2) { hardFill(p, 33151, '#a35a32', kr); }
    const fill = flatCircle(c, [0, 1.025, -0.3], 0.085, 20); if (fill.length > 2) hardFill(p, 33152, '#d9b25a', fill);
    for (let i = 0; i < 5; i++) { const s = sphereAt(c, [-0.04 + i * 0.02, 1.035, -0.3 + (i % 2) * 0.03], 0.01); if (s) hardFill(p, 33153 + i, i % 2 ? '#c8322a' : '#6aa04a', ell(s.x, s.y, s.r + 1, s.r + 1, 8)); }
    const bk = flatCircle(c, [-0.5, 0.92, -0.35], 0.13, 20); if (bk.length > 2) hardFill(p, 33160, '#b98a4e', bk);
    for (let i = 0; i < 6; i++) { const s = sphereAt(c, [-0.56 + (i % 3) * 0.06, 0.95, -0.38 + Math.floor(i / 3) * 0.06], 0.028); if (s) { hardFill(p, 33161 + i, '#5aa03a', ell(s.x, s.y, s.r, s.r, 12)); hardFill(p, 33170 + i, '#a6d46a', ell(s.x - s.r * 0.3, s.y - s.r * 0.3, s.r * 0.3, s.r * 0.25, 8)); } }
    // pestle
    const a = camPoint(c, [0.05, 1.03, -0.3]), b = camPoint(c, [0.15, 1.25, -0.25]); if (a && b) inkLine(p, 33180, [a, b], {weight: 3.5, color: '#8a6a4a'});
    // striped awning on poles
    for (const x of [-1.0, 1.0]) paintBox(p, c, 33190 + (x > 0 ? 1 : 0), {x0: x - 0.025, x1: x + 0.025, y0: 0, y1: 2.3, z0: -0.05, z1: 0.0}, '#c9c3b6', {}, {});
    for (let i = 0; i < 8; i++) wFill(p, c, 33200 + i, i % 2 ? '#f2efe6' : '#d23c3c', [[-1.1 + i * 0.275, 2.3, 0.15], [-0.825 + i * 0.275, 2.3, 0.15], [-0.825 + i * 0.275, 2.55, -1.0], [-1.1 + i * 0.275, 2.55, -1.0]]);
  }},
];

// ------------------------------------------------------------------ Space V: TV corner (night, April 1995)
export const TV_SCREEN: [V3, V3, V3, V3] = [[-0.275, 1.095, -0.33], [0.275, 1.095, -0.33], [0.275, 0.685, -0.33], [-0.275, 0.685, -0.33]];
export const paintTvCorner = (p: Painter, c: YCam) => {
  wFill(p, c, 34000, '#1b1f2a', qz(-1.2, -3, 3, 0, 2.6));
  for (let i = 0; i < 10; i++) wWash(p, c, 34001 + i, '#232838', 120, qz(-1.19, -3 + i * 0.6, -2.8 + i * 0.6, 0, 2.6), 0.1, 0.4); // wallpaper stripes in the dark
  wFill(p, c, 34020, '#14161d', qy(0, -3, 3, -1.2, 3));
  wFill(p, c, 34021, '#2a2230', qy(0.001, -1.4, 1.4, -1.0, 1.6)); // rug
  // window on the left wall with a sodium streetlight glow
  wFill(p, c, 34030, '#1a1d26', qx(-1.6, 0, 2.6, -1.2, 3));
  wFill(p, c, 34031, '#c98a3a', qx(-1.59, 1.0, 2.0, -0.9, 0.2));
  wWash(p, c, 34032, '#f0b45a', 140, qx(-1.585, 1.3, 2.0, -0.9, -0.2), 0.4, 0.2);
  wFill(p, c, 34033, '#1a1d26', qx(-1.58, 0.98, 2.02, -0.37, -0.33));
  // the screen's blue-white spill on the wall and floor
  const g = camPoint(c, [0, 0.9, -1.15]); const u = camUnit(c, [0, 0.9, -1.15]);
  if (g) glow(p, 34040, g[0], g[1], 1.4 * u, 1.0 * u, '#7f9cc8', 70);
  const fg = camPoint(c, [0, 0.01, 0.2]); if (fg) glow(p, 34050, fg[0], fg[1], 1.1 * u, 0.25 * u, '#6f8cc0', 45);
  // stand, VCR, CRT body, bezel, antenna
  paintBox(p, c, 34100, {x0: -0.6, x1: 0.6, y0: 0, y1: 0.6, z0: -0.6, z1: -0.1}, '#3a2c22', {}, {ink: true});
  paintBox(p, c, 34101, {x0: -0.58, x1: 0.58, y0: 0.08, y1: 0.1, z0: -0.58, z1: -0.12}, '#2a2018', {}, {});
  paintBox(p, c, 34110, {x0: -0.22, x1: 0.22, y0: 0.32, y1: 0.4, z0: -0.5, z1: -0.15}, '#1d1d1f', {}, {ink: true}); // VCR
  wFill(p, c, 34111, '#3aff7a', qz(-0.149, 0.1, 0.18, 0.355, 0.375)); // green VCR digits as a lit bar (no time shown: blank bar)
  paintBox(p, c, 34112, {x0: -0.3, x1: 0.3, y0: 0.12, y1: 0.28, z0: -0.5, z1: -0.15}, '#4a3a2e', {}, {}); // tapes
  for (let i = 0; i < 4; i++) wFill(p, c, 34113 + i, ['#d8d0c0', '#2a2a2a', '#c94a3a', '#d8d0c0'][i], qz(-0.149, -0.27 + i * 0.14, -0.15 + i * 0.14, 0.13, 0.27));
  paintBox(p, c, 34120, {x0: -0.35, x1: 0.35, y0: 0.6, y1: 1.16, z0: -0.83, z1: -0.33}, '#3b3734', {}, {ink: true});
  wFill(p, c, 34121, '#2b2826', qz(-0.329, -0.33, 0.33, 0.64, 1.14));
  wFill(p, c, 34122, '#0e1014', qz(-0.328, -0.29, 0.29, 0.67, 1.11));
  for (let i = 0; i < 3; i++) { const s = sphereAt(c, [0.3, 0.75 + i * 0.05, -0.328], 0.01); if (s) hardFill(p, 34123 + i, '#6a645e', ell(s.x, s.y, s.r + 1, s.r + 1, 8)); }
  for (const side of [-1, 1]) { const a = camPoint(c, [side * 0.03, 1.16, -0.58]), b = camPoint(c, [side * 0.35, 1.6, -0.62]); if (a && b) inkLine(p, 34130 + side, [a, b], {weight: 1.6, color: '#b9bcc0'}); }
  const knob = sphereAt(c, [0, 1.17, -0.58], 0.04); if (knob) hardFill(p, 34133, '#2a2a2a', ell(knob.x, knob.y, knob.r * 1.4, knob.r * 0.7, 12));
  // a framed photo and a dead plant on the stand
  paintBox(p, c, 34140, {x0: 0.42, x1: 0.56, y0: 0.6, y1: 0.78, z0: -0.4, z1: -0.38}, '#8a6a3a', {}, {ink: true});
  paintBox(p, c, 34141, {x0: -0.56, x1: -0.42, y0: 0.6, y1: 0.72, z0: -0.45, z1: -0.31}, '#7a4a32', {}, {ink: true});
  for (let i = 0; i < 4; i++) { const a = camPoint(c, [-0.49, 0.72, -0.38]), b = camPoint(c, [-0.49 + (i - 1.5) * 0.06, 0.9 + (i % 2) * 0.05, -0.38]); if (a && b) inkLine(p, 34142 + i, [a, b], {weight: 1, color: '#4a5a3a'}); }
};

// ------------------------------------------------------------------ Space N: 1995 news studio (4:3 picture inside the TV)
export const paintStudio = (p: Painter, c: YCam) => {
  wFill(p, c, 35000, '#123a7a', qz(-2.5, -4, 4, 0, 3.5));
  wWash(p, c, 35001, '#2a62b8', 200, qz(-2.49, -4, 4, 1.0, 3.5), 0.4, 0.2);
  for (let i = 0; i < 14; i++) { const x = -3.6 + i * 0.52, h = 0.6 + ((i * 37) % 7) * 0.12; wFill(p, c, 35010 + i, '#0c2550', qz(-2.48, x, x + 0.45, 0.9, 0.9 + h)); // skyline
    for (let k = 0; k < 3; k++) wFill(p, c, 35030 + i * 3 + k, '#f2d27a', qz(-2.47, x + 0.08 + k * 0.12, x + 0.14 + k * 0.12, 1.0 + (k % 2) * 0.2, 1.06 + (k % 2) * 0.2)); }
  const gl = camPoint(c, [-1.6, 2.2, -2.46]), gu = camUnit(c, [-1.6, 2.2, -2.46]);
  if (gl) { hardFill(p, 35080, '#2f7ad0', ell(gl[0], gl[1], 0.55 * gu, 0.55 * gu, 28)); for (let i = 0; i < 4; i++) { inkLine(p, 35081 + i, ell(gl[0], gl[1], 0.55 * gu * Math.cos(i * 0.4), 0.55 * gu, 24), {closed: true, weight: 0.7, color: '#bfe0ff'}); } inkLine(p, 35090, [[gl[0] - 0.55 * gu, gl[1]], [gl[0] + 0.55 * gu, gl[1]]], {weight: 0.7, color: '#bfe0ff'}); }
  wFill(p, c, 35100, '#0a1d40', qy(0, -4, 4, -2.5, 3));
};
export const studioDesk = (p: Painter, c: YCam) => {
  paintBox(p, c, 35200, {x0: -0.9, x1: 0.9, y0: 0, y1: 0.74, z0: -0.35, z1: 0.35}, '#1e4aa0', {}, {ink: true});
  wFill(p, c, 35201, '#c9d2e0', qz(0.351, -0.9, 0.9, 0.5, 0.56));
  wFill(p, c, 35202, '#d9dee8', qy(0.741, -0.9, 0.9, -0.35, 0.35));
  wFill(p, c, 35203, '#f6f4ee', qy(0.742, -0.2, 0.05, -0.05, 0.25)); // script pages
};

// ------------------------------------------------------------------ Space P: police interview room (after midnight)
export const paintPoliceShell = (p: Painter, c: YCam) => {
  wFill(p, c, 36000, '#c9ccc0', qy(0, -1.8, 1.8, -2.0, 2.4));
  for (let i = 0; i < 8; i++) wInk(p, c, 36001 + i, [[-1.8 + i * 0.45, 0.001, -2], [-1.8 + i * 0.45, 0.001, 2.4]], {closed: false, weight: 0.35, color: '#9aa094'});
  for (let k = 0; k < 10; k++) wInk(p, c, 36010 + k, [[-1.8, 0.001, -2 + k * 0.45], [1.8, 0.001, -2 + k * 0.45]], {closed: false, weight: 0.35, color: '#9aa094'});
  wFill(p, c, 36030, '#9fae9a', qz(-2.0, -1.8, 1.8, 0, 2.6));
  wFill(p, c, 36031, '#8c9a87', qz(-1.999, -1.8, 1.8, 0, 1.0));
  wFill(p, c, 36032, '#7d8a78', qz(-1.998, -1.8, 1.8, 0.98, 1.02));
  streaks(p, c, 36040, '#8a9682', 50, -1.8, 1.8, 0.2, 2.4, -1.997, 7);
  wFill(p, c, 36060, '#97a692', qx(-1.8, 0, 2.6, -2.0, 2.4));
  wFill(p, c, 36061, '#94a28f', qx(1.8, 0, 2.6, -2.0, 2.4));
  wFill(p, c, 36062, '#e2e4dc', qy(2.6, -1.8, 1.8, -2.0, 2.4));
  // steel door with a wired-glass window, hinge left
  wFill(p, c, 36100, '#6f7a78', qz(-1.99, -1.65, -0.75, 0, 2.1));
  wInk(p, c, 36101, qz(-1.99, -1.65, -0.75, 0, 2.1), {weight: 0.8});
  wFill(p, c, 36102, '#cfd6cc', qz(-1.985, -1.35, -1.05, 1.35, 1.75));
  for (let i = 0; i < 4; i++) { wInk(p, c, 36103 + i, [[-1.35 + i * 0.1, 1.35, -1.984], [-1.35 + i * 0.1, 1.75, -1.984]], {closed: false, weight: 0.3, color: '#8a9088'}); wInk(p, c, 36108 + i, [[-1.35, 1.35 + i * 0.13, -1.984], [-1.05, 1.35 + i * 0.13, -1.984]], {closed: false, weight: 0.3, color: '#8a9088'}); }
  paintBox(p, c, 36115, {x0: -0.92, x1: -0.8, y0: 1.0, y1: 1.04, z0: -1.99, z1: -1.94}, '#b9bcc0', {}, {});
  // one-way mirror on the left wall
  wFill(p, c, 36120, '#3a4246', qx(-1.795, 0.9, 2.0, -1.4, 0.2));
  wWash(p, c, 36121, '#5a6a70', 90, qx(-1.79, 1.4, 2.0, -1.2, -0.4), 0.2, 0.3);
  wInk(p, c, 36122, qx(-1.79, 0.9, 2.0, -1.4, 0.2), {weight: 0.7});
  // vent grille, light switch, scuffs
  wFill(p, c, 36130, '#b9bfb4', qz(-1.996, 0.9, 1.4, 2.1, 2.35));
  for (let i = 0; i < 5; i++) wInk(p, c, 36131 + i, [[0.92, 2.13 + i * 0.045, -1.995], [1.38, 2.13 + i * 0.045, -1.995]], {closed: false, weight: 0.35});
  wFill(p, c, 36140, '#e2e0d6', qz(-1.996, -0.65, -0.57, 1.15, 1.27));
  // twin fluorescent tube
  wFill(p, c, 36150, '#f8fbf2', qy(2.54, -0.6, 0.6, -0.08, 0.08));
};
export const policeTable = (p: Painter, c: YCam) => {
  paintBox(p, c, 36200, {x0: -0.6, x1: 0.6, y0: 0.64, y1: 0.68, z0: -0.375, z1: 0.375}, '#8a8f88', {}, {ink: true});
  wFill(p, c, 36201, '#c8c2b0', qy(0.681, -0.58, 0.58, -0.36, 0.36)); // laminate top
  for (const [x, z] of [[-0.56, 0.33], [0.56, 0.33]] as const) paintBox(p, c, 36202 + (x > 0 ? 1 : 0), {x0: x - 0.02, x1: x + 0.02, y0: 0, y1: 0.64, z0: z - 0.02, z1: z + 0.02}, '#5a5e58', {}, {});
  // a styrofoam cup, a closed manila folder, a pen
  const cup = flatCircle(c, [0.42, 0.79, -0.12], 0.04, 16); paintBox(p, c, 36210, {x0: 0.385, x1: 0.455, y0: 0.68, y1: 0.79, z0: -0.155, z1: -0.085}, '#f2f0ea', {}, {ink: true}); if (cup.length > 2) hardFill(p, 36211, '#5a3a22', cup);
  wFill(p, c, 36220, '#d9b46a', [[0.2, 0.682, 0.05], [0.5, 0.682, 0.02], [0.52, 0.682, 0.3], [0.22, 0.682, 0.33]]);
  wInk(p, c, 36221, [[0.2, 0.683, 0.05], [0.5, 0.683, 0.02], [0.52, 0.683, 0.3], [0.22, 0.683, 0.33]], {weight: 0.5});
  wInk(p, c, 36222, [[-0.45, 0.684, 0.12], [-0.3, 0.684, 0.2]], {closed: false, weight: 1.6, color: '#1e3a8a'});
};

// ------------------------------------------------------------------ Space R: reveal table (no place claimed)
/** RC3-01 (Boat Recheck R3), applied in R4: the lemon half sits BESIDE the Polaroid, touching nothing; never on the image area or the CCTV print. */
export const REVEAL = {
  polaroid: {c: [-0.07, 0, 0] as V3, w: 0.088, h: 0.107},
  print: {c: [0.16, 0, 0] as V3, w: 0.203, h: 0.254, rot: 4},
  lemon: {c: [-0.1, 0.015, 0.095] as V3, r: 0.03},
};
export const paintRevealTable = (p: Painter, c: YCam) => {
  wFill(p, c, 37000, '#2a1a10', qy(0, -1, 1, -1, 1));
  for (let i = 0; i < 22; i++) { const z = -0.9 + i * 0.085 + Math.sin(i * 2.3) * 0.02; wWash(p, c, 37001 + i, i % 3 ? '#3a2416' : '#22150c', 120, qy(0.0005, -1, 1, z, z + 0.018 + (i % 4) * 0.006), 0.15, 0.6); }
  // warm desk-lamp pool from upper left
  const g = camPoint(c, [-0.18, 0, -0.16]), u = camUnit(c, [0, 0, 0]);
  void g; void u; // the pool itself is the look layer's smooth light (LookDef.pool): painted rings banded
  // the blank Polaroid (VD31-13: same pale grey-beige wash as B03-SH03; no mark, no streak, no ring)
  const P = REVEAL.polaroid, [px, , pz] = P.c;
  wWash(p, c, 37100, '#0c0704', 150, qy(0.0002, px - P.w / 2 + 0.006, px + P.w / 2 + 0.006, pz - P.h / 2 + 0.006, pz + P.h / 2 + 0.006), 0.2, 0.1);
  wFill(p, c, 37101, '#f3eee2', qy(0.0006, px - P.w / 2, px + P.w / 2, pz - P.h / 2, pz + P.h / 2));
  const top = pz - P.h / 2 + 0.0045; // image area 0.079 square under a narrow top border; the wide border toward +z (screen down)
  wFill(p, c, 37102, '#b9ae9a', qy(0.0007, px - 0.0395, px + 0.0395, top, top + 0.079));
  wWash(p, c, 37103, '#cfc5b0', 130, qy(0.0008, px - 0.035, px + 0.03, top + 0.006, top + 0.07), 0.3, 0.15);
  wInk(p, c, 37104, qy(0.0009, px - P.w / 2, px + P.w / 2, pz - P.h / 2, pz + P.h / 2), {weight: 0.4, color: '#b8ad98'});
  // the 8x10 print's shadow (the print itself is a camera-mapped image, look layer)
  const R = REVEAL.print, a = R.rot * DEG, co = Math.cos(a), si = Math.sin(a);
  const corner = (dx: number, dz: number, o = 0): V3 => [R.c[0] + o + dx * co + dz * si, 0.0003, R.c[2] + o - dx * si + dz * co];
  wWash(p, c, 37120, '#0c0704', 160, [corner(-R.w / 2, -R.h / 2, 0.008), corner(R.w / 2, -R.h / 2, 0.008), corner(R.w / 2, R.h / 2, 0.008), corner(-R.w / 2, R.h / 2, 0.008)], 0.2, 0.1);
  paintLemonHalf(p, c, 37200, REVEAL.lemon.c, REVEAL.lemon.r);
  // the falloff: dark vignette toward the frame edges (painted, keeps the pool clean)
};
/** The print's four world corners (top-left, top-right, bottom-right, bottom-left as seen from the master top view). */
export const printCorners = (): [V3, V3, V3, V3] => {
  const R = REVEAL.print, a = R.rot * DEG, co = Math.cos(a), si = Math.sin(a);
  const k = (dx: number, dz: number): V3 => [R.c[0] + dx * co + dz * si, 0.001, R.c[2] - dx * si + dz * co];
  return [k(-R.w / 2, -R.h / 2), k(R.w / 2, -R.h / 2), k(R.w / 2, R.h / 2), k(-R.w / 2, R.h / 2)];
};
export {qx, qy, qz, wp, wFill, wWash, wInk, paintBox, flatCircle, sphereAt, type Box, type Pt};
