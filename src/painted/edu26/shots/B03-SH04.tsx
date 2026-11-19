import type {V3} from '../../kit/space';
import {camPoint, camUnit, type YCam} from '../../kit/ycam';
import type {Arm, FigAnchors} from '../../kit/cast';
import {mixColor, type Pt} from '../../kit/painter';
import {inkLine} from '../../kit/draw';
import {flatCircle} from '../../kit/world';
import {LIQUID, paintFullonica, PAL, STALL_RIM, STALL_Z0, STALL_Z1, tone} from '../fullonica';
import {qy, qz, wFill} from '../../kit/world';
import {act} from '../r4-looks';
import {MARCUS_BARE, paintRibbons} from '../r4-cast';
import {makeShot, type Shot26} from '../shot';
import {armTo, CL01_L, CL01_R, sourceRibbons, VOW_CAM} from '../acts26';
import {camKeys, ease, lerp, rec, yc} from '../stage26';

// B03-SH04 · G [767, 850) · hands become feet, the CL01 match cut (SHEET-R1 part A). Hands state L0-L34: the B01-SH06 vow camera, Marcus's two
// raised empty mittens on the CL01 anchors, `worried`, eyes down on his hands, one ribbon off his right forearm (60 %). Match cut at L35
// ("เปลี่ยนเป็นสองเท้า"): the low camera behind him on the middle stall's front rim (R6 projection: feet at (380, 906) / (700, 906)), light
// `setback`; he stands on the rim barefoot, the right foot dips into the liquid at L64 (est), the left at L73; by L82 both shins are in. Two
// ribbons rise off the liquid at the feet (60 %). The rig's stance is narrower than the sheet's 0.30 m feet: measured `feetX` below.
const N = 83, CUT = 35;
// W5.2: the rig's stance is about 0.18 m, not the sheet's 0.30 m, so the R6 eye (-0.20, 0.97, -1.43) put the feet 184 px apart; the eye moves
// in along the same line until the drawn feet span the CL01 spots (380 / 700). Film to confirm.
const FEET_CAM = yc(-0.2, 0.83, -1.8, 0, -25, 1000, 1024);
// W5.3 (Film fix 2): from L50 the eye rises to y 1.30 / pitch -45 (ease to L60, held to the end; Film's y 1.00 / -32 still hid the liquid: from y 1.0 the line over the 0.62 rim only reaches the liquid at z > -2.62) so the right foot's dip at L64 (squelch C13) and the
// shins going in clear the stall front wall; L0-L49 keep the CL01 spots.
const HIGH_CAM = yc(-0.2, 1.3, -1.8, 0, -45, 1000, 1024);
const AT: V3 = [-0.42, 0, 0.12], RIM: V3 = [-0.2, 0.62, -2.35], IN: V3 = [-0.2, 0.05, -2.62];
const FL = {mood: 'setback'} as const;
/** Marcus's arms out from his sides for balance (back view, character right = screen right), laid out on the card from the shoulders the rig
 *  draws (`an`): the card is upright and unforeshortened under the high lens, so world hand points read as arms raised level. */
