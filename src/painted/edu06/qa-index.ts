// Standalone entry for the EDU-EP06-SHORT Boss W5.2 element checks (kept out of src/Root.tsx and the episode registry; render.mjs bundles only the
// registry): `printf 'EDU6-QA-CATS 0 out/edu06/boss/cats.png\n' | node scripts/stills.mjs src/painted/edu06/qa-index.ts`.
import {createElement, Fragment, type ReactElement} from 'react';
import {Composition, registerRoot} from 'remotion';
import {QA_CATS, QA_CATS2, QA_EYE, QA_GLARE, QA_GLOW, QA_RUB, QA_ROOM_DAY, QA_ROOM_NIGHT, QA_SEATED, QA_STEPUP, STEP_FRAMES, QA_B01SH04, QA_B02SH03, QA_B04SH03, QA_B04SH05, QA_B05SH02, QA_B05SH03, QA_LF02M, SHOT_PROOFS} from './qa';

const size = {width: 1080, height: 1920, fps: 30};
const comps: [string, () => ReactElement, number][] = [
  ['ROOM-NIGHT', QA_ROOM_NIGHT, 30], ['ROOM-DAY', QA_ROOM_DAY, 30], ['CATS', QA_CATS, 1], ['CATS2', QA_CATS2, 1], ['STEPUP', QA_STEPUP, STEP_FRAMES], ['RUB', QA_RUB, 80],
  ['B01SH04', QA_B01SH04, SHOT_PROOFS.B01SH04], ['B02SH03', QA_B02SH03, SHOT_PROOFS.B02SH03], ['B04SH03', QA_B04SH03, SHOT_PROOFS.B04SH03], ['B04SH05', QA_B04SH05, SHOT_PROOFS.B04SH05],
  ['B05SH02', QA_B05SH02, SHOT_PROOFS.B05SH02], ['B05SH03', QA_B05SH03, SHOT_PROOFS.B05SH03], ['LF02M', QA_LF02M, 30], ['EYE', QA_EYE, 4], ['GLARE', QA_GLARE, 3], ['GLOW', QA_GLOW, 30], ['SEATED', QA_SEATED, 1],
];
registerRoot(() => createElement(Fragment, null, ...comps.map(([id, component, n]) => createElement(Composition, {key: id, id: `EDU6-QA-${id}`, component, ...size, durationInFrames: n}))));
