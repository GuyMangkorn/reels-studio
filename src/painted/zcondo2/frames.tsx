import {useCallback, type ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {ell, finite, formDir, hardFill, planeBand, washAt} from '../kit/draw';
import {makePainter, mixColor, type Painter, type Pt} from '../kit/painter';
import {Grain} from '../kit/screen';
import {smooth} from './freeze';
import {clipConvex, hatchWith, inkWash, inkWashSoft, strokeWith, type Medium} from './look';

// ZCONDO2-SHORT-TH W3.1 look frames in LK-S (user, 3 Nov 2026: all ink and wash, soft thin warm-brown figure line), one per
// location, each painted from that location's first shot (brief VB-ZC2-SHORT-R1.3). Finished grade at full size, frame 0,
// no camera drift (the push is a scene-sheet decision), no captions. Same medium as ZC2-LKS (look.tsx): set = inkWash,
// figures = inkWashSoft. Staging numbers are estimates (Film), recorded per frame below.

export const PAPER = '#efe6d2';
type V3 = [number, number, number];
/** One-point perspective camera looking +z (W-CORR) or along any axis already rotated into +z: f px, principal point (cx, cy). */
const camera = (f: number, cx: number, cy: number, eye: V3) => ([x, y, z]: V3): Pt => {
  const d = Math.max(0.05, z - eye[2]);
  return [cx + (f * (x - eye[0])) / d, cy - (f * (y - eye[1])) / d];
};
type Ctx = {p: Painter; S: Medium; F: Medium};
const pen = (c: Ctx, id: number, pts: Pt[], color: string, w: number, closed = false, curve = 0) => strokeWith(c.p, id, pts, 'pen', color, w, closed, curve);
/** Flat translucent wash (no texture, no bleed). */
const tint = (c: Ctx, seed: number, color: string, alpha: number, pts: Pt[]) => {
  if (!finite(pts)) return;
  const b = c.p.brush;
  b.seed(seed);
  b.noStroke();
  b.noFill();
  b.wash(color, alpha);
  b.polygon(pts);
  b.noWash();
};
/** Soft glow: three stacked translucent washes, each larger and fainter. */
const glow = (c: Ctx, seed: number, color: string, cx: number, cy: number, rx: number, ry: number, a = 60) => {
  [1.0, 0.66, 0.4].forEach((s, i) => tint(c, seed + i, color, a * (0.5 + i * 0.4), ell(cx, cy, rx * s, ry * s, 28)));
};
const shade = (pts: Pt[], key: Pt, from = 0.58) => planeBand(pts, formDir(pts, key), from);
const lit = (pts: Pt[], key: Pt, to = 0.26) => planeBand(pts, formDir(pts, key), 0, to);
const mapPts = (pts: Pt[], f: (q: Pt) => Pt) => pts.map(f);

// =================================================================== L1 corridor, ZC2-B01-SH02
/**
 * Your view down the corridor, long lens. W-CORR (brief): origin floor on the corridor centreline outside your door, +z to the
 * far window, +x right looking +z, +y up, metres. Camera (estimate): eye (-0.40, 1.50, 0), f 6800 px (vertical FOV ~16 deg),
 * horizon y 500 (raised so the figure stays above the caption band), corridor 1.8 m wide, 2.6 m ceiling, end wall z 30.
 * The infected stands at (0.45, 0, 28.0) in profile facing its own door on the right wall (z 27.6-28.5), dark against the
 * bright end window: 1.65 m = ~400 px. Your own door's edge is a soft dark strip at frame left (seen through the gap).
 */
const L1 = (c: Ctx) => {
  const P = camera(6800, 540, 500, [-0.4, 1.5, 0]);
  const far = (col: string, z: number) => mixColor(col, '#ece6d6', Math.min(0.55, Math.max(0, (z - 9) / 34)));
  const C = {wall: '#b4ad9c', ceil: '#c3bdae', floor: '#a19784', door: '#76685a', frame: '#958a78', ink: '#2a211b', win: '#f7f3e8'};
  const Z0 = 5.5, Z1 = 30;
  // Ceiling, floor, walls as depth slabs so each slab can fade toward the window light.
  const slabs = [5.5, 8, 10.5, 13, 15.5, 18, 20.5, 23, 25.5, 28, 30];
  slabs.slice(0, -1).forEach((z0, i) => {
    const z1 = slabs[i + 1];
    c.S.flat(10 + i, far(C.ceil, z0), [P([-0.9, 2.6, z0]), P([0.9, 2.6, z0]), P([0.9, 2.6, z1]), P([-0.9, 2.6, z1])]);
    c.S.flat(30 + i, far(C.floor, z0), [P([-0.9, 0, z0]), P([0.9, 0, z0]), P([0.9, 0, z1]), P([-0.9, 0, z1])]);
    c.S.flat(50 + i, far(C.wall, z0), [P([-0.9, 0, z0]), P([-0.9, 2.6, z0]), P([-0.9, 2.6, z1]), P([-0.9, 0, z1])]);
    c.S.flat(70 + i, far(mixColor(C.wall, C.ink, 0.12), z0), [P([0.9, 0, z0]), P([0.9, 2.6, z0]), P([0.9, 2.6, z1]), P([0.9, 0, z1])]);
  });
  // End wall and its window (bare paper: the brightest area), far towers as pale shapes in it.
  c.S.flat(90, far(C.wall, 30), [P([-0.9, 0, Z1]), P([0.9, 0, Z1]), P([0.9, 2.6, Z1]), P([-0.9, 2.6, Z1])]);
  const win = [P([-0.72, 0.82, Z1]), P([0.72, 0.82, Z1]), P([0.72, 2.36, Z1]), P([-0.72, 2.36, Z1])];
  c.S.flat(91, C.win, win);
  tint(c, 92, '#d9d6cc', 160, [P([-0.72, 0.82, Z1]), P([-0.4, 0.82, Z1]), P([-0.4, 1.32, Z1]), P([-0.55, 1.36, Z1]), P([-0.72, 1.2, Z1])]);
  tint(c, 93, '#dcd9cf', 150, [P([0.2, 0.82, Z1]), P([0.72, 0.82, Z1]), P([0.72, 1.12, Z1]), P([0.44, 1.2, Z1]), P([0.3, 1.05, Z1])]);
  [[-0.03, 0.03, 0.82, 2.36], [-0.72, 0.72, 1.56, 1.6]].forEach(([x0, x1, y0, y1], i) => c.S.flat(94 + i, '#8d8474', [P([x0, y0, Z1]), P([x1, y0, Z1]), P([x1, y1, Z1]), P([x0, y1, Z1])]));
  pen(c, 96, [...win, win[0]], '#6d6253', 0.9);
  // Window light spilling back along the walls and floor (UT04: the source lights its surroundings).
  tint(c, 97, '#f4efe2', 70, [P([-0.9, 0, 23]), P([-0.9, 2.6, 23]), P([-0.9, 2.6, Z1]), P([-0.9, 0, Z1])]);
  tint(c, 98, '#f4efe2', 60, [P([0.9, 0, 23]), P([0.9, 2.6, 23]), P([0.9, 2.6, Z1]), P([0.9, 0, Z1])]);
  // Floor tile grout: long lines to the vanishing point and cross joints every 0.6 m (only where they read).
  [-0.6, -0.3, 0, 0.3, 0.6].forEach((x, i) => pen(c, 100 + i, [P([x, 0, Z0]), P([x, 0, Z1])], '#857b69', 0.5));
  for (let z = 6, k = 0; z < 22; z += 0.6, k++) pen(c, 110 + k, [P([-0.9, 0, z]), P([0.9, 0, z])], '#8d8370', 0.45);
  // Wall base trim both sides.
  pen(c, 140, [P([-0.9, 0.1, Z0]), P([-0.9, 0.1, Z1])], '#7d7262', 0.7);
  pen(c, 141, [P([0.9, 0.1, Z0]), P([0.9, 0.1, Z1])], '#7d7262', 0.7);
  // Unit doors: left wall and right wall (the infected's own door is the last on the right).
  const door = (seed: number, side: -1 | 1, z: number, tone = 1) => {
    const x = 0.9 * side, x2 = x - side * 0.0;
    const zf = z + 0.95;
    const fr = [P([x2, 0, z - 0.06]), P([x2, 2.16, z - 0.06]), P([x2, 2.16, zf + 0.06]), P([x2, 0, zf + 0.06])];
    c.S.flat(seed, far(C.frame, z), fr);
    c.S.flat(seed + 1, far(mixColor(C.door, '#ffffff', 0.08 * tone), z), [P([x2, 0, z]), P([x2, 2.1, z]), P([x2, 2.1, zf]), P([x2, 0, zf])]);
    pen(c, seed + 2, [P([x2, 2.1, z]), P([x2, 2.1, zf])], mixColor(C.ink, '#ece6d6', 0.3), 0.6);
    pen(c, seed + 3, [P([x2, 0, zf]), P([x2, 2.1, zf])], mixColor(C.ink, '#ece6d6', 0.3), 0.6);
    // Lever and a small number plate.
    pen(c, seed + 4, [P([x2, 1.0, zf - 0.08]), P([x2, 1.0, zf - 0.2])], '#d8d2c2', 1.2);
    c.S.flat(seed + 5, far('#d9d2c0', z), [P([x2, 1.56, z + 0.42]), P([x2, 1.66, z + 0.42]), P([x2, 1.66, z + 0.54]), P([x2, 1.56, z + 0.54])]);
  };
  [8.2, 13.6, 19.0, 24.4].forEach((z, i) => door(200 + i * 10, -1, z));
  [16.6, 22.0, 27.6].forEach((z, i) => door(250 + i * 10, 1, z, i === 2 ? 0 : 1));
  // Shoes outside the doors (the Thai condo corridor): pairs of slippers and sneakers on the floor by each door.
  // Shoes seen from the heel (the long lens shows their height, not their footprint): a rounded upper and a pale sole line.
  const shoe = (seed: number, x: number, z: number, col: string) => {
    const k0 = 6800 / z, [u, v] = P([x, 0, z]);
    const w = 0.045 * k0, h = 0.075 * k0;
    const up = smooth([[u - w, v], [u - w * 1.05, v - h * 0.55], [u - w * 0.7, v - h], [u + w * 0.7, v - h], [u + w * 1.05, v - h * 0.55], [u + w, v]], 3);
    c.S.flat(seed, far(mixColor(C.floor, C.ink, 0.4), z), ell(u + w * 0.3, v + 2, w * 1.5, Math.max(2, h * 0.12), 12));
    c.S.flat(seed + 1, far(col, z), up);
    c.S.flat(seed + 2, far(mixColor(col, C.ink, 0.45), z), ell(u, v - h * 0.86, w * 0.55, h * 0.12, 10));
    c.S.flat(seed + 3, far('#e8e2d2', z), [[u - w, v - h * 0.16], [u + w, v - h * 0.16], [u + w, v], [u - w, v]]);
    pen(c, seed + 4, up, far('#3a3028', z), 0.5, false, 0.3);
  };
  [[-0.72, 8.5, '#5a6c80'], [-0.6, 8.5, '#5a6c80'], [-0.74, 13.9, '#d8d1c0'], [-0.63, 13.9, '#d8d1c0'], [-0.68, 19.4, '#8a5a44'], [-0.57, 19.4, '#8a5a44'],
    [-0.73, 24.7, '#cfc8b8'], [0.62, 16.9, '#3e4a58'], [0.51, 16.9, '#3e4a58'], [0.72, 22.3, '#d9d2c4'], [0.62, 22.5, '#6c7a5c']].forEach(([x, z, col], i) => shoe(300 + i * 5, x as number, z as number, col as string));
  // Fluorescent tubes across the ceiling; the one at z 21.5 is dim (flickering). Halo and floor reflection are soft washes.
  [12.5, 15.5, 18.5, 21.5, 24.5, 27.5].forEach((z, i) => {
    const dim = z === 21.5;
    const t = [P([-0.6, 2.56, z]), P([0.6, 2.56, z])];
    // A lighter band of ceiling round each lit tube (light on its surroundings, UT04), flat so it does not read as cloud.
    if (!dim) tint(c, 400 + i, '#f7f3e8', 90, [P([-0.9, 2.6, z - 0.5]), P([0.9, 2.6, z - 0.5]), P([0.9, 2.6, z + 0.6]), P([-0.9, 2.6, z + 0.6])]);
    c.S.flat(420 + i, dim ? '#a29b8d' : '#fdfcf6', [t[0], t[1], [t[1][0], t[1][1] + 7], [t[0][0], t[0][1] + 7]]);
    pen(c, 426 + i, [[t[0][0], t[0][1] + 8], [t[1][0], t[1][1] + 8]], '#8a8273', 0.5);
  });
  // The window light on the far floor: a flat lighter wash from the end wall toward camera.
  tint(c, 440, '#f2ede0', 80, [P([-0.9, 0, 22]), P([0.9, 0, 22]), P([0.9, 0, Z1]), P([-0.9, 0, Z1])]);
  // Architecture ink: corners of walls with ceiling and floor, so the set is drawn, not flat vector (UT11).
  [[-0.9, 0], [0.9, 0], [-0.9, 2.6], [0.9, 2.6]].forEach(([x, y], i) => pen(c, 450 + i, [P([x, y, Z0]), P([x, y, Z1])], '#4a3d33', 0.9));
  pen(c, 455, [P([-0.9, 0, Z1]), P([-0.9, 2.6, Z1]), P([0.9, 2.6, Z1]), P([0.9, 0, Z1])], '#4a3d33', 0.8);
  // Pen hatch on the shadow side: the right wall and the near ceiling.
  hatchWith(c.p, 460, [P([0.9, 0.1, 16]), P([0.9, 2.5, 16]), P([0.9, 2.5, Z1]), P([0.9, 0.1, Z1])], 'pen', '#3a2c24', 0.4, 9, 70, 0.3);
  hatchWith(c.p, 461, [P([-0.9, 2.6, 10]), P([0.9, 2.6, 10]), P([0.9, 2.6, 13]), P([-0.9, 2.6, 13])], 'pen', '#3a2c24', 0.4, 10, 15, 0.3);
  // The infected: profile facing its door (+x), head hanging, arms down; a dark card at z 28.
  const zf = 28.0, k = 6800 / zf;
  const Q = ([x, y]: Pt): Pt => [540 + k * (0.45 + x + 0.4), 500 - k * (y - 1.5)];
  const body = smooth([[-0.09, 0], [0.17, 0], [0.15, 0.04], [0.06, 0.08], [0.05, 0.3], [0.07, 0.48], [0.09, 0.56], [0.1, 0.75], [0.13, 0.95], [0.11, 1.2],
    [0.1, 1.32], [0.12, 1.36], [0.18, 1.38], [0.24, 1.35], [0.3, 1.38], [0.34, 1.43], [0.33, 1.5], [0.3, 1.56], [0.23, 1.6], [0.14, 1.58],
    [0.1, 1.5], [0.07, 1.44], [-0.04, 1.41], [-0.12, 1.26], [-0.12, 1.0], [-0.13, 0.85], [-0.1, 0.6], [-0.07, 0.45], [-0.09, 0.3], [-0.09, 0.06]], 4).map(Q);
  c.F.base(500, '#45463e', body);
  // Undershirt a step lighter (sleeveless), shorts, the hanging arm in front, lank hair, the ear.
  const shirt = smooth([[-0.12, 0.9], [0.12, 0.92], [0.11, 1.2], [0.1, 1.32], [0.04, 1.37], [-0.04, 1.4], [-0.12, 1.26]], 4).map(Q);
  c.F.base(501, '#77766b', shirt);
  const shorts = smooth([[-0.13, 0.86], [0.12, 0.9], [0.1, 0.62], [0.09, 0.55], [-0.09, 0.55], [-0.12, 0.66]], 4).map(Q);
  c.F.base(504, '#3a3d42', shorts);
  const arm = smooth([[-0.03, 1.38], [0.07, 1.35], [0.075, 1.1], [0.08, 0.86], [0.06, 0.78], [0.025, 0.84], [0.005, 1.1]], 4).map(Q);
  c.F.base(502, '#4c4d44', arm);
  const hair = smooth([[0.3, 1.56], [0.23, 1.61], [0.14, 1.59], [0.1, 1.5], [0.12, 1.47], [0.18, 1.53], [0.26, 1.54]], 4).map(Q);
  c.F.base(506, '#26241f', hair);
  c.F.base(507, '#55554a', ell(Q([0.17, 1.47])[0], Q([0.17, 1.47])[1], 5, 7, 10));
  c.F.line(503, body, {w: 1.0, closed: true, color: '#2a2620'});
  // Window rim light on the back of the head and shoulders (backlit).
  pen(c, 505, [Q([0.14, 1.59]), Q([0.1, 1.51]), Q([0.04, 1.43]), Q([-0.06, 1.4]), Q([-0.12, 1.28])], '#ece5d3', 0.9, false, 0.4);
  // Floor contact shadow.
  tint(c, 508, '#5f5648', 150, ell(Q([0.03, 0])[0], Q([0.03, 0])[1] + 2, k * 0.26, 5, 16));
  // Your own door's edge at frame left, close and soft: the view is through the gap you just opened.
  c.S.flat(600, '#4d4036', [[-40, -40], [46, -40], [62, 1960], [-40, 1960]]);
  tint(c, 601, '#4d4036', 120, [[46, -40], [70, -40], [86, 1960], [62, 1960]]);
  pen(c, 602, [[54, -40], [72, 1960]], '#8f7f6c', 0.8);
  // Ink-and-wash shadow side: a light pen hatch over the near ceiling and the left wall foot.
  hatchWith(c.p, 610, [[60, -40], [1120, -40], [1120, 60], [60, 120]], 'pen', '#3a2c24', 0.4, 11, 20, 0.3);
};


// =================================================================== L1b the infected turns, ZC2-B01-SH03
/**
 * MCU on the same long lens (estimate: ~2000 px/m at the figure, 28 m, f ~ 56000 px equivalent: a crop of the L1 lens on the
 * push; background out of focus). The body stays in profile facing its door (screen right); the head has turned over its left
 * shoulder toward camera, chin down, eyes up at the lens. Backlit by the end window (screen left): the face is in shadow but
 * readable (UT03), a pale rim on the back of the head, neck and shoulder. Grey-green skin, sunken sockets, faint pale
 * eye-shine. Blood (user Q-ZC2-F2): dark, dried-to-wet round the mouth and chin, two runs down the neck, a few drips on the
 * undershirt collar; no gore beyond that (UT09). Face y 380-830, above the caption band; lead height = frame height.
 */
const L1b = (c: Ctx) => {
  const K: Pt = [0.8, 0.55]; // window light from behind screen-left: the camera side of the face is the shadow side
  const C = {skin: '#78806f', lit: '#a3a993', shadeS: '#59614f', deep: '#424939', rim: '#ebe3cc', hair: '#211f1b', shirt: '#8d897d', shirtShade: '#6a675d',
    blood: '#74201a', bloodDark: '#40120e', bloodDry: '#57301f', ink: '#2a2620', mouth: '#1e110e', eyeWhite: '#8d8f7f', shine: '#eef2df'};
  // Out-of-focus corridor (bokeh as stacked flat tints, not textured washes, which read as cloud): bright window behind the
  // head at screen left, the darker right wall, the ceiling tube smear.
  c.S.flat(10, '#9c9584', [[-40, -40], [1120, -40], [1120, 1960], [-40, 1960]]);
  const soft = (seed: number, col: string, pts: Pt[], a = 255) => [0, 1, 2].forEach((i) => tint(c, seed + i, col, a * [0.35, 0.5, 1][i], pts.map(([x, y]): Pt => {
    const cx = pts.reduce((m, q) => m + q[0], 0) / pts.length, cy = pts.reduce((m, q) => m + q[1], 0) / pts.length, g = [1.1, 1.05, 1][i];
    return [cx + (x - cx) * g, cy + (y - cy) * g];
  })));
  soft(11, '#ece6d6', [[-40, 60], [720, 40], [740, 1080], [-40, 1100]]);
  soft(14, '#f8f4ea', [[-20, 150], [600, 130], [620, 960], [-20, 980]]);
  soft(17, '#b9b2a2', [[300, 120], [352, 118], [356, 980], [304, 984]], 200);
  soft(20, '#77705f', [[800, -40], [1120, -40], [1120, 1960], [860, 1960]]);
  soft(23, '#d4cfc2', [[-40, -40], [1120, -40], [1120, 50], [-40, 60]], 200);
  soft(26, '#f7f4ec', [[180, 0], [760, -8], [760, 24], [180, 30]], 230);
  // Body in profile facing screen right (~2300 px/m: torso depth ~0.24 m), in shadow against the window: back, chest, the near
  // (left) arm hanging from a round shoulder, the sleeveless undershirt on the back and the chest with its strap.
  const body = smooth([[450, 950], [560, 968], [660, 1000], [740, 1090], [776, 1300], [790, 1600], [800, 1960], [230, 1960], [240, 1500], [262, 1200], [320, 1030]], 5);
  c.F.base(100, mixColor(C.skin, C.deep, 0.5), body);
  const back = smooth([[262, 1200], [320, 1040], [400, 990], [420, 1100], [400, 1400], [390, 1960], [230, 1960], [240, 1500]], 4);
  const chest = smooth([[600, 990], [660, 1000], [740, 1090], [776, 1300], [790, 1600], [800, 1960], [610, 1960], [620, 1500], [600, 1200], [580, 1060]], 4);
  [back, chest].forEach((sh, i) => {
    c.F.base(102 + i, C.shirt, sh);
    tint(c, 104 + i, C.shirtShade, 170, planeBand(sh, [1, 0.2], 0.55));
    for (let k = 0; k < 4; k++) {
      const x0 = i ? 640 + k * 40 : 260 + k * 36;
      c.F.line(106 + i * 4 + k, [[x0, i ? 1250 : 1250], [x0 + (i ? 10 : -4), 1960]], {w: 0.45, color: '#5f5b52'});
    }
    c.F.line(114 + i, sh, {w: 0.9, closed: true, color: C.ink});
  });
  const arm = smooth([[400, 990], [490, 975], [580, 1000], [624, 1080], [624, 1300], [606, 1600], [600, 1960], [410, 1960], [404, 1600], [392, 1300], [380, 1080]], 5);
  c.F.base(116, mixColor(C.skin, C.deep, 0.3), arm);
  tint(c, 117, C.deep, 150, planeBand(arm, [1, 0], 0.6));
  c.F.line(118, arm, {w: 1.0, closed: true, color: C.ink});
  pen(c, 119, [[440, 1180], [500, 1200], [560, 1186]], mixColor(C.deep, C.ink, 0.4), 0.6, false, 0.4);
  const strap = smooth([[560, 968], [606, 980], [640, 1004], [612, 1040], [580, 1010]], 3);
  c.F.base(120, C.shirt, strap);
  c.F.line(121, strap, {w: 0.8, closed: true, color: C.ink});
  // Neck turned toward camera: thin, two tendons, the hollow above the collarbone.
  const neck = smooth([[440, 740], [650, 800], [664, 900], [640, 990], [540, 978], [452, 958], [446, 860]], 4);
  c.F.base(130, mixColor(C.skin, C.deep, 0.35), neck);
  c.F.shade(131, C.shadeS, smooth([[560, 800], [660, 800], [690, 900], [650, 990], [600, 980], [610, 880]], 3));
  pen(c, 132, [[466, 770], [530, 880], [600, 978]], mixColor(C.deep, C.ink, 0.3), 0.8, false, 0.4);
  pen(c, 133, [[640, 830], [646, 920], [630, 985]], mixColor(C.deep, C.ink, 0.3), 0.7, false, 0.4);
  // Head, three-quarter toward camera (face to screen right), chin down, eyes up at the lens.
  const head = smooth([[600, 300], [690, 345], [736, 430], [746, 520], [732, 560], [742, 604], [722, 680], [692, 756], [650, 812], [606, 830], [548, 812],
    [486, 778], [424, 732], [384, 650], [362, 560], [360, 470], [386, 386], [450, 326], [520, 300]], 5);
  c.F.base(140, C.skin, head);
  // Face in shadow (backlit): one shadow over the camera side, light only round the back of the skull.
  tint(c, 141, C.shadeS, 240, smooth([[560, 330], [690, 345], [736, 430], [748, 520], [736, 560], [746, 604], [734, 682], [710, 760], [662, 816], [610, 832],
    [540, 808], [480, 770], [450, 700], [440, 600], [450, 480], [490, 380]], 4));
  c.F.light(142, C.lit, smooth([[390, 380], [450, 326], [520, 300], [470, 360], [420, 460], [392, 560], [372, 560], [370, 460]], 3));
  // Sunken sockets, hollow cheeks, the temple.
  tint(c, 143, C.deep, 115, smooth([[452, 540], [500, 520], [560, 528], [584, 560], [570, 604], [510, 612], [462, 592]], 4));
  tint(c, 144, C.deep, 115, smooth([[620, 532], [670, 520], [722, 532], [734, 566], [718, 600], [660, 604], [626, 584]], 4));
  tint(c, 145, C.deep, 90, smooth([[680, 650], [724, 640], [726, 700], [700, 740], [680, 700]], 3));
  tint(c, 146, C.deep, 90, smooth([[456, 660], [500, 680], [500, 740], [470, 760], [440, 720]], 3));
  // Eyes: small dull whites, irises pushed up under the lids, faint pale eye-shine (the brightest points on the face).
  const eyeN = smooth([[468, 572], [494, 556], [530, 552], [560, 562], [546, 578], [504, 582]], 3);
  const eyeF = smooth([[634, 566], [656, 552], [686, 550], [708, 560], [696, 574], [660, 578]], 3);
  c.F.base(150, C.eyeWhite, eyeN);
  c.F.base(151, C.eyeWhite, eyeF);
  c.F.base(152, '#22211b', clipConvex(ell(518, 558, 14, 14, 14), eyeN));
  c.F.base(153, '#22211b', clipConvex(ell(676, 556, 12, 12, 14), eyeF));
  c.F.base(154, C.shine, ell(518, 559, 5, 5, 10));
  c.F.base(155, C.shine, ell(676, 557, 4.2, 4.2, 10));
  c.F.line(156, [[464, 574], [490, 552], [530, 546], [564, 560]], {w: 1.6, color: C.ink});
  c.F.line(157, [[630, 568], [654, 548], [688, 544], [712, 558]], {w: 1.6, color: C.ink});
  c.F.line(158, [[480, 588], [512, 592], [548, 584]], {w: 0.6, color: mixColor(C.deep, C.ink, 0.5)});
  c.F.line(159, [[642, 584], [668, 588], [698, 580]], {w: 0.6, color: mixColor(C.deep, C.ink, 0.5)});
  // Low heavy brows, pressed down (the stare up from under them).
  c.F.base(160, mixColor(C.hair, C.deep, 0.35), smooth([[448, 534], [500, 516], [560, 520], [586, 534], [546, 534], [496, 534]], 3));
  c.F.base(161, mixColor(C.hair, C.deep, 0.35), smooth([[620, 530], [668, 514], [720, 520], [736, 534], [700, 530], [650, 534]], 3));
  // Nose: bridge, tip, wing, the shadow under it.
  c.F.line(162, [[600, 560], [616, 610], [640, 660], [650, 676]], {w: 0.8, color: mixColor(C.deep, C.ink, 0.4)});
  tint(c, 163, C.deep, 190, smooth([[584, 690], [622, 682], [660, 690], [652, 704], [606, 706]], 3));
  c.F.line(164, [[588, 684], [606, 698], [632, 696]], {w: 0.9, color: C.ink});
  // Slack mouth a little open (a dark slot, no lips, no teeth), blood round it: a ragged smear, darkest at the corners, dragged
  // down over the chin, a dried-brown outer edge; wet only where it is fresh (no glints: they read as teeth).
  const rag = (pts: Pt[], seed: number, amp: number): Pt[] => pts.map(([x, y], i) => [x + Math.sin(seed + i * 2.3) * amp, y + Math.cos(seed + i * 1.7) * amp]);
  // Mouth: only a small dark gap at the far corner (the jaw hangs a little); the blood covers lips and chin, heavier on the far side.
  c.F.base(170, C.bloodDry, smooth(rag([[548, 734], [580, 726], [616, 730], [652, 722], [684, 730], [700, 760], [694, 800], [682, 832], [666, 850], [648, 832],
    [630, 850], [612, 832], [592, 842], [574, 818], [556, 794], [548, 764]], 3, 5), 3));
  c.F.base(171, C.blood, smooth(rag([[600, 740], [640, 734], [676, 744], [688, 776], [676, 808], [656, 826], [636, 820], [616, 812], [604, 790], [598, 762]], 7, 4), 3));
  c.F.base(172, C.mouth, smooth([[618, 750], [648, 746], [668, 752], [656, 764], [628, 764]], 3));
  c.F.base(173, C.bloodDark, smooth([[640, 790], [672, 786], [680, 806], [660, 822], [640, 812]], 3));
  c.F.line(174, [[566, 752], [604, 754], [640, 750]], {w: 0.6, color: mixColor(C.bloodDry, C.ink, 0.5)});
  // Smear onto the near cheek.
  c.F.base(178, C.bloodDry, smooth([[528, 734], [550, 726], [552, 756], [534, 764]], 3));
  // Two runs down the neck from the chin, drops on the undershirt collar.
  [[[664, 846], [660, 890], [650, 950], [640, 990]], [[630, 846], [628, 880], [630, 910]]].forEach((run, i) => {
    pen(c, 180 + i, run as Pt[], C.blood, i ? 2.2 : 3.2, false, 0.4);
    const e = (run as Pt[])[(run as Pt[]).length - 1];
    c.F.base(182 + i, C.blood, ell(e[0], e[1] + 4, i ? 5 : 7, i ? 7 : 9, 10));
  });
  c.F.base(186, C.bloodDry, smooth([[612, 994], [652, 990], [690, 1012], [662, 1026], [626, 1020]], 3));
  [[676, 1060, 5, 8], [712, 1100, 4, 6], [654, 1110, 3, 5], [700, 1160, 3, 5]].forEach(([x, y, rx, ry], i) => c.F.base(187 + i, C.blood, ell(x, y, rx, ry, 10)));
  // Contour, ear, lank thinning hair, rim light.
  c.F.line(195, head, {w: 1.1, closed: true, color: C.ink});
  const ear = smooth([[386, 560], [360, 566], [350, 610], [360, 656], [388, 664]], 3);
  c.F.base(196, C.shadeS, ear);
  c.F.line(197, ear, {w: 0.8, color: C.ink});
  const hair = smooth([[366, 520], [362, 440], [396, 364], [462, 316], [556, 298], [646, 320], [708, 374], [730, 430], [700, 410], [670, 392], [640, 400],
    [600, 386], [560, 396], [520, 392], [480, 412], [444, 440], [412, 470], [388, 520]], 4);
  c.F.base(198, C.hair, hair);
  // A few lank strands hanging from the crown past the temple (not across the forehead: vertical strands there read as stitches).
  [[[420, 420], [404, 480], [398, 540]], [[700, 392], [722, 446], [728, 500]], [[450, 410], [440, 460]]].forEach((st, i) => pen(c, 199 + i, st as Pt[], C.hair, 1.6, false, 0.5));
  pen(c, 205, [[540, 296], [450, 322], [386, 384], [358, 470], [356, 540]], C.rim, 2.6, false, 0.4);
  pen(c, 206, [[446, 760], [448, 900], [400, 962], [330, 1020], [270, 1180], [244, 1500], [236, 1960]], C.rim, 2.4, false, 0.4);
  pen(c, 207, [[396, 1000], [384, 1100], [396, 1300]], mixColor(C.rim, C.skin, 0.4), 1.4, false, 0.4);
};


/** Look-at perspective camera (W-UNIT metres -> screen px). */
const lookCam = (eye: V3, target: V3, f: number, cx = 540, cy = 960) => {
  const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const nrm = (a: V3): V3 => {
    const l = Math.hypot(a[0], a[1], a[2]) || 1;
    return [a[0] / l, a[1] / l, a[2] / l];
  };
  const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const fw = nrm(sub(target, eye)), rt = nrm(cross(fw, [0, 1, 0])), up = cross(rt, fw);
  return (v: V3): Pt => {
    const d = sub(v, eye), z = Math.max(0.05, dot(d, fw));
    return [cx + (f * dot(d, rt)) / z, cy - (f * dot(d, up)) / z];
  };
};

// =================================================================== L2 unit day 1, ZC2-B02-SH01
/**
 * Inside, MS: you slam the door shut with your shoulder and both forearms, the trash bag drops. W-UNIT (brief): origin floor at
 * the centre of the door's inside face, +x right facing the door, +y up, +z into the room. Camera (estimate): eye (1.55, 1.35,
 * 2.30) looking at (-0.15, 1.15, 0), f 1450 px: a three-quarter view with the door wall receding to the left. Door 0.90 x
 * 2.10 m hinged on the left jamb, inward-opening, ajar ~5 deg as it shuts: a sliver of cold corridor light at the latch edge.
 * The open-shelf shoe cabinet stands against the wall right of the door (where SH04 drags it from; SH05 scuffs). Morning sun
 * from the balcony behind camera-left lands as two panes on the door wall. The man (lead, same cast as SH05) leans his left
 * shoulder into the door near the latch, fists on the leaf, head ducked, face in profile toward the gap; his right leg is
 * braced back. The bag (dropped from his right hand) lands on its side at his feet.
 */
const L2 = (c: Ctx) => {
  const P = lookCam([1.55, 1.35, 2.3], [-0.15, 1.15, 0], 1450);
  const C = {wall: '#b3a58e', wallSun: '#f1e8d4', door: '#6e5f51', doorSun: '#cdbd9f', jamb: '#c0b39d', floor: '#a99b85', grout: '#7a6e60', ink: '#241a15',
    cab: '#bfb19b', bay: '#3f3732', gap: '#eef2ee', ceil: '#cbbfa9'};
  const q = (pts: V3[]) => pts.map(P);
  // Wall, floor, ceiling.
  c.S.flat(10, C.wall, q([[-3, -0.1, 0], [3.5, -0.1, 0], [3.5, 2.7, 0], [-3, 2.7, 0]]));
  c.S.flat(11, C.floor, q([[-3, 0, 0], [3.5, 0, 0], [3.5, 0, 3], [-3, 0, 3]]));
  c.S.flat(12, C.ceil, q([[-3, 2.6, 0], [3.5, 2.6, 0], [3.5, 2.6, 3], [-3, 2.6, 3]]));
  for (let x = -2.4; x <= 3.0; x += 0.6) pen(c, 20 + Math.round(x * 10), q([[x, 0, 0], [x, 0, 2.4]]), C.grout, 0.5);
  for (let z = 0.6; z <= 2.4; z += 0.6) pen(c, 60 + Math.round(z * 10), q([[-3, 0, z], [3.5, 0, z]]), C.grout, 0.5);
  c.S.flat(13, C.jamb, q([[-3, 0, 0.01], [3.5, 0, 0.01], [3.5, 0.09, 0.01], [-3, 0.09, 0.01]]));
  // Sun panes on the wall and door (paper light), as in SH05.
  const paneA = q([[-1.7, 2.7, 0.005], [-1.1, 2.7, 0.005], [0.2, 0.0, 0.005], [-0.4, 0.0, 0.005]]);
  const paneB = q([[-0.9, 2.7, 0.005], [-0.25, 2.7, 0.005], [1.0, 0.0, 0.005], [0.35, 0.0, 0.005]]);
  // Door frame (jambs, head), then the corridor-light gap at the latch edge, then the leaf ajar a few degrees.
  c.S.flat(30, C.jamb, q([[-0.53, 0, 0.02], [-0.45, 0, 0.02], [-0.45, 2.18, 0.02], [-0.53, 2.18, 0.02]]));
  c.S.flat(31, C.jamb, q([[0.45, 0, 0.02], [0.53, 0, 0.02], [0.53, 2.18, 0.02], [0.45, 2.18, 0.02]]));
  c.S.flat(32, C.jamb, q([[-0.53, 2.1, 0.02], [0.53, 2.1, 0.02], [0.53, 2.18, 0.02], [-0.53, 2.18, 0.02]]));
  c.S.flat(33, C.gap, q([[0.3, 0, -0.02], [0.45, 0, -0.02], [0.45, 2.1, -0.02], [0.3, 2.1, -0.02]]));
  const ang = (5 * Math.PI) / 180, W0 = 0.9;
  const leaf = (u: number, h: number, t = 0): V3 => [-0.45 + Math.cos(ang) * u * W0 - Math.sin(ang) * t, h, Math.sin(ang) * u * W0 + Math.cos(ang) * t];
  const leafFace = [leaf(0, 0, 0.04), leaf(1, 0, 0.04), leaf(1, 2.1, 0.04), leaf(0, 2.1, 0.04)].map(P);
  const leafEdge = [leaf(1, 0, 0), leaf(1, 0, 0.04), leaf(1, 2.1, 0.04), leaf(1, 2.1, 0)].map(P);
  c.S.flat(34, mixColor(C.door, C.ink, 0.25), leafEdge);
  c.S.flat(35, C.door, leafFace);
  [paneA, paneB].forEach((pn, i) => {
    c.S.flat(40 + i, C.wallSun, clipConvex(clipConvex(pn, q([[-3, 0.09, 0], [-0.53, 0.09, 0], [-0.53, 2.7, 0], [-3, 2.7, 0]])), pn));
    c.S.flat(42 + i, C.doorSun, clipConvex(leafFace, pn));
    c.S.flat(44 + i, mixColor(C.wallSun, C.wall, 0.2), clipConvex(q([[0.53, 0.09, 0], [3.5, 0.09, 0], [3.5, 2.7, 0], [0.53, 2.7, 0]]), pn));
  });
  // Cold corridor light spilling through the gap onto the floor (the threat is right outside).
  tint(c, 46, '#e9eeea', 170, q([[0.3, 0.002, 0.02], [0.47, 0.002, 0.02], [0.75, 0.002, 0.7], [0.5, 0.002, 0.75]]));
  pen(c, 47, leafFace.concat([leafFace[0]]), C.ink, 1.0);
  const panel = [leaf(0.1, 1.25, 0.045), leaf(0.9, 1.25, 0.045), leaf(0.9, 1.98, 0.045), leaf(0.1, 1.98, 0.045)].map(P);
  pen(c, 48, panel.concat([panel[0]]), mixColor(C.door, C.ink, 0.35), 0.6);
  // Lever and deadbolt on the leaf near the latch edge (thumb-turn unturned: SH02 turns it).
  const lv = P(leaf(0.88, 1.0, 0.06)), bt = P(leaf(0.88, 1.15, 0.06));
  c.S.base(49, '#b0aaa0', ell(lv[0], lv[1], 14, 16, 12));
  c.S.base(50, '#b0aaa0', [[lv[0] - 2, lv[1] - 5], [lv[0] - 64, lv[1] - 3], [lv[0] - 66, lv[1] + 7], [lv[0] - 2, lv[1] + 7]]);
  c.S.base(51, '#b0aaa0', ell(bt[0], bt[1], 17, 19, 12));
  c.S.base(52, '#7d776d', [[bt[0] - 4, bt[1] - 16], [bt[0] + 4, bt[1] - 16], [bt[0] + 4, bt[1] + 16], [bt[0] - 4, bt[1] + 16]]);
  [lv, bt].forEach((m, i) => pen(c, 53 + i, ell(m[0], m[1], i ? 17 : 14, i ? 19 : 16, 12).concat([ell(m[0], m[1], i ? 17 : 14, i ? 19 : 16, 12)[0]]), C.ink, 0.7, false, 0.3));
  // Light switch and a key hook by the door.
  c.S.flat(55, '#e4dccb', q([[0.72, 1.18, 0.01], [0.82, 1.18, 0.01], [0.82, 1.32, 0.01], [0.72, 1.32, 0.01]]));
  // The open-shelf shoe cabinet against the wall right of the door (0.77 w x 0.35 d x 1.06 h m).
  const cx0 = 0.75, cx1 = 1.52, cd = 0.35, ch = 1.06;
  c.S.flat(60, mixColor(C.cab, C.ink, 0.18), q([[cx0, 0, cd], [cx0, 0, 0], [cx0, ch, 0], [cx0, ch, cd]]));
  c.S.flat(61, C.cab, q([[cx0, 0, cd], [cx1, 0, cd], [cx1, ch, cd], [cx0, ch, cd]]));
  c.S.flat(62, mixColor(C.cab, '#ffffff', 0.2), q([[cx0, ch, 0], [cx1, ch, 0], [cx1, ch, cd], [cx0, ch, cd]]));
  [[0.67, 0.87], [0.35, 0.645], [0.03, 0.32]].forEach(([h0, h1], i) => {
    c.S.flat(63 + i, C.bay, q([[cx0 + 0.02, h0, cd], [cx1 - 0.02, h0, cd], [cx1 - 0.02, h1, cd], [cx0 + 0.02, h1, cd]]));
    // Shoes on the shelves.
    [0.2, 0.45].forEach((u, k) => {
      const [sx, sy] = P([cx0 + u, h0 + 0.01, cd - 0.05]);
      c.S.base(70 + i * 2 + k, k ? '#e6dfd0' : '#5a6c80', smooth([[sx - 46, sy], [sx - 40, sy - 26], [sx + 10, sy - 34], [sx + 50, sy - 18], [sx + 52, sy]], 3));
      pen(c, 80 + i * 2 + k, [[sx - 46, sy], [sx + 52, sy]], C.ink, 0.6);
    });
  });
  pen(c, 90, q([[cx0, 0, cd], [cx1, 0, cd], [cx1, ch, cd], [cx0, ch, cd], [cx0, 0, cd]]), mixColor(C.cab, C.ink, 0.65), 0.9);
  pen(c, 91, q([[cx0, ch, 0], [cx0, ch, cd]]), mixColor(C.cab, C.ink, 0.65), 0.8);
  tint(c, 92, mixColor(C.floor, C.ink, 0.5), 150, q([[cx0, 0, cd], [cx1, 0, cd], [cx1 + 0.06, 0, cd + 0.06], [cx0 + 0.03, 0, cd + 0.06]]));
  // Wall-floor and wall-ceiling lines; pen hatch on the shadow side (the wall far left, out of the sun).
  pen(c, 95, q([[-3, 0, 0], [3.5, 0, 0]]), mixColor(C.wall, C.ink, 0.6), 0.8);
  pen(c, 96, q([[-3, 2.6, 0], [3.5, 2.6, 0]]), mixColor(C.wall, C.ink, 0.5), 0.7);
  hatchWith(c.p, 97, q([[-3, 0.1, 0], [-1.7, 0.1, 0], [-1.7, 2.6, 0], [-3, 2.6, 0]]), 'pen', '#3a2c24', 0.4, 10, 60, 0.3);
  // ---- the man (screen space from the projected anchors above; ~650 px/m at his depth, estimate).
  const M = {skin: '#d2a582', skinShade: '#94694f', hair: '#1f1a18', shirt: '#9aa0a4', shirtShade: '#6f7378', pants: '#5c5853', pantsShade: '#3f3c39', slipper: '#4a5866',
    bag: '#3a3a3c', bagHi: '#8a8886'};
  const K: Pt = [0.82, 0.38];
  const F = c.F;
  const fig = (seed: number, col: string, sh: string, pts: Pt[], from = 0.58, w = 1.0) => {
    F.base(seed, col, pts);
    F.shade(seed + 1, sh, shade(pts, K, from));
    F.light(seed + 2, mixColor(col, '#fff1d8', 0.22), lit(pts, K, 0.22));
    F.line(seed + 3, pts, {w, closed: true, color: mixColor(col, '#241a15', 0.7)});
  };
  // Contact shadow on the floor under the feet and the corridor light cut by his legs.
  tint(c, 199, mixColor(C.floor, C.ink, 0.5), 150, smooth([[600, 1740], [720, 1716], [1000, 1800], [1100, 1900], [1100, 1960], [600, 1960]], 3));
  // Back leg (his right) braced back toward camera: thigh, bent knee, shin to the foot out of frame bottom right.
  fig(200, M.pants, M.pantsShade, smooth([[770, 1120], [880, 1140], [920, 1330], [940, 1540], [990, 1760], [1040, 1960], [880, 1960], [850, 1760], [820, 1560], [780, 1380], [760, 1240]], 4), 0.6);
  pen(c, 204, [[858, 1500], [900, 1530], [930, 1520]], mixColor(M.pants, '#241a15', 0.6), 0.7, false, 0.4);
  // Front leg (his left) planted forward under the door: knee, shin, slipper.
  fig(206, mixColor(M.pants, M.pantsShade, 0.25), M.pantsShade, smooth([[700, 1110], [790, 1140], [790, 1330], [744, 1440], [716, 1600], [700, 1712], [640, 1716], [652, 1580], [672, 1420], [690, 1260]], 4), 0.55);
  F.base(210, M.skin, smooth([[648, 1700], [700, 1702], [706, 1728], [650, 1730]], 3));
  F.base(211, M.slipper, smooth([[600, 1716], [700, 1712], [724, 1740], [700, 1752], [604, 1750]], 3));
  // Torso leaning left into the door: T-shirt back, the right side toward camera; hem loose over the hips.
  const torso = smooth([[690, 830], [760, 800], [830, 806], [872, 850], [890, 960], [900, 1080], [896, 1180], [820, 1196], [740, 1180], [700, 1150], [690, 1020], [676, 900]], 5);
  fig(220, M.shirt, M.shirtShade, torso, 0.55, 1.0);
  [[[740, 900], [790, 960], [820, 1060]], [[860, 880], [876, 960]], [[720, 1100], [790, 1140], [880, 1150]]].forEach((f, i) => F.line(225 + i, f as Pt[], {w: 0.8, color: mixColor(M.shirt, '#241a15', 0.6)}));
  // Right arm: sleeve on the shoulder, upper arm forward to the elbow, forearm up to the fist on the leaf (foreshortened).
  fig(230, M.skin, M.skinShade, smooth([[790, 860], [850, 870], [846, 940], [800, 960], [748, 900], [700, 830], [676, 790], [700, 772], [740, 800]], 4), 0.6);
  fig(235, M.shirt, M.shirtShade, smooth([[800, 806], [866, 826], [880, 880], [846, 900], [800, 880], [784, 840]], 3), 0.6, 0.9);
  // Right fist on the door: knuckles against the leaf, thumb over the fingers.
  const fist = smooth([[650, 760], [690, 750], [716, 768], [716, 800], [692, 816], [658, 808], [644, 786]], 3);
  F.base(240, M.skin, fist);
  F.shade(241, M.skinShade, shade(fist, K, 0.6));
  F.line(242, fist, {w: 1.0, closed: true, color: mixColor(M.skin, '#241a15', 0.7)});
  [[[660, 772], [676, 770]], [[658, 788], [676, 786]], [[690, 762], [702, 790]]].forEach((f, i) => F.line(243 + i, f as Pt[], {w: 0.6, color: mixColor(M.skin, '#241a15', 0.6)}));
  // Left fist higher on the leaf, beyond his head (the left arm is hidden behind his body).
  const fistL = smooth([[592, 640], [628, 630], [650, 648], [648, 680], [622, 694], [594, 686], [582, 664]], 3);
  F.base(247, mixColor(M.skin, M.skinShade, 0.25), fistL);
  F.line(248, fistL, {w: 1.0, closed: true, color: mixColor(M.skin, '#241a15', 0.7)});
  F.base(249, mixColor(M.skin, M.skinShade, 0.35), smooth([[640, 690], [676, 680], [700, 760], [690, 800], [660, 790]], 3));
  // Neck and head: ducked, lost profile (we see the back of his head, right ear, cheek and jaw edge, brow and nose tip).
  F.base(250, M.skin, smooth([[716, 760], [770, 752], [784, 812], [730, 826], [710, 800]], 3));
  const headS = smooth([[700, 640], [736, 600], [786, 596], [820, 626], [832, 676], [824, 730], [800, 768], [760, 784], [722, 774], [700, 744], [690, 704], [684, 676]], 4);
  fig(252, M.skin, M.skinShade, headS, 0.5, 1.1);
  // Face edge toward the gap: brow ridge, nose tip and lips just past the cheek contour, eye squeezed shut (strain).
  F.base(256, M.skin, smooth([[690, 684], [676, 694], [670, 716], [680, 724], [672, 736], [684, 752], [700, 756]], 3));
  F.line(257, [[676, 694], [670, 716], [680, 724], [672, 736], [684, 752]], {w: 0.9, color: mixColor(M.skin, '#241a15', 0.7)});
  F.line(258, [[694, 690], [712, 694]], {w: 1.5, color: '#241a15'});
  const hairS = smooth([[690, 660], [700, 616], [736, 590], [790, 586], [826, 610], [840, 660], [832, 700], [816, 670], [800, 680], [776, 664], [750, 676], [722, 660], [704, 684]], 4);
  F.base(259, M.hair, hairS);
  const ear = smooth([[792, 680], [812, 672], [820, 700], [810, 726], [792, 724]], 3);
  F.base(260, mixColor(M.skin, M.skinShade, 0.2), ear);
  F.line(261, ear, {w: 0.8, closed: true, color: mixColor(M.skin, '#241a15', 0.7)});
  // The trash bag, dropped from his right hand: tipping over on the floor by his back foot, knot flung up.
  const bag = smooth([[880, 1760], [930, 1690], [1000, 1676], [1060, 1712], [1084, 1800], [1060, 1868], [980, 1884], [904, 1860]], 4);
  c.S.base(270, M.bag, bag);
  c.S.shade(271, mixColor(M.bag, '#000000', 0.4), shade(bag, K, 0.6));
  c.S.base(272, M.bag, smooth([[910, 1700], [890, 1650], [910, 1630], [936, 1660], [940, 1700]], 3));
  pen(c, 273, [[930, 1720], [980, 1780], [1000, 1850]], mixColor(M.bagHi, '#241a15', 0.2), 0.8, false, 0.4);
  c.S.line(274, bag, {w: 1.0, closed: true});
  // Motion: a few dry-brush speed marks behind the leaf edge (the slam), drawn as broken pen strokes.
  [[[812, 420], [860, 410]], [[816, 520], [880, 512]], [[812, 1260], [850, 1256]]].forEach((m, i) => pen(c, 280 + i, m as Pt[], '#6e5f51', 0.6));
  return {P, leaf};
};

// =================================================================== render plumbing
const FRAMES = {L1, L1b, L2: (c: Ctx) => void L2(c)} as const;
export type FrameId = keyof typeof FRAMES;

const paintFrame = (id: FrameId) => ({brush, frame}: PaintContext) => {
  const p = makePainter(brush, {t: frame / 30, frame, fade: PAPER});
  FRAMES[id]({p, S: inkWash(p), F: inkWashSoft(p)});
};

const Frame = ({id, children}: {id: FrameId; children?: ReactNode}) => {
  const paint = useCallback(paintFrame(id), [id]);
  return (
    <AbsoluteFill style={{background: PAPER, width: 1080, height: 1920}}>
      <BrushCanvas paint={paint} paper={PAPER} />
      <Grain opacity={0.1} />
      {children}
    </AbsoluteFill>
  );
};

export const LF_L1 = () => <Frame id="L1" />;
export const LF_L1b = () => <Frame id="L1b" />;
export const LF_L2 = () => <Frame id="L2" />;
// Keep helpers referenced while later frames are added.
export const _unused = {hardFill, washAt, clipConvex, hatchWith, shade, lit, mapPts};
