// SET-BUSSTOP (N1; brief EDU-EP14-BRIEF-R1 "Set plan"; metres; LOOK-FRAME CODE, W3). Origin on the pavement directly below the centre of the shelter
// roof's front lip; +x right along the kerb as seen from the road, +y up, +z toward the road. One painter for the real and the no-air world:
// `world: 'noair'` stops everything that moves (no rain, no ripples, no drip streaks; pendant drops hang frozen) and the grade is applied on
// top by `grade.tsx` (colour transform), so the same geometry serves LF01, LF02 and the top-down LF04 (the camera is free).
import {ell, hardFill, inkLine} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {paintSkyBands} from '../kit/sky';
import type {V3} from '../kit/space';
import {paintBox, qx, qy, qz, sphereAt, wFill, wInk, wWash} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {C} from './palette';

export type World = 'real' | 'noair';
export type BusOpts = {world: World; t: number; /** Replaces the sky above the horizon after the base sky bands (the cloud-deck card when the camera looks up). */ sky?: (p: Painter, c: YCam) => void; /** Draws a pendant bead with `drop.ts` when it is >= 14 px tall; returns false to leave it to the placeholder. */ pendant?: (p: Painter, c: YCam, x: number, swell: number, i: number) => boolean; /** Called after the ground and shophouses, before the shelter (a figure the roof must cover from above). */ mid?: (p: Painter, c: YCam) => void};

/** Shelter geometry (brief): roof x -2..2, z -1.70 (back, y 2.65) to +0.10 (front lip, y 2.40). */
export const SHELTER = {x0: -2, x1: 2, zBack: -1.7, zLip: 0.1, yBack: 2.65, yLip: 2.4} as const;
export const roofY = (z: number) => SHELTER.yLip + (SHELTER.yBack - SHELTER.yLip) * ((SHELTER.zLip - z) / (SHELTER.zLip - SHELTER.zBack));

const onScreen = (c: YCam, v: V3, m = 120) => { const q = camPoint(c, v); return !!q && q[0] > -m && q[0] < 1080 + m && q[1] > -m && q[1] < 1920 + m; };
const horizonY = (c: YCam) => { const f = [Math.sin(c.yaw) * 30000, -Math.cos(c.yaw) * 30000]; return camPoint(c, [c.x + f[0], c.y, c.z + f[1]]) ?.[1] ?? c.hy; };
const shade = (col: string, u: number) => mixColor(col, '#1c2326', u);

// ---------------------------------------------------------------- sky and background
const paintSky = (p: Painter, c: YCam) => {
  const hz = Math.min(1920, Math.max(0, horizonY(c)));
  if (c.pitch && c.pitch < -0.6) { p.flat(C.skyLow, [[-20, -20], [1100, -20], [1100, 1940], [-20, 1940]]); return; }
  paintSkyBands(p, {from: C.skyTop, to: C.skyLow, horizon: Math.max(hz, 40), width: 1080, bands: 9, style: 'flat', seed: 10100});
  if (hz < 1920) hardFill(p, 10120, C.skyLow, [[-20, hz - 2], [1100, hz - 2], [1100, 1940], [-20, 1940]]);
};

