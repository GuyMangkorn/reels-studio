// Standalone entry for the EDU-EP19-SHORT plate QA stills (Boss W5.3, 2026-11-15). Kept out of src/Root.tsx (the EDU-EP19-SHORT composition is the
// Editor's). One composition per shot, `EDU19-<shot id>`, the shot's length; the frame is the shot-local L. `EDU19-SEQ` plays the 23 plates on the
// R3 clock (1704 f, hard cuts, `shotAt`) for the seek-parity check. Input props: `guides` (default true: the dashed caption band 1176-1344) and
// `tag` (default true: burned-in preview label, shot ID, deliverable, TH time, G/L). Clean frames for caption-zone: --props='{"guides":false,"tag":false}'.
//   printf 'EDU19-B01-SH01 0 out/edu19-shots/B01-SH01_L0.png\n' | node scripts/stills.mjs src/painted/edu19/shots-index.tsx
import {createElement, Fragment, useCallback} from 'react';
import {AbsoluteFill, Composition, getInputProps, registerRoot, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {drawPlate} from '../plate';
import {edu19Shots} from '../shots/edu19';
import {DURATION, EDU19_SHOTS, FPS, plateId, shotAt, type ShotRow} from './shots/index';

const Plate = ({row, L}: {row: ShotRow; L: number}) => {
  const shot = edu19Shots.find((s) => s.id === plateId(row.id))!, tl = L / FPS, G = row.start + L, s = G / FPS;
  const props = getInputProps() as {guides?: boolean; tag?: boolean};
  const paint = useCallback(({brush}: PaintContext) => drawPlate(brush, shot, {tl, fps: FPS, width: 1080, height: 1920}), [shot, tl]);
  const Overlay = shot.Overlay;
  return (
    <AbsoluteFill style={{backgroundColor: shot.paper}}>
      <BrushCanvas paint={paint} paper={shot.paper} />
      {Overlay && <Overlay tl={tl} width={1080} height={1920} camera={shot.camera(tl)} opacity={1} />}
      {props.guides !== false && <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.6)', borderBottom: '2px dashed rgba(255,255,255,0.6)'}} />}
      {props.tag !== false && <div style={{position: 'absolute', left: 24, top: 1850, font: '600 30px sans-serif', color: '#fff', textShadow: '0 0 4px #000'}}>{`${row.id} · EDU-EP19-SHORT · TH ${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')} · G${G} l${L}`}</div>}
    </AbsoluteFill>
  );
};
const ShotComp = ({row}: {row: ShotRow}) => <Plate row={row} L={useCurrentFrame()} />;
const Seq = () => { const {row, L} = shotAt(useCurrentFrame()); return <Plate key={row.id} row={row} L={L} />; };

registerRoot(() => createElement(Fragment, null,
  ...EDU19_SHOTS.map((row) => createElement(Composition, {key: row.id, id: plateId(row.id), component: () => <ShotComp row={row} />, width: 1080, height: 1920, fps: FPS, durationInFrames: row.len})),
  createElement(Composition, {key: 'seq', id: 'EDU19-SEQ', component: Seq, width: 1080, height: 1920, fps: FPS, durationInFrames: DURATION})));
