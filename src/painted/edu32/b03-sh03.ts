import {animalWalkSpeed, type AnimalPose} from '../kit/animals';
import type {Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import {mixYCam, type YCam} from '../kit/ycam';
import {CAT_SCALE, MANNEQUIN_L, MANNEQUIN_R, TRENCH, catDef, paintRealCat, paintSeatedMannequin, paintSparrow, type SparrowMotion} from './cast';
import {SF, paintFieldBack, paintFieldBenchBack, paintFieldBenchSeat, paintFieldTree, paintNearGroundShade, paintNearLawn, paintShadedNearLawn, groundZAtRow, BAND_RAMP, sunShadow, type FieldLight} from './field';
import {arriveFrac, easeInOut, lerp, lerpV, pictureGaitClock, smooth} from './field-cat';
import {CAT_LOAF, lead} from './looks';

// EDU-EP32-SHORT B03-SH03 "left, right, or the sun" (timed sheet EDU-EP32-SHEET-R1, G [689, 786), 97 f; VD32-19, VD32-20; R3 keys VD32-28;
// Boss G4, 2026-11-21). One low bench frame in Space F. Two registered plates on the shot clock: EDU32-B03-SH03-O (overcast) and
// EDU32-B03-SH03-S (sun), the S plate a `crossfade` over L18-L34 (the cloud passes; both plates paint the same cast at the same frame, so only
// the light changes). Shot-local frame L = round(tl * 30). Cat (real x1.6, shared `catDef`): sits in profile looking left at MANNEQUIN L (L0-L13),
// turns through the front view to the sparrow (L14-L16), stands (L26-L30), steps down from the 0.345 m seat (L30-L40, kit `step-up` with a negative rise), walks to the
// sun patch (L40-L66, gait clock from its picture travel), turns round through the front view (L66-L71), lies down into `CAT_LOAF` facing
// screen-left (L71-L86), settled L86 (G775), slow blink L90. Sparrow flutters in from screen-right (L2-L12), lands on the right armrest,
// tail-bobs L14 and L40. The sparrow faces screen-left, toward the cat (`paintSparrow` dir +1 draws the beak on the screen-left side).

export const SH03_N = 97;
const DEG = Math.PI / 180;
export const SH03 = {lookTurn: [14, 20], sun: [18, 34], stand: [26, 30], step: [30, 40], walk: [40, 66], turn: [66, 71], lie: [71, 86], blink: 90,
  sparrow: [2, 12], bob: [14, 40], land: [0.1, 0, -0.05] as V3} as const;
export const SH03_CAM0: YCam = {x: 0.3, y: 0.62, z: 2.6, yaw: -2 * DEG, pitch: -4 * DEG, f: 1200, hy: 760};
export const SH03_CAM1: YCam = {x: 0.25, y: 0.6, z: 2.35, yaw: 1 * DEG, pitch: -4 * DEG, f: 1200, hy: 760};
export const sh03Cam = (L: number): YCam => mixYCam(SH03_CAM0, SH03_CAM1, easeInOut(L / (SH03_N - 1)));
/** Caption band y 1230-1344: canopy / near-lawn shade steps (picture row, opacity), below the patch front (y 1194 at the end key). */
export const SH03_SHADE = {color: '#18221b', steps: BAND_RAMP};

const DEF = catDef(CAT_SCALE.diorama);
const STEP_ACROSS = Math.hypot(SH03.land[0] - SF.catSeat[0], SH03.land[2] - SF.catSeat[2]), V = animalWalkSpeed(DEF);
const walkPath = (L: number): V3 => lerpV(SH03.land, SF.patch, arriveFrac(L - SH03.walk[0], SH03.walk[1] - SH03.walk[0], 9).f);

export type CatState = {at: V3; pose: Partial<AnimalPose>; ground: boolean};
/** The cat at shot frame L (world ground point and kit pose). */
export const sh03Cat = (L: number): CatState => {
  // Kit cats ignore `look` (front-view head turn is dog-only, animals.ts `headFront`), so the look is staged with the body: profile sit facing
  // screen-left at MANNEQUIN L, a two-frame front turn to the sparrow (L14-L15), profile sit facing screen-right, then it stands in that profile.
  const [t0] = SH03.lookTurn;
  if (L < t0) return {at: SF.catSeat, pose: {view: 'left', state: 'sit'}, ground: false};
  if (L < t0 + 2) return {at: SF.catSeat, pose: {view: 'front', state: 'sit'}, ground: false};
  if (L < SH03.stand[0]) return {at: SF.catSeat, pose: {view: 'right', state: 'sit'}, ground: false};
  if (L < SH03.step[0]) return {at: SF.catSeat, pose: {view: 'right', from: 'sit', state: 'stand', blend: (L - SH03.stand[0]) / (SH03.stand[1] - SH03.stand[0])}, ground: false};
  if (L < SH03.step[1]) {
    // kit `step-up` with a negative rise: the body stays level while the forepaws reach out, then the drop accelerates and lands at L40
    const hop = Math.min(1, (L - SH03.step[0]) / (SH03.step[1] - SH03.step[0])), u = smooth(hop);
    const at = lerpV(SF.catSeat, SH03.land, u);
    at[1] = SF.catSeat[1] * (1 - hop * hop);
    const stride = smooth((hop - 0.12) / 0.7) * 0.8;
    return {at, pose: {view: 'right', state: 'stand', walk: (STEP_ACROSS * u) / V, stride, contact: hop >= 1 ? 1 : 0}, ground: hop >= 1};
  }
  if (L < SH03.walk[1]) {
    const a = arriveFrac(L - SH03.walk[0], SH03.walk[1] - SH03.walk[0], 9);
    const walk = STEP_ACROSS / V + pictureGaitClock(DEF, walkPath, sh03Cam, SH03.walk[0], L);
    return {at: walkPath(L), pose: {view: 'right', state: 'stand', walk, stride: a.stride}, ground: true};
  }
  if (L < SH03.turn[1]) return {at: SF.patch, pose: {view: L < SH03.turn[0] + 3 ? 'front' : 'left', state: 'stand'}, ground: true};
  if (L < SH03.lie[1]) {
    const b = (L - SH03.lie[0]) / (SH03.lie[1] - SH03.lie[0]);
    // the loaf hides the legs, so it only rounds in once the body is down (b 0.7 -> 1); before that the kit lie-down keeps its legs under it
    return {at: SF.patch, pose: {...CAT_LOAF, from: 'stand', blend: b, loaf: smooth((b - 0.7) / 0.3), lid: CAT_LOAF.lid * smooth(b)}, ground: true};
  }
  const bl = L - SH03.blink, lid = bl < 0 || bl > 8 ? CAT_LOAF.lid : lerp(CAT_LOAF.lid, 1, Math.sin((Math.PI * bl) / 8));
  return {at: SF.patch, pose: {...CAT_LOAF, lid}, ground: true};
};

/** The sparrow at shot frame L: null before it enters; flying L2-L12 on an arc from above-right to the right armrest; perched after, tail-bobs. */
export const sh03Sparrow = (L: number): {at: V3; m: SparrowMotion} | null => {
  const [s0, s1] = SH03.sparrow;
  if (L < s0) return null;
  if (L < s1) {
    const u = (L - s0) / (s1 - s0), e = 1 - (1 - u) * (1 - u), from: V3 = [1.95, 1.3, -0.65];
    const at = lerpV(from, SF.sparrow, e);
    at[1] += 0.12 * Math.sin(Math.PI * e); // a little loft before it drops to the perch
    return {at, m: {fly: true, flap: u > 0.85 ? 0.2 : 0.5 + 0.5 * Math.sin(L * 2.7)}};
  }
  const bob = SH03.bob.reduce((k, b) => Math.max(k, L >= b && L < b + 3 ? 1 - (L - b) / 3 : 0), 0);
  return {at: SF.sparrow, m: L < s1 + 1 ? {fly: true, flap: 0.05, tail: 0.6} : {tail: bob}};
};

/** One B03-SH03 plate at shot frame L in light `light`. */
export const paintB03SH03 = (p: Painter, L: number, light: FieldLight, id = `B03-SH03-${light === 'sun' ? 'S' : 'O'}`) => {
  const c = sh03Cam(L), t = 2.0 + L / 30, sun = light === 'sun', shade = sun ? 0.22 : 0.04;
  paintFieldBack(p, c, light);
  paintFieldTree(p, c, SF.treeR, 35000, light);
  paintFieldTree(p, c, SF.treeL, 35100, light);
  paintFieldBenchBack(p, c, light);
  paintFieldBenchSeat(p, c, light);
  const cat = sh03Cat(L), inPatch = Math.hypot((cat.at[0] - SF.patch[0]) / 0.45, (cat.at[2] - SF.patch[2]) / 0.3) < 1;
  const fleck = sun ? (inPatch ? 0.8 : 1) : 0;
  const paintCat = () => {
    if (sun && inPatch) sunShadow(p, c, 35600, cat.at, 0.3, 0.12, 0.25, 60);
    lead(id, 'CAT real x1.6', paintRealCat(p, c, {at: cat.at, t, pose: cat.pose, fleck}));
  };
  const front = cat.at[2] > 0.15; // in front of the mannequins' knees: painted after them
  if (!front) paintCat();
  const sp = sh03Sparrow(L);
  if (sp) { const r = paintSparrow(p, c, sp.at, 35500, 1, shade, sp.m); if (r) lead(id, 'SPARROW', r); }
  lead(id, 'MANNEQUIN L', paintSeatedMannequin(p, c, MANNEQUIN_L, {at: SF.manL, t, seed: 34100, coat: TRENCH.tan, shade}));
  lead(id, 'MANNEQUIN R', paintSeatedMannequin(p, c, MANNEQUIN_R, {at: SF.manR, t, seed: 34200, coat: TRENCH.grey, hat: true, shade}));
  const zRamp = groundZAtRow(c, BAND_RAMP[0][0]);
  if (front) {
    paintNearLawn(p, c, light, -Infinity, cat.at[2]); // tufts behind the cat's ground line go under it
    paintCat();
    paintNearLawn(p, c, light, cat.at[2], zRamp);
  } else paintNearLawn(p, c, light, -Infinity, zRamp);
  paintNearGroundShade(p, c, 37000, SH03_SHADE.color, SH03_SHADE.steps);
  paintShadedNearLawn(p, c, light, zRamp, SH03_SHADE.color);
};
