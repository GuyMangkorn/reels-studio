import type {Cover, CoverStyle} from '../cover-overlay';

/**
 * EG-EP02-SHORT-COVERS: five cover candidates (docs/cover-principles.md, CV01-CV10). Plates are EP02 shots
 * (`EG2-<shot id>`, eg2PlateId); `local` is the frame inside that shot. Only S01-S03 plates are used: none shows
 * the poster, the hoodie on it, the crowd or the mother (CV04: the reveal is in S04-S05). Story has no face, so C is
 * the hooded figure from behind. Text stays inside y 240-1680, bottom line baseline <= 1460 (clear of the bottom 20%),
 * centred at x 540 with widths well inside the right 120 px. Thai copy follows the script (R1.3): L01, L02, L06, L08, L10.
 */
export const EG2_COVERS: Cover[] = [
  // A question. S01-B01-SH01 (dawn Yaowarat, nobody; `you` not drawn), f100 = the hook line's `ยกเว้นคุณ`.
  {id: 'A-question', plate: 'EG2-S01-B01-SH01', local: 100, lines: [{text: 'คนทั้งเมืองไปไหน?', y: 1330, size: 108, accent: true}, {text: 'เหลือแค่คุณ', y: 1460, size: 90}]},
  // B object. S02-B01-SH03: the blank white sheet taped to the pole (L08), corner lifting.
  {id: 'B-sheet', plate: 'EG2-S02-B01-SH03', local: 60, lines: [{text: 'กระดาษขาวแผ่นนี้', y: 1330, size: 104, accent: true}, {text: 'ติดอยู่ทุกที่ที่คุณผ่าน', y: 1460, size: 80}]},
  // C figure from behind. S01-B01-SH02, f66: hood up (swap at f60), coral hoodie on the empty street.
  {id: 'C-hood', plate: 'EG2-S01-B01-SH02', local: 66, lines: [{text: 'ฮู้ดขึ้น', y: 1330, size: 170}, {text: 'ในเมืองที่ไม่มีใคร', y: 1460, size: 100, accent: true}]},
  // D mystery detail. S02-B01-SH01: fresh jasmine garland on the shrine ledge (L06), f40 = acceptance frame.
  {id: 'D-garland', plate: 'EG2-S02-B01-SH01', local: 40, lines: [{text: 'พวงมาลัยยังสด', y: 1330, size: 116, accent: true}, {text: 'ทั้งที่ไม่มีใครเลย', y: 1460, size: 86}]},
  // E fact/count. S03-B01-SH01: soi, lamp post with the stacked pile of sheets (L10), f140 = pile visible, not readable.
  {id: 'E-pile', plate: 'EG2-S03-B01-SH01', local: 140, lines: [{text: 'เสาไฟปากซอย', y: 1330, size: 140}, {text: 'กระดาษซ้อนกันหลายแผ่น', y: 1460, size: 84, accent: true}]},
];

export const EG2_COVER_STYLE: CoverStyle = {accent: '#ff7a52', scrimY: 1000};

/**
 * EG-EP02-SHORT-A-TYPE: cover A (same plate and frame, same Thai copy) in five lettering looks, research in
 * scripts/everyone-gone/ep02/cover-type-research.md. One family (Noto Sans Thai, variable), so the looks differ in
 * weight, width, stroke, shadow, glow, label and tracking. Text colours stay at three: cream, accent, dark outline (CV05).
 */