const tree = (p: Painter, c: YCam, seed: number, x: number, z: number, r: number) => {
  const h = 6.2 + 1.2 * hash(seed);
  const base = camPoint(c, [x, 0, z]), top = camPoint(c, [x, h, z]);
  if (base && top && !(c.pitch && c.pitch < -0.6)) wFill(p, c, seed, '#4a3d33', [[x - 0.18, 0, z], [x + 0.18, 0, z], [x + 0.1, h, z], [x - 0.1, h, z]]);
  const blobs: [number, number, number, number][] = [[0, h + 1.5, 0, r * 0.95], [-r * 0.75, h + 0.8, 0.3, r * 0.7], [r * 0.8, h + 0.9, -0.2, r * 0.72], [-r * 0.3, h + 2.4, 0, r * 0.62], [r * 0.35, h + 2.2, 0.2, r * 0.6]];
  blobs.forEach(([dx, y, dz, rr], i) => {
    const s = sphereAt(c, [x + dx, y, z + dz], rr);
    if (!s) return;
    const scallop = (k: number, ox = 0, oy = 0, n = 26): Pt[] => Array.from({length: n}, (_, j) => { const th = (j / n) * 6.283, rr = s.r * k * (1 + 0.07 * Math.sin(th * 9 + i * 2 + seed) + 0.04 * Math.sin(th * 5 + i)); return [s.x + ox + rr * Math.cos(th), s.y + oy + rr * 0.9 * Math.sin(th)]; });
    hardFill(p, seed + 10 + i, shade(C.tree, 0.15 + 0.1 * (i % 2)), scallop(1));
    hardFill(p, seed + 30 + i, mixColor(C.treeLit, C.tree, 0.35), scallop(0.66, -s.r * 0.22, -s.r * 0.26, 20));
    inkLine(p, seed + 60 + i, scallop(1), {color: mixColor(C.tree, '#1c2a1d', 0.5), weight: 0.9, still: true});
  });
  // rain haze over the canopy
  const s0 = sphereAt(c, [x, h + 1.5, z], r);
  if (s0) hardFill(p.layer(0.4, seed), seed + 50, C.haze, ell(s0.x, s0.y, s0.r * 1.5, s0.r * 1.3, 14));
};

const paintBackground = (p: Painter, c: YCam) => {
  // pale school building block far behind (textless)
  wFill(p, c, 10200, '#c9c9bd', qz(-16, -12, 16, 0, 9));
  for (let r = 0; r < 3; r++) for (let k = -9; k <= 9; k++) wFill(p, c, 10210 + r * 40 + k + 9, '#7e8b8f', qz(-15.99, k * 1.6 - 0.5, k * 1.6 + 0.5, 1.4 + r * 2.6, 2.7 + r * 2.6));
  wFill(p, c, 10202, '#a9ab9f', qz(-15.98, -12, 16, 8.6, 9.2));
  if (c.y > 9) wFill(p, c, 10203, '#b8b8ac', qy(9, -12, 16, -26, -16)); // roof seen from above
  for (const [i, x] of [-11, -7.2, -3.4, 0.6, 4.4, 8.2, 12].entries()) tree(p, c, 10300 + i * 70, x + hash(i + 3) * 1.4, -7 - hash(i) * 3, 2.7 + hash(i + 9) * 0.6);
  wWash(p, c, 10250, C.haze, 90, qz(-9.5, -20, 20, 0, 12), 0.1, 0.1);
  // school wall (cream, 1.2 m) with a green railing (0.8 m): rails and bars
  const zW = -3.4;
  wFill(p, c, 10400, C.wall, qz(zW, -14, 14, 0, 1.2));
  wFill(p, c, 10401, shade(C.wall, 0.25), qy(1.2, -14, 14, zW - 0.12, zW + 0.12));
  wWash(p, c, 10402, '#8d9a83', 80, qz(zW + 0.002, -14, 14, 0, 0.35), 0.1, 0.4);
  for (let k = -14; k < 14; k += 3) wFill(p, c, 10410 + k + 14, shade(C.wall, 0.12), qz(zW + 0.003, k - 0.06, k + 0.06, 0, 1.2)); // pilasters
  wFill(p, c, 10450, C.railing, qz(zW + 0.01, -14, 14, 1.2, 1.26));
  wFill(p, c, 10451, C.railing, qz(zW + 0.01, -14, 14, 1.96, 2.0));
  for (let x = -14; x <= 14; x += 0.32) if (onScreen(c, [x, 1.6, zW], 40)) wFill(p, c, 10460 + Math.round((x + 14) * 3), C.railing, qz(zW + 0.012, x - 0.012, x + 0.012, 1.26, 1.96));
};

