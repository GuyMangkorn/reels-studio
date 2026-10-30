import type {Pt} from '../painter';

// ZCPAINT projection helper (S-P05 part, `PROJ-ZCP-R1` / `MK-ZC-ST-04`): the one place that maps ZC-UNIT metres to PLATE
// pixels for section shots. Y runs along the section from the door-wall corridor face (Y 0) toward the balcony, z up from
// the floor, d depth behind the cut plane; screen x = 540 + (Y - Yc) * U, y = floorY - z * U at the cut plane; a point at
// depth d maps to VP + (cut-plane point - VP) * s(d), s(d) = 1 / (1 + d / 6 m).

export type Sec = {U: number; floorY: number; vp: Pt};
/** `SEC-2D` standing section (R2). */
export const SEC_2D: Sec = {U: 380, floorY: 1230, vp: [540, 860]};
/** `SEC-2D-LL` seated: B09 (565 px/m, floor 1020, VP y 700) and B07 (480 px/m, floor 1230, VP y 860). */
export const SEC_2D_LL_B09: Sec = {U: 565, floorY: 1020, vp: [540, 700]};
export const SEC_2D_LL_B07: Sec = {U: 480, floorY: 1230, vp: [540, 860]};

export const depthScale = (d: number) => 1 / (1 + d / 6);

/** Projector for one section framing with section coordinate `yc` at screen x 540. */
export const section = (sec: Sec, yc: number) => {
  const P = (y: number, z: number, d: number): Pt => {
    const x = 540 + (y - yc) * sec.U, yy = sec.floorY - z * sec.U, s = depthScale(d);
    return [sec.vp[0] + (x - sec.vp[0]) * s, sec.vp[1] + (yy - sec.vp[1]) * s];
  };
  /** Pixels per metre of a figure standing at depth d. */
  const pxPerM = (d: number) => sec.U * depthScale(d);
  return {P, pxPerM, sec, yc};
};
export type Section = ReturnType<typeof section>;

/**
 * One-point perspective (`PERSP-2D`): camera at (cam.Y, cam.d), eye height `eye`, level, looking toward -Y, so the depth
 * is cam.Y - Y and screen-right is +d. Focal length `F` in px (vertical). Checked against the B10 staging: the door
 * face at Y 0.18 (depth 3.07 m) projects to x 408-948, top y 213.
 */
export const persp = (F: number, eye: number, cam: {Y: number; d: number}, vp: Pt) =>
  (Y: number, z: number, d: number): Pt => {
    const depth = cam.Y - Y;
    return [vp[0] + ((d - cam.d) * F) / depth, vp[1] - ((z - eye) * F) / depth];
  };

/**
 * Section truck (`S-P04` a): the section coordinate Yc eased from `a` to `b` by frame `end`, with `ease` frames of
 * acceleration and deceleration and a constant speed between (the brief's "≈7 px/f"). Clamped at both ends.
 */
export const truckYc = (pf: number, a: number, b: number, end: number, ease = 10) => {
  const v = (b - a) / (end - ease);
  const c = Math.min(Math.max(pf, 0), end);
  let disp: number;
  if (c <= ease) disp = (v * c * c) / (2 * ease);
  else if (c <= end - ease) disp = (v * ease) / 2 + v * (c - ease);
  else {
    const t = c - (end - ease);
    disp = (v * ease) / 2 + v * (end - 2 * ease) + v * (t - (t * t) / (2 * ease));
  }
  return a + disp;
};

/** Section truck with a hold (B04-SH01: Yc held at `a` for `hold` frames, then the eased truck to `b` by `end`). */
export const truckYcHold = (pf: number, a: number, b: number, hold: number, end: number, ease = 10) =>
  pf <= hold ? a : truckYc(pf - hold, a, b, end - hold, ease);
