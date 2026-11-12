// EDU-EP18-SHORT caption cues (W5.3 Draft, Editor, 2026-11-12). Pure data. Source: scripts/edu-series/ep18/storyboard.md ROWS-R2.2 "Voice and subtitle cues" (voice [start, end) global frames),
// Thai verbatim from script R1 + change log. Cue = [voice start, voice end + 6) capped at the next cue's start. C04 (V01) and C10 (V02) have no cue: the character voices are not cast,
// so no caption is shown for a line nobody speaks (they return with the voices). C12 is entered as ending 972 so its +6 hold stops at the voice end f978: SH15 +113 (f979) shows the reflected dome whose bottom edge (y 1243) sits in the caption band. C14 is entered as ending 1177 so its hold stops at the SH18 cut f1183 (the caption would sit on her feet). C15 is split at the f1257 SH19/SH20 cut (pause [1244, 1261)). Every scene starts with a cue ('' = none).
export type Edu18Cue = {id: string; from: number; to: number; text: string};
const raw: [string, number, number, string][] = [
  ['C01', 10, 46, 'ถ้าคุณตัวเท่ายุง…'],
  ['C02', 66, 130, 'ฝนเม็ดใหญ่ที่สุด\nหนักราวรถตู้'],
  ['C03', 142, 207, 'แต่ยุงโดนเม็ดแบบนี้ตรง ๆ…\nก็ยังรอด'],
  ['C05', 252, 318, 'เพราะหดทั้งตัว…\nคุณก็เบาเท่ายุงด้วย'],
  ['C06', 361, 414, 'โดนเต็ม ๆ… ยุงก็ไม่แบนนะ'],
  ['C07', 425, 498, 'มันเบาจน\nเม็ดฝนแทบไม่ช้าลงเลย'],
  ['C08', 508, 595, 'เหมือนขนนกโดนลูกบอล…\nไม่ต้าน แค่ไปกับมัน'],
  ['C09', 610, 709, 'แต่… เม็ดฝนไม่หยุดนะ\nมันพาคุณดิ่งลงพื้น'],
  ['C11', 768, 857, 'ติดหน้าเม็ดฝนลงไป\nได้ไกลถึงยี่สิบเท่าตัวคุณ'],
  ['C12', 876, 972, 'ถ้าโดนตอนบินต่ำ ๆ ใกล้พื้น…\nก็อาจหลุดออกไม่ทัน'],
  ['C13', 1007, 1092, 'ทางรอดของยุง…\nคือไม่ต้าน แต่ไปกับมัน'],
  ['C14', 1098, 1177, 'แล้วเอียงตัว…\nไหลหลุดออกข้าง ๆ ก่อนถึงพื้น'],
  ['C15a', 1207, 1244, 'เม็ดฝนฆ่ายุงไม่ได้หรอก…'],
  ['C15b', 1257, 1333, 'ที่อาจเล่นงานมัน\nคือพื้นข้างล่าง'],
];
const HOLD = 6;
export const EDU18_CUES: Edu18Cue[] = raw.map(([id, from, end, text], i) => {
  const next = raw[i + 1]?.[1] ?? Infinity;
  return {id, from, to: Math.min(end + HOLD, next), text};
});

/** Caption events for `assemblePaintedTimeline`: every scene starts with a cue ('' = none); a gap between cues is cleared. */
export const edu18CaptionEvents = (cutStarts: number[], total: number): {at: number; text: string}[] => {
  const ev: {at: number; text: string}[] = [];
  const at = (f: number) => EDU18_CUES.find((c) => c.from <= f && f < c.to);
  for (const c of EDU18_CUES) {
    ev.push({at: c.from, text: c.text});
    if (!EDU18_CUES.some((n) => n.from === c.to) && c.to < total && !cutStarts.includes(c.to)) ev.push({at: c.to, text: ''});
  }
  for (const start of cutStarts) if (!ev.some((e) => e.at === start)) ev.push({at: start, text: at(start)?.text ?? ''});
  return ev.sort((a, b) => a.at - b.at);
};
