import {paddleGrips, paintCanoeBack, paintCanoeFront, paintPaddle, seatGround, type CanoeOpts} from '../../kit/canoe';
import type {FigAnchors} from '../../kit/cast';
import type {Painter, Pt} from '../../kit/painter';
import type {ExpressionId} from '../../kit/expressions';
import {camPoint, camUnit, mixYCam, type YCam} from '../../kit/ycam';
import {drawMosquitoDot} from '../../kit/mosquito';
import {drawGirl, GIRL, girlPose, GIRL_POSES, paddleSitArms, sitHipV} from '../girl';
import {HippoInSet} from '../hippo-set';
import {b01sh02CanoeX, HIPPO_SHOTS, paintHippoFxBack, paintHippoFxFront, RIVER_HIPPO_KEY} from '../hippo-shots';
import {cam} from '../looks-cams';
import {mirrorCam, openT} from '../looks';
import {paintReflectionBreaks, paintRiverBack, RIVER} from '../river';
import {selfiePass, B0} from '../post-photo';
import {clamp, ease, k01, lerp, lerpArm, makeShot, outCubic, type Frame} from '../shotkit';
import type {Pass} from '../stack';

// EDU-EP18-SHORT river-set shots (Editor W5 draft): B01-SH01..SH05 (canoe, hippo), B02-SH01 (the selfie) and B02-SH03 (scrolling at the bank).

/** The paddler in the canoe (life vest) between the hull's back and front: `paintPaddler` of looks.tsx plus a head turn (`head`) and the paddle phase. Returns her anchors. */
const paddler = (p: Painter, c: YCam, o: CanoeOpts, phase: number, face: ExpressionId, seed: number, head?: 'left' | 'right', tilt = 0, girlLast = false): FigAnchors | null => {
  const anc = paintCanoeBack(p, c, {...o, seed: seed + 10});
  // girlLast (B01-SH04, camera on the keel line): the near hull wall runs on past the seat toward the bow, so painted after her it crossed her chin
  // (user, draft v1); painting it first keeps the bow behind her and she sits in the hull.
  if (girlLast) paintCanoeFront(p, c, {...o, seed: seed + 10});
  const def = GIRL['life-vest'], sg = seatGround(c, anc.seat, sitHipV(def, 'front')), grips = paddleGrips(o, anc.near, phase);
  let fig: FigAnchors | null = null;
  if (sg) {
    const top = camPoint(c, grips.top), lower = camPoint(c, grips.lower);
    const body = girlPose('paddle-sit', def, sg.g, sg.unit, 'front');
    const arms = top && lower ? paddleSitArms(def, sg.g, sg.unit, 'front', {top, lower}, anc.near) : {};
    fig = drawGirl(p, 'life-vest', sg.g, sg.unit, {...body, ...arms, ...(head ? {head} : {}), ...(tilt ? {headCock: tilt} : {})}, face, openT(seed + 40), seed + 40);
  }
  if (!girlLast) paintCanoeFront(p, c, {...o, seed: seed + 10});
  paintPaddle(p, c, grips, {waterY: o.at[1], seed: seed + 60, widthDir: anc.fwd});
  return fig;
};

type Stage = {cam: (L: number) => YCam; canoe: (L: number) => CanoeOpts; phase: (L: number) => number; face: (L: number) => ExpressionId; head?: (L: number) => 'left' | 'right' | undefined; hippo?: boolean; reflect?: boolean; girlLast?: boolean};
const river = (id: string, st: Stage) => makeShot(id, (L, G): Frame => {
  const c = st.cam(L), s = st.hippo === false ? null : HIPPO_SHOTS[id](L, G), canoe = st.canoe(L);
  const back: Pass = (p) => { paintRiverBack(p, c, {t: G / 30}); if (s) paintHippoFxBack(p, c, s); };
  const front: Pass = (p) => {
    if (s) paintHippoFxFront(p, c, s);
    if (st.reflect) {   // her reflection: the canoe and paddler seen by the mirror camera, flipped about the horizon (LF01 method)
      const yw = camPoint(c, canoe.at)?.[1] ?? 1100;
      p.brush.push(); p.brush.translate(0, 2 * c.hy); p.brush.scale(1, -1);
      paddler(p.layer(0.11, 4000), mirrorCam(c), canoe, st.phase(L), st.face(L), 820, st.head?.(L));
      p.brush.pop();
      paintReflectionBreaks(p, [60, yw + 6, 640, yw + 470], 70, 19400);
    }
    paddler(p, c, canoe, st.phase(L), st.face(L), 820, st.head?.(L), 0, st.girlLast);
  };
  const mid = s?.visible ? <HippoInSet cam={c} pose={s.pose} at={s.at} heading={s.heading} res={150} light={RIVER_HIPPO_KEY} /> : null;
  return {paper: RIVER.waterNear, back, front, mid};
});

