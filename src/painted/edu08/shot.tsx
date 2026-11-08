import type {ReactNode} from 'react';
import type {PaintedShot} from '../shot';
import {STILL_CAMERA, type Camera} from '../kit/camera';
import type {Painter} from '../kit/painter';
import {TimerRing} from '../kit/screen';
import {ringOpacity} from '../kit/timer-ring';
import {FPS, RING_SPEC, ringAt, lenOf, startOf, type ShotId} from './clock';

// EDU-EP08-SHORT shot adapter shared by the shot files (shots/<SHOT-ID>.tsx): registry ID `EDU8-<shot id>`, shot-local frame L = round(tl * 30), composition
// frame G = start + L. Every world camera is a yaw camera built inside `paint` (cameras of the sheets); the picture-stage camera is still unless a shot
// names one (the drop card push). Nothing imports a shot file except the inventory src/painted/shots/edu08.tsx.
export const edu8PlateId = (id: string) => `EDU8-${id}`;
export type ShotFns = {
  paper: string;
  paint: (p: Painter, L: number, G: number) => void;
  /** Screen-space layers (the ring is added by `ring` unless `ring: false`). */
  overlay?: (L: number, G: number) => ReactNode;
  camera?: (L: number) => Camera;
  /** Ring opacity override over L (default: fully visible when the shot has a ring). */
  ringOpacity?: (L: number) => number;
};
export const makeShot = (id: ShotId, f: ShotFns): PaintedShot => {
  const g0 = startOf(id), frameOf = (tl: number) => Math.round(tl * FPS), n = lenOf(id);
  const spec = RING_SPEC[id];
  const layers = (L: number, G: number) => (
    <>
      {f.overlay?.(L, G)}
      {spec && <TimerRing story={ringAt(id, L)} paused={!!spec.paused} opacity={f.ringOpacity ? f.ringOpacity(L) : 1} />}
    </>
  );
  return {
    id: edu8PlateId(id), serves: [id], paper: f.paper,
    camera: f.camera ? (tl) => f.camera!(Math.min(n - 1, frameOf(tl))) : () => STILL_CAMERA,
    paint: (p, ctx) => f.paint(p, frameOf(ctx.tl), g0 + frameOf(ctx.tl)),
    Overlay: spec || f.overlay ? ({tl, opacity}) => <div style={{position: 'absolute', inset: 0, opacity}}>{layers(frameOf(tl), g0 + frameOf(tl))}</div> : undefined,
  };
};
export {ringOpacity};
export {lenOf, startOf};
