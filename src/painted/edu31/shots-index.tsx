// Standalone entry for the EDU-EP31-SHORT plate QA stills (Boss W5.2 batch 1, 2026-11-21). Kept out of src/Root.tsx (the EDU-EP31-SHORT
// composition is the Editor's). One composition per built shot, `EDU31-<shot id>` (N frames, shot-local clock), and `EDU31-SEQ` (1795 f, `shotAt(G)`,
// hard cuts, for the seek-parity check; unbuilt shots show their paper). Input props: `guides` (default true: dashed caption band y 1100-1344) and
// `tag` (default true: shot ID, F and f, "EDU-EP31 preview"). Clean frames: --props='{"guides":false,"tag":false}'.
//   printf 'EDU31-B03-SH04 0 out/edu31/w52/B03-SH04_f0.png\n' | node scripts/stills.mjs src/painted/edu31/shots-index.tsx --gl=angle
import {createElement, Fragment} from 'react';
import {AbsoluteFill, Composition, registerRoot, useCurrentFrame} from 'remotion';
import {edu31Shots} from '../shots/edu31';
import {Plate31, SHOT_DEFS} from './shot';
import {DURATION, EDU31_SHOTS, FPS, plateId, shotAt, type ShotRow} from './shots/index';

void edu31Shots;   // importing the inventory builds every shot file and fills SHOT_DEFS
const built = EDU31_SHOTS.filter((r) => SHOT_DEFS[r.id]);
const ShotComp = ({row}: {row: ShotRow}) => { const L = useCurrentFrame(); return <Plate31 def={SHOT_DEFS[row.id]} L={L} G={row.start + L} />; };
const Seq = () => {
  const {row, L} = shotAt(useCurrentFrame()), d = SHOT_DEFS[row.id];
  return d ? <Plate31 key={row.id} def={d} L={L} G={row.start + L} /> : <AbsoluteFill style={{backgroundColor: '#222'}} />;
};

registerRoot(() => createElement(Fragment, null,
  ...built.map((row) => createElement(Composition, {key: row.id, id: plateId(row.id), component: () => <ShotComp row={row} />, width: 1080, height: 1920, fps: FPS, durationInFrames: row.N})),
  createElement(Composition, {key: 'seq', id: 'EDU31-SEQ', component: Seq, width: 1080, height: 1920, fps: FPS, durationInFrames: DURATION})));
