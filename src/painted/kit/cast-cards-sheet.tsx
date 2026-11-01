import {createElement, Fragment, type CSSProperties} from 'react';
import {AbsoluteFill, Composition, registerRoot} from 'remotion';
import {BrushCanvas} from '../BrushCanvas';
import {drawFigure, type FigPose} from './cast';
import {CARD_EXPRESSIONS, CARD_POSES, CASTING_FORMAT, parseCasting, roleLabel} from './casting';
import {hardFill, inkLine, rectPts, washAt} from './draw';
import {EXPRESSIONS} from './expressions';
import {blinking, paintHeadFront} from './head';
import {makePainter, type Painter, type Pt} from './painter';
import {PEOPLE, PEOPLE_INFO, PERSON_IDS, type PersonId} from './people';
import {POSE_INFO, poseFor} from './poses';

// Casting cards: one card per `PEOPLE` entry (`people.ts`) for casting by id, plus a legend cell with the casting-line format and
// examples parsed by `parseCasting` (`casting.ts`) at render time. A card shows: id, role label, the built-in outfit (colour chips
// from the person's `outfit`), an expression strip (`CARD_EXPRESSIONS`) and three suggested poses (`CARD_POSES`, front view).
// Own entry (kept out of src/Root.tsx), like people-sheet.tsx:
//   printf 'KIT-CAST-CARDS 0 out/kit-pass3/cast-cards/KIT-CAST-CARDS.png\n' | node scripts/stills.mjs src/painted/kit/cast-cards-sheet.tsx
// Added 1 Nov 2026 (pass 3).

const W = 2380, H = 2290;
const X0 = 40, Y0 = 160, CARD_W = 560, CARD_H = 690, GAP = 20, COLS = 4;
/** Head size for the expression strip, px per head unit, and the figure size for the pose thumbnails, px per metre. */
const STRIP_K = 20, THUMB_UNIT = 165;
/** Pose thumbnails: centres (card-relative x), ground line (card-relative y). */
const THUMB_X = [93, 280, 467], THUMB_GROUND = 640;

const cardX = (i: number) => X0 + (i % COLS) * (CARD_W + GAP);
const cardY = (i: number) => Y0 + Math.floor(i / COLS) * (CARD_H + GAP);

/** A plate time at which the rig's blink is open, so the still shows the eyes. */
const openT = (seed: number) => [0.4, 0.9, 1.4, 1.9, 2.4].find((t) => !blinking(t, seed)) ?? 0.4;

const label: CSSProperties = {position: 'absolute', fontFamily: 'Noto Sans Thai, sans-serif', color: '#2b211c'};
const Text = ({x, y, w, size, weight = 400, color, align = 'left', children}: {x: number; y: number; w: number; size: number; weight?: number; color?: string; align?: 'left' | 'center'; children: string}) => (
  <div style={{...label, left: x, top: y, width: w, fontSize: size, fontWeight: weight, lineHeight: 1.25, color: color ?? '#2b211c', textAlign: align}}>{children}</div>
);

/** The built-in outfit as colour chips: shirt, jacket (or sleeve), skirt (or trousers), shoes. */
const chips = (id: PersonId): {name: string; color: string}[] => {
  const o = PEOPLE[id].outfit;
  return [
    {name: 'shirt', color: o.shirt},
    {name: o.jacket ? 'jacket' : 'sleeve', color: o.jacket ?? o.sleeve},
    {name: o.skirt ? 'skirt' : 'trousers', color: o.skirt ?? o.pants},
    {name: 'shoes', color: o.shoes},
  ];
};

const paintCard = (p: Painter, id: PersonId, i: number) => {
  const x = cardX(i), y = cardY(i), def = PEOPLE[id], base = 6000 + i * 100;
  washAt(p, base, '#f7f2e6', 180, rectPts(x, y, x + CARD_W, y + CARD_H), 0.2, 0.3);
  inkLine(p, base + 1, rectPts(x, y, x + CARD_W, y + CARD_H), {closed: true, weight: 0.8, color: '#8a7d6d', still: true});
  // Built-in outfit chips at y+138.
  chips(id).forEach((c, k) => {
    const cx = x + 18 + k * 74;
    hardFill(p, base + 2 + k, c.color, rectPts(cx, y + 138, cx + 56, y + 156));
  });
  // Expression strip: front heads at y+240, seven across (76 px apart; curly and spiky hair stays inside its cell at STRIP_K).
  CARD_EXPRESSIONS.forEach((eid, j) => {
    const cx = x + 78 + j * 76, seed = base + 10 + j;
    paintHeadFront(p, seed, cx, y + 240, STRIP_K, EXPRESSIONS[eid], def.head, openT(seed));
  });
  // Suggested poses: front view, standing, on the card's ground line.
  CARD_POSES[id].forEach((pid, k) => {
    const g: Pt = [x + THUMB_X[k], y + THUMB_GROUND], seed = base + 40 + k;
    const pose: FigPose = {...poseFor(pid, def, g, THUMB_UNIT, 'front'), face: EXPRESSIONS.neutral};
    drawFigure(p, def, g, THUMB_UNIT, pose, openT(seed), seed);
  });
};

