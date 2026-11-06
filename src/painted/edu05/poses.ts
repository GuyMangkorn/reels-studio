import type {Arm, CastDef, FigPose} from '../kit/cast';
import {BONE, ikElbow, shoulderPoint} from '../kit/cast';
import {ell, inkLine, solid} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {poseBody, type AnyPoseId} from '../kit/poses';
import type {View} from '../kit/poses';

// N10 (EDU-EP05 scene sheets, pose bases R1.1): the seven `new:` TINY poses, episode-local until kit intake (W8.4). Each takes its base
// kit pose, then overrides body fields and arms. Arm targets are metres from the shoulder (x toward the facing side, y up), as the kit
// tables write them; `L` is the shot-local frame (event clock, seeded: a seek renders the same frame).

export const NAMED_POSES = ['drift-spread', 'sit-up-check', 'brace-heave', 'nibble', 'drag-back', 'clutch-puff', 'lift-overhead'] as const;
export type NamedPose = (typeof NAMED_POSES)[number];
export const BASE_OF: Record<NamedPose, AnyPoseId> = {
  'drift-spread': 'P45', 'sit-up-check': 'P33', 'brace-heave': 'P16', nibble: 'P34', 'drag-back': 'P26', 'clutch-puff': 'P42', 'lift-overhead': 'P45',
};
/** The view each pose is built for (sheet N10); the shot may flip it with `view`. */
export const VIEW_OF: Record<NamedPose, 'front' | 'left' | 'right'> = {
  'drift-spread': 'front', 'sit-up-check': 'front', 'brace-heave': 'right', nibble: 'left', 'drag-back': 'left', 'clutch-puff': 'front', 'lift-overhead': 'front',
};

type Spec = {to: Pt; via: Pt; behind?: Arm['behind']};
type Body = Pick<FigPose, 'squat' | 'crouch' | 'bend' | 'lean' | 'rise' | 'floorSit' | 'nod' | 'walk' | 'stride'>;
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
      r = k === 0 ? {to: [0.2 - 0.04 * d, -0.2 - 0.04 * d], via: [-0.04, -0.2]} : {to: [0.03, -0.3], via: [-0.06, -0.22]};
      l = k === 1 ? {to: [-0.1 + 0.03 * d, -0.3 - 0.03 * d], via: [0.06, -0.22]} : {to: [-0.03, -0.3], via: [0.06, -0.22]};
      break;
    }
    case 'brace-heave': { // profile pull, lean away 15-20 deg, the far hand clamps the near forearm on each heave
      const h = pulse(L, 12);
      body = {crouch: 0.15, lean: -(0.24 + 0.14 * h), walk: 0.25, stride: 0.5};
      r = {to: [0.3 + 0.07 * h, -0.02 - 0.06 * h], via: [0.14, -0.1]}; l = {to: [0.27 + 0.07 * h, -0.03 - 0.06 * h], via: [0.12, -0.12]};
      break;
    }
    case 'nibble': { // both hands flat on the crumb face, head forward 0.05 sm per bite
      const b = pat(L, 10);
      body = {bend: 0.7, nod: [0.12 * b, -0.05 * b]};
      r = {to: [0.3, -0.34], via: [0.14, -0.2]}; l = {to: [0.28, -0.36], via: [0.12, -0.22]};
      break;
    }
    case 'drag-back': // profile, hands hooked on the crumb edge, lean away, walk clock reversed and slow (planted feet read)
      body = {squat: 0.35, lean: 0.35, rise: -0.012 * pulse(L, 8)}; // squat mode has no walk: a dip per 8 f stands for the small backward steps (feet slide with the crumb, open)
      r = {to: [0.3, -0.4], via: [0.12, -0.26]}; l = {to: [0.28, -0.42], via: [0.1, -0.27]};
      break;
    case 'clutch-puff': // hands cupped at the chest (CP-P02) as the puff squeezes out
      r = {to: [0.1, -0.12], via: [-0.04, -0.22], behind: 'upper'}; l = {to: [-0.1, -0.12], via: [0.04, -0.22], behind: 'upper'};
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

/**
 * FR09 `brace-heave` with the right arm on a given wrist (the dew drop): the right arm keeps `wrist` (px), the left hand is a separate clamp
 * at 0.6 of the way from the right elbow to the right wrist (the two-bone elbow the rig solves, out = -1). Returns the arms to spread over
 * the named pose (`fig`) and the clamp point (px) where the shot draws the left mitten over the forearm (`paintClamp`).
 */
export const braceClamp = (L: number, def: CastDef, g: Pt, u: number, wrist: Pt): {rArm: Arm; lArm: Arm; clamp: Pt} => {
  const np = namedPose('brace-heave', L, def, g, u, 'right'), view = {view: 'right' as const, ...poseBody(BASE_OF['brace-heave'], 'right'), ...np};
  const sh = shoulderPoint(def, g, u, view, 'r'), Lpx = BONE * (def.armScale ?? 1) * u, d = Math.hypot(wrist[0] - sh[0], wrist[1] - sh[1]), m = 2 * Lpx - 0.5;
  const T: Pt = d <= m ? wrist : [sh[0] + ((wrist[0] - sh[0]) * m) / d, sh[1] + ((wrist[1] - sh[1]) * m) / d]; // the rig clamps the reach the same way
  const el = ikElbow(sh, T, Lpx, -1), clamp: Pt = [el[0] + (T[0] - el[0]) * 0.6, el[1] + (T[1] - el[1]) * 0.6];
  return {rArm: {to: wrist, out: -1}, lArm: {to: clamp, out: -1}, clamp};
};
/** The left mitten of the clamp, drawn after the figure (front layer) over the top edge of the right forearm. */
export const paintClamp = (p: Painter, at: Pt, u: number, skin: string) => {
  const w = 0.056 * u, h = 0.05 * u;
  solid(p, 6120, skin, ell(at[0], at[1] - 0.012 * u, w, h, 14), 3);
  inkLine(p, 6121, ell(at[0], at[1] - 0.012 * u, w, h, 14), {weight: 0.9, color: mixColor(skin, '#7a4a30', 0.55), curve: 0.3});
  inkLine(p, 6122, [[at[0] + 0.02 * u, at[1] - 0.05 * u], [at[0] + 0.03 * u, at[1] - 0.005 * u]], {weight: 0.9, color: mixColor(skin, '#7a4a30', 0.55), closed: false});
};
