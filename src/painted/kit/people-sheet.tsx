// People model sheets: one still per PEOPLE entry (front / left / right full body, a front face row and a profile face row of
// emotions), a lineup of everyone at true relative height, KIT-EXPRESSIONS (every expression preset on an adult, a child and an
// elder head, front and profile) and KIT-WARDROBE (every outfit, front and profile). Own entry (kept out of src/Root.tsx), like catalog.tsx:
//   node scripts/painted-kit/people.mjs --out=out/kit-people [--only=<id,id>]   -> out/kit-people/KIT-PEOPLE-LINEUP.png, KIT-PERSON-<id>.png,
//   KIT-EXPRESSIONS.png, KIT-WARDROBE.png   (`--only=KIT-WARDROBE,KIT-EXPRESSIONS` renders just those two)
import {createElement, Fragment, type CSSProperties} from 'react';
import {AbsoluteFill, Composition, registerRoot} from 'remotion';
import {BrushCanvas} from '../BrushCanvas';
import {drawFigure, type CastDef, type FigPose} from './cast';
import {EXPRESSIONS, EXPRESSION_IDS, EXPRESSION_INFO, type ExpressionId} from './expressions';
import {blinking, paintHeadFront, paintHeadSide, type FaceState} from './head';
import {makePainter, type Painter, type Pt} from './painter';
import {PEOPLE, PEOPLE_INFO, PERSON_IDS, type PersonId} from './people';
import {poseArms} from './poses';
import {inkLine} from './draw';
import {OUTFIT_IDS, WARDROBE_INFO, dress, tintHoodie, type OutfitId} from './wardrobe';

const h = createElement;
const LINEUP_W = 2400, LINEUP_H = 1120;
const SHEET_W = 1600, SHEET_H = 1280;

/** The nine expressions of a person sheet's face rows (ids of `expressions.ts`); KIT-EXPRESSIONS shows all of them. */
const SHEET_FACES: ExpressionId[] = ['neutral', 'happy', 'sad', 'angry', 'surprised', 'scared', 'worried', 'talk', 'asleep'];
const FACES: {name: string; face: FaceState}[] = SHEET_FACES.map((name) => ({name, face: EXPRESSIONS[name]}));

/** A plate time at which the head's periodic blink is open, so a still shows the face and not a blink. */
const openT = (seed: number) => [0.4, 0.9, 1.4, 1.9, 2.4].find((t) => !blinking(t, seed)) ?? 0.4;

const label: CSSProperties = {position: 'absolute', fontFamily: 'Noto Sans Thai, sans-serif', color: '#2b211c'};
const Text = ({x, y, w, size, weight = 400, color, align = 'left', children}: {x: number; y: number; w: number; size: number; weight?: number; color?: string; align?: 'left' | 'center'; children: string}) => (
  <div style={{...label, left: x, top: y, width: w, fontSize: size, fontWeight: weight, lineHeight: 1.2, color: color ?? '#2b211c', textAlign: align}}>{children}</div>
);

/** px per metre of a sheet's bodies: every figure about 590 px tall. */
const bodyUnit = (height: number) => 590 / height;

const hLine = (p: Painter, id: number, x0: number, x1: number, y: number, color = '#2b211c') => inkLine(p, id, [[x0, y], [x1, y]], {closed: false, weight: 0.7, curve: 0, color, still: true});

/** P01 idle arms down (pose sheet, front standing) with the face of the sheet; profile views hang their arms (rig default). */
const bodyPose = (id: PersonId, view: FigPose['view'], g: Pt, unit: number, face: FaceState): FigPose =>
  view === 'front' ? {view, face, ...poseArms('P01', PEOPLE[id], g, unit)} : {view, face};

