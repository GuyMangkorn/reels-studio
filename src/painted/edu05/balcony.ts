import {ell, hardFill, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {paintSkyBands, paintSkyDisc} from '../kit/sky';
import type {V3} from '../kit/space';
import {camPoint, type YCam} from '../kit/ycam';
import {bladeItem, type Blade} from './macro';
import {paintBox, paintSorted, qx, qy, qz, wFill, wInk, wWash, type Item} from './world';

// SET-BALCONY (brief EDU-BRIEF-R1.1 set plan; LF01, S01-B01-SH01). Metres: origin on the balcony floor at the rail's inner face under
// the planter's left end; +x right along the rail, +y up, +z into the balcony (toward the room); outside and the drop are -z.
// Tenth floor: the garden is 27 m below. Look-frame code (W3.1); Boss hardens it into the B01 plates and the `PLATES` entry.

export const B = {
  zenith: '#a9c4dc', horizon: '#f6d7a8', sun: '#fff1cf', hazeFar: '#c9d3dc', hazeNear: '#8fa6bf',
  rail: '#9aa3a8', railDark: '#6e777c', glass: '#cfe0e4', tile: '#d8cfc0', grout: '#c4b9a6', trough: '#e9e4da', soil: '#5a4433',
  wall: '#eadfcd', wallShade: '#cdbfa8', shadow: '#a89a8a', sunFloor: '#f3dcb4',
} as const;
const FLOOR_Y = -27.0;

const city = (p: Painter, c: YCam) => {
  // ground of the city below, graded from the near (cool, darker) to the horizon (pale haze)
  const g = [[-40, -400, '#c9d3dc'], [-120, -250, '#bac7d3'], [-250, -120, '#a9b9c9'], [-120, -60, '#9caec2']] as const;
  g.forEach(([z1, z0, col], i) => wFill(p, c, 6300 + i, col, [[-600, FLOOR_Y, z0], [600, FLOOR_Y, z0], [600, FLOOR_Y, z1], [-600, FLOOR_Y, z1]]));
  // a river glint
  wWash(p, c, 6310, '#e9e6d6', 200, [[-600, FLOOR_Y + 0.1, -330], [600, FLOOR_Y + 0.1, -300], [600, FLOOR_Y + 0.1, -285], [-600, FLOOR_Y + 0.1, -312]]);
  // towers: soft boxes in haze, far first, no text, no brand
  const towers: {x: number; z: number; w: number; h: number}[] = [];
  for (let i = 0; i < 26; i++) {
    const r = (k: number) => hash(i * 13 + k);
    towers.push({x: -260 + r(1) * 520, z: -110 - r(2) * 280, w: 14 + r(3) * 26, h: 40 + r(4) * 110});
  }
  towers.sort((a, b) => a.z - b.z).forEach((t, i) => {
    const far = Math.min(1, (-t.z - 110) / 280), col = mixColor('#93a7bc', B.hazeFar, 0.25 + far * 0.6);
    const lit = mixColor(col, '#f2dcc0', 0.35);
    const b = {x0: t.x - t.w / 2, x1: t.x + t.w / 2, y0: FLOOR_Y, y1: FLOOR_Y + t.h, z0: t.z - t.w / 2, z1: t.z + t.w / 2};
    wFill(p, c, 6400 + i * 3, col, qz(b.z1, b.x0, b.x1, b.y0, b.y1));
    wFill(p, c, 6401 + i * 3, lit, qx(b.x1, b.y0, b.y1, b.z0, b.z1)); // sun side (right)
    if (hash(i + 77) > 0.5) wFill(p, c, 6402 + i * 3, mixColor(col, '#ffffff', 0.18), qy(b.y1, b.x0, b.x1, b.z0, b.z1));
  });
  // morning haze band over the city
  const h = camPoint(c, [0, c.y, -500]);
  if (h) washAt(p, 6490, '#f1dcc0', 120, [[-60, h[1] - 90], [1140, h[1] - 90], [1140, h[1] + 110], [-60, h[1] + 110]], 0.3, 0.1);
};

const floor = (p: Painter, c: YCam) => {
  wFill(p, c, 6500, B.tile, qy(0, -1.8, 2.2, 0, 1.9));
  for (let x = -1.8; x <= 2.2 + 1e-6; x += 0.3) wInk(p, c, 6510 + Math.round(x * 10), [[x, 0.001, 0], [x, 0.001, 1.9]], {color: B.grout, weight: 0.5, closed: false});
  for (let z = 0.3; z <= 1.9 + 1e-6; z += 0.3) wInk(p, c, 6560 + Math.round(z * 10), [[-1.8, 0.001, z], [2.2, 0.001, z]], {color: B.grout, weight: 0.5, closed: false});
  // low sun from the front right: post shadows stretch toward the room and to the left; warm light pools between them
  wWash(p, c, 6600, B.sunFloor, 150, qy(0.002, -1.8, 2.2, 0.05, 1.9), 0.2, 0.1);
  for (let x = -1.8; x <= 2.2 + 1e-6; x += 1.0) wWash(p, c, 6610 + Math.round(x * 10), B.shadow, 120, [[x - 0.03, 0.003, 0.02], [x + 0.03, 0.003, 0.02], [x - 0.75, 0.003, 1.9], [x - 0.83, 0.003, 1.9]], 0.1, 0.1);
  wWash(p, c, 6650, B.shadow, 95, [[0.0, 0.003, 0.02], [0.8, 0.003, 0.02], [0.45, 0.003, 0.55], [-0.35, 0.003, 0.55]], 0.15, 0.1); // planter
  wWash(p, c, 6651, '#e8e6e0', 70, qy(0.004, -1.8, 2.2, 0.0, 0.25), 0.1, 0.1); // damp sheen near the rail
};

const wall = (p: Painter, c: YCam) => {
  wFill(p, c, 6700, B.wallShade, qx(-1.8, 0, 2.8, 0, 2.2));
  wFill(p, c, 6701, mixColor(B.wallShade, B.wall, 0.4), qx(-1.79, 0, 0.1, 0, 2.2)); // skirting
};

const railItems = (t: number): Item[] => {
  const items: Item[] = [];
  for (let i = 0; i < 5; i++) {
    const x = -1.8 + i;
    items.push({at: [x, 0, 0], draw: (p, c) => paintBox(p, c, 6800 + i * 4, {x0: x - 0.025, x1: x + 0.025, y0: 0, y1: 1.06, z0: -0.025, z1: 0.025}, B.rail, {left: 0.12, front: 0.06}, {ink: true})});
    if (i < 4) items.push({at: [x + 0.5, 0, 0.01], bias: 0.05, draw: (p, c) => {
      // glass panel as a veil over what is behind it (DF-20261030-painted-glass-sheen-veil) + one diagonal sheen
      wWash(p, c, 6830 + i, B.glass, 95, qz(0, x + 0.03, x + 0.97, 0.06, 1.04), 0.05, 0.05);
      wWash(p, c, 6835 + i, '#ffffff', 90, [[x + 0.2, 0.1, 0], [x + 0.32, 0.1, 0], [x + 0.62, 1.0, 0], [x + 0.5, 1.0, 0]], 0.05, 0.05);
    }});
  }
  items.push({at: [0.2, 0, 0], bias: -0.1, draw: (p, c) => paintBox(p, c, 6850, {x0: -1.8, x1: 2.2, y0: 1.06, y1: 1.1, z0: -0.04, z1: 0.04}, B.rail, {top: 0.15, front: -0.05}, {ink: true})});
  void t;
  return items;
};

/** Planter trough on the rail cap with ornamental grass tufts and dew beads. */
const planterItems = (t: number): Item[] => {
  const items: Item[] = [{at: [0.4, 0, 0], bias: 0.2, draw: (p, c) => {
    paintBox(p, c, 6900, {x0: 0, x1: 0.8, y0: 1.1, y1: 1.3, z0: -0.11, z1: 0.11}, B.trough, {front: -0.06, right: 0.08, top: 0.1}, {ink: true});
    wFill(p, c, 6905, B.soil, qy(1.285, 0.01, 0.79, -0.1, 0.1));
  }}];
  for (let i = 0; i < 90; i++) {
    const r = (k: number) => hash(i * 19 + k + 500);
    const a = r(1) * 6.28;
    const b: Blade = {root: [0.04 + r(2) * 0.72, 1.285, -0.08 + r(3) * 0.16], h: 0.07 + r(4) * 0.07, w: 0.007 + r(5) * 0.004, dir: [Math.cos(a), Math.sin(a)], lean: 6 + r(6) * 18, curl: 10 + r(7) * 40,
      pal: {base: '#5f8a34', body: '#a8cc5c', edge: '#e2efa0', vein: '#7aa040'}, seed: 7000 + i * 13, beads: r(8) > 0.45 ? [[0.5 + r(9) * 0.3, 0.005]] : undefined, sway: 2};
    items.push(bladeItem(b, t, {near: 0.1, far: 50, nearColor: '#3e5a26', farColor: '#ffffff', farMix: 0}, 0.21));
  }
  return items;
};

/** The whole balcony through camera `c`; `cast` items are depth-sorted with the rail and planter. */
export const paintBalcony = (p: Painter, c: YCam, o: {t: number; cast: Item[]; sun?: Pt}) => {
  const hz = camPoint(c, [0, c.y, -1000]);
  const horizon = hz ? hz[1] : c.hy;
  paintSkyBands(p, {from: B.zenith, to: B.horizon, via: '#d7d6cf', viaAt: 0.55, horizon: horizon + 40, width: 1080, bands: 9});
  const sun = o.sun ?? [905, horizon - 70];
  city(p, c);
  paintSkyDisc(p, {x: sun[0], y: sun[1], r: 30, color: B.sun, glow: 0.9, glowColor: '#ffe2b0', t: o.t});
  hardFill(p, 6299, B.tile, [[-200, 1700], [1300, 1700], [1300, 2200], [-200, 2200]]);
  floor(p, c);
  wall(p, c);
  paintSorted(p, c, [...railItems(o.t), ...planterItems(o.t), ...o.cast]);
};

/** Mug steam: two thin pale wisps rising from the mug rim (ENV-FOG-like, small). */
export const steam = (p: Painter, rim: Pt, u: number, t: number) => {
  for (let k = 0; k < 2; k++) {
    const pts: Pt[] = [];
    for (let i = 0; i <= 8; i++) {
      const s = i / 8, y = rim[1] - s * 0.16 * u, x = rim[0] + (k - 0.5) * 0.02 * u + Math.sin(t * 1.4 + s * 5 + k * 2) * 0.012 * u * (1 + s * 2);
      pts.push([x, y]);
    }
    const w = 0.006 * u, poly: Pt[] = [...pts.map(([x, y], i): Pt => [x - w * (1 - i / 9), y]), ...pts.slice().reverse().map(([x, y], i): Pt => [x + w * (i / 9 + 0.1), y])];
    washAt(p, 6950 + k, '#ffffff', 90, poly, 0.1, 0.1);
  }
  void ell;
};
export type {V3};
