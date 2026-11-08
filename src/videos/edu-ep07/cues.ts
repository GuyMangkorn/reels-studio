// EDU-EP07-SHORT caption cues (W5.3 R1.2 draft, Editor, 8 Nov 2026). Pure data. Source: scripts/edu-series/ep07/scene-sheets.md (EDU-EP07-SHEETS-R1.2 "Caption plan"); confirmed against the placed narration (energy runs, -42 dBFS, 1 f): every cue onset within 1 f of a phrase onset, every end within 2 f of last voiced + 6.
// Cue = [phrase onset, last voiced frame + 6) capped at the next cue's onset; text = the script line verbatim (digits as written). A cue that wraps breaks after "…".
export type Edu7Cue = {from: number; to: number; text: string};
const br = (t: string) => (t.length > 22 ? t.replace('… ', '…\n') : t.replace('… ', '… '));
const raw: [number, number, string][] = [
  [16, 69, 'ถ้าดวงอาทิตย์หายไปตอนนี้…'],                                  // L01a
  [69, 144, 'คุณจะยังไม่รู้ตัวไปอีก 8 นาที'],                              // L01b
  [146, 172, 'แค่สมมตินะ'],                                              // L02
  [174, 275, 'แสงแดดเดินทางมาถึงโลก… ราว 8 นาที 20 วินาที'],              // L03
  [276, 345, 'ร้อนจังวันนี้'],                                           // D01 (take kept, Q2 = a)
  [345, 396, 'พรุ่งนี้ร้อนกว่านี้อีก'],                                    // D02
  [410, 445, 'โลกยังวนต่อ…'],                                            // L05a (R1.2)
  [445, 513, 'ไอน์สไตน์บอกว่า แรงดึงที่หายไป…'],                          // L05b
  [513, 560, 'ก็ต้องเดินทางมาเหมือนแสง'],                                 // L05c
  [601, 641, 'แล้วไม่มีใครเตือนเลยเหรอ'],                                 // L15 (V01 has no caption)
  [651, 721, 'ไม่มีหรอก… ไม่มีอะไรเร็วกว่าแสง…'],                          // L16a
  [721, 755, 'แม้แต่ข่าวร้าย'],                                           // L16b
  [764, 837, 'พอนาฬิกาถึงศูนย์… ฟ้าก็มืดลง'],                             // L08
  [875, 937, 'เอ้า… ไฟดับเหรอ'],                                         // D03
  [946, 1028, 'โลกหลุดวงโคจร… พุ่งไปตรง ๆ'],                              // L09
  [1031, 1115, 'อีกไม่กี่วินาที… ดวงจันทร์ดับตาม'],                        // L10
  [1117, 1213, 'แต่ดาวพฤหัสบดี… ยังสว่างต่ออีกราวชั่วโมงกว่า'],            // L11
  [1216, 1301, 'เพราะแสงต้องไปถึงมันก่อน… แล้วสะท้อนกลับมา'],              // L12
  [1304, 1402, 'ที่จริง… ดาวทุกดวงที่คุณเห็น คือภาพในอดีต'],               // L13
  [1404, 1467, 'และแสงแดดที่โดนตัวคุณอยู่ตอนนี้…'],                        // L14a
  [1467, 1544, 'ออกจากดวงอาทิตย์มาตั้งแต่ 8 นาทีที่แล้ว'],                 // L14b
];
export const EDU7_CUES: Edu7Cue[] = raw.map(([from, to, text]) => ({from, to, text: br(text)}));

/** Caption events for `assemblePaintedTimeline`: every scene starts with a cue ('' = none); a gap between cues is cleared. */
export const edu7CaptionEvents = (cutStarts: number[], total: number): {at: number; text: string}[] => {
  const ev: {at: number; text: string}[] = [];
  const at = (f: number) => EDU7_CUES.find((c) => c.from <= f && f < c.to);
  for (const c of EDU7_CUES) {
    ev.push({at: c.from, text: c.text});
    if (!EDU7_CUES.some((n) => n.from === c.to) && c.to < total && !cutStarts.includes(c.to)) ev.push({at: c.to, text: ''});
  }
  for (const start of cutStarts) if (!ev.some((e) => e.at === start)) ev.push({at: start, text: at(start)?.text ?? ''});
  return ev.sort((a, b) => a.at - b.at);
};
