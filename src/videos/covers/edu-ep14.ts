import type {Cover, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP14-SHORT-PIC-COVERS: cover pick 1 (cover-design skill, two-pick flow; docs/cover-principles.md CV01-CV10) for the
 * no-air rain Short (title "ถ้าฝนตกโดยไม่มีอากาศ", script EDU-EP14-SCRIPT-R4, fact-check W1.3, storyboard
 * scripts/edu-series/ep14/storyboard.md). Five pictures without text, one picture idea each, every plate the episode's
 * registry plate `EDU14-<shot id>` (CV07); `local` is the shot-local frame (>= 15, COVER_STILL). The "ภาพจำลอง" tag and
 * the "แบบจำลอง" gauge are the plates' own screen layer: they keep the no-air world framed as a model.
 *
 * Promise: the viewer learns that with no air a raindrop from a cloud up to 2 km high would never stop speeding up and hit
 * at about 700 km/h, and that real air pushes back harder the faster it falls until the drop stops speeding up, so even the
 * biggest drops land at thirty-something km/h; the same push makes drops buns, not teardrops, and bursts big ones
 * (L01-L03, L05-L07, L10-L13; closed at L14-L15).
 * Gaps (question -> answer line):
 *   1. 700 km/h? Then why does real rain not hurt? -> L05-L06 (air pushes back until it matches the weight).
 *   2. Why would it get that fast? -> L02-L02b (a cloud up to 2 km high, nothing in the way).
 *   3. How fast does real rain land? -> L07 (the biggest drops, thirty-something km/h).
 *   4. Is a raindrop shaped like a teardrop? -> L10-L11 (no; a bun).
 *   5. Why is there no ball-sized raindrop? -> L12-L13 (the air hollows it and it bursts at about half a centimetre).
 * Never shown (CV04): the brake (B02-SH02 equal arrows, needle holding at 32), the real speed (B02-SH03 split gauge, the
 * rider), the shapes (B03 round ball and crossed teardrop, bun, B04 bag and burst) and the payoff palm pats (B05-SH02/SH03).
 * Frames: every `local` sits where no caption cue is on screen (src/videos/edu-ep14/cues.ts), because the plates' caption patch
 * (look.tsx `QuietPatches`, shot `calm`) dims a rectangle behind each live caption and would show as a dark box on a cover.
 * Headline band for pick 2: per candidate below. Pick 2 (EDU14_COVERS) is further down.
 */
const TOP = {edge: {side: 'top' as const, size: 760, opacity: 0.8}};
const ACCENT = '#ff4d3d';
const INK = '#0b0d16';
const ring = (cx: number, cy: number, r: number) => [
  {kind: 'ellipse' as const, cx, cy, rx: r, ry: r, stroke: INK, sw: 22},
  {kind: 'ellipse' as const, cx, cy, rx: r, ry: r, stroke: ACCENT, sw: 11},
];

export const EDU14_PICS: Cover[] = [
  // P1 subject close: the oversized no-air drop frozen beside an orange BB pellet, the beat before the sting (S01-B01-SH08,
  // L03 "เม็ดใหญ่ ๆ จะแสบเหมือนโดนบีบีกันยิง"; gaps 1, 5); ring on the drop so it, not the pellet, is the subject. Band: middle (y ~1150-1450, the calm grey under the pair).
  {id: 'P1-drop-vs-bb', plate: 'EDU14-S01-B01-SH08', local: 74, scrim: false, lines: [], layout: {grade: {vignette: 0.5}, elements: ring(324, 694, 135)}},
  // P2 odd view: seen by the falling drop, straight down at her upturned face, the gauge past 600 "แบบจำลอง"
  // (S01-B01-SH07, L02c, before the W700 slam); ring on her face. Band: top (under a dark top edge).
  {id: 'P2-drop-eye', plate: 'EDU14-S01-B01-SH07', local: 96, scrim: false, lines: [], layout: {grade: TOP, elements: ring(560, 975, 110)}},
  // P3 face and emotion: stung in the grey no-air world, eyes squeezed shut, clutching her forearm (S01-B01-SH09, V01
  // "โอ๊ย!"; gap 1: then why does real rain not hurt?). Band: top (under a dark top edge).
  {id: 'P3-stung', plate: 'EDU14-S01-B01-SH09', local: 32, scrim: false, lines: [], layout: {grade: TOP}},
  // P4 action: the real rain in colour, she puts her open hand out past the drip line (S01-B05-SH01, L14), the "would you"
  // moment before the palm pats (never shown). Band: top (under a dark top edge over the awning).
  {id: 'P4-hand-out', plate: 'EDU14-S01-B05-SH01', local: 84, scrim: false, lines: [], layout: {grade: TOP}},
  // P5 diagram: the cloud base "~2 กม." bracket with the dotted fall line to the bus-stop pin (S01-B01-SH05, L02 "สองกิโล";
  // gap 2); ring on the drop at the cloud base. Band: middle-right (y ~700-1100, right of the dotted line).
  {id: 'P5-two-km', plate: 'EDU14-S01-B01-SH05', local: 60, scrim: false, lines: [], layout: {grade: {vignette: 0.5}, elements: ring(531, 330, 70)}},
];

/**
 * EDU-EP14-SHORT-COVERS: cover pick 2 (cover-design skill section 3). The user picked P4 (action: real rain in colour, her
 * open hand out past the drip line, S01-B05-SH01 @ 84). Five text angles on the same plate and frame, each opening a
 * different gap; every word is said or shown in the film, model figures carry a question mark, and nothing names or draws
 * the brake, the real speed, the drop shapes or the palm pats (never shown, above). The title "ถ้าฝนตกโดยไม่มีอากาศ" is not
 * repeated. Headline band: top, over the awning and the grey sky (y ~240-520), under the dark top edge; her head top sits
 * at y ~525 (x ~510-760), so the last top baseline stays at or above y 500. Hand measured on the pick-1 still at about
 * (395, 950), face at about (545, 665). Channel mark top-left at y ~140.
 */
const P4 = {plate: 'EDU14-S01-B05-SH01', local: 84, scrim: false as const};
const P4_GRADE = {edge: {side: 'top' as const, size: 820, opacity: 0.88}};
/** Ring on her open hand (the "you" action cue). */
const HAND_RING = ring(400, 950, 92);

export const EDU14_COVERS: Cover[] = [
  // C1 misconception, red sticker: L10 "เม็ดฝนไม่ได้เป็นหยดน้ำตานะ" asked as the common belief (gap 4; the shape is never
  // drawn). Answer L10-L11.
  {id: 'C1-teardrop', ...P4, lines: [{text: 'เม็ดฝนเป็น', y: 350, size: 120}, {text: 'หยดน้ำตา?', y: 495, size: 128, accent: true}],
    look: {label: {color: ACCENT, ink: '#ffffff', pad: 0.42}}, layout: {grade: P4_GRADE}},
  // C2 try this / you: L15 "ตกใส่มือคุณ" with the open question of gap 3 ("เร็ว", L02b/L05); the real speed is never
  // written. Answer L07. Left-aligned, ring on her hand.
  {id: 'C2-your-hand', ...P4, lines: [{text: 'ตกใส่มือคุณ', y: 345, size: 126, x: 70, anchor: 'start'}, {text: 'เร็วแค่ไหน?', y: 495, size: 140, accent: true, x: 70, anchor: 'start'}],
    layout: {grade: P4_GRADE, elements: HAND_RING}},
  // C3 imagined view, one big word: imagine the no-air drop on this hand, "แสบ" (L03 "จะแสบเหมือนโดนบีบีกันยิง", V01 the
  // sting); gap 1 (then why does real rain not hurt?). Answer L05-L06. Ring on her hand.
  {id: 'C3-sting', ...P4, lines: [{text: 'แสบไหม?', y: 470, size: 230, accent: true}],
    layout: {grade: P4_GRADE, elements: HAND_RING}},
  // C4 question: L08 "ทำไมไม่มีเม็ดฝนใหญ่เท่าลูกบอลล่ะ" shortened (gap 5; the bag and burst never shown). Answer L12-L13.
  // Right-aligned two lines, the second in the accent.
  {id: 'C4-ball', ...P4, lines: [{text: 'ฝนเม็ดเท่า', y: 345, size: 132, x: 1000, anchor: 'end'}, {text: 'ลูกบอล?', y: 500, size: 158, accent: true, x: 1000, anchor: 'end'}],
    layout: {grade: P4_GRADE}},
  // C5 number: L01 "เร็วถึงราวเจ็ดร้อยกิโลต่อชั่วโมง", the no-air model value (gauge "แบบจำลอง"; "ราว" kept, question
  // mark for the model); gaps 1-2. Answer L02-L02c (why), L05-L07 (why not). Big number left, unit beside.
  {id: 'C5-700', ...P4, lines: [{text: 'ราว 700', y: 400, size: 200, accent: true, x: 60, anchor: 'start'}, {text: 'กม./ชม.?', y: 512, size: 116, x: 70, anchor: 'start'}],
    layout: {grade: P4_GRADE, elements: HAND_RING}},
];

/** No-air gauge red zone (the 600-700 arc). No scrim: pick 1 is text-free. */
export const EDU14_COVER_STYLE: CoverStyle = {accent: ACCENT};
