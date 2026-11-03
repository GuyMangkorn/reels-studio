// Plate gallery (src/painted/kit/plates.ts): render one still per PLATES entry that the asset store does not hold yet,
// file it at projects/KIT/plates/<id>.png (stored files are immutable, so the stored still is the gallery record), and
// render the labelled KIT-PLATES sheet from the stills. Prints a suggested palette per rendered plate. The sheet is not stored: --sheet-only rebuilds it in seconds.
// Usage: npx tsx scripts/painted-kit/plates.ts [--only=PL-A,PL-B] [--sheet-only] [--no-store]
//   --only        render these ids even when stored (a stored still that differs is reported and kept)
//   --sheet-only  render no plates; copy the stored stills into public/kit-plates/ and redraw the sheet
//   --no-store    leave the store untouched (a dry run; stills stay in out/kit-plates/)
// Output: out/kit-plates/<id>.png, out/kit-plates/KIT-PLATES.png; full log in out/logs/kit-plates.log.
import {spawnSync} from 'node:child_process';
import {appendFileSync, copyFileSync, existsSync, mkdirSync, writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {PLATES, plateStill} from '../../src/painted/kit/plates';

const arg = (name: string) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const flag = (name: string) => process.argv.includes(`--${name}`);
const only = arg('only')?.split(',');
const store = process.env.REELS_STORE ?? path.join(os.homedir(), 'ReelsStore');
const OUT = 'out/kit-plates', PUB = 'public/kit-plates', LOG = 'out/logs/kit-plates.log';
for (const d of [OUT, PUB, 'out/logs']) mkdirSync(d, {recursive: true});
writeFileSync(LOG, '');

const run = (cmd: string, args: string[], input?: string, okFail = false) => {
  const r = spawnSync(cmd, args, {input, encoding: 'utf8', maxBuffer: 64 << 20});
  appendFileSync(LOG, `$ ${cmd} ${args.join(' ')}\n${r.stdout ?? ''}${r.stderr ?? ''}\n`);
  if (r.status !== 0 && !okFail) throw new Error(`${cmd} ${args.join(' ')} failed (exit ${r.status}); see ${LOG}`);
  return r.status === 0;
};
const stills = (entry: string, lines: string[]) => run('node', ['scripts/stills.mjs', entry], `${lines.join('\n')}\n`);

const stored = (id: string) => path.join(store, plateStill(id));
const plates = flag('sheet-only') ? [] : PLATES.filter((p) => (only ? only.includes(p.id) : !existsSync(stored(p.id))));
const kept: string[] = [];
if (plates.length) {
  stills('src/painted/plates-index.tsx', plates.map((p) => `${p.id} 0 ${OUT}/${p.id}.png`));
  // Suggested palette (5 dominant colours, darkest first) for the entry's `palette` field.
  for (const p of plates) {
    const r = spawnSync('ffmpeg', ['-v', 'error', '-i', `${OUT}/${p.id}.png`, '-vf', 'scale=108:-1,palettegen=max_colors=5:reserve_transparent=0:stats_mode=full', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']);
    const rgb = [...Array(5)].map((_, i) => [...r.stdout.subarray(i * 3, i * 3 + 3)]).sort((x, y) => x[0] * 0.3 + x[1] * 0.59 + x[2] * 0.11 - (y[0] * 0.3 + y[1] * 0.59 + y[2] * 0.11));
    const px = rgb.map((c) => `#${Buffer.from(c).toString('hex')}`);
    console.log(`${p.id} palette ${JSON.stringify([...new Set(px)])}`);
  }
  if (!flag('no-store')) for (const p of plates) if (!run('python3', ['-I', 'scripts/store.py', 'put', `${OUT}/${p.id}.png`, plateStill(p.id)], undefined, true)) kept.push(p.id);
}
// The sheet shows the stored still when there is one (the record), else this run's render (--no-store).
for (const p of PLATES) {
  const src = existsSync(stored(p.id)) && !flag('no-store') ? stored(p.id) : `${OUT}/${p.id}.png`;
  if (!existsSync(src)) throw new Error(`${p.id}: no still in the store or ${OUT}; run without --sheet-only`);
  copyFileSync(src, `${PUB}/${p.id}.png`);
}
stills('src/painted/kit/plates-sheet.tsx', [`KIT-PLATES 0 ${OUT}/KIT-PLATES.png`]);
console.log(`${plates.length} rendered, ${PLATES.length} on the sheet ${OUT}/KIT-PLATES.png${kept.length ? `; stored still kept (render differs): ${kept.join(', ')}` : ''}`);
