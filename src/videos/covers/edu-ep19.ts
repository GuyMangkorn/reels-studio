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

/**
 * EDU-EP19-SHORT-V2-PIC-COVERS: cover redo, pick 1 (cover-design skill rewritten 2026-11-16, legitbait push; user
 * 2026-11-16 "try on ep19"; docs/cover-principles.md CV04, CV07, CV09, CV11). Same script, verdicts and plates as V1
 * (EDU-EP19-SCRIPT-R4, fact-check R1 + R3 recheck, EDU-EP19-SHEETS-R3); V1 arrays above stay untouched. V2 is free of the
 * V1 wording "หมาตามรอย ดมแค่ห้ารอย…" for pick 2, but keeps Boat's scope: plain "หมา" needs "ตามรอย" or "ฝึกมา" (Q8).
 *
 * Hook sheet (skill section 1):
 * Promise: the viewer finds out how a trained tracking dog knows which way YOU went from five footprints (L01 -> L03,
 *   L03b), that waiting twenty minutes does not hide you (L05), and the one thing that does (L08, L10).
 * Stakes: you cannot hide. The girl hides behind the tree and is found every time she tries the obvious plan: found in
 *   round 1 (V01, B01-SH07 "เจอจนได้!"), found again after twenty minutes (L05 + V04, B02-SH06..SH07 "ห๊ะ!? ยังได้อีก").
 *   L01 puts "คุณ" in the hunted seat ("ดมรอยเท้าคุณ… คุณเดินไปทางไหน"). No harm to a body: the bait is being found,
 *   not hurt.
 * Gaps (question -> answer line):
 *   1. Only five prints and it knows which way you went? (yes/no) -> L01 says yes; how -> L03 + L03b (OQ1).
 *   2. Every print smells of you, so how can it tell? -> L03 (OQ2).
 *   3. Wait twenty minutes: are you safe? (yes/no) -> no, L05 (OQ3).
 *   4. Can you hide from it at all? (yes/no) -> yes, one way, L08 + L10 (OQ4, OQ5).
 * Never shown (CV04): the size/brightness ladder read as an answer (no dim-to-bright arrow), the fried-rice inset
 *   (B01-SH05), the mat trick and its result (B03-SH03..SH07: no shuffle, no dog stuck); no word "ลำดับ" or "สลับ".
 * Words checked against the film (for pick 2): "คุณ" (L01), "ห้ารอย" (L01), "ยี่สิบนาที"/"20 นาที" (V02, L05; the watch
 *   reads 20:00 in B02-SH03), "ซ่อน" (L10), "เจอ" (V01). Not supported: "ตำรวจ" (no police in the film; Mum is a trainer;
 *   SRC007 police-dog figures unverified and unused), "หนี" (she runs to hide, nobody flees a chase; use "ซ่อน").
 *   "รอดมั้ย" only as hide-and-seek bait ("ซ่อนรอดมั้ย?"), never as bodily danger.
 *
 * Picture ideas (skill section 2), each a plate-frame stand-in; two need a new cover painting (sheets EDU19-CV1, EDU19-CV2
 * below, for Boss) because no plate frame is close enough. Ring cues are red (V2 accent for the "target" read).
 * Render rounds: 3 of 4 (r1 grades only; r2 rings on P3/P5; r3 rings on P1/P2, stronger vignettes, thicker rings).
 * CV redo (user 2026-11-16 "Paint CV1 + CV2", Boss): candidates CV1, CV2, P3, P1, P4 (P2, P5 dropped); render rounds 3 of 4 (cv-r1 paintings,
 * cv-r2 B03 sun + CV grade + ring on CV2's girl, cv-r3 ring on CV1's dog head + warmer tint).
 *
 * Proposed cover paintings (CV07; Film's one-shot sheets, Boss paints with the painted-2d skill in a module the episode
 * does not import; status: painted by Boss 2026-11-16 in src/painted/edu19/cover-shots.tsx, registry IDs EDU19-CV1 / EDU19-CV2 via
 * src/painted/shots/edu19-covers.tsx; sun pushed to the film's B03 deep-gold key for both; CV2's girl is ~300 px tall, not ~140, so her peek reads). Set = the episode field (world
 * metres, X along the trail swing -> tree, Y up, Z toward camera side; tree trunk at (6.0, 0, 0), GP = the trunk's
 * peek edge), late-afternoon low sun from screen left, look v6. Nothing in either picture is outside the film: the dog
 * reaching her tree (B01-SH06/SH07, B02-SH06/SH07), her peek and her shock (P43, P12).
 *   EDU19-CV1 · danger moment, "it is right behind the tree" (pushes V2-P1 / V2-P3). Casting: `dog-black-lab +
 *     tracking harness, new: sniff-track (head low, nose 10 cm over a print)` · `girl-school + park-casual (coral tee),
 *     P43 peek_around + P12 surprise_cover_mouth (one hand), shock, eyes sideways toward the trunk edge`. Camera: low,
 *     eye 0.45 m, at (6.9, 0.45, 1.3) looking at the trunk edge (6.15, 0.5, 0), f ~900 (wide-ish for looming), 9:16.
 *     Staging: the trunk fills the left third; GIRL pressed against its far side, head and one shoulder out at screen
 *     (~700, 640), face ~260 px tall; DOG's head and muzzle entering from the trunk's near edge at screen (~330, 1050),
 *     head ~420 px wide, nose one print short of her heel; one faint print glow under the nose only (no ladder). Rim light
 *     on the dog's back and her hair from the low sun; deep shade between them. Calm band: top (y 240-520, sky over the
 *     canopy gap). Never shown: mats, the ladder, the fried-rice inset.
 *   EDU19-CV2 · scale shock, "the nose vs the hider" (pushes V2-P2 / V2-P4). Casting: `dog-black-lab + tracking harness,
 *     new: sniff-track, right profile` · `girl-school + park-casual, P43 peek_around, sly -> unsure`. Camera: worm's-eye,
 *     eye 0.15 m at (2.2, 0.15, 0.6) looking along the trail to the tree (6.0, 0.6, 0), f ~1100, 9:16. Staging: the dog's
 *     nose and muzzle huge in the lower foreground (head ~900 px wide, nose tip at screen ~(560, 1250)) over one of her
 *     grass prints with its single faint glow curl; the trail of plain grass prints running from under the nose to the
 *     far trunk; GIRL tiny peeking at GP, ~140 px tall, at screen ~(760, 700), the only warm colour in the top half.
 *     Calm band: top (y 240-520, sky). No mats anywhere (they are the twist).
 */
