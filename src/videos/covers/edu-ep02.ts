import type {Cover, CoverLook, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP02-SHORT-COVERS: five cover candidates (docs/cover-principles.md, CV01-CV10) for the onion Short (EDU-SCRIPT-R1.1,
 * the hook "หัวหอมไม่ได้ทำให้คุณร้องไห้ จนกว่าคุณจะทำร้ายมันก่อน"). Plates are the episode's registry plates `EDU2-<shot id>`
 * (CV07); `local` is the shot-local frame. Thai copy uses only what the narration says (CV04): the tears are real in the
 * story, the trick "ใส่แว่นว่ายน้ำ" is shown as an informal try (the script's own hedge), the alarm is the narration's
 * comparison (L-line "สัญญาณกันขโมยของหัวหอม"). Text centred on x 540, inside y 240-1680, last baseline <= 1470 (CV06).
 * Headlines are size 192 (Thai consonant body >= 135 px = 7% of 1920, CV02) at wdth 80, so each headline is at most about
 * ten Thai characters to fit the width (x 120-960).
 */
const HEAD: CoverLook = {stretch: 80};

export const EDU2_COVERS: Cover[] = [
  // A question. S01-B05-SH01 l40: she wipes her tears, a chalk "?" over her head (the episode's question).
  {id: 'A-question', plate: 'EDU2-S01-B05-SH01', local: 40, lines: [{text: 'ทำไมร้องไห้?', y: 1340, size: 192, accent: true, look: HEAD}, {text: 'ตอนหั่นหอม', y: 1470, size: 92}]},
  // B subject. S01-B01-SH01 l30: the whole onion on the board, calm; the hook's "หัวหอมไม่ได้ทำให้คุณร้องไห้".
  {id: 'B-onion', plate: 'EDU2-S01-B01-SH01', local: 30, lines: [{text: 'หัวหอมไม่ผิด', y: 1340, size: 192, accent: true, look: HEAD}, {text: 'จนกว่าจะหั่นมัน', y: 1470, size: 92}]},
  // C face. S01-B04-SH03 l40: deadpan with cartoon tears running down, the knife still in her hand.
  {id: 'C-face', plate: 'EDU2-S01-B04-SH03', local: 40, lines: [{text: 'ร้องไม่หยุด', y: 1340, size: 192, accent: true, look: HEAD}, {text: 'แค่หั่นหอม', y: 1470, size: 92}]},
  // D impossible detail. S01-B07-SH02 l65: the chalk alarm bell drawn over the onion (the L-line comparison).
  {id: 'D-alarm', plate: 'EDU2-S01-B07-SH02', local: 65, lines: [{text: 'สัญญาณเตือน', y: 1340, size: 192, accent: true, look: HEAD}, {text: 'ของหัวหอม', y: 1470, size: 92}]},
  // E trick (swap for the number angle: the script has no number, see the note above). S01-B06-SH02 l45: the swimming goggles on.
  {id: 'E-goggles', plate: 'EDU2-S01-B06-SH02', local: 45, lines: [{text: 'แว่นว่ายน้ำ', y: 1340, size: 192, accent: true, look: HEAD}, {text: 'ลองเองแบบนี้', y: 1470, size: 92}]},
];

/** Onion-gold accent from the kitchen palette; scrim from y 1120 for the pale wall and board plates (as EP01). */
export const EDU2_COVER_STYLE: CoverStyle = {accent: '#f5b041', scrimY: 1120};

/**
 * EDU-EP02-SHORT-V2-COVERS: five candidates in the new approach (.agents/skills/cover-design, first run EDU6_COVERS_V2).
 * Inputs: script EDU-SCRIPT-R1.1, fact-check W1.3 (all lines supported; L15 qualified), scene sheets SS-R3, plates as
 * measured from the archived render 69f500eea03f-dirty-202611051824.
 * Promise: the viewer learns why cutting an onion makes them cry (L06-L08) and what helps most (L14).
 * Gaps: (1) what floats up into the eye? -> L07-L08; (2) why do the eyes run, she is not sad -> L08-L09;
 *   (3) does bread in the mouth help? -> L11; (4) what happens when the two things in the cell meet? -> L07;
 *   (5) does slow cutting help? -> L16 (droplets only, never "no tears").
 * Never shown: the goggles (L14 payoff, image or word "แว่นว่ายน้ำ"), the word "แก๊ส" as the answer, the alarm metaphor (L18).
 * Layouts: N1/N2 headline in the top band with a top edge grade; N3 bottom-middle band with a bottom edge; N4 left-aligned
 * tilted text over the torso; N5 middle band with a two-part diagram. `ภาพจำลอง` tag kept on the illustrated plates (rule 5).
 */
const RED = '#ff5a4e';
const GOLD = '#f5b041';
const INK = '#0b0d16';
const TOP = {edge: {side: 'top' as const, size: 820, opacity: 0.85}};
const BOTTOM = {edge: {side: 'bottom' as const, size: 1000, opacity: 0.85}};
const TAG = {kind: 'text' as const, text: 'ภาพจำลอง', x: 60, y: 262, size: 42, anchor: 'start' as const, weight: 800, fill: '#f4efe6', stroke: INK, sw: 6};

export const EDU2_COVERS_V2: Cover[] = [
  // N1 odd view. S01-B04-SH02 eye macro with the lilac wisp below (L08 "แก๊สลอยขึ้นมาถึงผิวตา"); payoff L07-L08.
  {id: 'N1-eye', plate: 'EDU2-S01-B04-SH02', local: 47, scrim: false,
    lines: [{text: 'อะไรลอย', y: 450, size: 170}, {text: 'เข้าตา?', y: 620, size: 170, accent: true}],
    layout: {grade: {...TOP, vignette: 0.35, tint: {color: '#8a6fd1', opacity: 0.15, blend: 'color'}}, elements: [
      TAG,
      {kind: 'path', d: 'M330 1560C250 1400 300 1220 420 1110', stroke: INK, sw: 26, linecap: 'round'},
      {kind: 'path', d: 'M330 1560C250 1400 300 1220 420 1110', stroke: GOLD, sw: 13, linecap: 'round'},
      {kind: 'path', d: 'M350 1100L425 1105L405 1180', stroke: INK, sw: 26, linecap: 'round'},
      {kind: 'path', d: 'M350 1100L425 1105L405 1180', stroke: GOLD, sw: 13, linecap: 'round'},
    ]}},
  // N2 wrong/right. S01-B05-SH02 bread in her mouth, still crying (L10-L11); red sticker, bread circled; payoff L11.
  {id: 'N2-bread', plate: 'EDU2-S01-B05-SH02', local: 62, scrim: false,
    lines: [{text: 'คาบขนมปัง?', y: 400, size: 140, accent: true}, {text: 'เคล็ดลับที่เขาว่ากัน', y: 530, size: 84}],
    look: {label: {color: RED, ink: '#ffffff', pad: 0.42}},
    layout: {grade: TOP, elements: [
      {kind: 'ellipse', cx: 530, cy: 860, rx: 150, ry: 130, stroke: INK, sw: 24},
      {kind: 'ellipse', cx: 530, cy: 860, rx: 150, ry: 130, stroke: RED, sw: 12},
    ]}},
  // N3 try this. S01-B06-SH04 knife over the whole onions, first frames (L16 "การหั่นช้า ๆ"); arrow = the slow cut; payoff L16.
  {id: 'N3-slow', plate: 'EDU2-S01-B06-SH04', local: 15, scrim: false,
    lines: [{text: 'หั่นช้า ๆ', y: 1220, size: 180, accent: true}, {text: 'ช่วยได้ไหม?', y: 1380, size: 120}],
    layout: {grade: BOTTOM, elements: [
      {kind: 'path', d: 'M400 230C470 320 480 420 450 520M395 455L450 525L510 465', stroke: INK, sw: 26, linecap: 'round'},
      {kind: 'path', d: 'M400 230C470 320 480 420 450 520M395 455L450 525L510 465', stroke: GOLD, sw: 13, linecap: 'round'},
    ]}},
  // N4 subject question. S01-B01-SH03 the wail, tears on both cheeks (L09 "ไม่ได้ซึ้งนะ"); tears circled; payoff L08-L09.
  {id: 'N4-wail', plate: 'EDU2-S01-B01-SH03', local: 34, scrim: false,
    lines: [{text: 'ไม่ได้ซึ้งนะ', y: 1180, size: 150, accent: true, x: 90, anchor: 'start', rotate: -5}, {text: 'แล้วร้องทำไม?', y: 1330, size: 120, x: 110, anchor: 'start', rotate: -5}],
    layout: {grade: {vignette: 0.5, edge: {side: 'bottom', size: 900, opacity: 0.7}}, elements: [
      {kind: 'ellipse', cx: 440, cy: 690, rx: 250, ry: 120, stroke: INK, sw: 24},
      {kind: 'ellipse', cx: 440, cy: 690, rx: 250, ry: 120, stroke: GOLD, sw: 12},
    ]}},
  // N5 number. S01-B03-SH01 inside the cell, the two parts apart (L06 "แยกกันอยู่", L07 "ทั้งสองก็เจอกัน"); payoff L07.
  {id: 'N5-two', plate: 'EDU2-S01-B03-SH01', local: 116, scrim: false,
    lines: [{text: 'ถ้า 2 ตัวนี้', y: 1080, size: 170, accent: true}, {text: 'เจอกัน…?', y: 1240, size: 140}],
    layout: {grade: {edge: {side: 'bottom', size: 1250, opacity: 0.8}}, elements: [
      TAG,
      {kind: 'ellipse', cx: 420, cy: 500, rx: 190, ry: 150, stroke: INK, sw: 24},
      {kind: 'ellipse', cx: 420, cy: 500, rx: 190, ry: 150, stroke: GOLD, sw: 12},
      {kind: 'ellipse', cx: 790, cy: 470, rx: 170, ry: 120, stroke: INK, sw: 24},
      {kind: 'ellipse', cx: 790, cy: 470, rx: 170, ry: 120, stroke: GOLD, sw: 12},
      {kind: 'text', text: '1', x: 300, y: 740, size: 110, anchor: 'middle', weight: 800, fill: GOLD, stroke: INK, sw: 8},
      {kind: 'text', text: '2', x: 900, y: 690, size: 110, anchor: 'middle', weight: 800, fill: GOLD, stroke: INK, sw: 8},
    ]}},
];
