import {useCallback} from 'react';
import {AbsoluteFill, getInputProps, useCurrentFrame} from 'remotion';
import '../../scenes/Subtitles'; // side effect: loads the Noto Sans Thai face for the labels
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter} from '../kit/painter';
import {G_ANCHORS, G_SHOTS, gProject, gShotCam} from '../edu17/geo';
import {AnchoredLabel, GeoLabel, LBL, LBLW} from '../edu17/labels';
import {LOOK_COL, paintMapPlate, plateFor} from '../edu17/mapdraw';

// EDU-EP17 group 3 (Boss, 2026-11-12): the N3 map plate and the N4 fill layer on the G shot cameras (shots 1, 3, 6, 7, 8, 9, 16, 22). One composition per shot, the composition
// frame is the shot-local frame (so `scripts/stills.mjs EDU17-G3-SH01 0 out.png` is shot 1 +0). Spike entry only (edu17-group3-index.ts): not the episode, not in src/Root.tsx.
export const G3_SHOTS = {
  SH01: 'S01-B01-SH01', SH03: 'S01-B01-SH03', SH06: 'S01-B02-SH01', SH07: 'S01-B02-SH02', SH08: 'S01-B02-SH03', SH09: 'S01-B03-SH01', SH16: 'S01-B04-SH01', SH22: 'S01-B05-SH01',
} as const;
export type G3Key = keyof typeof G3_SHOTS;

export const G3Shot = ({k}: {k: G3Key}) => {
  const f = useCurrentFrame(), shot = G3_SHOTS[k], cam = gShotCam(shot, f), opts = {...plateFor(shot, f), ...(getInputProps() as {shade?: number; shadeFrom?: number})}; // inputProps shade/shadeFrom: tuning sweeps only
  const paint = useCallback(({brush, t, frame}: PaintContext) => paintMapPlate(makePainter(brush, {t, frame}), cam, {...opts, t: f / 30 + t}), [shot, f]); // eslint-disable-line react-hooks/exhaustive-deps
  const dot = gProject(cam, G_ANCHORS.MC.lat, G_ANCHORS.MC.lon);
  const names = k === 'SH03' || k === 'SH06' || k === 'SH07';
  return (
    <AbsoluteFill style={{backgroundColor: LOOK_COL.gulf}}>
      <BrushCanvas paint={paint} paper={LOOK_COL.gulf} />
      {names ? <LBLW /> : <LBL />}
      {names && <GeoLabel cam={cam} lat={13.74} lon={100.6} text="กรุงเทพฯ" side="left" />}
      {names && <GeoLabel cam={cam} lat={13.93} lon={100.42} text="นนทบุรี" side="left" />}
      {k === 'SH22' && f >= 141 && <AnchoredLabel anchor={[dot.x, dot.y]} to={[760, 820]} text="คนทั้งโลก" ring={false} />}
    </AbsoluteFill>
  );
};

export const g3Len = (k: G3Key) => G_SHOTS.find((m) => m.shot === G3_SHOTS[k])!.len;
