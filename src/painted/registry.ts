import type {Camera} from './kit/camera';
import type {PaintedShot} from './shot';
import {alvarengaShots} from './shots/alvarenga';
import {edu01Shots} from './shots/edu01';
import {edu02Shots} from './shots/edu02';
import {edu04Shots} from './shots/edu04';
import {edu05Shots} from './shots/edu05';
import {edu06Shots} from './shots/edu06';
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
import {edu07Shots} from './shots/edu07';
import {edu08Shots} from './shots/edu08';
import {edu09Shots} from './shots/edu09';
import {edu11Shots} from './shots/edu11';
import {edu14Shots} from './shots/edu14';
import {edu15Shots} from './shots/edu15';
import {edu16Shots} from './shots/edu16';
import {edu18Shots} from './shots/edu18';
import {edu13Shots} from './shots/edu13';

/**
 * Painted plates by stable ID. A timeline selects them with `scene.painted.shots[].shot`; the validator rejects unknown
 * IDs. Add an episode's plates by appending its list here (one owner module per episode under `src/painted/shots/`).
 */
const all: PaintedShot[] = [...edu07Shots, ...edu08Shots, ...edu09Shots, ...edu11Shots, ...edu13Shots, ...edu14Shots, ...edu15Shots, ...edu16Shots, ...edu18Shots, ...shipwreckShots, ...worldfogShots, ...zcpaintShots, ...bloopShots, ...hanakoShots, ...kuchisakeShots, ...wendigoShots, ...kitShots, ...alvarengaShots, ...everyoneGoneShots, ...everyoneGoneEp02Shots, ...zc2Shots, ...edu01Shots, ...edu02Shots, ...edu03Shots, ...edu04Shots, ...edu05Shots, ...edu06Shots];

export const paintedShots: Readonly<Record<string, PaintedShot>> = Object.freeze(Object.fromEntries(all.map((shot) => [shot.id, shot])));
if (Object.keys(paintedShots).length !== all.length) throw new Error('Duplicate painted shot ID in src/painted/registry.ts');

export const paintedShotIds = Object.keys(paintedShots);

/** The shared camera of one plate at shot-local `tl` (unmapped clock): what the canvas and its glow layers use. */
export const cameraAt = (shotId: string, tl: number): Camera => {
  const shot = paintedShots[shotId];
  return shot.camera(shot.clock ? shot.clock(tl) : tl);
};
