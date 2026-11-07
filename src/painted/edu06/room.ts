import {ANIMALS, drawAnimal, type AnimalPose} from '../kit/animals';
import {chairSpec} from '../kit/props';
import {blob, ell, hardFill, inkLine, INK, washAt} from '../kit/draw';
import {paintHalo} from '../kit/fog';
import {skyBandColors} from '../kit/sky';
import {hash} from '../kit/hash';
import {mixColor, tintPainter, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {flatCircle, paintBox, qx, qy, qz, wFill, wInk, wp, wWash, type Box} from '../edu02/world';
import {camDist} from '../kit/ycam';
import {OWN} from './cast';

// SET-LIVINGROOM (brief EDU-EP06-BRIEF-R1.2 N1; Boss W5.2, built from Film's look-frame room of W3). Metres: origin on the floor at the
// centre of the sofa's front edge; +x right (seen from the room), +y up, +z out from the sofa into the room; the back wall is -z.
// Two light states, same geometry: 'night' (lamp key, city glow in the window) and 'day' (B04-SH04 cutaway: lamp off, overcast daylight from
// the window). Heights follow the 4-head rig's seated seat (user, 2026-11-07): loveseat and armchair seat 0.30 m, arm top 0.48 m, back top 0.72
// (loveseat) / 0.68 (armchair). `LR` names the anchors the scene sheets use. Screen-space light for each state is `RoomLight` (room-light.tsx).

export const R = {
  wallLit: '#e2c49a', wallShade: '#5a4c58', night: '#3a3f5c', floor: '#a8754e', floorDark: '#7a5236',
  sofa: '#4f6f6a', sofaShade: '#2f4648', throw: '#c99a3a', rug: '#b8674a', rugBorder: '#efe4cf',
  rattan: '#c8a26a', cushion: '#efe4cf', wood: '#8a5a3a', mug: '#a9b99a', key: '#ffcf8a', halo: '#ffe2b0',
  shade: '#f3dcb0', print: '#9cb3a6', printB: '#d98c6a', plant: '#5f7f4a',
} as const;

export const SEAT = chairSpec(OWN, 'front').seatV;
const ARM = SEAT + 0.18, BACK = SEAT + 0.42;
export type RoomLightState = 'night' | 'day';
let LIGHT: RoomLightState = 'night'; // set at the top of paintRoom (painting is synchronous, so this is safe)
const day = () => LIGHT === 'day';
/** Named anchors and sizes of SET-LIVINGROOM (m). Scenes read these; they never copy the numbers. */
export const LR = {
  seat: SEAT, arm: ARM, loveseatBack: BACK, armchairBack: 0.68,
  armchairSeat: [1.05, SEAT, 0.45] as V3, armLanding: [0.72, ARM, -0.05] as V3, armEnd: [0.72, ARM, -0.4] as V3, rightCushion: [0.4, SEAT, -0.4] as V3,
  catStart: [0.45, SEAT, -0.42] as V3, ownSeatHips: [-0.15, 0.35, -0.4] as V3, ownFeet: [-0.15, 0, 0.05] as V3,
  visitorHand: [0.0, 0.15, 1.3] as V3, dayCat: [0.38, 0, 1.32] as V3, window: {x0: 0.9, x1: 1.9, y0: 0.9, y1: 2.2},
  /** The cat's step-up from the armchair seat onto the sofa arm (BC1): rise = arm - armchair seat; across = horizontal distance from the seat's rim to the landing point. */
  hop: {rise: ARM - SEAT, across: Math.round((Math.hypot(0.72 - 1.05, -0.05 - 0.45) - 0.275) * 100) / 100},
  targets: {OWN: [-0.15, 1.12, -0.38] as V3, CATSOFA: [0.45, 0.6, -0.4] as V3, PAIR: [0.15, 0.95, -0.4] as V3, ARM: [1.05, 0.58, 0.45] as V3, GAP: [0.45, 0.9, 0.05] as V3, HAND: [0.2, 0.5, -0.25] as V3, KNEE: [0.05, 0.4, -0.02] as V3},
} as const;
export const LAMP: V3 = [-1.05, 1.45, -0.55];


const walls = (p: Painter, c: YCam) => {
  // back wall in four vertical strips, warm by the lamp to cool shadow at the right
  // one wall fill in the night shade, then the lamp's warmth stacked in soft washes around it (no strip seams)
  const wallC = day() ? '#d8d4cd' : mixColor(R.wallLit, R.wallShade, 0.72), sideC = day() ? '#c3c3c4' : mixColor(R.wallLit, R.wallShade, 0.55);
  wFill(p, c, 7000, wallC, qz(-1.0, -1.8, 2.2, 0, 3.2));
  wFill(p, c, 7010, sideC, qx(-1.8, 0, 3.2, -1.0, 2.6)); // left side wall
  // painted surface marks (UT12): soft stains and roller streaks, a skirting board
  for (let i = 0; i < 14; i++) {
    const x = -1.7 + 3.8 * hash(i * 3.3), y = 0.3 + 2.1 * hash(i * 5.1), w = 0.15 + 0.3 * hash(i * 7.7);
    wWash(p, c, 7020 + i, day() ? mixColor('#b9b4ae', '#a39b96', hash(i * 9.1)) : mixColor(R.wallShade, '#5a4a4a', hash(i * 9.1)), day() ? 20 : 26, [[x, y, -0.995], [x + w, y + 0.03, -0.995], [x + w * 0.9, y - 0.25, -0.995], [x + 0.05, y - 0.22, -0.995]], 0.5, 0.6);
  }
  wFill(p, c, 7040, mixColor(R.wood, '#000000', 0.15), qz(-0.995, -1.8, 2.2, 0, 0.08));
  if (day()) { // window light: a soft pale pool on the wall around the window and a cooler fall-off to the left
    wWash(p, c, 7050, '#f6fafc', 90, qz(-0.99, 0.5, 2.2, 0.5, 2.6), 0.6, 0.4);
    return;
  }
  // lamp pool on the wall: warm, soft, centred above the shade
  const q = camPoint(c, [LAMP[0] + 0.1, LAMP[1] + 0.2, -0.99]);
  if (q) {
    const u = camUnit(c, [LAMP[0], LAMP[1], -0.99]);
    washAt(p, 7050, R.key, 55, blob(7050, q[0], q[1], 1.1 * u, 1.3 * u, 0), 0.7, 0.4);
    washAt(p, 7051, R.key, 50, blob(7051, q[0], q[1] - 0.1 * u, 0.55 * u, 0.75 * u, 0), 0.6, 0.4);
  }
};

const windowPlate = (p: Painter, c: YCam) => {
  const {x0, x1, y0, y1} = LR.window, z = -0.99;
  paintBox(p, c, 7030, {x0: x0 - 0.05, x1: x1 + 0.05, y0: y0 - 0.05, y1: y1 + 0.05, z0: z - 0.01, z1: z + 0.01}, '#e9e2d4', {}, {ink: true}); // frame
  // glass: banded sky, then the skyline (night: dark towers with a few warm windows; day: pale towers and soft trees)
  const cols = skyBandColors({from: day() ? '#cdd9e2' : '#141a33', to: day() ? '#e8eef2' : '#3c3f6c', bands: 6});
  cols.forEach((col, i) => wFill(p, c, 7031 + i, col, qz(z + 0.012, x0, x1, y1 - ((y1 - y0) * (i + 1)) / cols.length, y1 - ((y1 - y0) * i) / cols.length + 0.002)));
  const towers: [number, number, number][] = [[0.0, 0.18, 0.55], [0.2, 0.2, 0.8], [0.43, 0.15, 0.45], [0.6, 0.22, 0.95], [0.84, 0.16, 0.6]];
  towers.forEach(([dx, w, h], i) => {
    const tx0 = x0 + dx * (x1 - x0) * 0.98, tx1 = Math.min(x1, tx0 + w * (x1 - x0)), ty1 = y0 + h * 0.5;
    wFill(p, c, 7040 + i, day() ? mixColor('#b9c6d0', '#e4ebef', 0.2 * i) : mixColor('#1c2038', '#2c3052', 0.15 * i), qz(z + 0.014, tx0, tx1, y0, ty1));
    if (!day()) for (let k = 0; k < 5; k++) { const wx = tx0 + (tx1 - tx0) * (0.2 + 0.6 * hash(i * 7 + k)), wy = y0 + (ty1 - y0) * (0.1 + 0.8 * hash(i * 11 + k * 3)); if (hash(i * 5 + k * 2) > 0.45) wFill(p, c, 7050 + i * 8 + k, '#f2c880', qz(z + 0.016, wx, wx + 0.025, wy, wy + 0.03)); }
  });
  if (day()) [[0.1, 0.1], [0.55, 0.06], [0.75, 0.09]].forEach(([dx, r], i) => wWash(p, c, 7090 + i, '#8fa896', 150, qz(z + 0.016, x0 + dx * (x1 - x0), x0 + dx * (x1 - x0) + r * 3, y0, y0 + r * 4), 0.4, 0.5));
  wFill(p, c, 7092, '#e9e2d4', qz(z + 0.02, (x0 + x1) / 2 - 0.012, (x0 + x1) / 2 + 0.012, y0, y1)); // mullions
  wFill(p, c, 7093, '#e9e2d4', qz(z + 0.02, x0, x1, (y0 + y1) / 2 - 0.012, (y0 + y1) / 2 + 0.012));
  paintBox(p, c, 7094, {x0: x0 - 0.07, x1: x1 + 0.07, y0: y0 - 0.08, y1: y0 - 0.05, z0: z - 0.01, z1: z + 0.1}, '#e9e2d4', {}, {ink: true}); // sill
  // sheer curtain at its left edge, and the rod
  wWash(p, c, 7095, '#f3ead8', day() ? 150 : 110, qz(z + 0.05, x0 - 0.16, x0 + 0.22, y0 - 0.12, y1 + 0.18), 0.4, 0.5);
  wWash(p, c, 7096, '#fff7e6', 90, qz(z + 0.055, x0 - 0.08, x0 + 0.08, y0 - 0.1, y1 + 0.15), 0.4, 0.5);
  wInk(p, c, 7097, [[x0 - 0.22, y1 + 0.2, z + 0.05], [x0 + 0.3, y1 + 0.2, z + 0.05]], {closed: false, weight: 1.6, color: '#4a3a2c'});
};

const wallThings = (p: Painter, c: YCam) => {
  // framed abstract print above the sofa (no text): mat, two soft colour fields, thin frame
  const P = {x0: -0.3, x1: 0.3, y0: 1.33, y1: 1.78, z: -0.985};
  wFill(p, c, 7100, '#3a2e28', qz(P.z, P.x0 - 0.025, P.x1 + 0.025, P.y0 - 0.025, P.y1 + 0.025));
  wFill(p, c, 7101, '#efe6d6', qz(P.z + 0.002, P.x0, P.x1, P.y0, P.y1));
  wWash(p, c, 7102, R.print, 170, qz(P.z + 0.004, P.x0 + 0.06, P.x1 - 0.18, P.y0 + 0.07, P.y1 - 0.12), 0.3, 0.4);
  wWash(p, c, 7103, R.printB, 160, qz(P.z + 0.005, P.x0 + 0.2, P.x1 - 0.06, P.y0 + 0.14, P.y1 - 0.06), 0.3, 0.4);
  // wall clock: plain face, hour ticks only, hands at about 9 pm
  const C: V3 = [-0.6, 1.95, -0.985], cr = 0.15, ring = (r: number, z = C[2]) => Array.from({length: 24}, (_, i): V3 => [C[0] + r * Math.cos((i / 24) * 6.283), C[1] + r * Math.sin((i / 24) * 6.283), z]);
  const rim = wp(c, ring(cr)), face = wp(c, ring(cr * 0.86, C[2] + 0.004));
  if (rim.length > 2) hardFill(p, 7110, '#5a4636', rim);
  if (face.length > 2) hardFill(p, 7111, '#f1e9da', face);
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * 6.283;
    wInk(p, c, 7120 + k, [[C[0] + cr * 0.72 * Math.cos(a), C[1] + cr * 0.72 * Math.sin(a), C[2] + 0.006], [C[0] + cr * 0.8 * Math.cos(a), C[1] + cr * 0.8 * Math.sin(a), C[2] + 0.006]], {closed: false, weight: 0.7, color: '#4a3a30'});
  }
  wInk(p, c, 7140, [[C[0], C[1], C[2] + 0.007], [C[0] - cr * 0.45, C[1], C[2] + 0.007]], {closed: false, weight: 1.6, color: '#2b211c'});
  wInk(p, c, 7141, [[C[0], C[1], C[2] + 0.007], [C[0], C[1] + cr * 0.65, C[2] + 0.007]], {closed: false, weight: 1.2, color: '#2b211c'});
  // floating shelf with books (spines only, no text) and a small trailing plant
  paintBox(p, c, 7150, {x0: -1.55, x1: -0.95, y0: 1.72, y1: 1.75, z0: -1.0, z1: -0.8}, R.wood, {}, {ink: true});
  const spines = ['#7a8f6a', '#c46a5a', '#e6d7b8', '#4f6f8a', '#b88a4a'];
  spines.forEach((col, i) => paintBox(p, c, 7160 + i * 8, {x0: -1.52 + i * 0.045, x1: -1.48 + i * 0.045, y0: 1.75, y1: 1.93 - 0.03 * hash(i * 3), z0: -0.98, z1: -0.84}, col, {}, {}));
  paintBox(p, c, 7210, {x0: -1.17, x1: -1.05, y0: 1.75, y1: 1.85, z0: -0.95, z1: -0.85}, '#d8c4a8', {}, {ink: true});
  for (let k = 0; k < 7; k++) {
    const x = -1.11 + 0.05 * (hash(k) - 0.5), z = -0.83;
    const vine: V3[] = Array.from({length: 6}, (_, i): V3 => [x + 0.02 * Math.sin(i + k), 1.85 - i * (0.04 + 0.02 * hash(k * 5)), z + 0.01 * i]);
    vine.forEach((v, i) => { const q = camPoint(c, v); if (q && i > 0) washAt(p, 7220 + k * 8 + i, mixColor(R.plant, '#2f4a22', hash(k + i)), 200, ell(q[0], q[1], 0.018 * camUnit(c, v), 0.012 * camUnit(c, v), 8, k + i), 0.1, 0.3); });
  }
};

