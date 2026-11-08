import type {FigAnchors} from '../kit/cast';
import {ell, hardFill} from '../kit/draw';
import type {Painter, Pt} from '../kit/painter';
import type {YCam} from '../kit/ycam';
import {camPoint} from '../kit/ycam';
import {paintSoi, orbit, POSE_A, T_STALL} from './soi';
import {paintSpace, spaceCam, T_SPACE} from './space';

// EDU-EP07-SHORT look frames (brief EDU-EP07-BRIEF-R1, rows EDU-EP07-ROWS-R1, workflow W3). LOOK-FRAME CODE: pure paint functions of the frame.
// LF01 soi day (S01-B01-SH01 start), LF04 space before the blink (S01-B01-SH02), LF02 split frame (S01-B02-SH01), LF03 soi night (S01-B04-SH02).
export const LF_FRAMES = {LF01: 1, LF01Poc: 1, LF01Wc: 1, LF02: 1, LF03: 1, LF04: 1} as const;
export const MEASURE: Record<string, {ven?: FigAnchors | null; cus?: FigAnchors | null; earth?: Pt | null; sun?: Pt | null; earthR?: number; ring?: Pt[] | null}> = {};

export const paintLF01 = (p: Painter, frame: number) => {
  MEASURE.LF01 = paintSoi(p, POSE_A, {t: frame / 30, stroke: 0.62});
};
/** POC (user, 8 Nov 2026): the same frame with p5.brush ground shadows (soi.ts `shadow: 'brush'`). */
export const paintLF01Poc = (p: Painter, frame: number) => {
  MEASURE.LF01 = paintSoi(p, POSE_A, {t: frame / 30, stroke: 0.62, shadow: 'brush'});
};

// ---- LF04: S01-B01-SH02 the frame before the blink. brief `cam: T-SPACE, yaw 0 -> +3, pitch -32, r 3.00 -> 2.85 su, f 900, hy 960`; W3: r 2.45.
export const camLF04: YCam = spaceCam(T_SPACE, 1.5, 46, 2.15, 880, 940);
export const paintLF04 = (p: Painter, frame: number) => {
  const r = paintSpace(p, camLF04, {t: frame / 30, sun: 1, earthPhi: -60, spray: true, beamFrom: 0, earthK: 1.4});
  MEASURE.LF04 = {earth: r.earth, sun: r.sun, earthR: r.earthR};
};

// ---- LF02: S01-B02-SH01 split frame. Space panel y 0-760, street panel y 760-1920, seam line at y 760 (VD06).
export const SEAM = 760;
export const camLF02Space: YCam = spaceCam([0.2, 0, 0.18], 2, 40, 2.15, 740, 430);
export const camLF02Street: YCam = orbit(T_STALL, 30, 3.8, 1.3, 4, 900, 960);
export const paintLF02 = (p: Painter, frame: number) => {
  const t = frame / 30;
  const st = paintSoi(p, camLF02Street, {t, stroke: 0.62, panelTop: SEAM});
  const sp = paintSpace(p, camLF02Space, {t, rect: [0, 0, 1080, SEAM], sun: 0, earthPhi: -60, ring: 0.1, beamFrom: 0.1, spray: true});
  hardFill(p, 1200, '#f3ead8', [[0, SEAM - 1.5], [1080, SEAM - 1.5], [1080, SEAM + 1.5], [0, SEAM + 1.5]]);
  MEASURE.LF02 = {...st, earth: sp.earth, sun: sp.sun, earthR: sp.earthR, ring: sp.ring};
};

// ---- LF03: S01-B04-SH02 night soi, the Sun gone; brief `cam: T-PAIR, yaw +20, r 2.40, eye 1.25, f 1050, hy 940`.
export const camLF03: YCam = orbit([0.85, 1.05, -0.4], 15, 3.0, 1.25, 0, 1150, 900);
export const paintLF03 = (p: Painter, frame: number) => {
  MEASURE.LF03 = paintSoi(p, camLF03, {t: frame / 30, night: 1, stroke: 1,
    ven: {face: 'surprised'}, cus: {face: 'surprised', faceState: {eyes: 'wide', look: [-0.8, 0.1]}}});
};
void ell; void camPoint;

/** POC round 2 (user, 8 Nov 2026): ground shadows as p5.brush watercolour fills. `wc` is the painter over the textured brush. */
export const paintLF01Wc = (p: Painter, frame: number, wc: Painter) => {
  MEASURE.LF01 = paintSoi(p, POSE_A, {t: frame / 30, stroke: 0.62, shadow: 'watercolour', wc});
};
