// EDU-EP13-SHORT caption cues (W5.3 Draft, Editor, 2026-11-09; 28 cues). Pure data. Source: scripts/edu-series/ep13/scene-sheets.md (EDU-EP13-SHEETS-R2.0 "Captions": one cue per line, split at the "…"),
// Thai verbatim from script R4 / review-rows.json. Cue = [phrase onset, last voiced frame + 6) capped at the next cue's onset; onsets and ends are the voiced runs (-38 dB, 10 ms, gaps < 80 ms merged)
// of the placed narration public/narration/EDU-EP13-SHORT-narration-v1.wav (scripts/edu-series/ep13/narration-place.py). V01 is subtitled from its "เฮ้ย" (G291), V02 from G1021; V03 and TR01 have no caption.
export type Edu13Cue = {from: number; to: number; text: string};
const br = (t: string) => {
  if (t.length <= 22 || t.includes('\n')) return t;
  if (t.includes('… ')) return t.replace('… ', '…\n');
  const sp = [...t].map((c, i) => (c === ' ' ? i : -1)).filter((i) => i > 0);
  if (!sp.length) return t;
  const mid = t.length / 2, at = sp.reduce((a, b) => (Math.abs(b - mid) < Math.abs(a - mid) ? b : a));
  return `${t.slice(0, at)}\n${t.slice(at + 1)}`;
};
const raw: [number, number, string][] = [
  [16, 76, 'หมัดกระโดดได้สูงกว่าตัวมันหลายสิบเท่า…'],   // L01 a (run 16-70)
  [79, 147, 'ถ้ามันตัวเท่าคุณ จะกระโดดข้ามตึกได้มั้ย'],   // L01 b (79-141)
  [177, 192, 'ไม่หรอก…'],                                // L02 a (177-186)
  [198, 251, 'มันน่าจะกระโดดได้แค่หลักสิบเซน…'],         // L02 b (198-241)
  [251, 282, 'พอ ๆ กับคุณนี่แหละ'],                      // L02 c (251-276)
  [291, 329, 'เฮ้ย… ตัวเท่าเราเลย!'],                    // V01 (291-323)
  [334, 376, 'ขามันแรงขึ้นก็จริง…'],                     // L03 a (334-370)
  [379, 417, 'แต่ตัวก็หนักขึ้นตาม'],                     // L03 b (379-411)
  [428, 476, 'เหมือนขาคุณแรงสองเท่า…'],                  // L05 a (428-469)
  [476, 517, 'แต่แบกเป้หนักสองเท่า'],                    // L05 b (476-511)
  [529, 560, 'ตัวใหญ่ขึ้น…'],                            // L06 a (529-553)
  [560, 600, 'กระโดดไม่ได้สูงขึ้นตาม'],                  // L06 b (560-594)
  [614, 637, 'แต่…'],                                    // L07 a (614-627)
  [637, 691, 'แล้วหมัดตัวจิ๋ว กระโดดเก่งได้ยังไง'],        // L07 b (637-685)
  [700, 757, 'มันบีบแผ่นยางยืดในตัวไว้…'],               // L09 a (700-751)
  [757, 790, 'แล้วปล่อยทีเดียว'],                        // L09 b (757-783)
  [790, 812, 'เหมือนหนังสติ๊ก'],                         // L09 c (790-806)
  [827, 863, 'แล้วหมัดยักษ์ล่ะ…'],                       // L15 a (827-854)
  [863, 898, 'ยังต้องพึ่งหนังสติ๊กมั้ย'],                // L15 b (863-892)
  [907, 934, 'ไม่ค่อยต้องแล้ว…'],                        // L16 a (907-928)
  [936, 964, 'ขามันยาว'],                                // L16 b (936-959)
  [965, 1011, 'มีเวลาให้กล้ามดันพื้นทัน'],               // L16 c (965-1005)
  [1021, 1036, 'ฮึบ!'],                                  // V02 (1021-1030)
  [1036, 1065, 'สูงพอ ๆ กัน…'],                          // L12 a (1036-1059)
  [1068, 1125, 'แค่หลักสิบเซน ไม่ใช่ร้อยเมตร'],           // L12 b (1068-1119)
  [1140, 1173, 'แต่ถ้าวัดเป็นเซน…'],                     // L13 a (1140-1167)
  [1174, 1246, 'ปกติ คุณก็กระโดดสูงกว่าหมัดตัวจริงอีกนะ'], // L13 b (1174-1240)
  [1257, 1283, 'หมัดดูเก่ง…'],                           // L14 a (1257-1280)
  [1283, 1318, 'ก็เพราะตัวมันเล็กมาก'],                  // L14 b (1283-1312)
];
export const EDU13_CUES: Edu13Cue[] = raw.map(([from, to, text]) => ({from, to, text: br(text)}));

/** Caption events for `assemblePaintedTimeline`: every scene starts with a cue ('' = none); a gap between cues is cleared. */
export const edu13CaptionEvents = (cutStarts: number[], total: number): {at: number; text: string}[] => {
  const ev: {at: number; text: string}[] = [];
  const at = (f: number) => EDU13_CUES.find((c) => c.from <= f && f < c.to);
  for (const c of EDU13_CUES) {
    ev.push({at: c.from, text: c.text});
    if (!EDU13_CUES.some((n) => n.from === c.to) && c.to < total && !cutStarts.includes(c.to)) ev.push({at: c.to, text: ''});
  }
  for (const start of cutStarts) if (!ev.some((e) => e.at === start)) ev.push({at: start, text: at(start)?.text ?? ''});
  return ev.sort((a, b) => a.at - b.at);
};
