import type {Cover, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP32-SHORT-PIC-COVERS, Film pick 1, 2026-11-21 (cover-design skill sections 1-2, 6-7). Inputs: EDU-EP32-SCRIPT-R1 (short/script.md), film-brief R3,
 * the plates of the final cut (out/EDU-EP32-SHORT/EDU-EP32-SHORT.mp4, 1689 f). Notes and scores: scripts/edu-series/ep32/cover/notes.md.
 * Promise: the viewer finds out the CIA really put a microphone in a cat's ear and built a spy cat (L01, paid L08, L11-L14).
 * Stakes: the world's top spy agency against an ordinary cat; the cat goes where it likes, not where the plan needs (L07-L08); the project is shelved (L12).
 * Gaps: Did the CIA really wire a cat? (yes/no) -> L01. Why a cat? -> L03-L05. Did it work? (yes/no) -> L06-L08, L12. Why did it fail? -> L08-L10, L13.
 *   Who wins, agency or cat? -> L14.
 * Never shown (CV04): the memo and the stamp (L11-L12), L13's quote, the L14 callback. No claim about what became of the cat; no breed or colour claim.
 * Plates: P1 is a cover-only push-in (EDU32-COVER-EAR, src/painted/edu32/cover-shots.tsx); P2-P5 are episode plates at a chosen frame (the cover's local
 *   frame is the plate's shot-local frame), clear of captions and callouts.
 * Headline bands: P1 left under the chin, x 40-600, y 1150-1550; P2 the sky above the trees, y 250-520; P3 the lawn left of the cat, y 1100-1500;
 *   P4 the dark left, x 40-560, y 1000-1500; P5 the grass above the clipboard, y 250-480.
 */
const INK = '#1b222b';
const MARK = [
  {kind: 'text' as const, text: '@TamMaiLa', x: 120, y: 151, size: 22, fill: INK, stroke: INK, sw: 6},
  {kind: 'text' as const, text: '@TamMaiLa', x: 120, y: 151, size: 22, fill: '#f2f6ff'},
];
const RING = [
  {kind: 'ellipse' as const, cx: 706, cy: 520, rx: 92, ry: 110, stroke: '#0b0d16', sw: 26},
  {kind: 'ellipse' as const, cx: 706, cy: 520, rx: 92, ry: 110, stroke: '#ff3b30', sw: 13},
];
const P = (id: string, plate: string, local: number, elements: any[] = MARK): Cover =>
  ({id, plate, local, scrim: false, lines: [], layout: {grade: {vignette: 0.45}, elements}});
export const EDU32_PICS: Cover[] = [
  P('P1-ear-mic', 'EDU32-COVER-EAR', 15, [...MARK, ...RING]),
  P('P2-cat-between-agents', 'EDU32-B02-SH03', 30),
  P('P3-paw-trail-clipboard', 'EDU32-B03-SH04', 60),
  P('P4-mic-close', 'EDU32-COVER-MIC', 15),
  P('P5-cat-in-sun-spot', 'EDU32-B04-SH01', 60),
];
export const EDU32_COVER_STYLE: CoverStyle = {accent: '#ffd21f'};

/**
 * EDU-EP32-SHORT-COVERS, Film pick 2, 2026-11-21 (cover-design skill sections 3-7). The user picked P1 (EDU32-COVER-EAR, cat head in profile, red ring on
 * the ear-mic) and dropped P3 and P5. Never on a cover or title (CV04): the memo and stamp (L11-L12), L13's quote, the L14 callback, what became of the
 * cat, any breed or colour claim, REJECTED, CLASSIFIED or dates. The ring cue and the channel mark are kept from P1.
 * Angles (CV09): C1 survival bet as yes/no (did it work? answered L08, L12), C2 you (your cat, L01), C3 extreme (it is real, F001/L01),
 *   C4 wrong vs right (red sticker, "do not trust a cat", L02-L08), C5 contradiction / versus (the agency against one cat, L14's question).
 * Bands: all five sit left under the chin (x 40-620, y ~1150-1550) with a left edge grade; the neck starts at x ~650 there.
 * Titles (CV11; formula; hook in the first three words; <= ~40 characters; no cover word repeated; pairs noted):
 *   T1 you transformed: ถ้า CIA ใส่ไมค์ในหูแมวคุณ… มันจะไปไหน?  (L01, L08; avoid with C2 and C3)
 *   T2 survival yes/no: แมวที่ CIA ใส่ไมค์ ทำภารกิจสำเร็จมั้ย?  (L06-L08, answer withheld; avoid with C1)
 *   T3 contradiction:   ฝังเครื่องส่งในตัวแมว… ทำไมยังคุมมันไม่ได้?  (L01, L08-L09)
 *   T4 scale / extreme: หน่วยลับเก่งที่สุดในโลก vs แมวตัวเดียว ใครชนะ?  (L01 attitude line, L14; avoid with C5)
 *   T5 myth:            ใครว่าแมวสายลับมีแค่ในหนัง? CIA ทำจริง  (F001, L01; avoid with C3)
 * Score and sheets: scripts/edu-series/ep32/cover/notes.md; out/ep32-cover/pass2/.
 */
const RED = '#ff3b30';
const CV = {plate: 'EDU32-COVER-EAR', local: 15, scrim: false as const};
const LEFT = {grade: {vignette: 0.45, edge: {side: 'left' as const, size: 520, opacity: 0.65}}, elements: [...MARK, ...RING]};
const X = {x: 50, anchor: 'start' as const};
export const EDU32_COVERS: Cover[] = [
  {...CV, id: 'C1-bet-worked', lines: [
    {text: 'แมวสายลับ', y: 1290, size: 140, ...X},
    {text: 'ได้ผลมั้ย?', y: 1460, size: 140, accent: true, ...X}], layout: LEFT},
  {...CV, id: 'C2-you-your-cat', lines: [
    {text: 'ถ้าแมวคุณ', y: 1290, size: 150, ...X},
    {text: 'โดนใส่ไมค์?', y: 1460, size: 140, accent: true, ...X}], layout: LEFT},
  {...CV, id: 'C3-extreme-real', lines: [
    {text: 'CIA', y: 1290, size: 200, ...X},
    {text: 'ทำจริง!', y: 1470, size: 190, accent: true, ...X}], layout: LEFT},
  {...CV, id: 'C4-wrong-trust', lines: [
    {text: 'อย่าไว้ใจ', y: 1290, size: 150, ...X},
    {text: 'แมว!', y: 1470, size: 190, accent: true, rotate: -4, look: {label: {color: RED, ink: '#ffffff', pad: 0.3}}, x: 60, anchor: 'start'}], layout: LEFT},
  {...CV, id: 'C5-versus', lines: [
    {text: 'CIA vs แมว', y: 1220, size: 118, ...X},
    {text: 'ใครชนะ?', y: 1420, size: 190, accent: true, ...X}], layout: LEFT},
];
