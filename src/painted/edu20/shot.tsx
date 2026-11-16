import {STILL_CAMERA} from '../kit/camera';
import {paintCabinBack, paintCabinFore, paintCabinPassenger, paintPassengerBelt, paintTetheredBalloon, roadStripAt} from '../kit/car-cabin';
import {makePainter, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import type {YCam} from '../kit/ycam';
import type {PaintedShot} from '../shot';
import {BALLOON, LOOKS, PASSENGER, ROAD_KEYS} from './cabin-look-data';
import type {CabinState} from './drive';
import {FPS, lenOf, plateId, startOf} from './shots/index';

// EDU-EP20-SHORT plate adapter (Editor W5.3, 2026-11-16; scene sheet EDU-EP20-SS-R3). One registered painted plate per shot file
// src/painted/edu20/shots/<SHOT-ID>.ts, registry ID `EDU20-<shot id>[<suffix>]`. Shot-local L = round(tl * 30), held at the last frame;
// G = shot start + L. The frame is the locked LF20-CABIN-B assembly (cabin-look.tsx `paint`, finished, seed base 20000) driven by the
// kit's acting inputs: `roadStripAt(G, ROAD_KEYS)` for the far window, lean/face for the passenger and belt, `u` for the tether.
// Ink boils on the composition frame G (every 2 frames) so a cut never restarts the boil; washes are still. The plate alpha of an
// in-canvas dissolve (B04-SH01) is carried into the painter. The YCam lives in `paint`; the picture-stage camera is still.

export type CabinShotDef = {
  id: string;
  N: number;
  cam: (L: number) => YCam;
  state: (L: number, G: number) => CabinState;
};

const B = LOOKS.B;
export const paintCabinFrame = (q: Painter, cam: YCam, s: CabinState, G: number) => {
  const p = makePainter(q.brush, {t: G / FPS, frame: G, alpha: q.alpha, seedBase: 20000, fade: B.palette.shell});
  // Paper-colour shell under the set (LF20-CABIN-B). A dissolving plate skips it: the stage already lays its paper at the plate alpha.
  if (q.alpha >= 1) p.flat(B.palette.shell, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
  paintCabinBack(p, cam, B.palette, PASSENGER, true, roadStripAt(G, ROAD_KEYS));
  paintCabinPassenger(p, cam, PASSENGER, G / FPS, true, {lean: s.lean, face: s.face, faceState: s.faceState});
  paintPassengerBelt(p, cam, PASSENGER, undefined, s.lean);
  paintTetheredBalloon(p, cam, BALLOON, true, s.u);
  paintCabinFore(p, cam, B.palette, true);
};

export const makeShot = (def: CabinShotDef, suffix = ''): PaintedShot => {
  const N = lenOf(def.id), start = startOf(def.id);
  if (N !== def.N) throw new Error(`EDU20 ${def.id}: shot file N ${def.N} != index len ${N}`);
  const frameOf = (tl: number) => Math.max(0, Math.min(N - 1, Math.round(tl * FPS)));
  return {
    id: plateId(def.id) + suffix, serves: [def.id], paper: B.palette.shell, camera: () => STILL_CAMERA,
    paint: (p, ctx) => { const L = frameOf(ctx.tl), G = start + L; paintCabinFrame(p, def.cam(L), def.state(L, G), G); },
    Overlay: ({opacity}) => <div style={{position: 'absolute', inset: 0, opacity}}><Grain opacity={0.07} /></div>,
  };
};
