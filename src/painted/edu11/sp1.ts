import {camMove, camOf} from '../kit/cam-moves';
import type {FigAnchors} from '../kit/cast';
import type {Painter} from '../kit/painter';
import {paintFigureAt, VIEW_CUES_OFF} from '../kit/figure-at';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintCar, paintFloat, paintPhone, woman} from './car';

// SP1: float in office clothes (brief "Spikes and acceptance"). CAM-CAR-M at B01-SH03 mid values (VD07): target (0, 1.00, -0.30), yaw 4.5, r 2.28, eye 1.60, f 1200, hy 740.
export const SP1_CAM: YCam = camOf(camMove([0, 1.0, -0.3], [4.5, 4.5], [2.28, 2.28], 1.6, {f: 1200, hy: 740}), 0);
/** Frame-0 camera (VD05 start): yaw 10, r 2.50, target (0, 0.95, -0.30), hy 740. */
export const F0_CAM: YCam = camOf(camMove([0, 0.95, -0.3], [10, 10], [2.5, 2.5], 1.6, {f: 1200, hy: 740}), 0);
export const FEET: [number, number, number] = [0.05, 0, -0.3];
export const PHONE_AT: [number, number, number] = [0.3, 1.75, -0.2];
export const MEASURE: Record<string, {a?: FigAnchors | null; floorY?: number; unit?: number}> = {};

export const paintSP1 = (rise: number, name: string) => (p: Painter, frame: number) => {
  const t = 4.6 + frame / 30; // B01-SH03 floating, a few seconds in
  paintCar(p, SP1_CAM, {light: 0.85, display: '20', bell: 0.3});
  const a = paintFloat(p, SP1_CAM, {at: FEET, t, lift: 0.15, rise, face: 'scared'});
  paintPhone(p, SP1_CAM, PHONE_AT, 40 * t);
  const g = camPoint(SP1_CAM, FEET);
  MEASURE[name] = {a, floorY: g?.[1], unit: camUnit(SP1_CAM, FEET)};
};

/** LF01 / frame 0: P10 hold_phone_chest, phone in hand, neutral, display 20. */
export const paintF0 = (p: Painter) => {
  paintCar(p, F0_CAM, {light: 1, display: '20', bell: 0.3});
  const a = paintFigureAt(p, F0_CAM, woman(0), {...VIEW_CUES_OFF, at: FEET, pose: 'P10', face: 'neutral', t: 0});
  const g = camPoint(F0_CAM, FEET);
  MEASURE.F0 = {a, floorY: g?.[1], unit: camUnit(F0_CAM, FEET)};
};