const A_LINES = (head: number, sub: number, headY = 1330, subY = 1460) => [
  {text: 'คนทั้งเมืองไปไหน?', y: headY, size: head, accent: true}, {text: 'เหลือแค่คุณ', y: subY, size: sub},
];
const A = {plate: 'EG2-S01-B01-SH01', local: 100};
export const EG2_A_TYPE: Cover[] = [
  // A1 heavy sticker: weight 900, thick dark stroke, hard drop shadow (the classic high-CTR thumbnail).
  {id: 'A1-sticker', ...A, lines: A_LINES(112, 92), look: {weight: 900, strokeRatio: 0.16, shadow: {dx: 0, dy: 9, color: '#000000'}}},
  // A2 condensed poster: wdth 62.5 so the headline can be much taller on one line; thin stroke, short accent rule.
  {id: 'A2-condensed', ...A, lines: A_LINES(158, 100, 1340, 1470), look: {weight: 900, stretch: 62.5, strokeRatio: 0.07, spacing: 0.01, rule: {color: '#ff7a52', w: 140, h: 8, y: 1372}}},
  // A3 whisper: medium weight, wide tracking, soft dark halo instead of a hard outline; quiet and eerie.
  {id: 'A3-whisper', ...A, lines: A_LINES(92, 78), look: {weight: 500, spacing: 0.06, strokeRatio: 0.05, glow: {color: '#0b0d16', blur: 14}}},
  // A4 label tape: headline dark ink on an accent sticker, sub-line cream with dark outline.
  {id: 'A4-label', ...A, lines: A_LINES(100, 88), look: {weight: 800, strokeRatio: 0.09, label: {color: '#ff7a52', ink: '#0b0d16', pad: 0.3}}},
  // A5 offset print: cream headline, accent hard offset shadow (misregistered ink), dark outline.
  {id: 'A5-offset', ...A, lines: A_LINES(110, 90), look: {weight: 800, strokeRatio: 0.1, accentFill: '#f4efe6', fill: '#f4efe6', shadow: {dx: 9, dy: 9, color: '#ff7a52'}}},
];

/**
 * EG-EP02-SHORT-A-LAYOUT: cover A (same plate, frame and Thai copy) in five layout tastes, research and recipes in
 * scripts/everyone-gone/ep02/cover-layout-research.md. Same family (Noto Sans Thai) and palette (cream, accent, dark);
 * the variants differ in where the text and subject sit, plate crop, grade and graphic elements (`layout`, cover-overlay.tsx).
 */
