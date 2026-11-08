import {camOf, camMove} from '../kit/cam-moves';
import type {Painter, Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import type {YCam} from '../kit/ycam';
import {paintEarth} from './earth';
import {paintModule, paintTruss} from './orbit';
import {paintFilmStrip, paintFlaskCard, paintGlitter, paintHelmetProp, paintTimerRing} from './fx';
import {paintAirlock, paintChamberSepia, paintHose} from './rooms';
import {AST_DEF, CREW_DEF, TECH_DEF, ZG_NEUTRAL, paintSuited, type SuitedAnchors} from './suit';

// EDU-EP08-SHORT look frames (brief EDU-EP08-BRIEF-R1.1, rows EDU-EP08-ROWS-R1.1, workflow W3). LOOK-FRAME CODE: pure paint functions.
// LF00 suit/helmet look check (VD25), LF01 orbit hook (S01-B01-SH01 frame 0), more below. Cameras are the shot plan's `cam:` lines.
export const MEASURE: Record<string, {ast?: SuitedAnchors | null; crew?: SuitedAnchors | null; limb?: Pt[]; extra?: Record<string, number>}> = {};

/** AST's floating foot point in orbit (W3 tuning of the brief's hips (0, 0.80, 0.25): feet 0.42 above the rail and 0.30 m further out so they
 * project over the Earth, not onto the truss top; recorded in the brief R1.1). */
export const AST_AT: V3 = [0, 0.42, 0.55];

// ---- LF01: S01-B01-SH01 frame 0. `cam: T-HOOK (-0.30, 1.00, 0.20), yaw 55->47, r 3.4->3.1, eye 1.90, pitch -16, f 1100, hy 620`.
export const camLF01: YCam = camOf(camMove([-0.3, 1.0, 0.2], [55, 47], [3.4, 3.1], 1.9, {pitch: [-16, -16], f: 1100, hy: 620}), 0);
export const paintLF01 = (p: Painter, frame: number) => {
  const t = frame / 30, c = camLF01;
  const {limb} = paintEarth(p, c);
  paintModule(p, c, {t});
  paintTruss(p, c, {t, tether: {from: [AST_AT[0] + 0.12, AST_AT[1] + 0.57, AST_AT[2] + 0.05]}});
  const crew = paintSuited(p, c, CREW_DEF, {at: [-3.9, 0.12, 0.0], view: 'right', helmet: 'visor', stripes: true, t,
    r: {to: [0.38, -0.1], via: [0.16, -0.2]}, seed: 7101});
  const ast = paintSuited(p, c, AST_DEF, {at: AST_AT, view: 'front', helmet: 'bubble', face: 'neutral', t, rim: -1, fig: {lean: -0.06},
    r: {to: [0.12, 0.04], via: [-0.01, -0.16], near: 0.15}, l: ZG_NEUTRAL('l'), seed: 7201});
  MEASURE.LF01 = {ast, crew, limb};
};

/** The brief's orbit targets moved with AST (AST_AT is +0.26 m up and +0.30 m out from the brief's floating placement). */
export const OFF: V3 = [0, 0.26, 0.3];
const off = (v: V3): V3 => [v[0] + OFF[0], v[1] + OFF[1], v[2] + OFF[2]];

// ---- LF00: VD25 suit/helmet look check, three key stills on one orbit backdrop: AST helmet on (front), AST helmet off at the glitter
// beat (front three-quarter, glove raised), CREW visor down (right profile). Caption band shown.
export const camLF00: YCam = camOf(camMove([0, 1.0, 0], [0, 0], 2.7, 1.3, {pitch: [-8, -8], f: 1000, hy: 700}), 0);
export const paintLF00 = (p: Painter, frame: number) => {
  const t = frame / 30, c = camLF00;
  const {limb} = paintEarth(p, c, {seed: 8820});
  const a1 = paintSuited(p, c, AST_DEF, {at: [-0.62, 0.2, 0], view: 'front', helmet: 'bubble', face: 'neutral', t, r: ZG_NEUTRAL('r'), l: ZG_NEUTRAL('l'), seed: 7301});
  const a2 = paintSuited(p, c, AST_DEF, {at: [0.0, 0.2, 0], view: 'front', quarter: 'right', helmet: 'off', face: 'worried', t, r: {to: [0.09, 0.04], via: [-0.02, -0.16], near: 0.15}, l: {...ZG_NEUTRAL('l'), to: [0.07, -0.41]}, seed: 7302});
  if (a2) paintGlitter(p, 8600, [a2.lips[0] + 0.03 * a2.u, a2.lips[1]], [0.85, -0.5], 26, 0.32 * a2.u, 0.9, 7, t);
  const cr = paintSuited(p, c, CREW_DEF, {at: [0.66, 0.08, 0], view: 'right', helmet: 'visor', stripes: true, t, seed: 7303});
  MEASURE.LF00 = {ast: a1, crew: cr, limb, extra: {astOffHead: a2 ? a2.chin - a2.headTop : 0}};
};

// ---- LF02: S01-B03-SH01 frame ~1.0 s (glitter at the lips). `cam: T-HEAD (0.00, 1.25, 0.25), yaw 34->27, r 1.55->1.40, eye 1.45, pitch -5, f 1100, hy 800` (+OFF).
export const camLF02: YCam = camOf(camMove(off([0, 1.25, 0.25]), [34, 27], [1.55, 1.4], 1.45 + OFF[1], {pitch: [-5, -5], f: 1100, hy: 800}), 0.3);
export const paintLF02 = (p: Painter, frame: number) => {
  const t = frame / 30 + 1.0, c = camLF02;
  const {limb} = paintEarth(p, c);
  paintTruss(p, c, {t, tether: {from: [AST_AT[0] + 0.12, AST_AT[1] + 0.57, AST_AT[2] + 0.05]}});
  const ast = paintSuited(p, c, AST_DEF, {at: AST_AT, view: 'front', quarter: 'right', helmet: 'off', face: 'worried', t, rim: -1,
    r: {to: [0.09, 0.04], via: [-0.02, -0.16], near: 0.15}, l: {...ZG_NEUTRAL('l'), to: [0.07, -0.41]}, seed: 7201});
  if (ast) paintGlitter(p, 8610, [ast.lips[0] + 0.03 * ast.u, ast.lips[1]], [0.8, -0.6], 44, 0.4 * ast.u, 0.8, 8, t);
  MEASURE.LF02 = {ast, limb};
};

// ---- LF04: S01-B04-SH03 at u 0.65 (the stream across the Earth). `cam: T-EXHALE (0.30, 1.20, 0.60)->(0.45, 1.20, 0.90), yaw -60->-50,
// r 2.10->2.15, eye 1.55->2.75, pitch -12->-30, f 1100, hy 740->560` (+OFF). B04 drift: AST 0.15 m toward -x.
const camMoveLF04 = camMove([off([0.3, 1.2, 0.6]), off([0.45, 1.2, 0.9])], [-60, -50], [2.1, 2.15], [1.55 + OFF[1], 2.75 + OFF[1]], {pitch: [-12, -30], f: 1100, hy: 740});
export const camLF04: YCam = {...camOf(camMoveLF04, 0.65), hy: 740 + (560 - 740) * 0.65, cx: 150};
export const paintLF04 = (p: Painter, frame: number) => {
  const t = frame / 30 + 1.5, c = camLF04, at: V3 = [AST_AT[0] - 0.15, AST_AT[1] - 0.02, AST_AT[2] - 0.03];
  const {limb} = paintEarth(p, c, {warm: 0.6, glow: 0.7});
  paintTruss(p, c, {t, tether: {from: [at[0] + 0.12, at[1] + 0.57, at[2] + 0.05]}});
  const ast = paintSuited(p, c, AST_DEF, {at, view: 'right', helmet: 'off', face: 'neutral', faceState: {mouth: 'o', open: 0.2, eyes: 'half'}, t, rim: 1, tint: ['#7fb2e6', 0.18],
    fig: {lean: 0.08}, r: {to: [0.3, -0.33], via: [0.09, -0.24]}, seed: 7201});
  if (ast) paintGlitter(p, 8620, [ast.lips[0] + 0.03 * ast.u, ast.lips[1]], [0.82, 0.57], 560, 820, 0.3, 11, t);
  MEASURE.LF04 = {ast, limb};
};

// ---- LF06: S01-B01-SH03 at 1.3 s (balloon popped, red cross stamping; BC2 card placement). `cam: T-AST (0.00, 1.10, 0.25), yaw 20->12,
// r 2.30->2.05, eye 1.75, pitch -14, f 1100, hy 640` (+OFF).
export const camLF06: YCam = camOf(camMove(off([0, 1.1, 0.25]), [20, 12], [2.3, 2.05], 1.75 + OFF[1], {pitch: [-14, -14], f: 1100, hy: 640}), 1.3 / 5.3);
export const FILM_BOX: [number, number, number, number] = [70, 165, 560, 395];
export const paintLF06 = (p: Painter, frame: number) => {
  const t = frame / 30 + 1.3, c = camLF06;
  const {limb} = paintEarth(p, c);
  paintTruss(p, c, {t, tether: {from: [AST_AT[0] + 0.12, AST_AT[1] + 0.57, AST_AT[2] + 0.05]}});
  const ast = paintSuited(p, c, AST_DEF, {at: AST_AT, view: 'front', helmet: 'off', face: 'surprised', faceState: {mouth: 'flat'}, t, rim: -1,
    r: ZG_NEUTRAL('r'), l: ZG_NEUTRAL('l'), seed: 7201});
  paintHelmetProp(p, c, off([0.3, 2.75, 0.2]), 48);
  paintFilmStrip(p, FILM_BOX, {tilt: -4, cross: 0.8});
  paintTimerRing(p, 0.25);
  MEASURE.LF06 = {ast, limb};
};

// ---- LF07: S01-B02-SH03 at 1.5 s (flask card; timer ring at 2.6 story s). `cam: T-AST, yaw 10->16, r 2.8->2.6, eye 1.70, pitch -14, f 1100, hy 700, cx -160` (+OFF).
export const camLF07: YCam = camOf(camMove(off([0, 1.1, 0.25]), [10, 16], [2.8, 2.6], 1.7 + OFF[1], {pitch: [-14, -14], f: 1100, hy: 700, cx: -160}), 0.5);
export const FLASK_BOX: [number, number, number, number] = [430, 470, 1010, 1080];
export const paintLF07 = (p: Painter, frame: number) => {
  const t = frame / 30 + 1.5, c = camLF07;
  const {limb} = paintEarth(p, c);
  paintTruss(p, c, {t, tether: {from: [AST_AT[0] + 0.12, AST_AT[1] + 0.57, AST_AT[2] + 0.05]}});
  const ast = paintSuited(p, c, AST_DEF, {at: AST_AT, view: 'front', helmet: 'off', face: 'neutral', t, rim: -1,
    r: ZG_NEUTRAL('r'), l: ZG_NEUTRAL('l'), seed: 7201});
  paintFlaskCard(p, FLASK_BOX);
  paintTimerRing(p, 2.6);
  MEASURE.LF07 = {ast, limb};
};

// ---- LF03: S01-B03-SH03 at u 0.5 (hose still on). `cam: CHAMBER T-TECH (0.00, 1.10, -0.80), yaw 10->4, r 2.6->2.0, eye 1.30, pitch 0, f 1000, hy 820`. Sepia grade.
export const camLF03: YCam = camOf(camMove([0, 1.1, -0.8], [10, 4], [2.6, 2.0], 1.3, {pitch: [0, 0], f: 1000, hy: 820}), 0.5);
export const paintLF03 = (p0: Painter, frame: number) => {
  const t = frame / 30 + 2.9, c = camLF03, p = paintChamberSepia(p0, c, {lights: 1, needle: 1});
  const tech = paintSuited(p, c, TECH_DEF, {at: [0, 0, -0.8], view: 'back', helmet: 'round1966', t, seed: 7401});
  if (tech) paintHose(p, c, [tech.feet[0] - 0.13 * tech.u, tech.feet[1] - 0.86 * tech.u], [-1.1, 0.9, -1.75]);
  paintTimerRing(p0, 4.3, {paused: true});
  MEASURE.LF03 = {ast: tech};
};

// ---- LF05: S01-B05-SH04 last frame (the tightest), brief R1.1 BC1 as amended: `cam: AIRLOCK target (-0.15, 0.55, +0.20), yaw 190->184, r 1.36->1.30, eye 0.55, pitch -2, f 1000, hy 800`.
export const camLF05: YCam = camOf(camMove([-0.15, 0.55, 0.2], [190, 184], [1.36, 1.3], 0.55, {pitch: [-2, -2], f: 1000, hy: 800}), 1);
export const paintLF05 = (p: Painter, frame: number) => {
  const t = frame / 30, c = camLF05;
  paintAirlock(p, c, {lamp: 0, needle: 0});
  // CREW screen left facing her (right profile), visor down, leaning in; AST front three-quarter toward him, eyes open
  const crew = paintSuited(p, c, CREW_DEF, {at: [0.4, -0.79, 0.35], view: 'right', helmet: 'visor', stripes: true, t, fig: {lean: 0.12},
    r: {to: [0.11, -0.265], via: [-0.12, -0.22]}, seed: 7501});
  const ast = paintSuited(p, c, AST_DEF, {at: [-0.15, -0.62, 0.2], view: 'front', quarter: 'left', helmet: 'off', face: 'neutral', t, rim: 0,
    r: {to: [-0.22, -0.22], via: [0.03, -0.25]}, l: ZG_NEUTRAL('l'), seed: 7201});
  MEASURE.LF05 = {ast, crew};
};
