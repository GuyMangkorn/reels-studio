import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, type YCam} from '../kit/ycam';
import {B} from './balcony';
import {camOf, MACRO_CAMS} from './cams';
import {paintBox, qx, qy, qz, wFill, wInk, wWash} from './world';

// `new: SET-FACADE` + look-down view of SET-BALCONY (N3, W5.2; scene sheets S01-B01-SH02 and S01-B02-SH03). Balcony metres (see
// balcony.ts): the building face is the plane z = FACE_Z, floors every SLAB_PITCH m below the rail (slab ledges stick out to z -SLAB_OUT),
// the lawn is 27 m below. Facade in cool morning shade, the lawn warm and sunlit.

export const FACE_Z = -0.05, SLAB_PITCH = 2.9, SLAB_OUT = 1.5, LAWN_Y = -27, TOP_Y = 27;
export const DEG = Math.PI / 180;
/** SD02 camera (R1.4 FR16, exterior look-down): the shot camera `MACRO_CAMS['S01-B01-SH02']` at shot fraction `k` 0..1 (its ease is in the data). */
export const lookDownCam = (k: number): YCam => camOf(MACRO_CAMS['S01-B01-SH02'], k);
/** SH03 camera (the speck on the facade, looking up from the lawn side). */
export const speckCam = (k: number): YCam => ({x: 2.0, y: 0.25, z: 6.0, yaw: -12 * DEG, pitch: (50 - 4 * k) * DEG, f: 900, hy: 1100});
/** The speck (TINY seen from afar) at shot fraction k: (+0.2, 14.0, +1.4) -> (+0.4, 12.6, +1.7) with a +-0.1 m sway. */
export const speckAt = (k: number, t = 0): V3 => [0.2 + 0.2 * k + 0.1 * Math.sin(t * 2.1), 14.0 - 1.4 * k, 1.4 + 0.3 * k];
/** Vertical vanishing point of the look-down view (a point far below the cap), px. */
export const downVanish = (c: YCam): Pt | null => camPoint(c, [c.x, -5000, FACE_Z]);


/**
 * FR14 `new: SET-FACADE` art: an apartment block, not stairs. Each floor (slab top at `y`, outward = `out` along z) gets a window band
 * (frames, glass catching the dawn sky, a few warm lit rooms and curtains) on the face plane and a balcony rail on the slab edge (top
 * rail plus balusters, glass panel wash). `far` 0..1 fades the floor toward the haze. Dawn: cool shade on the wall, peach glass.
 */
const WIN_W = 1.5, WIN_PITCH = 2.4, WIN_X = 9;
const floorArt = (p: Painter, c: YCam, seed: number, y: number, out: 1 | -1, far: number, o: {up?: boolean; zr?: number} = {}) => {
  const z = FACE_Z, y0 = y + 0.75, y1 = y + SLAB_PITCH - 0.7, n = Math.round(WIN_X / WIN_PITCH);
  const frame = mixColor('#e8dccb', '#8da2b6', far * 0.5), pier = mixColor('#a7b4c2', '#8da2b6', far * 0.4);
  // wall band between slabs (stucco in cool shade), piers a shade darker between the windows
  wFill(p, c, seed, mixColor('#bcc6d0', '#9fb0c2', far * 0.5), qz(z + 0.0005 * out, -WIN_X - 2, WIN_X + 2, y + 0.02, y + SLAB_PITCH - 0.27));
  for (let k = -n; k <= n; k++) {
    const cx = k * WIN_PITCH, x0 = cx - WIN_W / 2, x1 = cx + WIN_W / 2, zz = z + 0.002 * out, id = seed + 10 + (k + n) * 12;
    wFill(p, c, id, frame, qz(zz, x0 - 0.1, x1 + 0.1, y0 - 0.1, y1 + 0.1));
    const lit = (k * 7 + Math.round(-y)) % 5 === 0, curtain = (k * 3 + Math.round(-y * 2)) % 4 === 0;
    wFill(p, c, id + 1, lit ? '#f6d48a' : mixColor('#d9a98a', '#8aa8c8', 0.45 + far * 0.2), qz(zz + 0.001 * out, x0, x1, y0, y1)); // glass: peach dawn at the sill, sky above
    wWash(p, c, id + 2, lit ? '#fff1c0' : '#9fc0e0', lit ? 120 : 110, qz(zz + 0.002 * out, x0, x1, (y0 + y1) / 2, y1), 0.1, 0.1);
    if (curtain) wFill(p, c, id + 3, '#e9dfd0', qz(zz + 0.003 * out, x0, cx - 0.05, y0, y1));
    wFill(p, c, id + 4, frame, qz(zz + 0.004 * out, cx - 0.03, cx + 0.03, y0, y1)); // mullion
    wFill(p, c, id + 5, frame, qz(zz + 0.004 * out, x0, x1, (y0 + y1) / 2 - 0.03, (y0 + y1) / 2 + 0.03)); // transom
    wInk(p, c, id + 6, qz(zz + 0.005 * out, x0 - 0.1, x1 + 0.1, y0 - 0.1, y1 + 0.1), {color: pier, weight: 0.7});
    void pier;
  }
  // balcony rail on the slab edge: panel wash, top rail, balusters every 0.35 m
  const zr = o.zr ?? (o.up ? 1.4 : -SLAB_OUT), rx = 4.2, rt = y + 1.05;
  wWash(p, c, seed + 300, '#cfe0e4', 90, qz(zr, -rx, rx, y + 0.1, rt), 0.05, 0.1);
  for (let b = -12; b <= 12; b++) wFill(p, c, seed + 310 + b + 12, mixColor(B.railDark, '#8da2b6', far * 0.4), qz(zr + 0.001 * out, (b * rx) / 12 - 0.02, (b * rx) / 12 + 0.02, y + 0.1, rt));
  wFill(p, c, seed + 340, mixColor(B.rail, '#c9d3dc', far * 0.4), qz(zr + 0.002 * out, -rx - 0.05, rx + 0.05, rt - 0.05, rt + 0.03));
  wFill(p, c, seed + 341, mixColor(B.railDark, '#8da2b6', far * 0.4), qz(zr + 0.002 * out, -rx - 0.05, rx + 0.05, y + 0.08, y + 0.14));
};
/** Dawn light over the facade: a warm wash from the sun side (+x), strongest on the upper floors, and a pale sheen on the slab edges. */
const dawnLight = (p: Painter, c: YCam, seed: number, y0: number, y1: number) => {
  wWash(p, c, seed, '#ffd9a8', 60, qz(FACE_Z + 0.008, -3, 40, y0, y1), 0.3, 0.1);
  wWash(p, c, seed + 1, '#f6b4a0', 40, qz(FACE_Z + 0.009, 3, 40, y0, y1), 0.3, 0.1);
};

