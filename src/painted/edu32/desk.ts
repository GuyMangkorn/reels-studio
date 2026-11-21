import {clipHalf, ell, hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {paperCard} from '../kit/paper-card';
import type {V3} from '../kit/space';
import {flatCircle, qy, qz, wFill, wInk, wp, wWash} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {POSTER} from './cast';

// EDU-EP32-SHORT Space D, the desk (EDU-EP32-BRIEF-R1 VD32-01, VD32-03, VD32-07; set plan "Space D" and page "P park pop-up"). Model metres at
// 10:1 (1 model m = 10 cm of desk; kit figures keep native heights). Origin = desk top at the lamp hot spot; +x right, +y up, +z toward the master
// camera. Boss W3 gate still (2026-11-21): desk, wall, lamp base and arm, blotter, lamp pool, the open folder with the park pop-up (lawn sheet,
// path strip, tree card, box-fold bench). Every number is the brief's estimate unless noted; the seat height is the kit's seated hip (see BENCH).

/** The lamp shade centre (aimed at the origin): the point light for card shadows and rims. */
export const LAMP: V3 = [-1.6, 4.4, -1.6];
export const LAMP_BASE: V3 = [-4.0, 0, -3.6];
const WALL = '#2c2630', WALL_LIT = '#4a3a34', DESK = POSTER.walnut, FELT = '#3e5444';

/** Room: wall with the lamp's soft spill, desk top with a little grain, the blotter. */
export const paintRoom = (p: Painter, c: YCam) => {
  wFill(p, c, 32001, WALL, qz(-4.6, -30, 30, 0, 30));
  for (const [k, r, col, op] of [[0, 3.6, WALL_LIT, 70], [1, 2.4, '#5a463a', 70], [2, 1.4, '#6e5644', 60]] as const)
    wWash(p, c, 32002 + k, col, op, Array.from({length: 24}, (_, i): V3 => [-1.8 + r * 1.3 * Math.cos((i / 24) * 6.283), 2.6 + r * Math.sin((i / 24) * 6.283), -4.58]), 0.1, 0.1);
  wFill(p, c, 32010, DESK, qy(0, -7.5, 7.5, -4.5, 3.0));
  // back edge of the desk against the wall (a thin darker lip)
  wFill(p, c, 32011, mixColor(DESK, '#120a06', 0.45), qz(-4.5, -7.5, 7.5, 0, 0.06));
  for (let i = 0; i < 16; i++) {
    const z = -4.3 + i * 0.47 + 0.15 * hash(32020 + i), x0 = -7.4 + 2 * hash(32040 + i), x1 = x0 + 3 + 4 * hash(32060 + i);
    wInk(p, c, 32080 + i, [[x0, 0.001, z], [x1, 0.001, z + 0.05 * (hash(32100 + i) - 0.5)]], {color: mixColor(DESK, '#1e120a', 0.35), weight: 0.7, closed: false});
  }
  wFill(p, c, 32120, FELT, qy(0.01, -3.5, 3.5, -2.4, 2.2));
  // leather corners of the blotter
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    const x = 3.5 * sx, z = sz < 0 ? -2.4 : 2.2;
    wFill(p, c, 32130 + sx + 2 * sz + 3, '#3a2418', [[x, 0.012, z], [x - 0.7 * sx, 0.012, z], [x, 0.012, z - 0.7 * sz]]);
  }
};

