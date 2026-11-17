import {STILL_CAMERA} from '../kit/camera';
import type {Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import type {YCam} from '../kit/ycam';
import type {PaintedShot} from '../shot';
import {GlintLayer, type Glint} from './glints';
import {FPS, lenOf, plateId} from './shots/index';
import type {Probe} from './stage';

// EDU-EP22-SHORT plate adapter (Boss W5.1, 2026-11-16): one registered painted plate per shot from its `Shot22` (shot file
// src/painted/edu22/shots/<SHOT-ID>.ts). Registry ID `EDU22-<shot id>`; shot-local frame L = round(tl * 30), held at the shot's last frame past its
// length (hard cuts only). The yaw camera lives inside `paint` (painted 3D camera), so the picture-stage camera is still. Overlay: the N7 checkpoint
// glints (world-locked through the same camera) and the grain of the W3 look stills (opacity 0.04). Captions, the mark and the sound are the
// Editor's timeline. Nothing imports a shot file except the inventory src/painted/shots/edu22.tsx.

export const HALL_PAPER = '#d9c7a6';
export const DEMO_PAPER = '#a9aeb3';
export type Shot22 = {
  id: string; N: number; paper?: string;
  /** The shot camera at shot-local frame L (sheet camera line). */
  cam: (L: number) => YCam;
  /** Paint frame L through camera `c`; `pr` collects lead anchors for the headless measure. */
  paint: (p: Painter, L: number, c: YCam, pr?: Probe) => void;
  glints?: (L: number) => Glint[];
};
/** Every built shot def by shot ID (filled as the inventory loads; read by the headless measure and the stills entry). */
export const SHOT_DEFS: Record<string, Shot22> = {};
export const makeShot = (def: Shot22): PaintedShot => {
  const N = lenOf(def.id);
  if (N !== def.N) throw new Error(`EDU22 ${def.id}: shot file N ${def.N} != index len ${N}`);
  SHOT_DEFS[def.id] = def;
  const frameOf = (tl: number) => Math.max(0, Math.min(N - 1, Math.round(tl * FPS)));
  return {
    id: plateId(def.id), serves: [def.id], paper: def.paper ?? HALL_PAPER, camera: () => STILL_CAMERA,
    paint: (p, ctx) => { const L = frameOf(ctx.tl); def.paint(p, L, def.cam(L)); },
    Overlay: ({opacity, tl}) => {
      const L = frameOf(tl), g = def.glints?.(L);
      return (
        <div style={{position: 'absolute', inset: 0, opacity}}>
          {g && g.length > 0 && <GlintLayer cam={def.cam(L)} glints={g} />}
          <Grain opacity={0.04} />
        </div>
      );
    },
  };
};
