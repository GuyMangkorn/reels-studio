import {mixYCam, type YCam} from '../kit/ycam';
import {bandRamp, easeInOut, easeOut3, easeOutBack, paintPageP, paintPageShade, type PageState} from './b02-page';
import {BRIDGE_CAM0} from './bridge';

// EDU-EP32-SHORT B02-SH01 "the plan as a pop-up model" (timed sheet EDU-EP32-SHEET-R1, G [328, 436), 108 f; VD32-02, VD32-07, VD32-16, VD32-25;
// Boss G2, 2026-11-21). One plate EDU32-B02-SH01, Space D, paper. Page P slides in from screen right along the felt L0-L8 (eased, its shadow
// travelling with it); the pop-up cards rise from their fold lines in a snap ripple L4-L22; on "ให้แมว" (W354-W364) the cat card slides along its
// paper slot from (+1.3, 0.345, -0.3) onto the seat between the men L32-L46. Camera eases out from the entry key to the gate camera (VD32-25 =
// LF02 = `BRIDGE_CAM0`) by L100 and holds to the cut. Shot-local frame L = round(tl * 30).

export const B02SH01_N = 108;
const DEG = Math.PI / 180;
export const B02SH01 = {slide: [0, 8], slideFrom: 5.6, cat: [32, 46], catFrom: 1.3, camTo: 100, riseFrames: 8,
  /** Rise start frame per card (the ripple, L4-L22): left tree, bench (with the slot), FOREIGN AGENT, HANDLER, cat, right tree. */
  rise: {treeL: 4, bench: 6, fa: 8, hd: 10, cat: 12, treeR: 14}} as const;
export const B02SH01_CAM0: YCam = {x: 1.7, y: 1.15, z: 3.1, yaw: -31 * DEG, pitch: -18 * DEG, f: 1100, hy: 700};
/** L100 key = the gate camera (LF02, plate B03-SH01-PA at F0). */
export const B02SH01_CAM1: YCam = BRIDGE_CAM0;
export const b02sh01Cam = (L: number): YCam => (L >= B02SH01.camTo ? B02SH01_CAM1 : mixYCam(B02SH01_CAM0, B02SH01_CAM1, easeOut3(L / B02SH01.camTo)));
/** Page clock t = 2.0 + L / 30, positive from L0 (the kit blink hash misfires on a negative clock). LF02's t 1.2 is not kept: only blink and
 *  mouth phase differ at L100; the bench line, cards and camera are the gate frame's. */
export const b02sh01T = (L: number) => 2.0 + L / 30;

/** Page state at L: slide, the rise of each card, the cat on its slot. */
export const b02sh01State = (L: number): PageState => {
  const S = B02SH01, up = (from: number) => easeOutBack((L - from) / S.riseFrames);
  return {
    slide: S.slideFrom * (1 - easeOut3((L - S.slide[0]) / (S.slide[1] - S.slide[0]))),
    rise: {treeL: up(S.rise.treeL), bench: up(S.rise.bench), fa: up(S.rise.fa), hd: up(S.rise.hd), cat: up(S.rise.cat), treeR: up(S.rise.treeR)},
    catX: S.catFrom * (1 - easeInOut((L - S.cat[0]) / (S.cat[1] - S.cat[0]))),
  };
};

/** Caption-band shade (y 1230-1344) on the near page and felt: [picture row, opacity]. */
export const B02SH01_SHADE = {color: '#1c1820', steps: bandRamp(1110, 1340, 13, 19, 19)};

/** The B02-SH01 plate at shot frame L. */
export const paintB02SH01 = (p: import('../kit/painter').Painter, L: number, id = 'B02-SH01') => {
  const c = b02sh01Cam(L);
  paintPageP(p, c, id, b02sh01T(L), b02sh01State(L));
  paintPageShade(p, c, 37400, B02SH01_SHADE.color, B02SH01_SHADE.steps);
};
