import {Freeze} from 'remotion';
import type {ComponentType} from 'react';
import type {PaintedShot} from '../shot';
import {STILL_CAMERA} from '../kit/camera';
import {SHOTS} from '../edu13/shots';
import {S01_B01_SH01, S01_B01_SH02, S01_B01_SH03, S01_B01_SH04, S01_B01_SH04B, S01_B01_SH04C, S01_B01_SH04D, S01_B01_SH05, S01_B02_SH01, S01_B02_SH03, S01_B03_SH01, S01_B03_SH03, S01_B04_SH01, S01_B04_SH02, S01_B05_SH01, S01_B05_SH02} from '../edu13/shot-layers';

// EDU-EP13-SHORT inventory (Editor W5.3 Draft): one plate per timed shot, ID `EDU13-<shot id>`. Boss's shot components (src/painted/edu13/shot-layers.tsx) are complete pictures
// (own BrushCanvas, vignette, grain, DOM layers) and read the shot-local frame with `useCurrentFrame()`, so each is mounted in a Freeze at the shot-local frame round(tl × 30) (the plate's own clock, so covers and the plate gallery can pick a frame; in the episode tl = G − shot start); the PaintedStage under it paints
// nothing for the plate (`paint` is a no-op, paper only). Hard cuts only; captions and the channel mark come from the timeline. The QA caption band is off in compositions (`qaBand` in look.tsx).
const COMPONENTS: Record<keyof typeof SHOTS, ComponentType> = {
  S01_B01_SH01, S01_B01_SH02, S01_B01_SH03, S01_B01_SH04, S01_B01_SH04B, S01_B01_SH04C, S01_B01_SH04D, S01_B01_SH05, S01_B02_SH01, S01_B02_SH03, S01_B03_SH01, S01_B03_SH03, S01_B04_SH01, S01_B04_SH02, S01_B05_SH01, S01_B05_SH02,
};
export const edu13PlateId = (id: string) => `EDU13-${id}`;
export const edu13Shots: PaintedShot[] = (Object.keys(SHOTS) as (keyof typeof SHOTS)[]).map((key) => {
  const Shot = COMPONENTS[key];
  return {
    id: edu13PlateId(key.replace(/_/g, '-')), serves: [key.replace(/_/g, '-')], paper: '#efe8d8', camera: () => STILL_CAMERA, paint: () => {},
    Overlay: ({tl, opacity}) => <div style={{position: 'absolute', inset: 0, opacity}}><Freeze frame={Math.round(tl * 30)}><Shot /></Freeze></div>,
  };
});