const sheetPaint = (id: PersonId) => ({brush}: {brush: Parameters<typeof makePainter>[0]}) => {
  const def = PEOPLE[id];
  const p = makePainter(brush, {t: 0, frame: 0});
  const unit = bodyUnit(def.height), ground = 735;
  const views: FigPose['view'][] = ['front', 'left', 'right'];
  views.forEach((view, i) => {
    const g: Pt = [SHEET_W / 6 + (i * SHEET_W) / 3, ground];
    drawFigure(p, def, g, unit, bodyPose(id, view, g, unit, FACES[0].face), openT(def.seed + 1 + i * 3), def.seed + i * 3);
  });
  // Height ruler: the figure's own height and 1 m, so the sheet carries the scale.
  hLine(p, 9100, 40, SHEET_W - 40, ground + 6);
  for (const m of [1, def.height]) hLine(p, 9101 + Math.round(m * 10), 40, 140, ground - m * unit, '#9a8f84');
  const K = 62;
  FACES.forEach(({face}, i) => {
    const cx = (SHEET_W / FACES.length) * (i + 0.5);
    const sf = 400 + i, ss = 420 + i;
    paintHeadFront(p, sf, cx, 905, K, face, def.head, openT(sf));
    paintHeadSide(p, ss, cx, 1105, K, face, def.head, i % 2 ? -1 : 1, openT(ss));
  });
};

const Sheet = ({id}: {id: PersonId}) => {
  const def = PEOPLE[id], info = PEOPLE_INFO[id];
  const unit = bodyUnit(def.height), ground = 735;
  return (
    <AbsoluteFill>
      <BrushCanvas paint={({brush}) => sheetPaint(id)({brush})} />
      <Text x={36} y={22} w={900} size={44} weight={700}>{id}</Text>
      <Text x={36} y={80} w={1500} size={21} color="#4a3f38">{info.description}</Text>
      <Text x={SHEET_W - 560} y={30} w={524} size={22} color="#4a3f38" align="left">{`${info.group} · ${info.gender} · age ~${info.age} · ${def.height.toFixed(2)} m · cut ${def.head.cut}`}</Text>
      {['front · P01 idle arms down', 'left (head left)', 'right (head right)'].map((t, i) => <Text key={t} x={(i * SHEET_W) / 3} y={ground + 12} w={SHEET_W / 3} size={20} align="center">{t}</Text>)}
      <Text x={44} y={ground - def.height * unit - 20} w={100} size={15} color="#7a6f64">{`${def.height.toFixed(2)} m`}</Text>
      <Text x={44} y={ground - unit - 20} w={100} size={15} color="#7a6f64">1.00 m</Text>
      <Text x={36} y={786} w={400} size={22} weight={700}>face row, front head</Text>
      <Text x={36} y={986} w={900} size={22} weight={700}>face row, profile head (alternating left / right)</Text>
      {FACES.map(({name}, i) => <Text key={name} x={(SHEET_W / FACES.length) * i} y={1196} w={SHEET_W / FACES.length} size={19} align="center">{name}</Text>)}
    </AbsoluteFill>
  );
};

const Lineup = () => {
  const unit = 410, ground = 985;
  const n = PERSON_IDS.length, step = (LINEUP_W - 160) / n;
  return (
    <AbsoluteFill>
      <BrushCanvas paint={({brush}) => {
        const p = makePainter(brush, {t: 0, frame: 0});
        for (const m of [0.5, 1, 1.5, 2]) hLine(p, 9200 + m * 10, 70, LINEUP_W - 40, ground - m * unit, '#b9ad9d');
        hLine(p, 9190, 40, LINEUP_W - 40, ground + 4);
        PERSON_IDS.forEach((id, i) => {
          const g: Pt = [100 + step * (i + 0.5), ground];
          drawFigure(p, PEOPLE[id], g, unit, bodyPose(id, 'front', g, unit, FACES[0].face), openT(PEOPLE[id].seed + 1), PEOPLE[id].seed);
        });
      }} />
      <Text x={36} y={22} w={1600} size={44} weight={700}>src/painted/kit/people.ts: lineup at true relative height</Text>
      <Text x={36} y={80} w={2200} size={21} color="#4a3f38">{`${n} template characters, front view, pose P01 idle arms down, ${unit} px per metre. Rules at 0.5 m steps. Pick by id from PEOPLE / PEOPLE_INFO; model sheets are KIT-PERSON-<id>.`}</Text>
      {[0.5, 1, 1.5, 2].map((m) => <Text key={m} x={16} y={ground - m * unit - 24} w={60} size={17} color="#7a6f64">{`${m} m`}</Text>)}
      {PERSON_IDS.map((id, i) => (
        <Fragment key={id}>
          <Text x={100 + step * i} y={ground + 14} w={step} size={20} weight={700} align="center">{id}</Text>
          <Text x={100 + step * i} y={ground + 42} w={step} size={16} color="#4a3f38" align="center">{`${PEOPLE[id].height.toFixed(2)} m · ${PEOPLE_INFO[id].gender === 'male' ? 'M' : 'F'} ~${PEOPLE_INFO[id].age}`}</Text>
        </Fragment>
      ))}
    </AbsoluteFill>
  );
};