const floor = (p: Painter, c: YCam) => {
  wFill(p, c, 7300, R.floor, qy(0, -1.8, 2.2, -1.0, 3.0));
  for (let k = 0; k < 26; k++) {
    const z = -1.0 + k * 0.155;
    wInk(p, c, 7310 + k, [[-1.8, 0.001, z], [2.2, 0.001, z]], {closed: false, weight: 0.5, color: mixColor(R.floor, R.floorDark, 0.7)});
  }
  for (let k = 0; k < 30; k++) { // board ends and wear
    const z = -1.0 + 0.155 * Math.floor(hash(k * 2.3) * 26), x = -1.8 + 4 * hash(k * 4.1);
    wInk(p, c, 7350 + k, [[x, 0.001, z], [x, 0.001, z + 0.155]], {closed: false, weight: 0.4, color: R.floorDark});
  }
  if (day()) wWash(p, c, 7390, '#f4f8fa', 70, qy(0.002, 0.2, 2.0, -1.0, 1.2), 0.5, 0.4); // the window's light on the boards
  else wWash(p, c, 7390, R.night, 60, qy(0.002, 0.4, 2.2, -1.0, 3.0), 0.4, 0.4); // cool night side
  // rug with a cream border
  wFill(p, c, 7400, R.rugBorder, qy(0.004, -0.9, 0.9, 0.0, 1.2));
  wFill(p, c, 7401, R.rug, qy(0.006, -0.82, 0.82, 0.08, 1.12));
  wWash(p, c, 7402, '#8a4a36', 50, qy(0.007, -0.82, 0.82, 0.08, 0.3), 0.3, 0.6);
  // floor plant in a pot at the left corner
  const pot: Box = {x0: -1.65, x1: -1.4, y0: 0, y1: 0.3, z0: -0.95, z1: -0.7};
  paintBox(p, c, 7420, pot, '#c9b8a0', {}, {ink: true});
  for (let k = 0; k < 9; k++) {
    const a = -1.2 + 2.4 * hash(k * 1.7), L = 0.35 + 0.35 * hash(k * 3.1);
    const base: V3 = [-1.525, 0.3, -0.825], tip: V3 = [base[0] + Math.sin(a) * L * 0.5, base[1] + L, base[2] + 0.12 * Math.cos(a)];
    const q0 = camPoint(c, base), q1 = camPoint(c, tip);
    if (q0 && q1) {
      const nx = -(q1[1] - q0[1]), ny = q1[0] - q0[0], l = Math.hypot(nx, ny) || 1, w = 0.035 * camUnit(c, tip);
      const leaf: Pt[] = [q0, [(q0[0] + q1[0]) / 2 + (nx / l) * w, (q0[1] + q1[1]) / 2 + (ny / l) * w], q1, [(q0[0] + q1[0]) / 2 - (nx / l) * w * 0.4, (q0[1] + q1[1]) / 2 - (ny / l) * w * 0.4]];
      washAt(p, 7430 + k, mixColor(R.plant, '#2f4a22', 0.5 * hash(k)), 220, leaf, 0.1, 0.3);
    }
  }
};

