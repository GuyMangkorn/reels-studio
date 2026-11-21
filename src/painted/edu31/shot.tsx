import {createElement, useCallback, type CSSProperties, type ReactNode} from 'react';
import {AbsoluteFill, Composition, getInputProps, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {STILL_CAMERA} from '../kit/camera';
import {Hands3D, type Hand3DArm, type Occluder3D, type Prop3D} from '../kit/hand3d';
import {makePainter, type Painter, type Pt} from '../kit/painter';
import {Grain} from '../kit/screen';
import type {YCam} from '../kit/ycam';
import type {PaintedShot} from '../shot';
import {FlashWash, PoolLayer, TagPlate, VignetteLayer, WorldTexts, type Pool31, type Tag31} from './overlay31';
import type {WorldText} from './set31';
import {FPS, lenOf, plateId} from './shots/index';

// EDU-EP31-SHORT plate adapter (Boss W5.2 batch 1, 2026-11-21): one registered painted plate per shot from its `Shot31` (shot file
// src/painted/edu31/shots/<SHOT-ID>.tsx). Registry ID `EDU31-<shot id>`, no pre-roll; shot-local frame L = round(tl * 30) clamped to [0, N - 1].
// The yaw camera is animated inside `paint` (painted 3D camera), so the picture-stage camera is still.
//
// Screen order over the canvas (the look-frame order of look.tsx, one home in overlay31.tsx): optional canvas filter (whip blur), world text
// (signage), five-finger 3D hands (`Hands3D`, POV and hand inserts only), the lamp pool, DOM effects (`fx`: flash wash), the vignette, grain 0.05,
// then the VD31-19 joke label on top (above every picture layer, below the Editor's chrome). Captions, the @TamMaiLa mark, the reconstruction
// label (VD31-17), caption shade and sound are the Editor's timeline.

/** Lead probe: `lead(name, {top, bottom, x})` records a span in px (`left` / `right` add a width, for props). */
export type Probe31 = {lead: (name: string, a: {top: number; bottom: number; x?: number; left?: number; right?: number} | null) => void};
/** One Hands3D layer through the shot camera. */
export type Layer3D = {arms: Hand3DArm[]; props?: Prop3D[]; occluders?: Occluder3D[]};

export type Shot31 = {
  id: string; N: number; paper: string;
  /** The shot camera at shot-local frame L (sheet camera line). */
  cam: (L: number) => YCam;
  /** Paint frame L through camera `c`; `pr` collects lead anchors for the headless measure. */
  paint: (p: Painter, L: number, c: YCam, pr?: Probe31) => void;
  /** Screen-space marks after the world (the whip smear). */
  screen?: (p: Painter, L: number) => void;
  /** CSS filter on the canvas at frame L (whip blur), absent = none. */
  filter?: (L: number) => string | undefined;
  /** World signage drawn as DOM text through the camera. */
  texts?: WorldText[];
  /** Picture polygons a nearer figure covers at frame L: the DOM signage is cut out there (evenodd clip), so a plaque passes behind him. */
  textMask?: (L: number, c: YCam) => Pt[][];
  /** Five-finger 3D hands at frame L (same camera). */
  hands?: (L: number, c: YCam) => Layer3D[];
  /** Lamp pool at frame L (picture px; usually a projected lamp point). */
  pool?: (L: number, c: YCam) => Pool31 | null;
  /** Off-frame flash wash opacity at frame L (B03-SH02). */
  flash?: (L: number) => number;
  vignette?: number;
  /** VD31-19 joke label at frame L with its pop 0..1, or null. */
  tag?: (L: number) => {tag: Tag31; pop: number} | null;
};
/** Every built shot def by shot ID (read by the headless measure and the QA entries). */
export const SHOT_DEFS: Record<string, Shot31> = {};

/** The registered-plate frame index of a shot clock. */
export const frameOf = (tl: number, N: number) => Math.max(0, Math.min(N - 1, Math.round(tl * FPS)));

const GUIDE_BAND = {top: 1100, bottom: 1344};

/** DOM layers over the canvas for frame L (camera `c`). */
export const PlateLayers = ({def, L, c}: {def: Shot31; L: number; c: YCam}) => {
  const pool = def.pool?.(L, c), fl = def.flash?.(L) ?? 0, tg = def.tag?.(L);
  return (
    <>
      {def.texts && (() => {
        const holes = def.textMask?.(L, c) ?? [];
        const clip = holes.length ? `path(evenodd, "M0 0H1080V1920H0Z ${holes.map((h) => `M${h.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}Z`).join(' ')}")` : undefined;
        return <div style={{position: 'absolute', inset: 0, clipPath: clip}}><WorldTexts cam={c} texts={def.texts} /></div>;
      })()}
      {(def.hands?.(L, c) ?? []).map((l, i) => <div key={`h${i}`} style={{position: 'absolute', inset: 0}}><Hands3D cam={c} arms={l.arms} props={l.props} occluders={l.occluders} /></div>)}
      {pool && <PoolLayer pool={pool} />}
      {fl > 0 && <FlashWash op={fl} />}
      {def.vignette ? <VignetteLayer amount={def.vignette} /> : null}
      <Grain opacity={0.05} />
      {tg && <TagPlate tag={tg.tag} pop={tg.pop} />}
    </>
  );
};
const canvasStyle = (def: Shot31, L: number): CSSProperties => { const f = def.filter?.(L); return f ? {filter: f} : {}; };

/** QA frame: canvas plus layers, the caption-band guides and the preview tag (input props `guides`, `tag`, default true). */
export const Plate31 = ({def, L, G}: {def: Shot31; L: number; G: number}) => {
  const props = getInputProps() as {guides?: boolean; tag?: boolean};
  const c = def.cam(L);
  const paint = useCallback(({brush}: PaintContext) => {
    const p = makePainter(brush, {t: L / FPS, frame: L, fade: def.paper});
    def.paint(p, L, def.cam(L));
    if (def.screen) def.screen(p, L);
  }, [def, L]);
  return (
    <AbsoluteFill style={{backgroundColor: def.paper}}>
      <AbsoluteFill style={canvasStyle(def, L)}><BrushCanvas paint={paint} paper={def.paper} /></AbsoluteFill>
      <PlateLayers def={def} L={L} c={c} />
      {props.guides !== false && <div style={{position: 'absolute', left: 0, right: 0, top: GUIDE_BAND.top, height: GUIDE_BAND.bottom - GUIDE_BAND.top, borderTop: '2px dashed rgba(255,255,255,0.7)', borderBottom: '2px dashed rgba(255,255,255,0.7)'}} />}
      {props.tag !== false && <div style={{position: 'absolute', left: 24, top: 1850, font: '600 30px sans-serif', color: '#fff', textShadow: '0 0 4px #000'}}>{`${def.id} · F${G} · f${L} · EDU-EP31 preview (SCENE-R1)`}</div>}
    </AbsoluteFill>
  );
};

/** Standalone proof composition: a def with its own id and length, shot-local clock = composition frame. */
export const Proof31 = (d: Shot31) => createElement(Composition, {key: d.id, id: d.id, component: () => { const L = useCurrentFrame(); return <Plate31 def={d} L={L} G={L} />; }, width: 1080, height: 1920, fps: FPS, durationInFrames: d.N});

export const makeShot = (def: Shot31): PaintedShot => {
  const N = lenOf(def.id);
  if (N !== def.N) throw new Error(`EDU31 ${def.id}: shot file N ${def.N} != index N ${N}`);
  SHOT_DEFS[def.id] = def;
  return {
    id: plateId(def.id), serves: [def.id], paper: def.paper, camera: () => STILL_CAMERA,
    paint: (p, ctx) => { const L = frameOf(ctx.tl, N); def.paint(p, L, def.cam(L)); },
    ...(def.screen ? {screen: (p: Painter, ctx: {tl: number}) => def.screen!(p, frameOf(ctx.tl, N))} : {}),
    ...(def.filter ? {canvasStyle: ({tl}: {tl: number}) => canvasStyle(def, frameOf(tl, N))} : {}),
    Overlay: ({opacity, tl}): ReactNode => {
      const L = frameOf(tl, N);
      return <div style={{position: 'absolute', inset: 0, opacity}}><PlateLayers def={def} L={L} c={def.cam(L)} /></div>;
    },
  };
};
