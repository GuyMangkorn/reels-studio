import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter} from '../painter';
import {paintEdgeGrip, paintPovHand, ZC_HAND} from '../hands';
import {ell} from '../zcpaint/ctx';
import {paintPovBackdrop} from '../zcpaint/pov';
import {flatKit} from '../zcpaint/sets';
import {Subtitles} from '../../scenes/Subtitles';
import {CaptionShade, Grade, Grain} from '../screen';
import {PlatePreview} from './PlatePreview';
import {zcpaintShots} from '../shots/zcpaint';

// ZCPAINT set look-check sheets (S-P03, Boss, 30 Oct 2026). Each composition renders a production plate through
// PlatePreview (drawPlate, the same path the registry uses) with the screen layers, so the look check is the plate.
// Spike entry only (zcpaint-set-index.ts). Not registered anywhere else.

const plateOf = (id: string) => {
  const shot = zcpaintShots.find((s) => s.id === id);
  if (!shot) throw new Error(`no ZCPAINT plate ${id}`);
  return shot;
};
/** A plate with the production screen layers; `cues` gate the ZC-CAPSHADE band (B03: the TH cue 9-45 f), `caption` adds a mock low caption. */
const Plate = ({id, note, caption, cues}: {id: string; note: string; caption?: string; cues?: readonly (readonly [number, number])[]}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <PlatePreview shot={plateOf(id)} G0={0} label={false} note={note} />
      <Grade />
      <Grain />
      {cues && <CaptionShade tl={frame / 30} cues={cues} mode="band" />}
      {caption && (
        <AbsoluteFill style={{transform: 'translateY(-538px)'}}>
          <Subtitles text={caption} style={{preset: 'outline', position: 'bottom'}} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/** TH line 1 of B04-SH01 (VO + subtitle [0, 32) f): the shade is on for the cue, off 6 f after it. */
const B04_CUES = [[0, 32 / 30]] as const;
export const ZcSetB04 = () => <Plate id="ZCP-B04-SH01" note="" cues={B04_CUES} />;
export const ZcSetB04Cap = () => <Plate id="ZCP-B04-SH01" note="" cues={B04_CUES} caption="แต่ก๊อกน้ำยังไหล" />;
/** Plain paper, no vignette (user 30 Oct 2026; brief default for the diagram): the plate and the grain layer only. */
export const ZcSetB04Diagram = () => (
  <AbsoluteFill>
    <PlatePreview shot={plateOf('ZCP-B04-SH02-TH')} G0={0} label={false} note="" />
    <Grain />
  </AbsoluteFill>
);
export const ZcSetB06 = () => <Plate id="ZCP-B06-SH01" note="" />;
export const ZcSetB07 = () => <Plate id="ZCP-B07-SH02" note="" />;
export const ZcSetB08 = () => <Plate id="ZCP-B08-SH01" note="" />;
export const ZcSetB10 = () => <Plate id="ZCP-B10-SH01" note="" />;

/** Grip review: an edge grip on the cabinet lip (cell 1) and the thumb-turn pinch with a gap around the knob (cell 2). */
const gripPaint = (ctx: PaintContext) => {
  const p = makePainter(ctx.brush, {t: ctx.t, frame: ctx.frame, fade: '#e9e0ca'});
  const f = flatKit(ctx, 9100);
  // Cell 1: cabinet, top face and front face, the lip at y 430.
  f.fill('#cdb48c', [[120, 430], [660, 430], [660, 800], [120, 800]], 3);
  f.fill('#e2cfa8', [[150, 330], [630, 330], [660, 430], [120, 430]], 3);
  f.line([[120, 430], [660, 430], [660, 800], [120, 800]], 1.4);
  f.line([[150, 330], [630, 330], [660, 430], [120, 430]], 1.2);
  const K = [470, 410, 350, 290].map((x) => [x, 372] as [number, number]);
  const lip = K.map(([x]) => [x, 430] as [number, number]);
  const tips = K.map(([x]) => [x, 492] as [number, number]);
  paintEdgeGrip(p, {
    base: 7000, tone: ZC_HAND, elbow: [380, 90], sleeveFrom: [380, -60], wrist: [380, 210],
    knuckles: K, lip, tips, thumb: {base: [300, 300], tip: [236, 458]}, width: 42,
  });
  // Cell 2: a thumb-turn on a door face; index and thumb pinch it with a visible gap.
  const cy = 1420, cx = 540;
  f.fill('#c4b392', [[200, 1180], [880, 1180], [880, 1780], [200, 1780]], 3);
  const wrist: [number, number] = [cx, cy - 60];
  paintPovHand(p, {side: 1, base: 7300, wrist, dir: -Math.PI / 2, size: 0.6, curl: 1, spread: 0.05, pinch: [195, 165], pinchGap: 90, fingerCurl: [0.35, 1, 1, 1], tone: ZC_HAND});
  const knob = [cx - (165 + 45) * 0.6, cy - 60 - 117] as [number, number];
  f.fill('#6f665a', ell(knob[0], knob[1], 13, 13, 14), 3);
  f.fill('#4f483f', [[knob[0] - 3, knob[1] - 11], [knob[0] + 3, knob[1] - 11], [knob[0] + 3, knob[1] + 11], [knob[0] - 3, knob[1] + 11]], 2);
};

export const ZcGrip = () => (
  <AbsoluteFill style={{backgroundColor: '#e9e0ca', fontFamily: 'Noto Sans Thai, sans-serif', color: '#2b211c'}}>
    <BrushCanvas paint={gripPaint} paper="#e9e0ca" />
    <div style={{position: 'absolute', left: 40, top: 40, fontSize: 34}}>Edge grip on the cabinet lip (right hand)</div>
    <div style={{position: 'absolute', left: 40, top: 1000, fontSize: 34}}>Thumb-turn pinch: gap around the knob</div>
    <Grain opacity={0.05} />
  </AbsoluteFill>
);

/** B02-SH02 POV backdrop, clean kit (S-P10 part): the frame at the rest state (flush cabinet, hands on the edge). */
const povPaint = (ctx: PaintContext) => paintPovBackdrop(ctx, {slide: 0, bob: 0, jolt: 0, press: 0.4});
export const ZcPovB02 = () => (
  <AbsoluteFill>
    <BrushCanvas paint={povPaint} paper="#d9ccb0" />
    <Grain />
  </AbsoluteFill>
);
