// Restores the gitignored sound copies every registered video needs into public/, so any checkout can render.
// Usage: node --import tsx scripts/fetch-sounds.ts [episode...]   (episode = folder under src/videos; default all)
// Walks each episode's exported timelines for audio paths, skips files already in public/ and narration (committed),
// then copies by file name from the shared sound library ($SOUND_LIBRARY) or else the permanent render folder
// ($REELS_RENDER_DIR, e.g. episode-derived sounds). Prints what it copied and anything it could not find.
import {copyFileSync, existsSync, mkdirSync, readdirSync, statSync} from 'node:fs';
import {homedir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const MEDIA = /\.(wav|mp3|ogg|flac|m4a)$/i;
const library = process.env.SOUND_LIBRARY || path.join(homedir(), 'Documents/ChatGPT/sound-library');
const archive = process.env.REELS_RENDER_DIR || path.join(homedir(), 'Movies/ReelsCreator/renders');

const index = new Map<string, string>();
const scan = (dir: string) => {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) scan(p);
    else if (MEDIA.test(name) && !index.has(name)) index.set(name, p);
  }
};
scan(library);
scan(archive);

const collect = (value: unknown, out: Set<string>, seen = new Set<unknown>()) => {
  if (typeof value === 'string') {
    if (MEDIA.test(value) && !value.startsWith('narration/')) out.add(value.replace(/^\/?(public\/)?/, ''));
  } else if (value && typeof value === 'object' && !seen.has(value)) {
    seen.add(value);
    for (const v of Object.values(value)) collect(v, out, seen);
  }
};

const episodes = process.argv.slice(2).length ? process.argv.slice(2)
  : readdirSync('src/videos').filter((d) => existsSync(`src/videos/${d}/index.ts`));
const main = async () => {
  const missing: string[] = [];
  let copied = 0;
  for (const ep of episodes) {
    const mod = await import(pathToFileURL(path.resolve(`src/videos/${ep}/index.ts`)).href);
    const files = new Set<string>();
    collect(mod.default, files);
    for (const rel of files) {
      const dest = path.join('public', rel);
      if (existsSync(dest)) continue;
      const src = index.get(path.basename(rel));
      if (!src) {missing.push(`${ep}: ${rel}`); continue;}
      mkdirSync(path.dirname(dest), {recursive: true});
      copyFileSync(src, dest);
      copied++;
    }
  }
  console.log(`copied ${copied} sound files into public/`);
  if (missing.length) console.log(`not found (${missing.length}):\n  ${missing.join('\n  ')}`);
};
main();
