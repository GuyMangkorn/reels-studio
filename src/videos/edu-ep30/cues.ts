// EDU-EP30-SHORT caption cues (Editor, pass 1, 2026-11-20; 36 cards). Pure data on the composition clock G (30 fps, 1977 f). Source: the "VO + subtitles"
// lines of scripts/edu-series/ep30/short/scene-sheets/b01.md-b07.md (EDU-EP30-SCENE-R2.2, speech ranges measured on VOICE-R2.2): global frames [from, to),
// Thai verbatim from script EDU-EP30-SCRIPT-R2.2. Character lines (L03, L19, L22, L23, L21) are captioned like narration, no speaker label. No caption in the three
// mime beats (L07 [811, 868), PB01 [1131, 1143) after L23, L15 [1544, 1583)) and none from G1924 (the hold). Line breaks are authored at word boundaries for every card
// wider than one line (the caption-safe box is x 120-888 = 768 px; `scripts/caption-breaks.mjs --max 26` at 51 px). The sheet's bold lines (L01a, L14, L17) are drawn at the
// shared weight: `Subtitles` has no bold variant (open question to Film, build-notes).
export type Edu30Cue = {id: string; from: number; to: number; text: string};
const raw: [string, number, number, string][] = [
  ['L01a', 2, 90, 'ออสเตรเลียเคยส่งทหารพร้อมปืนกล\nไปรบกับนกอีมู…'],
  ['L01b', 93, 149, 'แล้วต้องถอนทัพ ไม่ใช่รอบเดียวนะ'],
  ['L01c', 152, 186, 'สองรอบ'],
  ['L02a', 206, 297, 'ปี 1932 นกอีมูราว ๆ สองหมื่นตัว'],
  ['L02b', 300, 355, 'ลงกินไร่ข้าวสาลีเป็นบุฟเฟต์'],
  ['L03a', 358, 398, 'กินหมดไร่แล้ว!'],
  ['L03b', 402, 440, 'เรียกทหารมาเลย!'],
  ['L04a', 450, 494, 'กองทัพส่งมาเต็มกำลัง…'],
  ['L04b', 496, 592, 'แมเจอร์เมเรดิธ ทหารอีกสองนาย\nปืนกลสองกระบอก'],
  ['L19a', 597, 640, 'สามคนเหรอ…'],
  ['L19b', 642, 667, 'เรามีสองหมื่นนะ'],
  ['L22', 673, 688, 'ยิง!'],
  ['L06a', 704, 760, 'แผนแรก ยิงใส่ฝูง…'],
  ['L06b', 760, 811, 'นกแตกฝูง วิ่งหนีออกนอกระยะ'],
  ['L09a', 875, 924, 'แผนสอง ซุ่มที่เขื่อน'],
  ['L09b', 927, 993, 'นกเป็นพันเดินเข้ามาเอง\nเหมือนต่อคิว'],
  ['L10a', 1003, 1040, 'ยิงไปได้แค่สิบกว่าตัว…'],
  ['L10b', 1040, 1062, 'ปืนกลติด'],
  ['L23a', 1069, 1092, 'โธ่เอ๊ย…'],
  ['L23b', 1093, 1131, 'ติดตอนนี้เนี่ยนะ!'],
  ['L12a', 1143, 1210, 'แผนสาม เอาปืนกลขึ้นรถไล่ตาม…'],
  ['L12b', 1212, 1294, 'รถตามไม่ทัน\nทางกระเด้งจนเล็งไม่ได้'],
  ['L13a', 1301, 1359, 'ผ่านไปหกวัน รัฐมนตรีสั่งถอนทัพ…'],
  ['L13b', 1363, 1388, 'รอบที่หนึ่ง'],
  ['L21', 1393, 1434, 'ไว้มาใหม่นะ!'],
  ['L14a', 1441, 1476, 'แมเจอร์เองยังพูดเลยว่า…'],
  ['L14b', 1480, 1544, 'นกพวกนี้ทนปืนกลได้\nอย่างกับรถถัง'],
  ['L16a', 1583, 1636, 'ไม่กี่วันก็กลับมาภาคสอง'],
  ['L16b', 1639, 1679, 'ลากยาวไปถึงธันวา…'],
  ['L16c', 1681, 1737, 'แล้วก็ถอนอีก รอบที่สอง'],
  ['L17a', 1741, 1819, 'ส่วนนกอีมู\nอยู่บนตราแผ่นดินออสเตรเลีย'],
  ['L17b', 1821, 1855, 'มาตั้งแต่ปี 1908'],
  ['L18a', 1857, 1886, 'วันนี้ก็ยังอยู่…'],
  ['L18b', 1889, 1924, 'ไม่เคยถอยสักรอบ'],
];
export const EDU30_CARDS: readonly Edu30Cue[] = raw.map(([id, from, to, text]) => ({id, from, to, text}));
export const CAPTION_END = 1924;

/** Caption events for `assemblePaintedTimeline`: a cue at every card start and end (empty text in a gap), restated at every cut start so each scene opens with a cue. */
export const edu30CaptionEvents = (cutStarts: readonly number[]): {at: number; text: string}[] => {
  const at = new Set<number>([0, ...cutStarts, ...EDU30_CARDS.flatMap((c) => [c.from, c.to])]);
  const textAt = (g: number) => EDU30_CARDS.find((c) => c.from <= g && g < c.to)?.text ?? '';
  const cuts = new Set(cutStarts);
  const events: {at: number; text: string}[] = [];
  [...at].sort((a, b) => a - b).forEach((g) => {
    const text = textAt(g);
    if (events.length && events[events.length - 1].text === text && !cuts.has(g)) return;
    events.push({at: g, text});
  });
  return events;
};
