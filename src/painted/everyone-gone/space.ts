import type {Pt} from '../kit/painter';
import type {V3} from '../kit/space';

// EG-EP01-SHORT spaces (brief EG-BRIEF-FILM-R1.2, VD04/VD13; Film look frames W3.1, 3 Nov 2026). Picture 1080x1920.
// World metres: origin on the ground at the door centre, +x right (as seen from the street), +y up, +z toward the street.
// The storefront plane is z 0; the soi road runs z 2.5..8.5, the far pavement z 8.5..11, the far shophouses stand at z 11.
// Every camera looks straight toward -z with no tilt or roll (verticals stay vertical), so a plane of constant z projects
// to an axis-aligned rectangle: the glass clip of the reflection (VD05) is a plain rectangle intersection.

/**
 * `cx` = horizontal lens shift in px (default 0; stands in for a yaw so planes stay axis-aligned, sc01 S01-B02-SH01 fallback),
 * `pitch` = upward tilt in radians (default 0; a true rotation, used only by the viaduct tilt where no ground is painted).
 */
export type Cam = {x: number; y: number; z: number; f: number; hy: number; cx?: number; pitch?: number};

/**
 * Station A (frame 0, S01-B02-SH03, S04-B01-SH02): across the soi, 5.5 m from the door, 0.5 m right of its axis.
 * Station B (FPOV, brief R1.3 VD03/VD04): the camera is YOUR eyes, standing on the sunlit pavement B_DIST (1.5 m since 3 Nov 2026, was 2.2) from the door,
 * 0.3 m right of its axis, eye 1.6 m. Lens f 587 (wide, about 85 deg across). The door centre lands on the same picture x as
 * at A (454 px); the door is about 1.55x larger than at A (you crossed the soi and came closer). The SS-R1 matched rect
 * (camera 3.4 m, f 587) put "you" in the road inside the shade of the camera-side row, where a missing shadow proves nothing.
 * Station G (FPOV at the glass, S04-B01-SH03 reach): you stepped in to 0.8 m from the door, lens f 700, horizon at y 900 so
 * the transom and the sensor box show at the top (the sensor that ignores you).
 * Station C (closing wide, R1.2): 9.0 m from the door, lens f 950 (as A), horizon lower in frame so the upper floors and a
 * strip of milky sky show.
 */
export const STATION_A: Cam = {x: 0.5, y: 1.6, z: 5.5, f: 950, hy: 744};
/** Distance of station B from the door (m). 1.1 m since 3 Nov 2026 (user: real door sensors detect at close range; was 1.5, first 2.2). The door opening (+-0.9 m) is 20 px cropped at the left edge. */
export const B_DIST = 1.1;
/** Station B x (m right of the door axis): 0.2 since EG-SC-R4 (was 0.3), keeps the walk-up framing at 1.5 m. */
export const B_X = 0.2;
/** Lens shift that keeps the door centre at picture x 460 whatever the distance (x 460 = old B at 2.2 m, A->B cut logic). */
/** Station B lens (px): 540 since EG-SC-R5 (Film), so the whole door (x 18..902 at 1.1 m) fits. */
export const B_F = 540;
export const bShift = (z: number) => (B_F * B_X) / z - 80;
export const STATION_B: Cam = {x: B_X, y: 1.6, z: B_DIST, f: B_F, hy: 744, cx: bShift(B_DIST)};
export const STATION_G: Cam = {x: 0.3, y: 1.6, z: 0.6, f: 700, hy: 900};
export const STATION_C: Cam = {x: 0.5, y: 1.6, z: 9.0, f: 950, hy: 960};
/** SS-R1 station B (over the shoulder, 3.4 m, figure seen from behind). Superseded by FPOV in R1.3; kept for provenance. */
export const STATION_B_SSR1: Cam = {x: 0.5, y: 1.6, z: 3.4, f: 587, hy: 744};

/** Nearest depth a polygon may reach before it is cut (m in front of the lens). */
export const NEAR_D = 0.35;

/** Picture point of a world point under camera `c`. */
export const proj = (c: Cam, [x, y, z]: V3): Pt => {
  if (c.pitch) {
    const dd = c.z - z, dy = y - c.y, cs = Math.cos(c.pitch), sn = Math.sin(c.pitch);
    const fwd = Math.max(NEAR_D, dd * cs + dy * sn), up = dy * cs - dd * sn;
    return [540 + (c.cx ?? 0) + (c.f * (x - c.x)) / fwd, c.hy - (c.f * up) / fwd];
  }
  const d = Math.max(NEAR_D, c.z - z);
  return [540 + (c.cx ?? 0) + (c.f * (x - c.x)) / d, c.hy + (c.f * (c.y - y)) / d];
};
/** px per metre at depth z. */
export const unitAt = (c: Cam, z: number) => c.f / Math.max(NEAR_D, c.z - z);

