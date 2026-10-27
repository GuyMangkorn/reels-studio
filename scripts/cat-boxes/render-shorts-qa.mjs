import {bundle} from '@remotion/bundler';
import {openBrowser, renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {execFile} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {promisify} from 'node:util';

const execFileAsync = promisify(execFile);

const fps = 30;
const width = 1080;
const height = 1920;
const root = path.resolve('out/qa/cat-boxes/shorts-r2');
const bundleDir = path.join(root, 'bundle');
const sheetDir = path.join(root, 'contact-sheets');
const shortSpecs = [
  {id: 'CATBOX-C01-Short', chapter: 'C01', source: 'scripts/cat-boxes/short-c01.json', script: 'ch01 R5'},
  {id: 'CATBOX-C02-Short', chapter: 'C02', source: 'scripts/cat-boxes/short-c02.json', script: 'ch02 R4'},
  {id: 'CATBOX-C03-Short', chapter: 'C03', source: 'scripts/cat-boxes/short-c03.json', script: 'ch03 R4'},
  {id: 'CATBOX-C04-Short', chapter: 'C04', source: 'scripts/cat-boxes/short-c04.json', script: 'ch04 R4'},
  {id: 'CATBOX-C05-Short', chapter: 'C05', source: 'scripts/cat-boxes/short-c05.json', script: 'ch05 R4'},
  {id: 'CATBOX-C06-Short', chapter: 'C06', source: 'scripts/cat-boxes/short-c06.json', script: 'ch06 R4'},
];
const onlyArg = process.argv.find((arg) => arg.startsWith('--only='));
const selected = onlyArg ? new Set(onlyArg.slice('--only='.length).split(',').map((value) => value.trim())) : undefined;
const focusArg = process.argv.find((arg) => arg.startsWith('--frames='));
const focusFrames = focusArg ? [...new Set(focusArg.slice('--frames='.length).split(',').map(Number))].sort((a, b) => a - b) : undefined;
if (focusFrames?.some((frame) => !Number.isInteger(frame) || frame < 0 || frame >= 1350)) throw new Error('--frames values must be integer Short frames from 0 through 1349');
const specs = shortSpecs.filter((short) => !selected || selected.has(short.chapter) || selected.has(short.id));
if (specs.length === 0) throw new Error('No Short composition selected. Use --only=C01,C03 or omit --only for all six.');

await mkdir(root, {recursive: true});
await mkdir(sheetDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), outDir: bundleDir});
const parityFrames = [137, 421, 863, 1189];
const propsFor = (ending) => ({ending});
const hash = async (file) => createHash('sha256').update(await readFile(file)).digest('hex');
const frameName = (frame) => 'f' + String(frame).padStart(5, '0') + '.png';
const clampFrame = (frame, totalFrames) => Math.max(0, Math.min(totalFrames - 1, frame));
const reviewedSeekFrames = {C03: [59, 60, 61, 89, 90, 91, 101, 102, 103]};

const addCriticalFrames = (frames, start, localSeconds, totalFrames) => {
  for (const seconds of localSeconds) {
    const frame = start + Math.round(seconds * fps);
    frames.add(clampFrame(frame - 1, totalFrames));
    frames.add(clampFrame(frame, totalFrames));
    frames.add(clampFrame(frame + 1, totalFrames));
  }
};

