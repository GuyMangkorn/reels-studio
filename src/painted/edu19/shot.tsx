import {STILL_CAMERA} from '../kit/camera';
import {Grain} from '../kit/screen';
import type {PaintedShot} from '../shot';
import {GlowLayer} from './glow';
import {FPS, lenOf, plateId} from './shots/index';
import {paintFieldShot, type FieldShotDef} from './stage';

// EDU-EP19-SHORT plate adapter (Boss W5.3, 2026-11-15): one registered painted plate per shot from its `FieldShotDef` (shot file
// src/painted/edu19/shots/<SHOT-ID>.ts[x]). Registry ID `EDU19-<shot id>`; shot-local frame L = round(tl * 30), held at the shot's last frame past
// its length (hard cuts; any dissolve tail would hold, not run on). The yaw camera lives inside `paint` (painted 3D camera), so the picture-stage
// camera is still. Overlay: the scent glow (VD04 R2), the shot's own SVG layers, and the grain of the W3 look stills (opacity 0.04). Captions, the
// mark and the sound are the Editor's timeline. Nothing imports a shot file except the inventory src/painted/shots/edu19.tsx.
export const makeShot = (def: FieldShotDef): PaintedShot => {
  const N = lenOf(def.id);
  if (N !== def.N) throw new Error(`EDU19 ${def.id}: shot file N ${def.N} != index len ${N}`);
  const frameOf = (tl: number) => Math.max(0, Math.min(N - 1, Math.round(tl * FPS)));
  return {
    id: plateId(def.id), serves: [def.id], paper: '#cfe0e2', camera: () => STILL_CAMERA,
    paint: (p, ctx) => { const L = frameOf(ctx.tl); if (def.paint) def.paint(p, L); else paintFieldShot(p, def.cam(L), def.state(L)); },
    Overlay: ({opacity, tl}) => {
      const L = frameOf(tl), spots = def.glow?.(L);
      return (
        <div style={{position: 'absolute', inset: 0, opacity}}>
          {spots && spots.length > 0 && <GlowLayer cam={def.cam(L)} spots={spots} />}
          {def.overlay?.(L)}
          <Grain opacity={0.04} />
        </div>
      );
    },
  };
};
