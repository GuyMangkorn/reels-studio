// Standalone entry for the PARALLAX-TEST spike (ParallaxTest.tsx). Kept out of src/Root.tsx and the episode registry:
// `printf 'PARALLAX-AFTER 0 out/parallax/a0.png\n' | node scripts/stills.mjs src/painted/spike/parallax-index.ts`.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {COCK_FRAMES, HEAD_CELLS, HeadCockClip, HeadTricksYou} from './HeadTricks';
import {ORBIT360_FRAMES, Orbit360} from './Orbit360';
import {LINEUP_SHEETS, ViewSheetLong, ViewSheetMan, ViewSheetPony, ViewSheetRange, ViewSheetRangeYou, ViewSheetYou, ViewSheetYouHood} from './ViewSheet';
import {ORBIT_FRAMES, PARALLAX_FRAMES, ParallaxAfter, ParallaxBefore, StallAfter, StallBefore, YouAfter, YouBefore, YouOrbit} from './ParallaxTest';

const dur = {width: 1080, height: 1920, fps: 30, durationInFrames: PARALLAX_FRAMES};
registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'PARALLAX-BEFORE', component: ParallaxBefore, ...dur}),
    createElement(Composition, {id: 'PARALLAX-AFTER', component: ParallaxAfter, ...dur}),
    createElement(Composition, {id: 'PARALLAX-STALL-BEFORE', component: StallBefore, ...dur}),
    createElement(Composition, {id: 'PARALLAX-STALL-AFTER', component: StallAfter, ...dur}),
    createElement(Composition, {id: 'PARALLAX-YOU-BEFORE', component: YouBefore, ...dur}),
    createElement(Composition, {id: 'PARALLAX-YOU-AFTER', component: YouAfter, ...dur}),
    createElement(Composition, {id: 'PARALLAX-YOU-ORBIT', component: YouOrbit, ...dur, durationInFrames: ORBIT_FRAMES}),
    createElement(Composition, {id: 'VIEWSHEET-YOU', component: ViewSheetYou, ...dur, durationInFrames: 1}),
    createElement(Composition, {id: 'VIEWSHEET-MAN-POLICE', component: ViewSheetMan, ...dur, durationInFrames: 1}),
    createElement(Composition, {id: 'VIEWSHEET-YOU-HOOD', component: ViewSheetYouHood, ...dur, durationInFrames: 1}),
    createElement(Composition, {id: 'VIEWSHEET-WOMAN-LONG', component: ViewSheetLong, ...dur, durationInFrames: 1}),
    createElement(Composition, {id: 'VIEWSHEET-WOMAN-PONYTAIL', component: ViewSheetPony, ...dur, durationInFrames: 1}),
    createElement(Composition, {id: 'VIEWSHEET-RANGE-MAN', component: ViewSheetRange, ...dur, durationInFrames: 1}),
    createElement(Composition, {id: 'VIEWSHEET-RANGE-YOU', component: ViewSheetRangeYou, ...dur, durationInFrames: 1}),
    // Hair-style lineups (ViewSheet.tsx LINEUP_SHEETS): LINEUP-<FRONT-RIGHT|FRONT-LEFT>-<30|45|60>-<A|B>.
    ...LINEUP_SHEETS.map(({id, component}) => createElement(Composition, {key: id, id, component, ...dur, durationInFrames: 1})),
    createElement(Composition, {id: 'PARALLAX-ORBIT360', component: Orbit360, ...dur, durationInFrames: ORBIT360_FRAMES}),
    // Head tricks (HeadTricks.tsx): one 1080x1080 bust cell per frame, and the 3 s head-cock clip.
    createElement(Composition, {id: 'HEADTRICKS-YOU', component: HeadTricksYou, width: 1080, height: 1080, fps: 30, durationInFrames: HEAD_CELLS.length}),
    createElement(Composition, {id: 'HEADTRICKS-COCK', component: HeadCockClip, width: 1080, height: 1080, fps: 30, durationInFrames: COCK_FRAMES}),
  ),
);
