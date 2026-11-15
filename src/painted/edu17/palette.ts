import {camMove, camOf} from '../kit/cam-moves';
import type {V3} from '../kit/space';
import type {YCam} from '../kit/ycam';

// EDU-EP17-SHORT palette and camera helper (brief EDU-EP17-BRIEF-R1.1 "Colour and value key"; Film W3 thumbnails, 2026-11-15).

export const C = {
  ink: '#2b211c',
  // yard sky and sea
  zenith: '#7fb3d9', skyMid: '#a9cfe6', haze: '#f1e2c4', glitter: '#fff3d0', sun: '#ffd08a',
  bayNear: '#4fa3a8', bayMid: '#3c8aa0', openSea: '#25607e', wake: '#e8f0ea', headland: '#5f7f52', headlandFar: '#8aa3a0',
  // yard
  sand: '#d9c39a', sandShade: '#a88f66', grass: '#8aa65a', wall: '#efe9dc', wallShade: '#b9b2a3', plank: '#9a6b45',
  houseWood: '#8a5a3a', shutter: '#3f7fa6', roof: '#8c8f8a', terrace: '#9d7350',
  boug: '#c8327a', leaf: '#4f7f3a', leafDark: '#3a5f2c', clay: '#b4643c', tin: '#c9c3b2', jar: '#7a4a2e', bluePot: '#2f5e8e',
  hose: '#3fa046', hoseShade: '#2a7432', spray: '#e8f6ff', palmTrunk: '#8a6a48', palmLeaf: '#4d7a3a',
  // boats
  b1Red: '#c4432f', b1Blue: '#2f5e9e', b2Hull: '#3f8a5a', cabin: '#efece4', b3Yellow: '#e2b23a', trHull: '#2f4f7e', trHouse: '#e9e6dc', boom: '#5a4a3a', woodHull: '#7a5a3e',
  // phone
  phone: '#1f2328', screenLamp: '#ffd9a0', screenWin: '#3a5a8a', snow: '#e9eef5', knit: '#ece2cf', hairBlack: '#1d1a1a', skinSis: '#e2b48c',
  // under the sea
  shallow0: '#5fb8b0', shallow1: '#3f97a0', seaSand: '#d8c79e', ripple: '#b3a079', seagrass: '#5c8a4a', caustic: '#e8f7e0',
  slope0: '#2f7288', slope1: '#163f5a', deep0: '#0f2a40', deep1: '#08192a', ooze: '#3a4650', rock: '#2c3a40',
  cable: '#23262a', cableHi: '#5a6068', armour: '#3a3d40', glow: '#7fe8ff', core: '#ffffff',
  steel: '#4a4e52', rust: '#7a4a32', chain: '#55595c', net: '#c9b98a',
  // globe
  globeSea: '#1d4e6e', globeLimb: '#3f86a6', land: '#d9c9a0', landShade: '#b8a57e', coast: '#f2e6c4', halo: '#9fd6ff', space0: '#0e1830', space1: '#1a3450', yardDot: '#ffcf6a',
  // bubble
  bubFill: '#f6efdf', bubEdge: '#7a5a3a', bubSky: '#e9f2f6', heli: '#e0573a', crate: '#a8764a', cube: '#7fe8ff', asphalt: '#4a4f57', lane: '#e9e2c8', streakA: '#ffd27a',
  // Red Sea
  rsSky0: '#a9adad', rsHaze: '#cfcfca', rsSea: '#5b6a6a', rsSwell: '#46524f', hullUp: '#2a2a2c', hullLow: '#7a3a2c', superW: '#d8d4cc', scorch: '#3a2e28', smoke: '#8c8c88',
  // flashback seabed
  fsWater0: '#5d7380', fsWater1: '#4a5e6a', fsSand: '#8a8676', fsFurrow: '#6a665a', fsCable: '#2a2c2e',
  // cutaway backdrop
  bd0: '#e9f2f6', bd1: '#f6efdf',
  // man
  tee: '#d9a53a', denim: '#4a6a92', flip: '#2b3a5a',
} as const;

const DEG = Math.PI / 180;
/**
 * The scene sheets' camera line (storyboard "Units and conventions"): `yaw` is the LOOK yaw (0 looks toward -z, +90 toward +x), so the camera
 * stands at at + r·(sin(-yaw), 0, cos(-yaw)). Kit `camMove` takes the orbit AZIMUTH (camera at at + r·(sin az, 0, cos az)), i.e. az = -yaw.
 * This helper converts once, so every EP17 shot types the sheet numbers unchanged (yaw-sign note, W3 2026-11-15).
 */
export const sheetCam = (at: V3, yaw: number, r: number, eye: number, o: {f: number; hy: number; pitch?: number; near?: number}): YCam => {
  const c = camOf(camMove(at, [-yaw, -yaw], r, eye, {f: o.f, hy: o.hy, pitch: o.pitch !== undefined ? [o.pitch, o.pitch] : undefined}), 0);
  return o.near !== undefined ? {...c, near: o.near} : c;
};
/** A camera from a position and a look-at point (level unless `pitch` is given in degrees). */
export const lookAtCam = (pos: V3, at: V3, f: number, hy: number, pitch = 0, near?: number): YCam => {
  const yaw = Math.atan2(at[0] - pos[0], -(at[2] - pos[2]));
  return {x: pos[0], y: pos[1], z: pos[2], yaw, f, hy, pitch: pitch * DEG, ...(near !== undefined ? {near} : {})};
};
