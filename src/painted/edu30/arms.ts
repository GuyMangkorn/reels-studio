import {hardFill, inkLine} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {paintSkyBands} from '../kit/sky';
import type {V3} from '../kit/space';
import {wFill, wInk} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {add, ballKeys, newRig, paintBeast, spline, type Build, type L3} from '../survival/beast';
import {emuBuild, scaled} from './flock';
import {EMU_POSES, type EmuPose} from './emu';

// SPACE A, the coat of arms today (`new: aus-arms-relief` on `new: sandstone-wall`, VD30-04; Film W3 look asset 2026-11-19, Boss hardens).
// User Q2 (page db, 2026-11-19): a simplified painted relief, recognisable but not a traced copy: shield of six simple coloured quarters
// with a plain border, the seven-point star over a twisted wreath, kangaroo viewer's left, emu viewer's right (supporter sides pending Boat's
// check, open question), wattle compartment, the scroll "AUSTRALIA". Full natural colour, morning sun from the upper left, crisp relief
// shadows down-right. World: metres, origin at the wall foot under the emblem centre, wall plane z 0 facing +z, relief 0.15 m proud.

export const ARMS = {stone: '#d8b583', stoneLit: '#e6c799', stoneShade: '#b8915f', mortar: '#a68356', shadow: '#8f6f47', sky: '#4f8fd0', skyLow: '#b9d6ee',
  gold: '#d9a62e', goldDark: '#a77818', blue: '#2f5aa0', red: '#c0392b', white: '#f2ece0', black: '#1e1c1a', wattleLeaf: '#5f7f3a', wattleLeafDark: '#456230', wattle: '#f0c21c',
  roo: '#a8643a', rooPale: '#d9b58e', rooDark: '#6e3e22', scroll: '#e8d9a8', scrollShade: '#b9a46c'} as const;
const SUN_A: V3 = [-0.55, 0.65, 0.55];
const RZ = 0.15;
const h = (n: number) => { const s = Math.sin(n * 41.17 + 9.1) * 43758.5453; return s - Math.floor(s); };

/** A relief piece: its drop shadow on the wall (offset down-right), then the piece at `z`. `pts` are wall-plane (x, y). */
const relief = (p: Painter, c: YCam, seed: number, color: string, pts: [number, number][], z = RZ, sh = 0.05) => {
  wFill(p, c, seed, ARMS.shadow, pts.map(([x, y]) => [x + sh * 0.8, y - sh, 0.005] as V3));
  return wFill(p, c, seed + 1, color, pts.map(([x, y]) => [x, y, z] as V3));
};
const ellPts = (cx: number, cy: number, rx: number, ry: number, n = 16, a = 0): [number, number][] => Array.from({length: n}, (_, i) => { const t = (i / n) * Math.PI * 2; return [cx + rx * Math.cos(t) * Math.cos(a) - ry * Math.sin(t) * Math.sin(a), cy + rx * Math.cos(t) * Math.sin(a) + ry * Math.sin(t) * Math.cos(a)]; });
const star = (cx: number, cy: number, r: number, n: number, k = 0.45): [number, number][] => Array.from({length: n * 2}, (_, i) => { const a = Math.PI / 2 + (i / (n * 2)) * Math.PI * 2, rr = i % 2 ? r * k : r; return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)]; });

export const paintArmsSky = (p: Painter, c: YCam) => {
  const hz = camPoint(c, [c.x + 5000 * Math.sin(c.yaw), c.y, c.z - 5000 * Math.cos(c.yaw)])?.[1] ?? c.hy;
  paintSkyBands(p, {from: ARMS.sky, via: '#78acdf', viaAt: 0.5, to: ARMS.skyLow, horizon: Math.max(hz, 400) + 12, width: 1080, top: -200, bands: 8});
  for (let k = 0; k < 3; k++) { const s = camPoint(c, [-8 + k * 9, 14 + k * 2, -30]); if (s) hardFill(p, 41900 + k, '#eef4fa', ellPts(s[0], s[1], 150 + 40 * k, 34, 14).map(([x, y]) => [x, y] as Pt)); }
};