/** Slab ledges and windows of the building face below (look down): cool shade, ledges every 2.9 m. */
export const paintFacadeDown = (p: Painter, c: YCam, t: number) => {
  hardFill(p, 14999, B.tile, [[-60, -60], [1140, -60], [1140, 1980], [-60, 1980]]); // the balcony floor behind the cap
  // lawn first (warm, far below), then the face, then ledges far to near
  wFill(p, c, 15000, '#9ec26a', qy(LAWN_Y, -60, 60, -60, FACE_Z - 0.2));
  wWash(p, c, 15001, '#f6e9b8', 120, qy(LAWN_Y + 0.01, -60, 60, -30, FACE_Z - 0.2), 0.2, 0.1);
  wFill(p, c, 15002, '#a9b9c9', qz(FACE_Z, -40, 40, LAWN_Y, 0));
  wWash(p, c, 15003, '#6f8fb0', 90, qz(FACE_Z + 0.001, -40, 40, LAWN_Y, 0), 0.2, 0.1);
  for (let i = 9; i >= 1; i--) { // far to near
    const y = -i * SLAB_PITCH, far = i / 9, so = i % 2 === 0 ? SLAB_OUT + 1.1 : SLAB_OUT; // even floors jut 1.1 m further: their rails peek past the slab above
    const col = mixColor('#e3d9c8', '#b7b6b4', far * 0.5); // balcony floor seen from above: warm tile, not grey stairs
    paintBox(p, c, 15100 + i * 4, {x0: -4, x1: 4, y0: y - 0.25, y1: y, z0: -so, z1: FACE_Z}, col, {top: -0.12, front: -0.25, right: 0.04}, {ink: true});
    for (let j = -4; j <= 4; j++) wInk(p, c, 15140 + i * 12 + j + 4, [[j * 0.9, y + 0.002, FACE_Z], [j * 0.9, y + 0.002, -so]], {color: mixColor('#c4b9a6', '#9aa8b8', far * 0.5), closed: false, weight: 0.6});
    if (i % 2 === 1) paintBox(p, c, 15260 + i * 8, {x0: 1.2, x1: 3.4, y0: y, y1: y + 0.4, z0: -0.7, z1: FACE_Z - 0.05}, mixColor('#e9e4da', '#9aa8b8', far * 0.5), {top: -0.1}, {ink: true}), wFill(p, c, 15264 + i * 8, mixColor('#6f9a45', '#8da2b6', far * 0.5), qy(y + 0.4, 1.3, 3.3, -0.65, FACE_Z - 0.1));
    floorArt(p, c, 20000 + i * 400, y, -1, far, {zr: -so});
  }
  dawnLight(p, c, 15290, LAWN_Y, 0);
  paintLawnTree(p, c);
  void t; void qx;
};
/**
 * R1.4 scale cue: one lawn tree, base (+6.0, -27, -4.5), 5 m tall, crown dia 4 m (about 120 px in the FAC camera). Deterministic:
 * trunk quad, a shaded crown blob, a sunlit blob on the sun side (+x) and a soft ground shadow.
 */