const lamp = (p: Painter, c: YCam, t: number) => {
  const [lx, ly, lz] = LAMP, off = day();
  flatCircle(c, [lx, 0.01, lz], 0.16).length > 2 && hardFill(p, 7500, '#3a302a', flatCircle(c, [lx, 0.01, lz], 0.16));
  wInk(p, c, 7501, [[lx, 0.02, lz], [lx, ly - 0.15, lz]], {closed: false, weight: 2.2, color: '#3a302a'});
  // drum shade: a cylinder seen from the camera, warm and glowing
  const n = 20, top = Array.from({length: n}, (_, i): V3 => [lx + 0.2 * Math.cos((i / n) * 6.283), ly + 0.15, lz + 0.2 * Math.sin((i / n) * 6.283)]);
  const bot = top.map(([x, , z]): V3 => [x, ly - 0.15, z]);
  const pts = [...wp(c, top), ...wp(c, bot)];
  const hullPts = pts.length > 3 ? hullOf(pts) : [];
  const q = camPoint(c, LAMP);
  if (q && !off) paintHalo(p, {x: q[0], y: q[1], r: 0.45 * camUnit(c, LAMP), color: R.halo, level: 0.3, t, seed: 7510});
  if (hullPts.length > 2) {
    hardFill(p, 7520, off ? mixColor(R.shade, '#9a8e7a', 0.35) : R.shade, hullPts);
    if (q && !off) washAt(p, 7521, '#fff6e2', 200, ell(q[0], q[1], 0.12 * camUnit(c, LAMP), 0.1 * camUnit(c, LAMP), 14), 0.4, 0.3);
    inkLine(p, 7522, hullPts, {weight: 0.8, color: mixColor(R.shade, INK, 0.5)});
  }
};

