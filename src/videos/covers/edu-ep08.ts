import type {Cover, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP08-SHORT-PIC-COVERS: cover pick 1 (cover-design skill, two-pick flow; docs/cover-principles.md CV01-CV10) for the
 * "helmet off in space" Short (title "ถอดหมวกกลางอวกาศ", script EDU-EP08-SCRIPT-R1.3, fact-check W1.3, EDU-EP08-SHEETS-R2.4).
 * Five pictures without text, one picture idea each, every plate the episode's registry plate `EDU8-<shot id>` (CV07);
 * `local` is the shot-local frame (>= 15, COVER_STILL). The plate's own timer ring and its card "ประมาณ 10–15 วินาที"
 * are plate overlays (the L02 setup, user Q3), not drawn by the cover. Eyes stay at medium framing (fact-check: no eye
 * imagery); no swelling, injury or collapse on any picture.
 *
 * Promise: the viewer learns that without a helmet in space you do not explode or freeze, you may have only about
 * 10-15 s of awareness, the saliva on your tongue starts to boil, and the right move is to breathe out, not hold your
 * breath (L02, L06, L10-L11; closed at L13).
 * Gaps (question -> answer line):
 *   1. Would you explode, like in the movies? -> L02 (no), L04 (the skin holds).
 *   2. Would you freeze on the spot? -> L05 (no; no air to carry the heat away, like a vacuum flask).
 *   3. How long would you stay awake? -> L02 (maybe about 10-15 s; the plate's ring card).
 *   4. What is the glitter at her lips? -> L06 (the saliva on the tongue starts to boil), L07-L08 (the 1966 report).
 *   5. Should you hold your breath? -> L10 (held air pushes the lungs; they may be injured), L11/L13 (breathe out).
 * Never shown (CV04, fact-check): the exhale rule (the glitter stream S01-B04-SH03, the words "หายใจออก"), the survival
 *   claim and rescue (the grab, the airlock, the stopped ring, S01-B05), the film-strip balloon cross and the ice-shell
 *   failure (the answers to gaps 1-2), the water-drop and chest-outline cards (the answers to gaps 4-5), and the 1966
 *   man's fall or recovery (L08-L09). No number is drawn by the cover; the only number is the plate's own ring card.
 * Headline band for pick 2: the top band (y 300-700) under a dark top edge, unless a candidate says otherwise.
 */
const TOP = {edge: {side: 'top' as const, size: 820, opacity: 0.85}};
const ACCENT = '#ffb347';
const INK = '#0b0d16';

export const EDU8_PICS: Cover[] = [
  // P1 subject close: the instant of removal, the helmet just clearing her head, the gasp (S01-B01-SH02, V01; CL01 set up).
  {id: 'P1-helmet', plate: 'EDU8-S01-B01-SH02', local: 30, scrim: false, lines: [], layout: {grade: TOP}},
  // P2 odd view: the 1966 test chamber in sepia, the suited figure from behind, the ring paused (S01-B03-SH03, L07, the push-in at local 122);
  // seen "from the other side" of the story, vignette; headline band top.
  {id: 'P2-chamber', plate: 'EDU8-S01-B03-SH03', local: 122, scrim: false, lines: [],
    layout: {grade: {vignette: 0.9, edge: {side: 'top', size: 700, opacity: 0.7}}, elements: [
      // the loose hose end, measured on the episode still at local 122 (232, 952)
      {kind: 'ellipse', cx: 232, cy: 952, rx: 95, ry: 95, stroke: INK, sw: 22},
      {kind: 'ellipse', cx: 232, cy: 952, rx: 95, ry: 95, stroke: ACCENT, sw: 11},
    ]}},
  // P3 face and emotion: the glitter at her lips, her gaze on it, "หืม?" (S01-B03-SH01, show + L06a); gap 4.
  // Dashed ring on the glitter cloud (measured on the r1 render x 634-804, y 690-830), clear of her mouth (x ~604).
  {id: 'P3-glitter', plate: 'EDU8-S01-B03-SH01', local: 77, scrim: false, lines: [], layout: {grade: TOP, elements: [
    {kind: 'ellipse', cx: 738, cy: 760, rx: 98, ry: 98, stroke: INK, sw: 18, dash: '22 16'},
    {kind: 'ellipse', cx: 738, cy: 760, rx: 98, ry: 98, stroke: ACCENT, sw: 9, dash: '22 16'},
  ]}},
  // P4 action: she holds her breath, lips sealed, glove pressed to her chest (S01-B04-SH01, CL01 payoff begins); gap 5,
  // the instinct the viewer would copy, never the exhale.
  {id: 'P4-hold', plate: 'EDU8-S01-B04-SH01', local: 58, scrim: false, lines: [], layout: {grade: TOP}},
  // P5 diagram: she floats whole while the ring runs; the ring card circled, an arrow from it to her (L02, gap 3).
  {id: 'P5-ring', plate: 'EDU8-S01-B01-SH03', local: 99, scrim: false, lines: [], layout: {grade: TOP, elements: [
    {kind: 'ellipse', cx: 900, cy: 340, rx: 150, ry: 150, stroke: INK, sw: 24},
    {kind: 'ellipse', cx: 900, cy: 340, rx: 150, ry: 150, stroke: ACCENT, sw: 12},
    {kind: 'path', d: 'M800 470L680 580M680 580L722 572M680 580L690 538', stroke: INK, sw: 26, linecap: 'round'},
    {kind: 'path', d: 'M800 470L680 580M680 580L722 572M680 580L690 538', stroke: ACCENT, sw: 12, linecap: 'round'},
  ]}},
];

/**
 * EDU-EP08-SHORT-COVERS: cover pick 2, redo 2 (8 Nov 2026). The user rejected the five glitter-question texts (gap 4) and
 * asked for the viewer-level question of the title promise, in the vein of "ถ้าหมวกหลุด ถอดหมวกในอวกาศได้มั้ย". Five texts:
 * three on the picked picture P3-glitter (EDU8-S01-B03-SH01 @ 77), two on P1-helmet (EDU8-S01-B01-SH02 @ 30), since the
 * headline is about the helmet and P1 shows its removal. Every headline asks the helmet question and opens a different gap.
 * Copy checks (CV02, CV04, fact-check W1.3): questions only, no flat claim; no "ตาย" (never said in the film, and the film's
 * answer is a hedge, L12 "ถ้าช่วยเร็วมาก… ก็อาจรอด", so a yes/no death question promises more than it settles); the stakes
 * word is "หมดสติ" (L08, with L02's "มีสติ"). "หลุด" matches L01's slipping clasp. Never shown: "หายใจออก", survival,
 * rescue, the explosion answer; no number drawn by the cover (P3's ring card "ประมาณ 10–15 วินาที" is the plate's own L02
 * overlay). The title is "ถอดหมวกกลางอวกาศ"; V1 reuses its verb "ถอดหมวก" at the user's request (T3 cost noted in the score).
 * Measured: P3 ring card x 790-1020 y 210-430, hair top y ~600, glitter ring (760, 760) r 86, so P3 text is left-aligned at
 * x 70, baselines y 360/515-520 (round 1 at 400/555 touched her hair); V3/V5 line 2
 * sized so the "?" ends left of the ring card label (x < 790). P1 helmet top y ~555 (x 390-705), dark sky above, so P1 text is centred and kept above y 540:
 * the y 300-700 band would cross the helmet (the subject), so it moves up per CV03/CV06 (top still >= 240).
 */
const GLITTER = {plate: 'EDU8-S01-B03-SH01', local: 77, scrim: false as const};
const HELMET = {plate: 'EDU8-S01-B01-SH02', local: 30, scrim: false as const};
const RING = [
  {kind: 'ellipse' as const, cx: 760, cy: 760, rx: 86, ry: 86, stroke: INK, sw: 18, dash: '22 16'},
  {kind: 'ellipse' as const, cx: 760, cy: 760, rx: 86, ry: 86, stroke: ACCENT, sw: 9, dash: '22 16'},
];
const RED = '#ff5a4e';
export const EDU8_COVERS: Cover[] = [
  // V1 question, the user's own line (P1): the removal moment asks "can you?" (L01 premise; paid off L02-L13).
  {id: 'V1-canyou', ...HELMET, lines: [{text: 'ถอดหมวก', y: 340, size: 140}, {text: 'ได้มั้ย?', y: 510, size: 180, accent: true}],
    layout: {grade: TOP}},
  // V2 question, open (P1): what happens if it comes off (L01 setup; L02, L04-L06, L10 answer).
  {id: 'V2-whathappens', ...HELMET, lines: [{text: 'ถ้าหมวกหลุด', y: 350, size: 130}, {text: 'จะเป็นยังไง?', y: 520, size: 130, accent: true}],
    layout: {grade: TOP}},
  // V3 odd detail (P3): the glitter at her lips cued by the ring; "ลิ้น" from L06 ("บนลิ้นคุณ"), never "เดือด" or "น้ำลาย".
  {id: 'V3-tongue', ...GLITTER, lines: [{text: 'ถ้าหมวกหลุด', y: 360, size: 120, x: 70, anchor: 'start'}, {text: 'ลิ้นจะเป็นไง?', y: 515, size: 125, accent: true, x: 70, anchor: 'start'}],
    layout: {grade: TOP, elements: RING}},
  // V4 misconception (P3): the movie belief, red sticker (L02 "ไม่ระเบิดอย่างในหนัง" answers it; the answer is not drawn).
  {id: 'V4-explode', ...GLITTER, lines: [{text: 'หมวกหลุด…', y: 360, size: 130, x: 70, anchor: 'start'}, {text: 'ระเบิดไหม?', y: 515, size: 140, accent: true, x: 90, anchor: 'start'}],
    look: {label: {color: RED, ink: '#ffffff', pad: 0.42}}, layout: {grade: TOP, elements: RING}},
  // V5 stakes (P3), in place of the rejected "ตายเลยไหม?": "หมดสติ" is the film's word (L08; L02 awareness ~10-15 s).
  {id: 'V5-blackout', ...GLITTER, lines: [{text: 'ถ้าหมวกหลุด', y: 360, size: 120, x: 70, anchor: 'start'}, {text: 'หมดสติไหม?', y: 520, size: 135, accent: true, x: 70, anchor: 'start'}],
    layout: {grade: TOP, elements: RING}},
];

/** Suit-visor amber accent (brief palette amber lamp `#ffb347`). No scrim: pick 1 is text-free. */
export const EDU8_COVER_STYLE: CoverStyle = {accent: ACCENT};
