import {mittenThumbSide} from '../../kit/hand-gestures';
import type {Pt} from '../../kit/painter';
import type {V3} from '../../kit/space';
import {camUnit} from '../../kit/ycam';
import {paintSorted} from '../../kit/world';
import {lemonHalfSide, starGlint} from '../props31';
import {bankFurniture, paintBankShell, WHEELER} from '../set31';
import {makeShot, type Shot31} from '../shot';
import {camMove, dryAnchors, fig, hump, keysAt, mix, poseShoulder, reachArm} from '../stage31';

// B01-SH03 · F [175, 233) · ECU: the reason (SCENE-R1 b01). Front in K2, head still, `smug`; `new: lemon-pat`: his RIGHT mitten (screen left)
// brings a cut lemon half up from below frame (L8-16) and pats his right cheek above the beard: contact L17 (F192, "น้ำมะนาว") and L25, then holds;
// a 4-point star glint on the wet cheek L33-39 (F208, "หน้า"). Push 0.08 m. The mitten stays a mitten (close shot, figure scale: fingers do not
// carry this beat; hand-drawing 4).
const N = 58, SHOT = 'B01-SH03';
const CAM = camMove({eye: [1.05, 1.58, 2.15], yaw: 0, pitch: 0, f: 950, hy: 620}, {eye: [1.05, 1.58, 2.07], yaw: 0, pitch: 0, f: 950, hy: 620}, 0, N - 1);
const W: V3 = [1.0, 0, 1.2];
/** Hand travel 0..1 (below frame -> cheek), with the second pat's small pull back (L19-24). */
const patAt = (L: number) => keysAt(L, [[8, 0], [16.5, 1], [19, 1], [21.5, 0.82], [24.5, 1]]);

export const def: Shot31 = {
  id: SHOT, N, paper: '#e7d8bf', vignette: 0.35,
  cam: CAM,
  paint: (p, L, c, pr) => {
    const t = L / 30, u = camUnit(c, W);
    paintBankShell(p, c, {k2: true});
    const base = {at: W, view: 'front' as const, face: 'smug' as const, seed: 3101, t, faceState: {look: [0.05, 0] as Pt}};
    const a0 = dryAnchors(WHEELER, c, base)!;
    const hr = (a0.chin - a0.headTop) / 2;
    const cheek: Pt = [a0.head[0] - 0.62 * hr, a0.head[1] + 0.18 * hr];
    const sh = poseShoulder(WHEELER, c, W, 'P01', 'front', 'r');
    const below: Pt = [cheek[0] - 0.05 * u, 2100];
    const k = patAt(L), hand: Pt = [mix(below[0], cheek[0] - 0.035 * u, k), mix(below[1], cheek[1] + 0.07 * u, k)];
    const rA = reachArm(sh, hand, u, -1, {fist: mittenThumbSide('right', 'back'), fore: 0.6});
    let cheekPt: Pt = cheek;
    paintSorted(p, c, [
      ...bankFurniture({k2: true}),
      fig(WHEELER, {...base, fig: {rArm: rA.arm}, held: (q, a) => {
        // the lemon half, cut face pressed to the cheek (toward screen right), squashing a little on contact
        const contact = k > 0.97 ? 1 : 0;
        lemonHalfSide(q, 37600, a.rHand[0] + 0.045 * u, a.rHand[1] - 0.06 * u, 0.05 * u, 0, 0.5 * contact);
        cheekPt = [a.rHand[0] + 0.075 * u, a.rHand[1] - 0.09 * u];
      }}),
    ]);
    starGlint(p, 37620, cheekPt[0] + 0.02 * u, cheekPt[1] - 0.035 * u, 90, hump(L, 32, 40));
    if (pr) { pr.lead('HEAD', {top: a0.headTop, bottom: a0.chin, x: a0.head[0]}); pr.lead('ARM-R', {top: rA.ratio, bottom: 0}); pr.lead('PAT', {top: cheekPt[1], bottom: cheekPt[1], x: cheekPt[0]}); }
  },
};
export const shot = makeShot(def);
