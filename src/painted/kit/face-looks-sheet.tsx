// KIT-FACE-LOOKS: three front-view face looks (`HeadStyle.look`, head.ts) side by side; rows are three PEOPLE heads at neutral,
// then one head through four expressions. KIT-FACE-CAST shows every PEOPLE entry with its `head.look` (people.ts, approved
// 2 Nov 2026) and the closed-mouth strip. KIT-PROFILE-DETAIL shows every PEOPLE profile head plain and with `HeadStyle.sideDetail`
// (right, right detailed, left detailed); KIT-PROFILE-DETAIL-MID the same on four figures at a mid-shot size. Own entry:
//   printf 'KIT-FACE-LOOKS 0 out/face-looks/KIT-FACE-LOOKS.png\nKIT-FACE-CAST 0 out/face-looks/KIT-FACE-CAST.png\n' \
//     | node scripts/stills.mjs src/painted/kit/face-looks-sheet.tsx
import {createElement, Fragment, type CSSProperties} from 'react';
import {AbsoluteFill, Composition, registerRoot} from 'remotion';
import {BrushCanvas} from '../BrushCanvas';
import {EXPRESSIONS, type ExpressionId} from './expressions';
import {drawFigure} from './cast';
import {blinking, paintHeadFront, paintHeadSide, type FaceLook} from './head';
import {makePainter} from './painter';
import {PEOPLE, PERSON_IDS, type PersonId} from './people';

const h = createElement;
const W = 1500, H = 1560;

const LOOKS: {name: string; note: string; look: FaceLook}[] = [
  {name: 'A · almond', note: 'almond + lash line, hook nose, arched brow', look: {eye: 'almond', nose: 'hook', brow: 'arch', browDrop: 0.06}},
  {name: 'B · lidded', note: 'lid crease, bridge-shadow nose, tapered brow', look: {eye: 'lidded', nose: 'ell', brow: 'tapered', browDrop: 0.07}},
  {name: 'C · hooded', note: 'heavy lid + wing, nostrils, thick brow', look: {eye: 'hooded', nose: 'nostrils', brow: 'thick', browDrop: 0.08}},
];
const ROWS: PersonId[] = ['woman-ponytail', 'man-parted', 'boy-school'];
const STRIP: ExpressionId[] = ['happy', 'angry', 'surprised', 'sad'];
const STRIP_PERSON: PersonId = 'woman-curly';

const openT = (seed: number) => [0.4, 0.9, 1.4, 1.9, 2.4].find((t) => !blinking(t, seed)) ?? 0.4;
const colX = (c: number) => (W / LOOKS.length) * (c + 0.5);

const Sheet = () => (
  <AbsoluteFill style={{background: '#f4efe4'}}>
    <BrushCanvas paint={({brush}) => {
      const p = makePainter(brush, {t: 0, frame: 0});
      LOOKS.forEach(({look}, c) => {
        ROWS.forEach((id, r) => {
          const seed = 500 + r * 10, head = {...PEOPLE[id].head, look};
          paintHeadFront(p, seed, colX(c), 300 + r * 340, 100, EXPRESSIONS.neutral, head, openT(seed));
        });
        STRIP.forEach((e, i) => {
          const seed = 600 + i, head = {...PEOPLE[STRIP_PERSON].head, look};
          paintHeadFront(p, seed, colX(c) + (i - 1.5) * 122, 1360, 38, EXPRESSIONS[e], head, openT(seed));
        });
      });
    }} />
    {LOOKS.map(({name, note}, c) => (
      <div key={name} style={{position: 'absolute', left: (W / LOOKS.length) * c, top: 28, width: W / LOOKS.length, textAlign: 'center', fontFamily: 'Noto Sans Thai, sans-serif', color: '#2b211c'}}>
        <div style={{fontSize: 40, fontWeight: 700}}>{name}</div>
        <div style={{fontSize: 22, color: '#5a4e45'}}>{note}</div>
      </div>
    ))}
    <div style={{position: 'absolute', left: 0, top: 1466, width: W, textAlign: 'center', fontFamily: 'Noto Sans Thai, sans-serif', fontSize: 22, color: '#5a4e45'}}>
      {`rows: ${ROWS.join(' · ')} (neutral) · strip: ${STRIP_PERSON} ${STRIP.join(' / ')}`}
    </div>
  </AbsoluteFill>
);

const lookTag = (l?: FaceLook) => !l ? '' : `${l.eye} · ${l.nose} · ${l.brow} · ${l.mouth}`;

const CW = 2200, CH = 1380, COLS = 7, CK = 78;
const PONY_LOOK = PEOPLE['woman-ponytail'].head.look as FaceLook;
const MOUTHS: NonNullable<FaceLook['mouth']>[] = ['line', 'lip', 'full', 'thin'];
const cellX = (i: number) => (CW / COLS) * ((i % COLS) + 0.5);
const cellY = (i: number) => 200 + Math.floor(i / COLS) * 400;

