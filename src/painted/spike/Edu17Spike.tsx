import {useCallback} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import '../../scenes/Subtitles'; // side effect: loads the Noto Sans Thai face for the labels
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {hardFill} from '../kit/draw';
import {makePainter, type Pt} from '../kit/painter';
import type {YCam} from '../kit/ycam';
import {camPoint} from '../kit/ycam';
import {paintCrowdStandin} from '../edu17/crowd-standin';
import {G_ANCHORS, G_SHOTS, gProject, gShotCam, pxPerKm} from '../edu17/geo';
import {AnchoredLabel, GeoLabel, LBLW, LBL, LBL2} from '../edu17/labels';
import {LOOK_COL, paintMapPlate, plateFor} from '../edu17/mapdraw';

// EDU-EP17 group 1 spikes (Boss, 2026-11-11): SP1 altitude chain, SP2 crowd density and paint time, N14 label slots on the map. BLOCKOUT: flat stand-in colours and a
// stand-in L3 and crowd, not Film's look (LF01A-LF07 are not painted yet). Spike entry only (edu17-spike-index.ts): not the episode, not registered in src/Root.tsx.

const note = (shot: string, clock: string) => `BLOCKOUT — not the final look · EDU-EP17-SHORT · ${shot} ${clock}`;
const Tag = ({text}: {text: string}) => (
  <div style={{position: 'absolute', left: 16, right: 16, bottom: 12, fontFamily: 'Noto Sans Thai, sans-serif', fontSize: 22, lineHeight: 1.2, color: '#fff', WebkitTextStroke: '4px #111', paintOrder: 'stroke fill'}}>{text}</div>
);

/** SP1 chain: the G camera paths of shots 1, 8, 9 and 22 (ROWS-R2.1) laid end to end; composition frame n -> (shot, shot-local frame). */
export const SP1_PATHS = ['S01-B01-SH01', 'S01-B02-SH03', 'S01-B03-SH01', 'S01-B05-SH01'] as const;
export const sp1Lookup = (n: number) => {
  let k = n;
  for (const s of SP1_PATHS) { const len = G_SHOTS.find((m) => m.shot === s)!.len; if (k < len) return {shot: s, f: k}; k -= len; }
  return {shot: SP1_PATHS[3], f: G_SHOTS.find((m) => m.shot === SP1_PATHS[3])!.len - 1};
};
export const SP1_FRAMES = SP1_PATHS.reduce((s, id) => s + G_SHOTS.find((m) => m.shot === id)!.len, 0);

export const Sp1Chain = () => {
  const n = useCurrentFrame(), {shot, f} = sp1Lookup(n);
  const cam = gShotCam(shot, f);
  const paint = useCallback(({brush, t, frame}: PaintContext) => paintMapPlate(makePainter(brush, {t, frame}), cam, {...plateFor(shot, f), t}), [cam.lat, cam.lon, cam.h, cam.yaw, cam.pp?.[0], cam.pp?.[1]]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <AbsoluteFill style={{backgroundColor: LOOK_COL.gulf}}>
      <BrushCanvas paint={paint} paper={LOOK_COL.gulf} />
      <Tag text={`SP1 · ${note(shot, `+${f} (n${n})`)} · h ${cam.h.toFixed(cam.h < 10 ? 2 : 0)} km · ${pxPerKm(cam).toFixed(2)} px/km`} />
    </AbsoluteFill>
  );
};

/** SP1 seam pairs: the camera stands still at the seam altitude while the layer alphas are taken at h x 0.995 (even n) and h x 1.005 (odd n), so the pair differs only by the layer
 * change (no camera motion in the diff); control altitudes carry no seam and must give the same near-zero diff. */
export const SEAMS: {h: number; label: string; control?: boolean}[] = [
  {h: 2, label: 'L3 out start 2 km'}, {h: 6, label: 'L3 out end 6 km'}, {h: 100, label: 'L2 out start 100 km'}, {h: 1000, label: 'L2 out end 1,000 km'}, {h: 1500, label: 'L0 on / L1 out start / sphere blend start 1,500 km'},
  {h: 2000, label: 'L1 out end 2,000 km'}, {h: 2400, label: 'sphere blend end 2,400 km'},
  {h: 0.9, label: 'control', control: true}, {h: 30, label: 'control', control: true}, {h: 300, label: 'control', control: true}, {h: 700, label: 'control', control: true}, {h: 1250, label: 'control', control: true},
  {h: 1800, label: 'control', control: true}, {h: 3500, label: 'control', control: true}, {h: 6000, label: 'control', control: true},
];
export const seamCam = (n: number) => {
  const s = SEAMS[n >> 1], h = s.h;
  return {lat: h < 10 ? G_ANCHORS.K02.lat : 13.75, lon: h < 10 ? G_ANCHORS.K02.lon : 100.55, h, pp: (h > 3000 ? [540, 960] : [540, 660]) as [number, number], yaw: 0};
};
export const Sp1Seams = () => {
  const n = useCurrentFrame(), cam = seamCam(n), s = SEAMS[n >> 1];
  const paint = useCallback(({brush, t, frame}: PaintContext) => paintMapPlate(makePainter(brush, {t, frame}), cam, {alphaH: s.h * (n % 2 ? 1.005 : 0.995), phi: 1, streams: 0}), [n]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <AbsoluteFill style={{backgroundColor: LOOK_COL.gulf}}>
      <BrushCanvas paint={paint} paper={LOOK_COL.gulf} />
      <Tag text={`SP1 seam pair · ${note('seam test', `n${n}`)} · h ${cam.h.toFixed(2)} km · ${s.label}`} />
    </AbsoluteFill>
  );
};

