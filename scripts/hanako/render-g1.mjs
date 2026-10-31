// Standalone SCENE-R3 Group 1 evidence. No episode/video registration.
import {bundle} from '@remotion/bundler';
import {openBrowser, selectComposition, renderStill, renderMedia} from '@remotion/renderer';
import fs from 'node:fs/promises';
import path from 'node:path';
const group3 = process.argv.includes('--g3');
const group2 = process.argv.includes('--g2');
const motion = process.argv.includes('--motion');
const selected = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
// HANAKO_FRAMES adds shot-local frames to every selected shot (run one shot per call); default unchanged.
const extra = (process.env.HANAKO_FRAMES ?? '').split(',').filter(Boolean).map(Number);
// HANAKO_OUT overrides the evidence folder (before/after pairs for a polish pass); default unchanged.
const dir = process.env.HANAKO_OUT ?? `out/qa/hanako/g${group3 ? 3 : group2 ? 2 : 1}`;
await fs.mkdir(dir, {recursive: true});
const chromiumOptions = {gl: 'angle'};
const serveUrl = await bundle({entryPoint: path.resolve('src/painted/hanako/qa-index.tsx')});
const browser = await openBrowser('chrome', {chromiumOptions});
const specs = group3 ? [
  ['B07-SH01',1588,190,[0,7,8,9,19,20,64,65,66,74,75,100,101,102,112,113,119,120,121,189]],
  ['B07-SH02',1778,162,[0,3,4,5,13,14,81,82,83,84,85,86,157,158,159,161]],
  ['B07-SH03',1940,106,[0,1,11,12,13,53,54,55,59,60,81,82,83,84,85,105]],
  ['B08-SH01',2046,256,[0,14,15,100,101,102,112,113,170,171,172,182,183,193,194,195,205,206,207,219,220,221,226,227,228,238,239,244,245,246,254,255]],
  ['B09-SH01',2302,294,[0,20,21,22,44,45,46,80,81,82,179,180,181,191,203,204,205,278,279,280,292,293]],
] : group2 ? [
  ['B04-SH01',645,255,[0,61,62,63,66,74,174,175,176,186,187,191,254]],
  ['B05-SH01',900,116,[0,2,3,4,20,21,22,40,49,50,51,52,66,67,68,82,83,84,115]],
  ['B05-SH02',1016,156,[0,10,11,12,18,24,25,61,62,63,67,71,72,83,84,85,89,93,94,105,106,110,111,112,155]],
  ['B06-SH01',1172,177,[0,83,84,85,91,92,93,98,103,104,105,123,124,125,132,176]],
  ['B06-SH02',1349,239,[0,14,15,80,81,82,110,111,112,152,153,154,159,238]],
] : [
  ['B01-SH01', 0, 117, [0, 3, 4, 5, 18, 31, 35, 36, 45, 50, 54, 116]],
  ['B01-SH02', 117, 187, [0, 14, 15, 133, 134, 140, 186]],
  ['B02-SH01', 304, 139, [0, 109, 110, 112, 113, 114, 130, 131, 138]],
  ['B03-SH01', 443, 202, [0, 23, 24, 35, 36, 70, 85, 100, 201]],
];
const rows = [];
try {
  for (const [shot, start, len, keys] of specs) {
    if (process.argv.includes('--qa-only') || (selected.length && !selected.includes(shot))) continue;
    const id = `HANAKO-${shot}`;
    const composition = await selectComposition({serveUrl, id, puppeteerInstance: browser, chromiumOptions});
    const frames = [...new Set([...keys, ...extra.filter((f) => f >= 0 && f < len), ...Array.from({length: Math.ceil(len / 30)}, (_, i) => i * 30), len - 1])].sort((a,b) => a-b);
    if (motion) {
      await renderMedia({serveUrl, composition, puppeteerInstance: browser, chromiumOptions, codec: 'h264', concurrency: 2, outputLocation: `${dir}/${shot}-motion.mp4`, timeoutInMilliseconds: 180000});
      console.log(`${shot} motion: ${len} frames`);
      continue;
    }
    for (const frame of frames) {
      const output = `${dir}/${shot}-f${String(frame).padStart(3, '0')}.png`;
      await renderStill({serveUrl, composition, puppeteerInstance: browser, chromiumOptions, frame, output, imageFormat: 'png', timeoutInMilliseconds: 180000});
      rows.push({shot, F: start + frame, f: frame, output});
      console.log(`${shot} F${start + frame} [f${frame}]`);
    }
    if (shot === 'B03-SH01' || shot === 'B05-SH02') await renderStill({serveUrl, composition, puppeteerInstance: browser, chromiumOptions, frame: shot === 'B05-SH02' ? 111 : 100, output: `${dir}/repeat-f${shot === 'B05-SH02' ? 111 : 100}.png`, imageFormat: 'png', timeoutInMilliseconds: 180000});
  }
  if (!motion && !group3 && !group2 && (!selected.length || selected.includes('B03-SH01'))) {
    const composition = await selectComposition({serveUrl, id: 'HANAKO-LEAD-MASK', puppeteerInstance: browser, chromiumOptions});
    for (const frame of [0, 100, 201]) await renderStill({serveUrl, composition, puppeteerInstance: browser, chromiumOptions, frame, output: `${dir}/lead-f${frame}.png`, imageFormat: 'png', timeoutInMilliseconds: 180000});
  }
  if (!motion && group3) {
    if(!selected.length || selected.includes('B08-SH01')) {
      for(const [g,m,frame] of [[0,0,113],[1,0,183],[1,1,183],[2,0,206],[2,1,206],[3,0,239]]) {
        const composition=await selectComposition({serveUrl,id:'HANAKO-SILHOUETTE-MASK',puppeteerInstance:browser,chromiumOptions,inputProps:{g,m}});
        await renderStill({serveUrl,composition,puppeteerInstance:browser,chromiumOptions,frame,inputProps:{g,m},output:`${dir}/silhouette-g${g}-m${m}.png`,imageFormat:'png',timeoutInMilliseconds:180000});
      }
    }
    for(const [id,frames,prefix] of [
      ['HANAKO-CLASS-MASK',[0,95,189],'lead'],
      ['HANAKO-LOOP-LANDING',[0],'loop-landing'],
      ['HANAKO-LAYERS-OFF',[45,81,204,293],'layers-off'],
      ['HANAKO-B09-SH01',[293],'repeat'],
    ]) {
      const composition=await selectComposition({serveUrl,id,puppeteerInstance:browser,chromiumOptions});
      for(const frame of frames) await renderStill({serveUrl,composition,puppeteerInstance:browser,chromiumOptions,frame,
        output:`${dir}/${prefix}-f${frame}.png`,imageFormat:'png',timeoutInMilliseconds:180000});
    }
  }
} finally {await browser.close({silent: true});}
if (motion || !rows.length) process.exit(0);
let prior = [];
try {prior = JSON.parse(await fs.readFile(`${dir}/frames.json`, 'utf8'));} catch (e) {if (e.code !== 'ENOENT') throw e;}
const rendered = new Set(rows.map((r) => r.shot));
await fs.writeFile(`${dir}/frames.json`, JSON.stringify([...prior.filter((r) => !rendered.has(r.shot)), ...rows], null, 2) + '\n');
