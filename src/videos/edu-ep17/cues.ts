// EDU-EP17-SHORT caption cues (W5.3 redraft, Editor, 2026-11-15; 37 cues, narration v2). Pure data. Source: scripts/edu-series/ep17/scene-sheets.md R1.2 "Caption plan" (G [start, end), cue = floor(phrase onset) to round(voiced end + 6) capped at the next onset),
// Thai verbatim from script R1.2.1 (L03 shows "99%" as the script directs). No caption in W-SKY (G353-380 after L04b), B05-SH05 after L15 (G1366-1388 is empty, 1366 is the cue end) or W-HOLD (G1657-1709); a gap between cues clears the text.
export type Edu17Cue = {id: string; from: number; to: number; text: string};
export const EDU17_CUES: Edu17Cue[] = ([
  ['L01a', 12, 56, 'วิดีโอคอลหาคนต่างประเทศ…'],
  ['L01b', 56, 106, 'เสียงคุณแทบไม่ได้ขึ้นดาวเทียมนะ'],
  ['L02', 106, 162, 'มันวิ่งไปตามสายที่นอนอยู่ก้นทะเล'],
  ['L03', 164, 232, 'เน็ตข้ามประเทศ ราว ๆ 99% ไปทางนี้'],
  ['V01', 234, 290, 'ห๊ะ? ใต้ทะเล?'],
  ['L04a', 291, 328, 'ทำไมต้องลากสายลงทะเล…'],
  ['L04b', 328, 355, 'ไม่ใช้ดาวเทียมล่ะ'],
  ['L05a', 382, 422, 'ดาวเทียมเหมือนเฮลิคอปเตอร์…'],
  ['L05b', 424, 455, 'ขนได้ทีละนิด'],
  ['L06a', 457, 492, 'สายใต้ทะเลเส้นเดียว'],
  ['L06b', 492, 536, 'คือทางด่วนหลายสิบเลน'],
  ['L07a', 544, 572, 'แต่กลางทะเลลึก…'],
  ['L07b', 572, 609, 'สายที่แบกเน็ตข้ามโลก'],
  ['L07c', 610, 663, 'หนาแค่ประมาณสายยางรดน้ำ'],
  ['V02', 664, 704, 'แค่นี้เองเหรอ?'],
  ['L09', 705, 741, 'แล้วอะไรทำมันขาดล่ะ'],
  ['L10a', 747, 769, 'แปลกตรงที่…'],
  ['L10b', 772, 825, 'มันมักขาดตรงน้ำตื้นใกล้ฝั่ง'],
  ['L10c', 825, 856, 'ไม่ใช่กลางทะเลลึก'],
  ['V03', 860, 884, 'เอ๊ะ?'],
  ['L12a', 884, 915, 'เพราะตรงนั้นมีเรือ…'],
  ['L12b', 915, 964, 'สมอกับอวนลากครูดพื้น'],
  ['L12c', 964, 992, 'เกี่ยวสายขาด'],
  ['L13a', 996, 1031, 'สายไม่ได้กลัวทะเลลึก…'],
  ['L13b', 1032, 1060, 'มันกลัวเรือ'],
  ['L14a', 1067, 1118, 'แต่ปี 2024 ในทะเลแดง…'],
  ['L14b', 1119, 1164, 'เรือลำหนึ่งโดนขีปนาวุธ'],
  ['L14c', 1166, 1205, 'แล้วสายขาดสามเส้น'],
  ['L15a', 1210, 1243, 'ฟังเหมือนจงใจ…'],
  ['L15b', 1256, 1294, 'แต่ทำเนียบขาวบอกว่า'],
  ['L15c', 1295, 1366, 'น่าจะโดนสมอเรือลำนั้นเอง ลากพื้น'],
  ['L17a', 1392, 1427, 'สายใต้ทะเลทั่วโลก'],
  ['L17b', 1427, 1490, 'เสียหายราว ๆ สัปดาห์ละสามสี่ครั้ง'],
  ['L18a', 1495, 1529, 'แต่คุณแทบไม่รู้ตัว…'],
  ['L18b', 1534, 1578, 'เพราะเน็ตอ้อมไปเส้นอื่น'],
  ['L19a', 1583, 1621, 'สายที่เขาคุยอยู่ตอนนี้…'],
  ['L19b', 1622, 1657, 'ก็อาจกำลังอ้อมอยู่'],
] as [string, number, number, string][]).map(([id, from, to, text]) => ({id, from, to, text}));

/** Caption events for `assemblePaintedTimeline`: every scene starts with a cue ('' = none); a gap between cues is cleared; a cue that crosses a cut is repeated at the cut. */
export const edu17CaptionEvents = (cutStarts: number[], total: number): {at: number; text: string}[] => {
  const ev: {at: number; text: string}[] = [];
  const at = (f: number) => EDU17_CUES.find((c) => c.from <= f && f < c.to);
  for (const c of EDU17_CUES) {
    ev.push({at: c.from, text: c.text});
    if (!EDU17_CUES.some((n) => n.from === c.to) && c.to < total && !cutStarts.includes(c.to)) ev.push({at: c.to, text: ''});
  }
  for (const start of cutStarts) if (!ev.some((e) => e.at === start)) ev.push({at: start, text: at(start)?.text ?? ''});
  return ev.sort((a, b) => a.at - b.at);
};
