// Filed from EDU-EP14 (KIT-P01, W8.4; a copy: the episode keeps edu14/sky.ts). `cloud-base deck`: the flat cloud ceiling seen from below when the camera looks up
// (world plane at `baseY`, default 2,000 m, slate underside darker toward the zenith, soft rolls and lit breaks). Camera pitch > 0 needed.
import {hardFill} from './draw';
import {hash} from './hash';
import {mixColor, type Painter} from './painter';
import {wWash} from './world';
import type {YCam} from './ycam';

export const CLOUD_DECK = {baseY: 2000, low: '#4f5c63', top: '#46535a'} as const;
/** The deck above the horizon of `c`: `amount` 0..1 fades it in as the pitch comes up (0 = the base sky only). */
export const paintCloudDeck = (p: Painter, c: YCam, amount = 1, baseY: number = CLOUD_DECK.baseY) => {
  const pitch = c.pitch ?? 0;
  if (amount <= 0 || pitch <= 0.05) return;
  const q = p.layer(Math.min(1, amount), 24000);
  // base: the underside, darker toward the zenith (screen-space ramp keyed to the camera pitch)
  const hz = c.hy + c.f * Math.tan(pitch); // the horizon line on screen (moves down as the camera looks up)
  const top = CLOUD_DECK.top, low = CLOUD_DECK.low;
  const n = 9;
  for (let i = 0; i < n; i++) {
    const y0 = (-20 + ((Math.min(1960, hz) + 20) * i) / n), y1 = -20 + ((Math.min(1960, hz) + 20) * (i + 1)) / n + 1;
    hardFill(q, 24010 + i, mixColor(top, low, ((i + 0.5) / n) ** 1.4), [[-20, y0], [1100, y0], [1100, y1], [-20, y1]]);
  }
  // soft rolls on the ceiling plane (km-scale blobs, lit breaks every third one)
  for (let i = 0; i < 70; i++) {
    const x = (hash(24100 + i) - 0.5) * 9000, z = -(hash(24200 + i) * 7000) + 600 + c.z, w = 500 + hash(24300 + i) * 1100, d = 260 + hash(24400 + i) * 700, lit = i % 3 === 0;
    wWash(q, c, 24500 + i, lit ? '#8f9da3' : '#2f3a40', lit ? 90 : 140, Array.from({length: 16}, (_, k): [number, number, number] => [x + (w / 2) * (1 + Math.cos((k / 16) * 6.283)), baseY, z + (d / 2) * (1 + Math.sin((k / 16) * 6.283))]), 0.5, 0.5);
  }
};
