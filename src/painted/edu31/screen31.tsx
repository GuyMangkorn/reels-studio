import type {CSSProperties, ReactNode} from 'react';
import {Img, staticFile} from 'remotion';
import type {V3} from '../kit/space';
import type {YCam} from '../kit/ycam';
import {onQuad} from './overlay31';

// EDU-EP31-SHORT screen presets (VD31-08 CCTV and CRT, VD31-09 news bumper; Boss W5.2 batch 2, 2026-11-21). One home for the screen layers the
// W3 look frames (look.tsx) and the registered plates (shot.tsx) both use; moved here from look.tsx unchanged (CCTV filter, overlay, CRT glass) and
// extended for the timed plates: the CCTV overlay takes the ambient clock (rolling noise band) and the CRT screen states (dark glass, click-on
// line, bumper, picture, roll). Pure functions of their props, no state, so every frame is direct-seekable. Kept free of EP31 story values (the
// timestamp text and still are props) for kit intake (`new: cctv-preset`, `new: crt-screen`, `new: news-bumper-1995`).

/** Horizontal scanlines: `op` line darkness, `step` px period. */
export const scan = (op: number, step = 4): CSSProperties => ({position: 'absolute', inset: 0, pointerEvents: 'none',
  background: `repeating-linear-gradient(0deg, rgba(0,0,0,${op}) 0px, rgba(0,0,0,${op}) ${step / 2}px, transparent ${step / 2}px, transparent ${step}px)`});

/** VD31-08 CCTV preset: grey-green mono with lifted blacks (a dark beard sits in the middle value), softness for the low resolution. CSS filter on
 *  the picture (canvas and its DOM picture layers). */
export const CCTV_FILTER = 'grayscale(1) sepia(0.45) hue-rotate(48deg) saturate(1.25) contrast(0.72) brightness(1.22) blur(1.4px)';
/** CCTV hold: the picture advances every `n`-th frame (10 fps at n 3 on a 30 fps clock). Returns the held frame of L. */
export const cctvHold = (L: number, n = 3) => L - (((L % n) + n) % n);
/** The CCTV overlay over the filtered picture: scanlines, a noise band (rolling on the ambient clock `t` frames when given; fixed at the
 *  look-frame position when absent), edge vignette, the timestamp row (left 120, top 1440: outside the caption band 1100-1344) and REC + camera. */
export const CctvOverlay = ({stamp = 'JAN 06 1995', cam = 'CAM 2', t}: {stamp?: string; cam?: string; t?: number}) => {
  const band = t === undefined ? 1010 : ((1010 + t * 41) % 2100) - 90;
  return (
    <>
      <div style={scan(0.22, 6)} />
      <div style={{position: 'absolute', left: 0, right: 0, top: band, height: 70, background: 'linear-gradient(180deg, transparent, rgba(220,240,210,0.13), transparent)'}} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(10,20,12,0.55) 100%)'}} />
      <div style={{position: 'absolute', left: 120, top: 1440, fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 52, color: '#e6f2dc', letterSpacing: 4, textShadow: '0 0 6px rgba(200,255,200,0.5), 3px 3px 0 #0b140c'}}>{stamp}</div>
      <div style={{position: 'absolute', right: 110, top: 250, display: 'flex', alignItems: 'center', gap: 16, fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 46, color: '#e6f2dc', letterSpacing: 3, textShadow: '3px 3px 0 #0b140c'}}>
        <span style={{width: 26, height: 26, borderRadius: 13, background: '#ff2a1e', boxShadow: '0 0 10px #ff2a1e'}} />{`REC  ${cam}`}
      </div>
    </>
  );
};
/** The timestamp row's picture span (px), for the caption-band check: top 1440, 52 px Courier, one line. */
export const CCTV_STAMP_ROW = {top: 1440, bottom: 1440 + 52 * 1.15};

