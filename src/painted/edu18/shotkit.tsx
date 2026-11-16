import type {ReactNode} from 'react';
import {Easing} from 'remotion';
import {STILL_CAMERA} from '../kit/camera';
import type {Arm} from '../kit/cast';
import type {Pt} from '../kit/painter';
import type {PaintedShot} from '../shot';
import {PaintedStack, type Pass} from './stack';

// EDU-EP18-SHORT shot adapter (Editor, W5 draft, 16 Nov 2026). Registry ID `EDU18-<shot id>`; every shot is a pure function of the shot-local
// frame L (= round(tl * 30), clamped to the shot) and the composition frame G (= start + L, the ambient clock). The picture is a PaintedStack
// (back pass, WebGL hippo layer, front pass) mounted as the plate's `Overlay`; the timeline's own painted canvas (BrushCanvas, mounted by the
// shared PaintedStage) paints nothing for these plates, so the two p5.brush canvases never draw on the same frame. Captions and the channel
// mark are the timeline's. Staging numbers: scripts/edu-series/ep18/short/scene-sheets.md (EDU-EP18-SHEETS-R1.0) with the recorded deviations.

export const FPS = 30;
/** Shot table of the sheet's shot map: [shot ID, start G, length]. */
export const SHOT_TABLE: readonly [string, number, number][] = [
  ['B01-SH01', 0, 127], ['B01-SH02', 127, 36], ['B01-SH03', 163, 32], ['B01-SH04', 195, 46], ['B01-SH05', 241, 56],
  ['B02-SH01', 297, 36], ['B02-SH02', 333, 56], ['B02-SH03', 389, 119],
  ['B03-SH01', 508, 52], ['B03-SH02', 560, 54], ['B03-SH03', 614, 141], ['B03-SH04', 755, 60],
  ['B04-SH01', 815, 43], ['B04-SH02', 858, 41], ['B04-SH03', 899, 88], ['B04-SH04', 987, 90],
  ['B05-SH01', 1077, 64], ['B05-SH02', 1141, 62], ['B05-SH03', 1203, 178],
  ['B06-SH01', 1381, 51], ['B06-SH02', 1432, 69], ['B06-SH03', 1501, 86], ['B06-SH04', 1587, 71], ['B06-SH05', 1658, 214],
];
export const TOTAL = 1872;
export const startOf = (id: string) => SHOT_TABLE.find((s) => s[0] === id)![1];
export const lenOf = (id: string) => SHOT_TABLE.find((s) => s[0] === id)![2];
export const sceneId = (id: string) => `S0${id.startsWith('B01') || id.startsWith('B02') ? 1 : id.startsWith('B03') || id.startsWith('B04') ? 2 : 3}-${id}`;
export const edu18PlateId = (id: string) => `EDU18-${id}`;

export const ease = Easing.inOut(Easing.sin);
export const outCubic = Easing.out(Easing.cubic);
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** 0..1 progress of L over [a, b] through easing `e` (default easeInOutSine). */
export const k01 = (L: number, a: number, b: number, e: (x: number) => number = ease) => e(clamp((L - a) / (b - a)));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const lerpPt = (a: Pt, b: Pt, k: number): Pt => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
export const lerpArm = (a: Arm | undefined, b: Arm | undefined, k: number): Arm | undefined => {
  if (!a || !b) return k < 0.5 ? a : b;
  const hi = k >= 0.5 ? b : a;
  return {...hi, to: lerpPt(a.to, b.to, k), via: a.via && b.via ? lerpPt(a.via, b.via, k) : hi.via};
};

/** What a shot hands the adapter at one frame. */
export type Frame = {paper: string; back: Pass; front?: Pass; mid?: ReactNode; overlay?: ReactNode; grain?: number};
export type ShotFn = (L: number, G: number, N: number) => Frame;

export const makeShot = (id: string, fn: ShotFn): PaintedShot => {
  const g0 = startOf(id), n = lenOf(id);
  const frameOf = (tl: number) => clamp(Math.round(tl * FPS), 0, n - 1);
  const paper = fn(0, g0, n).paper;
  return {
    id: edu18PlateId(id), serves: [id], paper, camera: () => STILL_CAMERA,
    paint: () => undefined,
    Overlay: ({tl, opacity}) => {
      const L = frameOf(tl), f = fn(L, g0 + L, n);
      return (
        <div style={{position: 'absolute', inset: 0, opacity}}>
          <PaintedStack paper={f.paper} back={f.back} front={f.front} mid={f.mid} overlay={f.overlay} grain={f.grain} clock={g0 + L} guides={false} />
        </div>
      );
    },
  };
};