/** Sandstone ashlar wall x -6..6, y 0..7.5, blocks 0.9 x 0.45 m (staggered, each a slightly different tone), mortar lines, a cornice. */
export const paintSandstoneWall = (p: Painter, c: YCam, seed: number) => {
  wFill(p, c, seed, ARMS.stone, [[-6, 0, 0], [6, 0, 0], [6, 7.5, 0], [-6, 7.5, 0]]);
  for (let r = 0; r < 17; r++) for (let k = -7; k < 7; k++) {
    const x0 = k * 0.9 + (r % 2) * 0.45, y0 = r * 0.45, v = h(r * 31 + k);
    if (x0 > 6 || x0 + 0.9 < -6 || y0 >= 7.5) continue;
    const q: V3[] = [[Math.max(-6, x0 + 0.012), y0 + 0.012, 0.001], [Math.min(6, x0 + 0.888), y0 + 0.012, 0.001], [Math.min(6, x0 + 0.888), Math.min(7.5, y0 + 0.438), 0.001], [Math.max(-6, x0 + 0.012), Math.min(7.5, y0 + 0.438), 0.001]];
    wFill(p, c, seed + 10 + r * 20 + k + 7, v > 0.66 ? ARMS.stoneLit : v > 0.25 ? ARMS.stone : mixColor(ARMS.stone, ARMS.stoneShade, 0.5), q);
    if (v > 0.8) wInk(p, c, seed + 600 + r * 20 + k, [[x0 + 0.2, y0 + 0.15, 0.002], [x0 + 0.55, y0 + 0.22, 0.002]], {closed: false, weight: 0.5, color: ARMS.stoneShade});
  }
  // cornice: a projecting moulding with its shadow on the wall
  wFill(p, c, seed + 800, ARMS.shadow, [[-6, 7.2, 0.002], [6, 7.2, 0.002], [6, 7.5, 0.002], [-6, 7.5, 0.002]]);
  wFill(p, c, seed + 801, ARMS.stoneShade, [[-6.2, 7.5, 0.35], [6.2, 7.5, 0.35], [6.2, 7.75, 0.35], [-6.2, 7.75, 0.35]]);
  wFill(p, c, seed + 802, ARMS.stoneLit, [[-6.2, 7.75, 0.35], [6.2, 7.75, 0.35], [6.2, 7.9, 0.2], [-6.2, 7.9, 0.2]]);
  wFill(p, c, seed + 803, mixColor(ARMS.stoneShade, ARMS.shadow, 0.5), [[-6.2, 7.5, 0.35], [6.2, 7.5, 0.35], [6.2, 7.5, 0], [-6.2, 7.5, 0]]);
};

