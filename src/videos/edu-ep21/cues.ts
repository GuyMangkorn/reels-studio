// EDU-EP21-SHORT caption cues (W5.3 Draft, Editor, 2026-11-17). Pure data. Source: scripts/edu-series/ep21/short/scene-sheets.md EDU-EP21-SHEETS-R3
// "Caption plan" table, G clock, half-open [from, to) at 30 fps. Thai verbatim from the sheet (SCRIPT-R1 wording, "..." as the script has it).
// Line breaks: three cues the width estimate marks MAY-WRAP (C03, C05a, C10) and C02b (measured ink x177-903, 15 px past the caption-safe x888) carry one authored \n at a word boundary (caption-breaks.mjs; text otherwise verbatim).
// The plan is not contiguous: the gaps (G0-3, 27-29, 101-103 ... 1236-1320) show no caption (empty text), as the sheet orders ("No caption during the hold").
export type Edu21Cue = {id: string; from: number; to: number; text: string};
const raw: [string, number, number, string][] = [
  ['C01a', 3, 27, 'ไม่ใช่ยางนะ...'],
  ['C01b', 29, 101, 'ที่ช่วยป้องกันคนในรถถูกฟ้าผ่า'],
  ['C02a', 103, 153, 'ต้องเป็นรถปิดมิดชิด'],
  ['C02b', 155, 222, 'หลังคากับตัวถังโลหะ\nปิดกระจกด้วย'],
  ['C03', 228, 312, 'ตัวที่ช่วยป้องกัน\nกลับเป็นเปลือกโลหะรอบคุณ'],
  ['C04a', 320, 363, 'เดี๋ยว...โลหะนำไฟฟ้า'],
  ['C04b', 365, 404, 'แล้วมันจะช่วยได้ยังไง?'],
  ['C05a', 413, 487, 'เพราะกระแสไฟไหล\nไปตามเปลือกโลหะด้านนอก'],
  ['C05b', 489, 550, 'รอบคนข้างใน แล้วลงดิน'],
  ['C06a', 552, 596, 'แต่ถ้าคิดว่ารถไม่เป็นอะไร...'],
  ['C06b', 598, 638, 'ดูยางก่อน'],
  ['C07a', 646, 708, 'ฟ้าผ่ายังทำให้ยางเสียหายได้'],
  ['C07b', 710, 759, 'มันไม่ได้หยุดอยู่เหนือยางนะ'],
  ['C08', 771, 822, 'งั้นทำไมไฟหน้าปัดถึงดับไปด้วย?'],
  ['C09a', 825, 869, 'เพราะกระแสไฟบางส่วน'],
  ['C09b', 871, 930, 'อาจเข้าไปทำลายระบบไฟของรถได้'],
  ['C10', 936, 1011, 'ช่วยป้องกันคน\nไม่ได้แปลว่ารถจะไม่พัง'],
  ['C11a', 1013, 1050, 'แล้วก็ไม่ได้รับประกันว่า'],
  ['C11b', 1052, 1102, 'คนข้างในจะปลอดภัยทุกครั้ง'],
  ['C12a', 1110, 1169, 'โลหะที่คุณกลัวว่านำไฟ...'],
  ['C12b', 1171, 1236, 'กลับเป็นทางให้ไฟผ่านรอบตัวคุณ'],
];
export const EDU21_CUES: Edu21Cue[] = raw.map(([id, from, to, text]) => ({id, from, to, text}));

/** Caption events for `assemblePaintedTimeline`: each cue onset, an empty event at each cue end, and each scene start with the text showing there. */
export const edu21CaptionEvents = (cutStarts: number[]): {at: number; text: string}[] => {
  const textAt = (g: number) => EDU21_CUES.find((c) => c.from <= g && g < c.to)?.text ?? '';
  const at = new Set<number>([0, ...EDU21_CUES.flatMap((c) => [c.from, c.to]), ...cutStarts]);
  return [...at].sort((a, b) => a - b).map((g) => ({at: g, text: textAt(g)}));
};
