// EDU-EP32-SHORT caption cards (Editor, W5.3 pass 1, 2026-11-21; 55 cards). Pure data on the composition clock G (30 fps, 1689 f).
// Source: the "Caption cards" table of EDU-EP32-SHEET-R1 (scripts/edu-series/ep32/short/timed-sheet.md; Film planned the splits from the VOICE-R2 envelope,
// onset = 2 f before the next word, a card runs to the next card's onset, at least 15 f, one line), Thai verbatim from SCRIPT-R1 (the sheet's own count says 55,
// its table has 54 rows; the Editor split L13d (42 f, 742 px on the rendered still, over the 696 px a centred card may use in the x120-888 box) at the syllable midpoint G1489 into L13d1/L13d2 = 55). No card from G1647 (the stamp insert has none by design). EP26 look: scale 1.4 (71 px), bottomEdgeY 1344,
// pop-in `captionPose`. Pixel width of every card is measured on rendered stills (tests/edu-ep32.test.ts holds the character-width bound; the still measure is in build-notes).
// Shared by index.ts (timeline captions as data, preset none), chrome.tsx (drawn captions + shade + mark) and the test.
export type Edu32Card = {id: string; from: number; to: number; text: string};
const raw: [string, number, number, string][] = [
  ["L01a", 0, 18, "CIA"],
  ["L01b", 18, 43, "หน่วยสืบราชการลับ"],
  ["L01c", 43, 83, "ที่เก่งที่สุดในโลก…"],
  ["L01d", 83, 105, "เคยผ่าตัด"],
  ["L01e", 105, 144, "ใส่ไมค์ที่หูแมว"],
  ["L01f", 144, 185, "ฝังเครื่องส่งในตัว"],
  ["L01g", 185, 236, "ถักเสาอากาศไว้ในขน"],
  ["L02a", 236, 269, "แมว"],
  ["L02b", 269, 295, "ใช่ ตัวที่เรียกแล้ว"],
  ["L02c", 295, 327, "ไม่เคยมาน่ะแหละ"],
  ["L03a", 327, 352, "แผนคือ…"],
  ["L03b", 352, 374, "ให้แมวไปแอบฟัง"],
  ["L03c", 374, 403, "สายลับคุยกับหัวหน้า"],
  ["L03d", 403, 438, "ฝั่งโซเวียตในสวน"],
  ["L04a", 438, 459, "ไม่มีใครระแวง"],
  ["L04b", 459, 502, "แมวหรอก"],
  ["L05a", 502, 525, "ก็จริง…"],
  ["L05b", 525, 543, "เพราะแมวไม่ทำงาน"],
  ["L05c", 543, 581, "ให้ใครอยู่แล้ว"],
  ["L06a", 581, 599, "แต่พอปล่อยลง"],
  ["L06b", 599, 646, "สนามทดสอบ…"],
  ["L07a", 646, 671, "เป้าหมายอยู่ซ้าย…"],
  ["L07b", 671, 694, "ซ้าย…"],
  ["L07c", 694, 710, "มันไปนอน"],
  ["L07d", 710, 742, "ตากแดดแล้วครับ"],
  ["L08a", 742, 786, "CIA ยอมรับเองว่า"],
  ["L08b", 786, 818, "แมวไปไหนก็ได้ตามใจ…"],
  ["L08c", 818, 849, "ยกเว้นที่ที่เขา"],
  ["L08d", 849, 881, "อยากให้ไป"],
  ["L09a", 881, 899, "แล้วก็…"],
  ["L09b", 899, 920, "อดีตเจ้าหน้าที่"],
  ["L09c", 920, 953, "คนหนึ่งเล่าว่า"],
  ["L09d", 953, 997, "แมวหนีงานเวลาหิว"],
  ["L09e", 997, 1034, "ทีมเลยต่อสายเพิ่ม"],
  ["L09f", 1034, 1078, "ไว้กดความหิว"],
  ["L10a", 1078, 1093, "ทั้งที่จริง ๆ…"],
  ["L10b", 1093, 1131, "ให้ข้าวก็จบแล้ว"],
  ["L11a", 1131, 1181, "ปี 1967"],
  ["L11b", 1181, 1210, "เอกสารลับของ CIA"],
  ["L11c", 1210, 1256, "เรียกการฝึกแมวว่า"],
  ["L11d", 1256, 1275, "\"ความสำเร็จ"],
  ["L11e", 1275, 1300, "ทางวิทยาศาสตร์"],
  ["L11f", 1300, 1341, "ที่น่าทึ่ง\""],
  ["L12a", 1341, 1368, "แต่สรุปว่า…"],
  ["L12b", 1368, 1411, "ใช้งานจริงไม่ได้"],
  ["L13a", 1411, 1429, "เว็บ CIA"],
  ["L13b", 1429, 1449, "ยังเขียนเองเลยว่า"],
  ["L13c", 1449, 1468, "แมว"],
  ["L13d1", 1468, 1489, "\"มีความคิด"],
  ["L13d2", 1489, 1510, "ของมันเอง\"…"],
  ["L13e", 1510, 1539, "เรื่องที่คนเลี้ยงแมว"],
  ["L13f", 1539, 1583, "ทุกคน \"คุ้นเคยดี\""],
  ["L14a", 1583, 1602, "ใช่…"],
  ["L14b", 1602, 1628, "ตัวที่เรียกแล้วไม่เคยมา"],
  ["L14c", 1628, 1647, "น่ะแหละ"],
];
export const EDU32_CARDS: readonly Edu32Card[] = raw.map(([id, from, to, text]) => ({id, from, to, text}));
export const CAPTION_END = 1647;

/** Caption events for `assemblePaintedTimeline`: a cue at every card start, restated at every cut start, '' in the hold. */
export const edu32CaptionEvents = (cutStarts: readonly number[]): {at: number; text: string}[] => {
  const textAt = (g: number) => EDU32_CARDS.find((c) => c.from <= g && g < c.to)?.text ?? '';
  const at = new Set<number>([0, ...cutStarts, ...EDU32_CARDS.map((c) => c.from), CAPTION_END]);
  return [...at].sort((a, b) => a - b).map((g) => ({at: g, text: textAt(g)}));
};

/** Pop-in of the EP26 look (same constants and curve as src/painted/edu26/captions26.ts `captionPose`), over this episode's cards. The last card (G1628-1647) fades over 4 f. */
export const POP_IN_FRAMES = 5, POP_OPACITY_FRAMES = 3, POP_FADE_OUT_FRAMES = 4, POP_RISE_PX = 22, POP_FROM_SCALE = 0.9;
export const captionPose32 = (g: number): {card: Edu32Card; opacity: number; dy: number; scale: number} | null => {
  const card = EDU32_CARDS.find((c) => c.from <= g && g < c.to);
  if (!card) return null;
  if (card.from === 0) return {card, opacity: 1, dy: 0, scale: 1};   // subtitles from frame 0: the first card does not pop
  const k = g - card.from, e = 1 - Math.pow(1 - Math.min(1, k / POP_IN_FRAMES), 3);
  const followed = EDU32_CARDS.some((n) => n.from === card.to);
  const fadeOut = followed ? 1 : Math.min(1, (card.to - g) / POP_FADE_OUT_FRAMES);
  return {card, opacity: Math.min(1, (k + 1) / POP_OPACITY_FRAMES) * fadeOut, dy: (1 - e) * POP_RISE_PX, scale: POP_FROM_SCALE + (1 - POP_FROM_SCALE) * e};
};