/** Kangaroo supporter as a relief loft (upright on its hind legs and tail, forepaws to the shield). Local frame: +x forward (heading). */
export const buildRelieKangaroo = (): Build => {
  const R = newRig(), b = R.bone('body', null), col = (_u: number, sd: number) => (sd < -0.2 ? ARMS.rooPale : sd > 0.5 ? ARMS.rooDark : ARMS.roo);
  const body = spline([{p: [-0.12, 0.62, 0], a: 0.15, b: 0.16}, {p: [-0.06, 0.82, 0], a: 0.17, b: 0.2}, {p: [0.02, 1.08, 0], a: 0.14, b: 0.15}, {p: [0.08, 1.3, 0], a: 0.09, b: 0.1}, {p: [0.1, 1.42, 0], a: 0.06, b: 0.065}], 3);
  R.loft(b, {m: 12, cap: true, col, keys: body});
  R.loft(b, {m: 10, cap: true, col, keys: [{p: [0.08, 1.46, 0], a: 0.06, b: 0.065}, {p: [0.15, 1.5, 0], a: 0.07, b: 0.07}, {p: [0.25, 1.48, 0], a: 0.045, b: 0.05}, {p: [0.31, 1.45, 0], a: 0.025, b: 0.03}]});   // head
  for (const g of [1, -1]) R.flat(b, {pts: [[0.12, 1.55, g * 0.03], [0.08, 1.7, g * 0.04], [0.15, 1.58, g * 0.03]], col: ARMS.rooDark, two: true});   // ears
  R.loft(b, {m: 10, col, keys: spline([{p: [-0.2, 0.55, 0], a: 0.09, b: 0.1}, {p: [-0.36, 0.25, 0], a: 0.06, b: 0.065}, {p: [-0.5, 0.05, 0], a: 0.04, b: 0.045}, {p: [-0.7, 0.02, 0], a: 0.022, b: 0.022}], 3)});   // tail
  for (const g of [1, -1]) {
    R.loft(b, {m: 10, col, side: g as 1 | -1, keys: spline([{p: [-0.05, 0.6, g * 0.1], a: 0.11, b: 0.12}, {p: [0.08, 0.38, g * 0.1], a: 0.07, b: 0.08}, {p: [-0.08, 0.12, g * 0.1], a: 0.04, b: 0.045}], 2)});   // thigh to hock
    R.loft(b, {m: 8, col: () => ARMS.rooDark, side: g as 1 | -1, keys: [{p: [-0.1, 0.06, g * 0.1], a: 0.035, b: 0.03}, {p: [0.12, 0.02, g * 0.1], a: 0.03, b: 0.02}, {p: [0.24, 0.02, g * 0.1], a: 0.015, b: 0.012}]});   // long foot
    R.loft(b, {m: 8, col, side: g as 1 | -1, keys: [{p: [0.08, 1.2, g * 0.09], a: 0.03, b: 0.03}, {p: [0.2, 1.08, g * 0.12], a: 0.025, b: 0.025}, {p: [0.32, 1.12, g * 0.12], a: 0.02, b: 0.02}]});   // forearm to the shield
    R.loft(b, {m: 6, col: () => ARMS.black, keys: ballKeys([0.23, 1.5, g * 0.045] as L3, 0.012, [0.3, 0.2, g])});   // eye
  }
  R.B.shadow = {s: 0, l: 0, rs: 0, rl: 0}; R.B.feet = []; R.B.anchors = {head: [0.2, 1.5, 0]};
  R.B.look = {sub: 2, ring: 2, rim: '#f0d8b0', rimK: 0.2, edge: 0.45, far: 0.12};
  return R.B;
};
/** A build pressed into a relief: depth (world z after placement) scaled toward the wall. Applied in local frame (z is the bird's left). */
const flatten = (B: Build, k: number): Build => ({...B, parts: B.parts.map((q) => ({...q, keys: q.keys.map((kk) => ({...kk, p: [kk.p[0], kk.p[1], kk.p[2] * k] as L3, a: kk.a * (0.5 + 0.5 * k)}))})), flats: B.flats.map((f) => ({...f, pts: f.pts.map((v) => [v[0], v[1], v[2] * k] as L3)}))});

export type ArmsOpts = {emuPose?: EmuPose};
/** The emblem relief (paint order: supporters behind the shield, then the compartment, shield, crest, scroll). Returns the emu supporter's
 *  picture anchors (head) and the scroll centre for the DOM word. */
