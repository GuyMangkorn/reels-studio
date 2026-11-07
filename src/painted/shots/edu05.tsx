import {AbsoluteFill} from 'remotion';
import type {PaintedShot} from '../shot';
import {STILL_CAMERA} from '../kit/camera';
import {Grain} from '../kit/screen';
import {paintFacadeDown, lookDownCam} from '../edu05/facade';

// EDU-EP05-SHORT timeline adapter, Editor W5.3 (7 Nov 2026). One registry plate per finished shot, ID `EDU5-<shot id>`; the episode registry
// (src/videos/edu-ep05/index.ts) mounts the plate when it exists and a placeholder card otherwise. Each plate is a pure function of the
// shot-local frame, the same paint as its `EDU5-CHK-*` check scene (src/painted/edu05/checks.ts) plus that scene's vignette and grain.
const FPS = 30;
const PAPER = '#ece6d6';
/** S01-B01-SH02 length in frames (scene sheets: L 0-96; the camera ease runs over it, `lookDownCam(k)` k = L / 96). */
export const EDU5_FAC_FRAMES = 96;

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
];
