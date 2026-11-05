// Head-trick comparison (Boss, 4 Nov 2026; user "Add head cock"): three cheap ways to make a painted head read as tilted or turned
// without a 3D head, on YOU2 upper body. Not a deliverable.
// HEADTRICKS-YOU: one 1080x1080 bust cell per frame (HEAD_CELLS); tile the stills into the sheet with ffmpeg.
//   A  body front, head in profile (FigPose.head 'left'|'right')
//   B  front three-quarter at 20 and 35 deg: the kit turns the whole body (FigPose.quarter), there is no head-only three-quarter
//   C  head cock (FigPose.headCock, degrees): front -12/-6/+6/+12, puzzled (+10 with the eyes aside), hood up, back, profile
// HEADTRICKS-COCK: 3 s (90 f) curious cock 0 -> +10 -> hold -> 0, eased with a pose track (zcpaint/pose.ts `track`).
// `printf 'HEADTRICKS-YOU 0 out/headtricks/c00.png\n' | node scripts/stills.mjs src/painted/spike/parallax-index.ts`
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {drawFigure, type FigPose} from '../kit/cast';
import {EXPRESSIONS} from '../kit/expressions';
import {makePainter} from '../kit/painter';
import {track, type Key} from '../zcpaint/pose';
import {YOU2} from '../everyone-gone/ep02/places';
import {standing} from './ViewSheet';
import type {ViewName} from '../kit/views';

const PAPER = '#e9e6e0';
const UNIT = 1150;
type HeadCell = {label: string; name: ViewName; deg?: number; extra?: Partial<FigPose>};
export const HEAD_CELLS: HeadCell[] = [
  {label: 'A0 front, plain', name: 'front'},
  {label: 'A1 body front, head left', name: 'front', extra: {head: 'left'}},
  {label: 'A2 body front, head right', name: 'front', extra: {head: 'right'}},
  {label: 'A3 profile right (ref)', name: 'right'},
  {label: 'B1 front-left 20 (whole body)', name: 'front-left', deg: 20},
  {label: 'B2 front-left 35 (whole body)', name: 'front-left', deg: 35},
  {label: 'B3 front-right 20 (whole body)', name: 'front-right', deg: 20},
  {label: 'B4 front-right 35 (whole body)', name: 'front-right', deg: 35},
  {label: 'C1 cock -12', name: 'front', extra: {headCock: -12}},
  {label: 'C2 cock -6', name: 'front', extra: {headCock: -6}},
  {label: 'C3 cock +6', name: 'front', extra: {headCock: 6}},
  {label: 'C4 cock +12', name: 'front', extra: {headCock: 12}},
  {label: 'C5 puzzled: cock +10, eyes aside', name: 'front', extra: {headCock: 10, face: {...EXPRESSIONS.neutral, look: [-0.8, 0]}}},
  {label: 'C6 hood up, cock +10', name: 'front', extra: {headCock: 10, hoodUp: true}},
  {label: 'C7 back, cock +10', name: 'back', extra: {headCock: 10}},
  {label: 'C8 profile right, cock +10', name: 'right', extra: {headCock: 10}},
];

/** One bust: head top about 120 px from the cell top, body cropped by the cell. */
const bust = (extra: (pf: number) => Partial<FigPose>, name: ViewName, deg?: number) => ({brush, frame, t}: PaintContext) => {
  const p = makePainter(brush, {t, frame, fade: PAPER});
  const g: [number, number] = [540, 120 + YOU2.height * UNIT];
  drawFigure(p, YOU2, g, UNIT, {...standing(YOU2, name, g, UNIT, deg), ...extra(frame)}, t, YOU2.seed);
};

const Label = ({text}: {text: string}) => (
  <div style={{position: 'absolute', left: 24, bottom: 20, font: '600 40px/1.1 Helvetica, Arial, sans-serif', color: '#1c1c1c', background: 'rgba(233,230,224,0.85)', padding: '6px 12px'}}>{text}</div>
);

export const HeadTricksYou = () => {
  const frame = useCurrentFrame();
  const cell = HEAD_CELLS[Math.min(frame, HEAD_CELLS.length - 1)];
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <BrushCanvas paint={bust(() => ({...cell.extra, ...(cell.extra?.face ? {} : {face: EXPRESSIONS.neutral})}), cell.name, cell.deg)} paper={PAPER} />
      <Label text={cell.label} />
    </AbsoluteFill>
  );
};

export const COCK_FRAMES = 90;
/** Curious cock: hold upright, ease to +10 deg (0.8 s), hold 1 s, ease back (0.7 s), hold. */
const COCK_KEYS: Key<number>[] = [[0, 0], [10, 0], [34, 10, 'inOut'], [64, 10], [84, 0, 'inOut']];
const cockPaint = bust((pf) => ({headCock: track(COCK_KEYS, pf)}), 'front');
export const HeadCockClip = () => (
  <AbsoluteFill style={{background: PAPER}}>
    <BrushCanvas paint={cockPaint} paper={PAPER} />
  </AbsoluteFill>
);
