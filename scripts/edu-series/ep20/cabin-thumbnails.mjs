// W3 one-location thumbnail reproduction. Usage: node scripts/edu-series/ep20/cabin-thumbnails.mjs [out-dir]
// Output: three 1080x1920 flat-wash PNGs and a labelled 270px contact sheet, one Chrome/angle.
import {mkdirSync, writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const finished = process.argv.includes('--finished');
const dir = process.argv.slice(2).find((arg) => !arg.startsWith('--')) ?? (finished ? 'out/edu20-cabin-look-b-r1' : 'out/edu20-cabin-thumbnails-r1');
mkdirSync(dir, {recursive: true});
mkdirSync('out/logs', {recursive: true});
const jobs = finished ? `EDU20-CABIN-LOOK-B 0 ${dir}/look-b.png\nEDU20-CABIN-LOOK-B 1 ${dir}/look-b-repeat.png\n` : ['A', 'B', 'C'].map((v) => `EDU20-CABIN-${v} 0 ${dir}/${v}.png`).join('\n') + `\nEDU20-CABIN-A 1 ${dir}/A-repeat.png\n`;
const log = execFileSync(process.execPath, ['scripts/stills.mjs', 'src/painted/edu20/look-index.ts', '--gl=angle'], {input: jobs, maxBuffer: 16 * 1024 * 1024});
const logPath = `out/logs/${finished ? 'edu20-cabin-look-b-r1' : 'edu20-cabin-thumbnails-r1'}.log`;
writeFileSync(logPath, log);
execFileSync('sh', ['scripts/qa-sheet.sh', `${dir}/contact-270.png`, '--cols', finished ? '1' : '3', ...(finished ? [`${dir}/look-b.png`] : ['A', 'B', 'C'].map((v) => `${dir}/${v}.png`))]);
console.log(`${dir}: stills + contact-270.png; full log ${logPath}`);
