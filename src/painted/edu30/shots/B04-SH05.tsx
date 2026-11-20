import type {Painter} from '../../kit/painter';
import {camDist, camPoint, type YCam} from '../../kit/ycam';
import {DAM_CAMS, paintDam} from '../dam';
import {emuFootTap, emuLensYaw, emuWatchCheck} from '../emu';
import {paintEmu, paintQueueFar, paintQueueWade, queue, type EmuMember} from '../flock';
import {SUN} from '../paddock';
import {camLine, makeShot, type Shot30} from '../shot';
import {paintRestingCasings} from './B04-SH06';

// B04-SH05 (Boss T28, 2026-11-20): reverse on the line of fire, PB01. EMU-HERO (queue head, tuft and bib) stares at the lens, flicks its eyes to the gun (L 6), lifts its bare left wing
// like a wristwatch (L 8-16), reads (head down L 12-18, to L 38), looks up (L 38-40), taps its right foot at L 40, 47, 54 and lowers the wing (L 55-60); the queue (T16) stares and,
// from L 57, starts to turn away. Nothing is painted on the wing (VD30-12, FACTCHECK-R3). Camera fixed eye, yaw 89.3 -> 85.3, ease-in-out over L 0-63. Queue shadows `shadowOp` 45 (TF37).
const N = 64;
const io = (t: number) => { const x = Math.max(0, Math.min(1, t)); return x * x * (3 - 2 * x); };
export const camAt = (L: number): YCam => camLine({eye: [-1.6, 1.15, -4.75], yaw: 89.3 - 4 * io(L / (N - 1)), pitch: -2, f: 950, hy: 860});
const SUNV = SUN.morning, SHADOW = 45;

/** The queue at L with EMU-HERO's watch check and foot taps (T15 R9): the lens yaw from bird 0's rest position and heading to the plate camera. */
export const sh05Queue = (L: number): EmuMember[] => {
  const b0 = queue(0, 'B04-SH05')[0], lens = emuLensYaw(b0.at, b0.heading, DAM_CAMS.sh05);
  return queue(L, 'B04-SH05', {hero: (l) => ({pose: {...emuWatchCheck(l, {lensYaw: lens}), ...emuFootTap(l)}})});
};

const paintBirds = (p: Painter, c: YCam, ms: EmuMember[], pr?: Parameters<Shot30['paint']>[3]) => {
  [...ms].sort((a, b) => camDist(c, [b.at[0], 0, b.at[2]]) - camDist(c, [a.at[0], 0, a.at[2]])).forEach((m) => {
    const a = paintEmu(p, c, m, {sun: SUNV, shadowOp: SHADOW});
    if (m.hero) {
      pr?.lead('EMU-HERO', {top: a.top, bottom: a.bottom, x: (a.left + a.right) / 2});
      const w = camPoint(c, a.world('wingWristL'));
      if (w) pr?.lead('wrist', {top: w[1], bottom: w[1], x: w[0]});
    }
  });
};

export const def: Shot30 = {
  id: 'B04-SH05', N, paper: '#efe6d0',
  cam: camAt,
  paint: (p, L, c, pr) => {
    paintDam(p, c, 38000, {nearSlope: true});
    paintRestingCasings(p, c, 38600, 0.5);
    paintQueueFar(p, c);
    paintBirds(p, c, sh05Queue(L), pr);
    paintQueueWade(p, c, L, 'B04-SH05');
  },
  reel: () => ({strength: 1, tint: 'warm', tintAmount: 1, pop: 0}),
};
export const shot = makeShot(def);
