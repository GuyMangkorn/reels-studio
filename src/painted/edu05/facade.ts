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
const floorArt = (p: Painter, c: YCam, seed: number, y: number, out: 1 | -1, far: number, o: {up?: boolean; zr?: number; polish?: boolean} = {}) => {
  const z = FACE_Z, y0 = y + 0.75, y1 = y + SLAB_PITCH - 0.7, n = Math.round(WIN_X / WIN_PITCH);
  const frame = mixColor('#e8dccb', '#8da2b6', far * 0.5), pier = mixColor('#a7b4c2', '#8da2b6', far * 0.4);
  // wall band between slabs (stucco in cool shade), piers a shade darker between the windows
  wFill(p, c, seed, mixColor('#bcc6d0', '#9fb0c2', far * 0.5), qz(z + 0.0005 * out, -WIN_X - 2, WIN_X + 2, y + 0.02, y + SLAB_PITCH - 0.27));
  if (o.polish) { // soft shadow under the slab above (sun low on the +x side), stucco tone drift
    wWash(p, c, seed + 1, '#5d7898', 80, qz(z + 0.0008 * out, -WIN_X - 2, WIN_X + 2, y + SLAB_PITCH - 1.05, y + SLAB_PITCH - 0.27), 0.25, 0.2);
    wWash(p, c, seed + 2, '#d9d0c0', 40, qz(z + 0.0009 * out, 0, WIN_X + 2, y + 0.02, y + 1.2), 0.3, 0.3);
  }
  for (let k = -n; k <= n; k++) {
    const cx = k * WIN_PITCH, x0 = cx - WIN_W / 2, x1 = cx + WIN_W / 2, zz = z + 0.002 * out, id = seed + 10 + (k + n) * 12;
    wFill(p, c, id, frame, qz(zz, x0 - 0.1, x1 + 0.1, y0 - 0.1, y1 + 0.1));
    const lit = (k * 7 + Math.round(-y)) % 5 === 0, curtain = (k * 3 + Math.round(-y * 2)) % 4 === 0;
    wFill(p, c, id + 1, lit ? '#f6d48a' : mixColor('#d9a98a', '#8aa8c8', 0.45 + far * 0.2), qz(zz + 0.001 * out, x0, x1, y0, y1)); // glass: peach dawn at the sill, sky above
    wWash(p, c, id + 2, lit ? '#fff1c0' : '#9fc0e0', lit ? 120 : 110, qz(zz + 0.002 * out, x0, x1, (y0 + y1) / 2, y1), 0.1, 0.1);
    if (o.polish && !lit) { // each window a little different: cool/warm drift and a sky streak
      const hv = (Math.abs(k * 13 + Math.round(-y * 3)) % 7) / 7;
      wWash(p, c, id + 7, hv < 0.5 ? '#7f9cbc' : '#c9a58e', 70, qz(zz + 0.0025 * out, x0, x1, y0, y1), 0.1, 0.2);
      wWash(p, c, id + 8, '#e9f2f6', 50, qz(zz + 0.0026 * out, x0 + 0.15, x0 + 0.5, y0 + 0.1, y1 - 0.1), 0.1, 0.1);
    }
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
  if (o.polish) { // rail ink: top rail and foot rail line
    wInk(p, c, seed + 342, [[-rx - 0.05, rt + 0.03, zr + 0.003 * out], [rx + 0.05, rt + 0.03, zr + 0.003 * out]], {color: mixColor('#3f5266', '#8da2b6', far * 0.5), weight: 0.9});
    wInk(p, c, seed + 343, [[-rx - 0.05, y + 0.08, zr + 0.003 * out], [rx + 0.05, y + 0.08, zr + 0.003 * out]], {color: mixColor('#3f5266', '#8da2b6', far * 0.5), weight: 0.7});
  }
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
  for (let m = 0; m < 9; m++) { // soft mowing stripes along the building, near half only (the caption band stays calm)
    const z1 = FACE_Z - 0.2 - m * 1.4;
    if (m % 2 === 0) wWash(p, c, 14000 + m, '#d4e6a0', 70, qy(LAWN_Y + 0.012, -40, 40, z1 - 1.4, z1), 0.3, 0.3);
  }
  wWash(p, c, 14020, '#7da04e', 60, qy(LAWN_Y + 0.013, -40, 40, -9, -4), 0.4, 0.4); // tone drift
  wWash(p, c, 14021, '#e8efb0', 60, qy(LAWN_Y + 0.014, -3, 14, -6, -1.5), 0.5, 0.4);
  wFill(p, c, 15002, '#a9b9c9', qz(FACE_Z, -40, 40, LAWN_Y, 0));
  wWash(p, c, 15003, '#6f8fb0', 90, qz(FACE_Z + 0.001, -40, 40, LAWN_Y, 0), 0.2, 0.1);
  for (let i = 9; i >= 1; i--) { // far to near
    const y = -i * SLAB_PITCH, far = i / 9, so = i % 2 === 0 ? SLAB_OUT + 1.1 : SLAB_OUT; // even floors jut 1.1 m further: their rails peek past the slab above
    const col = mixColor('#e3d9c8', '#b7b6b4', far * 0.5); // balcony floor seen from above: warm tile, not grey stairs
    paintBox(p, c, 15100 + i * 4, {x0: -4, x1: 4, y0: y - 0.25, y1: y, z0: -so, z1: FACE_Z}, col, {top: -0.12, front: -0.25, right: 0.04}, {ink: true});
    for (let j = -4; j <= 4; j++) wInk(p, c, 15140 + i * 12 + j + 4, [[j * 0.9, y + 0.002, FACE_Z], [j * 0.9, y + 0.002, -so]], {color: mixColor('#c4b9a6', '#9aa8b8', far * 0.5), closed: false, weight: 0.6});
    if (i % 2 === 1) paintBox(p, c, 15260 + i * 8, {x0: 1.2, x1: 3.4, y0: y, y1: y + 0.4, z0: -0.7, z1: FACE_Z - 0.05}, mixColor('#e9e4da', '#9aa8b8', far * 0.5), {top: -0.1}, {ink: true}), wFill(p, c, 15264 + i * 8, mixColor('#6f9a45', '#8da2b6', far * 0.5), qy(y + 0.4, 1.3, 3.3, -0.65, FACE_Z - 0.1));
    floorArt(p, c, 20000 + i * 400, y, -1, far, {zr: -so, polish: true});
  }
  dawnLight(p, c, 15290, LAWN_Y, 0);
  wWash(p, c, 14030, '#46612f', 120, qy(LAWN_Y + 0.02, -40, 40, FACE_Z - 0.9, FACE_Z - 0.1), 0.45, 0.2); // shade where the lawn meets the building foot
  wWash(p, c, 14031, '#4f6f8c', 90, qz(FACE_Z + 0.012, -40, 40, LAWN_Y, LAWN_Y + 1.0), 0.4, 0.2); // and the wall foot
  paintLawnTree(p, c);
  void t; void qx;
};
/**
 * R1.4 scale cue: one lawn tree, base (+6.0, -27, -4.5), 4 m tall, crown dia 3.15 m (about 120 px wide in the FAC camera at L 0). Deterministic
 * (seeds 14100-14199, `hash`): soft ground shadow, a short trunk, a dark underside blob, then layered foliage clumps back to front, each
 * with a mid-green lit side (light from the upper left) and a pale highlight, and leaf dabs.
 */
export const TREE = {base: [6.0, LAWN_Y, -4.5] as V3, h: 4, crown: 3.15};
const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const paintLawnTree = (p: Painter, c: YCam) => {
  const [bx, by, bz] = TREE.base, cy = by + TREE.h - TREE.crown / 2;
  const sh = camPoint(c, [bx + 1.2, by, bz + 0.6]), ground = camPoint(c, [bx, by, bz]), cen = camPoint(c, [bx, cy, bz]);
  const l = camPoint(c, [bx - TREE.crown / 2, cy, bz]), r = camPoint(c, [bx + TREE.crown / 2, cy, bz]);
  if (!sh || !ground || !cen || !l || !r) return;
  const rad = Math.abs(r[0] - l[0]) / 2, [cx, cyy] = cen;
  washAt(p, 14100, '#35522a', 150, ell(sh[0] + rad * 0.75, sh[1] + rad * 0.3, rad * 1.0, rad * 0.4, 18), 0.4, 0.2); // ground shadow, soft, toward the face
  washAt(p, 14101, '#2f4a22', 170, ell(sh[0] + rad * 0.5, sh[1] + rad * 0.3, rad * 0.7, rad * 0.26, 16), 0.3, 0.2);
  washAt(p, 14102, '#3a5626', 110, ell(ground[0] + rad * 0.12, ground[1] + 2, rad * 0.32, rad * 0.1, 12), 0.2, 0.2); // contact under the trunk
  wFill(p, c, 15901, '#5a3f2a', qy(by, bx - 0.16, bx + 0.16, bz - 0.16, bz + 0.16)); // trunk foot
  wFill(p, c, 15902, '#7a5a3c', qz(bz, bx - 0.17, bx + 0.17, by, by + TREE.h - TREE.crown * 0.4)); // trunk, short and visible below the crown
  wFill(p, c, 14103, '#5a3f2a', qz(bz + 0.002, bx + 0.02, bx + 0.17, by, by + TREE.h - TREE.crown * 0.4)); // shaded right half
  hardFill(p, 14104, '#2f4f20', ell(cx + rad * 0.06, cyy + rad * 0.1, rad * 0.98, rad * 0.88, 22)); // dark underside blob
  const clumps = 9;
  for (let k = 0; k < clumps; k++) { // back (low, right) to front (high, left)
    const a = -Math.PI * 0.15 + (k / clumps) * Math.PI * 2 * 1.1, d = rad * (0.42 + 0.22 * hash(14110 + k)), s = rad * (0.42 + 0.1 * hash(14120 + k));
    const x = cx + Math.cos(a) * d, y = cyy + Math.sin(a) * d * 0.85 - rad * 0.06;
    const lit = 0.5 - (Math.cos(a) * 0.5 - Math.sin(a) * 0.5) * 0.5; // 0 = fully lit (upper left), 1 = shade
    hardFill(p, 14130 + k * 5, lit > 0.55 ? '#3b6428' : '#497a2f', ell(x, y, s, s * 0.88, 14));
    washAt(p, 14131 + k * 5, '#76a244', 200 - lit * 90, ell(x - s * 0.2, y - s * 0.22, s * 0.68, s * 0.58, 12), 0.3, 0.3);
    washAt(p, 14132 + k * 5, '#b3cf6c', 130 - lit * 80, ell(x - s * 0.36, y - s * 0.4, s * 0.3, s * 0.24, 10), 0.3, 0.3);
  }
  hardFill(p, 14190, '#4d8032', ell(cx - rad * 0.12, cyy - rad * 0.12, rad * 0.5, rad * 0.46, 14)); // crown cap
  washAt(p, 14191, '#8db553', 190, ell(cx - rad * 0.26, cyy - rad * 0.28, rad * 0.34, rad * 0.28, 12), 0.3, 0.3);
  for (let k = 0; k < 14; k++) { // leaf-highlight dabs, upper left half, and a few dark dabs low right
    const a = Math.PI * (1 + 0.5 * hash(14150 + k)) + 0.1, d = rad * (0.2 + 0.7 * hash(14160 + k)), w = rad * (0.05 + 0.04 * hash(14170 + k));
    washAt(p, 14200 + k, '#d6e68a', 220, ell(cx + Math.cos(a) * d, cyy + Math.sin(a) * d * 0.9, w * 1.4, w, 8), 0.1, 0.2);
  }
  for (let k = 0; k < 6; k++) {
    const a = Math.PI * (0.05 + 0.4 * hash(14180 + k)), d = rad * (0.4 + 0.5 * hash(14185 + k)), w = rad * 0.07;
    washAt(p, 14230 + k, '#24401a', 190, ell(cx + Math.cos(a) * d, cyy + Math.sin(a) * d * 0.85, w * 1.3, w, 8), 0.1, 0.2);
  }
  inkLine(p, 14240, ell(cx + rad * 0.04, cyy + rad * 0.06, rad * 0.99, rad * 0.9, 22), {color: '#2a4420', weight: 1.1, closed: true});
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
