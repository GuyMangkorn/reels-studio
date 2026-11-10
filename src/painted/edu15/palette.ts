import type {V3} from '../kit/space';
import type {YCam} from '../kit/ycam';

// EDU-EP15-SHORT palette, marks and camera helper (brief EDU-EP15-BRIEF-R1.1 "Colour and value key", "Set plan - SET-LR15"; W3 look frames, Film).
// Space R: metres, origin on the floor below the lamp centre, +x right seen from the TV side, +y up, +z toward the TV wall; ceiling y 2.70.

export const C = {
  plaster: '#efe6d2', plasterEdge: '#b8ad99', stipple: '#cfc4ae', dust: '#a79f93', web: '#d9d4c8', stain: '#b89a6a',
  lampCore: '#fff4dc', halo: '#ffe2b0',
  wall: '#e6d3a3', wallShade: '#8f7f63', tile: '#e3d9c6', grout: '#b9ab92',
  sofa: '#4f6f6a', sofaShade: '#2f4648', throw: '#c99a3a', wood: '#8a5a3a', rug: '#b8674a',
  glass: '#2b3550', grille: '#9aa0a6', neighbour: '#f2c46a',
  tkBack: '#7d8fa6', tkShade: '#56657a', tkOrange: '#e0703a', tkOrangeD: '#c4562c', tkPale: '#c9d6e4', tkBelly: '#e8dfc8',
  tkEye: '#e7b43a', tkPupil: '#1a1410', tkPad: '#cfd2d0', tkRidge: '#a9aeb0', tkBand: '#d8dfe6', tkInk: '#2a2b33',
  phone: '#cfe3ff', moth: '#8d7a62', mothWing: '#e8dcc4',
  hair: '#d9d2c0', hairRim: '#fff8e8', bokeh: '#6d6458', microField: '#2a2622', microPlaster: '#cfc4ae', microDip: '#9f9480', glint: '#ffe9a8', pull: '#ffc24a',
  ink: '#2b211c',
} as const;

export const CEIL = 2.7;
export const LAMP: V3 = [0, 2.665, 0];
export const LAMP_R = 0.2;
/** Tokay marks on the plaster (brief "Tokay marks"); heading in degrees in the ceiling plane: 0 = +x, 90 = +z (so T0's -x heading is 180). */
export const T0 = {at: [0.42, CEIL, -0.12] as V3, heading: 180};
/** WOMAN mark W0: feet ground point (hips (-0.35, 0.30, -0.75) sit 0.45 m behind it, the kit P31 convention). */
export const W0_FEET: V3 = [-0.35, 0, -0.3];
/** Hang rig H (brief #hang-rig-h): wrist anchor held by the tokay's hind feet. W3.1 (user Q-F6, 2026-11-10): moved 0.5 m forward (+z) from
 * z -0.12 to z 0.38, 0.78 m in front of the sofa front, so the floor shows under his feet; still 0.38 m from the lamp centre. */
export const RIG_Z = 0.38;
export const RIG_H = {wrists: [0.33, 2.48, RIG_Z] as V3, frontR: [0.3, CEIL, RIG_Z] as V3, frontL: [0.36, CEIL, RIG_Z] as V3};

const DEG = Math.PI / 180;
/** A yaw camera from a position and a look-at point (the brief's `pos -> look-at` lines): yaw so the view axis passes the target, pitch up positive. */
export const lookCam = (pos: V3, at: V3, f: number, o: {hy?: number; cx?: number; near?: number} = {}): YCam => {
  const dx = at[0] - pos[0], dy = at[1] - pos[1], dz = at[2] - pos[2];
  return {x: pos[0], y: pos[1], z: pos[2], yaw: Math.atan2(dx, -dz), pitch: Math.atan2(dy, Math.hypot(dx, dz)), f, hy: o.hy ?? 960, cx: o.cx ?? 0, near: o.near};
};
export {DEG};
