import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {paintCabinBack, paintCabinFore, paintCabinPassenger, paintPassengerBelt, paintTetheredBalloon} from '../kit/car-cabin';
import {makePainter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {BALLOON, LOOKS, PASSENGER} from './cabin-look-data';

/** EDU-EP20-THUMB-R1: one first-shot state, three framing/daylight balances.
 * No story clock and no forward/braking result. Full 1080x1920 QA stills.
 * New reusable art belongs solely to kit/car-cabin.ts. */

const paint = (key: string, finished = false) => ({brush}: PaintContext) => {
  const p = makePainter(brush, {t: 0, frame: 0, seedBase: 20000});
  const {camera, palette} = LOOKS[key];
  // Paper-colour shell continuation: floor and near door cover the lower frame.
  p.flat(palette.shell, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
  paintCabinBack(p, camera, palette, PASSENGER, finished);
  paintCabinPassenger(p, camera, PASSENGER, 1, finished);
  paintPassengerBelt(p, camera, PASSENGER);
  paintTetheredBalloon(p, camera, BALLOON, finished);
  paintCabinFore(p, camera, palette, finished);
};
const PAINTS = Object.fromEntries(Object.keys(LOOKS).map((key) => [key, paint(key)]));
const FINISHED_B = paint('B', true);
export const CabinLook = ({variant = 'A', finished = false}: {variant?: string; finished?: boolean}) => <AbsoluteFill>
  <BrushCanvas paint={finished ? FINISHED_B : PAINTS[variant]} paper={LOOKS[variant].palette.shell}/>
  {finished && <Grain opacity={0.07}/>}
  <div style={{position: 'absolute', left: 48, top: 60, font: '700 30px sans-serif', color: '#f1e9d9', textShadow: '0 2px 4px #26313b'}}>@TamMaiLa</div>
  <div style={{position: 'absolute', left: 48, top: 110, font: '500 25px sans-serif', color: '#394851'}}>ภาพจำลอง</div>
  <div style={{position: 'absolute', left: 52, top: 920, font: '500 26px sans-serif', color: '#d4dad7'}}>ท้ายรถ</div>
  <div style={{position: 'absolute', right: 52, top: 920, font: '500 26px sans-serif', color: '#d4dad7'}}>หน้ารถ →</div>
  {!finished && <div style={{position: 'absolute', left: 48, bottom: 70, font: '500 25px sans-serif', color: '#aab6b7'}}>{LOOKS[variant].name}</div>}
</AbsoluteFill>;