const hullOf = (pts: Pt[]): Pt[] => {
  const q = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], up: Pt[] = [];
  for (const v of q) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], v) <= 0) lo.pop(); lo.push(v); }
  for (const v of q.slice().reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], v) <= 0) up.pop(); up.push(v); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};

/** Soft box (cushion): a box with its visible faces, ink edges in the fabric's own dark. */
const soft = (p: Painter, c: YCam, seed: number, b: Box, color: string, lit = 0) =>
  paintBox(p, c, seed, b, mixColor(color, day() ? '#e6eef2' : R.key, day() ? lit * 0.5 : lit), {top: -0.08, front: 0.08, right: 0.25, left: 0.12}, {ink: true});

const sofaBack = (p: Painter, c: YCam) => {
  // opaque base before the glaze (DF-20261031-painted-opaque-cast): every sofa face is a crisp fill
  soft(p, c, 7600, {x0: -0.8, x1: 0.8, y0: 0.08, y1: BACK, z0: -0.85, z1: -0.68}, R.sofa, 0.06); // backrest
  soft(p, c, 7610, {x0: -0.65, x1: 0.0, y0: SEAT - 0.02, y1: BACK - 0.04, z0: -0.7, z1: -0.56}, R.sofa, 0.1); // back cushion L
  soft(p, c, 7620, {x0: 0.0, x1: 0.65, y0: SEAT - 0.02, y1: BACK - 0.04, z0: -0.7, z1: -0.56}, R.sofa, 0.02); // back cushion R
  soft(p, c, 7630, {x0: -0.8, x1: -0.65, y0: 0.08, y1: ARM, z0: -0.85, z1: 0}, R.sofa, 0.1); // left arm
  // mustard throw over the left arm
  wFill(p, c, 7640, R.throw, [[-0.82, ARM + 0.01, -0.6], [-0.63, ARM + 0.01, -0.62], [-0.62, ARM - 0.02, -0.18], [-0.82, ARM - 0.02, -0.22]]);
  wFill(p, c, 7641, mixColor(R.throw, '#6a4a1a', 0.25), [[-0.62, ARM + 0.01, -0.62], [-0.6, SEAT + 0.02, -0.58], [-0.6, SEAT + 0.02, -0.26], [-0.62, ARM - 0.02, -0.18]]);
  wInk(p, c, 7642, [[-0.82, ARM + 0.01, -0.6], [-0.63, ARM + 0.01, -0.62], [-0.62, ARM - 0.02, -0.18], [-0.82, ARM - 0.02, -0.22]], {color: mixColor(R.throw, INK, 0.5), weight: 0.7});
  soft(p, c, 7650, {x0: -0.65, x1: 0.0, y0: 0.08, y1: SEAT, z0: -0.6, z1: 0}, R.sofa, 0.08); // seat L
  soft(p, c, 7660, {x0: 0.0, x1: 0.65, y0: 0.08, y1: SEAT, z0: -0.6, z1: 0}, R.sofa, 0.0); // seat R
  // throw pillow, dusty-rose, leaning in the right back corner (behind the cat)
  paintBox(p, c, 7670, {x0: 0.38, x1: 0.62, y0: SEAT, y1: SEAT + 0.24, z0: -0.58, z1: -0.5}, '#c98b8b', {}, {ink: true});
  // feet (dark wood)
  for (const [x, z] of [[-0.76, -0.04], [0.76, -0.04], [-0.76, -0.8], [0.76, -0.8]] as const) paintBox(p, c, 7680 + Math.round(x * 10 + z * 3), {x0: x - 0.02, x1: x + 0.02, y0: 0, y1: 0.08, z0: z - 0.02, z1: z + 0.02}, '#3a2a20');
};

