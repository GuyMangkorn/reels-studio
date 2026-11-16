import {useLayoutEffect, useRef, type ReactNode} from 'react';
import {useCurrentFrame} from 'remotion';
import {paddleGrips, paintCanoeBack, paintCanoeFront, paintPaddle, seatGround, type CanoeOpts} from '../kit/canoe';
import type {FigAnchors} from '../kit/cast';
import {blinking} from '../kit/head';
import {mixColor, type Painter} from '../kit/painter';
import {poseArms, poseFor} from '../kit/poses';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {drawGirl, GIRL, girlPose, paddleSitArms, sitHipV} from './girl';
import {HippoInSet} from './hippo-set';
import {HIPPO3D_POSES} from './hippo3d-sdf';
import {drawHen, HENS, type HenDef} from './hen';
import {cLF01, cLF02, cLF02B, cLF03, cLF03B, cLF03L, cLF04, LF04_AZ, LF02B_P0, LF02B_SNAKE, LF03_LIE, LF03L_HIPS, hippoOrigin, LF01_CANOE, LF01_H1, LF01_HIPPO_HEADING, LF02_G0, LF02_HENS} from './looks-cams';
import {paintHippoWaterFront, paintReflectionBreaks, paintRiverBack, paintRiverForeground, RIVER} from './river';
import {paintLongShadow, paintPaddyBack, paintPaddyFront, PADDY, SUN_F} from './paddy';
import {BED, LAMP_BULB, paintBedroomBack, paintBedroomFloor, paintBlanket} from './bedroom';
import {MACRO, paintMacroField} from './macro';
import {PaintedStack, type Pass} from './stack';
import {drawCrowd, paintStadium, roofPoly, STADIUM} from './stadium';
import {buildMosquito, MOSQUITO_POSES} from '../kit/mosquito';
import {paintBeast} from '../survival/beast';
import {buildSnake, paintSnake} from '../kit/snake';
import {paintFigureShadow, paintVillageBack, paintVillageFront, VILLAGE} from './village';

// EDU-EP18-SHORT W3 finished look frames (Film, 16 Nov 2026; docs/sequence-workflow.md W3, brief EDU-EP18-BRIEF-R1 "Look frames"):
// LF01 river (B01-SH01 yawn peak, hippo look check in its set), LF02 village gate (B03-SH01 end), LF02B rice path (B04-SH02, snake),
// LF03 bedroom night (B05-SH01) + LF03L lamp-on (B06-SH01 end), LF03B mosquito macro (B05-SH03), LF04 stadium (B03-SH04 end, high angle). Cast: the user-approved comp cards
// (16 Nov 2026), unchanged: girl.ts, kit canoe/snake/mosquito, hippo3d v8 (WebGL layer between the painted passes, stack.tsx), dog.ts, hen.ts.
// Render: sh scripts/edu-series/ep18/short/render-looks.sh <version> [IDS]   (one Chrome, --gl=angle, scripts/stills.mjs)

/** A plate time at which a figure drawn with `seed` has its eyes open (drawFigure blinks on seed + 1). */
export const openT = (seed: number) => [0.4, 0.9, 1.4, 1.9, 2.4].find((t) => !blinking(t, seed + 1)) ?? 0.4;

/** Lead numbers of the last painted lead per look (in-page record for a probe; no effect on the picture). Measured values: build-notes EP18 W3. */
export const MEASURE: Record<string, Record<string, number>> = {};
const lead = (id: string, a: FigAnchors | null | undefined) => {
  if (a) MEASURE[id] = {leadTop: Math.round(a.top), leadBottom: Math.round(a.bottom), leadPx: Math.round(Math.min(1920, a.bottom) - Math.max(0, a.top)), headTop: Math.round(a.headTop), chin: Math.round(a.chin)};
};