/** Lamp base (brass disc) and the arm rising out of frame toward the shade. */
export const paintLampBase = (p: Painter, c: YCam) => {
  const brass = '#a8823a';
  hardFill(p, 32150, mixColor(brass, '#20140a', 0.45), flatCircle(c, [LAMP_BASE[0], 0.0, LAMP_BASE[2]], 0.62, 28));
  hardFill(p, 32151, brass, flatCircle(c, [LAMP_BASE[0], 0.12, LAMP_BASE[2]], 0.58, 28));
  hardFill(p, 32152, '#d9b766', flatCircle(c, [LAMP_BASE[0] + 0.12, 0.13, LAMP_BASE[2] + 0.1], 0.3, 20));
  const elbow: V3 = [-3.4, 3.2, -3.0];
  for (const [a, b, w, k] of [[[LAMP_BASE[0], 0.12, LAMP_BASE[2]] as V3, elbow, 0.09, 0], [elbow, LAMP, 0.08, 1]] as const) {
    const pa = camPoint(c, a), pb = camPoint(c, b);
    if (!pa || !pb) continue;
    const ua = camUnit(c, a) * w, ub = camUnit(c, b) * w, dx = pb[0] - pa[0], dy = pb[1] - pa[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
    hardFill(p, 32160 + k, mixColor(brass, '#20140a', 0.25), [[pa[0] + nx * ua, pa[1] + ny * ua], [pb[0] + nx * ub, pb[1] + ny * ub], [pb[0] - nx * ub, pb[1] - ny * ub], [pa[0] - nx * ua, pa[1] - ny * ua]]);
    inkLine(p, 32170 + k, [[pa[0] + nx * ua * 0.4, pa[1] + ny * ua * 0.4], [pb[0] + nx * ub * 0.4, pb[1] + ny * ub * 0.4]], {color: '#e8c878', weight: 1, closed: false, still: true});
  }
};

/** The warm lamp pool on the desk plane, centred on the origin (hot spot r 1.0, soft falloff to r 2.4); drawn over the pages, under the cards. */
export const paintLampPool = (p: Painter, c: YCam, y = 0.02) => {
  for (const [k, r, op] of [[0, 2.6, 34], [1, 2.0, 38], [2, 1.5, 40], [3, 1.05, 42], [4, 0.65, 36]] as const)
    wWash(p, c, 32200 + k, POSTER.lamp, op, Array.from({length: 36}, (_, i): V3 => [r * Math.cos((i / 36) * 6.283), y, r * Math.sin((i / 36) * 6.283)]), 0.05, 0.1);
};

/** Paper fibres and flecks on a page polygon in world (still marks, held in world space so a moving camera keeps them). */
const paperFlecks = (p: Painter, c: YCam, seed: number, x: [number, number], z: [number, number], y: number, n: number, color: string) => {
  for (let i = 0; i < n; i++) {
    const px = x[0] + (x[1] - x[0]) * hash(seed + i * 3), pz = z[0] + (z[1] - z[0]) * hash(seed + i * 3 + 1), a = 6.283 * hash(seed + i * 3 + 2), l = 0.025 + 0.05 * hash(seed + i * 7);
    wInk(p, c, seed + 1000 + i, [[px, y, pz], [px + l * Math.cos(a), y, pz + l * Math.sin(a)]], {color, weight: 0.5, closed: false});
  }
};

/** P: the open folder spread (4.6 x 3.1, kraft inside, red band on the tab edge), the printed lawn sheet glued on it, the path strip. */
export const paintFolderP = (p: Painter, c: YCam) => {
  const kraft = '#c4a171';
  // folder shadow on the felt, then the two leaves (a slight lift at the spine)
  wWash(p, c, 32300, '#14100c', 80, qy(0.011, -2.25, 2.42, -1.48, 1.68), 0.05, 0.1);
  wFill(p, c, 32301, kraft, qy(0.013, -2.3, 2.3, -1.55, 1.55));
  wFill(p, c, 32302, POSTER.red, qy(0.0135, -2.3, 2.3, -1.55, -1.4));
  wInk(p, c, 32303, [[0, 0.014, -1.55], [0, 0.014, 1.55]], {color: mixColor(kraft, '#2a1a0c', 0.4), weight: 0.8, closed: false});
  paperFlecks(p, c, 32310, [-2.25, 2.25], [-1.5, 1.5], 0.0145, 70, mixColor(kraft, '#5a3e22', 0.45));
  // lawn sheet: printed muted green with a cream border, two tones of printed grass
  wFill(p, c, 32400, POSTER.cream, qy(0.015, -2.1, 2.1, -1.32, 1.36));
  wFill(p, c, 32401, POSTER.green, qy(0.016, -2.0, 2.0, -1.24, 1.28));
  for (let i = 0; i < 9; i++) {
    const x = -1.9 + 3.8 * hash(32410 + i), z = -1.1 + 2.3 * hash(32430 + i), r = 0.18 + 0.22 * hash(32450 + i);
    wFill(p, c, 32460 + i, mixColor(POSTER.green, '#4f6a3a', 0.45), Array.from({length: 14}, (_, k): V3 => [x + r * 1.4 * Math.cos((k / 14) * 6.283), 0.0165, z + r * 0.7 * Math.sin((k / 14) * 6.283)]));
  }
  for (let i = 0; i < 40; i++) {
    const x = -1.95 + 3.9 * hash(32500 + i), z = -1.2 + 2.45 * hash(32550 + i);
    wInk(p, c, 32600 + i, [[x, 0.017, z], [x + 0.02, 0.017, z - 0.08]], {color: mixColor(POSTER.green, '#2f4426', 0.5), weight: 0.6, closed: false});
  }
  // path strip (sand paper cut out and glued on), from front-left to the right
  const path: V3[] = [[-2.0, 0.018, 1.0], [-0.6, 0.018, 0.75], [0.8, 0.018, 0.5], [2.0, 0.018, 0.3], [2.0, 0.018, 0.75], [0.8, 0.018, 0.98], [-0.6, 0.018, 1.22], [-2.0, 0.018, 1.28]];
  wFill(p, c, 32700, '#a68e66', path);
  wInk(p, c, 32701, path, {color: '#8a7550', weight: 0.6});
  paperFlecks(p, c, 32710, [-1.8, 1.8], [0.5, 1.1], 0.019, 25, '#8f7a56');
};

// ------------------------------------------------------------------ pop-up scenery cards
/** Tree card (front, squared to the lens): trunk and three canopy blobs in poster greens, `h` model m tall, foot at `at`. `fold` (radians, default 0)
 *  lays the card down about its foot in the card plane: + toward screen left, - toward screen right (the B03-SH01 bridge fold-down, VD32-18). */
export const paintTreeCard = (p: Painter, c: YCam, at: V3, h: number, seed: number, fold = 0) => {
  const g = camPoint(c, at);
  if (!g) return;
  const u = camUnit(c, at), H = h * u, cs = Math.cos(fold), sn = Math.sin(fold);
  const R = fold ? (q: Pt): Pt => { const dx = q[0] - g[0], dy = q[1] - g[1]; return [g[0] + dx * cs + dy * sn, g[1] - dx * sn + dy * cs]; } : (q: Pt) => q;
  const Rs = (pts: Pt[]) => (fold ? pts.map(R) : pts);
  const draw = (q: Painter) => {
    const trunk = '#6a4a30';
    hardFill(q, seed, trunk, Rs([[g[0] - 0.06 * H, g[1]], [g[0] + 0.06 * H, g[1]], [g[0] + 0.04 * H, g[1] - 0.5 * H], [g[0] - 0.035 * H, g[1] - 0.5 * H]]));
    inkLine(q, seed + 1, Rs([[g[0] - 0.06 * H, g[1]], [g[0] - 0.035 * H, g[1] - 0.5 * H]]), {weight: 0.8, closed: false, color: '#2b1d12', still: true});
    const blobs: [number, number, number, string][] = [[-0.16, 0.6, 0.2, '#5f7d44'], [0.15, 0.62, 0.21, '#6f8b4c'], [0, 0.8, 0.24, POSTER.green], [-0.05, 0.62, 0.16, '#86a35e']];
    blobs.forEach(([dx, dy, r, col], k) => {
      const pts = ell(g[0] + dx * H, g[1] - dy * H, r * H, r * H * 0.9, 22).map(([x, y], i): Pt => { const w = 1 + 0.06 * Math.sin(i * 2.1 + seed + k); return [g[0] + dx * H + (x - g[0] - dx * H) * w, g[1] - dy * H + (y - g[1] + dy * H) * w]; });
      hardFill(q, seed + 10 + k, col, Rs(pts));
      inkLine(q, seed + 20 + k, Rs(pts), {color: mixColor(col, '#1c2a14', 0.55), weight: 0.8, still: true, curve: 0.3});
    });
  };
  paperCard(p, c, {foot: at, light: LAMP, seed: seed + 100, edge: 8}, draw);
};

/** Box-fold pop-up bench (VD32-07): back card at z `zb` (slatted back over legs), the seat ledge (y `seat`) and the front apron at `zf`. */
export type Bench = {x0: number; x1: number; zb: number; zf: number; seat: number; back: number};
const SLAT = '#2f5a6a', SLAT_LIT = '#3f7284', SLAT_DARK = '#1f3c48', IRON = '#2a2a2e';
export const paintBenchBack = (p: Painter, c: YCam, b: Bench) => {
  const at: V3 = [(b.x0 + b.x1) / 2, 0, b.zb];
  const g = camPoint(c, at);
  if (!g) return;
  const u = camUnit(c, at), X = (x: number) => g[0] + (x - at[0]) * u, Y = (y: number) => g[1] - y * u;
  const draw = (q: Painter) => {
    // two cast-iron end frames (legs + arm) and three back slats
    for (const x of [b.x0 + 0.08, b.x1 - 0.08]) hardFill(q, 32800 + (x > 0 ? 1 : 0), IRON, [[X(x - 0.045), Y(0)], [X(x + 0.045), Y(0)], [X(x + 0.035), Y(b.back)], [X(x - 0.035), Y(b.back)]]);
    [0.42, 0.6, 0.78].forEach((f, k) => {
      const y0 = b.seat + (b.back - b.seat) * (f - 0.1), y1 = b.seat + (b.back - b.seat) * (f + 0.07);
      const pts: Pt[] = [[X(b.x0), Y(y0)], [X(b.x1), Y(y0)], [X(b.x1), Y(y1)], [X(b.x0), Y(y1)]];
      hardFill(q, 32810 + k, k === 2 ? SLAT_LIT : SLAT, pts);
      inkLine(q, 32820 + k, pts, {color: SLAT_DARK, weight: 0.7, still: true, curve: 0});
    });
  };
  paperCard(p, c, {foot: at, light: LAMP, seed: 32850, edge: 6, tab: false}, draw);
};
/** Seat ledge (horizontal panel) and front apron with the legs printed on it. Returns the seat front edge in picture px (a shadow clip line). */
export const paintBenchSeat = (p: Painter, c: YCam, b: Bench): ((pts: Pt[]) => Pt[]) => {
  const top = wFill(p, c, 32900, SLAT_LIT, qy(b.seat, b.x0, b.x1, b.zb, b.zf));
  for (let k = 1; k < 3; k++) wInk(p, c, 32901 + k, [[b.x0, b.seat + 0.001, b.zb + (k / 3) * (b.zf - b.zb)], [b.x1, b.seat + 0.001, b.zb + (k / 3) * (b.zf - b.zb)]], {color: SLAT_DARK, weight: 0.6, closed: false});
  wInk(p, c, 32905, qy(b.seat, b.x0, b.x1, b.zb, b.zf), {color: '#efe4cc', weight: 0.9});
  const apron = qz(b.zf, b.x0, b.x1, b.seat - 0.09, b.seat);
  wFill(p, c, 32910, SLAT, apron);
  wInk(p, c, 32911, apron, {color: SLAT_DARK, weight: 0.7});
  // front legs: cut card strips with a cream cut edge, standing on the page
  for (const x of [b.x0 + 0.08, b.x1 - 0.08]) {
    wFill(p, c, 32920 + (x > 0 ? 1 : 0), '#f1e7d0', qz(b.zf, x - 0.07, x + 0.07, 0, b.seat - 0.09));
    wFill(p, c, 32922 + (x > 0 ? 1 : 0), IRON, qz(b.zf, x - 0.05, x + 0.05, 0, b.seat - 0.09));
  }
  const a = camPoint(c, [b.x0, b.seat, b.zf]), e = camPoint(c, [b.x1, b.seat, b.zf]);
  void top;
  if (!a || !e) return (pts) => pts;
  // keep the side of the seat front edge that the seat lies on (above it on screen)
  const n: Pt = [e[1] - a[1], a[0] - e[0]], cst = n[0] * a[0] + n[1] * a[1];
  const sgn = n[1] < 0 ? 1 : -1;
  return (pts) => clipHalf(pts, [sgn * n[0], sgn * n[1]], sgn * cst);
};
export {washAt};

/** Near dressing on the felt (brief Space D: pencils and paper clips, never on the stage): a red pencil lying from `a` to `b` (model m, real 7.5 mm x
 *  17.5 cm at 10:1). Third depth layer under the pop-up. */
export const paintNearDressing = (p: Painter, c: YCam, a: [number, number], b: [number, number]) => {
  const dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz), ux = dx / l, uz = dz / l, nx = -uz, nz = ux, r = 0.0375, y = 0.012;
  const at = (s: number, w: number, h: number): V3 => [a[0] + ux * s * l + nx * w, y + h, a[1] + uz * s * l + nz * w];
  // shadow, then side face, top face, ferrule + eraser at a, sharpened cone + graphite at b
  wWash(p, c, 33500, '#120c08', 90, [at(0, -r * 0.6, 0), at(0.92, -r * 0.6, 0), at(1, 0, 0), at(0.92, r * 2.4, 0), at(0, r * 2.4, 0)], 0.05, 0.1);
  wFill(p, c, 33501, '#8e2420', [at(0.06, r, 0), at(0.86, r, 0), at(0.86, r, 2 * r), at(0.06, r, 2 * r)]);
  wFill(p, c, 33502, POSTER.red, [at(0.06, -r, 2 * r), at(0.86, -r, 2 * r), at(0.86, r, 2 * r), at(0.06, r, 2 * r)]);
  wInk(p, c, 33503, [at(0.08, -r * 0.2, 2 * r + 0.001), at(0.84, -r * 0.2, 2 * r + 0.001)], {color: '#e8705c', weight: 0.9, closed: false});
  wFill(p, c, 33504, '#b9b2a2', [at(0.02, -r, 2 * r), at(0.06, -r, 2 * r), at(0.06, r, 2 * r), at(0.02, r, 2 * r)]);
  wFill(p, c, 33505, '#d98a8a', [at(0, -r, 1.6 * r), at(0.02, -r, 2 * r), at(0.02, r, 2 * r), at(0, r, 1.6 * r)]);
  wFill(p, c, 33506, '#e2c79a', [at(0.86, -r, 2 * r), at(0.97, 0, r), at(0.86, r, 2 * r), at(0.86, r, 0)]);
  wFill(p, c, 33507, '#2a2a2e', [at(0.95, -r * 0.25, 1.2 * r), at(1, 0, r), at(0.95, r * 0.25, 1.2 * r)]);
};
