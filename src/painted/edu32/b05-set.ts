import {hardFill, inkLine} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {flatCircle, paintBox, qy, qz, wFill, wInk, wWash, type Box} from '../kit/world';
import {camPoint, type YCam} from '../kit/ycam';
import {paintLampBase, paintNearDressing} from './desk';
import {paintLampShade, paintMemoSheet, paintOfficeDesk, paintOfficeWall} from './office';
import {paintWarmPool} from './b06-sh02';

// EDU-EP32-SHORT Space D real dressing for B05-SH01's room view (timed sheet EDU-EP32-SHEET-R1 B05-SH01; brief VD32-23 "Real dressing for
// B05-B06"; Boss G6, 2026-11-21). The LF04 set (office.ts: wall + window, walnut desk, lamp, memo sheet) plus the desk-top props the brief places
// outside B06-SH02's frame (typewriter (+4.6, 0, -2.6), red-banded folders (+5.0, 0, +1.2), stamp and pad (+3.0, 0, +1.8), coffee cup
// (-5.5, 0, +1.5)), a lateral filing cabinet and the pushed-back office chair. Model metres at 10:1 as desk.ts. The lamp pool is G7's
// `paintWarmPool` (b06-sh02.ts) so B05 and B06 share one light.
// Feasibility moves (reported to Film): at the sheet's B05-SH01 start camera the brief's cabinet (x +13..+17.5) and chair (0, -7.5, +7) project
// outside the frame (cabinet x > 1600 px, chair under the lens). The cabinet stands under the window left of the desk (x -12.6..-8.2, z -4.4..-0.6,
// top y +2.0, a two-drawer lateral cabinet below the sill) and the chair is pushed back to (-3.2, -7.5, +5.4), turned 70 deg (seen near profile), so both read in the
// first third of the move. Seeds 38000-38499 (G7 uses 378xx-379xx).

const NAVY_DIM = '#1a2232';
/** A colour seen in the navy room outside the lamp pool: mixed toward the room fill. */
const room = (col: string, k = 0.45) => mixColor(col, NAVY_DIM, k);

/** Lateral filing cabinet (two drawers) under the window, grey-green steel, top catching a little lamp spill. */
const CABINET: Box = {x0: -12.6, x1: -8.2, y0: -7.5, y1: 2.0, z0: -4.4, z1: -0.6};
const paintCabinet = (p: Painter, c: YCam) => {
  const b = CABINET, steel = room('#6a7672', 0.35);
  paintBox(p, c, 38000, b, steel, {top: -0.18, front: 0.05, right: 0.22});
  for (let k = 0; k < 2; k++) {
    const y1 = b.y1 - 0.5 - k * 4.6, y0 = y1 - 4.2, d = qz(b.z1 + 0.002, b.x0 + 0.25, b.x1 - 0.25, y0, y1);
    wInk(p, c, 38010 + k, d, {color: room('#2a3030', 0.2), weight: 0.7});
    wFill(p, c, 38014 + k, room('#b0a68a', 0.35), qz(b.z1 + 0.004, (b.x0 + b.x1) / 2 - 0.7, (b.x0 + b.x1) / 2 + 0.7, y1 - 0.8, y1 - 0.55));
    wFill(p, c, 38018 + k, room('#e8e0c8', 0.3), qz(b.z1 + 0.004, (b.x0 + b.x1) / 2 - 0.45, (b.x0 + b.x1) / 2 + 0.45, y1 - 1.35, y1 - 0.95));
  }
  // a box file lying on the cabinet top
  paintBox(p, c, 38030, {x0: -11.6, x1: -9.2, y0: 2.0, y1: 2.6, z0: -3.6, z1: -1.8}, room('#7a2a26', 0.4), {top: -0.12});
};

