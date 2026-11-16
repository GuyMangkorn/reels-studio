import {hardFill, inkLine, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camUnit, type YCam} from '../kit/ycam';
import {ellPts, glow, hn, okPoly, P, poly, wCut, wFlat, wStroke} from './scenery';

// SET-BED18 (EDU-EP18-BRIEF-R1 N12, space N; Film W3 look frames LF03 night and LF03L lamp-on, 16 Nov 2026). Designed from the script before
// the kit: her small wooden bedroom back home, the end of a long day: horizontal plank walls, a low wooden bed with a floral sheet and a thin
// blue blanket, the white mosquito net knotted up unused above the bed (no comment on it), a bedside table with a cloth-shade lamp and her
// phone, a floor fan, a shuttered window with moonlight. Night: cool moonlight from the window, everything else in deep warm-dark planks.
// Lamp-on: the 2700 K lamp floods the left of the room warm; shadows fall to the right. Methods follow edu15/room.ts (copy, ENV-P01): the
// lamp halo is kit fog.ts paintHalo. N: metres, origin on the floor at the room centre line, +x right (screen right, camera at +z looking -z),
// +y up, back wall z -1.9, walls x -2.0 / +2.2, ceiling 2.6.

export const BED = {
  moon: '#7f97c4', plank: '#4a3a30', plankLit: '#6a5a50', sheet: '#e2d6cc', floral: '#b98a9a', blanket: '#6a8aa8', fan: '#d9d6cf', blade: '#8fb6d0',
  net: '#e9e6dc', lamp: '#ffcf8a', lampWall: '#9a7a5a', shadow: '#3a2a24', night: '#1a1e2c', wood: '#5a3e2c', shade: '#efe2c4',
};
export type BedMode = 'night' | 'lamp';
export const LAMP_BULB: V3 = [-1.35, 0.85, -1.5];
export const TABLE: V3 = [-1.35, 0, -1.5];
export const FAN: V3 = [1.2, 0, -1.5];
const WALL_L = -2.0, WALL_R = 2.2, BACK = -1.9, CEIL = 2.6;
const BED_X: [number, number] = [-1.0, 1.0], BED_Z: [number, number] = [-1.9, -0.5], BED_TOP = 0.45;

/** Colour of a surface at world point v in this mode: night = cool-dark with the moon on the window side; lamp = warm by distance to the bulb. */
export const tone = (col: string, v: V3, mode: BedMode, k = 1) => {
  if (mode === 'night') {
    const moonK = Math.max(0, 1 - Math.hypot(v[0] - 0.75, v[2] + 1.0) / 1.6) * 0.35;
    return mixColor(mixColor(col, BED.night, 0.55 * k), BED.moon, moonK * k);
  }
  const d = Math.hypot(v[0] - LAMP_BULB[0], v[1] - LAMP_BULB[1], v[2] - LAMP_BULB[2]), lit = Math.max(0, 1 - d / 3.4);
  return mixColor(mixColor(col, BED.shadow, (0.55 - 0.5 * lit) * k), BED.lamp, 0.32 * lit * lit * k);
};

/** Horizontal boards on a wall quad (corner a bottom-left, b bottom-right, height h): flat colour per board with dark seams. */
const boards = (p: Painter, c: YCam, seed: number, a: V3, b: V3, y0: number, y1: number, mode: BedMode, k = 1) => {
  const n = Math.round((y1 - y0) / 0.2);
  for (let i = 0; i < n; i++) {
    const ya = y0 + ((y1 - y0) * i) / n, yb = y0 + ((y1 - y0) * (i + 1)) / n, mid: V3 = [(a[0] + b[0]) / 2, (ya + yb) / 2, (a[2] + b[2]) / 2];
    wFlat(p, c, seed + i, tone(mixColor(BED.plank, BED.plankLit, 0.5 * hn(seed + i)), mid, mode, k), [[a[0], ya, a[2]], [b[0], ya, b[2]], [b[0], yb, b[2]], [a[0], yb, a[2]]]);
    wStroke(p, c, seed + 100 + i, [[a[0], yb, a[2]], [b[0], yb, b[2]]], tone('#20160f', mid, mode), 0.7);
  }
};