const collectFrames = (timeline, chapter) => {
  const totalFrames = timeline.reduce((sum, scene) => sum + Math.round(scene.durationSec * fps), 0);
  const oneSecond = Array.from({length: Math.floor(totalFrames / fps)}, (_, i) => i * fps);
  const critical = new Set();
  const shots = [];
  let from = 0;
  for (const scene of timeline) {
    const duration = Math.round(scene.durationSec * fps);
    shots.push(...(scene.visuals ?? []).map((visual) => ({
      shotId: visual.shotId,
      sourceBeatId: visual.sourceBeatId,
      startFrame: from + Math.round(visual.startSec * fps),
      endFrame: from + Math.round(visual.endSec * fps),
      factualImageStatus: visual.status,
    })));
    addCriticalFrames(critical, from, [0, scene.durationSec], totalFrames);
    addCriticalFrames(critical, from, scene.subtitleCues?.map((cue) => cue.atSec) ?? [], totalFrames);
    addCriticalFrames(critical, from, scene.visuals?.flatMap((visual) => (visual.labelsAtSec ?? []).flatMap((atSec) => [atSec, atSec + 0.2])) ?? [], totalFrames);
    addCriticalFrames(critical, from, scene.pictureMove?.map((key) => key.atSec) ?? [], totalFrames);
    addCriticalFrames(critical, from, scene.actors.flatMap((actor) => [
      ...(actor.poses?.map((key) => key.atSec) ?? []),
      ...(actor.world?.keys.map((key) => key.atSec) ?? []),
    ]), totalFrames);
    addCriticalFrames(critical, from, (scene.projection?.views.short.cameraMoves ?? []).map((key) => key.atSec), totalFrames);
    addCriticalFrames(critical, from, scene.props?.flatMap((prop) => [
      ...(prop.startSec === undefined ? [] : [prop.startSec]),
      ...(prop.endSec === undefined ? [] : [prop.endSec]),
      ...(prop.worldMotion?.map((key) => key.atSec) ?? []),
    ]) ?? [], totalFrames);
    from += duration;
  }
  const boundaries = shots.slice(1).map((shot) => shot.startFrame);
  for (const frame of boundaries) for (const adjacent of [frame - 1, frame, frame + 1]) critical.add(clampFrame(adjacent, totalFrames));
  const holdStart = totalFrames - 3 * fps;
  const fadeStart = totalFrames - fps;
  for (const frame of [holdStart, fadeStart]) for (const adjacent of [frame - 1, frame, frame + 1]) critical.add(clampFrame(adjacent, totalFrames));
  for (const frame of [0, totalFrames - 2, totalFrames - 1]) critical.add(clampFrame(frame, totalFrames));
  return {
    totalFrames,
    oneSecond: [...new Set([...oneSecond, totalFrames - 1])].sort((a, b) => a - b),
    critical: [...critical].sort((a, b) => a - b),
    random: [...new Set([...parityFrames, ...(reviewedSeekFrames[chapter] ?? [])].map((frame) => clampFrame(frame, totalFrames)))],
    boundaries,
    shots,
    holdStart,
    fadeStart,
  };
};

const escapeXml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const writeContactSheets = async (short, frames, imageDir, title) => {
  const columns = 5;
  const thumbWidth = 216;
  const thumbHeight = 384;
  const columnGap = 18;
  const rowGap = 15;
  const labelHeight = 22;
  const cellHeight = thumbHeight + labelHeight + rowGap;
  const perPage = 20;
  const paths = [];
  for (let page = 0; page < Math.ceil(frames.length / perPage); page++) {
    const pageFrames = frames.slice(page * perPage, (page + 1) * perPage);
    const rows = Math.ceil(pageFrames.length / columns);
    const sheetWidth = 1200;
    const marginX = (sheetWidth - columns * thumbWidth - (columns - 1) * columnGap) / 2;
    const headerHeight = 78;
    const sheetHeight = headerHeight + rows * cellHeight + 14;
    const cells = [];
    pageFrames.forEach((frame, i) => {
      const col = i % columns;
      const row = Math.floor(i / columns);
      const x = marginX + col * (thumbWidth + columnGap);
      const y = headerHeight + row * cellHeight;
      const relativeImage = path.relative(sheetDir, path.join(imageDir, frameName(frame))).split(path.sep).join('/');
      cells.push('<text x="' + x + '" y="' + (y + 16) + '" font-family="Noto Sans Thai,sans-serif" font-size="16" fill="#4a3b3b">F' + frame + ' · ' + (frame / fps).toFixed(1) + 's</text>');
      cells.push('<image href="' + escapeXml(relativeImage) + '" x="' + x + '" y="' + (y + labelHeight) + '" width="' + thumbWidth + '" height="' + thumbHeight + '" preserveAspectRatio="xMidYMid meet"/>');
    });
    const file = path.join(sheetDir, short.chapter + '-' + title + '-' + String(page + 1).padStart(2, '0') + '.svg');
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + sheetWidth + '" height="' + sheetHeight + '" viewBox="0 0 ' + sheetWidth + ' ' + sheetHeight + '"><rect width="100%" height="100%" fill="#fffaf2"/><text x="28" y="42" font-family="Noto Sans Thai,sans-serif" font-size="25" font-weight="700" fill="#4a3b3b">' + escapeXml(short.id + ' · ' + title + ' · page ' + (page + 1)) + '</text>' + cells.join('') + '</svg>';
    await writeFile(file, svg, 'utf8');
    paths.push(file);
  }
  return paths;
};

