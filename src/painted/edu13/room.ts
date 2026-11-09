import {hardFill, inkLine, INK, washAt, ell} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import {camDist, camPoint, camUnit, type YCam} from '../kit/ycam';
import {flatCircle, paintBox, qx, qy, qz, wFill, wInk, wp, wWash, type Box} from '../edu02/world';

// SET-LR13 (brief EDU-EP13-BRIEF-R1 "Set plan — SET-LR13", metres; Film's W3.1 look-frame room, built from the EP06 SET-LIVINGROOM methods and
// palette as a copy, ENV-P01). Origin on the floor at the foot of the height chart's centre line; +x screen-right (seen from the room),
// +y up, +z from the back wall toward the room/camera; the chart wall is the plane z 0. Warm afternoon sun from the window at screen right.

export const R = {
  wall: '#efdfc2', wallShade: '#d3bf9e', floor: '#b07a4c', floorDark: '#7d5232', sofa: '#4f6f6a', sofaShade: '#2f4648', throw: '#d9a43c', rug: '#b8795a',
  rugBorder: '#d9bf94', wood: '#8a5a3a', cream: '#f3ead6', sun: '#ffe2a0', plant: '#5f8a4a', rose: '#c98b8b', teal: '#6fa3a0',
  mint: '#9fd9bd', butter: '#f2d97a', coral: '#ec8f78', sky: '#8fc3e6',
} as const;

// Staging offsets (user verdict 2026-11-09: keep the original cameras, move the set instead). Everything is the brief's plan plus two shifts:
// OX moves the chart, the actor marks and the print/clock with them +0.5 m along the wall (so the chart is not on the frame edge in CAM-SOFA at yaw 40;
// the chart cameras shift by the same OX, so their framing and the VD21 numbers are unchanged); DS moves the sofa group (sofa, window, rug, bowl,
// slippers, sun, MAN's seat, the dog) +0.15 m so the giant's head (x up to OX + 2.25) stays clear of the sofa arm.
export const OX = 0.5, DS = 0.15;
export const LR13 = {
  wallX: [-2.6, 6.4] as [number, number], wallH: 2.8, seat: 0.3, arm: 0.48, back: 0.72,
  sofa: {x0: 2.6 + DS, x1: 4.6 + DS, front: 0.85}, window: {x0: 4.95 + DS, x1: 6.15 + DS, y0: 0.9, y1: 2.3},
  manSeat: [3.15 + DS, 0.3, 0.45] as V3, manSeatFeet: [3.15 + DS, 0, 0.9] as V3, dogAt: [4.0 + DS, 0.3, 0.45] as V3,
  chart: {x: OX, w: 0.36, top: 2.1}, manMark: [OX, 0, 0.35] as V3, giantMark: [OX + 1.35, 0, 0.35] as V3,
} as const;

export type RoomItem = {at: V3; draw: (p: Painter, c: YCam) => void; /** 'sofa' = between the sofa back and its front arm/legs; default 'floor' = after all furniture. */ layer?: 'sofa' | 'floor'};
export type RoomOpts = {t: number; cast?: RoomItem[]; /** Chart mark rows (m): the real flea 0.15, MAN 0.42 (B05). */ marks?: {y: number; color: string}[]; sun?: boolean};

const wall = (p: Painter, c: YCam) => {
  const [x0, x1] = LR13.wallX, H = LR13.wallH;
  wFill(p, c, 7000, R.wall, qz(0, x0, x1, 0, H));
  wFill(p, c, 7001, R.wallShade, qx(x0, 0, H, 0, 8));
  wFill(p, c, 7002, mixColor(R.wall, '#fff6e2', 0.4), qy(H, x0, x1, 0, 8)); // ceiling plane (visible only when the camera looks up)
  wFill(p, c, 7003, mixColor(R.wall, '#ffffff', 0.5), qz(0.002, x0, x1, H - 0.1, H)); // cornice
  for (let i = 0; i < 16; i++) { // roller streaks and soft stains
    const x = x0 + (x1 - x0) * hash(i * 3.3), y = 0.3 + 2.2 * hash(i * 5.1), w = 0.2 + 0.4 * hash(i * 7.7);
    wWash(p, c, 7020 + i, mixColor(R.wallShade, '#b89d78', hash(i * 9.1)), 18, [[x, y, 0.003], [x + w, y + 0.03, 0.003], [x + w * 0.9, y - 0.3, 0.003], [x + 0.05, y - 0.26, 0.003]], 0.5, 0.6);
  }
  wFill(p, c, 7040, '#f5ecd8', qz(0.004, x0, x1, 0, 0.08)); // cream skirting
  wInk(p, c, 7041, [[x0, 0.08, 0.004], [x1, 0.08, 0.004]], {closed: false, weight: 0.7, color: mixColor(R.wallShade, INK, 0.4)});
};