const box = (p: Painter, c: YCam, seed: number, x: [number, number], y: [number, number], z: [number, number], col: string, mode: BedMode) => {
  const ctr: V3 = [(x[0] + x[1]) / 2, y[1], (z[0] + z[1]) / 2];
  wFlat(p, c, seed, tone(mixColor(col, '#000000', 0.25), ctr, mode), [[x[0], y[0], z[1]], [x[0], y[1], z[1]], [x[0], y[1], z[0]], [x[0], y[0], z[0]]]);
  wFlat(p, c, seed + 1, tone(mixColor(col, '#000000', 0.3), ctr, mode), [[x[1], y[0], z[1]], [x[1], y[1], z[1]], [x[1], y[1], z[0]], [x[1], y[0], z[0]]]);
  wFlat(p, c, seed + 2, tone(mixColor(col, '#ffffff', 0.1), ctr, mode), [[x[0], y[1], z[0]], [x[1], y[1], z[0]], [x[1], y[1], z[1]], [x[0], y[1], z[1]]]);
  wCut(p, c, seed + 3, tone(col, ctr, mode), [[x[0], y[0], z[1]], [x[1], y[0], z[1]], [x[1], y[1], z[1]], [x[0], y[1], z[1]]], {shadow: 3});
};

/** The room shell, window, net, table, lamp, fan and the bed up to the sheet (the girl and her blanket are painted by the look). */
export const paintBedroomBack = (p: Painter, c: YCam, o: {mode: BedMode; t: number}) => {
  const m = o.mode;
  // ceiling boards and joists
  wFlat(p, c, 48000, tone(BED.plank, [0, CEIL, -1], m, 1.15), [[WALL_L, CEIL, BACK], [WALL_R, CEIL, BACK], [WALL_R, CEIL, 3], [WALL_L, CEIL, 3]]);
  for (let i = 0; i < 6; i++) { const x = WALL_L + 0.35 + i * 0.75; wCut(p, c, 48010 + i, tone(BED.wood, [x, CEIL, -1], m, 1.1), [[x - 0.05, CEIL - 0.1, BACK], [x + 0.05, CEIL - 0.1, BACK], [x + 0.05, CEIL - 0.1, 3], [x - 0.05, CEIL - 0.1, 3]], {shadow: 3}); }
  // walls: side walls first, then the back wall
  boards(p, c, 48100, [WALL_L, 0, 3], [WALL_L, 0, BACK], 0, CEIL, m, 1.15);
  boards(p, c, 48200, [WALL_R, 0, BACK], [WALL_R, 0, 3], 0, CEIL, m, 1.15);
  boards(p, c, 48300, [WALL_L, 0, BACK], [WALL_R, 0, BACK], 0, CEIL, m);
  // floor boards running toward the lens
  wFlat(p, c, 48400, tone(BED.wood, [0, 0, -0.5], m, 1.1), [[WALL_L, 0, BACK], [WALL_R, 0, BACK], [WALL_R, 0, 3], [WALL_L, 0, 3]]);
  for (let i = 1; i < 20; i++) { const x = WALL_L + i * 0.22; wStroke(p, c, 48410 + i, [[x, 0, BACK], [x, 0, 1.2]], tone('#20160f', [x, 0, -0.5], m), 0.6); }
  // window: night sky, a far palm, half-open shutters, the sill
  const wx: [number, number] = [0.3, 1.2], wy: [number, number] = [1.0, 1.9];
  wFlat(p, c, 48500, m === 'night' ? '#26345a' : '#1c2238', [[wx[0], wy[0], BACK], [wx[1], wy[0], BACK], [wx[1], wy[1], BACK], [wx[0], wy[1], BACK]]);
  wFlat(p, c, 48501, m === 'night' ? '#3a4a78' : '#232a44', [[wx[0], wy[0], BACK], [wx[1], wy[0], BACK], [wx[1], wy[0] + 0.3, BACK], [wx[0], wy[0] + 0.3, BACK]]);
  const moonAt = P(c, [0.95, 1.72, BACK]);
  if (moonAt && m === 'night') hardFill(p, 48502, '#e8eef8', ellPts(moonAt[0], moonAt[1], 9, 9, 16));
  // far palm sliver (silhouette) at the window's left edge
  const palmPts: V3[] = [[0.42, wy[0], BACK], [0.46, wy[0], BACK], [0.47, 1.6, BACK], [0.62, 1.68, BACK], [0.5, 1.64, BACK], [0.58, 1.78, BACK], [0.46, 1.66, BACK], [0.36, 1.76, BACK], [0.42, 1.63, BACK], [0.3, 1.62, BACK]];
  wFlat(p, c, 48503, '#121828', palmPts);
  [[wx[0], -1], [wx[1], 1]].forEach(([hx, s], i) => {
    const open = 0.55, w = 0.45, ex = hx + s * w * Math.cos(open), ez = BACK + w * Math.sin(open);
    const ctr: V3 = [hx, 1.45, BACK + 0.1];
    wCut(p, c, 48510 + i, tone(BED.wood, ctr, m, 0.9), [[hx, wy[0], BACK], [ex, wy[0], ez], [ex, wy[1], ez], [hx, wy[1], BACK]], {shadow: 3});
    for (let k = 1; k < 7; k++) { const y = wy[0] + (k / 7) * (wy[1] - wy[0]); wStroke(p, c, 48520 + i * 10 + k, [[hx, y, BACK], [ex, y, ez]], tone('#20160f', ctr, m), 0.6); }
  });
  wCut(p, c, 48540, tone(BED.wood, [0.75, wy[0], BACK], m), [[wx[0] - 0.08, wy[0] - 0.06, BACK + 0.06], [wx[1] + 0.08, wy[0] - 0.06, BACK + 0.06], [wx[1] + 0.08, wy[0], BACK + 0.06], [wx[0] - 0.08, wy[0], BACK + 0.06]], {shadow: 3});
  // moonlight: the window's light falling on the back wall below it (night only)
  if (m === 'night') { const q = poly(c, [[wx[0] + 0.1, wy[0] - 0.08, BACK + 0.01], [wx[1] + 0.05, wy[0] - 0.08, BACK + 0.01], [wx[1] + 0.25, 0.5, BACK + 0.01], [wx[0] + 0.25, 0.5, BACK + 0.01]]); if (okPoly(q)) glow(p, 48550, BED.moon, 45, q); }
  // bedside table, lamp and the phone face-down
  const tx = TABLE[0], tz = TABLE[2];
  box(p, c, 48600, [tx - 0.22, tx + 0.22], [0.5, 0.55], [tz - 0.2, tz + 0.2], BED.wood, m);
  [[-0.18, -0.16], [0.18, -0.16], [-0.18, 0.16], [0.18, 0.16]].forEach(([dx, dz], i) => box(p, c, 48610 + i * 4, [tx + dx - 0.02, tx + dx + 0.02], [0, 0.5], [tz + dz - 0.02, tz + dz + 0.02], BED.wood, m));
  box(p, c, 48630, [tx + 0.03, tx + 0.18], [0.55, 0.562], [tz + 0.02, tz + 0.1], '#202428', m);
  const shadeCol = m === 'lamp' ? '#ffe7b8' : tone(BED.shade, LAMP_BULB, m);
  box(p, c, 48640, [tx - 0.035, tx + 0.035], [0.55, 0.72], [tz - 0.035, tz + 0.035], '#8a6a4a', m);
  const sh = (y: number, r: number) => Array.from({length: 20}, (_, k): V3 => [LAMP_BULB[0] + r * Math.cos((k / 20) * 6.283), y, LAMP_BULB[2] + r * Math.sin((k / 20) * 6.283)]);
  const shadeQ = [...sh(0.72, 0.17), ...sh(0.98, 0.1)].map((v) => P(c, v)).filter((v): v is Pt => !!v);
  if (shadeQ.length > 3) {
    const hull = convex(shadeQ);
    hardFill(p, 48660, shadeCol, hull);
    if (m === 'lamp') { const lo = sh(0.72, 0.17).map((v) => P(c, v)).filter((v): v is Pt => !!v); if (lo.length > 3) hardFill(p, 48661, '#fff6e0', convex(lo)); }
  }
  // floor fan: base, pole, guard, blades as a soft blur (it is off-axis, facing the bed, three-quarter)
  const [fx, , fz] = FAN, headY = 1.15, ctr: V3 = [fx, headY, fz];
  const baseQ = Array.from({length: 22}, (_, k): V3 => [fx + 0.18 * Math.cos((k / 22) * 6.283), 0.02, fz + 0.18 * Math.sin((k / 22) * 6.283)]);
  wCut(p, c, 48700, tone(BED.fan, FAN, m, 0.9), baseQ, {shadow: 3});
  box(p, c, 48701, [fx - 0.02, fx + 0.02], [0.02, headY - 0.1], [fz - 0.02, fz + 0.02], BED.fan, m);
  box(p, c, 48705, [fx - 0.06, fx + 0.06], [headY - 0.08, headY + 0.08], [fz - 0.02, fz + 0.12], BED.fan, m);
  const fq = P(c, ctr), fu = camUnit(c, ctr);
  if (fq) {
    const rx = 0.2 * fu * 0.62, ry = 0.2 * fu;
    hardFill(p, 48710, tone(mixColor(BED.blade, BED.fan, 0.4), ctr, m), ellPts(fq[0] - 0.05 * fu, fq[1], rx, ry, 28));
    for (let k = 0; k < 3; k++) { const a = o.t * 9 + (k * 6.283) / 3; hardFill(p, 48711 + k, tone(BED.blade, ctr, m), [[fq[0] - 0.05 * fu, fq[1]], [fq[0] - 0.05 * fu + rx * 0.9 * Math.cos(a), fq[1] + ry * 0.9 * Math.sin(a)], [fq[0] - 0.05 * fu + rx * 0.9 * Math.cos(a + 0.7), fq[1] + ry * 0.9 * Math.sin(a + 0.7)]]); }
    for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI; wStrokePx(p, 48720 + k, [[fq[0] - 0.05 * fu + rx * Math.cos(a), fq[1] - ry * Math.sin(a)], [fq[0] - 0.05 * fu - rx * Math.cos(a), fq[1] + ry * Math.sin(a)]], tone('#c9c6bf', ctr, m)); }
    hardFill(p, 48735, tone('#bdb9b0', ctr, m), ellPts(fq[0] - 0.05 * fu, fq[1], rx * 0.18, ry * 0.18, 12));
  }
  // the bed: frame, mattress and sheet with a floral print
  box(p, c, 48800, [BED_X[0], BED_X[1]], [0.05, 0.33], [BED_Z[0], BED_Z[1]], BED.wood, m);
  box(p, c, 48810, [BED_X[0] + 0.03, BED_X[1] - 0.03], [0.33, BED_TOP], [BED_Z[0], BED_Z[1] - 0.02], BED.sheet, m);
  for (let k = 0; k < 46; k++) {
    const x = BED_X[0] + 0.1 + 1.8 * hn(48900 + k), z = BED_Z[0] + 0.1 + 1.2 * hn(48950 + k), q = P(c, [x, BED_TOP + 0.002, z]);
    if (!q) continue;
    const s = 0.03 * camUnit(c, [x, BED_TOP, z]);
    hardFill(p, 49000 + k, tone(k % 4 ? BED.floral : '#8aa07a', [x, BED_TOP, z], m), ellPts(q[0], q[1], s, s * 0.45, 8));
  }
  // pillows at the head end
  [[-0.98, -0.62, -1.85, -1.4], [-0.98, -0.6, -1.35, -0.9]].forEach(([x0, x1, z0, z1], i) => box(p, c, 49100 + i * 4, [x0, x1], [BED_TOP, BED_TOP + 0.12], [z0, z1], BED.sheet, m));
  // the knotted-up net above the bed: a loose bundle from the ceiling hook down to y 1.9
  const nq = (y: number, r: number, z = -1.2) => P(c, [r, y, z]);
  const top = nq(CEIL, 0), bot = nq(1.9, 0);
  if (top && bot) {
    const u = camUnit(c, [0, 2.2, -1.2]), w = 0.13 * u;
    const L = bot[1] - top[1], cx = top[0];
    const side = (k: number, sgn: number): Pt => { const v = k / 10, bulge = Math.sin(Math.PI * Math.min(1, v * 0.85 + 0.1)) * (0.35 + 0.65 * v); return [cx + sgn * w * bulge, top[1] + L * v]; };
    const pts: Pt[] = [...Array.from({length: 11}, (_, k) => side(k, 1)), ...Array.from({length: 7}, (_, k): Pt => [cx + w * 0.75 * Math.cos((k / 6) * Math.PI), bot[1] + w * 0.3 * Math.sin((k / 6) * Math.PI)]), ...Array.from({length: 11}, (_, k) => side(10 - k, -1))];
    washAt(p, 49200, tone(BED.net, [0, 2.2, -1.2], m, 0.7), 175, pts, 0.1, 0.1);
    for (let k = 0; k < 6; k++) wStrokePx(p, 49210 + k, [[cx + (k - 2.5) * 1.5, top[1] + L * 0.12], [cx + (k - 2.5) * w * 0.3, bot[1] + w * 0.15]], tone('#c9c5bb', [0, 2.2, -1.2], m));
    hardFill(p, 49220, tone(BED.net, [0, 2.2, -1.2], m, 0.6), ellPts(cx, top[1] + L * 0.22, w * 0.3, w * 0.2, 12));
  }
};

