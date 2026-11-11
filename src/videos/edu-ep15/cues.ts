// EDU-EP15-SHORT caption cues (W5.3 Draft, Editor, 2026-11-10; 18 cues incl. V01/V02). Pure data. Source: scripts/edu-series/ep15/storyboard.md ROWS-R2.3 "Voice and subtitle cues" (voice [start, end) global
// frames measured on the C1 read), Thai verbatim from script R2. Cue = [voice start, voice end + 6) capped at the next cue's start (C15 at the V03 onset f1700); V01 holds to f305 for reading (sheet); C08 is split at its pause so the shot 9 -> 10 cut f837 sits in the gap [827, 841). C08 (L09) is one sheet cue over two
// voice runs ([779, 827) and [841, 908)); it is split at its "…" pause into C08a/C08b so the cut at f837 sits in the gap. V03 (tokay call), W-HANG and W-MOTH have no caption: every scene still
// starts with a cue ('' = none). A cue that wraps breaks after "… " or at the middle space.
export type Edu15Cue = {id: string; from: number; to: number; text: string};
const br = (t: string) => {
  if (t.length <= 22 || t.includes('\n')) return t;
  if (t.includes('… ')) return t.replace('… ', '…\n');
  const sp = [...t].map((c, i) => (c === ' ' ? i : -1)).filter((i) => i > 0);
  if (!sp.length) return t;
  const mid = t.length / 2, at = sp.reduce((a, b) => (Math.abs(b - mid) < Math.abs(a - mid) ? b : a));
  return `${t.slice(0, at)}\n${t.slice(at + 1)}`;
};
const raw: [string, number, number, string][] = [
  ['C01', 17, 128, 'ตุ๊กแกบนเพดานบ้านคุณ… ถ้าขนที่เท้ามันจับพร้อมกันทุกเส้น'],
  ['C02', 140, 207, 'แรงพอจะห้อยคนไว้ได้ประมาณหนึ่งคน'],
  ['C03', 223, 286, 'ทั้งที่เท้ามันไม่มีกาว ไม่มีแรงดูด'],
  ['V01', 293, 300, 'เอ๊ะ?'],
  ['C04', 321, 398, 'จุ๊บดูดเจอเพดานฝุ่น ๆ แบบนี้ อยู่ไม่ได้หรอก'],
  ['C05', 417, 503, 'แต่ตุ๊กแกเดินต่อได้ ฝุ่นร่วงออกทีละก้าว'],
  ['C06', 534, 670, 'ใต้นิ้วมัน มีขนเล็ก ๆ เรียงกันแน่น… สี่เท้ารวมกันหลายล้านเส้น'],
  ['C07', 687, 753, 'แต่ละเส้น ปลายแตกเป็นหลายร้อยปลาย'],
  ['C08a', 779, 827, 'ฝุ่นเกาะจอทีวีน่ะเห็นบ่อย…'],
  ['C08b', 841, 908, 'แต่ขนแห้ง ๆ เกาะเพดานกลับหัวได้ยังไง'],
  ['C09', 931, 999, 'ปลายมันเล็กจนแนบชิดไปตามผิวเพดาน'],
  ['C10', 1012, 1144, 'ชิดขนาดนั้น จะดึงกันนิดนึง… นับพันล้านจุดรวมกันก็แรงมาก'],
  ['C11', 1158, 1206, 'ยิ่งแนบชิด… ยิ่งเกาะแน่น'],
  ['C12', 1219, 1277, 'แต่… เกาะแน่นขนาดนี้ มันเดินยังไง'],
  ['C13', 1296, 1362, 'มันม้วนนิ้วขึ้นจากปลาย เหมือนลอกเทป'],
  ['C14', 1379, 1450, 'พอขนไม่แนบชิด… ก็หลุดในเสี้ยววินาที'],
  ['V02', 1498, 1539, 'อย่าปล่อยนะ!'],
  ['C15', 1592, 1697, 'สัตว์ที่เกาะเก่งขนาดนี้ในบ้านคุณ… ไม่ได้ใช้กาวสักหยดเลย'],
];
const HOLD = 6;
export const EDU15_CUES: Edu15Cue[] = raw.map(([id, from, end, text], i) => {
  const next = raw[i + 1]?.[1] ?? Infinity;
  return {id, from, to: Math.min(id === 'V01' ? 305 : id === 'C15' ? 1700 : end + HOLD, next), text: br(text)};
});

/** Caption events for `assemblePaintedTimeline`: every scene starts with a cue ('' = none); a gap between cues is cleared. */
export const edu15CaptionEvents = (cutStarts: number[], total: number): {at: number; text: string}[] => {
  const ev: {at: number; text: string}[] = [];
  const at = (f: number) => EDU15_CUES.find((c) => c.from <= f && f < c.to);
  for (const c of EDU15_CUES) {
    ev.push({at: c.from, text: c.text});
    if (!EDU15_CUES.some((n) => n.from === c.to) && c.to < total && !cutStarts.includes(c.to)) ev.push({at: c.to, text: ''});
  }
  for (const start of cutStarts) if (!ev.some((e) => e.at === start)) ev.push({at: start, text: at(start)?.text ?? ''});
  return ev.sort((a, b) => a.at - b.at);
};