const windowPlate = (p: Painter, c: YCam) => {
  const {x0, x1, y0, y1} = LR13.window, z = 0.004;
  paintBox(p, c, 7050, {x0: x0 - 0.05, x1: x1 + 0.05, y0: y0 - 0.05, y1: y1 + 0.05, z0: z - 0.004, z1: z + 0.012}, '#f3efe6', {}, {ink: true});
  wFill(p, c, 7051, '#e6f1f8', qz(z + 0.014, x0, x1, y0, y1));
  wFill(p, c, 7052, '#fffaf0', qz(z + 0.015, x0, x1, y0 + (y1 - y0) * 0.72, y1)); // blown-out sky at the top
  for (const [dx, h, col] of [[0.0, 0.3, '#b9c6d0'], [0.25, 0.42, '#c8d3da'], [0.5, 0.26, '#b0c0cc'], [0.75, 0.36, '#c3ced6']] as const)
    wFill(p, c, 7053 + Math.round(dx * 8), col, qz(z + 0.016, x0 + dx * (x1 - x0), x0 + (dx + 0.22) * (x1 - x0), y0, y0 + h)); // far towers
  wFill(p, c, 7060, '#f3efe6', qz(z + 0.02, (x0 + x1) / 2 - 0.012, (x0 + x1) / 2 + 0.012, y0, y1));
  wFill(p, c, 7061, '#f3efe6', qz(z + 0.02, x0, x1, (y0 + y1) / 2 - 0.012, (y0 + y1) / 2 + 0.012));
  paintBox(p, c, 7062, {x0: x0 - 0.08, x1: x1 + 0.08, y0: y0 - 0.08, y1: y0 - 0.05, z0: z, z1: z + 0.1}, '#f3efe6', {}, {ink: true}); // sill
  wWash(p, c, 7063, '#fffaf0', 150, qz(z + 0.06, x1 - 0.55, x1 + 0.22, y0 - 0.1, y1 + 0.2), 0.4, 0.5); // sheer curtain at the right
  wWash(p, c, 7064, '#ffffff', 90, qz(z + 0.065, x1 - 0.25, x1 + 0.05, y0 - 0.1, y1 + 0.18), 0.4, 0.5);
  wInk(p, c, 7065, [[x1 - 0.6, y1 + 0.2, z + 0.06], [x1 + 0.28, y1 + 0.2, z + 0.06]], {closed: false, weight: 1.6, color: '#5a4a3a'});
};

