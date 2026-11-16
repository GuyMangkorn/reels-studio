// EDU-EP19-SHORT caption cues (W5.4 Draft, Editor, 2026-11-15; 20 cards). Pure data. Source: scripts/edu-series/ep19/short/scene-sheets.md EDU-EP19-SHEETS-R3 "Narration and girl-line placement"
// (global frames [start, end) = speech end + 6 f, never past the next line's onset; split lines change card on the inner anchor); Thai verbatim from script R4 (no subtitle differences).
// V05 (giggle) is not subtitled; no caption in W-WAIT (G676-721 except V02's 6 f tail to 681), W-SNIFF (G797-869 except V03's tail to 802) or the W-HOLD (G1646-1704).
// Deviation from the sheet: L01 is two cards, "หมาตามรอยที่ฝึกมา…" G7-49 and the rest G49-157 (inner anchor G49), because the whole line is three caption lines at 51 px.
// A card wraps at "… " or a word boundary authored here (scripts/caption-breaks.mjs).
export type Edu19Cue = {id: string; from: number; to: number; text: string};
const raw: [string, number, number, string][] = [
  ['L01a', 7, 49, 'หมาตามรอยที่ฝึกมา…'],
  ['L01b', 49, 157, 'ดมรอยเท้าคุณแค่ห้ารอย\nก็บอกได้แล้วว่าคุณเดินไปทางไหน'],
  ['L02', 170, 248, 'ทุกรอยก็กลิ่นคุณเหมือนกันนี่…\nรู้ได้ไง'],
  ['L03', 263, 329, 'รอยที่เหยียบก่อน…\nน่าจะจางกว่า'],
  ['L03b', 330, 448, 'เหมือนคุณเดินตามกลิ่นข้าวผัด…\nไปทางที่หอมขึ้นเรื่อย ๆ'],
  ['V01', 448, 511, 'โธ่… เจอจนได้!'],
  ['L04', 511, 593, 'กลิ่นยิ่งเก่า ยิ่งจาง…\nเธอเลยมีแผน'],
  ['V02', 594, 681, 'แม่ รอยี่สิบนาทีนะ…\nกลิ่นหายหมดแน่'],
  ['V03', 722, 802, 'ฟุดฟิด… หายเกลี้ยงแล้ว!'],
  ['L05a', 869, 941, 'แต่รอยบนหญ้า\nที่ทิ้งไว้ยี่สิบนาที…'],
  ['L05b', 941, 994, 'หมาตามรอยก็ยังเลือกทางถูก'],
  ['V04', 994, 1039, 'ห๊ะ!? ยังได้อีก'],
  ['L07a', 1040, 1101, 'แต่ถ้ามันไล่ดมทีละรอย…'],
  ['L07b', 1101, 1146, 'งั้นสลับลำดับรอยดูสิ'],
  ['L08a', 1310, 1353, 'พอสลับลำดับรอย…'],
  ['L08b', 1353, 1397, 'ลำดับกลิ่นก็มั่ว'],
  ['L08c', 1397, 1460, 'หมาตามรอยก็บอกทางไม่ได้'],
  ['V06', 1460, 1492, 'เย้!'],
  ['L10a', 1493, 1562, 'เวลาที่ผ่านไป ไม่ได้ซ่อนเธอ…'],
  ['L10b', 1562, 1646, 'ลำดับที่ถูกสลับ\nต่างหากที่ซ่อนเธอ'],
];
export const EDU19_CUES: Edu19Cue[] = raw.map(([id, from, to, text]) => ({id, from, to, text}));

/** Caption events for `assemblePaintedTimeline`: every scene starts with a cue ('' = none); a gap between cues is cleared. */
export const edu19CaptionEvents = (cutStarts: number[], total: number): {at: number; text: string}[] => {
  const ev: {at: number; text: string}[] = [];
  const at = (f: number) => EDU19_CUES.find((c) => c.from <= f && f < c.to);
  for (const c of EDU19_CUES) {
    ev.push({at: c.from, text: c.text});
    if (!EDU19_CUES.some((n) => n.from === c.to) && c.to < total && !cutStarts.includes(c.to)) ev.push({at: c.to, text: ''});
  }
  for (const start of cutStarts) if (!ev.some((e) => e.at === start)) ev.push({at: start, text: at(start)?.text ?? ''});
  return ev.sort((a, b) => a.at - b.at);
};
