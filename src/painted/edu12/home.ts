// SET-HOME (brief EDU-EP12-BRIEF-R1.1 set plan, metres; LOOK-FRAME CODE, W3 R1.2). Origin on the floor at the centreline of the measuring
// trim (the teak architrave right of the bedroom doorway), in the hall wall plane. +x right along the hall wall (seen from the hall), +y up,
// +z out of the wall into the hall. The bedroom lies behind the wall (z < -0.12). Light: 'night' (B01, hall sconce + bedside lamp),
// 'morning' (B03-SH01/SH02, B05-SH05: low sun from the hall window, lamps off), 'moon' (B03-SH03, B05-SH03/SH04: bedroom by moonlight).
// W3 tuning (R1.2): the door leaf swings 100 deg flat against the bedroom side of the hall wall (x -0.85 -> -1.63), so it never hides the bed.
import {ell, hardFill, inkLine} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {paintBox, qx, qy, qz, wFill, wInk, wp} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {C} from './palette';

export type HomeLight = 'night' | 'morning' | 'moon';
/** Mark heights on the measuring trim (m): the morning line (rig height) and tonight's line, 1.5 cm lower (true scale, VD01). */
export const MARK = {morning: 1.3, night: 1.285} as const;
export const PILLOW: V3 = [-2.08, 0.47, -3.1];
export const MATTRESS_Y = 0.42;
export const BED = {x0: -2.55, x1: -1.6, z0: -3.3, z1: -1.4} as const;
export const LAMP: V3 = [-1.2, 0.75, -3.15];

/** Ellipse on a wall at depth z / at x / on a floor at height y (world polygons). */
export const ellZ = (z: number, cx: number, cy: number, rx: number, ry: number, n = 22): V3[] => Array.from({length: n}, (_, i) => { const a = (i / n) * 6.2832; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a), z]; });
export const ellX = (x: number, cz: number, cy: number, rz: number, ry: number, n = 22): V3[] => Array.from({length: n}, (_, i) => { const a = (i / n) * 6.2832; return [x, cy + ry * Math.sin(a), cz + rz * Math.cos(a)]; });
export const ellY = (y: number, cx: number, cz: number, rx: number, rz: number, n = 22): V3[] => Array.from({length: n}, (_, i) => { const a = (i / n) * 6.2832; return [cx + rx * Math.cos(a), y, cz + rz * Math.sin(a)]; });

const glaze = (p: Painter, c: YCam, seed: number, color: string, a: number, pts: V3[]) => wFill(p.layer(a, seed * 7), c, seed, color, pts);
/** Soft light pool: the polygon three times, shrunk about its centre, a third of the opacity each (fills are flat, so this feathers the edge). */
const soft = (p: Painter, c: YCam, seed: number, color: string, a: number, pts: V3[]) => {
  const m = pts.reduce((s, v) => [s[0] + v[0] / pts.length, s[1] + v[1] / pts.length, s[2] + v[2] / pts.length] as V3, [0, 0, 0] as V3);
  [1, 0.72, 0.45].forEach((k, i) => glaze(p, c, seed + i * 977, color, a / 2.2, pts.map((v) => [m[0] + (v[0] - m[0]) * k, m[1] + (v[1] - m[1]) * k, m[2] + (v[2] - m[2]) * k] as V3)));
};
const tone = (light: HomeLight, night: string, morning: string, moon: string) => (light === 'night' ? night : light === 'morning' ? morning : moon);