/** Her blanket from the shoulder (x0) to past her feet (x1) along her body line at depth z: a drape from her side over the bed's front edge. */
export const paintBlanket = (p: Painter, c: YCam, x0: number, x1: number, z: number, topY: number, mode: BedMode) => {
  const ctr: V3 = [(x0 + x1) / 2, BED_TOP + 0.2, z];
  const n = 10, ridge: V3[] = Array.from({length: n + 1}, (_, k) => { const u = k / n, x = x0 + (x1 - x0) * u; return [x, topY - 0.08 * Math.sin(Math.PI * u * 2.2) * u - 0.06 * u * u + (k === 0 ? -0.03 : 0), z]; });
  const pts: V3[] = [...ridge, [x1 + 0.1, BED_TOP + 0.02, z + 0.3], [x1 + 0.12, 0.26, BED_Z[1] + 0.03], [x0 - 0.05, 0.24, BED_Z[1] + 0.03], [x0 - 0.04, BED_TOP + 0.06, z + 0.35]];
  wCut(p, c, 49300, tone(BED.blanket, ctr, mode), pts, {shadow: 4});
  for (let k = 0; k < 5; k++) { const x = x0 + 0.2 + k * 0.32; wStroke(p, c, 49310 + k, [[x, topY - 0.06, z], [x + 0.04, BED_TOP + 0.03, z + 0.3], [x + 0.05, 0.3, BED_Z[1] + 0.03]], tone('#4a6688', ctr, mode), 0.7); }
};

