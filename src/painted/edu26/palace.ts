import {ell, hardFill, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter} from '../kit/painter';
import {paintBox, qx, qy, qz, wFill, wInk, wWash} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintCoin, R4} from './r4-cast';

// EDU-EP26-SHORT BRIEF-R4 VD26-13 (kept, re-lit): Vespasian's private room (`new: imperial-room-r4`). Space P (metres): origin at the
// front-centre of the marble table on the floor, +x screen right from the main camera, +y up, +z toward the camera. Room x -2.6..+2.6,
// z -3.2..+1.6, ceiling 3.8. Back wall z -3.2: Pompeian red panels on a black dado, a painted garland band, a window at x +1.2..+2.2.
// Table x -0.6..+0.6, z -0.45..0, top 0.80; bronze coin bowl at (+0.30, 0.80, -0.22). Lamp stand at (-1.6, 0, -1.8), flame y 1.55.
// No text anywhere (O5): no sign, no tax, no inscription on the bust or the coins.

export type PalaceLight = {mood: 'lamp' | 'window'; draft?: boolean};
const R = {x0: -2.6, x1: 2.6, z0: -3.2, z1: 3.6, h: 3.8};
export const TABLE = {x0: -0.6, x1: 0.6, z0: -0.45, z1: 0, top: 0.8};
export const LAMP: [number, number, number] = [-1.6, 1.55, -1.8];
export const BOWL: [number, number, number] = [0.3, 0.8, -0.22];

const PAL = {red: '#9b2f25', redLit: '#c04a33', redShade: '#6e211d', black: '#241a18', gold: '#d9a64a', garland: '#5d7a3c', ochre: '#c98d3c',
  floor: '#d8cbb4', floorDark: '#3a302c', marble: '#ece4d6', marbleVein: '#b9ad9c', bronze: '#9a6a2c', bronzeLit: '#e0b060', cloth: '#5a3a5e'};

