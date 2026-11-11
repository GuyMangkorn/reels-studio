import type {Cover, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP15-SHORT-PIC-COVERS: cover pick 1 (cover-design skill, two-pick flow; docs/cover-principles.md CV01-CV10) for the
 * tokay Short (title "ถ้าตุ๊กแกจับเต็มแรง ห้อยคนได้ทั้งตัว", script EDU-EP15-SCRIPT-R2, fact-check scripts/edu-series/ep15/
 * fact-check.md W1.3, storyboard scripts/edu-series/ep15/storyboard.md ROWS-R2.3). Five pictures without text, one picture idea
 * each, every plate the episode's registry plate `EDU15-<shot id>` (CV07); `local` is the shot-local frame (>= 15,
 * COVER_STILL). The "ภาพจำลอง" tag on the imagined hang (SH02, B05-SH01) is the plates' own screen layer and keeps the
 * hanging man framed as a model (CL05). EP15 plates have no caption patch (look.tsx CalmBand is a no-op), so any frame works.
 *
 * Promise: the viewer learns that a tokay's dry feet, with no glue and no suction, hold because millions of fine hairs under
 * its toes split into tips that press so close to the ceiling that tiny pulls add up (about one person's weight if every hair
 * gripped at once, model), and that it lets go by peeling its toes up from the tip (L01-L03 set it up; L07-L12 pay the hold;
 * L14-L15 pay the release).
 * Gaps (question -> answer line):
 *   1. A lizard could hang a whole person? -> L02 tease and W-HANG / V02 (model picture, "ภาพจำลอง").
 *   2. No glue, no suction: then how does it hold? -> L10-L12 ("ยิ่งแนบชิด… ยิ่งเกาะแน่น").
 *   3. Isn't it a suction cup? -> L04 (a plunger drops off a dusty ceiling).
 *   4. What is under its toes? -> L07-L08 (rows of hairs, millions; tips split into hundreds).
 *   5. If it grips that hard, how does it walk? -> L14-L15 (it peels its toes up from the tip).
 * Never shown (CV04): the hairs and their split tips (B03-SH01/SH02 macro, SH05 tips in the plaster, SH06 glint field and pull
 * line), the toe peel and tape (B04-SH02/SH03), the plunger dropping (B02-SH01 after ~f35) and the moth catch (B05-SH03); no
 * kilogram figure anywhere.
 * Headline band for pick 2: per candidate below. Channel mark @TamMaiLa top-left (coversVideo chrome).
 */
const ACCENT = '#e0703a'; // tokay orange spot (palette.ts tkOrange)
const INK = '#1a1410';
const ring = (cx: number, cy: number, r: number) => [
  {kind: 'ellipse' as const, cx, cy, rx: r, ry: r, stroke: INK, sw: 22},
  {kind: 'ellipse' as const, cx, cy, rx: r, ry: r, stroke: ACCENT, sw: 11},
];
/** Vertical measure bracket (end ticks) with a dark under-stroke so it survives any ground. */
const bracket = (x: number, y0: number, y1: number, tick = 34) => {
  const d = `M ${x - tick} ${y0} H ${x + tick} M ${x} ${y0} V ${y1} M ${x - tick} ${y1} H ${x + tick}`;
  return [
    {kind: 'path' as const, d, stroke: INK, sw: 22, linecap: 'round' as const},
    {kind: 'path' as const, d, stroke: ACCENT, sw: 11, linecap: 'round' as const},
  ];
};

export const EDU15_PICS: Cover[] = [
  // P1 subject close: the big tokay upside down on the lamp-lit plaster at the top of the opening crane (S01-B01-SH01, L01
  // "ตุ๊กแกบนเพดานบ้านคุณ"; gaps 2, 4), its gold eye readable at about (435, 825); feet flat, pads not magnified.
  // Band: lower middle (y ~1150-1500, plain cream plaster under the tokay).
  {id: 'P1-tokay-ceiling', plate: 'EDU15-S01-B01-SH01', local: 136, scrim: false, lines: [], layout: {grade: {vignette: 0.55}}},
  // P2 odd view: from below the hanging man, looking up his arms at the tokay gripping his fists (S01-B05-SH01 W-HANG,
  // "ภาพจำลอง"; gap 1, the model the L02 tease also shows). Band: bottom-middle (y ~1250-1540, over his dark shirt).
  {id: 'P2-from-below', plate: 'EDU15-S01-B05-SH01', local: 20, scrim: false, lines: [], layout: {grade: {vignette: 0.4}}},
  // P3 face and emotion: her "เอ๊ะ?" face, eyes wide, mouth round, the plunger thought bubble over her head (S01-B01-SH04,
  // V01; gap 3, isn't it a suction cup?). Gaze at the viewer. Band: top-left (y ~240-560, x < 560, under a dark top edge).
  {id: 'P3-eh-plunger', plate: 'EDU15-S01-B01-SH04', local: 32, scrim: false, lines: [], layout: {grade: {edge: {side: 'top', size: 620, opacity: 0.6}}}},
  // P4 action: the plunger thwops onto the dusty ceiling, rim just touching the grit (S01-B02-SH01 L04, before the rim lifts
  // at ~f35 and it drops: never shown; gap 3). Band: bottom (y ~1250-1540, cream plaster either side of the handle).
  {id: 'P4-plunger-on', plate: 'EDU15-S01-B02-SH01', local: 15, scrim: false, lines: [], layout: {grade: {vignette: 0.4}}},
  // P5 diagram: the imagined whole man hanging under the tokay (S01-B01-SH02, L02, "ภาพจำลอง"); ring on the small tokay and a
  // measure bracket from it to his feet: one small lizard vs one whole person (gap 1). Band: top (y ~240-480, grey ceiling).
  {id: 'P5-one-person', plate: 'EDU15-S01-B01-SH02', local: 35, scrim: false, lines: [],
    layout: {grade: {edge: {side: 'top', size: 640, opacity: 0.55}}, elements: [...ring(536, 552, 60), ...bracket(720, 552, 1372)]}},
];

