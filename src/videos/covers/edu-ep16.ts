import type {Cover, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP16-SHORT-PIC-COVERS: cover pick 1 (cover-design skill, two-pick flow; docs/cover-principles.md CV01-CV10) for the
 * Dark Forest Short "ป่าเงียบ" (C67; script EDU-EP16-SCRIPT-R3, Boat W1.3 recheck on R3; storyboard scripts/edu-series/ep16/
 * storyboard.md, 1800 f shot map). Five pictures without text, one picture idea each, every plate the episode's registry
 * plate `EDU16-<shot id>` (CV07); `local` is the shot-local frame (>= 15, COVER_STILL). The "ภาพจำลอง" label and captions
 * are the timeline's, not the plates', so none shows here; pick 2 adds a small "ภาพจำลอง" tag to any imagination plate
 * (P1, P4, P5) so the cover keeps the script's dramatization framing (O2).
 *
 * Promise: the viewer learns why the smart move on hearing a voice from the stars may be to stay silent ("ไม่รู้ใจกัน… ก็ต้อง
 * เงียบไว้ก่อน", L08 + L11) and that a silent sky could mean an empty forest or one holding its breath (L15-L16).
 * Gaps (question -> answer line):
 *   1. A signal from aliens: why not reply? -> L02 tease, V01 asks it, L08 + L11 answer.
 *   2. What if they are kind? -> L03 you can't know; L07 they can't know you are kind either.
 *   3. Just ask them? -> L04-L05 tens of light-years: you are grey before the answer.
 *   4. Who would dare send one? -> L18 asks, L13 answers (someone who doesn't know yet, like you a minute ago).
 *   5. So why is the real sky silent? -> L15-L16.
 * Never shown (CV04): the strike on her light (W-STRIKE, SH15S), the flat line (W-STOP, SH11), her hand drawn back and the
 * lamp clicked off (W-OFF, SH20-SH21), the dark roof and final sky (SH22-SH23), the night forest (SH18), the logbook's last
 * "เงียบ"; no words "ป่ามืด", "ทฤษฎี", star name or number.
 * Headline band for pick 2: per candidate below. Channel mark @TamMaiLa top-left (coversVideo chrome).
 */
const ACCENT = '#ffb35a'; // her amber light (palette.ts amber)
const INK = '#0b0d16';
/** Dashed distance line from her light (539, 1137) up to the far star (599, 297), measured on the round-1 still, with rings
 * at both ends; dark under-stroke so it survives the black ground. Stops short of both lights so they stay the brightest points. */
const DISTANCE = [INK, ACCENT].map((stroke, i) => ({kind: 'path' as const,
  d: 'M 543 1068 L 595 366', stroke, sw: i ? 9 : 20, dash: i ? '30 22' : undefined,
  linecap: 'round' as const}));
/** Rings on both ends (round 3, F1/F3 lift): amber on her light, cold on the star. */
const ENDS = [[539, 1137, '#ffb35a'], [599, 297, '#bfeaff']].flatMap(([cx, cy, c]) => [
  {kind: 'ellipse' as const, cx: cx as number, cy: cy as number, rx: 62, ry: 62, stroke: INK, sw: 20},
  {kind: 'ellipse' as const, cx: cx as number, cy: cy as number, rx: 62, ry: 62, stroke: c as string, sw: 9}]);

export const EDU16_PICS: Cover[] = [
  // P1 odd view (horror): inside her thought, the grown monster (crown of pinpoint eyes, too-long arm) rises from the far
  // light over her small amber light, arm rising, before the strike; local 70 keeps the eye crown mid-frame (y ~600; local 86-100 put it at y ~160-170, outside the 3:4 crop), claws reaching for her light (S01-B04-SH15 L10 "อาจโตจนแซงคุณไปแล้ว"; gaps 2, 4).
  // Band: bottom (y ~1250-1540, dark bubble ground under her light).
  {id: 'P1-giant-over-light', plate: 'EDU16-S01-B04-SH15', local: 70, scrim: false, lines: [], layout: {grade: {vignette: 0.45}}},
  // P2 face and emotion: her face just after the imagined strike, alive, lamp-lit, brows up, uneasy, gaze at the viewer
  // (S01-B05-SH16 L08 a; gaps 1, 2). Band: top (y ~240-560, dark city sky over the headphones).
  {id: 'P2-uneasy-face', plate: 'EDU16-S01-B05-SH16', local: 24, scrim: false, lines: [], layout: {grade: {vignette: 0.4, edge: {side: 'top', size: 620, opacity: 0.55}}}},
  // P3 action: macro, her finger 1 cm above the red reply button (S01-B01-SH03 L02 "อย่าเพิ่งตอบนะ"; gap 1). Band: bottom
  // (y ~1250-1540, dark roof under the box).
  {id: 'P3-finger-button', plate: 'EDU16-S01-B01-SH03', local: 30, scrim: false, lines: [], layout: {grade: {vignette: 0.45}}},
  // P4 diagram: her one small amber light at the bottom and one far cold star at the top of a tall black sky (S01-B02-SH06
  // IM1, end of the tilt, L04 "ไกลหลายสิบปีแสง"; gap 3). A dashed amber distance line joins an amber ring on her light and a cold ring on the star (the cue). Band: middle
  // (y ~700-1100, black between the two lights).
  {id: 'P4-light-and-star', plate: 'EDU16-S01-B02-SH06', local: 70, scrim: false, lines: [], layout: {grade: {vignette: 0.35}, elements: [...DISTANCE, ...ENDS]}},
  // P5 subject close: her face aged grey before the reply comes back, the bead still on its way (S01-B02-SH07 IM1, L05
  // "คุณก็ผมหงอกแล้ว"; gap 3). Band: top (y ~240-520, dark bubble ground over her head).
  {id: 'P5-aged-face', plate: 'EDU16-S01-B02-SH07', local: 80, scrim: false, lines: [], layout: {grade: {vignette: 0.4}}},
];

export const EDU16_COVER_STYLE: CoverStyle = {accent: ACCENT};

/**
 * EDU-EP16-SHORT-COVERS: cover pick 2. User picked P1 (giant over her small light, 2026-11-15; step-1 still
 * out/EDU-EP16-SHORT/cover/step1/c1.png). Five text angles on the same plate and frame, headline band bottom (baselines
 * y ~1345-1530, dark bubble ground under her light, last baseline above 1540), every line inside x < 960. Every word is
 * spoken in the film (line ID per candidate); the "ภาพจำลอง" tag keeps the imagination framing (script O2), as on the plate
 * in the film. Title "ป่าเงียบ: ทำไมคนฉลาดถึงไม่ตอบ" is not repeated. Never shown: the strike and what follows (header above).
 */
const P1 = {plate: EDU16_PICS[0].plate, local: EDU16_PICS[0].local, scrim: false as const};
const LABEL = {label: {color: ACCENT, ink: INK, pad: 0.42}};
/** Small "ภาพจำลอง" tag on a dark pill under the channel mark, inside the 3:4 crop (y > 240), left of the far light's halo. */
const TAG = [
  {kind: 'path' as const, d: 'M 120 252 L 282 252 Q 306 252 306 276 L 306 282 Q 306 306 282 306 L 120 306 Q 96 306 96 282 L 96 276 Q 96 252 120 252 Z', fill: INK, opacity: 0.8},
  {kind: 'text' as const, text: 'ภาพจำลอง', x: 201, y: 292, size: 38, anchor: 'middle' as const, fill: '#f4efe6', weight: 700}];
const C_LAYOUT = {grade: {vignette: 0.45, edge: {side: 'bottom' as const, size: 820, opacity: 0.6}}, elements: TAG};

export const EDU16_COVERS: Cover[] = [
  // T1 misconception: L02 "อย่าเพิ่งตอบนะ", the counter-intuitive order against the natural urge to reply (gap 1; answer
  // L08 + L11). Sticker on the accent line.
  {...P1, id: 'T1-dont-reply', lines: [{text: 'อย่าเพิ่ง', y: 1345, size: 170}, {text: 'ตอบนะ', y: 1530, size: 185, accent: true}],
    look: LABEL, layout: C_LAYOUT},
  // T2 question: V01 "ถ้าเขาใจดีล่ะ?", her own objection, read against the monster (gap 2; answer L03 + L07).
  {...P1, id: 'T2-if-kind', lines: [{text: 'ถ้าเขา', y: 1345, size: 180}, {text: 'ใจดีล่ะ?', y: 1530, size: 190, accent: true}],
    layout: C_LAYOUT},
  // T3 imagined view (the other side): L07 "ต่อให้คุณใจดี เขาก็ไม่รู้" (gap 2; answer L07-L08). Left-aligned.
  {...P1, id: 'T3-they-dont-know', lines: [{text: 'คุณใจดี', y: 1340, size: 175, x: 80, anchor: 'start'}, {text: 'เขาก็ไม่รู้', y: 1530, size: 180, accent: true, x: 80, anchor: 'start'}],
    layout: C_LAYOUT},
  // T4 try this / you: L05 "ทักไปหนึ่งคำ…" (the one word you send; gap 1/3; answer L05, L10, L08).
  {...P1, id: 'T4-one-word', lines: [{text: 'ทักไป', y: 1345, size: 185}, {text: 'หนึ่งคำ…', y: 1530, size: 175, accent: true}],
    look: LABEL, layout: C_LAYOUT},
  // T5 number: L09 "ระหว่างรอคำตอบหลายสิบปี" with L10's head start, the wait in which the far one grows (gap 3; answer L09-L10).
  {...P1, id: 'T5-decades', lines: [{text: 'รอคำตอบ', y: 1345, size: 165}, {text: 'หลายสิบปี', y: 1530, size: 175, accent: true}],
    layout: C_LAYOUT},
];

/**
 * EDU-EP16-SHORT-V2-COVERS: cover pick 2, redo (user, 2026-11-15, after T1-T5: "เอาชื่อทฤษฎี ป่าเงียบขึ้นเลยดีกว่า"). Same
 * picture P1 (plate EDU16-S01-B04-SH15 @70) with the theory name "ป่าเงียบ" as the dominant headline; the user's request
 * overrides "no title repeat" (T3) and lifts the ban on "ทฤษฎี" for the cover only. Plate coordinates measured on
 * step1/c1.png: far light halo x 330-990 y 80-560 (star 660,315), eye crown x 390-520 y ~600, claws x 330-780 y 830-1060,
 * her light 300,1130 (halo to y ~1220), monster body x 840-1000 down the right edge. Support lines are spoken in the film
 * (line ID per candidate) or the title. Every line inside x < 960 and last baseline above 1540; the tag stays (O2).
 */
export const EDU16_COVERS_V2: Cover[] = [
  // u1 single word + small kicker: "ทฤษฎี" (user's word) small accent over a huge plain "ป่าเงียบ", bottom band.
  {...P1, id: 'u1-theory-kicker', lines: [{text: 'ทฤษฎี', y: 1300, size: 105, accent: true}, {text: 'ป่าเงียบ', y: 1525, size: 235}],
    layout: C_LAYOUT},
  // u2 sticker: huge "ป่าเงียบ" on the amber sticker, support L02 "อย่าเพิ่งตอบนะ" above (gap 1; answer L08 + L11).
  {...P1, id: 'u2-sticker-dont-reply', lines: [{text: 'อย่าเพิ่งตอบนะ', y: 1300, size: 95}, {text: 'ป่าเงียบ', y: 1520, size: 215, accent: true}],
    look: LABEL, layout: C_LAYOUT},
  // u3 top band: "ป่าเงียบ" across the lower far-light rings, just above the eye crown (the name lit by the far light);
  // support L15 "ทำไมฟ้าจริง ๆ ยังเงียบ?" small at the bottom (gap 5; answer L15-L16).
  {...P1, id: 'u3-top-title', lines: [{text: 'ป่าเงียบ', y: 520, size: 200, accent: true}, {text: 'ทำไมฟ้าจริง ๆ ยังเงียบ?', y: 1500, size: 82}],
    layout: {grade: {vignette: 0.45, edge: {side: 'top' as const, size: 640, opacity: 0.45}}, elements: TAG}},
  // u4 two-line stack, right-aligned over the monster's dark body (clear of her light at x 300): "ป่า" / "เงียบ" accent.
  {...P1, id: 'u4-stack-right', lines: [{text: 'ป่า', y: 1300, size: 250, x: 945, anchor: 'end'}, {text: 'เงียบ', y: 1530, size: 270, accent: true, x: 945, anchor: 'end'}],
    layout: C_LAYOUT},
  // u5 title lockup: "ป่าเงียบ" accent plain with the video title's question under it, "ทำไมคนฉลาดถึงไม่ตอบ" (script title).
  {...P1, id: 'u5-title-lockup', lines: [{text: 'ป่าเงียบ', y: 1395, size: 225, accent: true}, {text: 'ทำไมคนฉลาดถึงไม่ตอบ', y: 1525, size: 78}],
    layout: C_LAYOUT},
];