// ---------------------------------------------------------------- ground, kerb, road, shophouses
const paintGround = (p: Painter, c: YCam, o: BusOpts) => {
  // paving (wet, dark: calm caption band) z -3.4 .. 1.4, blocks every 0.3 m
  wFill(p, c, 11000, '#5d5450', qy(0, -14, 14, -3.4, 1.4));
  for (let x = -7; x <= 7.001; x += 0.3) if (onScreen(c, [x, 0, 0.6], 200)) wInk(p, c, 11010 + Math.round((x + 7) * 10), [[x, 0, -3.4], [x, 0, 1.4]], {color: '#3a3431', weight: 0.6, closed: false});
  for (let z = -3.3; z <= 1.4; z += 0.3) wInk(p, c, 11200 + Math.round((z + 3.4) * 10), [[-7, 0, z], [7, 0, z]], {color: '#3a3431', weight: 0.6, closed: false});
  for (let i = 0; i < 9; i++) { // uneven, a few cracked or paler blocks
    const x = -3.5 + hash(11300 + i) * 7, z = -1.2 + hash(11310 + i) * 2.4, a = Math.floor(x / 0.3) * 0.3, b = Math.floor(z / 0.3) * 0.3;
    wWash(p, c, 11320 + i, i % 2 ? '#7a6e68' : '#463e3b', 120, qy(0.001, a, a + 0.3, b, b + 0.3), 0.1, 0.3);
  }
  // shelter's dry shade
  wWash(p, c, 11400, '#2d2926', 110, qy(0.002, SHELTER.x0, SHELTER.x1, SHELTER.zBack, SHELTER.zLip + 0.05), 0.2, 0.3);
  // wet sheen: pale soft strokes
  for (let i = 0; i < 6; i++) wWash(p, c, 11410 + i, '#aab6bb', 55, qy(0.003, -3 + i * 1.1 - 0.5, -3 + i * 1.1 + 0.6, 0.3 + hash(i) * 0.7, 0.55 + hash(i) * 0.7), 0.3, 0.2);
  // kerb 0.15 m tall, red and white every 1 m; its top and front face
  for (let x = -8; x < 8; x++) paintBox(p, c, 11500 + (x + 8) * 8, {x0: x, x1: x + 1, y0: 0, y1: 0.15, z0: 1.4, z1: 1.55}, (x + 8) % 2 ? C.kerbWhite : C.kerbRed, {top: -0.1, front: 0.08}, {ink: true});
  // road (wet asphalt) z 1.55 .. 9.4, gutter strip, dashed centre line z 5.4
  wFill(p, c, 11700, C.asphalt, qy(0, -20, 28, 1.55, 11.2));
  wFill(p, c, 11701, '#2f3438', qy(0.001, -20, 28, 1.55, 1.95));
  wFill(p, c, 11702, '#5d5450', qy(0, -20, 28, 9.4, 11.2)); // far pavement
  wInk(p, c, 11703, [[-20, 0.002, 9.4], [28, 0.002, 9.4]], {color: '#2b2f32', weight: 1.1, closed: false});
  for (let x = -20; x < 28; x += 2) if (onScreen(c, [x, 0, 5.4], 200)) wFill(p, c, 11710 + Math.round((x + 20) / 2), '#cfd3d2', qy(0.002, x, x + 1, 5.34, 5.46));
  for (let i = 0; i < 10; i++) { // reflections of the shop light: warm vertical smears
    const x = -9 + i * 3.2 + hash(11800 + i) * 1.2;
    wWash(p, c, 11800 + i, C.shopGlow, 70, qy(0.004, x, x + 0.5, 5.8 + hash(i) * 0.5, 9.3), 0.4, 0.3);
  }
  wWash(p, c, 11820, '#aab6bb', 60, qy(0.004, -5, 3, 2.1, 4.8), 0.4, 0.3); // sky sheen on the near lane
  void o;
};

