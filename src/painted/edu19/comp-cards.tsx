// EDU-EP19-SHORT comp cards (W2.4 "Comp cards before look frames", user request 15 Nov 2026): model sheets of the cast, the dog with its
// harness and the props / set pieces, drawn with the kit rig and the episode painters, before any look frame (W3). Own entry:
//   printf 'EDU19-CC-GIRL 0 out/edu19-cc/EDU19-CC-GIRL.png\nEDU19-CC-MUM-YOU 0 out/edu19-cc/EDU19-CC-MUM-YOU.png\nEDU19-CC-DOG 0 out/edu19-cc/EDU19-CC-DOG.png\nEDU19-CC-PROPS 0 out/edu19-cc/EDU19-CC-PROPS.png\n' \
//     | node scripts/stills.mjs src/painted/edu19/comp-cards.tsx
// Inputs: EDU-EP19-BRIEF-R1 (VD02-VD04, VD08, N1-N9), EDU-EP19-SHEETS-R1 (casting lines). Sheets only: no plate, set or shot is painted here.
import {createElement, Fragment, type CSSProperties, type ReactNode} from 'react';
import {AbsoluteFill, Composition, registerRoot} from 'remotion';
import {BrushCanvas} from '../BrushCanvas';
import {animalMotion, type AnimalMotionId} from '../kit/animal-motions';
import {drawAnimal, type AnimalAnchors, type AnimalPose} from '../kit/animals';
import {drawFigure, type CastDef, type FigPose} from '../kit/cast';
import {inkLine, rectPts, solid} from '../kit/draw';
import {EXPRESSIONS, type ExpressionId} from '../kit/expressions';
import {blinking} from '../kit/head';
import {makePainter, type Painter, type Pt} from '../kit/painter';
import {poseArms, poseFor, type AnyPoseId, type View} from '../kit/poses';
import {paintLongLine, paintStopwatch, stopwatchText} from '../kit/props';
import {DOG, GIRL, HARNESS, MUM, STOPWATCH_R, YOU} from './cast';
import {FENCE, paintFence, paintSwing, paintTree, SWING, TREE} from './field';
import {GLOW_COLOR, PrintGlow} from './glow';
import {MAT, MAT_COLORS, ORDER_O1, ORDER_O2, paintMatRow, paintMatStack, paintMatTop, type MatColor} from './mats';
import {GRASS, paintPrint, PRINT, ROUND1_LEVELS} from './trail';

const h = createElement;
const PAPER = '#f4efe4';
const openT = (seed: number) => [0.4, 0.9, 1.4, 1.9, 2.4].find((t) => !blinking(t, seed)) ?? 0.4;
const cap: CSSProperties = {position: 'absolute', fontFamily: 'Noto Sans Thai, sans-serif', color: '#2b211c', lineHeight: 1.2};
const T = ({x, y, w, s = 20, b = false, c, center = false, children}: {x: number; y: number; w: number; s?: number; b?: boolean; c?: string; center?: boolean; children: ReactNode}) => (
  <div style={{...cap, left: x, top: y, width: w, fontSize: s, fontWeight: b ? 700 : 400, color: c ?? '#2b211c', textAlign: center ? 'center' : 'left'}}>{children}</div>
);
const ground = (p: Painter, id: number, x0: number, x1: number, y: number) => inkLine(p, id, [[x0, y + 6], [x1, y + 6]], {closed: false, weight: 0.6, curve: 0, color: '#b9ad9d', still: true});
/** Height ruler: a tick at each named height (m) above `g`, left of the figures. */
const ruler = (p: Painter, id: number, x: number, g: number, unit: number, marks: number[]) => {
  inkLine(p, id, [[x, g], [x, g - Math.max(...marks) * unit]], {closed: false, weight: 0.6, curve: 0, color: '#8a7d6c', still: true});
  marks.forEach((m, i) => inkLine(p, id + 1 + i, [[x - 10, g - m * unit], [x + 10, g - m * unit]], {closed: false, weight: 0.6, curve: 0, color: '#8a7d6c', still: true}));
};