export function paintPalace(p: Painter, c: YCam, L: PalaceLight, figures?: (p: Painter, c: YCam) => void) {
  const warm = L.mood === 'lamp';
  const t = (x: string) => warm ? x : mixColor(x, '#6f7f9a', 0.18);
  // mosaic floor: cream field, black border band, a simple meander row
  wFill(p, c, 32000, t(PAL.floor), qy(0, R.x0, R.x1, R.z0, R.z1));
  wFill(p, c, 32001, t(PAL.floorDark), qy(0.002, R.x0 + 0.2, R.x1 - 0.2, -1.4, -1.15));
  if (!L.draft) for (let i = 0; i < 24; i++) {
    const x = R.x0 + 0.3 + i * 0.2;
    wFill(p, c, 32010 + i, t(PAL.floor), qy(0.003, x, x + 0.1, -1.33, -1.22));
  }
  wWash(p, c, 32002, '#b8a68a', 90, qy(0.003, -1.8, 1.8, -0.9, 1.2), 0.4, 0.5);
  // back wall: red panels in black frames, black dado, garland band, cornice
  wFill(p, c, 32100, t(PAL.red), qz(R.z0, R.x0, R.x1, 0, R.h));
  wFill(p, c, 32101, t(PAL.black), qz(R.z0 + 0.001, R.x0, R.x1, 0, 0.9));
  wFill(p, c, 32102, t(PAL.black), qz(R.z0 + 0.001, R.x0, R.x1, 2.75, R.h));
  wFill(p, c, 32103, t(PAL.ochre), qz(R.z0 + 0.002, R.x0, R.x1, 2.55, 2.75));
  if (!L.draft) for (let i = 0; i < 18; i++) {
    const x = R.x0 + 0.15 + i * 0.3;
    wFill(p, c, 32110 + i, t(PAL.garland), [[x, 2.62, R.z0 + 0.003], [x + 0.15, 2.58, R.z0 + 0.003], [x + 0.3, 2.62, R.z0 + 0.003], [x + 0.15, 2.69, R.z0 + 0.003]]);
  }
  for (const [i, [x0, x1]] of [[-2.4, -1.25], [-1.0, 0.95]].entries()) {
    wInk(p, c, 32140 + i, qz(R.z0 + 0.004, x0, x1, 1.05, 2.4), {color: t(PAL.gold), weight: 2});
    wWash(p, c, 32145 + i, t(PAL.redShade), 90, qz(R.z0 + 0.003, x0 + 0.06, x1 - 0.06, 1.1, 1.45), 0.3, 0.5);
    if (!L.draft) {
      // a small painted vignette in the panel centre: a bird on a branch (no text)
      const cx = (x0 + x1) / 2;
      wFill(p, c, 32150 + i * 4, t('#e0c080'), [[cx - 0.12, 1.78, R.z0 + 0.005], [cx + 0.1, 1.82, R.z0 + 0.005], [cx + 0.02, 1.88, R.z0 + 0.005], [cx - 0.08, 1.86, R.z0 + 0.005]]);
      wInk(p, c, 32151 + i * 4, [[cx - 0.2, 1.74, R.z0 + 0.005], [cx + 0.2, 1.78, R.z0 + 0.005]], {closed: false, color: t('#3e2a1e'), weight: 1.5});
    }
  }
  // window with pale gold sky and a cypress / roof line outside
  const wz = R.z0 + 0.003, sky = warm ? '#f1d9a0' : '#e8e4cc';
  wFill(p, c, 32200, t('#2a1c18'), qz(wz, 1.15, 2.25, 0.95, 2.65));
  wFill(p, c, 32201, sky, qz(wz + 0.001, 1.22, 2.18, 1.02, 2.58));
  wFill(p, c, 32202, warm ? '#c9a078' : '#b8a888', qz(wz + 0.002, 1.22, 2.18, 1.02, 1.45));
  wFill(p, c, 32203, '#4f5f3a', [[1.55, 1.3, wz + 0.003], [1.62, 2.2, wz + 0.003], [1.69, 1.3, wz + 0.003]]);
  wFill(p, c, 32204, warm ? '#d48a58' : '#b97a5a', [[1.22, 1.45, wz + 0.003], [1.5, 1.6, wz + 0.003], [1.8, 1.48, wz + 0.003], [2.18, 1.62, wz + 0.003], [2.18, 1.45, wz + 0.003]]);
  wWash(p, c, 32205, sky, warm ? 60 : 110, [[1.22, 1.02, wz + 0.004], [2.18, 1.02, wz + 0.004], [2.6, 0.003, -1.6], [1.0, 0.003, -1.4]], 0.3, 0.3);
  // side walls (left: a curtained doorway; right: plain red, darker)
  wFill(p, c, 32300, t(PAL.redShade), qx(R.x0, 0, R.h, R.z0, R.z1));
  wFill(p, c, 32301, t(PAL.black), qx(R.x0 + 0.001, 0, 0.9, R.z0, R.z1));
  wFill(p, c, 32302, t(PAL.cloth), qx(R.x0 + 0.01, 0, 2.6, -1.0, 0.2));
  wWash(p, c, 32303, '#2c1a30', 140, qx(R.x0 + 0.012, 0, 2.6, -0.6, -0.35), 0.2, 0.5);
  wFill(p, c, 32310, t(mixColor(PAL.redShade, '#000000', 0.2)), qx(R.x1, 0, R.h, R.z0, R.z1));
  wFill(p, c, 32311, t(PAL.black), qx(R.x1 - 0.001, 0, 0.9, R.z0, R.z1));
  wFill(p, c, 32320, t('#4a2c22'), qy(R.h, R.x0, R.x1, R.z0, R.z1));
  // couch (lectus) with cushions at the back left, a marble bust on a pedestal back right (no inscription)
  if (!L.draft) {
    paintBox(p, c, 32400, {x0: -2.5, x1: -1.0, y0: 0.35, y1: 0.55, z0: -3.1, z1: -2.45}, t('#7a4a2a'), {front: -0.15, top: 0.1});
    paintBox(p, c, 32410, {x0: -2.45, x1: -1.05, y0: 0.55, y1: 0.66, z0: -3.08, z1: -2.48}, t('#c79a4a'), {front: -0.1, top: 0.15});
    for (const [i, x] of [-2.3, -1.4].entries()) paintBox(p, c, 32420 + i * 8, {x0: x, x1: x + 0.25, y0: 0.66, y1: 0.86, z0: -3.05, z1: -2.85}, t(i ? '#5a3a5e' : '#b94a3a'), {front: -0.1, top: 0.12});
    for (const x of [-2.48, -1.08]) paintBox(p, c, 32440 + Math.round(x * 10), {x0: x, x1: x + 0.06, y0: 0, y1: 0.35, z0: -2.55, z1: -2.49}, t('#5a3420'));
  }
  paintBox(p, c, 32500, {x0: 1.85, x1: 2.25, y0: 0, y1: 1.1, z0: -2.0, z1: -1.6}, t('#d9d0c0'), {front: -0.08, left: 0.05, right: -0.2, top: 0.1});
  const bust = camPoint(c, [2.05, 1.32, -1.8]);
  if (bust) {
    const u = camUnit(c, [2.05, 1.32, -1.8]);
    hardFill(p, 32510, t('#e6ddcc'), ell(bust[0], bust[1] + 0.12 * u, 0.2 * u, 0.1 * u, 16));
    hardFill(p, 32511, t('#ebe3d4'), ell(bust[0], bust[1] - 0.05 * u, 0.1 * u, 0.13 * u, 16));
    washAt(p, 32512, '#a89a88', 120, ell(bust[0] + 0.04 * u, bust[1] - 0.04 * u, 0.06 * u, 0.12 * u, 12), 0.2, 0.3);
  }
  // bronze lamp stand with a lit flame and its warm pool
  const lb = camPoint(c, [LAMP[0], 0, LAMP[2]]), lt = camPoint(c, LAMP);
  if (lb && lt) {
    const u = camUnit(c, [LAMP[0], 0.8, LAMP[2]]);
    washAt(p, 32600, '#ffdf9a', warm ? 70 : 30, ell(lt[0] + 0.06 * u, lt[1], 0.16 * u, 0.2 * u, 18), 0.4, 0.2);
    wWash(p, c, 32606, '#f0a050', warm ? 70 : 30, qz(R.z0 + 0.006, LAMP[0] - 0.9, LAMP[0] + 0.9, 0.9, 2.5), 0.6, 0.3);
    hardFill(p, 32601, PAL.bronze, [[lb[0] - 0.02 * u, lb[1]], [lb[0] + 0.02 * u, lb[1]], [lt[0] + 0.015 * u, lt[1] + 0.1 * u], [lt[0] - 0.015 * u, lt[1] + 0.1 * u]]);
    hardFill(p, 32602, PAL.bronze, [[lb[0] - 0.16 * u, lb[1]], [lb[0] + 0.16 * u, lb[1]], [lb[0] + 0.03 * u, lb[1] - 0.12 * u], [lb[0] - 0.03 * u, lb[1] - 0.12 * u]]);
    hardFill(p, 32603, PAL.bronzeLit, ell(lt[0], lt[1] + 0.08 * u, 0.12 * u, 0.035 * u, 14));
    hardFill(p, 32604, '#ffd27a', ell(lt[0] + 0.06 * u, lt[1] + 0.02 * u, 0.025 * u, 0.06 * u, 10));
    hardFill(p, 32605, '#fff4c8', ell(lt[0] + 0.06 * u, lt[1] + 0.035 * u, 0.012 * u, 0.03 * u, 8));
  }
  figures?.(p, c);
}

