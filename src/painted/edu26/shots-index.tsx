// Standalone entry for the EDU-EP26-SHORT plate QA stills (Boss W5.2, 2026-11-18). Kept out of src/Root.tsx (the EDU-EP26-SHORT composition is the
// Editor's). One composition per shot, `EDU26-<shot id>`, the shot's length (plus its pre-roll: frame = L + pre); `EDU26-SEQ` plays the 20 plates
// on the SHEET-R1 clock (1894 f, `shotAt`, every cut hard: the time-passing dissolve is the Editor's `dissolveSec`) for the seek-parity check.
// Input props: `guides` (default true: the dashed caption band 1230-1344) and `tag` (default true: preview label, shot ID, deliverable, TH time,
// G/L). Clean frames for caption-zone: --props='{"guides":false,"tag":false}'.
//   printf 'EDU26-B01-SH04 0 out/edu26-shots/B01-SH04_L0.png\n' | node scripts/stills.mjs src/painted/edu26/shots-index.tsx
import {createElement, Fragment, useCallback} from 'react';
import {AbsoluteFill, Composition, getInputProps, registerRoot, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {drawPlate} from '../plate';
import {edu26Shots} from '../shots/edu26';
import {DURATION, EDU26_SHOTS, FPS, plateId, shotAt, type ShotRow} from './shots/index';

const Plate = ({row, F}: {row: ShotRow; F: number}) => {
  const shot = edu26Shots.find((s) => s.id === plateId(row.id))!, tl = F / FPS, L = F - (row.pre ?? 0), G = row.start + L, s = G / FPS;
  const props = getInputProps() as {guides?: boolean; tag?: boolean};
  const paint = useCallback(({brush}: PaintContext) => drawPlate(brush, shot, {tl, fps: FPS, width: 1080, height: 1920}), [shot, tl]);
  const Overlay = shot.Overlay;
  return (
    <AbsoluteFill style={{backgroundColor: shot.paper}}>
      <BrushCanvas paint={paint} paper={shot.paper} />
      {Overlay && <Overlay tl={tl} width={1080} height={1920} camera={shot.camera(tl)} opacity={1} />}
      {props.guides !== false && <div style={{position: 'absolute', left: 0, right: 0, top: 1230, height: 114, borderTop: '2px dashed rgba(255,255,255,0.6)', borderBottom: '2px dashed rgba(255,255,255,0.6)'}} />}
      {props.tag !== false && <div style={{position: 'absolute', left: 24, top: 1850, font: '600 30px sans-serif', color: '#fff', textShadow: '0 0 4px #000'}}>{`${row.id} · EDU-EP26-SHORT · TH ${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')} · G${G} L${L}`}</div>}
    </AbsoluteFill>
  );
};
const ShotComp = ({row}: {row: ShotRow}) => <Plate row={row} F={useCurrentFrame()} />;
const Seq = () => { const {row, L} = shotAt(useCurrentFrame()); return <Plate key={row.id} row={row} F={L + (row.pre ?? 0)} />; };

registerRoot(() => createElement(Fragment, null,
  ...EDU26_SHOTS.map((row) => createElement(Composition, {key: row.id, id: plateId(row.id), component: () => <ShotComp row={row} />, width: 1080, height: 1920, fps: FPS, durationInFrames: row.len + (row.pre ?? 0)})),
  createElement(Composition, {key: 'seq', id: 'EDU26-SEQ', component: Seq, width: 1080, height: 1920, fps: FPS, durationInFrames: DURATION})));
