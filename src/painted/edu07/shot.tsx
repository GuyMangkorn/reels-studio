import type {ReactNode} from 'react';
import type {PaintedShot} from '../shot';
import {STILL_CAMERA} from '../kit/camera';
import type {Painter} from '../kit/painter';
import {FPS, lenOf, startOf, type ShotId} from './clock';

// EDU-EP07-SHORT shot adapter shared by the shot files (shots/<SHOT-ID>.tsx): registry ID `EDU7-<shot id>`, a still picture-stage camera (every camera
// is a world-metre yaw camera inside `paint`), shot-local frame L = round(tl * 30) and composition frame G = start + L. Shot files import this and
// the set modules; nothing imports a shot file except the inventory src/painted/shots/edu07.tsx.
export const edu7PlateId = (id: string) => `EDU7-${id}`;
export type ShotFns = {
  paper: string;
  paint: (p: Painter, L: number, G: number) => void;
  overlay?: (L: number, G: number) => ReactNode;
};
export const makeShot = (id: ShotId, f: ShotFns): PaintedShot => {
  const g0 = startOf(id), frameOf = (tl: number) => Math.round(tl * FPS);
  return {
    id: edu7PlateId(id), serves: [id], paper: f.paper, camera: () => STILL_CAMERA,
    paint: (p, ctx) => f.paint(p, frameOf(ctx.tl), g0 + frameOf(ctx.tl)),
    Overlay: f.overlay ? ({tl, opacity}) => <div style={{position: 'absolute', inset: 0, opacity}}>{f.overlay!(frameOf(tl), g0 + frameOf(tl))}</div> : undefined,
  };
};
export {lenOf, startOf};