/** The marble table with the bronze bowl of coins and a silver cup, painted after any figure standing behind it. */
export function paintTable(p: Painter, c: YCam, L: PalaceLight) {
  const t = (x: string) => L.mood === 'lamp' ? x : mixColor(x, '#6f7f9a', 0.15);
  paintBox(p, c, 32700, {x0: TABLE.x0, x1: TABLE.x1, y0: TABLE.top - 0.06, y1: TABLE.top, z0: TABLE.z0, z1: TABLE.z1}, t(PAL.marble), {front: -0.08, top: 0.08, right: -0.15});
  paintBox(p, c, 32710, {x0: -0.12, x1: 0.12, y0: 0, y1: TABLE.top - 0.06, z0: -0.3, z1: -0.15}, t('#d8cfc0'), {front: -0.12, right: -0.2});
  paintBox(p, c, 32720, {x0: -0.3, x1: 0.3, y0: 0, y1: 0.06, z0: -0.38, z1: -0.08}, t('#cfc5b4'), {front: -0.1});
  if (!L.draft) for (let i = 0; i < 3; i++) wInk(p, c, 32730 + i, [[TABLE.x0 + 0.1 + i * 0.35, TABLE.top - 0.03, TABLE.z1 + 0.001], [TABLE.x0 + 0.3 + i * 0.35, TABLE.top - 0.05, TABLE.z1 + 0.001]], {closed: false, color: PAL.marbleVein, weight: 1});
  const b = camPoint(c, BOWL);
  if (b) {
    const u = camUnit(c, BOWL), r = 0.12 * u;
    washAt(p, 32740, '#5a4030', 120, ell(b[0] + r * 0.1, b[1] + 2, r * 1.2, r * 0.25, 16), 0.2, 0.3);
    hardFill(p, 32741, PAL.bronze, [[b[0] - r, b[1] - 0.07 * u], [b[0] + r, b[1] - 0.07 * u], [b[0] + r * 0.6, b[1]], [b[0] - r * 0.6, b[1]]]);
    hardFill(p, 32742, PAL.bronzeLit, ell(b[0], b[1] - 0.07 * u, r, r * 0.25, 18));
    for (let i = 0; i < 7; i++) paintCoin(p, [b[0] - r * 0.6 + hash(32750 + i) * r * 1.2, b[1] - 0.075 * u - hash(32760 + i) * r * 0.15], 0.018 * u, 32770 + i * 6, 0.75);
  }
  if (!L.draft) {
    const cup = camPoint(c, [-0.35, TABLE.top, -0.2]);
    if (cup) {
      const u = camUnit(c, [-0.35, TABLE.top, -0.2]);
      hardFill(p, 32800, '#c8c8c8', [[cup[0] - 0.04 * u, cup[1] - 0.1 * u], [cup[0] + 0.04 * u, cup[1] - 0.1 * u], [cup[0] + 0.02 * u, cup[1]], [cup[0] - 0.02 * u, cup[1]]]);
      hardFill(p, 32801, '#f0f0f0', ell(cup[0], cup[1] - 0.1 * u, 0.04 * u, 0.012 * u, 12));
    }
  }
  void R4;
}
