import type {ReactNode} from 'react';
import {STILL_CAMERA} from '../kit/camera';
import type {Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import type {PaintedShot} from '../shot';
import {FPS, lenOf, startOf, type ShotId} from './clock';

// EDU-EP16-SHORT shot adapter shared by the shot files (shots/<SHOT-ID>.tsx; Boss W5.2, 2026-11-15): registry ID `EDU16-<shot id>`, shot-local frame
// L = round(tl * 30), composition frame G = start + L. Every camera is a yaw camera built inside `paint` from the timed sheet (EDU-EP16-SHEETS-R2);
// the picture-stage camera is still. L runs past the shot's length while the next plate dissolves over it (`painted.shots[].dissolveSec`), so every
// shot paints any L >= 0. The label "ภาพจำลอง", captions and the mark are the timeline's (Editor); the plate overlay only carries the grain of the W3
// look stills (opacity 0.05). Nothing imports a shot file except the inventory src/painted/shots/edu16.tsx.
export const edu16PlateId = (id: string) => `EDU16-${id}`;
export type ShotFns = {paper: string; paint: (p: Painter, L: number, G: number) => void; /** W5.2 r3: DOM layer under the grain at shot frame L (SH22 logbook rows) */ overlay?: (L: number) => ReactNode};
export const makeShot = (id: ShotId, f: ShotFns): PaintedShot => {
  const g0 = startOf(id), frameOf = (tl: number) => Math.max(0, Math.round(tl * FPS));
  void lenOf;
  return {
    id: edu16PlateId(id), serves: [id], paper: f.paper, camera: () => STILL_CAMERA,
    paint: (p, ctx) => f.paint(p, frameOf(ctx.tl), g0 + frameOf(ctx.tl)),
    Overlay: ({opacity, tl}) => <div style={{position: 'absolute', inset: 0, opacity}}>{f.overlay?.(frameOf(tl))}<Grain opacity={0.05} /></div>,
  };
};
