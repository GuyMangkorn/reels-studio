import type {Cover, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP07-SHORT-PIC-COVERS: cover pick 1 (cover-design skill, two-pick flow; docs/cover-principles.md CV01-CV10) for the
 * "if the Sun vanished" Short (title "ถ้าดวงอาทิตย์หายไปตอนนี้", script R1.1, fact-check R1.1 pass, EDU-EP07-SHEETS-R1.1).
 * Five pictures without text, one picture idea each, every plate the episode's registry plate `EDU7-<shot id>` (CV07);
 * `local` is the shot-local frame (>= 15, COVER_STILL).
 *
 * Promise: the viewer learns that sunlight needs about 8 min 20 s to reach Earth, so we would not know the Sun had gone
 * for about 8 minutes (L01, paid at L03; applied to the present at L14).
 * Gaps (question -> answer line):
 *   1. Would we notice at once if the Sun vanished? -> L01, L03 (not for ~8 min 20 s; the light is still on its way).
 *   2. Would Earth fly off straight away? -> L05 (it keeps curving, per Einstein), L09 (then it goes straight).
 *   3. How can anyone know gravity is that fast? -> L06-L07 (2017 neutron-star waves, under 2 s from the light).
 *   4. What goes dark first, and what stays lit? -> L08, L10 (sky, then the Moon), L11-L12 (Jupiter, an hour or more).
 *   5. Is the sunlight on you right now already old? -> L14 (it left the Sun about 8 minutes ago).
 * Never shown (CV04): the arrival at 00:00 (dark sky L08, Earth leaving on the tangent L09, the Moon going out L10),
 *   Jupiter still lit (L11-L12) and the twist that the sunlight on your skin is 8 minutes old (L14, the lit-arm close
 *   S01-B05-SH02). The only number on any picture is the plate's own countdown card (P1, P3, P4; 08:10-07:17), the setup
 *   cue of L03, never the 00:00 arrival; no number is drawn by the cover.
 * Headline band for pick 2: the top band (y 300-700) under a dark top edge on every candidate.
 */
const TOP = {edge: {side: 'top' as const, size: 820, opacity: 0.85}};
const ACCENT = '#ffb347';
const INK = '#0b0d16';

export const EDU7_PICS: Cover[] = [
  // P1 subject close: VEN, the pestle raised over the mortar, grinning while the countdown runs (D02, card 07:17).
  {id: 'P1-pestle', plate: 'EDU7-S01-B02-SH03', local: 33, scrim: false, lines: [], layout: {grade: TOP}},
  // P2 odd view: from space, the Sun's last glow the frame after it blinks out (L01 "หายไปตอนนี้"), Earth still lit; a
  // dashed ring at the Sun's disc size marks the missing Sun (glow centre measured at (416, 848)).
  {id: 'P2-lastglow', plate: 'EDU7-S01-B01-SH02', local: 15, scrim: false, lines: [],
    layout: {grade: {vignette: 0.45, edge: {side: 'top', size: 600, opacity: 0.6}}, elements: [
      {kind: 'ellipse', cx: 418, cy: 850, rx: 105, ry: 105, stroke: INK, sw: 20, dash: '26 18'},
      {kind: 'ellipse', cx: 418, cy: 850, rx: 105, ry: 105, stroke: ACCENT, sw: 10, dash: '26 18'},
    ]}},
  // P3 face and emotion: CUS wipes the sweat in the sun, oblivious, the countdown above him (D01 "ร้อนจังวันนี้").
  {id: 'P3-hot', plate: 'EDU7-S01-B02-SH02', local: 38, scrim: false, lines: [], layout: {grade: TOP}},
  // P4 action, the count: two worlds at once, empty space above, the street in full sun below, the card counting (L03).
  {id: 'P4-count', plate: 'EDU7-S01-B02-SH01', local: 30, scrim: false, lines: [], layout: {grade: TOP}},
  // P5 diagram: the empty spot circled, an arrow along the light stream to the still-lit Earth (L01b-L02, the news on its way).
  {id: 'P5-path', plate: 'EDU7-S01-B01-SH02', local: 100, scrim: false, lines: [], layout: {grade: TOP, elements: [
    {kind: 'ellipse', cx: 432, cy: 852, rx: 70, ry: 70, stroke: INK, sw: 24},
    {kind: 'ellipse', cx: 432, cy: 852, rx: 70, ry: 70, stroke: ACCENT, sw: 12},
    {kind: 'path', d: 'M475 915L575 1065M575 1065L535 1052M575 1065L572 1023', stroke: INK, sw: 26, linecap: 'round'},
    {kind: 'path', d: 'M475 915L575 1065M575 1065L535 1052M575 1065L572 1023', stroke: ACCENT, sw: 12, linecap: 'round'},
  ]}},
];

/**
 * EDU-EP07-SHORT-COVERS: cover pick 2 on the picture the user picked in pick 1 (P3-hot, 8 Nov 2026): five texts, one
 * text angle each, same plate and frame (EDU7-S01-B02-SH02 @ 38). The plate's own countdown card (07:37) stays; it is the
 * L03 setup cue, not the payoff. Copy from the film only (L01 "ยังไม่รู้ตัว… 8 นาที", D01 "ร้อน", L08 "นาฬิกา… มืดลง");
 * hedges as questions. Never shown: the 00:00 arrival, Jupiter and the L14 twist (sunlight on you is 8 minutes old).
 * Subject measured on the render: CUS head x 400-680, y 540-840; card x 700-1020, y 160-280.
 */
const HOT = {plate: 'EDU7-S01-B02-SH02', local: 38, scrim: false as const};
const RED = '#ff5a4e';
export const EDU7_COVERS: Cover[] = [
  // T1 misconception (the belief L01 corrects: "ยังไม่รู้ตัวไปอีก 8 นาที"), red sticker on the wrong idea.
  {id: 'T1-instant', ...HOT, lines: [{text: 'หายปุ๊บ', y: 380, size: 140}, {text: 'มืดปั๊บ?', y: 530, size: 140, accent: true}],
    look: {label: {color: RED, ink: '#ffffff', pad: 0.42}}, layout: {grade: TOP}},
  // T2 question about what the picture shows (D01 "ร้อนจังวันนี้" under the countdown; answer L03).
  {id: 'T2-stillhot', ...HOT, lines: [{text: 'ทำไมเขา', y: 375, size: 120}, {text: 'ยังร้อนอยู่?', y: 515, size: 150, accent: true}],
    layout: {grade: TOP}},
  // T3 imagined view: if he saw the clock (L08 "พอนาฬิกาถึงศูนย์"); left-aligned, an arrow to the plate's card.
  {id: 'T3-clock', ...HOT, lines: [{text: 'ถ้าเขาเห็น', y: 395, size: 130, x: 70, anchor: 'start'}, {text: 'นาฬิกานี้?', y: 530, size: 140, accent: true, x: 70, anchor: 'start'}],
    layout: {grade: TOP, elements: [
      {kind: 'path', d: 'M650 345L765 292M765 292L722 291M765 292L745 330', stroke: INK, sw: 26, linecap: 'round'},
      {kind: 'path', d: 'M650 345L765 292M765 292L722 291M765 292L745 330', stroke: ACCENT, sw: 12, linecap: 'round'},
    ]}},
  // T4 try this: guess the count (the card counts down to dark, L03 -> L08), headline low on the pavement.
  {id: 'T4-guess', ...HOT, lines: [{text: 'ลองเดาดู', y: 1380, size: 120}, {text: 'กี่นาทีมืด?', y: 1520, size: 150, accent: true}],
    layout: {grade: {edge: {side: 'bottom', size: 800, opacity: 0.85}}}},
  // T5 number: the hook's 8 minutes (L01), the setup, not the L14 twist.
  {id: 'T5-eight', ...HOT, lines: [{text: 'อีก 8 นาที', y: 420, size: 170, accent: true}, {text: 'ถึงจะรู้ตัว?', y: 540, size: 120}],
    layout: {grade: TOP}},
];

/** Sun-halo amber accent (brief palette `#ffb347`, the Sun before it vanishes). No scrim: pick 1 is text-free. */
export const EDU7_COVER_STYLE: CoverStyle = {accent: ACCENT};
