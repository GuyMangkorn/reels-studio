// EDU-EP16-SHORT caption cues (W5.3 Draft, Editor, 2026-11-14; re-timed to EDU-EP16-SHEET-R1.5b, 2100 f: L07..L11, V05, V08, V09, V10 at the sheet's R1.4/R1.5 voice ranges; no caption in 16A-16D, 16 outside V09, or on SH22's hen gag per Boat RV-26a). Pure data. Source: scripts/edu-series/ep16/storyboard.md EDU-EP16-SHEET-R1.1 "Voice and subtitle cues" (voice [start, end] global frames
// from measure.json), Thai verbatim from script R2.2 (review-rows.json). Cue = [voice start, voice end + 6) capped at the next cue's start; a line with a measured pause or "word peg" is split at its "…"
// (L02 f165, L05 f569, L06b f875, L07 f996, L07b f1176, L09 f1433, L10 f1569). V03 "อย่า!" starts at its own voice onset f488 (V02 ends f479). No caption on the hen cluck V06, none on the white frame
// (L01 starts f8; frames 0-7 show no caption). A cue that wraps breaks after "… " or at the middle space.
export type Ep16Cue = {id: string; from: number; to: number; text: string};
const br = (t: string) => {
  if (t.length <= 22 || t.includes('\n')) return t;
  if (t.includes('… ')) return t.replace('… ', '…\n');
  const sp = [...t].map((c, i) => (c === ' ' ? i : -1)).filter((i) => i > 0);
  if (!sp.length) return t;
  const mid = t.length / 2, at = sp.reduce((a, b) => (Math.abs(b - mid) < Math.abs(a - mid) ? b : a));
  return `${t.slice(0, at)}\n${t.slice(at + 1)}`;
};
const raw: [string, number, number, string][] = [
  ['L01', 8, 94, 'สมมติว่ารูหนอน พาหมู่บ้านคุณ ไปโผล่ยุคไดโนเสาร์…'],
  ['L02a', 110, 165, 'ป่ารอบบ้านเขียวทั้งป่า…'],
  ['L02b', 165, 211, 'แต่แทบไม่มีอะไรที่คุณกินได้'],
  ['V01', 224, 269, 'มะม่วงล่ะ? กล้วยล่ะ?'],
  ['L03', 286, 361, 'ผักผลไม้ที่เรากิน แทบทั้งหมดมาจากต้นที่ออกดอก…'],
  ['L04', 377, 437, 'แต่ยุคนั้นส่วนใหญ่ ยังไม่มีดอกไม้'],
  ['V02', 450, 479, 'แล้วอันนี้ล่ะ?'],
  ['V03', 488, 504, 'อย่า!'],
  ['L05a', 517, 569, 'ต้นที่ไม่รู้จัก ห้ามกินนะ…'],
  ['L05b', 569, 631, 'บางต้นแค่ชิมนิดเดียว ก็มีพิษแล้ว'],
  ['V04', 644, 703, 'ไดโนเสาร์ยังกินเลย!'],
  ['L06', 716, 775, 'มันกินได้… ไม่ได้แปลว่าคนกินได้หรอก'],
  ['V07', 790, 828, 'งั้นต้มก่อนสิ!'],
  ['L06ba', 843, 875, 'พิษในพืชหลายชนิด…'],
  ['L06bb', 875, 903, 'ต้มแล้วก็ยังอยู่นะ'],
  ['V05', 936, 973, 'งั้นปลูกข้าวสิ!'],
  ['L07a', 1024, 1052, 'ปลูกได้นะ…'],
  ['L07b', 1052, 1120, 'แต่กว่าจะเกี่ยวรอบแรก ก็ราว ๆ สี่ห้าเดือน'],
  ['V08', 1135, 1185, 'ข้าวในยุ้งก็มีนี่!'],
  ['L07ba', 1202, 1232, 'มีนะ…'],
  ['L07bb', 1232, 1273, 'แต่ต้องเก็บไว้ทำพันธุ์ด้วย'],
  ['L08', 1283, 1344, 'แล้วสี่ห้าเดือนนี้… กินข้าวกับอะไร'],
  ['V09', 1540, 1592, 'เฮ้ย! ปลาผม!'],
  ['L09a', 1624, 1682, 'ปลาในแม่น้ำ น่าจะหาง่ายสุด…'],
  ['L09b', 1682, 1751, 'แต่ก้อยปลาดิบ ไม่เอานะ เสี่ยงพยาธิ'],
  ['L10a', 1764, 1807, 'ไม่รู้จัก ห้ามกิน…'],
  ['L10b', 1818, 1863, 'แต่ไดโนเสาร์ที่คุณรู้จักดีที่สุด'],
  ['L11', 1874, 1923, 'ออกไข่อยู่ในเล้าบ้านคุณนี่เอง'],
  ['V10', 1937, 1995, 'ไก่… เป็นไดโนเสาร์เหรอ?'],
];
const HOLD = 6;
export const EP16_CUES: Ep16Cue[] = raw.map(([id, from, end, text], i) => {
  const next = raw[i + 1]?.[1] ?? Infinity;
  return {id, from, to: Math.min(end + HOLD, next), text: br(text)};
});

/** Caption events for `assemblePaintedTimeline`: every scene starts with a cue ('' = none); a gap between cues is cleared. */
export const ep16CaptionEvents = (cutStarts: number[], total: number): {at: number; text: string}[] => {
  const ev: {at: number; text: string}[] = [];
  const at = (f: number) => EP16_CUES.find((c) => c.from <= f && f < c.to);
  for (const c of EP16_CUES) {
    ev.push({at: c.from, text: c.text});
    if (!EP16_CUES.some((n) => n.from === c.to) && c.to < total && !cutStarts.includes(c.to)) ev.push({at: c.to, text: ''});
  }
  for (const start of cutStarts) if (!ev.some((e) => e.at === start)) ev.push({at: start, text: at(start)?.text ?? ''});
  return ev.sort((a, b) => a.at - b.at);
};