const BAY = [C.ochre, C.teal, C.cream];
const paintShophouses = (p: Painter, c: YCam) => {
  const z = 11.4, top = 13.2;
  for (let b = 0; b < 9; b++) {
    const x0 = -14 + b * 4, col = BAY[b % 3], id = 12000 + b * 120;
    if (!onScreen(c, [x0 + 2, 6, z], 600) && !(c.pitch && c.pitch < -0.6)) continue;
    wFill(p, c, id, mixColor(col, '#9aa6ab', 0.22), qz(z, x0, x0 + 4, 0, top));
    wFill(p, c, id + 1, shade(col, 0.2), qz(z + 0.01, x0, x0 + 4, top - 0.45, top));
    wFill(p, c, id + 2, shade(col, 0.3), qz(z + 0.012, x0, x0 + 0.12, 0, top)); // party wall line
    // ground floor: half-open rolling shutter, warm interior
    wFill(p, c, id + 3, '#2a2420', qz(z + 0.02, x0 + 0.3, x0 + 3.7, 0, 2.7));
    wFill(p, c, id + 4, C.shopGlow, qz(z + 0.021, x0 + 0.5, x0 + 3.5, 0.4, 1.9));
    wFill(p, c, id + 5, C.shutter, qz(z + 0.03, x0 + 0.3, x0 + 3.7, 1.7, 2.7));
    for (let s = 0; s < 6; s++) wInk(p, c, id + 6 + s, [[x0 + 0.3, 1.8 + s * 0.15, z + 0.032], [x0 + 3.7, 1.8 + s * 0.15, z + 0.032]], {color: '#5d6264', weight: 0.5, closed: false});
    wFill(p, c, id + 12, shade(col, 0.1), qz(z + 0.03, x0 + 0.2, x0 + 3.8, 2.75, 3.15)); // signboard, textless
    wFill(p, c, id + 13, mixColor(BAY[(b + 1) % 3], '#ffffff', 0.15), [[x0 + 0.2, 2.7, z + 0.04], [x0 + 3.8, 2.7, z + 0.04], [x0 + 3.8, 2.55, z + 1.2], [x0 + 0.2, 2.55, z + 1.2]]); // awning
    for (let f = 1; f < 4; f++) { // upper floors
      const y0 = 3.3 * f + 0.5, y1 = 3.3 * f + 2.4;
      wFill(p, c, id + 20 + f * 12, shade(col, 0.5), qz(z + 0.02, x0 + 0.5, x0 + 1.9, y0, y1));
      wFill(p, c, id + 21 + f * 12, shade(col, 0.5), qz(z + 0.02, x0 + 2.1, x0 + 3.5, y0, y1));
      if ((b + f) % 3 === 0) wFill(p, c, id + 22 + f * 12, '#e8c987', qz(z + 0.021, x0 + 2.1, x0 + 3.5, y0, y1 - 0.4));
      wFill(p, c, id + 23 + f * 12, '#8b8f91', qz(z + 0.05, x0 + 0.4, x0 + 3.6, y0 - 0.12, y0 - 0.02)); // sill / balcony rail
      if ((b * 2 + f) % 3 === 1) paintBox(p, c, id + 24 + f * 12, {x0: x0 + 0.7, x1: x0 + 1.4, y0: y0 + 0.1, y1: y0 + 0.5, z0: z + 0.05, z1: z + 0.45}, '#cfd3d2', {}, {ink: true}); // AC unit
      if ((b + f * 2) % 4 === 0) wFill(p, c, id + 25 + f * 12, '#4d7b4b', [[x0 + 2.3, y0 - 0.02, z + 0.06], [x0 + 3.3, y0 - 0.02, z + 0.06], [x0 + 3.1, y0 + 0.4, z + 0.06], [x0 + 2.5, y0 + 0.45, z + 0.06]]); // plant box
    }
    if (c.y > top) { wFill(p, c, id + 70, '#8a8d8f', qy(top, x0, x0 + 4, z, z + 12)); if (b % 3 === 1) paintBox(p, c, id + 72, {x0: x0 + 1, x1: x0 + 2.2, y0: top, y1: top + 1.4, z0: z + 6, z1: z + 7.2}, '#6f8fa0', {}, {ink: true}); }
  }
  wWash(p, c, 12990, C.haze, 70, qz(z + 0.1, -14, 22, 0, 13.4), 0.1, 0.1);
  // two concrete power poles (-6, 9.8) and (19, 9.8) with tangled cable bundles
  for (const [k, x] of [-6, 19].entries()) {
    wFill(p, c, 13000 + k * 10, '#8d8f8a', qz(9.8, x - 0.12, x + 0.12, 0, 9));
    wFill(p, c, 13001 + k * 10, '#7d7f7a', qz(9.805, x - 1.0, x + 1.0, 8.4, 8.55));
    wFill(p, c, 13002 + k * 10, '#7d7f7a', qz(9.805, x - 0.8, x + 0.8, 7.7, 7.82));
  }
  for (let k = 0; k < 4; k++) wInk(p, c, 13050 + k, [[-6, 8.5 - k * 0.2, 9.8], [6, 8.0 - k * 0.15 - hash(k) * 0.3, 9.8], [19, 8.5 - k * 0.2, 9.8]], {color: '#1f2224', weight: 0.9, closed: false});
};

