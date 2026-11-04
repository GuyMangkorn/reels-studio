import {createElement, Fragment, useCallback} from 'react';
import {AbsoluteFill, Composition} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter} from '../kit/painter';
import {CaptionShade, Grain} from '../kit/screen';
import {KF_SH02, KF_SH04, KF_SH05, PAPER} from './frames';
import {SHOTS_A, type Shot} from './sb-a';
import {SHOTS_B} from './sb-b';

// ZC2-SB-R3 storyboard stills (W3.3): one composition per shot that is not a proof frame, plus `-shade` variants that add the soft CaptionShade.
// B01-SH02, B02-SH04, B02-SH05 reuse the approved r6 proof frames in their ZC2-SB-R4 variants (`v2` / `facing`).
export const SHOTS: Record<string, Shot> = {...SHOTS_A, ...SHOTS_B, 'ZC2-B01-SH02': {paint: (p) => KF_SH02(p, {facing: true, dark: 0.3})}, 'ZC2-B02-SH04': {paint: (p) => KF_SH04(p, true)}, 'ZC2-B02-SH05': {paint: (p) => KF_SH05(p, true)}};

const Still = ({id, shade, strength}: {id: string; shade?: 'soft' | 'band'; strength?: number}) => {
  const s = SHOTS[id];
  const paint = useCallback(({brush, frame}: PaintContext) => { s.paint(makePainter(brush, {t: frame / 30, frame, fade: PAPER})); }, [s]);
  return (
    <AbsoluteFill style={{background: PAPER, width: 1080, height: 1920}}>
      <BrushCanvas paint={paint} paper={PAPER} />
      {s.over?.()}
      <Grain opacity={0.1} />
      {shade ? <CaptionShade tl={0.5} cues={[[0, 1]]} mode={shade} strength={strength} /> : null}
    </AbsoluteFill>
  );
};
/** Q-ZC2-S1 (R3 user note: lightest possible): the shade peak is per shot, the lowest peak in steps of 0.01 that keeps caption-zone 1080:1248 at mean <= 0.245 (limit 0.25, margin 0.005) and p95 <= 0.40; 0 = the still already passes unshaded. */
export const SHADE_X = 0.76;
const SHADE_FOR: Record<string, number> = {'ZC2-B01-SH01': 0.65, 'ZC2-B01-SH02': 0.68, 'ZC2-B02-SH01': 0.53, 'ZC2-B02-SH02': 0.58, 'ZC2-B02-SH03': 0.62, 'ZC2-B02-SH04': 0.52, 'ZC2-B02-SH05': 0.47, 'ZC2-B03-SH01': 0.64, 'ZC2-B04-SH01': 0.73, 'ZC2-B04-SH02': 0.78, 'ZC2-B04-SH02b': 0.79, 'ZC2-B04-SH03': 0.67, 'ZC2-B05-SH01': 0.75, 'ZC2-B05-SH02': 0.72, 'ZC2-B05-SH03': 0.77, 'ZC2-B05-SH04': 0.69, 'ZC2-B06-SH01': 0.62, 'ZC2-B06-SH02': 0.73, 'ZC2-B06-SH03': 0.76, 'ZC2-B07-SH01': 0.58, 'ZC2-B07-SH02': 0.64, 'ZC2-B07-SH03': 0.66, 'ZC2-B08-SH01': 0.00, 'ZC2-B08-SH02': 0.27, 'ZC2-B09-SH01': 0.64, 'ZC2-B09-SH02': 0.60, 'ZC2-B09-SH03': 0.44, 'ZC2-B09-SH04': 0.63, 'ZC2-B10-SH01': 0.61};
const dur = {width: 1080, height: 1920, fps: 30, durationInFrames: 30};
export const SbRoot = () => createElement(Fragment, null, ...Object.keys(SHOTS).flatMap((id) => [
  createElement(Composition, {key: id, id: `SB-${id}`, component: Still as never, defaultProps: {id}, ...dur}),
  createElement(Composition, {key: `${id}-s`, id: `SBS-${id}`, component: Still as never, defaultProps: {id, shade: 'soft' as const}, ...dur}),
  createElement(Composition, {key: `${id}-b`, id: `SBB-${id}`, component: Still as never, defaultProps: {id, shade: 'band' as const}, ...dur}),
  createElement(Composition, {key: `${id}-x`, id: `SBX-${id}`, component: Still as never, defaultProps: {id, shade: 'band' as const, strength: SHADE_FOR[id] ?? SHADE_X}, ...dur}),
]));