/** Ground-plane polygon (y = h) cut at the near plane, then projected. */
export const groundQuad = (c: Cam, x0: number, x1: number, z0: number, z1: number, h = 0): Pt[] => {
  const zn = Math.min(Math.max(z0, z1), c.z - NEAR_D), zf = Math.min(z0, z1);
  return [proj(c, [x0, h, zf]), proj(c, [x1, h, zf]), proj(c, [x1, h, zn]), proj(c, [x0, h, zn])];
};
/** Frontal rectangle at depth z (x0..x1, y0..y1), projected. */
export const frontRect = (c: Cam, z: number, x0: number, x1: number, y0: number, y1: number): Pt[] =>
  [proj(c, [x0, y1, z]), proj(c, [x1, y1, z]), proj(c, [x1, y0, z]), proj(c, [x0, y0, z])];

/**
 * Sun (VD02/VD13): low, camera-left, about 07:00. Shadows on the ground run right and away from the camera along SUN_DIR
 * (unit vector in x/z) with SUN_K metres of shadow per metre of height (sun elevation about 27 deg). On the storefront
 * plane (z 0) the rest of a vertical shadow climbs straight up.
 */
export const SUN_DIR: [number, number] = [0.6, -0.8];
export const SUN_K = 1.95;

/**
 * Story positions (VD04/VD13, `estimated`). FPOV (R1.3): you are the camera at station B (feet under STATION_B) and at
 * station G (feet under STATION_G); no body is drawn there. Your shadow would run from under the lens along SUN_DIR, which
 * projects to the vertical line x = 540 + f * 0.75 (980 px at B): the empty strip right of the bollard shadow is CL07.
 * The VD13 object about 1.0 m from you is the steel bollard (0.9 m) right of the door axis. The lamp post (with the wires)
 * stands far left at the facade, out of the A and B frames. W3.1 look check (SS-R1): with the post at (-1.2, 1.45) its
 * shadow passed behind the back-view figure and read as the figure's own shadow.
 * YOU / HAND_REACH: the approved LF05 position (SS-R1) of the small figure at C, kept so LF05 is unchanged.
 * YOU_GLASS: the R1.3 continuity proposal, the figure where the FPOV reach stands (Q2 on the review page).
 */
export const YOU: V3 = [-0.3, 0, 1.8];
export const YOU_B: V3 = [B_X, 0, B_DIST];
export const YOU_GLASS: V3 = [0.3, 0, 0.6];
export const POST: V3 = [-2.6, 0, 0.7];
/** Iron pole (z 0.31 -> 0.25 at B 1.1 m: base at y 1849, the lowest z that keeps the foot in the 1920 frame; 0.91 m from the eye): moved from (0.55, 0, 1.25) to (0.64, 0, 0.31) on 3 Nov 2026 (base at about x 0.70W, y 0.80H at B 1.5 m, so its shadow stays in frame; out of frame right at G). */
export const BOLLARD: V3 = [0.52, 0, 0.25];
export const BOLLARD_H = 0.9;
/** Right fingertips on the glass (FPOV reach, P16 seen from your eyes): the door glass is the plane z 0. */
export const TOUCH: V3 = [0.2, 1.42, 0.03];

/**
 * Door interaction clock (VD06, `DOOR_CLOCK` in the sequence index). `t` = frames since the open command (30 fps): 0 at t=0,
 * rises to 1 at t=15 (ease-in-out), holds on [15, 60), falls to 0 at t=75, 0 afterwards. One function for all three openings
 * (S01-B02-SH03 command at shot f 5, S02-B01-SH04 at f 3, S04-B01-SH02 at f 15). Chime onset at t=3 is Editor's.
 */
export const DOOR_CLOCK = {rise: 15, holdEnd: 60, fallEnd: 75} as const;
const inOut = (u: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, u)));
export const doorOpen = (t: number): number => {
  if (t <= 0 || t >= DOOR_CLOCK.fallEnd) return 0;
  if (t < DOOR_CLOCK.rise) return inOut(t / DOOR_CLOCK.rise);
  if (t < DOOR_CLOCK.holdEnd) return 1;
  return inOut(1 - (t - DOOR_CLOCK.holdEnd) / (DOOR_CLOCK.fallEnd - DOOR_CLOCK.holdEnd));
};

/** Linear blend of two cameras (every numeric field; missing cx/pitch count as 0). `e` 0..1. */
export const lerpCam = (a: Cam, b: Cam, e: number): Cam => {
  const m = (u: number, v: number) => u + (v - u) * e;
  return {x: m(a.x, b.x), y: m(a.y, b.y), z: m(a.z, b.z), f: m(a.f, b.f), hy: m(a.hy, b.hy), cx: m(a.cx ?? 0, b.cx ?? 0), pitch: m(a.pitch ?? 0, b.pitch ?? 0)};
};
/** Clamped 0..1 progress of `f` over [f0, f1]. */
export const prog = (f: number, f0: number, f1: number) => Math.min(1, Math.max(0, (f - f0) / (f1 - f0)));
export const easeOut3 = (u: number) => 1 - (1 - u) ** 3;
export const easeInOut3 = (u: number) => (u < 0.5 ? 4 * u ** 3 : 1 - (-2 * u + 2) ** 3 / 2);
