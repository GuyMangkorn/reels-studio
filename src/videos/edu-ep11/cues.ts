// EDU-EP11-SHORT caption cues (W5.3 Draft, Editor, 2026-11-09; 34 cues). Pure data. Source: scripts/edu-series/ep11/scene-sheets.md (EDU-EP11-SHEETS-R1.3 "Caption plan"), Thai verbatim from script R3.
// Cue = [phrase onset, last voiced frame + 6) capped at the next cue's onset. Measured against the placed narration (see build-notes): "คุณ" onset G80 (est 72), V01 "เฮ้ย" word G144 (gasp 132-143 has no text),
// V02 splits at the measured 1.1 s inner pause ("เอาไงดี" G253, "โดดสวน" G300), V04 "โอ๊ย" G825. A cue that wraps breaks after "…" or at the middle space.
export type Edu11Cue = {from: number; to: number; text: string};
const br = (t: string) => {
  if (t.length <= 22 || t.includes('\n')) return t;
  if (t.includes('… ')) return t.replace('… ', '…\n');
  const sp = [...t].map((c, i) => (c === ' ' ? i : -1)).filter((i) => i > 0);
  if (!sp.length) return t;
  const mid = t.length / 2, at = sp.reduce((a, b) => (Math.abs(b - mid) < Math.abs(a - mid) ? b : a));
  return `${t.slice(0, at)}\n${t.slice(at + 1)}`;
};
const raw: [number, number, string][] = [
  [3, 75, 'ถ้าสลิงลิฟต์ขาด ร่วงจากชั้นยี่สิบ…'],   // L01a (cut at the SH02 start; last voiced "ยี่สิบ" G70)
  [80, 132, 'คุณกระโดดตอนท้าย รอดมั้ย'],           // L01b
  [144, 163, 'เฮ้ย!'],                               // V01
  [163, 242, 'จากความสูงขนาดนี้… แทบไม่ช่วยอะไรเลย'], // L02
  [253, 300, 'เอาไงดี…'],                            // V02a
  [300, 330, 'โดดสวนขึ้นไป!'],                       // V02b
  [330, 402, 'ใกล้พื้น ลิฟต์เร็วราวร้อยยี่สิบ…'],    // L03a
  [402, 466, 'ลิฟต์เร็วเท่าไหร่ คุณก็เร็วเท่านั้น'], // L03b
  [469, 540, 'กระโดดสุดแรง หักออกได้แค่ราวสิบ'],     // L04
  [543, 608, 'ชั้นยี่สิบ… ก็แค่กลายเป็นเหมือนชั้นสิบเจ็ด'], // L05
  [608, 665, 'ห๊ะ…'],                                // V03
  [665, 704, 'แต่คุณมองไม่เห็นพื้น…'],               // L06a
  [704, 756, 'ต้องกะให้ตรงเสี้ยววินาที'],            // L06b
  [759, 814, 'เร็วไป ก็ลอยไปชนเพดาน'],               // L07
  [825, 846, 'โอ๊ย!'],                               // V04
  [846, 893, 'ช้าไปนิด… ก็ไม่ทันแล้ว'],              // L08
  [909, 979, 'แต่เดี๋ยวนะ… ลิฟต์ร่วงแบบนี้ได้จริงเหรอ'], // L09
  [981, 1024, 'ปี 1854…'],                           // L10a
  [1024, 1092, 'โอติสยืนบนแท่นสูง แล้วสั่งให้ตัดเชือก'], // L10b
  [1113, 1137, 'แท่นตกนิดเดียว…'],                   // L11a
  [1137, 1180, 'แล้วเบรกก็จับราง'],                  // L11b
  [1183, 1213, 'สิ่งที่คุณกลัว…'],                   // L12a
  [1213, 1257, 'ถูกแก้ไว้ก่อนมีลิฟต์โดยสาร'],        // L12b
  [1257, 1314, 'ที่มีเบรกนิรภัยตัวแรกซะอีก'],        // L12c
  [1319, 1386, 'ลิฟต์สมัยนี้ แทบร่วงแบบนี้ไม่ได้เลย'], // L13
  [1388, 1425, 'สลิงมีหลายเส้น'],                    // L14a
  [1425, 1467, 'เส้นเดียวก็รับไหว…'],                // L14b
  [1467, 1522, 'ขาดหมด เบรกก็จับราง'],               // L14c
  [1543, 1600, 'ลิฟต์หยุด… คุณก็หยุดไปด้วย'],        // L15
  [1603, 1638, 'ถ้าเจอลิฟต์ค้างจริง…'],              // L16a
  [1638, 1683, 'ไม่ต้องกระโดดเลย'],                  // L16b
  [1683, 1734, 'กดปุ่มฉุกเฉิน แล้วรอ'],              // L16c
];
export const EDU11_CUES: Edu11Cue[] = raw.map(([from, to, text]) => ({from, to, text: br(text)}));

/** Caption events for `assemblePaintedTimeline`: every scene starts with a cue ('' = none); a gap between cues is cleared. */
export const edu11CaptionEvents = (cutStarts: number[], total: number): {at: number; text: string}[] => {
  const ev: {at: number; text: string}[] = [];
  const at = (f: number) => EDU11_CUES.find((c) => c.from <= f && f < c.to);
  for (const c of EDU11_CUES) {
    ev.push({at: c.from, text: c.text});
    if (!EDU11_CUES.some((n) => n.from === c.to) && c.to < total && !cutStarts.includes(c.to)) ev.push({at: c.to, text: ''});
  }
  for (const start of cutStarts) if (!ev.some((e) => e.at === start)) ev.push({at: start, text: at(start)?.text ?? ''});
  return ev.sort((a, b) => a.at - b.at);
};
