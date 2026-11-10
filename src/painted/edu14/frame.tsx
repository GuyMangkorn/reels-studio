// EDU-EP14 shot frames (W5.2): one component per shot, a pure function of the shot-local frame `L = useCurrentFrame()` (the composition for a shot has the shot's
// length, so Editor's scene mounts it in a <Sequence> and Studio seeks it). A shot is a `ShotDef`: given L, the painted canvas function, the grade u (0..1, the
// no-air drain), picture-space children (graded: light pools, edge, calm band) and screen overlay (never graded: gauges, labels, diagram, glyphs).
import type {ReactNode} from 'react';
import {useCurrentFrame} from 'remotion';
import type {Painter} from '../kit/painter';
import {Painted} from './look';
import {SHOT_TABLE, type ShotId} from './clock';

export type ShotFrameDef = {paint: (p: Painter) => void; grade?: number; children?: ReactNode; overlay?: ReactNode; paper?: string; calm?: number};
export type ShotDef = (L: number) => ShotFrameDef;
export const SHOT_DEFS: Partial<Record<ShotId, ShotDef>> = {};
/** Registers a shot (called by the shot modules). */
export const defShot = (id: ShotId, def: ShotDef) => { SHOT_DEFS[id] = def; };

/** Compact caption patch strength per shot (0..1 blur-and-dim behind each caption's own rectangle, look.tsx `QuietPatches`): the least that keeps the caption-zone luma at mean <= 0.25, p95 <= 0.40
 * inside the caption rectangle on clean frames at 12/50/88 % of the shot (scripts/edu-series/ep14/caption-check.sh; EDU-EP14 R4.3 measure, out/qa/edu-ep14/r43/). Max 0.45. Only shots with a caption need it. */
export const CALM: Partial<Record<ShotId, number>> = {
  'S01-B01-SH01': 0.4, 'S01-B01-SH02': 0.45, 'S01-B01-SH03': 0.4, 'S01-B01-SH04': 0.3, 'S01-B01-SH05': 0.05, 'S01-B01-SH06': 0.45, 'S01-B01-SH07': 0.35, 'S01-B01-SH08': 0.35, 'S01-B01-SH09': 0.15, 'S01-B02-SH01': 0.45, 'S01-B02-SH02': 0.2, 'S01-B02-SH03': 0.25, 'S01-B03-SH01': 0.25, 'S01-B03-SH02': 0.3, 'S01-B03-SH03': 0.3, 'S01-B04-SH01': 0.35, 'S01-B04-SH02': 0.35, 'S01-B04-SH03': 0.4, 'S01-B05-SH01': 0.25, 'S01-B05-SH02': 0.4,
};

/** `band` (default true) draws the dashed caption-band guide (still hidden by the input prop `guides: false`); pass `band={false}` for a clean frame. The caption band itself is kept calm
 * by the shot's own `calm` (QuietPatches) and by keeping gauges, labels and bright set pieces out of the caption block (bottom edge y 1344). */
export const ShotFrame = ({id, band = true}: {id: ShotId; band?: boolean}) => {
  const L = useCurrentFrame(), d = SHOT_DEFS[id]!(L);
  return <Painted paint={(p) => d.paint(p)} paper={d.paper} grade={d.grade} overlay={d.overlay} band={band} calm={d.calm ?? CALM[id]} at={SHOT_TABLE.find(([i]) => i === id)![1] + L}>{d.children}</Painted>;
};