// ------------------------------------------------------------------------------------------------ KIT-EXPRESSIONS
const EXPR_W = 2150, EXPR_H = 2400;
const EXPR_CELL = 200, EXPR_ROW = 170, EXPR_K = 56, EXPR_X0 = 150;
/** One adult, one child and one elder head (front and profile), so the presets are judged across ages and hair. */
const EXPR_WHO: {id: PersonId; role: string}[] = [{id: 'man-parted', role: 'adult'}, {id: 'girl-school', role: 'child'}, {id: 'man-elder', role: 'elder'}];
const EXPR_BLOCKS: ExpressionId[][] = [EXPRESSION_IDS.slice(0, 10), EXPRESSION_IDS.slice(10)];
const exprBlockY = (b: number) => 110 + b * 1130;

const Expressions = () => (
  <AbsoluteFill>
    <BrushCanvas paint={({brush}) => {
      const p = makePainter(brush, {t: 0, frame: 0});
      EXPR_BLOCKS.forEach((ids, b) => {
        ids.forEach((eid, c) => {
          const cx = EXPR_X0 + EXPR_CELL * (c + 0.5);
          EXPR_WHO.forEach(({id}, w) => {
            const head = PEOPLE[id].head, base = 3000 + b * 400 + c * 20 + w * 2;
            paintHeadFront(p, base, cx, exprBlockY(b) + 105 + w * 2 * EXPR_ROW, EXPR_K, EXPRESSIONS[eid], head, openT(base));
            paintHeadSide(p, base + 1, cx, exprBlockY(b) + 105 + (w * 2 + 1) * EXPR_ROW, EXPR_K, EXPRESSIONS[eid], head, 1, openT(base + 1));
          });
        });
      });
    }} />
    <Text x={36} y={18} w={2000} size={40} weight={700}>src/painted/kit/expressions.ts: EXPRESSIONS presets</Text>
    <Text x={36} y={66} w={2100} size={20} color="#4a3f38">{`${EXPRESSION_IDS.length} named FaceState presets on an adult (man-parted), a child (girl-school) and an elder (man-elder); front head, then profile head, per row pair. Use: drawFigure(..., {view, face: EXPRESSIONS.smug}, t).`}</Text>
    {EXPR_BLOCKS.map((ids, b) => (
      <Fragment key={b}>
        {ids.map((eid, c) => (
          <Fragment key={eid}>
            <Text x={EXPR_X0 + EXPR_CELL * c} y={exprBlockY(b) - 8} w={EXPR_CELL} size={24} weight={700} align="center">{eid}</Text>
            <Text x={EXPR_X0 + EXPR_CELL * c + 6} y={exprBlockY(b) + 6 * EXPR_ROW + 8} w={EXPR_CELL - 12} size={13} color="#4a3f38" align="center">{EXPRESSION_INFO[eid].description}</Text>
          </Fragment>
        ))}
        {EXPR_WHO.map(({id, role}, w) => (
          <Fragment key={id}>
            <Text x={16} y={exprBlockY(b) + 40 + w * 2 * EXPR_ROW} w={130} size={19} weight={700}>{role}</Text>
            <Text x={16} y={exprBlockY(b) + 66 + w * 2 * EXPR_ROW} w={130} size={14} color="#7a6f64">{`${id}, front`}</Text>
            <Text x={16} y={exprBlockY(b) + 40 + (w * 2 + 1) * EXPR_ROW} w={130} size={19} weight={700}>{role}</Text>
            <Text x={16} y={exprBlockY(b) + 66 + (w * 2 + 1) * EXPR_ROW} w={130} size={14} color="#7a6f64">profile</Text>
          </Fragment>
        ))}
      </Fragment>
    ))}
  </AbsoluteFill>
);

