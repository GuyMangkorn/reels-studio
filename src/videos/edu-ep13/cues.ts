// EDU-EP13-SHORT caption cues (W5.3 Draft v2, Editor, 2026-11-09; 32 cues). Pure data. Source: scripts/edu-series/ep13/scene-sheets.md (EDU-EP13-SHEETS-R2.1 "Captions": one cue per line, split at the "…"),
// Thai verbatim from script R5 / review-rows.json. Cue = [phrase onset, last voiced frame + 6) capped at the next cue's onset; onsets and ends are the voiced runs (-38 dB, 10 ms, gaps < 80 ms merged)
// of the placed narration public/narration/EDU-EP13-SHORT-narration-v2.wav (scripts/edu-series/ep13/narration-place.py). V01 is subtitled from its "เฮ้ย" (G330), V02 from G1144; V03 and TR01 have no caption.
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
  [17, 96, 'หมัดกระโดดได้สูงกว่าตัวมันหลายสิบเท่า…'],   // L01 a (runs 17-90)
  [98, 170, 'ถ้ามันตัวเท่าคุณ จะกระโดดข้ามตึกได้มั้ย'],   // L01 b (98-164)
  [207, 227, 'ไม่หรอก…'],                                // L02 a (207-221)
  [230, 286, 'มันน่าจะกระโดดได้แค่หลักสิบเซน…'],         // L02 b (230-281)
  [286, 317, 'พอ ๆ กับคุณนี่แหละ'],                      // L02 c (286-314; ends on the SH05 cut, not 3 f after it)
  [330, 368, 'เฮ้ย… ตัวเท่าเราเลย!'],                    // V01 (330-362; the take's pre-roll breath is attenuated, "เฮ้ย" at G331)
  [383, 431, 'ขามันดีดแรงขึ้นก็จริง…'],                  // L03 a (383-425)
  [433, 474, 'แต่ตัวก็หนักขึ้นตาม'],                     // L03 b (433-468)
  [481, 531, 'เหมือนขาคุณดีดแรงสองเท่า…'],               // L05 a (481-527)
  [531, 576, 'แต่แบกเป้หนักสองเท่า'],                    // L05 b (531-570)
  [597, 623, 'ตัวใหญ่ขึ้น…'],                            // L06 a (597-620)
  [623, 672, 'กระโดดไม่ได้สูงขึ้นตาม'],                  // L06 b (623-666)
  [695, 710, 'แต่…'],                                    // L07 a (695-704)
  [716, 777, 'แล้วหมัดตัวจิ๋ว กระโดดเก่งได้ยังไง'],        // L07 b (716-771)
  [788, 848, 'มันบีบแผ่นยางยืดในตัวไว้…'],               // L09 a (788-842)
  [849, 874, 'แล้วปล่อยทีเดียว'],                        // L09 b (849-, "ปล่อย" 856; one run to 892, split at the est onset of "เหมือน")
  [874, 898, 'เหมือนหนังสติ๊ก'],                         // L09 c (874-892, est)
  [920, 951, 'แล้วหมัดยักษ์ล่ะ…'],                       // L15 a (920-945)
  [952, 991, 'ยังต้องพึ่งหนังสติ๊กมั้ย'],                // L15 b (952-985)
  [1004, 1029, 'ใช้ก็ได้…'],                             // L16 a (1004-1023; R6 Take A, script R6)
  [1031, 1061, 'แต่ไม่ได้สูงขึ้นหรอก'],                  // L16 b (1031-1056)
  [1061, 1091, 'แผ่นยางโต'],                             // L16 c (1061-1085)
  [1092, 1123, 'ตัวก็หนักตาม'],                          // L16 d (1092-1117)
  [1144, 1159, 'ฮึบ!'],                                  // V02 (1144-1154)
  [1159, 1194, 'สูงพอ ๆ กัน…'],                          // L12 a (1159-1190)
  [1194, 1226, 'แค่หลักสิบเซน'],                         // L12 b 1 (1194-1220)
  [1226, 1259, 'ไม่ใช่ร้อยเมตร'],                        // L12 b 2 (1226-1253): split at the word, so it shows when spoken (R2.0 finding 10)
  [1282, 1316, 'แต่ถ้าวัดเป็นเซน…'],                     // L13 a (1282-1310)
  [1317, 1390, 'ปกติ คุณก็กระโดดสูงกว่าหมัดตัวจริงอีกนะ'], // L13 b (1317-1384)
  [1406, 1432, 'หมัดดูเก่ง…'],                           // L14 a (1406-1426)
  [1433, 1469, 'ก็เพราะตัวมันเล็กมาก'],                  // L14 b (1433-1463)
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