// ---------------------------------------------------------------- bedroom (behind the hall wall)
const paintBedroom = (p: Painter, c: YCam, light: HomeLight) => {
  const X0 = -3.4, X1 = 0.6, Z0 = -3.4, Z1 = -0.12, H = 2.6;
  const wallB = tone(light, '#7d6a52', '#d9c8a6', '#53607e'), wallS = tone(light, '#5f4f3e', '#bba98a', '#3f4a66');
  const floorB = tone(light, '#5e3d24', '#9b6537', '#3d3a4a');
  wFill(p, c, 1000, floorB, qy(0, X0, X1, Z0, Z1));
  for (let k = 0; k < 22; k++) wInk(p, c, 1001 + k, [[X0, 0.001, Z0 + k * 0.15], [X1, 0.001, Z0 + k * 0.15]], {color: mixColor(floorB, '#000000', 0.25), weight: 0.6, closed: false});
  wFill(p, c, 1030, wallS, qx(X0, 0, H, Z0, Z1));
  wFill(p, c, 1031, wallB, qz(Z0, X0, X1, 0, H));
  wFill(p, c, 1032, wallS, qx(X1, 0, H, Z0, Z1));
  wFill(p, c, 1033, mixColor(wallS, '#000000', 0.15), qy(H, X0, X1, Z0, Z1));
  // skirting
  wFill(p, c, 1034, C.teakDark, qz(Z0 + 0.002, X0, X1, 0, 0.08));
  wFill(p, c, 1035, C.teakDark, qx(X0 + 0.002, 0, 0.08, Z0, Z1));
  // wall texture: soft vertical streaks (UT12)
  for (let i = 0; i < 9; i++) {
    const x = X0 + 0.2 + i * 0.42 + ((i * 13) % 5) * 0.03, y0 = 0.3 + ((i * 7) % 4) * 0.25;
    glaze(p, c, 1040 + i, i % 2 ? wallS : mixColor(wallB, '#ffffff', 0.1), 0.18, qz(Z0 + 0.001, x, x + 0.08, y0, Math.min(2.5, y0 + 1.2)));
  }
  // window on the x -3.40 wall: frame, night/moon sky, curtains
  const wz0 = -2.4, wz1 = -1.4, wy0 = 0.9, wy1 = 1.9, wx = X0 + 0.003;
  wFill(p, c, 1060, C.teakDark, qx(wx, wy0 - 0.06, wy1 + 0.06, wz0 - 0.06, wz1 + 0.06));
  wFill(p, c, 1061, tone(light, C.night, C.sky, '#2c3f6b'), qx(wx + 0.001, wy0, wy1, wz0, wz1));
  wFill(p, c, 1062, tone(light, C.nightLit, '#e8f3f8', '#4a6396'), qx(wx + 0.002, wy0 + 0.45, wy1, wz0, wz1));
  if (light !== 'morning') { const m = camPoint(c, [wx + 0.003, 1.62, -1.72]); if (m) hardFill(p, 1063, '#f4f1dc', ell(m[0], m[1], 0.05 * camUnit(c, [wx, 1.62, -1.72]), 0.05 * camUnit(c, [wx, 1.62, -1.72]), 18)); }
  wInk(p, c, 1064, qx(wx + 0.004, wy0, wy1, wz0, wz1), {color: C.teakDark, weight: 1.2});
  wInk(p, c, 1065, [[wx + 0.004, wy0, -1.9], [wx + 0.004, wy1, -1.9]], {color: C.teakDark, weight: 1.2, closed: false});
  const curtain = tone(light, '#8a6d5e', '#e7d4c4', '#5e6a8e');
  wFill(p, c, 1066, curtain, [[wx + 0.01, 2.0, wz0 - 0.22], [wx + 0.01, 2.0, wz0 + 0.12], [wx + 0.01, 0.82, wz0 + 0.02], [wx + 0.01, 0.8, wz0 - 0.24]]);
  wFill(p, c, 1067, curtain, [[wx + 0.01, 2.0, wz1 + 0.22], [wx + 0.01, 2.0, wz1 - 0.12], [wx + 0.01, 0.82, wz1 - 0.02], [wx + 0.01, 0.8, wz1 + 0.24]]);
  wInk(p, c, 1068, [[wx + 0.012, 2.04, wz0 - 0.3], [wx + 0.012, 2.04, wz1 + 0.3]], {color: C.teakDark, weight: 1.6, closed: false});
  // moonlight patch through the window across the floor and the bed side
  if (light === 'moon') soft(p, c, 1069, '#a9bee6', 0.35, [[X0 + 0.02, 0.002, wz0], [X0 + 0.02, 0.002, wz1], [-1.75, 0.002, wz1 + 0.35], [-1.75, 0.002, wz0 + 0.15]]);
  // poster on the head wall: a small rocket over a blue disc (foreshadows B04; no text)
  const px0 = -3.15, px1 = -2.75, py0 = 1.3, py1 = 1.82;
  wFill(p, c, 1070, tone(light, '#d9cbb0', '#f6efe0', '#8f9ab4'), qz(Z0 + 0.004, px0, px1, py0, py1));
  wFill(p, c, 1071, tone(light, '#3c5a86', '#4f7fc0', '#33507e'), ellZ(Z0 + 0.005, -2.95, 1.48, 0.14, 0.14));
  wFill(p, c, 1072, tone(light, '#e0d9cc', '#ffffff', '#b8bfd0'), [[-2.97, 1.5, Z0 + 0.006], [-2.93, 1.5, Z0 + 0.006], [-2.93, 1.7, Z0 + 0.006], [-2.95, 1.75, Z0 + 0.006], [-2.97, 1.7, Z0 + 0.006]]);
  wFill(p, c, 1073, '#d0503f', [[-2.97, 1.5, Z0 + 0.007], [-2.99, 1.46, Z0 + 0.007], [-2.91, 1.46, Z0 + 0.007], [-2.93, 1.5, Z0 + 0.007]]);
  wInk(p, c, 1074, qz(Z0 + 0.008, px0, px1, py0, py1), {color: C.teakDark, weight: 0.8});
  // shelf with a football and a toy robot on the head wall, right of the bed
  paintBox(p, c, 1080, {x0: -1.55, x1: -0.95, y0: 1.2, y1: 1.23, z0: Z0, z1: Z0 + 0.2}, C.teak, {}, {ink: true});
  paintBox(p, c, 1086, {x0: -1.5, x1: -1.38, y0: 1.23, y1: 1.4, z0: Z0 + 0.04, z1: Z0 + 0.14}, '#c24a3a', {}, {ink: true});
  paintBox(p, c, 1092, {x0: -1.3, x1: -1.0, y0: 1.23, y1: 1.27, z0: Z0 + 0.02, z1: Z0 + 0.18}, '#3f6fb0', {}, {ink: true});
  paintBox(p, c, 1098, {x0: -1.28, x1: -1.02, y0: 1.27, y1: 1.3, z0: Z0 + 0.03, z1: Z0 + 0.17}, '#e8b84a', {}, {ink: true});
  // round rug beside the bed
  // football on the rug
  const fb: V3 = [-2.9, 0.11, -1.2], fq = camPoint(c, fb), fu = camUnit(c, fb);
  if (fq) { hardFill(p, 1112, tone(light, '#9c3a30', '#d0503f', '#6a3f4e'), ell(fq[0], fq[1], 0.11 * fu, 0.11 * fu, 18)); hardFill(p, 1113, tone(light, '#b85a4a', '#e9806a', '#7d5566'), ell(fq[0] - 0.035 * fu, fq[1] - 0.04 * fu, 0.035 * fu, 0.025 * fu, 10)); inkLine(p, 1114, ell(fq[0], fq[1], 0.11 * fu, 0.11 * fu, 18), {weight: 0.9, still: true}); }
  // slippers by the bed and a school bag against the bedside table (the bedroom cameras' foreground)
  for (const [i, dz] of [[0, 0], [1, 0.16]] as const) {
    const sx = -1.42, sz = -2.62 + dz;
    wFill(p.layer(0.35, 1115 + i), c, 1115 + i * 3, '#1a1420', ellY(0.002, sx, sz, 0.13, 0.05));
    wFill(p, c, 1116 + i * 3, tone(light, '#7a5a8a', '#b07ac0', '#5d4f78'), ellY(0.012, sx, sz, 0.12, 0.045));
    wFill(p, c, 1117 + i * 3, tone(light, '#5a3f68', '#8a5a9a', '#45395c'), [[sx - 0.02, 0.014, sz - 0.045], [sx + 0.09, 0.014, sz - 0.045], [sx + 0.09, 0.05, sz], [sx - 0.02, 0.05, sz], [sx - 0.02, 0.014, sz + 0.045], [sx + 0.09, 0.014, sz + 0.045]]);
  }
  paintBox(p, c, 1124, {x0: -1.32, x1: -1.12, y0: 0, y1: 0.36, z0: -2.93, z1: -2.63}, tone(light, '#1f2a40', '#2c3a58', '#232c48'), {}, {ink: true});
  // bedside table and lamp (on at night, off by moonlight)
  paintBox(p, c, 1120, {x0: -1.4, x1: -1.0, y0: 0, y1: 0.55, z0: -3.35, z1: -2.95}, C.teak, {}, {ink: true});
  paintBox(p, c, 1126, {x0: -1.36, x1: -1.04, y0: 0.18, y1: 0.2, z0: -2.95, z1: -2.94}, C.teakDark, {}, {});
  paintBox(p, c, 1130, {x0: -1.36, x1: -1.18, y0: 0.55, y1: 0.6, z0: -3.3, z1: -3.05}, '#3f6fb0', {}, {ink: true}); // books
  const lampOn = light === 'night';
  const shade: V3[] = [[-1.29, 0.66, -3.15], [-1.11, 0.66, -3.15], [-1.15, 0.8, -3.15], [-1.25, 0.8, -3.15]];
  wInk(p, c, 1135, [[-1.2, 0.55, -3.15], [-1.2, 0.66, -3.15]], {color: '#4a3a2a', weight: 1.6, closed: false});
  wFill(p, c, 1136, lampOn ? '#ffe2a0' : tone(light, '#cbb994', '#efe6d2', '#9ca6c0'), shade);
  wInk(p, c, 1137, shade, {color: C.teakDark, weight: 0.8});
  // bed: teak frame, mattress, sheet, pillow, quilt (quilt drawn by paintQuilt after any sleeper)
  const {x0, x1, z0, z1} = BED;
  paintBox(p, c, 1140, {x0: x0 - 0.03, x1: x1 + 0.03, y0: 0, y1: 0.9, z0: z0 - 0.06, z1: z0}, C.teak, {}, {ink: true}); // headboard
  paintBox(p, c, 1146, {x0: x0 - 0.03, x1: x1 + 0.03, y0: 0.05, y1: 0.3, z0: z0, z1: z1}, mixColor(C.teak, tone(light, '#000000', '#ffffff', '#30406a'), 0.15), {}, {ink: true});
  paintBox(p, c, 1152, {x0, x1, y0: 0.3, y1: MATTRESS_Y, z0, z1}, tone(light, '#bdb6a6', C.sheet, '#8d97b0'), {}, {ink: true});
  paintBox(p, c, 1158, {x0: x0 - 0.03, x1: x1 + 0.03, y0: 0, y1: 0.55, z0: z1, z1: z1 + 0.05}, C.teak, {}, {ink: true}); // footboard
  const pw = 0.25, pd = 0.15;
  paintBox(p, c, 1164, {x0: PILLOW[0] - pw, x1: PILLOW[0] + pw, y0: MATTRESS_Y, y1: MATTRESS_Y + 0.1, z0: PILLOW[2] - pd, z1: PILLOW[2] + pd}, tone(light, '#d8d2c4', C.pillow, '#aab3c8'), {}, {ink: true});
};

