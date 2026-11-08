import {useCallback, useId} from 'react';
import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter, type Painter} from '../kit/painter';
import {Spot} from '../kit/glow';
import {Grain} from '../kit/screen';
import {camPoint} from '../kit/ycam';
import {camLF02Space, camLF04, paintLF01, paintLF01Poc, paintLF01Wc, paintLF02, paintLF03, paintLF04, SEAM} from './scenes';

export {LF_FRAMES} from './scenes';

// EDU-EP07-SHORT look frames (W3): React wrappers of the paint scenes in scenes.ts. Look stills only: no timeline, voice, caption or channel mark;
// `band` marks the caption band y 1176-1344 (VD18). Render: printf 'EDU7-LF01 0 out/edu07/look-frames/v1/LF01.png\n' | node scripts/stills.mjs src/painted/edu07/look-index.ts

const FPS = 30;
const Painted = ({paint, paper = '#e8dfcc', band = false, children}: {paint: (p: Painter, frame: number) => void; paper?: string; band?: boolean; children?: React.ReactNode}) => {
  const fn = useCallback(({brush, frame}: PaintContext) => paint(makePainter(brush, {t: frame / FPS, frame, fade: paper}), frame), [paint, paper]);
  return (
    <AbsoluteFill style={{background: paper}}>
      <BrushCanvas paint={fn} paper={paper} />
      <Grain opacity={0.06} />
      {children}
      {band && <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.6)', borderBottom: '2px dashed rgba(255,255,255,0.6)'}} />}
    </AbsoluteFill>
  );
};

/** Clock card (brief VD07, N6): cream plaque with an ink border in the fixed box x 700-1020, y 160-280; Remotion type, tabular digits, a small fast-forward glyph. */
export const ClockCard = ({text = '08:19', ff = true}: {text?: string; ff?: boolean}) => (
  <div style={{position: 'absolute', left: 700, top: 160, width: 320, height: 120, boxSizing: 'border-box', background: '#f3ead8', border: '6px solid #2b2a33', borderRadius: 22, boxShadow: '0 6px 0 rgba(43,42,51,0.35)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, color: '#2b2a33', fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 800, fontSize: 72, fontVariantNumeric: 'tabular-nums', letterSpacing: 2}}>
    {ff && <span style={{fontSize: 40, letterSpacing: -6, opacity: 0.85}}>▸▸</span>}
    <span>{text}</span>
  </div>
);

const Blob = ({x, y, rx, ry, color, op}: {x: number; y: number; rx: number; ry: number; color: string; op: number}) => {
  const id = useId();
  return (
    <>
      <defs><radialGradient id={id}><stop offset="0" stopColor={color} stopOpacity={op} /><stop offset="1" stopColor={color} stopOpacity={0} /></radialGradient></defs>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={`url(#${id})`} />
    </>
  );
};
/** Screen-space glow of the space panel (nebula washes and the Sun's halo): soft, clipped to the panel [y0, y1] (kit atmosphere layer, brief N3). */
export const SpaceGlow = ({cam, y0 = 0, y1 = 1920, sun = 1}: {cam: Parameters<typeof camPoint>[0]; y0?: number; y1?: number; sun?: number}) => {
  const s = camPoint(cam, [0, 0, 0]), h = y1 - y0, cid = useId();
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, mixBlendMode: 'screen'}}>
      <defs><clipPath id={cid}><rect x={0} y={y0} width={1080} height={h} /></clipPath></defs>
      <g clipPath={`url(#${cid})`}>
        <Blob x={300} y={y0 + h * 0.28} rx={520} ry={h * 0.26} color="#33479a" op={0.6} />
        <Blob x={820} y={y0 + h * 0.66} rx={480} ry={h * 0.24} color="#4a3590" op={0.55} />
        <Blob x={460} y={y0 + h * 0.9} rx={560} ry={h * 0.2} color="#2c4a8a" op={0.45} />
        {s && sun > 0 && <><Spot x={s[0]} y={s[1]} r={330} color="#ffb347" level={0.3 * sun} /><Spot x={s[0]} y={s[1]} r={130} color="#ffe9a8" level={0.3 * sun} /></>}
      </g>
    </svg>
  );
};

export const LF01 = () => <Painted paint={paintLF01} />;
const PaintedWc = ({paper = '#e8dfcc'}: {paper?: string}) => {
  const fn = useCallback(({brush, textured, frame}: PaintContext) => paintLF01Wc(makePainter(brush, {t: frame / FPS, frame, fade: paper}), frame, makePainter(textured ?? brush, {t: frame / FPS, frame, fade: paper})), [paper]);
  return (
    <AbsoluteFill style={{background: paper}}>
      <BrushCanvas paint={fn} paper={paper} />
      <Grain opacity={0.06} />
    </AbsoluteFill>
  );
};
export const LF01Wc = () => <PaintedWc />;
export const LF01Poc = () => <Painted paint={paintLF01Poc} />;
export const LF02 = () => <Painted paint={paintLF02}><SpaceGlow cam={camLF02Space} y0={0} y1={SEAM} sun={0} /><ClockCard /></Painted>;
export const LF03 = () => <Painted paint={paintLF03} paper="#101a38" />;
export const LF04 = () => <Painted paint={paintLF04} paper="#070b1a"><SpaceGlow cam={camLF04} /></Painted>;
