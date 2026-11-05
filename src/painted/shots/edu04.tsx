import {AbsoluteFill} from 'remotion';
import type {PaintedShot} from '../shot';
import {STILL_CAMERA} from '../kit/camera';
import {Grain} from '../kit/screen';
import {EDU4_SHOTS, plateOf, titleWipe, type Edu4ShotId} from '../edu04/shots';
import {TitleStrip} from '../edu04/props';

// EDU-EP04-SHORT timeline adapter, Boss W5.2 (5 Nov 2026). One registry plate per shot, ID `EDU4-<shot id>`, wrapping the pure
// `plateOf(id, f)` of src/painted/edu04/shots.tsx. Screen layers (grade, title strip, grain) come back through `Overlay`.
// Shots of groups not built yet (G2-G4) are empty paper plates until their group (`plateOf(id).built`).
const FPS = 30;
const frameOf = (tl: number) => Math.round(tl * FPS);
export const edu4PlateId = (id: string) => `EDU4-${id}`;

export const edu04Shots: PaintedShot[] = EDU4_SHOTS.map(([id]): PaintedShot => ({
  id: edu4PlateId(id),
  serves: [id],
  paper: plateOf(id, 0).paper,
  camera: () => STILL_CAMERA,
  paint: (p) => plateOf(id as Edu4ShotId, p.frame).paint(p),
  Overlay: ({tl, opacity}) => {
    const f = frameOf(tl), plate = plateOf(id as Edu4ShotId, f), wipe = titleWipe(id as Edu4ShotId, f);
    return (
      <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
        {plate.gradeOpacity > 0 && <AbsoluteFill style={{background: plate.grade, opacity: plate.gradeOpacity}} />}
        {wipe > 0 && <TitleStrip wipe={wipe} />}
        <Grain opacity={0.09} />
      </AbsoluteFill>
    );
  },
}));
