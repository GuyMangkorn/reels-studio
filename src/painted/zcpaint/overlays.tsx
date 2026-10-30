import {useId, type ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {CameraLayer, type Camera} from '../kit/camera';
import {Spot, GLOW_PEAK} from '../kit/glow';
import {hash} from '../kit/hash';
import {ramp} from '../kit/painter';
import {Grade, Grain} from '../kit/screen';
import type {ShotContext} from '../shot';
import {INK} from './ctx';
import {flare, layers, MAIN, SECOND, svgTransform, type Layer} from './balcony';
import {boltAngle, B03_LAMPS, b03Lights, b03Offset} from './povshots';
import type {Lang} from './jolts';

// ZCPAINT screen-space and crisp SVG parts (Boss pass 5). Everything here is a React layer over the painted canvas
// (`PaintedShot.Overlay`, the same path as the WORLD FOG phone and the shipwreck glow). Each element is listed with its
// reason in the build notes (`SVG-ZCP-*`). Plate state comes from the same functions the painter uses, so the layers
// stay in step with the canvas at any seek.

type OverlayProps = ShotContext & {camera: Camera; opacity: number};
type Overlay = (props: OverlayProps) => ReactNode;

/** Plate frame of the overlay clock (the plate clock x 30; the plates use no remap). */
const pfOf = (tl: number) => Math.round(tl * 30);

/**
 * The picture's screen layers: Grade, then Grain (`screen.tsx`). Pass 9 (user, 30 Oct 2026): no ZC plate carries `ZC-CAPSHADE`; captions are
 * white with the outline style (`src/scenes/Subtitles.tsx`), so the plate layers stop at the paper grain and the vignette.
 */
export const ScreenLayers = ({grain = 0.09}: {grain?: number | false}) => (
  <>
    <Grade />
    {grain !== false && <Grain opacity={grain} />}
  </>
);

/** SVG-ZCP-2 thumb-turn: the bolt bar rotating about the lock centre (860, 640); 0 open (vertical), 90 locked. */
const Bolt = ({deg}: {deg: number}) => (
  <g transform={`rotate(${deg} 860 640)`}>
    <rect x={853} y={610} width={14} height={60} rx={4} fill="#6f665a" stroke={INK} strokeWidth={1} />
  </g>
);

/** SVG-ZCP-3 fixture glows: a warm pool at each ceiling lamp, level capped at GLOW_PEAK. */
const LampGlows = ({levels, dx}: {levels: {bath: number; kitchen: number; living: number}; dx: number}) => (
  <>
    <Spot x={B03_LAMPS.bath[0] + dx} y={B03_LAMPS.bath[1]} r={150} level={GLOW_PEAK * levels.bath} color="#ffe2a8" />
    <Spot x={B03_LAMPS.kitchen[0] + dx} y={B03_LAMPS.kitchen[1]} r={130} level={GLOW_PEAK * levels.kitchen} color="#ffe2a8" />
    <Spot x={B03_LAMPS.living[0] + dx} y={B03_LAMPS.living[1]} r={120} level={GLOW_PEAK * levels.living} color="#ffe2a8" />
  </>
);

/** SVG-ZCP-4 entry lamp glow on the top edge (View A), level capped at GLOW_PEAK. */
const EntryGlow = ({level, dx}: {level: number; dx: number}) => <Spot x={540 + dx} y={20} r={260} level={GLOW_PEAK * level} color="#ffe2a8" />;

// ---------------------------------------------------------------- B02 overlays

/** B02-SH01: the thumb-turn (SVG-ZCP-2) turns on its own at the per-language bolt keys, in the camera; ScreenLayers. */
export const b02Sh01Overlay = (lang: Lang): Overlay => ({tl, camera, width, height}) => {
  const pf = pfOf(tl);
  return (
    <>
      <CameraLayer camera={camera} width={width} height={height} blend="normal">
        <Bolt deg={boltAngle(lang, pf)} />
      </CameraLayer>
      <ScreenLayers />
    </>
  );
};

// ---------------------------------------------------------------- B03 overlay

/** B03-SH01: View A's corridor line and entry glow (they slide with the view), View B's lamp glows, ScreenLayers. */
export const b03Overlay = (lang: Lang): Overlay => ({tl, camera, width, height}) => {
  const pf = pfOf(tl), L = b03Lights(pf, lang), oA = b03Offset(pf, lang), oB = oA - 1080;
  return (
    <>
      <CameraLayer camera={camera} width={width} height={height} blend="screen">
        <g transform={`translate(${oA} 0)`}>
          <EntryGlow level={L.corridor} dx={0} />
        </g>
        <g transform={`translate(${oB} 0)`}>
          <LampGlows levels={{bath: L.bath, kitchen: L.kitchen, living: L.living}} dx={0} />
        </g>
      </CameraLayer>
      <ScreenLayers />
    </>
  );
};

// ---------------------------------------------------------------- B09 overlays

/** Counter icon row on the painted board (SVG-ZCP-5): buckets (4 -> 2), cans (6 -> 4), battery (100 % -> 12 %) on the
 *  per-language keys. Numerals and the day card are Remotion text (Editor, S-08), not drawn here. */
export const B09Counter = ({tl, keys}: {tl: number; keys: {bucket: number; can: number; battery: number}}) => {
  const pf = pfOf(tl);
  const gone = (at: number) => 1 - ramp(pf, at, at + 8);
  const level = 1 - 0.88 * ramp(pf, keys.battery, keys.battery + 12);
  const bucketX = [434, 474, 514, 554], canX = [590, 614, 638, 662, 686, 710];
  const bucketGone = [false, false, true, true], canGone = [false, false, false, false, true, true];
  const iconStroke = '#2b211c';
  return (
    <g>
      {bucketX.map((x, i) => (
        <g key={`b${i}`} opacity={bucketGone[i] ? gone(keys.bucket) : 1}>
          <path d={`M${x} 380 L${x + 30} 380 L${x + 27} 412 L${x + 3} 412 Z`} fill="#3e7f8a" stroke={iconStroke} strokeWidth={1.2} />
          <path d={`M${x + 3} 384 Q${x + 15} 372 ${x + 27} 384`} fill="none" stroke={iconStroke} strokeWidth={1.4} />
        </g>
      ))}
      {canX.map((x, i) => (
        <g key={`c${i}`} opacity={canGone[i] ? gone(keys.can) : 1}>
          <rect x={x} y={384} width={18} height={28} fill="#b8c0c4" stroke={iconStroke} strokeWidth={1.2} />
          <rect x={x} y={384} width={18} height={5} fill="#dfe4e6" stroke={iconStroke} strokeWidth={1} />
        </g>
      ))}
      <g>
        <rect x={764} y={386} width={46} height={24} rx={3} fill="none" stroke={iconStroke} strokeWidth={1.6} />
        <rect x={810} y={394} width={4} height={8} fill={iconStroke} />
        <rect x={768} y={390} width={38 * level} height={16} fill={level > 0.3 ? '#6aa86a' : '#c66a4a'} />
      </g>
    </g>
  );
};

/** B09-SH01 overlay: the counter icons inside the camera (they stay on the painted board), ScreenLayers. */
export const b09Sh01Overlay = (lang: Lang): Overlay => ({tl, camera, width, height}) => {
  const keys = lang === 'TH' ? {bucket: 24, can: 57, battery: 105} : {bucket: 21, can: 45, battery: 66};
  return (
    <>
      <CameraLayer camera={camera} width={width} height={height} blend="normal">
        <B09Counter tl={tl} keys={keys} />
      </CameraLayer>
      <ScreenLayers />
    </>
  );
};

/** Plain Grade and Grain for a plate without SVG parts (pass 9: no caption shade on any ZC plate). */
export const screenOnly = (): Overlay => () => <ScreenLayers />;

// ---------------------------------------------------------------- B08 hero plate (Boss pass 6)

/** B08 glow bloom (SVG-ZCP-6): radial light over the main and second blazes, each in its plate layer's transform, flicker
 *  stepped per 2 f. Peak <= GLOW_PEAK; the spots stay above the caption band (y 1040-1270). */
export const b08Bloom = (pf: number) => {
  const L = layers(pf);
  const fl = (s: number) => 0.86 + 0.14 * hash(s + Math.floor(pf / 2) * 17);
  return [
    {id: 1, layer: L.blaze, x: MAIN[0] + 10, y: MAIN[1] + 90, r: 300, opacity: GLOW_PEAK * (0.55 + 0.45 * flare(pf)) * fl(1)},
    {id: 2, layer: L.mid, x: SECOND[0], y: SECOND[1] - 20, r: 170, opacity: GLOW_PEAK * 0.75 * fl(2)},
  ];
};

/** Embers (SVG-ZCP-7): 22 dots rising from the main blaze and drifting right; small p5 circles render square. */
const B08Embers = ({pf, L}: {pf: number; L: Layer}) => (
  <g transform={svgTransform(L)}>
    {Array.from({length: 22}, (_, i) => {
      const period = 70 + 60 * hash(i * 3 + 1);
      const u = (((pf / period) + hash(i * 3 + 2)) % 1 + 1) % 1;
      const x = MAIN[0] - 90 + 200 * hash(i * 5) + 260 * u * u + 18 * Math.sin(pf * 0.11 + i);
      const y = MAIN[1] - 20 - 380 * u;
      const o = Math.min(1, u * 6) * (1 - u) * (0.6 + 0.4 * hash(i + Math.floor(pf / 3)));
      return <circle key={i} cx={x} cy={y} r={1.6 + 1.6 * hash(i * 7)} fill="#ffc070" opacity={o} />;
    })}
  </g>
);

/** The B08 light layer: bloom and embers in screen blend, each in the transform of the plate layer it lights. */
const B08Light = ({pf, opacity}: {pf: number; opacity: number}) => {
  const id = useId();
  const L = layers(pf);
  const spots = b08Bloom(pf);
  return (
    <AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none', opacity}}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1920">
        <defs>
          {spots.map((s) => (
            <radialGradient key={s.id} id={`${id}b${s.id}`}>
              <stop offset="0" stopColor="#ffb060" stopOpacity={s.opacity} />
              <stop offset="0.45" stopColor="#ff7a30" stopOpacity={s.opacity * 0.45} />
              <stop offset="1" stopColor="#ff6020" stopOpacity={0} />
            </radialGradient>
          ))}
        </defs>
        {spots.map((s) => (
          <g key={s.id} transform={svgTransform(s.layer)}>
            <ellipse cx={s.x} cy={s.y} rx={s.r} ry={s.r * 0.9} fill={`url(#${id}b${s.id})`} />
          </g>
        ))}
        <B08Embers pf={pf} L={L.blaze} />
      </svg>
    </AbsoluteFill>
  );
};

/** `ZCP-B08-SH01` overlay: the SVG bloom and embers over the canvas, then Grade and Grain (no caption shade on any ZC plate, pass 9). */
export const b08Overlay: Overlay = ({tl, opacity}) => (
  <>
    <B08Light pf={pfOf(tl)} opacity={opacity} />
    <ScreenLayers />
  </>
);
