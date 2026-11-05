import {drawFigure} from '../kit/cast';
import type {CastDef, FigAnchors, FigPose} from '../kit/cast';
import {ell, hardFill, inkLine, INK, solid, washAt} from '../kit/draw';
import {EXPRESSIONS, type ExpressionId} from '../kit/expressions';
import type {FaceState} from '../kit/head';
import {paintHalo} from '../kit/fog';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {poseFor, poseMix, type AnyPoseId} from '../kit/poses';
import type {V3} from '../kit/space';
import {camPoint, camUnit, viewAngle, type YCam} from '../kit/ycam';
import {BASKET_RED, CSH1, CSH2, CSH3, LANE, MAN, shopper, type LaneNo} from './cast';
import {paintBox, paintSorted, qx, qy, qz, sphereAt, wFill, wInk, wWash, type Item} from './world';

// SET-CHECKOUT (brief EDU-BRIEF-R1.1 set plan; look frames LF01, LF04). Named space CHECKOUT: metres, origin on the floor at the
// lane-2 paying point, +x right from the hero vantage, +y up, +z toward the tills; customers queue toward -z and face +z.
// Painted 3D camera: everything is drawn through a kit yaw camera (`YCam`). Look-defining set written for W3; Boss hardens it
// into shot plates at W5.2. Revisions of the brief's `est` numbers are marked "W3 v1" and listed in look-frames.md.

export const S = {
  wall: '#ece6d6', wallDusk: '#f0d9b8', ceil: '#f4f1e8', floor: '#e9dfc4', grout: '#d3c7a8', mint: '#8fd3b4', mintDark: '#6eb999',
  steel: '#c6ccd1', steelDark: '#8a949c', belt: '#2d3037', shelf: '#8c96a2', rack: '#d9d2c0', stanchion: '#5a6068',
  skyTop: '#f2c79a', skyLow: '#f8dfae', glass: '#a9c3c9',
} as const;

const laneX = (n: LaneNo) => (n - 2) * 2.2;
const hsh = (n: number) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const PRODUCT = ['#d9473a', '#f2c230', '#4f9a5c', '#4a78b8', '#e48a3a', '#f4f0e6', '#8a5a9a', '#2fa7a0'];

export type Who = {
  def: CastDef; at: V3; face?: ExpressionId; faceState?: FaceState; pose?: AnyPoseId; view?: 'front' | 'left' | 'right';
  basket?: boolean; trolley?: boolean; headCock?: number; scale?: number; look?: Pt; key: string;
  /** W5.2: world facing [x, z]; the view (front / quarter / profile / back) follows from the camera (`viewAngle`) and replaces `view`. */
  facing?: [number, number];
  /** W5.2: blend `pose` toward `mix.to` by `mix.u` (gestures that ease in and out). */
  mix?: {to: AnyPoseId; u: number};
  /** W5.2: FigPose overrides applied last (walk phase, lean, extra arm targets). */
  fig?: Partial<FigPose>;
  /** W5.2: props drawn after the figure from its anchors (`u` px per metre). */
  held?: (p: Painter, a: FigAnchors, u: number) => void;
};
export type Light = 'off' | 'green' | 'red';
export type CheckoutOpts = {
  t: number; shared?: boolean; who: Who[]; lights?: Partial<Record<LaneNo, Light>>;
  /** Anchors of the figure with this key are written to `out`. */
  out?: Record<string, FigAnchors>;
  /** Draw only the set (no people). */
  empty?: boolean;
  /** W5.2: extra depth-sorted items (pineapple on a belt, coins on a counter). */
  items?: Item[];
};

/** View of a figure at `at` facing the world direction `facing` from camera `c` (`viewAngle`: 0 toward the lens, +90 screen right, 180 away). */
export const viewOf = (c: YCam, at: V3, facing: [number, number]): Pick<FigPose, 'view' | 'quarter' | 'quarterDeg'> => {
  const a = viewAngle(c, at, facing), m = Math.abs(a);
  if (m <= 15) return {view: 'front'};
  if (m < 70) return {view: 'front', quarter: a > 0 ? 'right' : 'left', quarterDeg: Math.min(60, Math.max(15, m))};
  if (m <= 112) return {view: a > 0 ? 'right' : 'left'};
  return {view: 'back'};
};

