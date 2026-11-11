import {loadFont} from '@remotion/fonts';
import {measureText} from '@remotion/layout-utils';
import {useCallback, useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, getInputProps, staticFile, useCurrentFrame} from 'remotion';
import {EDU16_CUES} from '../../videos/edu-ep16/cues';
import {QUIET, quietRect} from '../edu14/quiet';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {clamp01, FPS, SHOT_TABLE, type ShotId} from './clock';
import {SHOT_FNS} from './shots';
import {SpeciesTagAt} from './tag';

// EDU-EP16-SHORT shot frames (W5.3 Draft, Editor): one component per shot, a pure function of the shot-local frame `L = useCurrentFrame()` (Editor's plate mounts it in a Freeze at L; the standalone
// shot compositions in shots-index.ts give it the shot's own length). Picture = BrushCanvas + grain; the species tag (DOM, edu stroke, global frames [150, 278)) and the fitted caption dim plate sit above.
// The dashed caption-band guide is drawn only on standalone stills (`band`), never in the plate.
if (typeof document !== 'undefined') loadFont({family: 'Noto Sans Thai', url: staticFile('fonts/NotoSansThai.ttf'), weight: '100 900'});

/** Per-shot strength 0..1 of the fitted dim plate (blur and dim behind exactly the caption's text block, edu14 `QuietPatches` rule). 0 = off. R2.1 R05: stroke-only by default (the edu channel look); an entry is added only where the 360 px check shows the stroke failing, at the lowest step that reads (0.3, then 0.4, never above 0.5); values and frames in build-notes W5.3 R1. */
export const CALM: Partial<Record<ShotId, number>> = {};

/** Plate opacity at global frame `f`: 0 until the cue's text shows (`from`), ramps over QUIET.ramp frames, 0 again at `to` (the plate never shows without its text; the shared edu14 `quietOpacity` ramps in before `from`). */
const plateOpacity = (f: number, from: number, to: number) => clamp01(Math.min((f - from + 1) / QUIET.ramp, (to - f) / QUIET.ramp));

const QuietPatch = ({k, x, y, w, h}: {k: number; x: number; y: number; w: number; h: number}) => {
  const F = QUIET.feather, mx = `linear-gradient(to right, transparent 0, #000 ${F}px, #000 ${w + F}px, transparent ${w + 2 * F}px)`, my = `linear-gradient(to bottom, transparent 0, #000 ${F}px, #000 ${h + F}px, transparent ${h + 2 * F}px)`;
  return <div style={{position: 'absolute', left: x - F, top: y - F, width: w + 2 * F, height: h + 2 * F, backdropFilter: `blur(${(1.5 + 3 * k).toFixed(2)}px) brightness(${(1 - k).toFixed(3)})`,
    WebkitMaskImage: `${mx}, ${my}`, maskImage: `${mx}, ${my}`, WebkitMaskComposite: 'source-in', maskComposite: 'intersect'}} />;
};
export const QuietPatches = ({k, f}: {k: number; f: number}) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const h = delayRender('edu16 quiet font');
    document.fonts.load(`${QUIET.weight} ${QUIET.font}px "${QUIET.family}"`, 'ก').then(() => setReady(true)).catch(() => setReady(true)).finally(() => continueRender(h));
  }, []);
  if (!ready) return null;
  return <>{EDU16_CUES.filter((c) => c.text && f >= c.from && f < c.to).map((c) => {
    const o = plateOpacity(f, c.from, c.to);
    if (o <= 0) return null;
    const r = quietRect(c.text, (line) => measureText({text: line, fontFamily: QUIET.family, fontSize: QUIET.font, fontWeight: String(QUIET.weight), validateFontIsLoaded: false}).width);
    return <QuietPatch key={c.id} k={k * o} {...r} />;
  })}</>;
};

export const ShotFrame = ({id, band = false, calm}: {id: ShotId; band?: boolean; calm?: number}) => {
  const L = useCurrentFrame(), start = SHOT_TABLE.find(([i]) => i === id)![1], g = start + L, fn = SHOT_FNS[id];
  const paint = useCallback(({brush, frame}: PaintContext) => fn(makePainter(brush, {t: frame / FPS, frame, fade: '#d9d4c4'}), frame, start + frame), [fn, start]);
  const k = calm ?? CALM[id] ?? 0;
  return (
    <AbsoluteFill style={{background: '#d9d4c4'}}>
      <BrushCanvas paint={paint} paper="#d9d4c4" />
      {k > 0 && <QuietPatches k={k} f={g} />}
      <Grain opacity={0.05} />
      <SpeciesTagAt frame={g} />
      {band && (getInputProps() as {guides?: boolean}).guides !== false && <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.6)', borderBottom: '2px dashed rgba(255,255,255,0.6)'}} />}
    </AbsoluteFill>
  );
};