/** Office chair pushed back from the desk, turned toward the window: five-star base, column, seat and a tall back (dark leather). */
export const CHAIR = {at: [-3.2, -7.5, 5.4] as V3, yaw: 70};
const paintChair = (p: Painter, c: YCam) => {
  const [cx, , cz] = CHAIR.at, a = (CHAIR.yaw * Math.PI) / 180, cs = Math.cos(a), sn = Math.sin(a);
  const w = (x: number, y: number, z: number): V3 => [cx + x * cs + z * sn, y, cz - x * sn + z * cs];
  const leather = room('#3a2a22', 0.35), lit = room('#6a4a36', 0.3);
  for (let i = 0; i < 5; i++) {
    const t = (i / 5) * 6.283 + 0.4;
    wInk(p, c, 38100 + i, [w(0, -7.2, 0), w(2.6 * Math.cos(t), -7.3, 2.6 * Math.sin(t))], {color: '#10141c', weight: 1.4, closed: false});
  }
  wFill(p, c, 38106, '#151a24', [w(-0.2, -7.2, 0), w(0.2, -7.2, 0), w(0.2, -3.6, 0), w(-0.2, -3.6, 0)]);
  // seat (top lit from the lamp side), front edge
  wFill(p, c, 38110, leather, [w(-2.3, -3.0, -2.2), w(2.3, -3.0, -2.2), w(2.3, -3.6, 2.3), w(-2.3, -3.6, 2.3)]);
  wFill(p, c, 38111, lit, [w(-2.2, -2.8, -2.1), w(2.2, -2.8, -2.1), w(2.2, -2.9, 2.1), w(-2.2, -2.9, 2.1)]);
  // back: the rear face (toward the lens) and a lit rim on its top edge
  const back = [w(-2.1, -2.6, -2.4), w(2.1, -2.6, -2.4), w(2.2, 3.4, -2.9), w(-2.2, 3.4, -2.9)];
  wFill(p, c, 38112, room('#2c201a', 0.4), back);
  wInk(p, c, 38113, [w(-2.1, 3.35, -2.88), w(2.1, 3.35, -2.88)], {color: '#8a6a4e', weight: 1.1, closed: false});
  wInk(p, c, 38114, back, {color: '#0e1018', weight: 0.8});
};

/** Typewriter at (+4.6, 0, -2.6): dark green-black body, stepped keyboard, platen roller with a sheet rising from it. */
const paintTypewriter = (p: Painter, c: YCam) => {
  const body = room('#2e3a34', 0.25);
  paintBox(p, c, 38200, {x0: 2.6, x1: 6.6, y0: 0, y1: 1.0, z0: -4.3, z1: -1.6}, body, {top: -0.14});
  paintBox(p, c, 38210, {x0: 2.8, x1: 6.4, y0: 0, y1: 0.55, z0: -1.6, z1: -0.7}, body, {top: -0.1});
  for (let r = 0; r < 3; r++) for (let k = 0; k < 9; k++) {
    const x = 3.1 + k * 0.38 + (r % 2) * 0.18, z = -1.5 + r * 0.26, y = 0.557 + 0.08 * (2 - r);
    const q = flatCircle(c, [x, y, z], 0.1, 8);
    if (q.length > 2) hardFill(p, 38220 + r * 9 + k, room('#d8d0bc', 0.45), q);
  }
  // key rows climb toward the body: two steps
  paintBox(p, c, 38250, {x0: 2.8, x1: 6.4, y0: 0.55, y1: 0.75, z0: -1.65, z1: -1.3}, body, {top: -0.1});
  // platen roller and its knobs, the sheet rising from it, leaning back
  paintBox(p, c, 38260, {x0: 2.2, x1: 7.0, y0: 1.0, y1: 1.5, z0: -3.7, z1: -3.1}, room('#16181c', 0.2), {top: -0.2});
  wFill(p, c, 38265, room('#e6e0d0', 0.38), [[3.3, 1.45, -3.2], [5.9, 1.45, -3.2], [5.9, 3.7, -3.75], [3.3, 3.7, -3.75]]);
  for (let i = 0; i < 4; i++) wInk(p, c, 38270 + i, [[3.6, 3.2 - i * 0.35, -3.63 + i * 0.09], [5.2 - 0.3 * (i % 2), 3.2 - i * 0.35, -3.63 + i * 0.09]], {color: room('#5a5650', 0.3), weight: 0.5, closed: false});
};

/** Three red-banded kraft folders stacked at (+5.0, 0, +1.2), each a little off square, and the stamp, its pad and the ink at (+3.0, 0, +1.8). */
const paintFoldersAndStamp = (p: Painter, c: YCam) => {
  const kraft = room('#b8946a', 0.35), red = room('#c8342b', 0.3);
  for (let k = 0; k < 3; k++) {
    const dx = [0, 0.18, -0.12][k], dz = [0, -0.14, 0.1][k], y0 = 0.012 + k * 0.16, y1 = y0 + 0.14;
    const b: Box = {x0: 3.9 + dx, x1: 6.3 + dx, y0, y1, z0: -0.4 + dz, z1: 2.8 + dz};
    paintBox(p, c, 38300 + k * 6, b, kraft, {top: -0.08});
    wFill(p, c, 38320 + k, red, qy(y1 + 0.002, b.x0, b.x1, b.z0 + 0.25, b.z0 + 0.55));
  }
  // ink pad (tin, red felt) and the stamp standing beside it
  paintBox(p, c, 38340, {x0: 2.4, x1: 3.5, y0: 0.012, y1: 0.16, z0: 1.4, z1: 2.1}, room('#3a3c40', 0.3), {top: -0.15});
  wFill(p, c, 38341, room('#7a1e1c', 0.3), qy(0.162, 2.5, 3.4, 1.48, 2.02));
  paintBox(p, c, 38345, {x0: 3.6, x1: 4.2, y0: 0.012, y1: 0.3, z0: 1.7, z1: 2.15}, room('#5a3a26', 0.3), {top: -0.12});
  paintBox(p, c, 38350, {x0: 3.82, x1: 3.98, y0: 0.3, y1: 0.9, z0: 1.85, z1: 2.0}, room('#7a5232', 0.3), {top: -0.15});
  const knob = camPoint(c, [3.9, 1.0, 1.92]), knobR = camPoint(c, [4.05, 1.0, 1.92]);
  if (knob && knobR) {
    const r = Math.max(1, Math.abs(knobR[0] - knob[0]));
    hardFill(p, 38355, room('#8a5c34', 0.25), Array.from({length: 14}, (_, i): Pt => [knob[0] + r * Math.cos((i / 14) * 6.283), knob[1] + r * Math.sin((i / 14) * 6.283)]));
  }
};

