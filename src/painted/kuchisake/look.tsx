import {useCallback, useId} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BrushCanvas, type Brush, type PaintContext} from '../BrushCanvas';
import {applyCamera, CameraLayer, type Camera} from '../kit/camera';
import {ell, hardFill, inkLine, rectPts, washAt} from '../kit/draw';
import {makePainter, type Painter, type Pt} from '../kit/painter';
import {Grade, Grain} from '../kit/screen';
import {drawWoman, REVEAL_FACE, WOMAN_LIGHT} from './cast';
import {camClose, camReveal, camStreet, CU_GROUND, CU_UNIT, streetP, streetUnit} from './space';
import {paintStreet, StreetGlow} from './street';

// KSO-EP01-SHORT look stills (brief KSO-BRIEF-FILM-R1, "look check/lock"; user decision 1 Nov 2026: Boss paints them here).
// LF01 CAM-CLOSE (S01-B01-SH01 frame 0, the seam frame), LF02 the street with the woman (S02-B02-SH01), LF03 the mask-reveal
// stinger frame (S02-B03-SH03 frame 0). Look stills only: no timeline, no voice, no caption text, no marker.
// Each still is one BrushCanvas plate under its shot camera, with the production screen layers (Grade, Grain).

const W = 1080, H = 1920, FPS = 30;
const PAPER = '#0d1624';
const MASK_WHITE = '#ecebe6';

/** One plate: the frame clock, the shot camera around the paint (as painted/plate.ts drawPlate does). */
const plate = (brush: Brush, frame: number, cam: (tl: number) => Camera, paint: (p: Painter, tl: number) => void) => {
  const tl = frame / FPS;
  const p = makePainter(brush, {t: tl, frame, fade: PAPER});
  brush.push();
  applyCamera(brush, cam(tl));
  paint(p, tl);
  brush.pop();
};

/**
 * Lower-frame lamp falloff (screen multiply-style darkening, VD02 grade). It darkens the coat, road and the caption band so
 * the band stays quiet. A look decision, recorded in DF-20261101-kso-look-stills: `falloff={false}` gives the raw plate.
 */
const Falloff = ({from = 760, to = H, peak = 0.62}: {from?: number; to?: number; peak?: number}) => {
  const id = useId();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={0} y1={from} x2={0} y2={to}>
            <stop offset="0" stopColor="#070b10" stopOpacity={0} />
            <stop offset="1" stopColor="#070b10" stopOpacity={peak} />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** LF01: the mask edge across the lens (VD08): cards only. Hair strands, a cool cheek sliver, the white mask edge at y 540. */
const paintCloseup = (p: Painter) => {
  hardFill(p, 6_300_001, PAPER, rectPts(-300, -300, 1380, 2220));
  hardFill(p, 6_300_002, '#131219', [[-300, -300], [700, -300], [640, 170], [520, 300], [380, 390], [240, 450], [-300, 560]]);
  hardFill(p, 6_300_003, '#0c0b10', [[120, -300], [330, -300], [380, 220], [280, 380], [120, 300]]);
  hardFill(p, 6_300_004, '#7d6556', [[1380, 170], [820, 250], [760, 380], [800, 480], [940, 560], [1380, 600]]);
  const strands: Pt[][] = [
    [[160, -300], [260, 150], [330, 330], [300, 470]],
    [[560, -300], [600, 60], [560, 260], [470, 420]],
    [[900, -300], [860, 40], [800, 230]],
  ];
  strands.forEach((s, i) => inkLine(p, 6_300_010 + i, s, {color: '#050508', weight: 9, curve: 0.4, closed: false}));
  // The mask body in cool shadow below its white edge (the lamp is not lit here: cool rim only).
  hardFill(p, 6_300_020, '#2b3541', [[-300, 545], [1380, 685], [1380, 2220], [-300, 2220]]);
  hardFill(p, 6_300_021, '#1d2530', [[-300, 1050], [1380, 1050], [1380, 2220], [-300, 2220]]);
  hardFill(p, 6_300_022, '#161c25', [[-300, 1450], [1380, 1450], [1380, 2220], [-300, 2220]]);
  hardFill(p, 6_300_023, MASK_WHITE, [[-300, 470], [1380, 610], [1380, 685], [-300, 545]]);
  inkLine(p, 6_300_030, [[-300, 470], [1380, 610]], {color: '#5b7fa6', weight: 2, closed: false, curve: 0});
  inkLine(p, 6_300_040, [[60, 800], [330, 760], [600, 790]], {color: '#1a212b', weight: 2.2, curve: 0.4, closed: false});
  inkLine(p, 6_300_041, [[480, 900], [760, 1010], [1000, 960]], {color: '#1a212b', weight: 2.2, curve: 0.4, closed: false});
};

/** LF02: the street, the woman standing under the lamp, mask on (eyes above it), full length at 300 px/m. */
const G0 = streetP([0, 0, 0]);
const paintStreetWoman = (p: Painter, tl: number) => {
  paintStreet(p);
  drawWoman(p, G0, streetUnit(0), tl, 0);
};

/** LF03: the reveal close-up: mask lowered under the chin, the closed smile line readable. */
const paintReveal = (p: Painter, tl: number) => {
  hardFill(p, 6_200_001, PAPER, rectPts(-300, -300, 1380, 2220));
  washAt(p, 6_200_002, '#1a2a40', 200, ell(540, 560, 640, 780, 40), 0.3, 0.3);
  drawWoman(p, CU_GROUND, CU_UNIT, tl, 1, WOMAN_LIGHT, REVEAL_FACE);
};

/** A soft lamp light from above the frame (LF03): warm on the hair top and shoulders, faint on the face. */
const TopGlow = () => {
  const id = useId();
  return (
    <>
      <defs>
        <radialGradient id={id} gradientUnits="userSpaceOnUse" cx={300} cy={-200} r={1000}>
          <stop offset="0" stopColor="#e8c079" stopOpacity={0.26} />
          <stop offset="0.6" stopColor="#e8c079" stopOpacity={0.1} />
          <stop offset="1" stopColor="#e8c079" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill={`url(#${id})`} />
    </>
  );
};

export const LF01 = ({falloff = true}: {falloff?: boolean}) => {
  const paint = useCallback(({brush, frame}: PaintContext) => plate(brush, frame, camClose, paintCloseup), []);
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <BrushCanvas paint={paint} paper={PAPER} />
      {falloff && <Falloff />}
      <Grade />
      <Grain />
    </AbsoluteFill>
  );
};

export const LF02 = ({falloff = true}: {falloff?: boolean}) => {
  const frame = useCurrentFrame();
  const paint = useCallback(({brush, frame}: PaintContext) => plate(brush, frame, camStreet, paintStreetWoman), []);
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <BrushCanvas paint={paint} paper={PAPER} />
      <CameraLayer camera={camStreet(frame / FPS)} width={W} height={H}>
        <StreetGlow />
      </CameraLayer>
      {falloff && <Falloff />}
      <Grade />
      <Grain />
    </AbsoluteFill>
  );
};

export const LF03 = ({falloff = true}: {falloff?: boolean}) => {
  const frame = useCurrentFrame();
  const paint = useCallback(({brush, frame}: PaintContext) => plate(brush, frame, camReveal, paintReveal), []);
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <BrushCanvas paint={paint} paper={PAPER} />
      <CameraLayer camera={camReveal(frame / FPS)} width={W} height={H}>
        <TopGlow />
      </CameraLayer>
      {falloff && <Falloff from={840} to={1060} peak={0.85} />}
      <Grade />
      <Grain />
    </AbsoluteFill>
  );
};
