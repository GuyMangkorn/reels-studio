// EDU-EP09-SHORT caption cues (W5.3 Draft, Editor, 8 Nov 2026; 23 cues). Pure data. Source: scripts/edu-series/ep09/scene-sheets.md (EDU-EP09-SHEETS-R2 "Caption plan"), Thai verbatim from script R1.4.
// Cue = [phrase onset, last voiced frame + 6) capped at the next cue's onset. V01 (G182-196 voiced) and V02 (G441-502 voiced; the line starts after the laugh, plan slot 455) follow the placed takes. A cue that wraps breaks after "…" or at the middle space.
export type Edu9Cue = {from: number; to: number; text: string};
const br = (t: string) => {
  if (t.length <= 22 || t.includes('\n')) return t;
  if (t.includes('… ')) return t.replace('… ', '…\n');
  const sp = [...t].map((c, i) => (c === ' ' && t[i + 1] !== 'ๆ' ? i : -1)).filter((i) => i > 0);
  if (!sp.length) return t;
  const mid = t.length / 2, at = sp.reduce((a, b) => (Math.abs(b - mid) < Math.abs(a - mid) ? b : a));
  return `${t.slice(0, at)}\n${t.slice(at + 1)}`;
};
const raw: [number, number, string][] = [
  [6, 81, 'วางมือแบนบนโต๊ะ พับนิ้วกลางลงไป…'],  // L01a
  [81, 124, 'แล้วลองยกนิ้วนางดูสิ'],  // L01b
  [182, 202, 'ไม่ขึ้น!'],  // V01
  [206, 278, 'ยกได้นิดเดียว… หรือไม่ขึ้นเลยใช่ไหม'],  // L02
  [286, 341, 'เบา ๆ นะ อย่าเอามืออีกข้างดึง'],  // L03
  [354, 431, 'แต่นิ้วโป้ง… นิ้วชี้… นิ้วก้อย… ขึ้นหมด'],  // L04
  [455, 508, 'ตาก็ยกไม่ขึ้นเหมือนกันแหละ'],  // V02
  [514, 564, 'นิ้วนางไม่ได้อ่อนแอนะ…'],  // L05a
  [564, 603, 'มันโดนอะไรรั้งไว้'],  // L05b
  [625, 696, 'กล้ามเนื้อที่ยกนิ้ว อยู่ที่ปลายแขน…'],  // L06a
  [696, 763, 'ดึงนิ้วผ่านเส้นเอ็น เหมือนสายเชิดหุ่น'],  // L06b
  [771, 846, 'นิ้วชี้กับนิ้วก้อย มีกล้ามเนื้อเสริมของตัวเอง…'],  // L07a
  [846, 884, 'นิ้วนางไม่มี'],  // L07b
  [897, 963, 'ต้องใช้ชุดเดียวกับนิ้วกลางและนิ้วก้อย…'],  // L08a
  [963, 1026, 'แถมเส้นเอ็นยังมีแถบเล็ก ๆ ผูกกันอยู่'],  // L08b
  [1046, 1083, 'มักอธิบายกันว่า…'],  // L09a
  [1083, 1169, 'พอนิ้วกลางพับลง สายร่วมก็ถูกกดไว้'],  // L09b
  [1169, 1197, 'นิ้วนางเลยติด'],  // L09c
  [1217, 1258, 'แล้วนักเปียโนล่ะ…'],  // L12a
  [1258, 1354, 'เล่นมาหลายปี แค่ควบคุมได้ดีกว่าคนทั่วไป'],  // L12b
  [1418, 1474, 'นิ้วนางคุณไม่ได้ขี้เกียจหรอก…'],  // L15a
  [1474, 1531, 'มันแค่ใช้สายร่วมกับนิ้วข้าง ๆ'],  // L15b
];
export const EDU9_CUES: Edu9Cue[] = raw.map(([from, to, text]) => ({from, to, text: br(text)}));

/** Caption events for `assemblePaintedTimeline`: every scene starts with a cue ('' = none); a gap between cues is cleared. */
export const edu9CaptionEvents = (cutStarts: number[], total: number): {at: number; text: string}[] => {
  const ev: {at: number; text: string}[] = [];
  const at = (f: number) => EDU9_CUES.find((c) => c.from <= f && f < c.to);
  for (const c of EDU9_CUES) {
    ev.push({at: c.from, text: c.text});
    if (!EDU9_CUES.some((n) => n.from === c.to) && c.to < total && !cutStarts.includes(c.to)) ev.push({at: c.to, text: ''});
  }
  for (const start of cutStarts) if (!ev.some((e) => e.at === start)) ev.push({at: start, text: at(start)?.text ?? ''});
  return ev.sort((a, b) => a.at - b.at);
};
