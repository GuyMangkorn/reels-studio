// Standalone entry for the EDU-EP18 asset proof sheets (W5.2). Kept out of src/Root.tsx and the registry:
// printf 'EDU18-PR-WOMAN 0 out/edu18/proof/PR-WOMAN.png\n' | node scripts/stills.mjs src/painted/edu18/proof-index.ts
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {PRWoman} from './proof';

const size = {width: 1080, height: 1920, fps: 30, durationInFrames: 60};
const comps = {'PR-WOMAN': PRWoman} as const;
registerRoot(() => createElement(Fragment, null, ...Object.entries(comps).map(([k, component]) => createElement(Composition, {key: k, id: `EDU18-${k}`, component, ...size}))));
