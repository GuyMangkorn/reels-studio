// Standalone entry for the EDU-EP13-SHORT timed shots, groups 1-3 (W5.2). Kept out of src/Root.tsx and the episode registry (Editor registers the
// episode composition): render with `printf 'EDU13-S01-B01-SH03 0 out/edu13/shots/sh03-f0.png\n' | node scripts/stills.mjs src/painted/edu13/shots-index.ts`.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {qaBand} from './look';
import {S01_B01_SH01, S01_B01_SH02, S01_B01_SH03, S01_B01_SH04, S01_B01_SH04B, S01_B01_SH04C, S01_B01_SH04D, S01_B01_SH05, S01_B02_SH01, S01_B02_SH03, S01_B03_SH01, S01_B03_SH03, S01_B04_SH01, S01_B04_SH02, S01_B05_SH01, S01_B05_SH02} from './shot-layers';
import {SHOTS} from './shots';

const comps = {S01_B01_SH01, S01_B01_SH02, S01_B01_SH03, S01_B01_SH04, S01_B01_SH04B, S01_B01_SH04C, S01_B01_SH04D, S01_B01_SH05, S01_B02_SH01, S01_B02_SH03, S01_B03_SH01, S01_B03_SH03, S01_B04_SH01, S01_B04_SH02, S01_B05_SH01, S01_B05_SH02} as const;
qaBand.on = true; // stills tooling keeps the QA caption band; compositions (src/videos/edu-ep13) never draw it
registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...Object.entries(comps).map(([k, component]) =>
      createElement(Composition, {key: k, id: `EDU13-${k.replace(/_/g, "-")}`, component, width: 1080, height: 1920, fps: 30, durationInFrames: SHOTS[k as keyof typeof SHOTS].len})),
  ),
);
