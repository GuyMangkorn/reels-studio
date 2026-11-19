import type {FigAnchors} from '../kit/cast';
import {hardFill} from '../kit/draw';
import type {ExpressionId} from '../kit/expressions';
import {viewAtCam} from '../kit/figure-at';
import {poseArms} from '../kit/poses';
import type {V3} from '../kit/space';
import {camUnit, type YCam} from '../kit/ycam';
import type {Painter, Pt} from '../kit/painter';
import {at2, paintFullonica, type FullLight} from './fullonica';
import {act, arm, LF04_FACING, LF04_JAR, LF04_MARCUS, LF04_SENIOR, lf04Fan, noseOf, YUCK} from './r4-looks';
import {MARCUS, paintJar, paintRibbons, SENIOR} from './r4-cast';
import {lerp, rec, type Probe26} from './stage26';

// EDU-EP26-SHORT the bench two-shot shared by B02-SH01 (jar handed over) and B02-SH02 (LF04, the smell arrives): the LF04 staging (approved look,
// r4-looks.ts `paintLF04`) as a function of the beat state, so the two shot files time it (Boss W5.2, 2026-11-18). No Remotion import.

export type BenchState = {
  t: number;
  /** Jar base (world). */
  jar: V3;
  /** 0 lid on the jar (senior's mitten on it), 1 lid in the senior's raised hand (the LF04 lid point); between: lifting. */
  lid: number;
  /** The senior's hands carry the jar (both mittens on its belly) instead of the lid. */
  carry?: boolean;
  senior: ExpressionId;
  marcus: ExpressionId;
  /** Yuck face (R5 YUCK) on Marcus. */
  yuck?: boolean;
  /** Recoil 0..1: head cock -9 deg and a lean back from the jar. */
  recoil: number;
  /** Fan 0..1: Marcus's near open mitten from hanging to the LF04 fan point. */
  fan: number;
  /** Ribbons: rise 0..1 (jar mouth -> nose), strength (ledger 1 = plant). 0 = none. */
  rib: number;
  ribStrength?: number;
};

const lidPoint = (j: V3): V3 => [j[0] + 0.2, j[1] + 0.22, j[2] - 0.12];
const lidTop = (j: V3): V3 => [j[0], j[1] + 0.38, j[2]];

export function paintBenchScene(p: Painter, c: YCam, s: BenchState, pr?: Probe26, light: FullLight = {mood: 'morning'}) {
  let mouth: Pt | null = null, m: FigAnchors | null = null;
  const lidW: V3 = [lerp(lidTop(s.jar)[0], lidPoint(s.jar)[0], s.lid), lerp(lidTop(s.jar)[1], lidPoint(s.jar)[1], s.lid), lerp(lidTop(s.jar)[2], lidPoint(s.jar)[2], s.lid)];
  paintFullonica(p, c, light, {
    behindBench: (q, cc) => {
      const lid = at2(cc, lidW);
      const jl = at2(cc, [s.jar[0] - 0.15, s.jar[1] + 0.2, s.jar[2]]), jr = at2(cc, [s.jar[0] + 0.15, s.jar[1] + 0.2, s.jar[2]]);
      rec(pr, 'senior', act(q, cc, {def: SENIOR, at: LF04_SENIOR, facing: [-0.55, 1], face: s.senior, seed: 2621, t: s.t,
        arms: (g, u) => s.carry
          ? {rArm: arm([jl[0], jl[1]], [g[0] - 0.36 * u, g[1] - 1.0 * u], {open: 1}), lArm: arm([jr[0], jr[1]], [g[0] + 0.1 * u, g[1] - 0.95 * u], {open: -1})}
          : {rArm: arm([lid[0] + 0.03 * u, lid[1] + 0.02 * u], [g[0] - 0.36 * u, g[1] - 1.12 * u], {open: 1})},
        held: (qq, a, u) => {
          if (s.carry || s.lid <= 0) return;
          const [x, y] = a.rHand;
          hardFill(qq, 34050, '#9a5434', [[x - 0.09 * u, y - 0.01 * u], [x + 0.09 * u, y - 0.03 * u], [x + 0.08 * u, y + 0.015 * u], [x - 0.08 * u, y + 0.03 * u]]);
          hardFill(qq, 34051, '#5a2e22', [[x - 0.02 * u, y - 0.05 * u], [x + 0.02 * u, y - 0.055 * u], [x + 0.02 * u, y - 0.015 * u], [x - 0.02 * u, y - 0.01 * u]]);
        }}));
    },
    room: (q, cc) => {
      const j = paintJar(q, cc, s.jar, 34000, {lid: s.lid > 0 ? 'off' : 'on', h: 0.36, w: 0.32});
      mouth = j ? j.mouth : null;
      const g = at2(cc, LF04_MARCUS), u = camUnit(cc, LF04_MARCUS), view = viewAtCam(cc, {at: LF04_MARCUS, facing: LF04_FACING});
      m = act(q, cc, {def: MARCUS, at: LF04_MARCUS, facing: LF04_FACING, face: s.yuck ? 'disgusted' : s.marcus, faceState: s.yuck ? YUCK : undefined, seed: 2622, t: s.t,
        fig: {headCock: -9 * s.recoil, lean: -0.1 * s.recoil},
        arms: (gg, uu, v, an) => {
          if (!an || s.fan <= 0) return {};
          const fan = lf04Fan(an, uu).lArm, base = poseArms('P01', MARCUS, g, u, view.view === 'back' ? 'front' : view.view).lArm;
          if (!base || s.fan >= 1) return {lArm: fan};
          const k = s.fan, mix = (a: Pt, b: Pt): Pt => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
          return {lArm: arm(mix(base.to, fan.to), mix(base.via ?? base.to, fan.via!), {open: 1})};
        }});
      rec(pr, 'marcus', m);
      const mm = m as FigAnchors | null, mo = mouth as Pt | null;
      if (mo && mm && s.rib > 0) {
        const o = {spread: 26, bow: 0.18, waves: 1.8, t: s.t, grow: s.rib, strength: s.ribStrength ?? 1};
        paintRibbons(q, 34100, [mo[0], mo[1] - 8], noseOf(mm, 1, 0.75), {...o, w: 40, op: 110, color: '#8a8443', edge: 0});
        paintRibbons(q, 34100, [mo[0], mo[1] - 8], noseOf(mm, 1, 0.75), {...o, w: 28, op: 220, edge: 1.6});
      }
    },
  });
}
export {LF04_JAR};
