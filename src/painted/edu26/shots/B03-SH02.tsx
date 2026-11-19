import {ell} from '../../kit/draw';
import {washAt} from '../../kit/draw';
import {hash} from '../../kit/hash';
import type {Pt} from '../../kit/painter';
import {camPoint, camUnit} from '../../kit/ycam';
import {at2, LIQUID, paintFullonica, STALL_Z0, STALLS, type FullLight} from '../fullonica';
import {act, arm, LF05_SENIOR, LF05_SENIOR_FACING, LIQUID_TOP, lf05Marcus, noseHold, paintDripLine, paintTread, paintTreadFloor, STALL1_AT, treader, WS, YUCK} from '../r4-looks';
import {MARCUS_BARE, paintRibbons, paintWrungCloth, SENIOR} from '../r4-cast';
import {paintedArms} from '../r4-hands';
import {makeShot, type Shot26} from '../shot';
import {treadKick} from '../acts26';
import {drift, rec} from '../stage26';

// B03-SH02 · G [850, 926) · the tread, LF05 (approved, measured; SHEET-R1 part A). The LF05 camera with the retention drift; the LF05 staging
// (r4-looks.ts `paintLF05`) animated: Marcus treads one step per 15 f locked to the groove (right mitten on his nose, left palm on the partition's
// near end), the first full-weight stomp at L18 ("ย่ำผ้า") throws a splash; the senior treads the right-hand stall at half the rate and wrings
// with two fists; two faint ribbons rise off the liquid and wave.
const N = 76;
export const def: Shot26 = {
  id: 'B03-SH02', N,
  cam: (L) => drift(WS.LF05, L, 0.02),
  paint: (p, L, c, pr) => {
    const t = L / 30, Lt: FullLight = {mood: 'setback'}, tint = {to: '#7d8f7c', u: 0.1};
    const stomp = L >= 14 && L < 22 ? {r: {hip: 34 * Math.sin(Math.PI * (L - 14) / 8), knee: 40 * Math.sin(Math.PI * (L - 14) / 8)}} : treadKick(L, 3, 15, 24);
    paintFullonica(p, c, Lt, {
      noPoles: true,
      stallLiquidFrom: [STALL_Z0, STALL1_AT[2] - 0.03, LF05_SENIOR[2] - 0.03],
      backDress: (q, cc) => paintDripLine(q, cc, Lt),
      inStalls: (q, cc) => {
        const u = camUnit(cc, [LF05_SENIOR[0], 1.2, LF05_SENIOR[2]]), wr = 0.02 * Math.sin(t * 4);
        let lh: Pt = [0, 0], rh: Pt = [0, 0];
        rec(pr, 'senior', act(q, cc, {def: SENIOR, at: LF05_SENIOR, facing: LF05_SENIOR_FACING, face: 'happy', seed: 2632, tint, t, fig: {legKick: treadKick(L, 10, 30, 14)},
          arms: (g, uu, v, an) => {
            if (!an) return {};
            const mx = (an.rShoulder[0] + an.lShoulder[0]) / 2, my = (an.rShoulder[1] + an.lShoulder[1]) / 2 + (0.3 + wr) * u;
            lh = [mx - 0.09 * u, my]; rh = [mx + 0.09 * u, my + 0.02 * u];
            return {rArm: arm(lh, [an.rShoulder[0] - 0.1 * u, my - 0.06 * u], {fist: -1}), lArm: arm(rh, [an.lShoulder[0] + 0.1 * u, my - 0.04 * u], {fist: 1})};
          }}));
        paintWrungCloth(q, [lh[0] - 0.05 * u, lh[1] - 0.05 * u], [rh[0] + 0.07 * u, rh[1] - 0.05 * u], 0.075 * u, 34300);
        rec(pr, 'marcus', act(q, cc, {...treader(MARCUS_BARE, 'disgusted', 2631, tint), t, look: [0.1, 0.25], faceState: YUCK, fig: {legKick: stomp},
          arms: (g, u) => ({...paintedArms(cc, lf05Marcus()), rArm: noseHold(MARCUS_BARE, g, u, -1)})}));
      },
      onLiquid: (q, cc, k) => paintTread(q, cc, k, Lt),
      room: (q, cc) => {
        const w0 = at2(cc, [STALLS[1].x0 + 0.18, LIQUID_TOP, -2.45]), w1 = at2(cc, [STALLS[1].x0 + 0.05, 1.35, -2.7]);
        paintRibbons(q, 34400, w0, w1, {w: 16, op: 85, spread: 30, bow: 0.15, waves: 1.6, t});
        const v0 = at2(cc, [STALLS[1].x1 - 0.18, LIQUID_TOP, -2.45]), v1 = at2(cc, [STALLS[1].x1 - 0.02, 1.3, -2.7]);
        paintRibbons(q, 34420, v0, v1, {w: 16, op: 75, spread: 26, bow: -0.15, waves: 1.6, count: 2, t});
        // the stomp's splash (L18-L26): drops thrown up off the liquid round Marcus's right foot, falling back
        if (L >= 18 && L < 27) {
          const s = (L - 18) / 9;
          for (let i = 0; i < 9; i++) {
            const a = hash(35600 + i) * Math.PI, r = 0.08 + 0.12 * hash(35620 + i), h = 0.28 * Math.sin(Math.PI * s) * (0.5 + hash(35640 + i));
            const d = camPoint(cc, [STALL1_AT[0] - 0.09 + Math.cos(a) * r * (0.4 + s), LIQUID + h, STALL1_AT[2] + 0.05 + Math.sin(a) * r * 0.4]);
            if (d) washAt(q, 35660 + i, '#dde6d0', 200, ell(d[0], d[1], 5, 7, 8), 0.15, 0.2);
          }
        }
      },
      foreground: (q, cc) => paintTreadFloor(q, cc, Lt),
    });
  },
};
export const shot = makeShot(def);