// ---------------------------------------------------------------- the shelter
/** The roof's shadow on the paving, seen from above the roof: ground paint, so it goes down before anything standing under the roof (`mid`, the SH07 girl). */
const paintRoofShadow = (p: Painter, c: YCam) => {
  const {x0, x1, zBack, zLip, yLip} = SHELTER;
  if (c.y >= yLip) wWash(p, c, 14459, '#14191b', 150, [[x0 - 0.15, 0.001, zBack - 0.1], [x1 + 0.15, 0.001, zBack - 0.1], [x1 + 0.2, 0.001, zLip + 0.25], [x0 - 0.15, 0.001, zLip + 0.25]], 0.3, 0.2);
};
const paintShelter = (p: Painter, c: YCam) => {
  const {x0, x1, zBack, zLip, yBack, yLip} = SHELTER;
  // back panel at z -1.65: perforated steel beyond the ad lightbox
  wFill(p, c, 14000, C.steel, qz(-1.65, x0, x1, 0.3, 2.2));
  for (let i = 0; i < 10; i++) for (let j = 0; j < 9; j++) {
    const x = 0.35 + j * 0.18, y = 0.45 + i * 0.18;
    if (x > 1.8) continue;
    wFill(p, c, 14010 + i * 10 + j, '#4f5558', qz(-1.648, x, x + 0.05, y, y + 0.05));
  }
  wFill(p, c, 14200, '#4a5155', qz(-1.64, x0, -1.6, 0.3, 2.2)); // frame left of the lightbox
  wFill(p, c, 14201, '#3f464a', qz(-1.64, -1.64, 0.24, 0.26, 2.24)); // lightbox frame
  wFill(p, c, 14202, C.lightbox, qz(-1.635, -1.6, 0.2, 0.3, 2.2));
  wWash(p, c, 14203, '#ffffff', 150, qz(-1.633, -1.45, 0.05, 0.5, 2.0), 0.3, 0.2);
  wWash(p, c, 14204, '#9fb9c4', 120, [[-1.2, 0.8, -1.63], [-0.2, 0.8, -1.63], [-0.5, 1.7, -1.63], [-1.1, 1.5, -1.63]], 0.25, 0.3); // textless abstract shape
  // bench: steel slats on legs
  for (const x of [-1.35, 0.95]) for (const z of [-1.4, -1.1]) paintBox(p, c, 14300 + Math.round(x * 10 + z * 3), {x0: x - 0.02, x1: x + 0.02, y0: 0, y1: 0.45, z0: z - 0.02, z1: z + 0.02}, '#5f676b', {}, {});
  for (let s = 0; s < 4; s++) paintBox(p, c, 14340 + s * 8, {x0: -1.4, x1: 1.0, y0: 0.45, y1: 0.49, z0: -1.45 + s * 0.1, z1: -1.37 + s * 0.1}, '#7d8588', {top: -0.2}, {ink: true});
  // roof: underside seen from below (rust-grey, ribs along z), top corrugated tin seen from above; fascia strip at the lip
  const under: V3[] = [[x0, yBack, zBack], [x1, yBack, zBack], [x1, yLip, zLip], [x0, yLip, zLip]];
  if (c.y < yLip) {
    wFill(p, c, 14400, C.tin, under);
    for (let x = x0 + 0.15; x < x1; x += 0.15) wInk(p, c, 14410 + Math.round((x - x0) * 10), [[x, yBack - 0.03, zBack], [x, yLip - 0.03, zLip]], {color: C.tinCool, weight: 0.7, closed: false});
    wWash(p, c, 14450, '#3a3028', 120, [[x0, yBack, zBack], [x1, yBack, zBack], [x1, yBack - 0.08, zBack + 0.5], [x0, yBack - 0.08, zBack + 0.5]], 0.2, 0.3);
    wWash(p, c, 14451, '#b49a85', 80, [[x0, yLip + 0.02, zLip - 0.9], [x1, yLip + 0.02, zLip - 0.9], [x1, yLip, zLip], [x0, yLip, zLip]], 0.2, 0.3); // wet sheen near the lip
  }
  if (c.y >= yLip) {
    wFill(p, c, 14460, '#9aa3a6', under.map(([a, b, d]) => [a, b + 0.04, d] as V3));
    for (let x = x0; x < x1 - 0.01; x += 0.152) wFill(p, c, 14470 + Math.round((x - x0) * 10), x % 0.304 < 0.152 ? '#c3ccce' : '#8d9799', [[x, roofY(zBack) + 0.045, zBack], [x + 0.076, roofY(zBack) + 0.045, zBack], [x + 0.076, yLip + 0.045, zLip], [x, yLip + 0.045, zLip]]);
    wInk(p, c, 14469, [[x0, yBack + 0.045, zBack], [x1, yBack + 0.045, zBack], [x1, yLip + 0.045, zLip], [x0, yLip + 0.045, zLip]], {color: '#3d4448', weight: 1.4});
    wWash(p, c, 14471, '#cfd9dd', 90, [[x0, yLip + 0.045, zLip - 0.7], [x1, yLip + 0.045, zLip - 0.7], [x1, yLip + 0.045, zLip], [x0, yLip + 0.045, zLip]], 0.2, 0.2);
  }
  wFill(p, c, 14500, '#9aa3a6', qz(zLip + 0.01, x0, x1, yLip - 0.05, yLip + 0.02)); // flat steel fascia where water gathers
  wFill(p, c, 14501, C.lipWet, qz(zLip + 0.012, x0, x1, yLip - 0.012, yLip + 0.004)); // wet highlight along the lip
  wInk(p, c, 14502, qz(zLip + 0.014, x0, x1, yLip - 0.05, yLip + 0.02), {color: '#3d4448', weight: 0.8});
  // posts (0.08 m, green) x +-1.85, z -1.55 and -0.05
  for (const x of [-1.85, 1.85]) for (const z of [-1.55, -0.05]) {
    const id = 14600 + Math.round((x + 2) * 10 + (z + 2) * 100);
    paintBox(p, c, id, {x0: x - 0.04, x1: x + 0.04, y0: 0, y1: roofY(z) - 0.02, z0: z - 0.04, z1: z + 0.04}, C.post, {front: 0, left: 0.1, right: 0.3}, {});
    wFill(p, c, id + 9, C.postShade, qz(z + 0.041, x - 0.04, x + 0.04, 0, 0.12)); // wet foot
  }
  wWash(p, c, 14700, C.postShade, 90, qz(-0.04, -1.9, 1.9, 2.15, 2.38), 0.2, 0.3);
};

