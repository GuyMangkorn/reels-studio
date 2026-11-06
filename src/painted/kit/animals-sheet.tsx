// KIT-ANIMALS: every ANIMALS entry (animals.ts) in each view and state, scaled so the shoulders line up; KIT-ANIMALS-LINEUP: the
// dogs and cats at true size beside a man (man-parted) and a girl (girl-school), plus a four-step walk strip. Own entry:
//   printf 'KIT-ANIMALS 0 out/animals/KIT-ANIMALS.png\nKIT-ANIMALS-LINEUP 0 out/animals/KIT-ANIMALS-LINEUP.png\n' \
//     | node scripts/stills.mjs src/painted/kit/animals-sheet.tsx
import {createElement, Fragment, type CSSProperties} from 'react';
import {AbsoluteFill, Composition, registerRoot} from 'remotion';
import {BrushCanvas} from '../BrushCanvas';
import {ANIMALS, ANIMAL_IDS, ANIMAL_INFO, animalWalkSpeed, drawAnimal, type AnimalPose} from './animals';
import {drawFigure} from './cast';
import {EXPRESSIONS} from './expressions';
import {makePainter, type Pt} from './painter';
import {PEOPLE} from './people';
import {poseArms} from './poses';

const h = createElement;
const COLS: {name: string; pose: AnimalPose}[] = [
  {name: 'stand', pose: {view: 'right', state: 'stand'}},
  {name: 'walk', pose: {view: 'right', state: 'stand', walk: 0.2, wag: 1}},
  {name: 'sit', pose: {view: 'right', state: 'sit'}},
  {name: 'lie', pose: {view: 'right', state: 'lie'}},
  {name: 'mouth open', pose: {view: 'left', state: 'stand', mouth: 'open'}},
  {name: 'front stand', pose: {view: 'front', state: 'stand'}},
  {name: 'front sit', pose: {view: 'front', state: 'sit'}},
  {name: 'front lie', pose: {view: 'front', state: 'lie'}},
  {name: '3/4 run', pose: {view: 'right', state: 'stand', gait: 'run', walk: 0.2, quarter: 0.5, mouth: 'open'}},
  {name: '3/4 brake', pose: {view: 'right', state: 'stand', gait: 'run', walk: 0.2, quarter: 0.6, brake: 1, stride: 0.15}},
];
const LABEL_W = 330, CELL_W = 270, ROW_H = 230, TOP = 110, SHOULDER = 92;
const W = LABEL_W + CELL_W * COLS.length, H = TOP + ROW_H * ANIMAL_IDS.length + 20;
/** A time where no animal blinks (the sheet should show open eyes). */
const T0 = 0.3;

const Sheet = () => (
  <AbsoluteFill style={{background: '#f4efe4'}}>
    <BrushCanvas paint={({brush}) => {
      const p = makePainter(brush, {t: T0, frame: 0});
      ANIMAL_IDS.forEach((id, r) => {
        const def = ANIMALS[id], unit = SHOULDER / def.height / (0.6 + 0.4 * def.head);
        COLS.forEach(({pose}, c) => {
          const g: Pt = [LABEL_W + CELL_W * (c + 0.5), TOP + ROW_H * (r + 1) - 26];
          drawAnimal(p, def.seed * 10 + c, def, g, unit, pose, T0);
        });
      });
    }} />
    <div style={{...cap, left: 24, top: 18, width: W, fontSize: 34, fontWeight: 700, textAlign: 'left'}}>src/painted/kit/animals.ts: ANIMALS ({ANIMAL_IDS.length}) · each row scaled to one shoulder height</div>
    {COLS.map(({name}, c) => <div key={name} style={{...cap, left: LABEL_W + CELL_W * c, top: 66, width: CELL_W, fontSize: 24, fontWeight: 700}}>{name}</div>)}
    {ANIMAL_IDS.map((id, r) => (
      <Fragment key={id}>
        <div style={{...cap, left: 20, top: TOP + ROW_H * r + 40, width: LABEL_W - 30, fontSize: 24, fontWeight: 700, textAlign: 'left'}}>{id}</div>
        <div style={{...cap, left: 20, top: TOP + ROW_H * r + 74, width: LABEL_W - 30, fontSize: 16, textAlign: 'left', color: '#5a4e45'}}>{ANIMAL_INFO[id].description}</div>
      </Fragment>
    ))}
  </AbsoluteFill>
);

const LW = 2400, LH = 1300, L_UNIT = 300, L_GROUND = 760;
const DOGS = ANIMAL_IDS.filter((id) => id.startsWith('dog-')), CATS = ANIMAL_IDS.filter((id) => id.startsWith('cat-'));
const WALK_ID = 'dog-golden', WALK_T = [0, 0.15, 0.3, 0.45];

const Lineup = () => (
  <AbsoluteFill style={{background: '#f4efe4'}}>
    <BrushCanvas paint={({brush}) => {
      const p = makePainter(brush, {t: T0, frame: 0});
      const man = PEOPLE['man-parted'], girl = PEOPLE['girl-school'];
      for (const [def, x] of [[man, 150], [girl, 330]] as const) {
        const g: Pt = [x, L_GROUND];
        drawFigure(p, def, g, L_UNIT, {view: 'front', face: EXPRESSIONS.neutral, ...poseArms('P01', def, g, L_UNIT)}, T0, def.seed);
      }
      let x = 520;
      for (const id of [...DOGS, ...CATS]) {
        const def = ANIMALS[id];
        drawAnimal(p, def.seed, def, [x + 1.1 * def.height * L_UNIT, L_GROUND], L_UNIT, {view: 'right', state: 'stand'}, T0);
        x += def.height * L_UNIT * 2.3 + 30;
      }
      // Walk strip: the golden at four times, moved at animalWalkSpeed so the planted paws stay put.
      const def = ANIMALS[WALK_ID], v = animalWalkSpeed(def);
      WALK_T.forEach((t, i) => drawAnimal(p, def.seed + i, def, [300 + i * 480 + v * t * L_UNIT, 1180], L_UNIT, {view: 'right', state: 'stand', walk: t, wag: 1}, t));
    }} />
    <div style={{...cap, left: 24, top: 18, width: LW, fontSize: 34, fontWeight: 700, textAlign: 'left'}}>KIT-ANIMALS-LINEUP · true size beside man-parted (1.7 m rig) and girl-school · walk strip: {WALK_ID} at t = {WALK_T.join(' / ')} s</div>
  </AbsoluteFill>
);
const cap: CSSProperties = {position: 'absolute', textAlign: 'center', fontFamily: 'Noto Sans Thai, sans-serif', color: '#2b211c'};

registerRoot(() => h(Fragment, null, h(Composition, {id: 'KIT-ANIMALS', component: Sheet, width: W, height: H, fps: 30, durationInFrames: 30}),
  h(Composition, {id: 'KIT-ANIMALS-LINEUP', component: Lineup, width: LW, height: LH, fps: 30, durationInFrames: 30})));
