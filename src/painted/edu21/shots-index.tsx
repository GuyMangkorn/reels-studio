// Standalone entry for the EDU-EP21-SHORT plate QA stills (Boss W5.2, 2026-11-16). Kept out of src/Root.tsx (the EDU-EP21-SHORT composition is
// the Editor's). One composition per registered shot, `EDU21-<shot id>`, the shot's length; the frame is the shot-local L. `EDU21-SEQ` plays the
// registered plates from G0 on the sheet clock (hard cuts, `shotAt`) up to the end of the last built shot (unbuilt rows: a black
// placeholder), for the seek-parity check. Input
// props: `guides` (default true: the dashed caption band 1176-1344) and `tag` (default true: burned-in preview label, shot ID, deliverable,
// TH time, G/l). Clean frames for caption-zone: --props='{"guides":false,"tag":false}'.
//   printf 'EDU21-B01-SH01 0 out/qa/edu21/B01-SH01_l0.png\n' | node scripts/stills.mjs src/painted/edu21/shots-index.tsx --gl=angle
import {createElement, Fragment, useCallback} from 'react';
import {AbsoluteFill, Composition, getInputProps, registerRoot, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {drawPlate} from '../plate';
import {edu21Shots} from '../shots/edu21';
import {EDU21_SHOTS, FPS, plateId, shotAt, type ShotRow} from './shots/index';

const built = EDU21_SHOTS.filter((r) => edu21Shots.some((s) => s.id === plateId(r.id)));
// up to the end of the last built shot; an unbuilt row in between plays a labelled black placeholder (Boss W5.2 BG2: SH09 and SH12 seek
// parity before BG3/BG4 exist)
const seqEnd = built.reduce((g, r) => Math.max(g, r.start + r.len), 0);

const Plate = ({row, L}: {row: ShotRow; L: number}) => {
  const shot = edu21Shots.find((s) => s.id === plateId(row.id))!, tl = L / FPS, G = row.start + L, s = G / FPS;
  const props = getInputProps() as {guides?: boolean; tag?: boolean};
  const paint = useCallback(({brush}: PaintContext) => drawPlate(brush, shot, {tl, fps: FPS, width: 1080, height: 1920}), [shot, tl]);
  const Overlay = shot.Overlay;
  return (
    <AbsoluteFill style={{backgroundColor: shot.paper}}>
      <BrushCanvas paint={paint} paper={shot.paper} />
      {Overlay && <Overlay tl={tl} width={1080} height={1920} camera={shot.camera(tl)} opacity={1} />}
      {props.guides !== false && <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.6)', borderBottom: '2px dashed rgba(255,255,255,0.6)'}} />}
      {props.tag !== false && <div style={{position: 'absolute', left: 24, top: 1850, font: '600 30px sans-serif', color: '#fff', textShadow: '0 0 4px #000'}}>{`${row.id} · EDU-EP21-SHORT · TH ${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')} · G${G} l${L}`}</div>}
    </AbsoluteFill>
  );
};
const ShotComp = ({row}: {row: ShotRow}) => <Plate row={row} L={useCurrentFrame()} />;
const Seq = () => {
  const {row, L} = shotAt(useCurrentFrame());
  if (!built.includes(row)) return <AbsoluteFill style={{backgroundColor: '#000', color: '#888', font: '600 40px sans-serif', alignItems: 'center', justifyContent: 'center'}}>{`${row.id} not built · G${row.start + L}`}</AbsoluteFill>;
  return <Plate key={row.id} row={row} L={L} />;
};

registerRoot(() => createElement(Fragment, null,
  ...built.map((row) => createElement(Composition, {key: row.id, id: plateId(row.id), component: () => <ShotComp row={row} />, width: 1080, height: 1920, fps: FPS, durationInFrames: row.len})),
  ...(seqEnd > 0 ? [createElement(Composition, {key: 'seq', id: 'EDU21-SEQ', component: Seq, width: 1080, height: 1920, fps: FPS, durationInFrames: seqEnd})] : [])));
