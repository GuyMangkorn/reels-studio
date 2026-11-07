import {AbsoluteFill} from 'remotion';
import type {PaintedShot} from '../shot';
import {STILL_CAMERA} from '../kit/camera';
import {Grain} from '../kit/screen';
import {paintFacadeDown, lookDownCam} from '../edu05/facade';
import {paintBARS, paintCOLD, paintCRUMB, paintDEW1, paintDROP2, paintDROP3, paintDROP4, paintEND, paintPASS, paintPUFF, paintDRIFT, paintLANDING, paintLIFT, paintLIFTOFF, paintSIP, paintSPECK, paintSTAND, paintTOUCH} from '../edu05/checks';

// EDU-EP05-SHORT timeline adapter, Editor W5.3 (7 Nov 2026). One registry plate per finished shot, ID `EDU5-<shot id>`; the episode registry
// (src/videos/edu-ep05/index.ts) mounts the plate when it exists and a placeholder card otherwise. Each plate is a pure function of the
// shot-local frame, the same paint as its `EDU5-CHK-*` check scene (src/painted/edu05/checks.ts) plus that scene's vignette and grain.
const FPS = 30;
const PAPER = '#ece6d6';
/** S01-B01-SH02 length in frames (scene sheets: L 0-96; the camera ease runs over it, `lookDownCam(k)` k = L / 96). */
export const EDU5_FAC_FRAMES = 96;

/** S01-B01-SH01 length in frames (sip on the balcony, `paintSIP`). */
export const EDU5_SIP_FRAMES = 41;

/** S01-B01-SH03 length in frames (mug set down on the rail cap, `paintTOUCH`). */
export const EDU5_TOUCH_FRAMES = 71;

/** S01-B01-SH04 length in frames (she stands, `paintSTAND`). */
export const EDU5_STAND_FRAMES = 32;

/** S01-B02-SH02 length in frames (the follow camera runs over L 0-132, `paintDRIFT` k = L / 132). */
export const EDU5_DRIFT_FRAMES = 132;

/** S01-B02-SH03 length in frames (the speck camera runs over L 0-31, `paintSPECK` k = L / 31). */
export const EDU5_SPECK_FRAMES = 32;

/** S01-B02-SH01 length in frames (lift-off at the lip, `paintLIFTOFF`). */
export const EDU5_LIFTOFF_FRAMES = 89;

/** S01-B02-SH04 length in frames (soft landing, `paintLANDING`). */
export const EDU5_LANDING_FRAMES = 93;

/** S01-B05-SH03 length in frames (scene sheets: L 0-172). */
export const EDU5_LIFT_FRAMES = 173;

/** S01-B03-SH01 length in frames (`paintDEW1`, EDU5-CHK-DEW1). */
export const EDU5_DEW1_FRAMES = 77;

/** S01-B03-SH02 length in frames (`paintDROP2`, EDU5-CHK-DROP2). */
export const EDU5_DROP2_FRAMES = 86;

/** S01-B03-SH03 length in frames (`paintDROP3`, EDU5-CHK-DROP3). */
export const EDU5_DROP3_FRAMES = 119;

/** S01-B03-SH04 length in frames (`paintDROP4`, EDU5-CHK-DROP4). */
export const EDU5_DROP4_FRAMES = 132;

/** S01-B04-SH01 length in frames (`paintCOLD`, EDU5-CHK-COLD). */
export const EDU5_COLD_FRAMES = 77;

/** S01-B04-SH02 length in frames (`paintPUFF`, EDU5-CHK-PUFF). */
export const EDU5_PUFF_FRAMES = 140;

/** S01-B04-SH03 length in frames (`paintCRUMB`, EDU5-CHK-CRUMB). */
export const EDU5_CRUMB_FRAMES = 115;

/** S01-B05-SH01 length in frames (`paintPASS`, EDU5-CHK-PASS). */
export const EDU5_PASS_FRAMES = 89;

/** S01-B05-SH02 length in frames (`paintBARS`, EDU5-CHK-BARS). */
export const EDU5_BARS_FRAMES = 173;

/** S01-B05-SH04 length in frames (`paintEND`, EDU5-CHK-END). */
export const EDU5_END_FRAMES = 196;

const screen = ({opacity}: {opacity: number}) => (
  <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 95% 75% at 50% 42%, rgba(255,255,255,0) 58%, rgba(60,70,80,0.18) 100%)'}} />
    <Grain opacity={0.08} />
  </AbsoluteFill>
);