/** The paddler in the canoe (life vest), painted between the hull's back and front; returns her anchors. */
export const paintPaddler = (p: Painter, c: YCam, o: CanoeOpts, phase: number, face: Parameters<typeof drawGirl>[5], seed: number) => {
  const anc = paintCanoeBack(p, c, {...o, seed: seed + 10});
  const def = GIRL['life-vest'];
  const sg = seatGround(c, anc.seat, sitHipV(def, 'front'));
  const grips = paddleGrips(o, anc.near, phase);
  let fig: FigAnchors | null = null;
  if (sg) {
    const top = camPoint(c, grips.top), lower = camPoint(c, grips.lower);
    const body = girlPose('paddle-sit', def, sg.g, sg.unit, 'front');
    const arms = top && lower ? paddleSitArms(def, sg.g, sg.unit, 'front', {top, lower}, anc.near) : {};
    fig = drawGirl(p, 'life-vest', sg.g, sg.unit, {...body, ...arms}, face, openT(seed + 40), seed + 40);
  }
  paintCanoeFront(p, c, {...o, seed: seed + 10});
  paintPaddle(p, c, grips, {waterY: o.at[1], seed: seed + 60, widthDir: anc.fwd});
  return fig;
};

// ------------------------------------------------------------------------------------------------ LF01 river, yawn peak
const H1_ORIGIN = hippoOrigin(LF01_H1, LF01_HIPPO_HEADING);
const RINGS = {at: LF01_H1, r: [1.1, 1.6, 2.2, 2.9]};
const LF01_T = 1.2;
const lf01Back: Pass = (p) => paintRiverBack(p, cLF01, {t: LF01_T, rings: RINGS});
const lf01Front: Pass = (p) => {
  const c = cLF01, canoe: CanoeOpts = {at: LF01_CANOE.at, heading: LF01_CANOE.heading, rock: 1.5};
  paintHippoWaterFront(p, c, LF01_H1, RINGS.r);
  // her reflection: the canoe and paddler seen by the mirror camera (eye below the water) and flipped about the horizon: exact at every depth
  const yw = camPoint(c, LF01_CANOE.at)?.[1] ?? 1100;
  p.brush.push(); p.brush.translate(0, 2 * c.hy); p.brush.scale(1, -1);
  paintPaddler(p.layer(0.17, 4000), mirrorCam(c), canoe, 0.32, 'surprised', 820);
  p.brush.pop();
  const hw = camPoint(c, LF01_H1);
  paintReflectionBreaks(p, [60, yw + 6, 640, yw + 470], 70, 19400);
  if (hw) paintReflectionBreaks(p, [hw[0] - 260, hw[1] + 8, hw[0] + 300, hw[1] + 420], 50, 19500);
  lead('LF01', paintPaddler(p, c, canoe, 0.32, 'surprised', 820));
  paintRiverForeground(p, c, [{at: [-0.5, 0, 2.6], r: 0.15, kind: 'lettuce', rot: 0.4}, {at: [-0.72, 0, 2.75], r: 0.1, kind: 'lettuce', rot: 1.2}, {at: [-0.95, 0, 2.2], r: 0.55, kind: 'stalk', rot: 0.5}]);
};
const hippoAt = (refl: boolean) => <HippoInSet cam={refl ? mirrorCam(cLF01) : cLF01} pose={HIPPO3D_POSES.yawn(0.55)} at={H1_ORIGIN} heading={LF01_HIPPO_HEADING} res={refl ? 110 : 160} />;
const LF01_HW = camPoint(cLF01, LF01_H1)?.[1] ?? 1030;
/** Mirror camera for reflections on water y 0: eye below the surface, pitch negated; paint through it and flip the picture about hy. */
export const mirrorCam = (c: YCam): YCam => ({...c, y: -c.y, pitch: -(c.pitch ?? 0)});
const LF01 = () => (
  <PaintedStack paper={RIVER.waterNear} back={lf01Back} front={lf01Front}
    mid={<>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0', transform: `matrix(1, 0, 0, -1, 0, ${2 * cLF01.hy})`, opacity: 0.3, filter: 'brightness(0.8) blur(1.5px)'}}>{hippoAt(true)}</div>
      {hippoAt(false)}
      <div style={{position: 'absolute', left: 0, width: 1080, top: LF01_HW - 46, height: 70, background: 'linear-gradient(rgba(233,220,203,0), rgba(233,220,203,0.32) 55%, rgba(233,220,203,0))'}} />
    </>} />
);