/** Quilt over the mattress from the foot end up to `toZ` (the sleeper's chest), drawn after the sleeper so it covers the legs. `empty` = folded back. */
export const paintQuilt = (p: Painter, c: YCam, light: HomeLight, toZ: number, lump = 0.11) => {
  const {x0, x1, z1} = BED, y = MATTRESS_Y, q = tone(light, '#5d7a96', C.quilt, '#5f7fa8'), qs = tone(light, '#45607c', C.quiltShade, '#475f86');
  const N = 8;
  // the near drop (side face) and the top surface with a body lump along x centre
  wFill(p, c, 1200, qs, [[x1 + 0.04, y - 0.18, z1 + 0.02], [x1 + 0.04, y - 0.18, toZ], [x1 + 0.04, y + 0.03, toZ], [x1 + 0.04, y + 0.03, z1 + 0.02]]);
  // ridge line along the body (bed centre), the far slope down to the far edge (painted first), then the near slope over it
  const zs = Array.from({length: N + 1}, (_, i) => z1 + 0.02 + (toZ - z1 - 0.02) * (i / N));
  const ridge = zs.map((z, i): V3 => [(x0 + x1) / 2, y + 0.04 + lump * (0.6 + 0.4 * Math.sin((i / N) * Math.PI * 0.95 + 0.1)), z]);
  wFill(p, c, 1199, mixColor(q, '#000000', 0.12), [...ridge, ...zs.slice().reverse().map((z): V3 => [x0 - 0.04, y + 0.03, z])]);
  wFill(p, c, 1201, q, [...zs.map((z): V3 => [x1 + 0.04, y + 0.03, z]), ...ridge.slice().reverse()]);
  // folded top edge (white sheet turn-down) and a few fold lines
  const band = tone(light, '#c9c3b6', C.sheet, '#b5bed2'), rTop = ridge[N];
  wFill(p, c, 1202, band, [[x1 + 0.045, y + 0.03, toZ + 0.1], [x1 + 0.045, y + 0.03, toZ], [rTop[0], rTop[1] + 0.005, toZ], [rTop[0], rTop[1] + 0.005, toZ + 0.1]]);
  wFill(p, c, 1208, mixColor(band, '#000000', 0.1), [[x0 - 0.045, y + 0.03, toZ + 0.1], [x0 - 0.045, y + 0.03, toZ], [rTop[0], rTop[1] + 0.005, toZ], [rTop[0], rTop[1] + 0.005, toZ + 0.1]]);
  for (let k = 0; k < 3; k++) { const z = z1 + 0.35 + k * 0.32; wInk(p, c, 1203 + k, [[x1 + 0.045, y + 0.03, z], [(x0 + x1) / 2 + 0.1, y + 0.04 + lump * 0.9, z - 0.06]], {color: qs, weight: 0.8, closed: false}); }
  wInk(p, c, 1207, [[x1 + 0.045, y - 0.18, z1 + 0.02], [x1 + 0.045, y - 0.18, toZ], [x1 + 0.045, y + 0.03, toZ]], {color: mixColor(qs, C.ink, 0.5), weight: 0.9, closed: false});
};

