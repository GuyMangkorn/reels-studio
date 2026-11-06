import type {Arm, CastDef, FigPose} from '../kit/cast';
import {shoulderPoint} from '../kit/cast';
import type {Pt} from '../kit/painter';
import {poseBody, type AnyPoseId} from '../kit/poses';
import type {View} from '../kit/poses';

// N10 (EDU-EP05 scene sheets, pose bases R1.1): the seven `new:` TINY poses, episode-local until kit intake (W8.4). Each takes its base
// kit pose, then overrides body fields and arms. Arm targets are metres from the shoulder (x toward the facing side, y up), as the kit
// tables write them; `L` is the shot-local frame (event clock, seeded: a seek renders the same frame).

export const NAMED_POSES = ['drift-spread', 'sit-up-check', 'brace-heave', 'nibble', 'drag-back', 'clutch-puff', 'lift-overhead'] as const;
export type NamedPose = (typeof NAMED_POSES)[number];
export const BASE_OF: Record<NamedPose, AnyPoseId> = {
  'drift-spread': 'P45', 'sit-up-check': 'P33', 'brace-heave': 'P16', nibble: 'P19', 'drag-back': 'P26', 'clutch-puff': 'P42', 'lift-overhead': 'P45',
};
/** The view each pose is built for (sheet N10); the shot may flip it with `view`. */
export const VIEW_OF: Record<NamedPose, 'front' | 'left' | 'right'> = {
  'drift-spread': 'front', 'sit-up-check': 'front', 'brace-heave': 'right', nibble: 'left', 'drag-back': 'left', 'clutch-puff': 'front', 'lift-overhead': 'front',
};

type Spec = {to: Pt; via: Pt; behind?: Arm['behind']};
type Body = Pick<FigPose, 'crouch' | 'bend' | 'lean' | 'rise' | 'floorSit' | 'nod' | 'walk' | 'stride'>;
const pulse = (L: number, period: number) => Math.abs(Math.sin((Math.PI * L) / period)); // 0..1, one bump per `period` frames
const pat = (L: number, period: number) => Math.pow(pulse(L, period), 3); // sharp touch, long lift

/** Body fields and both arms of one named pose at event frame `L`. Returns what `paintTiny` spreads between the base pose and `fig`. */
export const namedPose = (name: NamedPose, L: number, def: CastDef, g: Pt, u: number, view: View): Partial<FigPose> => {
  let body: Body = {}, r: Spec, l: Spec;
  switch (name) {
    case 'drift-spread': // arms level at shoulder height and wide, soft knees (CP-P01)
      body = {crouch: 0.06};
      r = {to: [-0.5, 0.0], via: [-0.26, -0.02]}; l = {to: [0.5, 0.0], via: [0.26, -0.02]};
      break;
    case 'sit-up-check': { // alternate pats: right hand on the left forearm, then left hand on the right thigh (1 pat / 7 f)
      body = {floorSit: 1};
      const k = Math.floor(L / 7) % 2, d = pat(L, 7);
      r = k === 0 ? {to: [0.2 - 0.04 * d, -0.2 - 0.04 * d], via: [-0.04, -0.2]} : {to: [-0.2, -0.24], via: [-0.06, -0.2]};
      l = k === 1 ? {to: [-0.12 + 0.03 * d, -0.3 - 0.03 * d], via: [0.06, -0.2]} : {to: [0.2, -0.24], via: [0.06, -0.2]};
      break;
    }
    case 'brace-heave': { // profile pull, lean away 15-20 deg, the far hand clamps the near forearm on each heave
      const h = pulse(L, 12);
      body = {crouch: 0.15, lean: -(0.26 + 0.08 * h)};
      r = {to: [0.3 + 0.03 * h, -0.02], via: [0.14, -0.1]}; l = {to: [0.27 + 0.03 * h, -0.03], via: [0.12, -0.12]};
      break;
    }
    case 'nibble': { // both hands flat on the crumb face, head forward 0.05 sm per bite
      const b = pat(L, 10);
      body = {bend: 0.08, nod: [0.12 * b, -0.05 * b]};
      r = {to: [0.32, -0.16], via: [0.12, -0.2]}; l = {to: [0.3, -0.2], via: [0.1, -0.22]};
      break;
    }
    case 'drag-back': // profile, hands hooked on the crumb edge, lean away, walk clock reversed and slow (planted feet read)
      body = {lean: 0.2, walk: -L / 24, stride: 0.45};
      r = {to: [0.3, -0.28], via: [0.12, -0.22]}; l = {to: [0.28, -0.3], via: [0.1, -0.23]};
      break;
    case 'clutch-puff': // hands cupped at the chest (CP-P02) as the puff squeezes out
      r = {to: [-0.07, -0.17], via: [-0.2, -0.27], behind: 'upper'}; l = {to: [0.07, -0.17], via: [0.2, -0.27], behind: 'upper'};
      break;
    case 'lift-overhead': // both hands overhead, elbows back into depth
      r = {to: [-0.13, 0.56], via: [-0.22, 0.28], behind: 'upper'}; l = {to: [0.13, 0.56], via: [0.22, 0.28], behind: 'upper'};
      break;
  }
  const dir = view === 'left' ? -1 : 1, bodyView = {view: (view === 'back' ? 'front' : view) as FigPose['view'], ...poseBody(BASE_OF[name], view === 'front' ? 'front' : 'right'), ...body};
  const arm = (side: 'r' | 'l', s: Spec): Arm => {
    const sh = shoulderPoint(def, g, u, bodyView, side), k = def.armScale ?? 1;
    const px = (p: Pt): Pt => [sh[0] + dir * p[0] * k * u, sh[1] - p[1] * k * u];
    return {to: px(s.to), via: px(s.via), ...(s.behind ? {behind: s.behind} : {})};
  };
  return {...body, rArm: arm('r', r), lArm: arm('l', l), rHold: undefined, lHold: undefined};
};
