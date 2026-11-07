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

/**
 * EDU-EP04-SHORT-V2-COVERS: five candidates in the new cover approach (.agents/skills/cover-design; research note
 * docs/research/2026-11-07-cover-thumbnail-principles.md, proposed). Script EDU-EP04-SCRIPT-R1.3, fact-check fact-check.md
 * (R1.1 verdicts + R1.2/R1.3 re-checks), sheets EDU-EP04-SHEETS-R1.4. Each candidate has its own layout and stop factor;
 * `scrim: false`, headline in a band with a dark `edge` grade behind it, one graphic cue where it helps.
 * - Promise: the viewer learns why the next queue always seems faster and why switching seems to backfire: the odds
 *   (L08-L10a), attention (L12-L14) and memory (L15-L16), and the one shared line that removes the choice (L17-L20).
 * - Gaps: is it just bad luck? (L06, answered L07-L10a); how often does your lane win? (L08-L09); does switching help?
 *   (L10); why does it feel like losing every time? (L11, answered L12-L14); why "ฉันซวยตลอด" sounds true (L15-L16).
 * - Never shown: the single shared queue and the calm end (L17-L20), the cracked stamp (L16 payoff), the tally marks.
 * Copy: only words said (L01, L02, L06, L08, L11) or on screen ("แบบจำลอง", "ซวยตลอด"); hedged lines end in a question mark;
 * "1/3" only on the plate's labelled model screen (Boat N5).
 */
const RED = '#ff5a4e';
const AMBER = '#f2c230';
const INK = '#0b0d16';
const TOP = {edge: {side: 'top' as const, size: 820, opacity: 0.85}};
const BOTTOM = {edge: {side: 'bottom' as const, size: 900, opacity: 0.8}};

export const EDU4_COVERS_V2: Cover[] = [
  // N1 wrong vs right. S01-B05-SH02 L55: the red "ซวยตลอด" stamp on his chest before the crack; red sticker L06 (payoff L07-L10a).
  {id: 'N1-luck', plate: 'EDU4-S01-B05-SH02', local: 55, scrim: false,
    lines: [{text: 'ไม่ใช่แค่ซวย', y: 480, size: 160, accent: true}],
    look: {label: {color: RED, ink: '#ffffff', pad: 0.42}},
    layout: {grade: TOP}},
  // N2 odd view. S01-B05-SH01 L60: the hot memory bubble over his head, cool tint and vignette; L11 question (payoff L12-L16).
  {id: 'N2-feel', plate: 'EDU4-S01-B05-SH01', local: 60, scrim: false,
    lines: [{text: 'ทำไมรู้สึก', y: 1330, size: 150}, {text: 'แพ้ทุกที?', y: 1490, size: 170, accent: true}],
    layout: {grade: {...BOTTOM, vignette: 0.4, tint: {color: '#3d5f9e', opacity: 0.35, blend: 'color'}}}},
  // N3 "you" action. S01-B04-SH02 L70: close on MAN, eyes cut sideways at the next lane, about to switch; L01 count (payoff L10).
  {id: 'N3-switch', plate: 'EDU4-S01-B04-SH02', local: 70, scrim: false,
    lines: [{text: 'เปลี่ยนแถว', y: 1330, size: 150, x: 90, anchor: 'start'}, {text: 'กี่ครั้ง?', y: 1500, size: 190, x: 90, anchor: 'start', accent: true}],
    layout: {grade: {edge: {side: 'bottom', size: 900, opacity: 0.9}, vignette: 0.25}, elements: [
      {kind: 'path', d: 'M800 660H930M885 615L935 660L885 705', stroke: INK, sw: 30, linecap: 'round'},
      {kind: 'path', d: 'M800 660H930M885 615L935 660L885 705', stroke: AMBER, sw: 16, linecap: 'round'},
    ]}},
  // N4 subject question. S01-B02-SH03 L30: the coins one by one on the lane he just joined, circled; L02 (payoff L07-L10a).
  {id: 'N4-coins', plate: 'EDU4-S01-B02-SH03', local: 30, scrim: false,
    lines: [{text: 'แถวที่คุณย้ายไป', y: 380, size: 104}, {text: 'ช้าทุกที?', y: 540, size: 176, accent: true}],
    layout: {grade: TOP, elements: [
      {kind: 'ellipse', cx: 580, cy: 860, rx: 150, ry: 80, stroke: INK, sw: 24},
      {kind: 'ellipse', cx: 580, cy: 860, rx: 150, ry: 80, stroke: AMBER, sw: 12},
    ]}},
  // N5 number. S01-B03-SH03 L75: the model screen, lane "คุณ" lit, "1/3 · แบบจำลอง" on the plate (L08); chip circled.
  {id: 'N5-third', plate: 'EDU4-S01-B03-SH03', local: 75, scrim: false,
    lines: [{text: 'แถวคุณ', y: 1340, size: 180, accent: true}, {text: 'เร็วที่สุด?', y: 1490, size: 120}],
    layout: {grade: BOTTOM, elements: [
      {kind: 'ellipse', cx: 416, cy: 588, rx: 110, ry: 60, stroke: INK, sw: 24},
      {kind: 'ellipse', cx: 416, cy: 588, rx: 110, ry: 60, stroke: AMBER, sw: 12},
    ]}},
];