// ---------------------------------------------------------------- hall
const paintHall = (p: Painter, c: YCam, light: HomeLight) => {
  const night = light !== 'morning';
  const wall = night ? '#c9b48e' : C.wall, wallDim = night ? '#9c8766' : '#e3d2b2';
  // hall wall in three pieces round the doorway (x -0.95..0.05, y 0..2.10)
  wFill(p, c, 1300, wall, qz(0, -2.4, -0.95, 0, 2.6));
  wFill(p, c, 1301, wall, qz(0, 0.05, 2.6, 0, 2.6));
  wFill(p, c, 1302, wall, qz(0, -0.95, 0.05, 2.1, 2.6));
  // light on the wall: night = warm pool under the sconce, dim far ends; morning = bright gold patch from the window, cooler away from it
  if (night) {
    glaze(p, c, 1303, wallDim, 0.85, qz(0.0005, -2.4, -1.4, 0, 2.6));
    glaze(p, c, 1304, wallDim, 0.6, qz(0.0005, 1.6, 2.6, 0, 2.6));
  } else {
    glaze(p, c, 1303, C.coolShade, 0.3, qz(0.0005, -2.4, -1.2, 0, 2.6));
    glaze(p, c, 1305, C.morning, 0.55, [[0.3, 0.2, 0.0006], [1.0, 0.25, 0.0006], [0.85, 1.25, 0.0006], [0.12, 1.15, 0.0006]]);
  }
  // plaster texture
  for (let i = 0; i < 12; i++) {
    const x = -2.3 + i * 0.4 + ((i * 11) % 5) * 0.03, y0 = 0.2 + ((i * 5) % 4) * 0.3;
    if (x > -1.0 && x < 0.1) continue;
    glaze(p, c, 1310 + i, i % 3 ? mixColor(wall, '#6d5a40', 0.25) : mixColor(wall, '#ffffff', 0.25), 0.14, qz(0.0008, x, x + 0.06 + (i % 2) * 0.05, y0, Math.min(2.55, y0 + 1.0)));
  }
  // skirting
  wFill(p, c, 1330, C.teakDark, qz(0.001, -2.4, -0.95, 0, 0.08));
  wFill(p, c, 1331, C.teakDark, qz(0.001, 0.05, 2.6, 0, 0.08));
  // door trims: left, measuring (right) and head, 0.02 proud with a lit face and a shaded return
  const trimLit = night ? '#9a6236' : C.teakLit, trim = C.teak;
  for (const [id, x0, x1, y1] of [[1340, -0.95, -0.85, 2.0], [1346, -0.05, 0.05, 2.0]] as const) {
    wFill(p, c, id, trim, qz(0.02, x0, x1, 0, y1));
    wFill(p, c, id + 1, C.teakDark, qx(x1, 0, y1, 0, 0.02));
    wFill(p, c, id + 2, C.teakDark, qx(x0, 0, y1, 0, 0.02));
    glaze(p, c, id + 3, trimLit, 0.6, qz(0.0201, x0 + 0.015, x1 - 0.015, 0.1, y1 - 0.05));
    wInk(p, c, id + 4, qz(0.021, x0, x1, 0, y1), {color: C.teakDark, weight: 0.9});
  }
  wFill(p, c, 1352, trim, qz(0.02, -0.95, 0.05, 2.0, 2.1));
  wFill(p, c, 1353, C.teakDark, qy(2.0, -0.85, -0.05, 0, 0.02));
  wInk(p, c, 1354, qz(0.021, -0.95, 0.05, 2.0, 2.1), {color: C.teakDark, weight: 0.9});
  // wood grain on the measuring trim
  for (let k = 0; k < 3; k++) wInk(p, c, 1355 + k, [[-0.03 + k * 0.03, 0.12, 0.0205], [-0.025 + k * 0.03, 1.0, 0.0205], [-0.032 + k * 0.03, 1.95, 0.0205]], {color: mixColor(trim, '#3a2416', 0.35), weight: 0.5, closed: false});
  // door jamb reveal (the wall's thickness) inside the opening
  wFill(p, c, 1360, mixColor(C.teak, '#000000', 0.25), qx(-0.05, 0, 2.0, -0.12, 0));
  wFill(p, c, 1361, mixColor(C.teak, '#000000', 0.35), qx(-0.85, 0, 2.0, -0.12, 0));
  // threshold
  wFill(p, c, 1362, C.teakDark, qy(0.012, -0.85, -0.05, -0.12, 0.02));
  // hall window (x 1.10..1.90, y 0.95..1.95): frame, panes, open shutters
  wFill(p, c, 1370, C.teakDark, qz(0.002, 1.04, 1.96, 0.89, 2.01));
  wFill(p, c, 1371, night ? C.night : '#f6e6bd', qz(0.003, 1.1, 1.9, 0.95, 1.95));
  wFill(p, c, 1372, night ? C.nightLit : '#fff4d6', qz(0.004, 1.1, 1.9, 1.45, 1.95));
  wInk(p, c, 1373, [[1.5, 0.95, 0.005], [1.5, 1.95, 0.005]], {color: C.teakDark, weight: 1.4, closed: false});
  wInk(p, c, 1374, [[1.1, 1.45, 0.005], [1.9, 1.45, 0.005]], {color: C.teakDark, weight: 1.2, closed: false});
  wFill(p, c, 1375, C.teak, [[1.04, 0.95, 0.002], [1.04, 1.95, 0.002], [0.7, 1.95, 0.32], [0.7, 0.95, 0.32]]);
  wFill(p, c, 1376, C.teak, [[1.96, 0.95, 0.002], [1.96, 1.95, 0.002], [2.3, 1.95, 0.32], [2.3, 0.95, 0.32]]);
  // sconce (shade at 0.70, 2.05) and its wall plate
  const sc: V3 = [0.7, 2.05, 0.08];
  wFill(p, c, 1380, C.teakDark, qz(0.003, 0.66, 0.74, 1.95, 2.12));
  wFill(p, c, 1381, night ? '#ffe4a6' : '#e8dcc2', [[0.6, 1.98, 0.12], [0.8, 1.98, 0.12], [0.76, 2.12, 0.08], [0.64, 2.12, 0.08]]);
  wInk(p, c, 1382, [[0.6, 1.98, 0.12], [0.8, 1.98, 0.12], [0.76, 2.12, 0.08], [0.64, 2.12, 0.08]], {color: C.teakDark, weight: 0.8});
  void sc;
  // light switch, a framed family photo, a hanging calendar of pictures (no digits)
  wFill(p, c, 1390, '#f2ece0', qz(0.004, 0.3, 0.38, 1.1, 1.22));
  wFill(p, c, 1391, '#d8d0c0', qz(0.005, 0.32, 0.36, 1.13, 1.19));
  wFill(p, c, 1392, C.teakDark, qz(0.004, 0.8, 1.02, 1.42, 1.7));
  wFill(p, c, 1393, night ? '#9aa6b4' : '#cfe0ea', qz(0.005, 0.82, 1.0, 1.44, 1.68));
  wFill(p, c, 1394, night ? '#7d8c5e' : '#a7b97a', qz(0.006, 0.82, 1.0, 1.44, 1.52));
  for (const [i, x] of [[0, 0.86], [1, 0.91], [2, 0.96]] as const) wFill(p, c, 1395 + i, night ? '#6a4a3a' : '#8a5a40', ellZ(0.007, x, 1.53 + (i === 1 ? 0.03 : 0), 0.018, 0.04, 10));
  wFill(p, c, 1400, '#f6f1e6', qz(0.004, -1.75, -1.4, 1.2, 1.7));
  wFill(p, c, 1401, '#7fa2a8', qz(0.005, -1.72, -1.43, 1.46, 1.67));
  wFill(p, c, 1402, '#e3dccd', qz(0.005, -1.72, -1.43, 1.23, 1.43));
  wInk(p, c, 1403, qz(0.006, -1.75, -1.4, 1.2, 1.7), {color: '#8a7a62', weight: 0.8});
  // floor: teak boards along x, seams every 0.15 m, worn lighter path along the hall
  const fl = night ? '#7a4c2a' : C.floor;
  wFill(p, c, 1410, fl, qy(0, -2.4, 2.6, 0, 2.4));
  for (let k = 1; k < 16; k++) wInk(p, c, 1411 + k, [[-2.4, 0.001, k * 0.15], [2.6, 0.001, k * 0.15]], {color: C.seam, weight: 0.6, closed: false});
  for (let k = 0; k < 10; k++) { const z = 0.075 + (k % 8) * 0.3, x = -2.0 + ((k * 7) % 9) * 0.5; wInk(p, c, 1430 + k, [[x, 0.001, z], [x, 0.001, z + 0.15]], {color: C.seam, weight: 0.6, closed: false}); }
  if (!night) glaze(p, c, 1446, C.morning, 0.45, [[1.1, 0.003, 0.15], [1.9, 0.003, 0.15], [1.3, 0.003, 1.6], [0.2, 0.003, 1.5]]);
};