// ------------------------------------------------------------------------------------------------ KIT-WARDROBE
const WARD_COLS = 5, WARD_CELL_W = 620, WARD_CELL_H = 760, WARD_W = WARD_COLS * WARD_CELL_W, WARD_H = 130 + Math.ceil(OUTFIT_IDS.length / WARD_COLS) * WARD_CELL_H;
const WARD_UNIT = 290, WARD_GROUND = 645;
/** Who wears each outfit on the sheet (any PEOPLE adult fits) and, for the school uniforms, the child who wears it too. */
const WARD_WHO: Record<OutfitId, {adult: PersonId; child?: PersonId}> = {
  'student-th-trousers': {adult: 'man-spiky', child: 'boy-school'},
  'student-th-skirt': {adult: 'woman-ponytail', child: 'girl-school'},
  'school-jp-sailor': {adult: 'woman-pixie', child: 'girl-school'},
  'school-jp-gakuran': {adult: 'man-crop', child: 'boy-school'},
  office: {adult: 'man-parted'}, police: {adult: 'man-buzz'}, nurse: {adult: 'woman-ponytail'}, doctor: {adult: 'woman-pixie'},
  monk: {adult: 'man-crop'}, vendor: {adult: 'woman-curly'}, rider: {adult: 'man-spiky'}, hoodie: {adult: 'woman-pixie'},
  guard: {adult: 'man-elder'}, yukata: {adult: 'woman-ponytail'}, kimono: {adult: 'woman-curly'}, 'kitchen-apron': {adult: 'woman-curly'}, 'park-casual': {adult: 'man-crop'}, 'eva-suit': {adult: 'woman-bob'}, 'home-lounge': {adult: 'woman-curly'},
};
const wardCell = (i: number) => ({x: (i % WARD_COLS) * WARD_CELL_W, y: 130 + Math.floor(i / WARD_COLS) * WARD_CELL_H});

const Wardrobe = () => (
  <AbsoluteFill>
    <BrushCanvas paint={({brush}) => {
      const p = makePainter(brush, {t: 0, frame: 0});
      OUTFIT_IDS.forEach((oid, i) => {
        const {x, y} = wardCell(i), who = WARD_WHO[oid], ground = y + WARD_GROUND;
        hLine(p, 9300 + i, x + 20, x + WARD_CELL_W - 20, ground + 6, '#b9ad9d');
        const figs: {def: CastDef; view: FigPose['view']; cx: number}[] = [
          {def: dress(PEOPLE[who.adult], oid), view: 'front', cx: x + (who.child ? 120 : 160)},
          {def: dress(PEOPLE[who.adult], oid), view: 'right', cx: x + (who.child ? 300 : 420)},
        ];
        if (who.child) figs.push({def: dress(PEOPLE[who.child], oid), view: 'front', cx: x + 490});
        figs.forEach(({def, view, cx}, f) => {
          const g: Pt = [cx, ground], pose: FigPose = view === 'front' ? {view, face: EXPRESSIONS.neutral, ...poseArms('P01', def, g, WARD_UNIT)} : {view, face: EXPRESSIONS.neutral};
          const seed = 5000 + i * 10 + f;
          drawFigure(p, def, g, WARD_UNIT, pose, openT(seed), seed);
        });
      });
    }} />
    <Text x={36} y={18} w={2600} size={40} weight={700}>src/painted/kit/wardrobe.ts: WARDROBE outfits</Text>
    <Text x={36} y={66} w={3000} size={20} color="#4a3f38">{`${OUTFIT_IDS.length} outfits, front (P01 idle arms down) and right profile on a PEOPLE adult, ${WARD_UNIT} px per metre; school uniforms also on a child. Use: dress(PEOPLE['woman-pixie'], 'nurse') returns a new CastDef (same height, build and head; the monk's head is shaved).`}</Text>
    {OUTFIT_IDS.map((oid, i) => {
      const {x, y} = wardCell(i), who = WARD_WHO[oid];
      return (
        <Fragment key={oid}>
          <Text x={x + 20} y={y - 2} w={WARD_CELL_W - 40} size={28} weight={700}>{oid}</Text>
          <Text x={x + 20} y={y + 32} w={WARD_CELL_W - 40} size={14} color="#4a3f38">{WARDROBE_INFO[oid].description}</Text>
          <Text x={x + 20} y={y + WARD_GROUND + 14} w={WARD_CELL_W - 40} size={15} color="#7a6f64">{`${who.adult}${who.child ? ` + ${who.child}` : ''} · ${WARDROBE_INFO[oid].group}`}</Text>
        </Fragment>
      );
    })}
  </AbsoluteFill>
);

