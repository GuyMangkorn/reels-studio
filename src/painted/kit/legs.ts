import type {FigPose} from './cast';
import type {Pt} from './painter';
import {clamp01} from './space';

// Leg and hip solver for the body modes of the pose library (poses P31+): sit on a chair, sit on the floor, kneel, squat, run.
// Pure geometry in the figure's own frame (metres; u toward screen right for the front view and toward the facing side for a
// profile; v up from the ground point). `cast.ts` `bodyFrame` calls it only when one of the mode fields is set, so characters
// that set none keep the original leg code and draw exactly as before.
//
// Modes do not combine: when several fields are set the first of kneel, floorSit, sit, squat, run wins. A motion that
// changes mode fades one field to 0 as the next rises (the cuts are on the pose, not in the solver).

export type LegDims = {hip0: number; ankleV: number; L1: number; L2: number};
export type ModeLeg = {hip: Pt; knee: Pt; ankle: Pt; far: boolean; /** Foot centre and angle (local, radians) when it is not the flat standing shoe. */ foot?: {c: Pt; a: number}; /** Front view: the shin and foot are hidden behind the thigh (kneeling). */ hide?: boolean};
export type ModeKind = 'sit' | 'floor' | 'kneel' | 'squat' | 'run';
export type ModeLegs = {kind: ModeKind; amount: number; hipV: number; /** Hip shift along u (profile: the pelvis moves back onto the seat). */ hipU: number; legs: ModeLeg[]};

/** The mode a pose selects and its amount (run: the phase), or undefined for the original standing/walking legs. */
export const modeOf = (pose: Pick<FigPose, 'sit' | 'floorSit' | 'kneel' | 'squat' | 'run'>): {kind: ModeKind; amount: number} | undefined => {
  if ((pose.kneel ?? 0) > 0) return {kind: 'kneel', amount: clamp01(pose.kneel!)};
  if ((pose.floorSit ?? 0) > 0) return {kind: 'floor', amount: clamp01(pose.floorSit!)};
  if ((pose.sit ?? 0) > 0) return {kind: 'sit', amount: clamp01(pose.sit!)};
  if ((pose.squat ?? 0) > 0) return {kind: 'squat', amount: clamp01(pose.squat!)};
  if (pose.run !== undefined) return {kind: 'run', amount: pose.run};
  return undefined;
};

/** Two-bone IK in (u, v): knee for hip H and ankle target A, bending toward +u (forward). The ankle is pulled in when out of reach. */
export const kneeFor = (H: Pt, A: Pt, L1: number, L2: number): {knee: Pt; ankle: Pt} => {
  const dx = A[0] - H[0], dy = A[1] - H[1];
  const d = Math.max(1e-3, Math.min(Math.hypot(dx, dy), (L1 + L2) * 0.999));
  const base = Math.atan2(dy, dx), a = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
  return {knee: [H[0] + L1 * Math.cos(base + a), H[1] + L1 * Math.sin(base + a)], ankle: [H[0] + d * Math.cos(base), H[1] + d * Math.sin(base)]};
};

const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const ease = (u: number) => u * u * (3 - 2 * u);
/** Seated profile: the near ankle's distance ahead of the ground point for the 1.7 m adult (scaled by the leg length). */
export const SIT_FOOT = 0.23;
/**
 * The forward distance (m, along the facing direction) a motion moves the root while the figure sits or stands (`sit` amount `a`):
 * it keeps the ankles at one ground point all the way, so the feet never slide. 0 once seated, `SIT_FOOT * k` standing.
 */
export const sitFootOffset = (a: number, k: number): number => SIT_FOOT * k * (1 - ease(clamp01(a)));
/** Thigh length scale: the numbers below are metres for the 1.7 m adult (L1 = 0.336). */
const sc = (d: LegDims) => d.L1 / 0.336;