const sofaFront = (p: Painter, c: YCam) => soft(p, c, 7700, {x0: 0.65, x1: 0.8, y0: 0.08, y1: ARM, z0: -0.85, z1: 0}, R.sofa, -0.02); // right arm

const table = (p: Painter, c: YCam) => {
  const T: V3 = [0.05, 0.4, 0.85];
  for (const a of [0.5, 2.6, 4.7]) paintBox(p, c, 7820 + Math.round(a * 3), {x0: T[0] + 0.27 * Math.cos(a) - 0.015, x1: T[0] + 0.27 * Math.cos(a) + 0.015, y0: 0, y1: 0.4, z0: T[2] + 0.27 * Math.sin(a) - 0.015, z1: T[2] + 0.27 * Math.sin(a) + 0.015}, '#5a3a22');
  const top = flatCircle(c, T, 0.35, 28), under = flatCircle(c, [T[0], 0.37, T[2]], 0.35, 28);
  if (top.length > 2) { if (under.length > 2) hardFill(p, 7799, mixColor(R.wood, '#000000', 0.25), hullOf([...top, ...under])); hardFill(p, 7800, R.wood, top); inkLine(p, 7801, top, {weight: 0.8, color: mixColor(R.wood, INK, 0.5)}); }
  const mug: Box = {x0: -0.14, x1: -0.06, y0: 0.4, y1: 0.5, z0: 0.76, z1: 0.84};
  paintBox(p, c, 7810, mug, R.mug, {}, {ink: true});
  paintBox(p, c, 7811, {x0: 0.2, x1: 0.34, y0: 0.4, y1: 0.409, z0: 0.72, z1: 0.9}, '#2b2f36', {}, {ink: true}); // phone, face down
};

