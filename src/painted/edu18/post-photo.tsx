import {Easing} from 'remotion';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import type {V3} from '../kit/space';
import {drawGirl, GIRL, girlPose, GIRL_POSES} from './girl';
import {HippoInSet} from './hippo-set';
import {HIPPO_SHOTS, paintHippoFxBack, paintHippoFxFront, RIVER_HIPPO_KEY} from './hippo-shots';
import {cam} from './looks-cams';
import {openT} from './looks';
import {paintRiverBack, RIVER} from './river';
import {PaintedStack, type Pass} from './stack';

// EDU-EP18-SHORT B02-SH01 selfie frame and the post photo (Boss W5, 16 Nov 2026; sheet item B6, brief Loading: "the frame at L29 is rendered
// once as the post photo"). `SelfieFrame` paints the sheet's B02-SH01 staging at shot-local frame L (river bank B0, GIRL `selfie-peace` +
// `happy` with the V by her cheek, hippo H4 eyes and ears behind her right shoulder, camera = her phone); the still `EDU18-POST-PHOTO` is its
// L29 frame (G326). The post shows a 1080 square of it from frame y POST_PHOTO_TOP (PostScreen photo slot), which keeps her head top in. The Editor's B02-SH01 shot should paint through
// `selfiePass` / `SelfieFrame` so the posted photo and the shot are the same picture.

export const B0: V3 = [60, 0.3, 14.5];
export const SELFIE_START = 297;
export const POST_PHOTO_L = 29;
/** Public path of the rendered post photo (store-filed; `store.py fetch` restores it). */
export const POST_PHOTO_SRC = 'edu18/post-photo-B02-SH01-L29.png';
const ease = Easing.inOut(Easing.sin);
/** Selfie lens (coordinator request, 16 Nov 2026: the hippo was a dot in the photo): held higher and tilted down (eye 1.8, pitch -14) with a
 *  longer lens at a longer reach (f 1050, r 0.87 -> 0.82), so the girl keeps about her old size while the near water and H4 rise above the lens arm. */
export const selfieCam = (L: number): YCam => { const e = ease(Math.min(1, Math.max(0, L / 30))); return cam([60, 1.8, 14.5], 6 * e, 0.87 - 0.05 * e, 1.8, 1050, 900, {pitch: -14}); };
/**
 * `lensArm` (default on: user, 16 Nov 2026): the photo is taken by the phone, so the phone cannot be in it. The right arm reaches
 * down-left toward the lens and leaves the frame (no phone drawn), which also clears the hippo's eyes behind her right shoulder.
 * `lensArm: false` = the original `selfie-peace` pose with the phone in hand (comparison only).
 */
export type SelfieOpts = {lensArm?: boolean};
export const LENS_ARM = {to: [-0.42, -0.3] as [number, number], via: [-0.2, -0.16] as [number, number], toCam: 0.7};
export const selfiePass = (L: number, o: SelfieOpts = {}) => {
  const c = selfieCam(L), s = HIPPO_SHOTS['B02-SH01'](L, SELFIE_START + L);
  const back: Pass = (p) => { paintRiverBack(p, c, {t: (SELFIE_START + L) / 30}); paintHippoFxBack(p, c, s); };
  const front: Pass = (p) => {
    paintHippoFxFront(p, c, s);
    const g = camPoint(c, B0), u = camUnit(c, B0), def = GIRL['travel-safari'];
    if (!g) return;
    const pose = girlPose('selfie-peace', def, g, u, 'front');
    if ((o.lensArm ?? true) && pose.rArm) {
      const sh = pose.rArm.to, base = GIRL_POSES['selfie-peace'].front!.r!.to;
      const s0: [number, number] = [sh[0] - base[0] * u, sh[1] + base[1] * u];   // her right shoulder, px
      pose.rArm = {to: [s0[0] + LENS_ARM.to[0] * u, s0[1] - LENS_ARM.to[1] * u], via: [s0[0] + LENS_ARM.via[0] * u, s0[1] - LENS_ARM.via[1] * u], toCam: LENS_ARM.toCam};
      pose.rHold = undefined;
    }
    drawGirl(p, 'travel-safari', g, u, pose, 'happy', openT(860), 860, {peace: true});
  };
  return {c, s, back, front};
};
export const SelfieFrame = ({L, guides = false, lensArm = true}: {L: number; guides?: boolean; lensArm?: boolean}) => {
  const {c, s, back, front} = selfiePass(L, {lensArm});
  return <PaintedStack paper={RIVER.waterNear} back={back} front={front} clock={SELFIE_START + L} guides={guides}
    mid={s.visible ? <HippoInSet cam={c} pose={s.pose} at={s.at} heading={s.heading} res={150} light={RIVER_HIPPO_KEY} /> : null} />;
};
export const PostPhoto = () => <SelfieFrame L={POST_PHOTO_L} />;
