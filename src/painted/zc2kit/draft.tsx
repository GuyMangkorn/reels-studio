import {createElement, Fragment, useCallback} from 'react';
import {AbsoluteFill, Composition, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {applyCamera, type Camera} from '../kit/camera';
import {makePainter, type Painter} from '../kit/painter';
import {CaptionShade, Grain} from '../kit/screen';
import {PAPER} from './frames';
import {cur} from './sb-lib';
import {SPECS, type Spec} from './draft-spec';

// ZCONDO2-SHORT-TH W5.2 draft shots: one composition per shot, ID `ZC2D-<shot>` (e.g. ZC2D-B01-SH01), frame count and cues from the scene
// sheet SS-ZC2-R1. Every frame is a pure function of the shot-local frame `f` (the BrushCanvas contract); the draft clock `cur.f` carries f into the
// shared set/figure painters. Captions are Editor's: the composition holds the cue-gated CaptionShade only (peaks from the shade table).
export const FPS = 30;
/** CSS twin of `applyCamera` for Remotion overlays that sit in the painted world (labels beside a plate object). */
const camCss = (c: Camera) => `translate(${c.fx + c.dx}px, ${c.fy + c.dy}px) scale(${c.s}) translate(${-c.fx}px, ${-c.fy}px)`;

export const DraftShot = ({id}: {id: string}) => {
  const f = useCurrentFrame();
  const s: Spec = SPECS[id];
  const paint = useCallback(({brush}: PaintContext) => {
    cur.f = f;
    const p: Painter = makePainter(brush, {t: f / FPS, frame: f, fade: PAPER});
    const cam: Camera = s.cam(f);
    brush.push();
    applyCamera(brush, cam);
    s.paint(p, f);
    brush.pop();
    cur.f = 0;
  }, [s, f]);
  return (
    <AbsoluteFill style={{background: PAPER, width: 1080, height: 1920}}>
      <BrushCanvas paint={paint} paper={PAPER} />
      {s.over ? <AbsoluteFill style={{transformOrigin: '0 0', transform: camCss(s.cam(f))}}>{s.over(f)}</AbsoluteFill> : null}
      {s.after?.(f)}
      <Grain opacity={0.1} />
      {s.peak > 0 ? <CaptionShade tl={f / FPS} cues={s.cues.map(([a, b]) => [a / FPS, b / FPS, s.lines ?? 2] as const)} mode="band" strength={s.peak} /> : null}
    </AbsoluteFill>
  );
};

/** Composition ID of a shot: `ZC2-B01-SH01` -> `ZC2D-B01-SH01`. */
export const draftId = (shot: string) => shot.replace(/^ZC2-/, 'ZC2D-');

export const DraftRoot = () => createElement(Fragment, null, ...Object.keys(SPECS).map((id) =>
  createElement(Composition, {key: id, id: draftId(id), component: DraftShot as never, defaultProps: {id}, width: 1080, height: 1920, fps: FPS, durationInFrames: SPECS[id].n})));
