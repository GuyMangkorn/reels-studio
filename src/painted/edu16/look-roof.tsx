import type {ReactNode} from 'react';
import {useCallback} from 'react';
import {AbsoluteFill, getInputProps, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {Lbl} from './look';
import {LogbookText} from './logbook';
import {RF} from './roof';
import {MEASURE_MODE, paintLFRoof, paintSH03, paintSH07Age, paintSH21, paintSH22, paintSH23} from './scenes-roof';
import {paintFrameRim} from './thought';

// EDU-EP16-SHORT look stills, group 2 (roof set and woman; Film W3, 2026-11-14). Same conventions as look.tsx (group 1): stills only, "ภาพจำลอง" is the
// DOM label (LBL, VD12), dashed lines mark the caption band y 1176-1344 (off with --props='{"guides":false}').
// Label rule (brief VD12, Boat P1): on for every receiver or reply-box shot from W-PING to the start of L15 and every imagination insert; off from L15
// (SH22 as the camera leaves the receiver, SH23 with no title). Render on one Chrome:
// printf 'EDU16-LF-ROOF 0 out/edu16/roof/LF-ROOF.png\n' | node scripts/stills.mjs src/painted/edu16/look-index.ts

const FPS = 30;
type Paint = (p: Painter, frame: number) => void;


const PAINT: Record<string, {paint: Paint; label: boolean; bg: string; overlay?: () => ReactNode}> = {
  'LF-ROOF': {paint: (p) => paintLFRoof(p), label: true, bg: RF.zen},
  SH03: {paint: (p) => { paintSH03(p); }, label: true, bg: '#1c2130'},
  SH21: {paint: (p) => paintSH21(p), label: true, bg: RF.zen},
  'SH21-ON': {paint: (p) => paintSH21(p, {on: true}), label: true, bg: RF.zen}, // W3 v11: the lit pair frame for the user (same camera)
  SH22: {paint: (p) => paintSH22(p), label: false, bg: '#14161e', overlay: () => <LogbookText />},
  SH23: {paint: (p, f) => paintSH23(p, {t: f / FPS}), label: false, bg: RF.zen},
  'SH07-A21': {paint: (p) => { paintSH07Age(p, 'a21'); paintFrameRim(p, {t: 0.9}); }, label: true, bg: '#04060c'},
  'SH07-A50': {paint: (p) => { paintSH07Age(p, 'a50'); paintFrameRim(p, {t: 0.9}); }, label: true, bg: '#04060c'},
  'SH07-A81': {paint: (p) => { paintSH07Age(p, 'a81'); paintFrameRim(p, {t: 0.9}); }, label: true, bg: '#04060c'},
};

const Still = ({id}: {id: string}) => {
  const frame = useCurrentFrame();
  const e = PAINT[id];
  const fn = useCallback(({brush, frame: f}: PaintContext) => e.paint(makePainter(brush, {t: f / FPS, frame: f, fade: e.bg}), f), [e]);
  const props = getInputProps() as {guides?: boolean; measure?: boolean}, guides = props.guides !== false;
  MEASURE_MODE.on = props.measure === true;
  void frame;
  return (
    <AbsoluteFill style={{background: e.bg}}>
      <BrushCanvas paint={fn} paper={e.bg} />
      {e.overlay?.()}
      <Grain opacity={0.05} />
      {e.label && <Lbl />}
      {guides && <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.6)', borderBottom: '2px dashed rgba(255,255,255,0.6)'}} />}
    </AbsoluteFill>
  );
};

export const ROOF_LOOK_FRAMES: Record<string, number> = Object.fromEntries(Object.keys(PAINT).map((k) => [k, 1]));
export const ROOF_LOOKS = Object.fromEntries(Object.keys(PAINT).map((id) => [id, () => <Still id={id} />])) as Record<string, () => ReactNode>;
