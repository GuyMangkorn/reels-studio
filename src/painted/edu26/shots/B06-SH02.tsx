import type {V3} from '../../kit/space';
import {paintPalace, paintTable} from '../palace';
import {act, COIN_SCALE, layer, PC} from '../r4-looks';
import {camPoint, camUnit} from '../../kit/ycam';
import {paintClavi, paintLaurel, TITUS, VESPASIAN} from '../r4-cast';
import {paintedArms, pick3D} from '../r4-hands';
import {makeShot, PALACE_PAPER, type Shot26} from '../shot';
import {coinTravel, TITUS_AT, titusNose, vespRig, VESP_AT, VESP_FACING} from '../palace26';
import {walkBetween} from '../acts26';
import {camKeys, ease, lerp3, rec, yc} from '../stage26';

// B06-SH02 · G [1550, 1648) · the coin at Titus's nose, LF06 / CL03 mirror (SHEET-R1 part B). Two-shot (TH-IA) easing to the LF06 camera by L40,
// held. Titus enters from screen left complaining (`disgusted`, P06 shrug) to (-0.40, 0, +0.30) by L22, then profile facing +x; Vespasian rises
// from the table edge and steps to (0.16, 0, +0.24) by L16 and brings the coin to 6 cm ahead of Titus's nose by L22 (hold). UT14 exception:
// Vespasian's near (left) pinch is the five-finger 3D hand with the 3D coin (painted arm to the wrist); every other hand a mitten. Titus's
// nostril lean at L79 ("เหม็นไหม").
// W5.2 deviation: the sheet's start mark (0.16, 0, -0.20) is inside the table (x -0.6..0.6, z -0.45..0); he starts at its front edge (0.16, 0, +0.02).
const N = 98;
const C0 = yc(0, 1.42, 2.9, 0, -3, 950, 880);
const T0: V3 = [-1.5, 0, 0.3], V0: V3 = [0.16, 0, 0.02];
export const reachAt = (L: number) => ease(L, 12, 22);
const rig = (L: number) => vespRig(coinTravel(reachAt(L)), {at: lerp3(V0, VESP_AT, ease(L, 2, 16))});
export const def: Shot26 = {
  id: 'B06-SH02', N, paper: PALACE_PAPER,
  cam: (L) => camKeys([[0, C0], [40, PC.LF06]], L),
  paint: (p, L, c, pr) => {
    const t = L / 30, tw = walkBetween(L, 0, 22, T0, TITUS_AT), vAt = lerp3(V0, VESP_AT, ease(L, 2, 16)), r = rig(L), lean = ease(L, 76, 82);
    paintPalace(p, c, {mood: 'lamp'}, (q, cc) => {
      paintTable(q, cc, {mood: 'lamp'});
      rec(pr, 'titus', act(q, cc, {def: TITUS, at: tw.at, facing: L < 22 ? [1, 0.2] : [1, 0], face: 'disgusted', seed: 2641, t, pose: L < 26 ? 'P06' : 'P01',
        fig: {...(tw.walk !== undefined ? {walk: tw.walk, stride: tw.stride} : {}), lean: 0.1 * lean}, held: (qq, a, u) => paintClavi(qq, a, 'right', u, 34500)}));
      rec(pr, 'vesp', act(q, cc, {def: VESPASIAN, at: vAt, facing: VESP_FACING, face: 'smug', seed: 2642, t, fig: {crouch: 0.35 * (1 - ease(L, 0, 10))},
        arms: () => paintedArms(cc, r, {noHand: ['left']}), held: (qq, a) => paintLaurel(qq, a, 'front', 34600)}));
    });
    const n = camPoint(c, titusNose()), k = camPoint(c, coinTravel(reachAt(L)));
    if (pr && n && k) Object.assign(pr, {noseX: Math.round(n[0]), noseY: Math.round(n[1]), coinX: Math.round(k[0]), coinY: Math.round(k[1]), coinPx: Math.round(0.024 * COIN_SCALE * camUnit(c, coinTravel(reachAt(L))))});
  },
  hands: (L, c) => [layer(c, pick3D(rig(L), ['left'], 'left'))],
};
export const shot = makeShot(def);