/** Woven runner mat on the hall floor in front of the doorway (stripes along x), the hall's foreground layer. */
const paintRunner = (p: Painter, c: YCam, light: HomeLight) => {
  const night = light !== 'morning', x0 = -0.9, x1 = 1.1, z0 = 0.4, z1 = 0.95;
  wFill(p.layer(0.35, 1460), c, 1460, '#2a1a10', qy(0.002, x0 + 0.03, x1 + 0.03, z0 + 0.02, z1 + 0.03));
  wFill(p, c, 1461, night ? '#5e3a2e' : '#8a5a48', qy(0.006, x0, x1, z0, z1));
  const st: [number, string][] = [[0.1, night ? '#7a5a3a' : '#b08a5a'], [0.48, night ? '#7a5a3a' : '#b08a5a']];
  st.forEach(([dz, col], i) => wFill(p, c, 1462 + i, col, qy(0.007, x0 + 0.04, x1 - 0.04, z0 + dz, z0 + dz + 0.04)));
  for (let k = 0; k < 14; k++) wInk(p, c, 1470 + k, [[x0 + 0.02 + k * 0.18, 0.008, z0], [x0 + 0.02 + k * 0.18, 0.008, z0 - 0.04]], {color: night ? '#a88a5a' : '#e8d8b0', weight: 0.7, closed: false});
};