let previousManifest = {};
if (selected && !focusFrames) {
  try {
    previousManifest = JSON.parse(await readFile(path.join(root, 'manifest.json'), 'utf8'));
  } catch {
    previousManifest = {};
  }
}
const selectedIds = new Set(specs.map((short) => short.id));
const retainedShorts = Array.isArray(previousManifest.shorts)
  ? previousManifest.shorts.filter((short) => !selectedIds.has(short.composition)).map((short) => ({
    ...short,
    qaRefreshedAt: short.qaRefreshedAt ?? previousManifest.generatedAt ?? null,
  }))
  : [];
const manifest = {
  generatedAt: new Date().toISOString(),
  scope: 'Six portrait CATBOX Short S01 cuts only; Long was not rendered or QA-reviewed.',
  fps,
  resolution: {width, height},
  narration: 'absent; no Short-specific voice track supplied',
  subtitleTiming: 'estimated from source beat timing; audio sync is unverified',
  studio: 'unverified separately from CLI renders',
  shorts: retainedShorts,
};

for (const short of specs) {
  const timeline = JSON.parse(await readFile(path.resolve(short.source), 'utf8'));
  const coverage = collectFrames(timeline, short.chapter);
  if (coverage.totalFrames !== 1350) throw new Error(short.id + ' has ' + coverage.totalFrames + ' frames; expected 1350');
  const shortDir = path.join(root, short.chapter);
  if (focusFrames) {
    const focusDir = path.join(shortDir, 'focus-recheck');
    await mkdir(focusDir, {recursive: true});
    const browser = await openBrowser('chrome', {chromiumOptions: {gl: 'swangle'}});
    try {
      const composition = await selectComposition({serveUrl, id: short.id, browserInstance: browser, inputProps: propsFor('A_fade')});
      for (const frame of focusFrames) {
        await renderStill({serveUrl, composition, browserInstance: browser, inputProps: propsFor('A_fade'), frame, output: path.join(focusDir, frameName(frame)), imageFormat: 'png'});
      }
    } finally {
      await browser.close({silent: true});
    }
    console.log(short.id + ': rendered focused stills ' + focusFrames.join(', '));
    continue;
  }
  await rm(shortDir, {recursive: true, force: true});
  const sampleDir = path.join(shortDir, 'samples');
  const criticalDir = path.join(shortDir, 'critical');
  const seekDir = path.join(shortDir, 'seek-parity');
  const loopDir = path.join(shortDir, 'loop');
  await Promise.all([sampleDir, criticalDir, seekDir, loopDir].map((dir) => mkdir(dir, {recursive: true})));
  const inputProps = propsFor('A_fade');
  const sameBrowserParity = [];
  let browser = await openBrowser('chrome', {chromiumOptions: {gl: 'swangle'}});
  let composition;
  let loop;
  try {
    composition = await selectComposition({serveUrl, id: short.id, browserInstance: browser, inputProps});
    if (composition.width !== width || composition.height !== height || composition.fps !== fps || composition.durationInFrames !== 1350) {
      throw new Error(short.id + ' composition metadata mismatch: ' + composition.width + 'x' + composition.height + '@' + composition.fps + ', ' + composition.durationInFrames + ' frames');
    }
    for (const frame of coverage.oneSecond) {
      await renderStill({serveUrl, composition, browserInstance: browser, inputProps, frame, output: path.join(sampleDir, frameName(frame)), imageFormat: 'png'});
    }
    for (const frame of coverage.random) {
      if (!coverage.oneSecond.includes(frame)) await renderStill({serveUrl, composition, browserInstance: browser, inputProps, frame, output: path.join(sampleDir, frameName(frame)), imageFormat: 'png'});
    }
    for (const frame of coverage.critical) {
      await renderStill({serveUrl, composition, browserInstance: browser, inputProps, frame, output: path.join(criticalDir, frameName(frame)), imageFormat: 'png'});
    }
    const videoPath = path.join(shortDir, short.id + '_A_fade-preview.mp4');
    await renderMedia({serveUrl, composition, browserInstance: browser, inputProps, frameRange: [0, 1349], scale: 1, concurrency: 1, codec: 'h264', crf: 20, pixelFormat: 'yuv420p', outputLocation: videoPath});
    if (short.chapter === 'C03') {
      const compositorDir = path.resolve('node_modules/@remotion/compositor-darwin-arm64');
      const ffmpegPath = path.join(compositorDir, 'ffmpeg');
      const playbackDir = path.join(shortDir, 'playback-check');
      await rm(playbackDir, {recursive: true, force: true});
      await mkdir(playbackDir, {recursive: true});
      for (const frame of [59, 60, 61]) {
        const output = path.join(playbackDir, frameName(frame));
        await execFileAsync(ffmpegPath, [
          '-hide_banner', '-loglevel', 'error', '-y', '-i', videoPath,
          '-ss', (frame / fps).toFixed(6), '-frames:v', '1', output,
        ], {env: {...process.env, DYLD_LIBRARY_PATH: compositorDir}});
      }
    }

    for (const frame of [...coverage.random].reverse()) {
      const output = path.join(seekDir, 'same-browser-' + frame + '.png');
      await renderStill({serveUrl, composition, browserInstance: browser, inputProps, frame, output, imageFormat: 'png'});
      sameBrowserParity.push({frame, matchesDirect: await hash(output) === await hash(path.join(sampleDir, frameName(frame)))});
    }

    const loopProps = propsFor('B_loop');
    const loopComposition = await selectComposition({serveUrl, id: short.id, browserInstance: browser, inputProps: loopProps});
    for (const frame of [0, 1348, 1349]) {
      await renderStill({serveUrl, composition: loopComposition, browserInstance: browser, inputProps: loopProps, frame, output: path.join(loopDir, frameName(frame)), imageFormat: 'png'});
    }
    loop = {
      lastMatchesFirst: await hash(path.join(loopDir, frameName(1349))) === await hash(path.join(loopDir, frameName(0))),
      penultimateMatchesFirst: await hash(path.join(loopDir, frameName(1348))) === await hash(path.join(loopDir, frameName(0))),
      seam: 'hard cut is permitted if the first and last frames match and the penultimate differs',
    };
  } finally {
    await browser.close({silent: true});
  }

  browser = await openBrowser('chrome', {chromiumOptions: {gl: 'swangle'}});
  const remountParity = [];
  try {
    composition = await selectComposition({serveUrl, id: short.id, browserInstance: browser, inputProps});
    for (const frame of coverage.random) {
      const output = path.join(seekDir, 'remount-' + frame + '.png');
      await renderStill({serveUrl, composition, browserInstance: browser, inputProps, frame, output, imageFormat: 'png'});
      remountParity.push({frame, matchesDirect: await hash(output) === await hash(path.join(sampleDir, frameName(frame)))});
    }
  } finally {
    await browser.close({silent: true});
  }
  const contactPaths = [
    ...await writeContactSheets(short, coverage.oneSecond, sampleDir, 'one-second'),
    ...await writeContactSheets(short, coverage.critical, criticalDir, 'critical'),
  ];
  manifest.shorts.push({
    composition: short.id,
    chapter: short.chapter,
    qaRefreshedAt: new Date().toISOString(),
    ...(short.chapter === 'C03' ? {
      playbackFrameSpotCheck: {
        source: 'decoded from the continuous A-fade MP4 with the bundled Remotion FFmpeg binary',
        frames: [59, 60, 61],
        decodedFrames: [59, 60, 61].map((frame) => `C03/playback-check/${frameName(frame)}`),
      },
    } : {}),
    sourceTimeline: short.source,
    sourceScriptRevision: short.script,
    durationFrames: coverage.totalFrames,
    shotMap: coverage.shots,
    oneSecondSampleFrames: coverage.oneSecond,
    finalAndCriticalFrames: coverage.critical,
    cutBoundaryFrames: coverage.boundaries,
    endingFrames: {holdStart: coverage.holdStart, fadeStart: coverage.fadeStart},
    randomFrames: coverage.random,
    continuousPreview: path.relative(root, path.join(shortDir, short.id + '_A_fade-preview.mp4')).split(path.sep).join('/'),
    contactSheets: contactPaths.map((file) => path.relative(root, file).split(path.sep).join('/')),
    sameBrowserParity,
    remountParity,
    loop,
    verification: {
      scriptApproval: 'pending',
      narration: 'absent',
      subtitleSync: 'unverified',
      factualImageReviewByBoat: 'planning review only; runtime factual-image review remains unverified',
      studioPlaybackSeek: 'unverified',
    },
  });
  console.log(short.id + ': ' + coverage.oneSecond.length + ' one-second/final stills, ' + coverage.critical.length + ' critical stills, full A-fade preview, seek and loop checks');
}

