import type {Arm} from './cast';
import {hardFill, inkLine, openHandParts} from './draw';
import {mittenThumbSide} from './hand-gestures';
import type {Painter, Pt} from './painter';

// Pose helper filed from EDU-EP31-SHORT (KIT-P01 intake, W8.4, 21 Nov 2026): `whisper-cup`, the cupped hand beside the mouth of a profile
// figure (B02-SH01 FRIEND, R5 anatomy repaint after the user's note "check the anatomy of the friend who whispers"). A copy of the constants
// and the open-hand paint in src/painted/edu31/shots/B02-SH01.tsx (and looks.ts LF03), which keep their own code. Like `motions-edu19.ts`
// this is a pose helper, not a `POSES` id: the shot passes the arm to `fig.rArm` / `fig.lArm` and paints the hand in `held`.
// Casting line: `<person>, P31 + near arm whisper-cup, face whisper` (profile view, near arm; seated or standing).

/** Near-arm targets from the profile shoulder in metres (forward toward the face, up): elbow forward and low, open hand beside the mouth. */
export const WHISPER_CUP = {elbow: [0.15, -0.1] as const, hand: [0.18, 0.1] as const};

/** The whisper-cup arm from the drawn shoulder `sh` (px, `shoulderPoint` of the near side) at `u` px per metre, for a figure in `view`
 *  `right` (faces screen right; the EP31 friend) or `left` (mirrored). `noHand`: paint the hand with `paintWhisperHand`. */
export const whisperCupArm = (sh: Pt, u: number, view: 'right' | 'left' = 'right'): Arm => {
  const s = view === 'right' ? 1 : -1;
  return {to: [sh[0] + s * WHISPER_CUP.hand[0] * u, sh[1] - WHISPER_CUP.hand[1] * u], via: [sh[0] + s * WHISPER_CUP.elbow[0] * u, sh[1] - WHISPER_CUP.elbow[1] * u], noHand: true};
};

/** The open hand at the arm's end (`hand` px, the anchors' `rHand` / `lHand`), fingers up, back of the hand to the camera, thumb toward the
 *  face (hand-drawing thumb rule: `mittenThumbSide(side, 'back')`). EP31 used skin = the wearer's `head.skin`, ink '#3a2216', seed 32520. */
export const paintWhisperHand = (q: Painter, hand: Pt, u: number, skin: string, seed: number, side: 'right' | 'left' = 'right', ink = '#3a2216') => {
  const ang = side === 'right' ? -Math.PI / 2 + 0.35 : -Math.PI / 2 - 0.35;
  const h = openHandParts([hand[0], hand[1]], ang, u * 1.1, mittenThumbSide(side, 'back'));
  hardFill(q, seed, skin, h.palm);
  inkLine(q, seed + 1, h.palm, {closed: true, weight: 0.9, color: ink});
  inkLine(q, seed + 2, h.thumbCrease, {weight: 0.7, color: ink});
  h.creases.forEach((cr, i) => inkLine(q, seed + 3 + i, cr, {weight: 0.6, color: ink}));
};
