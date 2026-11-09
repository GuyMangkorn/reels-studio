import {useCurrentFrame} from 'remotion';
import {DURATION} from './clock';
import {InsetSource, Shot} from './shots';

// EDU-EP11 W5.2 proof compositions (standalone entry `assets-index.ts`, not in src/Root.tsx): the reference assembly of every shot as one pure function of G,
// and the inset raster source. Stills: scripts/edu-series/ep11/run-assets.sh.
export const Ref = () => <Shot g={useCurrentFrame()} />;
export const InsetSrc = InsetSource;
export const ASSETS: Record<string, {component: React.FC; frames: number}> = {
  'REF': {component: Ref, frames: DURATION},
  'INSET-SRC': {component: InsetSrc, frames: 1},
};
