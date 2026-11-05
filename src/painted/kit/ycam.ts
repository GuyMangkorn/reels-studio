import type {Pt} from './painter';
import type {V3} from './space';

// Yaw camera (kit, 4 Nov 2026; promoted from the PARALLAX-ORBIT360 spike). A pinhole camera that can stand anywhere and look in any
// horizontal direction (`yaw`, optional upward `pitch`), for sets built in world metres. Opt-in: the EG `Cam`/`proj` (everyone-gone/space.ts,
// no yaw, z-only near clamp) and the `Proj` projectors of the other episodes are untouched and keep drawing exactly as before.
//
// World frame as the EG sets: metres, +x right, +y up, +z toward the street (the camera at yaw 0 looks toward -z). `yaw` turns the view
// toward +x (yaw = +90 deg looks along +x). Picture 1080 wide: x = 540 + cx + f * right / depth, y = hy - f * up / depth.
// A set that is to be seen all round must have something behind the lens: this camera clips polygons at the near plane
// but cannot paint what the set lacks (see `src/painted/spike/Orbit360.tsx` for a closed crossroads).

/** `near` (optional, m): this camera's near plane instead of `YCAM_NEAR`, for a lens a few centimetres over a counter (EDU-EP02 board-level inserts); absent = 0.3 as before. */
export type YCam = {x: number; y: number; z: number; yaw: number; f: number; hy: number; pitch?: number; cx?: number; near?: number};
/** Camera space: `r` right, `u` up, `d` depth along the view axis (m). */
export type CamPt = {r: number; u: number; d: number};
/** Nearest depth (m) a polygon may reach before it is cut. */
export const YCAM_NEAR = 0.3;

/** A world point in camera space (yaw about the vertical axis, then pitch). */
export const camSpace = (c: YCam, [x, y, z]: V3): CamPt => {
  const dx = x - c.x, dz = z - c.z, s = Math.sin(c.yaw), co = Math.cos(c.yaw);
  const r = dx * co + dz * s, u = y - c.y, d = dx * s - dz * co;
  if (!c.pitch) return {r, u, d};
  const cs = Math.cos(c.pitch), sn = Math.sin(c.pitch);
  return {r, u: u * cs - d * sn, d: d * cs + u * sn};
};
/** Picture point of a camera-space point (must have d > 0). */
export const camToPicture = (c: YCam, q: CamPt): Pt => [540 + (c.cx ?? 0) + (c.f * q.r) / q.d, c.hy - (c.f * q.u) / q.d];
/** Picture point of a world point, or null when it is not in front of the near plane. */
export const camPoint = (c: YCam, v: V3, near = c.near ?? YCAM_NEAR): Pt | null => {
  const q = camSpace(c, v);
  return q.d >= near ? camToPicture(c, q) : null;
};
/** Depth along the view axis (m); negative behind the lens. */
export const camDepth = (c: YCam, v: V3): number => camSpace(c, v).d;
/** Horizontal distance from the camera (m), for painter's order. */
export const camDist = (c: YCam, [x, , z]: V3): number => Math.hypot(x - c.x, z - c.z);
/** px per metre at the world point (the `unit` drawFigure takes), clamped at the near plane. */
export const camUnit = (c: YCam, v: V3, near = c.near ?? YCAM_NEAR): number => c.f / Math.max(near, camSpace(c, v).d);

/** World polygon to picture polygon, cut at the near plane first (Sutherland-Hodgman on depth), so a floor or wall that runs behind the lens still fills the picture correctly. */
export const camPoly = (c: YCam, pts: V3[], near = c.near ?? YCAM_NEAR): Pt[] => {
  const q = pts.map((p) => camSpace(c, p)), out: CamPt[] = [];
  for (let i = 0; i < q.length; i++) {
    const a = q[i], b = q[(i + 1) % q.length], ina = a.d >= near, inb = b.d >= near;
    if (ina) out.push(a);
    if (ina !== inb) {
      const k = (near - a.d) / (b.d - a.d);
      out.push({r: a.r + (b.r - a.r) * k, u: a.u + (b.u - a.u) * k, d: near});
    }
  }
  return out.map((p) => camToPicture(c, p));
};

/** Camera on a horizontal circle about `at` (metres): `azimuth` 0 puts it on +z looking toward -z, positive azimuth swings it toward +x; eye height `eye`, looking at `at` horizontally. */
export const orbitYCam = (at: V3, radius: number, azimuth: number, eye: number, f: number, hy: number): YCam =>
  ({x: at[0] + radius * Math.sin(azimuth), y: eye, z: at[2] + radius * Math.cos(azimuth), yaw: -azimuth, f, hy});

/** Blend of two cameras (every numeric field; yaw by the shorter arc). `e` 0..1. */
export const mixYCam = (a: YCam, b: YCam, e: number): YCam => {
  const m = (p: number, q: number) => p + (q - p) * e;
  let dy = b.yaw - a.yaw;
  dy = dy - Math.round(dy / (2 * Math.PI)) * 2 * Math.PI;
  return {x: m(a.x, b.x), y: m(a.y, b.y), z: m(a.z, b.z), yaw: a.yaw + dy * e, f: m(a.f, b.f), hy: m(a.hy, b.hy), pitch: m(a.pitch ?? 0, b.pitch ?? 0), cx: m(a.cx ?? 0, b.cx ?? 0)};
};

/**
 * Angle (degrees) at which the camera sees a figure standing at `at` and facing the horizontal world direction `facing` ([x, z]):
 * 0 = facing the camera, +90 = facing the screen right, 180 = facing away, -90 = screen left. It uses the line of sight to the
 * figure, so a figure off to the side of the view turns with perspective.
 */
export const viewAngle = (c: YCam, at: V3, facing: [number, number]): number => {
  const q = camSpace({...c, pitch: 0}, at), s = Math.sin(c.yaw), co = Math.cos(c.yaw);
  const fr = facing[0] * co + facing[1] * s, fd = facing[0] * s - facing[1] * co;
  const n = Math.hypot(q.r, q.d) || 1, lr = -q.r / n, ld = -q.d / n; // toward the camera
  return (Math.atan2(fr * -ld + fd * lr, fr * lr + fd * ld) * 180) / Math.PI;
};