// B01-SH01: bulge, head breaks L1, the yawn; V01 gasp L10; her smug grin L100-127, the paddle dips L112 (sheet; gasp-recoil is not in the kit pose set: she holds paddle-sit and the canoe rocks 1.5)
export const B01_SH01 = river('B01-SH01', {
  cam: (L) => { const a = cam([0.6, 0.7, -1.3], -18, 6.6, 1.0, 2100, 700), b = cam([0.6, 0.7, -1.3], -12, 6.0, 1.0, 2100, 700); return L <= 96 ? mixYCam(a, b, k01(L, 0, 96)) : cam([0.6, 0.7, -1.3], -12, 6.0 * (1 - 0.005 * (L - 96) / 31), 1.0, 2100, 700); },
  canoe: (L) => ({at: [0.05 * (L / 30), 0, 0], heading: 170, rock: 1.5 + (L >= 10 && L < 18 ? 2.5 * Math.sin(((L - 10) / 8) * Math.PI) : 0)}),
  phase: (L) => (L < 112 ? 0.32 : 0.32 + 0.25 * Math.sin(((L - 112) / 15) * Math.PI)),
  face: (L) => (L < 10 ? 'neutral' : L < 100 ? 'surprised' : 'smug'), reflect: true,
});
export const B01_SH02 = river('B01-SH02', {
  cam: (L) => cam([b01sh02CanoeX(L), 0.7, 0], 72 + 6 * k01(L, 0, 36), 3.0, 0.95, 1700, 760),
  canoe: (L) => ({at: [b01sh02CanoeX(L), 0, 0], heading: 90, rock: 1}),
  phase: (L) => (((L - 2) / 9) % 1 + 1) % 1, face: () => 'smug', head: () => 'right',
});
export const B01_SH03 = river('B01-SH03', {
  cam: (L) => cam([7.5, 0.55, -0.25], 82, 9.6 - 0.5 * k01(L, 0, 32, outCubic), 1.2, 2100, 740),
  canoe: (L) => ({at: [12 + 0.2 * (L / 30), 0, 0], heading: 90, rock: L < 22 ? 1 : 1 + 2 * clamp((L - 22) / 8)}),
  phase: () => 0.32, face: (L) => (L < 12 ? 'surprised' : 'shock'), head: () => 'left',
});
export const B01_SH04 = river('B01-SH04', {
  cam: (L) => { const e = k01(L, 0, 46); return cam([12.0, 0.84, 0], 90 + 8 * e, 1.3 - 0.15 * e, 0.95, 1100, 820); },
  canoe: (L) => ({at: [12.2, 0.02 * Math.sin(L / 5) * (1 - L / 46), 0], heading: 90, rock: 3 * (1 - clamp(L / 30)) * Math.cos(L / 3)}),
  phase: () => 0.32, face: (L) => (L < 16 ? 'shock' : L < 30 ? 'worried' : 'relieved'), hippo: false, girlLast: true,
});
export const B01_SH05 = river('B01-SH05', {
  cam: (L) => { const e = k01(L, 0, 56); return cam([12, 0, -2], 30 + 10 * e, 14 + 6 * e, 4 + 5 * e, 900, 700, {pitch: -12 - 10 * e}); },
  canoe: (L) => ({at: [13.5 + 0.8 * (L / 56), 0, 0], heading: 90, rock: 1}),
  phase: (L) => ((L / 14) % 1 + 1) % 1, face: () => 'relieved',
});

// ------------------------------------------------------------------------------------------------ B02-SH01 selfie (selfiePass of post-photo.tsx: the photo is the L29 frame of this shot)
export const B02_SH01 = makeShot('B02-SH01', (L, G): Frame => {
  const {c, s, back, front} = selfiePass(L);
  const flash = L >= 30 && L < 33 ? [1, 0.75, 0.4][L - 30] : 0;
  return {
    paper: RIVER.waterNear, back, front,
    mid: s.visible ? <HippoInSet cam={c} pose={s.pose} at={s.at} heading={s.heading} res={150} light={RIVER_HIPPO_KEY} /> : null,
    overlay: flash > 0 ? <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash}} /> : undefined,
  };
});

// ------------------------------------------------------------------------------------------------ B02-SH03 scrolling at the bank; the rule
const sh03Cam = (L: number): YCam => {
  const a = cam([59.6, 1.2, 14.5], 20, 2.4, 1.5, 1000, 600), b = cam([60.05, 1.35, 14.81], 12, 0.9, 1.55, 1000, 700, {pitch: -8});
  return mixYCam(a, b, L <= 80 ? 0.25 * k01(L, 0, 80) : 0.25 + 0.75 * k01(L, 80, 112));
};
export const B02_SH03 = makeShot('B02-SH03', (L, G): Frame => {
  const c = sh03Cam(L), s = HIPPO_SHOTS['B02-SH03'](L, G);
  const back: Pass = (p) => { paintRiverBack(p, c, {t: G / 30}); paintHippoFxBack(p, c, s); };
  const front: Pass = (p) => {
    paintHippoFxFront(p, c, s);
    const g = camPoint(c, B0), u = camUnit(c, B0), def = GIRL['travel-safari'];
    if (!g) return;
    const pose = girlPose('swat-neck', def, g, u, 'front'), hang = girlPose('frozen-hand', def, g, u, 'front');
    // left hand: hangs, swats the neck L22-30 (hand to the neck at L26, slap), then hangs again
    const sw = k01(L, 20, 26) * (1 - k01(L, 28, 34));
    pose.lArm = lerpArm(hang.lArm, pose.lArm, sw);
    drawGirl(p, 'travel-safari', g, u, pose, 'smug', openT(860), 860);
    // the dot (mosquito card at room scale: 5 px + 2 px trail) drifts past her left ear L2-28, x 600 -> 820 at y 520-540 on the start camera; it follows the camera ease
    if (L >= 2 && L <= 28) {
      const k = (L - 2) / 26, x = lerp(600, 820, k), y = 530 + 10 * Math.sin(k * 5) - 4 * k;
      drawMosquitoDot(p, 72100, [x, y], 5, [-1, 0.15], 2);
    }
  };
  return {paper: RIVER.waterNear, back, front, mid: s.visible ? <HippoInSet cam={c} pose={s.pose} at={s.at} heading={s.heading} res={150} light={RIVER_HIPPO_KEY} /> : null};
});
void ease; void GIRL_POSES; void (null as Pt | null);
