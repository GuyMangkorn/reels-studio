// EDU-EP17 N12 `squeezed` (Boss, group 2): P10 (phone held to the chest) with the elbows tucked behind the upper arm and the shoulders narrowed, as an EPISODE module.
// It is a kit PROPOSAL (build-notes.md "Kit proposals": pose `P10-squeezed`, or a `squeeze` 0..1 modifier on any chest-hold pose); it is not in the kit and nothing here edits the kit.
// Numbers from LF02 (looks-b.md point 4): hands 3 cm up and 2 cm in, elbows (`via`) 3.5 cm in and 2 cm up, `behind: 'upper'`, shoulder width x 0.92, eased in over +2 to +6.
import type {CastDef} from '../kit/cast';
import type {Pt} from '../kit/painter';
import {poseFor} from '../kit/poses';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';

/** Hand targets, elbows and shoulder width at full squeeze (k = 1), metres and a fraction. */
export const SQUEEZE = {handUp: 0.03, handIn: 0.02, elbowIn: 0.035, elbowUp: 0.02, shoulder: 0.08} as const;
/** Neighbours' marks on the lattice (x offset, z) at rest and the press at full squeeze: front three-quarter cards turned 55 deg away from him. */
export const NEIGHBOURS = {left: {x: -0.44, z: 0.12, quarter: 'left' as const}, right: {x: 0.44, z: 0.13, quarter: 'right' as const}, deg: 55, press: 0.06} as const;

/** Squeeze clock: 0 until +2, eased to 1 at +6 (smoothstep). */
export const squeezeK = (f: number, from = 2, to = 6): number => { const u = Math.min(1, Math.max(0, (f - from) / (to - from))); return u * u * (3 - 2 * u); };

type Arm = {to: Pt; via?: Pt; behind?: 'upper'};
/** The P10 arms and the narrower shoulder for `k` (0..1) at world point `at` seen by camera `c`. The returned `fig` goes to `paintFigureAt({fig, pose: 'P10'})`. */
export const squeezedFig = (def: CastDef, c: YCam, at: V3, k: number) => {
  const g = camPoint(c, at) as Pt, u = camUnit(c, at), pose = poseFor('P10', def, g, u, 'front') as {rArm?: Arm; lArm?: Arm};
  const adj = (a: Arm | undefined, s: number): Arm | undefined => a && {...a, to: [a.to[0] - s * SQUEEZE.handIn * u * k, a.to[1] - SQUEEZE.handUp * u * k] as Pt, via: a.via && ([a.via[0] - s * SQUEEZE.elbowIn * u * k, a.via[1] - SQUEEZE.elbowUp * u * k] as Pt), behind: 'upper' as const};
  return {def: {...def, outfit: {...def.outfit, shoulder: def.outfit.shoulder * (1 - SQUEEZE.shoulder * k)}}, fig: {rArm: adj(pose.rArm, 1), lArm: adj(pose.lArm, -1)}};
};
