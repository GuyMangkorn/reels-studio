import type {Cover, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP19-SHORT-PIC-COVERS: cover pick 1 (cover-design skill, two-pick flow; docs/cover-principles.md CV01-CV10) for the
 * tracking-dog Short "ห้าก้าวก็รู้ว่าคุณไปทางไหน" (C72; script EDU-EP19-SCRIPT-R4, Boat fact-check R1 + R3 recheck
 * scripts/edu-series/ep19/short/fact-check.md, timed scene sheets EDU-EP19-SHEETS-R3, Final passed 2026-11-16). Five pictures
 * without text, one picture idea each, every plate the episode's registry plate `EDU19-<shot id>` (CV07, the Final's plates,
 * look v6); `local` is the shot-local frame (>= 15, COVER_STILL). Cover wording for pick 2 is fixed by the user
 * (2026-11-16): "หมาตามรอย ดมแค่ห้ารอยก็รู้ทาง" (L01 scope "หมาตามรอย", Boat Q8), so each picture is chosen to sit under that line.
 *
 * Promise: the viewer learns how a trained tracking dog tells which way you walked from only five footprints (the earlier
 * print is probably fainter, L03 + L03b), that twenty minutes of waiting does not hide you (L05), and that only scrambling
 * the order of the prints does (L08, L10).
 * Gaps (question -> answer line):
 *   1. Five prints and it knows which way? How? -> L03 + L03b (OQ1).
 *   2. Every print smells of you, so how can it tell? -> L03 (OQ2).
 *   3. Wait twenty minutes and the smell is gone? -> L05 (OQ3).
 *   4. Can anything fool it? -> L08 (OQ4).
 *   5. So what was the dog really reading? -> L10 (OQ5).
 * Never shown (CV04): the size ladder read as an answer (P4's rings are all one size, no arrow, no numbers), the fried-rice
 * inset (B01-SH05), the mat shuffle and its result line (B03-SH03..SH06, L08 "บอกทางไม่ได้"); no word "ลำดับ" or "สลับ".
 * P5 is the exception asked for by the coordinator (the B04-SH02 ending as the promise-payoff): it shows the dog stuck on
 * the jumbled mats but not why; flagged as the CV04 risk in the hand-back.
 * Headline band for pick 2: per candidate below. Channel mark @TamMaiLa top-left (coversVideo chrome).
 */
const ACCENT = '#ffd25a'; // the scent-glow warm yellow (cover cues and pick-2 accent word)
const INK = '#14200f';
const P = (id: string, shot: string, local: number): Cover => ({id, plate: `EDU19-${shot}`, local, scrim: false, lines: []});
/** Ground ring (dark under-stroke, accent over-stroke) so the cue survives the green lawn. */
const ring = (cx: number, cy: number, rx: number, ry: number) => [
  {kind: 'ellipse' as const, cx, cy, rx, ry, stroke: INK, sw: 16},
  {kind: 'ellipse' as const, cx, cy, rx, ry, stroke: ACCENT, sw: 8},
];
/** The five prints of B01-SH04 at local 44, measured on the round-1 still (frame px). One ring size for all five, so the
 * picture asks "five prints, which way?" and does not show the fainter-to-brighter answer (L03). Round 2 dropped the dashed
 * trail line (it turned the rings into a chain at 270 px) and widened the rings past the glow halos. */
const PRINTS: [number, number][] = [[144, 890], [262, 944], [476, 958], [680, 1030], [968, 1072]];
export const EDU19_PICS: Cover[] = [
  // P1 subject close: the dog's head huge, nose down over one glowing print, ears just lifted on "รู้ได้ไง" (B01-SH03 l 70,
  // L02; gaps 1-2). Band: bottom (y ~1250-1540, plain dark lawn under the print).
  {...P('P1-nose-on-print', 'B01-SH03', 70), layout: {grade: {vignette: 0.35}}},
  // P2 odd view: the scent made visible, the dog trotting her glowing trail toward the tree where she peeks out, sure she is
  // hidden (B01-SH06 l 20, L03b end; gaps 1, 4). Warm tint lifts the glow. Band: bottom (y ~1380-1540, lawn under the trail).
  {...P('P2-glow-trail-hunt', 'B01-SH06', 20), layout: {grade: {vignette: 0.45, tint: {color: '#ffb36b', opacity: 0.12, blend: 'soft-light'}}}},
  // P3 face and emotion: the girl shocked, hands at her mouth, eyes at the viewer, the dog's head popping round the trunk
  // behind her (B02-SH07 l 30, V04 "ห๊ะ!? ยังได้อีก"; gaps 3-4). Band: top (y ~240-540, sky and far trees above her
  // head, hair top at y ~570; her feet reach y ~1510, so the bottom is not free).
  {...P('P3-girl-shocked', 'B02-SH07', 30), layout: {grade: {vignette: 0.35}}},
  // P4 diagram: the dog among the five prints, each print ringed the same size (B01-SH04
  // l 44, L03 start; gap 1). The fifth ring sits at x ~968 (right-edge action buttons): a cue, not the subject. Band: bottom
  // (y ~1250-1540, open lawn under the row).
  {...P('P4-five-prints', 'B01-SH04', 44), layout: {grade: {vignette: 0.4}, elements: PRINTS.flatMap(([x, y]) => ring(x, y, 86, 44))}},
  // P5 promise-payoff (swapped for "action": the film's try-this moment is her mat trick, which is the twist set-up; the
  // coordinator named the B04-SH02 ending): the dog sits on the jumbled mats with its head tilted, she peeks from the tree
  // (B04-SH02 l 150, end of L10; gaps 4-5). Round 3: a bottom edge fade quiets the cut-off orange mat at the lower
  // left so the dog stays the salient blob. Band: top (y ~240-520, over the dark canopy).
  {...P('P5-tilt-on-mats', 'B04-SH02', 150), layout: {grade: {vignette: 0.45, edge: {side: 'bottom', size: 560, opacity: 0.5}}}},
];

export const EDU19_COVER_STYLE: CoverStyle = {accent: ACCENT};

/**
 * EDU-EP19-SHORT-COVERS: cover pick 2. User picked P3 girl-shocked (2026-11-16, structured question; step-1 still
 * out/EDU-EP19-SHORT/cover/step1/2026-11-16_EDU-EP19-PIC-P3-girl-shocked.png, plate EDU19-B02-SH07 local 30). User decision
 * (2026-11-16): the cover text is the same sentence as the title, "หมาตามรอย ดมแค่ห้ารอยก็รู้ทาง" (overrides skill row T3 "no
 * title repeat" for this cover), so T1-T5 differ in layout only: line break, size, sticker vs plain, and emphasis on "ห้า" or
 * "หมาตามรอย". Band: top (y 240-560, pale sky and far trees; hair top y ~520, face y 600-800 kept clear), dark top edge grade
 * behind it; every line inside x 40-960. Plate coordinates (frame px, measured on the step-1 still): trunk x 0-370 y 0-1390,
 * hair x 385-790 y 520-780, dog head x 360-450 y 800-900, feet y ~1510. Words: L01 scope "หมาตามรอย" (Boat Q8), L02-L03 "ห้ารอย".
 * Split lines (accent on "ห้า" only) are three runs on one baseline joined at measured x (round 1 measurement).
 */
const P3 = {plate: EDU19_PICS[2].plate, local: EDU19_PICS[2].local, scrim: false as const};
const TOP = {vignette: 0.35, edge: {side: 'top' as const, size: 680, opacity: 0.62}};
/** Channel mark (CV08): the chrome's "@TamMaiLa" at (120, 128) in day ink #49445c vanishes under the dark top grade, so each
 * cover redraws it at the same place and size in the night ink over a dark under-stroke (EDU-EP09 precedent, cover-local). */
const MARK = [
  {kind: 'text' as const, text: '@TamMaiLa', x: 120, y: 151, size: 22, fill: INK, stroke: INK, sw: 6},
  {kind: 'text' as const, text: '@TamMaiLa', x: 120, y: 151, size: 22, fill: '#fff1da'},
];
const L = {grade: TOP, elements: MARK};
const COND = {stretch: 80};
const STICKER = {label: {color: ACCENT, ink: INK, pad: 0.42}};
type Run = {text: string; size: number; accent?: boolean};
/** One baseline from several runs, left to right from x0, each run's width = em * size * (stretch/100) plus `gap` (the
 * outline; round 1 measured "ดมแค่" ~10 px wider than 2.77 em and touching runs without it). */
const runs = (y: number, x0: number, parts: (Run & {em: number})[], look: object = COND, gap = 16) => {
  let x = x0;
  return parts.map(({text, size, accent, em}) => {
    const line = {text, y, size, accent, x, anchor: 'start' as const, look};
    x += em * size * ((look as {stretch?: number}).stretch ?? 100) / 100 + gap;
    return line;
  });
};

export const EDU19_COVERS: Cover[] = [
  // T1 plain, emphasis "หมาตามรอย": accent subject line big, the rest one condensed near-white line under it.
  {...P3, id: 'T1-plain-dog-accent', lines: [
    {text: 'หมาตามรอย', y: 395, size: 175, accent: true, x: 500},
    {text: 'ดมแค่ห้ารอยก็รู้ทาง', y: 540, size: 112, x: 500, look: COND}],
    layout: L},
  // T2 sticker kicker: "หมาตามรอย" on the yellow sticker, line 2 near-white with "ห้า" alone in the accent (round 5:
  // line 2 start 84 -> 66, its fill reached x 964).
  {...P3, id: 'T2-sticker-five-accent', lines: [
    {text: 'หมาตามรอย', y: 385, size: 150, accent: true, x: 500, look: STICKER},
    ...runs(545, 66, [{text: 'ดมแค่', size: 118, em: 2.77}, {text: 'ห้า', size: 118, accent: true, em: 1.12},
      {text: 'รอยก็รู้ทาง', size: 118, em: 4.96}])],
    layout: L},
  // T3 big "ห้า": break after "ดมแค่", "ห้า" huge in the accent opening line 2 (the number is the hook).
  {...P3, id: 'T3-big-five', lines: [
    {text: 'หมาตามรอย ดมแค่', y: 345, size: 118, x: 500, look: COND},
    ...runs(560, 60, [{text: 'ห้า', size: 215, accent: true, em: 1.12}, {text: 'รอยก็รู้ทาง', size: 140, em: 4.96}], {stretch: 85}, 14)],
    layout: L},
  // T4 left-aligned stack over the trunk and sky, break after "ดมแค่", the hook clause "ห้ารอยก็รู้ทาง" in the accent
  // (round 3: line 1 125 -> 120, its tone mark reached x ~972 past the 960 limit).
  {...P3, id: 'T4-left-hook-accent', lines: [
    {text: 'หมาตามรอย ดมแค่', y: 365, size: 120, x: 60, anchor: 'start', look: COND},
    {text: 'ห้ารอยก็รู้ทาง', y: 545, size: 160, accent: true, x: 60, anchor: 'start', look: COND}],
    layout: L},
  // T5 tilted sticker band: "หมาตามรอย" near-white large, line 2 dark ink on a yellow band tilted -3 degrees.
  {...P3, id: 'T5-band-tilt', lines: [
    {text: 'หมาตามรอย', y: 385, size: 165, x: 500},
    {text: 'ดมแค่ห้ารอยก็รู้ทาง', y: 532, size: 100, x: 500, rotate: -3, look: {...COND, fill: INK, strokeRatio: 0}}],
    layout: {grade: TOP, elements: [{kind: 'rect', x: 70, y: 432, w: 860, h: 130, rx: 18, fill: ACCENT, under: true,
      transform: 'rotate(-3 500 497)'}, {kind: 'rect', x: 70, y: 432, w: 860, h: 130, rx: 18, stroke: INK, sw: 8, under: true,
      transform: 'rotate(-3 500 497)'}, ...MARK]}},
];