// Rattan armchair: round base, cream cushion, a curved back on the side away from the sofa and low arm rails (arm top 0.48), turned to face (-0.05, -0.40).
const AC: V3 = [1.05, SEAT, 0.45], AC_R = 0.275, AC_FACE = Math.atan2(-0.4 - AC[2], -0.05 - AC[0]);
const acRing = (r: number, y: number, a0: number, a1: number, n = 14): V3[] => Array.from({length: n + 1}, (_, i): V3 => { const a = a0 + ((a1 - a0) * i) / n; return [AC[0] + r * Math.cos(a), y, AC[2] + r * Math.sin(a)]; });
const armchair = (p: Painter, c: YCam) => {
  const back0 = AC_FACE + Math.PI - 1.15, back1 = AC_FACE + Math.PI + 1.15;
  const dark = mixColor(R.rattan, '#5a3a1a', 0.35), mid = mixColor(R.rattan, '#5a3a1a', 0.15);
  // curved back: a band from the seat to 0.68 (outer face), woven bands in ink
  const bandTop = wp(c, acRing(AC_R, 0.68, back0, back1)), bandBot = wp(c, acRing(AC_R, SEAT - 0.02, back0, back1));
  if (bandTop.length > 2 && bandBot.length > 2) hardFill(p, 7890, dark, hullOf([...bandTop, ...bandBot]));
  const inner = wp(c, [...acRing(AC_R - 0.02, 0.68, back0, back1), ...acRing(AC_R - 0.02, SEAT - 0.02, back0, back1).reverse()]);
  if (inner.length > 2) hardFill(p, 7891, mid, inner);
  for (let k = 1; k < 5; k++) { const y = SEAT + ((0.68 - SEAT) * k) / 5, run = wp(c, acRing(AC_R - 0.02, y, back0 + 0.1, back1 - 0.1)); if (run.length > 1) inkLine(p, 7892 + k, run, {weight: 0.6, color: dark, closed: false}); }
  // base and seat ring
  const seatR = flatCircle(c, AC, AC_R, 26), rimB = flatCircle(c, [AC[0], 0.14, AC[2]], AC_R - 0.03, 26);
  if (rimB.length > 2 && seatR.length > 2) hardFill(p, 7900, dark, hullOf([...seatR, ...rimB]));
  if (seatR.length > 2) {
    hardFill(p, 7901, R.rattan, seatR);
    for (let k = 0; k < 4; k++) { const run = flatCircle(c, [AC[0], SEAT - 0.04 - 0.05 * k, AC[2]], AC_R - 0.003, 26); if (run.length > 2) inkLine(p, 7905 + k, run, {weight: 0.5, color: dark, closed: false}); }
    hardFill(p, 7902, mixColor(R.cushion, day() ? '#e6eef2' : R.key, 0.05), flatCircle(c, [AC[0], SEAT + 0.04, AC[2]], AC_R - 0.04, 26));
    inkLine(p, 7903, flatCircle(c, [AC[0], SEAT + 0.04, AC[2]], AC_R - 0.04, 26), {weight: 0.7, color: mixColor(R.cushion, INK, 0.4)});
  }
  // arm rails (top 0.48): thin curved bands on each side of the back, running forward
  for (const sd of [-1, 1]) {
    const a0 = sd < 0 ? back0 - 0.9 : back1, a1 = sd < 0 ? back0 : back1 + 0.9, top = wp(c, [...acRing(AC_R, ARM, a0, a1, 8), ...acRing(AC_R - 0.045, ARM, a0, a1, 8).reverse()]);
    if (top.length > 2) { hardFill(p, 7910 + (sd > 0 ? 1 : 0), R.rattan, top); inkLine(p, 7912 + (sd > 0 ? 1 : 0), top, {weight: 0.6, color: dark}); }
  }
};

