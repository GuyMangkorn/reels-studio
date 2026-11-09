import type {Cover, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP09-SHORT-PIC-COVERS: cover pick 1 (cover-design skill, two-pick flow; docs/cover-principles.md CV01-CV10) for the
 * ring-finger Short (working title "นิ้วนางที่ยกไม่ขึ้น", script EDU-EP09-SCRIPT-R1.4, fact-check in
 * scripts/edu-series/ep09/fact-check.md, EDU-EP09-SHEETS-R2.2). Five pictures without text, one picture idea each, every
 * plate the episode's registry plate `EDU9-<shot id>` (CV07); `local` is the shot-local frame (>= 15, COVER_STILL).
 *
 * Promise: the viewer learns why the ring finger will not lift when the middle finger is folded (it has no lifting
 * muscle of its own and shares one set, tied by small bands, with its neighbours), and that it is not weakness
 * (L05-L09, closed at L15).
 * Gaps (question -> answer line):
 *   1. Can I lift my ring finger like this? -> L02 (barely, or not at all; the viewer's own try at L01).
 *   2. Is my ring finger just weak? -> L04 taps (CL02), V02 (CL01), L05 "ไม่ได้อ่อนแอนะ".
 *   3. Then what holds it back? -> L06 (muscle in the forearm, cords), L08 (shared set, bands), L09 (pinning, model).
 *   4. Why do thumb, index and little finger lift fine? -> L07 (index and little have their own extra muscle).
 *   5. Is it lazy? -> L15 (not lazy, it shares its string).
 * Never shown (CV04): the shared set and the bands (S01-B03-SH02/SH03/SH04 diagrams, the S01-B05-SH02 ghost cords),
 *   the words "สายร่วม", "ขี้เกียจ" or "ชุดเดียวกัน", the pianist answer (L12) and the retry's hair-lift (CL03). P2 shows
 *   L06's see-through forearm (one muscle, four cords) before any cord is singled out: it says "the cause is inside",
 *   not which cord or band holds the ring finger.
 * Headline band for pick 2: per picture below.
 */
const TOP = {edge: {side: 'top' as const, size: 820, opacity: 0.85}};
const ACCENT = '#ffb84d';
const INK = '#0b0d16';

const RED = '#ff7a5c';
/** Dark wide stroke under the accent stroke so a cue survives any ground (skill section 4). */
const cue = (d: string, stroke: string, sw = 12) => [
  {kind: 'path' as const, d, stroke: INK, sw: sw * 2.1, linecap: 'round' as const},
  {kind: 'path' as const, d, stroke, sw, linecap: 'round' as const},
];

export const EDU9_PICS: Cover[] = [
  // P1 subject close: the try at table level, middle folded under, the ring tip held a hair off the wood (S01-B01-SH03 L30,
  // the L02 hair-lift hold); gap 1. Plain: in this low view the ring and little tips overlap (~800/874, 844/810 measured
  // on the delivered frame G233), so a cue cannot name one finger. Headline band: the plain wood below, y 1050-1450.
  {id: 'P1-strain', plate: 'EDU9-S01-B01-SH03', local: 30, scrim: false, lines: [], layout: {grade: {vignette: 0.7, ...TOP}}},
  // P2 odd view: the see-through forearm, one muscle and four cords (S01-B03-SH01 L40, L06); gap 3, vignette. The
  // "ภาพประกอบ" pill is the plate's own label. Headline band: the dark floor below the arm, y 1250-1520.
  {id: 'P2-xray', plate: 'EDU9-S01-B03-SH01', local: 40, scrim: false, lines: [], layout: {grade: {vignette: 0.8, ...TOP}}},
  // P3 face and emotion: BOY straining, eyes squeezed, sweat drop; ELDER amused (S01-B01-SH02 L20, the try window); gap 2.
  // The top edge dims the pendant lamp so the faces stay the brightest blob. Headline band: the table, y 1050-1450.
  {id: 'P3-effort', plate: 'EDU9-S01-B01-SH02', local: 20, scrim: false, lines: [], layout: {grade: TOP}},
  // P4 action: the L01 instruction mid-move, the middle finger folding under (S01-B01-SH01 L51, fold L46-60), a curved
  // arrow in the index-ring gap pointing at the folding knuckle (nub tip measured at 540, 590 on G51); gap 1.
  // Headline band: the forearm, y 1150-1500.
  {id: 'P4-fold', plate: 'EDU9-S01-B01-SH01', local: 51, scrim: false, lines: [], layout: {grade: TOP, elements: [
    ...cue('M500 390Q610 420 552 556M552 556L584 532M552 556L547 516', ACCENT, 15),
  ]}},
  // P5 diagram: the try pose held (S01-B01-SH01 L130, ring strain from L92): up chevrons over the three fingers that lift
  // (little tip 250, 490; index 690, 350; thumb 900, 700, measured on the r1 still) and a coral-red no-lift sign just above
  // the ring tip (390, 310, top edge y ~250 inside CV06; tip at 390, 330); the L04 comparison, 3 up vs 1 stuck (gaps 2 and 4). Headline band: the forearm, y 1150-1500.
  {id: 'P5-three-one', plate: 'EDU9-S01-B01-SH01', local: 130, scrim: false, lines: [], layout: {grade: TOP, elements: [
    ...cue('M202 440L250 392L298 440', ACCENT, 15),
    ...cue('M642 302L690 254L738 302', ACCENT, 15),
    ...cue('M860 636L908 588L956 636', ACCENT, 15),
    {kind: 'ellipse', cx: 390, cy: 310, rx: 54, ry: 54, stroke: INK, sw: 26},
    {kind: 'ellipse', cx: 390, cy: 310, rx: 54, ry: 54, stroke: RED, sw: 13},
    ...cue('M352 348L428 272', RED, 13),
  ]}},
];

/** Lit-muscle amber accent (brief palette `#ffb84d`). No scrim: pick 1 is text-free. */
export const EDU9_COVER_STYLE: CoverStyle = {accent: ACCENT};
