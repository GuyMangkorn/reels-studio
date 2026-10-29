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
    // Painted scene type proof through SceneRenderer (captions + chrome), and the same timeline as bare plates for
    // caption-zone measurement. Kept out of the episode registry: SHIPWRECK-SHORT assembly is Editor's.
    createElement(Composition, {id: 'PAINTED-TIMELINE-Shipwreck', component: ProofWithCaptions, ...proof}),
    createElement(Composition, {id: 'PAINTED-PLATES-Shipwreck', component: ProofPlates, ...proof}),
  ),
);
