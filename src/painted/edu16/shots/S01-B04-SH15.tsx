import {mixColor, type Pt} from '../../kit/painter';
import {beadAt, ease, easeOut, mix, ramp} from '../clock';
import {paintMonster} from '../monster';
import {TH} from '../palette';
import {paintFarGlow, SH15, thCam} from '../scenes';
import {makeShot} from '../shot';
import {withStage} from '../stage';
import {paintBead, paintFrameRim, paintLight, paintThread, paintVoid, threadAt} from '../thought';

// S01-B04-SH15 L10 IM3 giant [959, 1073) (sheet #15; cut in from SH14). End staging = the W3 SH15-END still (`SH15`): her light (300, 1130), far glow
// (640, 360) r 820, bead on the shared clock (0.40 at f1073, D7). Camera: the picture stage dollies back 1.12 -> 1.00 about her light +42..+97 while
// the star dust tilts thCam(0.05, 0.17 -> 0.45 rad); hold +97..+113. Keys: +2..+46 the tiny far light (their round light, r 29) holds; +56..+88 it swells
// into the vast cold glow (never dims after); +62..+93 the monster rises out of it (fades in from the void as a shadow; its near arm held at chest height, claws above the band while C13 shows), head leaving the top of frame;
// +78..+97 its shadow runs down the thread to just ahead of the bead and the near arm lifts up and over her light (the SH15-END wind-up), held +97..+113.
const H = SH15.hers, F = SH15.glow;
export const shot = makeShot('S01-B04-SH15', {
  paper: TH.void,
  paint: (p, L, G) => {
    const t = 0.4 + G / 30, dolly = ease(L, 42, 97), swell = ease(L, 56, 88), rise = easeOut(L, 62, 93), arm = ease(L, 78, 97), b = beadAt(G);
    paintVoid(p, {cam: thCam(0.05, 0.17 + 0.28 * dolly), t, diag: [H, F]});
    withStage(p, H, 1.12 - 0.12 * dolly, [0, 0], () => {
      if (L >= 56) paintFarGlow(p, F, mix(60, 820, swell));
      paintLight(p, {at: F, r: 29, kind: 'theirs', t, level: 1 - ramp(L, 56, 73)});
      paintThread(p, {a: H, b: F, shadowFrom: mix(1, b + 0.02, arm)});
      paintLight(p, {at: H, r: 58, kind: 'hers', t});
      paintBead(p, threadAt(H, F, b), mix(1, 0.75, arm));
      const lv = ramp(L, 62, 78);
      if (lv <= 0) return;
      const base: Pt = [910, 1100 + 900 * (1 - rise)];
      paintMonster(p, {base, h: 1250, facing: -1, lean: 0, keystone: 0.12, reachTo: [mix(330, 214, arm), mix(1050, 700, arm)], elbow: -1, aim: mix(0.6, 1.2, arm),
        hangTo: [960, base[1] + 110], rim: TH.amber, rimDir: [-0.45, 1], rimW: 3.5, rimAll: mixColor(TH.coldMid, TH.cold, 0.5), eyeColor: TH.cold, eyeCount: 6, level: lv, fadeTo: TH.voidLift, seed: 47200, t});
    });
    paintFrameRim(p, {t});
  },
});