/** Floor at night: the window's moonlight patch, her dropped daypack and flip-flops (she just came home). */
export const paintBedroomFloor = (p: Painter, c: YCam, mode: BedMode) => {
  if (mode === 'night') { const q = poly(c, [[0.25, 0.002, -0.35], [1.25, 0.002, -0.35], [1.6, 0.002, 0.7], [0.5, 0.002, 0.7]]); if (okPoly(q)) glow(p, 49400, BED.moon, 95, q); }
  box(p, c, 49410, [0.45, 0.75], [0, 0.36], [-0.3, -0.12], '#6a6e72', mode);
  box(p, c, 49415, [0.47, 0.73], [0.2, 0.3], [-0.12, -0.09], '#5a5e62', mode);
  wStroke(p, c, 49420, [[0.5, 0.36, -0.12], [0.42, 0.2, 0.05], [0.4, 0.02, 0.1]], tone('#3a3e42', [0.5, 0.2, 0], mode), 1.2);
  [[-0.55, -0.32, 0.3], [-0.36, -0.28, -0.25]].forEach(([x, z, a], i) => {
    const pts: V3[] = Array.from({length: 14}, (_, k): V3 => { const t = (k / 14) * 6.283; return [x + 0.05 * Math.cos(t) * Math.cos(a) - 0.13 * Math.sin(t) * Math.sin(a), 0.01, z + 0.05 * Math.cos(t) * Math.sin(a) + 0.13 * Math.sin(t) * Math.cos(a)]; });
    wCut(p, c, 49430 + i, tone('#2f5a7a', [x, 0, z], mode), pts, {shadow: 2});
  });
};

/** Picture-space thin still stroke. */
const wStrokePx = (p: Painter, id: number, q: Pt[], color: string) => inkLine(p, id, q, {closed: false, weight: 0.6, color, still: true});
/** Convex hull (monotone chain) of picture points. */
const convex = (pts: Pt[]): Pt[] => {
  const s = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], up: Pt[] = [];
  for (const q of s) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of [...s].reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};
