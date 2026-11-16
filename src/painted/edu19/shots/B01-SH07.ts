import {animalMotion} from '../../kit/animal-motions';
import {BONE, shoulderPoint, type Arm, type FigPose} from '../../kit/cast';
import {hipAnchor} from '../../kit/figure-at';
import type {Pt} from '../../kit/painter';
import type {V3} from '../../kit/space';
import {camPoint, camUnit, type YCam} from '../../kit/ycam';
import {DOG, GIRL} from '../cast';
import {F} from '../field';
import {makeShot} from '../shot';
import {sheetCam, sheetMove, type FieldShotDef} from '../stage';

// B01-SH07 · G 446-508 (62 f) · "โธ่… เจอจนได้!" (V01; EDU-EP19-SHEETS-R3, camera R2, brief VD15). Trunk screen left, GIRL right of centre crouched
// at G1 in LEFT PROFILE (P35 side = squat, facing the dog), laughing; on "เจอจนได้!" (G 478, l 32) she falls back, l 30-48, onto her bottom into
// P33 side with the arms back
// (`new: sit_floor_lean_back`, below: knees up, hands planted behind the hips, head tipped back). The dog comes round the trunk's open-lawn side
// in right profile, ground point (6.1, 0, 0.1), NO lean (the R1 `leanTo` squashed the neck), head raised 12 deg on the kit neck (`tilt` -12),
// `lick` l 6-30 (V01 "โธ่…" under it), tail wag; through the fall the nose follows her cheek by a half step; she holds the floor-sit laughing
// l 48-62. LF03 was painted at R2 l 16 (mid lick, now l 14-18); LF03-FALL at R2 l 34 = the landed pose, now reached at l 48 (pose unchanged).
const N = 62;
const M = sheetMove([6.5, 0.45, -0.25], [-24, -16], [1.8, 1.65], 0.95, {f: 1300, hy: 770, pitch: [-7, -7]});
/** Dog ground point (sheet (6.1, 0, 0.1); Boss tune within +-0.1 m to land the nose on her cheek at the kit neck length). */
export const DOG_AT: V3 = [6.1, 0, 0.1];
const ease = (u: number) => { const k = Math.min(1, Math.max(0, u)); return k * k * (3 - 2 * k); };
/** Fall progress 0..1 over l 30-48 (R3: on "เจอจนได้!", l 32). */
const fall = (L: number) => ease((L - 30) / 18);

/**
 * `new: sit_floor_lean_back` (kit intake at delivery): the P33 side body (`floorSit` 1) with the torso leaning back `lean` rad and both hands
 * planted on the ground behind the hips, arms nearly straight (two-bone, elbow bent backward). Picture-px arm targets for a left/right profile
 * placed at `at` through camera `c`.
 */
export const leanBackArms = (c: YCam, at: V3, view: 'left' | 'right', body: Partial<FigPose>): Pick<FigPose, 'lArm' | 'rArm'> => {
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return {};
  const dir = view === 'left' ? -1 : 1, L = BONE * (GIRL.armScale ?? 1) * u;
  const sh = shoulderPoint(GIRL, g as Pt, u, {view, ...body}, 'l'), hip = hipAnchor(GIRL, g as Pt, u, {view, ...body});
  const plant = (back: number): Arm => {
    let to: Pt = [hip[0] - dir * back * u, g[1] - 0.01 * u];
    const dx = to[0] - sh[0], dy = to[1] - sh[1], d = Math.hypot(dx, dy), reach = 2 * L * 0.995;
    if (d > reach) to = [sh[0] + (dx / d) * reach, sh[1] + (dy / d) * reach];
    const dd = Math.min(Math.hypot(to[0] - sh[0], to[1] - sh[1]), reach), h = Math.sqrt(Math.max(0, L * L - (dd / 2) ** 2));
    const mx = (sh[0] + to[0]) / 2, my = (sh[1] + to[1]) / 2, nx = -(to[1] - sh[1]) / dd, ny = (to[0] - sh[0]) / dd;
    // Elbow on the back side of the shoulder-hand line (away from the facing): the arm props the body.
    const s = Math.sign(nx * -dir || 1);
    return {via: [mx + s * nx * h, my + s * ny * h], to};
  };
  const near = plant(0.3), far = plant(0.24);
  return view === 'left' ? {lArm: near, rArm: far} : {rArm: near, lArm: far};
};

export const B01_SH07: FieldShotDef = {
  id: 'B01-SH07', N,
  cam: (L) => sheetCam(M, L, N),
  state: (L) => {
    const t = L / 30, m = animalMotion('lick', Math.max(0, t - 6 / 30), {animal: DOG, view: 'right'}), u = fall(L), c = sheetCam(M, L, N);
    const girl = u <= 0
      ? {at: F.G1, view: 'left' as const, pose: 'P35' as const, face: L >= 10 ? 'laugh' as const : 'happy' as const}
      : (() => {
        // Fall: squat until mid-way, then on the bottom (floorSit) with the lean back growing and the hands reaching back to plant.
        const body: Partial<FigPose> = u < 0.45 ? {squat: 1, bend: 0.35 * (1 - u / 0.45), lift: 0} : {floorSit: 1, lean: 0.4 * ease((u - 0.45) / 0.55), headCock: 0.3 * ease((u - 0.45) / 0.55)};
        const arms = u < 0.45 ? {} : leanBackArms(c, F.G1, 'left', body);
        return {at: F.G1, view: 'left' as const, pose: (u < 0.45 ? 'P35' : 'P33') as 'P35' | 'P33', face: 'laugh' as const, fig: {...body, ...arms}};
      })();
    return {sun: 'B01', t, stack: false, girl,
      dog: {at: [DOG_AT[0] + 0.08 * u, 0, DOG_AT[2]], pose: {...m.pose, view: 'right', tilt: -12, wag: 1}}};
  },
};
export const shot = makeShot(B01_SH07);