// ---- Held basket (screen space: `hand` is the grip, `u` px per metre).
export const paintBasket = (p: Painter, hand: Pt, u: number, seed: number) => {
  const [x, y] = hand, w = 0.42 * u, bw = 0.34 * u, rim = y + 0.1 * u, h = 0.22 * u;
  // Contents first (they sit in the basket): noodle packets, egg carton, bananas.
  solid(p, seed + 1, '#e48a3a', [[x - w * 0.46, rim + h * 0.05], [x - w * 0.12, rim + h * 0.05], [x - w * 0.12, rim - h * 0.5], [x - w * 0.46, rim - h * 0.5]], 2);
  solid(p, seed + 2, '#f4f0e6', [[x - w * 0.08, rim + h * 0.05], [x + w * 0.3, rim + h * 0.05], [x + w * 0.3, rim - h * 0.36], [x - w * 0.08, rim - h * 0.36]], 2);
  inkLine(p, seed + 3, [[x + w * 0.1, rim - h * 0.2], [x + w * 0.34, rim - h * 0.55], [x + w * 0.5, rim - h * 0.5]], {closed: false, weight: 1.6, color: '#d9a62a'});
  const body: Pt[] = [[x - w / 2, rim], [x + w / 2, rim], [x + bw / 2, rim + h], [x - bw / 2, rim + h]];
  solid(p, seed + 4, BASKET_RED, body, 3, 0.05, 0.1);
  inkLine(p, seed + 5, body, {weight: 0.9, color: mixColor(BASKET_RED, INK, 0.6)});
  for (let i = 1; i < 5; i++) inkLine(p, seed + 6 + i, [[x - w / 2 + (w * i) / 5, rim + 2], [x - bw / 2 + (bw * i) / 5, rim + h - 2]], {closed: false, weight: 0.5, color: mixColor(BASKET_RED, INK, 0.45)});
  inkLine(p, seed + 12, [[x - w * 0.5, rim], [x - w * 0.34, y + 0.01 * u], [x, y], [x + w * 0.34, y + 0.01 * u], [x + w * 0.5, rim]], {closed: false, weight: 1.2, color: INK, curve: 0.3});
};

const whoItem = (w: Who, o: CheckoutOpts): Item => ({
  at: w.at,
  draw: (p, c) => {
    const g0 = camPoint(c, w.at), u0 = camUnit(c, w.at);
    if (!g0) return;
    const u = u0 * (w.scale ?? 1), g = g0, auto = w.facing ? viewOf(c, w.at, w.facing) : null, view = auto?.view ?? w.view ?? 'front';
    washAt(p, 5100 + w.key.length * 7, '#6b5b45', 70, ell(g[0], g[1], 0.3 * u, 0.07 * u, 14), 0.2, 0.3);
    const pv = view === 'back' ? 'front' : view;
    const pose = w.mix ? poseMix(w.pose ?? 'P01', w.mix.to, w.mix.u, w.def, g, u, pv) : poseFor(w.pose ?? 'P01', w.def, g, u, pv);
    const face = {...(w.faceState ?? EXPRESSIONS[w.face ?? 'neutral']), ...(w.look ? {look: w.look} : {})};
    if (w.trolley) paintTrolley(p, c, w.at);
    const a = drawFigure(p, w.def, g, u, {...pose, ...(auto ? {view: auto.view, quarter: auto.quarter, quarterDeg: auto.quarterDeg} : {}), face, headCock: w.headCock, ...w.fig}, o.t);
    if (o.out) o.out[w.key] = a;
    if (w.basket && view !== 'back') paintBasket(p, [a.rHand[0], a.rHand[1]], u, 5300 + w.key.length * 11);
    w.held?.(p, a, u);
  },
});

