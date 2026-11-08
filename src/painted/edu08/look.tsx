import {useCallback} from 'react';
import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {FILM_BOX, paintLF00, paintLF01, paintLF02, paintLF03, paintLF04, paintLF05, paintLF06, paintLF07} from './scenes';
import {RING} from './fx';

// EDU-EP08-SHORT look frames (W3): React wrappers of the paint scenes in scenes.ts. Look stills only: no timeline, voice, caption or
// channel mark; `band` marks the caption band y 1176-1344 (brief frame zones). Render:
// printf 'EDU8-LF01 0 out/edu08/look-frames/v1/LF01.png\n' | node scripts/stills.mjs src/painted/edu08/look-index.ts

const FPS = 30;
export const LF_FRAMES = {LF00: 1, LF01: 1, LF02: 1, LF03: 1, LF04: 1, LF05: 1, LF06: 1, LF07: 1} as const;

export const Painted = ({paint, paper = '#05070d', band = true, children}: {paint: (p: Painter, frame: number) => void; paper?: string; band?: boolean; children?: React.ReactNode}) => {
  const fn = useCallback(({brush, frame}: PaintContext) => paint(makePainter(brush, {t: frame / FPS, frame, fade: paper}), frame), [paint, paper]);
  return (
    <AbsoluteFill style={{background: paper}}>
      <BrushCanvas paint={fn} paper={paper} />
      <Grain opacity={0.05} />
      {children}
      {band && <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.55)', borderBottom: '2px dashed rgba(255,255,255,0.55)'}} />}
    </AbsoluteFill>
  );
};

/** Timer ring label (VD08, user Q3): the only words on the ring, no digits counting; Remotion type under the painted ring. */
const RingLabel = ({dim = false}: {dim?: boolean}) => (
  <div style={{position: 'absolute', left: RING.cx - 150, width: 300, top: RING.cy + RING.r + 10, textAlign: 'center', whiteSpace: 'nowrap', color: '#ffffff', opacity: dim ? 0.5 : 1,
    fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 700, fontSize: 26, WebkitTextStroke: '6px #0b1020', paintOrder: 'stroke fill'}}>ประมาณ 10–15 วินาที</div>
);
void FILM_BOX;

export const LF00 = () => <Painted paint={paintLF00} />;
export const LF01 = () => <Painted paint={paintLF01} />;
export const LF02 = () => <Painted paint={paintLF02} />;
export const LF03 = () => <Painted paint={paintLF03} paper="#2a2116"><RingLabel dim /></Painted>;
export const LF04 = () => <Painted paint={paintLF04} />;
export const LF05 = () => <Painted paint={paintLF05} paper="#8a97a8" />;
export const LF06 = () => <Painted paint={paintLF06}><RingLabel /></Painted>;
export const LF07 = () => <Painted paint={paintLF07}><RingLabel /></Painted>;
