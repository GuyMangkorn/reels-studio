import {useCallback, useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, getInputProps} from 'remotion';
import {measureText} from '@remotion/layout-utils';
import {EDU14_CUES} from '../../videos/edu-ep14/cues';
import {QUIET, quietOpacity, quietRect} from './quiet';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {camPoint, type YCam} from '../kit/ycam';
import type {V3} from '../kit/space';
import {Arrow, ColumnDiagram, Lbl, RealDial, Ring} from './diagram';
import {NoAirGrade} from './grade';
import {C} from './palette';
import {camLF01, camLF02, columnLF03, DROP_AT, LF_FRAMES, paintLF01, paintLF02, paintLF02U, paintLF03, paintLF04, paintLF05} from './scenes';

export {LF_FRAMES};
// EDU-EP14-SHORT look stills (W3). Look stills only: no timeline, voice or caption text; the dashed band marks the caption band y 1176-1344.
// Render: printf 'EDU14-LF01 0 out/edu14/look-frames/v1/LF01.png\n' | node scripts/stills.mjs src/painted/edu14/look-index.ts
const FPS = 30;
type PaintedProps = {paint: (p: Painter, frame: number) => void; paper?: string; band?: boolean; grade?: number; children?: React.ReactNode; overlay?: React.ReactNode; calm?: number; at?: number};
/** Painted canvas (+ picture-space `children`, graded by `grade` 0..1 when given) and `overlay` screen layers above it (never graded). */
export const Painted = ({paint, paper = '#6f7f86', band = true, grade, children, overlay, calm = 0, at}: PaintedProps) => {
  const fn = useCallback(({brush, frame}: PaintContext) => paint(makePainter(brush, {t: frame / FPS, frame, fade: paper}), frame), [paint, paper]);
  const picture = <><BrushCanvas paint={fn} paper={paper} />{children}</>;
  return (
    <AbsoluteFill style={{background: paper}}>
      {grade === undefined ? picture : <NoAirGrade u={grade}>{picture}</NoAirGrade>}
      {calm > 0 && at !== undefined && <QuietPatches k={calm} f={at} />}
      <Grain opacity={0.05} />
      {overlay}
      {band && (getInputProps() as {guides?: boolean}).guides !== false && <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.6)', borderBottom: '2px dashed rgba(255,255,255,0.6)'}} />}
    </AbsoluteFill>
  );
};

/** Compact quiet patch (user, 10 Nov 2026: "as wide as the subtitle and as tall as the subtitle, no fixed height or width"): one per caption on screen, a soft-edged rounded rectangle that
 * blurs a little (1.5-3 px, no hot spots) and dims the painting by `k` (0..1) behind exactly that caption's text block, so the edu stroke reads. Rectangle from the caption's own layout
 * (src/scenes/Subtitles.tsx, captionLayout.ts): width = widest line measured with the caption font (Noto Sans Thai 700, 51 px) + the 14 px stroke, height = lines x line box (84.15 px),
 * centred on x 540, bottom edge y 1344 (the cue style `bottomEdgeY`); + PAD each side, then a FEATHER fade outward. Fades in over the 3 frames before the cue and out over its last 3. */
export {QUIET, quietRect, quietOpacity};
export const QuietPatches = ({k, f}: {k: number; f: number}) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const h = delayRender('edu14 quiet font');
    document.fonts.load(`${QUIET.weight} ${QUIET.font}px "${QUIET.family}"`, 'ก').then(() => setReady(true)).catch(() => setReady(true)).finally(() => continueRender(h));
  }, []);
  if (!ready) return null;
  return <>{EDU14_CUES.filter((c) => c.text && f >= c.from - QUIET.ramp && f < c.to).map((c) => {
    const o = quietOpacity(f, c.from, c.to);
    if (o <= 0) return null;
    const r = quietRect(c.text, (line) => measureText({text: line, fontFamily: QUIET.family, fontSize: QUIET.font, fontWeight: String(QUIET.weight), validateFontIsLoaded: false}).width);
    return <QuietPatch key={c.id} k={k * o} {...r} />;
  })}</>;
};
const QuietPatch = ({k, x, y, w, h}: {k: number; x: number; y: number; w: number; h: number}) => {
  const F = QUIET.feather, mx = `linear-gradient(to right, transparent 0, #000 ${F}px, #000 ${w + F}px, transparent ${w + 2 * F}px)`, my = `linear-gradient(to bottom, transparent 0, #000 ${F}px, #000 ${h + F}px, transparent ${h + 2 * F}px)`;
  return <div style={{position: 'absolute', left: x - F, top: y - F, width: w + 2 * F, height: h + 2 * F, backdropFilter: `blur(${(1.5 + 3 * k).toFixed(2)}px) brightness(${(1 - k).toFixed(3)})`,
    WebkitMaskImage: `${mx}, ${my}`, maskImage: `${mx}, ${my}`, WebkitMaskComposite: 'source-in', maskComposite: 'intersect'}} />;
};

