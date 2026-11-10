import type {Cover, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP13-SHORT-PIC-COVERS: cover pick 1 (cover-design skill, two-pick flow; docs/cover-principles.md CV01-CV10) for the
 * giant-flea Short (title "ถ้าหมัดตัวเท่าคน", script EDU-EP13-SCRIPT-R5, fact-check W1.3 + R2/R3/R4/R5 rechecks,
 * EDU-EP13-SHEETS-R2.1). Five pictures without text, one picture idea each, every plate the episode's registry plate
 * `EDU13-<shot id>` (CV07); `local` is the shot-local frame (>= 15, COVER_STILL). Labels on the pictures ("2 มม.",
 * "ภาพจำลอง", the trailer card "ถ้าคิดแบบง่าย ๆ") are the plates' own layers, not drawn by the cover.
 *
 * Promise: the viewer learns that a person-sized flea would not leap a building: its legs get stronger but its body
 * heavier with them (the backpack), the tiny flea cheats with an elastic pad (a slingshot) its long-legged giant hardly
 * needs, both land in tens of centimetres, and in plain centimetres you out-jump the real flea (L02-L06, L09, L16, L12;
 * closed at L13-L14).
 * Gaps (question -> answer line):
 *   1. Would a person-sized flea clear a building? -> L02 ("ไม่หรอก… หลักสิบเซน"), L12.
 *   2. Why not? Its legs would be giant too. -> L03 (stronger legs, heavier body), L05 (backpack x2), L06 (the rule).
 *   3. Then how does the tiny flea jump so well? -> L09 (elastic pad, slingshot).
 *   4. Does the giant still need that slingshot? -> L16 (hardly; long legs give the muscle time to push).
 *   5. So who jumps higher, me or a flea? -> L13 (you, in centimetres), L14.
 * Never shown (CV04, fact-check): the answer "tens of cm, not hundreds of metres" (S01-B01-SH04D knee-high hop, the
 * S01-B04-SH02 apex freeze, band "หลักสิบเซน" and tag "สูงพอ ๆ กัน"), the trailer break (SH04C tape-stop and droop), the
 * backpack and same-line landing (S01-B02-SH03), the pad and slingshot (S01-B03-SH03), the long-leg light (S01-B04-SH01
 * +121), the real measure "you out-jump a real flea" (S01-B05-SH01) and the final sofa hold (S01-B05-SH02). The leap is
 * only ever shown with the trailer card "ถ้าคิดแบบง่าย ๆ" (Boat R3 limit, R09); P2 shows the trailer apex and P4 the launch
 * crouch, both inside the trailer with the card on. No number is drawn by the cover. The flea never appears on or near the dog (B-P7).
 * Headline band for pick 2: per candidate below.
 */
const TOP = {edge: {side: 'top' as const, size: 820, opacity: 0.85}};
const ACCENT = '#ff5a3c';
const INK = '#0b0d16';
/** Dark wide stroke under the accent stroke so a cue survives any ground (skill section 4). */
const cue = (d: string, sw = 12, dash?: string) => [
  {kind: 'path' as const, d, stroke: INK, sw: sw * 2.2, linecap: 'round' as const},
  {kind: 'path' as const, d, stroke: ACCENT, sw, linecap: 'round' as const, ...(dash && {dash})},
];

export const EDU13_PICS: Cover[] = [
  // P1 subject close: the real-size flea at rest on the neutral macro backdrop, big folded hind legs (CL02), "2 มม." bar
  // and "ภาพจำลอง" (S01-B03-SH01 late in its push, L07; gaps 1 and 3): the tiny champion before any trick is shown.
  // Band: top.
  {id: 'P1-flea', plate: 'EDU13-S01-B03-SH01', local: 80, scrim: false, lines: [], layout: {grade: TOP}},
  // P2 odd view: the monster-movie money shot, the giant's silhouette at the apex over a ~30-floor tower against the sun,
  // inside the plate's own ring marker, card "ถ้าคิดแบบง่าย ๆ" on (S01-B01-SH04C, apex +12, hold +12-+25 before the
  // tape-stop; TR01 = the naive "yes", gap 1). The leap is shown only with the card (Boat R3 limit); no number. The apex
  // (≈ (544, 160) on the r3 render) sits above the 3:4 crop (CV06) and under any top grade, so this one has no top edge:
  // a bottom edge calms the street instead, and the headline band is lower-middle (y ≈ 1150-1450, over the haze below the
  // card). Tried and dropped: S01-B01-SH04 +18 (r4; the shadow has passed, the tiny MAN alone carries nothing).
  {id: 'P2-skyline', plate: 'EDU13-S01-B01-SH04C', local: 18, scrim: false, lines: [],
    layout: {grade: {vignette: 0.4, edge: {side: 'bottom', size: 700, opacity: 0.85}}}},
  // P3 face and emotion: MAN's shock beside the person-sized giant, which turns its head to the lens (S01-B01-SH05, V01
  // "เฮ้ย… ตัวเท่าเราเลย!", gaze at the viewer; gap 2). Band: top.
  {id: 'P3-heoy', plate: 'EDU13-S01-B01-SH05', local: 16, scrim: false, lines: [], layout: {grade: TOP}},
  // P4 action: the trailer crouch, hind legs folded deepest one frame before the launch at +18, the tiny MAN seen from
  // behind, card "ถ้าคิดแบบง่าย ๆ" on (S01-B01-SH04B, LF04b; gap 1). Swapped in for the matched side-by-side crouch
  // (S01-B04-SH02 +0-+8): that crouch sits before COVER_STILL's minimum local 15 and by +15 both are airborne near the
  // apex, which is the answer. Band: top.
  {id: 'P4-launch', plate: 'EDU13-S01-B01-SH04B', local: 17, scrim: false, lines: [], layout: {grade: TOP}},
  // P5 diagram: the two-shot at the wall height chart (CL01) the moment the giant reaches full size (S01-B01-SH03 +26-+32;
  // gap 1), with a dashed up-arrow over the giant toward the top edge: "how high?". No end mark, tick or number.
  // Band: top-left (x < 800; the arrow sits at x 880). Arrow placed on the r2 render (giant's back top ≈ y 740, wall picture x ≈ 560-808, wall clock ≈ (940, 340)); r4 moved it to x 880 between them.
  {id: 'P5-chart', plate: 'EDU13-S01-B01-SH03', local: 30, scrim: false, lines: [], layout: {grade: TOP, elements: [
    ...cue('M880 720L880 440M880 440L836 492M880 440L924 492', 12, '30 24'),
  ]}},
];

/**
 * EDU-EP13-SHORT-COVERS: cover pick 2 (cover-design skill section 3). The user picked P3-heoy (face and emotion,
 * S01-B01-SH05 @ 16: MAN's shock beside the person-sized giant, which faces the lens). Five text angles on the same plate
 * and frame; every word is said or shown in the film (script EDU-EP13-SCRIPT-R5) and passes Boat's verdicts; nothing
 * hedged is stated flat. Never drawn: "หลักสิบเซน", "พอ ๆ กัน", "ร้อยเมตร", the backpack/"×2", the slingshot answer, "you
 * out-jump the real flea" (CV04). The title "ถ้าหมัดตัวเท่าคน" is not repeated (C3 shares only "ตัวเท่า", see its note).
 * Placement (measured on the pick-1 still out/EDU-EP13-SHORT-PIC-COVERS/stills/75.png at 540 px, x2): MAN's head
 * x ~60-235, y ~410-600; the giant's antennae top y ~520, head x ~590-820; wall picture x ~548-844, y ~300-520 (behind the
 * text, calmed by the top edge); clock ~(988, 230). So the headline sits top-right, right-anchored at x 944 (CV06 x < 960),
 * last baseline <= 500 so it clears both heads; first line's cap top stays below y 240 (CV06).
 */
const P3 = {plate: 'EDU13-S01-B01-SH05', local: 16, scrim: false as const};
const P3_GRADE = {edge: {side: 'top' as const, size: 760, opacity: 0.9}};
const R = {x: 944, anchor: 'end' as const};
/** Heavier outline than the default 0.09 so the white lines hold on the beige wall at 120 px (r1 sheet). */
const BOLD = {strokeRatio: 0.13};

export const EDU13_COVERS: Cover[] = [
  // C1 misconception, red sticker: the naive belief as a question, the rule's own words (L06 "ตัวใหญ่ขึ้น… กระโดดไม่ได้
  // สูงขึ้นตาม"); gap 2, answer L03, L05, L06 (never drawn).
  {id: 'C1-bigger', ...P3, lines: [{text: 'ตัวใหญ่ขึ้น', y: 350, size: 118, ...R}, {text: 'สูงขึ้นตาม?', y: 500, size: 124, accent: true, ...R}],
    look: {...BOLD, label: {color: ACCENT, ink: '#ffffff', pad: 0.42}}, layout: {grade: P3_GRADE}},
  // C2 question: L01 "จะกระโดดข้ามตึกได้มั้ย" shortened, asked of the giant in the picture; gap 1, answer L02.
  {id: 'C2-tower', ...P3, lines: [{text: 'ข้ามตึก', y: 345, size: 140, ...R}, {text: 'ได้มั้ย?', y: 540, size: 162, accent: true, ...R}],
    look: BOLD, layout: {grade: P3_GRADE}},
  // C3 imagined view, seen by the man: his V01 line "เฮ้ย… ตัวเท่าเราเลย!" as one big word over his head plus the sub-line;
  // shares "ตัวเท่า" with the title (T3 partial), opens "what can a jumper this size do?" (gaps 1-2), answer L02-L06.
  {id: 'C3-heoy', ...P3, lines: [{text: 'เฮ้ย…', y: 380, size: 190, accent: true, x: 70, anchor: 'start'}, {text: 'ตัวเท่าเรา!', y: 505, size: 134, ...R}],
    look: BOLD, layout: {grade: P3_GRADE}},
  // C4 try this: the viewer's own measure (L13 "แต่ถ้าวัดเป็นเซน", "คุณ"), you against the flea; gap 5, answer L12-L14
  // (never drawn).
  {id: 'C4-measure', ...P3, lines: [{text: 'วัดเป็นเซน', y: 350, size: 118, ...R}, {text: 'คุณ vs หมัด', y: 505, size: 128, accent: true, ...R}],
    look: {...BOLD, label: {color: '#f4efe6', ink: INK, pad: 0.4}}, layout: {grade: P3_GRADE}},
  // C5 number: L01 "หมัดกระโดดได้สูงกว่าตัวมันหลายสิบเท่า" (settled claim, CL04) on the person-sized giant: "so this one?";
  // gap 1, answer L02. No "×50" (B-P2: no held counter frame).
  {id: 'C5-tens', ...P3, lines: [{text: 'สูงกว่าตัว', y: 350, size: 112, ...R}, {text: 'หลายสิบเท่า', y: 505, size: 132, accent: true, ...R}],
    look: {...BOLD, label: {color: INK, ink: ACCENT, pad: 0.4}}, layout: {grade: P3_GRADE}},
];

/** Episode coral accent (look.tsx apex ring `#ff5a3c`). No scrim: pick 1 is text-free. */
export const EDU13_COVER_STYLE: CoverStyle = {accent: ACCENT};
