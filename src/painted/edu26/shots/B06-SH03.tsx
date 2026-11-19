import {paintPalace, paintTable} from '../palace';
import {act, COIN_SCALE, layer} from '../r4-looks';
import {paintClavi, paintLaurel, TITUS, VESPASIAN} from '../r4-cast';
import {bodyFacing, paintedArms, pick3D, rigHands} from '../r4-hands';
import {BONE} from '../../kit/cast';
import {dot3, elbowIK, LANDMARKS, norm3} from '../../kit/hand-place';
import type {Occluder3D} from '../../kit/hand3d';
import {bodyDir} from '../../kit/mid-hands';
import {add3, sub3, type V3} from '../../kit/space';
import {makeShot, PALACE_PAPER, type Shot26} from '../shot';
import {coinAtNose, TITUS_AT, vespRig, VESP_AT, VESP_FACING} from '../palace26';
import {drift, ease, lerp3, rec, yc} from '../stage26';

// B06-SH03 · G [1648, 1753) · "ได้มาจากฉี่" (SHEET-R1 part B). Two-shot, retention drift. Titus (profile, `suspicious`) sniffs and shakes his head
// L2-L20 ("ลูกบอกไม่"); Vespasian grins with the coin still at Titus's nose and taps it with one finger at L82 (stressed syllable of
// "ได้มาจากฉี่", onset L78): UT14 exception, both of Vespasian's hands five-finger 3D (the coin pinch and the tapping index, its forearm drawn in
// the toga colour). Titus deflates L84-L100: `surprised` -> P03 arms crossed from L88 (W5.3, Film fix 4: crossed by L100, torso bend 0.05 = about 3
// degrees of slump, the head drops about 1.5 cm on top of the 2 cm `rise`).
const N = 105;
const CAM = yc(0.05, 1.45, 1.6, 0, -4, 950);
// Draft fix B (user, 19 Nov 2026: "detached from the arm, anatomy wrong, like a crippled arm"; replaces W5.3b `dropAt`). Vespasian's right
// (far) arm is one continuous chain every frame: shoulder S (rig), elbow solved two-bone at 1.04 x BONE per segment (fitArms limit 1.05),
// wrist, five-finger 3D hand (`handOnly`, no floating 3D forearm), painted toga arm to the exact 3D wrist (`exact`: the three-quarter turn
// no longer pulls its end off the wrist). The index tip rides one smooth path: from his hanging side (behind his torso, a depth occluder)
// up past his chest L66-L82 to the coin face (tap L82, the stressed syllable), held to L88, then swinging down and back to his side L88-L104,
// so Titus's crossed arms (P03) are clear by L100. The fingers point from his shoulder at the coin, so the wrist sits about 0.33 m out and
// the elbow bends down and out.
const VB = bodyFacing(VESPASIAN, VESP_AT, VESP_FACING), ARM = 1.04 * BONE * (VESPASIAN.armScale ?? 1);
const COIN = coinAtNose(), REST = vespRig(COIN).placed.right!;
const toBody = (w: V3): V3 => [dot3(w, VB.x), dot3(w, VB.y), dot3(w, VB.z)];
const TAP: V3 = [COIN[0] + 0.01, COIN[1] + 0.01, COIN[2] + 0.03]; // the index tip on the coin face, upper right, the hand in front of the pinch so the tap reads
const AIM = toBody(norm3(sub3(TAP, REST.S)));
const HANG_TIP: V3 = add3(REST.hand.wrist, [0, -0.15, 0.03]);
const UP_VIA: V3 = add3(lerp3(REST.S, TAP, 0.45), [0, -0.12, 0.12]), DOWN_VIA: V3 = add3(lerp3(REST.S, TAP, 0.4), [0.04, -0.28, 0.1]);
// elbow down and forward of his chest at the tap (body frame: x his right, z his facing); hanging it starts from the kit's back-out pole
const ELBOW_POLE: V3 = [-0.1, -1, 0.5];
const bez = (a: V3, m: V3, b: V3, k: number): V3 => lerp3(lerp3(a, m, k), lerp3(m, b, k), k);
/** The index tip target and the blend `k` (0 = hanging, 1 = on the coin face). */
const tapPath = (L: number): {tip: V3; k: number} | null => {
  if (L < 66) return null;
  if (L < 82) { const k = ease(L, 66, 82); return {tip: bez(HANG_TIP, UP_VIA, TAP, k), k}; }
  if (L < 88) return {tip: TAP, k: 1};
  const k = 1 - ease(L, 88, 104);
  return {tip: bez(HANG_TIP, DOWN_VIA, TAP, k), k};
};
const rig = (L: number) => {
  const a = vespRig(COIN), tp = tapPath(L);
  if (!tp) return a;
  const f = norm3(lerp3([0, -1, 0.06], AIM, tp.k)), b = norm3(lerp3([0.85, 0, 0.5], [0, 1, 0], tp.k));
  const r = rigHands(VB, {left: {gesture: 'pinch', put: {landmark: LANDMARKS.pinch, at: [COIN[0], COIN[1] - 0.012 * COIN_SCALE * 2.3, COIN[2]]}, f: [0.1, 1, 0.1], b: [-0.5, 0, -1]},
    right: {gesture: 'point', put: {landmark: LANDMARKS.indexTip, at: tp.tip}, f, b}}, 42000,
    {coin: 'left', coinScale: COIN_SCALE, coinFace: [0, 0, 1], coinLift: 2.3, pole: {left: [0.2, -1, 0.5]}});
  const q = r.placed.right!;
  q.E = elbowIK(q.S, q.hand.wrist, bodyDir(VB, lerp3([0.6, -1, -0.35], ELBOW_POLE, tp.k)), ARM, ARM);
  return r;
};
// the depth stand-in for Vespasian's torso: the right hand and forearm hide behind it while they hang at his far side
const TORSO: Occluder3D = {frame: {o: add3(VESP_AT, [0, 0.9, 0]), x: VB.x, y: VB.y, z: VB.z}, half: [0.17, 0.33, 0.12], shape: 'ellipsoid'};
export const def: Shot26 = {
  id: 'B06-SH03', N, paper: PALACE_PAPER,
  cam: (L) => drift(CAM, L),
  paint: (p, L, c, pr) => {
    const t = L / 30, r = rig(L), shake = L >= 2 && L < 20 ? Math.sin((L - 2) / 18 * Math.PI * 4) : 0, deflate = ease(L, 84, 100);
    paintPalace(p, c, {mood: 'lamp'}, (q, cc) => {
      paintTable(q, cc, {mood: 'lamp'});
      rec(pr, 'titus', act(q, cc, {def: TITUS, at: TITUS_AT, facing: [1, 0], face: L < 84 ? 'suspicious' : deflate < 0.3 ? 'surprised' : 'sad', seed: 2641, t,
        look: [0.6 * shake, 0], pose: deflate > 0.25 ? 'P03' : 'P01', fig: {headCock: 5 * shake, rise: -0.02 * deflate, bend: 0.05 * deflate, nod: [0, 0.07 * deflate]}, held: (qq, a, u) => paintClavi(qq, a, 'right', u, 34500)}));
      rec(pr, 'vesp', act(q, cc, {def: VESPASIAN, at: VESP_AT, facing: VESP_FACING, face: L >= 76 ? 'laugh' : 'smug', seed: 2642, t,
        arms: () => paintedArms(cc, r, {noHand: ['left', 'right'], exact: ['left', 'right']}), held: (qq, a) => paintLaurel(qq, a, 'front', 34600)}));
    });
  },
  hands: (L, c) => [{...layer(c, pick3D(rig(L), tapPath(L) ? ['left', 'right'] : ['left'], 'left')), occluders: [TORSO]}],
};
export const shot = makeShot(def);
