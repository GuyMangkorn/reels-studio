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
import {HeadSideSheet} from './HeadSideSheet';
import {PlatePreview} from './PlatePreview';
import {Grade, Grain, windowShot} from './WfogShop';
import {phoneShot} from './WfogPhone';
import {ArmBackSheet} from './ArmBackSheet';
import {PoseSheet, POSE_SHEET_SIZE} from './PoseSheet';

const {width, height, fps} = FORMATS.short;
const shot = {width, height, fps, durationInFrames: 5 * fps};
const proof = {width, height, fps, durationInFrames: timelineFrames(paintedProofTimeline, fps)};
const proofProps: SceneRendererProps = {timeline: paintedProofTimeline, ending: 'B_loop'};
const ProofWithCaptions = () => createElement(SceneRenderer, {...proofProps, captionStyle: {preset: 'outline', position: 'middle'}});
// WFOG-EP01-SHORT SP01/SP04 previews (S02-SH09, S03-SH03 match frame). Props: label (burned-in preview label), bare (assembly
// only on white, for the SP01 (b) silhouette mask comparison), warp (VD17 fog lens per ST-09, default on; false = VD17 off).
const SP01_NOTE = 'SP01/SP04 preview · spike code, not the integrated asset · SS-R3';
const sp01 = (shotKey: 'S02-SH09' | 'S03-SH03', G0: number) => (props: Record<string, unknown>) => {
  const bare = props.bare === true;
  return createElement(PlatePreview, {shot: windowShot({shot: shotKey, bare, warp: props.warp !== false}), G0, label: props.label !== false && !bare, note: SP01_NOTE}, bare ? null : [createElement(Grade, {key: 'g'}), createElement(Grain, {key: 'n'})]);
};
const Sp01Sh09 = sp01('S02-SH09', 1230);
const Sp01Sh03 = sp01('S03-SH03', 1800);
const PhoneSample = (props: Record<string, unknown>) =>
  createElement(PlatePreview, {shot: phoneShot, G0: 354, label: props.label !== false, note: 'Phone-screen sample · painted hand/handset + React SVG screen · SS-R3'}, createElement(Grain, {opacity: 0.06}));
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
    // HEAD-SIDE-R2 profile decal head review: front vs profile with guides, expressions, cuts, side cast, ZC lead.
    createElement(Composition, {id: 'PAINTED-SPIKE-HeadSide', component: HeadSideSheet, ...shot, durationInFrames: 3 * fps}),
    // Painted scene type proof through SceneRenderer (captions + chrome), and the same timeline as bare plates for
    // caption-zone measurement. Kept out of the episode registry: SHIPWRECK-SHORT assembly is Editor's.
    createElement(Composition, {id: 'PAINTED-TIMELINE-Shipwreck', component: ProofWithCaptions, ...proof}),
    createElement(Composition, {id: 'PAINTED-PLATES-Shipwreck', component: ProofPlates, ...proof}),
    createElement(Composition, {id: 'WFOG-ARMBACK-SAMPLE', component: ArmBackSheet, ...shot, durationInFrames: 1}),
    // Pose sheet P01-P30 from the shared pose library (src/painted/kit/poses.ts): 6 x 5 labelled cells, a spike sheet.
    createElement(Composition, {id: 'WFOG-POSE-SHEET', component: PoseSheet, ...shot, ...POSE_SHEET_SIZE, durationInFrames: 1}),
    createElement(Composition, {id: 'WFOG-PREVIEW-S02-SH02', component: PhoneSample, ...shot, durationInFrames: 90, defaultProps: {label: true}}),
    createElement(Composition, {id: 'WFOG-SP01-S02-SH09', component: Sp01Sh09, ...shot, durationInFrames: 180, defaultProps: {label: true, bare: false, warp: true}}),
    createElement(Composition, {id: 'WFOG-SP01-S03-SH03', component: Sp01Sh03, ...shot, durationInFrames: 120, defaultProps: {label: true, bare: false, warp: true}}),
  ),
);
