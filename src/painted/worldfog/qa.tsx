// QA entry for WFOG-EP01-SHORT (kept out of src/Root.tsx): the registered timeline with a burned-in preview label
// (docs/boss-asset-workflow.md#preview-labels: shot ID, deliverable, review-page time, shot-local frame). Use the
// production entry `src/index.ts` (composition WFOG-EP01-SHORT) for measurements, determinism and caption-zone checks.
import {createElement, Fragment} from 'react';
import {AbsoluteFill, Composition, registerRoot, useCurrentFrame} from 'remotion';
import {SceneRenderer} from '../../scenes/SceneRenderer';
import {worldFogTimeline} from '../../videos/world-fog/index';
import {FORMATS} from '../../videos/types';
import {SHOT_ROWS, TOTAL_FRAMES} from './space';

const reviewTime = (G: number) => {
  const s = G / 30;
  return `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`;
};

const Label = ({note}: {note: string}) => {
  const G = useCurrentFrame();
  const row = [...SHOT_ROWS].reverse().find((r) => G >= r.g0)!;
  return createElement('div', {
    style: {position: 'absolute', left: 24, top: 16, right: 24, fontFamily: 'Noto Sans Thai, sans-serif', fontSize: 26, lineHeight: 1.25, color: '#fff', WebkitTextStroke: '4px #111', paintOrder: 'stroke fill'},
  }, createElement('b', null, row.id), ` · WFOG-EP01-SHORT · TH ${reviewTime(G)} · G${G} [f${G - row.g0}]`, createElement('br'), createElement('span', {style: {fontSize: 20}}, note));
};

const Qa = (props: Record<string, unknown>) =>
  createElement(AbsoluteFill, null,
    createElement(SceneRenderer, {timeline: worldFogTimeline, ending: 'C_seamless', loopBlendFrames: 0, captionStyle: {preset: 'none'}, chrome: {channelLabel: false, progressBar: false}}),
    createElement(Label, {note: String(props.note ?? '')}));

const {width, height, fps} = FORMATS.short;
registerRoot(() => createElement(Fragment, null,
  createElement(Composition, {id: 'WFOG-QA', component: Qa, width, height, fps, durationInFrames: TOTAL_FRAMES, defaultProps: {note: 'BLOCKOUT — not the final look · Boss SS-R4 retime (r7) · S03-SH06A held look · picture only (no VO/captions/sound)'}})));