// ---------------------------------------------------------------- near props (UT12: seven)
const paintProps = (p: Painter, c: YCam, o: BusOpts) => {
  // 1. power pole (-3.6, 0, 1.1) with cables
  paintBox(p, c, 15000, {x0: -3.72, x1: -3.48, y0: 0, y1: 9, z0: 0.98, z1: 1.22}, '#94958f', {front: 0, left: 0.2, right: 0.3}, {});
  paintBox(p, c, 15010, {x0: -4.6, x1: -2.6, y0: 8.2, y1: 8.35, z0: 1.04, z1: 1.16}, '#84857f', {}, {});
  for (let k = 0; k < 3; k++) wInk(p, c, 15020 + k, [[-3.6 + (k - 1) * 0.8, 8.3, 1.1], [-3.0, 8.9 - k * 0.1, 3.0], [1.2, 8.6 - k * 0.2, 6.0], [6, 8.3 - k * 0.1, 9.8]], {color: '#1f2224', weight: 0.9, closed: false});
  // 2. green city bin (2.40, 0, -0.40)
  paintBox(p, c, 15100, {x0: 2.15, x1: 2.65, y0: 0, y1: 0.85, z0: -0.65, z1: -0.15}, '#3f7a52', {front: 0, left: 0.1, right: 0.28}, {ink: true});
  paintBox(p, c, 15110, {x0: 2.12, x1: 2.68, y0: 0.85, y1: 0.92, z0: -0.68, z1: -0.12}, '#2c5a3b', {}, {ink: true});
  wFill(p, c, 15120, '#1c3a28', qz(-0.149, 2.3, 2.5, 0.6, 0.72)); // slot
  // 3. bus route sign pole (2.30, 0, 0.90), blue sign with a bus pictogram (no text)
  paintBox(p, c, 15200, {x0: 2.27, x1: 2.33, y0: 0, y1: 2.7, z0: 0.87, z1: 0.93}, '#8d9496', {front: 0, left: 0.15, right: 0.3}, {});
  wFill(p, c, 15210, '#2f5f9a', qz(0.935, 2.05, 2.55, 2.1, 2.62));
  wFill(p, c, 15211, '#ffffff', qz(0.936, 2.17, 2.43, 2.28, 2.5));
  wFill(p, c, 15212, '#2f5f9a', qz(0.937, 2.2, 2.4, 2.34, 2.46));
  for (const x of [2.23, 2.37]) { const s = sphereAt(c, [x, 2.26, 0.937], 0.035); if (s) hardFill(p, 15213 + Math.round(x * 10), '#ffffff', ell(s.x, s.y, s.r, s.r, 10)); }
  wInk(p, c, 15214, qz(0.938, 2.05, 2.55, 2.1, 2.62), {color: '#1c3a5e', weight: 0.8});
  // 4. puddle along the kerb x -1.0 .. 1.6, z 1.0 .. 1.4 (glassy; ripple rings only in the real world)
  const pud = (r: number): V3[] => Array.from({length: 24}, (_, i): V3 => [0.3 + 0.95 * r * Math.cos((i / 24) * 6.283), 0.004, 1.2 + 0.17 * r * Math.sin((i / 24) * 6.283)]);
  wFill(p, c, 15300, '#4c5a61', pud(1));
  wFill(p, c, 15301, '#6f7f87', pud(0.78).map(([x, y, z]) => [x - 0.1, y + 0.001, z - 0.02] as V3));
  wWash(p, c, 15302, '#e8b765', 60, [[0.5, 0.005, 1.12], [0.8, 0.005, 1.12], [0.75, 0.005, 1.28], [0.45, 0.005, 1.28]], 0.3, 0.2);
  if (o.world === 'real') for (let i = 0; i < 7; i++) {
    const cx = -0.5 + hash(15310 + i) * 1.7, cz = 1.05 + hash(15320 + i) * 0.28, ph = (o.t * 1.8 + hash(15330 + i)) % 1, rr = 0.03 + 0.1 * ph;
    wInk(p, c, 15340 + i, Array.from({length: 12}, (_, k): V3 => [cx + rr * 1.5 * Math.cos((k / 12) * 6.283), 0.006, cz + rr * 0.45 * Math.sin((k / 12) * 6.283)]), {color: mixColor('#e9f1f3', '#7e8d94', ph), weight: 0.8});
  }
  // 5. sodden leaflet at the bench end (blank)
  wFill(p, c, 15400, '#d9d4c6', [[1.0, 0.452, -1.44], [1.15, 0.452, -1.42], [1.17, 0.452, -1.2], [1.02, 0.452, -1.18]]);
  wWash(p, c, 15401, '#8a8678', 90, [[1.0, 0.453, -1.44], [1.15, 0.453, -1.42], [1.1, 0.453, -1.3], [1.01, 0.453, -1.3]], 0.2, 0.4);
  // 6. chained bicycle-rack hoop (-2.6, 0, -0.8)
  const hoop: V3[] = Array.from({length: 13}, (_, i): V3 => { const a = (i / 12) * Math.PI; return [-2.6 + 0.35 * Math.cos(a), 0.7 * Math.sin(a) + 0.02, -0.8]; });
  wInk(p, c, 15500, hoop, {color: '#5f676b', weight: 2.4, closed: false});
  wInk(p, c, 15501, hoop.map(([x, y, z]) => [x + 0.004, y + 0.004, z] as V3), {color: '#aab6bb', weight: 1, closed: false});
  // 7. her water bottle on the bench (-0.6, 0.45, -1.25)
  paintBox(p, c, 15600, {x0: -0.64, x1: -0.56, y0: 0.49, y1: 0.69, z0: -1.29, z1: -1.21}, '#5fa8c9', {top: -0.2}, {ink: true});
  paintBox(p, c, 15610, {x0: -0.62, x1: -0.58, y0: 0.69, y1: 0.73, z0: -1.27, z1: -1.23}, '#e9f1f3', {}, {});
};