/** CRT picture look (applied to an image shown on the tube). */
export const crtLook: CSSProperties = {filter: 'contrast(1.05) brightness(1.08) saturate(0.9)'};
/** CRT glass over a picture: scanlines, phosphor falloff, a soft reflection highlight. */
export const CrtGlass = ({lines = 0.28, step = 10}: {lines?: number; step?: number}) => (
  <>
    <div style={scan(lines, step)} />
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(170,200,255,0.10) 30%, rgba(0,0,0,0.55) 100%)'}} />
    <div style={{position: 'absolute', left: '8%', top: '6%', width: '40%', height: '22%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.10), transparent 70%)'}} />
  </>
);

/** What the tube shows at one frame. `off`: dark glass with a faint room reflection. `line`: the click-on line, `k` 0..1 from a thin bright line
 *  to the full raster. `bumper`: the VD31-09 bumper at its frame `f` (0..17). `image`: a still (`src`, `pos` object-position). `glass`: only the
 *  glass (the picture is painted under it in the canvas). `roll` 0..1 adds a vertical roll with a black frame bar (a picture switch). */
export type CrtState =
  | {mode: 'off'} | {mode: 'line'; k: number} | {mode: 'bumper'; f: number}
  | {mode: 'image'; src: string; pos?: string; roll?: number} | {mode: 'glass'; roll?: number};

const W = 800, H = 600;
const RollBar = ({roll}: {roll: number}) => roll <= 0 ? null : (
  <div style={{position: 'absolute', left: 0, right: 0, top: `${(roll * 130) % 100 - 18}%`, height: '16%', background: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.92) 30%, rgba(0,0,0,0.92) 70%, rgba(0,0,0,0))'}} />
);

/** VD31-09 1995 local news bumper, 800 x 600 (4:3), frame f 0..17: blue gradient, a spinning wireframe globe, a chrome swoosh sweeping in,
 *  bevelled gold NEWS (no station, no number, no logo) and a lens flare crossing. SVG, deterministic in f. */
export const NewsBumper = ({f}: {f: number}) => {
  const k = Math.max(0, Math.min(1, f / 17)), rot = f * 0.21;
  const swoosh = Math.min(1, f / 8), word = Math.max(0, Math.min(1, (f - 4) / 5)), flareX = -120 + 1040 * k;
  const gx = 400, gy = 262, gr = 168;
  const meridians = Array.from({length: 6}, (_, i) => Math.cos(rot + (i * Math.PI) / 6));
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
      <defs>
        <radialGradient id="nb-bg" cx="50%" cy="42%" r="75%"><stop offset="0" stopColor="#2f6fd6" /><stop offset="0.55" stopColor="#123f9a" /><stop offset="1" stopColor="#06163f" /></radialGradient>
        <linearGradient id="nb-chrome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="0.45" stopColor="#aeb8c6" /><stop offset="0.55" stopColor="#5d6878" /><stop offset="1" stopColor="#e9eef5" /></linearGradient>
        <linearGradient id="nb-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff3b0" /><stop offset="0.48" stopColor="#f2c23a" /><stop offset="0.52" stopColor="#b9821a" /><stop offset="1" stopColor="#ffe07a" /></linearGradient>
        <radialGradient id="nb-flare"><stop offset="0" stopColor="#ffffff" stopOpacity="0.95" /><stop offset="0.25" stopColor="#bfe0ff" stopOpacity="0.45" /><stop offset="1" stopColor="#bfe0ff" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#nb-bg)" />
      <g stroke="#9fd0ff" strokeOpacity={0.75} fill="none" strokeWidth={2.4}>
        <circle cx={gx} cy={gy} r={gr} fill="rgba(60,140,255,0.18)" />
        {meridians.map((m, i) => <ellipse key={`m${i}`} cx={gx} cy={gy} rx={Math.abs(m) * gr} ry={gr} strokeOpacity={m > 0 ? 0.8 : 0.3} />)}
        {[-0.66, -0.33, 0, 0.33, 0.66].map((v, i) => { const y = gy + v * gr, rx = Math.sqrt(1 - v * v) * gr; return <ellipse key={`p${i}`} cx={gx} cy={y} rx={rx} ry={rx * 0.16} />; })}
      </g>
      <g opacity={swoosh}>
        <path d={`M${-60 + 120 * (1 - swoosh)} 430 C 200 300, 520 520, ${880 - 80 * (1 - swoosh)} 360 L ${880 - 80 * (1 - swoosh)} 392 C 520 560, 200 350, ${-60 + 120 * (1 - swoosh)} 466 Z`} fill="url(#nb-chrome)" stroke="#2a3446" strokeWidth={2} />
      </g>
      <g transform={`translate(400 ${452}) scale(${0.6 + 0.4 * word})`} opacity={word}>
        <text x={6} y={8} textAnchor="middle" dominantBaseline="middle" fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif" fontWeight={900} fontSize={150} fill="#3a2406" letterSpacing={10}>NEWS</text>
        <text x={0} y={0} textAnchor="middle" dominantBaseline="middle" fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif" fontWeight={900} fontSize={150} fill="url(#nb-gold)" stroke="#7a4f0c" strokeWidth={4} letterSpacing={10}>NEWS</text>
      </g>
      <g style={{mixBlendMode: 'screen'}}>
        <circle cx={flareX} cy={190} r={150} fill="url(#nb-flare)" />
        <circle cx={800 - flareX * 0.6} cy={340} r={36} fill="url(#nb-flare)" opacity={0.7} />
        <rect x={flareX - 300} y={188} width={600} height={4} fill="#ffffff" opacity={0.45} />
      </g>
    </svg>
  );
};