/** Height chart (CL01, VD07): board with ticks and four colour steps, a giraffe sticker at the top, no numerals. */
export const chart = (p: Painter, c: YCam, marks: {y: number; color: string}[] = []) => {
  const {x, w, top} = LR13.chart, x0 = x - w / 2, x1 = x + w / 2, z = 0.012;
  paintBox(p, c, 7100, {x0: x0 - 0.02, x1: x1 + 0.02, y0: 0, y1: top + 0.02, z0: 0.004, z1: z}, '#f5efe2', {}, {ink: true});
  [R.mint, R.butter, R.coral, R.sky].forEach((col, i) => wFill(p, c, 7101 + i, col, qz(z + 0.002, x0 + 0.01, x1 - 0.01, i * 0.5, i * 0.5 + 0.5)));
  wFill(p, c, 7105, '#f5efe2', qz(z + 0.002, x0 + 0.01, x1 - 0.01, 2.0, top));
  for (let k = 0; k <= 20; k++) { // ticks every 0.10 m, long every 0.50
    const y = k * 0.1, long = k % 5 === 0;
    wInk(p, c, 7110 + k, [[x1 - 0.01 - (long ? 0.16 : 0.08), y, z + 0.004], [x1 - 0.01, y, z + 0.004]], {closed: false, weight: long ? 1.3 : 0.8, color: '#3a3028'});
  }
  // giraffe sticker (soft yellow, spots), top centre
  const gy = 1.9;
  wFill(p, c, 7140, '#f0c24a', [[x - 0.03, gy - 0.1, z + 0.004], [x + 0.03, gy - 0.1, z + 0.004], [x + 0.035, gy + 0.1, z + 0.004], [x - 0.02, gy + 0.1, z + 0.004]]);
  const head = wp(c, Array.from({length: 14}, (_, i): V3 => [x + 0.03 + 0.065 * Math.cos((i / 14) * 6.283), gy + 0.12 + 0.045 * Math.sin((i / 14) * 6.283), z + 0.005]));
  if (head.length > 2) { hardFill(p, 7141, '#f0c24a', head); inkLine(p, 7142, head, {weight: 0.7, color: '#8a5a1a'}); }
  for (const [dx, dy] of [[-0.01, 0.0], [0.01, -0.05], [-0.015, 0.06], [0.02, 0.1]] as const) {
    const q = camPoint(c, [x + dx, gy + dy, z + 0.006]), u = camUnit(c, [x, gy, z]);
    if (q) hardFill(p, 7150 + Math.round(dy * 100), '#a8681e', ell(q[0], q[1], 0.011 * u, 0.011 * u, 8));
  }
  marks.forEach((m, i) => wFill(p, c, 7160 + i, m.color, qz(z + 0.006, x0 - 0.04, x1 + 0.04, m.y - 0.006, m.y + 0.006)));
};