const paintTrolley = (p: Painter, c: YCam, at: V3) => {
  const b = {x0: at[0] - 0.3, x1: at[0] + 0.3, y0: 0.35, y1: 0.95, z0: at[2] + 0.3, z1: at[2] + 0.85};
  paintBox(p, c, 5600, b, S.steel, {top: -0.1, front: 0.05}, {ink: true});
  const q = qz(b.z1, b.x0, b.x1, 0.4, 0.9).map((v) => camPoint(c, v));
  if (q.every(Boolean)) for (let i = 1; i < 6; i++) { const x = b.x0 + ((b.x1 - b.x0) * i) / 6; const a = camPoint(c, [x, 0.4, b.z1]), z = camPoint(c, [x, 0.9, b.z1]); if (a && z) inkLine(p, 5610 + i, [a, z], {closed: false, weight: 0.4, color: S.steelDark}); }
  // groceries heaped on top
  const t = camPoint(c, [at[0], 1.0, at[2] + 0.55]);
  if (t) { const u = camUnit(c, at); solid(p, 5640, '#4f9a5c', ell(t[0] - 0.12 * u, t[1], 0.12 * u, 0.1 * u, 10), 2); solid(p, 5641, '#e48a3a', ell(t[0] + 0.1 * u, t[1] + 0.02 * u, 0.12 * u, 0.09 * u, 10), 2); }
};

// ---- Backdrop and architecture (not depth sorted).
const sky = (p: Painter, c: YCam) => {
  const bands: [number, number, string][] = [[2.9, 3.2, '#e9b88e'], [2.3, 2.9, '#f0c898'], [1.6, 2.3, '#f6d9a8'], [0.0, 1.6, '#f9e4bb']];
  bands.forEach(([y0, y1, col], i) => wFill(p, c, 6000 + i, col, qx(4.8, y0, y1, -10, 9)));
};
const paintShell = (p: Painter, c: YCam) => {
  hardFill(p, 5900, S.wall, [[-300, -300], [1380, -300], [1380, 2220], [-300, 2220]]);
  wFill(p, c, 5910, S.wall, qz(-10, -7, 7, 0, 3.2));
  const looksDown = (c.pitch ?? 0) < -Math.PI / 6; // a high-angle crane sees no ceiling (S01-B03-SH01)
  if (!looksDown) wFill(p, c, 5911, S.ceil, qy(3.2, -7, 7, -10, 9));
  wFill(p, c, 5912, S.wallDusk, qx(-7, 0, 3.2, -10, 9));
  wFill(p, c, 5913, S.floor, qy(0, -7, 7, -10, 9));
  sky(p, c);
  // glass front (right wall): mullions every 1.2 m, door frames, and a faint sheen veil
  for (let z = -9; z <= 8; z += 1.2) wFill(p, c, 6020 + z * 3, S.steelDark, qx(4.78, 0, 3.2, z - 0.03, z + 0.03));
  wFill(p, c, 6040, S.steelDark, qx(4.78, 2.8, 3.2, -10, 9));
  wFill(p, c, 6041, S.steelDark, qx(4.78, 0, 0.08, -10, 9));
  wWash(p, c, 6042, '#ffffff', 40, qx(4.78, 0.2, 2.7, -8.6, -4.4), 0.5, 0.6);
  // floor: 0.60 m tile grid, worn wheel tracks along the lanes
  for (let x = -6.6; x <= 6.6; x += 0.6) wInk(p, c, 6100 + x * 5, [[x, 0.002, -10], [x, 0.002, 9]], {closed: false, weight: 0.35, color: S.grout});
  for (let z = -10; z <= 9; z += 0.6) wInk(p, c, 6300 + z * 5, [[-7, 0.002, z], [7, 0.002, z]], {closed: false, weight: 0.35, color: S.grout});
  ([1, 2, 3] as LaneNo[]).forEach((n) => {
    const x = laneX(n);
    wFill(p, c, 6500 + n, LANE[n], qy(0.004, x - 0.55, x - 0.3, -5.5, 1.5));
    wWash(p, c, 6510 + n, '#b8aa88', 28, qy(0.003, x - 0.08, x + 0.08, -4.4, 0.4), 0.1, 0.8);
  });
  // ceiling tube rows (flat fluorescent), every 1.5 m along z
  if (!looksDown) for (let z = -9; z <= 8; z += 1.5) for (const x of [-3.5, 0, 3.5]) wFill(p, c, 6600 + z * 9 + x, '#fbfdff', qy(3.18, x - 1.0, x + 1.0, z - 0.06, z + 0.06));
  // hanging sale flags (shapes only): a string across the shop at z -5.0, y 2.6
  for (let x = -4.4; x < 4.4; x += 0.44) {
    const col = hsh(x * 9) > 0.5 ? '#d9473a' : '#f2c230';
    wFill(p, c, 6700 + x * 11, col, [[x, 2.6, -5], [x + 0.36, 2.6, -5], [x + 0.18, 2.28, -5]]);
  }
  wInk(p, c, 6790, [[-4.6, 2.62, -5], [4.6, 2.62, -5]], {closed: false, weight: 0.5, color: S.steelDark});
};

