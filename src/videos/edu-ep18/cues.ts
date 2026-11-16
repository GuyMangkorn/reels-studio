// EDU-EP18-SHORT caption cues (W5 draft, Editor, 2026-11-16). Pure data. Source: scripts/edu-series/ep18/short/scene-sheets.md R1.0 "Caption plan" + "Line table (G, meas)":
// one cue per line, split at a "…" pause; from = floor(onset), to = round(end) + 6 f, clipped 2 f before the next onset; V02 and V05 in their voiced spans (+6 f); V01/V03/V04 uncaptioned.
// Thai verbatim from script R2.1 (L12 changed 2026-11-16: narration v2, onset G1082, "…" pause G1122-1125.5, end G1153 as v1) (digits for L07, L10, L11 per the plan; L04 and L16 "ห้าร้อย" as spoken); no caption in the hold (G1812-1872).
export type Edu18Cue = {id: string; from: number; to: number; text: string};
export const EDU18_CUES: Edu18Cue[] = ([
  ['L01', 38, 129, 'ถ้าคุณคิดว่าฮิปโป\nคือสัตว์ที่ฆ่าคนเยอะที่สุดในโลก…'],
  ['L02', 132, 189, 'มันไม่ติดแม้แต่สามอันดับแรกนะ'],
  ['V02', 197, 214, 'เฮ้ย!'],
  ['L03a', 216, 239, 'ดุจริงแหละ…'],
  ['L03b', 242, 297, 'แต่ดุ ไม่ได้แปลว่าฆ่าเยอะนะ'],
  ['L04', 302, 390, 'ตัวเลขที่ใคร ๆ ก็แชร์กัน…\nปีละห้าร้อยคน'],
  ['L05a', 393, 423, 'ลองเอาไปเทียบดู'],
  ['L05b', 431, 466, 'อย่าดูที่ความดุ…'],
  ['L05c', 468, 507, 'ดูที่ตัวเลข'],
  ['L06a', 519, 562, 'แต่ตัวที่ฆ่าคนมากกว่า…'],
  ['L06b', 564, 608, 'อยู่ใกล้ตัวกว่านั้นเยอะ'],
  ['L07', 619, 755, 'หมาที่มีเชื้อพิษสุนัขบ้า\nทำให้คนตายราว ๆ 40,000 คนต่อปี'],
  ['L08', 760, 813, 'เต็มสนามฟุตบอลได้ทั้งสนาม'],
  ['L09', 820, 868, 'แต่หมา ยังไม่ใช่ที่หนึ่งนะ'],
  ['L10', 903, 988, 'คนโดนงูกัด ปีละราว ๆ 5,000,000 คน'],
  ['L11', 993, 1075, 'กัดบ่อยขนาดนี้\nตายราว ๆ 100,000 คนทุกปี'],
  ['L12a', 1082, 1123, 'แต่ที่หนึ่ง…'],
  ['L12b', 1125, 1159, 'ตัวเล็กนิดเดียว\nแต่ฆ่าได้มากกว่านั้นอีก'],
  ['L13', 1203, 1284, 'ยุงพาเชื้อ จากเลือดคนหนึ่ง ไปอีกคน'],
  ['L14', 1289, 1382, 'แค่ไข้มาลาเรียโรคเดียว\nก็ตายหลายแสนคนต่อปี'],
  ['L15a', 1393, 1433, 'ดูที่ตัวเลขมาตลอด…'],
  ['L15b', 1437, 1505, 'แต่ยังเหลือตัวเลขเดียว\nที่เรายังไม่ได้ดู'],
  ['V05', 1508, 1520, 'เอ๊ะ…'],
  ['L16a', 1522, 1559, 'ห้าร้อยของฮิปโป…'],
  ['L16b', 1563, 1591, 'ใครเป็นคนนับ?'],
  ['L17', 1603, 1659, 'ไม่มีใครนับได้จริงเลย…'],
  ['L18a', 1661, 1731, 'สัตว์ที่ขึ้นชื่อว่าฆ่าคนเยอะที่สุด…'],
  ['L18b', 1736, 1812, 'ขึ้นชื่อด้วยตัวเลข\nที่ไม่มีใครชี้ที่มาได้ชัด'],
] as [string, number, number, string][]).map(([id, from, to, text]) => ({id, from, to, text}));

/** Caption events for `assemblePaintedTimeline`: every scene starts with a cue ('' = none); a gap between cues is cleared; a cue that crosses a cut is repeated at the cut. */
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