/** Small floor props in the hall: the navy school bag against the wall and the black school shoes he took off (bare feet, F018). */
const paintHallProps = (p: Painter, c: YCam, light: HomeLight) => {
  const night = light !== 'morning';
  const bag = night ? '#1f2a40' : '#2c3a58';
  wFill(p.layer(0.5, 1500), c, 1500, '#2a1a10', ellY(0.004, 1.0, 0.13, 0.22, 0.09));
  paintBox(p, c, 1501, {x0: 0.85, x1: 1.15, y0: 0, y1: 0.38, z0: 0.02, z1: 0.17}, bag, {}, {ink: true});
  wFill(p, c, 1507, mixColor(bag, '#ffffff', 0.12), [[0.87, 0.36, 0.172], [1.13, 0.36, 0.172], [1.12, 0.2, 0.18], [0.88, 0.2, 0.18]]);
  wInk(p, c, 1508, [[0.87, 0.36, 0.172], [1.13, 0.36, 0.172], [1.12, 0.2, 0.18], [0.88, 0.2, 0.18]], {color: '#11182a', weight: 0.8});
  if (light !== 'moon') {
    // school shoes side by side against the wall, toes toward +x: sole, upper with the instep opening
    for (const [i, z] of [[0, 0.07], [1, 0.15]] as const) {
      const x0 = 0.52, sh = (xx: number, yy: number): V3 => [x0 + xx, yy, z];
      wFill(p.layer(0.4, 1510 + i), c, 1510 + i * 4, '#2a1a10', ellY(0.002, x0 + 0.11, z, 0.13, 0.035));
      const up = [sh(0, 0.012), sh(0.21, 0.012), sh(0.22, 0.035), sh(0.15, 0.06), sh(0.07, 0.075), sh(0.0, 0.07)];
      wFill(p, c, 1511 + i * 4, '#1b1918', up);
      wFill(p, c, 1512 + i * 4, '#0e0d0d', [sh(-0.005, 0), sh(0.225, 0), sh(0.225, 0.014), sh(-0.005, 0.014)]);
      wFill(p, c, 1513 + i * 4, '#5a524c', [sh(0.03, 0.068), sh(0.1, 0.06), sh(0.09, 0.07), sh(0.035, 0.073)]);
    }
  }
};

