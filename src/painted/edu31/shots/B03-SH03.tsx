import {elbowIK, LANDMARKS, specHand, toneFromSkin} from '../../kit/hand-place';
import {frameOf} from '../../kit/hand-props';
import type {V3} from '../../kit/space';
import {camPoint} from '../../kit/ycam';
import {wFill, qy} from '../../kit/world';
import {KITCHEN_PAPER} from '../kitchen31';
import {paintInstantPrint, PRINT} from '../props31';
import {WHEELER} from '../set31';
import {makeShot, type Shot31} from '../shot';
import {camOf, ez} from '../stage31';

// B03-SH03 · F [740, 803) · POV: the print develops to nothing (SCENE-R1 b03, VD31-13). His eyes look +z down at the `new: instant-print` held
// face up at (0, 1.0, -0.35); three flaps (L3, L11, L19; 4 f each, about 25 px) and the image develops from dark olive-brown to a pale flat
// grey-beige wash by L38, then holds. No figure, no room in the print. POV hands are five-finger 3D hands (hand-drawing 4): `pinch` on the two
// bottom corners, thumbs on the face, his RIGHT hand on screen right (the camera looks +z, so screen right is world -x); teal jacket sleeves.
// The shoulders sit 0.23 m under and just behind the eyes; elbows bend down and out (arm chain solved by elbowIK, bones 0.29 / 0.26).
const N = 63, SHOT = 'B03-SH03';
const CAM = () => camOf({eye: [0, 1.15, -0.62], yaw: 180, pitch: -35, f: 1400, hy: 700, near: 0.03});
const C0: V3 = [0, 1.0, -0.35];
const UP: V3 = [0, Math.cos(35 * Math.PI / 180), Math.sin(35 * Math.PI / 180)];
const NORMAL: V3 = [0, UP[2], -UP[1]]; // face toward the eyes
/** Flap offset (m along the print's up) at frame L: one 4-frame down-up flap at L3, L11, L19. */
const flapAt = (L: number) => { for (const s of [3, 11, 19]) if (L >= s && L < s + 4) return -0.0055 * Math.sin(((L - s) / 4) * 2 * Math.PI); return 0; };
const printFrame = (L: number) => { const k = flapAt(L); return frameOf([C0[0], C0[1] + UP[1] * k, C0[2] + UP[2] * k], UP, NORMAL); };
const TONE = toneFromSkin(WHEELER.head.skin, '#2c8a88');

export const def: Shot31 = {
  id: SHOT, N, paper: KITCHEN_PAPER, vignette: 0.55,
  cam: CAM,
  hands: (L) => {
    const f = printFrame(L), {w, h} = PRINT;
    return [{arms: ([['right', -1], ['left', 1]] as const).map(([side, sx]) => {
      // corner pinch on the wide bottom border: fingers point up the print, back of the hand outward and toward the eyes (thumb on the face)
      const corner: V3 = [f.o[0] + sx * (w / 2 - 0.004) - f.y[0] * (h / 2 - 0.006), f.o[1] - f.y[1] * (h / 2 - 0.006), f.o[2] - f.y[2] * (h / 2 - 0.006)];
      const hand = specHand({gesture: 'pinch', side, forward: [-sx * 0.25, UP[1], UP[2]], back: [sx * 0.8, NORMAL[1] * 0.6, NORMAL[2] * 0.6], put: {landmark: LANDMARKS.pinch, at: corner}, size: 0.95, tone: TONE, base: 3710 + (sx > 0 ? 40 : 0)});
      const S: V3 = [sx * 0.19, 0.92, -0.66];
      return {hand, elbow: elbowIK(S, hand.wrist, [sx * 0.6, -0.8, 0.1]), shoulder: S, sleeve: '#2c8a88', cuff: 0.55};
    })}];
  },
  paint: (p, L, c, pr) => {
    // the oilcloth far below, out of focus: a warm dark field under the lamp
    wFill(p, c, 37400, '#5a4632', qy(0.681, -0.5, 0.5, -0.3, 0.3));
    const f = printFrame(L);
    paintInstantPrint(p, c, 37410, f, ez(L, 0, 38));
    if (pr) {
      const {w, h} = PRINT, tl = camPoint(c, [f.o[0] + w / 2 + f.y[0] * h / 2, f.o[1] + f.y[1] * h / 2, f.o[2] + f.y[2] * h / 2]), br = camPoint(c, [f.o[0] - w / 2, f.o[1] - f.y[1] * h / 2, f.o[2] - f.y[2] * h / 2]);
      if (tl && br) pr.lead('PRINT', {top: tl[1], bottom: br[1], left: tl[0], right: br[0], x: (tl[0] + br[0]) / 2});
    }
  },
};
export const shot = makeShot(def);
