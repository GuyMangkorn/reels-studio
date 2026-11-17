import type {Cover, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP21-SHORT-PIC-COVERS, Film pick 1, 2026-11-17. Inputs SCRIPT-R1 + FACT-R1 (ready-for-storyboard), SHEETS-R4, Final cut v1.
 * Promise: the viewer finds out that it is not the tyres but the closed metal shell that helps protect the person inside (L01-L03),
 * because the current runs along the outer metal around her and into the ground (L05, L12).
 * Stakes: a bolt lands on the car roof with a woman at the wheel (B01-SH01 G12, L01); later the tyre is damaged (L07), the dash dies
 * (L08-L09) and the film says protection is not a guarantee (L11).
 * Gaps: Do the rubber tyres save her? (yes/no) -> L01-L03. Metal conducts, so how can it help? -> L04-L05. Is the car unharmed? -> L06-L07.
 * Why did the dash go dark? -> L08-L09. Is everyone inside always safe? (yes/no) -> L11.
 * Never shown (CV04): the route glow on the shell, the chip, the damaged tyre, the dead dash, any "safe" verdict.
 * Plates: cover-only paintings in src/painted/edu21/cover-shots.tsx (CV07 reason there). Headline bands named per picture in
 * scripts/edu-series/ep21/short/cover-notes.md. Channel mark redrawn over the grade.
 */
const ACCENT = '#ffd23f';
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
export const EDU21_PICS: Cover[] = [
  {...P('P1-strike-poster', 'EDU21-COVER-STRIKE'), layout: {grade: {vignette: 0.35}, elements: MARK}},
  {...P('P2-startled-face', 'EDU21-COVER-FACE'), layout: {grade: {vignette: 0.3}, elements: MARK}},
  // P3: red ring on the intact near rear tyre (the rubber L01 denies), centre measured from the r8 still (x 510, y 1322).
  {...P('P3-tyre-close', 'EDU21-COVER-TYRE'), layout: {grade: {vignette: 0.35}, elements: [...ring(510, 1322, 210, 205), ...MARK]}},
  {...P('P4-giant-bolt', 'EDU21-COVER-WIDE'), layout: {grade: {vignette: 0.4}, elements: MARK}},
  {...P('P5-inside-view', 'EDU21-COVER-INSIDE'), layout: {grade: {vignette: 0.55}, elements: MARK}},
];
export const EDU21_COVER_STYLE: CoverStyle = {accent: ACCENT};

/**
 * EDU-EP21-SHORT-COVERS: pick 2 (cover-design skill sections 3-7). User picked picture P2-startled-face (2026-11-17, pick 1):
 * plate EDU21-COVER-FACE at local 15 (frame 45 of EDU-EP21-SHORT-PIC-COVERS), with its pick-1 vignette. Hook sheet: the
 * PIC header above (SCRIPT-R1, FACT-R1, SHEETS-R4). Accent: the episode yellow (EDU21_COVER_STYLE); red would vanish on the
 * red door. Bands: (a) the red door y ~1180-1540 under her chin (chin ~y 1170) behind a bottom edge grade; (b) the cloud sky
 * right of the bolt x ~520-960, y ~300-720 (bolt x ~100-470). Every line inside x 40-960 and above baseline 1540 (CV06).
 *
 * Candidates (one text angle each; words said or shown in the film, FACT-R1 rows):
 *   C1 survival bet   "ในรถ / รอดมั้ย?"      accent "รอดมั้ย?"  question only (L11: no guarantee); paid L01-L03 (protects her
 *                                                              in the closed car), scoped L10-L11. "รอด" is not spoken: it is the
 *                                                              bet form of L01 "ช่วยป้องกันคนในรถ" + L11 "ปลอดภัย".
 *   C2 you            "ถ้าเป็น / คุณ?"       accent "คุณ?"      sky band; L03 "เปลือกโลหะรอบคุณ", L12 "รอบตัวคุณ".
 *   C3 wrong vs right "ยางช่วย? / ผิด!"      accent sticker "ผิด!"  L01 "ไม่ใช่ยางนะ" at 0 s, L07 (tyre does not stop it).
 *                     (replaces the extreme-number angle: the film says no number, CV09 swap.)
 *   C4 contradiction  "โลหะนำไฟ / กลับช่วย!?"  accent "กลับช่วย!?"  L04 "โลหะนำไฟฟ้า", L03/L12 "กลับเป็น..." (hints the gap-1
 *                                                              answer that L03 states at 6.5 s; the route stays unshown).
 *   C5 forbidden      "ห้ามเปิด / กระจก!"    accent "ห้ามเปิด"  L02 "ปิดกระจกด้วย" (closed windows are part of the condition).
 *   Not used: ปลอดภัย 100%, any "safe" verdict (L11), volts or numbers (FACT-R1: none), the damaged tyre, the dead dash.
 * Titles (skill section 4, CV11; scores and pairs in scripts/edu-series/ep21/short/cover-notes.md):
 *   T1 you transformed "ฟ้าผ่าหลังคาตอนคุณขับ… อะไรป้องกันไว้?"     L01-L03          clean with C1 C3 C4 C5
 *   T2 survival yes/no "ฟ้าผ่ากลางถนน คนขับปลอดภัยจริงไหม?"        L02-L03, L11     clean with all five
 *   T3 contradiction   "ตัวถังเป็นตัวนำไฟฟ้า… ทำไมกลับเป็นที่หลบ?"   L04-L05, L12     clean with C1 C3 C5
 *   T4 myth (no number in the film, replaces scale) "ยางกันฟ้าผ่าได้? เชื่อแบบนี้ผิดนะ"  L01, L07  clean with C1 C2 C4 C5
 *   T5 myth / mistake  "ฟ้าผ่าแล้วรถไม่เป็นไร? งั้นหน้าปัดดับทำไม"   L06, L08-L09     clean with C3 C4 C5
 * Render rounds 2 of 4 (r1 all five; r2 C2 "คุณ?" x 740 -> 690, size 270 -> 250, right edge was ~x 1028). Recommended C1 + T1.
 */
const CV = {plate: EDU21_PICS[1].plate, local: EDU21_PICS[1].local, scrim: false as const};
const DOOR = {grade: {vignette: 0.3, edge: {side: 'bottom' as const, size: 820, opacity: 0.55}}, elements: MARK};
const SKY = {grade: {vignette: 0.3, edge: {side: 'right' as const, size: 620, opacity: 0.45}}, elements: MARK};
const STICKER = {label: {color: ACCENT, ink: INK, pad: 0.35}};
export const EDU21_COVERS: Cover[] = [
  {...CV, id: 'C1-survival-in-car', lines: [
    {text: 'ในรถ', y: 1345, size: 165, x: 500},
    {text: 'รอดมั้ย?', y: 1530, size: 200, accent: true, x: 500}], layout: DOOR},
  {...CV, id: 'C2-you', lines: [
    {text: 'ถ้าเป็น', y: 470, size: 150, x: 720},
    {text: 'คุณ?', y: 700, size: 250, accent: true, x: 690}], layout: SKY},
  {...CV, id: 'C3-wrong-tyre', lines: [
    {text: 'ยางช่วย?', y: 1345, size: 175, x: 500},
    {text: 'ผิด!', y: 1530, size: 175, accent: true, x: 500, look: STICKER}], layout: DOOR},
  {...CV, id: 'C4-contradiction-metal', lines: [
    {text: 'โลหะนำไฟ', y: 1345, size: 150, x: 500},
    {text: 'กลับช่วย!?', y: 1530, size: 185, accent: true, x: 500}], layout: DOOR},
  {...CV, id: 'C5-forbidden-window', lines: [
    {text: 'ห้ามเปิด', y: 1345, size: 175, accent: true, x: 500},
    {text: 'กระจก!', y: 1530, size: 190, x: 500}], layout: DOOR},
];