/** Casting-line examples for the legend, parsed at render time: the last one is a deliberate error to show the validator. */
const EXAMPLES = ['man-parted + police, P15, scared', 'woman-ponytail + nurse, P03', 'boy-school, P07, happy', 'man-crop + nope, P01', 'man-crop, P15, P09'];

const explain = (line: string): {ok: boolean; text: string} => {
  try {
    const m = parseCasting(line);
    return {ok: true, text: [`person ${m.person}`, m.outfit && `outfit ${m.outfit}`, m.pose && `pose ${m.pose} (${POSE_INFO[m.pose].name})`, m.expression && `expression ${m.expression}`].filter(Boolean).join('  ·  ')};
  } catch (e) {
    return {ok: false, text: (e as Error).message};
  }
};

const Cards = () => {
  const legend = cardX(11), legendY = cardY(11);
  return (
    <AbsoluteFill>
      <BrushCanvas paint={({brush}) => {
        const p = makePainter(brush, {t: 0, frame: 0});
        PERSON_IDS.forEach((id, i) => paintCard(p, id, i));
      }} />
      <Text x={40} y={22} w={2300} size={40} weight={700}>src/painted/kit/casting.ts: casting cards</Text>
      <Text x={40} y={80} w={2300} size={20} color="#4a3f38">{`${PERSON_IDS.length} people from PEOPLE. Each card: id, role label, built-in outfit chips, expression strip, three suggested poses (front view). Casting line: ${CASTING_FORMAT}`}</Text>
      {PERSON_IDS.map((id, i) => {
        const x = cardX(i), y = cardY(i), def = PEOPLE[id];
        return (
          <Fragment key={id}>
            <Text x={x + 18} y={y + 10} w={CARD_W - 36} size={24} weight={700}>{id}</Text>
            <Text x={x + 18} y={y + 42} w={CARD_W - 36} size={14} color="#4a3f38">{`${roleLabel(id)}, ${def.height.toFixed(2)} m`}</Text>
            <Text x={x + 18} y={y + 64} w={CARD_W - 36} size={12.5} color="#4a3f38">{PEOPLE_INFO[id].description}</Text>
            <Text x={x + 18} y={y + 122} w={CARD_W - 36} size={11} color="#7a6f64">built-in outfit</Text>
            {chips(id).map((c, k) => (
              <Text key={c.name} x={x + 18 + k * 74} y={y + 160} w={74} size={10.5} color="#4a3f38">{c.name}</Text>
            ))}
            <Text x={x + 18} y={y + 186} w={CARD_W - 36} size={11} color="#7a6f64">expressions</Text>
            {CARD_EXPRESSIONS.map((eid, j) => (
              <Text key={eid} x={x + 78 + j * 76 - 38} y={y + 276} w={76} size={10.5} color="#4a3f38" align="center">{eid}</Text>
            ))}
            <Text x={x + 18} y={y + 318} w={CARD_W - 36} size={11} color="#7a6f64">suggested poses</Text>
            {CARD_POSES[id].map((pid, k) => (
              <Text key={pid} x={x + THUMB_X[k] - 90} y={y + 655} w={180} size={12} color="#2b211c" align="center">{`${pid} ${POSE_INFO[pid].name}`}</Text>
            ))}
          </Fragment>
        );
      })}
      <Text x={legend + 18} y={legendY + 10} w={CARD_W - 36} size={24} weight={700}>Casting line</Text>
      <Text x={legend + 18} y={legendY + 48} w={CARD_W - 36} size={17}>{CASTING_FORMAT}</Text>
      <Text x={legend + 18} y={legendY + 84} w={CARD_W - 36} size={13} color="#4a3f38">{`people ${PERSON_IDS.length} · poses P01-P45 · expressions and outfits by id (expressions.ts, wardrobe.ts)`}</Text>
      <Text x={legend + 18} y={legendY + 118} w={CARD_W - 36} size={12} color="#7a6f64">examples, parsed by parseCasting when this sheet renders</Text>
      {EXAMPLES.map((ex, j) => {
        const r = explain(ex), y = legendY + 146 + j * 100;
        return (
          <Fragment key={ex}>
            <Text x={legend + 18} y={y} w={CARD_W - 36} size={17} weight={700}>{ex}</Text>
            <Text x={legend + 18} y={y + 26} w={CARD_W - 36} size={13} color={r.ok ? '#3b5a3a' : '#9a3b2e'}>{`${r.ok ? 'ok' : 'error'}: ${r.text}`}</Text>
          </Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

registerRoot(() => createElement(Composition, {id: 'KIT-CAST-CARDS', component: Cards, width: W, height: H, fps: 30, durationInFrames: 30}));