// ----------------------------------------------------------------------------------------------------------------- kneeling down
// `kneel` 0..1 is the whole kneel-down, in three stages (a pure function of the amount, so the motion and poseMix need nothing else):
//   0 - 0.40  step one foot back and lower onto that (far) knee while the other (near) foot steps forward and stays planted: a lunge;
//   0.40 - 0.70  the planted foot lifts, swings back and the second knee drops beside the first: both knees on the floor, thighs vertical;
//   0.70 - 1  the hips settle back and down along the arc round the knees (the knees and the shins on the floor stay where they are)
//   to the kneel of P34: hips 0.26 m above the floor for the 1.7 m adult, thighs 52 deg from vertical, torso upright.
// A foot that is on the ground never moves while it is there: the near foot is planted from 0.18 to 0.40, the far foot from 0.28 on.
export const KNEEL_STAGES = [0.4, 0.7] as const;
const KNEEL_FLOOR = 0.05; // knee height on the floor, m
const KNEEL_PHI = (52 * Math.PI) / 180; // thigh angle from vertical in the final kneel
const FAR_U = -0.02; // the far leg sits 2 cm behind the near one in a profile (as in the standing legs)
const ease01 = (u: number) => ease(clamp01(u));
const hump = (u: number) => Math.sin(Math.PI * clamp01(u));
/** The foot ellipse for a foot rotated `th` from toes forward (0) through toes down (-pi/2) to toes back (-pi): where the foot's weight is on the toes the foot trails the shin. */
const footAt = (ankle: Pt, th: number): {c: Pt; a: number} => {
  const w = (1 + Math.cos(th)) / 2;
  return {c: [ankle[0] + w * 0.035 + (1 - w) * 0.07 * Math.cos(th), ankle[1] - w * 0.017 + (1 - w) * 0.07 * Math.sin(th)], a: th};
};

export type KneelSolution = {hipU: number; hipV: number; legs: {hip: Pt; knee: Pt; ankle: Pt; far: boolean; foot: {c: Pt; a: number}}[]};
/** Profile legs of the kneel-down at amount `a` (0..1), far leg first. Metres in the figure's frame; bone lengths are exact. */
export const kneelSolution = (d: LegDims, a0: number): KneelSolution => {
  const {hip0, ankleV, L1, L2} = d, k = sc(d), a = clamp01(a0);
  const uK = 0.06 * k, hip1: Pt = [uK, KNEEL_FLOOR + L1];
  const s1 = ease01(a / KNEEL_STAGES[0]), s2 = ease01((a - KNEEL_STAGES[0]) / (KNEEL_STAGES[1] - KNEEL_STAGES[0])), s3 = ease01((a - KNEEL_STAGES[1]) / (1 - KNEEL_STAGES[1]));
  const dxF = Math.sqrt(L2 * L2 - (KNEEL_FLOOR - ankleV) ** 2); // knee on the floor, shin lying back along it
  // Hips: down and a little forward onto the first knee, held while the second comes down, then round the knees.
  const phi = KNEEL_PHI * s3;
  const H: Pt = a <= KNEEL_STAGES[1] ? [lerp(0, hip1[0], s1), lerp(hip0, hip1[1], s1)] : [uK - L1 * Math.sin(phi), KNEEL_FLOOR + L1 * Math.cos(phi)];
  // Far leg: stands, then its foot lifts, swings back and lands on the toes behind (planted from s1 = 0.7), the knee follows it to the floor.
  const rStart: Pt = [FAR_U, ankleV], rEnd: Pt = [uK + FAR_U - dxF, ankleV];
  const tR = clamp01((s1 - 0.1) / 0.6), eR = ease(tR);
  const rAnkle: Pt = [lerp(rStart[0], rEnd[0], eR), ankleV + 0.1 * k * hump(tR)];
  const rHip: Pt = [H[0] + FAR_U, H[1]];
  const R = kneeFor(rHip, rAnkle, L1, L2);
  // Near leg: its foot steps forward 0.28 m and stays planted for the lunge, then lifts and swings back with the knee dropping onto the floor.
  const lLead: Pt = [uK + 0.28 * k, ankleV], lEnd: Pt = [uK - dxF, ankleV];
  let lKnee: Pt, lAnkle: Pt, lTh = 0;
  if (a <= KNEEL_STAGES[0] + 1e-12) {
    const tL = clamp01((s1 - 0.05) / 0.4), eL = ease(tL);
    const t: Pt = [lerp(0, lLead[0], eL), ankleV + 0.1 * k * hump(tL)];
    ({knee: lKnee, ankle: lAnkle} = kneeFor(H, t, L1, L2));
  } else if (a < KNEEL_STAGES[1]) {
    // Angles from the lunge at s1 = 1 to the kneel (thigh straight down, shin back along the floor); the shin goes back first so the foot clears the floor.
    const start = kneeFor(hip1, lLead, L1, L2);
    const th1s = Math.atan2(start.knee[1] - hip1[1], start.knee[0] - hip1[0]), th2s = Math.atan2(lLead[1] - start.knee[1], lLead[0] - start.knee[0]);
    const th1e = -Math.PI / 2, th2e = Math.atan2(ankleV - KNEEL_FLOOR, -dxF);
    const th1 = lerp(th1s, th1e, ease01((s2 - 0.35) / 0.65)), e2 = ease01(s2 / 0.65), th2 = lerp(th2s, th2e, e2);
    lKnee = [H[0] + L1 * Math.cos(th1), H[1] + L1 * Math.sin(th1)];
    lAnkle = [lKnee[0] + L2 * Math.cos(th2), lKnee[1] + L2 * Math.sin(th2)];
    lTh = -Math.PI * e2;
  } else {
    ({knee: lKnee, ankle: lAnkle} = kneeFor(H, lEnd, L1, L2));
    lTh = -Math.PI;
  }
  return {
    hipU: H[0], hipV: H[1],
    legs: [
      {hip: rHip, knee: R.knee, ankle: R.ankle, far: true, foot: footAt(R.ankle, -Math.PI * eR)},
      {hip: H, knee: lKnee, ankle: lAnkle, far: false, foot: footAt(lAnkle, lTh)},
    ],
  };
};

