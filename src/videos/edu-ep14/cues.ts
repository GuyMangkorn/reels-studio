// EDU-EP14-SHORT caption cues (W5.3 Draft, Editor, 2026-11-09; 20 cues C01-C20). Pure data. Source: scripts/edu-series/ep14/storyboard.md ROWS-R4.1 "Voice and subtitle cues" (voice [start, end) global
// frames measured in measure.json `lock`), Thai verbatim from script R4. Cue = [voice start, voice end + 6) capped at the next cue's start; C09 (V01 "โอ๊ย!") holds to f674 as the sheet allows.
// No caption for V02 (giggle f1745-1760) or the wordless W700 slot (f535-565): every scene still starts with a cue ('' = none). A cue that wraps breaks after "… " or at the middle space.
export type Edu14Cue = {id: string; from: number; to: number; text: string};
const br = (t: string) => {
  if (t.length <= 22 || t.includes('\n')) return t;
  if (t.includes('… ')) return t.replace('… ', '…\n');
  const sp = [...t].map((c, i) => (c === ' ' ? i : -1)).filter((i) => i > 0);
  if (!sp.length) return t;
  const mid = t.length / 2, at = sp.reduce((a, b) => (Math.abs(b - mid) < Math.abs(a - mid) ? b : a));
  return `${t.slice(0, at)}\n${t.slice(at + 1)}`;
};
const raw: [string, number, number, string][] = [
  ['C01', 15, 65, 'สมมติว่าฝนตกโดยไม่มีอากาศ…'],
  ['C02', 71, 185, 'เม็ดฝนจะพุ่งใส่หัวคุณ เร็วถึงราวเจ็ดร้อยกิโลต่อชั่วโมง'],
  ['C03', 202, 271, 'ไม่มีลม ไม่มีเสียง… ฟ้าเงียบสนิท'],
  ['C04', 292, 323, 'เม็ดฝนหลุดจากเมฆ'],
  ['C05', 339, 385, 'ที่ลอยสูงได้ถึงสองกิโล'],
  ['C06', 397, 446, 'ไม่มีอะไรขวาง มันเร่งไม่หยุด'],
  ['C07', 470, 535, 'ตกมาแค่กิโลเดียว ห้าร้อยกว่าแล้ว'],
  ['C08', 569, 631, 'เม็ดใหญ่ ๆ จะแสบเหมือนโดนบีบีกันยิง'],
  ['C09', 653, 666, 'โอ๊ย!'],
  ['C10', 690, 739, 'แต่… โลกจริงมีอากาศ'],
  ['C11', 756, 818, 'ยิ่งตกเร็ว… อากาศยิ่งดันกลับแรง'],
  ['C12', 836, 914, 'ดันจนสู้น้ำหนักมันได้พอดี มันก็เลิกเร่ง'],
  ['C13', 934, 1028, 'เม็ดใหญ่ที่สุด ถึงพื้นแค่สามสิบกว่ากิโลต่อชั่วโมง'],
  ['C14', 1053, 1101, 'เม็ดฝนไม่ได้เป็นหยดน้ำตานะ'],
  ['C15', 1118, 1210, 'อากาศดันเม็ดใหญ่จนก้นแบน เหมือนขนมปังเบอร์เกอร์'],
  ['C16', 1234, 1317, 'แต่… ทำไมไม่มีเม็ดฝนใหญ่เท่าลูกบอลล่ะ'],
  ['C17', 1339, 1422, 'ยิ่งใหญ่ อากาศยิ่งดันก้นบุ๋มเหมือนถุงคว่ำ'],
  ['C18', 1436, 1507, 'พอใหญ่ราวครึ่งเซน ก็แตกเป็นเม็ดเล็ก ๆ'],
  ['C19', 1532, 1597, 'ยิ่งตกเร็ว… อากาศยิ่งดันกลับแรง'],
  ['C20', 1610, 1738, 'ทุกเม็ดที่ตกใส่มือคุณ… ถูกอากาศเบรกไว้ไม่ให้เร็วไปกว่านี้'],
];
const HOLD = 6;
export const EDU14_CUES: Edu14Cue[] = raw.map(([id, from, end, text], i) => {
  const next = raw[i + 1]?.[1] ?? Infinity;
  return {id, from, to: Math.min(id === 'C09' ? 674 : end + HOLD, next, from < 535 ? 535 : Infinity), text: br(text)};   // 535 = the W700 slot starts: no caption in it
});

/** Caption events for `assemblePaintedTimeline`: every scene starts with a cue ('' = none); a gap between cues is cleared. */
export const edu14CaptionEvents = (cutStarts: number[], total: number): {at: number; text: string}[] => {
  const ev: {at: number; text: string}[] = [];
  const at = (f: number) => EDU14_CUES.find((c) => c.from <= f && f < c.to);
  for (const c of EDU14_CUES) {
    ev.push({at: c.from, text: c.text});
    if (!EDU14_CUES.some((n) => n.from === c.to) && c.to < total && !cutStarts.includes(c.to)) ev.push({at: c.to, text: ''});
  }
  for (const start of cutStarts) if (!ev.some((e) => e.at === start)) ev.push({at: start, text: at(start)?.text ?? ''});
  return ev.sort((a, b) => a.at - b.at);
};