// ------------------------------------------------------------------------------------------------ LF02 village gate, B03-SH01 end
const lf02: Pass = (p) => {
  const c = cLF02;
  paintVillageBack(p, c);
  paintFigureShadow(p, c, LF02_G0, 1.64, 29950);
  const g = camPoint(c, LF02_G0), u = camUnit(c, LF02_G0), def = GIRL['travel-backpack'];
  if (g) lead('LF02', drawGirl(p, 'travel-backpack', g, u, {view: 'front', ...poseArms('P07', def, g, u)}, 'happy', openT(840), 840));
  paintVillageFront(p, c);
  [...LF02_HENS].sort((a, b) => b.at[2] - a.at[2]).forEach((h, i) => {
    const hg = camPoint(c, h.at);
    if (!hg) return;
    paintFigureShadow(p, c, h.at, 0.35, 29960 + i);
    drawHen(p, 760 + i * 7, inShade(HENS[h.id]), hg, camUnit(c, h.at), {view: h.view, state: h.state, peck: 0.45}, 1.0);
  });
};
/** A hen standing in the house's eave shadow: every colour toward the shadow tone (a glaze over the papercut hen does not reach it). */
const inShade = (d: HenDef): HenDef => ({...d, ...Object.fromEntries(Object.entries(d).filter(([, v]) => typeof v === 'string').map(([k, v]) => [k, mixColor(v as string, '#2a2030', 0.3)]))});
const LF02 = () => <PaintedStack paper={VILLAGE.yard} back={lf02} />;

// ------------------------------------------------------------------------------------------------ LF02B rice path, B04-SH02
const lf02b: Pass = (p) => {
  const c = cLF02B, t = 0.9;
  paintPaddyBack(p, c, {t});
  paintLongShadow(p, c, LF02B_P0, 1.64, 39950);
  const g = camPoint(c, LF02B_P0), u = camUnit(c, LF02B_P0), def = GIRL['travel-safari'];
  if (g) lead('LF02B', drawGirl(p, 'travel-safari', g, u, girlPose('step-freeze', def, g, u, 'front'), 'scared', openT(850), 850));
  paintSnake(p, c, buildSnake({headYaw: 0.6, lift: 0.15}), {...LF02B_SNAKE, seed: 71000, sun: SUN_F});
  paintPaddyFront(p, c);
};
const LF02B = () => <PaintedStack paper={PADDY.dirt} back={lf02b} />;

// ------------------------------------------------------------------------------------------------ LF03 bedroom night (B05-SH01), LF03L lamp-on (B06-SH01 end)
const lf03: Pass = (p) => {
  const c = cLF03;
  paintBedroomBack(p, c, {mode: 'night', t: 0.4});
  paintBedroomFloor(p, c, 'night');
  const g = camPoint(c, LF03_LIE), u = camUnit(c, LF03_LIE), def = GIRL['home-lounge-night'];
  if (g) lead('LF03', drawGirl(p, 'home-lounge-night', g, u, poseFor('P37', def, g, u, 'front'), 'sleepy', openT(873), 873));
  paintBlanket(p, c, -0.5, 0.85, -1.1, 0.78, 'night');
};
const LF03 = () => <PaintedStack paper={BED.night} back={lf03} grain={0.07} />;
const lf03l: Pass = (p) => {
  const c = cLF03L;
  paintBedroomBack(p, c, {mode: 'lamp', t: 1.0});
  const g = camPoint(c, LF03L_HIPS), u = camUnit(c, LF03L_HIPS), def = GIRL['home-lounge-night'];
  if (g) lead('LF03L', drawGirl(p, 'home-lounge-night', g, u, girlPose('sit-up-phone', def, g, u, 'front'), 'neutral', openT(870), 870));
};
const LAMP_PX = camPoint(cLF03L, LAMP_BULB) ?? [200, 900];
const FACE_PX = camPoint(cLF03L, [LF03L_HIPS[0], LF03L_HIPS[1] + 0.68, LF03L_HIPS[2]]) ?? [540, 700];
const LF03L = () => (
  <PaintedStack paper={BED.shadow} back={lf03l} grain={0.06} overlay={<>
    <div style={{position: 'absolute', inset: 0, mixBlendMode: 'screen', background: `radial-gradient(ellipse 1100px 950px at ${LAMP_PX[0]}px ${LAMP_PX[1]}px, rgba(255,214,150,0.5), rgba(255,207,138,0.22) 35%, rgba(255,207,138,0.06) 70%, rgba(255,207,138,0) 100%)`}} />
    <div style={{position: 'absolute', inset: 0, mixBlendMode: 'screen', background: `radial-gradient(ellipse 150px 170px at ${FACE_PX[0]}px ${FACE_PX[1] + 30}px, rgba(207,224,255,0.35), rgba(207,224,255,0) 100%)`}} />
  </>} />
);

