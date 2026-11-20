import {createElement, useCallback, type CSSProperties, type ReactNode} from 'react';
import {AbsoluteFill, Composition, getInputProps, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {STILL_CAMERA} from '../kit/camera';
import {makePainter, type Painter} from '../kit/painter';
import {Grain, NewsreelOverlay, newsreelFilter, newsreelWeave, type NewsreelTint} from '../kit/screen';
import {span} from '../sea';
import type {PaintedShot} from '../shot';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import type {V3} from '../kit/space';
import {horizonRow} from './paddock';
import {EDU30_SHOTS, FPS, lenOf} from './shots/index';
import {NewsreelTitle, TITLES} from './titles';

// EDU-EP30-SHORT plate adapter (Boss T03, 2026-11-19): one registered painted plate per shot from its `Shot30` (shot file
// src/painted/edu30/shots/<SHOT-ID>.tsx, one plate ticket each). Registry ID `EDU30-<shot id>`, no pre-roll; shot-local frame
// L = round(tl * 30) clamped to [0, N - 1]. The camera is animated inside `paint` (painted 3D camera), so the picture-stage camera is still.
//
// Screen order (`PlateStack`, no Grade since T03 r2: it sat under the opaque canvas): NewsreelPicture (the plate canvas, with the VD30-11 shake and the overscan scale on the canvas element
// only), NewsreelOverlay, Grain 0.06, the shot's `TITLES` cards. Captions, mark, label and caption shade are the Editor's.
//
// Registered plate (T34): `PaintedShot.canvasStyle` styles the shared canvas wrapper (filter, weave, shake, overscan) from `canvasStyleOf`, the same helper `PlateStack`
// uses, and `paint` uses the overscan-compensated `stackCam`; the registered Overlay adds NewsreelOverlay, Grain and titles.

export type Reel30 = {strength: number; tint: NewsreelTint; tintAmount?: number; tintMix?: number; pop?: number};
/** Shake offset on the plate canvas: px and rotation in degrees (VD30-11 step 5). */
export type Shake30 = {dx: number; dy: number; rot: number};
/** Lead probe: `lead(name, {top, bottom, x})` records a feet-to-head span in px (`left` / `right` add a width, for props). */
export type Probe30 = {lead: (name: string, a: {top: number; bottom: number; x?: number; left?: number; right?: number} | null) => void};

export type Shot30 = {
  id: string; N: number; paper: string;
  /** The shot camera at shot-local frame L (sheet camera line). */
  cam: (L: number) => YCam;
  /** Paint frame L through camera `c` (already overscan-compensated in the stack); `pr` collects lead anchors for the headless measure. */
  paint: (p: Painter, L: number, c: YCam, pr?: Probe30) => void;
  /** Newsreel grade at frame L. */
  reel: (L: number) => Reel30;
  /** Gunfire shake of the plate canvas element (never titles or overlay). */
  shake?: (L: number) => Shake30;
  /** B03-SH01 and B04-SH03 only: canvas scaled 1.05 about (540, 960), camera compensated so every projected point equals the sheet numbers. */
  overscan?: boolean;
  /** A word on the relief (the scroll) at frame L, drawn as DOM text inside the canvas wrapper (B07). */
  word?: (L: number) => Word30 | null;
};
export type Word30 = {at: V3; text: string; h: number};

/** A word on the relief (the scroll), projected: centred at the word's world point, cap height `h` metres. One home for look stills and plates. */
export const ReliefWord30 = ({cam, word}: {cam: YCam; word: Word30}) => {
  const w = word;
  const at = camPoint(cam, w.at), u = camUnit(cam, w.at);
  if (!at) return null;
  return <div style={{position: 'absolute', left: at[0] - 600, top: at[1] - w.h * u * 0.85, width: 1200, textAlign: 'center', fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700, fontSize: w.h * u * 1.35, letterSpacing: w.h * u * 0.25, color: '#5a3c1c', textShadow: `${0.01 * u}px ${0.012 * u}px 0 rgba(120,90,50,0.6)`}}>{w.text}</div>;
};
const WordOf = ({def, L}: {def: Shot30; L: number}) => { const w = def.word?.(L); return w ? <ReliefWord30 cam={stackCam(def, L)} word={w} /> : null; };

/** Default grade (VD30-01a). */
export const DEFAULT_REEL: Reel30 = {strength: 1, tint: 'warm', tintAmount: 1, pop: 0};
export const OVERSCAN = 1.05;
/** Every built shot def by shot ID (read by the headless measure and the QA entries). */
export const SHOT_DEFS: Record<string, Shot30> = {};

const DEG = Math.PI / 180;
/** A `YCam` from a sheet camera line: eye (m), yaw and pitch in degrees. */
export const camLine = (o: {eye: [number, number, number]; yaw: number; pitch?: number; f: number; hy: number}): YCam =>
  ({x: o.eye[0], y: o.eye[1], z: o.eye[2], yaw: o.yaw * DEG, pitch: (o.pitch ?? 0) * DEG, f: o.f, hy: o.hy});
/** Overscan compensation: f' = f / 1.05, hy' = 960 + (hy - 960) / 1.05. */
export const overscanCam = (c: YCam): YCam => ({...c, f: c.f / OVERSCAN, hy: 960 + (c.hy - 960) / OVERSCAN});
/** The camera the full stack paints with (compensated when the shot overscans). */
export const stackCam = (def: Pick<Shot30, 'cam' | 'overscan'>, L: number): YCam => (def.overscan ? overscanCam(def.cam(L)) : def.cam(L));

/** Stub plate body: sky wash and ground below the horizon row. */
export const stubPaint = (p: Painter, c: YCam) => {
  p.flat('#efe6d0', span(1080, -200, 2120));
  p.flat('#8a7253', span(1080, horizonRow(c), 2120));
};

/** The registered-plate frame index of a shot clock. */
export const frameOf = (tl: number, N: number) => Math.max(0, Math.min(N - 1, Math.round(tl * FPS)));

const GUIDE_BAND = {top: 1150, bottom: 1344}, GUIDE_LINE = 1100;

/** CSS of the plate canvas for shot-local frame L (global G): newsreel filter and weave, then shake, then overscan about (540, 960). One source for `PlateStack` and the registered plate (T34). */
export const canvasStyleOf = (def: Shot30, L: number, G: number): CSSProperties => {
  const r = {...DEFAULT_REEL, ...def.reel(L)}, sh = def.shake?.(L);
  const o = {frame: G, strength: r.strength, tint: r.tint, tintAmount: r.tintAmount, tintMix: r.tintMix, pop: r.pop};
  const weave = newsreelWeave(o).transform;
  return {transformOrigin: '540px 960px', filter: newsreelFilter(o),
    transform: [weave && weave !== 'none' ? weave : '', sh ? `translate(${sh.dx}px, ${sh.dy}px) rotate(${sh.rot}deg)` : '', def.overscan ? `scale(${OVERSCAN})` : ''].filter(Boolean).join(' ') || 'none'};
};

/** Newsreel picture (canvas), newsreel overlay, grain and titles for one plate frame; `canvas` is the BrushCanvas node. */
export const PlateStack = ({def, L, G, canvas}: {def: Shot30; L: number; G: number; canvas: ReactNode}) => {
  const r = {...DEFAULT_REEL, ...def.reel(L)};
  const o = {frame: G, strength: r.strength, tint: r.tint, tintAmount: r.tintAmount, tintMix: r.tintMix, pop: r.pop};
  return (
    <AbsoluteFill style={{backgroundColor: def.paper}}>
      <AbsoluteFill style={canvasStyleOf(def, L, G)}>{canvas}<WordOf def={def} L={L} /></AbsoluteFill>
      <NewsreelOverlay {...o} />
      <Grain opacity={0.06} />
      {TITLES.filter((t) => t.shot === def.id).map((t) => <NewsreelTitle key={t.in} text={t.text} frame={G} inFrame={t.in} outFrame={t.out} size={t.size} />)}
    </AbsoluteFill>
  );
};

/** QA frame: the full stack over a BrushCanvas, with the caption-band guides and the preview tag (input props `guides`, `tag`, default true). */
export const Plate30 = ({def, L, G}: {def: Shot30; L: number; G: number}) => {
  const props = getInputProps() as {guides?: boolean; tag?: boolean};
  const paint = useCallback(({brush}: PaintContext) => {
    const p = makePainter(brush, {t: L / FPS, frame: L, fade: def.paper});
    def.paint(p, L, stackCam(def, L));
  }, [def, L]);
  return (
    <AbsoluteFill style={{backgroundColor: def.paper}}>
      <PlateStack def={def} L={L} G={G} canvas={<BrushCanvas paint={paint} paper={def.paper} />} />
      {props.guides !== false && <>
        <div style={{position: 'absolute', left: 0, right: 0, top: GUIDE_BAND.top, height: GUIDE_BAND.bottom - GUIDE_BAND.top, borderTop: '2px dashed rgba(255,255,255,0.7)', borderBottom: '2px dashed rgba(255,255,255,0.7)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: GUIDE_LINE, height: 0, borderTop: '2px dashed rgba(255,230,120,0.8)'}} />
      </>}
      {props.tag !== false && <div style={{position: 'absolute', left: 24, top: 1850, font: '600 30px sans-serif', color: '#fff', textShadow: '0 0 4px #000'}}>{`${def.id} · G${G} · L${L} · EDU-EP30 preview`}</div>}
    </AbsoluteFill>
  );
};

/** Standalone proof entry composition (T04-T18): a def with its own id and length, shot-local clock = composition frame. */
export type ProofDef = {id: string; N: number; cam: (L: number) => YCam; paint: (p: Painter, L: number, c: YCam, pr?: Probe30) => void; reel?: (L: number) => Reel30};
const ProofFrame = ({d}: {d: ProofDef}) => {
  const L = useCurrentFrame();
  const def: Shot30 = {id: d.id, N: d.N, paper: '#efe6d0', cam: d.cam, paint: d.paint, reel: d.reel ?? (() => DEFAULT_REEL)};
  return <Plate30 def={def} L={L} G={L} />;
};
export const Proof30 = (d: ProofDef) => createElement(Composition, {key: d.id, id: d.id, component: () => <ProofFrame d={d} />, width: 1080, height: 1920, fps: FPS, durationInFrames: d.N});

export const makeShot = (def: Shot30): PaintedShot => {
  const N = lenOf(def.id);
  if (N !== def.N) throw new Error(`EDU30 ${def.id}: shot file N ${def.N} != index N ${N}`);
  SHOT_DEFS[def.id] = def;
  return {
    id: `EDU30-${def.id}`, serves: [def.id], paper: def.paper, camera: () => STILL_CAMERA,
    paint: (p, ctx) => { const L = frameOf(ctx.tl, N); def.paint(p, L, stackCam(def, L)); },
    canvasStyle: ({tl}) => { const L = frameOf(tl, N); return canvasStyleOf(def, L, rowStart(def.id) + L); },
    Overlay: ({opacity, tl}) => {
      const L = frameOf(tl, N), G = rowStart(def.id) + L, r = {...DEFAULT_REEL, ...def.reel(L)};
      const o = {frame: G, strength: r.strength, tint: r.tint, tintAmount: r.tintAmount, tintMix: r.tintMix, pop: r.pop};
      return (
        <div style={{position: 'absolute', inset: 0, opacity}}>
          {def.word && <AbsoluteFill style={canvasStyleOf(def, L, G)}><WordOf def={def} L={L} /></AbsoluteFill>}
              <NewsreelOverlay {...o} />
          <Grain opacity={0.06} />
          {TITLES.filter((t) => t.shot === def.id).map((t) => <NewsreelTitle key={t.in} text={t.text} frame={G} inFrame={t.in} outFrame={t.out} size={t.size} />)}
        </div>
      );
    },
  };
};
const rowStart = (id: string) => EDU30_SHOTS.find((s) => s.id === id)!.start;
