import type {Cover, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP11-SHORT-PIC-COVERS: cover pick 1 (cover-design skill, two-pick flow; docs/cover-principles.md CV01-CV10) for the
 * falling-lift Short (title "ลิฟต์ขาด กระโดดตอนท้ายรอดมั้ย", script EDU-EP11-SCRIPT-R3, fact-check W1.3 + W2 recheck,
 * EDU-EP11-SHEETS-R1.4). Five pictures without text, one picture idea each, every plate the episode's registry plate
 * `EDU11-<shot id>` (CV07); `local` is the shot-local frame (>= 15, COVER_STILL). The HUD (floor counter, speed gauge, tag
 * "ถ้า…ร่วงจริง") is the plate's own screen layer, not drawn by the cover; it keeps the fall framed as hypothetical.
 *
 * Promise: the viewer learns that a last-second jump in a falling lift barely helps (you fall as fast as the car, ~120 km/h,
 * the jump takes off ~10, the 20th floor becomes the 17th, and you cannot see the floor to time it), and that a modern lift
 * almost cannot fall that way: several cables each hold it, and a brake grabs the rails, shown by Otis in 1854 (L02-L05,
 * L06-L08, L13-L14; closed at L15-L16).
 * Gaps (question -> answer line):
 *   1. Does the last-second jump save you? -> L02 ("แทบไม่ช่วยอะไรเลย"), L04-L05 (takes off ~10; floor 20 becomes 17).
 *   2. Why can't the jump cancel the fall? -> L03 ("ลิฟต์เร็วเท่าไหร่ คุณก็เร็วเท่านั้น", ~120 km/h).
 *   3. Can you at least time it? -> L06-L08 (you cannot see the floor; early = the ceiling, late = too late).
 *   4. Can a lift really fall like this? -> L09-L11 (1854, the rope cut, the brake catches), L13 ("แทบ").
 *   5. What should you actually do? -> L16 (do not jump; press the alarm and wait).
 * Never shown (CV04, fact-check): the jump and its result (the B02-SH02 ghost and chip "-10", the B02-SH03 bracket slide to
 * "ชั้น 17", the B03-SH03 push-off and ceiling bonk), the bottom of the shaft (B03-SH04 near-pit, never an impact), the
 * brake answer (the 1854 catch B04-SH03/SH04, the modern jaws B05-SH03, the stop B05-SH04) and the alarm button press
 * (B05-SH05/06). No number is drawn by the cover; numbers on the pictures are the plates' own HUD and P5's bracket pill
 * "ชั้น 20" (L01's height, the setup).
 * Headline band for pick 2: per candidate below (top band y 300-700 under a dark top edge unless noted).
 */
const TOP = {edge: {side: 'top' as const, size: 820, opacity: 0.85}};
const ACCENT = '#ff5a36';
const INK = '#0b0d16';

export const EDU11_PICS: Cover[] = [
  // P1 subject close: her face counting the floors, eyes down, lips moving (S01-B03-SH02, L06b; gap 3), the moment
  // before she tries to time the jump. Band: top-left (the HUD sits top-right).
  {id: 'P1-counting', plate: 'EDU11-S01-B03-SH02', local: 40, scrim: false, lines: [], layout: {grade: TOP}},
  // P2 odd view: the shaft cut open, the car and her floating inside, slack cables whipping, both rails (S01-B01-SH02, L01b;
  // the impossible "seen from the shaft" view). Band: top (above the car, y 240-390; the shaft top is already dark). The
  // grade's edge is at the bottom instead: it calms the lit landing slot under the car (x ~490-590, y 1240-1830 on r1/r2),
  // which competed with her for salience.
  {id: 'P2-section', plate: 'EDU11-S01-B01-SH02', local: 52, scrim: false, lines: [],
    layout: {grade: {vignette: 0.6, edge: {side: 'bottom', size: 760, opacity: 0.9}}}},
  // P3 face and emotion: weightless, gripping the rail, scared straight look, phone, pen and tissue adrift (S01-B01-SH03 at
  // G220 = LF01b; V01/L02; gap 1). Band: top.
  {id: 'P3-float', plate: 'EDU11-S01-B01-SH03', local: 88, scrim: false, lines: [], layout: {grade: TOP}},
  // P4 action: the crouch to spring, determined face, hand on the rail (S01-B01-SH04, V02 "โดดสวน"; gap 1): the plan,
  // never the jump. Band: top.
  {id: 'P4-crouch', plate: 'EDU11-S01-B01-SH04', local: 60, scrim: false, lines: [], layout: {grade: TOP}},
  // P5 diagram: the tower section, the lit car falling, the bracket and pill "ชั้น 20" before the slide (S01-B02-SH03,
  // L05 setup at G580; the slide to 17 at G593 is never shown); the falling car circled. Band: top.
  // Ring on the lit car (measured on the r1 render: car centre (540, 828), about 36 x 56 px) and a down arrow right of the
  // tower (x 800, clear of the HUD slot y 224-600) to the ground line (y ~1600 is the tower base; the arrow stops at 1320).
  {id: 'P5-tower', plate: 'EDU11-S01-B02-SH03', local: 40, scrim: false, lines: [], layout: {grade: TOP, elements: [
    {kind: 'ellipse', cx: 540, cy: 828, rx: 78, ry: 78, stroke: INK, sw: 22},
    {kind: 'ellipse', cx: 540, cy: 828, rx: 78, ry: 78, stroke: ACCENT, sw: 11},
    {kind: 'path', d: 'M800 860L800 1320M800 1320L762 1270M800 1320L838 1270', stroke: INK, sw: 26, linecap: 'round'},
    {kind: 'path', d: 'M800 860L800 1320M800 1320L762 1270M800 1320L838 1270', stroke: ACCENT, sw: 12, linecap: 'round'},
  ]}},
];

/**
 * EDU-EP11-SHORT-COVERS: cover pick 2 (cover-design skill section 3). The user picked P2 (odd view, the shaft cut open,
 * S01-B01-SH02 @ 52). Five text angles on the same plate and frame; every word is said or shown in the film and passes the
 * fact-check (questions where the film hedges; never the jump result "-10"/"17", the brake or the alarm). The title
 * "ลิฟต์ขาด กระโดดตอนท้ายรอดมั้ย" is not repeated: each headline opens a different gap.
 * P2's weak points: the woman is small (her face is unreadable at 120 px), so a ring or an arrow points at her; the lit
 * landing slot under the car (x ~494-594, y ~1200-1800) is calmed by the bottom edge grade and, where it helps, covered by
 * the cue or the text. Coordinates measured on the pick-1 still (r2 45.png at 540 px, x2). The HUD (counter, gauge, tag)
 * sits at x ~800-1040, y ~224-600, so top-band text is left-aligned at x 70 and stays left of x ~790.
 */
const P2 = {plate: 'EDU11-S01-B01-SH02', local: 52, scrim: false as const};
const P2_GRADE = {vignette: 0.6, edge: {side: 'bottom' as const, size: 760, opacity: 0.9}};
const L = {x: 70, anchor: 'start' as const};
/** Ring on her head and shoulders (face centre ~(554, 690) on the still). */
const HER_RING = [
  {kind: 'ellipse' as const, cx: 554, cy: 700, rx: 128, ry: 128, stroke: INK, sw: 22},
  {kind: 'ellipse' as const, cx: 554, cy: 700, rx: 128, ry: 128, stroke: ACCENT, sw: 11},
];
/** Dark wash over the lit landing slot under the car (measured x ~492-592, y ~1200-1800): a shadow, so it stops
 * competing with her for salience (P2 weak point). */
const SLOT_DIM = [{kind: 'rect' as const, x: 484, y: 1190, w: 118, h: 650, fill: INK, opacity: 0.6, under: true}];
/** Down arrow from under the car over the lit landing slot: "the floor she cannot see" (covers the slot). */
const DOWN_SLOT = 'M544 1200L544 1520M544 1520L496 1460M544 1520L592 1460';
const DOWN_ARROW = [
  {kind: 'path' as const, d: DOWN_SLOT, stroke: INK, sw: 30, linecap: 'round' as const},
  {kind: 'path' as const, d: DOWN_SLOT, stroke: ACCENT, sw: 14, linecap: 'round' as const, dash: '34 26'},
];

export const EDU11_COVERS: Cover[] = [
  // C1 misconception, red sticker: the famous upward jump, "โดดสวน" (V02 "โดดสวนขึ้นไป"), "ช่วย" (L02); answer L02,
  // L04-L05 (never drawn). Ring on her.
  {id: 'C1-against', ...P2, lines: [{text: 'โดดสวน…', y: 378, size: 118, ...L}, {text: 'ช่วยไหม?', y: 540, size: 136, accent: true, x: 92, anchor: 'start'}],
    look: {label: {color: ACCENT, ink: '#ffffff', pad: 0.42}}, layout: {grade: P2_GRADE, elements: [...SLOT_DIM, ...HER_RING]}},
  // C2 question about what the picture shows: L09 "ลิฟต์ร่วงแบบนี้ได้จริงเหรอ" shortened; answer L11 (1854) and L13 ("แทบ").
  {id: 'C2-really', ...P2, lines: [{text: 'ร่วงแบบนี้', y: 378, size: 118, ...L}, {text: 'ได้จริง?', y: 540, size: 140, accent: true, ...L}],
    layout: {grade: P2_GRADE, elements: [...SLOT_DIM, ...HER_RING]}},
  // C3 imagined view: we see the shaft, she cannot (L06 "คุณมองไม่เห็นพื้น… ต้องกะให้ตรงเสี้ยววินาที"; "กะยังไง" not "กะทัน", which reads as "กะทันหัน"); answer L07-L08. The dashed
  // arrow runs down over the lit slot toward the floor she cannot see.
  {id: 'C3-blind', ...P2, lines: [{text: 'ไม่เห็นพื้น…', y: 378, size: 114, ...L}, {text: 'กะยังไง?', y: 540, size: 140, accent: true, ...L}],
    layout: {grade: P2_GRADE, elements: [...SLOT_DIM, ...DOWN_ARROW]}},
  // C4 try this: the viewer's own choice (L01 "คุณ", "ตอน"); answer L06-L08 (no moment works). Ring on her.
  {id: 'C4-when', ...P2, lines: [{text: 'คุณจะโดด', y: 378, size: 118, ...L}, {text: 'ตอนไหน?', y: 540, size: 140, accent: true, ...L}],
    layout: {grade: P2_GRADE, elements: [...SLOT_DIM, ...HER_RING]}},
  // C5 number: L03 "ลิฟต์เร็วราวร้อยยี่สิบ", gauge "ราว 120 กม./ชม." (hedge "ราว" kept); answer L03 refrain, L04. Placed in the
  // bottom band over the lit slot (last baseline 1530 < 1540); the top HUD gauge echoes it.
  {id: 'C5-speed', ...P2, lines: [{text: 'ราว 120', y: 1385, size: 190, accent: true, x: 480}, {text: 'กม./ชม.', y: 1530, size: 110, x: 480}],
    layout: {grade: P2_GRADE, elements: [...SLOT_DIM, ...HER_RING]}},
];

/** Floor-display red-orange accent (brief palette digits `#ff5a36`). No scrim: pick 1 is text-free. */
export const EDU11_COVER_STYLE: CoverStyle = {accent: ACCENT};
