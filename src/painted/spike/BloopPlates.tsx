import {useCallback} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import '../../scenes/Subtitles'; // side effect: loads the Noto Sans Thai face for the diagram tags
import type {Timeline} from '../../scenes/types';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {drawPlate} from '../plate';
import {bloopShots} from '../shots/bloop';
import type {PaintedShot} from '../shot';

// BLOOP plate QA (Boss, 2026-10-30): each DEP01 plate alone through `drawPlate` and its own Overlay, and one QA-only
// sequence through SceneRenderer with the sheets' label and ending mapping (DEP03, DEP04). Spike entry only: not the
// episode assembly (Editor owns the timeline), not registered in src/Root.tsx.

/** Shot-local frame counts from the sheets (G ranges in BLOOP-SHEETS-R3). */
export const PLATE_FRAMES: Record<string, number> = {
  'bloop-sh01': 224, 'bloop-sh02': 175, 'bloop-sh03': 119, 'bloop-sh04': 166, 'bloop-sh05': 165, 'bloop-sh06': 70, 'bloop-sh07': 114,
  'bloop-sh08': 171, 'bloop-sh09': 63, 'bloop-sh10': 62, 'bloop-sh11': 117, 'bloop-sh12': 250, 'bloop-sh13': 431,
};

const plateOf = (id: string): PaintedShot => {
  const shot = bloopShots.find((s) => s.id === id);
  if (!shot) throw new Error(`no BLOOP plate ${id}`);
  return shot;
};

/** One plate on its own canvas, with a burned-in preview label (shot ID, deliverable, plate frame; docs/boss-asset-workflow.md#preview-labels). */
export const BloopPlate = ({id, note}: {id: string; note: string}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const shot = plateOf(id);
  const tl = frame / fps;
  // the overlay and its camera take the shot clock too (PaintedStage does the same); drawPlate applies it to the paint
  const ctl = shot.clock ? shot.clock(tl) : tl;
  const paint = useCallback(({brush}: PaintContext) => drawPlate(brush, shot, {tl, fps, width, height}), [shot, tl, fps, width, height]);
  const Overlay = shot.Overlay;
  return (
    <AbsoluteFill style={{backgroundColor: shot.paper}}>
      <BrushCanvas paint={paint} paper={shot.paper} />
      {Overlay && <Overlay tl={ctl} width={width} height={height} camera={shot.camera(ctl)} opacity={1} />}
      <div style={{position: 'absolute', left: 24, top: 18, right: 24, fontFamily: 'Noto Sans Thai, sans-serif', fontSize: 24, lineHeight: 1.25, color: '#fff', WebkitTextStroke: '4px #111', paintOrder: 'stroke fill'}}>
        <b>{shot.serves.join(', ')}</b> · BLOOP-EP01-SHORT · plate {id} [f{frame}] · {note}
      </div>
    </AbsoluteFill>
  );
};

/**
 * QA-only sequence: one painted scene per plate, cues from the index's planned runtime mapping (Editor replaces this
 * when it assembles the episode). Labels with two slots follow DEP03; `A_fade` with no hold and no composition fade
 * (DEP04) lets SH13 run to its black (DEP07).
 */
const cue = (shot: string, atSec: number, extra: Record<string, unknown> = {}) => ({shot, atSec, ...extra});
const sec = (f: number) => f / 30;
const scene = (durationFrames: number, shots: ReturnType<typeof cue>[]): Timeline[number] => ({durationSec: durationFrames / 30, bg: 'none', actors: [], subtitle: '', painted: {shots}} as Timeline[number]);
export const bloopQaTimeline: Timeline = [
  // BLOOP-SHEETS-R8 shot lengths and in-shot cues (index.md cue table, G − shot start)
  scene(224, [cue('bloop-sh01', 0, {label: 'เสียงจริง เร่ง 16 เท่า'}), cue('bloop-sh01', sec(186), {fromSec: sec(186)})]),
  scene(175, [cue('bloop-sh02', 0, {dissolveSec: 0.6})]),
  scene(119, [cue('bloop-sh03', 0), cue('bloop-sh03', sec(62), {label: 'เสียงจริง เร่ง 16 เท่า', fromSec: sec(62)}), cue('bloop-sh03', sec(111), {fromSec: sec(111)})]),
  scene(166, [cue('bloop-sh04', 0, {label: 'ภาพประกอบ'})]),
  scene(165, [cue('bloop-sh05', 0)]),
  scene(70, [cue('bloop-sh06', 0, {dissolveSec: 0.6}), cue('bloop-sh06', sec(22), {label: 'จินตนาการ', fromSec: sec(22)})]),
  scene(114, [cue('bloop-sh07', 0, {label: 'จินตนาการ'})]),
  scene(171, [cue('bloop-sh08', 0)]),
  scene(63, [cue('bloop-sh09', 0)]),
  scene(62, [cue('bloop-sh10', 0, {label: 'ภาพประกอบ'})]),
  scene(117, [cue('bloop-sh11', 0, {label: 'จินตนาการ'}), cue('bloop-sh11', sec(40), {label: ['จินตนาการ', 'เสียงจำลอง'], fromSec: sec(40)}), cue('bloop-sh11', sec(58), {label: [null, 'เสียงจำลอง'], fromSec: sec(58)})]),
  scene(250, [cue('bloop-sh12', 0, {label: [null, 'เสียงจำลอง']}), cue('bloop-sh12', sec(1), {fromSec: sec(1)}), cue('bloop-sh12', sec(213), {label: 'เสียงจำลอง', fromSec: sec(213)}), cue('bloop-sh12', sec(233), {fromSec: sec(233)})]),
  scene(431, [cue('bloop-sh13', 0), cue('bloop-sh13', sec(218), {label: 'จินตนาการ', fromSec: sec(218)}), cue('bloop-sh13', sec(401), {fromSec: sec(401)})]),
];

/** The sequence ends on the black frame; the label and caption clear with the picture (DEP07). */
export const BLOOP_QA_ID = 'BLOOP-QA-SEQUENCE';