/** Calm caption band (VD32 precedent): a dark ramp over the lower frame, strongest across the caption band y 1176-1344, so the edu stroke reads on bright sets. */
export const CalmBand = ({level, id}: {level: number; id: string}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    <defs><linearGradient id={id} gradientUnits="userSpaceOnUse" x1={0} y1={640} x2={0} y2={1920}>
      <stop offset="0" stopColor="#0c1316" stopOpacity={0} /><stop offset="0.42" stopColor="#0c1316" stopOpacity={level} /><stop offset="0.66" stopColor="#0c1316" stopOpacity={level} /><stop offset="1" stopColor="#0c1316" stopOpacity={level * 0.8} />
    </linearGradient></defs>
    <rect y={640} width={1080} height={1280} fill={`url(#${id})`} />
  </svg>
);

/** A soft light pool (screen blend) round a world point: the ad lightbox rim. */
export const Pool = ({cam, at, r, color, level = 1, id}: {cam: YCam; at: V3; r: number; color: string; level?: number; id: string}) => {
  const c = camPoint(cam, at);
  if (!c) return null;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <defs><radialGradient id={id} gradientUnits="userSpaceOnUse" cx={c[0]} cy={c[1]} r={r}><stop offset="0" stopColor={color} stopOpacity={0.5 * level} /><stop offset="0.5" stopColor={color} stopOpacity={0.18 * level} /><stop offset="1" stopColor={color} stopOpacity={0} /></radialGradient></defs>
      <rect width={1080} height={1920} fill={`url(#${id})`} style={{mixBlendMode: 'screen'}} />
    </svg>
  );
};
/** Edge fall-off (vignette) in a colour. */
export const Edge = ({color, level, inner = 0.55, id}: {color: string; level: number; inner?: number; id: string}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    <defs><radialGradient id={id} gradientUnits="userSpaceOnUse" cx={540} cy={900} r={1250}><stop offset={inner} stopColor={color} stopOpacity={0} /><stop offset="1" stopColor={color} stopOpacity={level} /></radialGradient></defs>
    <rect width={1080} height={1920} fill={`url(#${id})`} />
  </svg>
);

export const LF01 = () => (
  <Painted paint={paintLF01}>
    <Pool cam={camLF01} at={[-0.7, 1.4, -1.6]} r={520} color="#cfe6ee" level={0.5} id="lightbox" />
    <Edge color="#10181b" level={0.4} id="edge1" />
    <CalmBand level={0.42} id="calm1" />
  </Painted>
);
export const LF02 = () => (
  <Painted paint={paintLF02} grade={1} overlay={<Lbl />}>
    <Pool cam={camLF02} at={[-0.7, 1.4, -1.6]} r={520} color="#cfe6ee" level={0.5} id="lightbox2" />
    <Edge color="#10181b" level={0.4} id="edge2" />
    <CalmBand level={0.36} id="calm2" />
  </Painted>
);
export const LF02U = () => (
  <Painted paint={paintLF02U} grade={0}>
    <Pool cam={camLF02} at={[-0.7, 1.4, -1.6]} r={520} color="#cfe6ee" level={0.5} id="lightbox2u" />
    <Edge color="#10181b" level={0.4} id="edge2u" />
  </Painted>
);
export const LF03 = () => (
  <Painted paint={paintLF03} grade={1} overlay={<><ColumnDiagram baseY={columnLF03.baseY} groundY={columnLF03.groundY} /><Lbl /></>}>
    <Edge color="#10181b" level={0.25} id="edge3" />
    <CalmBand level={0.6} id="calm3" />
  </Painted>
);
export const LF04 = () => (
  <Painted paint={paintLF04} grade={1} overlay={<Lbl />}>
    <Edge color="#10181b" level={0.3} id="edge4" />
    <CalmBand level={0.15} id="calm4" />
  </Painted>
);
export const LF05 = () => (
  <Painted paint={paintLF05} overlay={<>
    <Arrow x={DROP_AT[0]} y0={DROP_AT[1] + 215} len={140} dir="up" color={C.white} />
    <Arrow x={DROP_AT[0]} y0={DROP_AT[1] - 215} len={140} dir="down" color={C.amber} label="น้ำหนัก" />
    <Ring x={DROP_AT[0]} y={DROP_AT[1]} d={100} />
    <RealDial a={32} />
  </>}>
    <Edge color="#10181b" level={0.3} id="edge5" />
    <CalmBand level={0.7} id="calm5" />
  </Painted>
);
