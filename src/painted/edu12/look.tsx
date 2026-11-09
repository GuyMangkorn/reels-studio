import {useCallback} from 'react';
import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {PaintedLabel} from '../Label';
import {makePainter, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {camPoint, type YCam} from '../kit/ycam';
import type {V3} from '../kit/space';
import {LAMP, wordAt} from './home';
import {camLF01, camLF02, camLF03, camLF04, paintLF01, paintLF02, paintLF03, paintLF04, paintLF05} from './scenes';

export {LF_FRAMES} from './scenes';

// EDU-EP12-SHORT look frames (W3): React wrappers of the paint scenes in scenes.ts. Look stills only: no timeline, voice or caption text;
// `band` marks the caption band y 1176-1344 (dashed), tags are the production `PaintedLabel` (VD14 slots), the pencil word "เช้า" is a DOM
// overlay projected from the set (brief: pencil, letter height 0.03 m).
// Render: printf 'EDU12-LF01 0 out/edu12/look-frames/v1/LF01.png\n' | node scripts/stills.mjs src/painted/edu12/look-index.ts

const FPS = 30;
const Painted = ({paint, paper = '#e8dfcc', band = true, tags = [], children}: {paint: (p: Painter, frame: number) => void; paper?: string; band?: boolean; tags?: string[]; children?: React.ReactNode}) => {
  const fn = useCallback(({brush, frame}: PaintContext) => paint(makePainter(brush, {t: frame / FPS, frame, fade: paper}), frame), [paint, paper]);
  return (
    <AbsoluteFill style={{background: paper}}>
      <BrushCanvas paint={fn} paper={paper} />
      <Grain opacity={0.06} />
      {children}
      {tags.map((t, i) => <PaintedLabel key={t} text={t} slot={i} />)}
      {band && <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.6)', borderBottom: '2px dashed rgba(255,255,255,0.6)'}} />}
    </AbsoluteFill>
  );
};

/** The pencil word "เช้า" beside the morning line (graphite, handwritten weight). */
const Word = ({cam}: {cam: YCam}) => {
  const w = wordAt(cam);
  if (!w) return null;
  return (
    <div lang="th" style={{position: 'absolute', left: w.x, top: w.y - w.h * 1.25, fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 500, fontSize: w.h * 1.15, lineHeight: 1,
      color: 'rgba(58,58,66,0.85)', transform: `rotate(${w.skew}rad)`, transformOrigin: 'left bottom', whiteSpace: 'nowrap'}}>เช้า</div>
  );
};

/** A soft light pool (screen + soft-light) round a world point: lamps and the morning sun. */
const Pool = ({cam, at, r, color, level = 1, id}: {cam: YCam; at: V3; r: number; color: string; level?: number; id: string}) => {
  const c = camPoint(cam, at);
  if (!c) return null;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <defs><radialGradient id={id} gradientUnits="userSpaceOnUse" cx={c[0]} cy={c[1]} r={r}><stop offset="0" stopColor={color} stopOpacity={0.5 * level} /><stop offset="0.5" stopColor={color} stopOpacity={0.18 * level} /><stop offset="1" stopColor={color} stopOpacity={0} /></radialGradient></defs>
      <rect width={1080} height={1920} fill={`url(#${id})`} style={{mixBlendMode: 'screen'}} />
    </svg>
  );
};
/** Edge fall-off (vignette) in a colour; `feather` = the memory edge of the flashback (cool, soft, wide). */
const Edge = ({color, level, inner = 0.55, id}: {color: string; level: number; inner?: number; id: string}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    <defs><radialGradient id={id} gradientUnits="userSpaceOnUse" cx={540} cy={900} r={1250}><stop offset={inner} stopColor={color} stopOpacity={0} /><stop offset="1" stopColor={color} stopOpacity={level} /></radialGradient></defs>
    <rect width={1080} height={1920} fill={`url(#${id})`} />
  </svg>
);

export const LF01 = () => (
  <Painted paint={paintLF01}>
    <Pool cam={camLF01} at={[0.7, 2.0, 0.1]} r={620} color="#ffcf8a" level={0.85} id="sconce" />
    <Pool cam={camLF01} at={LAMP} r={150} color="#ffc477" level={0.7} id="bedside" />
    <Word cam={camLF01} />
    <Edge color="#1a1008" level={0.45} id="edge1" />
  </Painted>
);
export const LF02 = () => (
  <Painted paint={paintLF02}>
    <Pool cam={camLF02} at={[1.5, 1.4, 0.0]} r={900} color="#ffe2a8" level={0.9} id="sun" />
    <Word cam={camLF02} />
    <Edge color="#6a5a7a" level={0.18} id="edge2" />
  </Painted>
);
export const LF03 = () => (
  <Painted paint={paintLF03} tags={['ภาพประกอบ']}>
    <Pool cam={camLF03} at={[0.7, 2.0, 0.1]} r={700} color="#ffcf8a" level={0.4} id="sconce3" />
  </Painted>
);
export const LF04 = () => (
  <Painted paint={paintLF04} tags={['ภาพประกอบ']}>
    <Pool cam={camLF04} at={[-3.38, 1.4, -1.9]} r={700} color="#9fb6dc" level={0.5} id="moonwin" />
    <Edge color="#26355e" level={0.75} inner={0.45} id="memory" />
  </Painted>
);
export const LF05 = () => <Painted paint={paintLF05} tags={['ภาพจำลอง', 'ภาพประกอบ']} />;
void wordAt; void camPoint;
