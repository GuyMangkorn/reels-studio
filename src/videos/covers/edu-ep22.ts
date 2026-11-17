import type {Cover, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP22-SHORT-PIC-COVERS, Film pick 1, 2026-11-17 (cover-design skill sections 1-2, 6-7). Inputs SCRIPT-R3 + FACT-R3 (ready-for-storyboard),
 * scene sheets and plates of the approved Final cut r1 (user "ผ่าน", 2026-11-17).
 * Promise: the viewer finds out that the last emperor never ate the long tasted table (L02), what he ate instead (L04, L16) and that the
 * silver check catches sulfur, not poison (L10-L12).
 * Stakes: "you" are the eunuch who must taste every dish before the emperor (L01); the silver tag is the only poison check (L06), and it
 * stays bright on a poison without sulfur (L12).
 * Gaps: Does the emperor eat the dishes you taste? (yes/no) -> L02. Then what does this child eat? -> L04. Why is the long table set? -> L15-L16.
 * Can the silver tag really catch poison? (yes/no) -> L10-L13.
 * Never shown (CV04): the darkened silver, the boiled egg, the child's spread of about twenty dishes, "for show" (L15).
 * Plates: three cover-only paintings in src/painted/edu22/cover-shots.tsx (CV07 reason there) and two film plates. Headline bands:
 *   P1 taster: top wall/ceiling y ~240-600; P2 child: top wall y ~240-560 and the bottom table y ~1450-1680; P3 tag: bottom cover dome y ~1250-1600
 *   (under the dome's highlight); P4 overhead: floor right of the table x ~420-960, y ~1000-1500; P5 caller: top wall y ~240-560.
 * Channel mark redrawn over the grade.
 */
const INK = '#1b222b';
const MARK = [
  {kind: 'text' as const, text: '@TamMaiLa', x: 120, y: 151, size: 22, fill: INK, stroke: INK, sw: 6},
  {kind: 'text' as const, text: '@TamMaiLa', x: 120, y: 151, size: 22, fill: '#f2f6ff'},
];
const RED = '#ff3b30';
const ring = (cx: number, cy: number, rx: number, ry: number) => [
  {kind: 'ellipse' as const, cx, cy, rx, ry, stroke: INK, sw: 22},
  {kind: 'ellipse' as const, cx, cy, rx, ry, stroke: RED, sw: 11},
];
const P = (id: string, plate: string, local = 15): Cover => ({id, plate, local, scrim: false, lines: []});
export const EDU22_PICS: Cover[] = [
  // Rings: centres measured from the r1 stills (540 px tiles x 2): P1 the spoon in the open bowl (405, 1305); P3 the silver tag (545, 655);
  // P4 the seated child (858, 825).
  {...P('P1-taster-spoon', 'EDU22-COVER-TASTE'), layout: {grade: {vignette: 0.35}, elements: [...ring(405, 1300, 160, 120), ...MARK]}},
  {...P('P2-child-sideeye', 'EDU22-COVER-CHILD'), layout: {grade: {vignette: 0.35}, elements: MARK}},
  {...P('P3-silver-tag', 'EDU22-B03-SH08', 80), layout: {grade: {vignette: 0.4}, elements: [...ring(545, 655, 125, 150), ...MARK]}},
  {...P('P4-overhead-table', 'EDU22-COVER-TOP'), layout: {grade: {vignette: 0.45}, elements: [...ring(858, 830, 100, 125), ...MARK]}},
  {...P('P5-caller-shout', 'EDU22-B03-SH10', 52), layout: {grade: {vignette: 0.35}, elements: MARK}},
];
export const EDU22_COVER_STYLE: CoverStyle = {accent: '#ff3b30'};

/**
 * EDU-EP22-SHORT-COVERS: pick 2 (cover-design skill sections 3-7). User picked picture P2-child-sideeye (2026-11-17, pick 1): plate
 * EDU22-COVER-CHILD at local 15 (frame 45 of EDU-EP22-SHORT-PIC-COVERS) with its pick-1 vignette. Hook sheet: the PIC header above
 * (SCRIPT-R3, FACT-R3). Accent: red #ff3b30 (reads on the yellow robe and the cream wall with the dark outline). Bands: (a) the robe under his
 * chin, y ~1200-1540, behind a bottom edge grade (the long table he looks at, y ~1060-1200 at left, stays clear); (b) the ceiling/wall above the
 * cap, y ~240-400 (one line). Every line inside x 40-960 and above baseline 1540 (CV06).
 *
 * Candidates (one text angle each; every word said or shown in the film, FACT-R3 rows):
 *   C1 survival bet   "โต๊ะนี้ / กินมั้ย?"        accent "กินมั้ย?"  yes/no on the table behind him; paid L02 (no), L04, L15-L16.
 *   C2 you            "ถ้าคุณ / ต้องชิม?"         accent "ต้องชิม?"  L01 "ถ้าคุณเป็นขันที... คุณต้องชิมก่อนทุกจาน".
 *   C3 extreme number "เกือบ 30 จาน / ไม่แตะ!"    accent "ไม่แตะ!"   L02 "ไม่แตะโต๊ะเกือบสามสิบจานนั้นเลย" (C05: 27-28 dishes, "เกือบ" kept).
 *   C4 wrong vs right "กินโต๊ะนี้? / ผิด!"         accent sticker "ผิด!"  L02 (he does not touch it), L04 (he eats the dowager's dishes).
 *   C5 myth (swap for forbidden: nothing is forbidden in the film, CV09) "เงินจับพิษ / จริงเหรอ?"  accent "จริงเหรอ?"  L09 asked verbatim
 *                     ("จับพิษได้จริงเหรอ?"), answered L10-L13; question form, no verdict.
 *   Not used: "โชว์" / "ไว้ให้ดู" (the payoff, L15-L16), "ยี่สิบจาน" (the L04 answer), sulfur/egg, "ชิมแล้วไม่มีใครกิน" or any line that joins
 *   the tasting to the uneaten table (C06, research risk), "พิษ" as a claim that a dish was poisoned.
 * Titles (skill section 4, CV11; scores and pairs in scripts/edu-series/ep22/short/cover-notes.md):
 *   T1 you transformed "ถ้าคุณชิมกันพิษให้ฮ่องเต้… เขากินจริงมั้ย?"     L01, L02, L04   clean with C3 C4 C5
 *   T2 survival yes/no "แผ่นเงินกันพิษในจานฮ่องเต้ ได้ผลจริงมั้ย?"       L06, L09-L13     clean with C1 C2 C3 C4 (C5 overlaps "จริง")
 *   T3 contradiction   "โต๊ะฮ่องเต้เกือบ 30 จาน… ทำไมไม่แตะเลย?"         L02, L05, L14-L16  clean with C1 C2 C5 (repeats C3)
 *   T4 extreme number  "ไม่แตะเกือบ 30 จาน… ฮ่องเต้เด็กกินอะไร?"         L02-L04          clean with C2 C5
 *   T5 myth / mistake  "เงินดำเพราะเจอพิษ? เชื่อแบบนี้ผิดนะ"            L10-L12          clean with C1-C4; Boat check: L11 scopes "not poison" to the egg
 * Render rounds 2 of 4 (r1 all five; r2 C4 sticker ink INK -> white, dark-on-red read low at 120 px). Measured text extents (r2, accent red
 * + near-white pixels below y 300): x 142-940, last baseline 1530-1532 (C4 sticker box to y 1560). Recommended C3 + T1.
 */
const CV = {plate: EDU22_PICS[1].plate, local: EDU22_PICS[1].local, scrim: false as const};
const ROBE = {grade: {vignette: 0.35, edge: {side: 'bottom' as const, size: 820, opacity: 0.6}}, elements: MARK};
const STICKER = {label: {color: RED, ink: '#ffffff', pad: 0.35}};
export const EDU22_COVERS: Cover[] = [
  {...CV, id: 'C1-survival-eat', lines: [
    {text: 'โต๊ะนี้', y: 1345, size: 165, x: 540},
    {text: 'กินมั้ย?', y: 1530, size: 200, accent: true, x: 540}], layout: ROBE},
  {...CV, id: 'C2-you-taste', lines: [
    {text: 'ถ้าคุณ', y: 1345, size: 165, x: 540},
    {text: 'ต้องชิม?', y: 1530, size: 200, accent: true, x: 540}], layout: ROBE},
  {...CV, id: 'C3-number-30', lines: [
    {text: 'เกือบ 30 จาน', y: 1345, size: 140, x: 540},
    {text: 'ไม่แตะ!', y: 1530, size: 210, accent: true, x: 540}], layout: ROBE},
  {...CV, id: 'C4-wrong-table', lines: [
    {text: 'กินโต๊ะนี้?', y: 1345, size: 165, x: 540},
    {text: 'ผิด!', y: 1530, size: 175, accent: true, x: 540, look: STICKER}], layout: ROBE},
  {...CV, id: 'C5-myth-silver', lines: [
    {text: 'เงินจับพิษ', y: 1345, size: 160, x: 540},
    {text: 'จริงเหรอ?', y: 1530, size: 190, accent: true, x: 540}], layout: ROBE},
];
