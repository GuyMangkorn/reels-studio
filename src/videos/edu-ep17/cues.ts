// EDU-EP17-SHORT caption cues (W5.3 Draft, Editor, 2026-11-12; C01-C16, V01 = C04, V02 has no caption). Pure data. Source: scripts/edu-series/ep17/storyboard.md ROWS-R2.4 "Voice and subtitle cues"
// (voice [start, end) global frames), Thai verbatim from script R2. Cue = [voice start, voice end + 6) capped at the next cue's start. Every scene starts with a cue ('' = none).
// A line longer than 22 characters is broken at the space nearest the middle (after "… " where there is one).
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
  ['C01', 8, 110, 'คนทั้งโลก รวมทั้งคุณด้วย… กว่าแปดพันล้านคน'],
  ['C02', 114, 188, 'ยืนเบียดกันแน่น ๆ ได้หมด ในกรุงเทพฯ กับนนทบุรี'],
  ['C03', 192, 251, 'คนละช่อง แค่ครึ่งเมตร คูณครึ่งเมตร'],
  ['C04', 261, 304, 'แน่นจริง'],
  ['C05', 314, 395, 'กรุงเทพฯ เต็มทุกเขต แล้วล้นเข้านนทบุรี'],
  ['C06', 398, 459, 'แต่ยังไม่ทันเต็มจังหวัด… คนก็หมดแล้ว'],
  ['C07', 483, 552, 'เราว่าเราเยอะแล้ว… โลกใหญ่กว่านั้นอีก'],
  ['C08', 566, 646, 'แต่… ถ้าทุกคนตรงนี้ กระโดดพร้อมกันล่ะ'],
  ['C09', 739, 824, 'โลกขยับจริง… แต่น้อยกว่าความกว้างอะตอมเดียว'],
  ['C10', 834, 911, 'เราว่าเราหนักแล้ว… โลกหนักกว่ามหาศาล'],
  ['C11', 923, 986, 'พอลงพื้น… โลกก็กลับที่เดิม'],
  ['C12', 1010, 1090, 'แต่… คนแค่สนามเดียว ก็ทำพื้นสั่นได้นะ'],
  ['C13', 1094, 1198, 'ที่ซีแอตเทิล เกมฟุตบอลอเมริกัน กับคอนเสิร์ตในสนามกีฬา'],
  ['C14', 1203, 1326, 'คนหลายหมื่นขยับพร้อมกัน… พื้นสั่นจนเครื่องวัดข้างสนามจับได้'],
  ['C15', 1348, 1385, 'ถอยออกไปดูจากอวกาศ…'],
  ['C16', 1394, 1499, 'คนกว่าแปดพันล้านคน… บนโลกใบนี้ เป็นแค่จุดเดียว'],
];
const HOLD = 6;
export const EDU17_CUES: Edu17Cue[] = raw.map(([id, from, end, text], i) => {
  const next = raw[i + 1]?.[1] ?? Infinity;
  return {id, from, to: Math.min(end + HOLD, next), text: br(text)};
});

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