export const TREE = {base: [6.0, LAWN_Y, -4.5] as V3, h: 5, crown: 4};
const paintLawnTree = (p: Painter, c: YCam) => {
  const [bx, by, bz] = TREE.base, cy = by + TREE.h - TREE.crown / 2;
  const sh = camPoint(c, [bx + 1.2, by, bz + 0.6]), ground = camPoint(c, [bx, by, bz]), cen = camPoint(c, [bx, cy, bz]);
  const l = camPoint(c, [bx - TREE.crown / 2, cy, bz]), r = camPoint(c, [bx + TREE.crown / 2, cy, bz]);
  if (!sh || !ground || !cen || !l || !r) return;
  const rad = Math.abs(r[0] - l[0]) / 2, ppm = rad / (TREE.crown / 2);
  washAt(p, 15900, '#4d6f2e', 150, ell(sh[0], sh[1], rad * 0.95, rad * 0.28, 16), 0.2, 0.2); // ground shadow, toward the face
  wFill(p, c, 15901, '#6b4b32', qy(by, bx - 0.12, bx + 0.12, bz - 0.12, bz + 0.12)); // trunk foot (top view of the base)
  wFill(p, c, 15902, '#6b4b32', qz(bz, bx - 0.14, bx + 0.14, by, by + TREE.h - TREE.crown * 0.4));
  hardFill(p, 15903, '#3f6a2c', ell(cen[0], cen[1], rad, rad * 0.92, 20));
  washAt(p, 15904, '#6f9a3c', 230, ell(cen[0] + rad * 0.22, cen[1] - rad * 0.2, rad * 0.62, rad * 0.55, 18), 0.25, 0.3);
  washAt(p, 15905, '#a9c862', 150, ell(cen[0] + rad * 0.34, cen[1] - rad * 0.34, rad * 0.3, rad * 0.26, 14), 0.3, 0.3);
  inkLine(p, 15906, ell(cen[0], cen[1], rad, rad * 0.92, 20), {color: '#2f4a22', weight: 1.4, closed: true});
  void ppm;
};
/** The rail cap and the mug on it for the look-down view (the right forearm is the rig's). */
export const paintCap = (p: Painter, c: YCam) => {
  paintBox(p, c, 15500, {x0: -1.8, x1: 2.2, y0: 1.06, y1: 1.1, z0: -0.04, z1: 0.04}, B.rail, {top: 0.15, front: -0.08, right: 0.05}, {ink: true});
};

/** The building face seen from below (SH03): the face plane z = FACE_Z, her slab at y 27 with the planter as a green dot, the tree. */
export const paintFacadeUp = (p: Painter, c: YCam, k: number) => {
  wFill(p, c, 15600, '#a9c4dc', qy(60, -80, 80, -40, 40));
  wFill(p, c, 15601, '#b7c4d0', qz(FACE_Z, -12, 12, 0, 40));
  wWash(p, c, 15602, '#6f8fb0', 90, qz(FACE_Z + 0.001, -12, 12, 0, 40), 0.2, 0.1);
  for (let i = 9; i >= 0; i--) floorArt(p, c, 30000 + i * 400, 27 - i * SLAB_PITCH, 1, i / 12, {up: true});
  dawnLight(p, c, 15605, -2, 30);
  for (let i = 0; i <= 9; i++) paintBox(p, c, 15610 + i * 4, {x0: -6, x1: 6, y0: 27 - i * SLAB_PITCH - 0.25, y1: 27 - i * SLAB_PITCH, z0: -0.05, z1: 1.4}, '#e0d8cb', {top: 0.12, front: -0.2, right: 0.04}, {ink: true});
  const dot = camPoint(c, [0.3, 27.15, 0.5]);
  if (dot) washAt(p, 15700, '#5f8a34', 255, ell(dot[0], dot[1], 6, 4, 8), 0, 0);
  void k;
};
/** `new: ring marker`: a chalk circle, screen space, Ø `d` px at `centre`, drawn over L 2-8 (`k` 0..1 = how much of the circle is drawn). */
export const paintRing = (p: Painter, centre: Pt, k: number, d = 70) => {
  const n = 28, m = Math.max(2, Math.round(n * Math.min(1, k)));
  const pts: Pt[] = Array.from({length: m + 1}, (_, i): Pt => { const a = -Math.PI / 2 + (i / n) * 2 * Math.PI; return [centre[0] + Math.cos(a) * d / 2 * (1 + 0.03 * Math.sin(a * 3)), centre[1] + Math.sin(a) * d / 2]; });
  inkLine(p, 15800, pts, {weight: 2.2, color: '#fffbe8', closed: false, curve: 0.3});
};
