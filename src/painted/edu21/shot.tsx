import type {ReactNode} from 'react';
import {STILL_CAMERA} from '../kit/camera';
import type {Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import type {PaintedShot} from '../shot';
import {FPS, lenOf, plateId, startOf} from './shots/index';

// EDU-EP21-SHORT plate adapter (Boss W5.2, 2026-11-16): one registered painted plate per shot from its `Edu21ShotDef` (shot file
// src/painted/edu21/shots/<SHOT-ID>.tsx). Registry ID `EDU21-<shot id>`; shot-local frame L = round(tl * 30), held at the shot's last frame
// past its length (hard cuts, DF-20261029-painted-timeline-dissolve). G = start + L is the composition clock that rain, wind and the far
// sky run on (seek-safe, DF-20261030-painted-story-hold-ambient-clock). The yaw camera lives inside `paint` (painted 3D camera), so the
// picture-stage camera is still. Overlay: the shot's own SVG/screen layers (flash, bloom, glow, chip), then the grain of the W3 look
// frames (0.05). Captions, the mark and the sound are the Editor's timeline. Nothing imports a shot file except src/painted/shots/edu21.tsx.

export type Edu21ShotDef = {
  id: string;
  /** Shot length in frames; must equal the index row (guards a stale shot file against a re-timed sheet). */
  N: number;
  paper: string;
  /** World marks for shot-local frame L (composition frame G). */
  paint: (p: Painter, L: number, G: number) => void;
  /** Screen layers for frame L (SVG flash, bloom, glow light, chip). */
  overlay?: (L: number, G: number) => ReactNode;
};

export const makeShot = (def: Edu21ShotDef): PaintedShot => {
  const N = lenOf(def.id), g0 = startOf(def.id);
  if (N !== def.N) throw new Error(`EDU21 ${def.id}: shot file N ${def.N} != index len ${N}`);
  const frameOf = (tl: number) => Math.max(0, Math.min(N - 1, Math.round(tl * FPS)));
  return {
    id: plateId(def.id), serves: [def.id], paper: def.paper, camera: () => STILL_CAMERA,
    paint: (p, ctx) => { const L = frameOf(ctx.tl); def.paint(p, L, g0 + L); },
    Overlay: ({opacity, tl}) => {
      const L = frameOf(tl);
      return (
        <div style={{position: 'absolute', inset: 0, opacity}}>
          {def.overlay?.(L, g0 + L)}
          <Grain opacity={0.05} />
        </div>
      );
    },
  };
};
