import {ell, hardFill, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter} from '../kit/painter';
import {paintBox, qx, qy, wFill, wInk, wWash} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintJar} from './r4-cast';

// EDU-EP26-SHORT BRIEF-R4 VD26-21: the street outside the fullery at dusk (`new: roman-street-dusk`), the final frame (B06-SH05).
// Space S (metres): origin on the road centre line at the laundry doorway's z; +x screen right from the main camera, +y up, +z toward
// the camera. The road runs along z (x -1.3..+1.3, y 0, basalt paving with ruts) between raised sidewalks (y 0.32, x +-1.3..+-2.6) and
// house fronts at x = -2.6 / +2.6, 4 to 6 m long each, to z -42. Stepping stones cross at z -4.0. The fullery is the first house on the
// left (x -2.6, z -1.6..+1.4): its doorway with a drying pole and cloth outside identifies it. A public fountain stands on the right
// sidewalk at z -6.5. Dusk: blue sky, a last orange slit at the street's end, the right fronts catching the last warm light, lamps lit.

export type StreetLight = {mood: 'dusk' | 'late'; draft?: boolean};
const SW = 0.32, RX = 1.3, FX = 2.6;

const HOUSES: {side: -1 | 1; z0: number; z1: number; col: string; door: [number, number]; balcony?: boolean; lit?: boolean}[] = [
  {side: -1, z0: -1.6, z1: 1.4, col: '#d6a45e', door: [-0.6, 0.6]},
  {side: -1, z0: -6.4, z1: -1.6, col: '#c9766a', door: [-4.6, -3.0], balcony: true},
  {side: -1, z0: -11.5, z1: -6.4, col: '#e0c69a', door: [-9.6, -8.2]},
  {side: -1, z0: -18, z1: -11.5, col: '#b8806a', door: [-15.5, -14], balcony: true},
  {side: -1, z0: -42, z1: -18, col: '#c89a70', door: [-24, -22.5]},
  {side: 1, z0: -3.0, z1: 2.4, col: '#c46a4a', door: [-1.8, 0.4], lit: true},
  {side: 1, z0: -8.8, z1: -3.0, col: '#e2b878', door: [-7.8, -6.8], balcony: true},
  {side: 1, z0: -14, z1: -8.8, col: '#d39a6a', door: [-12.5, -11.2], lit: true},
  {side: 1, z0: -42, z1: -14, col: '#c08a64', door: [-20, -18.5]},
];

