// EDU-EP07-SHORT caption cues (W5.3 Draft, Editor, 8 Nov 2026). Pure data. Source: scripts/edu-series/ep07/scene-sheets.md (EDU-EP07-SHEETS-R1.1 "Caption plan").
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
  [399, 460, 'โลกยังโคจรต่อด้วย…'],                                       // L05a
  [460, 506, 'ตามทฤษฎีของไอน์สไตน์'],                                     // L05b
  [506, 580, 'แรงโน้มถ่วงที่เปลี่ยนไป… ก็เร็วเท่าแสง'],                    // L05c
  [582, 683, 'ปี 2017 นักวิทย์จับคลื่นความโน้มถ่วงกับแสง…'],               // L06a
  [683, 753, 'จากดาวนิวตรอนสองดวงชนกันได้'],                              // L06b
  [755, 828, 'เดินทางมา 130 ล้านปี…'],                                    // L07a
  [828, 907, 'มาถึงห่างกันไม่ถึง 2 วินาที…'],                              // L07b
  [907, 980, 'แปลว่าคลื่นนี้เร็วเท่าแสงแทบเป๊ะ'],                          // L07c
  [982, 1055, 'พอนาฬิกาถึงศูนย์… ฟ้าก็มืดลง'],                             // L08
  [1093, 1155, 'เอ้า… ไฟดับเหรอ'],                                        // D03
  [1164, 1246, 'โลกหลุดวงโคจร… พุ่งไปตรง ๆ'],                              // L09
  [1249, 1333, 'อีกไม่กี่วินาที… ดวงจันทร์ดับตาม'],                        // L10
  [1335, 1431, 'แต่ดาวพฤหัสบดี… ยังสว่างต่ออีกราวชั่วโมงกว่า'],            // L11
  [1434, 1519, 'เพราะแสงต้องไปถึงมันก่อน… แล้วสะท้อนกลับมา'],              // L12
  [1522, 1620, 'ที่จริง… ดาวทุกดวงที่คุณเห็น คือภาพในอดีต'],               // L13
  [1622, 1685, 'และแสงแดดที่โดนตัวคุณอยู่ตอนนี้…'],                        // L14a
  [1685, 1762, 'ออกจากดวงอาทิตย์มาตั้งแต่ 8 นาทีที่แล้ว'],                 // L14b
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