const RED = '#e8432f';
/** Ring with a dark under-stroke so it survives grass and sky. */
const redRing = (cx: number, cy: number, rx: number, ry: number) => [
  {kind: 'ellipse' as const, cx, cy, rx, ry, stroke: INK, sw: 24},
  {kind: 'ellipse' as const, cx, cy, rx, ry, stroke: RED, sw: 12},
];
/** CV1/CV2 grade (round 1 shelf sheet: paler than EP05/EP11): deeper vignette, a dark top edge behind the headline band, warm soft-light. */
const CV_GRADE = {vignette: 0.65, edge: {side: 'top' as const, size: 620, opacity: 0.5}, tint: {color: '#ff9a3c', opacity: 0.2, blend: 'soft-light' as const}};
export const EDU19_PICS_V2: Cover[] = [
  // V2-CV1 danger moment, painted (sheet EDU19-CV1, src/painted/edu19/cover-shots.tsx): low camera at the trunk, her shocked peek, the dog's head
  // low on her trail in the near frame (pushes V2-P1 / V2-P3). Round 2: red ring on the dog's head (round-1 still: head x 200-600,
  // y 1360-1645) so the threat reads at 120 px. Band: top (y ~240-500, sky and trunk above her hair).
  {...P('V2-CV1-danger-behind-tree', 'CV1', 15), layout: {grade: CV_GRADE, elements: redRing(400, 1500, 230, 165)}},
  // V2-CV2 scale shock, painted (sheet EDU19-CV2): worm's-eye, the nose huge over one faint print, her prints running to the far tree where she
  // peeks, tiny (pushes V2-P2 / V2-P4). Red ring on her (round-1 still: x 750-890, y 850-1150) so the hider reads at
  // 120 px. Band: top (sky).
  {...P('V2-CV2-nose-vs-hider', 'CV2', 15), layout: {grade: CV_GRADE, elements: redRing(815, 990, 92, 165)}},
  // V2-P3 face and emotion: her shock, hands at her mouth, the dog's head already round the trunk behind her (B02-SH07,
  // V04 "ห๊ะ!? ยังได้อีก"; gaps 3-4). Red ring on the dog's head (round-1 still: head x 355-440, y 800-900) so the
  // threat behind her reads at 120 px. Band: top (y ~240-500, sky and far trees above her hair).
  {...P('V2-P3-shock-dog-behind', 'B02-SH07', 40), layout: {grade: {vignette: 0.45}, elements: redRing(398, 852, 78, 84)}},
  // V2-P1 danger moment: the dog trotting along her trail straight at the tree where she peeks, still hidden for one more
  // frame (B01-SH06, L03b end; gaps 1, 4). Stand-in for EDU19-CV1. Round 3: vignette 0.55 -> 0.7 and a red ring on her
  // (round-2 still: head ~(768, 560), body to y ~760) so the target reads on the shelf. Band: bottom (y ~1300-1540 lawn).
  {...P('V2-P1-danger-closing-in', 'B01-SH06', 24), layout: {grade: {vignette: 0.7}, elements: redRing(770, 650, 78, 118)}},
  // V2-P4 subject close: the huge head, nose on one of her prints, the scent curling up (B01-SH03 L02 "รู้ได้ไง"; gaps 1-2).
  // Band: bottom (y ~1250-1540, dark lawn under the print).
  {...P('V2-P4-nose-huge', 'B01-SH03', 78), layout: {grade: {vignette: 0.55}}},
  // Dropped in the CV redo (user 2026-11-16 "Paint CV1 + CV2"): V2-P2 scale-hunter-hider (B04-SH02 l 72, mats behind the dog, CV04 risk) and
  // V2-P5 stopwatch-20 (B02-SH03 l 42); CV2 and P3 carry their ideas.
];

