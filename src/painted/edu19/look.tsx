import type {ReactNode} from 'react';
import {useCallback} from 'react';
import {AbsoluteFill, getInputProps, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {GlowLayer} from './glow';
import {B01_SH01} from './shots/B01-SH01';
import {B01_SH02} from './shots/B01-SH02';
import {B01_SH04} from './shots/B01-SH04';
import {soiLook} from './shots/B01-SH05';
import {B01_SH07} from './shots/B01-SH07';
import {B02_SH05} from './shots/B02-SH05';
import {B03_SH05} from './shots/B03-SH05';
import {paintFieldShot, type FieldShotDef, type LookFrame} from './stage';

// EDU-EP19-SHORT look frames LF01-LF05 (Boss W3.1, 15 Nov 2026; W3.3 repaint to EDU-EP19-BRIEF-R2 / EDU-EP19-SHEETS-R2): one real shot
// frame per look family, painted with the episode set and the kit cast. Stills only (no timeline, voice or caption text); the dashed lines mark
// the caption band y 1176-1344 and the mark zone, the top-right tag names the shot (preview labels). Off with --props='{"guides":false}' for the
// caption-zone measure. Render on one Chrome: printf 'EDU19-LF01 0 out/edu19-lf/LF01.png\n' | node scripts/stills.mjs src/painted/edu19/look-index.ts

const FPS = 30;
type Look = LookFrame;
const field = (sh: FieldShotDef, L: number, G0: number): Look => ({
  shot: sh.id, G: G0 + L, L, cam: sh.cam(L), glow: sh.glow?.(L),
  paint: (p, probe) => paintFieldShot(p, sh.cam(L), {...sh.state(L), probe}),
});

export const LOOK_DEFS: Record<string, () => Look> = {
  LF01: () => field(B01_SH01, 0, 0),
  LF02: () => field(B01_SH02, 102, 48),
  LF03: () => field(B01_SH07, 16, 434),
  LF04: () => soiLook(56),
  LF05: () => field(B03_SH05, 38, 1143),
  // Supplementary stills (not look families): LF03 at l 34, the fall into P33 side with the arms back (sheet W3.3); the VD04 R2 size ladder on
  // B01-SH04 l 40 (all five round-1 prints, S1-S5 at opacity 0.26, before the l 44 swell; replaces GLOW-OPACITY / GLOW-SIZE); B02-SH05 l 106 (the +0.6 print fully grown in),
  // the round-2 nose vantage for the repeated-vantage check against LF02 (VD05 R2, FQ2).
  'LF03-FALL': () => field(B01_SH07, 34, 434),
  'GLOW-LADDER': () => field(B01_SH04, 40, 252),
  'VANTAGE-B02': () => field(B02_SH05, 106, 717),
};

const tc = (G: number) => { const s = G / FPS; return `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`; };
const Still = ({id}: {id: string}) => {
  useCurrentFrame();
  const look = LOOK_DEFS[id]();
  const fn = useCallback(({brush, frame}: PaintContext) => look.paint(makePainter(brush, {t: look.L / FPS, frame, fade: '#86a24c'})), [look]);
  const guides = (getInputProps() as {guides?: boolean}).guides !== false;
  return (
    <AbsoluteFill style={{background: '#cfe0e2'}}>
      <BrushCanvas paint={fn} paper="#cfe0e2" />
      <Grain opacity={0.04} />
      {(getInputProps() as {glow?: boolean}).glow !== false && look.cam && look.glow && <GlowLayer cam={look.cam} spots={look.glow} />}
      {look.overlay}
      {guides && <>
        <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.7)', borderBottom: '2px dashed rgba(255,255,255,0.7)'}} />
        <div style={{position: 'absolute', left: 0, top: 0, width: 330, height: 140, border: '2px dashed rgba(255,255,255,0.5)'}} />
        {/* Two-line tag, large enough to read on a 360 px contact tile (W3.3). */}
        <div style={{position: 'absolute', right: 16, top: 16, font: '700 40px sans-serif', lineHeight: '48px', textAlign: 'right', color: '#fff', background: 'rgba(20,16,12,0.6)', padding: '6px 14px'}}>{`${id} · ${look.shot}`}<br />{`EDU-EP19-SHORT · TH ${tc(look.G)} · f${look.L}`}</div>
      </>}
    </AbsoluteFill>
  );
};
export const LOOKS = Object.fromEntries(Object.keys(LOOK_DEFS).map((id) => [id, () => <Still id={id} />])) as Record<string, () => ReactNode>;
