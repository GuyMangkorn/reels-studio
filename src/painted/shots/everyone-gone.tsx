import {AbsoluteFill} from 'remotion';
import {Grain} from '../kit/screen';
import type {PaintedShot} from '../shot';
import {SensorCardShot} from '../everyone-gone/SensorCard';
import {cardClock, cardMix, EG_SHOTS, fadeBlack, plateOf, type ShotId} from '../everyone-gone/shots';

// EG-EP01-SHORT (EG-SC-R2) timeline adapter, Editor W5.3 (3 Nov 2026). One registry plate per shot, ID `EG-<shot id>`, wrapping Boss's
// pure `plateOf(id, f)` (src/painted/everyone-gone/shots.tsx). The timeline needs the one shared BrushCanvas of PaintedStage, so
// Boss's standalone `ShotPlate` (its own canvas) is not mounted; this file reproduces its layers: painted plate, day grade and grain
// (as the Overlay, as `Painted` in look.tsx), the SVG sensor card over the plate (S03 shots, opacity `cardMix`) and the end fade.
const FPS = 30;
const PAPER = '#ece9e1';
const frameOf = (tl: number) => Math.round(tl * FPS);

export const egPlateId = (id: string) => `EG-${id}`;

const shotOf = (id: ShotId): PaintedShot => ({
  id: egPlateId(id),
  serves: [id],
  paper: PAPER,
  camera: (tl) => plateOf(id, frameOf(tl)).cam,
  paint: (p, {tl}) => plateOf(id, frameOf(tl)).paint(p),
  Overlay: ({tl}) => {
    const f = frameOf(tl);
    const {card} = cardMix(id, f);
    const black = fadeBlack(id, f);
    return (
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 65% at 50% 42%, rgba(40,52,62,0) 60%, rgba(40,52,62,0.16) 100%)'}} />
        <Grain opacity={0.07} />
        {card > 0 && (
          <AbsoluteFill style={{opacity: card}}>
            <SensorCardShot F={cardClock(id, f)} />
          </AbsoluteFill>
        )}
        {black > 0 && <AbsoluteFill style={{background: '#000', opacity: black}} />}
      </AbsoluteFill>
    );
  },
});

export const everyoneGoneShots: PaintedShot[] = EG_SHOTS.map(([id]) => shotOf(id));
