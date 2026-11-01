// Standalone QA entry for the KSO look stills (not a deliverable; no registration in Root or src/videos).
// KSO-QA-LEAD-02 / -03: the woman alone on magenta paper at the LF02 / LF03 framing, so the visible artwork can be measured
// by pixels (lead height, brief acceptance 4). KSO-QA-PROP: the woman (1.95 m) and the WFOG narrator (1.70 m, same kit rig)
// side by side on grey paper, with the rig's landmark lines, for the proportion check (DF-20261101-kso-look-stills).
import {createElement, Fragment, useCallback} from 'react';
import {AbsoluteFill, Composition, registerRoot} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {applyCamera, type Camera} from '../kit/camera';
import {drawFigure, type CastDef} from '../kit/cast';
import {inkLine} from '../kit/draw';
import {makePainter, type Painter} from '../kit/painter';
import {poseArms} from '../kit/poses';
import {CAST} from '../worldfog/cast';
import {drawWoman, KSO_WOMAN, REVEAL_FACE, WOMAN_LIGHT} from './cast';
import {camReveal, camStreet, CU_GROUND, CU_UNIT, streetP, streetUnit} from './space';

const FPS = 30;
const plate = (brush: PaintContext['brush'], frame: number, cam: (tl: number) => Camera, paint: (p: Painter, tl: number) => void, paper: string) => {
  const tl = frame / FPS;
  const p = makePainter(brush, {t: tl, frame, fade: paper});
  brush.push();
  applyCamera(brush, cam(tl));
  paint(p, tl);
  brush.pop();
};

const LEAD_02 = (p: Painter, tl: number) => drawWoman(p, streetP([0, 0, 0]), streetUnit(0), tl, 0);
const LEAD_03 = (p: Painter, tl: number) => drawWoman(p, CU_GROUND, CU_UNIT, tl, 1, WOMAN_LIGHT, REVEAL_FACE);

const Lead = ({cam, paint}: {cam: (tl: number) => Camera; paint: (p: Painter, tl: number) => void}) => {
  const fn = useCallback(({brush, frame}: PaintContext) => plate(brush, frame, cam, paint, '#ff00ff'), [cam, paint]);
  return <AbsoluteFill><BrushCanvas paint={fn} paper="#ff00ff" /></AbsoluteFill>;
};

const PROP_PAPER = '#8a8f96';
/** Woman and narrator side by side at 300 px/m, feet on y 1500; the rig's landmark lines drawn for each figure. */
const Prop = () => {
  const fn = useCallback(({brush, frame}: PaintContext) => {
    const tl = frame / FPS;
    const p = makePainter(brush, {t: tl, frame, fade: PROP_PAPER});
    brush.push();
    const rows: [string, CastDef, number][] = [['woman', KSO_WOMAN, 300], ['narrator', CAST.narrator, 780]];
    for (const [i, [, def, x]] of rows.entries()) {
      const g: [number, number] = [x, 1500];
      const pose = {view: 'front' as const, face: {brow: 'flat' as const, eyes: 'half' as const, look: [0, 0] as [number, number], mouth: 'flat' as const}, ...poseArms('P01', def, g, 300)};
      const a = drawFigure(p, def, g, 300, pose, tl);
      for (const [j, y] of [a.headTop, a.chin, a.rShoulder[1], a.feet[1]].entries()) inkLine(p, 900 + i * 10 + j, [[0, y], [1080, y]], {color: '#e0203a', weight: 1, closed: false});
    }
    brush.pop();
  }, []);
  return <AbsoluteFill><BrushCanvas paint={fn} paper={PROP_PAPER} /></AbsoluteFill>;
};

registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'KSO-QA-LEAD-02', component: () => createElement(Lead, {cam: camStreet, paint: LEAD_02}), durationInFrames: 90, width: 1080, height: 1920, fps: FPS}),
    createElement(Composition, {id: 'KSO-QA-LEAD-03', component: () => createElement(Lead, {cam: camReveal, paint: LEAD_03}), durationInFrames: 30, width: 1080, height: 1920, fps: FPS}),
    createElement(Composition, {id: 'KSO-QA-PROP', component: Prop, durationInFrames: 1, width: 1080, height: 1920, fps: FPS}),
  ),
);