/**
 * EDU-EP19-SHORT-V2-COVERS: cover redo, pick 2 (cover-design skill sections 3-7, rewritten 2026-11-16). User picked picture
 * V2-CV2 nose-vs-hider (2026-11-16, structured question): painted shot EDU19-CV2 at local 15, EDU19_PICS_V2[1] with its
 * grade and red ring on the girl. V1 EDU19_COVERS (EDU-EP19-SHORT-COVERS) stays untouched. Hook sheet: the V2-PIC header
 * above (same script R4, Boat R1 + R3 recheck, sheets R3). Accent: red (V2 palette, the ring's colour; style
 * EDU19_COVER_STYLE_V2), so the stakes word and the ring on the hider read as one "target" cue.
 * Band: top (headline baselines y ~420-690, sky and branches; the ring on her starts at y ~825), behind a deeper dark top
 * edge grade than pick 1; every line inside x 40-960 (CV06). Channel mark redrawn in night ink (MARK, as V1).
 *
 * Candidates (one text angle each, skill section 3; words said or shown in the film, Boat verdicts):
 *   C1 survival bet   "ซ่อน / รอดมั้ย?"      accent "รอดมั้ย?"  ซ่อน L10; hide-and-seek bet, not bodily danger; paid: found in
 *                                                              rounds 1-2 (V01, V04), hidden in round 3 (L08, V06, L10).
 *   C2 you            "มันรู้ทาง / คุณ"       accent "คุณ"       L01 "บอกได้แล้วว่าคุณเดินไปทางไหน" (F001, F002); "มัน" = the
 *                                                              trained dog in the picture (Q8 scope carried by the picture).
 *   C3 extreme number "แค่ 5 รอย"             accent "5"         L01 "แค่ห้ารอย" (F002); the digit for the spoken ห้า.
 *   C4 wrong vs right "อย่ารอ / 20 นาที"      accent sticker "อย่ารอ"  V02 "รอยี่สิบนาที", B02-SH03 watch 20:00, L05 still
 *                                                              picks the right way (F009 replacement, SRC002).
 *   C5 contradiction  "กลิ่นหายแล้ว / ยังเจอ!?"  accent "ยังเจอ!?"  V02 "กลิ่นหายหมดแน่", V03 "หายเกลี้ยงแล้ว!" (her belief),
 *                                                              L05 + V04 "ยังได้อีก" (found, B02-SH06..SH07).
 *   Not used: ตำรวจ, หนี (unsupported), ลำดับ / สลับ / mats (the twist, CV04).
 *
 * Titles (skill section 4, CV11; Thai titles in scripts/edu-series/ep19/short/titles.md with scores). Every title keeps
 * Boat's Q8 scope "หมาตามรอย"; "ตามรอย" inside that compound is not counted as a repeat of cover word "รอย".
 *   T1 you transformed  "ถ้าคุณเล่นซ่อนแอบกับหมาตามรอย… ชนะได้ไง?"   L01, L08, V06, L10
 *   T2 survival yes/no  "หมาตามรอยตามหาคุณ… รอ 20 นาทีรอดมั้ย?"     L01, V02, L05, V04
 *   T3 contradiction    "ทุกรอยก็กลิ่นคุณ… ทำไมหมาตามรอยรู้ทาง?"     L02, L03, L03b
 *   T4 scale / extreme  "ดมแค่ห้ารอย หมาตามรอยรู้ทางคุณได้มั้ย?"      L01, L03
 *   T5 myth / mistake   "รอ 20 นาทีกลิ่นหาย? ผิด! หมาตามรอยยังเจอ"    V02, V03, L05, V04
 *   Clean pairs (no headline word in the title): C1+T3/T4/T5, C2+T5, C3+T1/T2/T5, C4+T1/T3/T4, C5+T1/T2/T4.
 * Render rounds: 2 of 4 (r1 all five; r2 C1 line spacing, C3 x1.08). Scores (skill section 7, 13 rows, max 26): C1 26,
 *   C3 25, C4 24, C5 24, C2 22; recommended C1 + T4.
 */
