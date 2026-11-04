import type {PaintedShot} from '../shot';
import {EDU1_SHOTS, FPS, PlateLayers, plateOf} from '../edu01/plates';

// EDU-EP01-SHORT (EDU-SHEETS-R1.1) timeline adapter, Boss W5.2 (4 Nov 2026). One registry plate per shot, ID `EDU1-<shot id>`,
// wrapping the pure `plateOf(id, f)` of src/painted/edu01/plates.tsx. The timeline needs the one shared BrushCanvas of
// PaintedStage, so the plate's screen layers (grade, clock glow, flash, dim, grain) come back through `Overlay`.
// Captions, the "ภาพจำลอง" tag, the name card and the caption shade are W5.3 (Editor); nothing of them is here.

const frameOf = (tl: number) => Math.round(tl * FPS);
export const edu1PlateId = (id: string) => `EDU1-${id}`;

/** B03-SH04 holds the last frame of B03-SH03 (the story clock: no boil, no streak jitter). */
const FREEZE: Record<string, number> = {'S01-B03-SH04': 44 / FPS};

export const edu01Shots: PaintedShot[] = EDU1_SHOTS.map(([id]): PaintedShot => ({
  id: edu1PlateId(id),
  serves: [id],
  paper: plateOf(id, 0).paper,
  camera: (tl) => plateOf(id, frameOf(tl)).cam,
  clock: FREEZE[id] === undefined ? undefined : () => FREEZE[id],
  paint: (p) => plateOf(id, p.frame).paint(p),
  Overlay: ({tl, camera, width, height}) => <PlateLayers plate={plateOf(id, frameOf(tl))} camera={camera} width={width} height={height} />,
}));
