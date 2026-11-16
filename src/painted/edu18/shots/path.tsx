import type {Pt} from '../../kit/painter';
import type {V3} from '../../kit/space';
import {paintSnake} from '../../kit/snake';
import {camPoint, camUnit, mixYCam, type YCam} from '../../kit/ycam';
import {drawGirl, GIRL, girlPose} from '../girl';
import {cam, cLF02B} from '../looks-cams';
import {openT} from '../looks';
import {paintLongShadow, paintPaddyBack, paintPaddyFront, PADDY, SUN_F} from '../paddy';
import {paintHippoWaterFront} from '../river';
import {SNAKE_SHOTS} from '../path-shots';
import {k01, lerp, makeShot, outCubic, type Frame} from '../shotkit';
import type {Pass} from '../stack';

// EDU-EP18-SHORT rice-path shots (Editor W5 draft): B04-SH02 the stopped step, B04-SH03 the snake's head, B04-SH04 she steps back, the snake slides away.
const P0: V3 = [0, 0.35, -0.75];
const DEF = GIRL['travel-safari'];

const path = (id: string, camOf: (L: number) => YCam, girl: (L: number) => {at: V3; pose: 'step-freeze' | 'walk'; walk?: number; face: Parameters<typeof drawGirl>[5]}, t0: number) =>
  makeShot(id, (L): Frame => {
    const c = camOf(L), s = SNAKE_SHOTS[id](L), gi = girl(L);
    const back: Pass = (p) => {
      paintPaddyBack(p, c, {t: t0});
      paintLongShadow(p, c, gi.at, 1.64, 39950);
      const g = camPoint(c, gi.at), u = camUnit(c, gi.at);
      if (g) {
        const pose = {...girlPose('step-freeze', DEF, g, u, 'front'), ...(gi.pose === 'walk' ? {walk: gi.walk ?? 0, stride: 0.9} : {walk: gi.walk ?? 0.3, stride: 0.8})};
        drawGirl(p, 'travel-safari', g, u, pose, gi.face, openT(850), 850);
      }
      if (s.visible) paintSnake(p, c, s.build, {...s.place, seed: 71000, sun: SUN_F});
      if (s.ripples.length) paintHippoWaterFront(p, c, s.rippleAt, s.ripples, 71500);
      paintPaddyFront(p, c);
    };
    return {paper: PADDY.dirt, back};
  });

export const B04_SH02 = path('B04-SH02',
  (L) => { const e = k01(L, 0, 41, outCubic); return cam([0, 0.7, -0.6], 0, lerp(2.2, 2.0, e), 0.7, 1100, 850); },
  (L) => ({at: L < 8 ? ([0, 0.35, lerp(-1.0, -0.75, k01(L, 0, 8, (x) => x))] as V3) : P0, pose: 'step-freeze', walk: L < 8 ? 0.0 + 0.3 * k01(L, 0, 8, (x) => x) : 0.3, face: L < 6 ? 'worried' : 'scared'}), 0.9);
export const B04_SH03 = path('B04-SH03',
  (L) => { const e = k01(L, 0, 88, (x) => x); return cam([0.35, 0.45, -0.2], 40 - 8 * e, 0.9 - 0.1 * e, 0.62, 1200, 760, {pitch: -10, near: 0.05}); },
  (L) => ({at: [0, 0.35, -0.75], pose: 'step-freeze', walk: 0.3, face: 'scared'}), 0.9);
export const B04_SH04 = path('B04-SH04',
  (L) => { const e = k01(L, 0, 90, (x) => x), a = cam([0, 0.8, -1.0], 20, 3.0, 1.2, 900, 760, {pitch: -6}), b = cam([0, 0.3, -1.0], 35, 16, 9, 900, 640, {pitch: -26}); return mixYCam(a, b, e); },
  (L) => {
    const back = k01(L, 4, 28, (x) => x), steps = back > 0 && back < 1;
    return {at: [0, 0.35, lerp(-0.75, -1.9, back)] as V3, pose: 'walk', walk: steps ? ((L - 4) / 12) % 1 : 0, face: L < 30 ? 'scared' : 'relieved'};
  }, 0.9);
void (null as Pt | null); void cLF02B;
