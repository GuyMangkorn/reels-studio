import type {ReactNode} from 'react';
import {STILL_CAMERA} from '../kit/camera';
import {Hands3D} from '../kit/hand3d';
import type {Painter} from '../kit/painter';
import {CaptionShade, Grain} from '../kit/screen';
import type {YCam} from '../kit/ycam';
import type {PaintedShot} from '../shot';
import {CAPTION_SCALE, shadeCuesFor, shadeStrengthFor} from './captions26';
import type {Layer3D} from './r4-looks';
import {FPS, lenOf, plateId, rowOf} from './shots/index';
import type {Probe26} from './stage26';

// EDU-EP26-SHORT plate adapter (Boss W5.2, 2026-11-18): one registered painted plate per shot from its `Shot26` (shot file
// src/painted/edu26/shots/<SHOT-ID>.tsx). Registry ID `EDU26-<shot id>`; shot-local frame L = round(tl * 30) - pre, clamped to the shot (a plate
// shown past its length holds its last frame, B03-SH06 under the time-passing dissolve). The yaw camera is animated inside `paint` (painted 3D
// camera), so the picture-stage camera is still. Overlay: the shot's five-finger 3D hands and 3D coin (`Hands3D`, same per-frame camera; UT14
// exception shots only: B02-SH04, B05-SH01, B06-SH02, B06-SH03, B06-SH04), the coin push / flip disc (B05-SH01 end, B06-SH01 start) and the
// grain of the R4 look stills (0.08), and the Editor's cue-gated caption shade (W5, 2026-11-19: `CaptionShade` band under the caption block,
// cards and strength from ./captions26; the caption text itself, the mark, the story label and the sound are the Editor's timeline).

export const WORKSHOP_PAPER = '#d9a65c', PALACE_PAPER = '#9b2f25', STREET_PAPER = '#34508a';
/** A full-frame coin disc drawn over the plate (screen px centre, diameter, rotateY degrees, opacity; `back` = the reverse rim only). */
export type CoinDisc = {cx: number; cy: number; d: number; rot: number; op: number; back?: boolean};
export type Shot26 = {
  id: string; N: number; paper?: string;
  /** The shot camera at shot-local frame L (sheet camera line). */
  cam: (L: number) => YCam;
  /** Paint frame L through camera `c`; `pr` collects lead anchors for the headless measure. */
  paint: (p: Painter, L: number, c: YCam, pr?: Probe26) => void;
  /** Five-finger 3D hands and props at frame L (same camera). */
  hands?: (L: number, c: YCam) => Layer3D[];
  /** DOM effects over the plate at frame L (the coin push / flip disc, the coin's lamp glint). */
  fx?: (L: number, c: YCam) => ReactNode;
  /** Screen-space marks after the world (the whip-pan streaks). */
  screen?: (p: Painter, L: number) => void;
  /** Picture crossfade when this plate dissolves in (`PaintedShot.crossfade`). */
  crossfade?: boolean;
};
/** Every built shot def by shot ID (filled as the inventory loads; read by the headless measure and the stills entry). */
export const SHOT_DEFS: Record<string, Shot26> = {};

const BRONZE = 'radial-gradient(circle at 38% 34%, #f6d892 0%, #d9a24c 30%, #b07a30 62%, #7d5420 86%, #5e3d16 100%)';
export const CoinLayer = ({c}: {c: CoinDisc}) => (
  <div style={{position: 'absolute', inset: 0, perspective: 1400, overflow: 'hidden', opacity: c.op}}>
    <div style={{position: 'absolute', left: c.cx - c.d / 2, top: c.cy - c.d / 2, width: c.d, height: c.d, borderRadius: '50%',
      transform: `rotateY(${c.rot}deg)`, background: c.back ? 'transparent' : BRONZE,
      border: `${Math.max(2, c.d * 0.035)}px solid #6e4a1c`, boxShadow: c.back ? 'none' : `inset 0 0 ${c.d * 0.06}px rgba(60,36,10,0.7)`}}>
      {!c.back && <div style={{position: 'absolute', inset: '12%', borderRadius: '50%', border: `${Math.max(1, c.d * 0.012)}px solid rgba(110,74,28,0.55)`}} />}
    </div>
  </div>
);

export const makeShot = (def: Shot26): PaintedShot => {
  const N = lenOf(def.id), pre = rowOf(def.id).pre ?? 0;
  if (N !== def.N) throw new Error(`EDU26 ${def.id}: shot file N ${def.N} != index len ${N}`);
  SHOT_DEFS[def.id] = def;
  const frameOf = (tl: number) => Math.max(-pre, Math.min(N - 1, Math.round(tl * FPS) - pre));
  return {
    id: plateId(def.id), serves: [def.id], paper: def.paper ?? WORKSHOP_PAPER, camera: () => STILL_CAMERA, crossfade: def.crossfade,
    paint: (p, ctx) => { const L = frameOf(ctx.tl); def.paint(p, L, def.cam(L)); },
    ...(def.screen ? {screen: (p: Painter, ctx: {tl: number}) => def.screen!(p, frameOf(ctx.tl))} : {}),
    Overlay: ({opacity, tl}) => {
      const L = frameOf(tl), c = def.cam(L), layers = def.hands?.(L, c) ?? [];
      return (
        <div style={{position: 'absolute', inset: 0, opacity}}>
          {layers.map((l, i) => <div key={i} style={{position: 'absolute', inset: 0}}><Hands3D cam={l.cam} arms={l.arms} props={l.props} occluders={l.occluders} /></div>)}
          {def.fx?.(L, c)}
          <CaptionShade tl={tl} cues={shadeCuesFor(def.id)} strength={shadeStrengthFor(def.id)} bottomEdgeY={1344} scale={CAPTION_SCALE} />
          <Grain opacity={0.08} />
        </div>
      );
    },
  };
};
