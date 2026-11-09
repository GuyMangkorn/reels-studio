import {ell, hardFill, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import {camDist, type YCam} from '../kit/ycam';
import {paintBox, qx, qy, qz, wFill, wInk, wWash, type Box} from '../edu02/world';

// SET-SOI (brief EDU-EP13-BRIEF-R1 "Set plan — SET-SOI", metres; the imagined place of the myth shot): a bright soi in the afternoon.
// Pavement x -3 .. 3 at the actors' end, asphalt beyond to z -130, four-storey shophouses (3.3 m a storey) both sides from z -5 to -40 at x +-6
// (ochre, teal, cream; shutters, textless signs), the tower: 30 storeys x 3.3 m = 100 m, footprint 24 x 24 m centred (10, 0, -60), pale concrete
// and blue glass bands, a roof parapet and water tank. MAN at (0.20, 0, 0) facing -z; the giant flea feet centre (1.50, 0, -0.60) (re-staged from (0, 0, 0) and (1.70, 0, 0.20) so both are fully in the original CAM-MYTH frame, user 2026-11-09).
export const SOI = {storey: 3.3, tower: {x: 10, z: -60, w: 24, floors: 30}, towerH: 100, man: [0.2, 0, 0] as V3, flea: [1.5, 0, -0.6] as V3, houseH: 13.2} as const;
const HAZE = '#e8f0f0';
let haze = HAZE; // the haze colour of the plate being painted (paintSoi sets it from `o.haze`; the trailer plates use teal)
export const hz = (color: string, dist: number) => mixColor(color, haze, Math.min(0.75, dist / 160));

const skyBands = (p: Painter) => {
  const cols = ['#86bde4', '#9ccbe8', '#b4d8ec', '#cde6f0', '#e0eef0'];
  cols.forEach((col, i) => hardFill(p, 6990 + i, col, [[-200, -200 + i * 480], [1300, -200 + i * 480], [1300, 2200], [-200, 2200]])); // each band covers from its top down; the next overwrites
};

const tower = (p: Painter, c: YCam) => {
  const {x, z, w, floors} = SOI.tower, x0 = x - w / 2, x1 = x + w / 2, zf = z + w / 2, H = SOI.towerH, d = camDist(c, [x, 0, z]);
  wFill(p, c, 7000, hz('#dfe3df', d), qz(zf, x0, x1, 0, H));
  for (let i = 0; i < floors; i++) {
    const y0 = i * SOI.storey + 1.05, y1 = y0 + 1.55;
    wFill(p, c, 7010 + i, hz(i % 7 === 3 ? '#8fb2cf' : '#6f93b8', d), qz(zf + 0.01, x0 + 0.8, x1 - 0.8, y0, y1)); // glass band
    wFill(p, c, 7050 + i, hz('#c9d0cd', d), qz(zf + 0.02, x0, x1, i * SOI.storey, i * SOI.storey + 0.35)); // slab edge
  }
  for (let k = 0; k <= 8; k++) wInk(p, c, 7090 + k, [[x0 + 0.8 + k * ((w - 1.6) / 8), 1, zf + 0.03], [x0 + 0.8 + k * ((w - 1.6) / 8), H - 1.4, zf + 0.03]], {closed: false, weight: 0.6, color: hz('#cfd6d3', d)}); // mullions
  paintBox(p, c, 7100, {x0: x0 - 0.4, x1: x1 + 0.4, y0: H, y1: H + 1.2, z0: z - w / 2 - 0.4, z1: zf + 0.4}, hz('#eceee9', d), {}, {}); // roof parapet
  paintBox(p, c, 7101, {x0: x + 3, x1: x + 8, y0: H + 1.2, y1: H + 5.2, z0: z - 3, z1: z + 2}, hz('#9aa7ad', d), {}, {}); // water tank
  wFill(p, c, 7102, hz('#ffffff', d), qz(zf + 0.03, x0, x0 + 3, H - 8, H)); // a touch brighter at the top
};

const house = (p: Painter, c: YCam, b: Box, color: string, side: -1 | 1, seed: number) => {
  const d = camDist(c, [(b.x0 + b.x1) / 2, 0, (b.z0 + b.z1) / 2]), col = hz(color, d);
  paintBox(p, c, seed, b, col, {top: -0.1, front: 0.04, left: 0.1, right: 0.1}, {ink: false});
  const face = side < 0 ? b.x1 : b.x0, off = side < 0 ? 0.02 : -0.02; // the face toward the street
  for (let s = 0; s < 4; s++) {
    const y0 = s * SOI.storey + 0.8, y1 = y0 + 1.9;
    for (let k = 0; k < 2; k++) {
      const zc = b.z0 + (b.z1 - b.z0) * (0.28 + 0.44 * k), dz = 0.7;
      const shut = s === 0 && k === 1;
      wFill(p, c, seed + 10 + s * 4 + k, hz(shut ? '#5a6a6a' : '#3a4a52', d), qx(face + off, y0, y1, zc - dz, zc + dz));
      if (!shut) wFill(p, c, seed + 40 + s * 4 + k, hz('#d8e4ea', d), qx(face + off * 1.5, y0 + 0.15, y1 - 0.15, zc - dz + 0.12, zc + dz - 0.12));
      else for (let r = 0; r < 4; r++) wInk(p, c, seed + 70 + r, [[face + off * 1.5, y0 + 0.4 * (r + 1), zc - dz], [face + off * 1.5, y0 + 0.4 * (r + 1), zc + dz]], {closed: false, weight: 0.8, color: hz('#2a3a3a', d)});
    }
  }
  wFill(p, c, seed + 90, hz(['#c9503f', '#2f6f9a', '#e0b84a'][seed % 3], d), qx(face + off * 2, 3.0, 3.8, b.z0 + 0.5, b.z1 - 0.5)); // textless sign band
  wFill(p, c, seed + 91, hz('#f3efe6', d), qx(face + off, SOI.houseH, SOI.houseH + 0.35, b.z0, b.z1)); // parapet
};

const ground = (p: Painter, c: YCam) => {
  wFill(p, c, 7200, hz('#9a9ea0', 40), qy(0, -12, 12, -135, 4)); // asphalt
  wFill(p, c, 7201, hz('#d6cfbd', 4), qy(0.003, -3, 3, -6, 4)); // pavement at the actors' end
  wFill(p, c, 7202, hz('#b9b29e', 4), qy(0.006, -3.1, -3, -6, 4));
  wFill(p, c, 7203, hz('#b9b29e', 4), qy(0.006, 3, 3.1, -6, 4));
  for (let k = 0; k < 8; k++) wInk(p, c, 7210 + k, [[-3, 0.004, -k * 0.75 + 3.5], [3, 0.004, -k * 0.75 + 3.5]], {closed: false, weight: 0.7, color: '#a79f89'}); // tile joints
  for (let k = 0; k < 16; k++) wFill(p, c, 7230 + k, hz('#f1ecd8', 20 + k * 6), qy(0.004, -0.12, 0.12, -9 - k * 6, -12 - k * 6)); // centre dashes
  wWash(p, c, 7260, '#fff6d6', 90, qy(0.005, -2, 5, -8, 3), 0.3, 0.5); // afternoon sun on the pavement
};

/** SET-SOI (back to front: sky, tower, shophouses far to near, ground), then `cast` near the lens. */
export const paintSoi = (p: Painter, c: YCam, o: {cast?: ((p: Painter, c: YCam) => void)[]; sky?: (p: Painter, c: YCam) => void; haze?: string} = {}) => {
  haze = o.haze ?? HAZE;
  if (o.sky) o.sky(p, c); // trailer plates (trailer.ts): dusk sky, sun disc and the skyline instead of the afternoon sky
  else {
    skyBands(p);
    washAt(p, 6995, '#ffffff', 90, ell(300, 170, 230, 55, 20), 0.4, 0.6);
    washAt(p, 6996, '#ffffff', 80, ell(850, 460, 200, 45, 20), 0.4, 0.6);
  }
  ground(p, c);
  tower(p, c);
  const colors = ['#d9a85a', '#6aa89f', '#efe2c4', '#d98a6a', '#a9c46a'];
  const boxes: {b: Box; color: string; side: -1 | 1; seed: number}[] = [];
  for (let i = 0; i < 7; i++) for (const side of [-1, 1] as const) {
    const z1 = -5 - i * 5, b: Box = side < 0 ? {x0: -12, x1: -6, y0: 0, y1: SOI.houseH, z0: z1 - 5, z1} : {x0: 6, x1: 12, y0: 0, y1: SOI.houseH, z0: z1 - 5, z1};
    boxes.push({b, color: colors[Math.floor(hash(i * 3 + (side + 1) * 7) * colors.length)], side, seed: 7300 + i * 200 + (side + 1) * 90});
  }
  boxes.sort((a, b) => camDist(c, [(b.b.x0 + b.b.x1) / 2, 0, (b.b.z0 + b.b.z1) / 2]) - camDist(c, [(a.b.x0 + a.b.x1) / 2, 0, (a.b.z0 + a.b.z1) / 2]));
  boxes.forEach((q) => house(p, c, q.b, q.color, q.side, q.seed));
  haze = HAZE;
  (o.cast ?? []).forEach((f) => f(p, c));
};
