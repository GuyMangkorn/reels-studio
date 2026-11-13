// EDU-EP17 look frame set A, LF03 (Film, W3, 2026-11-11): kept as the look's entry point. The code moved to person-top.ts (N5, Boss, group 2); `paintCrowdTop` is `paintPersonTop` with the
// look's own settings (no long or bun hair cuts, no warm-top clear zone), so LF03 renders as approved.
import type {Painter} from '../kit/painter';
import type {YCam} from '../kit/ycam';
import {paintPersonTop, MAN, type CrowdTopOpts} from './person-top';

export {MAN};
export type {CrowdTopOpts};
export const paintCrowdTop = (p: Painter, cam: YCam, box: {x0: number; x1: number; z0: number; z1: number}, o: CrowdTopOpts = {}) => paintPersonTop(p, cam, box, {cuts: false, clearWarm: 0, ...o});
