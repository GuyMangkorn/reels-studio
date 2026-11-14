// EDU-EP18-SHORT caption cues (Editor, 14 Nov 2026; 17 cues). Pure data. Source: scripts/edu-series/ep18/storyboard.md "Voice and subtitle cues" (voice [start, end) global frames from
// scripts/edu-series/ep18/measure.json) with the Thai verbatim from script R2.2; no caption on W-PHONE, W-SHOP, W-KITCHEN, V03 (hen cluck) or the end hold.
// Cue = [voice start, voice end + 6) capped at the next cue's start. L07 is one sheet cue spoken as three clauses; it is split at the clause onsets that also pop the recipe card lines
// (f1302, f1352 = the measured word pegs) so the words on screen follow the voice; the text is the script's, unchanged. A cue that wraps breaks after "… " or at the middle space.
export type Edu18Cue = {id: string; from: number; to: number; text: string};
const br = (t: string) => {
  if (t.length <= 24 || t.includes('\n')) return t;
  if (t.includes('… ')) return t.replace('… ', '…\n');
  const sp = [...t].map((c, i) => (c === ' ' ? i : -1)).filter((i) => i > 0);
  if (!sp.length) return t;
  const mid = t.length / 2, at = sp.reduce((a, b) => (Math.abs(b - mid) < Math.abs(a - mid) ? b : a));
  return `${t.slice(0, at)}\n${t.slice(at + 1)}`;
};
const raw: [string, number, number, string][] = [
  ['L01', 8, 104, 'สมมติว่ารูหนอน พาหมู่บ้านคุณ ไปโผล่ยุคไดโนเสาร์…'],
  ['L02', 114, 217, 'ยาที่ช่วยชีวิตคุณได้… ไม่ได้อยู่ร้านยา… แต่อยู่ในครัว'],
  ['V01', 233, 289, 'ฮัลโหล… ฮัลโหล?'],
  ['L03', 369, 479, 'มือถือยังเปิดได้… แต่โทรไม่ออกแล้ว ไม่มีเสาสัญญาณสักต้น'],
  ['L03b', 488, 522, 'ใช้เป็นไฟฉายได้ ก็ยังดี'],
  ['L04', 585, 694, 'ร้านยาในหมู่บ้าน มีอยู่ไม่กี่กล่อง… ใช้แล้วหมด ผลิตเพิ่มไม่ได้'],
  ['V04', 707, 772, 'บอกแล้ว… ว่าอย่ากินน้ำดิบ'],
  ['V05', 792, 838, 'ก็มันใสออก…'],
  ['L05', 855, 931, 'แต่ท้องเสียธรรมดา ๆ… ก็อันตรายได้'],
  ['V02', 946, 1022, 'ยาย… หิวน้ำ'],
  ['L06', 1036, 1126, 'ร่างกายเสียน้ำไปเรื่อย ๆ… ยิ่งเป็นเด็ก ยิ่งทรุดเร็ว'],
  ['L06b', 1138, 1216, 'แต่ที่เสียไป ไม่ใช่แค่น้ำ… เกลือก็ด้วย'],
  ['L07a', 1264, 1294, 'น้ำต้มสุกหนึ่งลิตร…'],
  ['L07b', 1302, 1342, 'น้ำตาลหกช้อนชาปาด…'],
  ['L07c', 1352, 1382, 'เกลือครึ่งช้อนชาปาด'],
  ['L08', 1394, 1412, 'ค่อย ๆ จิบนะ'],
  ['L08b', 1426, 1515, 'ในชีวิตจริง ถ้าดื่มไม่ได้ หรืออาการหนัก ต้องรีบหาหมอ'],
  ['L09', 1530, 1653, 'ยาจากร้านใช้แล้วหมด… แต่ยาที่ช่วยชีวิตได้ อยู่ในครัวคุณมาตลอด'],
];
const HOLD = 6;
export const EDU18_CUES: Edu18Cue[] = raw.map(([id, from, end, text], i) => {
  const next = raw[i + 1]?.[1] ?? Infinity;
  // the three L07 clauses run into each other (card lines pop on the onsets): each holds to the next onset, the last to the end of the window caption L07c + hold
  const to = id === 'L07a' ? 1302 : id === 'L07b' ? 1352 : Math.min(end + HOLD, next);
  return {id, from, to, text: br(text)};
});

/** Caption events for `assemblePaintedTimeline`: every scene starts with a cue ('' = none); a gap between cues is cleared. */
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
