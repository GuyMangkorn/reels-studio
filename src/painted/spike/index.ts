// Standalone entry for the painted-2D spikes, kept out of src/Root.tsx and the episode registry until the approach is approved.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {FORMATS} from '../../videos/types';
import {SceneRenderer, type SceneRendererProps} from '../../scenes/SceneRenderer';
import {timelineFrames} from '../../scenes/timeline';
import {paintedProofTimeline} from './timelineProof';
import {FireFog} from './FireFog';
import {RainHut} from './RainHut';
import {Shipwreck} from './Shipwreck';
import {WorldFog} from './WorldFog';
import {FaceSheet} from './FaceSheet';
import {ProportionSheet} from './ProportionSheet';
import {CastSheet} from './CastSheet';
import {SideSheet} from './SideSheet';

const {width, height, fps} = FORMATS.short;
const shot = {width, height, fps, durationInFrames: 5 * fps};
const proof = {width, height, fps, durationInFrames: timelineFrames(paintedProofTimeline, fps)};
const proofProps: SceneRendererProps = {timeline: paintedProofTimeline, ending: 'B_loop'};
const ProofWithCaptions = () => createElement(SceneRenderer, {...proofProps, captionStyle: {preset: 'outline', position: 'middle'}});
const ProofPlates = () => createElement(SceneRenderer, {...proofProps, captionStyle: {preset: 'none'}, chrome: {channelLabel: false, progressBar: false}});
registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'PAINTED-SPIKE-Short', component: RainHut, ...shot}),
    createElement(Composition, {id: 'PAINTED-FIREFOG-Short', component: FireFog, ...shot}),
    // Film style test for SHIPWRECK-SHORT (scripts/oldest-shipwreck/delivery.md): 3 shots x 3 s.
    createElement(Composition, {id: 'PAINTED-SPIKE-Shipwreck', component: Shipwreck, ...shot, durationInFrames: 9 * fps}),
    // Fog feasibility sample for WFOG-EP01-SHORT S02-B02 (scripts/world-fog/short/script.md).
    createElement(Composition, {id: 'PAINTED-SPIKE-WorldFog', component: WorldFog, ...shot, durationInFrames: 6 * fps}),
    // Flat-face decal model sheet (user reference, 2026-10-29): 12 expressions, blink and ink boil.
    createElement(Composition, {id: 'PAINTED-SPIKE-FaceSheet', component: FaceSheet, ...shot, durationInFrames: 3 * fps}),
    // Short cartoon body proportions (3 / 3.5 / 4 heads) with the decal head and a joint skeleton.
    createElement(Composition, {id: 'PAINTED-SPIKE-Proportions', component: ProportionSheet, ...shot, durationInFrames: 3 * fps}),
    // WORLD FOG cast proposal at 4 heads (user choice, 2026-10-29).
    createElement(Composition, {id: 'PAINTED-SPIKE-Cast', component: CastSheet, ...shot, durationInFrames: 3 * fps}),
    // WORLD FOG cast side views, worker + cart lit and as a fog silhouette.
    createElement(Composition, {id: 'PAINTED-SPIKE-CastSide', component: SideSheet, ...shot, durationInFrames: 3 * fps}),
    // Painted scene type proof through SceneRenderer (captions + chrome), and the same timeline as bare plates for
    // caption-zone measurement. Kept out of the episode registry: SHIPWRECK-SHORT assembly is Editor's.
    createElement(Composition, {id: 'PAINTED-TIMELINE-Shipwreck', component: ProofWithCaptions, ...proof}),
    createElement(Composition, {id: 'PAINTED-PLATES-Shipwreck', component: ProofPlates, ...proof}),
  ),
);
