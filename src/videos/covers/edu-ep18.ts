import type {Cover, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP18-SHORT-PIC-COVERS: cover pick 1 (cover-design skill as rewritten 2026-11-16, legitbait; docs/cover-principles.md
 * CV01-CV11) for the hippo Short "ฮิปโปฆ่าคนปีละ 500?" (C69; script EDU-EP18-SCRIPT-R2.1, Boat fact-check R1 + R2 recheck
 * scripts/edu-series/ep18/short/fact-check.md, timed sheets EDU-EP18-SHEETS-R1.0, brief truth limits 1-7; published video-only
 * 2026-11-16, 24 shots pinned). Five pictures without text, one picture idea each; `local` is the shot-local frame (>= 15,
 * COVER_STILL). Plates are the episode's registry plates `EDU18-<shot id>` (look LF01 family); this module is not imported by
 * src/videos/edu-ep18, so the pinned scene keys are unchanged.
 *
 * Hook sheet (skill section 1):
 * Promise: the viewer finds out that the hippo, sold as the animal that kills the most people on Earth, is not even in the
 *   top three (L02), which everyday animals outrank it and the one that is first (L07 dog, L10-L11 snake, L12-L14 mosquito),
 *   and that its famous "500 a year" has no count and no clear source behind it (L17-L18).
 * Stakes: her body next to a hippo. It surfaces and yawns beside her canoe (B01-SH01, V01 gasp, L01) and charges, stopping
 *   a canoe-length short (B01-SH03, V02 "เฮ้ย!", L02-L03); then the everyday killers come close: the dog sniffs her hand
 *   (B03-SH03, L07), the snake lies one step ahead (B04-SH02, V03, L10-L11), the mosquito circles her in bed (B05-SH02, V04,
 *   L12). Nobody is hurt (brief truth limit 2): the bait is the danger moment, never harm.
 * Gaps (question -> answer line):
 *   1. Is the hippo really the animal that kills the most people? (yes/no) -> no, not even top three, L02 (OQ1); the first is
 *      the mosquito, L12-L14 (R2.1: "ตัวเล็กนิดเดียว แต่ฆ่าได้มากกว่านั้นอีก").
 *   2. It is so fierce, how can it not be first? -> L03 "ดุ ไม่ได้แปลว่าฆ่าเยอะ" (OQ2).
 *   3. 500 a year: compared with what? -> L07-L08 dog ~40,000, L10-L11 snake ~100,000 (OQ3, OQ4).
 *   4. Who actually counted the hippo's 500? -> L16 asks, L17-L18 answer: nobody counted it, nobody can clearly trace it (OQ6).
 *   5. Would you survive a charging hippo? (yes/no, bait only) -> she does, it stops short, B01-SH03..SH05 (L02-L03).
 * Never shown (CV04): the ranking (no dog, snake or mosquito as "the answer", no podium, no "#1"), the mosquito as the first,
 *   the "nobody counted" twist (no cross or "?" on the post's 500, no "fake"), any harm (no bite, blood, contact; the hippo
 *   never touches the canoe, truth limit 2). Boat scope (R2.1 L12 and claim rows): the hippo is NOT the deadliest in the world
 *   (the mosquito is), so no cover word may state "ฆ่าคนเยอะที่สุด" as fact; "500" only as the shared number or a question
 *   ("ปีละ 500?"), never as the hippo's real count (F001, F014, F027); no other number is drawn (truth limit 1).
 * Words checked against the film (for pick 2): "ฮิปโป" (L01, L16), "500"/"ห้าร้อย" (L04, L16, the post CL01), "ฆ่าคน" (L01,
 *   L03), "ดุ" (L03), "รอด" (the post caption "รอดจากสัตว์ที่ฆ่าคน…", CL01), "คุณ" (L01), "ใครนับ?" (L16). Not supported: any
 *   rank number for the hippo, "ปลอม"/"โกหก" (truth limit 5), "กัด" for the hippo.
 *
 * Picture ideas (skill section 2): three episode plates now (P2, P3, P5) and two new cover paintings needed (P1, P4: sheets
 * EDU18-CV1, EDU18-CV2 in scripts/edu-series/ep18/short/cover-sheets.md, for Boss; status needs-paint, the plate frame below
 * is only the stand-in). Cue colour red (stakes). Render rounds: see scripts/edu-series/build-notes.md (EP18 cover pick 1).
 */
const RED = '#e8432f';
const INK = '#14100c';
/** Round 4 grade (round-3 shelf sheet: the dawn plates read paler than EP05/EP11): deeper vignette, warm soft-light lift. */
const DAWN = {vignette: 0.68, tint: {color: '#ff9a3c', opacity: 0.2, blend: 'soft-light' as const}};
const P = (id: string, shot: string, local: number): Cover => ({id, plate: `EDU18-${shot}`, local, scrim: false, lines: []});
/** Ring with a dark under-stroke so it survives water and sky. */
const redRing = (cx: number, cy: number, rx: number, ry: number) => [
  {kind: 'ellipse' as const, cx, cy, rx, ry, stroke: INK, sw: 24},
  {kind: 'ellipse' as const, cx, cy, rx, ry, stroke: RED, sw: 12},
];

export const EDU18_PICS: Cover[] = [
  // P1 danger moment, NEEDS-PAINT (sheet EDU18-CV1 "the charge, head-on"): stand-in = the halt of the charge (B01-SH03 l 28,
  // L02 tail; gaps 1, 5); the plate is too wide (hippo ~120 px) to sell the danger, which is why CV1 is painted.
  // Band: top (y ~240-560, dawn sky).
  {...P('P1-charge-needs-paint', 'B01-SH03', 28), layout: {grade: DAWN}},
  // P2 scale shock: the hippo's yawn towering beside her canoe, jaws above her head, she gasps (B01-SH01 l 60, V01/L01,
  // look frame LF01 family; gaps 1-2). Band: top (y ~240-520, sky over the far bank).
  {...P('P2-yawn-beside-canoe', 'B01-SH01', 60), layout: {grade: DAWN}},
  // P3 face and emotion: her shock in the halt silence, "เฮ้ย!" (B01-SH04 l 15, V02 tail; gaps 2, 5), gaze off-frame left toward the
  // halted hippo. Band: top (y ~240-600, sky and water above her hair).
  {...P('P3-face-hoei', 'B01-SH04', 15), layout: {grade: {...DAWN, edge: {side: 'top', size: 620, opacity: 0.45}}}},
  // P4 subject close, NEEDS-PAINT (sheet EDU18-CV2 "the gape, tight"): stand-in = the nearest plate, the yawn at its peak
  // (B01-SH01 l 30) under a heavy vignette; the plate's mouth is ~350 px, the painting fills the frame with it.
  // Band: top (y ~240-480).
  {...P('P4-gape-needs-paint', 'B01-SH01', 30), layout: {grade: {...DAWN, vignette: 0.85}}},
  // P5 odd view: seen through her own selfie, grinning a V sign while the hippo's eyes and ears sit in the water at her
  // shoulder (B02-SH01 l 29, the frame rendered as the post photo, L04 start; the photo of her post CL01; gaps 1, 4). Red ring on the hippo (the "look behind
  // you" cue; ring measured on the round-2 still, head x 20-260, y 980-1140). Band: top (y ~240-500, sky over her hair, head top
  // y ~530).
  {...P('P5-selfie-hippo-behind', 'B02-SH01', 29), layout: {grade: DAWN, elements: redRing(150, 1050, 140, 92)}},
];

export const EDU18_COVER_STYLE: CoverStyle = {accent: RED};

/**
 * EDU-EP18-SHORT-COVERS: cover pick 2 (cover-design skill sections 3-7, rewritten 2026-11-16, legitbait). The user picked
 * picture E = P5 selfie-hippo-behind (genuine chat answer, 2026-11-16): plate EDU18-B02-SH01 at local 29, EDU18_PICS[4], her
 * selfie grinning with the hippo's head in the water at her shoulder. Hook sheet: the pick-1 header above (script R2.1, Boat
 * R1 + R2 recheck, sheets R1.0). Accent red (EDU18_COVER_STYLE), shared by the stakes word, the ring and the arrow.
 * Plate coordinates (frame px, measured on the pick-1 r4 still at 540 px): hair top y ~530, hair x ~330-720, face y
 * ~600-940, hippo head x 20-260 y 980-1140 (ring (150, 1050)), her arm across x 0-460 y 1000-1360, shorts y 1420-1760.
 * P5 weaknesses (pick-1 report): she dominates, the hippo is small at the left edge, muddy at 120 px. Fix with the engine
 * only (no plateMove): deeper vignette, a dark top edge behind the band, a thicker ring and an arrow from the headline to
 * the ring, so the eye goes headline -> hippo. Bands: top (y 240-620, sky over her hair) for C1, C2, C4, C5; bottom
 * (y 1300-1540, her shorts and the water under a dark bottom edge) for C3. Every line inside x 40-960 (CV06).
 *
 * Candidates (one text angle each, skill section 3; every word said or shown in the film, Boat verdicts):
 *   C1 survival bet   "รอดมั้ย?"            accent all   "รอด" shown in her post caption CL01 ("รอดจากสัตว์ที่ฆ่าคน…",
 *                                                         B02-SH01..SH03); paid: the charge stops short, she is safe on
 *                                                         the bank (B01-SH03..SH05, L02-L03, B02). No harm implied.
 *   C2 you            "ข้างหลัง / คุณ!"      accent "คุณ!"  "คุณ" L01; "ข้างหลัง" shown, not said (the selfie with the
 *                                                         hippo behind her, B02-SH01 stage direction); arrow to the ring.
 *   C3 extreme number "ปีละ 500?"            accent "500?"  L04 "ปีละห้าร้อยคน", CL01 "500 คน/ปี"; question form only
 *                                                         (Boat F001, F014, F027); paid: L16-L18.
 *   C4 wrong vs right "อย่าดู / ที่ความดุ"   accent sticker "อย่าดู"  L05 verbatim ("อย่าดูที่ความดุ… ดูที่ตัวเลข").
 *   C5 contradiction  "ยิ่งดุ / ยิ่งฆ่าเยอะ?"  accent "ยิ่งฆ่าเยอะ?"  L03 "ดุ ไม่ได้แปลว่าฆ่าเยอะ" answers the belief;
 *                                                         a question, never a claim (no "ที่สุด").
 *   Not used: "ฆ่าคนเยอะที่สุด" (Boat R2.1 L12: the mosquito is first), any rank number, "ปลอม"/"โกหก" (truth limit 5),
 *   "ใครนับ?" (kept for the title; the cover does not preview the twist), the mosquito/dog/snake (the ladder, CV04).
 *
 * Titles (skill section 4, CV11; hook in the first three words, <= ~40 characters, no extreme Boat does not support).
 *   T1 you transformed  "ถ้าคุณกลัวฮิปโปที่สุด… กลัวผิดตัวแล้ว"       L01, L02, L06-L14 ("ที่สุด" = your fear, not a kill count)
 *   T2 survival yes/no  "ฮิปโปพุ่งใส่เรือ… พายหนีทันมั้ย?"           B01-SH03..SH05, L02-L03 (it stops short; she is safe)
 *   T3 contradiction    "ฟันโตขนาดนี้… ทำไมฮิปโปไม่ใช่ที่หนึ่ง?"       B01-SH01 yawn, L01-L03 (not even top three, L02)
 *   T4 scale / extreme  "ตัวเล็กนิดเดียว… ฆ่าคนมากกว่าฮิปโปได้ไง?"   L12-L14 (R2.1 "ตัวเล็กนิดเดียว แต่ฆ่าได้มากกว่านั้นอีก")
 *   T5 myth / mistake   "ฮิปโปปีละ 500 ที่ใครก็แชร์… ใครนับ?"        L04, L15-L18 (the shared number; nobody counted, L17)
 *   Clean pairs (no headline word in the title): C1 + T1, T3, T4, T5 (T2 repeats the "…มั้ย?" bet); C2 + T2-T5 (T1
 *   repeats "คุณ"); C3 + T1-T4 (T5 repeats "ปีละ 500"); C4 + all; C5 + T1, T2, T3, T5 (T4 shares "ฆ่า").
 * Render rounds: 2 of 4 (r1 all five; r2 channel mark redrawn light, C5 line 2 175 -> 195 at stretch 80, C3 vignette
 *   0.85). Scores (skill section 7, 13 rows, max 26): C1 24, C3 24 (corrected 2026-11-16, was 25), C2 22, C5 22, C4 20; titles (S1-S4 + T3, max 10):
 *   T4 10, T1 9, T2 9, T3 9, T5 9. Recommended C3 + T4. Detail: scripts/edu-series/build-notes.md (EP18 W8.0 cover pick 2).
 */
const P5 = {plate: EDU18_PICS[4].plate, local: EDU18_PICS[4].local, scrim: false as const};
/** Dark ink stroke under a red stroke, one path; `w` is the red width. */
const redPath = (d: string, w = 16) => [
  {kind: 'path' as const, d, stroke: INK, sw: w + 14, linecap: 'round' as const},
  {kind: 'path' as const, d, stroke: RED, sw: w, linecap: 'round' as const},
];
/** Curved arrow from (x0, y0) through control (cx, cy) to the tip (x1, y1), head 70 px at +-32 degrees. */
const arrow = (x0: number, y0: number, cx: number, cy: number, x1: number, y1: number) => {
  const a = Math.atan2(y1 - cy, x1 - cx);
  const h = (s: number) => `${(x1 - 70 * Math.cos(a + s)).toFixed(0)} ${(y1 - 70 * Math.sin(a + s)).toFixed(0)}`;
  return redPath(`M ${x0} ${y0} Q ${cx} ${cy} ${x1} ${y1} M ${h(0.56)} L ${x1} ${y1} L ${h(-0.56)}`);
};
/** Pick-1 grade pushed for text: deeper vignette, dark top edge behind the headline band. */
const TOP_GRADE = {...DAWN, vignette: 0.75, edge: {side: 'top' as const, size: 760, opacity: 0.62}};
const BOTTOM_GRADE = {...DAWN, vignette: 0.75, edge: {side: 'bottom' as const, size: 820, opacity: 0.7}};
/** Thicker ring on the hippo than pick 1 (12 -> 16 red) so it survives 120 px. */
const RING = [
  {kind: 'ellipse' as const, cx: 150, cy: 1050, rx: 145, ry: 98, stroke: INK, sw: 30},
  {kind: 'ellipse' as const, cx: 150, cy: 1050, rx: 145, ry: 98, stroke: RED, sw: 16},
];
/** Channel mark (CV08): the chrome's "@TamMaiLa" at (120, 128) fades under the dark grade (round 1), so each cover redraws it
 * at the same place and size in light ink over a dark under-stroke (EDU-EP19 precedent, cover-local). */
const MARK = [
  {kind: 'text' as const, text: '@TamMaiLa', x: 120, y: 151, size: 22, fill: INK, stroke: INK, sw: 6},
  {kind: 'text' as const, text: '@TamMaiLa', x: 120, y: 151, size: 22, fill: '#fff1da'},
];
const RED_STICKER = {label: {color: RED, ink: '#fff6e8', pad: 0.4}};
const COND = {stretch: 80};
export const EDU18_COVERS: Cover[] = [
  // C1 survival bet: one huge red bet over the sky, arrow from under it down the left to the ring.
  {...P5, id: 'C1-survival-bet', lines: [
    {text: 'รอดมั้ย?', y: 500, size: 240, accent: true, x: 500}],
    layout: {grade: TOP_GRADE, elements: [...RING, ...arrow(190, 580, 70, 760, 120, 930), ...MARK]}},
  // C2 you: left-aligned stack "ข้างหลัง" / huge red "คุณ!", the arrow drops from "คุณ!" to the ring.
  {...P5, id: 'C2-you-behind-you', lines: [
    {text: 'ข้างหลัง', y: 370, size: 170, x: 60, anchor: 'start'},
    {text: 'คุณ!', y: 610, size: 250, accent: true, x: 60, anchor: 'start'}],
    layout: {grade: TOP_GRADE, elements: [...RING, ...arrow(200, 680, 110, 800, 140, 930), ...MARK]}},
  // C3 extreme number: bottom band over her shorts and the water, "ปีละ" small near-white over the huge red "500?".
  {...P5, id: 'C3-number-500', lines: [
    {text: 'ปีละ', y: 1290, size: 140, x: 500},
    {text: '500?', y: 1530, size: 290, accent: true, x: 500}],
    layout: {grade: {...BOTTOM_GRADE, vignette: 0.85}, elements: [...RING, ...MARK]}},
  // C4 wrong vs right: red sticker "อย่าดู" over near-white "ที่ความดุ" (L05 verbatim), arrow to the fierce one.
  {...P5, id: 'C4-wrong-dont-look', lines: [
    {text: 'อย่าดู', y: 400, size: 190, accent: true, x: 500, look: RED_STICKER},
    {text: 'ที่ความดุ', y: 610, size: 175, x: 500}],
    layout: {grade: TOP_GRADE, elements: [...RING, ...arrow(150, 680, 60, 800, 110, 930), ...MARK]}},
  // C5 contradiction: the belief as a question, "ยิ่งดุ" near-white, the red condensed "ยิ่งฆ่าเยอะ?" under it.
  {...P5, id: 'C5-contradiction-fiercer', lines: [
    {text: 'ยิ่งดุ', y: 390, size: 200, x: 500},
    {text: 'ยิ่งฆ่าเยอะ?', y: 610, size: 195, accent: true, x: 500, look: COND}],
    layout: {grade: TOP_GRADE, elements: [...RING, ...MARK]}},
];
