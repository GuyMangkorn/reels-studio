// EDU-EP15 shot frames (W5.2): one component per shot, a pure function of the shot-local frame `L = useCurrentFrame()` (the composition for a shot has the shot's length,
// so Editor mounts it in a <Sequence> and Studio seeks it). A shot is a `ShotDef`: given L (and the global frame g for ambient clocks) it returns the painted canvas
// function, the imagined grade u (0..1, picture only), picture-space `children` (vignette, calm band: graded) and screen `overlay` (label, bubble frame: never graded).
import type {ReactNode} from 'react';
import {useCurrentFrame} from 'remotion';
import type {Painter} from '../kit/painter';
import {Painted} from './look';
import {shotStart, type ShotId} from './clock';

export type ShotFrameDef = {paint: (p: Painter) => void; grade?: number; /** Her-thought grade 0..1. */ thought?: number; children?: ReactNode; overlay?: ReactNode; paper?: string};
export type ShotDef = (L: number, g: number) => ShotFrameDef;
export const SHOT_DEFS: Partial<Record<ShotId, ShotDef>> = {};
/** Registers a shot (called by the shot modules). */
export const defShot = (id: ShotId, def: ShotDef) => { SHOT_DEFS[id] = def; };

/** `band` (default true) draws the dashed caption-band guide (also hidden by the input prop `guides: false`); pass `band={false}` for a clean frame. */
export const ShotFrame = ({id, band = true}: {id: ShotId; band?: boolean}) => {
  const L = useCurrentFrame(), d = SHOT_DEFS[id]!(L, shotStart(id) + L);
  return <Painted paint={(p) => d.paint(p)} paper={d.paper} grade={d.grade} thought={d.thought} overlay={d.overlay} band={band}>{d.children}</Painted>;
};
