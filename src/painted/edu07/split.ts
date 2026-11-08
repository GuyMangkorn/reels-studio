import {hardFill} from '../kit/draw';
import type {Painter} from '../kit/painter';
import type {YCam} from '../kit/ycam';
import {ambientT, G_ZERO, pestleStrokeAt, qOf, ramp, ringAlpha, ringR, earthPhi} from './clock';
import {paintSoi, type SoiOpts} from './soi';
import {paintSpace} from './space';

// The split frame (VD06; S01-B02-SH01, B03-SH01, B03-SH04, B04-SH01): space panel y 0-760, street panel y 760-1920, cream seam 3 px. One progress value
// q(G) (clock.ts) drives the card, the ring and Earth; the ring meets Earth's near limb on G784. Pure in the composition frame G.
export const SEAM = 760;

export type SplitOpts = {G: number; camSpace: YCam; camStreet: YCam; ven?: SoiOpts['ven']; cus?: SoiOpts['cus']};
/** The street grade n and Earth's day-side wipe `dark` as functions of G (B04-SH01: street grade L24-54, Earth dark L24-34). */
export const nightOf = (G: number): number => ramp(G, G_ZERO, G_ZERO + 30);
export const earthDarkOf = (G: number): number => ramp(G, G_ZERO, G_ZERO + 10);

export const paintSplit = (p: Painter, o: SplitOpts) => {
  const {G} = o, t = ambientT(G), n = nightOf(G), R = ringR(G);
  const st = paintSoi(p, o.camStreet, {t, stroke: pestleStrokeAt(G), panelTop: SEAM, night: n, stars: n > 0.02 ? ramp(G, G_ZERO + 12, G_ZERO + 30) : undefined, ven: o.ven, cus: o.cus});
  const sp = paintSpace(p, o.camSpace, {t, rect: [0, 0, 1080, SEAM], sun: 0, earthPhi: earthPhi(G), ring: R, ringAlpha: ringAlpha(G), ringOver: G >= G_ZERO, beamTail: R > 0.005 && G < G_ZERO ? R : undefined,
    flow: (G * 0.035) % 1, spray: G < G_ZERO + 12, dark: earthDarkOf(G)});
  hardFill(p, 1200, '#f3ead8', [[0, SEAM - 1.5], [1080, SEAM - 1.5], [1080, SEAM + 1.5], [0, SEAM + 1.5]]);
  return {street: st, space: sp, q: qOf(G)};
};