type Fig = {def: CastDef; x: number; view: View | 'back'; pose?: AnyPoseId; face?: ExpressionId; quarter?: 'left' | 'right'; walk?: number; label: string; occluder?: number};
const figPose = (f: Fig, g: Pt, unit: number): FigPose => {
  const face = EXPRESSIONS[f.face ?? 'neutral'];
  if (f.view === 'back') return {view: 'back', face, walk: f.walk, ...poseArms('P01', f.def, g, unit)};
  const base = poseFor(f.pose ?? 'P01', f.def, g, unit, f.view);
  return {...base, face, ...(f.quarter ? {quarter: f.quarter} : {}), ...(f.walk !== undefined ? {walk: f.walk} : {})};
};
const paintFigs = (p: Painter, figs: Fig[], gy: number, unit: number, seed0: number) =>
  figs.map((f, i) => {
    const g: Pt = [f.x, gy], seed = f.def.seed + seed0 + i;
    const a = drawFigure(p, f.def, g, unit, figPose(f, g, unit), openT(seed), seed);
    if (f.occluder !== undefined) {
      // P43 peek: the tree trunk edge painted over the figure (the kit pose draws no wall; the scene owns it).
      const ex = g[0] + f.occluder * unit;
      solid(p, 8800 + i, '#6b5a4a', rectPts(ex - 0.42 * unit, gy - 1.9 * unit, ex, gy + 6), 6, 0.12, 0.1);
      inkLine(p, 8850 + i, [[ex, gy - 1.9 * unit], [ex, gy + 6]], {closed: false, weight: 1.1, curve: 0.02});
    }
    return a;
  });