const post = (p: Painter, c: YCam) => { // scratching post, set dressing behind the armchair
  const P: V3 = [1.7, 0, -0.1];
  paintBox(p, c, 7950, {x0: P[0] - 0.19, x1: P[0] + 0.19, y0: 0, y1: 0.03, z0: P[2] - 0.19, z1: P[2] + 0.19}, '#b9a98e', {}, {ink: true});
  const b = flatCircle(c, [P[0], 0.03, P[2]], 0.15, 20), t = flatCircle(c, [P[0], 0.7, P[2]], 0.15, 20);
  if (b.length > 2 && t.length > 2) {
    hardFill(p, 7951, '#c7a875', hullOf([...b, ...t]));
    for (let k = 1; k < 10; k++) { const y = 0.03 + 0.067 * k, run = flatCircle(c, [P[0], y, P[2]], 0.15, 20); if (run.length > 2) inkLine(p, 7952 + k, run, {weight: 0.5, color: '#8a6e44', closed: false}); }
    hardFill(p, 7970, '#d8c9a8', t);
    inkLine(p, 7971, t, {weight: 0.6, color: '#8a6e44'});
  }
};

const toy = (p: Painter, c: YCam) => { // feather toy lying on the rug (never moves)
  const a: V3 = [0.45, 0.012, 1.2], b: V3 = [0.95, 0.012, 1.2];
  wInk(p, c, 7980, [a, b], {closed: false, weight: 1.4, color: '#6a4a30'});
  const q = camPoint(c, b), u = camUnit(c, b);
  if (q) [['#d98c6a', 0.0], ['#6a9cb0', 0.03], ['#e6d7b8', -0.03]].forEach(([col, dz], i) => washAt(p, 7981 + i, col as string, 230, ell(q[0] + 0.03 * u * (i - 1), q[1] - 0.012 * u, 0.045 * u, 0.012 * u, 10, (i - 1) * 0.5 + (dz as number)), 0.1, 0.3));
};

