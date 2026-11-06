import type {Camera} from './kit/camera';
import type {PaintedShot} from './shot';
import {alvarengaShots} from './shots/alvarenga';
import {edu01Shots} from './shots/edu01';
import {edu02Shots} from './shots/edu02';
import {edu03Shots} from './shots/edu03';
import {everyoneGoneShots} from './shots/everyone-gone';
import {everyoneGoneEp02Shots} from './shots/everyone-gone-ep02';
import {hanakoShots} from './shots/hanako';
import {kitShots} from './shots/kit';
import {kuchisakeShots} from './shots/kuchisake';
import {bloopShots} from './shots/bloop';
import {shipwreckShots} from './shots/shipwreck';
import {wendigoShots} from './shots/wendigo';
import {worldfogShots} from './shots/worldfog';
import {zc2Shots} from './shots/zc2';
import {zcpaintShots} from './shots/zcpaint';

/**
 * Painted plates by stable ID. A timeline selects them with `scene.painted.shots[].shot`; the validator rejects unknown
 * IDs. Add an episode's plates by appending its list here (one owner module per episode under `src/painted/shots/`).
 */
const all: PaintedShot[] = [...shipwreckShots, ...worldfogShots, ...zcpaintShots, ...bloopShots, ...hanakoShots, ...kuchisakeShots, ...wendigoShots, ...kitShots, ...alvarengaShots, ...everyoneGoneShots, ...everyoneGoneEp02Shots, ...zc2Shots, ...edu01Shots, ...edu02Shots, ...edu03Shots];

export const paintedShots: Readonly<Record<string, PaintedShot>> = Object.freeze(Object.fromEntries(all.map((shot) => [shot.id, shot])));
if (Object.keys(paintedShots).length !== all.length) throw new Error('Duplicate painted shot ID in src/painted/registry.ts');

export const paintedShotIds = Object.keys(paintedShots);

/** The shared camera of one plate at shot-local `tl` (unmapped clock): what the canvas and its glow layers use. */
export const cameraAt = (shotId: string, tl: number): Camera => {
  const shot = paintedShots[shotId];
  return shot.camera(shot.clock ? shot.clock(tl) : tl);
};
