// Thai caption line-break check (editor-workflow step 5): flags authored line breaks that split a word and lines likely to wrap.
// Usage: node scripts/caption-breaks.mjs TIMELINE.json [--max 26] [--fps 30]
// TIMELINE.json is a list of scenes/slots with durationSec and either cues/subtitleCues [{atSec, text}] or subtitle.
// Words come from Intl.Segmenter('th'), lengths count base characters (Thai vowel/tone marks excluded).
// --max is an estimate of one line at the portrait default size (51 px bold, 88 % width); a MAY-WRAP cue needs an
// authored "\n" at a word boundary or a frame check, because the browser picks the wrap point and can split a word.
import {readFileSync} from 'node:fs';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i < 0 ? def : Number(args.splice(i, 2)[1]); };
const max = opt('--max', 26), fps = opt('--fps', 30);
if (args.length !== 1) { console.error('usage: node scripts/caption-breaks.mjs TIMELINE.json [--max 26] [--fps 30]'); process.exit(2); }
const scenes = JSON.parse(readFileSync(args[0], 'utf8'));
const words = new Intl.Segmenter('th', {granularity: 'word'});
const base = (s) => s.replace(/[ัิ-ฺ็-๎\s]/g, '').length;
const ends = (s) => new Set([...words.segment(s)].map((w) => w.index + w.segment.length));

let t = 0, bad = 0, wrap = 0;
for (const s of scenes) {
  const cues = s.cues ?? s.subtitleCues ?? (s.subtitle ? [{atSec: 0, text: s.subtitle}] : []);
  for (const c of cues) {
    const flags = [], joined = c.text.replace(/\n/g, '');
    const ok = ends(joined);
    let pos = 0;
    for (const line of c.text.split('\n').slice(0, -1)) { pos += line.length; if (!ok.has(pos) && !/\s$/.test(line)) flags.push(`BREAK-MID-WORD after "${line.slice(-6)}"`); }
    const lens = c.text.split('\n').map(base);
    if (lens.length > 2) flags.push('MORE-THAN-2-LINES');
    if (lens.some((n) => n > max)) flags.push('MAY-WRAP');
    bad += flags.some((f) => f.startsWith('BREAK') || f.startsWith('MORE')); wrap += flags.includes('MAY-WRAP');
    const frame = Math.round((t + c.atSec) * fps);
    const seg = [...words.segment(joined)].map((w) => w.segment).join('|');
    console.log(`F${String(frame).padStart(5)} [${lens.join('+')}] ${flags.join(', ') || 'ok'}  ${flags.length ? seg : c.text.replace(/\n/g, ' / ')}`);
  }
  t = Math.round((t + (s.durationSec ?? 0)) * fps) / fps;
}
console.log(`cues checked; ${bad} with a bad authored break or >2 lines, ${wrap} MAY-WRAP (frame-check or add "\\n" at a | boundary)`);
process.exit(bad ? 1 : 0);