/**
 * Hip height, hip shift and legs of a mode. `ph` is the run phase in radians. Profile legs are IK or explicit angles from the
 * hip; front legs are foreshortened by hand (thighs toward the camera). The far leg of a profile is listed first (drawn first).
 */
export const modeLegs = (d: LegDims, view: 'front' | 'profile', mode: {kind: ModeKind; amount: number}): ModeLegs => {
  const {hip0, ankleV, L1, L2} = d, k = sc(d), a = mode.amount;
  const legs: ModeLeg[] = [];
  const prof = view === 'profile';
  let hipV = hip0, hipU = 0;

  if (mode.kind === 'sit') {
    // Thigh horizontal at 1, shin near vertical; the pelvis moves back onto the seat and the feet stay planted: the ankle is
    // SIT_FOOT m ahead of the ground point at s = 1, so the standing figure (s = 0) stands that far forward of the seat to keep its
    // feet where they are (`motions.ts` sit-down moves the root by `sitFootOffset`). The front feet do not move at all.
    const s = ease(a);
    hipV = ankleV + L2 + L1 * Math.cos(s * Math.PI / 2);
    hipU = prof ? -0.14 * k * s : 0;
    for (const far of prof ? [true, false] : [false]) {
      if (prof) {
        const hip: Pt = [hipU + (far ? -0.02 : 0), hipV], ank: Pt = [SIT_FOOT * k * s + (far ? -0.02 : 0), ankleV];
        const {knee, ankle} = kneeFor(hip, ank, L1, L2);
        legs.push({hip, knee, ankle, far});
      } else {
        for (const sg of [-1, 1]) {
          const hip: Pt = [sg * 0.0725, hipV], knee: Pt = [sg * (0.077 + 0.04 * s), ankleV + L2 + 0.025 * s], ankle: Pt = [sg * 0.08, ankleV];
          legs.push({hip, knee, ankle, far: false});
        }
      }
    }
  } else if (mode.kind === 'kneel') {
    // Kneeling down in steps (`kneelSolution`). The front view takes the heights of the same legs: the thigh points toward the camera
    // while a foot is forward, and a foot that has swung back is hidden behind its thigh.
    const ks = kneelSolution(d, a);
    hipV = ks.hipV;
    hipU = prof ? ks.hipU : 0;
    if (prof) {
      for (const l of ks.legs) legs.push({hip: l.hip, knee: l.knee, ankle: l.ankle, far: l.far, foot: l.foot});
    } else {
      ks.legs.forEach((l, i) => {
        const sg = i === 0 ? -1 : 1, behind = l.ankle[0] - l.hip[0] < -0.05 * k;
        const ankle: Pt = [sg * 0.08, Math.max(ankleV, l.ankle[1])];
        legs.push({hip: [sg * 0.0725, hipV], knee: [sg * (0.077 + 0.035 * a), l.knee[1]], ankle, far: false, hide: behind});
      });
    }
  } else if (mode.kind === 'floor') {
    // Sitting on the ground, knees up, feet flat in front of the hips (hug-knees seat).
    const s = ease(a);
    hipV = lerp(hip0, 0.075, s);
    hipU = prof ? -0.04 * k * s : 0;
    for (const far of prof ? [true, false] : [false]) {
      if (prof) {
        const hip: Pt = [hipU + (far ? -0.02 : 0), hipV], ank: Pt = [0.44 * k * s + (far ? 0.03 : 0), ankleV];
        const {knee, ankle} = kneeFor(hip, ank, L1, L2);
        legs.push({hip, knee, ankle, far});
      } else {
        for (const sg of [-1, 1]) {
          const hip: Pt = [sg * 0.0725, hipV], knee: Pt = [sg * lerp(0.077, 0.15, s), lerp(ankleV + L2, 0.075 + 0.27 * k, s)], ankle: Pt = [sg * lerp(0.08, 0.125, s), ankleV];
          legs.push({hip, knee, ankle, far: false});
        }
      }
    }
  } else if (mode.kind === 'squat') {
    // Deep knee bend (profile; the front view uses crouch): hips drop and move back, feet stay under the body.
    const s = ease(a);
    hipV = lerp(hip0, ankleV + 0.22 * k, s);
    hipU = prof ? -0.11 * k * s : 0;
    for (const far of [true, false]) {
      const hip: Pt = [hipU + (far ? -0.02 : 0), hipV], ank: Pt = [0.03 + (far ? 0.03 : 0), ankleV];
      const {knee, ankle} = kneeFor(hip, ank, L1, L2);
      legs.push({hip, knee, ankle, far});
    }
  } else {
    // Run: phase a (radians). Profile: swing and knee flexion from the hip, hip height set so the stance foot meets the ground,
    // plus a flight bounce. Front: alternate lifted feet, bob.
    const ph = a;
    const fly = 0.03 * k * Math.max(0, Math.sin(2 * ph + 0.4));
    if (prof) {
      const rel: {far: boolean; knee: Pt; ankle: Pt}[] = [];
      for (const far of [true, false]) {
        const th = ph + (far ? Math.PI : 0);
        const sw = 0.2 + 0.78 * Math.sin(th), bend = 0.8 + 0.7 * Math.cos(th - 0.2), b2 = sw - bend;
        const knee: Pt = [L1 * Math.sin(sw), -L1 * Math.cos(sw)];
        rel.push({far, knee, ankle: [knee[0] + L2 * Math.sin(b2), knee[1] - L2 * Math.cos(b2)]});
      }
      hipV = ankleV - Math.min(...rel.map((r) => r.ankle[1])) + fly;
      for (const r of rel) legs.push({hip: [r.far ? -0.02 : 0, hipV], knee: [r.knee[0] + (r.far ? -0.02 : 0), hipV + r.knee[1]], ankle: [r.ankle[0] + (r.far ? -0.02 : 0), hipV + r.ankle[1]], far: r.far});
    } else {
      hipV = hip0 - 0.045 * k + 0.02 * k * Math.abs(Math.sin(ph));
      for (const sg of [-1, 1]) {
        const lift = 0.14 * k * Math.max(0, Math.sin(ph + (sg > 0 ? Math.PI : 0)));
        const hip: Pt = [sg * 0.0725, hipV], ankle: Pt = [sg * 0.08, ankleV + lift];
        legs.push({hip, knee: [sg * 0.077, (hipV + ankle[1]) / 2 + 0.35 * lift], ankle, far: false});
      }
    }
  }
  return {kind: mode.kind, amount: a, hipV, hipU, legs};
};
