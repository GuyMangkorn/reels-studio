import {loadFont} from '@remotion/fonts';
import {useCallback, type ReactNode} from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {camPoint, camUnit} from '../kit/ycam';
import {LR13, OX} from './room';
import {arcPoint, CAM_MACRO, CAM_MYTH as CAM_MYTH_REF, CAM_TRUTH, FLEA_MM, LF_FRAMES, paintF1, paintF2, paintF3, paintF3b, paintF4, paintF5, paintF6, paintLF01, paintLF02, paintLF03, paintLF04, paintLF04b, CAM_TR_SKY, SKY_APEX, skyTrail} from './scenes';
import {TRAILER_GRADE} from './trailer';

export {LF_FRAMES} from './scenes';

if (typeof document !== 'undefined') loadFont({family: 'Noto Sans Thai', url: staticFile('fonts/NotoSansThai.ttf'), weight: '100 900'});

// EDU-EP13-SHORT look frames (W3.1): React wrappers of the paint scenes in scenes.ts. Look stills only: no timeline, voice, caption or channel
// mark; `band` marks the caption band y 1176-1344 on the flea look-check stills (SP1). Screen layers (bar, labels, arc, band, tag) are DOM.
// Render: printf 'EDU13-LF01 0 out/edu13/look-frames/v1/LF01.png\n' | node scripts/stills.mjs src/painted/edu13/look-index.ts

const FPS = 30;
const PAPER = '#efe8d8';

