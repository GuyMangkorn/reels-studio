// SET-FALL real (N5; brief "SET-FALL (F)", scene B02-SH02): the follow camera falls with the drop, a 40-storey Bangkok condo facade 6.0 m beyond it (storey 3.0 m). The facade is one
// repeating storey (slab edge, glass balcony rail with plants, AC unit, laundry, sliding doors, a few lit rooms) drawn from the camera's own height range, so it scrolls
// by shifting `scroll` metres. LOOK-FRAME CODE (LF05). Metres, drop-relative frame: origin at the drop, +x right, +y up, +z toward the camera.
import {hash} from '../kit/hash';
import {mixColor, type Painter} from '../kit/painter';
import {paintBox, qz, wFill, wInk, wWash} from '../kit/world';
import type {YCam} from '../kit/ycam';

export const FACADE_Z = -6.0, STOREY = 3.0, PITCH_X = 2.7;
export const fallCam = (r = 0.15): YCam => ({x: 0, y: 0, z: r, yaw: 0, f: 1200, hy: 700, near: 0.05});

const floorY = (p: Painter, c: YCam, k: number, y0: number, seed: number) => {
  const wallZ = FACADE_Z, railZ = FACADE_Z + 0.2, slab = '#cfc9bb';
  const tint = (col: string, u = 0.18) => mixColor(col, '#9aa6ab', u); // rain haze over the whole facade
  for (let b = -3; b <= 3; b++) {
    const x0 = b * PITCH_X - PITCH_X / 2, x1 = x0 + PITCH_X, id = seed + (b + 3) * 60, v = hash(seed + b * 7 + k);
    wFill(p, c, id, tint(v > 0.5 ? '#d9d4c6' : '#cfd0c4'), qz(wallZ, x0, x1, y0, y0 + STOREY - 0.35)); // wall between slabs
    wFill(p, c, id + 1, tint('#2c363b', 0.1), qz(wallZ + 0.01, x0 + 0.2, x1 - 0.2, y0 + 0.15, y0 + 2.45)); // sliding doors, dark glass
    wWash(p, c, id + 2, '#9fb7c2', 120, qz(wallZ + 0.012, x0 + 0.3, x0 + 0.8, y0 + 0.4, y0 + 2.3), 0.1, 0.1); // sky streak in the glass
    wFill(p, c, id + 3, tint('#cfd0c4'), qz(wallZ + 0.014, (x0 + x1) / 2 - 0.03, (x0 + x1) / 2 + 0.03, y0 + 0.15, y0 + 2.45)); // mullion
    if (hash(seed + b * 11 + k * 3) > 0.62) wFill(p, c, id + 4, '#e6d6a6', qz(wallZ + 0.013, x0 + 0.2, x1 - 0.2, y0 + 0.15, y0 + 2.45)); // a lit room
    if (hash(seed + b * 13 + k * 5) > 0.55) wFill(p, c, id + 5, '#efe6d6', qz(wallZ + 0.016, x0 + 0.22, x0 + 0.9, y0 + 0.15, y0 + 2.4)); // curtain
    // balcony rail: glass panel, top and foot rail
    wFill(p, c, id + 6, tint('#b9d0d3', 0.3), qz(railZ, x0, x1, y0 + 0.08, y0 + 1.05));
    wWash(p, c, id + 7, '#e9f2f4', 110, qz(railZ + 0.002, x0 + 0.1, x0 + 0.5, y0 + 0.2, y0 + 0.95), 0.1, 0.1);
    wFill(p, c, id + 8, tint('#5d666b'), qz(railZ + 0.004, x0, x1, y0 + 1.02, y0 + 1.09));
    wFill(p, c, id + 9, tint('#5d666b'), qz(railZ + 0.004, x0, x1, y0 + 0.06, y0 + 0.12));
    // plants and an AC unit on some bays, laundry on others
    const m = Math.floor(hash(seed + b * 17 + k * 7) * 4);
    if (m === 0) { wFill(p, c, id + 10, tint('#4d7b4b', 0.1), [[x0 + 0.5, y0 + 0.1, railZ - 0.1], [x0 + 1.5, y0 + 0.1, railZ - 0.1], [x0 + 1.35, y0 + 0.85, railZ - 0.1], [x0 + 1.1, y0 + 1.15, railZ - 0.1], [x0 + 0.65, y0 + 0.8, railZ - 0.1]]); wFill(p, c, id + 11, tint('#8a5a44'), qz(railZ - 0.09, x0 + 0.6, x0 + 1.4, y0 + 0.08, y0 + 0.3)); }
    if (m === 1) paintBox(p, c, id + 12, {x0: x0 + 0.5, x1: x0 + 1.5, y0: y0 + 0.08, y1: y0 + 0.62, z0: railZ - 0.45, z1: railZ - 0.05}, tint('#d9dcd8'), {top: -0.1}, {ink: true});
    if (m === 2) { wInk(p, c, id + 13, [[x0 + 0.3, y0 + 1.7, railZ - 0.1], [x1 - 0.3, y0 + 1.7, railZ - 0.1]], {color: '#5d666b', weight: 1.4, closed: false}); for (let s = 0; s < 4; s++) wFill(p, c, id + 14 + s, ['#d9d4c6', '#6f8fb0', '#e9e4da', '#c24a3a'][s], qz(railZ - 0.09, x0 + 0.4 + s * 0.5, x0 + 0.7 + s * 0.5, y0 + 1.0, y0 + 1.7)); }
  }
  // slab edge (projects 0.25 m): front face, underside shade, wet streaks below
  paintBox(p, c, seed + 500, {x0: -9, x1: 9, y0: y0 + STOREY - 0.35, y1: y0 + STOREY, z0: FACADE_Z, z1: FACADE_Z + 0.25}, slab, {front: 0, top: -0.12, bottom: 0.35}, {ink: false});
  wInk(p, c, seed + 501, [[-9, y0 + STOREY, FACADE_Z + 0.25], [9, y0 + STOREY, FACADE_Z + 0.25]], {color: '#6d6a60', weight: 1.1, closed: false});
  wInk(p, c, seed + 502, [[-9, y0 + STOREY - 0.35, FACADE_Z + 0.25], [9, y0 + STOREY - 0.35, FACADE_Z + 0.25]], {color: '#6d6a60', weight: 0.9, closed: false});
  for (let s = 0; s < 8; s++) wWash(p, c, seed + 510 + s, '#4b5358', 70, qz(FACADE_Z + 0.5, -4 + s * 1.1, -3.9 + s * 1.1 + 0.1, y0 + STOREY - 1.1, y0 + STOREY - 0.35), 0.2, 0.2);
};

/** The facade behind the drop: storeys whose slab tops sit at `offset + k * 3.0` (offset = how far the scroll has moved, m). */
export const paintFallFacade = (p: Painter, c: YCam, offset = 0.9) => {
  wFill(p, c, 40000, '#a9b4b8', qz(FACADE_Z - 0.05, -20, 20, -80, 80));
  // content follows the storey's absolute index, so a scroll longer than one storey (B02-SH02) moves the same storeys up instead of re-rolling them
  const n = Math.floor(offset / STOREY), o = offset - n * STOREY;
  for (let k = -3; k <= 3; k++) floorY(p, c, k - n, o + (k - 1) * STOREY, 41000 + (k + 3) * 700);
  wWash(p, c, 49000, '#9aa6ab', 60, qz(FACADE_Z + 0.9, -20, 20, -80, 80), 0.1, 0.1);
};
