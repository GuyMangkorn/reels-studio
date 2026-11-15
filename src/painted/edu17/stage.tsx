import type {ReactNode} from 'react';
import {STILL_CAMERA} from '../kit/camera';
import type {Painter} from '../kit/painter';
import type {PaintedShot} from '../shot';
import {FPS, lenOf, startOf, type ShotId} from './clock';

// EDU-EP17-SHORT shot adapter (Boss W5): registry ID `EDU17-<shot id>`, shot-local frame L = round(tl * 30), composition frame G = start + L. Shot files in
// shots/ build their camera, staging and motion from the scene sheet (EDU-EP17-SHEETS-R1.0); nothing imports a shot file except the inventory
// src/painted/shots/edu17.tsx. L is clamped to [-3, N+2]; R1.2 dissolves start at the cut (G132-138, G164-170), so the outgoing plate runs L N..N+2 and then holds N+2.
// Screen layers (LBL, CARD, reconstruction grade, captions, mark) belong to the timeline (Editor); `recon` only tells the stills entry to preview the grade.

export const edu17PlateId = (id: string) => `EDU17-${id}`;
export type ShotFns = {
  paper: string;
  /** Paint the picture at shot-local frame L (of N), composition frame G. */
  paint: (p: Painter, L: number, G: number, N: number) => void;
  /** Remotion layer above the canvas (not graded). */
  overlay?: (L: number, N: number) => ReactNode;
  /** Stills preview only: the shot sits under the reconstruction grade on the timeline. */
  recon?: boolean;
};
export const RECON: Record<string, boolean> = {};
export const makeShot = (id: ShotId, f: ShotFns): PaintedShot => {
  const g0 = startOf(id), n = lenOf(id), frameOf = (tl: number) => Math.max(-3, Math.min(n + 2, Math.round(tl * FPS)));
  if (f.recon) RECON[edu17PlateId(id)] = true;
  return {
    id: edu17PlateId(id), serves: [id], paper: f.paper, camera: () => STILL_CAMERA,
    paint: (p, ctx) => f.paint(p, frameOf(ctx.tl), g0 + frameOf(ctx.tl), n),
    ...(f.overlay ? {Overlay: ({tl, opacity}) => <div style={{position: 'absolute', inset: 0, opacity}}>{f.overlay!(frameOf(tl), n)}</div>} : {}),
  };
};
