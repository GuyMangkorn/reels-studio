import {AbsoluteFill} from 'remotion';
import type {PaintedShot} from '../shot';
import {STILL_CAMERA} from '../kit/camera';
import {Grain} from '../kit/screen';
import {flatPainter} from '../edu02/flat';
import {dogMatrixValues} from '../edu03/dogview';
import {EDU3_PAPER, EDU3_SHOTS, plateOf} from '../edu03/shots';

// EDU-EP03-SHORT (SS-R3.1) timeline adapter, Editor W5.3 (5 Nov 2026). One registry plate per shot, ID `EDU3-<shot id>`, wrapping the pure
// `plateOf(id, l)` of src/painted/edu03/shots.tsx (Boss W5.2). The timeline has ONE shared BrushCanvas (PaintedStage), so Boss's DOM wrapper that
// filters the canvas (`DogView`) cannot be used. Dog view is applied here as an SVG `feColorMatrix` through `backdrop-filter: url(#...)` on an
// Overlay layer that sits above the canvas and below grade, grain, the chalk labels/card/strike and the timeline tag, captions and chrome. The sweeps,
// flip backs and the VD09a split are the same CSS masks as Boss's spec (the complement for a flip back, by mask-composite exclude).
// The tag `ภาพจำลอง (โดยประมาณ)` is the timeline `label` and the B04 chalk labels, card and strike are cue `items` (src/videos/edu-ep03), not drawn here.

const FPS = 30;
const VIGNETTE = 'radial-gradient(ellipse 95% 75% at 48% 42%, rgba(255,240,200,0) 58%, rgba(60,70,40,0.18) 100%)';
const FILTER = 'edu3-dogview';
export const edu3PlateId = (id: string) => `EDU3-${id}`;

const Backdrop = ({mask, invert}: {mask?: string; invert?: boolean}) => {
  const base = {position: 'absolute', inset: 0, backdropFilter: `url(#${FILTER})`, WebkitBackdropFilter: `url(#${FILTER})`} as const;
  if (!mask) return <div style={base} />;
  if (!invert) return <div style={{...base, maskImage: mask, WebkitMaskImage: mask}} />;
  const m = `linear-gradient(#000, #000), ${mask}`;
  return <div style={{...base, maskImage: m, WebkitMaskImage: m, maskComposite: 'exclude', WebkitMaskComposite: 'xor'}} />;
};

export const edu03Shots: PaintedShot[] = EDU3_SHOTS.map(([id]): PaintedShot => ({
  id: edu3PlateId(id),
  serves: [id],
  paper: EDU3_PAPER,
  camera: () => STILL_CAMERA,
  // W6: Draft's flat fills at every grade (user, 6 Nov 2026), via the EDU2 W6 flatPainter; textured fills boil under the moving camera.
  paint: (p) => plateOf(id, p.frame).paint(flatPainter(p, EDU3_PAPER)),
  Overlay: ({tl, opacity}) => {
    const {spec} = plateOf(id, Math.round(tl * FPS));
    return (
      <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
        <svg width={0} height={0} style={{position: 'absolute'}}>
          <filter id={FILTER} colorInterpolationFilters="linearRGB" x="0" y="0" width="100%" height="100%"><feColorMatrix type="matrix" values={dogMatrixValues(1)} /></filter>
        </svg>
        {spec.dog && !spec.over && <Backdrop />}
        {spec.dog && spec.over?.to === 'normal' && <Backdrop mask={spec.over.mask} invert />}
        {!spec.dog && spec.over?.to === 'dog' && <Backdrop mask={spec.over.mask} />}
        <AbsoluteFill style={{background: VIGNETTE}} />
        <Grain opacity={0.08} />
      </AbsoluteFill>
    );
  },
}));