const balanceArms = (an: FigAnchors | undefined, u: number, k: number) => {
  const out: {rArm?: Arm; lArm?: Arm} = {};
  if (!an) return out;
  for (const side of ['right', 'left'] as const) {
    const s = side === 'right' ? 1 : -1, S = side === 'right' ? an.rShoulder : an.lShoulder;
    const to: Pt = [S[0] + s * lerp(0.03, 0.2, k) * u, S[1] + lerp(0.49, 0.4, k) * u], via: Pt = [S[0] + s * lerp(0.02, 0.15, k) * u, S[1] + lerp(0.25, 0.19, k) * u];
    out[side === 'right' ? 'rArm' : 'lArm'] = {to, via, open: s as 1 | -1, exact: true};
  }
  return out;
};
export const def: Shot26 = {
  id: 'B03-SH04', N,
  // no retention drift: hands then feet must land on the same two screen spots across the cut
  cam: (L) => (L < CUT ? VOW_CAM : camKeys([[CUT, FEET_CAM], [50, FEET_CAM], [60, HIGH_CAM]], L)),
  paint: (p, L, c, pr) => {
    const t = L / 30;
    if (L < CUT) {
      paintFullonica(p, c, {mood: 'morning'}, {
        noPoles: true,
        room: (q, cc) => {
          const m = act(q, cc, {def: MARCUS_BARE, at: AT, facing: [0, 1], face: 'worried', seed: 2622, t, look: [0, 0.55],
            arms: () => ({rArm: armTo(cc, CL01_R, 1, {open: true, drop: 0.2, out: 0.12}), lArm: armTo(cc, CL01_L, -1, {open: true, drop: 0.2, out: 0.12})})});
          rec(pr, 'marcus', m);
          const w = camPoint(cc, CL01_R), u = camUnit(cc, CL01_R);
          if (w) paintRibbons(q, 35500, [w[0] - 0.05 * u, w[1] + 0.08 * u], [w[0] - 0.25 * u, w[1] - 0.6 * u], {w: 0.05 * u, op: 190, spread: 0.04 * u, count: 1, bow: -0.2, waves: 1.5, t, strength: 0.6});
        },
      });
      return;
    }
    // Draft fix B (user, 19 Nov 2026: "stepping down into the tub looks odd"; was a straight figure gliding down a ramp, its legs hidden to the
    // hem by the liquid fill). Now a step down from the rim: L52-L56 the right foot lifts, L56-L64 the body lowers on the bending left leg
    // (`footLift` keeps the left foot on the rim) while the straight right leg reaches down inside the wall and touches the liquid at L64
    // (squelch C13); L64-L76 the body moves in and sinks as the right foot goes to the floor; L68-L73 the left foot lifts off the rim, swings in
    // and touches the liquid at L73 (second ring), sinking to the floor by L77; arms out for balance L54-L80. Marcus is painted over the stall
    // (the old in-stall pass let the liquid fill hide him to the hem); the front wall is repainted over each leg once it is behind the wall.
    // the root (between the feet): over the rim's inner edge while the left foot is still on the rim (to L68), then into the tub
    const zAt = L < 56 ? RIM[2] : L < 68 ? lerp(RIM[2], STALL_Z1 - 0.1, ease(L, 56, 62)) : lerp(STALL_Z1 - 0.1, IN[2], ease(L, 68, 76));
    const yAt = L < 56 ? RIM[1] : L < 64 ? lerp(RIM[1], LIQUID, ease(L, 56, 64)) : lerp(LIQUID, IN[1], ease(L, 64, 76));
    const at: V3 = [RIM[0], yAt, zAt];
    const rLift = L >= 52 && L < 64 ? 0.12 * Math.sin(Math.PI * (L - 52) / 12) : 0;
    const e1 = ease(L, 68, 73), e2 = ease(L, 73, 77);
    const lFoot = L < 68 ? RIM[1] : L < 73 ? lerp(RIM[1], LIQUID, e1) + 0.07 * Math.sin(Math.PI * e1) : lerp(LIQUID, yAt, e2);
    const lLift = Math.max(0, lFoot - yAt);
    const bal = ease(L, 54, 60) * (1 - ease(L, 76, 82));
    // the rig card is upright and unforeshortened, so a world foot height is turned into the card's lift through the lens (px / unit at the root)
    const liftPx = (x: number, h: number) => {
      const g = camPoint(c, [x, yAt, zAt]), f = camPoint(c, [x, yAt + h, zAt]);
      return g && f ? Math.max(0, (g[1] - f[1]) / camUnit(c, at)) : h;
    };
    const fig = {def: MARCUS_BARE, at, facing: [0, -1] as [number, number], face: 'worried' as const, seed: 2622, t, noShadow: L >= 56,
      fig: {footLift: {r: liftPx(RIM[0] + 0.09, rLift), l: liftPx(RIM[0] - 0.09, lLift)}},
      arms: (_g: Pt, u: number, _v: unknown, an?: FigAnchors) => (bal > 0.01 ? balanceArms(an, u, bal) : {})};
    // the stall's front wall in front of a leg that has gone in behind it: its rim and front face repainted over that leg's width (the rim foot,
    // standing on top of the wall, is left uncovered until it lifts off)
    const wallOver = (q: Parameters<typeof wFill>[0], cc: YCam, x: number, seed: number) => {
      const x0 = x - 0.075, x1 = x + 0.075, col = tone(FL, PAL.stall);
      wFill(q, cc, seed, mixColor(col, '#3a2418', 0.12), qy(STALL_RIM, x0, x1, STALL_Z1 - 0.1, STALL_Z1));
      wFill(q, cc, seed + 3, mixColor(col, '#fff4dc', 0.05), qz(STALL_Z1, x0, x1, 0, STALL_RIM));
    };
    paintFullonica(p, c, FL, {
      noPoles: true,
      stallLiquidFrom: [STALL_Z0, STALL_Z0, STALL_Z0],
      // the squelch (C13): broken ripple rings widening round each foot as it enters (right L64, left L73), on the liquid (the near part of
      // each ring is behind the front wall from this lens, so the rings spread out from behind the rim)
      onLiquid: (q, cc, kk) => {
        if (kk !== 1) return;
        for (const [x0, f0] of [[RIM[0] + 0.09, 64], [RIM[0] - 0.09, 73]] as const) {
          const u = (L - f0) / 12;
          if (u < 0 || u > 1) continue;
          for (let r = 0; r < 2; r++) inkLine(q, 36300 + f0 + r, flatCircle(cc, [x0, LIQUID + 0.006, at[2] - 0.02], 0.08 + 0.2 * u + r * 0.08, 24), {closed: false, color: '#e3ead0', weight: 3 - r, still: true});
        }
      },
      room: (q, cc) => {
        rec(pr, 'marcus', act(q, cc, fig));
        if (L >= 56) wallOver(q, cc, RIM[0] + 0.09, 36400);
        if (L >= 68) wallOver(q, cc, RIM[0] - 0.09, 36420);
        sourceRibbons(q, cc, [-0.45, LIQUID + 0.01, -2.55], camPoint(cc, [-0.55, 1.0, -2.75]) ?? [300, 200], t, {n: 1, strength: 0.6, seed: 35520, bow: -0.2});
        sourceRibbons(q, cc, [0.05, LIQUID + 0.01, -2.55], camPoint(cc, [0.15, 1.0, -2.75]) ?? [800, 200], t, {n: 1, strength: 0.6, seed: 35540, bow: 0.2});
      },
    });
    if (pr) { const a = camPoint(c, [RIM[0] - 0.09, RIM[1], RIM[2]]), b = camPoint(c, [RIM[0] + 0.09, RIM[1], RIM[2]]); if (a && b) { pr.feetLX = Math.round(a[0]); pr.feetRX = Math.round(b[0]); pr.feetY = Math.round(a[1]); } }
  },
};
export const shot = makeShot(def);