// ------------------------------------------------------------------------------------------------ LF03B mosquito macro, B05-SH03
const lf03b: Pass = (p) => {
  const c = cLF03B;
  paintMacroField(p, 560, c.hy);
  paintBeast(p, c, buildMosquito(MOSQUITO_POSES.hover(0.3)), {at: [0, 0], heading: 0, ground: 0, seed: 72000});
};
const LF03B = () => <PaintedStack paper={MACRO.outer} back={lf03b} grain={0.08} />;

// ------------------------------------------------------------------------------------------------ LF04 stadium, B03-SH04 end (high angle)
const lf04: Pass = (p) => paintStadium(p, cLF04, LF04_AZ);
/** The dot crowd on a plain 2D canvas between the painted pass and the grain (stadium.ts drawCrowd; no brush polygons per seat). */
const CrowdLayer = () => {
  const ref = useRef<HTMLCanvasElement>(null), frame = useCurrentFrame();
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 1080, 1920);
    const st = drawCrowd(ctx, cLF04, {occluder: roofPoly(cLF04, LF04_AZ), az: LF04_AZ, frame});
    MEASURE.LF04 = {crowdDots: st.dots, crowdMs: st.ms};
  }, [frame]);
  return <canvas ref={ref} width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, filter: 'blur(0.35px)'}} />;
};
// the near foreground (plaza, ring road, near blocks) a touch darker and lower in contrast than the bowl (UT12a), as a smooth CSS glaze
const LF04 = () => <PaintedStack paper={STADIUM.haze} back={lf04} mid={<CrowdLayer />} grain={0.06}
  overlay={<div style={{position: 'absolute', left: 0, top: 1380, width: 1080, height: 540, background: 'linear-gradient(rgba(58,66,74,0), rgba(58,66,74,0.2) 60%, rgba(58,66,74,0.26))'}} />} />;

type Look = {C: () => ReactNode; shot: string; note: string};
export const LOOKS: Record<string, Look> = {
  LF01: {C: LF01, shot: 'B01-SH01 yawn peak', note: 'dawn river, the hippo yawning beside her left shoulder, she gasps; hippo look check in the set'},
  LF02B: {C: LF02B, shot: 'B04-SH02', note: 'golden path home: she freezes one step short of the snake lying across the bund; snake look check'},
  LF03: {C: LF03, shot: 'B05-SH01', note: 'home bed at night: fan, moonlight through the shutters, the net knotted up unused; she drifts off'},
  LF03L: {C: LF03L, shot: 'B06-SH01 end', note: 'lamp on: warm flood from the bedside lamp, she sits up with the phone, a cool glow on her face'},
  LF03B: {C: LF03B, shot: 'B05-SH03', note: 'placeless macro: the mosquito alone on black, rim-lit, wings a blur; mosquito look check'},
  LF04: {C: LF04, shot: 'B03-SH04 end', note: 'L08 size picture from high above: the whole bowl, every seat a still soft dot, flat cool overcast, no banners'},
  LF02: {C: LF02, shot: 'B03-SH01 end', note: 'home at last: she stops in the open gate and waves to the house, hens in the yard, a hot still afternoon'},
};
export const LOOK_IDS = Object.keys(LOOKS);