export const paintBusStop = (p: Painter, c: YCam, o: BusOpts) => {
  paintSky(p, c);
  o.sky?.(p, c);
  paintBackground(p, c);
  paintGround(p, c, o);
  paintShophouses(p, c);
  paintRoofShadow(p, c);
  o.mid?.(p, c);
  paintShelter(p, c);
  paintProps(p, c, o);
};

/** Placeholder teardrop (6.0 x 4.2 mm, K01) at `top` m under the fascia: point up, round bottom; Film's `drop.ts` replaces it. At < 5 px it is a bright bead. */
const teardrop = (p: Painter, c: YCam, seed: number, x: number, len: number, rise = 0) => {
  const topV: V3 = [x, SHELTER.yLip - 0.05 - rise, SHELTER.zLip + 0.012];
  const q = camPoint(c, topV);
  if (!q) return;
  const u = camUnit(c, topV), h = Math.max(4.5, 0.006 * len * u), w = Math.max(3.2, 0.0042 * len * u);
  const pts: Pt[] = [[q[0], q[1] - h * 0.1], [q[0] + w * 0.55, q[1] + h * 0.45], [q[0] + w * 0.5, q[1] + h * 0.8], [q[0], q[1] + h], [q[0] - w * 0.5, q[1] + h * 0.8], [q[0] - w * 0.55, q[1] + h * 0.45]];
  hardFill(p, seed, '#cfe0e6', pts);
  hardFill(p, seed + 1, '#ffffff', ell(q[0] - w * 0.12, q[1] + h * 0.62, Math.max(0.9, w * 0.14), Math.max(1.1, h * 0.14), 6));
};