/** SP2: SH04 (straight down 2.3 m over the heads) and SH11 (4.5 m over the sea of heads), stand-in crowd on the 0.5 m lattice. */
export const sh04Cam = (f: number): YCam => ({x: 0, y: 4.0 - (0.15 * Math.min(f, 66)) / 66, z: 0.08, yaw: 0, pitch: (-89 * Math.PI) / 180, f: 1000, hy: 960});
export const sh11Cam = (): YCam => ({x: 0, y: 4.5, z: 6.0, yaw: 0, pitch: -Math.atan(3.9 / 10), f: 1000, hy: 960});

export const Sp2 = ({shot}: {shot: 'S01-B01-SH04' | 'S01-B03-SH03'}) => {
  const f = useCurrentFrame(), {width, height} = useVideoConfig();
  const sh04 = shot === 'S01-B01-SH04';
  const cam = sh04 ? sh04Cam(f) : sh11Cam();
  const paint = useCallback(({brush, t, frame}: PaintContext) => {
    const p = makePainter(brush, {t, frame});
    const full: Pt[] = [[-20, -20], [width + 20, -20], [width + 20, height + 20], [-20, height + 20]];
    let drawn: number;
    if (sh04) {
      hardFill(p, 1, '#7d8a8f', full);
      drawn = paintCrowdStandin(p, cam, {x0: -4, x1: 4, z0: -8, z1: 8}, {manAt: [0, 0], lookDown: true});
      // the 0.5 m square around his head (bright outline at head-top height)
      const sq = ([[-0.25, -0.25], [0.25, -0.25], [0.25, 0.25], [-0.25, 0.25]] as Pt[]).map(([x, z]) => camPoint(cam, [x, 1.72, z]) as Pt);
      for (let i = 0; i < 4; i++) { const a = sq[i], b = sq[(i + 1) % 4], d: Pt = [b[0] - a[0], b[1] - a[1]], L = Math.hypot(d[0], d[1]), nx = (-d[1] / L) * 3, ny = (d[0] / L) * 3; hardFill(p, 90 + i, '#ffffff', [[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]]); }
    } else {
      hardFill(p, 1, '#a9c1d1', [[-20, -20], [width + 20, -20], [width + 20, 640], [-20, 640]]); // sky
      hardFill(p, 2, '#b69f84', [[-20, 540], [width + 20, 540], [width + 20, 700], [-20, 700]]); // shophouse band (stand-in)
      hardFill(p, 3, '#6f6e6a', [[-20, 660], [width + 20, 660], [width + 20, height + 20], [-20, height + 20]]); // street
      drawn = paintCrowdStandin(p, cam, {x0: -11, x1: 11, z0: -52, z1: 7}, {manAt: [0, 0], minPx: 0.45});
    }
    console.log('edu17-sp2 ' + JSON.stringify({shot, drawn}));
  }, [cam.x, cam.y, cam.z, sh04, shot, width, height]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <AbsoluteFill style={{backgroundColor: '#6f6e6a'}}>
      <BrushCanvas paint={paint} paper="#6f6e6a" />
      <Tag text={`SP2 · ${note(shot, `+${f}`)} · stand-in specks (person-top and crowd-heads not built)`} />
    </AbsoluteFill>
  );
};

/** N14: SH03 map at h 80 with OT01 in LBL-W, OT02 world-anchored at both province centres, LBL2 sample; and the OT06 dot label on the globe. */
export const N14Sheet = ({which}: {which: 'sh03' | 'sh22'}) => {
  const f = useCurrentFrame();
  const cam = which === 'sh03' ? gShotCam('S01-B01-SH03', 77) : gShotCam('S01-B05-SH01', 218);
  const paint = useCallback(({brush, t, frame}: PaintContext) => paintMapPlate(makePainter(brush, {t, frame}), cam, {...plateFor(which === 'sh03' ? 'S01-B01-SH03' : 'S01-B05-SH01', which === 'sh03' ? 77 : 218), t}), [which]); // eslint-disable-line react-hooks/exhaustive-deps
  const dot = gProject(cam, G_ANCHORS.MC.lat, G_ANCHORS.MC.lon);
  return (
    <AbsoluteFill style={{backgroundColor: LOOK_COL.gulf}}>
      <BrushCanvas paint={paint} paper={LOOK_COL.gulf} />
      {which === 'sh03' ? (
        <>
          <LBLW />
          <LBL2 text="ซีแอตเทิล · 2011" />
          <GeoLabel cam={cam} lat={13.74} lon={100.6} text="กรุงเทพฯ" side="left" />
          <GeoLabel cam={cam} lat={13.93} lon={100.42} text="นนทบุรี" side="left" />
        </>
      ) : (
        <>
          <LBL />
          <AnchoredLabel anchor={[dot.x, dot.y]} to={[760, 820]} text="คนทั้งโลก" />
        </>
      )}
      <Tag text={`N14 · ${note(which === 'sh03' ? 'S01-B01-SH03' : 'S01-B05-SH01', `+${which === 'sh03' ? 77 : 218} (n${f})`)}`} />
    </AbsoluteFill>
  );
};
