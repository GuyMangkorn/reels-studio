// Writes HANAKO-SHORT's `video.audio` track list and narration clock to JSON (Editor E-R5 measurement input).
// Usage: node --import tsx scripts/hanako/short/dump-audio-tracks.mts <out.json>
import * as mod from '../../../src/videos/hanako/index.ts';
import {writeFileSync} from 'node:fs';

// The episode module is CJS-wrapped under tsx; unwrap the default export until it has `videos`.
let episode: any = (mod as any).default;
while (episode && episode.default) episode = episode.default;
const video = episode.videos[0];
writeFileSync(process.argv[2], JSON.stringify({
  id: video.id,
  audio: video.audio,
  narration: {src: video.narration.src, startFrame: video.narration.startFrame, fps: video.narration.fps},
}, null, 1));
console.log(`${video.id}: ${video.audio.length} audio tracks written to ${process.argv[2]}`);
