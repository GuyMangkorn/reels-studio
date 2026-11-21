import type {Cover, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP31-SHORT-PIC-COVERS, Film pick 1, 2026-11-21 (cover-design skill sections 1-2, 6-7). Hook sheet, picture ideas, bands and scores:
 * scripts/edu-series/ep31/short/cover.md (COVER-R1). Inputs EDU-EP31-SCRIPT-R2, EDU-EP31-FACT-R1 and the plates of the Final cut
 * (out/EDU-EP31-SHORT/EDU-EP31-SHORT.mp4, 21 Nov 2026). All five are episode plates at a chosen shot-local frame (no cover paintings this
 * round: a cover-shot module would add a src/painted/registry.ts line and move the pinned Final's shared render-input hash).
 * Channel mark redrawn over the grade.
 */
const INK = '#1b222b';
const MARK = [
  {kind: 'text' as const, text: '@TamMaiLa', x: 120, y: 151, size: 22, fill: INK, stroke: INK, sw: 6},
  {kind: 'text' as const, text: '@TamMaiLa', x: 120, y: 151, size: 22, fill: '#f2f6ff'},
];
const P = (id: string, plate: string, local: number): Cover => ({id, plate, local, scrim: false, lines: []});
const L = (vignette: number) => ({grade: {vignette}, elements: MARK});
export const EDU31_PICS: Cover[] = [
  {...P('P1-wink-lemon', 'EDU31-B01-SH03', 41), layout: L(0.4)},
  {...P('P2-cctv-face', 'EDU31-B04-SH02', 66), layout: L(0.4)},
  {...P('P3-blank-polaroid', 'EDU31-B03-SH03', 50), layout: L(0.4)},
  {...P('P4-face-on-tv', 'EDU31-B05-SH01', 86), layout: L(0.4)},
  {...P('P5-lemon-cheeks', 'EDU31-B03-SH02', 19), layout: L(0.4)},
];
export const EDU31_COVER_STYLE: CoverStyle = {accent: '#ffd21f'};

/**
 * EDU-EP31-SHORT-COVERS, Film pick 2, 2026-11-21 (cover-design skill sections 3-7; cover.md EDU-EP31-COVER-R2). The user picked P1-wink-lemon
 * (EDU31-B01-SH03 f41, plate frame, no repaint) and ruled out a reconstruction tag on the cover (chat, 2026-11-21).
 * Never on a cover or title (CV04): the camera still seeing him, the arrest, "ไม่ถึงชั่วโมง" (L12), his L14 line, the psychologist (L15), the
 *   cause of the blank Polaroid (F006), the gun, any link of his name or face to the 1999 paper (F015). Comedy aims at the plan, not the man.
 * Angles (CV09): C1 survival bet (L09 "รอด", answer withheld to L09/L12), C2 you (belief, L03/L05 "เชื่อ"), C3 extreme number (L01: two banks,
 *   no mask), C4 wrong vs right (red sticker "สูตรเพื่อน", L03; "ผิดตรงไหน?" answered at L04), C5 contradiction (kitchen lemon = invisible, L02-L03).
 * Bands: lower band over the jacket and floor (baselines y ~1250-1450, inside y < 1540) with a bottom edge grade; C4 puts its sticker on the
 *   ceiling band above his head (baseline y ~330, head top y ~400). Lemon ring (C1, C4): measured from the 540 px still, lemon x 290-336,
 *   y 585-710 at frame scale.
 * Titles (CV11; formula; never repeat the picked cover's words, pairs in cover.md):
 *   T1 you transformed: ถ้าคุณทามะนาวที่หน้า กล้องจะเห็นมั้ย?  T2 survival yes/no: ปล้นธนาคารไม่ใส่หน้ากาก รอดมั้ย?
 *   T3 contradiction: ทาน้ำมะนาวที่หน้า… ทำไมกล้าปล้นธนาคาร?  T4 extreme: ปล้น 2 ธนาคารวันเดียว ไม่ใส่หน้ากากเลย
 *   T5 myth: น้ำมะนาวทำให้ล่องหนจากกล้อง? เขาเชื่อสนิท
 * Scores, shelf and frame-0 check: cover.md (COVER-R2). Render rounds 4 of 4 (r2 sticker accent, r3 ring off the eye, r4 C4 inside x < 960).
 */
const RED = '#ff3b30';
const CV = {plate: EDU31_PICS[0].plate, local: EDU31_PICS[0].local, scrim: false as const};
const RING = (color: string) => [
  {kind: 'ellipse' as const, cx: 305, cy: 645, rx: 64, ry: 100, stroke: INK, sw: 24},
  {kind: 'ellipse' as const, cx: 305, cy: 645, rx: 64, ry: 100, stroke: color, sw: 12},
];
const BOTTOM = (extra: ReturnType<typeof RING> = []) => ({
  grade: {vignette: 0.4, edge: {side: 'bottom' as const, size: 900, opacity: 0.75}}, elements: [...MARK, ...extra]});
const STICKER = {label: {color: RED, ink: '#ffffff', pad: 0.3}};
export const EDU31_COVERS: Cover[] = [
  {...CV, id: 'C1-bet-survive', lines: [
    {text: 'รอดมั้ย?', y: 1420, size: 230, accent: true, x: 520}], layout: BOTTOM(RING('#ffd21f'))},
  {...CV, id: 'C2-you-believe', lines: [
    {text: 'ถ้าเป็นคุณ', y: 1260, size: 150, x: 520},
    {text: 'เชื่อมั้ย?', y: 1450, size: 200, accent: true, x: 520}], layout: BOTTOM()},
  {...CV, id: 'C3-extreme-2banks', lines: [
    {text: '2 ธนาคาร', y: 1270, size: 190, accent: true, x: 520},
    {text: 'ไม่ใส่หน้ากาก', y: 1440, size: 140, x: 520}], layout: BOTTOM()},
  {...CV, id: 'C4-wrong-recipe', lines: [
    {text: 'สูตรเพื่อน', y: 350, size: 105, accent: true, x: 670, rotate: -4, look: STICKER},
    {text: 'ผิดตรงไหน?', y: 1430, size: 160, accent: true, x: 500}], layout: BOTTOM(RING(RED))},
  {...CV, id: 'C5-contra-invisible', lines: [
    {text: 'ทามะนาว', y: 1260, size: 170, x: 520},
    {text: 'ล่องหน?!', y: 1450, size: 220, accent: true, x: 520}], layout: BOTTOM()},
];