// ---- Items
const shelfItem = (x0: number, x1: number, key: number): Item => ({
  at: [(x0 + x1) / 2, 0, -6.0],
  draw: (p, c) => {
    const b = {x0, x1, y0: 0, y1: 1.8, z0: -9, z1: -6};
    paintBox(p, c, 7000 + key * 40, b, S.shelf, {front: 0.0, top: -0.15}, {ink: true});
    // three shelf levels of coloured product packs on the front face (z -6)
    for (let lv = 0; lv < 3; lv++) {
      const y = 0.18 + lv * 0.55;
      wFill(p, c, 7010 + key * 40 + lv, S.steelDark, qz(-5.99, x0, x1, y - 0.02, y + 0.02));
      for (let x = x0 + 0.05; x < x1 - 0.2; x += 0.22) {
        const col = PRODUCT[Math.floor(hsh(x * 7 + lv * 3 + key) * PRODUCT.length)], hgt = 0.22 + hsh(x + lv) * 0.2;
        wFill(p, c, 7100 + key * 400 + lv * 100 + Math.round(x * 20), col, qz(-5.985, x, x + 0.17, y + 0.02, y + 0.02 + hgt));
      }
    }
  },
});

const counterItem = (n: LaneNo, light: Light, o: CheckoutOpts): Item => {
  const lx = laneX(n);
  return {
    at: [lx + 0.85, 0, -1.05],
    draw: (p, c) => {
      const body = {x0: lx + 0.55, x1: lx + 1.15, y0: 0, y1: 0.85, z0: -2.4, z1: 0.3};
      paintBox(p, c, 7500 + n * 60, body, S.mint, {front: 0.02, left: 0.14, top: -0.1}, {ink: true, grain: 40});
      paintBox(p, c, 7510 + n * 60, {...body, y0: 0.85, y1: 0.88}, S.steel, {top: -0.15}, {ink: true});
      // belt with grey divider bars
      paintBox(p, c, 7520 + n * 60, {x0: lx + 0.6, x1: lx + 1.1, y0: 0.88, y1: 0.9, z0: -2.4, z1: -0.6}, S.belt, {top: -0.05});
      for (let z = -2.2; z < -0.7; z += 0.45) wFill(p, c, 7530 + n * 60 + Math.round(z * 10), '#9aa1a8', qy(0.905, lx + 0.6, lx + 1.1, z, z + 0.04));
      // register with a blank green display facing the lane, card terminal on a pole
      paintBox(p, c, 7540 + n * 60, {x0: lx + 0.62, x1: lx + 1.07, y0: 0.88, y1: 1.2, z0: -0.32, z1: 0.0}, '#3a3f47', {left: 0.2}, {ink: true});
      wFill(p, c, 7545 + n * 60, '#8fe0b0', qx(lx + 0.618, 0.95, 1.15, -0.28, -0.04));
      // scanner glass
      wFill(p, c, 7548 + n * 60, '#aee0f0', qy(0.91, lx + 0.7, lx + 1.0, -0.6, -0.4));
      // till light: pole + lamp (lane colour, numeral = n bars); flashes red / green
      paintBox(p, c, 7550 + n * 60, {x0: lx + 1.08, x1: lx + 1.14, y0: 0, y1: 2.0, z0: 0.22, z1: 0.28}, S.steelDark, {}, {ink: true});
      const lamp = sphereAt(c, [lx + 1.1, 2.1, 0.25], 0.14);
      if (lamp) {
        const col = light === 'green' ? '#58e08a' : light === 'red' ? '#ff4a3a' : LANE[n];
        if (light !== 'off') paintHalo(p, {x: lamp.x, y: lamp.y, r: lamp.r * 3.2, color: col, level: 0.6, seed: 7560 + n * 10, t: o.t});
        hardFill(p, 7570 + n * 60, col, ell(lamp.x, lamp.y, lamp.r, lamp.r, 16));
        inkLine(p, 7571 + n * 60, ell(lamp.x, lamp.y, lamp.r, lamp.r, 16), {weight: 0.8, color: INK});
      }
      // hanging lane sign over the counter: lane colour board, n white bars (numeral)
      const sy0 = 2.55, sy1 = 3.05;
      paintBox(p, c, 7580 + n * 60, {x0: lx + 0.4, x1: lx + 1.3, y0: sy0, y1: sy1, z0: -1.4, z1: -1.34}, LANE[n], {front: 0, top: -0.1}, {ink: true});
      for (let i = 0; i < n; i++) wFill(p, c, 7590 + n * 60 + i, '#fffaf0', qz(-1.338, lx + 0.65 + i * 0.2 - ((n - 1) * 0.1), lx + 0.65 + i * 0.2 - ((n - 1) * 0.1) + 0.1, sy0 + 0.1, sy1 - 0.1));
      // till status repeated under the sign (the pole lamp sits behind a close camera): lit lane = green / red disc
      const sl = light === 'off' ? null : sphereAt(c, [lx + 0.85, sy0 - 0.2, -1.37], 0.15);
      if (sl) {
        const col = light === 'green' ? '#58e08a' : '#ff4a3a';
        paintHalo(p, {x: sl.x, y: sl.y, r: sl.r * 2.8, color: col, level: 0.5, seed: 7597 + n * 10, t: o.t});
        hardFill(p, 7598 + n * 60, col, ell(sl.x, sl.y, sl.r, sl.r, 16));
        inkLine(p, 7599 + n * 60, ell(sl.x, sl.y, sl.r, sl.r, 16), {weight: 0.8, color: INK});
      }
      wInk(p, c, 7595 + n * 60, [[lx + 0.75, sy1, -1.37], [lx + 0.75, 3.2, -1.37]], {closed: false, weight: 0.6, color: S.steelDark});
      wInk(p, c, 7596 + n * 60, [[lx + 0.95, sy1, -1.37], [lx + 0.95, 3.2, -1.37]], {closed: false, weight: 0.6, color: S.steelDark});
    },
  };
};