if (focusFrames) {
  console.log('Focused still recheck complete; the full QA manifest was left unchanged.');
  process.exit(0);
}

manifest.shorts.sort((left, right) => left.chapter.localeCompare(right.chapter));
await writeFile(path.join(root, 'manifest.json'), JSON.stringify(manifest, null, 2));
const qaRows = manifest.shorts.map((short) => {
  const links = (kind) => short.contactSheets.filter((sheet) => sheet.includes('-' + kind + '-'))
    .map((sheet) => '[' + path.basename(sheet) + '](./' + sheet + ')').join(' · ');
  return '| ' + short.chapter + ' | [' + short.composition + '](./' + short.continuousPreview + ') | ' + links('one-second') + ' | ' + links('critical') + ' | ' + short.qaRefreshedAt + ' |';
});
const readme = [
  '# CATBOX Shorts runtime QA',
  '',
  'This folder contains Short-only CLI evidence at 1080×1920 / 30 fps. No Long composition was rendered or reviewed.',
  '',
  'The six source scripts remain draft. No Short narration is supplied; subtitle timing is estimated and not audio-synced. Studio playback/seeking is unverified separately from these CLI renders.',
  '',
  'R5 refreshes all six chapter Shorts after the user-directed room, actor, card and scale corrections. The manifest records a per-composition `qaRefreshedAt` timestamp, exact frame coverage, source-beat map, parity results and loop seams; the separate 12-scene main Short render is tracked in the PR evidence.',
  '',
  'C03 `playback-check/` contains frames F59/F60/F61 decoded from its continuous A-fade preview for review alongside the direct still, same-browser and remount parity evidence.',
  '',
  '| Cut | 45s A-fade preview | One-second/final sheets | Critical sheets | QA refreshed (UTC) |',
  '|---|---|---|---|---|',
  ...qaRows,
  '',
  'See [manifest.json](./manifest.json) for exact frame arrays and verification states. Studio playback/seeking and runtime factual-image approval remain unverified; no Long render or QA was run.',
  '',
].join('\n');
await writeFile(path.join(root, 'README.md'), readme, 'utf8');
console.log('Wrote Short-only QA manifest: ' + path.join(root, 'manifest.json'));
process.exit(0);
