import {loadFont} from '@remotion/fonts';
import type {CSSProperties, ReactNode} from 'react';
import {useCallback} from 'react';
import {AbsoluteFill, getInputProps, staticFile, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {TH} from './palette';
import {paintFrameRim, paintLFForest, paintSH13, paintSH15End, paintSH15S, STK} from './scenes';

// EDU-EP16-SHORT look stills (W3, Film). Stills only: no timeline, voice or caption text; "ภาพจำลอง" is the DOM label (LBL, VD12) on every imagination
// still; the dashed lines mark the caption band y 1176-1344 (off with --props='{"guides":false}' for the caption-zone measure).
// Group 1 (thought-space, monster, forest): LF-THOUGHT (= SH13), SH13-KIND, SH15-END, SH15S (24 f, render any frame), LF-FOREST.
// Render on one Chrome: printf 'EDU16-LF-THOUGHT 0 out/edu16/look-frames/v1/LF-THOUGHT.png\n' | node scripts/stills.mjs src/painted/edu16/look-index.ts

if (typeof document !== 'undefined') loadFont({family: 'Noto Sans Thai', url: staticFile('fonts/NotoSansThai.ttf'), weight: '100 900'});

const FPS = 30;
const FONT = "'Noto Sans Thai', sans-serif";
const edu = (size: number, stroke = 6): CSSProperties => ({fontFamily: FONT, fontWeight: 800, fontSize: size, color: '#ffffff', lineHeight: 1, WebkitTextStroke: `${stroke}px #14100c`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'});
/** LBL slot (816-1020 x 148-204): "ภาพจำลอง" (VD12). */
export const Lbl = () => (
  <div lang="th" style={{position: 'absolute', left: 816, top: 148, width: 204, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', ...edu(40)}}>ภาพจำลอง</div>
);

type Paint = (p: Painter, frame: number) => void;
const Painted = ({paint, label = true}: {paint: Paint; label?: boolean}) => {
  const fn = useCallback(({brush, frame}: PaintContext) => paint(makePainter(brush, {t: frame / FPS, frame, fade: TH.void}), frame), [paint]);
  const guides = (getInputProps() as {guides?: boolean}).guides !== false;
  return (
    <AbsoluteFill style={{background: TH.void}}>
      <BrushCanvas paint={fn} paper={TH.void} />
      <Grain opacity={0.05} />
      {label && <Lbl />}
      {guides && <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.6)', borderBottom: '2px dashed rgba(255,255,255,0.6)'}} />}
    </AbsoluteFill>
  );
};

/** Every imagination still ends with the frame rim (bubble language, VD09); `rim` gives its level per frame. */
const withRim = (draw: Paint, rim: (f: number) => number = () => 1): Paint => (p, f) => { draw(p, f); paintFrameRim(p, {t: f / FPS, level: rim(f)}); };

export const LOOK_PAINT: Record<string, {paint: Paint; frames: number}> = {
  'LF-THOUGHT': {paint: withRim((p) => paintSH13(p, {t: 0.9})), frames: 1},
  'SH13-KIND': {paint: withRim((p) => paintSH13(p, {t: 1.7, kind: true})), frames: 1},
  'SH15-END': {paint: withRim((p) => paintSH15End(p, {t: 2.6})), frames: 1},
  SH15S: {paint: withRim((p, f) => paintSH15S(p, f), (f) => (f >= STK.blackFrom ? 0.35 : 1)), frames: STK.len},
  'LF-FOREST': {paint: withRim((p) => paintLFForest(p, {t: 1.4})), frames: 1},
};

const Still = ({id}: {id: string}) => {
  useCurrentFrame();
  return <Painted paint={LOOK_PAINT[id].paint} />;
};
export const LOOKS = Object.fromEntries(Object.keys(LOOK_PAINT).map((id) => [id, () => <Still id={id} />])) as Record<string, () => ReactNode>;
