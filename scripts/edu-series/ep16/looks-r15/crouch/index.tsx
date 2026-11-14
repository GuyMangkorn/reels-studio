// EDU-EP16 R1.5b crouch probe (Boss, 14 Nov 2026): Keng P35 crouch_hide at several world facings, with and without the waterline sheet, real 16C/16D lens.
//   sh scripts/edu-series/ep16/looks-r15/crouch/render.sh  -> out/ep16/r15/crouch/<ID>.png
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {Painted} from '../../../../../src/painted/survival/frame';
import {paintCast} from '../../../../../src/painted/survival/cast';
import {kneeLevel, waterlineItem} from '../../../../../src/painted/survival/water';
import {paintRiver} from '../../../../../src/painted/survival/river';
import {boulderItem, riverLightAt, shadeAt} from '../../../../../src/painted/survival/river-r3';
import {camOf} from '../../../../../src/painted/kit/cam-moves';
import type {Painter} from '../../../../../src/painted/kit/painter';
import type {YCam} from '../../../../../src/painted/kit/ycam';
import {CAM16C, CAM16D, RIVER_X0} from '../shots';

const FACES: Record<string, [number, number]> = {front: [0, 1], q: [0.7, 0.7], side: [1, 0], bq: [0.7, -0.7], back: [0, -1]};
const mk = (cam: any, tt: number, K: [number, number, number], facing: [number, number], water: number, river: boolean) => () => {
  const c = camOf(cam, tt), L = riverLightAt(shadeAt(1450));
  return <Painted band={false} paper="#cfdcc4" paint={(p: Painter) => {
    const item = {at: K, draw: (q: Painter, cc: YCam) => { paintCast(q, cc, 'K', {at: K, facing, pose: 'P35', face: 'scared', t: 1, shadow: false} as any); }};
    const extra: any[] = [item];
    if (water) extra.push(waterlineItem(K, 0, {L, t: 1}));
    paintRiver(p, c, {t: 1, light: L, x0: RIVER_X0, extra: river ? [boulderItem(L), ...extra] : extra});
  }} />;
};
export const FRAMES: Record<string, () => JSX.Element> = {};
for (const [fn, f] of Object.entries(FACES)) {
  FRAMES[`CR-D-${fn}-dry`] = mk(CAM16D, 0.6, [0.7, 0, -0.75], f, 0, false);
  FRAMES[`CR-C-${fn}-dry`] = mk(CAM16C, 0.85, [0.6, 0, -0.5], f, 0, false);
}
FRAMES['CR-D-wet'] = mk(CAM16D, 0.6, [0.7, -0.12, -0.75], [0.25, 1], 1, true);
FRAMES['CR-D-dryriver'] = mk(CAM16D, 0.6, [0.7, -0.12, -0.75], [0.25, 1], 0, true);
registerRoot(() => createElement(Fragment, null, ...Object.keys(FRAMES).map((k) => createElement(Composition, {key: k, id: k, component: FRAMES[k], width: 1080, height: 1920, fps: 30, durationInFrames: 1}))));
