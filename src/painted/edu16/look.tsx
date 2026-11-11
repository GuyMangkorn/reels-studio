import {loadFont} from '@remotion/fonts';
import type {ReactNode} from 'react';
import {useCallback} from 'react';
import {AbsoluteFill, getInputProps, staticFile} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {C} from './palette';
import {LF_IDS, paintCR1, paintCR2, paintCR3, paintCR4, paintLF01, paintLF02, paintLF03, paintLF04A, paintLF04B, paintLF05, paintMK1, paintMK2, paintMK3, paintMK4, type LfId} from './scenes';

// EDU-EP16-SHORT look stills (W3, Film): LF01-LF05 and the crow / mask look-check stills. Stills only: no timeline, voice or caption text; the
// dashed band marks the caption band y 1176-1344 (off with --props='{"guides":false}' for the caption-zone measure). The species tag
// "อีกาอเมริกัน · ภาพจำลอง" belongs to shots 3-4 only (R1.1), so no look frame carries it.
// Render: sh scripts/edu-series/ep16/render-looks.sh <version> [IDS]

if (typeof document !== 'undefined') loadFont({family: 'Noto Sans Thai', url: staticFile('fonts/NotoSansThai.ttf'), weight: '100 900'});

const FPS = 30;
type PaintedProps = {paint: (p: Painter, frame: number) => void; paper?: string; children?: ReactNode};
export const Painted = ({paint, paper = '#d9d4c4', children}: PaintedProps) => {
  const fn = useCallback(({brush, frame}: PaintContext) => paint(makePainter(brush, {t: frame / FPS, frame, fade: paper}), frame), [paint, paper]);
  return (
    <AbsoluteFill style={{background: paper}}>
      <BrushCanvas paint={fn} paper={paper} />
      {children}
      <Grain opacity={0.05} />
      {(getInputProps() as {guides?: boolean}).guides !== false && <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.6)', borderBottom: '2px dashed rgba(255,255,255,0.6)'}} />}
    </AbsoluteFill>
  );
};

/** Per-still calm band level under the captions (0 = none). W3 measured the full-width band levels that pass caption-zone: LF01 0.68, LF02 0.72, LF03 0.70, LF04A 0.65, LF04B 0.60, LF05 0.37; left at 0 because the brief fallback is the per-caption dim plate (Editor, W5), not a band. */
export const CALM: Record<LfId, number> = {LF01: 0, LF02: 0, LF03: 0, LF04A: 0, LF04B: 0, LF05: 0, CR1: 0, CR2: 0, CR3: 0, CR4: 0, MK1: 0, MK2: 0, MK3: 0, MK4: 0};
const PAINT: Record<LfId, (p: Painter) => void> = {LF01: paintLF01, LF02: paintLF02, LF03: paintLF03, LF04A: paintLF04A, LF04B: paintLF04B, LF05: paintLF05,
  CR1: paintCR1, CR2: paintCR2, CR3: paintCR3, CR4: paintCR4, MK1: paintMK1, MK2: paintMK2, MK3: paintMK3, MK4: paintMK4};
const CalmBand = ({level, id}: {level: number; id: string}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    <defs><linearGradient id={id} gradientUnits="userSpaceOnUse" x1={0} y1={1000} x2={0} y2={1500}>
      <stop offset="0" stopColor="#0d0b09" stopOpacity={0} /><stop offset="0.35" stopColor="#0d0b09" stopOpacity={level} /><stop offset="0.69" stopColor="#0d0b09" stopOpacity={level} /><stop offset="1" stopColor="#0d0b09" stopOpacity={0} />
    </linearGradient></defs>
    <rect y={1000} width={1080} height={500} fill={`url(#${id})`} />
  </svg>
);
void C;

export const LOOKS = Object.fromEntries(LF_IDS.map((id) => [id, () => (
  <Painted paint={PAINT[id]}>{CALM[id] > 0 && <CalmBand level={CALM[id]} id={`calm-${id}`} />}</Painted>
)])) as Record<LfId, () => ReactNode>;
