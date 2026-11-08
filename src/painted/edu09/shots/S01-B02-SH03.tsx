import {macroHand, paintHandMacro} from '../../kit/hands';
import {BOY_WRIST, boyHand, paintHandTable} from '../handclose';
import {ELDER_TONE} from '../palette';
import {CloseOverlay, camAt, lookMove, makeShot} from '../stage';

// S01-B02-SH03 (G 511-622) two hands, not weakness (L05). cam: (-15, 1.5, 3)->(-4, 1.5, 2), yaw 0, r 44->30, eye 36->27, f 1250, hy 650, ease [0.2, 1.0].
// BOY's left TP at the origin; ELDER's right TP at (-30, 0, 4) mirrored (thumb toward -x), size 1.25 with his cardigan sleeve; both rings flat with a faint tremble.
const N = 111, move = lookMove([[-15, 1.5, 3], [-4, 1.5, 2]], 0, [44, 30], [36, 27], {f: 1250, hy: 650, ease: [0.2, 1.0]}), cam = (L: number) => camAt(move, L, N);
const S = 1.25, OX = -30, OZ = 4;
const elderHand = () => macroHand('test-fold-middle', {side: 1, size: S, unit: 1, base: 1300, tone: ELDER_TONE, plane: 0, at: [OX - BOY_WRIST[0] * S, OZ + BOY_WRIST[1] * S], elbow: [OX - 0.6 * S, 3.0 * S, OZ + 30 * S],
  shadowDir: [-0.14, -0.9, 0.11], shadowAlpha: 0.34, shadowColor: '#3a2212', sleeve: {to: [OX - 0.6 * S, 3.0 * S, OZ + 30 * S], color: ELDER_TONE.sleeve, shade: ELDER_TONE.sleeveShade, cuff: 0.14}, tremble: {finger: 'ring', amp: 0.04, hz: 9}});
export const shot = makeShot('S01-B02-SH03', {
  paper: '#e8dfcc',
  paint: (p, L) => {
    const c = cam(L); paintHandTable(p, c);
    paintHandMacro(p, c, elderHand());
    paintHandMacro(p, c, boyHand('test-fold-middle', {tremble: {finger: 'ring', amp: 0.04, hz: 10}}));
  },
  overlay: (L) => <CloseOverlay cam={cam(L)} />,
});
