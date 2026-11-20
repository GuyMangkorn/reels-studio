// Standalone entry for the EDU-EP30-SHORT plate QA stills (Boss T03, 2026-11-19). Kept out of src/Root.tsx (the EDU-EP30-SHORT composition is
// the Editor's). One composition per shot, `EDU30-<shot id>` (N frames, shot-local clock), `EDU30-SEQ` (1977 f, `shotAt(G)`, hard cuts, for the
// seek-parity check) and `EDU30-CAL` (the scale calibration sheet). Input props: `guides` (default true: dashed caption band y 1150-1344 and
// the y 1100 line) and `tag` (default true: shot ID, G and L, "EDU-EP30 preview"). Clean frames: --props='{"guides":false,"tag":false}'.
//   printf 'EDU30-B03-SH01 0 out/edu30-T03/B03-SH01_L0.png\n' | node scripts/stills.mjs src/painted/edu30/shots-index.tsx --gl=angle
import {createElement, Fragment} from 'react';
import {Composition, registerRoot, useCurrentFrame} from 'remotion';
import {edu30Shots} from '../shots/edu30';
import {CAL} from './calibration';
import {Plate30, SHOT_DEFS} from './shot';
import {DURATION, EDU30_SHOTS, FPS, plateId, shotAt, type ShotRow} from './shots/index';

void edu30Shots;   // importing the inventory builds every shot file and fills SHOT_DEFS
const ShotComp = ({row}: {row: ShotRow}) => { const L = useCurrentFrame(); return <Plate30 def={SHOT_DEFS[row.id]} L={L} G={row.start + L} />; };
const Seq = () => { const {row, L} = shotAt(useCurrentFrame()); return <Plate30 key={row.id} def={SHOT_DEFS[row.id]} L={L} G={row.start + L} />; };
const CalComp = () => <Plate30 def={CAL} L={0} G={0} />;

registerRoot(() => createElement(Fragment, null,
  ...EDU30_SHOTS.map((row) => createElement(Composition, {key: row.id, id: plateId(row.id), component: () => <ShotComp row={row} />, width: 1080, height: 1920, fps: FPS, durationInFrames: row.N})),
  createElement(Composition, {key: 'seq', id: 'EDU30-SEQ', component: Seq, width: 1080, height: 1920, fps: FPS, durationInFrames: DURATION}),
  createElement(Composition, {key: 'cal', id: 'EDU30-CAL', component: CalComp, width: 1080, height: 1920, fps: FPS, durationInFrames: 1})));
