import {animalWalkSpeed, type AnimalPose} from '../kit/animals';
import type {Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import {mixYCam, type YCam} from '../kit/ycam';
import {CAT_SCALE, MANNEQUIN_L, MANNEQUIN_R, TRENCH, catDef, paintRealCat, paintSeatedMannequin} from './cast';
import {SF, paintFieldBack, paintFieldBenchBack, paintFieldBenchSeat, paintFieldTree, paintNearGroundShade, paintNearLawn, paintShadedNearLawn, groundZAtRow, BAND_RAMP, sunShadow} from './field';
import {clamp01, departFrac, lerp, lerpV, pictureGaitClock, smooth} from './field-cat';
import {CAT_LOAF, lead} from './looks';

// EDU-EP32-SHORT B04-SH01 "hungry, off it goes" (timed sheet EDU-EP32-SHEET-R1, G [880, 993), 113 f; VD32-19, VD32-20; R3 keys VD32-28; Boss G4,
// 2026-11-21). One plate EDU32-B04-SH01, sun. Low near the ground: the cat lies in the sun patch as B03-SH03 left it (`CAT_LOAF`, facing
// screen-left), the mannequins soft behind. Tail-tip flick L45; on "เล่าว่า" (W932 = L52) kit `get-up` L52-L60; it turns round through the front
// view (L60-L64) and walks out screen-right along z +0.75 from x +0.5 (a hungry trot, gait clock from its picture travel), out of frame by
// L100 (G980); the empty patch holds to the cut. Shot-local frame L = round(tl * 30).

export const B04_N = 113;
const DEG = Math.PI / 180;
export const B04 = {flick: 45, getUp: [52, 60], turn: [60, 64], walk: [64, 100], from: [0.5, 0, 0.75] as V3, to: [2.1, 0, 0.75] as V3, go: 8} as const;
export const B04_CAM0: YCam = {x: 0.6, y: 0.35, z: 2.3, yaw: -4 * DEG, pitch: -4 * DEG, f: 1100, hy: 800};
export const B04_CAM1: YCam = {x: 0.8, y: 0.35, z: 2.3, yaw: 2 * DEG, pitch: -4 * DEG, f: 1100, hy: 800};
/** Linear truck with eased ends (15 % ease in, 15 % ease out). */
const truck = (x: number) => {
  const e = 0.15, u = clamp01(x), v = 1 / (1 - e);
  if (u < e) return (v * u * u) / (2 * e);
  if (u > 1 - e) return 1 - (v * (1 - u) * (1 - u)) / (2 * e);
  return v * (u - e / 2);
};
export const b04Cam = (L: number): YCam => mixYCam(B04_CAM0, B04_CAM1, truck(L / (B04_N - 1)));
/** Caption band y 1230-1344: near-lawn shade steps (picture row, opacity). */
export const B04_SHADE = {color: '#18221b', steps: BAND_RAMP};

const DEF = catDef(CAT_SCALE.diorama), V = animalWalkSpeed(DEF);
const n = B04.walk[1] - B04.walk[0];
/** Walk path; it keeps the cruise speed past L100 so the cat never stops in frame. */
const walkPath = (L: number): V3 => {
  const f = departFrac(L - B04.walk[0], n, B04.go).f;
  return lerpV(B04.from, B04.to, f);
};

/** The cat at shot frame L (world ground point and kit pose). */
export const b04Cat = (L: number): {at: V3; pose: Partial<AnimalPose>} => {
  if (L < B04.getUp[0]) {
    // tail-tip flick: the lids lift a little and the ears twitch with it (the loaf tail lies along the body)
    const fl = L >= B04.flick && L < B04.flick + 4 ? Math.sin((Math.PI * (L - B04.flick)) / 4) : 0;
    return {at: SF.patch, pose: {...CAT_LOAF, ears: 0.35 * fl}};
  }
  if (L < B04.getUp[1]) {
    const b = (L - B04.getUp[0]) / (B04.getUp[1] - B04.getUp[0]);
    // the loaf unrounds first (b 0 -> 0.3) so the legs are out before the body rises (the loaf drawing hides the legs)
    return {at: SF.patch, pose: {view: 'left', from: 'lie', state: 'stand', blend: b, loaf: 1 - smooth(b / 0.3), lid: lerp(CAT_LOAF.lid, 0, smooth(b * 2))}};
  }
  if (L < B04.walk[0]) return {at: lerpV(SF.patch, B04.from, (L - B04.turn[0]) / (B04.turn[1] - B04.turn[0])), pose: {view: L < B04.turn[0] + 2 ? 'front' : 'right', state: 'stand'}};
  const d = departFrac(L - B04.walk[0], n, B04.go);
  return {at: walkPath(L), pose: {view: 'right', state: 'stand', walk: pictureGaitClock(DEF, walkPath, b04Cam, B04.walk[0], L), stride: d.stride}};
};

/** The B04-SH01 plate at shot frame L. */
export const paintB04SH01 = (p: Painter, L: number, id = 'B04-SH01') => {
  const c = b04Cam(L), t = 4.0 + L / 30, light = 'sun' as const, shade = 0.22;
  paintFieldBack(p, c, light);
  paintFieldTree(p, c, SF.treeR, 35000, light);
  paintFieldTree(p, c, SF.treeL, 35100, light);
  paintFieldBenchBack(p, c, light);
  paintFieldBenchSeat(p, c, light);
  lead(id, 'MANNEQUIN L', paintSeatedMannequin(p, c, MANNEQUIN_L, {at: SF.manL, t, seed: 34100, coat: TRENCH.tan, shade}));
  lead(id, 'MANNEQUIN R', paintSeatedMannequin(p, c, MANNEQUIN_R, {at: SF.manR, t, seed: 34200, coat: TRENCH.grey, hat: true, shade}));
  const cat = b04Cat(L), inPatch = Math.hypot((cat.at[0] - SF.patch[0]) / 0.45, (cat.at[2] - SF.patch[2]) / 0.3) < 1;
  paintNearLawn(p, c, light, -Infinity, cat.at[2]);
  if (inPatch) sunShadow(p, c, 35600, cat.at, 0.3, 0.12, 0.25, 60);
  const r = paintRealCat(p, c, {at: cat.at, t, pose: cat.pose, fleck: inPatch ? 0.8 : 0.4});
  if (r && r.g[0] < 1300) lead(id, 'CAT real x1.6', r);
  const zRamp = groundZAtRow(c, BAND_RAMP[0][0]);
  paintNearLawn(p, c, light, cat.at[2], zRamp);
  paintNearGroundShade(p, c, 37100, B04_SHADE.color, B04_SHADE.steps);
  paintShadedNearLawn(p, c, light, zRamp, B04_SHADE.color);
};