const rackItem = (n: LaneNo): Item => {
  const lx = laneX(n);
  return {
    at: [lx - 0.65, 0, -1.6],
    draw: (p, c) => {
      paintBox(p, c, 7800 + n * 40, {x0: lx - 0.85, x1: lx - 0.45, y0: 0, y1: 1.2, z0: -1.8, z1: -1.5}, S.rack, {front: 0.02}, {ink: true});
      for (let lv = 0; lv < 4; lv++) for (let i = 0; i < 4; i++) {
        const col = PRODUCT[Math.floor(hsh(n * 13 + lv * 5 + i) * PRODUCT.length)], x = lx - 0.83 + i * 0.095, y = 0.15 + lv * 0.27;
        wFill(p, c, 7810 + n * 40 + lv * 6 + i, col, qz(-1.495, x, x + 0.075, y, y + 0.17));
      }
    },
  };
};

const basketStack: Item = {
  at: [-3.4, 0, -4.8],
  draw: (p, c) => {
    for (let i = 0; i < 4; i++) paintBox(p, c, 7900 + i * 5, {x0: -3.62, x1: -3.18, y0: i * 0.15, y1: i * 0.15 + 0.16, z0: -5.02, z1: -4.58}, BASKET_RED, {top: -0.08, front: 0.0}, {ink: true});
    for (let k = 0; k < 3; k++) paintBox(p, c, 7930 + k * 5, {x0: -3.95 + k * 0.4, x1: -3.55 + k * 0.4, y0: 0.15, y1: 1.0, z0: -6.4, z1: -5.75}, S.steel, {front: 0.05}, {ink: true});
  },
};