// ------------------------------------------------------------------------------------------------ KIT-BACK
// Back view (`FigPose.view: 'back'`, `back.ts`) and the hood-up state (`FigPose.hoodUp`). Top row: woman-bob + hoodie in the coral override
// (`tintHoodie`), hood down and hood up, seen from back, front and right profile. Bottom rows: every PEOPLE entry from behind (P01).
const BACK_UNIT = 270, BACK_W = 2400, BACK_H = 1560;
const BackSheet = () => (
  <AbsoluteFill>
    <BrushCanvas paint={({brush}) => {
      const p = makePainter(brush, {t: 0, frame: 0});
      const coral = tintHoodie(dress(PEOPLE['woman-bob'], 'hoodie'));
      const g0 = 590;
      const cells: {view: FigPose['view']; up: boolean}[] = [
        {view: 'back', up: false}, {view: 'back', up: true}, {view: 'front', up: false}, {view: 'front', up: true}, {view: 'right', up: false}, {view: 'right', up: true},
      ];
      hLine(p, 9400, 30, BACK_W - 30, g0 + 6, '#b9ad9d');
      cells.forEach(({view, up}, i) => {
        const g: Pt = [200 + i * 400, g0], pose: FigPose = {view, hoodUp: up, face: EXPRESSIONS.neutral, ...(view === 'right' ? {} : poseArms('P01', coral, g, BACK_UNIT))};
        drawFigure(p, coral, g, BACK_UNIT, pose, openT(830 + i), 830 + i);
      });
      const ids = PERSON_IDS;
      const per = 7, u2 = 215;
      ids.forEach((id, i) => {
        const row = Math.floor(i / per), col = i % per, def = PEOPLE[id], g: Pt = [170 + col * 335, 1030 + row * 420];
        if (col === 0) hLine(p, 9410 + row, 30, BACK_W - 30, g[1] + 6, '#b9ad9d');
        drawFigure(p, def, g, u2, {view: 'back', face: EXPRESSIONS.neutral, ...poseArms('P01', def, g, u2) }, 0, def.seed);
      });
    }} />
    <Text x={36} y={14} w={2300} size={36} weight={700}>src/painted/kit/back.ts: back view and hood-up (woman-bob + hoodie, tintHoodie coral)</Text>
    <Text x={36} y={58} w={2300} size={18} color="#4a3f38">back hood down | back hood up | front hood down | front hood up | right hood down | right hood up. Below: every PEOPLE entry from behind (FigPose.view 'back', P01 mirrored).</Text>
    {PERSON_IDS.map((id, i) => <Text key={id} x={170 + (i % 7) * 335 - 150} y={1030 + Math.floor(i / 7) * 420 + 12} w={300} size={16} color="#7a6f64" align="center">{id}</Text>)}
  </AbsoluteFill>
);

registerRoot(() => h(Fragment, null,
  h(Composition, {id: 'KIT-PEOPLE-LINEUP', component: Lineup, width: LINEUP_W, height: LINEUP_H, fps: 30, durationInFrames: 30}),
  ...PERSON_IDS.map((id) => h(Composition, {key: id, id: `KIT-PERSON-${id}`, component: () => <Sheet id={id} />, width: SHEET_W, height: SHEET_H, fps: 30, durationInFrames: 30})),
  h(Composition, {id: 'KIT-EXPRESSIONS', component: Expressions, width: EXPR_W, height: EXPR_H, fps: 30, durationInFrames: 30}),
  h(Composition, {id: 'KIT-BACK', component: BackSheet, width: BACK_W, height: BACK_H, fps: 30, durationInFrames: 30}),
  h(Composition, {id: 'KIT-WARDROBE', component: Wardrobe, width: WARD_W, height: WARD_H, fps: 30, durationInFrames: 30}),
));