const INK = '#0b0d16'; const CREAM = '#f4efe6'; const ACC = '#ff7a52';
const AL = {plate: 'EG2-S01-B01-SH01', local: 100};
export const EG2_A_LAYOUT: Cover[] = [
  // L1 framed title card: plate inset in a dark paper frame, title above the window, film-title restraint (A24-quiet).
  {id: 'L1-titlecard', ...AL, scrim: false,
    lines: [{text: 'คนทั้งเมืองไปไหน?', y: 470, size: 90, accent: true}, {text: 'เหลือแค่คุณ', y: 580, size: 62}],
    look: {weight: 600, strokeRatio: 0, spacing: 0.02},
    layout: {plateMove: {x: 0, y: 0.02, scale: 1.2}, elements: [
      {kind: 'path', evenodd: true, under: true, fill: INK, d: 'M0 200H1080V1920H0Z M90 660H990V1400H90Z'},
      {kind: 'rect', x: 106, y: 676, w: 868, h: 708, stroke: CREAM, sw: 3, opacity: 0.7, under: true},
      {kind: 'rect', x: 480, y: 330, w: 120, h: 4, fill: ACC, under: true},
    ]}},
  // L2 vertical side column: text runs top to bottom down the left edge, the street and its vanishing point stay clear on the right.
  {id: 'L2-column', ...AL, scrim: false,
    lines: [{text: 'คนทั้งเมืองไปไหน?', x: 170, y: 330, size: 118, anchor: 'start', rotate: 90, accent: true}, {text: 'เหลือแค่คุณ', x: 450, y: 330, size: 82, anchor: 'start', rotate: 90}],
    look: {weight: 800, strokeRatio: 0.1},
    layout: {plateMove: {x: 0.05, y: 0, scale: 1.2}, grade: {edge: {side: 'left', size: 520, opacity: 0.85}, vignette: 0.35}}},
  // L3 CCTV: desaturated green-grey plate, scanlines, grain, vignette, REC and timestamp, headline split and stacked low-left.
  {id: 'L3-cctv', ...AL, scrim: false,
    lines: [{text: 'คนทั้งเมือง', x: 100, y: 1150, size: 150, anchor: 'start', accent: true}, {text: 'ไปไหน?', x: 100, y: 1300, size: 150, anchor: 'start', accent: true}, {text: 'เหลือแค่คุณ', x: 100, y: 1420, size: 84, anchor: 'start'}],
    look: {weight: 900, strokeRatio: 0.1},
    layout: {plateMove: {x: 0, y: 0.03, scale: 1.15},
      grade: {desat: 0.8, tint: {color: '#7fa890', opacity: 0.5, blend: 'multiply'}, vignette: 0.8, grain: 0.35, scanlines: 0.16, edge: {side: 'bottom', size: 700, opacity: 0.75}},
      elements: [
        {kind: 'path', d: 'M100 350V290H160M920 290H980V350M980 1480V1540H920M160 1540H100V1480', stroke: CREAM, sw: 6, opacity: 0.85},
        {kind: 'ellipse', cx: 140, cy: 360, rx: 14, ry: 14, fill: ACC},
        {kind: 'text', text: 'REC', x: 170, y: 376, size: 44, fill: CREAM, weight: 700, spacing: 0.12},
        {kind: 'text', text: 'CAM 02', x: 960, y: 376, size: 40, fill: CREAM, anchor: 'end', weight: 500, spacing: 0.1},
        {kind: 'text', text: '05:48:21', x: 960, y: 1500, size: 40, fill: CREAM, anchor: 'end', weight: 500, spacing: 0.1},
      ]}},
  // L4 evidence board: a hand-circled empty end of the street, an arrow and two paper slips; plate left clear.
  {id: 'L4-circle', ...AL, scrim: false,
    lines: [{text: 'คนทั้งเมืองไปไหน?', x: 495, y: 448, size: 92, rotate: -3, look: {fill: INK, accentFill: INK, strokeRatio: 0, weight: 900}, accent: true}, {text: 'เหลือแค่คุณ', x: 345, y: 1316, size: 76, rotate: 2}],
    look: {weight: 800, strokeRatio: 0.09},
    layout: {grade: {desat: 0.2, vignette: 0.35}, elements: [
      {kind: 'rect', x: 100, y: 340, w: 790, h: 170, fill: CREAM, transform: 'rotate(-3 495 425)', under: true},
      {kind: 'rect', x: 120, y: 322, w: 130, h: 44, fill: '#e3d5a8', opacity: 0.85, transform: 'rotate(-12 185 344)', under: true},
      {kind: 'rect', x: 740, y: 320, w: 130, h: 44, fill: '#e3d5a8', opacity: 0.85, transform: 'rotate(10 805 342)', under: true},
      {kind: 'rect', x: 100, y: 1240, w: 490, h: 110, fill: INK, transform: 'rotate(2 345 1295)', under: true},
      {kind: 'ellipse', cx: 548, cy: 905, rx: 172, ry: 128, stroke: ACC, sw: 12, dash: '1020 80', linecap: 'round', transform: 'rotate(-8 548 905)'},
      {kind: 'ellipse', cx: 546, cy: 908, rx: 182, ry: 136, stroke: ACC, sw: 6, opacity: 0.75, dash: '800 400', linecap: 'round', transform: 'rotate(18 546 908)'},
      {kind: 'path', d: 'M330 1230C300 1130 360 1060 430 1012M392 1032L432 1010L408 972', stroke: ACC, sw: 12, linecap: 'round'},
    ]}},
  // L5 Swiss poster in night blue: flush-left small question on a grid, one huge word (คุณ) across the street.
  {id: 'L5-bigword', ...AL, scrim: false,
    lines: [{text: 'คนทั้งเมืองไปไหน?', x: 90, y: 410, size: 66, anchor: 'start', look: {weight: 400, strokeRatio: 0.03}}, {text: 'เหลือแค่', x: 90, y: 1010, size: 110, anchor: 'start', look: {weight: 500, strokeRatio: 0.06}}, {text: 'คุณ', x: 70, y: 1420, size: 460, anchor: 'start', accent: true, look: {weight: 800, strokeRatio: 0.03, accentFill: '#f2c9a0'}}],
    layout: {plateMove: {x: 0, y: 0.05, scale: 1.2},
      grade: {desat: 0.92, tint: {color: '#2a3f86', opacity: 0.8, blend: 'multiply'}, vignette: 0.6, grain: 0.25},
      elements: [{kind: 'rect', x: 90, y: 340, w: 900, h: 3, fill: CREAM, opacity: 0.8}]}},
];
