import {AbsoluteFill} from 'remotion';
import type {PaintedShot} from '../shot';
import {STILL_CAMERA} from '../kit/camera';
import {Grain} from '../kit/screen';
import {paintFacadeDown, lookDownCam} from '../edu05/facade';
import {paintLIFT} from '../edu05/checks';

// EDU-EP05-SHORT timeline adapter, Editor W5.3 (7 Nov 2026). One registry plate per finished shot, ID `EDU5-<shot id>`; the episode registry
// (src/videos/edu-ep05/index.ts) mounts the plate when it exists and a placeholder card otherwise. Each plate is a pure function of the
// shot-local frame, the same paint as its `EDU5-CHK-*` check scene (src/painted/edu05/checks.ts) plus that scene's vignette and grain.
const FPS = 30;
const PAPER = '#ece6d6';
/** S01-B01-SH02 length in frames (scene sheets: L 0-96; the camera ease runs over it, `lookDownCam(k)` k = L / 96). */
export const EDU5_FAC_FRAMES = 96;

/** S01-B05-SH03 length in frames (scene sheets: L 0-172). */
export const EDU5_LIFT_FRAMES = 173;

const screen = ({opacity}: {opacity: number}) => (
  <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 95% 75% at 50% 42%, rgba(255,255,255,0) 58%, rgba(60,70,80,0.18) 100%)'}} />
    <Grain opacity={0.08} />
  </AbsoluteFill>
);

export const edu05Shots: PaintedShot[] = [
  {
    id: 'EDU5-S01-B01-SH02',
    serves: ['S01-B01-SH02'],
    paper: PAPER,
    camera: () => STILL_CAMERA,
    paint: (p) => paintFacadeDown(p, lookDownCam(Math.min(p.frame, EDU5_FAC_FRAMES) / EDU5_FAC_FRAMES), p.frame / FPS),
    Overlay: screen,
  },
  {
    // S01-B05-SH03 (the lift, G1594-1767, L 0-172): `paintLIFT` is the check stand-in's own paint (SHEETS-R1.8 FR20 choreography: front-facing, far arm in
    // front, crumb path, seat blend L 35-40, shadow fade, breath hold, laugh bob), reused not copied. The grass set, drips and puffs are not part of it
    // (garden drop false); the ant is off frame right on this camera and the check never draws it. Frame is clamped to the shot's 173 f.
    id: 'EDU5-S01-B05-SH03',
    serves: ['S01-B05-SH03'],
    paper: PAPER,
    camera: () => STILL_CAMERA,
    paint: (p) => paintLIFT(p, Math.min(p.frame, EDU5_LIFT_FRAMES - 1)),
    Overlay: screen,
  },
];