/** Coffee mug at (-5.5, 0, +1.5): cream body, dark coffee, handle toward the lamp. */
const paintCup = (p: Painter, c: YCam) => {
  const at: V3 = [-5.5, 0, 1.5], r = 0.42, h = 0.95, mug = room('#e4dccb', 0.35);
  const bot = flatCircle(c, [at[0], 0.012, at[2]], r, 20), top = flatCircle(c, [at[0], h, at[2]], r, 20);
  if (bot.length < 3 || top.length < 3) return;
  wWash(p, c, 38400, '#0e0a08', 80, Array.from({length: 18}, (_, i): V3 => [at[0] + 0.2 + 0.55 * Math.cos((i / 18) * 6.283), 0.011, at[2] + 0.25 + 0.45 * Math.sin((i / 18) * 6.283)]), 0.1, 0.1);
  const all = [...bot, ...top], xs = all.map((q) => q[0]);
  const l = Math.min(...xs), rr = Math.max(...xs), yt = top.reduce((s, q) => s + q[1], 0) / top.length, yb = bot.reduce((s, q) => s + q[1], 0) / bot.length;
  hardFill(p, 38401, mug, [[l, yt], [rr, yt], [rr, yb], ...bot.filter((q) => q[1] >= yb), [l, yb]]);
  hardFill(p, 38402, mug, top);
  const inner = flatCircle(c, [at[0], h - 0.05, at[2]], r * 0.86, 20);
  if (inner.length > 2) hardFill(p, 38403, '#2a1a10', inner);
  const hd = [camPoint(c, [at[0] - r, h * 0.78, at[2]]), camPoint(c, [at[0] - r - 0.28, h * 0.6, at[2]]), camPoint(c, [at[0] - r - 0.26, h * 0.32, at[2]]), camPoint(c, [at[0] - r, h * 0.22, at[2]])];
  if (hd.every(Boolean)) inkLine(p, 38404, hd as Pt[], {color: mug, weight: 2.2, curve: 0.5, closed: false, still: true});
};

/** The B05 office (no cat): LF04 set order with the G6 dressing threaded in (cabinet before the desk, props on the desk top, chair last). */
export const paintOfficeG6 = (p: Painter, c: YCam) => {
  paintOfficeWall(p, c);
  paintCabinet(p, c);
  paintOfficeDesk(p, c);
  paintLampBase(p, c);
  paintTypewriter(p, c);
  paintFoldersAndStamp(p, c);
  paintCup(p, c);
  paintMemoSheet(p, c);
  paintWarmPool(p, c);
  paintNearDressing(p, c, [-0.9, 2.45], [1.0, 2.62]);
  paintLampShade(p, c);
  paintChair(p, c);
};

/** Exposed for the G6 measures: the dressing anchors (model m). */
export const G6_DRESSING = {cabinet: CABINET, typewriter: [4.6, 0, -2.6] as V3, folders: [5.0, 0, 1.2] as V3, stamp: [3.0, 0, 1.8] as V3, cup: [-5.5, 0, 1.5] as V3};

/** A YCam aimed at `at` from `dist` model m along yaw/pitch (deg; yaw 0 looks -z, + toward +x; pitch + up): `at` lands on the picture at (540, hy). */
export const aimCam = (at: V3, dist: number, yawDeg: number, pitchDeg: number, f: number, hy: number): YCam => {
  const y = (yawDeg * Math.PI) / 180, p = (pitchDeg * Math.PI) / 180;
  const d: V3 = [Math.sin(y) * Math.cos(p), Math.sin(p), -Math.cos(y) * Math.cos(p)];
  return {x: at[0] - d[0] * dist, y: at[1] - d[1] * dist, z: at[2] - d[2] * dist, yaw: y, pitch: p, f, hy};
};
