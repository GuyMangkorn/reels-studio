// EDU-EP08-SHORT caption cues (W5.3 Draft R2.4, Editor, 8 Nov 2026; 27 cues, script R1.3). Pure data. Source: scripts/edu-series/ep08/scene-sheets.md (EDU-EP08-SHEETS-R2.4 "Caption plan"), Thai verbatim from script R1.2.
// Cue = [phrase onset, last voiced frame + 6) capped at the next cue's onset. V01 has no subtitle (a gasp); V02 is subtitled. A cue that wraps breaks after "…" or at the middle space.
export type Edu8Cue = {from: number; to: number; text: string};
const br = (t: string) => {
  if (t.length <= 22 || t.includes('\n')) return t;
  if (t.includes('… ')) return t.replace('… ', '…\n');
  const sp = [...t].map((c, i) => (c === ' ' ? i : -1)).filter((i) => i > 0);
  if (!sp.length) return t;
  const mid = t.length / 2, at = sp.reduce((a, b) => (Math.abs(b - mid) < Math.abs(a - mid) ? b : a));
  return `${t.slice(0, at)}\n${t.slice(at + 1)}`;
};
const raw: [number, number, string][] = [
  [4, 57, 'ถ้าคุณถอดหมวกกลางอวกาศ…'],  // L01
  [106, 159, 'ตัวคุณจะไม่ระเบิดอย่างในหนัง…'],  // L02a
  [159, 235, 'แต่อาจมีสติอยู่แค่ประมาณ สิบถึงสิบห้าวินาที'],  // L02b
  [238, 275, 'หมวกจริงล็อกแน่นนะ…'],  // L03a
  [275, 295, 'นี่แค่สมมติ'],  // L03b
  [298, 373, 'ตัวอาจบวมขึ้น… แต่ผิวหนังยังรั้งไว้ได้'],  // L04
  [376, 421, 'และไม่แข็งทันทีด้วย…'],  // L05a
  [421, 505, 'เหมือนกระติกน้ำร้อน ไม่มีอากาศมาพาความร้อนไป'],  // L05b
  [533, 617, 'แต่น้ำลายบนลิ้นคุณ… เริ่มเดือดจริง ๆ นะ…'],  // L06a
  [617, 692, 'ไม่มีอากาศกด น้ำเลยเดือดได้'],  // L06b
  [692, 730, 'แค่ด้วยความอุ่นในตัว'],  // L06c
  [736, 800, 'ตามรายงาน ปี 1966…'],  // L07a
  [800, 847, 'คนทดสอบชุดของนาซ่า'],  // L07b
  [847, 909, 'เจอชุดเสียแรงดันในห้องสุญญากาศ'],  // L07c
  [912, 966, 'เขาเล่าว่า… สิ่งสุดท้ายที่จำได้'],  // L08a
  [966, 1049, 'คือน้ำลายบนลิ้นเริ่มเป็นฟอง ก่อนจะหมดสติ'],  // L08b
  [1052, 1129, 'แล้วเขาก็ฟื้น… ตอนห้องมีอากาศกลับมา'],  // L09
  [1157, 1212, 'แต่ถ้ากลั้นหายใจ…'],  // L10a
  [1212, 1253, 'อากาศในปอดจะดันออก'],  // L10b
  [1253, 1305, 'เพราะข้างนอกไม่มีอากาศดันกลับ…'],  // L10c
  [1305, 1342, 'ปอดอาจบาดเจ็บได้'],  // L10d
  [1364, 1406, 'ปล่อยลมหายใจออกมา…'],  // L11 (script R1.3, voiced 1364-1400)
  [1421, 1446, 'จับได้แล้ว!'],  // V02
  [1458, 1511, 'ถ้าช่วยเร็วมาก… ก็อาจรอด'],  // L12a (voiced 1458-1507; cue end = the B05-SH03 cut G1511, was 1513 = 2 f overhang)
  [1526, 1574, 'คุณจะอยากกลั้นหายใจไว้…'],  // L13a (voiced 1526-1675)
  [1574, 1616, 'แต่ในที่ที่ไม่มีอากาศ'],  // L13b (next onset ~1616, inner cut mid-gap)
  [1616, 1679, 'สิ่งที่ช่วยปอดคุณ คือหายใจออก'],  // L13c (voiced end 1661 + 6, capped at the SH05 cut: no caption on SH05)
];
export const EDU8_CUES: Edu8Cue[] = raw.map(([from, to, text]) => ({from, to, text: br(text)}));

/** Caption events for `assemblePaintedTimeline`: every scene starts with a cue ('' = none); a gap between cues is cleared. */
export const edu8CaptionEvents = (cutStarts: number[], total: number): {at: number; text: string}[] => {
  const ev: {at: number; text: string}[] = [];
  const at = (f: number) => EDU8_CUES.find((c) => c.from <= f && f < c.to);
  for (const c of EDU8_CUES) {
    ev.push({at: c.from, text: c.text});
    if (!EDU8_CUES.some((n) => n.from === c.to) && c.to < total && !cutStarts.includes(c.to)) ev.push({at: c.to, text: ''});
  }
  for (const start of cutStarts) if (!ev.some((e) => e.at === start)) ev.push({at: start, text: at(start)?.text ?? ''});
  return ev.sort((a, b) => a.at - b.at);
};