// ---- Refit (B06): belt stanchions in one serpentine (set plan, W3 v1 layout: rows at z -2.6, -3.55, -4.65, -5.75).
type Run = {z: number; x0: number; x1: number; gap?: [number, number]};
const ROWS: Run[] = [
  {z: -2.6, x0: -3.0, x1: 3.0, gap: [-0.45, 0.45]},
  {z: -3.55, x0: -1.9, x1: 3.0},
  {z: -4.65, x0: -3.0, x1: 1.9},
  {z: -5.75, x0: -3.0, x1: 3.0, gap: [-1.5, -0.5]},
];
const post = (p: Painter, c: YCam, seed: number, x: number, z: number) => {
  const g = camPoint(c, [x, 0, z]), u = camUnit(c, [x, 0, z]);
  if (!g) return;
  hardFill(p, seed, S.stanchion, ell(g[0], g[1], 0.15 * u, 0.15 * u * 0.32, 14));
  paintBox(p, c, seed + 1, {x0: x - 0.025, x1: x + 0.025, y0: 0.02, y1: 0.95, z0: z - 0.025, z1: z + 0.025}, S.stanchion, {}, {});
  const t = camPoint(c, [x, 0.97, z]);
  if (t) hardFill(p, seed + 2, '#2a2e33', ell(t[0], t[1], 0.045 * u, 0.045 * u, 8));
};
const beltBetween = (p: Painter, c: YCam, seed: number, a: V3, b: V3) => {
  const q = [[a[0], 0.84, a[2]], [b[0], 0.84, b[2]], [b[0], 0.9, b[2]], [a[0], 0.9, a[2]]] as V3[];
  wFill(p, c, seed, S.stanchion, q);
};
const stanchionItems = (): Item[] => {
  const items: Item[] = [];
  const mk = (id: number, x0: number, z0: number, x1: number, z1: number) => {
    const n = Math.max(1, Math.round(Math.hypot(x1 - x0, z1 - z0) / 0.9));
    for (let i = 0; i <= n; i++) {
      const x = x0 + ((x1 - x0) * i) / n, z = z0 + ((z1 - z0) * i) / n;
      items.push({at: [x, 0, z], draw: (p, c) => post(p, c, 8000 + id * 20 + i * 3, x, z)});
      if (i < n) {
        const xb = x0 + ((x1 - x0) * (i + 1)) / n, zb = z0 + ((z1 - z0) * (i + 1)) / n;
        items.push({at: [(x + xb) / 2, 0, (z + zb) / 2], bias: 0.05, draw: (p, c) => beltBetween(p, c, 8000 + id * 20 + i * 3 + 1, [x, 0, z], [xb, 0, zb])});
      }
    }
  };
  ROWS.forEach((r, i) => {
    if (r.gap) { mk(i * 2, r.x0, r.z, r.gap[0], r.z); mk(i * 2 + 1, r.gap[1], r.z, r.x1, r.z); } else mk(i * 2, r.x0, r.z, r.x1, r.z);
  });
  mk(20, -3.0, -2.6, -3.0, -4.65);
  mk(21, 3.0, -3.55, 3.0, -5.75);
  return items;
};

/** Paints one person of a cast list through the camera (for frames that draw the set and the cast apart). */
export const paintWho = (p: Painter, c: YCam, w: Who, o: CheckoutOpts) => whoItem(w, o).draw(p, c);

export const paintCheckout = (p: Painter, c: YCam, o: CheckoutOpts): void => {
  paintShell(p, c);
  const L = o.lights ?? {};
  const items: Item[] = [shelfItem(-5.4, -1.3, 0), shelfItem(-0.9, 0.9, 1), shelfItem(1.3, 5.4, 2), basketStack];
  ([1, 2, 3] as LaneNo[]).forEach((n) => items.push(counterItem(n, L[n] ?? 'off', o), rackItem(n)));
  if (o.shared) items.push(...stanchionItems());
  if (!o.empty) o.who.forEach((w) => items.push(whoItem(w, o)));
  if (o.items) items.push(...o.items);
  paintSorted(p, c, items);
};

