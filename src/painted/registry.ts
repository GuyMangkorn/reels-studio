import type {Camera} from './kit/camera';
import type {PaintedShot} from './shot';
import {alvarengaShots} from './shots/alvarenga';
import {hanakoShots} from './shots/hanako';
import {kitShots} from './shots/kit';
import {kuchisakeShots} from './shots/kuchisake';
import {bloopShots} from './shots/bloop';
import {shipwreckShots} from './shots/shipwreck';
import {worldfogShots} from './shots/worldfog';
import {zcpaintShots} from './shots/zcpaint';

/**
 * Painted plates by stable ID. A timeline selects them with `scene.painted.shots[].shot`; the validator rejects unknown
 * IDs. Add an episode's plates by appending its list here (one owner module per episode under `src/painted/shots/`).
 */
const all: PaintedShot[] = [...shipwreckShots, ...worldfogShots, ...zcpaintShots, ...bloopShots, ...hanakoShots, ...kuchisakeShots, ...kitShots, ...alvarengaShots];

export const paintedShots: Readonly<Record<string, PaintedShot>> = Object.freeze(Object.fromEntries(all.map((shot) => [shot.id, shot])));
if (Object.keys(paintedShots).length !== all.length) throw new Error('Duplicate painted shot ID in src/painted/registry.ts');

export const paintedShotIds = Object.keys(paintedShots);

/** The shared camera of one plate at shot-local `tl` (unmapped clock): what the canvas and its glow layers use. */
export const cameraAt = (shotId: string, tl: number): Camera => {
  const shot = paintedShots[shotId];
  return shot.camera(shot.clock ? shot.clock(tl) : tl);
};