const wallThings = (p: Painter, c: YCam) => {
  // framed soft green landscape above the flea zone (no text)
  const P = {x0: OX + 1.0, x1: OX + 1.7, y0: 1.6, y1: 2.1, z: 0.006};
  wFill(p, c, 7200, '#3a2e28', qz(P.z, P.x0 - 0.03, P.x1 + 0.03, P.y0 - 0.03, P.y1 + 0.03));
  wFill(p, c, 7201, '#e8f0d6', qz(P.z + 0.002, P.x0, P.x1, P.y0, P.y1));
  wWash(p, c, 7202, '#8fb36a', 200, qz(P.z + 0.004, P.x0, P.x1, P.y0, P.y0 + 0.24), 0.3, 0.4);
  wWash(p, c, 7203, '#5f8a4a', 190, qz(P.z + 0.005, P.x0 + 0.1, P.x1, P.y0, P.y0 + 0.12), 0.3, 0.4);
  wWash(p, c, 7204, '#cfe3ee', 180, qz(P.z + 0.004, P.x0, P.x1, P.y0 + 0.3, P.y1), 0.3, 0.4);
  // round wall clock, no digits, hands at 4:00
  const C: V3 = [OX + 2.1, 2.3, 0.006], ring = (r: number, zz = C[2]) => Array.from({length: 24}, (_, i): V3 => [C[0] + r * Math.cos((i / 24) * 6.283), C[1] + r * Math.sin((i / 24) * 6.283), zz]);
  const rim = wp(c, ring(0.16)), face = wp(c, ring(0.138, C[2] + 0.004));
  if (rim.length > 2) hardFill(p, 7210, '#5a4636', rim);
  if (face.length > 2) hardFill(p, 7211, '#f6efe0', face);
  for (let k = 0; k < 12; k++) { const a = (k / 12) * 6.283; wInk(p, c, 7220 + k, [[C[0] + 0.11 * Math.cos(a), C[1] + 0.11 * Math.sin(a), C[2] + 0.006], [C[0] + 0.125 * Math.cos(a), C[1] + 0.125 * Math.sin(a), C[2] + 0.006]], {closed: false, weight: 0.7, color: '#4a3a30'}); }
  wInk(p, c, 7240, [[C[0], C[1], C[2] + 0.007], [C[0] - 0.12 * Math.cos(Math.PI / 6) * 0.9, C[1] - 0.12 * Math.sin(Math.PI / 6) * 0.9 * 0.2, C[2] + 0.007]], {closed: false, weight: 1.2, color: '#2b211c'});
  wInk(p, c, 7241, [[C[0], C[1], C[2] + 0.007], [C[0] + 0.1, C[1], C[2] + 0.007]], {closed: false, weight: 1.6, color: '#2b211c'});
  // low teak cabinet at the left with a pothos and two books
  paintBox(p, c, 7250, {x0: -2.3, x1: -1.1, y0: 0.08, y1: 0.55, z0: 0.0, z1: 0.45}, R.wood, {}, {ink: true});
  for (const [x, z] of [[-2.25, 0.05], [-1.15, 0.05], [-2.25, 0.4], [-1.15, 0.4]] as const) paintBox(p, c, 7255 + Math.round(x * 3 + z * 10), {x0: x - 0.02, x1: x + 0.02, y0: 0, y1: 0.08, z0: z - 0.02, z1: z + 0.02}, '#3a2a20');
  paintBox(p, c, 7260, {x0: -2.2, x1: -2.0, y0: 0.55, y1: 0.58, z0: 0.1, z1: 0.3}, '#c9743f', {}, {ink: true});
  paintBox(p, c, 7261, {x0: -2.18, x1: -1.98, y0: 0.58, y1: 0.6, z0: 0.12, z1: 0.28}, '#4f6f8a', {}, {ink: true});
  paintBox(p, c, 7262, {x0: -1.6, x1: -1.3, y0: 0.55, y1: 0.72, z0: 0.1, z1: 0.35}, '#d8c4a8', {}, {ink: true}); // pot
  for (let k = 0; k < 9; k++) {
    const a = -1.2 + 2.4 * hash(k * 1.7), L = 0.25 + 0.3 * hash(k * 3.1), base: V3 = [-1.45, 0.72, 0.22], tip: V3 = [base[0] + Math.sin(a) * L * 0.6, base[1] + L * 0.7 - (k % 2) * 0.35, base[2] + 0.1 * Math.cos(a)];
    const q0 = camPoint(c, base), q1 = camPoint(c, tip), u = camUnit(c, tip);
    if (q0 && q1) washAt(p, 7270 + k, mixColor(R.plant, '#2f4a22', 0.5 * hash(k)), 220, [q0, [(q0[0] + q1[0]) / 2 + 0.03 * u, (q0[1] + q1[1]) / 2 - 0.01 * u], q1, [(q0[0] + q1[0]) / 2 - 0.02 * u, (q0[1] + q1[1]) / 2 + 0.02 * u]], 0.1, 0.3);
  }
};

