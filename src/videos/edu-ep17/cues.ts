// EDU-EP17-SHORT caption cues (Editor, 14 Nov 2026). Pure data. Source: scripts/edu-series/ep17/storyboard.md "Voice and subtitle cues" (voice [start, end) global frames, measured on the R2.2 read) and script.md R2.2, Thai verbatim.
// Cue = [voice start, voice end + 6) capped at the next cue's start. Long narration lines are split at their "…" pauses on the sheet's word pegs ("ไม่ใช่ทอง" f149, "แต่คือกองฟืน" f199, "ข้อแรก" ends f507,
// "อย่างกับมีงานบุญ" f836, L06 f954/f996, L06b f1093, L08 f1327/f1352/f1387); pegs marked (est) are syllable estimates, not measured: "ต้องตาก" f424, "น้ำในลำธาร" f516. W-RAIN, W-DUSK and W-PRED have no
// caption ('' = none); every scene still starts with a cue. A cue that wraps breaks after "… " or at the middle space.
export type Edu17Cue = {id: string; from: number; to: number; text: string};
const br = (t: string) => {
  if (t.length <= 22 || t.includes('\n')) return t;
  if (t.includes('… ')) return t.replace('… ', '…\n');
  const sp = [...t].map((c, i) => (c === ' ' ? i : -1)).filter((i) => i > 0);
  if (!sp.length) return t;
  const mid = t.length / 2, at = sp.reduce((a, b) => (Math.abs(b - mid) < Math.abs(a - mid) ? b : a));
  return `${t.slice(0, at)}\n${t.slice(at + 1)}`;
};
const raw: [string, number, number, string][] = [
  ['L01', 8, 99, 'สมมติว่ารูหนอน พาหมู่บ้านคุณ ไปโผล่ยุคไดโนเสาร์…'],
  ['L02a', 100, 147, 'ของที่มีค่าที่สุดในหมู่บ้านคุณ…'],
  ['L02b', 149, 197, 'ไม่ใช่ทอง ไม่ใช่มือถือ…'],
  ['L02c', 199, 238, 'แต่คือกองฟืน'],
  ['V01', 251, 296, 'ฟืนเนี่ยนะ?'],
  ['V05', 302, 368, 'ไม้ในป่า มีเต็มไปหมด!'],
  ['L02b-1', 379, 424, 'ไม้สด ๆ จากป่า ยังชื้นอยู่…'],
  ['L02b-2', 424, 481, 'ต้องตากให้แห้งก่อน ถึงจะเป็นฟืน'],
  ['L03a', 489, 513, 'ข้อแรก…'],
  ['L03b', 516, 598, 'น้ำในลำธาร ใสแค่ไหน ก็ต้องต้มให้เดือดก่อนดื่ม'],
  ['V02', 607, 660, 'ก็มันใสออก…'],
  ['L04', 673, 727, 'เชื้อโรคมันเล็กเกินตาจะเห็นน่ะ'],
  ['L05a', 732, 832, 'แต่ต้มน้ำให้คนทั้งหมู่บ้าน… ใช้ฟืนวันละหลายสิบกิโลขึ้นไป'],
  ['L05b', 836, 877, 'อย่างกับมีงานบุญทุกวัน'],
  ['L06a', 928, 954, 'ข้อสอง…'],
  ['L06b', 954, 996, 'ห้ามให้ฟืนเปียก…'],
  ['L06c', 996, 1047, 'เปียกฝนทีเดียว ก็จุดยากแล้ว'],
  ['L06b-1', 1052, 1093, 'ได้น้ำฝนฟรีก็จริง…'],
  ['L06b-2', 1093, 1126, 'แต่ก็ต้องต้มอยู่ดี'],
  ['V03', 1167, 1212, 'โอ๊ย! ยุง!'],
  ['L07', 1222, 1288, 'ใช่… ยุงมีอยู่แล้วในยุคไดโนเสาร์'],
  ['L08a', 1299, 1327, 'ข้อสาม…'],
  ['L08b', 1327, 1387, 'ตอนค่ำ ก่อไฟให้มีควัน'],
  ['L08c', 1387, 1425, 'ควันช่วยไล่ยุงได้บ้าง'],
  ['V04', 1434, 1488, 'ฟืนอีกแล้ว…'],
  ['L09', 1502, 1587, 'ข้อสุดท้าย… ไฟช่วยคุณได้แทบทุกเรื่อง'],
  ['L10', 1688, 1752, '…ยกเว้นเรื่องนี้'],
];
export const EDU17_CUES: Edu17Cue[] = raw.map(([id, from, to, text]) => ({id, from, to, text: br(text)}));

/** Caption events for `assemblePaintedTimeline`: every scene starts with a cue ('' = none); a gap between cues is cleared. */
export const edu17CaptionEvents = (cutStarts: number[], total: number): {at: number; text: string}[] => {
  const ev: {at: number; text: string}[] = [];
  const at = (f: number) => EDU17_CUES.find((c) => c.from <= f && f < c.to);
  for (const c of EDU17_CUES) {
    ev.push({at: c.from, text: c.text});
    if (!EDU17_CUES.some((n) => n.from === c.to) && c.to < total && !cutStarts.includes(c.to)) ev.push({at: c.to, text: ''});
  }
  for (const start of cutStarts) if (!ev.some((e) => e.at === start)) ev.push({at: start, text: at(start)?.text ?? ''});
  return ev.sort((a, b) => a.at - b.at);
};
