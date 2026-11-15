import type {Cover, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP17-SHORT-PIC-COVERS: cover pick 1 (cover-design skill, two-pick flow; docs/cover-principles.md CV01-CV10) for the
 * undersea-cable Short (working title "ทำไมสายอินเทอร์เน็ตต้องอยู่ใต้ทะเล", script EDU-EP17-SCRIPT-R1.2.1, fact-check
 * scripts/edu-series/ep17/fact-check.md + Boat R1.2.1 recheck of L14-L15, storyboard scripts/edu-series/ep17/storyboard.md).
 * Five pictures without text, one picture idea each, every plate the episode's registry plate `EDU17-<shot id>` (CV07,
 * the delivered final cut's plates); `local` is the shot-local frame (>= 15, COVER_STILL). The "ภาพจำลอง" label is a
 * timeline overlay, not in the plates, so no B05 (Red Sea) plate is used here: a cover from it would need the label drawn
 * and would put the war case, not the topic, on the cover.
 *
 * Promise: the viewer learns that a video call abroad almost never goes up to a satellite but runs along cables on the
 * seabed (L01-L03), because one cable carries far more than satellites (L05-L06); that the deep-sea cable is only about as
 * thick as a garden hose (L07), and that it breaks mostly near shore, where ships' anchors and trawl nets drag the bottom
 * (L10-L13, the Red Sea case L14-L15 included), yet you barely notice because traffic takes another cable (L17-L19).
 * Gaps (question -> answer line):
 *   1. My call abroad doesn't go to a satellite? Then how? -> L01-L02 (the line dives to the seabed cable).
 *   2. Why drag a cable through the sea instead of using satellites? -> L05-L06 (helicopter vs multi-lane motorway).
 *   3. How thick is the cable that carries the internet across the world? -> L07 (about a garden hose).
 *   4. What breaks it? -> L10-L13 (near shore: anchors and trawl nets; "มันกลัวเรือ").
 *   5. If it breaks every week, why is my internet fine? -> L18-L19 (it reroutes; his call may be detouring now).
 * Never shown (CV04): anchors, chains or nets near the cable and the hulls overhead (B01-SH03 L0-14, B04-SH02 L70+,
 * B04-SH04, B04-SH05 boats, B05-SH04), the Red Sea ship and cut cables (B05), the red break sparks and the rerouted pulse
 * (B06-SH01/SH02/SH04); no "ผู้ก่อการร้าย", sabotage or deliberate-cut framing.
 * Headline band for pick 2: per candidate below. Channel mark @TamMaiLa top-left (coversVideo chrome).
 */
const ACCENT = '#3fd0e0'; // cable-pulse cyan (the signal line and the cable glow)
const INK = '#0b1a24';
const ring = (cx: number, cy: number, rx: number, ry = rx) => [
  {kind: 'ellipse' as const, cx, cy, rx, ry, stroke: INK, sw: 22},
  {kind: 'ellipse' as const, cx, cy, rx, ry, stroke: ACCENT, sw: 11},
];
const P = (id: string, shot: string, local: number): Cover => ({id, plate: `EDU17-S01-${shot}`, local, scrim: false, lines: []});

export const EDU17_PICS: Cover[] = [
  // P1 subject close: the phone on its stand with the sister waving on the video call, the bay behind (S01-B01-SH01 L15, the
  // opening phone-close; L01 "วิดีโอคอลหาคนต่างประเทศ"; gap 1). Matches frame 0 of the Short (CV11 proposed). Band: top sky
  // (y ~240-620, plain blue above the horizon).
  {...P('P1-video-call', 'B01-SH01', 15), layout: {grade: {vignette: 0.35}}},
  // P2 odd view: the call made visible, a glowing line springing out of the phone on the rail and rising into the sky over his
  // shoulder (S01-B01-SH01 L85, before it bends down to the beach; gaps 1-2: up to a satellite?). Band: middle-left over the
  // cream wall left of him (y ~900-1400, x < 560).
  {...P('P2-call-leaves', 'B01-SH01', 85), layout: {grade: {vignette: 0.45}}},
  // P3 face and emotion: close on his squint, hand up as a visor, looking up and off for the satellite (S01-B02-SH02 L24,
  // W-SKY after L04 "ทำไมต้องลากสายลงทะเล… ไม่ใช้ดาวเทียมล่ะ"; gap 2). Gaze up and off-frame, chosen: he searches, the
  // viewer asks with him. Band: bottom over the brown porch wall (y ~1250-1540).
  {...P('P3-squint-sky', 'B02-SH02', 24), layout: {grade: {vignette: 0.4}}},
  // P4 action: his fist on the green hose above the waterline, the deep cable lying on the seabed below the seam
  // (S01-B03-SH02 L30, over-under split; L07; gap 3). Ring on the cable so it reads small; the equal-thickness claim stays
  // for the text pick and the film. Band: bottom, the calm dark water (y ~1250-1540).
  {...P('P4-hose-over-cable', 'B03-SH02', 30), layout: {grade: {vignette: 0.35}, elements: ring(760, 1066, 150, 62)}},
  // P5 diagram: the globe with the cable lines across the oceans and their landing dots (S01-B01-SH04 L60 = LF03; L03 "เน็ต
  // ข้ามประเทศ ราว ๆ เก้าสิบเก้าเปอร์เซ็นต์ ไปทางนี้"; gaps 1-2); ring on the warm yard dot in Thailand where his call
  // leaves. Band: bottom, plain navy space under the globe (y ~1250-1540).
  {...P('P5-globe-lines', 'B01-SH04', 60), layout: {grade: {vignette: 0.3}, elements: ring(450, 454, 62)}},
];

/**
 * EDU-EP17-SHORT-COVERS: cover pick 2 (cover-design skill section 3). The user picked P1 (subject close: the phone on its
 * stand with the sister waving on the video call, the bay behind; S01-B01-SH01 @ 15, matches frame 0 of the Short). P1's
 * weak point is a generic video call, so the oddness comes from the headline. Five text angles on the same plate and frame,
 * each opening a different gap; every word is said or subtitled in the film (line IDs and Boat fact IDs per candidate,
 * scripts/edu-series/ep17/research.md + fact-check.md), the F001 hedge ("แทบ" / "ราว") is kept, nothing names or draws
 * anchors, nets, the Red Sea case or a deliberate cut. The working title "ทำไมสายอินเทอร์เน็ตต้องอยู่ใต้ทะเล" is not repeated
 * (C3 shares one word, noted). Headline band: top sky, y ~240-620, under a dark top edge for white-text contrast; the
 * @TamMaiLa mark stays at y ~140 above it; last baseline <= 620.
 */
const P1C = {plate: 'EDU17-S01-B01-SH01', local: 15, scrim: false as const};
const P1C_GRADE = {vignette: 0.35, edge: {side: 'top' as const, size: 900, opacity: 0.7}};

export const EDU17_COVERS: Cover[] = [
  // C1 question: L01 "วิดีโอคอลหาคนต่างประเทศ" + L03 "…ไปทางนี้" asked as "which way?" (gap 1, OQ1). Answer L02 (it runs along
  // the cable on the seabed). No claim, so no hedge needed. Left-aligned, second line in the accent.
  {id: 'C1-which-way', ...P1C, lines: [{text: 'วิดีโอคอล', y: 410, size: 178, x: 70, anchor: 'start'}, {text: 'ไปทางไหน?', y: 590, size: 178, accent: true, x: 70, anchor: 'start'}],
    layout: {grade: P1C_GRADE}},
  // C2 misconception, cyan sticker: L01 "เสียงคุณแทบไม่ได้ขึ้นดาวเทียมนะ" verbatim minus "เสียงคุณ…นะ" (F001 ~99%, Boat L01
  // "supported after fix": the hedge "แทบ" stays, never a flat "ไม่ใช่ดาวเทียม"). Gap 1-2 (not a satellite? then how / why?).
  // Answer L02-L03, L05-L06.
  {id: 'C2-not-satellite', ...P1C, lines: [{text: 'แทบไม่ได้ขึ้น', y: 410, size: 155}, {text: 'ดาวเทียม', y: 600, size: 190, accent: true}],
    look: {label: {color: ACCENT, ink: INK, pad: 0.42}}, layout: {grade: P1C_GRADE}},
  // C3 imagined view / reaction teaser: his own line V01 "ห๊ะ? ใต้ทะเล?" (subtitled; dramatization), the viewer's surprise said
  // for them. Says where, not how, why or what breaks it (answers L02 how, L05-L06 why, L07 how thick). Shares "ใต้ทะเล" with
  // the working title (T3 risk, noted). One big line pair, centred.
  {id: 'C3-under-sea', ...P1C, lines: [{text: 'ห๊ะ?', y: 410, size: 200}, {text: 'ใต้ทะเล?', y: 600, size: 205, accent: true}],
    layout: {grade: P1C_GRADE}},
  // C4 number: L03 "เน็ตข้ามประเทศ ราว ๆ เก้าสิบเก้าเปอร์เซ็นต์" with its subtitle form "ราว 99%" (F001, ITU international
  // traffic; Boat L03 supported, hedge on the number). Gap: 99% of it goes where? Answer L02-L03 (the globe of cables). The
  // measured thing is the small first line; the number is the big accent line.
  {id: 'C4-99-percent', ...P1C, lines: [{text: 'เน็ตข้ามประเทศ', y: 390, size: 125}, {text: 'ราว 99%', y: 600, size: 215, accent: true}],
    layout: {grade: P1C_GRADE}},
  // C5 short bold, three words: the refrain L13 "…มันกลัวเรือ" (Boat L13 "supported as a mostly rule", S2; F016/F025). The
  // odd detail: something in this calm picture is afraid of boats, and the boats sit right there in the bay (K01). Gap 4
  // (what breaks it?), answer L10-L13. It names boats, not anchors or nets (CV04 never-shown list kept), but it does point at
  // the cause: spoiler risk noted for the user.
  {id: 'C5-fears-boats', ...P1C, lines: [{text: 'มันกลัว', y: 410, size: 210}, {text: 'เรือ', y: 610, size: 230, accent: true}],
    layout: {grade: P1C_GRADE}},
  // Cover pick 2, round 2 (user, 15 Nov 2026, chat: "แนว ๆ เน็ตไปใต้ทะเลได้ไหม"): four more wordings on the same P1 plate and
  // frame, all carrying "the internet goes under the sea". Every one names the L02 answer (under the sea), so the open gap
  // moves from "where" to "why the sea, not satellites" (OQ3, L04-L06) and "how thin / what breaks it" (L07, L10-L13).
  // No anchors, nets, boats-as-cause, Red Sea or deliberate cut. Same band (last baseline <= 620), x < 960, mark top-left.
  // C6 statement, the user's own shape: paraphrase of L02 "มันวิ่งไปตามสายที่นอนอยู่ก้นทะเล" + L03 "เน็ต…ไปทางนี้" (F001, F008;
  // Boat L02 supported). Generic, no quantity word, so no "all" claim to hedge; the F001 hedge stays in the film (L03 "ราว ๆ").
  {id: 'C6-net-under-sea', ...P1C, lines: [{text: 'เน็ต', y: 420, size: 220, x: 70, anchor: 'start'}, {text: 'ไปใต้ทะเล', y: 610, size: 180, accent: true, x: 70, anchor: 'start'}],
    layout: {grade: P1C_GRADE}},
  // C7 surprised reaction + statement: his V01 "ห๊ะ? ใต้ทะเล?" (subtitled) with "เน็ต" from L03 put in, question mark kept
  // (dramatization; F001, F008). Cyan sticker on the answer line, as C2.
  {id: 'C7-huh-net-sea', ...P1C, lines: [{text: 'ห๊ะ? เน็ต', y: 410, size: 175}, {text: 'ไปใต้ทะเล?', y: 600, size: 150, accent: true}],
    look: {label: {color: ACCENT, ink: INK, pad: 0.42}}, layout: {grade: P1C_GRADE}},
  // C8 "where does this call really go", naming the sea: L01 "วิดีโอคอลหาคนต่างประเทศ" + L02 "มันวิ่งไปตามสาย…ก้นทะเล" (F001,
  // F008). "นี้" points at the phone in the picture; the question mark carries L01's hedge ("แทบ"), so a domestic call is not
  // claimed. Left-aligned, accent second line.
  {id: 'C8-this-call-sea', ...P1C, lines: [{text: 'วิดีโอคอลนี้', y: 410, size: 165, x: 70, anchor: 'start'}, {text: 'วิ่งใต้ทะเล?', y: 600, size: 170, accent: true, x: 70, anchor: 'start'}],
    layout: {grade: P1C_GRADE}},
  // C9 hedged number-as-word: L03 "เน็ตข้ามประเทศ ราว ๆ เก้าสิบเก้าเปอร์เซ็นต์ ไปทางนี้" with "แทบทั้งหมด" for "ราว 99%"
  // (F001 ITU, international traffic; research.md hedge list item 1 allows "แทบทั้งหมด" or "ราว 99%"). "เน็ตข้ามประเทศ" is kept
  // as a small sub-line because the 99% is international traffic only; dropping it would overclaim. Headline 2 lines + sub-line.
  {id: 'C9-almost-all-sea', ...P1C, lines: [{text: 'เน็ตข้ามประเทศ', y: 328, size: 85}, {text: 'แทบทั้งหมด', y: 470, size: 125}, {text: 'ไปใต้ทะเล', y: 620, size: 145, accent: true}],
    layout: {grade: P1C_GRADE}},
];

/** Cable-pulse cyan. No scrim: pick 1 is text-free. */
export const EDU17_COVER_STYLE: CoverStyle = {accent: ACCENT};