// ---- Cast blocking (brief set plan, "Cast blocking"). Lane slots: S1 z -0.40 ... S5 z -4.00, pitch 0.90.
export const slot = (lane: LaneNo, s: number): V3 => [laneX(lane), 0, -0.4 - 0.9 * (s - 1)];
const CASHIER = (lane: LaneNo): V3 => [laneX(lane) + 1.65, 0, -0.2];

/** The store at B01 (L01): 9 customers, three cashiers. `man` overrides MAN's face / pose. */
export const b01Cast = (man: Partial<Who> = {}): Who[] => [
  {key: 'csh1', def: CSH1, at: CASHIER(1), view: 'left', face: 'happy'},
  {key: 'csh2', def: CSH2, at: CASHIER(2), view: 'left', face: 'neutral'},
  {key: 'csh3', def: CSH3, at: CASHIER(3), view: 'left', face: 'neutral'},
  {key: 'buzz', def: shopper('man-buzz'), at: slot(1, 1), face: 'neutral'},
  {key: 'pixie', def: shopper('woman-pixie'), at: slot(1, 2), face: 'neutral', basket: false},
  {key: 'girl', def: shopper('girl-school'), at: [laneX(1) - 0.3, 0, slot(1, 3)[2]], face: 'happy'},
  {key: 'shaved', def: shopper('man-shaved'), at: slot(2, 5), face: 'neutral', trolley: true},
  {key: 'curly', def: shopper('woman-curly'), at: slot(3, 3), face: 'neutral', basket: true},
  {key: 'man', def: MAN, at: slot(2, 2), face: 'suspicious', basket: true, ...man},
  {key: 'elder', def: shopper('man-elder'), at: slot(2, 3), face: 'neutral'},
  {key: 'welder', def: shopper('woman-elder'), at: slot(3, 1), face: 'neutral'},
  {key: 'spiky', def: shopper('man-spiky'), at: slot(3, 2), face: 'neutral'},
];

/** The refit (B06 L17): MAN at the queue head, eyes shut and a small smile (`new: content`), 8 others behind him. */
export const CONTENT: FaceState = {brow: 'flat', eyes: 'shut', look: [0, 0], mouth: 'smile'};
export const b06Cast = (): Who[] => [
  {key: 'csh1', def: CSH1, at: CASHIER(1), view: 'left', face: 'neutral'},
  {key: 'csh2', def: CSH2, at: CASHIER(2), view: 'left', face: 'happy'},
  {key: 'csh3', def: CSH3, at: CASHIER(3), view: 'left', face: 'neutral'},
  {key: 'man', def: MAN, at: [0, 0, -3.05], faceState: CONTENT, pose: 'P01', basket: true},
  {key: 'long', def: shopper('woman-long'), at: [-0.95, 0, -3.05], view: 'right', face: 'neutral'},
  {key: 'pixie', def: shopper('woman-pixie'), at: [-1.85, 0, -3.05], view: 'right', face: 'neutral'},
  {key: 'girl', def: shopper('girl-school'), at: [-2.45, 0, -4.1], view: 'left', face: 'happy'},
  {key: 'shaved', def: shopper('man-shaved'), at: [-1.5, 0, -4.1], view: 'left', face: 'neutral'},
  {key: 'curly', def: shopper('woman-curly'), at: [-0.6, 0, -4.1], view: 'left', face: 'neutral'},
  {key: 'elder', def: shopper('man-elder'), at: [0.3, 0, -4.1], view: 'left', face: 'neutral'},
  {key: 'buzz', def: shopper('man-buzz'), at: [1.4, 0, -5.2], view: 'right', face: 'neutral'},
  {key: 'welder', def: shopper('woman-elder'), at: [2.3, 0, -5.2], view: 'right', face: 'neutral'},
];
