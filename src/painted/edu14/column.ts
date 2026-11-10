// SET-COLUMN (N4; brief "Set plan - sky, cloud, fall and city"; metres, an elevation seen from 8.4 km): a flat cloud deck from y 2,000 up, haze bands below,
// a far hazy ground rising to the horizon, the city strip standing on y 0 (condo towers 30-120 m, shophouse rows, a river glint, no landmark) and the
// ground running down toward the lens. World `C`: x 0 on the bus stop, the elevation plane z 0; the camera stands at z = r. LOOK-FRAME CODE (LF03).
import {ell, hardFill, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {paintSkyBands} from '../kit/sky';
import type {V3} from '../kit/space';
import {qy, qz, wFill, wWash} from '../kit/world';
import {camPoint, type YCam} from '../kit/ycam';
import {C} from './palette';

export const CLOUD_BASE_Y = 2000;
export const columnCam = (r = 8200, eye = 1000): YCam => ({x: 0, y: eye, z: r, yaw: 0, f: 3600, hy: 690});

export const paintColumn = (p: Painter, c: YCam) => {
  const base = camPoint(c, [0, CLOUD_BASE_Y, 0]), gnd = camPoint(c, [0, 0, 0]);
  if (!base || !gnd) return;
  const yb = base[1], yg = gnd[1], yh = c.hy;
  // sky below the deck: slate at the base, paling to the haze at the horizon (flat bands)
  paintSkyBands(p, {from: '#69787f', to: '#b4bfc2', via: '#93a2a8', viaAt: 0.5, horizon: yh + 2, top: yb - 4, width: 1080, bands: 9, style: 'flat', seed: 20100});
  // far hazy ground from the horizon down to the skyline, then the nearer ground running toward the lens
  for (let i = 0; i < 7; i++) {
    const y0 = yh + ((yg - yh) * i) / 7, y1 = yh + ((yg - yh) * (i + 1)) / 7 + 1;
    hardFill(p, 20150 + i, mixColor('#b4bfc2', '#8d9a9f', (i + 1) / 7), [[-20, y0], [1100, y0], [1100, y1], [-20, y1]]);
  }
  // soft far blocks on the far ground (texture only)
  for (let i = 0; i < 46; i++) {
    const x = (hash(20200 + i) - 0.5) * 2600, z = -(1500 + hash(20250 + i) * 14000), w = 60 + hash(20300 + i) * 140, d = 40 + hash(20350 + i) * 90;
    wWash(p, c, 20400 + i, i % 3 ? '#a2aeb2' : '#c4ccce', 100, qy(0, x, x + w, z, z + d), 0.2, 0.3);
  }
  // cloud deck: heavy flat underside from y 2,000 up (screen-painted from the projected base `yb`): dark ceiling, soft rolls, lit breaks, a ragged base of hanging lobes
  hardFill(p, 20500, '#3d484e', [[-20, -20], [1100, -20], [1100, yb + 4], [-20, yb + 4]]);
  for (let i = 0; i < 16; i++) {
    const cx = hash(20600 + i) * 1200 - 60, cy = yb - 6 - hash(20650 + i) * (yb - 20), w = 160 + hash(20700 + i) * 360, h = 22 + hash(20750 + i) * 46, lit = i % 3 === 0;
    washAt(p, 20800 + i, lit ? '#8d9ba1' : '#2d373c', lit ? 110 : 150, ell(cx, cy, w / 2, h / 2, 22), 0.5, 0.5);
  }
  for (let i = 0; i < 9; i++) { // lit breaks low in the deck, just above the base
    const cx = 60 + i * 130 + hash(20900 + i) * 60, w = 90 + hash(20950 + i) * 130;
    washAt(p, 20960 + i, C.cloudLit, 90, ell(cx, yb - 26 - hash(20970 + i) * 36, w / 2, 9 + hash(20980 + i) * 8, 16), 0.5, 0.5);
  }
  const lobes: Pt[] = [];
  for (let x = -20; x <= 1100; x += 24) lobes.push([x, yb + 2 + hash(21050 + x) * 12 + 8 * Math.sin(x * 0.045)]);
  hardFill(p, 21000, '#3a454b', [[-20, yb - 12], ...lobes, [1100, yb - 12]]);
  hardFill(p, 21001, '#2a3338', [[-20, yb - 6], [1100, yb - 6], [1100, yb + 2], [-20, yb + 2]]);
  // city strip standing on y 0: shophouse rows (12-15 m) and condo towers (30-120 m), x -1300 .. 1300, hazed with distance
  let x = -1350, i = 0;
  while (x < 1350) {
    const tower = hash(21000 + i) > 0.62 && Math.abs(x) > 60, w = tower ? 22 + hash(21100 + i) * 28 : 40 + hash(21200 + i) * 70;
    const h = tower ? 30 + hash(21300 + i) * 90 : 11 + hash(21400 + i) * 5, col = tower ? ['#6d7b83', '#847d76', '#66747d', '#8a8f8c'][i % 4] : ['#8f836f', '#74878a', '#9c9482', '#7f877d'][i % 4];
    wFill(p, c, 21500 + i * 3, mixColor(col, C.haze, 0.12), qz(0, x, x + w, 0, h));
    if (tower) wWash(p, c, 21501 + i * 3, '#5d6b73', 70, qz(0, x + w * 0.55, x + w, 0, h), 0.1, 0.1);
    x += w + (tower ? 8 : 3) + hash(21600 + i) * 22;
    i++;
  }
  wWash(p, c, 22800, C.haze, 45, qz(0, -1400, 1400, 0, 140), 0.1, 0.1);
  // river glint on the near side of the skyline: a pale ribbon on the ground plane
  wFill(p, c, 22810, '#cfd8da', [[-1400, 0, 700], [-600, 0, 900], [200, 0, 700], [1400, 0, 1100], [1400, 0, 1180], [200, 0, 780], [-600, 0, 980], [-1400, 0, 780]]);
  // near ground toward the lens: block roofs in perspective, darker toward the bottom (calm caption band)
  hardFill(p, 22850, '#8e999d', [[-20, yg], [1100, yg], [1100, 1940], [-20, 1940]]);
  for (let k = 0; k < 260; k++) {
    const bx = (hash(22900 + k) - 0.5) * 5200, bz = 3200 + hash(22950 + k) * 4600, w = 60 + hash(23000 + k) * 160, d = 45 + hash(23050 + k) * 110;
    wFill(p, c, 23100 + k, mixColor(['#b3afa4', '#a2afb1', '#bfb3a0', '#98a4a8'][k % 4], '#6b777c', (8200 - bz) / 5400 * 0.25), qy(0, bx, bx + w, bz, bz + d));
  }
  [0, 1, 2].forEach((s) => hardFill(p.layer(0.18 + s * 0.12, 23400 + s * 10), 23400 + s, '#232b2f', [[-20, 1180 + s * 230], [1100, 1180 + s * 230], [1100, 1940], [-20, 1940]]));
  void ell;
};

export const columnMeasure = (c: YCam) => ({
  baseY: camPoint(c, [0, CLOUD_BASE_Y, 0])?.[1] ?? 0, groundY: camPoint(c, [0, 0, 0])?.[1] ?? 0, pxPerM: c.f / Math.abs(c.z),
  pin: camPoint(c, [0, 0, 0]) as Pt,
});