const floor = (p: Painter, c: YCam, sun: boolean) => {
  const [x0, x1] = LR13.wallX;
  wFill(p, c, 7300, R.floor, qy(0, x0, x1, 0, 8));
  for (let k = 0; k <= 32; k++) wInk(p, c, 7310 + k, [[x0, 0.001, k * 0.25], [x1, 0.001, k * 0.25]], {closed: false, weight: 0.5, color: mixColor(R.floor, R.floorDark, 0.7)}); // planks along x
  for (let k = 0; k < 60; k++) { const z = 0.25 * Math.floor(hash(k * 2.3) * 32), x = x0 + (x1 - x0) * hash(k * 4.1); wInk(p, c, 7350 + k, [[x, 0.001, z], [x, 0.001, z + 0.25]], {closed: false, weight: 0.4, color: R.floorDark}); }
  // sun patches from the window (screen right): floor around x 3.0 -> 5.5, z 0.9 -> 3.0
  if (sun) {
    wWash(p, c, 7400, R.sun, 150, [[3.2 + DS, 0.003, 0.95], [4.9 + DS, 0.003, 0.95], [5.5 + DS, 0.003, 2.9], [3.8 + DS, 0.003, 2.9]], 0.3, 0.5);
    wWash(p, c, 7401, '#fff3c8', 130, [[3.5 + DS, 0.004, 1.2], [4.5 + DS, 0.004, 1.2], [4.95 + DS, 0.004, 2.5], [3.95 + DS, 0.004, 2.5]], 0.3, 0.5);
    wWash(p, c, 7402, R.sun, 150, qz(0.006, 4.65 + DS, 5.95 + DS, 0.1, 0.85), 0.3, 0.5); // lower wall right of the sofa
  }
  // woven rug 2.4 x 1.6 centred (3.6, 2.0), a bowl, slippers
  wFill(p, c, 7410, R.rugBorder, qy(0.004, 2.4 + DS, 4.8 + DS, 1.2, 2.8));
  wFill(p, c, 7411, R.rug, qy(0.006, 2.5 + DS, 4.7 + DS, 1.3, 2.7));
  for (let k = 0; k < 5; k++) wInk(p, c, 7412 + k, [[2.5 + DS, 0.007, 1.3 + k * 0.28], [4.7 + DS, 0.007, 1.3 + k * 0.28]], {closed: false, weight: 0.6, color: mixColor(R.rug, '#7a3a26', 0.5)});
  if (sun) wWash(p, c, 7420, R.sun, 130, [[3.4 + DS, 0.008, 1.3], [4.6 + DS, 0.008, 1.3], [4.7 + DS, 0.008, 2.6], [3.6 + DS, 0.008, 2.6]], 0.3, 0.5);
  const bowl = flatCircle(c, [5.2 + DS, 0.07, 1.4], 0.12, 20);
  if (bowl.length > 2) { paintBox(p, c, 7430, {x0: 5.1 + DS, x1: 5.3 + DS, y0: 0, y1: 0.07, z0: 1.3, z1: 1.5}, '#8aa0b0', {}, {ink: true}); hardFill(p, 7431, '#cfe3ee', bowl); }
  for (const [x, z, i] of [[2.85 + DS, 1.1, 0], [2.97 + DS, 1.1, 1]] as const) paintBox(p, c, 7440 + i, {x0: x - 0.05, x1: x + 0.05, y0: 0, y1: 0.03, z0: z - 0.12, z1: z + 0.12}, '#b9d0c8', {}, {ink: true});
};

const fan = (p: Painter, c: YCam, t: number) => { // standing fan at (-0.95, 0, 1.40), 1.20 tall, slow oscillation
  const [fx, , fz] = [-0.95, 0, 1.4];
  const base = flatCircle(c, [fx, 0.03, fz], 0.2, 20);
  if (base.length > 2) hardFill(p, 7500, '#3a3a40', base);
  wInk(p, c, 7501, [[fx, 0.03, fz], [fx, 1.0, fz]], {closed: false, weight: 2.4, color: '#4a4a52'});
  const yaw = 0.35 * Math.sin(t * 0.5), cy = 1.08, n = 24;
  const ring = Array.from({length: n}, (_, i): V3 => [fx + 0.22 * Math.cos((i / n) * 6.283) * Math.cos(yaw), cy + 0.22 * Math.sin((i / n) * 6.283), fz + 0.22 * Math.cos((i / n) * 6.283) * Math.sin(yaw) * 0.0 + 0.22 * Math.cos((i / n) * 6.283) * Math.sin(yaw)]);
  const q = wp(c, ring);
  if (q.length > 2) { washAt(p, 7502, '#e9eef0', 90, q, 0.1, 0.2); inkLine(p, 7503, q, {weight: 1.1, color: '#4a4a52'}); }
  for (let k = 0; k < 3; k++) { const a = (k / 3) * 6.283 + 0.4; wInk(p, c, 7504 + k, [[fx, cy, fz], [fx + 0.2 * Math.cos(a) * Math.cos(yaw), cy + 0.2 * Math.sin(a), fz + 0.2 * Math.cos(a) * Math.sin(yaw)]], {closed: false, weight: 1.2, color: '#4a4a52'}); }
};

const soft = (p: Painter, c: YCam, seed: number, b: Box, color: string, lit = 0) =>
  paintBox(p, c, seed, b, mixColor(color, R.sun, lit), {top: -0.1, front: 0.06, right: 0.22, left: 0.1}, {ink: true});

