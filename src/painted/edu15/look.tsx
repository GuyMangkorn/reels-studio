import {loadFont} from '@remotion/fonts';
import type {CSSProperties, ReactNode} from 'react';
import {useCallback} from 'react';
import {AbsoluteFill, getInputProps, staticFile} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {C} from './palette';
import {LF_IDS, paintLF01, paintLF02, paintLF03, paintLF04, paintLF05A, paintLF05B, paintTK1, paintTK2, paintTK4, paintTK5, paintTK6, paintTK7, paintTK8, type LfId} from './scenes';

// EDU-EP15-SHORT look stills (W3, Film): LF01-LF05 and the tokay look-check stills TK1-TK8 (TK3 = LF02). Stills only: no timeline, voice or caption
// text; the dashed band marks the caption band y 1176-1344 (off with --props='{"guides":false}' for the caption-zone measure).
// Render: sh scripts/edu-series/ep15/render-looks.sh <version> [IDS]

if (typeof document !== 'undefined') loadFont({family: 'Noto Sans Thai', url: staticFile('fonts/NotoSansThai.ttf'), weight: '100 900'});

const FPS = 30;
const FONT = "'Noto Sans Thai', sans-serif";
const edu = (size: number, color = '#ffffff', stroke = 8): CSSProperties => ({fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, WebkitTextStroke: `${stroke}px ${C.ink}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'});
/** LBL slot (816-1020 x 148-204): "ภาพจำลอง" (series label; VD25). */
export const Lbl = ({text = 'ภาพจำลอง'}: {text?: string}) => (
  <div lang="th" style={{position: 'absolute', left: 816, top: 148, width: 204, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', ...edu(40, '#ffffff', 6)}}>{text}</div>
);

/** Imagined grade (brief colour key, R06): saturation 35 %, cool tint `#a9b8c6` 20 %, soft vignette; `u` 0..1 (snaps in over 3 f in the shots). */
export const ImaginedGrade = ({u, children}: {u: number; children: ReactNode}) => {
  const k = Math.max(0, Math.min(1, u)), m = (a: number, b: number) => a + (b - a) * k;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', inset: 0, filter: `saturate(${m(1, 0.35)}) contrast(${m(1, 0.95)})`}}>{children}</div>
      <div style={{position: 'absolute', inset: 0, background: '#a9b8c6', mixBlendMode: 'color', opacity: 0.2 * k}} />
      <Vignette level={0.45 * k} id="imag-vig" />
    </div>
  );
};
/** Her-thought grade (brief colour key, R06 / N4): sepia, warmer and flatter, `u` 0..1 (snaps in over 3 f). Colour transform over the picture only; seekable. */
export const ThoughtGrade = ({u, children}: {u: number; children: ReactNode}) => {
  const k = Math.max(0, Math.min(1, u)), m = (a: number, b: number) => a + (b - a) * k;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', inset: 0, filter: `sepia(${m(0, 0.4)}) saturate(${m(1, 1.15)}) contrast(${m(1, 0.92)}) brightness(${m(1, 1.05)})`}}>{children}</div>
      <div style={{position: 'absolute', inset: 0, background: '#e8c88a', mixBlendMode: 'multiply', opacity: 0.28 * k}} />
    </div>
  );
};
/** Cloud-edged frame (the bubble filling the screen, shot 5): the pale bubble fill outside a scalloped hole that holds the picture; `open` 1 = full, 0 = collapsed to a point (the pop). */
export const CloudFrame = ({open, id = 'cloud'}: {open: number; id?: string}) => {
  const k = Math.max(0, Math.min(1, open)), N = 30;
  const pts = Array.from({length: 240}, (_, i) => {
    const a = (i / 240) * Math.PI * 2, sc = 1 + 0.03 * Math.abs(Math.sin((a * N) / 2)) - 0.015, ca = Math.cos(a), sa = Math.sin(a), e = 2 / 4.5;
    return `${(540 + 520 * k * sc * Math.sign(ca) * Math.abs(ca) ** e).toFixed(1)},${(960 + 930 * k * sc * Math.sign(sa) * Math.abs(sa) ** e).toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <path fillRule="evenodd" fill="#f3e6c8" d={`M0,0H1080V1920H0Z M${pts.replace(/ /g, ' L')}Z`} />
      <polygon points={pts} fill="none" stroke="#7a5a3a" strokeWidth={5} strokeLinejoin="round" />
      <defs><linearGradient id={id} /></defs>
    </svg>
  );
};
export const Vignette = ({level, id, color = '#0f1216', inner = 0.5}: {level: number; id: string; color?: string; inner?: number}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    <defs><radialGradient id={id} gradientUnits="userSpaceOnUse" cx={540} cy={860} r={1250}><stop offset={inner} stopColor={color} stopOpacity={0} /><stop offset="1" stopColor={color} stopOpacity={level} /></radialGradient></defs>
    <rect width={1080} height={1920} fill={`url(#${id})`} />
  </svg>
);
/** Calm caption band: REMOVED (user, 2026-11-10: no dark band under the subtitles, edu stroke only). Kept as a no-op so shots that still pass a level draw nothing; the dashed guide
 * in `Painted` stays for guided review stills only. */
export const CalmBand = (_props: {level: number; id: string}) => null; // eslint-disable-line @typescript-eslint/no-unused-vars

type PaintedProps = {paint: (p: Painter, frame: number) => void; paper?: string; band?: boolean; grade?: number; thought?: number; children?: ReactNode; overlay?: ReactNode};
/** Painted canvas (+ picture-space `children`, imagined-graded by `grade` when given) and `overlay` screen layers above it (never graded). */
export const Painted = ({paint, paper = '#3a332c', band = true, grade, thought, children, overlay}: PaintedProps) => {
  const fn = useCallback(({brush, frame}: PaintContext) => paint(makePainter(brush, {t: frame / FPS, frame, fade: paper}), frame), [paint, paper]);
  const picture = <><BrushCanvas paint={fn} paper={paper} />{children}</>;
  return (
    <AbsoluteFill style={{background: paper}}>
      {thought !== undefined ? <ThoughtGrade u={thought}>{picture}</ThoughtGrade> : grade === undefined ? picture : <ImaginedGrade u={grade}>{picture}</ImaginedGrade>}
      <Grain opacity={0.05} />
      {overlay}
      {band && (getInputProps() as {guides?: boolean}).guides !== false && <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.6)', borderBottom: '2px dashed rgba(255,255,255,0.6)'}} />}
    </AbsoluteFill>
  );
};

/** Per-still calm band level (tuned at W3 to the lowest level that passes; 0 = none). */
export const CALM: Record<LfId, number> = {LF01: 0.59, LF02: 0.74, LF03: 0.3, LF04: 0.24, LF05A: 0.68, LF05B: 0.6, TK1: 0, TK2: 0, TK4: 0.74, TK5: 0, TK6: 0, TK7: 0, TK8: 0};
const PAINT: Record<LfId, (p: Painter) => void> = {LF01: paintLF01, LF02: paintLF02, LF03: paintLF03, LF04: paintLF04, LF05A: paintLF05A, LF05B: paintLF05B, TK1: paintTK1, TK2: paintTK2, TK4: paintTK4, TK5: paintTK5, TK6: paintTK6, TK7: paintTK7, TK8: paintTK8};
const IMAGINED = new Set<LfId>(['LF05A', 'LF05B', 'TK7']);
const LABELLED = new Set<LfId>(['LF03', 'LF04', 'LF05A', 'LF05B', 'TK5', 'TK7']);

export const LOOKS = Object.fromEntries(LF_IDS.map((id) => [id, () => (
  <Painted paint={PAINT[id]} grade={IMAGINED.has(id) ? 1 : undefined} overlay={LABELLED.has(id) ? <Lbl /> : undefined}>
    <Vignette level={0.3} id={`v-${id}`} />
    {CALM[id] > 0 && <CalmBand level={CALM[id]} id={`calm-${id}`} />}
  </Painted>
)])) as Record<LfId, () => ReactNode>;