const Cast = () => (
  <AbsoluteFill style={{background: '#f4efe4'}}>
    <BrushCanvas paint={({brush}) => {
      const p = makePainter(brush, {t: 0, frame: 0});
      PERSON_IDS.forEach((id, i) => {
        const seed = 700 + i;
        paintHeadFront(p, seed, cellX(i), cellY(i), CK, EXPRESSIONS.neutral, PEOPLE[id].head, openT(seed));
      });
      MOUTHS.forEach((mouth, i) => {
        const seed = 800 + i, x = (CW / (MOUTHS.length + 1)) * (i + 1);
        paintHeadFront(p, seed, x, 1100, CK, EXPRESSIONS.neutral, {...PEOPLE['woman-ponytail'].head, look: {...PONY_LOOK, mouth}}, openT(seed));
      });
    }} />
    {PERSON_IDS.map((id, i) => (
      <Fragment key={id}>
        <div style={{...cap, left: cellX(i) - CW / COLS / 2, top: cellY(i) - 175, fontSize: 24, fontWeight: 700}}>{id}</div>
        <div style={{...cap, left: cellX(i) - CW / COLS / 2, top: cellY(i) + 150, fontSize: 18}}>{lookTag(PEOPLE[id].head.look)}</div>
      </Fragment>
    ))}
    <div style={{...cap, left: 0, width: CW, top: 900, fontSize: 30, fontWeight: 700}}>mouth (closed): line · lip · full · thin</div>
    {MOUTHS.map((m, i) => <div key={m} style={{...cap, left: (CW / (MOUTHS.length + 1)) * (i + 1) - CW / COLS / 2, top: 1230, fontSize: 22}}>{m}</div>)}
  </AbsoluteFill>
);
const cap: CSSProperties = {position: 'absolute', width: CW / COLS, textAlign: 'center', fontFamily: 'Noto Sans Thai, sans-serif', color: '#2b211c'};

// KIT-PROFILE-DETAIL: per person, the plain right profile, then right and left with `sideDetail` (neutral; the bottom strip is
// man-parted and woman-bob through four expressions, detailed). KIT-PROFILE-DETAIL-MID: four people, plain then detailed, right view.
const PW = 2240, PH = 1560, PCOLS = 4, PK = 66, PCELL = PW / PCOLS;
const pX = (i: number) => PCELL * ((i % PCOLS) + 0.5), pY = (i: number) => 190 + Math.floor(i / PCOLS) * 290;
const PSTRIP: {id: PersonId; e: ExpressionId}[] = (['man-parted', 'woman-bob'] as PersonId[]).flatMap((id) => (['happy', 'angry', 'surprised', 'sad'] as ExpressionId[]).map((e) => ({id, e})));
const Profile = () => (
  <AbsoluteFill style={{background: '#f4efe4'}}>
    <BrushCanvas paint={({brush}) => {
      const p = makePainter(brush, {t: 0, frame: 0});
      PERSON_IDS.forEach((id, i) => {
        const seed = 900 + i * 3, head = PEOPLE[id].head;
        paintHeadSide(p, seed, pX(i) - 175, pY(i), PK, EXPRESSIONS.neutral, {...head, sideDetail: false}, 1, openT(seed));
        paintHeadSide(p, seed, pX(i), pY(i), PK, EXPRESSIONS.neutral, {...head, sideDetail: true}, 1, openT(seed));
        paintHeadSide(p, seed + 1, pX(i) + 175, pY(i), PK, EXPRESSIONS.neutral, {...head, sideDetail: true}, -1, openT(seed + 1));
      });
      PSTRIP.forEach(({id, e}, i) => {
        const seed = 960 + i;
        paintHeadSide(p, seed, (PW / PSTRIP.length) * (i + 0.5), 1400, PK * 0.9, EXPRESSIONS[e], {...PEOPLE[id].head, sideDetail: true}, 1, openT(seed));
      });
    }} />
    <div style={{...cap, left: 0, width: PW, top: 14, fontSize: 30, fontWeight: 700}}>profile head: plain right · sideDetail right · sideDetail left</div>
    {PERSON_IDS.map((id, i) => <div key={id} style={{...cap, width: PCELL, left: pX(i) - PCELL / 2, top: pY(i) + 135, fontSize: 22, fontWeight: 700}}>{id}</div>)}
    <div style={{...cap, left: 0, width: PW, top: 1250, fontSize: 22}}>{`sideDetail: ${PSTRIP.map(({id, e}) => `${id.split('-')[1]} ${e}`).join(' · ')}`}</div>
  </AbsoluteFill>
);
const MID: PersonId[] = ['woman-bob', 'man-parted', 'woman-long', 'boy-school'];
const MW = 2400, MH = 1000, MUNIT = 500;
const ProfileMid = () => (
  <AbsoluteFill style={{background: '#f4efe4'}}>
    <BrushCanvas paint={({brush}) => {
      const p = makePainter(brush, {t: 0, frame: 0});
      MID.forEach((id, i) => [false, true].forEach((on, k) => {
        const def = PEOPLE[id], x = (MW / 8) * (i * 2 + k + 0.5);
        drawFigure(p, {...def, head: {...def.head, sideDetail: on}}, [x, MH + 0.75 * MUNIT], MUNIT, {view: 'right', face: EXPRESSIONS.neutral}, openT(def.seed + 1), def.seed);
      }));
    }} />
    {MID.map((id, i) => <div key={id} style={{...cap, width: MW / 4, left: (MW / 4) * i, top: 14, fontSize: 24, fontWeight: 700}}>{`${id}: plain · sideDetail`}</div>)}
  </AbsoluteFill>
);

registerRoot(() => h(Fragment, null, h(Composition, {id: 'KIT-FACE-LOOKS', component: Sheet, width: W, height: H, fps: 30, durationInFrames: 30}),
  h(Composition, {id: 'KIT-FACE-CAST', component: Cast, width: CW, height: CH, fps: 30, durationInFrames: 30}),
  h(Composition, {id: 'KIT-PROFILE-DETAIL', component: Profile, width: PW, height: PH, fps: 30, durationInFrames: 30}),
  h(Composition, {id: 'KIT-PROFILE-DETAIL-MID', component: ProfileMid, width: MW, height: MH, fps: 30, durationInFrames: 30})));
