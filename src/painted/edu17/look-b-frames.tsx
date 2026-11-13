import {loadFont} from '@remotion/fonts';
import type {ReactNode} from 'react';
import {useCallback} from 'react';
import {AbsoluteFill, getInputProps, staticFile} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {LBL, LBL2, LBLW} from './labels';
import {paintLf04Atom, paintLf04Balance} from './look-b-space';
import {paintLf05A, paintLf05B, paintLf06} from './look-b-stadium';
import {paintLf02, paintSh11Check} from './look-b-street';

// EDU-EP17-SHORT look stills, set B (W3, Film): LF02 (street, shot 5 @ +15), LF04 (atom shot 13 @ +72, balance shot 14 @ +30), LF05A/B (Seattle day shot 18 @ +25,
// night shot 19 @ +24), LF06 (instrument shot 21 @ +12), each with its thumbnail options, and the SH11 head-read check. Stills only: no timeline, voice or captions;
// the dashed lines mark the caption band y 1176-1344 (off with --props='{"guides":false}' for scripts/caption-zone.py). Entry: src/painted/spike/edu17-look-b-index.ts.

if (typeof document !== 'undefined') loadFont({family: 'Noto Sans Thai', url: staticFile('fonts/NotoSansThai.ttf'), weight: '100 900'});

const Painted = ({paint, paper, overlay}: {paint: (p: Painter, frame: number) => void; paper: string; overlay?: ReactNode}) => {
  const fn = useCallback(({brush, frame}: PaintContext) => paint(makePainter(brush, {t: frame / 30, frame, fade: paper}), frame), [paint, paper]);
  return (
    <AbsoluteFill style={{background: paper}}>
      <BrushCanvas paint={fn} paper={paper} />
      <Grain opacity={0.05} />
      {overlay}
      {(getInputProps() as {guides?: boolean}).guides !== false && <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.6)', borderBottom: '2px dashed rgba(255,255,255,0.6)'}} />}
    </AbsoluteFill>
  );
};

const OT01 = <LBLW />;
/** Each still: id -> [paint at the look frame's shot-local frame, paper colour, screen labels]. Frame numbers are the sheet R2.1 key frames. */
export const LOOK_B: Record<string, {paint: (p: Painter) => void; paper: string; overlay?: ReactNode}> = {
  'LF02-A': {paint: (p) => void paintLf02(p, 15, 'A'), paper: '#a9c8df', overlay: OT01},
  'LF02-B': {paint: (p) => void paintLf02(p, 15, 'B'), paper: '#a9c8df', overlay: OT01},
  'LF02-C': {paint: (p) => void paintLf02(p, 15, 'C'), paper: '#a9c8df', overlay: OT01},
  'LF04-ATOM-A': {paint: (p) => void paintLf04Atom(p, 72, 'A'), paper: '#0b1430', overlay: OT01},
  'LF04-ATOM-B': {paint: (p) => void paintLf04Atom(p, 72, 'B'), paper: '#0b1430', overlay: OT01},
  'LF04-ATOM-C': {paint: (p) => void paintLf04Atom(p, 72, 'C'), paper: '#0b1430', overlay: OT01},
  'LF04-BAL-A': {paint: (p) => void paintLf04Balance(p, 30, 'A'), paper: '#0b1430', overlay: OT01},
  'LF04-BAL-B': {paint: (p) => void paintLf04Balance(p, 30, 'B'), paper: '#0b1430', overlay: OT01},
  'LF05A-A': {paint: (p) => void paintLf05A(p, 25, 'A'), paper: '#9aa3ab', overlay: <><LBL /><LBL2 text="ซีแอตเทิล · 2011" /></>},
  'LF05A-B': {paint: (p) => void paintLf05A(p, 25, 'B'), paper: '#9aa3ab', overlay: <><LBL /><LBL2 text="ซีแอตเทิล · 2011" /></>},
  'LF05B-A': {paint: (p) => void paintLf05B(p, 24, 'A'), paper: '#101828', overlay: <><LBL /><LBL2 text="ซีแอตเทิล · 2023" /></>},
  'LF05B-B': {paint: (p) => void paintLf05B(p, 24, 'B'), paper: '#101828', overlay: <><LBL /><LBL2 text="ซีแอตเทิล · 2023" /></>},
  'LF06-A': {paint: (p) => void paintLf06(p, 12, 'A'), paper: '#121826', overlay: <><LBL /><LBL2 text="ซีแอตเทิล · 2023" /></>},
  'LF06-B': {paint: (p) => void paintLf06(p, 12, 'B'), paper: '#1a2236', overlay: <><LBL /><LBL2 text="ซีแอตเทิล · 2023" /></>},
  'SH11-NONE': {paint: (p) => void paintSh11Check(p, 'none'), paper: '#a9c8df'},
  'SH11-TEE': {paint: (p) => void paintSh11Check(p, 'tee'), paper: '#a9c8df'},
  'SH11-HALO': {paint: (p) => void paintSh11Check(p, 'halo'), paper: '#a9c8df'},
  'SH11-CLEAR': {paint: (p) => void paintSh11Check(p, 'clear'), paper: '#a9c8df'},
};

export const LOOK_B_COMPONENTS = Object.fromEntries(Object.entries(LOOK_B).map(([id, s]) => [id, () => <Painted paint={s.paint} paper={s.paper} overlay={s.overlay} />])) as Record<string, () => ReactNode>;
