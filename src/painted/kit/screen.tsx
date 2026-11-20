import {useId, type CSSProperties, type ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {DEFAULT_SHADE_CENTRE_Y, shadeBandStops} from '../../scenes/captionLayout';
import {STAMP} from './stamp';
import {RING, RING_UNDER, ringGeom} from './timer-ring';

// Shared screen-space layers of the painted episodes (S-P06 Grade/Grain, S-P08 ZC-CAPSHADE). They sit outside the
// picture camera: a plate's `Overlay` (src/painted/shot.ts) renders them, in the order Grade -> Grain -> CaptionShade.
// Moved unchanged from the WORLD FOG spike (src/painted/spike/WfogShop.tsx, which re-exports Grade and Grain).

/** Screen-space grade: cool, darker corners (vignette) so the eye stays on the door. */
export const Grade = () => (
  <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse 75% 60% at 52% 40%, rgba(8,12,14,0) 55%, rgba(8,12,14,0.38) 100%)'}} />
);

/** Paper grain over the whole picture so painted and SVG layers share one surface. */
export const Grain = ({opacity = 0.09}: {opacity?: number}) => {
  const id = useId();
  return (
    <AbsoluteFill style={{mixBlendMode: 'overlay', opacity, pointerEvents: 'none'}}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1920">
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={1080} height={1920} filter={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Caption cue window in shot-local seconds (`tl`) and the cue's line count (default 2), so the shade fits the lines on screen. */
export type CaptionCue = readonly [from: number, to: number, lines?: number];

/** Frames the shade lingers after the last cue ends (`MK-ZC-ST-09`: off 6 f after the last cue). */
export const SHADE_TAIL_FRAMES = 6;
/** Fade ramp (frames) at each end of the gated span: a shade that pops reads as a flash. */
export const SHADE_RAMP_FRAMES = 4;

/**
 * Shade strength factor 0..1 at shot-local `tl` for caption `cues`: 1 from the first cue start to `SHADE_TAIL_FRAMES`
 * after the last cue end, easing in over `SHADE_RAMP_FRAMES` ending at the first cue and out starting after the tail.
 * No cues -> 0 for the whole shot (a caption-free hold shows no shade). A pure function of `tl`, so it is seek-safe.
 */
export const shadeGate = (tl: number, cues: readonly CaptionCue[], fps = 30): number => {
  if (cues.length === 0) return 0;
  const start = Math.min(...cues.map(([a]) => a)), end = Math.max(...cues.map(([, b]) => b)) + SHADE_TAIL_FRAMES / fps;
  const r = SHADE_RAMP_FRAMES / fps;
  const up = Math.max(0, Math.min(1, (tl - (start - r)) / r)), down = Math.max(0, Math.min(1, (end + r - tl) / r));
  const e = (x: number) => x * x * (3 - 2 * x);
  return e(up) * e(down);
};

/**
 * Ink rows of a caption block as `Subtitles` draws it in portrait (Noto Sans Thai 700, 51 px x `scale`, line-height 1.65):
 * the last line's ink runs from about 74 to 28 px above the block's bottom edge and lines are 84 px apart. The top is the
 * mean of a line with upper vowels only (68 px, WFOG-EP01-SHORT f20/f2760) and one with a tone mark (80 px, ZCPAINT-SET-
 * CAPTION-BACKDROP f45), 4 Nov 2026, so the centre is within 6 px of the glyphs either way. The line box is not the ink: centring on it leaves the glyphs off-centre.
 * `lines` may be fractional while the shade eases between cues. Rule: production-requirements#caption-backdrop.
 */
export const captionInk = (bottomEdgeY: number, lines: number, scale = 1) => {
  const bottom = bottomEdgeY - 28 * scale, top = bottom - 46 * scale - (lines - 1) * 51 * 1.65 * scale;
  return {top, bottom, center: (top + bottom) / 2};
};

/**
 * Line count the shade fits at `tl`: the latest cue that has started (the first cue before it). Between back-to-back cues
 * (gap within the shade tail, so the shade stays up) the height eases from the previous count over `SHADE_RAMP_FRAMES`.
 */
export const shadeLines = (tl: number, cues: readonly CaptionCue[], fps = 30): number => {
  const sorted = [...cues].sort((a, b) => a[0] - b[0]);
  const n = (c: CaptionCue) => c[2] ?? 2;
  let i = 0;
  while (i + 1 < sorted.length && sorted[i + 1][0] <= tl) i++;
  const cur = sorted[i], prev = sorted[i - 1];
  if (!cur) return 2;
  if (!prev || cur[0] - prev[1] > SHADE_TAIL_FRAMES / fps) return n(cur);
  const x = Math.max(0, Math.min(1, (tl - cur[0]) / (SHADE_RAMP_FRAMES / fps)));
  return n(prev) + (n(cur) - n(prev)) * x * x * (3 - 2 * x);
};

/** Shade core margin above and below the ink, and the feather beyond it (px at scale 1). */
export const SHADE_PAD = 24;
export const SHADE_FEATHER = 80;

/**
 * `ZC-CAPSHADE` (S-P08): soft darkening behind the caption block, cue-gated by `shadeGate` and sized by `shadeLines`:
 * its centre is the glyphs' centre (`captionInk`), its height the lines on screen. `bottomEdgeY` is the caption block's
 * bottom edge (default 1248, ZC TH). `band` is a horizontal CSS gradient (core = ink +/- `SHADE_PAD`, `SHADE_FEATHER`
 * feather, peak 0.62) for light section/close shots; `soft` a 560 px wide ellipse (peak 0.5) for full-frame POV.
 * Colour is a warm near-black so the cream sets keep their hue. Rule: production-requirements#caption-backdrop.
 */
export const CaptionShade = ({tl, cues, mode = 'band', strength, fps = 30, bottomEdgeY = 1248, scale = 1}: {tl: number; cues: readonly CaptionCue[]; mode?: 'band' | 'soft'; strength?: number; fps?: number; bottomEdgeY?: number; scale?: number}) => {
  const g = shadeGate(tl, cues, fps);
  if (g <= 0) return null;
  const peak = (strength ?? (mode === 'band' ? 0.62 : 0.5)) * g;
  const ink = captionInk(bottomEdgeY, shadeLines(tl, cues, fps), scale);
  const pad = SHADE_PAD * scale, feather = SHADE_FEATHER * scale, c = `rgba(20,16,12,${peak})`, clear = 'rgba(20,16,12,0)';
  const background = mode === 'band'
    ? `linear-gradient(to bottom, ${clear} ${ink.top - pad - feather}px, ${c} ${ink.top - pad}px, ${c} ${ink.bottom + pad}px, ${clear} ${ink.bottom + pad + feather}px)`
    : `radial-gradient(ellipse 560px ${(ink.bottom - ink.top) / 2 + pad + feather + 24 * scale}px at 540px ${ink.center}px, ${c} 0%, rgba(20,16,12,${peak * 0.7}) 55%, ${clear} 100%)`;
  return <AbsoluteFill style={{pointerEvents: 'none', background}} />;
};

// ---- Timer ring and stamp (EDU-EP08-SHORT N7 / N9, Boss pass B). Both are screen-fixed, outside the picture camera (like Grade and
// CaptionShade); geometry and clocks are pure and live in `timer-ring.ts` / `stamp.ts`.

/**
 * `timer-ring` layer: the approved painted ring (flat polygons over a dark disc, hatched red end band, no digits) as SVG, plus the
 * Thai label under it (Remotion type, edu stroke). `story` seconds of `full`; `paused` greys it with two bars; `opacity` from
 * `ringOpacity` fades it in and out. Place it in the shot's overlay, never inside a camera transform.
 */
export const TimerRing = ({story, paused = false, opacity = 1, label = 'ประมาณ 10–15 วินาที'}: {story: number; paused?: boolean; opacity?: number; label?: string | false}) => {
  if (opacity <= 0) return null;
  const g = ringGeom(story, {paused}), pts = (a: readonly (readonly [number, number])[]) => a.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1920">
        {g.polys.filter((q) => q.id <= RING_UNDER).map((q) => <polygon key={q.id} points={pts(q.pts)} fill={q.fill} />)}
        {g.ticks.map((t) => <line key={t.id} x1={t.a[0]} y1={t.a[1]} x2={t.b[0]} y2={t.b[1]} stroke={t.color} strokeWidth={0.8} />)}
        {g.polys.filter((q) => q.id > RING_UNDER).map((q) => <polygon key={q.id} points={pts(q.pts)} fill={q.fill} />)}
      </svg>
      {label !== false && (
        <div style={{position: 'absolute', left: RING.cx - 150, width: 300, top: RING.cy + RING.r + 10, textAlign: 'center', whiteSpace: 'nowrap', color: '#ffffff', opacity: paused ? 0.5 : 1,
          fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 700, fontSize: 26, WebkitTextStroke: '6px #0b1020', paintOrder: 'stroke fill'}}>{label}</div>
      )}
    </AbsoluteFill>
  );
};

/**
 * `stamp` layer: a red rubber-stamp label (double rule, rough edge from a seeded displacement filter, a few ink dropouts) that lands at
 * `at` (the box centre, picture px) with `scale`/`opacity` from `stampState`. `text` is the label; `mark="cross"` draws the red cross
 * stamp instead (the film-strip cross in screen space). The roughness is fixed (seed), so every frame is the same stamp.
 */
export const Stamp = ({text = 'สมมติ', mark = 'text', at = [300, 560], size = [STAMP.w, STAMP.h], rot = STAMP.rot, scale = 1, opacity = 1, color = STAMP.red}:
  {text?: string; mark?: 'text' | 'cross'; at?: [number, number]; size?: [number, number]; rot?: number; scale?: number; opacity?: number; color?: string}) => {
  const id = useId().replace(/:/g, '');
  if (opacity <= 0) return null;
  const [w, h] = size, b = Math.max(5, h * 0.045);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1920" style={{opacity, filter: 'drop-shadow(0 0 2px rgba(255,250,240,0.95)) drop-shadow(0 0 7px rgba(255,250,240,0.55))'}}>
        <defs>
          <filter id={`${id}r`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={2} seed={11} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={3.2} />
          </filter>
          <filter id={`${id}k`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves={2} seed={5} result="g" />
            <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -9 6.4" result="m" />
            <feComposite in="SourceGraphic" in2="m" operator="in" />
          </filter>
        </defs>
        <g transform={`translate(${at[0]} ${at[1]}) rotate(${rot}) scale(${scale})`} filter={`url(#${id}k)`}>
          <g filter={`url(#${id}r)`} fill="none" stroke={color} strokeLinejoin="round">
            {mark === 'text' ? (
              <>
                <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h * 0.12} strokeWidth={b} />
                <rect x={-w / 2 + b * 2.1} y={-h / 2 + b * 2.1} width={w - b * 4.2} height={h - b * 4.2} rx={h * 0.06} strokeWidth={b * 0.4} />
                <text x={0} y={h * 0.22} textAnchor="middle" fill={color} stroke={color} strokeWidth={h * 0.022} fontFamily="'Noto Sans Thai', sans-serif" fontWeight={700} fontSize={h * 0.62} style={{paintOrder: 'stroke'}}>{text}</text>
              </>
            ) : (
              <>
                <line x1={-w / 2} y1={-h / 2} x2={w / 2} y2={h / 2} strokeWidth={h * 0.2} strokeLinecap="round" />
                <line x1={w / 2} y1={-h / 2} x2={-w / 2} y2={h / 2} strokeWidth={h * 0.2} strokeLinecap="round" />
              </>
            )}
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// Newsreel screen layer (EDU-EP30 VD30-01, Film W3 look asset 2026-11-19; moved into the kit by T01 (EDU-EP30 tickets), shared with C112). Screen space, plate-owned (DF-20261030-painted-screen-layers-overlay): it wraps the painted canvas and sits under the
// titles, captions, mark and label. Pieces: an amber tinted-print grade (CSS filter on the canvas: grey, then sepia, then a warm or cool
// shift), seeded luma flicker, a low-frequency gate weave (the canvas only), thin vertical scratches and dust specks, a soft vignette.
// `strength` 0..1 drives everything (B07 burns it out over about 10 frames). No perforations, no 4:3 box, no fake archive captions.

export type NewsreelTint = 'warm' | 'cool';
export type NewsreelOpts = {
  frame: number; strength?: number; tint?: NewsreelTint;
  /** tint amount 0..1 at full strength: 1 = full tinted print (near monochrome), 0.6 = light (a trace of the painted colour) */
  tintAmount?: number; seed?: number;
  /** exposure pop 0..0.2 (T01): `brightness(1 + pop * strength)` after the tint; the layer holds no round logic */
  pop?: number;
  /** warm-to-cool mix 0..1 (T01): default 0 for `tint: 'warm'`, 1 for `'cool'`; the filter and the vignette colour interpolate linearly */
  tintMix?: number;
};

const hh = (n: number) => { const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };

const lerp = (a: number, b: number, m: number) => a * (1 - m) + b * m;
const mixOf = ({tint = 'warm', tintMix}: NewsreelOpts) => Math.max(0, Math.min(1, tintMix ?? (tint === 'cool' ? 1 : 0)));

/** CSS filter for the painted canvas. strength 0 is the identity (`none`). */
export const newsreelFilter = (o: NewsreelOpts): string => {
  const {frame, strength = 1, tintAmount = 1, seed = 30, pop = 0} = o;
  const s = Math.max(0, Math.min(1, strength)), k = s * tintAmount, m = mixOf(o);
  if (s <= 0) return 'none';
  const flick = 1 + s * (hh(seed + frame * 1.7) - 0.5) * 0.06;
  const hue = m > 0 ? ` hue-rotate(${k * -12 * m}deg)` : '';
  const p = pop > 0 ? ` brightness(${1 + Math.max(0, Math.min(0.2, pop)) * s})` : '';
  return `grayscale(${k * lerp(0.92, 0.95, m)}) sepia(${k * lerp(0.78, 0.42, m)})${hue} saturate(${1 + k * lerp(0.25, -0.2, m)}) contrast(${1 + s * lerp(0.1, 0.06, m)}) brightness(${flick * (1 - s * lerp(0.02, 0.08, m))})${p}`;
};

/** Gate weave: a sub-pixel-to-2 px slow drift of the picture (canvas only, never captions or chrome). */
export const newsreelWeave = ({frame, strength = 1, seed = 30}: NewsreelOpts): CSSProperties => {
  const s = Math.max(0, Math.min(1, strength)), t = frame / 30;
  if (s <= 0) return {transform: 'none'};
  const dx = s * (1.2 * Math.sin(t * 2.1 + seed) + 0.6 * Math.sin(t * 5.3 + seed * 2)), dy = s * (1.6 * Math.sin(t * 1.7 + seed * 3) + 0.5 * (hh(seed + Math.floor(frame / 3)) - 0.5));
  return {transform: `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) scale(${1 + s * 0.006})`};
};

/** The canvas wrapper: grade and weave applied to its children (the BrushCanvas). */
export const NewsreelPicture = ({children, ...o}: NewsreelOpts & {children: ReactNode}) => (
  <AbsoluteFill style={{filter: newsreelFilter(o), ...newsreelWeave(o)}}>{children}</AbsoluteFill>
);

/** Scratches, dust and vignette over the picture (under titles and captions). */
export const NewsreelOverlay = (o: NewsreelOpts) => {
  const {frame, strength = 1, seed = 30} = o;
  const s = Math.max(0, Math.min(1, strength));
  if (s <= 0.001) return null;
  const scratches = [0, 1, 2].filter((i) => hh(seed + frame * 3 + i * 17) < 0.55 - i * 0.15).map((i) => {
    const x = 60 + hh(seed * 7 + Math.floor(frame / 4) * 5 + i * 31) * 960, y0 = -20 + hh(seed + frame + i) * 600, len = 700 + hh(seed + frame * 2 + i) * 1300;
    return {x, y0, y1: y0 + len, w: 0.8 + hh(i + frame) * 1.4, light: hh(frame * 5 + i) > 0.4};
  });
  const dust = Array.from({length: 9}, (_, i) => i).filter((i) => hh(seed + frame * 11 + i * 3) < 0.45).map((i) => ({
    x: hh(seed + frame * 13 + i * 7) * 1080, y: hh(seed + frame * 17 + i * 5) * 1920, r: 1.5 + hh(frame + i * 9) * 4.5, dark: hh(frame * 3 + i) > 0.35, rx: 1 + hh(i + frame * 2) * 1.6,
  }));
  const m = mixOf(o), vig = [[40, 16], [24, 18], [10, 22]].map(([w, c]) => Math.round(lerp(w, c, m))).join(',');
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: s}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 62% at 50% 46%, rgba(${vig},0) 58%, rgba(${vig},0.42) 100%)`}} />
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
        {scratches.map((q, i) => <line key={`s${i}`} x1={q.x} y1={q.y0} x2={q.x + 3} y2={q.y1} stroke={q.light ? 'rgba(250,240,215,0.4)' : 'rgba(30,20,10,0.32)'} strokeWidth={q.w * 0.8} />)}
        {dust.map((d, i) => <ellipse key={`d${i}`} cx={d.x} cy={d.y} rx={d.r * d.rx} ry={d.r} fill={d.dark ? 'rgba(25,16,8,0.65)' : 'rgba(250,242,220,0.6)'} />)}
      </svg>
    </AbsoluteFill>
  );
};
