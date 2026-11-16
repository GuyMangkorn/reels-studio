import type {CabinPalette, PassengerPlacement, RoadKey, TetheredBalloon} from '../kit/car-cabin';
import {PEOPLE} from '../kit/people';
import {dress} from '../kit/wardrobe';
import type {YCam} from '../kit/ycam';

// First-shot W3 staging only, separated for reproducible geometry measurement.
const hoodie = dress(PEOPLE['man-crop'], 'hoodie');
export const PASSENGER: PassengerPlacement = {root: [0, 0, 0], person: {...hoodie, outfit: {...hoodie.outfit, shirt: '#5d7385', sleeve: '#5d7385', jacket: '#5d7385', pants: '#343d49'}}};
export const BALLOON: TetheredBalloon = {anchor: [0.62, 0.10, 0.05], centre: [0.62, 1.15, 0.05], radius: 0.16, color: '#db7566'};
export const LOOKS: Record<string, {camera: YCam; palette: CabinPalette; name: string}> = {
  A: {name: 'A · warm balanced daylight', camera: {x: 0.43, y: 1.05, z: 2.6, yaw: 0, f: 1300, hy: 320}, palette: {shell: '#d8ccb4', seat: '#76808a', seatShade: '#5c6975', floor: '#303a43', trim: '#444d56', sky: '#d7e1dc', land: '#a7b5a3', sun: '#efe4cc'}},
  B: {name: 'B · closer cool cabin / warm window', camera: {x: 0.46, y: 1.04, z: 2.49, yaw: -0.022, f: 1300, hy: 305}, palette: {shell: '#bfc9cb', seat: '#63768a', seatShade: '#4b5f72', floor: '#2d3742', trim: '#44515e', sky: '#eee1c5', land: '#acb4a1', sun: '#f6e6bd'}},
  C: {name: 'C · lower side view / softer cream bounce', camera: {x: 0.39, y: 1.01, z: 2.68, yaw: 0.024, f: 1350, hy: 335}, palette: {shell: '#e0d4bf', seat: '#7b8789', seatShade: '#667576', floor: '#2e383a', trim: '#455152', sky: '#dce3d9', land: '#aebca7', sun: '#f5ead2'}},
};


/** SS-R3 exterior strip speed on the composition-global G clock (scene sheet, exterior paragraph, FD20-W53-04): 0.0008 m/frame
 * until G187, eases to 0.0026 by G352 (acceleration, 3.25x), holds through G1209 (steady), eases to 0.0006 by G1443
 * (braking, 4.3x down; SS-R5 FD20-R5-02, was G1414: braking ends with the voice) and holds. Top speed capped so no mark moves more than 1.5 px/frame on the closest camera (CLOSE,
 * ~544 px/m). Film's decorative values, not a measured speed; Editor passes `roadStripAt(G, ROAD_KEYS)` to `paintCabinBack`. */
export const ROAD_KEYS: RoadKey[] = [{at: 0, speed: 0.0008}, {at: 187, speed: 0.0008}, {at: 352, speed: 0.0026}, {at: 1209, speed: 0.0026}, {at: 1443, speed: 0.0006}];