export const edu05Shots: PaintedShot[] = [
  {
    // S01-B01-SH01 (sip, `paintSIP` = EDU5-CHK-SIP), reused not copied.
    id: 'EDU5-S01-B01-SH01',
    serves: ['S01-B01-SH01'],
    paper: PAPER,
    camera: () => STILL_CAMERA,
    paint: (p) => paintSIP(p, Math.min(p.frame, EDU5_SIP_FRAMES - 1)),
    Overlay: screen,
  },
  {
    id: 'EDU5-S01-B01-SH02',
    serves: ['S01-B01-SH02'],
    paper: PAPER,
    camera: () => STILL_CAMERA,
    paint: (p) => paintFacadeDown(p, lookDownCam(Math.min(p.frame, EDU5_FAC_FRAMES) / EDU5_FAC_FRAMES), p.frame / FPS),
    Overlay: screen,
  },
  {
    // S01-B01-SH03 (mug set down, `paintTOUCH` = EDU5-CHK-TOUCH), reused not copied.
    id: 'EDU5-S01-B01-SH03',
    serves: ['S01-B01-SH03'],
    paper: PAPER,
    camera: () => STILL_CAMERA,
    paint: (p) => paintTOUCH(p, Math.min(p.frame, EDU5_TOUCH_FRAMES - 1)),
    Overlay: screen,
  },
  {
    // S01-B01-SH04 (she stands, `paintSTAND` = EDU5-CHK-STAND), reused not copied.
    id: 'EDU5-S01-B01-SH04',
    serves: ['S01-B01-SH04'],
    paper: PAPER,
    camera: () => STILL_CAMERA,
    paint: (p) => paintSTAND(p, Math.min(p.frame, EDU5_STAND_FRAMES - 1)),
    Overlay: screen,
  },
  {
    // S01-B02-SH01 (lift-off at the planter lip, G240-329): `paintLIFTOFF` is the check stand-in's paint (EDU5-CHK-LIFTOFF), reused not copied. Frame clamped to 89 f.
    id: 'EDU5-S01-B02-SH01',
    serves: ['S01-B02-SH01'],
    paper: PAPER,
    camera: () => STILL_CAMERA,
    paint: (p) => paintLIFTOFF(p, Math.min(p.frame, EDU5_LIFTOFF_FRAMES - 1)),
    Overlay: screen,
  },
  {
    // S01-B02-SH02 (the drift, G329-461): `paintDRIFT` is the check stand-in's own paint (follow camera yaw -10 -> +15, drift-spread pose, +-8 deg roll, no contact shadow,
    // drift motes + slab band + air streaks L 50-70), reused not copied. Frame clamped to the shot's 132 f.
    id: 'EDU5-S01-B02-SH02',
    serves: ['S01-B02-SH02'],
    paper: PAPER,
    camera: () => STILL_CAMERA,
    paint: (p) => paintDRIFT(p, Math.min(p.frame, EDU5_DRIFT_FRAMES - 1)),
    Overlay: screen,
  },
  {
    // S01-B02-SH03 (speck on the facade, G461-493): `paintSPECK` is the check's paint (speck camera, ring marker L 2-8), reused not copied.
    id: 'EDU5-S01-B02-SH03',
    serves: ['S01-B02-SH03'],
    paper: PAPER,
    camera: () => STILL_CAMERA,
    paint: (p) => paintSPECK(p, Math.min(p.frame, EDU5_SPECK_FRAMES - 1)),
    Overlay: screen,
  },
  {
    // S01-B02-SH04 (soft landing, G493-586): `paintLANDING` is the check stand-in's paint (EDU5-CHK-LANDING), reused not copied. Frame clamped to 93 f.
    id: 'EDU5-S01-B02-SH04',
    serves: ['S01-B02-SH04'],
    paper: PAPER,
    camera: () => STILL_CAMERA,
    paint: (p) => paintLANDING(p, Math.min(p.frame, EDU5_LANDING_FRAMES - 1)),
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
  {
    // S01-B03-SH01 (`paintDEW1` = EDU5-CHK-DEW1, SHEETS-R1.10), reused not copied.
    id: 'EDU5-S01-B03-SH01',
    serves: ['S01-B03-SH01'],
    paper: PAPER,
    camera: () => STILL_CAMERA,
    paint: (p) => paintDEW1(p, Math.min(p.frame, EDU5_DEW1_FRAMES - 1)),
    Overlay: screen,
  },
  {
    // S01-B03-SH02 (`paintDROP2` = EDU5-CHK-DROP2, SHEETS-R1.10), reused not copied.
    id: 'EDU5-S01-B03-SH02',
    serves: ['S01-B03-SH02'],
    paper: PAPER,
    camera: () => STILL_CAMERA,
    paint: (p) => paintDROP2(p, Math.min(p.frame, EDU5_DROP2_FRAMES - 1)),
    Overlay: screen,
  },
  {
    // S01-B03-SH03 (`paintDROP3` = EDU5-CHK-DROP3, SHEETS-R1.10), reused not copied.
    id: 'EDU5-S01-B03-SH03',
    serves: ['S01-B03-SH03'],
    paper: PAPER,
    camera: () => STILL_CAMERA,
    paint: (p) => paintDROP3(p, Math.min(p.frame, EDU5_DROP3_FRAMES - 1)),
    Overlay: screen,
  },
  {
    // S01-B03-SH04 (`paintDROP4` = EDU5-CHK-DROP4, SHEETS-R1.10), reused not copied.
    id: 'EDU5-S01-B03-SH04',
    serves: ['S01-B03-SH04'],
    paper: PAPER,
    camera: () => STILL_CAMERA,
    paint: (p) => paintDROP4(p, Math.min(p.frame, EDU5_DROP4_FRAMES - 1)),
    Overlay: screen,
  },
  {
    // S01-B04-SH01 (`paintCOLD` = EDU5-CHK-COLD, SHEETS-R1.10), reused not copied.
    id: 'EDU5-S01-B04-SH01',
    serves: ['S01-B04-SH01'],
    paper: PAPER,
    camera: () => STILL_CAMERA,
    paint: (p) => paintCOLD(p, Math.min(p.frame, EDU5_COLD_FRAMES - 1)),
    Overlay: screen,
  },
  {
    // S01-B04-SH02 (`paintPUFF` = EDU5-CHK-PUFF, SHEETS-R1.10), reused not copied.
    id: 'EDU5-S01-B04-SH02',
    serves: ['S01-B04-SH02'],
    paper: PAPER,
    camera: () => STILL_CAMERA,
    paint: (p) => paintPUFF(p, Math.min(p.frame, EDU5_PUFF_FRAMES - 1)),
    Overlay: screen,
  },
  {
    // S01-B04-SH03 (`paintCRUMB` = EDU5-CHK-CRUMB, SHEETS-R1.10), reused not copied.
    id: 'EDU5-S01-B04-SH03',
    serves: ['S01-B04-SH03'],
    paper: PAPER,
    camera: () => STILL_CAMERA,
    paint: (p) => paintCRUMB(p, Math.min(p.frame, EDU5_CRUMB_FRAMES - 1)),
    Overlay: screen,
  },
  {
    // S01-B05-SH01 (`paintPASS` = EDU5-CHK-PASS, SHEETS-R1.10), reused not copied.
    id: 'EDU5-S01-B05-SH01',
    serves: ['S01-B05-SH01'],
    paper: PAPER,
    camera: () => STILL_CAMERA,
    paint: (p) => paintPASS(p, Math.min(p.frame, EDU5_PASS_FRAMES - 1)),
    Overlay: screen,
  },
  {
    // S01-B05-SH02 (`paintBARS` = EDU5-CHK-BARS, SHEETS-R1.10), reused not copied.
    id: 'EDU5-S01-B05-SH02',
    serves: ['S01-B05-SH02'],
    paper: PAPER,
    camera: () => STILL_CAMERA,
    paint: (p) => paintBARS(p, Math.min(p.frame, EDU5_BARS_FRAMES - 1)),
    Overlay: screen,
  },
  {
    // S01-B05-SH04 (`paintEND` = EDU5-CHK-END, SHEETS-R1.10), reused not copied.
    id: 'EDU5-S01-B05-SH04',
    serves: ['S01-B05-SH04'],
    paper: PAPER,
    camera: () => STILL_CAMERA,
    paint: (p) => paintEND(p, Math.min(p.frame, EDU5_END_FRAMES - 1)),
    Overlay: screen,
  },
];
