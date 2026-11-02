// Shared audio helpers for the WDG-EP01-SHORT sound build (decode through ffmpeg, envelope, writing 32-bit float WAV).
import {spawnSync} from 'node:child_process';
import {writeFileSync} from 'node:fs';
export const SR = 48000;
/** Decode any file to mono Float32 at 48 kHz (or stereo when `ch` is 2). Optional ss/t trim in seconds. */
export const decode = (file, {ch = 1, ss, t} = {}) => {
  const args = ['-v', 'error', ...(ss !== undefined ? ['-ss', String(ss)] : []), ...(t !== undefined ? ['-t', String(t)] : []), '-i', file, '-f', 'f32le', '-ar', String(SR), '-ac', String(ch), '-'];
  const r = spawnSync('ffmpeg', args, {maxBuffer: 1 << 30});
  if (r.status !== 0) throw new Error(`ffmpeg decode failed: ${file}: ${r.stderr}`);
  const b = r.stdout; return new Float32Array(b.buffer, b.byteOffset, Math.floor(b.length / 4)).slice();
};
export const db = (x) => 20 * Math.log10(Math.max(x, 1e-9));
export const lin = (d) => 10 ** (d / 20);
/** RMS (dBFS) per window of `win` seconds. */
export const rmsCurve = (a, win = 0.1) => {
  const n = Math.round(win * SR), out = [];
  for (let i = 0; i + n <= a.length; i += n) { let s = 0; for (let j = i; j < i + n; j++) s += a[j] * a[j]; out.push(db(Math.sqrt(s / n))); }
  return out;
};
export const peak = (a) => { let p = 0; for (const v of a) p = Math.max(p, Math.abs(v)); return p; };
/** Write interleaved Float32 as a 32-bit float WAV. */
export const writeWav = (file, data, ch = 1) => {
  const bytes = data.length * 4, h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + bytes, 4); h.write('WAVEfmt ', 8); h.writeUInt32LE(16, 16); h.writeUInt16LE(3, 20); h.writeUInt16LE(ch, 22);
  h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * ch * 4, 28); h.writeUInt16LE(ch * 4, 32); h.writeUInt16LE(32, 34); h.write('data', 36); h.writeUInt32LE(bytes, 40);
  writeFileSync(file, Buffer.concat([h, Buffer.from(data.buffer, data.byteOffset, bytes)]));
};