// ------------------------------------------------------------------------------------------------------------------- GIRL
const G_W = 2600, G_H = 1560, G_U = 380, G_G1 = 700, G_G2 = 1420;
const GIRL_VIEWS: Fig[] = [
  {def: GIRL, x: 260, view: 'front', face: 'happy', label: 'front · happy'},
  {def: GIRL, x: 700, view: 'front', quarter: 'left', face: 'happy', label: 'front 3/4 (quarter left)'},
  {def: GIRL, x: 1140, view: 'left', face: 'neutral', label: 'left'},
  {def: GIRL, x: 1580, view: 'right', face: 'neutral', label: 'right'},
  {def: GIRL, x: 2020, view: 'back', label: 'back'},
];
const GIRL_POSES: Fig[] = [
  {def: GIRL, x: 190, view: 'front', pose: 'P35', face: 'happy', label: 'P35 crouch_hide · happy\nB02-SH04 (hide at G1)'},
  {def: GIRL, x: 500, view: 'front', pose: 'P43', face: 'smug', occluder: 0.1, label: 'P43 peek_around · smug (= "sly")\nB01-SH03, B03 peek'},
  {def: GIRL, x: 810, view: 'front', pose: 'P12', face: 'shock', label: 'P12 surprise_cover_mouth · shock\nB02 setback'},
  {def: GIRL, x: 1120, view: 'front', pose: 'P08', face: 'laugh', label: 'P08 celebrate_V · laugh (= "gleeful")\nB04 win'},
  {def: GIRL, x: 1430, view: 'right', pose: 'P38', face: 'happy', label: 'P38 run (right) · happy\ndash to the tree, mat hops'},
  {def: GIRL, x: 1760, view: 'front', pose: 'P33', face: 'laugh', label: 'P33 sit_floor_hug_knees · laugh\nlick fall-back (B02, "without the hug")'},
  {def: GIRL, x: 2080, view: 'front', pose: 'P27', face: 'smug', label: 'P27 count_fingers · smug\none-finger idea candidate (N9)'},
];
const GirlCard = () => (
  <AbsoluteFill style={{background: PAPER}}>
    <BrushCanvas paint={({brush}) => {
      const p = makePainter(brush, {t: 0, frame: 0});
      ground(p, 9001, 40, G_W - 40, G_G1); ground(p, 9002, 40, G_W - 40, G_G2);
      ruler(p, 9010, 2380, G_G1, G_U, [0.5, 1.0, 1.34]);
      paintFigs(p, GIRL_VIEWS, G_G1, G_U, 0);
      paintFigs(p, GIRL_POSES, G_G2, G_U, 20);
    }} />
    <T x={30} y={14} w={2500} s={34} b>EDU19-CC-GIRL · GIRL = girl-school + park-casual (cap off, tee #e0654f) · 1.34 m · EDU-EP19-SHEETS-R1</T>
    <T x={30} y={58} w={2500} s={18} c="#4a3f38">Row 1: views (P01). Row 2: the casting-line poses with the sheet expression. Kit: PEOPLE girl-school, WARDROBE park-casual, poseFor(). 380 px/m; ruler 0.5 / 1.0 / 1.34 m.</T>
    {GIRL_VIEWS.map((f) => <T key={f.label} x={f.x - 200} y={G_G1 + 18} w={400} s={20} b center>{f.label}</T>)}
    {GIRL_POSES.map((f) => <T key={f.label} x={f.x - 150} y={G_G2 + 16} w={300} s={15} center>{f.label.split('\n').map((l, i) => <div key={i} style={{fontWeight: i ? 400 : 700}}>{l}</div>)}</T>)}
    <div style={{...cap, left: 2250, top: G_G2 - 520, width: 320, height: 500, border: '3px dashed #b8483c', borderRadius: 10}} />
    <T x={2265} y={G_G2 - 470} w={290} s={20} b c="#b8483c">new: crouch-sniff</T>
    <T x={2265} y={G_G2 - 430} w={290} s={16} c="#5a2a24">missing (N9, B02-SH07 V03): on hands and knees, nose 5 cm over her print, front 3/4. No kit pose: P34 kneel / P35 crouch do not put the hands on the ground. Build in kit poses-more.ts before W3 LF for that shot.</T>
  </AbsoluteFill>
);

// --------------------------------------------------------------------------------------------------------------- MUM + YOU
const M_W = 2600, M_H = 1600, M_U = 330, M_G1 = 680, M_G2 = 1440;
const MUM_VIEWS: Fig[] = [
  {def: MUM, x: 230, view: 'front', face: 'neutral', label: 'front'},
  {def: MUM, x: 620, view: 'front', quarter: 'left', face: 'happy', label: 'front 3/4'},
  {def: MUM, x: 1010, view: 'left', label: 'left'},
  {def: MUM, x: 1400, view: 'right', label: 'right'},
  {def: MUM, x: 1790, view: 'back', label: 'back'},
];
const SW_C: Pt = [2280, 330], SW_R = 120;
const YOU_FIGS: Fig[] = [
  {def: YOU, x: 1180, view: 'back', label: 'YOU back · stand'},
  {def: YOU, x: 1460, view: 'back', walk: 0.0, label: 'back · walk 0.0'},
  {def: YOU, x: 1740, view: 'back', walk: 0.25, label: 'walk 0.25'},
  {def: YOU, x: 2020, view: 'back', walk: 0.5, label: 'walk 0.5'},
];
const LINE_U = 330;
const MumCard = () => (
  <AbsoluteFill style={{background: PAPER}}>
    <BrushCanvas paint={({brush}) => {
      const p = makePainter(brush, {t: 0, frame: 0});
      ground(p, 9101, 40, M_W - 40, M_G1); ground(p, 9102, 40, M_W - 40, M_G2);
      const as = paintFigs(p, MUM_VIEWS, M_G1, M_U, 0);
      // Stopwatch on the left wrist in the front view (figure's left = screen right), at true size (0.025 m face radius).
      const a = as[0], wrist: Pt = [a.lHand[0] + (a.lUpper[0] - a.lHand[0]) * 0.2, a.lHand[1] + (a.lUpper[1] - a.lHand[1]) * 0.2];
      paintStopwatch(p, 9120, wrist, STOPWATCH_R * M_U, {angle: Math.atan2(a.lUpper[1] - a.lHand[1], a.lUpper[0] - a.lHand[0])});
      // Close-up swatch of the stopwatch with its overlay digit box.
      paintStopwatch(p, 9130, SW_C, SW_R, {angle: 0});
      // Lineup at true scale: MUM (P01, line in the left hand) - DOG in harness - GIRL; ruler 0.58 / 0.72 / 1.34 / 1.64 m.
      ruler(p, 9140, 70, M_G2, LINE_U, [0.58, 0.72, 1.34, 1.64]);
      const gm: Pt = [220, M_G2];
      const am = drawFigure(p, MUM, gm, LINE_U, {...poseFor('P01', MUM, gm, LINE_U, 'front'), face: EXPRESSIONS.happy}, openT(751), 751);
      const anc: AnimalAnchors = {};
      drawAnimal(p, DOG.seed, DOG, [560, M_G2], LINE_U, {view: 'right', state: 'stand', harness: HARNESS}, 0.3, anc);
      if (anc.ring) paintLongLine(p, 9150, am.lHand, anc.ring, {sag: 40, width: 0.008 * LINE_U + 1.5});
      drawFigure(p, GIRL, [860, M_G2], LINE_U, {...poseFor('P01', GIRL, [860, M_G2], LINE_U, 'front'), face: EXPRESSIONS.happy}, openT(791), 791);
      paintFigs(p, YOU_FIGS, M_G2, M_U * 0.96, 40);
    }} />
    <svg width={M_W} height={M_H} style={{position: 'absolute', left: 0, top: 0}}>
      <text x={SW_C[0]} y={SW_C[1] + 22} textAnchor="middle" fontFamily="monospace" fontWeight={700} fontSize={64} fill="#1e2a22">{stopwatchText(0)}</text>
      <text x={SW_C[0]} y={SW_C[1] + 200} textAnchor="middle" fontFamily="monospace" fontWeight={700} fontSize={40} fill="#1e2a22">{`→ ${stopwatchText(1200)}`}</text>
    </svg>
    <T x={30} y={14} w={2500} s={34} b>EDU19-CC-MUM-YOU · MUM = woman-ponytail + trainer-vest (new) · 1.64 m · YOU = woman-bob + hoodie · 1.58 m</T>
    <T x={30} y={58} w={2100} s={18} c="#4a3f38">Row 1: MUM views (P01); stopwatch on her left wrist (front, true size). Right: stopwatch swatch with the SVG digit overlay (stopwatchText, 00:00 → 20:00, B02-SH03 W-WAIT). Row 2: lineup at true scale (MUM P01 holding the long line to the DOG's harness ring, GIRL), then YOU from behind (L03b soi inset, B01-SH05).</T>
    {MUM_VIEWS.map((f) => <T key={f.label} x={f.x - 180} y={M_G1 + 18} w={360} s={20} b center>{f.label}</T>)}
    <T x={SW_C[0] - 200} y={SW_C[1] + 240} w={400} s={16} center>paintStopwatch (kit props.ts) · face 0.05 m · digits = SVG overlay</T>
    <T x={120} y={M_G2 + 18} w={900} s={18} b>MUM 1.64 · DOG 0.58 shoulder (0.72 head top) · GIRL 1.34 — one unit (330 px/m)</T>
    {YOU_FIGS.map((f) => <T key={f.label} x={f.x - 140} y={M_G2 + 18} w={280} s={18} b center>{f.label}</T>)}
  </AbsoluteFill>
);

// --------------------------------------------------------------------------------------------------------------------- DOG
const D_W = 2600, D_H = 1300, D_U = 280, D_G1 = 520, D_G2 = 1080;
type DogCell = {label: string; pose: AnimalPose; offset?: [number, number]; line?: boolean; note?: string};
const DOG_VIEWS: DogCell[] = [
  {label: 'right · stand', pose: {view: 'right', state: 'stand'}, line: true},
  {label: 'left · stand', pose: {view: 'left', state: 'stand'}},
  {label: 'front · stand', pose: {view: 'front', state: 'stand'}},
  {label: 'front · sit', pose: {view: 'front', state: 'sit'}},
  {label: 'right · sit', pose: {view: 'right', state: 'sit'}},
  {label: 'right · sniff', pose: {view: 'right', state: 'stand', sniff: 1}},
  {label: 'front · sniff low', pose: {view: 'front', state: 'stand', sniff: 1, headLow: true}},
];
const mo = (id: AnimalMotionId, t: number, view: 'left' | 'right' | 'front' = 'right'): {pose: AnimalPose; offset: [number, number]} => animalMotion(id, t, {animal: DOG, view});
const DOG_MOTIONS: DogCell[] = [
  {label: 'walk-in-from-left f30', ...mo('walk-in-from-left', 1.0), offset: [0, 0], note: 'kit motion'},
  {label: 'sniff-track ≈ walk + sniff', pose: {view: 'right', state: 'stand', walk: 0.3, stride: 0.5, sniff: 1}, note: 'new (N5): half-speed walk, nose sweep missing'},
  {label: 'head-tilt +14° (roll)', pose: {view: 'front', state: 'stand', roll: 14}, note: 'new (N5): pose.roll added; ear lift missing'},
  {label: 'head-tilt −14°', pose: {view: 'front', state: 'sit', roll: -14}, note: 'roll on sit'},
  {label: 'look-left-right', pose: {view: 'front', state: 'sit'}, note: 'missing (N5): front head turn'},
  {label: 'lick', pose: {view: 'left', state: 'stand', mouth: 'open'}, note: 'missing (N5): mouth open stands in'},
  {label: 'sit-down f15', ...mo('sit-down', 0.5, 'front'), note: 'kit motion, mid'},
  {label: 'happy-wag', ...mo('happy-wag', 0.2, 'right'), note: 'kit motion'},
];
const paintDogRow = (p: Painter, cells: DogCell[], gy: number, seed0: number, xOf: (i: number) => number) =>
  cells.forEach((c, i) => {
    const off = c.offset ?? [0, 0], g: Pt = [xOf(i) + off[0] * D_U, gy - off[1] * D_U], anc: AnimalAnchors = {};
    drawAnimal(p, DOG.seed + seed0 + i, DOG, g, D_U, {lid: 0, ...c.pose, harness: HARNESS}, 0.3, anc); // lid 0: eyes open on the sheet (no auto blink)
    if (c.line && anc.ring) paintLongLine(p, 9300 + i, anc.ring, [g[0] - 0.5 * D_U, gy - 0.95 * D_U], {sag: 14, width: 0.008 * D_U + 1});
  });
const DogCard = () => (
  <AbsoluteFill style={{background: PAPER}}>
    <BrushCanvas paint={({brush}) => {
      const p = makePainter(brush, {t: 0, frame: 0});
      ground(p, 9201, 40, D_W - 40, D_G1); ground(p, 9202, 40, D_W - 40, D_G2);
      paintDogRow(p, DOG_VIEWS, D_G1, 0, (i) => 230 + i * 362);
      paintDogRow(p, DOG_MOTIONS, D_G2, 20, (i) => 200 + i * 305);
      ruler(p, 9210, 2520, D_G1, D_U, [0.3, 0.58, 0.72]);
    }} />
    <T x={30} y={14} w={2500} s={34} b>EDU19-CC-DOG · dog-black-lab (0.58 m) + tracking harness #e8892f (new, kit animals.ts pose.harness) + long line</T>
    <T x={30} y={58} w={2500} s={18} c="#4a3f38">Row 1: views with the harness (girth, chest strap, back pad, steel ring = anchors.ring; line attached in the first cell). Row 2: the motions the sheets name (sampled frame). 280 px/m; ruler 0.30 / 0.58 / 0.72 m. No back view in the kit.</T>
    {DOG_VIEWS.map((c, i) => <T key={c.label} x={230 + i * 362 - 170} y={D_G1 + 16} w={340} s={20} b center>{c.label}</T>)}
    {DOG_MOTIONS.map((c, i) => (
      <T key={c.label} x={200 + i * 305 - 150} y={D_G2 + 14} w={310} s={16} center>
        <div style={{fontWeight: 700}}>{c.label}</div>
        <div style={{color: c.note?.startsWith('missing') ? '#b8483c' : '#4a3f38'}}>{c.note}</div>
      </T>
    ))}
  </AbsoluteFill>
);

// ------------------------------------------------------------------------------------------------------------------- PROPS
const P_W = 2600, P_H = 2500;
const SET_U = 62, SET_G = 640;
const ROW_U = 150, ROW_Y1 = 900, ROW_Y2 = 1090, ROW_CX = 1000;
const ST_G: Pt = [2280, 1560], ST_U = 330;
const MAT_C: Pt = [2280, 1140], MAT_U = 520;
const PR_U = 440, PR_Y = 1900, PR_X0 = 260, PR_SHADE_X = 2120;
const prX = (i: number) => PR_X0 + i * PRINT.pitch * PR_U;
const PropsCard = () => (
  <AbsoluteFill style={{background: PAPER}}>
    <BrushCanvas paint={({brush}) => {
      const p = makePainter(brush, {t: 0, frame: 0});
      // A. Set pieces at one scale (62 px/m) with GIRL and MUM for size: swing, fence with the gate gap, rain tree.
      ground(p, 9401, 40, P_W - 40, SET_G);
      paintFence(p, 9410, [1100, SET_G], SET_U, -9, 9, {gate: true});
      paintSwing(p, 9420, [330, SET_G], SET_U);
      paintTree(p, 9430, [1950, SET_G], SET_U);
      drawFigure(p, GIRL, [520, SET_G], SET_U, {...poseFor('P01', GIRL, [520, SET_G], SET_U, 'front'), face: EXPRESSIONS.happy}, 0.4, 792);
      drawFigure(p, MUM, [600, SET_G], SET_U, {...poseFor('P01', MUM, [600, SET_G], SET_U, 'front'), face: EXPRESSIONS.neutral}, 0.4, 752);
      drawAnimal(p, DOG.seed + 50, DOG, [690, SET_G], SET_U, {view: 'right', state: 'stand', harness: HARNESS}, 0.3);
      // B. Mat rows, O1 ordered and O2 shuffled (same line), 150 px/m at a low pitch; damp prints on O1.
      paintMatRow(p, 9500, [ROW_CX, ROW_Y1], ROW_U, ORDER_O1, {k: 0.32, prints: true});
      paintMatRow(p, 9800, [ROW_CX, ROW_Y2], ROW_U, ORDER_O2, {k: 0.32});
      paintMatStack(p, 10100, ST_G, ST_U);
      (['T', 'R', 'O', 'S'] as MatColor[]).forEach((c, i) => paintMatTop(p, 10200 + i * 50, [MAT_C[0] - 300 + i * 140, MAT_C[1] - 250], 220, c, {k: 0.55}));
      paintMatTop(p, 10400, MAT_C, MAT_U, 'T', {k: 0.5, print: 0.8});
      // C. Prints on lit grass, five round-1 glow levels plus one no-glow print, and one print in the tree shade.
      solid(p, 10500, GRASS.lit, rectPts(60, PR_Y - 150, 1960, PR_Y + 150), 4, 0.25, 0.2);
      solid(p, 10501, GRASS.shade, rectPts(1980, PR_Y - 150, 2540, PR_Y + 150), 4, 0.25, 0.2);
      [0, 1, 2, 3, 4, 5].forEach((i) => paintPrint(p, 10600 + i * 20, [prX(i), PR_Y + (i % 2 ? -1 : 1) * PRINT.zAlt * PR_U * 0.35], PR_U, {k: 0.35}));
      paintPrint(p, 10800, [PR_SHADE_X, PR_Y], PR_U, {k: 0.35, grass: GRASS.shade});
      paintPrint(p, 10820, [PR_SHADE_X + 260, PR_Y], PR_U, {k: 0.35, grass: GRASS.shade});
      // D. Long line swatch: a coil in the hand and a run along the ground.
      paintLongLine(p, 10900, [150, 2300], [1100, 2350], {sag: 25, width: 4, coil: 3});
    }} />
    <svg width={P_W} height={P_H} style={{position: 'absolute', left: 0, top: 0}}>
      {ROUND1_LEVELS.map((lv, i) => <PrintGlow key={i} x={prX(i)} y={PR_Y + (i % 2 ? -1 : 1) * PRINT.zAlt * PR_U * 0.35} r={0.32 * PR_U * 0.5} rise={0.15 * PR_U} level={lv} seed={i} />)}
      <PrintGlow x={PR_SHADE_X} y={PR_Y} r={0.32 * PR_U * 0.5} rise={0.15 * PR_U} level={0.3} seed={3} />
      <PrintGlow x={PR_SHADE_X + 260} y={PR_Y} r={0.32 * PR_U * 0.5} rise={0.15 * PR_U} level={0.12} seed={4} />
    </svg>
    <T x={30} y={14} w={2500} s={34} b>EDU19-CC-PROPS · set pieces, mats, prints + glow swatch, long line (EDU-EP19-BRIEF-R1 N1, N2, N3, N7)</T>
    <T x={30} y={58} w={2500} s={18} c="#4a3f38">A: swing SW (bar {SWING.bar} m), fence ({FENCE.h} m, gate {FENCE.gate} m), rain tree TR (trunk {TREE.trunk} m, canopy {2 * TREE.canopyR} m wide, {TREE.canopyLo}–{TREE.canopyHi} m) with GIRL, MUM, DOG at one scale (62 px/m). Elevations, not the projected set.</T>
    <T x={60} y={ROW_Y1 - 120} w={1900} s={20} b>B: mats {MAT.side} m, 13 slots {MAT.pitch} m apart (150 px/m) · top O1 ordered (T R O S …) with damp prints · bottom O2 after MUM's swap (B03-SH04)</T>
    <T x={60} y={ROW_Y1 - 90} w={1900} s={16} c="#4a3f38">{`O1 ${ORDER_O1.join(' ')}   |   O2 ${ORDER_O2.join(' ')}   (T teal ${MAT_COLORS.T}, R terracotta ${MAT_COLORS.R}, O ochre ${MAT_COLORS.O}, S slate ${MAT_COLORS.S})`}</T>
    <T x={ST_G[0] - 200} y={ST_G[1] + 14} w={400} s={16} center>stack ST: 14 mats on a 0.12 m pallet (top 0.47 m), 330 px/m</T>
    <T x={MAT_C[0] - 200} y={MAT_C[1] + 100} w={400} s={16} center>one mat 0.60 m + damp footprint (520 px/m); swatches above</T>
    <T x={60} y={PR_Y - 210} w={2400} s={20} b>C: pressed prints {PRINT.len} × {PRINT.wid} m, {PRINT.pitch} m apart (440 px/m) · glow levels round 1 swing→tree {ROUND1_LEVELS.join(' / ')} · 6th print: no glow (W-WAIT) · right: tree shade, 0.30 and 0.12</T>
    <T x={60} y={PR_Y + 160} w={1900} s={16} c="#4a3f38">{`glow = kit Spot halo (GLOW_PEAK 0.3) + two scent curls rising 0.15 m, ${GLOW_COLOR}, screen blend (edu19/glow.tsx PrintGlow)`}</T>
    <T x={60} y={2230} w={1200} s={20} b>D: long line {`(kit props.ts paintLongLine, ${'#d9532b'}, 8 mm; coil = 3 loops at the hand)`}</T>
  </AbsoluteFill>
);

registerRoot(() => h(Fragment, null,
  h(Composition, {id: 'EDU19-CC-GIRL', component: GirlCard, width: G_W, height: G_H, fps: 30, durationInFrames: 30}),
  h(Composition, {id: 'EDU19-CC-MUM-YOU', component: MumCard, width: M_W, height: M_H, fps: 30, durationInFrames: 30}),
  h(Composition, {id: 'EDU19-CC-DOG', component: DogCard, width: D_W, height: D_H, fps: 30, durationInFrames: 30}),
  h(Composition, {id: 'EDU19-CC-PROPS', component: PropsCard, width: P_W, height: P_H, fps: 30, durationInFrames: 30}),
));