export const paintArms = (p: Painter, c: YCam, seed: number, o: ArmsOpts = {}) => {
  // supporters (relief lofts, pressed to 35 % depth), standing on the compartment top y 3.5
  const roo = paintBeast(p, c, flatten(scaled(buildRelieKangaroo(), 1.3), 0.35), {at: [-1.12, 0.09], heading: 0, ground: 3.45, seed: seed + 1000, sun: SUN_A, shadowOp: 0});
  const emuB = flatten(scaled(emuBuild({...(o.emuPose ?? EMU_POSES.stand({head: [0.36, 1.62, 0], headDir: [1, -0.05, 0]})), hero: false}), 1.12), 0.35);
  const emu = paintBeast(p, c, emuB, {at: [1.12, 0.09], heading: Math.PI, ground: 3.45, seed: seed + 2000, sun: SUN_A, shadowOp: 0});
  // compartment: a spray of wattle, leaves and gold puff balls, x -1.45..1.45, y 3.1..3.55
  for (let i = 0; i < 26; i++) {
    const x = -1.4 + i * 0.112, y = 3.32 + Math.sin(i * 1.3) * 0.1, a = (h(i) - 0.5) * 1.2 + (x < 0 ? 0.5 : -0.5);
    relief(p, c, seed + 3000 + i * 4, i % 3 ? ARMS.wattleLeaf : ARMS.wattleLeafDark, ellPts(x, y, 0.15, 0.035, 10, a), RZ - 0.02, 0.03);
  }
  for (let i = 0; i < 30; i++) { const x = -1.35 + h(i * 3) * 2.7, y = 3.2 + h(i * 7) * 0.32; relief(p, c, seed + 3200 + i * 2, ARMS.wattle, ellPts(x, y, 0.04, 0.04, 8), RZ, 0.02); }
  // scroll: a ribbon with turned ends under the compartment
  relief(p, c, seed + 3400, ARMS.scrollShade, [[-1.45, 3.08], [-1.2, 2.95], [-1.3, 2.8], [-1.55, 2.9]], RZ - 0.03);
  relief(p, c, seed + 3402, ARMS.scrollShade, [[1.45, 3.08], [1.2, 2.95], [1.3, 2.8], [1.55, 2.9]], RZ - 0.03);
  relief(p, c, seed + 3404, ARMS.scroll, [[-1.25, 3.1], [-0.6, 3.02], [0, 3.0], [0.6, 3.02], [1.25, 3.1], [1.25, 2.88], [0.6, 2.8], [0, 2.78], [-0.6, 2.8], [-1.25, 2.88]]);
  // shield: plain border, six quarters (2 rows x 3), simple charges (not traced: shapes only)
  const sw = 0.56, top = 4.88, bot = 3.83;
  const shieldPts = (inset: number): [number, number][] => [[-sw + inset, top - inset], [sw - inset, top - inset], [sw - inset, 4.35], [sw * 0.75 - inset * 0.8, 4.0 + inset * 0.3], [0, bot + inset * 1.2], [-sw * 0.75 + inset * 0.8, 4.0 + inset * 0.3], [-sw + inset, 4.35]];
  relief(p, c, seed + 3500, ARMS.white, shieldPts(0), RZ + 0.02, 0.06);
  for (let k = 0; k < 16; k++) { const pt = shieldPts(0.035)[Math.floor(k / 16 * 7)]; wFill(p, c, seed + 3520 + k, ARMS.black, ellPts(pt[0] * 0.98, pt[1] - 0.01, 0.012, 0.018, 6).map(([x, y]) => [x, y, RZ + 0.025] as V3)); }
  const inner = shieldPts(0.07), cellW = (2 * (sw - 0.07)) / 3, rows = [4.81, 4.42, 3.97];
  const Q = [ARMS.white, ARMS.blue, ARMS.white, ARMS.gold, ARMS.gold, ARMS.white];
  wFill(p, c, seed + 3560, ARMS.white, inner.map(([x, y]) => [x, y, RZ + 0.03] as V3));
  for (let r = 0; r < 2; r++) for (let k = 0; k < 3; k++) {
    const x0 = -sw + 0.07 + k * cellW, x1 = x0 + cellW, y0 = rows[r], y1 = r === 0 ? rows[1] : 4.02, i = r * 3 + k;
    const cell: [number, number][] = r === 0 ? [[x0, y0], [x1, y0], [x1, y1], [x0, y1]] : [[x0, y0], [x1, y0], [x1, y1 + (k === 1 ? -0.12 : 0.05)], [x0, y1 + (k === 1 ? -0.12 : 0.05)]];
    const cy = (y0 + y1) / 2, cx = (x0 + x1) / 2;
    wFill(p, c, seed + 3600 + i * 10, Q[i], cell.map(([x, y]) => [x, y, RZ + 0.035] as V3));
    const z = RZ + 0.04, W = (pts: [number, number][], col: string, s: number) => wFill(p, c, seed + 3600 + i * 10 + s, col, pts.map(([x, y]) => [x, y, z] as V3));
    if (i === 0) { W([[cx - 0.02, y0 - 0.02], [cx + 0.02, y0 - 0.02], [cx + 0.02, y1 + 0.02], [cx - 0.02, y1 + 0.02]], ARMS.red, 1); W([[x0 + 0.02, cy - 0.02], [x1 - 0.02, cy - 0.02], [x1 - 0.02, cy + 0.02], [x0 + 0.02, cy + 0.02]], ARMS.red, 2); }
    if (i === 1) for (let s = 0; s < 5; s++) W(star(cx + [0, -0.07, 0.07, -0.03, 0.04][s], cy + [0.1, 0.03, 0.02, -0.08, -0.12][s], 0.025, 5), ARMS.white, 1 + s);
    if (i === 2) { W(star(cx, cy, 0.09, 4, 0.35), ARMS.blue, 1); W(ellPts(cx, cy + 0.0, 0.025, 0.025, 8), ARMS.gold, 2); }
    if (i === 3) W([[cx - 0.08, cy - 0.04], [cx - 0.02, cy + 0.03], [cx + 0.05, cy + 0.05], [cx + 0.09, cy + 0.02], [cx + 0.03, cy], [cx + 0.0, cy - 0.06]], ARMS.black, 1);
    if (i === 4) W([[cx - 0.08, cy - 0.04], [cx + 0.06, cy - 0.04], [cx + 0.07, cy + 0.0], [cx + 0.02, cy + 0.0], [cx + 0.03, cy + 0.09], [cx + 0.0, cy + 0.1], [cx - 0.0, cy + 0.01], [cx - 0.08, cy + 0.0]], ARMS.black, 1);
    if (i === 5) W([[cx - 0.07, cy - 0.06], [cx + 0.05, cy - 0.06], [cx + 0.06, cy + 0.03], [cx + 0.0, cy + 0.08], [cx - 0.05, cy + 0.05], [cx - 0.07, cy + 0.0]], ARMS.red, 1);
  }
  // crest: twisted wreath bar and the seven-point star
  for (let k = 0; k < 8; k++) relief(p, c, seed + 3800 + k * 2, k % 2 ? ARMS.blue : ARMS.gold, [[-0.36 + k * 0.09, 4.94], [-0.27 + k * 0.09, 4.94], [-0.29 + k * 0.09, 5.02], [-0.38 + k * 0.09, 5.02]], RZ + 0.01, 0.03);
  relief(p, c, seed + 3900, ARMS.gold, star(0, 5.22, 0.2, 7, 0.5), RZ + 0.02, 0.05);
  wFill(p, c, seed + 3902, ARMS.goldDark, star(0.01, 5.21, 0.09, 7, 0.5).map(([x, y]) => [x, y, RZ + 0.025] as V3));
  return {emu, roo, scroll: camPoint(c, [0, 2.94, RZ + 0.01]), scrollUnit: camUnit(c, [0, 2.94, RZ])};
};