/**
 * EDU-EP15-SHORT-COVERS: cover pick 2 (cover-design skill section 3). The user picked P1 (subject close: the tokay upside
 * down on the lamp-lit plaster, S01-B01-SH01 @ 136). Five text angles on the same plate and frame, each opening a different
 * gap; every word is said in the film (line IDs per candidate), the model hang stays a question, and nothing names or draws
 * the hairs, their tips, glue or the toe peel (never shown, above); no kilogram figure (script R2 speaks none). The title
 * "ถ้าตุ๊กแกจับเต็มแรง ห้อยคนได้ทั้งตัว" is not repeated. Lift for the low-contrast tokay (pick-1 score F2/F3 1): a heavier
 * vignette plus a dark bottom edge behind the headline band, and a dark-under-orange ring on its head (eye measured on the
 * pick-1 still at about (430, 824), body x ~380-1080 at y ~780-880, upper front foot at about (492, 650)). Headline band:
 * lower middle, y ~1180-1500, over the plain plaster under the tokay; last baseline <= 1500 (round 2: sizes 150-205).
 */
const P1 = {plate: 'EDU15-S01-B01-SH01', local: 136, scrim: false as const};
const P1_GRADE = {vignette: 0.7, edge: {side: 'bottom' as const, size: 1000, opacity: 0.8}};
/** Ring on the head and eye (F2 cue). */
const HEAD_RING = ring(440, 826, 96);
/** Ring on the upper front foot and a short arrow from the text band up to it (try this: look under its toes). */
const FOOT_CUE = [...ring(492, 650, 62),
  ...[INK, ACCENT].map((stroke, i) => ({kind: 'path' as const, d: 'M 330 1050 Q 350 840 452 700 M 452 700 L 400 724 M 452 700 L 448 756', stroke, sw: i ? 11 : 22, linecap: 'round' as const}))];

export const EDU15_COVERS: Cover[] = [
  // C1 misconception, orange sticker: L04 "จุ๊บดูด…" asked as the common belief (gap 3, isn't it a suction cup?; L03 "ไม่มี
  // แรงดูด" and the plunger drop answer it at L03-L04, the plunger is not drawn). Centred two lines.
  {id: 'C1-suction-cup', ...P1, lines: [{text: 'เท้าเป็น', y: 1280, size: 170}, {text: 'จุ๊บดูด?', y: 1480, size: 190, accent: true}],
    look: {label: {color: ACCENT, ink: INK, pad: 0.42}}, layout: {grade: P1_GRADE, elements: HEAD_RING}},
  // C2 question: L09 "…เกาะเพดานกลับหัวได้ยังไง" shortened (gap 2, no glue no suction: how does it hold?). Answer L10-L12.
  // Left-aligned, second line in the accent.
  {id: 'C2-upside-down', ...P1, lines: [{text: 'กลับหัว', y: 1290, size: 205, x: 70, anchor: 'start'}, {text: 'ได้ยังไง?', y: 1490, size: 205, accent: true, x: 70, anchor: 'start'}],
    layout: {grade: P1_GRADE, elements: HEAD_RING}},
  // C3 imagined view: the hanging man's own line V02 "อย่าปล่อยนะ!" from the imagined hang (W-HANG, "ภาพจำลอง"), heard by
  // the tokay on your ceiling (gap 1, could it hang a person?; gap 5, it lets go by peeling). Swap reason (CV09): the film's
  // only imagined view is the man's; his line carries it without drawing him. Answer L02 / W-HANG-V02, L14-L15. One big line
  // plus a small "ภาพจำลอง" tag so the hang stays a model (CL05).
  {id: 'C3-dont-let-go', ...P1, lines: [{text: 'อย่าปล่อย', y: 1310, size: 196}, {text: 'นะ!', y: 1500, size: 200, accent: true}],
    layout: {grade: P1_GRADE, elements: [...HEAD_RING, {kind: 'rect', x: 410, y: 1012, w: 260, h: 66, rx: 14, fill: '#0b0d16', opacity: 0.85},
      {kind: 'text', text: 'ภาพจำลอง', x: 540, y: 1059, size: 42, anchor: 'middle', fill: '#f4efe6', weight: 700}]}},
  // C4 try this / you: L07 "ใต้นิ้วมัน" as a look-here action (gap 4, what is under its toes?). Answer L07-L08 (never drawn
  // on the cover). Ring and arrow on the upper front foot instead of the head.
  {id: 'C4-under-toes', ...P1, lines: [{text: 'ดูใต้นิ้ว', y: 1290, size: 205, x: 70, anchor: 'start'}, {text: 'มันสิ', y: 1490, size: 205, accent: true, x: 70, anchor: 'start'}],
    layout: {grade: P1_GRADE, elements: FOOT_CUE}},
  // C5 number: L11 "นับพันล้านจุดรวมกันก็แรงมาก" (SRC002 ~1 billion spatulae, Boat O4) as a question (gap 2); the "จุด" are
  // never shown. Answer L10-L12. Big number line in the accent.
  {id: 'C5-billion', ...P1, lines: [{text: 'นับพันล้าน', y: 1300, size: 190, accent: true}, {text: 'จุดรวมกัน?', y: 1480, size: 150}],
    layout: {grade: P1_GRADE, elements: HEAD_RING}},
];

/** Tokay orange (the spots). No scrim: pick 1 is text-free. */
export const EDU15_COVER_STYLE: CoverStyle = {accent: ACCENT};
