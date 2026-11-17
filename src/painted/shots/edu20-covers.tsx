import {STILL_CAMERA} from '../kit/camera';
import {Grain} from '../kit/screen';
import type {YCam} from '../kit/ycam';
import {LOOKS} from '../edu20/cabin-look-data';
import {LOOK_BALLOON, type CabinState} from '../edu20/drive';
import {paintCabinFrame} from '../edu20/shot';
import type {PaintedShot} from '../shot';

// EDU-EP20-SHORT-PIC-COVERS cover-only plates (Film, 2026-11-16; cover-design skill pick 1, docs/cover-principles.md CV07).
// Reason for new plates: no film frame holds the balloon larger than ~180 px or the passenger's face close beside an upright
// balloon (the close shots B01-SH03/B05-SH01 keep the balloon out of frame on purpose), so these cover plates reuse the locked
// LF20-CABIN-B assembly (`paintCabinFrame`, same set, cast, balloon, palette and seed) with a cover camera only. Every state is
// the pre-result state of B01-SH01/SH02: balloon upright (u 0), passenger not leaning, so no plate shows which way it leans
// (CV04). Kept in its own inventory so the episode's scene cache keys (src/painted/shots/edu20.tsx) do not change.

/** Road strip clock: G 300 is mid-acceleration in ROAD_KEYS, so the far window streaks read as moving. */
const G = 300;
const plate = (id: string, cam: YCam, s: CabinState): PaintedShot => ({
  id, serves: ['B01-SH01'], paper: LOOKS.B.palette.shell, camera: () => STILL_CAMERA,
  paint: (p) => paintCabinFrame(p, cam, s, G),
  Overlay: ({opacity}) => <div style={{position: 'absolute', inset: 0, opacity}}><Grain opacity={0.07}/></div>,
});

export const edu20CoverShots: PaintedShot[] = [
  // P1 subject close: balloon ~360 px, its whole string down to the floor ring, window streaks behind.
  plate('EDU20-COVER-BALLOON', {x: 0.60, y: 1.0, z: 1.30, yaw: 0, f: 1400, hy: 640}, {lean: 0, u: 0, face: 'neutral', faceState: {look: LOOK_BALLOON}}),
  // P5 medium pair for the equal-alternative arrows: passenger left, balloon right, both inside the safe crop.
  plate('EDU20-COVER-PAIR', {x: 0.30, y: 1.05, z: 1.95, yaw: 0, f: 1250, hy: 520}, {lean: 0, u: 0, face: 'neutral', faceState: {look: LOOK_BALLOON}}),
  // P3 face and emotion: passenger close, puzzled look at the upright balloon at frame right.
  plate('EDU20-COVER-FACE', {x: 0.20, y: 1.15, z: 1.65, yaw: 0, f: 1180, hy: 600}, {lean: 0, u: 0, face: 'surprised', faceState: {look: LOOK_BALLOON}}),
  // P2 imagined view: floor-level eye beside the tether, looking up at the still-upright envelope.
  plate('EDU20-COVER-FLOOR', {x: 0.62, y: 0.23, z: 1.15, yaw: 0, pitch: 0.20, f: 1050, hy: 1330}, {lean: 0, u: 0, face: 'neutral', faceState: {look: LOOK_BALLOON}}),
  // P4 setup action: the floor anchor and one continuous string, with more of the full chain inside the 3:4 crop.
  plate('EDU20-COVER-TETHER', {x: 0.62, y: 0.35, z: 1.05, yaw: 0, f: 850, hy: 1170}, {lean: 0, u: 0, face: 'neutral', faceState: {look: LOOK_BALLOON}}),
];