/** Pencil lines on the measuring trim: the morning line (and `morningDark` a second stroke on it, B03) and tonight's line. "เช้า" is a DOM
 * overlay at `wordAt()` (no painted text). */
export const paintMarks = (p: Painter, c: YCam, o: {night?: boolean; morningDark?: boolean} = {}) => {
  const z = 0.0212, line = (id: number, y: number, w: number) => {
    const a = camPoint(c, [-0.048, y, z]), b = camPoint(c, [0.048, y + 0.0005, z]);
    if (a && b) inkLine(p, id, [a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 0.3], b], {color: C.pencil, weight: w, closed: false, still: true});
  };
  const u = camUnit(c, [0, 1.3, z]), w = Math.max(0.9, Math.min(3.2, 0.0035 * u));
  line(1600, MARK.morning, w);
  if (o.morningDark) line(1601, MARK.morning + 0.0006, w * 1.05);
  if (o.night) line(1602, MARK.night, w);
};
/** Picture box of the pencil word "เช้า" (x +0.07..+0.19 on the wall, baseline at the morning line, letter height 0.03 m). */
export const wordAt = (c: YCam): {x: number; y: number; h: number; skew: number} | null => {
  const a = camPoint(c, [0.07, MARK.morning - 0.004, 0.001]), b = camPoint(c, [0.19, MARK.morning - 0.004, 0.001]);
  if (!a || !b) return null;
  return {x: a[0], y: a[1], h: 0.03 * camUnit(c, [0.13, MARK.morning, 0]), skew: Math.atan2(b[1] - a[1], b[0] - a[0])};
};

