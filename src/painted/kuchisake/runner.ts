import {BONE, drawFigure, H, type Arm, type CastDef, type FigAnchors, type FigPose} from '../kit/cast';
import type {InteriorLight} from '../kit/draw';
import type {FaceState} from '../kit/head';
import type {Painter, Pt} from '../kit/painter';

// The narrator running in profile (S03-B01-SH02 insert A, user note 1 Nov 2026: "run" needs arms that swing). The kit profile
// gait is a walk: legs swing +-0.42 rad and the arms hang. This keeps the kit legs and body, raises the cadence, leans the torso
// toward the run direction, swings both arms through +-0.9 rad with the elbows bent about 70 deg (pose built from FK targets in
// plate px: `rArm`/`lArm` with `via`), and lifts the whole figure in the flight phase (the kit keeps the lower foot on the ground).
// Not a rig pose (no P01-P30 entry is a run: CP-P12 deviation recorded in DF-20261101-kso-look-stills Round 8).

/** Shoulder point of the profile rig at `lean` (rad), gait phase `ph` (rad): mirrors cast.ts `U([-0.0043, shV - 0.03])`. */
const shoulderAt = (def: CastDef, g: Pt, unit: number, dir: 1 | -1, lean: number, ph: number): Pt => {
  const chin = def.height - H, shV = chin - 0.16 * H, hip0 = shV - (chin - 0.068) * 0.44 + 0.034;
  const hipV = hip0 - 0.018 * Math.abs(Math.sin(ph));
  const du = -0.0043, dv = shV - 0.03 - hipV, a = -dir * lean;
  const u = du * Math.cos(a) - dv * Math.sin(a), v = hipV + du * Math.sin(a) + dv * Math.cos(a);
  return [g[0] + dir * u * unit, g[1] - v * unit];
};

/** Run pose at `cycles` (gait phase in cycles). Returns the kit anchors. */
export const drawRunnerProfile = (p: Painter, def: CastDef, g: Pt, unit: number, t: number, cycles: number, face: FaceState, light: InteriorLight, o: {view?: 'right' | 'left'} = {}): FigAnchors => {
  const dir: 1 | -1 = o.view === 'left' ? -1 : 1;
  const ph = cycles * Math.PI * 2, lean = 0.16;
  const hop = 0.05 * unit * Math.abs(Math.sin(ph));
  const gg: Pt = [g[0], g[1] - hop];
  const Sh = shoulderAt(def, gg, unit, dir, lean, ph);
  const L = BONE * unit;
  const arm = (theta: number): Arm => {
    const flex = 1.2;
    const E: Pt = [Sh[0] + dir * L * Math.sin(theta), Sh[1] + L * Math.cos(theta)];
    const T: Pt = [E[0] + dir * L * Math.sin(theta + flex), E[1] + L * Math.cos(theta + flex)];
    return {to: T, via: E};
  };
  const pose: FigPose = {view: dir > 0 ? 'right' : 'left', face, light, walk: cycles, lean, rArm: arm(0.15 - 0.95 * Math.sin(ph)), lArm: arm(0.15 + 0.95 * Math.sin(ph))};
  return drawFigure(p, def, gg, unit, pose, t);
};
