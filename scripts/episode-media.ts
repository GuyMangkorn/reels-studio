// Lists the public/ media each registered video's timelines reference, for locking them in the asset store.
// Usage: node --import tsx scripts/episode-media.ts [episode...]   (episode = folder under src/videos; default all)
// Prints one `<episode>\t<public path>` line per file, de-duplicated, narration included (filter it if it stays in Git).
import {existsSync, readdirSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const MEDIA = /\.(wav|mp3|ogg|flac|m4a|mp4|mov|webm|png|jpe?g|webp|gif|glb|gltf)$/i;

const collect = (value: unknown, out: Set<string>, seen = new Set<unknown>()) => {
  if (typeof value === 'string') {
    if (MEDIA.test(value) && !/^(https?:|data:)/.test(value)) out.add('public/' + value.replace(/^\/?(public\/)?/, ''));
  } else if (value && typeof value === 'object' && !seen.has(value)) {
    seen.add(value);
    for (const v of Object.values(value)) collect(v, out, seen);
  }
};

const episodes = process.argv.slice(2).length ? process.argv.slice(2)
  : readdirSync('src/videos').filter((d) => existsSync(`src/videos/${d}/index.ts`));
const main = async () => {
  for (const ep of episodes) {
    const mod = await import(pathToFileURL(path.resolve(`src/videos/${ep}/index.ts`)).href);
    const files = new Set<string>();
    collect(mod.default, files);
    for (const f of [...files].sort()) console.log(`${ep}\t${f}`);
  }
};
main();
