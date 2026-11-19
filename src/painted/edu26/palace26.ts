import {LANDMARKS} from '../kit/hand-place';
import type {V3} from '../kit/space';
import {COIN_SCALE, TITUS_AT, TITUS_FACING, VESP_AT, VESP_FACING} from './r4-looks';
import {R4, TITUS, VESPASIAN} from './r4-cast';
import {bodyFacing, facePoint, HANG, rigHands, type MidHandSpec} from './r4-hands';
import {lerp3} from './stage26';

// EDU-EP26-SHORT imperial room hand rigs shared by B06-SH02, B06-SH03 and B06-SH04 (Boss W5.2, 2026-11-18): the LF06 rig (r4-looks.ts
// `palaceRigs`, approved) with the coin's travel `reach` 0..1 from Vespasian's chest to 6 cm ahead of Titus's nose, and Vespasian's tapping
// right hand (B06-SH03, five-finger 3D with its forearm drawn in the toga colour: the far arm's painted forearm hides behind his body in
// this 3/4 view, R5). No Remotion import.

export {TITUS_AT, VESP_AT, VESP_FACING};
export const titusBody = (at: V3 = TITUS_AT) => bodyFacing(TITUS, at, TITUS_FACING(true));
export const titusNose = (at: V3 = TITUS_AT) => facePoint(titusBody(at), 0.13, -0.035);
/** The coin at Titus's nose (LF06): 6 cm ahead along his facing. */
export const coinAtNose = (at: V3 = TITUS_AT): V3 => { const b = titusBody(at), n = titusNose(at); return [n[0] + b.z[0] * 0.06, n[1], n[2] + b.z[2] * 0.06]; };
/** Vespasian's coin held at his own chest (B06-SH02 start, B06-SH04 insert estimate (0.00, 1.36, 0.42) from the sheet). */
export const COIN_CHEST: V3 = [0.0, 1.36, 0.42];
const pinchAt = (coin: V3): MidHandSpec => ({gesture: 'pinch', put: {landmark: LANDMARKS.pinch, at: [coin[0], coin[1] - 0.012 * COIN_SCALE * 2.3, coin[2]]}, f: [0.1, 1, 0.1], b: [-0.5, 0, -1]});
/** Vespasian's rig: the coin pinch (left) at `coin`, the right hand hanging or tapping the coin face (`tap` 0..1 approach, 1 = fingertip on it). */
export const vespRig = (coin: V3, o: {at?: V3; tap?: number} = {}) => {
  const tap = o.tap ?? 0, right: MidHandSpec = tap > 0
    ? {gesture: 'point', put: {landmark: LANDMARKS.indexTip, at: lerp3([coin[0] + 0.12, coin[1] - 0.12, coin[2] + 0.1], [coin[0] + 0.004, coin[1], coin[2] + 0.012], tap)}, f: [-0.6, 0.3, -0.5], b: [0, 1, 0]}
    : HANG;
  return rigHands(bodyFacing(VESPASIAN, o.at ?? VESP_AT, VESP_FACING), {left: pinchAt(coin), right}, 42000,
    {coin: 'left', coinScale: COIN_SCALE, coinFace: [0, 0, 1], coinLift: 2.3, pole: {left: [0.2, -1, 0.5]}, ...(tap > 0 ? {forearm: {right: R4.toga}} : {})});
};
export const coinTravel = (reach: number, at: V3 = TITUS_AT) => lerp3(COIN_CHEST, coinAtNose(at), reach);