const CV2 = {plate: EDU19_PICS_V2[1].plate, local: EDU19_PICS_V2[1].local, scrim: false as const};
/** Pick-1 grade with a deeper top edge behind the headline band. */
const CV2_LAYOUT = {grade: {...CV_GRADE, edge: {side: 'top' as const, size: 860, opacity: 0.72}},
  elements: [...(EDU19_PICS_V2[1].layout?.elements ?? []), ...MARK]};
const RED_STICKER = {label: {color: RED, ink: '#fff6e8', pad: 0.4}};
export const EDU19_COVER_STYLE_V2: CoverStyle = {accent: RED};
export const EDU19_COVERS_V2: Cover[] = [
  // C1 survival bet: "ซ่อน" near-white over the huge red bet. Round 2: line 2 660 -> 690 (its tone marks touched "ซ่อน").
  {...CV2, id: 'C1-survival-hide', lines: [
    {text: 'ซ่อน', y: 440, size: 200, x: 500},
    {text: 'รอดมั้ย?', y: 690, size: 220, accent: true, x: 500}],
    layout: CV2_LAYOUT},
  // C2 you: "มันรู้ทาง" over a huge red "คุณ".
  {...CV2, id: 'C2-you-knows-your-way', lines: [
    {text: 'มันรู้ทาง', y: 420, size: 185, x: 500},
    {text: 'คุณ', y: 680, size: 270, accent: true, x: 500}],
    layout: CV2_LAYOUT},
  // C3 extreme number: one baseline, the red "5" huge between "แค่" and "รอย". Round 2: x1.08 (round-1 span x 136-918).
  {...CV2, id: 'C3-number-five', lines: runs(620, 95, [{text: 'แค่', size: 173, em: 1.25}, {text: '5', size: 356, accent: true, em: 0.6},
    {text: 'รอย', size: 216, em: 1.9}], {}, 26),
    layout: CV2_LAYOUT},
  // C4 wrong vs right: red sticker "อย่ารอ", near-white "20 นาที" under it.
  {...CV2, id: 'C4-wrong-dont-wait', lines: [
    {text: 'อย่ารอ', y: 430, size: 180, accent: true, x: 500, look: RED_STICKER},
    {text: '20 นาที', y: 665, size: 205, x: 500}],
    layout: CV2_LAYOUT},
  // C5 contradiction: her belief near-white and condensed, the red "ยังเจอ!?" big under it.
  {...CV2, id: 'C5-contradiction-still-found', lines: [
    {text: 'กลิ่นหายแล้ว', y: 420, size: 150, x: 500, look: COND},
    {text: 'ยังเจอ!?', y: 650, size: 225, accent: true, x: 500}],
    layout: CV2_LAYOUT},
];