/** Tube content for a CRT state, 800 x 600. */
export const CrtContent = ({s}: {s: CrtState}) => {
  if (s.mode === 'off') return <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(120,140,170,0.10), transparent 45%), radial-gradient(ellipse at 30% 25%, rgba(200,215,240,0.08), transparent 60%)'}} />;
  if (s.mode === 'line') {
    const h = 4 + s.k * (H - 4);
    return <div style={{position: 'absolute', inset: 0, background: '#000'}}>
      <div style={{position: 'absolute', left: `${(1 - Math.min(1, s.k * 4)) * 45}%`, right: `${(1 - Math.min(1, s.k * 4)) * 45}%`, top: (H - h) / 2, height: h, background: s.k < 0.5 ? '#f4f8ff' : `rgba(220,232,255,${1 - (s.k - 0.5) * 1.2})`, boxShadow: '0 0 24px 8px rgba(190,215,255,0.8)'}} />
    </div>;
  }
  if (s.mode === 'bumper') return <><NewsBumper f={s.f} /><CrtGlass /></>;
  if (s.mode === 'image') return <>
    <div style={{position: 'absolute', inset: 0, background: '#000'}} />
    <Img src={staticFile(s.src)} style={{position: 'absolute', left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: s.pos ?? '50% 50%', top: `${((s.roll ?? 0) * 100) % 100}%`, ...crtLook}} />
    {s.roll ? <Img src={staticFile(s.src)} style={{position: 'absolute', left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: s.pos ?? '50% 50%', top: `${((s.roll * 100) % 100) - 100}%`, ...crtLook}} /> : null}
    <RollBar roll={s.roll ?? 0} /><CrtGlass />
  </>;
  return <><RollBar roll={s.roll ?? 0} /><CrtGlass lines={0.26} step={8} /></>;
};

/** A CRT screen state mapped on a world quad (top-left, top-right, bottom-right, bottom-left) through the shot camera; `round` px corner radius
 *  in the 800 x 600 element (the tube's curved corners). */
export const crtOnQuad = (c: YCam, corners: V3[], s: CrtState, round = 40, key?: string): ReactNode =>
  onQuad(c, corners, W, H, <div style={{position: 'relative', width: W, height: H, overflow: 'hidden', borderRadius: round}}><CrtContent s={s} /></div>, {}, key);
