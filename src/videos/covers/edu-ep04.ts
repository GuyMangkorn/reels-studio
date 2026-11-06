import type {Cover, CoverLook, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP04-SHORT-COVERS: five cover candidates (docs/cover-principles.md, CV01-CV10) for the checkout-queue Short (C4,
 * EDU-EP04-SCRIPT-R1.3, sheets EDU-EP04-SHEETS-R1.4; title "ทำไมแถวข้าง ๆ เร็วกว่าเสมอ", never repeated on a cover, CV02).
 * Plates are the episode's registry plates `EDU4-<shot id>` (CV07); `local` is the shot-local frame. Thai copy uses only what
 * the script says or shows (CV04): MAN's own line L03, the silent coin gag, the "ซวยตลอด" stamp (L16) before it cracks, the
 * "1/3 · แบบจำลอง" model screen (L08). No cover shows the payoff (attention/memory, the single shared queue, the calm end).
 * Text centred on x 540, inside y 240-1680, last baseline <= 1470 (clear of the bottom 20%), widths inside x 120-960 (right
 * 120 px clear). Headlines at wdth 80, size >= 176 (Thai consonant body >= 135 px = 7% of 1920, CV02), as EP01/EP02 (CV08).
 */
const HEAD: CoverLook = {stretch: 80};

export const EDU4_COVERS: Cover[] = [
  // A question. S01-B02-SH04 L38: sulk hold after the second switch, both other lanes moved on behind him (L05 "อ้าว…").
  {id: 'A-question', plate: 'EDU4-S01-B02-SH04', local: 38, lines: [{text: 'ย้ายดีไหม?', y: 1340, size: 200, accent: true, look: HEAD}, {text: 'ย้ายทีไร ช้าทุกที', y: 1470, size: 92}]},
  // B subject. S01-B02-SH03 L30: the silent gag, the grandmother counting coins onto the belt of the lane he just joined.
  {id: 'B-coins', plate: 'EDU4-S01-B02-SH03', local: 30, lines: [{text: 'ทีละเหรียญ', y: 1340, size: 192, accent: true, look: HEAD}, {text: 'แถวที่เพิ่งย้ายมา', y: 1470, size: 92}]},
  // C face. S01-B04-SH02 L70: close on MAN, eyes cut sideways at the next lane; headline asks his L03 line back ("แถวนั้นไปเร็วกว่า…").
  {id: 'C-face', plate: 'EDU4-S01-B04-SH02', local: 70, lines: [{text: 'เร็วกว่า?', y: 1340, size: 200, accent: true, look: HEAD}, {text: 'แถวนั้นน่ะเหรอ', y: 1470, size: 92}]},
  // D mystery. S01-B05-SH02 L55: the red "ซวยตลอด" stamp on his chest, before the crack at L 80 (the answer stays in the video).
  {id: 'D-stamp', plate: 'EDU4-S01-B05-SH02', local: 55, lines: [{text: 'จริงเหรอ?', y: 1340, size: 200, accent: true, look: HEAD}, {text: 'ที่ว่าซวยตลอด', y: 1470, size: 92}]},
  // E number. S01-B03-SH03 L75: the model screen, lane "คุณ" lit, "1/3 · แบบจำลอง" (L08); the label stays on the plate.
  {id: 'E-number', plate: 'EDU4-S01-B03-SH03', local: 75, lines: [{text: 'แถวคุณ…', y: 1340, size: 200, accent: true, look: HEAD}, {text: 'ชนะกี่ครั้ง?', y: 1470, size: 92}]},
];

/** Lane-2 amber accent (the yellow floor line of his lane and the "คุณ" lane glow, #f2c230); scrim from y 1120 for the pale floor and paper plates (as EP01/EP02). */
export const EDU4_COVER_STYLE: CoverStyle = {accent: '#f2c230', scrimY: 1120};
