import {AbsoluteFill} from 'remotion';
import type {PaintedShot} from '../shot';
import {STILL_CAMERA} from '../kit/camera';
import {Grain} from '../kit/screen';
import {flatPainter} from '../edu02/flat';
import {EDU2_DISSOLVES, EDU2_SHOTS, plateOf, type Edu2ShotId} from '../edu02/shots';

// EDU-EP02-SHORT (SS-R2) timeline adapter, Editor W5.3 (5 Nov 2026). One registry plate per shot, ID `EDU2-<shot id>`, wrapping the pure
// `plateOf(id, f)` of src/painted/edu02/shots.tsx (Boss W5.2). Scenes select IDs; no shot is re-implemented here. The timeline needs the one
// shared BrushCanvas of PaintedStage, so the plate's screen layers (the set's grade and the paper grain, as in `ShotPlate`) come back through `Overlay`.
// A plate painted past its length (the outgoing plate of the B02-SH02 -> B03-SH01 dissolve) is held on its last frame by `plateOf`.

const FPS = 30;
const frameOf = (tl: number) => Math.round(tl * FPS);
// W6: the plate paints with the Draft's flat fills (src/painted/edu02/flat.ts). The rebuilt painter keeps drawPlate's ink fade colour,
// PaintedStage's first plate paper: the outgoing plate's paper for the incoming plate of a dissolve, else the plate's own.
const fadeOf = (id: Edu2ShotId) => plateOf(EDU2_DISSOLVES.find(([, to]) => to === id)?.[0] ?? id, 0).paper;
export const edu2PlateId = (id: string) => `EDU2-${id}`;

export const edu02Shots: PaintedShot[] = EDU2_SHOTS.map(([id]): PaintedShot => ({
  id: edu2PlateId(id),
  serves: [id],
  paper: plateOf(id, 0).paper,
  camera: () => STILL_CAMERA,
  paint: (p) => plateOf(id, p.frame).paint(flatPainter(p, fadeOf(id))),
  Overlay: ({tl, opacity}) => (
    <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
      <AbsoluteFill style={{background: plateOf(id, frameOf(tl)).grade}} />
      <Grain opacity={0.1} />
    </AbsoluteFill>
  ),
}));
