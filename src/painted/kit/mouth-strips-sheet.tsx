// KIT-MOUTH-STRIPS: the profile and turned (3/4) mouth and jaw of the painted kit, head close-ups (7 Nov 2026).
//   KIT-MOUTH-STRIPS  rows: right profile and turned head (45 deg), each at talk open 0 / 0.5 / 1, `o`, smile, grin, frown
//   KIT-CHEW-STRIPS   eat-chew over one cycle (6 frames), right profile and turned head, person man-parted and woman-bob
// Own entry: printf 'KIT-MOUTH-STRIPS 0 out/x/mouth.png\nKIT-CHEW-STRIPS 0 out/x/chew.png\n' | node scripts/stills.mjs src/painted/kit/mouth-strips-sheet.tsx
import {createElement, Fragment, type CSSProperties} from 'react';
import {AbsoluteFill, Composition, registerRoot} from 'remotion';
import {BrushCanvas} from '../BrushCanvas';
import {EXPRESSIONS} from './expressions';
import {paintHeadFront, paintHeadSide, type FaceState} from './head';
import {layerMotion} from './motions';
import {makePainter} from './painter';
import {PEOPLE, type PersonId} from './people';

const h = createElement;
const K = 120, CELL = 330;
const cap: CSSProperties = {position: 'absolute', width: CELL, textAlign: 'center', fontFamily: 'Noto Sans Thai, sans-serif', color: '#2b211c', fontSize: 22};
const T = 0.4; // an eyes-open time for the default seed
const talk = (open: number): FaceState => ({...EXPRESSIONS.neutral, mouth: 'talk', open});
const STATES: {name: string; face: FaceState}[] = [
  {name: 'open 0', face: talk(0)}, {name: 'open 0.5', face: talk(0.5)}, {name: 'open 1', face: talk(1)}, {name: 'o', face: EXPRESSIONS.surprised},
  {name: 'smile', face: EXPRESSIONS.happy}, {name: 'grin', face: EXPRESSIONS.laugh}, {name: 'frown', face: EXPRESSIONS.sad}, {name: 'shout', face: {...EXPRESSIONS.furious, open: 1}},
];
const MW = CELL * STATES.length, MH = 3 * 380;
const MouthStrips = () => (
  <AbsoluteFill style={{background: '#f4efe4'}}>
    <BrushCanvas paint={({brush}) => {
      const p = makePainter(brush, {t: 0, frame: 0});
      const id: PersonId = 'man-parted', head = {...PEOPLE[id].head, sideDetail: true};
      STATES.forEach(({face}, i) => {
        const x = CELL * (i + 0.5);
        paintHeadSide(p, 11, x, 210, K, {...face, eyes: 'dot'}, {...PEOPLE[id].head, sideDetail: false}, 1, T);
        paintHeadSide(p, 12, x, 590, K, {...face, eyes: 'dot'}, head, 1, T);
        paintHeadFront(p, 13, x, 970, K, {...face, eyes: 'dot'}, PEOPLE[id].head, T, 0, undefined, 0.7);
      });
    }} />
    {STATES.map(({name}, i) => <div key={name} style={{...cap, left: CELL * i, top: 8}}>{name}</div>)}
    <div style={{...cap, left: 0, width: MW, top: 372, textAlign: 'left', paddingLeft: 8}}>right profile (plain) | next row sideDetail | bottom row turned head 0.7 rad</div>
  </AbsoluteFill>
);

const FR = 6, CW = CELL * FR, CHH = 4 * 380;
const CHEW_PERIOD = 2 / 3;
const ChewStrips = () => (
  <AbsoluteFill style={{background: '#f4efe4'}}>
    <BrushCanvas paint={({brush}) => {
      const p = makePainter(brush, {t: 0, frame: 0});
      ([['man-parted', 'right'], ['woman-bob', 'right'], ['man-parted', 'turn'], ['woman-bob', 'turn']] as [PersonId, string][]).forEach(([id, kind], row) => {
        for (let i = 0; i < FR; i++) {
          const t = (i / FR) * CHEW_PERIOD, f = layerMotion({person: id, motion: 'eat-chew', t, g: [0, 0], unit: 500, view: 'right'});
          const x = CELL * (i + 0.5), y = 210 + row * 380 + (f.pose.nod?.[1] ?? 0) * -400;
          if (kind === 'right') paintHeadSide(p, 21 + row, x, y, K, {...f.pose.face, eyes: 'dot'}, PEOPLE[id].head, 1, T);
          else paintHeadFront(p, 21 + row, x, y, K, {...f.pose.face, eyes: 'dot'}, PEOPLE[id].head, T, 0, undefined, 0.7);
        }
      });
    }} />
    {Array.from({length: FR}, (_, i) => <div key={i} style={{...cap, left: CELL * i, top: 8}}>{`t = ${((i / FR) * CHEW_PERIOD).toFixed(2)} s`}</div>)}
  </AbsoluteFill>
);

registerRoot(() => h(Fragment, null,
  h(Composition, {id: 'KIT-MOUTH-STRIPS', component: MouthStrips, width: MW, height: MH, fps: 30, durationInFrames: 30}),
  h(Composition, {id: 'KIT-CHEW-STRIPS', component: ChewStrips, width: CW, height: CHH, fps: 30, durationInFrames: 30})));
