// Two-pass ffmpeg loudnorm on a finished MP4: the video stream is copied, the audio is re-encoded at the
// delivery default from docs/editor-principles.md#ep08a (about -14 LUFS integrated, true peak at or below -1 dBTP).
// The limiter aims at -1.5 dBTP so AAC re-encoding overshoot stays under -1.
// When the needed gain would push peaks past the ceiling, loudnorm switches to its dynamic mode and
// narrows the loudness range a little; the returned report shows before/after so the change can be judged.
import {execFile} from 'node:child_process';
import {globSync} from 'node:fs';
import {rename, rm} from 'node:fs/promises';
import path from 'node:path';
import {promisify} from 'node:util';

const run = promisify(execFile);
const ffmpeg = globSync('node_modules/@remotion/compositor-*/ffmpeg')[0] ?? 'ffmpeg';
const env = {...process.env, DYLD_LIBRARY_PATH: path.dirname(path.resolve(ffmpeg))};
const TARGET = {I: -14, TP: -1.5, LRA: 20};

const loudnorm = async (args, filter) => {
  const {stderr} = await run(ffmpeg, ['-hide_banner', '-nostats', ...args.slice(0, 2), '-af', `loudnorm=${filter}:print_format=json`, ...args.slice(2)], {env, maxBuffer: 64 << 20});
  return JSON.parse(stderr.slice(stderr.lastIndexOf('{'), stderr.lastIndexOf('}') + 1));
};

export const measureLoudness = async (file) => {
  const m = await loudnorm(['-i', file, '-map', '0:a:0', '-f', 'null', '-'], `I=${TARGET.I}:TP=${TARGET.TP}:LRA=${TARGET.LRA}`);
  return {i: Number(m.input_i), tp: Number(m.input_tp), lra: Number(m.input_lra), thresh: Number(m.input_thresh), offset: Number(m.target_offset)};
};

export const normalizeLoudness = async (file) => {
  const before = await measureLoudness(file);
  if (!Number.isFinite(before.i)) return {before, after: before, type: 'silent'};
  const tmp = file.replace(/\.mp4$/, '.loudnorm.mp4');
  const measured = `measured_I=${before.i}:measured_TP=${before.tp}:measured_LRA=${before.lra}:measured_thresh=${before.thresh}:offset=${before.offset}`;
  try {
    const pass = await loudnorm(['-i', file, '-y', '-map', '0', '-c:v', 'copy', '-ar', '48000', '-c:a', 'aac', '-b:a', '320k', '-shortest', '-movflags', '+faststart', tmp],
      `I=${TARGET.I}:TP=${TARGET.TP}:LRA=${TARGET.LRA}:${measured}:linear=true`);
    await rename(tmp, file);
    return {before, after: await measureLoudness(file), type: pass.normalization_type};
  } finally {await rm(tmp, {force: true});}
};

export const describeLoudness = ({before, after, type}) =>
  `${after.i.toFixed(1)} LUFS, ${after.tp.toFixed(1)} dBTP, LRA ${after.lra.toFixed(1)} (was ${before.i.toFixed(1)} LUFS, ${before.tp.toFixed(1)} dBTP, LRA ${before.lra.toFixed(1)}; ${type})`;