/** Pendant drops hanging from the fascia every 25-40 mm (irregular) and, in the real world, the drip curtain (streaks to the pavement at z 0.10) with splashes. */
export const paintLipDrips = (p: Painter, c: YCam, o: BusOpts, span: [number, number] = [-2, 2], beads = true) => {
  let x = span[0] + 0.02, i = 0;
  while (beads && x < span[1]) {
    const k = hash(16000 + i), swell = 0.55 + 0.45 * ((o.world === 'real' ? (o.t * 0.9 + k * 3) % 1 : k));
    if (onScreen(c, [x, SHELTER.yLip, SHELTER.zLip], 40)) {
      const hpx = 0.006 * swell * camUnit(c, [x, SHELTER.yLip - 0.05, SHELTER.zLip]);
      if (!(o.pendant && hpx >= 14 && o.pendant(p, c, x, swell, i))) teardrop(p, c, 16100 + i * 3, x, swell, 0);
    }
    x += 0.025 + 0.015 * hash(16500 + i);
    i++;
  }
  if (o.world !== 'real') return;
  p.inkStill(16900, 'pen', mixColor(C.rain, '#ffffff', 0.45), 1.1);
  for (let j = 0; j < 150; j++) {
    const sx = span[0] + hash(17000 + j) * (span[1] - span[0]);
    const ph = (o.t * (3.2 + 2 * hash(17100 + j)) + hash(17200 + j)) % 1, y1 = SHELTER.yLip - 0.06 - ph * (SHELTER.yLip - 0.06), len = 0.25 + 0.35 * hash(17300 + j);
    const a = camPoint(c, [sx, y1 + len, SHELTER.zLip]), b = camPoint(c, [sx, Math.max(0, y1), SHELTER.zLip]);
    if (a && b && Math.abs(b[1] - a[1]) > 1) p.brush.line(a[0], a[1], b[0], b[1]);
  }
  for (let j = 0; j < 40; j++) { // splash crowns where the curtain lands
    const sx = span[0] + hash(17400 + j) * (span[1] - span[0]), q = camPoint(c, [sx, 0.01, SHELTER.zLip + 0.02]);
    if (!q) continue;
    const u = camUnit(c, [sx, 0, SHELTER.zLip]), r = (0.02 + 0.03 * ((o.t * 2 + hash(17500 + j)) % 1)) * u;
    inkLine(p, 17600 + j, [[q[0] - r, q[1]], [q[0] - r * 0.4, q[1] - r * 0.9], [q[0] + r * 0.4, q[1] - r * 0.9], [q[0] + r, q[1]]], {color: C.crown, weight: 0.9, closed: false, still: true});
  }
};

/** Pendant drops are one source of truth for LF placeholder drops; exported for the look frames' measures. */
export const BUSSTOP_SEEDS = {drips: 16000} as const;
void qx;