export const Painted = ({paint, band = false, vignette = 'rgba(60,40,20,0.2)', grain = 0.08, children}: {paint: (p: Painter, frame: number) => void; band?: boolean; vignette?: string; grain?: number; children?: ReactNode}) => {
  const fn = useCallback(({brush, frame}: PaintContext) => paint(makePainter(brush, {t: frame / FPS, frame, fade: PAPER}), frame), [paint]);
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <BrushCanvas paint={fn} paper={PAPER} />
      <AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(ellipse 95% 75% at 50% 42%, rgba(0,0,0,0) 58%, ${vignette} 100%)`}} />
      <Grain opacity={grain} />
      {children}
      {band && <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '3px dashed rgba(255,255,255,0.9)', borderBottom: '3px dashed rgba(255,255,255,0.9)', boxShadow: '0 0 0 1px rgba(0,0,0,0.35)'}} />}
    </AbsoluteFill>
  );
};

export const stroke = {WebkitTextStroke: '6px #1d2129', paintOrder: 'stroke fill', textShadow: '0 3px 0 #1d2129'} as const;
/** LBL slot (816-1020, 148-204): "ภาพจำลอง" on every macro shot (VD04). */
export const Lbl = ({text = 'ภาพจำลอง'}: {text?: string}) => (
  <div lang="th" style={{position: 'absolute', left: 816, top: 148, width: 204, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Noto Sans Thai', fontWeight: 700, fontSize: 34, color: '#fff'}}>
    <span style={stroke}>{text}</span>
  </div>
);
export const Text = ({x, y, text, size = 44, anchor = 'start'}: {x: number; y: number; text: string; size?: number; anchor?: 'start' | 'middle'}) => (
  <div lang="th" style={{position: 'absolute', left: anchor === 'middle' ? x - 400 : x, top: y, width: anchor === 'middle' ? 800 : undefined, textAlign: anchor === 'middle' ? 'center' : 'left', whiteSpace: 'nowrap', fontFamily: 'Noto Sans Thai', fontWeight: 700, fontSize: size, color: '#fff'}}>
    <span style={stroke}>{text}</span>
  </div>
);

/** Scale bar "2 มม." (SH02, before take-off): a flat screen bar exactly the drawn body length (2.0 mm = camera px/mm x 2). */
const ScaleBar = ({y = 1100}: {y?: number}) => {
  const px = camUnit(CAM_MACRO, [0, 0, 0]) * FLEA_MM, x0 = 540 - px / 2, x1 = 540 + px / 2;
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <g stroke="#1d2129" strokeWidth={14} strokeLinecap="round"><line x1={x0} x2={x1} y1={y} y2={y} /><line x1={x0} x2={x0} y1={y - 22} y2={y + 22} /><line x1={x1} x2={x1} y1={y - 22} y2={y + 22} /></g>
        <g stroke="#fff" strokeWidth={6} strokeLinecap="round"><line x1={x0} x2={x1} y1={y} y2={y} /><line x1={x0} x2={x0} y1={y - 22} y2={y + 22} /><line x1={x1} x2={x1} y1={y - 22} y2={y + 22} /></g>
      </svg>
      <Text x={x1 + 26} y={y - 36} text="2 มม." size={48} />
    </>
  );
};

/** The naive myth arc (LF03, apex frame): dotted from the flea's head over the roof, a ring marker at the apex, the label by the rising half. */
const MythArc = () => {
  const dots: [number, number][] = [];
  for (let i = 0; i <= 60; i++) { const q = camPoint(CAM_MYTH_REF, arcPoint((i / 60) * 0.5)); if (q) dots.push(q); }
  const apex = camPoint(CAM_MYTH_REF, arcPoint(0.5)), lab = camPoint(CAM_MYTH_REF, arcPoint(0.16));
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        {dots.map(([x, y], i) => i % 2 === 0 && <g key={i}><circle cx={x} cy={y} r={9} fill="#1d2129" /><circle cx={x} cy={y} r={5.5} fill="#fff" /></g>)}
        {apex && <g><circle cx={apex[0]} cy={apex[1]} r={30} fill="none" stroke="#1d2129" strokeWidth={14} /><circle cx={apex[0]} cy={apex[1]} r={30} fill="none" stroke="#ff5a3c" strokeWidth={7} /></g>}
      </svg>
      {lab && <Text x={Math.max(130, lab[0] - 400)} y={lab[1] - 40} text="ถ้าคิดแบบง่าย ๆ" size={46} />}
    </>
  );
};

/** The truth freeze's band (VD21): 0.10-0.50 m at the actors' plane z 0.35, butter at 35 %, label at its left end, the tag in the upper area. */
const TruthBand = () => {
  const z = LR13.manMark[2], xa = OX - 0.5, xb = OX + 2.42, a = camPoint(CAM_TRUTH, [xa, 0.1, z]), b = camPoint(CAM_TRUTH, [xb, 0.5, z]);
  if (!a || !b) return null;
  return (
    <>
      <div style={{position: 'absolute', left: a[0], top: b[1], width: b[0] - a[0], height: a[1] - b[1], background: 'rgba(242,217,122,0.35)', borderTop: '3px solid rgba(255,255,255,0.8)', borderBottom: '3px solid rgba(255,255,255,0.8)'}} />
      <Text x={24} y={a[1] - 68} text="หลักสิบเซน" size={40} />
      <Text x={540} y={200} text="สูงพอ ๆ กัน" size={64} anchor="middle" />
    </>
  );
};

/** Trailer card "ถ้าคิดแบบง่าย ๆ" (VD26): series caption font, bold, wide tracking, white with a soft warm glow, slot TC (rows 1010-1100). */
const TrailerCard = ({y = 1010}: {y?: number}) => (
  <div lang="th" style={{position: 'absolute', left: 0, width: 1080, top: y, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Noto Sans Thai', fontWeight: 800, fontSize: 64, letterSpacing: 6, color: '#fff'}}>
    <span style={{WebkitTextStroke: '8px #1d2129', paintOrder: 'stroke fill', textShadow: `0 0 26px ${TRAILER_GRADE.sunGlow}, 0 3px 0 #1d2129`}}>ถ้าคิดแบบง่าย ๆ</span>
  </div>
);
/** SH04C ring marker at the silhouette (true scale, about 20 px) with a short dotted trail behind it (VD29). */
const SkyMarker = () => {
  const a = camPoint(CAM_TR_SKY, SKY_APEX), trail = skyTrail();
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
      {trail.map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={7} fill="#1d2129" /><circle cx={x} cy={y} r={4.2} fill="#fff" /></g>)}
      {a && <g><circle cx={a[0]} cy={a[1]} r={34} fill="none" stroke="#1d2129" strokeWidth={13} /><circle cx={a[0]} cy={a[1]} r={34} fill="none" stroke="#ff5a3c" strokeWidth={6.5} /></g>}
    </svg>
  );
};
const TRAILER_VIGNETTE = 'rgba(10,22,40,0.5)';

export const LF01 = () => <Painted paint={paintLF01} />;
export const LF02 = () => <Painted paint={paintLF02}><Lbl /><ScaleBar /></Painted>;
export const LF03 = () => <Painted paint={paintLF03} vignette="rgba(40,70,100,0.18)"><MythArc /></Painted>;
export const LF04 = () => <Painted paint={paintLF04} vignette={TRAILER_VIGNETTE} grain={0.13}><SkyMarker /><TrailerCard /></Painted>;
export const LF04b = () => <Painted paint={paintLF04b} vignette={TRAILER_VIGNETTE} grain={0.13}><TrailerCard /></Painted>;
export const F1 = () => <Painted paint={paintF1} band><Lbl /><ScaleBar /></Painted>;
export const F2 = () => <Painted paint={paintF2} band><Lbl /></Painted>;
export const F3 = () => <Painted paint={paintF3} band />;
export const F3b = () => <Painted paint={paintF3b} band />;
export const F4 = () => <Painted paint={paintF4} band />;
export const F5 = () => <Painted paint={paintF5} band><TruthBand /></Painted>;
export const F6 = () => <Painted paint={paintF6} band />;
