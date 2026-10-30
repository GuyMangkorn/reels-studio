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
  'bloop-sh01': 216, 'bloop-sh02': 156, 'bloop-sh03': 96, 'bloop-sh04': 105, 'bloop-sh05': 165, 'bloop-sh06': 63, 'bloop-sh07': 102,
  'bloop-sh08': 150, 'bloop-sh09': 74, 'bloop-sh10': 46, 'bloop-sh11': 98, 'bloop-sh12': 196, 'bloop-sh13': 315,
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
  const paint = useCallback(({brush}: PaintContext) => drawPlate(brush, shot, {tl, fps, width, height}), [shot, tl, fps, width, height]);
  const Overlay = shot.Overlay;
  return (
    <AbsoluteFill style={{backgroundColor: shot.paper}}>
      <BrushCanvas paint={paint} paper={shot.paper} />
      {Overlay && <Overlay tl={tl} width={width} height={height} camera={shot.camera(tl)} opacity={1} />}
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
  scene(216, [cue('bloop-sh01', 0, {label: 'เสียงจริง เร่ง 16 เท่า'}), cue('bloop-sh01', sec(186), {fromSec: sec(186)})]),
  scene(156, [cue('bloop-sh02', 0, {dissolveSec: 0.6})]),
  scene(96, [cue('bloop-sh03', 0), cue('bloop-sh03', sec(32), {label: 'เสียงจริง เร่ง 16 เท่า', fromSec: sec(32)}), cue('bloop-sh03', sec(88), {fromSec: sec(88)})]),
  scene(105, [cue('bloop-sh04', 0, {label: 'ภาพประกอบ'})]),
  scene(165, [cue('bloop-sh05', 0)]),
  scene(63, [cue('bloop-sh06', 0, {dissolveSec: 0.6}), cue('bloop-sh06', sec(26), {label: 'จินตนาการ', fromSec: sec(26)})]),
  scene(102, [cue('bloop-sh07', 0, {label: 'จินตนาการ'})]),
  scene(150, [cue('bloop-sh08', 0)]),
  scene(74, [cue('bloop-sh09', 0)]),
  scene(46, [cue('bloop-sh10', 0, {label: 'ภาพประกอบ'})]),
  scene(98, [cue('bloop-sh11', 0, {label: 'จินตนาการ'}), cue('bloop-sh11', sec(49), {label: ['จินตนาการ', 'เสียงจำลอง'], fromSec: sec(49)}), cue('bloop-sh11', sec(67), {label: [null, 'เสียงจำลอง'], fromSec: sec(67)})]),
  scene(196, [cue('bloop-sh12', 0, {label: [null, 'เสียงจำลอง']}), cue('bloop-sh12', sec(29), {fromSec: sec(29)}), cue('bloop-sh12', sec(179), {label: 'เสียงจำลอง', fromSec: sec(179)})]),
  scene(315, [cue('bloop-sh13', 0), cue('bloop-sh13', sec(223), {label: 'จินตนาการ', fromSec: sec(223)}), cue('bloop-sh13', sec(312), {fromSec: sec(312)})]),
];

/** The sequence ends on the black frame; the label and caption clear with the picture (DEP07). */
export const BLOOP_QA_ID = 'BLOOP-QA-SEQUENCE';