export type RoomLayer = 'sofa' | 'arm' | 'armchair' | 'floor';
export type CastItem = {at: V3; draw: (p: Painter, c: YCam) => void; /** Where it sits in the painter's order (default 'sofa'): between the sofa back and its right arm; 'arm' on the arm top, 'armchair' on the armchair seat, 'floor' in front of the table. */ layer?: RoomLayer};

/** The cat (`cat-orange-tabby`) on a surface: `at` is the paw plane on that surface (K8: `g` is the surface height; the contact shadow is kit `contact`). */
export const catItem = (at: V3, pose: AnimalPose, t: number, layer?: RoomLayer): CastItem => ({at, layer, draw: (p, c) => {
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return;
  drawAnimal(tintPainter(p, day() ? '#e6eef2' : '#ffcf8a', day() ? 0.04 : 0.06, {brush: true}), 8000, ANIMALS['cat-orange-tabby'], g, u, {contact: 1, ...pose}, t);
}});

/** Light state of the room and the cast painted between the sofa back and its front arm (cast = cat first, then the owner). */
export const paintRoom = (p: Painter, c: YCam, o: {t: number; cast: CastItem[]; fore?: boolean; light?: RoomLightState; /** false = the W3 look-frame room (LF01): no window, scratching post or feather toy. */ dressing?: boolean}) => {
  LIGHT = o.light ?? 'night';
  const layer = (l: RoomLayer) => o.cast.filter((it) => (it.layer ?? 'sofa') === l).sort((a, b) => camDist(c, b.at) - camDist(c, a.at)).forEach((it) => it.draw(p, c));
  hardFill(p, 6999, day() ? '#bfc2c4' : R.wallShade, [[-200, -200], [1300, -200], [1300, 2200], [-200, 2200]]);
  walls(p, c);
  if (o.dressing !== false) windowPlate(p, c);
  wallThings(p, c);
  floor(p, c);
  lamp(p, c, o.t);
  if (o.dressing !== false) post(p, c);
  sofaBack(p, c);
  layer('sofa');
  sofaFront(p, c);
  layer('arm');
  if (o.fore !== false) { armchair(p, c); layer('armchair'); table(p, c); if (o.dressing !== false) toy(p, c); }
  layer('floor');
  // the screen-space light of each state is RoomLight (room-light.tsx): a wash here showed its straight edge
};
export {qx, qy, qz};
