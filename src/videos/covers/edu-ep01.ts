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
