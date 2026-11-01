import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync, rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {normalizeLoudness} from '../scripts/loudness.mjs';

test('dynamic loudness normalization preserves the audio clock through the final transients', async () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'reels-loudness-clock-'));
  const file = path.join(dir, 'transients.mp4');
  try {
    // Short, loud transients above a quiet floor force the same dynamic mode as WFOG's ending.
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', 'color=c=black:s=16x16:r=30:d=4.5',
      '-f', 'lavfi', '-i', 'aevalsrc=if(lt(mod(t\\,1)\\,0.001)\\,0.9\\,0.001*sin(2*PI*220*t)):d=4.5:s=48000',
      '-c:v', 'libx264', '-c:a', 'aac', '-ar', '48000', '-shortest', file]);
    const result = await normalizeLoudness(file);
    assert.equal(result.type, 'dynamic');
    const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'a:0', '-show_packets',
      '-show_entries', 'packet=pts_time,duration_time', '-of', 'json', file], {encoding: 'utf8'}));
    const packets: {pts_time: string; duration_time: string}[] = probe.packets;
    for (const p of packets.slice(0, -1)) {
      assert.ok(Number(p.duration_time) <= 1024 / 48000 + 0.00001,
        `audio clock stretched at ${p.pts_time}s: packet duration ${p.duration_time}s`);
    }
    const pcm = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-map', '0:a:0', '-ac', '1', '-ar', '48000', '-f', 's16le', '-']);
    assert.ok(Math.abs(pcm.length / 2 / 48000 - 4.5) < 1 / 30, 'decoded audio reaches the video cut');
  } finally {
    rmSync(dir, {recursive: true, force: true});
  }
});
