import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, type YCam} from '../kit/ycam';
import {B} from './balcony';
import {paintBox, qx, qy, qz, wFill, wWash} from './world';

// `new: SET-FACADE` + look-down view of SET-BALCONY (N3, W5.2; scene sheets S01-B01-SH02 and S01-B02-SH03). Balcony metres (see
// balcony.ts): the building face is the plane z = FACE_Z, floors every SLAB_PITCH m below the rail (slab ledges stick out to z -SLAB_OUT),
// the lawn is 27 m below. Facade in cool morning shade, the lawn warm and sunlit.

export const FACE_Z = -0.05, SLAB_PITCH = 2.9, SLAB_OUT = 1.5, LAWN_Y = -27, TOP_Y = 27;
export const DEG = Math.PI / 180;
/** SD02 camera (look down the facade, yaw 180, pitch -65). `k` 0..1 over the shot (eye 1.55 -> 1.45, eased by the caller). */
export const lookDownCam = (k: number): YCam => ({x: -0.05, y: 1.55 - 0.1 * k, z: -0.3, yaw: 180 * DEG, pitch: -65 * DEG, f: 950, hy: 520});
/** SH03 camera (the speck on the facade, looking up from the lawn side). */
export const speckCam = (k: number): YCam => ({x: 2.0, y: 0.25, z: 6.0, yaw: -12 * DEG, pitch: (50 - 4 * k) * DEG, f: 900, hy: 1100});
/** The speck (TINY seen from afar) at shot fraction k: (+0.2, 14.0, +1.4) -> (+0.4, 12.6, +1.7) with a +-0.1 m sway. */
export const speckAt = (k: number, t = 0): V3 => [0.2 + 0.2 * k + 0.1 * Math.sin(t * 2.1), 14.0 - 1.4 * k, 1.4 + 0.3 * k];
/** Vertical vanishing point of the look-down view (a point far below the cap), px. */
export const downVanish = (c: YCam): Pt | null => camPoint(c, [c.x, -5000, FACE_Z]);

/** Slab ledges and windows of the building face below (look down): cool shade, ledges every 2.9 m. */
export const paintFacadeDown = (p: Painter, c: YCam, t: number) => {
  hardFill(p, 14999, B.tile, [[-60, -60], [1140, -60], [1140, 1980], [-60, 1980]]); // the balcony floor behind the cap
  // lawn first (warm, far below), then the face, then ledges far to near
  wFill(p, c, 15000, '#9ec26a', qy(LAWN_Y, -60, 60, -60, FACE_Z - 0.2));
  wWash(p, c, 15001, '#f6e9b8', 120, qy(LAWN_Y + 0.01, -60, 60, -30, FACE_Z - 0.2), 0.2, 0.1);
  wFill(p, c, 15002, '#a9b9c9', qz(FACE_Z, -40, 40, LAWN_Y, 0));
  wWash(p, c, 15003, '#6f8fb0', 90, qz(FACE_Z + 0.001, -40, 40, LAWN_Y, 0), 0.2, 0.1);
  for (let i = 1; i <= 9; i++) {
    const y = -i * SLAB_PITCH, far = i / 9;
    const col = mixColor('#c9cfd4', '#9aa8b8', far * 0.5);
    paintBox(p, c, 15100 + i * 4, {x0: -4, x1: 4, y0: y - 0.25, y1: y, z0: -SLAB_OUT, z1: FACE_Z}, col, {top: 0.12, front: -0.08, right: 0.04}, {ink: true});
    hardFill(p, 15300 + i, mixColor('#bfd0dd', '#8da2b6', far * 0.6), (() => { const q = [[-3, y + SLAB_PITCH - 0.5, FACE_Z + 0.001], [-0.8, y + SLAB_PITCH - 0.5, FACE_Z + 0.001], [-0.8, y + 0.6, FACE_Z + 0.001], [-3, y + 0.6, FACE_Z + 0.001]].map((v) => camPoint(c, v as V3)); return q.every(Boolean) ? (q as Pt[]) : []; })());
  }
  void t; void qx;
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
  for (let i = 0; i <= 9; i++) paintBox(p, c, 15610 + i * 4, {x0: -6, x1: 6, y0: 27 - i * SLAB_PITCH - 0.25, y1: 27 - i * SLAB_PITCH, z0: -0.05, z1: 1.4}, '#c9cfd4', {top: 0.12, front: -0.08, right: 0.04}, {ink: true});
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