const sofaBack = (p: Painter, c: YCam, sun: boolean) => {
  const {x0, x1} = LR13.sofa, S = LR13.seat, A = LR13.arm, B = LR13.back, lit = sun ? 0.08 : 0;
  soft(p, c, 7600, {x0, x1, y0: 0.08, y1: B, z0: 0.0, z1: 0.17}, R.sofa, lit);
  for (let i = 0; i < 3; i++) soft(p, c, 7610 + i * 10, {x0: x0 + 0.15 + i * 0.567, x1: x0 + 0.15 + (i + 1) * 0.567, y0: S - 0.02, y1: B - 0.04, z0: 0.17, z1: 0.31}, R.sofa, lit * (1 + i * 0.4));
  soft(p, c, 7640, {x0, x1: x0 + 0.15, y0: 0.08, y1: A, z0: 0.0, z1: 0.85}, R.sofa, lit); // left arm
  for (let i = 0; i < 3; i++) soft(p, c, 7650 + i * 10, {x0: x0 + 0.15 + i * 0.567, x1: x0 + 0.15 + (i + 1) * 0.567, y0: 0.08, y1: S, z0: 0.17, z1: 0.85}, R.sofa, lit * (1 + i * 0.5));
  // mustard throw over the right arm, two cushions
  wFill(p, c, 7690, R.throw, [[x1 - 0.17, A + 0.01, 0.12], [x1 + 0.01, A + 0.01, 0.14], [x1 + 0.01, A - 0.01, 0.7], [x1 - 0.17, A - 0.01, 0.68]]);
  wFill(p, c, 7691, mixColor(R.throw, '#6a4a1a', 0.25), [[x1 - 0.17, A + 0.01, 0.12], [x1 - 0.16, S + 0.02, 0.2], [x1 - 0.16, S + 0.02, 0.62], [x1 - 0.17, A - 0.01, 0.68]]);
  paintBox(p, c, 7692, {x0: x0 + 0.17, x1: x0 + 0.45, y0: S, y1: S + 0.25, z0: 0.2, z1: 0.3}, R.rose, {}, {ink: true});
  paintBox(p, c, 7693, {x0: x1 - 0.5, x1: x1 - 0.2, y0: S, y1: S + 0.24, z0: 0.2, z1: 0.3}, R.teal, {}, {ink: true});
  for (const [x, z] of [[x0 + 0.05, 0.05], [x1 - 0.05, 0.05], [x0 + 0.05, 0.8], [x1 - 0.05, 0.8]] as const) paintBox(p, c, 7700 + Math.round(x * 10 + z * 3), {x0: x - 0.02, x1: x + 0.02, y0: 0, y1: 0.08, z0: z - 0.02, z1: z + 0.02}, '#3a2a20');
};
const sofaFront = (p: Painter, c: YCam, sun: boolean) => soft(p, c, 7720, {x0: LR13.sofa.x1 - 0.15, x1: LR13.sofa.x1, y0: 0.08, y1: LR13.arm, z0: 0.0, z1: 0.85}, R.sofa, sun ? 0.06 : 0);

/** SET-LR13 with the cast between the sofa back and its front arm (`layer: 'sofa'`) and in front of everything else (default). */
export const paintRoom13 = (p: Painter, c: YCam, o: RoomOpts) => {
  const sun = o.sun !== false, layer = (l: 'sofa' | 'floor') => (o.cast ?? []).filter((it) => (it.layer ?? 'floor') === l).sort((a, b) => camDist(c, b.at) - camDist(c, a.at)).forEach((it) => it.draw(p, c));
  hardFill(p, 6999, R.wallShade, [[-200, -200], [1300, -200], [1300, 2200], [-200, 2200]]);
  wall(p, c);
  windowPlate(p, c);
  chart(p, c, o.marks);
  wallThings(p, c);
  floor(p, c, sun);
  fan(p, c, o.t);
  sofaBack(p, c, sun);
  layer('sofa');
  sofaFront(p, c, sun);
  layer('floor');
};