/** The door leaf, swung 100 deg flat against the bedroom side of the hall wall (W3 tuning). */
const paintDoorLeaf = (p: Painter, c: YCam, light: HomeLight) => {
  const leaf: V3[] = [[-0.86, 0, -0.14], [-1.64, 0, -0.27], [-1.64, 1.98, -0.27], [-0.86, 1.98, -0.14]];
  const col = tone(light, '#6b4226', C.teak, '#3c3a4c');
  wFill(p, c, 1700, col, leaf);
  wInk(p, c, 1701, leaf, {color: C.teakDark, weight: 0.9});
  wInk(p, c, 1702, [[-0.95, 0.15, -0.155], [-1.55, 0.15, -0.255], [-1.55, 1.85, -0.255], [-0.95, 1.85, -0.155]], {color: mixColor(col, '#000000', 0.3), weight: 0.7});
};

export type HomeOpts = {light: HomeLight; marks?: {night?: boolean; morningDark?: boolean}};
/** The whole set behind the cast: bedroom (through the doorway), door leaf, hall wall, trims, window, floor, floor props and the marks. */
export const paintHome = (p: Painter, c: YCam, o: HomeOpts) => {
  paintBedroom(p, c, o.light);
  paintDoorLeaf(p, c, o.light);
  paintHall(p, c, o.light);
  paintRunner(p, c, o.light);
  paintHallProps(p, c, o.light);
  paintMarks(p, c, o.marks ?? {});
};
/** Bedroom only (cameras inside the bedroom: B03-SH03, B05-SH03/SH04). */
export const paintBedroomSet = paintBedroom;
export const _pt = (c: YCam, v: V3): Pt | null => camPoint(c, v);
export {wp};
