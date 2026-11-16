import type {Arm} from '../../kit/cast';
import {poseMix} from '../../kit/poses';
import type {Pt} from '../../kit/painter';
import {camPoint, camUnit} from '../../kit/ycam';
import {GIRL} from '../cast';
import {F} from '../field';
import {ease, frac} from '../motion19';
import {makeShot} from '../shot';
import {sheetCam, sheetMove, type FieldShotDef} from '../stage';
import {trailPrints} from '../trail';

// B04-SH01 · G 1457-1490 (33 f) · "เย้!" (V06; EDU-EP19-SHEETS-R3, camera R1). GIRL at G1, front, P08 celebrate_V: both arms up l 2-6 (peak on
// "เย้!" l 4-12), held to l 24, down by l 33; gleeful, mouth in the whisper shape (V06 is a whispered cheer). Deep gold light (sun B03, 18 deg).
// The hands are the kit's mitten hands, not drawn fists; the P08 hands are raised above the head (below).
const N = 33;
const M = sheetMove([6.7, 1.0, -0.4], [-20, -14], [1.4, 1.3], 1.2, {f: 1000, hy: 640});

export const B04_SH01: FieldShotDef = {
  id: 'B04-SH01', N,
  cam: (L) => sheetCam(M, L, N),
  state: (L) => {
    const c = sheetCam(M, L, N), g = camPoint(c, F.G1) as Pt | null, u = camUnit(c, F.G1);
    const k = ease(frac(L, 2, 6)) * (1 - ease(frac(L, 24, 33))), bob = L >= 4 && L <= 12 ? 4 * Math.sin((Math.PI * (L - 4)) / 4) : 0;
    const arms = g ? poseMix('P01', 'P08', k, GIRL, g, u, 'front') : null;
    // Kit P08 puts the hands at head height for this cast (v1 stills read as hands on the head); the sheet wants the fists above the head
    // (fists ~453-465, head top 542): lift the hands 0.2 m and spread them 0.07 m outward (a V), elbows following.
    const vUp = (a: Arm | undefined, side: number): Arm | undefined => a && {...a, to: [a.to[0] + side * 0.07 * u * k, a.to[1] - 0.2 * u * k], via: a.via && [a.via[0] + side * 0.05 * u * k, a.via[1] - 0.12 * u * k]};
    return {sun: 'B03', t: L / 30, prints: trailPrints(), stack: false,
      girl: {at: F.G1, view: 'front', pose: 'P01', face: 'happy', faceState: {mouth: 'o', eyes: k > 0.5 ? 'shut' : 'dot'}, fig: {lArm: vUp(arms?.lArm, 1), rArm: vUp(arms?.rArm, -1), headCock: bob}}};
  },
};
export const shot = makeShot(B04_SH01);
