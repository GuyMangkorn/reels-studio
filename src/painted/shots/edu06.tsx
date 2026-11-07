import {AbsoluteFill} from 'remotion';
import type {PaintedShot} from '../shot';
import {STILL_CAMERA} from '../kit/camera';
import {Grain} from '../kit/screen';
import {EDU6_SHOTS, plateOf, type Edu6ShotId} from '../edu06/plates';

// EDU-EP06-SHORT timeline adapter, Editor W5.3 (7 Nov 2026). One registry plate per shot, ID `EDU6-<shot id>`, wrapping the pure plate of
// src/painted/edu06/plates.tsx (shot-local frame L = plate frame). Screen layers (room light, glare veil, motes, grain) come back through `Overlay`.
const FPS = 30;
const frameOf = (tl: number) => Math.round(tl * FPS);
export const edu6PlateId = (id: string) => `EDU6-${id}`;

export const edu06Shots: PaintedShot[] = EDU6_SHOTS.map(([id]): PaintedShot => ({
  id: edu6PlateId(id),
  serves: [id],
  paper: plateOf(id as Edu6ShotId).paper,
  camera: () => STILL_CAMERA,
  paint: (p) => plateOf(id as Edu6ShotId).paint(p, p.frame),
  Overlay: ({tl, opacity}) => (
    <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
      {plateOf(id as Edu6ShotId).overlay(frameOf(tl))}
      <Grain opacity={0.08} />
    </AbsoluteFill>
  ),
}));
