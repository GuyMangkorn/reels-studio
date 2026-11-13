import {useCallback} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import '../../scenes/Subtitles'; // side effect: loads the Noto Sans Thai face for the labels
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {hardFill} from '../kit/draw';
import {makePainter, type Pt} from '../kit/painter';
import {camPoint, type YCam} from '../kit/ycam';
import {G_ANCHORS, gProject, gShotCam} from '../edu17/geo';
import {phiAt} from '../edu17/fill';
import {AnchoredLabel, GeoLabel, LBL, LBLW} from '../edu17/labels';
import {bottomShade, LOOK_COL, paintDot, paintGlobeLook, paintL3Look, paintMetroLook, ribbon, type GlobeOpts, type L3Opts, type MetroOpts} from '../edu17/look-a-map';
import {paintCrowdTop} from '../edu17/look-a-crowd-top';

// EDU-EP17 W3 look frames, set A (Film, 2026-11-11): LF01A (SH01 +0), LF01B (SH06 +55), LF03 (SH04 +43), LF07 (SH22 +170), each as two or three thumbnail
// options (`opt`) on the storyboard camera of that shot (ROWS-R2.1). Spike entry only (edu17-look-a-index.ts): not the episode, not in src/Root.tsx.
// The composition frame is ignored for the camera (each still is the named shot frame); `t` drives only ambient clocks.

export const LF01A_OPTS: Record<string, L3Opts> = {a: {gridDeg: 0, light: 'sun'}, b: {gridDeg: 24, light: 'sun'}, c: {gridDeg: 24, light: 'haze'}};
export const LF01B_OPTS: Record<string, MetroOpts> = {a: {outDim: 'dim', bottomShade: 0.25, streams: 1}, b: {outDim: 'dim', bottomShade: 0.35, shadeFrom: 1100, streams: 1}, c: {outDim: 'mid', bottomShade: 0.4, shadeFrom: 1100, streams: 1}};
export const LF03_OPTS: Record<string, {dim?: number; shade?: number}> = {a: {}, b: {dim: 0.22}, final: {shade: 0.36}};
export const LF07_OPTS: Record<string, GlobeOpts> = {a: {sun: [-0.5, -0.866], shade: 1.2}, b: {sun: [-0.71, -0.71], shade: 0.8}, c: {sun: [0, -1], shade: 1.3, clouds: 1.4}};

export const Lf01A = ({opt}: {opt: string}) => {
  const cam = gShotCam('S01-B01-SH01', 0);
  const paint = useCallback(({brush, t, frame}: PaintContext) => paintL3Look(makePainter(brush, {t, frame}), cam, LF01A_OPTS[opt]), [opt]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <AbsoluteFill style={{backgroundColor: LOOK_COL.street}}>
      <BrushCanvas paint={paint} paper={LOOK_COL.street} />
      <LBL />
    </AbsoluteFill>
  );
};

export const Lf01B = ({opt}: {opt: string}) => {
  const cam = gShotCam('S01-B02-SH01', 55), phi = phiAt('S01-B02-SH01', 55);
  const paint = useCallback(({brush, t, frame}: PaintContext) => paintMetroLook(makePainter(brush, {t, frame}), cam, {...LF01B_OPTS[opt], phi}), [opt]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <AbsoluteFill style={{backgroundColor: LOOK_COL.gulf}}>
      <BrushCanvas paint={paint} paper={LOOK_COL.gulf} />
      <LBLW />
      <GeoLabel cam={cam} lat={13.74} lon={100.6} text="กรุงเทพฯ" side="left" />
      <GeoLabel cam={cam} lat={13.93} lon={100.42} text="นนทบุรี" side="left" />
    </AbsoluteFill>
  );
};

/** SH04 camera (storyboard: ycam pos (0, 4.00 -> 3.85, 0.08), look-at (0, 0, 0), f 1000, push +0 to +66). */
export const sh04Cam = (f: number): YCam => ({x: 0, y: 4.0 - (0.15 * Math.min(f, 66)) / 66, z: 0.08, yaw: 0, pitch: (-89 * Math.PI) / 180, f: 1000, hy: 960});
export const SQUARE_Y = 1.62; // the 0.5 m grid and the square lie at crown height (about 220 px at +43)

export const Lf03 = ({opt}: {opt: string}) => {
  const cam = sh04Cam(43);
  const sq = ([[-0.25, -0.25], [0.25, -0.25], [0.25, 0.25], [-0.25, 0.25]] as Pt[]).map(([x, z]) => camPoint(cam, [x, SQUARE_Y, z]) as Pt);
  const paint = useCallback(({brush, t, frame}: PaintContext) => {
    const p = makePainter(brush, {t, frame}), o = LF03_OPTS[opt];
    paintCrowdTop(p, cam, {x0: -3, x1: 3, z0: -5, z1: 5}, {manAt: [0, 0], band: [1176, 1344], dimOutside: o.dim ? {cx: 0, cz: 0, half: 0.25, amount: o.dim} : undefined});
    const g = p.layer(0.2, 980000);
    let k = 0;
    for (let v = -2.75; v <= 2.76; v += 0.5) {
      const a = camPoint(cam, [v, SQUARE_Y, -4.5]), b = camPoint(cam, [v, SQUARE_Y, 4.5]), c = camPoint(cam, [-2.5, SQUARE_Y, v * 1.7]), d = camPoint(cam, [2.5, SQUARE_Y, v * 1.7]);
      if (a && b) hardFill(g, 980000 + k++, '#ffffff', ribbon([a, b], 1.6));
      if (c && d) hardFill(g, 980000 + k++, '#ffffff', ribbon([c, d], 1.6));
    }
    if (o.shade) bottomShade(p, 1000, o.shade, 982000);
    hardFill(p.layer(0.45, 981000), 981000, '#1b1610', ribbon([...sq, sq[0], sq[1]].map(([x, y]) => [x + 2, y + 2] as Pt), 5));
    hardFill(p, 981001, '#ffd34a', ribbon([...sq, sq[0], sq[1]], 3));
  }, [opt]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <AbsoluteFill style={{backgroundColor: '#26231f'}}>
      <BrushCanvas paint={paint} paper="#26231f" />
      <LBLW />
      <AnchoredLabel anchor={[sq[1][0] + 6, (sq[1][1] + sq[2][1]) / 2]} to={[sq[1][0] + 60, (sq[1][1] + sq[2][1]) / 2 - 150]} text="50 × 50 ซม." size={48} ring={false} lineColor="#ffd34a" />
    </AbsoluteFill>
  );
};

export const Lf07 = ({opt}: {opt: string}) => {
  const frame = useCurrentFrame();
  const cam = gShotCam('S01-B05-SH01', 170);
  const dot = gProject(cam, G_ANCHORS.MC.lat, G_ANCHORS.MC.lon);
  const paint = useCallback(({brush, t, frame: fr}: PaintContext) => {
    const p = makePainter(brush, {t, frame: fr});
    paintGlobeLook(p, cam, {...LF07_OPTS[opt], t: 170 / 30 + t});
    paintDot(p, dot.x, dot.y, 170 / 30 + t);
  }, [opt]); // eslint-disable-line react-hooks/exhaustive-deps
  void frame;
  return (
    <AbsoluteFill style={{backgroundColor: LOOK_COL.space0}}>
      <BrushCanvas paint={paint} paper={LOOK_COL.space0} />
      <LBL />
      <AnchoredLabel anchor={[dot.x, dot.y]} to={[760, 820]} text="คนทั้งโลก" ring={false} />
    </AbsoluteFill>
  );
};