export function paintStreet(p: Painter, c: YCam, L: StreetLight, figures?: (p: Painter, c: YCam) => void) {
  const late = L.mood === 'late';
  // sky: deep blue above, a warm slit low at the street's end
  hardFill(p, 33000, late ? '#24305a' : '#34508a', [[-50, -50], [1130, -50], [1130, 2000], [-50, 2000]]);
  const hz = camPoint(c, [0, 0, -60]);
  if (hz) {
    washAt(p, 33001, late ? '#6a5a8a' : '#8a7aa8', 200, [[-50, hz[1] - 520], [1130, hz[1] - 520], [1130, hz[1] - 160], [-50, hz[1] - 160]], 0.4, 0.3);
    washAt(p, 33002, '#e58a4c', 230, [[-50, hz[1] - 220], [1130, hz[1] - 220], [1130, hz[1] + 40], [-50, hz[1] + 40]], 0.3, 0.3);
    washAt(p, 33003, '#ffc070', 220, [[-50, hz[1] - 90], [1130, hz[1] - 90], [1130, hz[1] + 30], [-50, hz[1] + 30]], 0.2, 0.3);
  }
  // road and sidewalks
  wFill(p, c, 33010, '#55525a', qy(0, -RX, RX, -60, 4));
  if (!L.draft) for (let i = 0; i < 70; i++) {
    const z = 3 - i * 0.55, x = -RX + 0.2 + hash(33020 + i) * (2 * RX - 0.4);
    wInk(p, c, 33100 + i, [[x - 0.25, 0.002, z], [x, 0.002, z - 0.18], [x + 0.28, 0.002, z + 0.05]], {closed: false, color: '#3c3a42', weight: 1});
  }
  for (const s of [-0.5, 0.5]) wWash(p, c, 33180 + (s > 0 ? 1 : 0), '#3a3840', 120, qy(0.003, s - 0.08, s + 0.08, -60, 4), 0.2, 0.4);
  wWash(p, c, 33185, '#e8a060', late ? 30 : 60, qy(0.004, -RX, RX, -40, -8), 0.4, 0.3);
  for (const side of [-1, 1] as const) {
    const x0 = side < 0 ? -FX : RX, x1 = side < 0 ? -RX : FX;
    wFill(p, c, 33200 + side, side < 0 ? '#8a7c78' : '#a89080', qy(SW, x0, x1, -60, 4));
    wFill(p, c, 33210 + side, side < 0 ? '#6e625e' : '#8a7468', qx(side < 0 ? -RX : RX, 0, SW, -60, 4));
  }
  // stepping stones at z -4
  for (const [i, x] of [-0.7, 0, 0.7].entries()) {
    paintBox(p, c, 33300 + i * 8, {x0: x - 0.22, x1: x + 0.22, y0: 0, y1: SW, z0: -4.25, z1: -3.85}, '#77727a', {front: -0.15, top: 0.12});
  }
  // house fronts, far to near so the near ones overlap
  const sorted = [...HOUSES].sort((a, b) => a.z0 - b.z0);
  for (const [i, h] of sorted.entries()) {
    const id = 33400 + i * 40, x = h.side * FX, warmSide = h.side > 0 && !late;
    const base = warmSide ? mixColor(h.col, '#ffb070', 0.18) : mixColor(h.col, '#4a4a7a', h.side < 0 ? 0.42 : 0.3);
    const height = 5.2 + hash(id) * 1.6;
    wFill(p, c, id, base, qx(x, SW, height, h.z0, h.z1));
    wFill(p, c, id + 1, mixColor(base, '#5a2a2a', 0.35), qx(x - h.side * 0.001, SW, 1.1, h.z0, h.z1));
    wWash(p, c, id + 2, mixColor(base, '#000000', 0.25), 120, qx(x - h.side * 0.002, height - 0.6, height, h.z0, h.z1), 0.3, 0.5);
    // shop opening with half-open wooden shutters and a dim (or lamp-lit) interior
    const [d0, d1] = h.door;
    wFill(p, c, id + 3, h.lit ? '#e8a050' : '#2c2430', qx(x - h.side * 0.003, SW, 2.6, d0, d1));
    if (h.lit) washAt(p, id + 4, '#ffd080', 140, (() => { const a = camPoint(c, [x, 1.4, (d0 + d1) / 2]); const u = a ? camUnit(c, [x, 1.4, (d0 + d1) / 2]) : 0; return a ? ell(a[0], a[1], 1.0 * u, 1.3 * u, 18) : []; })(), 0.5, 0.2);
    wFill(p, c, id + 5, '#5a3a26', qx(x - h.side * 0.004, SW, 2.6, d0 - 0.05, d0 + 0.18));
    wFill(p, c, id + 6, mixColor(base, '#3a2a2a', 0.4), qx(x - h.side * 0.004, 2.6, 2.75, d0 - 0.1, d1 + 0.1));
    // upper windows
    for (let k = 0; k < Math.floor((h.z1 - h.z0) / 1.6); k++) {
      const wz = h.z0 + 0.6 + k * 1.6;
      wFill(p, c, id + 10 + k, h.lit && k === 0 ? '#f0b060' : '#2a2638', qx(x - h.side * 0.003, 3.6, 4.2, wz, wz + 0.5));
    }
    if (h.balcony) {
      paintBox(p, c, id + 30, {x0: Math.min(x, x - h.side * 0.9), x1: Math.max(x, x - h.side * 0.9), y0: 3.0, y1: 3.12, z0: h.z0 + 0.6, z1: h.z1 - 0.6}, '#6a4430', {bottom: -0.2});
      wInk(p, c, id + 31, [[x - h.side * 0.9, 3.5, h.z0 + 0.6], [x - h.side * 0.9, 3.5, h.z1 - 0.6]], {closed: false, color: '#4a2e20', weight: 2});
    }
  }
  // the fullery: the first house on the left, its doorway with cloth on a pole outside
  wFill(p, c, 33800, '#3a2c30', qx(-FX + 0.003, SW, 2.4, -0.6, 0.6));
  wWash(p, c, 33801, '#e8b070', 90, qx(-FX + 0.004, SW, 2.0, -0.4, 0.4), 0.3, 0.3);
  wInk(p, c, 33802, [[-FX, 2.6, -1.3], [-FX + 0.8, 2.55, -1.3]], {closed: false, color: '#5a3a26', weight: 3});
  for (const [i, [z, col]] of [[-1.3, '#e3a43c'], [-1.3, '#f0ebe0']].entries()) {
    const x0 = -FX + 0.1 + i * 0.35;
    wFill(p, c, 33810 + i * 3, mixColor(col as string, '#4a4a7a', 0.3), [[x0, 2.55, z as number], [x0 + 0.3, 2.55, z as number], [x0 + 0.28, 1.8, z as number], [x0 + 0.02, 1.85, z as number]]);
  }
  if (!L.draft) {
    // fountain on the right sidewalk, amphorae by a shop, a hanging lamp
    paintBox(p, c, 33900, {x0: 1.6, x1: 2.4, y0: SW, y1: SW + 0.55, z0: -7.0, z1: -6.1}, '#9a9088', {front: -0.1, top: 0.15, left: 0.05});
    paintBox(p, c, 33910, {x0: 2.3, x1: 2.5, y0: SW, y1: SW + 1.1, z0: -6.7, z1: -6.4}, '#aaa098', {left: 0.05});
    wFill(p, c, 33920, '#6a8aa0', qy(SW + 0.5, 1.68, 2.32, -6.92, -6.18));
    paintJar(p, c, [-2.3, SW, -4.9], 33930, {h: 0.6, w: 0.32, lid: 'off', lit: 0.4});
    paintJar(p, c, [-2.05, SW, -5.3], 33950, {h: 0.55, w: 0.3, lid: 'off', lit: 0.4});
    const lamp = camPoint(c, [2.3, 2.9, -2.0]);
    if (lamp) {
      const u = camUnit(c, [2.3, 2.9, -2.0]);
      washAt(p, 33970, '#ffcf80', 70, ell(lamp[0], lamp[1], 0.25 * u, 0.25 * u, 18), 0.5, 0.2);
      hardFill(p, 33971, '#7a5a2a', ell(lamp[0], lamp[1], 0.08 * u, 0.04 * u, 12));
      hardFill(p, 33972, '#fff0b0', ell(lamp[0] + 0.04 * u, lamp[1] - 0.04 * u, 0.02 * u, 0.04 * u, 8));
    }
  }
  wWash(p, c, 33990, '#2a2a50', late ? 120 : 60, qy(SW + 0.003, -FX, -RX, -12, 4), 0.3, 0.5);
  figures?.(p, c);
}