/** Planted bed at the wall foot (z 0.3..1.4): low native shrubs and a flowering wattle, so the frame's lower part is not bare wall. */
export const paintWattleBed = (p: Painter, c: YCam, seed: number) => {
  wFill(p, c, seed, '#6e5a40', [[-6, 0.3, 0.2], [6, 0.3, 0.2], [6, 0.3, 1.5], [-6, 0.3, 1.5]]);
  wFill(p, c, seed + 1, '#9a8f80', [[-6, 0, 1.5], [6, 0, 1.5], [6, 0.3, 1.5], [-6, 0.3, 1.5]]);
  for (let i = 0; i < 16; i++) {
    const x = -5.5 + i * 0.75 + h(i) * 0.3, z = 0.6 + h(i * 3) * 0.6, ht = 0.7 + h(i * 5) * 0.6, s = camPoint(c, [x, 0.3 + ht * 0.6, z]);
    if (!s) continue;
    const u = camUnit(c, [x, 0.3 + ht * 0.6, z]), r = (0.35 + 0.15 * h(i * 7)) * u;
    hardFill(p, seed + 10 + i * 3, i % 2 ? ARMS.wattleLeaf : ARMS.wattleLeafDark, Array.from({length: 14}, (_, k) => { const a = (k / 14) * 6.283; return [s[0] + r * Math.cos(a) * (0.85 + 0.3 * h(i * 13 + k)), s[1] + r * 0.7 * Math.sin(a) * (0.85 + 0.3 * h(i * 11 + k))] as Pt; }));
    if (i % 3 === 0) for (let k = 0; k < 9; k++) { const bx = s[0] + (h(i * 17 + k) - 0.5) * r * 1.4, by = s[1] + (h(i * 19 + k) - 0.6) * r; hardFill(p, seed + 200 + i * 10 + k, ARMS.wattle, Array.from({length: 7}, (_, j) => [bx + 0.03 * u * Math.cos((j / 7) * 6.283), by + 0.03 * u * Math.sin((j / 7) * 6.283)] as Pt)); }
  }
  void inkLine; void add;
};
