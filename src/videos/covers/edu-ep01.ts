import type {Cover, CoverLook, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP01-SHORT-COVERS: five cover candidates (docs/cover-principles.md, CV01-CV10) for the hypnic-jerk Short (C2 dream-fall,
 * sheets EDU-SHEETS-R1.1). Plates are the episode's registry plates `EDU1-<shot id>` (CV07); `local` is the shot-local frame.
 * Thai copy uses only what the narration says (CV04, captions.ts): the fall is imagined (L05), the name is said (L07), the
 * cause is "not known for sure" (L08). CV09 swap: the script has no number or date, so E is the plain "fact" angle (the
 * cause is still unknown). Text centred on x 540, inside y 240-1680, last baseline <= 1470 (clear of the bottom 20%), widths
 * inside x 120-960 (right 120 px clear). Plates in a caption cue carry the episode's light caption band (shade 0.3).
 * Headlines are size >= 192 (Thai consonant body >= 135 px = 7% of 1920, CV02, measured) at wdth 80 so they fit the width.
 */
const HEAD: CoverLook = {stretch: 80};

export const EDU1_COVERS: Cover[] = [
  // A question. S01-B03-SH03 the fall (no caption cue), L30: front-view tumble mid-air, streaks rising.
  {id: 'A-question', plate: 'EDU1-S01-B03-SH03', local: 30, lines: [{text: 'ทำไมสะดุ้ง?', y: 1340, size: 192, accent: true, look: HEAD}, {text: 'ตอนกำลังจะหลับ', y: 1470, size: 92}]},
  // B subject. S01-B03-SH05 the jolt (no caption), L15 (local >= COVER_STILL 15): eyes still wide after the lift; (plateMove is not used: the painted canvas sits under the scene transform, so it does not move the plate); headline is the name said in L07.
  {id: 'B-name', plate: 'EDU1-S01-B03-SH05', local: 15, lines: [{text: 'ฮิปนิก เจิร์ก', y: 1340, size: 192, accent: true, look: HEAD}, {text: 'อาการนี้มีชื่อนะ', y: 1470, size: 92}]},
  // C face. S01-B01-SH02 close-up, L30: eyes open on the lens, small rueful smile (L02 "คุณก็เคยใช่ไหม?").
  {id: 'C-face', plate: 'EDU1-S01-B01-SH02', local: 30, lines: [{text: 'คุณก็เคย?', y: 1340, size: 200, accent: true, look: HEAD}, {text: 'เหมือนตกจากที่สูง', y: 1470, size: 92}]},
  // D impossible detail. S01-B03-SH02 cliff edge, back view, L30 (before the lean): L05 "ขอบหน้าผา ที่ไม่มีอยู่จริง".
  {id: 'D-cliff', plate: 'EDU1-S01-B03-SH02', local: 30, lines: [{text: 'หน้าผา', y: 1310, size: 200, look: HEAD}, {text: 'ที่ไม่มีอยู่จริง', y: 1460, size: 130, accent: true}]},
  // E fact (swap for number/date, see above). S01-B05-SH03 brain switch, L100: sun-to-moon slider caught (L08 "ยังไม่มีใครรู้แน่ชัด").
  {id: 'E-fact', plate: 'EDU1-S01-B05-SH03', local: 100, lines: [{text: 'ยังไม่มีใครรู้', y: 1340, size: 192, accent: true, look: HEAD}, {text: 'สาเหตุที่แน่ชัด', y: 1470, size: 92}]},
];

/** Moon-yellow accent (the moon and clock glow of the night palette); scrim from y 1120 for the pale dream and paper plates. */
export const EDU1_COVER_STYLE: CoverStyle = {accent: '#ffd36b', scrimY: 1120};

/**
 * EDU-EP01-SHORT-V2-COVERS: five candidates in the new cover approach (.agents/skills/cover-design; research note
 * docs/research/2026-11-07-cover-thumbnail-principles.md, proposed). Inputs: script EDU-SCRIPT-R1.1, fact-check verdicts
 * (L01/L04/L10/L13 fixed wording), sheets EDU-SHEETS-R1.1, title "ตกจากที่สูงตอนกำลังจะหลับ" (never repeated whole, CV02).
 * - Promise: the viewer learns that the drop-and-jerk when drifting off has a name and that nobody knows for sure why it
 *   happens (L07, L08-L12).
 * - Gaps: why do I jerk as I fall asleep? (L08-L12); where does the falling picture come from, is the drop real? (L05);
 *   could the brain be misreading something? (L11); is it dangerous? (L14-L15); what is it linked to? (L13).
 * - Never shown: the name "hypnic jerk / ฮิปนิก เจิร์ก" (L07) and the answer "ยังไม่มีใครรู้แน่ชัด" (L08/L12).
 * Copy only from the film: "สะดุ้ง" (L15), "จู่ ๆ ก็…ตก" (L01), "เริ่มเคลิ้ม" (L03), "ขอบหน้าผา ที่ไม่มีอยู่จริง" (L05),
 * "สมองอาจเข้าใจผิด" (L11, hedge kept as "?"), "คืนนี้ ลองสังเกตดู" (L16). Number angle swapped (the script says no number):
 * N5 is the hypothesis-B misread with an arrow diagram. Headline in the top band (baselines y 470-660) under a top `edge`
 * grade, `scrim: false`, x inside 120-960 (CV06).
 */
const RED1 = '#ff5a4e';
const MOON = '#ffd36b';
const TOP1 = {edge: {side: 'top' as const, size: 820, opacity: 0.85}};
export const EDU1_COVERS_V2: Cover[] = [
  // N1 subject question. S01-B03-SH05 the jolt L15: eyes wide; circle on the face (payoff L08-L12).
  {id: 'N1-jolt', plate: 'EDU1-S01-B03-SH05', local: 15, scrim: false,
    lines: [{text: 'สะดุ้งทำไม?', y: 500, size: 180, accent: true}, {text: 'ตอนเริ่มเคลิ้ม', y: 650, size: 110}],
    layout: {grade: TOP1, elements: [
      {kind: 'ellipse', cx: 360, cy: 790, rx: 150, ry: 115, stroke: '#0b0d16', sw: 24},
      {kind: 'ellipse', cx: 360, cy: 790, rx: 150, ry: 115, stroke: MOON, sw: 12},
    ]}},
  // N2 wrong vs right. S01-B03-SH02 cliff edge, back view L30; red sticker (L05 "ขอบหน้าผา ที่ไม่มีอยู่จริง").
  {id: 'N2-cliff', plate: 'EDU1-S01-B03-SH02', local: 30, scrim: false,
    lines: [{text: 'หน้าผานี้', y: 1290, size: 150}, {text: 'ไม่มีอยู่จริง', y: 1470, size: 150, accent: true}],
    look: {label: {color: RED1, ink: '#ffffff', pad: 0.42}},
    layout: {grade: {edge: {side: 'bottom', size: 1000, opacity: 0.8}}}},
  // N3 odd view. S01-B03-SH03 the fall L30, lilac tint + vignette (L01 "จู่ ๆ ก็รู้สึกเหมือนตก", L03 "เริ่มเคลิ้ม"); payoff L05-L07.
  {id: 'N3-fall', plate: 'EDU1-S01-B03-SH03', local: 30, scrim: false,
    lines: [{text: 'จู่ ๆ ก็ตก?', y: 440, size: 190, accent: true}, {text: 'ทั้งที่นอนอยู่', y: 1470, size: 120}],
    layout: {grade: {edge: {side: 'top', size: 640, opacity: 0.8}, vignette: 0.45, tint: {color: '#6b4fa0', opacity: 0.35, blend: 'color'}}}},
  // N4 try this, "you" action. S01-B01-SH02 face close-up L30, eyes on the lens (L16 "คืนนี้… ลองสังเกตดูนะ ว่าตอนที่คุณ…"); payoff L16/L01 loop.
  {id: 'N4-tonight', plate: 'EDU1-S01-B01-SH02', local: 30, scrim: false,
    lines: [{text: 'คืนนี้', y: 440, size: 200, accent: true}, {text: 'ลองสังเกตดู', y: 585, size: 120}],
    layout: {grade: {...TOP1, vignette: 0.3}}},
  // N5 diagram (number swap). S01-B05-SH05 hypothesis B misread L15, the brain-cloud's eyes on the circled tiny sleeper (L11 "สมองอาจเข้าใจผิด"); payoff L11-L12.
  {id: 'N5-brain', plate: 'EDU1-S01-B05-SH05', local: 15, scrim: false,
    lines: [{text: 'สมอง', y: 1230, size: 150}, {text: 'เข้าใจผิด?', y: 1410, size: 180, accent: true}],
    layout: {grade: {edge: {side: 'bottom', size: 1000, opacity: 0.7}}, elements: [
      {kind: 'ellipse', cx: 500, cy: 785, rx: 170, ry: 80, stroke: '#0b0d16', sw: 24},
      {kind: 'ellipse', cx: 500, cy: 785, rx: 170, ry: 80, stroke: MOON, sw: 12},
    ]}},
];
